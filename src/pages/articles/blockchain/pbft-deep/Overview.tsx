import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT 3단계 프로토콜 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Castro &amp; Liskov (1999) — <strong>최초의 실용적 BFT 프로토콜</strong>.<br />
          Pre-prepare → Prepare → Commit 3단계로 partial sync에서 합의 달성.<br />
          이후 모든 BFT (Tendermint, HotStuff, Jolteon)의 청사진.
        </p>

        {/* ── PBFT 등장 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT 등장 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PBFT 이전의 BFT (1980-1998):
//
// - Lamport (1982): 이론만 제시, O(n^f) 메시지
// - Pease-Shostak-Lamport (1980): Oral messages protocol
// - Dolev-Strong (1983): Synchronous 모델
// - 공통점: 동기 모델 또는 높은 복잡도
//
// 문제: 실무 배포 불가
// - 비동기/부분동기 지원 안 함
// - 메시지 복잡도 감당 못 함
// - View change 미정의
//
// PBFT의 혁신 (1999):
// 1. Partial synchronous 모델에서 동작
// 2. Asymmetric cryptography 활용
// 3. O(n²) 메시지 (기존 O(n^f) 대비)
// 4. View change 프로토콜 구체화
// 5. Checkpoint & garbage collection
// 6. BFT file system (BFS) 실제 배포
//
// 영향:
// - Ripple (2012): Ripple Consensus
// - Hyperledger Fabric (2016): PBFT orderer
// - Tendermint (2014): PBFT 영감
// - HotStuff (2018): PBFT → linear
// - Libra/Diem (2019): HotStuff 계승

// PBFT 모델:
// - n = 3f+1 nodes
// - f Byzantine 감내
// - partial synchrony (GST 후 동기)
// - authenticated (서명 사용)
// - safety: 항상 보장
// - liveness: GST 후 보장`}
        </pre>
        <p className="leading-7">
          PBFT = <strong>BFT의 Paxos</strong> — 실무 배포의 시작.<br />
          이전 BFT는 이론/동기, PBFT는 partial sync + asymmetric crypto로 실용화.<br />
          26년 후에도 모든 현대 BFT의 기반.
        </p>

        {/* ── PBFT 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT 프로토콜 개요</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PBFT 3-phase protocol:
//
// Phase 1: PRE-PREPARE
//   Primary → all replicas
//   메시지: ⟨PRE-PREPARE, v, n, d⟩_σp
//   - v: view number (어느 leader)
//   - n: sequence number (몇 번째 request)
//   - d: digest of request
//   - σp: primary's signature
//   목적: leader가 순서 제안
//
// Phase 2: PREPARE
//   All replicas ↔ all replicas (broadcast)
//   메시지: ⟨PREPARE, v, n, d, i⟩_σi
//   - i: replica index
//   정족수: 2f+1 (자신 포함)
//   → prepared(m, v, n) predicate
//   목적: 대다수가 같은 순서 동의
//
// Phase 3: COMMIT
//   All replicas ↔ all replicas (broadcast)
//   메시지: ⟨COMMIT, v, n, d, i⟩_σi
//   정족수: 2f+1 COMMITs with matching (v,n,d)
//   → committed-local predicate
//   → request 실행, Reply 전송
//   목적: view change 후에도 safety 유지

// 통신 복잡도:
// PRE-PREPARE: O(n) (1 → n-1)
// PREPARE: O(n²) (n × (n-1))
// COMMIT: O(n²) (n × (n-1))
// 총합: O(n²) per request

// 실제 처리 과정:
// client → primary: request
// primary → all: PRE-PREPARE
// all → all: PREPARE
// all → all: COMMIT
// all → client: REPLY (f+1 matching)
// client: 같은 reply f+1개 → 확정`}
        </pre>
        <p className="leading-7">
          3 phase = <strong>Primary 제안 → Quorum 동의 → Commit 확정</strong>.<br />
          왜 3 phase? Safety in view change — 다음 섹션에서 깊이.<br />
          O(n²) 메시지 복잡도 — 수백 node 한계의 근원.
        </p>

        {/* ── 핵심 인사이트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 핵심 설계 인사이트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 왜 3 phase인가 (2 phase 안 되나?):
//
// 2-phase 가정:
// 1. Primary → PRE-PREPARE
// 2. Replicas → COMMIT (quorum 후 실행)
//
// 문제: view change 시 safety 위반 가능
// - replica A: 2f+1 COMMIT 받고 execute
// - replica B: 2f COMMIT만 받음 (1개 drop)
// - view change 발생
// - new primary는 2f+1 중에서도 "아직 execute 안 한" 값 못 찾음
// - 다른 값 propose 가능
// - → 두 다른 값 execute = safety 위반!
//
// 3-phase 해결:
// - PREPARE 단계가 "commit 준비됨" 증명
// - view change 시 2f+1 PREPARE로 증거 전달
// - new primary가 이전 prepared 값 존중
// - safety 유지
//
// 핵심: "prepared" 상태가 view 간 bridge
// 2f+1 prepared = 모든 quorum에 포함됨 증거

// 왜 quorum = 2f+1인가:
// - intersection = 2(2f+1) - (3f+1) = f+1
// - f+1에는 정직 1명 이상
// - 정직 노드는 모순된 값 vote 불가
// - → 두 conflicting quorum 불가

// 왜 메시지에 (v, n, d) 모두 포함:
// - v: view 구분 (view change 후 혼동 방지)
// - n: sequence (순서 보장)
// - d: digest (메시지 내용 인증)
// - 셋 중 하나만 빠져도 공격 가능

// 왜 primary 서명 확인:
// - 일반 replica가 fake pre-prepare 불가
// - authentication 핵심
// - MAC 대신 digital signature 사용
//   (but 초기 버전은 MAC 사용 — 변형)`}
        </pre>
        <p className="leading-7">
          3 phase의 이유: <strong>view change safety</strong>.<br />
          "prepared"가 view 간 다리 — 이전 quorum 증거 보존.<br />
          2 phase로 단축하면 view change 시 safety 깨짐 (HotStuff가 3-chain으로 해결).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 PBFT가 26년 표준인가</strong> — 정확성 증명 완비.<br />
          Castro의 PhD 논문(2001)이 formal proof 제공 — safety, liveness 모두 증명.<br />
          이후 BFT는 PBFT를 최적화(HotStuff는 통신, Tendermint는 단순화)하지만 본질은 동일.
        </p>
      </div>
    </section>
  );
}
