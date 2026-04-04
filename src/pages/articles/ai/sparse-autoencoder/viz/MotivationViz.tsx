import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './MotivationVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function MotivationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Black box */}
          <motion.rect x={160} y={30} width={100} height={60} rx={10}
            fill={step === 0 ? '#1e1e2e' : `${C.box}22`}
            stroke={step === 0 ? '#444' : C.box} strokeWidth={2}
            animate={{ fill: step === 0 ? '#1e1e2e' : `${C.box}22` }} transition={sp} />
          <text x={210} y={56} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={step === 0 ? '#888' : C.box}>LLM</text>
          <text x={210} y={70} textAnchor="middle" fontSize={9}
            fill={step === 0 ? '#555' : C.muted}>
            {step === 0 ? '내부 불투명' : '내부 분석 중'}
          </text>

          {/* Step 0: question marks */}
          {step === 0 && <>
            <text x={185} y={82} fontSize={9} fill="#555">?</text>
            <text x={210} y={82} fontSize={9} fill="#555">?</text>
            <text x={235} y={82} fontSize={9} fill="#555">?</text>
          </>}

          {/* Step 1: extracted features */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {['의심', '도시', '감정'].map((f, i) => (
                <g key={f}>
                  <motion.rect x={300 + i * 36} y={35 + i * 15} width={30} height={16} rx={4}
                    fill={`${C.feat}22`} stroke={C.feat} strokeWidth={1.2}
                    initial={{ x: 210 }} animate={{ x: 300 + i * 36 }}
                    transition={{ ...sp, delay: i * 0.1 }} />
                  <motion.text x={315 + i * 36} y={46 + i * 15} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={C.feat}
                    initial={{ x: 225 }} animate={{ x: 315 + i * 36 }}
                    transition={{ ...sp, delay: i * 0.1 }}>{f}</motion.text>
                </g>
              ))}
              <motion.line x1={260} y1={55} x2={298} y2={42}
                stroke={C.feat} strokeWidth={1} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ delay: 0.3 }} />
            </motion.g>
          )}

          {/* Step 2: steering dial */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={35} width={90} height={50} rx={6}
                fill={`${C.steer}11`} stroke={C.steer} strokeWidth={1.2} />
              <text x={75} y={50} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={C.steer}>강도 조절</text>
              <line x1={50} y1={65} x2={110} y2={65}
                stroke={C.steer} strokeWidth={2} strokeLinecap="round" />
              <motion.circle cx={50} cy={65} r={4} fill={C.steer}
                animate={{ cx: 95 }} transition={{ duration: 0.8 }} />
              <text x={75} y={78} textAnchor="middle" fontSize={9}
                fill={C.muted}>0 → 100</text>
              <motion.line x1={120} y1={60} x2={158} y2={55}
                stroke={C.steer} strokeWidth={1} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ delay: 0.3 }} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
