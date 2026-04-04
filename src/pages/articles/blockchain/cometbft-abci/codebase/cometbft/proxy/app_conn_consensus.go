package proxy

import (
	"context"

	abcicli "github.com/cometbft/cometbft/abci/client"
	"github.com/cometbft/cometbft/abci/types"
)

// AppConnConsensus wraps an ABCI client for the consensus connection.
// All consensus-related ABCI calls go through this thin proxy layer.
type AppConnConsensus struct {
	appConn abcicli.Client // localClient | grpcClient | socketClient
}

func NewAppConnConsensus(appConn abcicli.Client) *AppConnConsensus {
	return &AppConnConsensus{appConn: appConn}
}

// PrepareProposal delegates to the underlying ABCI client.
// Call path: BlockExecutor → AppConnConsensus → localClient → app.PrepareProposal
func (app *AppConnConsensus) PrepareProposal(
	ctx context.Context, req *types.RequestPrepareProposal,
) (*types.ResponsePrepareProposal, error) {
	return app.appConn.PrepareProposal(ctx, req)
}

// ProcessProposal delegates to the underlying ABCI client.
// Call path: BlockExecutor → AppConnConsensus → localClient → app.ProcessProposal
func (app *AppConnConsensus) ProcessProposal(
	ctx context.Context, req *types.RequestProcessProposal,
) (*types.ResponseProcessProposal, error) {
	return app.appConn.ProcessProposal(ctx, req)
}

// FinalizeBlock delegates to the underlying ABCI client.
// Call path: BlockExecutor → AppConnConsensus → localClient → app.FinalizeBlock
func (app *AppConnConsensus) FinalizeBlock(
	ctx context.Context, req *types.RequestFinalizeBlock,
) (*types.ResponseFinalizeBlock, error) {
	return app.appConn.FinalizeBlock(ctx, req)
}

// Commit delegates to the underlying ABCI client.
// Call path: BlockExecutor → AppConnConsensus → localClient → app.Commit
func (app *AppConnConsensus) Commit(
	ctx context.Context, req *types.RequestCommit,
) (*types.ResponseCommit, error) {
	return app.appConn.Commit(ctx, req)
}
