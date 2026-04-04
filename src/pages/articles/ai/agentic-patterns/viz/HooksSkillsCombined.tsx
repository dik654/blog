import { motion } from 'framer-motion';

const CX = 230;

export default function CombinedView() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={CX} y={18} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="var(--foreground)">Hooks + Skills = 프로덕션 에이전트</text>

      <rect x={CX - 35} y={45} width={70} height={30} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={2} />
      <text x={CX} y={65} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#6366f1">Agent</text>

      <rect x={50} y={40} width={100} height={40} rx={6}
        fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={100} y={57} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#f59e0b">Hooks</text>
      <text x={100} y={72} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">가드레일 · 감사</text>

      <rect x={310} y={40} width={100} height={40} rx={6}
        fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
      <text x={360} y={57} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#10b981">Skills</text>
      <text x={360} y={72} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">기능 확장</text>

      <line x1={150} y1={60} x2={195} y2={60}
        stroke="#f59e0b" strokeWidth={1} opacity={0.5} />
      <line x1={265} y1={60} x2={310} y2={60}
        stroke="#10b981" strokeWidth={1} opacity={0.5} />

      <rect x={CX - 70} y={110} width={140} height={34} rx={6}
        fill="#6366f110" stroke="#6366f1" strokeWidth={1.5} />
      <text x={CX} y={125} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#6366f1">안전 + 확장 가능</text>
      <text x={CX} y={138} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">안전과 기능을 독립적으로 관리</text>
      <line x1={CX} y1={75} x2={CX} y2={110}
        stroke="#6366f1" strokeWidth={1} opacity={0.4} />
    </motion.g>
  );
}
