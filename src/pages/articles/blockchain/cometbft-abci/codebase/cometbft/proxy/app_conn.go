package proxy

import (
	abcicli "github.com/cometbft/cometbft/abci/client"
	"github.com/cometbft/cometbft/abci/types"
)

// AppConns is the set of connections to the ABCI application.
// CometBFT uses 4 separate connections for different purposes.
type AppConns struct {
	consensusConn AppConnConsensus // FinalizeBlock, Commit, PrepareProposal, ProcessProposal
	mempoolConn   AppConnMempool  // CheckTx
	queryConn     AppConnQuery    // Query, Info
	snapshotConn  AppConnSnapshot // ListSnapshots, OfferSnapshot, LoadSnapshotChunk, ApplySnapshotChunk
}

// NewAppConns creates 4 ABCI connections to the application.
// clientCreator determines the transport: local, socket, or gRPC.
func NewAppConns(clientCreator ClientCreator) *AppConns {
	return &AppConns{
		consensusConn: NewAppConnConsensus(clientCreator.NewABCIClient()),
		mempoolConn:   NewAppConnMempool(clientCreator.NewABCIClient()),
		queryConn:     NewAppConnQuery(clientCreator.NewABCIClient()),
		snapshotConn:  NewAppConnSnapshot(clientCreator.NewABCIClient()),
	}
}

// Consensus returns the consensus connection for FinalizeBlock/Commit etc.
func (app *AppConns) Consensus() AppConnConsensus { return app.consensusConn }

// Mempool returns the mempool connection for CheckTx.
func (app *AppConns) Mempool() AppConnMempool { return app.mempoolConn }

// Query returns the query connection for read-only queries.
func (app *AppConns) Query() AppConnQuery { return app.queryConn }

// ClientCreator creates ABCI client connections.
// Modes: local (same process), socket (Unix/TCP), gRPC (remote).
type ClientCreator interface {
	NewABCIClient() abcicli.Client
}
