package models

import (
	"config"
	"context"
	"fmt"
	"math/big"
	"rpc_client"
	"strconv"
	"sync/atomic"
)

var GetNeptuneClient = OnceValue(func() *NeptuneClient {
	return NewNepTuneClient(config.C.NeptuneRpc)
})

type NeptuneClient struct {
	client *rpc_client.RestRpcClient
}

func NewNepTuneClient(url string) *NeptuneClient {
	return &NeptuneClient{
		client: rpc_client.NewRestRpcClient(url),
	}
}

func (n *NeptuneClient) BaseUrl() string {
	return n.client.BaseUrl
}

type RPCBlock struct {
	Height                 int64    `json:"height"`
	Digest                 string   `json:"digest"`
	PrevBlockDigest        string   `json:"prev_block_digest"`
	Nonce                  string   `json:"nonce"`
	Timestamp              int64    `json:"timestamp"`
	CumulativeProofOfWork  []uint32 `json:"cumulative_proof_of_work"`
	Difficulty             []uint32 `json:"difficulty"`
	NumInputs              int      `json:"num_inputs"`
	NumOutputs             int      `json:"num_outputs"`
	Inputs                 []string `json:"inputs"`
	Outputs                []string `json:"outputs"`
	GuesserFeeUtxoDigests  []string `json:"guesser_fee_utxo_digests"`
	NumPublicAnnouncements int      `json:"num_public_announcements"`
	CoinbaseAmount         *big.Int `json:"coinbase_amount"`
	Fee                    *big.Int `json:"fee"`
	IsGenesis              bool     `json:"is_genesis"`
	IsTip                  bool     `json:"is_tip"`
	IsCanonical            bool     `json:"is_canonical"`
	SiblingBlocks          []string `json:"sibling_blocks"`
	GuesserDigest          string   `json:"guesser_digest"`
}

func (n *NeptuneClient) GetBlockByHeight(ctx context.Context, height int64) (*RPCBlock, error) {
	return n.GetBlockByHash(ctx, strconv.FormatInt(height, 10))
}

func (n *NeptuneClient) GetBlockByHash(ctx context.Context, height_or_hash string) (*RPCBlock, error) {
	var block *RPCBlock
	err := n.client.Call(ctx, "/rpc/block_info/height_or_digest/"+height_or_hash, &block)
	if err != nil {
		if err.Error() == "status code: 404" {
			return nil, nil
		}
		return nil, err
	}
	return block, nil
}

func (n *NeptuneClient) GetCurrentBlock(ctx context.Context) (*RPCBlock, error) {
	var block *RPCBlock
	err := n.client.Call(ctx, "/rpc/block_info/tip", &block)
	if err != nil {
		if err.Error() == "status code: 404" {
			return nil, nil
		}
		return nil, err
	}
	return block, nil
}

func (n *NeptuneClient) GetUtxoDigest(ctx context.Context, index int64) (string, error) {
	var digest string
	err := n.client.Call(ctx, "/rpc/utxo_digest/"+strconv.FormatInt(index, 10), &digest)
	if err != nil {
		if err.Error() == "status code: 404" {
			return digest, nil
		}
		return digest, err
	}
	return digest, nil
}

type RpcMemPoolTransaction struct {
	Id         string   `json:"id" gorm:"primary_key"`
	ProofType  string   `json:"proof_type"`
	NumInputs  int      `json:"num_inputs"`
	InputIds   []string `json:"inputs"`
	NumOutputs int      `json:"num_outputs"`
	OutputIds  []string `json:"outputs"`
	Fee        *big.Int `json:"fee" gorm:"type:numeric"`
}

func (n *NeptuneClient) GetMempoolTransactions(ctx context.Context) ([]RpcMemPoolTransaction, error) {
	var txs []RpcMemPoolTransaction
	err := n.client.Call(ctx, "/rpc/mempool/0/1000", &txs)
	if err != nil {
		return nil, err
	}
	return txs, nil
}

type RpcMempoolEventsResponse struct {
	Total  int                    `json:"total"`
	Events []RpcMempoolEventBatch `json:"events"`
}

type RpcMempoolEventBatch struct {
	BlockHeight int64                 `json:"block_height"`
	Events      []RpcMempoolEventInfo `json:"events"`
}

type RpcMempoolEventInfo struct {
	Type   string `json:"type"`
	Txid   string `json:"txid"`
	Reason string `json:"reason"`
}

func (n *NeptuneClient) IsTransactionAbandoned(ctx context.Context, txid string, tipHeight int64) (bool, error) {
	var resp RpcMempoolEventsResponse
	err := n.client.Call(ctx, fmt.Sprintf("/rpc/mempool/events?txid=%s", txid), &resp)
	if err != nil {
		return false, err
	}

	for _, batch := range resp.Events {
		if batch.BlockHeight > tipHeight-5 {
			continue
		}
		for _, event := range batch.Events {
			if event.Type == "remove" && event.Reason == "abandoned" {
				return true, nil
			}
		}
	}

	return false, nil
}

func OnceValue[T any](f func() T) func() T {
	var (
		done uint32
		mu   uint32
		res  T
	)
	return func() T {
		if atomic.LoadUint32(&done) == 0 {
			defer atomic.StoreUint32(&done, 1)
			if atomic.CompareAndSwapUint32(&mu, 0, 1) {
				res = f()
			}
		}
		return res
	}
}
