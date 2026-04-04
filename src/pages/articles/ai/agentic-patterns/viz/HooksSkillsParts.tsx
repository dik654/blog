import { motion } from 'framer-motion';
import { HOOKS, SKILLS } from './HooksSkillsData';

const CX = 230;

export function HooksView({ step }: { step: number }) {
  return (
    <g>
      <text x={CX} y={18} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="var(--foreground)">Agent Lifecycle Hooks</text>

      <line x1={230} y1={30} x2={230} y2={180}
        stroke="var(--border)" strokeWidth={2} />
      <text x={230} y={195} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">에이전트 실행 흐름</text>

      {HOOKS.map((h, i) => {
        const active = step === 1;
        const side = i % 2 === 0 ? -1 : 1;
        const tx = 230 + side * 110;
        return (
          <motion.g key={h.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0.5 }}
            transition={{ delay: i * 0.1 }}>
            <line x1={230} y1={h.y} x2={tx} y2={h.y}
              stroke={h.color} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            <circle cx={230} cy={h.y} r={4}
              fill={h.color} opacity={0.8} />
            <rect x={tx - 45} y={h.y - 12} width={90} height={24} rx={4}
              fill={`${h.color}15`} stroke={h.color} strokeWidth={1} />
            <text x={tx} y={h.y + 4} textAnchor="middle" fontSize={9}
              fontWeight={600} fill={h.color}>{h.label}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export function SkillsView() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={CX} y={20} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="var(--foreground)">Skills — 재사용 가능한 능력 단위</text>

      <rect x={CX - 40} y={50} width={80} height={36} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={2} />
      <text x={CX} y={73} textAnchor="middle" fontSize={11}
        fontWeight={700} fill="#6366f1">Agent</text>

      {SKILLS.map((s, i) => {
        const x = 90 + i * 140;
        return (
          <motion.g key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}>
            <rect x={x - 55} y={120} width={110} height={40} rx={6}
              fill={`${s.color}12`} stroke={s.color} strokeWidth={1.5} />
            <text x={x} y={137} textAnchor="middle" fontSize={9}
              fontWeight={600} fill={s.color}>{s.label}</text>
            <text x={x} y={151} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">프롬프트 + 도구 + 형식</text>
            <line x1={CX} y1={86} x2={x} y2={120}
              stroke={s.color} strokeWidth={1} opacity={0.4} />
          </motion.g>
        );
      })}
    </motion.g>
  );
}
