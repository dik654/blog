import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'SME 아키텍처' },
  { label: 'C-bit 페이지 테이블' },
  { label: 'SME 선택적 암호화' },
  { label: 'TME 전체 암호화' },
];

const ANNOT = ['SME 메모리 암호화 아키텍처', 'C-bit 페이지별 암호화 선택', 'C-bit=1만 AES-128 암호화', 'TME 전체 메모리 단일 키'];
const SME_CHAIN = [
  { label: 'App', color: '#6366f1' },
  { label: 'OS', color: '#0ea5e9' },
  { label: '페이지 테이블', color: '#10b981' },
  { label: 'SME 엔진', color: '#f59e0b' },
  { label: '암호화 DRAM', color: '#ef4444' },
];

const TME_CHAIN = [
  { label: 'App', color: '#6366f1' },
  { label: 'OS', color: '#0ea5e9' },
  { label: 'TME 모드', color: '#8b5cf6' },
  { label: '암호화 DRAM', color: '#ef4444' },
];

export default function SMEArchitectureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showTME = step === 3;
        const chain = showTME ? TME_CHAIN : SME_CHAIN;
        const visCount = showTME ? 4 : step === 0 ? 5 : step === 1 ? 3 : 5;
        return (
          <svg viewBox="0 0 520 55" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {chain.map((n, i) => {
              const show = i < visCount;
              const w = showTME ? 90 : 75;
              const x = showTME ? 15 + i * 100 : 5 + i * 83;
              const glow = show && (
                (step === 0 && n.label === 'SME 엔진') ||
                (step === 1 && n.label === '페이지 테이블') ||
                (step === 2 && n.label === 'SME 엔진') ||
                (step === 3 && n.label === 'TME 모드')
              );
              return (
                <motion.g key={i} animate={{ opacity: show ? 1 : 0.08 }}>
                  {i > 0 && (
                    <motion.line x1={x - 5} y1={28} x2={x + 2} y2={28}
                      stroke="#888" strokeWidth={1} strokeDasharray="3 2"
                      animate={{ opacity: show ? 0.7 : 0 }} />
                  )}
                  <motion.rect x={x + 2} y={10} width={w - 4} height={34} rx={6}
                    animate={{
                      fill: `${n.color}${show ? '20' : '08'}`,
                      stroke: n.color,
                      strokeWidth: glow ? 2.2 : show ? 1.2 : 0.5,
                    }} />
                  <text x={x + w / 2} y={31} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
                  {step === 1 && n.label === '페이지 테이블' && (
                    <motion.text x={x + w / 2} y={44} textAnchor="middle" fontSize={10}
                      fill="#10b981" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>C-bit = 1</motion.text>
                  )}
                </motion.g>
              );
            })}
                    <motion.text x={425} y={28} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
