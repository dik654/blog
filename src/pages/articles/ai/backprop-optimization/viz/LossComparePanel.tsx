import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function CEPanel() {
  const cx = 375;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={cx} y={30} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#0ea5e9">L = −log(ŷ)</text>
      <text x={cx} y={50} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.09 → L=2.41</text>
      <text x={cx} y={64} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.50 → L=0.69</text>
      <text x={cx} y={78} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.90 → L=0.11</text>
      <text x={cx} y={100} textAnchor="middle" fontSize={9}
        fill="#ef4444" fontWeight={600}>확률 낮을 때 급벌칙</text>
      <text x={cx} y={118} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">분류 문제 표준</text>
    </motion.g>
  );
}

export function MSEPanel() {
  const cx = 375;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={cx} y={30} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="#10b981">L = (y−ŷ)²</text>
      <text x={cx} y={50} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.09 → L=0.83</text>
      <text x={cx} y={64} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.50 → L=0.25</text>
      <text x={cx} y={78} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.90 → L=0.01</text>
      <text x={cx} y={100} textAnchor="middle" fontSize={9}
        fill="#f59e0b" fontWeight={600}>부드러운 증가</text>
      <text x={cx} y={118} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">회귀 문제 표준</text>
    </motion.g>
  );
}

export function ComparePanel() {
  const cx = 375;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={cx} y={30} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="var(--foreground)">
        우리 모델 (ŷ=0.09)
      </text>
      <line x1={292} y1={36} x2={458} y2={36}
        stroke="var(--border)" strokeWidth={0.4} />

      <text x={300} y={56} fontSize={8}
        fill="#0ea5e9" fontWeight={600}>CE:</text>
      <text x={326} y={56} fontSize={10}
        fill="#0ea5e9" fontWeight={700}>2.41</text>
      <rect x={292} y={62} width={160} height={8} rx={2}
        fill="var(--muted)" opacity={0.3} />
      <motion.rect x={292} y={62} rx={2} height={8}
        fill="#0ea5e930" stroke="#0ea5e9" strokeWidth={0.5}
        initial={{ width: 0 }}
        animate={{ width: (2.41 / 3) * 160 }}
        transition={sp} />

      <text x={300} y={90} fontSize={8}
        fill="#10b981" fontWeight={600}>MSE:</text>
      <text x={326} y={90} fontSize={10}
        fill="#10b981" fontWeight={700}>0.83</text>
      <rect x={292} y={96} width={160} height={8} rx={2}
        fill="var(--muted)" opacity={0.3} />
      <motion.rect x={292} y={96} rx={2} height={8}
        fill="#10b98130" stroke="#10b981" strokeWidth={0.5}
        initial={{ width: 0 }}
        animate={{ width: (0.83 / 3) * 160 }}
        transition={sp} />

      <text x={cx} y={122} textAnchor="middle" fontSize={9}
        fill="#ef4444" fontWeight={600}>
        CE가 2.9배 더 큰 벌칙
      </text>
      <text x={cx} y={138} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        → 틀린 예측에 강한 학습 신호
      </text>
    </motion.g>
  );
}
