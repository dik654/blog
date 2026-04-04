import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { main: '#10b981', sub: '#6366f1', result: '#f59e0b' };
const STEPS = [
  { label: 'NTT 나비 연산 구조' },
  { label: 'Cooley-Tukey 분할' },
  { label: 'INTT (역변환)' },
];

const N = 8;
const LX = 30, RX = 260, SY = 15, DY = 15;

export default function ButterflyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Single butterfly */}
              <text x={120} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={C.main}>나비(Butterfly) 연산</text>
              <circle cx={60} cy={50} r={12} fill={C.main + '15'} stroke={C.main} strokeWidth={1.5} />
              <text x={60} y={53} textAnchor="middle" fontSize={9} fill={C.main}>a</text>
              <circle cx={60} cy={100} r={12} fill={C.sub + '15'} stroke={C.sub} strokeWidth={1.5} />
              <text x={60} y={103} textAnchor="middle" fontSize={9} fill={C.sub}>b</text>
              <motion.line x1={74} y1={50} x2={156} y2={50} stroke={C.main} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={74} y1={100} x2={156} y2={100} stroke={C.sub} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <motion.line x1={74} y1={50} x2={156} y2={100} stroke={C.main} strokeWidth={1} strokeOpacity={0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
              <motion.line x1={74} y1={100} x2={156} y2={50} stroke={C.sub} strokeWidth={1} strokeOpacity={0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
              <text x={115} y={68} textAnchor="middle" fontSize={9} fill={C.result}>*w</text>
              <circle cx={170} cy={50} r={12} fill={C.result + '15'} stroke={C.result} strokeWidth={1.5} />
              <text x={170} y={53} textAnchor="middle" fontSize={9} fill={C.result}>a+wb</text>
              <circle cx={170} cy={100} r={12} fill={C.result + '15'} stroke={C.result} strokeWidth={1.5} />
              <text x={170} y={103} textAnchor="middle" fontSize={9} fill={C.result}>a-wb</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={12} fontSize={9} fontWeight={600} fill={C.main}>
                Cooley-Tukey: log({N}) = 3단계
              </text>
              {Array.from({ length: N }, (_, i) => (
                <g key={i}>
                  <circle cx={LX} cy={SY + i * DY + 10} r={5} fill={C.sub + '20'} stroke={C.sub} strokeWidth={1} />
                  <text x={LX} y={SY + i * DY + 13} textAnchor="middle" fontSize={9} fill={C.sub}>a{i}</text>
                  <circle cx={RX} cy={SY + i * DY + 10} r={5} fill={C.result + '20'} stroke={C.result} strokeWidth={1} />
                  <text x={RX} y={SY + i * DY + 13} textAnchor="middle" fontSize={9} fill={C.result}>A{i}</text>
                </g>
              ))}
              {[0, 1, 2].map(stage => {
                const gap = 1 << stage;
                const sx = LX + 20 + stage * 75;
                return Array.from({ length: N / 2 }, (_, k) => {
                  const block = Math.floor(k / gap);
                  const pos = k % gap;
                  const top = block * gap * 2 + pos;
                  const bot = top + gap;
                  return (
                    <motion.line key={`${stage}-${k}`}
                      x1={sx} y1={SY + top * DY + 10}
                      x2={sx + 60} y2={SY + bot * DY + 10}
                      stroke={C.main} strokeWidth={0.8} strokeOpacity={0.3}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: stage * 0.2 + k * 0.02 }} />
                  );
                });
              })}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['NTT', 'pointwise *', 'INTT'].map((label, i) => (
                <motion.g key={i} initial={{ y: -8 }} animate={{ y: 0 }} transition={{ delay: i * 0.15 }}>
                  <rect x={20 + i * 150} y={30} width={120} height={40} rx={8}
                    fill={[C.main, C.result, C.sub][i] + '15'}
                    stroke={[C.main, C.result, C.sub][i]} strokeWidth={1.5} />
                  <text x={80 + i * 150} y={54} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={[C.main, C.result, C.sub][i]}>{label}</text>
                </motion.g>
              ))}
              {[0, 1].map(i => (
                <line key={`ar${i}`} x1={142 + i * 150} y1={50} x2={168 + i * 150} y2={50}
                  stroke="var(--muted-foreground)" strokeWidth={1.5} />
              ))}
              <text x={240} y={95} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                다항식 곱셈: NTT → 점별 곱 → INTT = O(n log n)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
