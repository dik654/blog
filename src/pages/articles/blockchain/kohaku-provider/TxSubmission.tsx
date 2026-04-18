import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import TxSubmissionViz from './viz/TxSubmissionViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function TxSubmission({ onCodeRef }: Props) {
  return (
    <section id="tx-submission" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TX 제출: Dandelion++ 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          일반 가십 프로토콜 — TX를 모든 피어에 즉시 전파한다.
          <br />
          관찰자가 "가장 먼저 TX를 전파한 노드 = 발신자"로 추론할 수 있다.
        </p>
        <p className="leading-7">
          Dandelion++ — <strong>Stem</strong>(줄기)과 <strong>Fluff</strong>(꽃)의 2단계 전파.
          <br />
          Stem: 단일 피어로 3~5홉 전달. Fluff: 전체 가십으로 전환.
        </p>
        <p className="leading-7">
          에폭 동안 Stem 피어가 고정되어 경로 안정성을 확보한다.
          <br />
          Fluff 전환 시점이 랜덤이므로 발신 노드를 특정할 수 없다.
        </p>
      </div>
      <div className="not-prose">
        <TxSubmissionViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('kh-dandelion', codeRefs['kh-dandelion'])} />
          <span className="text-[10px] text-muted-foreground">dandelion.rs</span>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Dandelion++ 프로토콜 상세</h3>
        <p className="text-sm text-muted-foreground mb-3">Bitcoin BIP 156 — 트랜잭션 전파 시 sender anonymity 보호</p>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4 border-l-4 border-blue-400">
              <p className="text-sm font-semibold mb-2">Stem Phase (익명 라우팅)</p>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1) Source가 stem graph에서 next hop 선택</li>
                <li>2) 확률 p로 stem 계속, (1-p)로 fluff 전환</li>
                <li>3) 평균 stem 경로 길이: 1/p hops</li>
              </ol>
            </div>
            <div className="bg-muted rounded-lg p-4 border-l-4 border-green-400">
              <p className="text-sm font-semibold mb-2">Fluff Phase (일반 broadcast)</p>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1) Stem 종료 노드가 gossip mode 전환</li>
                <li>2) 전체 네트워크로 flooding</li>
                <li>3) 일반 Bitcoin/Ethereum 전파와 동일</li>
              </ol>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Stem Graph Properties</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>각 노드는 정확히 1 outgoing stem edge</li>
              <li>노드마다 epoch 동안 고정된 next hop</li>
              <li>Epoch 종료 시 전체 graph 재구성</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Diffusion 예시</p>
            <p className="text-sm text-muted-foreground">
              Alice → <span className="text-blue-500">[stem]</span> → NodeA → <span className="text-blue-500">[stem]</span> → NodeB → <span className="text-green-500">[fluff]</span> → whole network
            </p>
            <p className="text-xs text-muted-foreground mt-2">관찰자 시점: Fluff 시작 노드 = NodeB (not Alice). 실제 sender 식별 어려움.</p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Attack Resistance</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Active adversary</strong>: "stem detect attack" → Dandelion++가 random stem 구조로 완화</li>
              <li><strong>Passive adversary</strong>: 단순 관찰 → 본질적으로 안전</li>
              <li>전제: 네트워크 과반수가 정직해야 함</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현 세부사항</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">핵심 파라미터</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium font-mono">EPOCH_DURATION</p>
                <p className="text-muted-foreground">10분</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium font-mono">FLUFF_PROBABILITY</p>
                <p className="text-muted-foreground">0.1 (10%/hop)</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium font-mono">EMBARGO_TIMER</p>
                <p className="text-muted-foreground">10s timeout</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>start_epoch()</code> — Epoch 시작</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><code>connected_peers()</code>에서 랜덤 stem graph 구축</li>
              <li><code>stem_next = select_random_peer(&amp;peers)</code> — 단일 random next hop 지정</li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>on_transaction(tx, from)</code> — TX 수신 처리</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>내 TX</strong> (<code>from == Self</code>): <code>stem_tx(tx)</code>로 stem 시작</li>
              <li><strong>수신 TX</strong>: <code>random() &lt; FLUFF_PROBABILITY</code>이면 <code>fluff_tx(tx)</code> (broadcast), 아니면 <code>forward_to_stem_next(tx)</code></li>
            </ul>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2"><code>after_embargo(tx)</code> — Embargo Timer</p>
            <p className="text-sm text-muted-foreground">Stem 중 응답 없으면 (<code>!tx.seen_on_network()</code>) 강제 <code>fluff_tx(tx)</code> — fallback</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Tx privacy의 실전 한계</p>
          <p>
            <strong>Dandelion++가 해결하는 것</strong>:<br />
            - P2P network level의 sender identity<br />
            - Passive observer의 inference 방어
          </p>
          <p className="mt-2">
            <strong>해결 못 하는 것</strong>:<br />
            ✗ On-chain: sender address는 TX에 포함됨<br />
            ✗ Ethereum은 account-based → address 공개<br />
            ✗ MEV builders의 mempool 분석<br />
            ✗ Infura 직접 연결 시 IP 노출
          </p>
          <p className="mt-2">
            <strong>추가 보완</strong>:<br />
            - RAILGUN 같은 zk-privacy<br />
            - Tornado Cash 스타일 mixer<br />
            - Private mempool (Flashbots Protect)<br />
            - 여러 layer 조합 필수
          </p>
        </div>

      </div>
    </section>
  );
}
