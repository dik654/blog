import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, NAND_C, OR_C, AND_C } from './MultilayerVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function GateNode({ x, y, label, color, delay }: {
  x: number; y: number; label: string; color: string; delay: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay }}>
      <circle cx={x} cy={y} r={22} fill={color + '18'} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={9} fill={color} fontWeight={600}>{label}</text>
    </motion.g>
  );
}

export default function MultilayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <rect x={80} y={30} width={300} height={120} rx={8}
                fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
              <text x={230} y={55} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight={600}>
                단층 퍼셉트론
              </text>
              <line x1={120} y1={80} x2={340} y2={130} stroke="#ef4444" strokeWidth={1.5} />
              {[{ x: 160, y: 100, v: '(0,0)=0' }, { x: 260, y: 90, v: '(0,1)=1' },
                { x: 200, y: 120, v: '(1,0)=1' }, { x: 300, y: 110, v: '(1,1)=0' }].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}>
                  <circle cx={p.x} cy={p.y} r={5}
                    fill={i === 0 || i === 3 ? '#ef444440' : '#10b98140'}
                    stroke={i === 0 || i === 3 ? '#ef4444' : '#10b981'} strokeWidth={1} />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={8} fill="#888">{p.v}</text>
                </motion.g>
              ))}
              <motion.text x={230} y={165} textAnchor="middle" fontSize={10} fill="#ef4444"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                직선 하나로 분리 불가
              </motion.text>
            </g>
          )}
          {step === 1 && (
            <g>
              {/* 입력값 */}
              <GateNode x={50} y={50} label="1" color="#888" delay={0} />
              <GateNode x={50} y={130} label="0" color="#888" delay={0.05} />
              <text x={50} y={20} textAnchor="middle" fontSize={10} fill="#888">x₁, x₂</text>

              {/* 연결선 */}
              {[[72, 50, 158, 50], [72, 130, 158, 130], [72, 50, 158, 130], [72, 130, 158, 50],
                [222, 50, 318, 90], [222, 130, 318, 90]].map((c, i) => (
                <motion.line key={i} x1={c[0]} y1={c[1]} x2={c[2]} y2={c[3]}
                  stroke="#88888850" strokeWidth={1}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.04 + 0.1 }} />
              ))}

              {/* Layer 1: NAND, OR */}
              <GateNode x={190} y={50} label="NAND" color={NAND_C} delay={0.15} />
              <GateNode x={190} y={130} label="OR" color={OR_C} delay={0.2} />
              <text x={190} y={18} textAnchor="middle" fontSize={10} fill="#999">은닉층</text>

              {/* 중간 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={228} y={38} width={30} height={18} rx={3} fill={NAND_C + '20'} stroke={NAND_C} strokeWidth={0.8} />
                <text x={243} y={51} textAnchor="middle" fontSize={10} fontWeight={700} fill={NAND_C}>1</text>
                <rect x={228} y={118} width={30} height={18} rx={3} fill={OR_C + '20'} stroke={OR_C} strokeWidth={0.8} />
                <text x={243} y={131} textAnchor="middle" fontSize={10} fontWeight={700} fill={OR_C}>1</text>
              </motion.g>

              {/* Layer 2: AND */}
              <GateNode x={340} y={90} label="AND" color={AND_C} delay={0.35} />
              <text x={340} y={60} textAnchor="middle" fontSize={10} fill="#999">출력</text>

              {/* 최종 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={378} y={78} width={40} height={24} rx={5} fill={AND_C + '20'} stroke={AND_C} strokeWidth={1.5} />
                <text x={398} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill={AND_C}>1</text>
              </motion.g>

              {/* 추적 설명 */}
              <motion.text x={230} y={170} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                (1,0) → NAND=1, OR=1 → AND(1,1) = 1 ✓ XOR 정답
              </motion.text>
            </g>
          )}
          {step === 2 && (
            <g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <rect x={40} y={20} width={380} height={55} rx={8}
                  fill={NAND_C + '10'} stroke={NAND_C} strokeWidth={1} />
                <text x={230} y={42} textAnchor="middle" fontSize={10} fill={NAND_C} fontWeight={600}>
                  NAND만으로 모든 논리 회로 구성 가능
                </text>
                <text x={230} y={60} textAnchor="middle" fontSize={9} fill={NAND_C}>
                  = 범용 계산기 (Universal Computer)
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <rect x={40} y={95} width={380} height={55} rx={8}
                  fill={AND_C + '10'} stroke={AND_C} strokeWidth={1} />
                <text x={230} y={117} textAnchor="middle" fontSize={10} fill={AND_C} fontWeight={600}>
                  퍼셉트론도 동일 — 층을 깊게 쌓으면 어떤 함수든 근사
                </text>
                <text x={230} y={135} textAnchor="middle" fontSize={9} fill={AND_C}>
                  Universal Approximation Theorem의 직관적 출발점
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
