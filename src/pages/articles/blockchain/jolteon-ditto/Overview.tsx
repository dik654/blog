import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff → Jolteon → DiemBFT 진화</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          HotStuff(2019) → Jolteon(2022) → Ditto(2022) → DiemBFT v4 → Aptos.<br />
          각 세대 <strong>한 가지 한계 해결</strong>.<br />
          이 계보가 현대 BFT의 mainstream.
        </p>

        {/* ── 진화 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">진화 동기: HotStuff의 한계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff 한계 (2019 원 버전):
//
// 1. 높은 정상 경로 지연:
//    - Basic HotStuff: 7 message delays to commit
//    - Chained HotStuff: 3δ per block
//    - PBFT(3δ)보다 빠르지 않음
//
// 2. Partial responsive:
//    - View change에만 timeout 필요
//    - but view change 자주 발생 시 문제
//
// 3. Async network 취약:
//    - GST 전에는 liveness 보장 못 함
//    - Bitcoin DDoS 등 실제 공격 시나리오
//
// 4. Leader 선정 단순:
//    - round-robin fixed
//    - 성능 나쁜 leader도 equal turn
//    - 시스템 throughput 저하

// 2022년 개선:
//
// Jolteon (Gelashvili et al., FC 2022):
// - 2-chain commit (HotStuff 3-chain 단축)
// - fast path 2δ (optimistic)
// - slow path fallback
// - fully responsive
//
// Ditto (Baudet-Danezis-Spiegelman, FC 2022):
// - Jolteon + async fallback
// - DAG-based fallback (Narwhal)
// - happy path: Jolteon
// - sad path: async DAG
// - 어떤 네트워크 조건에서도 liveness
//
// DiemBFT v4 (Diem team, 2021):
// - Jolteon 기반
// - Leader reputation system
// - 실제 배포된 버전
// - Aptos에서 계승

// Aptos mainnet (2022-현재):
// - DiemBFT v4 + Quorum Store
// - 100K+ TPS 목표
// - Parallel execution (Block-STM)`}
        </pre>
        <p className="leading-7">
          HotStuff 한계: <strong>latency, partial responsive, async 취약, leader 단순</strong>.<br />
          Jolteon/Ditto가 각각 해결 → DiemBFT v4 통합.<br />
          Aptos mainnet이 최종 배포 형태.
        </p>

        {/* ── 계보 정리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff 계열 프로토콜 계보</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff Family 계보:
//
// 2019: HotStuff (PODC)
//   - Yin, Malkhi, Reiter, Gueta, Abraham
//   - O(n) linear communication
//   - Threshold signature + star topology
//   - 3-chain commit
//
// 2019: LibraBFT v1 (Facebook)
//   - HotStuff 실용 구현
//   - Diem coin 백그라운드
//
// 2020: DiemBFT v2
//   - stabilization
//   - 최적화
//
// 2021: DiemBFT v3/v4
//   - Leader reputation
//   - Async-safe
//
// 2021-07: Diem 프로젝트 종료 (Facebook/Meta)
// 2021-08: Aptos Labs 창립 (Diem 개발자)
//
// 2022: Jolteon (FC 2022)
//   - 2-chain commit
//   - Fast path: 2δ
//   - Slow path: 3δ (fallback)
//   - Responsive
//
// 2022: Ditto (FC 2022)
//   - Jolteon + async fallback
//   - DAG-based recovery
//   - GST 필요 없는 liveness
//
// 2022-10: Aptos mainnet launch
//   - Move language
//   - DiemBFT v4 consensus
//   - Block-STM parallel execution
//
// 2023: HotStuff-2 (Malkhi-Nayak)
//   - 2-phase + TC
//   - fully responsive
//   - 학술 연구
//
// 2024: Mysticeti (Sui)
//   - DAG-based consensus
//   - uncertified blocks
//   - 390ms e2e latency
//
// 2024: Banyan (improved HotStuff-2)
//   - 최적화
//   - 이론적 개선

// 계보 특징:
// - 각 버전이 명확한 한 가지 개선
// - 이론 → 실무 → 이론 cycle
// - Diem 종료가 오히려 다양성 증가`}
        </pre>
        <p className="leading-7">
          HotStuff 계보: <strong>이론(2019) → 실무(Libra/Aptos) → 이론(HotStuff-2) → 실무(Sui)</strong>.<br />
          Diem 종료가 오히려 다양성 증가.<br />
          현대 L1 블록체인 합의의 주류.
        </p>

        {/* ── 선택 기준 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 선택 기준</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 언제 어떤 프로토콜 선택?

// HotStuff (원본):
// - 단순 구현 필요
// - 학술적 참조
// - 3-chain safety로 안전
// - 학습 목적

// Jolteon:
// - 낮은 latency 필요
// - 정상 path 최적화
// - partial sync 환경
// - throughput 중요

// Ditto:
// - async network 강건성
// - DDoS 저항
// - 긴 수명 시스템
// - 변동성 큰 네트워크

// DiemBFT v4:
// - production ready
// - 검증된 구현
// - leader 품질 중요
// - Aptos 스타일

// HotStuff-2:
// - 이론적 최적 추구
// - optimal latency
// - TC 기반 안전성
// - 연구/실험

// Mysticeti:
// - 초저 latency (390ms)
// - 초고 throughput
// - DAG 기반
// - Sui 스타일

// 실제 mainnet 선택:
// - Aptos: DiemBFT v4 (Jolteon 기반)
// - Sui: Mysticeti (새 방향)
// - Diem: 취소됨
// - Celo: IBFT 2.0 (PBFT 계열)
// - Near: Doomslug BFT (Tendermint 계열)

// 공통 요구사항:
// - O(n) communication
// - instant finality
// - 100-200 validators 지원
// - responsiveness (가능하면)
// - async safety (이상적)`}
        </pre>
        <p className="leading-7">
          선택 기준: <strong>latency, responsiveness, async safety, 구현 성숙도</strong>.<br />
          Aptos = DiemBFT v4, Sui = Mysticeti — 상반된 선택.<br />
          DAG-based가 최신 트렌드 (Mysticeti 이후).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 이 진화가 일어났나</strong> — Aptos의 100K TPS 목표.<br />
          Ethereum 2.0의 32 validators-per-committee로는 불가능.<br />
          BFT + parallel execution + DAG mempool 결합 필요.<br />
          DiemBFT → Jolteon → Aptos의 진화는 이 목표를 위한 여정.
        </p>
      </div>
    </section>
  );
}
