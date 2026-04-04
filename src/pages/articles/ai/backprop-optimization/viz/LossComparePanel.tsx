import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function CEPanel() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={417} y={35} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#0ea5e9">L = −log(ŷ)</text>
      <text x={417} y={52} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.09 → L=2.41</text>
      <text x={417} y={66} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.50 → L=0.69</text>
      <text x={417} y={80} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.90 → L=0.11</text>
      <text x={417} y={100} textAnchor="middle" fontSize={8}
        fill="#ef4444" fontWeight={500}>확률 낮을 때 급벌칙</text>
      <text x={417} y={114} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">분류 문제 표준</text>
    </motion.g>
  );
}

export function MSEPanel() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={417} y={35} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#10b981">L = (y−ŷ)²</text>
      <text x={417} y={52} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.09 → L=0.83</text>
      <text x={417} y={66} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.50 → L=0.25</text>
      <text x={417} y={80} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">ŷ=0.90 → L=0.01</text>
      <text x={417} y={100} textAnchor="middle" fontSize={8}
        fill="#f59e0b" fontWeight={500}>부드러운 증가</text>
      <text x={417} y={114} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">회귀 문제 표준</text>
    </motion.g>
  );
}

export function ComparePanel() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={417} y={30} textAnchor="middle" fontSize={8}
        fontWeight={600} fill="var(--foreground)">
        우리 모델 (ŷ=0.09)
      </text>
      <line x1={365} y1={36} x2={470} y2={36}
        stroke="var(--border)" strokeWidth={0.4} />
      <text x={375} y={52} fontSize={8}
        fill="#0ea5e9" fontWeight={600}>CE:</text>
      <text x={400} y={52} fontSize={9}
        fill="#0ea5e9" fontWeight={700}>2.41</text>
      <rect x={365} y={56} width={100} height={8} rx={2}
        fill="var(--muted)" opacity={0.3} />
      <motion.rect x={365} y={56} rx={2} height={8}
        fill="#0ea5e930" stroke="#0ea5e9" strokeWidth={0.5}
        initial={{ width: 0 }}
        animate={{ width: (2.41 / 3) * 100 }}
        transition={sp} />

      <text x={375} y={80} fontSize={8}
        fill="#10b981" fontWeight={600}>MSE:</text>
      <text x={400} y={80} fontSize={9}
        fill="#10b981" fontWeight={700}>0.83</text>
      <rect x={365} y={84} width={100} height={8} rx={2}
        fill="var(--muted)" opacity={0.3} />
      <motion.rect x={365} y={84} rx={2} height={8}
        fill="#10b98130" stroke="#10b981" strokeWidth={0.5}
        initial={{ width: 0 }}
        animate={{ width: (0.83 / 3) * 100 }}
        transition={sp} />

      <text x={417} y={108} textAnchor="middle" fontSize={8}
        fill="#ef4444" fontWeight={500}>
        CE가 2.9배 더 큰 벌칙
      </text>
      <text x={417} y={122} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        → 틀린 예측에 강한 학습 신호
      </text>
    </motion.g>
  );
}
