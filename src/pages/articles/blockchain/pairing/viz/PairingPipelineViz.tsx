import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, BODIES, STEPS, NODES, PIPELINE_ARROWS, TOP_LABELS } from './PairingPipelineData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export default function PairingPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 530 95" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const visible = (i <= 1 && step >= 0) || (i === 2 && step >= 1) ||
              (i === 3 && step >= 2) || (i === 4 && step >= 3) || (i === 5 && step >= 4) ||
              (i === 6 && step >= 4);
            const active = (i <= 1 && step === 0) || (i === 2 && step === 1) ||
              (i === 3 && step === 2) || (i === 4 && step === 3) ||
              ((i === 5 || i === 6) && step === 4);
            return (
              <motion.g key={n.id} animate={{ opacity: visible ? 1 : 0.1 }} transition={sp}>
                <motion.rect x={n.x} y={n.y} width={n.w} height={n.h} rx={5}
                  animate={{
                    fill: active ? `${n.c}22` : `${n.c}08`,
                    stroke: n.c, strokeWidth: active ? 1.8 : 0.5,
                  }} transition={sp} />
                <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 2} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={n.c}>{n.id}</text>
              </motion.g>
            );
          })}
          {/* Input arrows */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp}>
              <line x1={50} y1={30} x2={68} y2={38} stroke={C.g1} strokeWidth={0.7} />
              <line x1={50} y1={64} x2={68} y2={48} stroke={C.g2} strokeWidth={0.7} />
            </motion.g>
          )}
          {PIPELINE_ARROWS.map((a, i) => (
            step >= a.s && (
              <motion.line key={i} x1={a.x1} y1={42} x2={a.x2} y2={42}
                stroke={a.c} strokeWidth={0.7}
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
            )
          ))}
          {/* Loop-back arrow for line functions */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={sp}>
              <path d="M169,58 Q169,68 125,68 Q95,68 95,58"
                fill="none" stroke={C.ln} strokeWidth={0.6} strokeDasharray="2 2" />
              <text x={132} y={75} textAnchor="middle" fontSize={9} fill={C.ln}>f 누적</text>
            </motion.g>
          )}
          <text x={29} y={15} textAnchor="middle" fontSize={9} fill={C.g1}>G1</text>
          <text x={29} y={83} textAnchor="middle" fontSize={9} fill={C.g2}>G2</text>
          {TOP_LABELS.map(l => step >= l.s && (
            <motion.text key={l.t} x={l.x} y={22} textAnchor="middle" fontSize={9} fill={l.c}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>{l.t}</motion.text>))}
          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={100} y={82} width={190} height={13} rx={3} fill={`${C.gt}10`} stroke={C.gt} strokeWidth={0.5} />
              <text x={195} y={91} textAnchor="middle" fontSize={9} fill={C.gt} fontWeight={600}>e(P,Q) ∈ GT — e(aP,bQ) = e(P,Q)^(ab)</text>
            </motion.g>)}
                  <motion.text x={398} y={14} fontSize={9} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>
            {BODIES[step]?.match(/.{1,24}(\s|$)/g)?.map((line, i) => (
              <tspan key={i} x={398} dy={i === 0 ? 0 : 10}>{line.trim()}</tspan>
            ))}
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
