import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 서버 부품이 다른가</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 vs 데스크톱 부품 <strong>근본적 차이</strong>.<br />
          CPU, 메인보드, 안정성 기능 비교.<br />
          Filecoin mining, 24/7 infra에서 서버 부품 필수 이유.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">서버와 데스크톱의 설계 철학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 설계 철학 차이:

// Desktop (consumer):
// - 1-user, interactive
// - 8-16h/day operation
// - single failure = inconvenience
// - performance per dollar 우선
// - quiet, compact, stylish

// Server (professional):
// - N-user, batch/service
// - 24/7 operation
// - single failure = revenue loss
// - reliability + scalability 우선
// - noisy, modular, industrial

// 결과적 차이:
//
// Build Quality:
// Desktop: consumer-grade, 3-year warranty
// Server: enterprise-grade, 5-7 year warranty
//
// Components:
// Desktop: optimized for gaming/productivity
// Server: optimized for throughput + reliability
//
// Redundancy:
// Desktop: single path (minimal redundancy)
// Server: dual PSU, ECC, hot-swap, etc.
//
// Management:
// Desktop: local (keyboard + monitor)
// Server: remote (IPMI, KVM over IP)
//
// Cooling:
// Desktop: open-air, quiet
// Server: high-RPM fans, rack-optimized
//
// Power:
// Desktop: 500-850W
// Server: 1000-3000W, redundant

// Cost comparison (similar compute):
// Desktop workstation: $3-5K
// Equivalent server: $8-15K
// Premium: 2-3x for reliability

// When to use which?

// Desktop suitable for:
// - Home lab
// - Single user ML
// - Light crypto mining
// - Development machines

// Server required for:
// - 24/7 Filecoin mining
// - Production databases
// - Web services
// - Enterprise workloads
// - Multi-tenant compute

// Hybrid approach:
// - HEDT (High-End Desktop)
// - Threadripper / Xeon W
// - some server features
// - desktop form factor
// - $5-10K range`}
        </pre>
        <p className="leading-7">
          설계 철학: <strong>Desktop (performance/$) vs Server (reliability + scale)</strong>.<br />
          24/7 operation + failure = revenue loss → server parts 필수.<br />
          HEDT가 중간 tier (Threadripper, Xeon W).
        </p>
      </div>
    </section>
  );
}
