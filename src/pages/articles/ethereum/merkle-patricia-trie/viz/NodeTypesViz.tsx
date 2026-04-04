import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const CB = '#6366f1', CE = '#10b981', CL = '#f59e0b';

const STEPS = [
  { label: 'Branch Node — 분기점', body: '16개 슬롯(0~f)으로 다음 니블에 따라 분기. 키가 이 노드에서 끝나면 value 필드에 값 저장.' },
  { label: 'Extension Node — 경로 압축', body: '여러 키가 공통 접두사를 공유할 때 한 노드로 압축. [shared nibbles, next node pointer]' },
  { label: 'Leaf Node — 종단 노드', body: '키의 나머지 경로(key-end)와 실제 값(value)을 저장. 트라이의 말단.' },
];

export default function NodeTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Branch Node */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.25, x: step === 0 ? 0 : -10 }}
            transition={{ type: 'spring', bounce: 0.2 }}>
            <rect x={10} y={20} width={400} height={55} rx={5} fill={`${CB}08`} stroke={CB}
              strokeWidth={step === 0 ? 1.2 : 0.5} />
            <text x={210} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill={CB}>Branch Node</text>
            {Array.from({ length: 16 }, (_, i) => {
              const x = 18 + i * 23;
              return (
                <g key={i}>
                  <rect x={x} y={30} width={20} height={18} rx={3}
                    fill={[1, 7, 15].includes(i) ? `${CB}15` : 'var(--card)'}
                    stroke={CB} strokeWidth={0.5} />
                  <text x={x + 10} y={43} textAnchor="middle" fontSize={9} fill="var(--foreground)"
                    fontFamily="monospace">{i.toString(16)}</text>
                </g>
              );
            })}
            <rect x={386} y={30} width={20} height={18} rx={3} fill={`${CB}10`} stroke={CB} strokeWidth={0.5} />
            <text x={396} y={43} textAnchor="middle" fontSize={8} fill={CB}>val</text>
            <text x={210} y={66} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              ← 16개 자식 슬롯 (0x0 ~ 0xF) + value →
            </text>
          </motion.g>
          {/* Extension Node */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.25, x: step === 1 ? 0 : -10 }}
            transition={{ type: 'spring', bounce: 0.2 }}>
            <text x={210} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={CE}>Extension Node</text>
            <rect x={60} y={98} width={80} height={24} rx={4} fill={`${CE}10`} stroke={CE}
              strokeWidth={step === 1 ? 1.2 : 0.5} />
            <text x={100} y={114} textAnchor="middle" fontSize={9} fill={CE}>shared nibbles</text>
            <rect x={160} y={98} width={30} height={24} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.5} />
            <text x={175} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→</text>
            <rect x={210} y={98} width={80} height={24} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.5} />
            <text x={250} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">next node</text>
          </motion.g>
          {/* Leaf Node */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.25, x: step === 2 ? 0 : -10 }}
            transition={{ type: 'spring', bounce: 0.2 }}>
            <text x={210} y={138} textAnchor="middle" fontSize={9} fontWeight={600} fill={CL}>Leaf Node</text>
            <rect x={80} y={142} width={100} height={24} rx={4} fill={`${CL}10`} stroke={CL}
              strokeWidth={step === 2 ? 1.2 : 0.5} />
            <text x={130} y={158} textAnchor="middle" fontSize={9} fill={CL}>key-end (나머지 경로)</text>
            <rect x={200} y={142} width={80} height={24} rx={4} fill={`${CL}08`} stroke={CL} strokeWidth={0.5} />
            <text x={240} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">value</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
