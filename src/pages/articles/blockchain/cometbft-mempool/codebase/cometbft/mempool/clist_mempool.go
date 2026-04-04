package mempool

import (
	"crypto/sha256"
	"fmt"
	"sync"
	"sync/atomic"

	abci "github.com/cometbft/cometbft/abci/types"
	"github.com/cometbft/cometbft/libs/clist"
	"github.com/cometbft/cometbft/proxy"
	"github.com/cometbft/cometbft/types"
)

// CListMempool is an ordered in-memory pool for transactions before they are
// proposed in a consensus round. Transaction validity is checked using the
// CheckTx ABCI message before the transaction is added to the pool.
// The mempool uses a concurrent linked-list structure for O(1) inserts/deletes.
type CListMempool struct {
	height   atomic.Int64
	txsBytes int64

	// notify listeners (Reactor) when txs are available
	notifiedTxsAvailable atomic.Bool
	txsAvailable         chan struct{} // fires once for each height when txs are available

	config   *cfg.MempoolConfig
	proxyMtx sync.Mutex
	proxyAppConn proxy.AppConnMempool

	// Concurrent linked-list: O(1) insert/delete, safe for concurrent reads
	txs        *clist.CList
	preCheck   PreCheckFunc
	postCheck  PostCheckFunc

	// Track txs we've already seen (prevent duplicates)
	cache TxCache

	// map for quick access to txs by hash
	txByKey map[TxKey]*clist.CElement
}

// CheckTx executes a new transaction against the application (ABCI CheckTx).
// Blocks until the ABCI response is received.
// If the tx passes, it's added to the mempool; otherwise, rejected.
func (mem *CListMempool) CheckTx(tx types.Tx, cb func(*abci.ResponseCheckTx), txInfo TxInfo) error {
	mem.proxyMtx.Lock()
	defer mem.proxyMtx.Unlock()

	txSize := len(tx)

	// Check cache for duplicate
	if !mem.cache.Push(tx) {
		return ErrTxInCache
	}

	// Check mempool capacity
	if mem.Size() >= mem.config.Size {
		return ErrMempoolIsFull{
			NumTxs:      mem.Size(),
			MaxTxs:      mem.config.Size,
			TxsBytes:    mem.SizeBytes(),
			MaxTxsBytes: mem.config.MaxTxsBytes,
		}
	}

	// Pre-check (optional lightweight validation)
	if mem.preCheck != nil {
		if err := mem.preCheck(tx); err != nil {
			mem.cache.Remove(tx)
			return ErrPreCheck{Reason: err}
		}
	}

	// Send to ABCI app via proxyAppConn
	reqRes, err := mem.proxyAppConn.CheckTxAsync(abci.RequestCheckTx{Tx: tx})
	if err != nil {
		mem.cache.Remove(tx)
		return err
	}
	reqRes.SetCallback(mem.reqResCb(tx, txInfo, cb))
	return nil
}

// reqResCb is the callback after ABCI CheckTx returns.
// If code == 0 (ok), tx is added to the linked list.
func (mem *CListMempool) reqResCb(
	tx types.Tx, txInfo TxInfo, externalCb func(*abci.ResponseCheckTx),
) func(res *abci.Response) {
	return func(res *abci.Response) {
		checkTxRes := res.GetCheckTx()
		if checkTxRes.Code == abci.CodeTypeOK {
			mem.addTx(tx, checkTxRes, txInfo)
		} else {
			mem.cache.Remove(tx)
		}
		if externalCb != nil {
			externalCb(checkTxRes)
		}
	}
}

func (mem *CListMempool) addTx(tx types.Tx, res *abci.ResponseCheckTx, txInfo TxInfo) {
	memTx := &mempoolTx{
		height:    mem.height.Load(),
		gasWanted: res.GasWanted,
		tx:        tx,
		senders:   sync.Map{},
	}
	memTx.senders.Store(txInfo.SenderID, true)

	// Insert into concurrent linked list — O(1)
	e := mem.txs.PushBack(memTx)
	mem.txByKey[tx.Key()] = e
	atomic.AddInt64(&mem.txsBytes, int64(len(tx)))
	mem.notifyTxsAvailable()
}

// Update is called after a block is committed.
// It removes committed txs and optionally rechecks remaining ones.
func (mem *CListMempool) Update(
	height int64,
	txs types.Txs,
	txResults []*abci.ExecTxResult,
	preCheck PreCheckFunc,
	postCheck PostCheckFunc,
) error {
	mem.height.Store(height)
	mem.notifiedTxsAvailable.Store(false)

	if preCheck != nil {
		mem.preCheck = preCheck
	}
	if postCheck != nil {
		mem.postCheck = postCheck
	}

	// Remove committed txs from the mempool
	for i, tx := range txs {
		if e, ok := mem.txByKey[tx.Key()]; ok {
			mem.removeTx(tx, e)
		}
	}

	// Recheck remaining txs if configured
	if mem.config.Recheck {
		mem.recheckTxs()
	}

	return nil
}

// recheckTxs re-validates all remaining txs against the latest state.
// After a block commits, the app state may have changed,
// so previously valid txs might now be invalid.
func (mem *CListMempool) recheckTxs() {
	if mem.Size() == 0 {
		return
	}
	mem.proxyAppConn.SetResponseCallback(mem.resCbRecheck)
	for e := mem.txs.Front(); e != nil; e = e.Next() {
		memTx := e.Value.(*mempoolTx)
		mem.proxyAppConn.CheckTxAsync(abci.RequestCheckTx{
			Tx:   memTx.tx,
			Type: abci.CheckTxType_Recheck,
		})
	}
	mem.proxyAppConn.Flush()
}
