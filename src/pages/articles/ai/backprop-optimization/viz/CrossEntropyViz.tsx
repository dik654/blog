import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, CURVE, toSvg } from './crossEntropyData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function CrossEntropyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const pts = CURVE.map(toSvg);
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
        const current = toSvg([0.09, 2.41]);
        const perfect = toSvg([1.0, 0.0]);
        return (
          <svg viewBox="0 0 460 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <line x1={80} y1={20} x2={80} y2={120} stroke="var(--border)" strokeWidth={0.8} />
            <line x1={80} y1={120} x2={350} y2={120} stroke="var(--border)" strokeWidth={0.8} />
            <text x={215} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">정답 클래스 확률 →</text>
            <text x={55} y={70} fontSize={9} fill="var(--muted-foreground)" transform="rotate(-90 55 70)">Loss</text>
            <path d={d} fill="none" stroke="#8b5cf6" strokeWidth={1.5} opacity={0.8} />

            {step >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <circle cx={current.x} cy={current.y} r={5} fill="#ef444430" stroke="#ef4444" strokeWidth={1.2} />
                <line x1={current.x} y1={current.y} x2={current.x} y2={120} stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={current.x} y={current.y - 8} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">L=2.41</text>
                <text x={current.x + 5} y={126} fontSize={9} fill="#ef4444">0.09</text>
              </motion.g>
            )}
            {step >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <circle cx={perfect.x} cy={perfect.y} r={5} fill="#10b98130" stroke="#10b981" strokeWidth={1.2} />
                <text x={perfect.x - 10} y={perfect.y - 8} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">L=0</text>
                <text x={perfect.x} y={126} fontSize={9} fill="#10b981">1.0</text>
              </motion.g>
            )}

            <rect x={360} y={30} width={90} height={70} rx={6} fill="color-mix(in oklch, var(--muted) 8%, transparent)" stroke="var(--border)" strokeWidth={0.6} />
            <text x={405} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">L = -log(y)</text>
            <text x={405} y={64} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">y=정답 확률</text>
            <text x={405} y={78} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">y↑ → L↓</text>
            <text x={405} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">y↓ → L↑↑</text>
          </svg>
        );
      }}
    </StepViz>
  );
}
