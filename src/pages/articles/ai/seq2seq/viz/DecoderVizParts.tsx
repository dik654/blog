import { motion } from 'framer-motion';
import { H_VEC_5, DEC_C } from './DecoderVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(', ')}]`; }

/** SVG marker defs for decoder arrows */
export function DecoderDefs({ decC, softC }: { decC: string; softC: string }) {
  return (
    <defs>
      <marker id="dec-arr" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill={decC} />
      </marker>
      <marker id="dec-arr-p" viewBox="0 0 10 10" refX={9} refY={5}
        markerWidth={5} markerHeight={5} orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill={softC} />
      </marker>
    </defs>
  );
}

/** Step 3: Autoregressive loop → second LSTM → EOS */
export function AutoregressiveStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <path d="M350,74 Q350,110 405,110 Q405,110 405,80"
        fill="none" stroke={DEC_C} strokeWidth={1} strokeDasharray="4 2"
        markerEnd="url(#dec-arr)" />
      <text x={385} y={124} textAnchor="middle" fontSize={9} fill="#999">자기회귀</text>
      <rect x={385} y={36} width={72} height={44} rx={6}
        fill={DEC_C + '15'} stroke={DEC_C} strokeWidth={1.5} />
      <text x={421} y={52} textAnchor="middle" fontSize={10}
        fill={DEC_C} fontWeight={600}>LSTM</text>
      <text x={421} y={68} textAnchor="middle" fontSize={9} fill={DEC_C}>
        h₅={fmtV(H_VEC_5)}
      </text>
      <text x={421} y={148} textAnchor="middle" fontSize={9} fill={DEC_C}>
        P(EOS)=0.85
      </text>
      <rect x={398} y={152} width={46} height={22} rx={5}
        fill={DEC_C + '10'} stroke={DEC_C} strokeWidth={1} strokeDasharray="3 2" />
      <text x={421} y={166} textAnchor="middle" fontSize={10}
        fill={DEC_C} fontWeight={500}>EOS</text>
    </motion.g>
  );
}
