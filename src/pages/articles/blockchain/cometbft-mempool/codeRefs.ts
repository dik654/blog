import type { CodeRef } from '@/components/code/types';
import clistGo from './codebase/cometbft/mempool/clist_mempool.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'clist-struct': {
    path: 'mempool/clist_mempool.go', code: clistGo, lang: 'go', highlight: [19, 41],
    desc: 'CListMempool 구조체 — 이중 연결 리스트 + txByKey map + cache',
    annotations: [
      { lines: [20, 25], color: 'sky',
        note: 'height, txsAvailable — 현재 높이와 TX 알림 채널' },
      { lines: [28, 29], color: 'emerald',
        note: 'proxyMtx + proxyAppConn — ABCI 호출 직렬화, 앱 프록시 연결' },
      { lines: [32, 33], color: 'amber',
        note: 'txs(CList) + preCheck/postCheck — 동시 접근 안전한 링크드 리스트' },
      { lines: [37, 40], color: 'violet',
        note: 'cache + txByKey — 중복 방지 캐시, 해시→원소 빠른 조회 map' },
    ],
  },
  'clist-checktx': {
    path: 'mempool/clist_mempool.go', code: clistGo, lang: 'go', highlight: [46, 83],
    desc: 'CListMempool.CheckTx() — 중복 체크 → ABCI 검증 → 콜백',
    annotations: [
      { lines: [47, 48], color: 'sky',
        note: 'proxyMtx.Lock() — 여러 고루틴의 CheckTx를 직렬화' },
      { lines: [53, 55], color: 'emerald',
        note: 'cache.Push(tx): 이미 본 TX면 ErrTxInCache 반환' },
      { lines: [58, 65], color: 'amber',
        note: 'Size >= config.Size → ErrMempoolIsFull' },
      { lines: [76, 82], color: 'violet',
        note: 'CheckTxAsync + SetCallback(reqResCb) — ABCI 비동기 검증' },
    ],
  },
  'clist-addtx': {
    path: 'mempool/clist_mempool.go', code: clistGo, lang: 'go', highlight: [87, 117],
    desc: 'reqResCb + addTx() — ABCI 응답 콜백, CList에 삽입',
    annotations: [
      { lines: [92, 96], color: 'sky',
        note: 'code == OK → addTx(), 아니면 cache.Remove() 거부' },
      { lines: [103, 110], color: 'emerald',
        note: 'mempoolTx 생성 — height, gasWanted, sender 정보' },
      { lines: [113, 116], color: 'amber',
        note: 'CList.PushBack + txByKey 등록 + txsBytes 누적 + 알림' },
    ],
  },
  'clist-update': {
    path: 'mempool/clist_mempool.go', code: clistGo, lang: 'go', highlight: [121, 151],
    desc: 'Update() — 블록 커밋 후 포함된 TX 제거 + Recheck 트리거',
    annotations: [
      { lines: [128, 136], color: 'sky',
        note: 'height 갱신, preCheck/postCheck 업데이트' },
      { lines: [139, 143], color: 'emerald',
        note: '블록 TX를 txByKey로 찾아 removeTx() O(1) 삭제' },
      { lines: [146, 148], color: 'amber',
        note: 'config.Recheck=true → recheckTxs() 호출' },
    ],
  },
  'clist-recheck': {
    path: 'mempool/clist_mempool.go', code: clistGo, lang: 'go', highlight: [156, 169],
    desc: 'recheckTxs() — Front()부터 순회하며 남은 TX 재검증',
    annotations: [
      { lines: [157, 159], color: 'sky',
        note: 'Size() == 0이면 즉시 반환 — 빈 멤풀에 불필요한 ABCI 호출 방지' },
      { lines: [160, 167], color: 'emerald',
        note: 'Front()부터 Next()로 순회, CheckTx(type=Recheck)로 전송' },
      { lines: [168, 168], color: 'amber',
        note: 'proxyAppConn.Flush() — 모든 Recheck 요청을 한 번에 전송' },
    ],
  },
};
