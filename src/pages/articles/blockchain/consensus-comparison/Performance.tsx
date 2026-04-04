import { motion } from 'framer-motion';

const C = {
  pbft: '#ef4444', hs: '#6366f1', tm: '#10b981',
  nb: '#0ea5e9', avax: '#f59e0b', nak: '#8b5cf6',
};

function PerfTable() {
  const rows = [
    { proto: 'PBFT', msg: 'O(n²)', latency: '2 RTT', tps: '중', color: C.pbft },
    { proto: 'HotStuff', msg: 'O(n)', latency: '3 RTT', tps: '중', color: C.hs },
    { proto: 'Tendermint', msg: 'O(n²)', latency: '2 RTT', tps: '중', color: C.tm },
    { proto: 'Bullshark', msg: 'O(n)', latency: '2-3 RTT', tps: '높음', color: C.nb },
    { proto: 'Avalanche', msg: 'O(k log n)', latency: '~1s', tps: '높음', color: C.avax },
    { proto: 'Nakamoto', msg: 'O(n)', latency: '~60분', tps: '낮음', color: C.nak },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">성능 비교표</p>
      <svg viewBox="0 0 420 180" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={55} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">프로토콜</text>
        <text x={155} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">통신</text>
        <text x={255} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">지연</text>
        <text x={355} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">처리량</text>
        <line x1={10} y1={20} x2={410} y2={20} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.proto} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
            <text x={55} y={36 + i * 24} textAnchor="middle" fontSize={10} fontWeight={600} fill={r.color}>{r.proto}</text>
            <text x={155} y={36 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.msg}</text>
            <text x={255} y={36 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.latency}</text>
            <text x={355} y={36 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.tps}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Performance() {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 비교</h2>
      <PerfTable />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DAG 기반(Bullshark)과 Avalanche가 처리량에서 우위입니다.<br />
          Nakamoto 합의는 지연이 길지만 참여자 수 제한이 없습니다.<br />
          💡 RTT = Round Trip Time. 지연은 네트워크 조건에 크게 의존
        </p>
      </div>
    </section>
  );
}
