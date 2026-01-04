package api

import (
	"context"
	"fmt"
	"models"
	"models/types"
	"time"
	"timescale"
)

// GetMinerBlocksDigest implements StrictServerInterface.
func (s *Server) GetMinerBlocksDigest(ctx context.Context, request GetMinerBlocksDigestRequestObject) (GetMinerBlocksDigestResponseObject, error) {
	blocks, count, err := s.getMinerBlocks(ctx, request.Digest, request.Params.Page, request.Params.PageSize)
	if err != nil {
		return nil, fmt.Errorf("get miner blocks: %w", err)
	}

	var res = make([]Blockitem, len(blocks))

	for i, block := range blocks {
		res[i] = Blockitem{
			Block:          block.Height,
			BlockHash:      block.Digest,
			CoinbaseReward: block.CoinbaseAmount.String(),
			Fee:            block.Fee.String(),
			Inputs:         block.NumInputs,
			Outputs:        block.NumOutputs,
			ProofTarget:    block.Difficulty.String(),
			Time:           block.Time,
		}
	}

	return GetMinerBlocksDigest200JSONResponse{
		Success: true,
		Total:   count,
		Data:    res,
	}, nil
}

// GetMinerLeaderboard implements StrictServerInterface.
func (s *Server) GetMinerLeaderboard(ctx context.Context, request GetMinerLeaderboardRequestObject) (GetMinerLeaderboardResponseObject, error) {
	interval := 24 * time.Hour
	switch request.Params.Duration {
	case N24h:
		interval = 24 * time.Hour
	case N4h:
		interval = 4 * time.Hour
	}

	var res []MinerLeaderBoardItem

	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Select("guesser_digest as digest", "SUM(difficulty) as total_work", "COUNT(*) as block_count").
		Where("time >= ?", time.Now().Add(-interval)).
		Group("guesser_digest").
		Order("total_work DESC").
		Scopes(ScopePagination(request.Params.Page, request.Params.PageSize)).
		Scan(&res).
		Error

	return GetMinerLeaderboard200JSONResponse{
		Success: true,
		Data:    res,
	}, err
}

// GetMinerStatDigest implements StrictServerInterface.
func (s *Server) GetMinerStatDigest(ctx context.Context, request GetMinerStatDigestRequestObject) (GetMinerStatDigestResponseObject, error) {
	work_24h, count_24h, err := s.GetMinerWork(ctx, request.Digest, 24*time.Hour)
	if err != nil {
		return nil, err
	}
	work_4h, count_4h, err := s.GetMinerWork(ctx, request.Digest, 4*time.Hour)
	if err != nil {
		return nil, err
	}

	return GetMinerStatDigest200JSONResponse{
		Success:  true,
		Count24h: count_24h,
		Count4h:  count_4h,
		Work24h:  work_24h,
		Work4h:   work_4h,
	}, nil
}

func (s *Server) GetMinerWork(ctx context.Context, digest string, interval time.Duration) (string, int64, error) {

	var res struct {
		TotalDifficulty types.Big `json:"total_difficulty"`
		BlockCount      int64     `json:"block_count"`
	}

	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Select("SUM(difficulty) as total_difficulty", "COUNT(1) as block_count").
		Where("time >=? AND guesser_digest = ?", time.Now().Add(-interval), digest).
		Scan(&res).
		Error

	return res.TotalDifficulty.String(), res.BlockCount, err
}

func (s *Server) getMinerBlocks(ctx context.Context, digest string, page, pageSize int) ([]models.Block, int64, error) {

	var res []models.Block
	var count int64

	err := timescale.GetPostgresGormTypedDB(ctx, &models.Block{}).
		Where("guesser_digest = ?", digest).
		Count(&count).
		Scopes(ScopePagination(page, pageSize)).
		Order("time DESC").
		Scan(&res).
		Error

	return res, count, err
}
