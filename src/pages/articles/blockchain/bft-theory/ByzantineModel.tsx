import ByzantineModelViz from './viz/ByzantineModelViz';

export default function ByzantineModel() {
  return (
    <section id="byzantine-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 장애 모델</h2>
      <div className="not-prose mb-6"><ByzantineModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          장애 모델은 <strong>노드가 어떻게 실패할 수 있는가</strong>를 규정한다.<br />
          약한 모델부터 강한 모델까지 단계별로 — 각 단계는 이전 모델을 포함한다.<br />
          BFT는 가장 강한 모델인 Byzantine fault를 다룬다.
        </p>

        {/* ── Crash vs Byzantine ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Crash Fault vs Byzantine Fault</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 장애 모델 계층 (약 → 강):

// 1. Fail-Stop (가장 약함)
//    - 노드가 실패하면 '명백히' 정지
//    - 다른 노드가 실패를 감지 가능
//    - 예: 프로세스 kill, 전원 차단 + 알림
//    - 실무에서 드묾 (감지 보장 어려움)

// 2. Crash Fault (CFT)
//    - 노드가 정지하면 영원히 침묵
//    - 실패 감지 보장 안 됨 (timeout 기반 추측)
//    - 메시지 유실, 노드 다운, 네트워크 partition
//    - Paxos, Raft, Zookeeper가 다루는 모델
//    - f < n/2 필요 (majority alive)

// 3. Omission Fault
//    - 일부 메시지만 유실
//    - 보내기로 해놓고 안 보냄, 또는 선택적 수신
//    - Byzantine의 약한 부분집합

// 4. Timing Fault
//    - 메시지 전달 시간 위반
//    - 동기 시스템에서만 의미 있음
//    - 실시간 시스템 (항공)에서 중요

// 5. Byzantine Fault (가장 강함)
//    - 임의의 행동 가능
//    - 거짓 메시지 조작
//    - 서로 다른 노드에게 모순된 메시지
//    - 프로토콜 위반
//    - 합의 프로토콜 방해
//    - f < n/3 필요 (partial sync, unauthenticated)

// 관계:
// Fail-Stop ⊂ Crash ⊂ Omission ⊂ Byzantine
// Byzantine를 다루면 모든 약한 장애도 자동 처리`}
        </pre>
        <p className="leading-7">
          Crash는 <strong>정지만 (단순)</strong>, Byzantine은 <strong>임의의 거짓 (복잡)</strong>.<br />
          Crash는 majority로 충분 (f &lt; n/2), Byzantine은 2/3 이상 필요 (f &lt; n/3).<br />
          블록체인은 항상 Byzantine 가정.
        </p>

        {/* ── 네트워크 타이밍 모델 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">네트워크 타이밍 모델: 동기/비동기/부분동기</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 3가지 타이밍 모델:

// 1. Synchronous (동기)
//    - 메시지 전달 지연 상한 Δ 알려짐
//    - 노드 처리 속도 상한도 알려짐
//    - timeout = Δ + ε로 확실히 판별 가능
//    - 강한 가정: 실제 인터넷에서 보장 어려움
//    - Dolev-Strong 프로토콜: f < n, O(f) round

// 2. Asynchronous (비동기)
//    - 어떤 시간 상한도 없음
//    - 메시지가 얼마나 걸릴지 예측 불가
//    - 가장 현실적, 가장 약함
//    - FLP 불가능성 (1985):
//      deterministic consensus 불가
//    - 우회:
//      - Randomization (Ben-Or, HoneyBadger BFT)
//      - Failure detectors (불완전)

// 3. Partial Synchronous (부분 동기)
//    - DLS 1988 (Dwork-Lynch-Stockmeyer)
//    - GST(Global Stabilization Time) 존재
//    - GST 이전: asynchronous처럼 행동
//    - GST 이후: 메시지 delay < Δ 보장
//    - Safety는 언제나 보장
//    - Liveness는 GST 이후 보장
//    - PBFT, HotStuff, Tendermint의 모델

// 실제 인터넷 매핑:
// - 평소: partial sync (Δ ≈ 100-500ms)
// - DDoS/partition: asynchronous
// - LAN: near-synchronous (Δ ≈ 1-10ms)

// 왜 Partial Sync가 주류?
// - 비동기 deterministic BFT 불가 (FLP)
// - 동기는 가정이 너무 강함
// - Partial sync는 Safety 항상, Liveness 낙관적
// - GST는 네트워크 안정화 후에 존재`}
        </pre>
        <p className="leading-7">
          부분 동기 = <strong>GST 이전 비동기, 이후 동기</strong>.<br />
          Safety는 항상 보장, Liveness는 GST 이후에만.<br />
          실제 인터넷의 현실적 모델 — 평소엔 안정, 가끔 불안.
        </p>

        {/* ── 인증 유무 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Authenticated vs Unauthenticated</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 메시지 인증 유무에 따른 모델:

// Unauthenticated (서명 없음)
// - 노드가 다른 노드 흉내 가능
// - 메시지 위조·변조 감지 불가
// - Lamport 원 논문 모델
// - n >= 3f+1 필수 (증명: 다음 섹션)

// Authenticated (서명 있음)
// - 공개키 암호로 메시지 서명
// - 위조 감지 가능 (정직 노드는 구분 가능)
// - Ed25519, ECDSA, BLS 사용
// - 동기 모델: n >= f+2까지 가능 (Dolev-Strong)
// - 부분 동기: 여전히 n >= 3f+1 (다른 이유)

// 블록체인 실제:
// - 모든 메시지 서명 필수
// - validator private key 보유
// - 서명 검증이 P2P 계층의 첫 단계
// - slashing (이중서명 시 벌금)으로 Byzantine 억제

// 왜 서명 있어도 n >= 3f+1?
// - Partial sync + Byzantine에서:
// - 정족수 교차 (quorum intersection) 보장 필요
// - 두 결정 quorum이 겹쳐야 inconsistency 방지
// - |Q1| + |Q2| > n  →  2Q > n
// - Q = 2f+1 필요 (f 감내)
// - n = 3f+1에서 Q = 2f+1 성립

// 정족수 계산:
// n = 3f+1
// 정직 = n - f = 2f+1
// Q = 2f+1
// Q1 ∩ Q2 >= 2Q - n = 4f+2 - 3f-1 = f+1
//   → 최소 f+1명 겹침 (= 정직 1명 이상)
//   → 서로 다른 결정 불가능`}
        </pre>
        <p className="leading-7">
          서명은 <strong>위조 방지 + 책임 추적</strong>.<br />
          서명 없으면 n ≥ 3f+1, 서명 있어도 partial sync에선 여전히 3f+1.<br />
          이유는 <strong>quorum intersection</strong> — 두 quorum이 반드시 겹쳐야 safety 보장.
        </p>

        {/* ── 실제 배포 예 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 배포 매핑</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 실제 시스템의 장애 모델 매핑:

// Ethereum 2.0 (Beacon chain):
//   - Byzantine + Partial sync
//   - f < n/3 (11,000+ validators → 3,600+ 까지 감내)
//   - Attestation slashing으로 이중서명 억제
//   - Casper FFG: BFT finality
//   - LMD-GHOST: longest chain (fork choice)

// Cosmos (CometBFT/Tendermint):
//   - Byzantine + Partial sync
//   - f < n/3 (validators 100-200)
//   - Instant finality
//   - Stake-weighted voting

// Sui (Mysticeti):
//   - Byzantine + Partial sync + async fallback
//   - f < n/3
//   - DAG + uncertified commit
//   - 390ms e2e latency

// Bitcoin (Nakamoto):
//   - Byzantine (no fault model proof)
//   - Probabilistic (no instant finality)
//   - Honest majority assumption (51%)
//   - Not BFT in formal sense

// Hyperledger Fabric:
//   - Crash + Byzantine options
//   - Orderer: Raft (CFT) or PBFT
//   - Endorsement: Byzantine

// HotStuff (Diem/Aptos):
//   - Byzantine + Partial sync
//   - f < n/3
//   - O(n) chained voting
//   - responsive (GST 후 즉시 진행)`}
        </pre>
        <p className="leading-7">
          블록체인은 <strong>모두 Byzantine + Partial sync</strong> 모델.<br />
          Bitcoin은 probabilistic (formal BFT 아님), 나머지는 모두 f &lt; n/3 BFT.<br />
          stake-weighted 투표가 현대 PoS의 표준.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 partial sync가 "최선의 타협"인가</strong> — FLP 불가능성과 현실의 절충.<br />
          Asynchronous는 deterministic consensus 불가, synchronous는 실제 네트워크에 맞지 않음.<br />
          Partial sync는 safety 항상 보장하고 liveness는 네트워크 안정 시에만 — 현실적이면서 안전.
        </p>
      </div>
    </section>
  );
}
