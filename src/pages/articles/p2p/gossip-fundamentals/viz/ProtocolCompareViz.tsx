import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'SWIM: Probe & Piggybacking', body: '핑 → 간접 핑 → 의심 → Dead. 멤버십 변경을 메시지에 부착.' },
  { label: 'HyParView: Active/Passive View', body: 'Active View(소수 직접연결) + Passive View(백업 후보). 주기적 Shuffle.' },
  { label: 'PlumTree: Eager + Lazy Push', body: '스패닝 트리로 즉시 전달(eager) + 트리 외 메타데이터만(lazy).' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = ['#0ea5e9', '#10b981', '#f59e0b'];

const CENTER = { x: 180, y: 70 };

export default function ProtocolCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Central node */}
          <circle cx={CENTER.x} cy={CENTER.y} r={16}
            fill={C[step] + '15'} stroke={C[step]} strokeWidth={1.5} />
          <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={C[step]}>Node</text>

          {/* Surrounding nodes */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const r = 55;
            const nx = CENTER.x + Math.cos(angle) * r;
            const ny = CENTER.y + Math.sin(angle) * r;
            const isActive = step === 1 ? i < 3 : true;
            const isEager = step === 2 ? i < 3 : true;

            return (
              <motion.g key={i}
                animate={{ opacity: isActive || step !== 1 ? 1 : 0.3 }}
                transition={sp}>
                {/* Connection */}
                <line x1={CENTER.x} y1={CENTER.y} x2={nx} y2={ny}
                  stroke={C[step]} strokeWidth={step === 2 && !isEager ? 0.8 : 1.2}
                  strokeDasharray={step === 2 && !isEager ? '3 3' : (step === 1 && !isActive ? '3 3' : '0')}
                  strokeOpacity={0.5} />
                {/* Node */}
                <circle cx={nx} cy={ny} r={10}
                  fill={(isActive || step !== 1) ? C[step] + '15' : '#64748b08'}
                  stroke={(isActive || step !== 1) ? C[step] : '#64748b'} strokeWidth={1} />
                {/* SWIM ping indicator */}
                {step === 0 && i === 0 && (
                  <motion.circle cx={nx} cy={ny} r={10} fill="none"
                    stroke={C[0]} strokeWidth={1}
                    initial={{ r: 10, opacity: 0.8 }} animate={{ r: 20, opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity }} />
                )}
              </motion.g>
            );
          })}

          {/* Legend */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <text x={340} y={50} fontSize={10} fill={C[1]}>Active (3)</text>
              <text x={340} y={65} fontSize={10} fill="#64748b">Passive (3)</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <text x={340} y={50} fontSize={10} fill={C[2]}>Eager (실선)</text>
              <text x={340} y={65} fontSize={10} fill={C[2]}>Lazy (점선)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
