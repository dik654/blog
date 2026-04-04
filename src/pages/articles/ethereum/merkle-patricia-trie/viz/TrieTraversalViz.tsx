import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CE = '#10b981', CB = '#6366f1', CL = '#f59e0b', CH = '#ef4444';

const STEPS = [
  { label: '전체 키: a711355', body: '조회할 키를 니블로 분해: [a, 7, 1, 1, 3, 5, 5]. 루트 노드에서 시작.' },
  { label: 'Root Extension: "a7" 소비', body: 'Extension의 shared nibbles "a7" 매칭. 니블 2개 소비 → 남은 키: [1, 1, 3, 5, 5]' },
  { label: 'Branch: 니블 "1" 소비', body: 'Branch 노드에서 니블 "1" → 슬롯 1의 자식으로 이동. 남은 키: [1, 3, 5, 5]' },
  { label: 'Leaf: key-end "1355" 매칭', body: 'Leaf의 key-end "1355"와 남은 키 [1,3,5,5] 일치 → 값 45.0 ETH 반환!' },
];

const Nib = ({ x, y, v, active }: { x: number; y: number; v: string; active: boolean }) => (
  <g>
    <rect x={x} y={y} width={22} height={18} rx={3}
      fill={active ? `${CH}15` : 'var(--card)'} stroke={active ? CH : 'var(--border)'} strokeWidth={active ? 1 : 0.5} />
    <text x={x + 11} y={y + 12} textAnchor="middle" fontSize={9} fontWeight={500}
      fill={active ? CH : 'var(--foreground)'} fontFamily="monospace">{v}</text>
  </g>
);

export default function TrieTraversalViz() {
  const nibs = ['a', '7', '1', '1', '3', '5', '5'];
  const consumed = [0, 2, 3, 7]; // nibbles consumed by step

  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const c = consumed[step];
        return (
          <svg viewBox="0 0 420 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Key nibbles at top */}
            <text x={20} y={22} fontSize={9} fill="var(--muted-foreground)">키:</text>
            {nibs.map((n, i) => (
              <Nib key={i} x={50 + i * 28} y={10} v={n} active={i < c} />
            ))}
            <text x={260} y={22} fontSize={9} fill="var(--muted-foreground)">
              소비: {c} / 7
            </text>
            {/* Extension Node */}
            <motion.g animate={{ opacity: step >= 1 ? 1 : 0.4 }}>
              <rect x={30} y={50} width={160} height={30} rx={5}
                fill={step === 1 ? `${CE}15` : `${CE}08`} stroke={CE}
                strokeWidth={step === 1 ? 1.2 : 0.6} />
              <text x={40} y={62} fontSize={9} fill={CE}>Extension</text>
              <text x={40} y={74} fontSize={9} fontWeight={500} fill="var(--foreground)" fontFamily="monospace">
                shared: a7
              </text>
            </motion.g>
            {/* Arrow */}
            <motion.line x1={110} y1={80} x2={110} y2={100} stroke="var(--border)" strokeWidth={0.6}
              animate={{ opacity: step >= 2 ? 1 : 0.3 }} />
            {/* Branch Node */}
            <motion.g animate={{ opacity: step >= 2 ? 1 : 0.3 }}>
              <rect x={30} y={100} width={340} height={30} rx={5}
                fill={step === 2 ? `${CB}12` : `${CB}06`} stroke={CB}
                strokeWidth={step === 2 ? 1.2 : 0.5} />
              <text x={40} y={112} fontSize={9} fill={CB}>Branch</text>
              {Array.from({ length: 16 }, (_, i) => {
                const bx = 38 + i * 20;
                const isSlot1 = i === 1;
                return (
                  <g key={i}>
                    <rect x={bx} y={114} width={16} height={12} rx={2}
                      fill={isSlot1 && step === 2 ? `${CH}20` : 'var(--card)'}
                      stroke={isSlot1 ? CH : 'var(--border)'} strokeWidth={isSlot1 ? 0.8 : 0.3} />
                    <text x={bx + 8} y={123} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                      fontFamily="monospace">{i.toString(16)}</text>
                  </g>
                );
              })}
            </motion.g>
            {/* Arrow to Leaf */}
            <motion.line x1={66} y1={130} x2={66} y2={150} stroke="var(--border)" strokeWidth={0.6}
              animate={{ opacity: step >= 3 ? 1 : 0.2 }} />
            {/* Leaf Node */}
            <motion.g animate={{ opacity: step >= 3 ? 1 : 0.2 }}>
              <rect x={30} y={150} width={200} height={30} rx={5}
                fill={step === 3 ? `${CL}15` : `${CL}08`} stroke={CL}
                strokeWidth={step === 3 ? 1.2 : 0.5} />
              <text x={40} y={162} fontSize={9} fill={CL}>Leaf</text>
              <text x={40} y={174} fontSize={9} fontWeight={500} fill="var(--foreground)" fontFamily="monospace">
                key-end: 1355
              </text>
              {step === 3 && (
                <motion.text x={170} y={170} fontSize={9} fontWeight={600} fill={CH}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  → 45.0 ETH
                </motion.text>
              )}
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
