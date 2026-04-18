import MempoolViz from './viz/MempoolViz';
import MempoolFlowViz from './viz/MempoolFlowViz';


import type { CodeRef } from '@/components/code/types';

export default function MempoolStateSync({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="mempool-statesync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멤풀 & 상태 동기화</h2>
      <div className="not-prose mb-8"><MempoolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">멤풀 트랜잭션 흐름</h3>
      </div>
      <div className="not-prose mb-8"><MempoolFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT 멤풀(Mempool) — 이더리움 txpool과 유사한 미확인 트랜잭션 대기열<br />
          ABCI <code>CheckTx</code> 콜백으로 애플리케이션 레벨 트랜잭션 검증 수행<br />
          이더리움 txpool이 nonce/balance를 직접 검증하는 것과 달리 CometBFT는 애플리케이션에 위임
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">상태 동기화 (State Sync)</h3>
        <p>
          이더리움 snap sync — 상태 트라이를 청크 단위로 다운로드하는 것과 같은 개념<br />
          CometBFT State Sync — 애플리케이션 상태 스냅샷 기반<br />
          전체 블록 리플레이 없이 최신 상태로 빠르게 동기화
        </p>
        <p>
          State Sync 흐름:<br />
          이더리움 snap sync CometBFT State Sync<br />
          1. 피벗 블록 선택 1. 신뢰할 수 있는 높이 선택<br />
          2. 헤더 체인 다운로드 2. Light Client 검증<br />
          3. 상태 트라이 청크 다운로드 3. 스냅샷 청크 다운로드<br />
          4. 상태 치유(healing) 4. ABCI OfferSnapshot/ApplySnapshotChunk<br />
          5. 나머지 블록 실행 5. 나머지 블록부터 정상 합의<br />
          핵심: 두 방식 모두 "전체 히스토리 리플레이" 없이<br />
          최신 상태에서 시작할 수 있게 해줌<br />
          State Sync 설정 요구사항:<br />
          - 신뢰할 수 있는 RPC 서버 (2개 이상 권장)<br />
          - 신뢰할 수 있는 height + block hash
        </p>
        {/* ── CList Mempool 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CList Mempool — 이중 연결 리스트 기반</h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground mb-2"><code>CListMempool</code> 구조체</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <code className="text-xs">proxyAppConn</code><span>ABCI connection (<code>AppConnMempool</code>)</span>
              <code className="text-xs">txs *clist.CList</code><span>주 mempool (concurrent-safe 이중 연결 리스트)</span>
              <code className="text-xs">cache txCache</code><span>중복 방지 cache</span>
              <code className="text-xs">txsMap map[TxKey]*CElement</code><span>fast lookup</span>
              <code className="text-xs">height int64</code><span>현재 블록 높이</span>
              <code className="text-xs">txBytes int64</code><span>총 bytes</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">동작 흐름</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong className="text-foreground">1.</strong> TX 수신 → <code>CheckTx</code> (async)</p>
                <p><strong className="text-foreground">2.</strong> pass → CList에 append</p>
                <p><strong className="text-foreground">3.</strong> Gossip → peers에 전파</p>
                <p><strong className="text-foreground">4.</strong> 블록 commit → 포함된 TX 제거</p>
                <p><strong className="text-foreground">5.</strong> Recheck (nonce 등 재검증)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">CList 성능</p>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="font-mono text-xs">O(1)</span><span>TX 추가 (append)</span>
                <span className="font-mono text-xs">O(1)</span><span>TX 제거 (linked list)</span>
                <span className="text-xs">lock-free</span><span>Iteration (concurrent read during write)</span>
                <span className="text-xs">sequence</span><span>Peer gossip catch-up</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">max size 제한 ~5000 txs</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          CList Mempool이 <strong>concurrent-safe 이중 연결 리스트</strong>.<br />
          O(1) 추가/제거 + lock-free iterator → 높은 throughput.<br />
          peer gossip은 sequence 기반 → 효율적 delta 전파.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (cometbft 레포)</h3>
        <p>
          cometbft/<br />
          abci/ # ABCI 인터페이스 정의<br />
          consensus/ # Tendermint BFT 상태 머신<br />
          mempool/ # ClistMempool, CAT Mempool<br />
          p2p/ # MConnection, PEX, 피어 관리<br />
          state/ # 블록 실행 & 상태 저장<br />
          statesync/ # 상태 스냅샷 동기화<br />
          blockchain/ # 블록 저장소 & Blockchain Reactor<br />
          evidence/ # 이중 서명 증거 관리<br />
          light/ # Light Client 검증<br />
          proxy/ # ABCI 프록시 (앱 연결)<br />
          rpc/ # JSON-RPC & WebSocket API
        </p>
      </div>
    </section>
  );
}
