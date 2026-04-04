import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Input */}
          <rect x={10} y={20} width={80} height={80} rx={6}
            fill={`${C.enc}10`} stroke={C.enc} strokeWidth={1.2} />
          <text x={50} y={55} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.enc}>
            입력 (n차원)
          </text>
          <text x={50} y={70} textAnchor="middle" fontSize={9} fill={C.muted}>
            200쪽 원고
          </text>

          {/* Encoder arrow */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={90} y1={60} x2={145} y2={60}
                stroke={C.enc} strokeWidth={1} markerEnd="url(#ae-arr-enc)" />
              <rect x={100} y={35} width={50} height={28} rx={4}
                fill={`${C.enc}15`} stroke={C.enc} strokeWidth={1} />
              <text x={125} y={53} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.enc}>인코더</text>
            </motion.g>
          )}

          {/* Latent space */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <rect x={155} y={30} width={70} height={60} rx={8}
                fill={`${C.lat}15`} stroke={C.lat} strokeWidth={1.2}
                strokeDasharray="4 2" />
              <text x={190} y={55} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.lat}>잠재 공간</text>
              <text x={190} y={70} textAnchor="middle" fontSize={9} fill={C.muted}>
                k차원 (k{'<<'}n)
              </text>
            </motion.g>
          )}

          {/* Decoder arrow + block */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={225} y1={60} x2={280} y2={60}
                stroke={C.dec} strokeWidth={1} markerEnd="url(#ae-arr-dec)" />
              <rect x={240} y={35} width={50} height={28} rx={4}
                fill={`${C.dec}15`} stroke={C.dec} strokeWidth={1} />
              <text x={265} y={53} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.dec}>디코더</text>

              {/* Output */}
              <rect x={290} y={20} width={80} height={80} rx={6}
                fill={`${C.dec}10`} stroke={C.dec} strokeWidth={1.2} />
              <text x={330} y={55} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.dec}>출력 (n차원)</text>
              <text x={330} y={70} textAnchor="middle" fontSize={9} fill={C.muted}>
                복원된 책
              </text>

              {/* Loss label */}
              <text x={390} y={56} fontSize={9} fill={C.muted}>
                입력 ≈ 출력
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="ae-arr-enc" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.enc} />
            </marker>
            <marker id="ae-arr-dec" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={C.dec} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
