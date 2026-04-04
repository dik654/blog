import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from "./LikelihoodVizData";

export default function LikelihoodViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={20} fontSize={9} fontWeight={600} fill={C.mle}>
                MLE: max Sum log P_theta(x_i)
              </text>
              {Array.from({ length: 15 }, (_, i) => (
                <motion.circle key={i} cx={40 + i * 26} cy={80 + Math.sin(i * 0.8) * 20} r={4}
                  fill={C.mle + '40'} stroke={C.mle} strokeWidth={1}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.03 }} />
              ))}
              {/* Fitted curve */}
              <motion.path
                d="M40,90 Q100,50 200,80 Q300,110 420,70"
                fill="none" stroke={C.mle} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }} />
              <text x={20} y={130} fontSize={9} fill={C.mle} fillOpacity={0.5}>
                KL(P* || P_theta) 최소화 = 로그 우도 최대화
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={20} fontSize={9} fontWeight={600} fill={C.ar}>
                P(x) = P(x1) * P(x2|x1) * P(x3|x1,x2) * ...
              </text>
              {['x1', 'x2', 'x3', 'x4', 'x5'].map((x, i) => (
                <motion.g key={i} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={20 + i * 80} y={40} width={65} height={30} rx={6}
                    fill={C.ar + '15'} stroke={C.ar} strokeWidth={1.5} />
                  <text x={52 + i * 80} y={59} textAnchor="middle" fontSize={9} fill={C.ar}>{x}</text>
                  {i > 0 && (
                    <motion.line x1={20 + i * 80 - 12} y1={55}
                      x2={20 + i * 80} y2={55}
                      stroke={C.ar} strokeWidth={1.5}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.2 + i * 0.06 }} />
                  )}
                </motion.g>
              ))}
              <text x={20} y={95} fontSize={9} fill={C.ar} fillOpacity={0.5}>
                순서대로 생성: 이전 토큰이 다음 토큰의 조건
              </text>
              <text x={20} y={112} fontSize={9} fill="var(--muted-foreground)">
                GPT: 트랜스포머 디코더로 P(x_t | x{'<'}t) 모델링
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'E-step', sub: 'Q(z) = P(z|x,theta)', c: C.em },
                { label: 'M-step', sub: 'theta = argmax E_Q[log P]', c: C.mle },
              ].map((item, i) => (
                <motion.g key={i} initial={{ x: i === 0 ? -10 : 10 }} animate={{ x: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <rect x={20 + i * 220} y={30} width={200} height={55} rx={10}
                    fill={item.c + '12'} stroke={item.c} strokeWidth={1.5} />
                  <text x={120 + i * 220} y={52} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={item.c}>{item.label}</text>
                  <text x={120 + i * 220} y={72} textAnchor="middle" fontSize={9}
                    fill={item.c} fillOpacity={0.6}>{item.sub}</text>
                </motion.g>
              ))}
              <motion.path d="M222,58 L238,58" stroke={C.em} strokeWidth={1.5}
                markerEnd="url(#em-arrow)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 }} />
              <motion.path d="M240,90 Q230,115 220,90" stroke={C.mle} strokeWidth={1}
                strokeDasharray="3 3" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.5 }} />
              <text x={230} y={125} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">수렴까지 반복</text>
            </motion.g>
          )}
          <defs>
            <marker id="em-arrow" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
              <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
