import { motion } from 'framer-motion';

const CX = 230;

export default function HierarchyView() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={CX - 45} y={15} width={90} height={30} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={2} />
      <text x={CX} y={35} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#6366f1">Manager</text>
      {[150, 310].map((x, i) => (
        <g key={i}>
          <rect x={x - 45} y={70} width={90} height={28} rx={5}
            fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
          <text x={x} y={89} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="#10b981">Team Lead {i + 1}</text>
          <line x1={CX} y1={45} x2={x} y2={70}
            stroke="#10b981" strokeWidth={1} opacity={0.4} />
        </g>
      ))}
      {[90, 210, 250, 370].map((x, i) => {
        const leadX = i < 2 ? 150 : 310;
        return (
          <g key={i}>
            <rect x={x - 35} y={125} width={70} height={24} rx={4}
              fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
            <text x={x} y={141} textAnchor="middle" fontSize={9}
              fontWeight={500} fill="#f59e0b">Worker {i + 1}</text>
            <line x1={leadX} y1={98} x2={x} y2={125}
              stroke="#f59e0b" strokeWidth={0.8} opacity={0.3} />
          </g>
        );
      })}
    </motion.g>
  );
}
