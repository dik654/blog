import { motion } from 'framer-motion';

const C = { ab: '#10b981', hs: '#6366f1', pbft: '#ef4444' };

function PerfViz() {
  const bars = [
    { label: 'PBFT', latency: 30, tps: 40, color: C.pbft },
    { label: 'HotStuff', latency: 60, tps: 70, color: C.hs },
    { label: 'Autobahn', latency: 35, tps: 90, color: C.ab },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">처리량 vs 지연 비교</p>
      <svg viewBox="0 0 420 120" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={15} y={14} fontSize={10} fill="var(--muted-foreground)">처리량 (상대)</text>
        {bars.map((b, i) => (
          <motion.g key={b.label} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
            <text x={15} y={38 + i * 32} fontSize={10} fontWeight={600} fill={b.color}>{b.label}</text>
            <motion.rect x={100} y={25 + i * 32} width={0} height={18} rx={4}
              fill={`${b.color}30`} stroke={b.color} strokeWidth={1}
              animate={{ width: b.tps * 3 }}
              transition={{ delay: i * 0.15, duration: 0.5 }} />
            <motion.text x={100 + b.tps * 3 + 8} y={38 + i * 32} fontSize={10}
              fill={b.color} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.5 }}>
              {b.tps}%
            </motion.text>
          </motion.g>
        ))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 Autobahn: PBFT급 지연 + HotStuff 이상의 처리량
      </p>
    </div>
  );
}

export default function Performance() {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 분석</h2>
      <PerfViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Autobahn은 <strong>정상 조건에서 PBFT에 가까운 지연</strong> 달성.<br />
          파이프라인 덕분에 처리량은 HotStuff 초과.<br />
          trade-off: 프로토콜 복잡도 증가, 실전 성능 최적.
        </p>

        {/* ── 측정 결과 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SOSP 2024 측정 결과</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Autobahn SOSP 2024 벤치마크:
//
// Setup:
// - 10-100 validators
// - AWS EC2, multi-region (WAN)
// - BLS12-381 signatures
// - 10 Gbps network
//
// Happy path performance:
// - latency: 200-300ms (WAN)
// - throughput: 100K+ TPS
// - p99 latency: 400ms
// - CPU: <50%
// - memory: <4GB
//
// Blip performance:
// - blip duration: 100-300ms (simulated)
// - recovery latency: 100-200ms
// - throughput drop: <10%
// - full recovery: <500ms

// Comparison (100 validators, WAN):
//
// PBFT:
// - happy: 300ms latency, 10K TPS
// - blip: 3s recovery, 50% throughput drop
//
// HotStuff:
// - happy: 500ms latency, 25K TPS
// - blip: 1-2s recovery, 30% drop
//
// Tendermint:
// - happy: 800ms latency, 10K TPS
// - blip: 2-5s recovery, 60% drop
//
// Narwhal+Bullshark:
// - happy: 2s latency, 130K TPS
// - blip: 200ms, 10% drop
//
// Autobahn:
// - happy: 200-300ms, 100K+ TPS
// - blip: 100-200ms, <10% drop
// - "best overall"

// 분석:
// - latency: Autobahn ≈ PBFT (best)
// - throughput: Autobahn ≈ Narwhal (high)
// - blip recovery: Autobahn ≈ Narwhal (fast)
// - trilemma 해소

// Scaling (validators):
// - 10 validators: 100K TPS
// - 50 validators: 90K TPS
// - 100 validators: 75K TPS
// - 200 validators: 50K TPS
// - linear degradation (acceptable)

// Bandwidth:
// - per validator: 1-2 Gbps
// - aggregate: 100-200 Gbps
// - comparable to Narwhal

// 결론:
// Autobahn은 2024년 최선의 BFT 후보
// 학술 → production 전환 기대`}
        </pre>
        <p className="leading-7">
          Autobahn 성능: <strong>200-300ms latency, 100K+ TPS, 100-200ms blip recovery</strong>.<br />
          모든 metric에서 top 3 — "best overall".<br />
          trilemma(latency/throughput/recovery) 동시 해결.
        </p>

        {/* ── 미래 방향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Autobahn의 미래</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Autobahn 채택 전망:
//
// 2024: SOSP 2024 publication
// - 학술 논문
// - prototype 구현
// - mainnet 없음
//
// 2025 예상:
// - reference implementation
// - 학술 follow-up
// - 업계 관심 증가
//
// 2026+ 예상:
// - 새 L1 blockchain 후보
// - Aptos/Sui 대체 검토
// - production 준비

// 비교: Mysticeti vs Autobahn
//
// Mysticeti (Sui):
// - DAG-based (uncertified)
// - 3-round commit
// - 390ms e2e latency
// - production mainnet (2024)
// - 실무 검증됨
//
// Autobahn:
// - slot-based (sequential)
// - 2-phase commit
// - 200-300ms latency
// - prototype only (2024)
// - 더 빠르지만 미검증

// 설계 철학 차이:
// - Mysticeti: "DAG 개선"
// - Autobahn: "sequential + parallel 결합"
// - 같은 목표, 다른 접근

// 예상 시나리오:
// 1. Autobahn 채택 시:
//    - 새 L1 (Monad, Solayer 등)
//    - 200ms latency 요구 앱
//    - gaming, HFT blockchain
//
// 2. Mysticeti 유지 시:
//    - Sui 생태계 굳건
//    - DAG 접근 표준화
//    - Aptos도 DAG 방향?

// 3. Hybrid 채택:
//    - Autobahn ideas + DAG
//    - "Autobahn on DAG"
//    - Shoal++ 계승
//    - 2025 새 프로토콜 후보

// 연구 과제:
// - validator churn 지원
// - shard consensus 통합
// - MEV-resistant ordering
// - privacy-preserving BFT`}
        </pre>
        <p className="leading-7">
          Autobahn 전망: <strong>2024 학술 → 2026 production 후보</strong>.<br />
          Mysticeti 대안 또는 보완 역할.<br />
          "sequential + parallel" 결합의 새 패러다임.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Autobahn의 learning</strong> — "scalability trilemma는 깰 수 있다".<br />
          latency, throughput, recovery 셋 다 최적 가능.<br />
          key insight: 각 속성에 맞는 mechanism 분리 (Highway, Lanes, Blip handler).<br />
          미래 BFT 설계의 baseline.
        </p>
      </div>
    </section>
  );
}
