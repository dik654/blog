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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Dandelion++ (Bitcoin BIP 156)
// 트랜잭션 전파 시 sender anonymity 보호

// Stem Phase (익명 라우팅)
// 1) Source가 stem graph에서 next hop 선택
// 2) Next hop은 확률 p로 stem 계속 (1-p로 fluff 전환)
// 3) 평균 stem 경로 길이: 1/p hops

// Fluff Phase (일반 broadcast)
// 1) Stem 종료 노드가 gossip mode 전환
// 2) 전체 네트워크로 flooding
// 3) 일반 Bitcoin/Ethereum 전파와 동일

// Stem Graph Properties
// - 각 노드는 정확히 1 outgoing stem edge
// - 노드마다 epoch 동안 고정된 next hop
// - Epoch 종료 시 전체 graph 재구성

// Diffusion 예
// Alice → [stem] → NodeA → [stem] → NodeB → [fluff] → whole network
//
// 관찰자 시점
// - Fluff 시작 노드 = NodeB (not Alice!)
// - Actual sender (Alice) 식별 어려움
// - Stem path 길이만큼 anonymity

// Attack resistance
// - Majority of network must be honest
// - Active adversary: "stem detect attack"
//   → Dandelion++가 random stem 구조로 완화
// - Passive adversary: 단순 관찰
//   → 본질적으로 안전`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현 세부사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Dandelion++ 핵심 파라미터

const EPOCH_DURATION: Duration = 10 * 60;  // 10 minutes
const FLUFF_PROBABILITY: f64 = 0.1;         // 10% per hop
const EMBARGO_TIMER: Duration = 10 * 1000;  // 10s timeout

// Epoch 시작 시
fn start_epoch() {
    // 랜덤 stem graph 구축
    let peers = connected_peers();
    self.stem_next = select_random_peer(&peers);

    // 모든 peer가 단일 random next hop
    self.epoch_started_at = now();
}

// TX 받기
fn on_transaction(tx, from: Source) {
    if from == Self {
        // 내 TX: stem 시작
        self.stem_tx(tx);
    } else {
        // 수신 TX: stem 계속 또는 fluff 전환
        if random() < FLUFF_PROBABILITY {
            self.fluff_tx(tx);  // broadcast all
        } else {
            self.forward_to_stem_next(tx);
        }
    }
}

// Embargo timer
// Stem 중 응답 없으면 강제 fluff
fn after_embargo(tx) {
    if !tx.seen_on_network() {
        self.fluff_tx(tx);  // fallback
    }
}`}</pre>

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
