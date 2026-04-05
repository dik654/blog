import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff-2 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Malkhi &amp; Nayak (2023) — <strong>HotStuff의 3단계를 2단계로 축소</strong>.<br />
          timeout-certificate(TC) 도입으로 Pre-Commit 제거.<br />
          O(n) 통신 유지 + 최적 지연 (4 message delays) 달성.
        </p>

        {/* ── HotStuff-2 등장 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff-2 등장 동기</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff의 한계:
//
// 1. 3-phase (3-chain) 필요:
//    - Prepare, Pre-commit, Commit
//    - 3 network delays for commit
//    - latency overhead
//
// 2. view change partial responsive:
//    - leader 장애 감지에 timeout 필요
//    - 이후 responsive
//
// 3. 단순 vs 최적 trade-off:
//    - 3-chain은 safety 증명 단순
//    - but 2-chain 가능성 있음?

// HotStuff-2의 통찰 (Malkhi-Nayak 2023):
// "3-chain의 세 번째 QC는 view change에서
//  prepared 상태 증명 역할인데, 이를
//  timeout-certificate (TC)로 대체 가능"

// 핵심 아이디어:
// - TC가 "이 view가 끝났다" 증명
// - TC 포함된 proposal은 safe
// - Pre-commit 단계 불필요

// 결과:
// - 2-phase (Prepare + Commit)
// - view change 시 TC 전송
// - fully responsive (normal + view change)
// - 최적 지연 달성

// 역사:
// - 2018: HotStuff 원 논문
// - 2020: HotStuff v6 (open source)
// - 2021: Jolteon (2-chain commit)
// - 2022: Ditto (async fallback)
// - 2023: HotStuff-2 (2-phase + TC)

// 영향:
// - DiemBFT → Jolteon (Aptos 2021)
// - Aptos mainnet → Jolteon
// - Facebook Diem 종료, Aptos 계승
// - Ditto, Banyan 등 변형 프로토콜`}
        </pre>
        <p className="leading-7">
          HotStuff-2 = <strong>3-phase → 2-phase with TC</strong>.<br />
          Pre-commit을 timeout-certificate로 대체.<br />
          fully responsive + O(n) + 최적 4-delay latency.
        </p>

        {/* ── 핵심 차이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff vs HotStuff-2 핵심 차이</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff (3-phase):
//
// View v:
//   Phase 1: Prepare
//     leader → all: prepare(B)
//     each → leader: vote1
//     leader: aggregates prepareQC
//
//   Phase 2: Pre-commit
//     leader → all: pre-commit(prepareQC)
//     each → leader: vote2
//     leader: aggregates precommitQC
//
//   Phase 3: Commit
//     leader → all: commit(precommitQC)
//     each → leader: vote3
//     leader: aggregates commitQC
//
// Latency: 3 round-trips + 1 (Decide) = 7 delays
// Chained: 3 delays per block

// HotStuff-2 (2-phase):
//
// View v:
//   Phase 1: Prepare
//     leader → all: prepare(B)
//     each → leader: vote1
//     leader: aggregates prepareQC
//
//   Phase 2: Commit
//     leader → all: commit(prepareQC)
//     each → leader: vote2
//     leader: aggregates commitQC
//     → B committed
//
// Latency: 2 round-trips = 4 delays
// Chained: 2 delays per block

// View change:
//
// HotStuff:
// - each → new leader: NewView(highQC)
// - leader selects max highQC
// - new proposal with highQC
//
// HotStuff-2:
// - each → new leader: NewView(prepareQC, TC_prev)
// - TC_prev: timeout-certificate of view v-1
// - leader creates new prepareQC using max TC info
// - TC가 Pre-commit 역할 대체

// 개선:
// - 1 phase 절감 → 1 round-trip 절감
// - 50% latency 감소 (per block)
// - fully responsive (no fixed timeout in normal)`}
        </pre>
        <p className="leading-7">
          차이: <strong>Pre-commit 삭제 + TC 도입</strong>.<br />
          3 phases → 2 phases, 7 delays → 4 delays.<br />
          TC가 view change safety 증거 역할.
        </p>

        {/* ── 기여 정리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff-2의 이론적 기여</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff-2의 3가지 기여:

// 1. Optimal latency:
//    - 2-phase with linear communication
//    - Pass-Shi 하한 달성 (2δ for commit)
//    - 이전까지 achieve 불가능했던 조합
//
//    Pass-Shi lower bound:
//    - responsive BFT는 minimum 2δ 필요
//    - HotStuff-2가 이 하한 달성
//
// 2. Fully responsive:
//    - normal + view change 모두 responsive
//    - fixed timeout 제거 (normal case)
//    - view change도 δ에 비례
//
// 3. Timeout-certificate:
//    - 새로운 cryptographic primitive
//    - 2f+1 timeout messages aggregated
//    - Safe view change certification
//    - 이후 Banyan, Ditto 등에 영향

// 이론적 중요성:
// - Responsive 2-phase가 가능함 증명
// - Pre-commit이 필수 아님
// - BFT 설계 공간 확장

// 실무적 중요성:
// - 50% latency 감소
// - throughput 증가 (파이프라인)
// - 단순한 프로토콜 (phase 적음)

// 한계:
// - TC 메시지 추가 대역폭
// - View change 시 복잡한 증거 검증
// - Implementation 복잡도

// 후속 연구:
// - Banyan (2024): 더 최적화된 2-phase
// - Jolteon (2021): 2-chain + async fallback
// - Starling (2023): streamlined BFT
// - Moonshot: 1-message BFT (uncommon model)

// 채택:
// - 주요 blockchain 아직 없음 (2024 기준)
// - Aptos는 Jolteon 사용
// - HotStuff-2는 학술 단계`}
        </pre>
        <p className="leading-7">
          기여: <strong>optimal latency + fully responsive + TC primitive</strong>.<br />
          Pass-Shi 하한 달성 — 이론적 최적.<br />
          아직 mainnet 채택 없지만 BFT 연구 방향 제시.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 2-phase가 오랫동안 불가능해 보였나</strong> — 3-chain safety proof.<br />
          HotStuff 저자들이 3-chain이 최적이라 생각 (2018).<br />
          Jolteon(2021)이 2-chain 가능성 제시 (weaker responsive).<br />
          HotStuff-2(2023)가 fully responsive 2-phase 달성 — 5년 걸린 breakthrough.
        </p>
      </div>
    </section>
  );
}
