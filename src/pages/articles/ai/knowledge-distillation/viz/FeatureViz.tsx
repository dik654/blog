import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, C } from './FeatureVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* simplified layer block */
function LayerBlock({ x, y, w, h, color, label, opacity = 0.5 }: {
  x: number; y: number; w: number; h: number; color: string; label: string; opacity?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4}
        fill={color} opacity={opacity} />
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle"
        fontSize={7} fontWeight={600} fill="#ffffff">{label}</text>
    </g>
  );
}

export default function FeatureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Teacher/Student with intermediate layers */}
          {/* Teacher network layers */}
          <text x={100} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.teacher}>
            Teacher
          </text>
          <LayerBlock x={20} y={22} w={35} h={35} color={C.teacher} label="L1" opacity={0.4} />
          <LayerBlock x={62} y={22} w={35} h={35} color={C.teacher} label="L2" opacity={0.55} />
          <LayerBlock x={104} y={22} w={35} h={35} color={C.teacher} label="L3" opacity={0.7} />
          <LayerBlock x={146} y={22} w={35} h={35} color={C.teacher} label="Out" opacity={0.85} />

          {/* arrows between layers */}
          <line x1={55} y1={40} x2={62} y2={40} stroke={C.teacher} strokeWidth={0.6} />
          <line x1={97} y1={40} x2={104} y2={40} stroke={C.teacher} strokeWidth={0.6} />
          <line x1={139} y1={40} x2={146} y2={40} stroke={C.teacher} strokeWidth={0.6} />

          {/* Student network layers */}
          <text x={100} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.student}>
            Student
          </text>
          <LayerBlock x={30} y={97} w={30} h={30} color={C.student} label="L1" opacity={0.4} />
          <LayerBlock x={72} y={97} w={30} h={30} color={C.student} label="L2" opacity={0.55} />
          <LayerBlock x={114} y={97} w={30} h={30} color={C.student} label="Out" opacity={0.7} />

          <line x1={60} y1={112} x2={72} y2={112} stroke={C.student} strokeWidth={0.6} />
          <line x1={102} y1={112} x2={114} y2={112} stroke={C.student} strokeWidth={0.6} />

          {/* Feature transfer arrow (step 0) */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={121} y1={57} x2={87} y2={97}
                stroke={C.feature} strokeWidth={1.2} strokeDasharray="4 2" markerEnd="url(#kd-feat-arr)" />
              <text x={85} y={75} fontSize={7.5} fill={C.feature} fontWeight={600}>
                중간 표현 전달
              </text>
            </motion.g>
          )}

          {/* FitNets hint layer matching */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <rect x={210} y={10} width={130} height={65} rx={6}
                fill={`${C.feature}08`} stroke={C.feature} strokeWidth={0.8} />
              <text x={275} y={27} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.feature}>
                FitNets
              </text>
              <text x={275} y={40} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                L_hint = ∥ W_r · F_S - F_T ∥²
              </text>
              <text x={275} y={52} textAnchor="middle" fontSize={7} fill={C.muted}>
                W_r: 차원 맞춤 행렬
              </text>
              <text x={275} y={63} textAnchor="middle" fontSize={7} fill={C.muted}>
                Teacher hint → Student guided
              </text>
            </motion.g>
          )}

          {/* Attention Transfer */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <rect x={210} y={85} width={130} height={55} rx={6}
                fill={`${C.attention}08`} stroke={C.attention} strokeWidth={0.8} />
              <text x={275} y={101} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.attention}>
                Attention Transfer
              </text>
              {/* mini attention map grid */}
              {[0, 1, 2].map(r =>
                [0, 1, 2].map(c => (
                  <rect key={`at-${r}-${c}`}
                    x={232 + c * 12} y={107 + r * 10} width={10} height={8} rx={1}
                    fill={C.attention}
                    opacity={0.2 + Math.random() * 0.5} />
                ))
              )}
              <text x={305} y={115} fontSize={7} fill={C.muted}>채널 합산</text>
              <text x={305} y={126} fontSize={7} fill={C.muted}>→ L2 정규화</text>
            </motion.g>
          )}

          {/* PKT */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <rect x={210} y={150} width={130} height={55} rx={6}
                fill={`${C.pkt}08`} stroke={C.pkt} strokeWidth={0.8} />
              <text x={275} y={167} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.pkt}>
                PKT
              </text>
              <text x={275} y={180} textAnchor="middle" fontSize={7.5} fill={C.muted}>
                Feature → 확률 분포 변환
              </text>
              <text x={275} y={192} textAnchor="middle" fontSize={7} fill={C.muted}>
                KL(p_T ∥ p_S) 최소화
              </text>
            </motion.g>
          )}

          {/* Comparison table */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={360} y={10} width={110} height={115} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={415} y={27} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--foreground)">
                비교
              </text>
              {/* header line */}
              <line x1={365} y1={32} x2={465} y2={32} stroke="var(--border)" strokeWidth={0.3} />

              <circle cx={375} cy={45} r={4} fill={C.feature} opacity={0.6} />
              <text x={385} y={48} fontSize={7} fill="var(--foreground)">Logit — 단순</text>

              <circle cx={375} cy={63} r={4} fill={C.feature} opacity={0.8} />
              <text x={385} y={66} fontSize={7} fill="var(--foreground)">Feature — 풍부</text>

              <circle cx={375} cy={81} r={4} fill={C.attention} opacity={0.7} />
              <text x={385} y={84} fontSize={7} fill="var(--foreground)">Attention — 균형</text>

              <circle cx={375} cy={99} r={4} fill={C.pkt} opacity={0.7} />
              <text x={385} y={102} fontSize={7} fill="var(--foreground)">PKT — 구조 보존</text>

              <text x={415} y={120} textAnchor="middle" fontSize={7} fill={C.muted}>
                조합 시 성능 극대화
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="kd-feat-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.feature} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
