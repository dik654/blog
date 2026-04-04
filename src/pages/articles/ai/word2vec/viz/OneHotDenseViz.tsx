import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { OH_CAT, OH_DOG, DN_CAT, DN_DOG, CELL, GAP, STEPS, BODY } from './OneHotDenseData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function OneHotDenseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={10} y={12} fontSize={9} fontWeight={600} fill={step <= 1 ? '#ef4444' : '#666'}>One-Hot (V=8)</text>
          <text x={10} y={32} fontSize={9} fill={step <= 1 ? '#ef4444' : '#999'}>고양이</text>
          {OH_CAT.map((v, i) => (
            <motion.rect key={`oc${i}`} x={50 + i * (CELL + GAP)} y={22} width={CELL} height={CELL} rx={2}
              animate={{ fill: v ? '#ef444440' : '#80808010', stroke: v ? '#ef4444' : '#555',
                strokeWidth: v ? 2 : 0.5, opacity: step <= 1 ? 1 : 0.2 }} transition={sp} />
          ))}
          {OH_CAT.map((v, i) => (
            <text key={`ocl${i}`} x={50 + i * (CELL + GAP) + CELL / 2} y={35} textAnchor="middle" fontSize={9}
              fill={v ? '#ef4444' : '#666'} fontWeight={v ? 700 : 400} opacity={step <= 1 ? 1 : 0.2}>{v}</text>
          ))}
          <text x={10} y={52} fontSize={9} fill={step <= 1 ? '#f59e0b' : '#999'}>강아지</text>
          {OH_DOG.map((v, i) => (
            <motion.rect key={`od${i}`} x={50 + i * (CELL + GAP)} y={42} width={CELL} height={CELL} rx={2}
              animate={{ fill: v ? '#f59e0b40' : '#80808010', stroke: v ? '#f59e0b' : '#555',
                strokeWidth: v ? 2 : 0.5, opacity: step <= 1 ? 1 : 0.2 }} transition={sp} />
          ))}
          {OH_DOG.map((v, i) => (
            <text key={`odl${i}`} x={50 + i * (CELL + GAP) + CELL / 2} y={55} textAnchor="middle" fontSize={9}
              fill={v ? '#f59e0b' : '#666'} fontWeight={v ? 700 : 400} opacity={step <= 1 ? 1 : 0.2}>{v}</text>
          ))}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={214} y={30} width={80} height={18} rx={4} fill="#ef444418" stroke="#ef4444" strokeWidth={1} />
              <text x={254} y={42} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>cos sim = 0.00</text>
            </motion.g>
          )}
          <text x={10} y={82} fontSize={9} fontWeight={600} fill={step >= 2 ? '#10b981' : '#666'}>Dense (d=4)</text>
          <text x={10} y={100} fontSize={9} fill={step >= 2 ? '#10b981' : '#999'}>고양이</text>
          {DN_CAT.map((v, i) => {
            const w = Math.abs(v) * 60, x0 = 80 + i * 72;
            return (
              <motion.g key={`dc${i}`} animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={sp}>
                <rect x={x0} y={90} width={60} height={12} rx={2} fill="#80808008" stroke="#555" strokeWidth={0.5} />
                <motion.rect x={x0} y={90} width={w} height={12} rx={2}
                  animate={{ fill: v >= 0 ? '#10b98140' : '#ef444430' }} transition={sp} />
                <text x={x0 + 30} y={99} textAnchor="middle" fontSize={9} fill={step >= 2 ? '#10b981' : '#999'}>{v.toFixed(2)}</text>
              </motion.g>
            );
          })}
          <text x={10} y={118} fontSize={9} fill={step >= 2 ? '#f59e0b' : '#999'}>강아지</text>
          {DN_DOG.map((v, i) => {
            const w = Math.abs(v) * 60, x0 = 80 + i * 72;
            return (
              <motion.g key={`dd${i}`} animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={sp}>
                <rect x={x0} y={108} width={60} height={12} rx={2} fill="#80808008" stroke="#555" strokeWidth={0.5} />
                <motion.rect x={x0} y={108} width={w} height={12} rx={2}
                  animate={{ fill: v >= 0 ? '#f59e0b40' : '#ef444430' }} transition={sp} />
                <text x={x0 + 30} y={117} textAnchor="middle" fontSize={9} fill={step >= 2 ? '#f59e0b' : '#999'}>{v.toFixed(2)}</text>
              </motion.g>
            );
          })}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={80} y={126} width={208} height={16} rx={4} fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
              <text x={184} y={137} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>cos similarity = 0.91 — 매우 유사!</text>
            </motion.g>
          )}
          <motion.text x={390} y={72} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
