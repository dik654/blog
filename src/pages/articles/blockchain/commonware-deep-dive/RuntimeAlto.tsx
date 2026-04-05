import RuntimeAltoViz from './viz/RuntimeAltoViz';

export default function RuntimeAlto() {
  return (
    <section id="runtime-alto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">결정론적 시뮬레이션 & 채택 현황</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>결정론적 시뮬레이션</strong> — Commonware 품질 보증의 핵심
          <br />
          동일 시드 → 동일 실행 순서 (네트워크 파티션, 비잔틴 장애, 링크 손실 포함)
          <br />
          디버거에서 단계별 실행 · 완전 재현 · 모든 커밋에서 자동 실행 · 90%+ 커버리지
        </p>
        <p className="leading-7">
          <strong>채택 현황</strong>:
          Tempo — simplex + broadcast + storage 사용, 테스트넷 운영 중
          <br />
          Bridge 예제 — threshold_simplex + p2p + bls12381 조합 데모
          <br />
          <strong>향후 로드맵</strong>:
          QMDB 통합 · 추가 프리미티브 · MCP 서버(LLM 개발자 경험)
        </p>
      </div>
      <div className="not-prose mb-8"><RuntimeAltoViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Deterministic Simulation 방법론</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Simulation 기반 테스트 전략

// 일반 테스트 문제
// - Real concurrency: 비결정적
// - Random network delays
// - OS scheduling 영향
// - 버그 재현 불가

// Deterministic Simulation 해결
// 1) Virtual time (SimClock)
// 2) Virtual network (message passing)
// 3) Virtual storage (in-memory)
// 4) Controlled concurrency

// 시뮬레이션 예시 (Rust)
#[test]
fn test_consensus_under_byzantine() {
    for seed in 0..1000 {
        let mut sim = Simulator::new(seed);

        // Setup 4 validators, 1 byzantine
        for i in 0..4 {
            sim.spawn_validator(i);
        }
        sim.mark_byzantine(3);  // node 3 misbehaves

        // Inject byzantine behaviors
        sim.network().delay_messages_from(3, jitter);
        sim.network().drop_messages_from(3, probability: 0.3);

        // Run for virtual 5 minutes
        sim.run_until(Duration::from_secs(300));

        // Verify safety
        let committed = sim.get_committed_blocks();
        assert_no_conflicts(committed);
    }
}

// 이점
// ✓ 1000 seeds × 5분 = 5000분 virtual time
// ✓ 실제로는 ~10분 real time
// ✓ 500x speedup
// ✓ 100% 재현 가능 (seed로)

// Coverage metrics
// - Line coverage (standard)
// - Branch coverage
// - Network state coverage
// - Byzantine behavior coverage`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Commonware 채택 현황 (2024)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Tempo (Commonware의 flagship chain)
// - Simplex consensus
// - Ordered broadcast for DA
// - QMDB for state
// - Testnet live (2024)

// Alto (Commonware consensus variant)
// - HotStuff-inspired
// - Deterministic simulation tested
// - Used as reference implementation

// Bridge example
// - BLS12-381 threshold signatures
// - Cross-chain state verification
// - p2p authenticated for communication
// - Demo deployment

// Ecosystem adoption
// - Avalanche HyperSDK (predecessor)
// - Custom L1 projects
// - Research papers referencing
// - Academic collaborations

// Roadmap (2024-2025)
// - QMDB production integration
// - More consensus variants (HotStuff-2, Mysticeti)
// - MCP server for LLM development
// - Additional primitives (DA, execution)

// Open source
// - github.com/commonwarexyz/monorepo
// - Active development
// - Rust-first`}</pre>

      </div>
    </section>
  );
}
