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
        {/* Header */}
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
          Bullshark는 좋은 네트워크에서 2라운드 지연으로 더 빠릅니다.<br />
          Tusk는 네트워크가 불안정해도 합의가 멈추지 않습니다.<br />
          💡 트레이드오프: 최선의 지연 vs 최악의 활성 보장
        </p>
      </div>
    </section>
  );
}
