import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const TRAD = [
  { label: 'Bot $0.04', color: '#ef4444' },
  { label: 'Bot $0.04', color: '#ef4444' },
  { label: 'Bot $0.03', color: '#ef4444' },
  { label: 'User $0.02', color: '#6366f1' },
  { label: 'User $0.01', color: '#6366f1' },
];
const PBH = [
  { label: 'PBH $0.02', color: '#10b981' },
  { label: 'PBH $0.01', color: '#10b981' },
  { label: 'PBH $0.01', color: '#10b981' },
  { label: 'Bot $0.04', color: '#ef4444' },
  { label: 'User $0.03', color: '#6366f1' },
];

const STEPS = [
  { label: '기존 블록 구조', body: '가스비 기준 정렬: 봇이 높은 가스비로 블록 상단을 차지합니다.' },
  { label: 'PBH 블록 구조', body: 'World ID 검증된 사용자가 블록 상단에 배치되고, 봇은 뒤로 밀립니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const BW = 110, BH = 14, SX = 10;

export default function PBHCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={SX + BW / 2} y={10} textAnchor="middle" fontSize={9} fontWeight={600}
            fill="#ef4444">Traditional Block</text>
          <text x={180 + BW / 2} y={10} textAnchor="middle" fontSize={9} fontWeight={600}
            fill="#10b981">PBH Block</text>
          {TRAD.map((t, i) => {
            const y = 16 + i * (BH + 2);
            const active = step === 1;
            return (
              <motion.g key={`t-${i}`} animate={{ opacity: active ? 1 : (step === 0 ? 1 : 0.2) }} transition={sp}>
                <rect x={SX} y={y} width={BW} height={BH} rx={3}
                  fill={t.color + '18'} stroke={t.color} strokeWidth={0.8} />
                <text x={SX + BW / 2} y={y + 10} textAnchor="middle"
                  fontSize={9} fill={t.color} fontWeight={500}>{t.label}</text>
              </motion.g>
            );
          })}
          {PBH.map((p, i) => {
            const y = 16 + i * (BH + 2);
            const active = step === 2;
            return (
              <motion.g key={`p-${i}`} animate={{ opacity: active ? 1 : (step === 0 ? 1 : 0.2) }} transition={sp}>
                <rect x={180} y={y} width={BW} height={BH} rx={3}
                  fill={p.color + '18'} stroke={p.color} strokeWidth={0.8} />
                <text x={180 + BW / 2} y={y + 10} textAnchor="middle"
                  fontSize={9} fill={p.color} fontWeight={500}>{p.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
