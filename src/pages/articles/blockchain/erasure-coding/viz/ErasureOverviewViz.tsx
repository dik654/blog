import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const STEPS = [
  { label: '원본 데이터 k 조각', body: '원본 데이터를 k개 조각으로 나눕니다.' },
  { label: '인코딩: n 조각으로 확장', body: '이레이저 코딩으로 n개 조각을 생성합니다 (n > k). 추가 조각은 패리티입니다.' },
  { label: '일부 손실 (최대 n-k 조각)', body: '전송/저장 중 일부가 손실되어도 n-k개까지 복구할 수 있습니다.' },
  { label: '임의 k 조각으로 복구', body: '임의의 k개 조각만 있으면 원본을 완전히 복원합니다.' },
];
const K = 4, N = 8;

export default function ErasureOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {Array.from({ length: N }).map((_, i) => {
            const x = 20 + i * 54, isParity = i >= K;
            const lost = step === 2 && (i === 2 || i === 5 || i === 6);
            const restored = step === 3 && (i === 2 || i === 5 || i === 6);
            const visible = step === 0 ? i < K : true;
            const color = isParity ? C[1] : C[0];
            return (
              <motion.g key={i} animate={{ opacity: lost ? 0.12 : visible ? 1 : 0 }}>
                <rect x={x} y={30} width={44} height={36} rx={5}
                  fill={lost ? '#ef444418' : restored ? `${C[2]}22` : `${color}15`}
                  stroke={lost ? '#ef4444' : restored ? C[2] : color}
                  strokeWidth={1.2} strokeDasharray={lost ? '3 2' : 'none'} />
                <text x={x + 22} y={50} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={lost ? '#ef4444' : restored ? C[2] : color}>
                  {lost ? 'X' : `D${i + 1}`}
                </text>
                <text x={x + 22} y={60} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  {isParity ? 'parity' : 'data'}
                </text>
              </motion.g>
            );
          })}
          <rect x={20} y={78} width={K * 54 - 10} height={14} rx={3}
            fill={`${C[0]}10`} stroke={C[0]} strokeWidth={0.8} />
          <text x={20 + (K * 54 - 10) / 2} y={88} textAnchor="middle"
            fontSize={9} fill={C[0]}>원본 k={K} 조각</text>
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <rect x={20 + K * 54} y={78} width={(N - K) * 54 - 10} height={14} rx={3}
                fill={`${C[1]}10`} stroke={C[1]} strokeWidth={0.8} />
              <text x={20 + K * 54 + ((N - K) * 54 - 10) / 2} y={88}
                textAnchor="middle" fontSize={9} fill={C[1]}>패리티 n-k={N - K}</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
