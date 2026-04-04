import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export function OutputPanel({ step, C }: {
  step: number; C: Record<string, string>;
}) {
  if (step < 1) return null;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ ...sp, delay: 0.3 }}>
      <rect x={270} y={15} width={130} height={80} rx={8}
        fill={step === 2 ? `${C.crash}08` : `${C.mild}08`}
        stroke={step === 2 ? C.crash : C.mild} strokeWidth={1.2} />
      <text x={335} y={32} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={step === 2 ? C.crash : C.mild}>
        모델 출력
      </text>
      {step === 1 && <>
        <text x={280} y={50} fontSize={9} fill={C.muted}>
          "정말 그럴까?"
        </text>
        <text x={280} y={64} fontSize={9} fill={C.muted}>
          "확신할 수 없음..."
        </text>
        <text x={280} y={78} fontSize={9} fill={C.mild}>
          → 회의적 톤으로 변환
        </text>
      </>}
      {step === 2 && <>
        <text x={280} y={50} fontSize={9} fill={C.crash}>
          "???...??????"
        </text>
        <text x={280} y={64} fontSize={9} fill={C.crash}>
          의미 없는 반복 출력
        </text>
        <text x={280} y={78} fontSize={9} fill={C.crash}>
          → 모델 붕괴
        </text>
      </>}
    </motion.g>
  );
}
