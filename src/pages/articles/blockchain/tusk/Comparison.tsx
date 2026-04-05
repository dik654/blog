import { motion } from 'framer-motion';

const C = { tusk: '#6366f1', bull: '#f59e0b', text: 'var(--foreground)' };

function CompareViz() {
  const rows = [
    { metric: '네트워크 가정', tusk: '비동기', bull: '부분 동기' },
    { metric: '리더 선택', tusk: '랜덤 코인', bull: '라운드 로빈' },
    { metric: '웨이브 크기', tusk: '3 라운드', bull: '2 라운드' },
    { metric: '지연 (좋은 조건)', tusk: '3 라운드', bull: '2 라운드' },
    { metric: '활성 보장', tusk: '항상', bull: 'GST 이후' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Tusk vs Bullshark 비교</p>
      <svg viewBox="0 0 420 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.text}>항목</text>
        <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tusk}>Tusk</text>
        <text x={365} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bull}>Bullshark</text>
        <line x1={10} y1={22} x2={410} y2={22} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.metric} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <text x={80} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.text}>{r.metric}</text>
            <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.tusk}>{r.tusk}</text>
            <text x={365} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.bull}>{r.bull}</text>
          </motion.g>
        ))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 Tusk는 활성을 항상 보장하지만, 좋은 조건에서는 Bullshark가 1라운드 빠름
      </p>
    </div>
  );
}

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tusk vs Bullshark</h2>
      <CompareViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Bullshark는 좋은 네트워크에서 <strong>2라운드 지연</strong>으로 더 빠름.<br />
          Tusk는 네트워크가 불안정해도 합의가 멈추지 않음.<br />
          trade-off: 최선의 지연 vs 최악의 활성 보장.
        </p>

        {/* ── 실무 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실무 선택: Tusk vs Bullshark</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 실무 선택 기준:

// Tusk 채택 사례:
// - Sui initial (2022-2023)
// - 이론적 async-safe 필요 시
// - DDoS 저항 중요 시
// - 실험적/연구용 시스템

// Bullshark 채택 사례:
// - Sui production (2023-2024)
// - partial sync 가정 OK
// - fast path 최적화 우선
// - 대부분 실무 시스템

// 실제 네트워크 특성:
// - 99% partial sync 조건 만족
// - 1% async condition (DDoS, partition)
// - Bullshark: 99% fast, 1% async fallback
// - Tusk: 100% slow (overkill)

// 성능 비교 (100 validators, WAN):
//
// Tusk:
// - latency: 1.5s (expected)
// - throughput: 100K TPS
// - worst case: probability 1 (unbounded)
// - consistent performance
//
// Bullshark (fast path):
// - latency: 1s
// - throughput: 130K TPS
// - worst case: 2s (fallback)
// - better common case
//
// 실제 측정 (Sui):
// - Tusk 2022: 80K TPS, 3s latency
// - Bullshark 2023: 130K TPS, 2s latency
// - Mysticeti 2024: 160K TPS, 390ms latency

// Bullshark가 선택된 이유:
// 1. 평균 성능 우위
// 2. fast path 단순
// 3. async fallback 유지 (Tusk 대체)
// 4. 같은 Narwhal backbone

// Tusk의 의의:
// - async DAG consensus 최초 제시
// - randomized leader 기법
// - Bullshark의 fallback 영감
// - 이론적 기반 강화

// 미래:
// - pure async 필요 시 Tusk 계승
// - hybrid가 표준 (Bullshark, Mysticeti)
// - DAG-BFT 지속 진화`}
        </pre>
        <p className="leading-7">
          실무: <strong>Bullshark hybrid가 Tusk 대체</strong>.<br />
          99% fast path 조건 만족 → Tusk overkill.<br />
          Tusk 의의: async DAG consensus 최초 제시.
        </p>

        {/* ── 이론적 기여 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Tusk의 이론적 기여</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tusk의 이론적 기여:

// 1. DAG-based async BFT:
//    - 이론 (DAG-Rider) → 실용 (Tusk)
//    - reliable broadcast + DAG
//    - async-safe 증명
//
// 2. Common coin reveal timing:
//    - coin 값을 wave 마지막에 reveal
//    - Byzantine이 미리 조작 불가
//    - randomized leader election 표준화
//
// 3. O(1) expected latency:
//    - constant expected rounds (~3 waves)
//    - async BFT의 효율적 패턴
//    - FLP 우회 성공 사례
//
// 4. Modular design:
//    - Narwhal + Tusk 분리
//    - Narwhal + Bullshark도 호환
//    - consensus layer 교체 가능

// 후속 연구 영향:
//
// Bullshark (2022):
// - Tusk의 async fallback 계승
// - partial sync fast path 추가
// - hybrid architecture
//
// Shoal (2023):
// - pipelined Bullshark
// - multiple anchors per wave
// - Tusk idea 확장
//
// Mysticeti (2024):
// - uncertified DAG
// - 3-round commit
// - async-safe 유지

// Tusk → Bullshark → Mysticeti:
// - 각 세대 async safety + latency 개선
// - DAG-BFT의 evolution

// 학술적 가치:
// - DAG consensus pattern 확립
// - 많은 후속 논문 baseline
// - Sui 성능의 초기 기반

// 교훈:
// - 이론과 실무 gap 존재
// - async-safe는 "있으면 좋지만" 필수 아님
// - hybrid가 실용 sweet spot
// - 이론적 선도 → 실무 접목 iteration`}
        </pre>
        <p className="leading-7">
          Tusk 기여: <strong>DAG async BFT 최초 실용, common coin timing</strong>.<br />
          Bullshark/Mysticeti가 Tusk 아이디어 계승.<br />
          학술적 선도 → 실무 접목의 표본.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 async-safe의 현실적 가치</strong> — "insurance" policy.<br />
          평소 사용 안 함, but 위기 시 필수.<br />
          Tusk는 pure async, Bullshark는 hybrid (async fallback).<br />
          Hybrid가 이기는 이유: 보험료(overhead) 낮으면서 보장 유지.
        </p>
      </div>
    </section>
  );
}
