import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";
const excerpt = `${source}에서 긴 로그·오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다.`;

export const officialCometBFTMempoolCodeRefs: Record<string, CodeRef> = {
  "checktx-gates": {
    path: "mempool/clist_mempool.go · CheckTx @ 0880b4d3",
    lang: "go",
    highlight: [1, 45],
    desc: `${excerpt} Local capacity·단건 크기·preCheck·cache 뒤 application CheckTx를 비동기로 보냅니다.`,
    code: `func (mem *CListMempool) CheckTx(
    tx types.Tx,
    cb func(*abci.ResponseCheckTx),
    txInfo TxInfo,
) error {
    mem.updateMtx.RLock()
    defer mem.updateMtx.RUnlock()

    txSize := len(tx)
    if err := mem.isFull(txSize); err != nil {
        mem.metrics.RejectedTxs.Add(1)
        return err
    }
    if txSize > mem.config.MaxTxBytes {
        return ErrTxTooLarge{Max: mem.config.MaxTxBytes, Actual: txSize}
    }
    if mem.preCheck != nil {
        if err := mem.preCheck(tx); err != nil {
            return ErrPreCheck{Err: err}
        }
    }
    if err := mem.proxyAppConn.Error(); err != nil {
        return ErrAppConnMempool{Err: err}
    }

    if !mem.cache.Push(tx) {
        mem.metrics.AlreadyReceivedTxs.Add(1)
        if memTx := mem.getMemTx(tx.Key()); memTx != nil {
            memTx.addSender(txInfo.SenderID)
        }
        return ErrTxInCache
    }

    reqRes, err := mem.proxyAppConn.CheckTxAsync(
        context.TODO(),
        &abci.RequestCheckTx{Tx: tx},
    )
    if err != nil {
        panic(err)
    }
    reqRes.SetCallback(mem.reqResCb(tx, txInfo, cb))
    return nil
}`,
    annotations: [
      { lines: [6, 16], color: "sky", note: "Update write lock과 충돌하는 read lock 아래에서 pool count·bytes와 단건 크기를 먼저 봅니다." },
      { lines: [17, 26], color: "amber", note: "PreCheck와 application connection 상태 뒤 TxKey cache를 선점합니다." },
      { lines: [27, 34], color: "violet", note: "Duplicate면 application에 다시 보내지 않고 active pool에 있을 때만 sender를 추가합니다." },
      { lines: [36, 44], color: "emerald", note: "새 transaction은 CheckTxAsync로 보내고 request별 callback이 first-time admission을 이어갑니다." },
    ],
  },
  "callback-admission": {
    path: "mempool/clist_mempool.go · resCbFirstTime/addTx @ 0880b4d3",
    lang: "go",
    highlight: [1, 49],
    desc: `${excerpt} CheckTx 응답 뒤 postCheck와 두 번째 capacity 관찰을 거쳐 CList에 넣습니다.`,
    code: `func (mem *CListMempool) resCbFirstTime(
    tx []byte,
    txInfo TxInfo,
    res *abci.Response,
) {
    switch r := res.Value.(type) {
    case *abci.Response_CheckTx:
        var postCheckErr error
        if mem.postCheck != nil {
            postCheckErr = mem.postCheck(tx, r.CheckTx)
        }
        if r.CheckTx.Code == abci.CodeTypeOK && postCheckErr == nil {
            // Check mempool isn't full again to reduce the chance of
            // exceeding the limits.
            if err := mem.isFull(len(tx)); err != nil {
                mem.cache.Remove(tx)
                mem.metrics.RejectedTxs.Add(1)
                return
            }
            if e, ok := mem.txsMap.Load(types.Tx(tx).Key()); ok {
                memTx := e.(*clist.CElement).Value.(*mempoolTx)
                memTx.addSender(txInfo.SenderID)
                return
            }
            memTx := &mempoolTx{
                height: mem.height.Load(),
                gasWanted: r.CheckTx.GasWanted,
                tx: tx,
            }
            memTx.addSender(txInfo.SenderID)
            mem.addTx(memTx)
            mem.notifyTxsAvailable()
        } else if !mem.config.KeepInvalidTxsInCache {
            mem.cache.Remove(tx)
        }
    }
}

func (mem *CListMempool) addTx(memTx *mempoolTx) {
    e := mem.txs.PushBack(memTx)
    mem.txsMap.Store(memTx.tx.Key(), e)
    mem.txsBytes.Add(int64(len(memTx.tx)))
}`,
    annotations: [
      { lines: [7, 13], color: "sky", note: "Application Code와 postCheck가 모두 통과해야 first-time admission을 계속합니다." },
      { lines: [14, 20], color: "rose", note: "두 번째 isFull은 초과 가능성을 줄이지만 뒤의 addTx와 원자적으로 묶이지 않습니다." },
      { lines: [21, 32], color: "amber", note: "같은 TxKey가 이미 active pool에 있으면 sender만 합치고 새 element를 만들지 않습니다." },
      { lines: [33, 36], color: "violet", note: "Invalid transaction을 cache에 남길지는 KeepInvalidTxsInCache가 정합니다." },
      { lines: [40, 44], color: "emerald", note: "CList, TxKey map과 raw byte counter를 각각 갱신합니다." },
    ],
  },
  "reap-signal": {
    path: "mempool/clist_mempool.go · notifyTxsAvailable/ReapMaxBytesMaxGas @ 0880b4d3",
    lang: "go",
    highlight: [1, 48],
    desc: `${excerpt} Height당 한 번 후보 존재를 알리고 local list를 encoded bytes와 GasWanted 한도까지 읽습니다.`,
    code: `func (mem *CListMempool) notifyTxsAvailable() {
    if mem.Size() == 0 {
        panic("notified txs available but mempool is empty!")
    }
    if mem.txsAvailable != nil &&
        mem.notifiedTxsAvailable.CompareAndSwap(false, true) {
        select {
        case mem.txsAvailable <- struct{}{}:
        default:
        }
    }
}

func (mem *CListMempool) ReapMaxBytesMaxGas(
    maxBytes, maxGas int64,
) types.Txs {
    mem.updateMtx.RLock()
    defer mem.updateMtx.RUnlock()

    var totalGas, runningSize int64
    txs := make([]types.Tx, 0, mem.txs.Len())
    for e := mem.txs.Front(); e != nil; e = e.Next() {
        memTx := e.Value.(*mempoolTx)
        txs = append(txs, memTx.tx)
        dataSize := types.ComputeProtoSizeForTxs(
            []types.Tx{memTx.tx},
        )
        if maxBytes > -1 && runningSize+dataSize > maxBytes {
            return txs[:len(txs)-1]
        }
        runningSize += dataSize

        newTotalGas := totalGas + memTx.gasWanted
        if maxGas > -1 && newTotalGas > maxGas {
            return txs[:len(txs)-1]
        }
        totalGas = newTotalGas
    }
    return txs
}`,
    annotations: [
      { lines: [1, 12], color: "violet", note: "Capacity-1 channel과 CAS 표식으로 height당 한 번만 후보 존재를 알립니다. Transaction 개수는 전달하지 않습니다." },
      { lines: [17, 22], color: "sky", note: "Reap도 Update와 겹치지 않는 read lock 아래 local CList 순서를 읽습니다." },
      { lines: [23, 32], color: "amber", note: "Raw transaction 길이가 아니라 block data에 들어갈 protobuf encoded size를 누적합니다." },
      { lines: [33, 41], color: "emerald", note: "GasWanted를 별도로 누적하고 어느 한도를 넘긴 마지막 transaction은 반환하지 않습니다." },
    ],
  },
  "commit-update": {
    path: "state/execution.go · Commit/asyncUpdateMempool @ 0880b4d3",
    lang: "go",
    highlight: [1, 47],
    desc: `${excerpt} Pending CheckTx를 비운 뒤 application Commit과 mempool Update가 같은 write-lock 구간에 있도록 합니다.`,
    code: `func (blockExec *BlockExecutor) Commit(
    state State,
    block *types.Block,
    abciResponse *abci.ResponseFinalizeBlock,
) (int64, error) {
    blockExec.mempool.Lock()
    unlockMempool := func() { blockExec.mempool.Unlock() }

    // While locked, ensure all async CheckTx callbacks completed.
    err := blockExec.mempool.FlushAppConn()
    if err != nil {
        unlockMempool()
        return 0, err
    }

    res, err := blockExec.proxyApp.Commit(context.TODO())
    if err != nil {
        unlockMempool()
        return 0, err
    }

    go blockExec.asyncUpdateMempool(
        unlockMempool, block, state.Copy(), abciResponse,
    )
    return res.RetainHeight, nil
}

func (blockExec *BlockExecutor) asyncUpdateMempool(
    unlockMempool func(),
    block *types.Block,
    state State,
    abciResponse *abci.ResponseFinalizeBlock,
) {
    defer unlockMempool()
    err := blockExec.mempool.Update(
        block.Height,
        block.Txs,
        abciResponse.TxResults,
        TxPreCheck(state),
        TxPostCheck(state),
    )
    if err != nil {
        panic(fmt.Sprintf("mempool.Update: %v", err))
    }
}`,
    annotations: [
      { lines: [6, 14], color: "sky", note: "Mempool write lock을 잡고 pending CheckTx callback까지 flush해 old-state admission을 끝냅니다." },
      { lines: [16, 24], color: "emerald", note: "Application Commit 뒤 Update goroutine을 시작하지만 unlock 함수도 함께 넘깁니다." },
      { lines: [33, 41], color: "amber", note: "Update는 committed tx·TxResults와 새 state의 pre/postCheck를 같은 세대에 적용합니다." },
      { lines: [42, 45], color: "rose", note: "Legacy 구현은 Update error를 panic으로 올립니다. 자동 복구 보장은 이 함수 밖입니다." },
    ],
  },
  "update-recheck": {
    path: "mempool/clist_mempool.go · Update/recheckTxs @ 0880b4d3",
    lang: "go",
    highlight: [1, 70],
    desc: `${excerpt} Committed membership을 제거하고 남은 snapshot을 새 application state에서 다시 검사합니다.`,
    code: `func (mem *CListMempool) Update(
    height int64,
    txs types.Txs,
    txResults []*abci.ExecTxResult,
    preCheck PreCheckFunc,
    postCheck PostCheckFunc,
) error {
    mem.height.Store(height)
    mem.notifiedTxsAvailable.Store(false)
    if preCheck != nil { mem.preCheck = preCheck }
    if postCheck != nil { mem.postCheck = postCheck }

    for i, tx := range txs {
        if txResults[i].Code == abci.CodeTypeOK {
            _ = mem.cache.Push(tx)
        } else if !mem.config.KeepInvalidTxsInCache {
            mem.cache.Remove(tx)
        }
        _ = mem.RemoveTxByKey(tx.Key())
    }

    if mem.config.Recheck {
        mem.recheckTxs()
    }
    if mem.Size() > 0 {
        mem.notifyTxsAvailable()
    }
    return nil
}

func (mem *CListMempool) recheckTxs() {
    if mem.Size() <= 0 { return }
    mem.recheck.init(mem.txs.Front(), mem.txs.Back())

    for e := mem.txs.Front(); e != nil; e = e.Next() {
        tx := e.Value.(*mempoolTx).tx
        mem.recheck.numPendingTxs.Add(1)
        _, err := mem.proxyAppConn.CheckTxAsync(
            context.TODO(),
            &abci.RequestCheckTx{
                Tx: tx,
                Type: abci.CheckTxType_Recheck,
            },
        )
        if err != nil { panic(err) }
    }
    mem.proxyAppConn.Flush(context.TODO())

    select {
    case <-time.After(mem.config.RecheckTimeout):
        mem.recheck.setDone()
    case <-mem.recheck.doneRechecking():
    }
}`,
    annotations: [
      { lines: [8, 19], color: "sky", note: "Height와 filter를 바꾸고 block에 들어간 tx를 결과에 따라 cache 처리한 뒤 active pool에서는 항상 제거합니다." },
      { lines: [21, 27], color: "emerald", note: "남은 transaction이 있으면 optional recheck를 끝낸 뒤 새 height의 availability를 다시 알립니다." },
      { lines: [31, 45], color: "amber", note: "Recheck 시작과 끝 element를 snapshot으로 잡고 각 transaction을 Recheck type으로 보냅니다." },
      { lines: [47, 53], color: "rose", note: "Timeout이면 대기를 끝내지만 모든 transaction의 새-state validity가 확인됐다는 뜻은 아닙니다." },
    ],
  },
};
