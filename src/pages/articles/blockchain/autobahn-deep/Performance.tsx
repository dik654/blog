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
          Autobahn은 정상 조건에서 PBFT에 가까운 지연을 달성합니다.<br />
          파이프라인 덕분에 처리량은 HotStuff를 초과합니다.<br />
          💡 트레이드오프: 프로토콜 복잡도가 증가하지만 실전 성능은 최적
        </p>
      </div>
    </section>
  );
}
