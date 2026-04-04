import { motion } from 'framer-motion';

const C = { mysti: '#6366f1', bull: '#f59e0b' };

function CompareViz() {
  const rows = [
    { metric: 'DAG 유형', mysti: 'Uncertified', bull: 'Certified' },
    { metric: '커밋 지연', mysti: '2 라운드', bull: '3 라운드' },
    { metric: 'Fast Path', mysti: '지원', bull: '미지원' },
    { metric: '메시지 복잡도', mysti: 'O(n)', bull: 'O(n)' },
    { metric: '실전 지연', mysti: '~390ms', bull: '~2s' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Mysticeti vs Bullshark</p>
      <svg viewBox="0 0 420 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.mysti}>Mysticeti</text>
        <text x={365} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bull}>Bullshark</text>
        <line x1={10} y1={22} x2={410} y2={22} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.metric} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <text x={80} y={40 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.metric}</text>
            <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.mysti}>{r.mysti}</text>
            <text x={365} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.bull}>{r.bull}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비교 분석</h2>
      <CompareViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Mysticeti는 인증 라운드 제거로 지연을 절반으로 줄였습니다.<br />
          Fast path 덕분에 소유 객체 TX는 100ms 이내에 확정됩니다.<br />
          💡 Sui가 Bullshark에서 Mysticeti로 전환한 이유: 실전 지연 80% 감소
        </p>
      </div>
    </section>
  );
}
