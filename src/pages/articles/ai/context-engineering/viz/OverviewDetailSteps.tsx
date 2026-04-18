import { motion } from 'framer-motion';
import { SYS_C, RAG_C, HIST_C, COST_C } from './OverviewDetailVizData';

export function ComponentsStep() {
  const items = [
    { label: 'System Prompt', tokens: '500-5K', c: SYS_C },
    { label: 'User Query', tokens: '50-1K', c: '#94a3b8' },
    { label: 'History', tokens: '0-∞', c: HIST_C },
    { label: 'RAG Context', tokens: '1K-50K', c: RAG_C },
    { label: 'Tool Results', tokens: '가변', c: '#8b5cf6' },
    { label: 'Memory', tokens: '가변', c: '#06b6d4' },
    { label: 'Few-shot', tokens: '500-5K', c: COST_C },
  ];
  return (
    <g>
      <text x={240} y={10} textAnchor="middle" fontSize={10} fontWeight={700} fill={SYS_C}>컨텍스트 7가지 구성요소</text>
      {items.map((it, i) => (
        <motion.g key={it.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
          <rect x={30} y={18 + i * 19} width={130} height={15} rx={3} fill={it.c + '12'} stroke={it.c} strokeWidth={0.6} />
          <text x={95} y={29 + i * 19} textAnchor="middle" fontSize={8} fontWeight={600} fill={it.c}>{it.label}</text>
          <text x={175} y={29 + i * 19} fontSize={7.5} fill="var(--muted-foreground)">{it.tokens} tokens</text>
          {i < 6 && <line x1={95} y1={33 + i * 19} x2={95} y2={37 + i * 19} stroke="var(--border)" strokeWidth={0.4} />}
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={250} y={30} width={210} height={100} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={355} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">토큰 예산</text>
        <text x={260} y={68} fontSize={8} fill="var(--muted-foreground)">GPT-4: 128K</text>
        <text x={260} y={82} fontSize={8} fill="var(--muted-foreground)">Claude 3.5: 200K</text>
        <text x={260} y={96} fontSize={8} fill="var(--muted-foreground)">Gemini 1.5: 1M-2M</text>
        <text x={260} y={110} fontSize={8} fill="var(--muted-foreground)">OSS: 32K-128K</text>
      </motion.g>
    </g>
  );
}

export function BudgetCostStep() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={HIST_C}>실무 분배 + 비용</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={210} height={85} rx={6} fill={SYS_C + '08'} stroke={SYS_C} strokeWidth={0.8} />
        <text x={125} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={SYS_C}>실무 분배 (~20K)</text>
        <text x={30} y={58} fontSize={8} fill="var(--muted-foreground)">System 2K + RAG 10K</text>
        <text x={30} y={72} fontSize={8} fill="var(--muted-foreground)">History 5K + Query 500</text>
        <text x={30} y={86} fontSize={8} fill="var(--muted-foreground)">Buffer 2K</text>
        <text x={30} y={100} fontSize={8} fontWeight={600} fill={SYS_C}>총: ~20K tokens</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={250} y={26} width={210} height={85} rx={6} fill={COST_C + '08'} stroke={COST_C} strokeWidth={0.8} />
        <text x={355} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COST_C}>비용 계산</text>
        <text x={260} y={58} fontSize={8} fill="var(--muted-foreground)">GPT-4o: $5/M input</text>
        <text x={260} y={72} fontSize={8} fill="var(--muted-foreground)">Claude Sonnet: $3/M</text>
        <text x={260} y={86} fontSize={8} fill="var(--muted-foreground)">20K × 1M requests</text>
        <text x={260} y={100} fontSize={8} fontWeight={600} fill={COST_C}>= $60-100/M reqs</text>
      </motion.g>
    </g>
  );
}

export function PrinciplesStep() {
  const ps = [
    { num: '1', text: 'Relevance > Volume', sub: '관련 1K > 무관 10K' },
    { num: '2', text: 'Hierarchy', sub: 'System > Retrieved > History' },
    { num: '3', text: 'Explicit Instructions', sub: '모호함 제거' },
    { num: '4', text: 'Context Compaction', sub: '대화 길어지면 요약' },
    { num: '5', text: 'Just-in-Time Retrieval', sub: '필요할 때만 검색' },
    { num: '6', text: 'Structured Output', sub: 'XML/JSON 파싱 가능' },
    { num: '7', text: 'Grounding', sub: 'RAG 소스 인용' },
  ];
  return (
    <g>
      <text x={240} y={10} textAnchor="middle" fontSize={10} fontWeight={700} fill={RAG_C}>7대 원칙</text>
      {ps.map((p, i) => (
        <motion.g key={p.num} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
          <circle cx={30} cy={27 + i * 19} r={7} fill={RAG_C + '18'} stroke={RAG_C} strokeWidth={0.6} />
          <text x={30} y={31 + i * 19} textAnchor="middle" fontSize={7} fontWeight={700} fill={RAG_C}>{p.num}</text>
          <text x={45} y={31 + i * 19} fontSize={8.5} fontWeight={600} fill="var(--foreground)">{p.text}</text>
          <text x={250} y={31 + i * 19} fontSize={8} fill="var(--muted-foreground)">{p.sub}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function TrendsStep() {
  const metrics = ['Context utilization (%)', 'Token cost/query', 'Response quality', 'Latency (ttft)', 'Cache hit rate'];
  const trends = ['긴 문맥 (1M+)', 'Agentic workflows', 'Context caching', 'Retrieval + Reranking'];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill={HIST_C}>측정 지표 + 2024 트렌드</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <rect x={20} y={26} width={200} height={14 + metrics.length * 16} rx={6} fill={SYS_C + '08'} stroke={SYS_C} strokeWidth={0.5} />
        <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={SYS_C}>측정 지표</text>
        {metrics.map((m, i) => (
          <text key={i} x={30} y={58 + i * 15} fontSize={8} fill="var(--muted-foreground)">{m}</text>
        ))}
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <rect x={240} y={26} width={220} height={14 + trends.length * 16} rx={6} fill={HIST_C + '08'} stroke={HIST_C} strokeWidth={0.5} />
        <text x={350} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={HIST_C}>2024 트렌드</text>
        {trends.map((t, i) => (
          <text key={i} x={250} y={58 + i * 15} fontSize={8} fill="var(--muted-foreground)">{t}</text>
        ))}
      </motion.g>
    </g>
  );
}
