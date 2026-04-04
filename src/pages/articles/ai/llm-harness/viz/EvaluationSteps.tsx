import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function JudgeStep(): ReactNode {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={40} y={30} width={100} height={50} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={1.5} />
      <text x={90} y={48} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#6366f1">LLM 응답</text>
      <text x={90} y={64} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)">"서울 인구는 약 950만"</text>
      <line x1={140} y1={55} x2={175} y2={55}
        stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#evArrow)" />
      <rect x={175} y={30} width={100} height={50} rx={6}
        fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
      <text x={225} y={48} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#10b981">Judge LLM</text>
      <text x={225} y={64} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)">정확도+완성도 채점</text>
      <line x1={275} y1={55} x2={310} y2={55}
        stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#evArrow)" />
      <rect x={310} y={36} width={80} height={38} rx={6}
        fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
      <text x={350} y={53} textAnchor="middle"
        fontSize={14} fontWeight={700} fill="#10b981">4/5</text>
      <text x={350} y={68} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)">사실 정확, 출처 부족</text>
      {/* Cohen's kappa stat */}
      <text x={220} y={100} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">
        사람 평가 대비 일치율: Cohen kappa 0.74 (GPT-4 judge 기준)
      </text>
    </motion.g>
  );
}

export function RuleStep(): ReactNode {
  const rules = [
    { label: '정규식', pattern: '/^\\{.*\\}$/s', result: 'PASS', pass: true },
    { label: 'JSON 스키마', pattern: 'required: [answer]', result: 'PASS', pass: true },
    { label: '금지어 필터', pattern: '"비밀번호" 포함', result: 'WARN', pass: false },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {rules.map((r, i) => {
        const y = 25 + i * 52;
        const c = r.pass ? '#10b981' : '#f59e0b';
        return (
          <motion.g key={r.label} initial={{ x: -10 }} animate={{ x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={50} y={y} width={240} height={40} rx={5}
              fill={`${c}12`} stroke={c} strokeWidth={1} />
            <text x={62} y={y + 16} fontSize={9}
              fontWeight={600} fill={c}>{r.label}</text>
            <text x={62} y={y + 32} fontSize={8} fontFamily="monospace"
              fill="var(--muted-foreground)">{r.pattern}</text>
            <rect x={310} y={y + 8} width={55} height={22} rx={4}
              fill={r.pass ? '#10b98120' : '#f59e0b20'}
              stroke={c} strokeWidth={1} />
            <text x={337} y={y + 23} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={c}>{r.result}</text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}
