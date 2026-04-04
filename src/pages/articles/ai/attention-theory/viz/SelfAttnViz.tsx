import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C, X_VEC, QKV_ITEMS, MASK_SCORES } from './SelfAttnVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(', ')}]`; }

export default function SelfAttnViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={175} y={8} width={100} height={28} rx={6}
                fill="#64748b10" stroke="#64748b" strokeWidth={1.5} />
              <text x={225} y={20} textAnchor="middle" fontSize={9} fill="#64748b">x (input)</text>
              <text x={225} y={32} textAnchor="middle" fontSize={9}
                fill="#64748b" fontWeight={600}>{fmtV(X_VEC)}</text>
              {QKV_ITEMS.map((item, i) => (
                <motion.g key={i} initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.12 }}>
                  <motion.line x1={225} y1={38} x2={item.x + 55} y2={56}
                    stroke={item.c} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }} />
                  <text x={item.x + 55} y={54} textAnchor="middle" fontSize={8}
                    fill={item.c} opacity={0.6}>×W</text>
                  <rect x={item.x} y={58} width={110} height={36} rx={6}
                    fill={item.c + '18'} stroke={item.c} strokeWidth={1.5} />
                  <text x={item.x + 55} y={74} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={item.c}>{item.label} = {fmtV(item.vec)}</text>
                  <text x={item.x + 55} y={88} textAnchor="middle" fontSize={9}
                    fill={item.c} fillOpacity={0.5}>{item.desc}</text>
                </motion.g>
              ))}
              <motion.text x={145} y={114} textAnchor="middle" fontSize={9} fill="#64748b"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                Q·K = 0.7×0.5 + 0.3×0.6 = 0.53
              </motion.text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2, 3].map(h => (
                <motion.g key={h} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  style={{ transformOrigin: `${55 + h * 100}px 40px` }}
                  transition={{ delay: h * 0.08 }}>
                  <rect x={12 + h * 100} y={14} width={88} height={48} rx={8}
                    fill={C.q + '10'} stroke={C.q} strokeWidth={1.5} />
                  <text x={56 + h * 100} y={32} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={C.q}>Head {h}</text>
                  <text x={56 + h * 100} y={48} textAnchor="middle" fontSize={9}
                    fill={C.q} fillOpacity={0.5}>d_k = d/h</text>
                </motion.g>
              ))}
              <motion.rect x={80} y={78} width={260} height={28} rx={8}
                fill={C.v + '20'} stroke={C.v} strokeWidth={1.5}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                style={{ transformOrigin: '210px 92px' }} transition={{ delay: 0.4 }} />
              <text x={210} y={96} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C.v}>Concat(H0..H3) × W_o</text>
              <text x={210} y={120} textAnchor="middle" fontSize={9} fill="#64748b">
                각 헤드 출력을 이어 붙인 뒤 투영 → 원래 차원 복원
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={16} fontSize={10} fontWeight={600}
                fill="var(--foreground)">Causal Mask (4×4)</text>
              {MASK_SCORES.map((row, r) =>
                row.map((v, c) => {
                  const masked = c > r;
                  return (
                    <g key={`${r}-${c}`}>
                      <rect x={30 + c * 42} y={24 + r * 26} width={36} height={20} rx={3}
                        fill={masked ? '#ef444418' : C.k + '18'}
                        stroke={masked ? '#ef4444' : C.k} strokeWidth={masked ? 1 : 1.5} />
                      <text x={48 + c * 42} y={38 + r * 26} textAnchor="middle" fontSize={9}
                        fill={masked ? '#ef4444' : C.k} fontWeight={masked ? 400 : 500}>
                        {masked ? '-inf' : v.toFixed(1)}
                      </text>
                    </g>
                  );
                })
              )}
              <text x={210} y={42} fontSize={9} fill="var(--muted-foreground)">
                미래 위치는 -inf → softmax 후 0
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
