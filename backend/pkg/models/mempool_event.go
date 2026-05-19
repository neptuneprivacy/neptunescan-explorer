package models

import (
	"context"
	"fetch"
	"logger"
	"time"
	"timescale"
)

type MempoolEventTracer struct{}

// Name implements fetch.LiveDataSource.
func (m *MempoolEventTracer) Name() string {
	return "mempool_event_tracer"
}

// WaitNextRound implements fetch.LiveDataSource.
func (m *MempoolEventTracer) WaitNextRound() {
	time.Sleep(time.Second)
}

// Execute implements fetch.LiveDataSource.
func (m *MempoolEventTracer) Execute(ctx context.Context) error {
	tip, err := GetNeptuneClient().GetCurrentBlock(ctx)
	if err != nil {
		return err
	}
	if tip == nil {
		return nil
	}

	var pending []MemPoolTransaction
	err = timescale.GetPostgresGormTypedDB(ctx, &MemPoolTransaction{}).
		Where("height = 0 AND abandoned = false AND num_inputs > 0 AND proof_type = 'ProofCollection'").
		Scan(&pending).Error
	if err != nil {
		return err
	}

	for _, tx := range pending {
		abandoned, err := GetNeptuneClient().IsTransactionAbandoned(ctx, tx.Id, tip.Height)
		if err != nil {
			logger.Warn("failed to check tx abandoned", "txid", tx.Id, "err", err)
			continue
		}

		if !abandoned {
			continue
		}

		err = timescale.GetPostgresGormTypedDB(ctx, &MemPoolTransaction{}).
			Where("id = ? AND height = 0", tx.Id).
			Update("abandoned", true).Error
		if err != nil {
			logger.Warn("failed to mark tx abandoned", "txid", tx.Id, "err", err)
		}
	}

	return nil
}

var _ fetch.LiveDataSource = &MempoolEventTracer{}
