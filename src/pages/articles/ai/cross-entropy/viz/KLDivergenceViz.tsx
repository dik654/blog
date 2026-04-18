import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './KLDivergenceVizData';

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };
const BAR_W = 50;
const BAR_MAX = 60;

function Bar({ x, y, h, color, label, value }: {
  x: number; y: number; h: number; color: string; label: string; value: string;
}) {
  return (
    <g>
      <motion.rect x={x} y={y - h} width={BAR_W} height={h} rx={3}
        fill={`${color}30`} stroke={color} strokeWidth={1}
        initial={{ height: 0, y }} animate={{ height: h, y: y - h }}
        transition={sp} />
      <text x={x + BAR_W / 2} y={y + 12} textAnchor="middle" fontSize={9}
        className="fill-foreground" fontWeight={600}>{label}</text>
      <text x={x + BAR_W / 2} y={y - h - 5} textAnchor="middle" fontSize={9}
        fill={color} fontWeight={700}>{value}</text>
    </g>
  );
}

export default function KLDivergenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: CE = H + KL decomposition */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <Bar x={40} y={95} h={BAR_MAX} color="#ef4444" label="CE(P,Q)" value="0.51" />
              <text x={120} y={65} fontSize={14} className="fill-foreground" fontWeight={700}>=</text>
              <Bar x={150} y={95} h={1} color="#3b82f6" label="H(P)" value="0.00" />
              <text x={230} y={65} fontSize={14} className="fill-foreground" fontWeight={700}>+</text>
              <Bar x={260} y={95} h={BAR_MAX} color="#10b981" label="KL(P‖Q)" value="0.51" />
              <text x={175} y={130} textAnchor="middle" fontSize={9}
                className="fill-muted-foreground">원-핫 P=[1,0,0] → H(P)=0, CE 전부가 KL</text>
            </motion.g>
          )}

          {/* Step 1: KL numerical computation */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={20} fontSize={9} fontWeight={600} fill="#10b981">
                KL(P‖Q) = Σ P(x) · log₂(P(x)/Q(x))
              </text>
              <text x={30} y={40} fontSize={9} fill="var(--muted-foreground)">
                x=고양이: 1 × log₂(1/0.7) = 0.514
              </text>
              <text x={30} y={55} fontSize={9} fill="var(--muted-foreground)">
                x=개: 0 × log₂(0/0.2) = 0
              </text>
              <text x={30} y={70} fontSize={9} fill="var(--muted-foreground)">
                x=새: 0 × log₂(0/0.1) = 0
              </text>
              <rect x={30} y={78} width={200} height={20} rx={4}
                fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
              <text x={130} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
                KL = 0.514 bit
              </text>
              <text x={260} y={55} fontSize={9} fill="var(--muted-foreground)">
                P(x)=0인 항은 사라짐
              </text>
              <text x={260} y={70} fontSize={9} fill="#10b981" fontWeight={600}>
                → 정답 클래스만 기여
              </text>
            </motion.g>
          )}

          {/* Step 2: Asymmetry with numbers */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={15} y={12} width={175} height={48} rx={6}
                fill="#3b82f610" stroke="#3b82f6" strokeWidth={1} />
              <text x={102} y={28} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={700}>KL(P‖Q)</text>
              <text x={102} y={42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                P=[0.9,0.1], Q=[0.5,0.5]
              </text>
              <text x={102} y={55} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>= 0.368</text>

              <text x={200} y={35} fontSize={14} className="fill-foreground" fontWeight={700}>≠</text>

              <rect x={215} y={12} width={175} height={48} rx={6}
                fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
              <text x={302} y={28} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={700}>KL(Q‖P)</text>
              <text x={302} y={42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Q=[0.5,0.5], P=[0.9,0.1]
              </text>
              <text x={302} y={55} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>= 0.510</text>

              <text x={200} y={82} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                기준 분포에 따라 값이 달라짐 — 거리 함수가 아님
              </text>
            </motion.g>
          )}

          {/* Step 3: JS Divergence */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={40} y={10} width={320} height={50} rx={8}
                fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={200} y={28} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
                JS(P,Q) = (KL(P‖M) + KL(Q‖M)) / 2
              </text>
              <text x={200} y={45} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                M = (P+Q)/2 = [0.7, 0.3]
              </text>
              <text x={100} y={78} textAnchor="middle" fontSize={9} fill="#3b82f6">
                KL(P‖M) = 0.085
              </text>
              <text x={300} y={78} textAnchor="middle" fontSize={9} fill="#ef4444">
                KL(Q‖M) = 0.117
              </text>
              <rect x={130} y={88} width={140} height={22} rx={5}
                fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={200} y={103} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
                JS = 0.101
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
