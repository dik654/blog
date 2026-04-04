import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C, H_VECS, CTX_VEC, ATTN_WEIGHTS } from './Seq2SeqVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(',')}]`; }

export default function Seq2SeqViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Encoder hidden states */}
          {['x1', 'x2', 'x3', 'x4'].map((x, i) => (
            <motion.g key={i} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.06 }}>
              <rect x={15 + i * 52} y={50} width={44} height={38} rx={5}
                fill={C.enc + '18'} stroke={C.enc} strokeWidth={1.5} />
              <text x={37 + i * 52} y={66} textAnchor="middle" fontSize={10}
                fill={C.enc} fontWeight={600}>h{i + 1}</text>
              <text x={37 + i * 52} y={80} textAnchor="middle" fontSize={7}
                fill={C.enc}>{fmtV(H_VECS[i])}</text>
              <text x={37 + i * 52} y={44} textAnchor="middle" fontSize={9}
                fill={C.enc} fillOpacity={0.5}>{x}</text>
            </motion.g>
          ))}
          <text x={110} y={104} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={C.enc}>Encoder</text>
          {/* Context vector */}
          <motion.g animate={{ opacity: step <= 1 ? 1 : 0.3 }}>
            <rect x={225} y={50} width={55} height={38} rx={5}
              fill={step === 1 ? C.bottleneck + '20' : C.attn + '15'}
              stroke={step === 1 ? C.bottleneck : C.attn}
              strokeWidth={step === 1 ? 2 : 1.5} />
            <text x={252} y={64} textAnchor="middle" fontSize={9}
              fill={step === 1 ? C.bottleneck : C.attn}>context</text>
            <text x={252} y={78} textAnchor="middle" fontSize={7}
              fill={step === 1 ? C.bottleneck : C.attn}>{fmtV(CTX_VEC)}</text>
          </motion.g>
          {/* Decoder */}
          {['y1', 'y2', 'y3'].map((y, i) => (
            <motion.g key={`d${i}`} initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.06 }}>
              <rect x={310 + i * 52} y={50} width={44} height={38} rx={5}
                fill={C.dec + '18'} stroke={C.dec} strokeWidth={1.5} />
              <text x={332 + i * 52} y={72} textAnchor="middle" fontSize={10}
                fill={C.dec}>{y}</text>
            </motion.g>
          ))}
          <text x={362} y={104} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={C.dec}>Decoder</text>
          {/* Bottleneck */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={sp}>
              <text x={252} y={38} textAnchor="middle" fontSize={9}
                fill={C.bottleneck}>하나의 벡터로 압축 → 정보 손실</text>
              {[0, 1, 2].map(i => (
                <g key={`x-${i}`}>
                  <line x1={29 + i * 52} y1={54} x2={45 + i * 52} y2={84}
                    stroke={C.bottleneck} strokeWidth={1.5} opacity={0.4} />
                  <line x1={45 + i * 52} y1={54} x2={29 + i * 52} y2={84}
                    stroke={C.bottleneck} strokeWidth={1.5} opacity={0.4} />
                </g>
              ))}
            </motion.g>
          )}
          {/* Attention */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {ATTN_WEIGHTS.map((w, i) => (
                <motion.g key={`a${i}`}>
                  <motion.line x1={37 + i * 52} y1={50} x2={332} y2={50}
                    stroke={C.attn} strokeWidth={0.5 + w * 3} strokeOpacity={0.2 + w * 0.8}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.08 }} />
                  <rect x={27 + i * 52} y={118} width={22} height={14} rx={3}
                    fill="var(--card)" stroke={C.attn} strokeWidth={0.5} />
                  <text x={38 + i * 52} y={128} textAnchor="middle" fontSize={8}
                    fill={C.attn} fontWeight={600}>{w.toFixed(2)}</text>
                </motion.g>
              ))}
              <text x={200} y={28} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={C.attn}>Attention: 모든 h에 가중 접근</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
