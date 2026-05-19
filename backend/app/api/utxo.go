package api

import (
	"context"
	"errors"
	"models"
	"timescale"

	"gorm.io/gorm"
)

// GetUtxoList implements StrictServerInterface.
func (s *Server) GetUtxoList(ctx context.Context, request GetUtxoListRequestObject) (GetUtxoListResponseObject, error) {

	var digests []UtxoDigest
	var count int64

	err := timescale.GetPostgresGormTypedDB(ctx, &models.UtxoDigest{}).
		Count(&count).
		Select("id", "digest").
		Scopes(ScopePagination(request.Params.Page, request.Params.PageSize)).
		Order("id desc").
		Find(&digests).Error

	if err != nil {
		return nil, err
	}

	return GetUtxoList200JSONResponse{
		Success: true,
		Utxos:   digests,
		Count:   count,
	}, nil
}

// GetTxList implements StrictServerInterface.
func (s *Server) GetTxList(ctx context.Context, request GetTxListRequestObject) (GetTxListResponseObject, error) {
	var txs []TransactionListItem
	var count int64

	err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).
		Count(&count).
		Scopes(ScopePagination(request.Params.Page, request.Params.PageSize)).
		Order("time desc").
		Find(&txs).Error

	if err != nil {
		return nil, err
	}

	return GetTxList200JSONResponse{
		Success: true,
		Txs:     txs,
		Count:   count,
	}, nil
}

// GetTxTxid implements StrictServerInterface.
func (s *Server) GetTxTxid(ctx context.Context, request GetTxTxidRequestObject) (GetTxTxidResponseObject, error) {
	var tx Transaction

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).
		Where("id = ?", request.Txid).
		Take(&tx).Error; err != nil {
		return nil, err
	}

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.Inputs{}).
		Where("txid = ?", request.Txid).
		Pluck("id", &tx.Inputs).Error; err != nil {
		return nil, err
	}

	if err := timescale.GetPostgresGormTypedDB(ctx, &models.Outputs{}).
		Where("txid = ?", request.Txid).
		Pluck("id", &tx.Outputs).Error; err != nil {
		return nil, err
	}

	return GetTxTxid200JSONResponse{
		Success: true,
		Tx:      tx,
	}, nil
}

// GetUtxoDigest implements StrictServerInterface.
func (s *Server) GetUtxoDigest(ctx context.Context, request GetUtxoDigestRequestObject) (GetUtxoDigestResponseObject, error) {
	// First, find the output record (this contains block info)
	var output models.Outputs
	if err := timescale.GetPostgresGormTypedDB(ctx, &models.Outputs{}).
		Where("id = ?", request.Digest).
		Take(&output).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("UTXO not found")
		}
		return nil, err
	}

	// Get the UTXO id from utxo_digest table if available
	var utxoId int64
	timescale.GetPostgresGormTypedDB(ctx, &models.UtxoDigest{}).
		Where("digest = ?", request.Digest).
		Pluck("id", &utxoId)

	var result UtxoDetail
	if utxoId != 0 {
		result.Id = &utxoId
	}
	result.Digest = &request.Digest
	result.Txid = &output.Txid

	// Check if this is a pending/mempool UTXO (no block yet)
	if output.BlockDigest == "" || output.Height == 0 {
		result.InMempool = true
		// Height and BlockHash will be nil (omitted)

		// Get time from the mempool transaction if available
		if output.Txid != "" {
			var tx models.MemPoolTransaction
			if err := timescale.GetPostgresGormTypedDB(ctx, &models.MemPoolTransaction{}).
				Where("id = ?", output.Txid).
				Take(&tx).Error; err == nil {
				result.Time = &tx.Time
				result.Abandoned = &tx.Abandoned
			}
		}
	} else {
		// Get block info for confirmed UTXO
		var block models.Block
		if err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
			Where("digest = ?", output.BlockDigest).
			Take(&block).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("Block not found")
			}
			return nil, err
		}

		result.Height = &block.Height
		result.BlockHash = &block.Digest
		result.Time = &block.Time
		result.InMempool = false
		result.IsGuesserFee = &output.IsGuesserFee
	}

	return GetUtxoDigest200JSONResponse{
		Success: true,
		Utxo:    result,
	}, nil
}
