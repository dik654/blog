import RoundViz from './viz/RoundViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const roundCode = `Narwhal 라운드 기반 DAG:

Round r, Validator i:
  1. 자신의 TX 배치(batch)를 수집
  2. Header 생성:
     header = (round=r, author=i, payload_digests,
               parents=[r-1 라운드 증명서들])
  3. Header를 다른 검증자에게 전파
  4. 2f+1 서명 수집 → Certificate 형성
  5. Certificate를 DAG에 삽입

DAG 구조:
  정점(vertex) = (header, certificate)
  간선(edge) = 이전 라운드 증명서 참조
  → 인과관계 그래프 형성

라운드 진행 조건:
  이전 라운드의 2f+1 증명서 수신 → 다음 라운드 시작
  → 동기 가정 없이 진행 (비동기 안전)`;

export default function RoundStructure() {
  return (
    <section id="round-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">라운드 기반 DAG 구조</h2>
      <div className="not-prose mb-8"><RoundViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Danezis et al., EuroSys 2022 — §3" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2105.11827">
          <p className="italic">
            "Narwhal ensures that every transaction submitted to any honest validator is eventually available to all honest validators."
          </p>
        </CitationBlock>

        <CodePanel title="라운드 구조" code={roundCode}
          annotations={[
            { lines: [3, 9], color: 'sky', note: 'Header 생성 → 서명 수집' },
            { lines: [11, 14], color: 'emerald', note: 'DAG 구조: 정점 + 간선' },
            { lines: [16, 18], color: 'amber', note: '비동기 안전한 진행 조건' },
          ]} />

        {/* ── Round advancement ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Round Advancement 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Round Advance 규칙:

// 상태:
// - current_round: 현재 내가 있는 round
// - round_certs: {round → [certificates]}

// Advance 조건:
// while len(round_certs[current_round]) >= 2f+1:
//     current_round += 1
//     generate_new_header(current_round)
//     broadcast(header)

// Asynchronous (no timeout):
// - fixed round duration 없음
// - 2f+1 cert 받는 즉시 advance
// - 빠른 validator는 빨리 advance
// - 느린 validator는 뒤처짐

// Catching up:
// - 뒤처진 validator가 높은 round 보면
// - 중간 round 건너뛰고 sync
// - state sync protocol

// 예시 (n=4, f=1):
// Round 0:
//   V1, V2, V3, V4 모두 round 0 header 생성
//   2f+1 = 3 signatures 필요
//   각자 certificate 만들기
//
// Round 1 advance:
//   V1이 자신의 cert + V2 cert + V3 cert 봄
//   3 certs >= 2f+1 → advance to round 1
//   V1이 round 1 header 생성
//   parents = [V1_r0_cert, V2_r0_cert, V3_r0_cert]
//
// Round 2 advance:
//   V1이 3 round 1 certs 봄 → advance

// Byzantine 고려:
// - V4가 Byzantine (round 0 안 만듦)
// - V1, V2, V3 의 3 certs면 2f+1 만족
// - V4 제외하고 진행 가능
// - V4는 뒤늦게 catching up

// Garbage Collection:
// - committed round 이전 state 삭제
// - round 가 L 이상 차이나면 GC
// - memory bound: O(L * n certs)`}
        </pre>
        <p className="leading-7">
          Round advance: <strong>2f+1 certs 수집 즉시</strong>.<br />
          no timeout = async-safe.<br />
          fast validator는 빨리, slow는 catching up.
        </p>

        {/* ── Parent Selection ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Parent Selection 규칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Parent Selection:
// - parents: 2f+1 certificates from round (r-1)
// - 선택 주체: 새 header 생성 중인 validator
// - 전략: 가능한 많은 cert 포함

// Rules:
// 1. 반드시 2f+1 cert (minimum quorum)
// 2. 모두 round (r-1)
// 3. distinct authors (같은 validator 1개만)
// 4. certificates verified

// Strategies:
//
// Conservative:
// - 처음 받은 2f+1 cert만 선택
// - 빠른 advance
// - throughput 최적
//
// Greedy:
// - 가능한 모든 cert 포함 (up to n)
// - slow validator 포용
// - fairness 향상
//
// Balanced (실제 구현):
// - 2f+1 minimum 보장
// - 시간 여유 시 추가 cert
// - 실제 5-10 parents

// Validity:
// 정직 validator는 자신이 본 cert 중 선택
// Byzantine validator가 fake parent 참조?
// - 수신자가 cert verification 실패
// - header 자체 invalid
// - signature 수집 못 함

// 효과:
// - parent 많을수록 DAG 연결성 증가
// - causal history 풍부
// - Bullshark anchor의 votes 증가
// - commit rate 향상

// 구현 예 (Narwhal Rust):
// let parents: Vec<Certificate> = self.certificates
//     .get(self.round - 1)
//     .filter(|c| self.verified(c))
//     .take(self.max_parents)  // e.g., 10
//     .collect();

// assert!(parents.len() >= 2 * f + 1);`}
        </pre>
        <p className="leading-7">
          Parent 규칙: <strong>2f+1 certs from round (r-1)</strong>.<br />
          distinct authors, all verified.<br />
          많을수록 DAG 연결성 → commit rate 향상.
        </p>

        {/* ── DAG 특성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DAG 특성과 Invariants</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DAG Invariants:

// 1. Round monotonicity:
//    - parent round < child round (strict)
//    - cycle 불가 (DAG 속성)
//
// 2. Uniqueness:
//    - (author, round) → 1 certificate
//    - Byzantine author 2개 시도:
//      - 첫 번째만 2f+1 sig 획득 가능
//      - 두 번째는 signature 못 얻음
//
// 3. Connectivity:
//    - 모든 round r 의 vertex는 (r-1)의 2f+1 vertex 참조
//    - DAG는 causally connected
//
// 4. Reliability:
//    - certificate 존재 → 2f+1 signed
//    - 2f+1 중 f+1 정직 → data available
//    - eventually all honest see it

// Byzantine 가능한 공격:
//
// Attack 1: Equivocation
// - author가 round r에 2 headers
// - only one gets 2f+1 signatures (honest don't sign both)
// - 다른 하나는 DAG에 없음
//
// Attack 2: No propose
// - author가 round r 안 함
// - 2f+1 cert (others)만 있으면 round advance
// - 그냥 제외됨
//
// Attack 3: Invalid parents
// - fake parent references
// - cert verification 실패
// - signature 못 얻음
//
// Attack 4: Censoring
// - specific validator의 vertex 참조 안 함
// - others가 참조하면 censoring 무효화
// - 일부 validator만 censoring 가능

// 공격 저항:
// - reliable broadcast guarantees
// - quorum intersection
// - DAG causal connectivity
// - 모든 공격 ineffective`}
        </pre>
        <p className="leading-7">
          DAG invariants: <strong>round monotonic, unique, connected, reliable</strong>.<br />
          Byzantine 공격 4종 모두 구조적 방어.<br />
          reliable broadcast primitive가 기반.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "round"이 async-safe 기반인가</strong> — no timing assumption.<br />
          전통 BFT: round = time slot (synchronous).<br />
          Narwhal: round = logical counter (asynchronous).<br />
          "2f+1 certs 모이면 advance" — 네트워크 속도에 adaptive.
        </p>
      </div>
    </section>
  );
}
