package client

import (
	"context"

	types "github.com/cometbft/cometbft/abci/types"
	cmtsync "github.com/cometbft/cometbft/libs/sync"
)

// localClient is an ABCI client that calls the application directly (same process).
// This is the fastest mode — no serialization, no network overhead.
// Cosmos SDK uses this mode by default.
type localClient struct {
	cmtsync.Mutex
	types.Application
}

// NewLocalClient creates a local (in-process) ABCI client.
func NewLocalClient(app types.Application) Client {
	return &localClient{Application: app}
}

// FinalizeBlock calls the application's FinalizeBlock directly.
// The mutex ensures that only one consensus connection accesses the app at a time.
func (app *localClient) FinalizeBlock(ctx context.Context, req *types.RequestFinalizeBlock) (*types.ResponseFinalizeBlock, error) {
	app.Lock()
	defer app.Unlock()
	return app.Application.FinalizeBlock(ctx, req)
}

// Commit calls the application's Commit directly.
// After this call, the application has persisted its state.
func (app *localClient) Commit(ctx context.Context, req *types.RequestCommit) (*types.ResponseCommit, error) {
	app.Lock()
	defer app.Unlock()
	return app.Application.Commit(ctx, req)
}

// PrepareProposal calls the application to build a proposal.
func (app *localClient) PrepareProposal(ctx context.Context, req *types.RequestPrepareProposal) (*types.ResponsePrepareProposal, error) {
	app.Lock()
	defer app.Unlock()
	return app.Application.PrepareProposal(ctx, req)
}

// ProcessProposal calls the application to validate a received proposal.
func (app *localClient) ProcessProposal(ctx context.Context, req *types.RequestProcessProposal) (*types.ResponseProcessProposal, error) {
	app.Lock()
	defer app.Unlock()
	return app.Application.ProcessProposal(ctx, req)
}
