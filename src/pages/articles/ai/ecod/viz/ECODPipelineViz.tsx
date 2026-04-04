import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const PTS = [
  {x:80,y:70},{x:100,y:65},{x:120,y:75},{x:140,y:60},{x:160,y:72},{x:180,y:68},
  {x:200,y:74},{x:220,y:66},{x:240,y:70},{x:260,y:63},{x:50,y:30},{x:290,y:25},
];
const ANOM = [10, 11];
const ECDF = Array.from({ length: 20 }, (_, i) => {
  const t = i / 19, y = 1 / (1 + Math.exp(-8 * (t - 0.5)));
  return { x: 60 + t * 240, y: 95 - y * 70 };
});
const ecdfPath = ECDF.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
const THRESH_Y = 40, sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  { label: '데이터 포인트 산포' },
  { label: 'ECDF 곡선 계산' },
  { label: '꼬리 확률 식별' },
  { label: '-log 변환 → 이상치 점수' },
  { label: '임계값 적용 → 이상치 탐지' },
];
const BODY = [
  '이상치가 극단에 위치',
  '경험적 ECDF 계산',
  'F(x)와 1-F(x) 꼬리 구분',
  '-log로 낮은 확률→높은 점수',
  'θ 초과 시 이상치 분류',
];

export default function ECODPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PTS.map((p, i) => {
            const isAnom = ANOM.includes(i);
            const flagged = step >= 4 && isAnom;
            return (
              <motion.circle key={i} cx={p.x} cy={p.y} r={flagged ? 5 : 3.5}
                fill={flagged ? '#ef4444' : '#3b82f6'} fillOpacity={step >= 1 ? 0.3 : 0.7}
                stroke={flagged ? '#ef4444' : 'none'} strokeWidth={flagged ? 2 : 0}
                animate={{ r: flagged ? 6 : 3.5 }} transition={sp} />
            );
          })}
          {step >= 1 && (
            <motion.path d={ecdfPath} fill="none" stroke="#6366f1" strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.7 }} />
          )}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.25 }} transition={sp}>
              <rect x={60} y={25} width={50} height={70} rx={3} fill="#10b981" />
              <text x={85} y={102} textAnchor="middle" fontSize={9} fill="#10b981" fillOpacity={4}>좌측 꼬리</text>
              <rect x={250} y={25} width={50} height={70} rx={3} fill="#f59e0b" />
              <text x={275} y={102} textAnchor="middle" fontSize={9} fill="#f59e0b" fillOpacity={4}>우측 꼬리</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={320} y={18} fontSize={9} fill="var(--muted-foreground)">-log(p) 변환</text>
              {[
                { p: 0.74, score: 0.30, anom: false },
                { p: 0.61, score: 0.49, anom: false },
                { p: 0.82, score: 0.20, anom: false },
                { p: 0.03, score: 3.51, anom: true },
                { p: 0.05, score: 3.00, anom: true },
              ].map((d, i) => (
                <g key={i}>
                  <motion.rect x={320} y={24 + i * 14} width={d.score * 10} height={8} rx={2}
                    fill={d.anom ? '#ef4444' : '#3b82f6'} fillOpacity={0.7}
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.08 }} style={{ transformOrigin: 'left' }} />
                  <text x={320 + d.score * 10 + 3} y={31 + i * 14} fontSize={7}
                    fill={d.anom ? '#ef4444' : '#3b82f6'}>
                    {d.score.toFixed(2)}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={40} y1={THRESH_Y} x2={320} y2={THRESH_Y}
                stroke="#ef4444" strokeWidth={1.2} strokeDasharray="5 3" />
              <text x={325} y={THRESH_Y + 3} fontSize={9} fill="#ef4444" fontWeight={600}>θ</text>
              <rect x={164} y={THRESH_Y - 12} width={32} height={10} rx={2} fill="var(--card)" />
              <text x={180} y={THRESH_Y - 5} textAnchor="middle" fontSize={9} fill="#ef4444">임계값</text>
            </motion.g>
          )}
          <motion.text x={370} y={55} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
