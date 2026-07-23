package models

import (
	"context"
	"database/sql"
	"encoding/json"
	"fetch"
	"fmt"
	"logger"
	"models/types"
	"redis"
	"slices"
	"time"
	"timescale"

	"github.com/lib/pq"
	"gorm.io/gorm/clause"
)

type MemPoolTransaction struct {
	Id         string         `json:"id" gorm:"primary_key"`
	ProofType  string         `json:"proof_type"`
	NumInputs  int            `json:"num_inputs"`
	InputIds   pq.StringArray `json:"input_ids" gorm:"-"`
	NumOutputs int            `json:"num_outputs"`
	OutputIds  pq.StringArray `json:"output_ids" gorm:"-"`
	Fee        types.Big      `json:"fee" gorm:"type:numeric"`
	Time       time.Time      `json:"time"`
	Height     int64          `json:"height"`
	Abandoned  bool           `json:"abandoned"`
}

// TableName implements timescale.Table.
func (m MemPoolTransaction) TableName() string {
	return "transaction"
}

var _ timescale.Table = MemPoolTransaction{}

type MemPool struct {
	txs []MemPoolTransaction
}

// Name implements fetch.LiveDataSource.
func (m *MemPool) Name() string {
	return "mempool"
}

// WaitNextRound implements fetch.LiveDataSource.
func (m *MemPool) WaitNextRound() {
	time.Sleep(time.Second)
}

func (m *MemPool) fetchAndCompareTxs(ctx context.Context) (adds, updates, deletes []MemPoolTransaction, err error) {
	rpctxs, err := GetNeptuneClient().GetMempoolTransactions(ctx)
	if err != nil {
		return nil, nil, nil, err
	}

	var txs = make([]MemPoolTransaction, len(rpctxs))
	for i := range rpctxs {
		txs[i] = MemPoolTransaction{
			Id:         rpctxs[i].Id,
			ProofType:  rpctxs[i].ProofType,
			NumInputs:  rpctxs[i].NumInputs,
			InputIds:   rpctxs[i].InputIds,
			NumOutputs: rpctxs[i].NumOutputs,
			OutputIds:  rpctxs[i].OutputIds,
			Fee:        types.NewBigInt(rpctxs[i].Fee.Rsh(rpctxs[i].Fee, 2)),
			Time:       time.Now(),
		}
	}

	if len(m.txs) == 0 {
		m.txs = txs
		return txs, nil, nil, nil
	}

	for i, newTx := range txs {
		idx := slices.IndexFunc(m.txs, func(tx MemPoolTransaction) bool {
			return tx.Id == newTx.Id
		})
		if idx == -1 {
			newTx.Time = time.Now()
			txs[i].Time = newTx.Time
			adds = append(adds, newTx)
		} else if m.txs[idx].ProofType != newTx.ProofType {
			// same txid but proof was upgraded (e.g. ProofCollection -> SingleProof)
			updates = append(updates, newTx)
		}
	}

	for _, oldTx := range m.txs {
		found := slices.ContainsFunc(txs, func(tx MemPoolTransaction) bool {
			return tx.Id == oldTx.Id
		})
		if !found {
			deletes = append(deletes, oldTx)
		}
	}

	m.txs = txs

	return
}

// Execute implements fetch.LiveDataSource.
func (m *MemPool) Execute(ctx context.Context) error {

	adds, updates, deletes, err := m.fetchAndCompareTxs(ctx)
	if err != nil {
		return err
	}

	for _, tx := range updates {
		if err := timescale.GetPostgresGormTypedDB(ctx, &MemPoolTransaction{}).
			Where("id = ?", tx.Id).Update("proof_type", tx.ProofType).Error; err != nil {
			return err
		}
	}

	if len(adds) != 0 {
		if err := timescale.GetPostgresGormTypedDB(ctx, &MemPoolTransaction{}).
			Clauses(clause.OnConflict{UpdateAll: true}).Create(adds).Error; err != nil {
			return err
		}
		for _, tx := range adds {
			for _, input := range tx.InputIds {
				input := Inputs{
					Id:   input,
					Txid: tx.Id,
				}

				if err := timescale.GetPostgresGormTypedDB(ctx, &Inputs{}).Clauses(clause.OnConflict{
					Columns: []clause.Column{{Name: "id"}},
					DoUpdates: clause.Assignments(map[string]any{
						"txid": tx.Id,
					}),
				}).Create(&input).Error; err != nil {
					return err
				}
			}

			for _, output := range tx.OutputIds {
				output := Outputs{
					Id:   output,
					Txid: tx.Id,
				}

				if err := timescale.GetPostgresGormTypedDB(ctx, &Outputs{}).Clauses(clause.OnConflict{
					Columns: []clause.Column{{Name: "id"}},
					DoUpdates: clause.Assignments(map[string]any{
						"txid": tx.Id,
					}),
				}).Create(&output).Error; err != nil {
					return err
				}
			}
		}
	}

	if len(adds)+len(updates)+len(deletes) != 0 {
		err = m.publishMempoolEvents(ctx, adds, updates, deletes)
		if err != nil {
			return err
		}
	}

	if err := m.updateHeight(ctx); err != nil {
		return fmt.Errorf("failed to update height : %w", err)
	}

	return nil
}

func (m *MemPool) updateHeight(ctx context.Context) error {
	var txs []MemPoolTransaction

	err := timescale.GetPostgresGormTypedDB(ctx, &MemPoolTransaction{}).Where("height = 0").Scan(&txs).Error
	if err != nil {
		return err
	}

	for _, tx := range txs {

		var height int64

		{ //find by input
			if err := timescale.GetPostgresGormTypedDB(ctx, &Inputs{}).Where("txid = ? and height != 0", tx.Id).Limit(1).Pluck("height", &height).Error; err != nil {
				logger.Warn("failed to find tx height by input", "err", err)
				continue
			}
		}

		if height == 0 { // if not found, find by output
			if err := timescale.GetPostgresGormTypedDB(ctx, &Outputs{}).Where("txid = ? and height != 0", tx.Id).Limit(1).Pluck("height", &height).Error; err != nil {
				logger.Warn("failed to find tx height by output", "err", err)
				continue
			}
		}

		if height == 0 {
			m.tryDeleteUnsucessfulTx(ctx, tx)
			continue
		}

		err = timescale.GetPostgresGormTypedDB(ctx, &MemPoolTransaction{}).Where("id = ?", tx.Id).Update("height", height).Error
		if err != nil {
			return err
		}
	}

	return nil
}

func (m *MemPool) tryDeleteUnsucessfulTx(ctx context.Context, del MemPoolTransaction) {
	if slices.ContainsFunc(m.txs, func(tx MemPoolTransaction) bool {
		return tx.Id == del.Id
	}) {
		return
	}

	var latest Block
	if err := timescale.GetPostgresGormTypedDB(ctx, &Block{}).Order("height desc").Limit(1).Scan(&latest).Error; err != nil {
		return
	}

	if time.Since(latest.Time) > time.Minute*30 {
		return
	}

	//if tx has been exists for more than 1 day, delete it with its unconfirmed inputs/outputs
	if time.Since(del.Time) > time.Hour*24 {
		tx := timescale.NewTx(sql.LevelDefault)

		if err := tx.GetTxTypedDB(ctx, &MemPoolTransaction{}).
			Where("id = ?", del.Id).Delete(&MemPoolTransaction{}).Error; err != nil {
			logger.Warn("failed to delete unsuccessful tx", "txid", del.Id, "err", err)
			tx.Tx().Rollback()
			return
		}
		if err := tx.GetTxTypedDB(ctx, &Inputs{}).
			Where("txid = ? AND height = 0", del.Id).Delete(&Inputs{}).Error; err != nil {
			logger.Warn("failed to delete inputs of unsuccessful tx", "txid", del.Id, "err", err)
			tx.Tx().Rollback()
			return
		}
		if err := tx.GetTxTypedDB(ctx, &Outputs{}).
			Where("txid = ? AND height = 0", del.Id).Delete(&Outputs{}).Error; err != nil {
			logger.Warn("failed to delete outputs of unsuccessful tx", "txid", del.Id, "err", err)
			tx.Tx().Rollback()
			return
		}

		if err := tx.Tx().Commit().Error; err != nil {
			logger.Warn("failed to commit delete of unsuccessful tx", "txid", del.Id, "err", err)
		}
	}
}

func (m *MemPool) publishMempoolEvents(ctx context.Context, adds, updates, deletes []MemPoolTransaction) error {

	var deleteIds []string
	for _, tx := range deletes {
		deleteIds = append(deleteIds, tx.Id)
	}

	data, _ := json.Marshal(map[string]any{
		"adds":    adds,
		"updates": updates,
		"deletes": deleteIds,
	})

	return redis.GetRedisClient().LPush(ctx, RedisMempoolQueue, data).Err()
}

const RedisMempoolQueue = "mempoolev"

var _ fetch.LiveDataSource = &MemPool{}
