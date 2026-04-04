import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { baby: '#6366f1', giant: '#f59e0b', ok: '#10b981', hi: '#ef4444' };

// 3^x mod 17 for x=0..15
const GX = [1, 3, 9, 10, 13, 5, 15, 11, 16, 14, 8, 7, 4, 12, 2, 6];

const STEPS = [
  { label: '16개를 4×4로 분할하면 왜 빨라지는가?', body: 'BSGS는 첫 줄만 저장하고 나머지는 대조 → 최대 8번.' },
  { label: '① Baby-step — 첫 줄을 저장', body: '첫 줄 {1,3,9,10}을 사전처럼 저장 → 즉시 조회 가능.' },
  { label: '② Giant-step — y를 변환해서 첫 줄에서 찾기', body: 'y÷g⁴로 한 줄씩 올리며 Baby 테이블에서 매칭을 찾는다.' },
  { label: '③ 결과: x = i·4 + j = 5', body: 'i=1, j=1 → x=5. 저장 4 + 대조 1 = 5번으로 해결.' },
];

const CW = 30, CH = 28, GXO = 60, GYO = 22;
const gx = (j: number) => GXO + j * CW;
const gy = (i: number) => GYO + i * CH;
const RX = 220; // right panel x

function Grid({ step }: { step: number }) {
  return (
    <g>
      {[0, 1, 2, 3].map(j => (
        <text key={`j${j}`} x={gx(j) + CW / 2} y={GYO - 6} textAnchor="middle"
          fontSize={9} fill={C.baby}>j={j}</text>
      ))}
      {[0, 1, 2, 3].map(i => (
        <g key={`r${i}`}>
          <text x={gx(4) + 8} y={gy(i) + CH / 2 + 3} fontSize={9} fill={C.giant}>i={i}</text>
          {[0, 1, 2, 3].map(j => {
            const v = GX[i * 4 + j];
            const isTarget = v === 5 && step >= 2;
            const isBaby = i === 0;
            const isMatch = step >= 2 && isBaby && v === 3;
            return (
              <g key={`${i}${j}`}>
                <rect x={gx(j)} y={gy(i)} width={CW - 2} height={CH - 2} rx={3}
                  fill={isTarget ? `${C.ok}30` : isMatch ? `${C.ok}25`
                    : isBaby ? `${C.baby}18` : `${C.giant}08`}
                  stroke={isTarget || isMatch ? C.ok : isBaby ? C.baby : C.giant}
                  strokeWidth={isTarget || isMatch ? 1.5 : 0.4} />
                <text x={gx(j) + CW / 2 - 1} y={gy(i) + CH / 2 + 4} textAnchor="middle"
                  fontSize={9} fontWeight={isTarget || isMatch ? 600 : 400}
                  fill={isTarget || isMatch ? C.ok : isBaby ? C.baby : C.giant}>{v}</text>
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
}

export default function BabyGiantViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="-20 0 580 240" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          {/* Step 0 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={12} fontSize={9} fontWeight={600} fill={C.hi}>전수 탐색</text>
              {GX.map((v, i) => (
                <g key={i}>
                  <rect x={20 + i * 26} y={18} width={24} height={28} rx={3}
                    fill={v === 5 ? `${C.ok}20` : `${C.hi}10`}
                    stroke={v === 5 ? C.ok : C.hi} strokeWidth={v === 5 ? 1 : 0.4} />
                  <text x={32 + i * 26} y={29} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">x={i}</text>
                  <text x={32 + i * 26} y={41} textAnchor="middle" fontSize={9}
                    fontWeight={v === 5 ? 600 : 400} fill={v === 5 ? C.ok : C.hi}>{v}</text>
                </g>
              ))}
              <text x={228} y={60} textAnchor="middle" fontSize={9} fill={C.hi}>
                y=5를 찾을 때까지 하나씩 → 최대 16번
              </text>
              <text x={20} y={80} fontSize={9} fontWeight={600} fill={C.ok}>BSGS — 같은 값을 4×4로</text>
              <g transform="translate(0, 76)">
                <Grid step={0} />
                <text x={RX + 10} y={gy(0) + 14} fontSize={9} fontWeight={500} fill={C.baby}>← 이 줄만 저장 (4번)</text>
                <text x={RX + 10} y={gy(2) + 14} fontSize={9} fontWeight={500} fill={C.giant}>← 나머지는 대조 (최대 4번)</text>
                <text x={RX + 10} y={gy(3) + CH + 6} fontSize={10} fontWeight={600} fill={C.ok}>= 최대 8번</text>
              </g>
            </motion.g>
          )}

          {/* Steps 1-3 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Grid step={step} />

              {step === 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {/* Labels on grid cells */}
                  {[
                    { j: 0, v: '1' }, { j: 1, v: '3' }, { j: 2, v: '9' }, { j: 3, v: '10' },
                  ].map((e, idx) => (
                    <motion.text key={idx} x={gx(e.j) + CW / 2 - 1} y={gy(0) + CH + 8}
                      textAnchor="middle" fontSize={9} fill={C.baby}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + idx * 0.1 }}>
                      →j={idx}
                    </motion.text>
                  ))}
                  {/* Right panel */}
                  <rect x={RX} y={gy(0) - 8} width={330} height={68} rx={5}
                    fill={`${C.baby}10`} stroke={C.baby} strokeWidth={0.8} />
                  <text x={RX + 165} y={gy(0) + 12} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={C.baby}>사전에 저장:</text>
                  <text x={RX + 165} y={gy(0) + 30} textAnchor="middle" fontSize={9} fill={C.baby}>
                    1→j=0,  3→j=1,  9→j=2,  10→j=3
                  </text>
                  <text x={RX + 165} y={gy(0) + 48} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">"3이 있나?" → 즉시 "j=1"</text>
                </motion.g>
              )}

              {step >= 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Row relationship: ×13 ↓ / ÷13 ↑ left of grid */}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <line x1={16} y1={gy(0) + CH - 2} x2={16} y2={gy(1) + 2}
                      stroke={C.giant} strokeWidth={0.8} />
                    <polygon points={`13,${gy(1)} 16,${gy(1) + 4} 19,${gy(1)}`} fill={C.giant} />
                    <text x={10} y={gy(0) + CH + 8} textAnchor="end" fontSize={9} fill={C.giant}>×13</text>
                    <line x1={38} y1={gy(1) + 2} x2={38} y2={gy(0) + CH - 2}
                      stroke={C.ok} strokeWidth={0.8} />
                    <polygon points={`35,${gy(0) + CH} 38,${gy(0) + CH - 4} 41,${gy(0) + CH}`} fill={C.ok} />
                    <text x={44} y={gy(0) + CH + 8} fontSize={9} fill={C.ok}>÷13</text>
                  </motion.g>
                  {/* Right side explanation */}
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <rect x={RX} y={gy(0) - 2} width={270} height={20} rx={4}
                      fill={`${C.hi}10`} stroke={C.hi} strokeWidth={0.6} />
                    <text x={RX + 135} y={gy(0) + 12} textAnchor="middle" fontSize={9} fill={C.hi}>
                      y=5가 첫 줄 {'{'}1,3,9,10{'}'}에 있나? → 없음 ✗
                    </text>
                  </motion.g>
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <rect x={RX} y={gy(1) - 2} width={270} height={44} rx={4}
                      fill={`${C.ok}10`} stroke={C.ok} strokeWidth={0.8} />
                    <text x={RX + 135} y={gy(1) + 14} textAnchor="middle" fontSize={10} fill={C.ok}>
                      5 ÷13 = 5×4 mod 17 = 3 (한 줄 위로)
                    </text>
                    <text x={RX + 135} y={gy(1) + 34} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ok}>
                      3이 첫 줄에 있다! j=1 ✓
                    </text>
                  </motion.g>
                </motion.g>
              )}

              {step === 3 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <rect x={RX} y={gy(3) - 2} width={270} height={38} rx={6}
                    fill={C.ok} stroke={C.ok} strokeWidth={1} />
                  <text x={RX + 135} y={gy(3) + 14} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill="#fff">i=1, j=1 → x = 1·4 + 1 = 5 ✓</text>
                  <text x={RX + 135} y={gy(3) + 30} textAnchor="middle" fontSize={9}
                    fill="#fff" opacity={0.8}>저장 4 + 대조 1 = 5번 (전수 탐색 16번)</text>
                </motion.g>
              )}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
