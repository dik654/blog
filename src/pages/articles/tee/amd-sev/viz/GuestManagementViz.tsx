import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'QEMU/KVM', color: '#6366f1' },
  { label: 'KVM 모듈', color: '#0ea5e9' },
  { label: 'PSP', color: '#f59e0b' },
  { label: 'ASID 할당', color: '#10b981' },
  { label: '키 생성', color: '#8b5cf6' },
  { label: '게스트 VM', color: '#ef4444' },
];

const STEPS = [
  { label: '런치 시작' },
  { label: 'ASID & 키 할당' },
  { label: '메모리 암호화' },
  { label: '런치 완료' },
];


const ANNOT = ['LAUNCH_START PSP 요청', 'ASID+VEK 키 할당', 'UPDATE_DATA 페이지 암호화', 'FINISH 런치 완료+실행'];
const visCount = (step: number) => [3, 5, 6, 6][step];
const glowIdx = (step: number) => [2, 3, 5, 5][step];

export default function GuestManagementViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const cnt = visCount(step);
        const gi = glowIdx(step);
        return (
          <svg viewBox="0 0 500 80" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {NODES.map((n, i) => {
              const show = i < cnt;
              const x = 5 + i * 66;
              const row = i >= 3 ? 1 : 0;
              const xp = row === 1 ? 5 + (i - 3) * 130 + 66 : x;
              const yp = row === 1 ? 46 : 8;
              return (
                <motion.g key={i} animate={{ opacity: show ? 1 : 0.08 }}>
                  {i > 0 && i < 3 && (
                    <motion.line x1={xp - 6} y1={yp + 15} x2={xp} y2={yp + 15}
                      stroke="#888" strokeWidth={1} strokeDasharray="3 2"
                      animate={{ opacity: show ? 0.7 : 0 }} />
                  )}
                  {i === 3 && (
                    <motion.line x1={5 + 2 * 66 + 40} y1={38} x2={xp + 30} y2={46}
                      stroke="#888" strokeWidth={1} strokeDasharray="3 2"
                      animate={{ opacity: show ? 0.7 : 0 }} />
                  )}
                  {i === 4 && (
                    <motion.line x1={5 + 2 * 66 + 50} y1={38} x2={xp + 30} y2={46}
                      stroke="#888" strokeWidth={1} strokeDasharray="3 2"
                      animate={{ opacity: show ? 0.7 : 0 }} />
                  )}
                  {i === 5 && (
                    <motion.line x1={5 + 2 * 66 + 45} y1={38} x2={xp + 30} y2={46}
                      stroke="#888" strokeWidth={1} strokeDasharray="3 2"
                      animate={{ opacity: show ? 0.7 : 0 }} />
                  )}
                  <motion.rect x={xp} y={yp} width={60} height={30} rx={6}
                    animate={{
                      fill: `${n.color}${show ? '20' : '08'}`,
                      stroke: n.color,
                      strokeWidth: i === gi ? 2.2 : show ? 1.2 : 0.5,
                    }} />
                  <text x={xp + 30} y={yp + 19} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
            {step >= 2 && (
              <motion.text x={200} y={42} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                {step === 2 ? 'UPDATE_DATA' : 'FINISH'}
              </motion.text>
            )}
                    <motion.text x={405} y={40} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
