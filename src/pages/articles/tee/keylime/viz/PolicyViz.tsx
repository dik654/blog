import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'TPM 정책: PCR 허용 값 정의' },
  { label: '런타임 정책: JSON 스키마 기반 허용 목록' },
  { label: '제외 패턴: 정규식 기반 파일 필터링' },
  { label: '정책 캐시: 에이전트별 글로벌 캐시' },
  { label: '실패 처리: 철회 메시지 & 액션 트리거' },
];

const ANNOT = ['PCR 번호별 기대 해시 정의', 'JSON 스키마 허용 목록', '정규식 파일 제외 필터링', '에이전트별 글로벌 정책 캐시', '위반 시 철회 액션 트리거'];
const BLOCKS = [
  { label: 'TPM Policy', color: '#6366f1' },
  { label: 'Runtime Policy', color: '#10b981' },
  { label: 'Excludes', color: '#f59e0b' },
  { label: 'Cache', color: '#3b82f6' },
  { label: 'Revocation', color: '#ef4444' },
];

export default function PolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BLOCKS.map((b, i) => {
            const x = 20 + i * 72;
            const active = i === step;
            return (
              <g key={b.label}>
                <motion.rect x={x} y={30} width={64} height={40} rx={8}
                  fill={active ? `${b.color}22` : `${b.color}08`}
                  stroke={active ? b.color : `${b.color}30`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ y: active ? 24 : 30 }}
                  transition={{ type: 'spring', bounce: 0.3 }} />
                <text x={x + 32} y={54} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? b.color : 'var(--muted-foreground)'}>
                  {b.label}
                </text>
              </g>
            );
          })}
          {/* Verification flow arrow */}
          <motion.line x1={52} y1={85} x2={52 + step * 72} y2={85}
            stroke={BLOCKS[step].color} strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4 }} />
          <motion.circle cx={52 + step * 72} cy={105} r={8}
            fill={step === 4 ? '#ef444430' : '#10b98130'}
            stroke={step === 4 ? '#ef4444' : '#10b981'} strokeWidth={1.5}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }} />
          <text x={52 + step * 72} y={108} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={step === 4 ? '#ef4444' : '#10b981'}>
            {step === 4 ? '!' : 'V'}
          </text>
                  <motion.text x={385} y={70} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
