import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import Math from '@/components/ui/math';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '다항식의 두 가지 표현', body: '같은 다항식을 계수 또는 평가 결과로 저장할 수 있다.' },
  { label: '평가란? — x를 대입하면 값이 나온다', body: '3개의 점(x,y)을 알면 2차 다항식이 유일하게 결정된다.' },
  { label: 'NTT — 계수 ↔ 평가를 빠르게 변환', body: 'NTT/INTT로 계수 ↔ 평가를 O(n log n)에 상호 변환.' },
  { label: '곱셈 가속: O(n²) → O(n log n)', body: 'NTT → 점별 곱 O(n) → INTT. 총 O(n log n).' },
];

const BW = 120, BH = 80, LX = 15, RX = 270;
const GX = 155, GY = 110, GW = 170, GH = 50, GMAX = 20;
const gsx = (x: number) => GX + (x / 2.4) * GW;
const gsy = (y: number) => GY + GH - (y / GMAX) * GH;
function curvePath() {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = -0.1 + (2.5 * i) / 40;
    const y = 1 + 2 * x + 3 * x * x;
    pts.push(`${i === 0 ? 'M' : 'L'}${gsx(x).toFixed(1)},${gsy(y).toFixed(1)}`);
  }
  return pts.join(' ');
}

export default function PolyFFTViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => step === 0 ? (
        <div className="w-full max-w-2xl mx-auto space-y-4 py-4">
          <div className="text-center text-sm mb-2">
            <Math>{'f(x) = 1 + 2x + 3x^2'}</Math>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-2">
              <p className="font-semibold text-sm text-indigo-400">계수 표현</p>
              <div className="text-sm"><Math>{'[a_0, a_1, \\ldots, a_{n-1}]'}</Math></div>
              <p className="text-xs text-muted-foreground">
                예) <Math>{'[1,\\, 2,\\, 3]'}</Math>
              </p>
              <p className="text-xs">
                덧셈 <Math>{'O(n)'}</Math> / 곱셈 <Math>{'O(n^2)'}</Math>
              </p>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
              <p className="font-semibold text-sm text-emerald-400">평가 표현</p>
              <div className="text-sm"><Math>{'[f(x_0), f(x_1), \\ldots]'}</Math></div>
              <p className="text-xs text-muted-foreground">
                예) <Math>{'[1,\\, 6,\\, 17]'}</Math>
              </p>
              <p className="text-xs">
                점별 곱셈 <Math>{'O(n)'}</Math>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g><rect x={LX} y={15} width={BW} height={BH} rx={6}
              fill={`${C1}08`} stroke={C1} strokeWidth={0.8} />
            <text x={LX+BW/2} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C1}>계수 표현</text>
            <text x={LX+BW/2} y={50} textAnchor="middle" fontSize={9} fill={C1}>f(x) = 1 + 2x + 3x²</text>
            <text x={LX+BW/2} y={68} textAnchor="middle" fontSize={9} fill={C1}>→ [1, 2, 3]</text>
          </motion.g>
          <motion.g><rect x={RX} y={15} width={BW+60} height={BH} rx={6}
              fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
            <text x={RX+(BW+60)/2} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>평가 표현</text>
            {[{ x:0, y:1 }, { x:1, y:6 }, { x:2, y:17 }].map((p,i) => (
              <text key={i} x={RX+12+i*65} y={55} fontSize={9} fill={C2}>f({p.x})={p.y}</text>
            ))}
            <text x={RX+(BW+60)/2} y={75} textAnchor="middle" fontSize={9} fill={C2}>→ [1, 6, 17]</text>
          </motion.g>

          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }}>
            <line x1={LX+BW+15} y1={38} x2={RX-15} y2={38} stroke={C2} strokeWidth={1} />
            <polygon points={`${RX-15},35 ${RX-9},38 ${RX-15},41`} fill={C2} />
            <text x={(LX+BW+RX)/2} y={32} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>NTT</text>
            <line x1={RX-15} y1={60} x2={LX+BW+15} y2={60} stroke={C1} strokeWidth={0.8} />
            <polygon points={`${LX+BW+15},57 ${LX+BW+9},60 ${LX+BW+15},63`} fill={C1} />
            <text x={(LX+BW+RX)/2} y={74} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>INTT</text>
          </motion.g>

          {step === 1 && (
            <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
              <line x1={GX} y1={GY+GH} x2={GX+GW} y2={GY+GH} stroke="var(--muted-foreground)" strokeWidth={0.4} opacity={0.4} />
              <line x1={GX} y1={GY} x2={GX} y2={GY+GH} stroke="var(--muted-foreground)" strokeWidth={0.4} opacity={0.4} />
              <motion.path d={curvePath()} fill="none" stroke={C1} strokeWidth={1.2} opacity={0.6}
                initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.8 }} />
              {[{ x:0, y:1 },{ x:1, y:6 },{ x:2, y:17 }].map((p,i) => (
                <motion.g key={i} initial={{ opacity:0,scale:0 }} animate={{ opacity:1,scale:1 }}
                  transition={{ delay:0.5+i*0.2 }}>
                  <circle cx={gsx(p.x)} cy={gsy(p.y)} r={3.5} fill={C3} opacity={0.9} />
                  <text x={gsx(p.x)+6} y={gsy(p.y)-4} fontSize={9} fontWeight={600} fill={C3}>({p.x},{p.y})</text>
                </motion.g>
              ))}
              <text x={GX+GW/2} y={GY+GH+12} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                점 3개 → 2차 다항식 유일하게 결정
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }}>
              {[
                { x:15, text:'① NTT(f), NTT(g)', color:C2 },
                { x:175, text:'② 점별 곱 O(n)', color:C3 },
                { x:335, text:'③ INTT(결과)', color:C1 },
              ].map((s,i) => (
                <g key={i}>
                  {i > 0 && (<>
                    <line x1={s.x-20} y1={122} x2={s.x-6} y2={122} stroke="var(--muted-foreground)" strokeWidth={0.8} />
                    <polygon points={`${s.x-6},119 ${s.x},122 ${s.x-6},125`} fill="var(--muted-foreground)" />
                  </>)}
                  <rect x={s.x} y={110} width={120} height={24} rx={4} fill={`${s.color}12`} stroke={s.color} strokeWidth={0.8} />
                  <text x={s.x+60} y={126} textAnchor="middle" fontSize={9} fontWeight={500} fill={s.color}>{s.text}</text>
                </g>
              ))}
              <text x={230} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill={C3}>
                총 O(n log n) — 계수 곱셈 O(n²)보다 빠름
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
