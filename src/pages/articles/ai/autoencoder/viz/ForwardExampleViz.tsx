import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './ForwardExampleVizData';
import { InputNodes, OutputNodes } from './ForwardExampleNodes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function ForwardExampleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <InputNodes />

          {/* Encoder weights */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={56} y1={40} x2={140} y2={65}
                stroke={C.enc} strokeWidth={1} />
              <text x={85} y={42} fontSize={9} fill={C.enc}>w=0.5</text>
              <line x1={56} y1={95} x2={140} y2={65}
                stroke={C.enc} strokeWidth={1} />
              <text x={85} y={92} fontSize={9} fill={C.enc}>w=0.3</text>
            </motion.g>
          )}

          {/* Summation */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={140} y={50} width={60} height={30} rx={4}
                fill={`${C.enc}12`} stroke={C.enc} strokeWidth={1} />
              <text x={170} y={63} textAnchor="middle" fontSize={9}
                fill={C.enc}>0.5x0.8+0.3x0.4</text>
              <text x={170} y={75} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.enc}>= 0.52</text>
            </motion.g>
          )}

          {/* Latent node */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <line x1={200} y1={65} x2={230} y2={65}
                stroke={C.lat} strokeWidth={1} />
              <circle cx={250} cy={65} r={18} fill={`${C.lat}18`}
                stroke={C.lat} strokeWidth={1.2} strokeDasharray="4 2" />
              <text x={250} y={62} textAnchor="middle" fontSize={9}
                fontWeight={500} fill={C.lat}>z</text>
              <text x={250} y={74} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.lat}>0.627</text>
            </motion.g>
          )}

          {/* Decoder weights */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={268} y1={60} x2={330} y2={40}
                stroke={C.dec} strokeWidth={1} />
              <text x={310} y={38} fontSize={9} fill={C.dec}>w=0.6</text>
              <line x1={268} y1={70} x2={330} y2={95}
                stroke={C.dec} strokeWidth={1} />
              <text x={310} y={95} fontSize={9} fill={C.dec}>w=0.7</text>
            </motion.g>
          )}

          {step >= 4 && <OutputNodes />}
        </svg>
      )}
    </StepViz>
  );
}
