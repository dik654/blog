import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const SENT = ['나는', '빠른', '갈색', '여우를', '보았다'];
const CENTER = 2;
const CTX = [0, 1, 3, 4];
const STEPS = [
  { label: 'CBOW — 주변어로 중심어 예측' },
  { label: 'Skip-gram — 중심어로 주변어 예측' },
];
const BODY = [
  '주변 4단어 평균 → "갈색" 예측',
  '"갈색" 하나로 주변 4단어 예측',
];
const IN_C = '#6366f1', OUT_C = '#f59e0b', HID_C = '#10b981';

export default function ModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const isCbow = step === 0;
        return (
          <svg viewBox="0 0 520 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* words row */}
            {SENT.map((w, i) => {
              const x = 30 + i * 72;
              const isC = i === CENTER;
              const isCx = CTX.includes(i);
              const src = isCbow ? isCx : isC;
              const c = isC ? OUT_C : IN_C;
              return (
                <g key={w}>
                  <rect x={x - 26} y={10} width={52} height={26} rx={6}
                    fill={c + (src ? '25' : '08')} stroke={c}
                    strokeWidth={src ? 2 : 1} strokeOpacity={src ? 1 : 0.25} />
                  <text x={x} y={27} textAnchor="middle" fontSize={10} fontWeight={600}
                    fill={c} fillOpacity={src ? 1 : 0.35}>{w}</text>
                </g>
              );
            })}
            {/* arrows to hidden */}
            {(isCbow ? CTX : [CENTER]).map(i => (
              <motion.line key={`a-${i}-${step}`}
                x1={30 + i * 72} y1={38} x2={200} y2={90}
                stroke={isCbow ? IN_C : OUT_C} strokeWidth={1.5} strokeOpacity={0.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }} />
            ))}
            {isCbow && (
              <text x={200} y={78} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>평균(avg)</text>
            )}
            {/* hidden layer */}
            <rect x={156} y={90} width={88} height={28} rx={6}
              fill={HID_C + '15'} stroke={HID_C} strokeWidth={1.5} />
            <text x={200} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={HID_C}>은닉층 (d=300)</text>
            {/* arrows from hidden */}
            <motion.line key={`h-${step}`} x1={200} y1={118} x2={200} y2={145}
              stroke="currentColor" strokeOpacity={0.3} strokeWidth={1}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
            {/* output */}
            <rect x={135} y={148} width={130} height={28} rx={6}
              fill={(isCbow ? OUT_C : IN_C) + '15'} stroke={isCbow ? OUT_C : IN_C} strokeWidth={1.5} />
            <text x={200} y={166} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={isCbow ? OUT_C : IN_C}>
              {isCbow ? '예측: "갈색"' : '예측: 주변 4단어'}
            </text>
          {/* inline body */}
          <motion.text x={410} y={95} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
