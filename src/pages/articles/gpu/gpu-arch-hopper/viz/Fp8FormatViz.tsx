import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  e4m3: '#0ea5e9',   // sky — forward
  e5m2: '#a855f7',   // violet — backward
  sign: '#ef4444',   // red
  exp: '#f59e0b',    // amber
  mant: '#10b981',   // emerald
};

const STEPS = [
  { label: 'E4M3 — 1 sign / 4 exp / 3 mantissa', body: '범위 ~±448. 정밀도가 상대적으로 높다.\n순전파(weight, activation) 적합.' },
  { label: 'E4M3 활용: Forward pass', body: '가중치와 활성화는 값 분포가 좁다.\n정밀도가 더 중요하므로 mantissa 3비트가 유리.' },
  { label: 'E5M2 — 1 sign / 5 exp / 2 mantissa', body: '범위 ~±57344. 동적 범위가 매우 넓다.\n역전파 그래디언트 적합.' },
  { label: 'E5M2 활용: Backward pass', body: '그래디언트는 매우 작은 값부터 큰 값까지 분포.\n동적 범위가 더 중요하므로 exp 5비트가 유리.' },
  { label: '왜 두 포맷을 모두 쓰는가', body: 'FP8 8비트로는 한 포맷이 모든 분포를 커버 불가.\n방향(forward/backward)에 따라 최적 포맷 분리.\nTransformer Engine이 자동 전환.' },
];

function FormatBitView({ which, animate }: { which: 'E4M3' | 'E5M2'; animate?: boolean }) {
  const isE4 = which === 'E4M3';
  const sign = 1;
  const exp = isE4 ? 4 : 5;
  const mant = isE4 ? 3 : 2;
  const totalBits = sign + exp + mant;
  const bitW = 36;
  const startX = 240 - (totalBits * bitW) / 2;

  const bits: { kind: 'sign' | 'exp' | 'mant'; idx: number; color: string; label: string }[] = [];
  bits.push({ kind: 'sign', idx: 0, color: C.sign, label: 'S' });
  for (let i = 0; i < exp; i++) bits.push({ kind: 'exp', idx: i, color: C.exp, label: 'E' });
  for (let i = 0; i < mant; i++) bits.push({ kind: 'mant', idx: i, color: C.mant, label: 'M' });

  return (
    <g>
      {bits.map((b, i) => (
        <motion.g key={i}
          initial={animate ? { opacity: 0, y: -6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}>
          <rect x={startX + i * bitW} y={42} width={bitW - 2} height={36} rx={4}
            fill={b.color + '20'} stroke={b.color} strokeWidth={1} />
          <text x={startX + i * bitW + bitW / 2 - 1} y={64} textAnchor="middle"
            fontSize={11} fontWeight={700} fill={b.color}>{b.label}</text>
        </motion.g>
      ))}
      <text x={240} y={94} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        {totalBits} bit total
      </text>
    </g>
  );
}

function E4M3Step() {
  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e4m3}>
        E4M3 — 1 sign / 4 exponent / 3 mantissa
      </text>
      <FormatBitView which="E4M3" animate />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.e4m3}>
          범위 ~±448 / 정밀도 우선
        </text>
        <text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          가중치와 활성화는 분포가 좁아 mantissa 3비트로 충분
        </text>
      </motion.g>
    </g>
  );
}

function E4M3UseStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e4m3}>
        Forward pass: weight × activation
      </text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <rect x={30} y={36} width={120} height={40} rx={6} fill={C.e4m3 + '12'} stroke={C.e4m3} strokeWidth={0.8} />
        <text x={90} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.e4m3}>weight</text>
        <text x={90} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분포 좁음</text>
      </motion.g>
      <motion.text x={163} y={58} fontSize={14} fontWeight={700} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>×</motion.text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <rect x={180} y={36} width={120} height={40} rx={6} fill={C.e4m3 + '12'} stroke={C.e4m3} strokeWidth={0.8} />
        <text x={240} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.e4m3}>activation</text>
        <text x={240} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분포 좁음</text>
      </motion.g>
      <motion.text x={313} y={58} fontSize={14} fontWeight={700} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>=</motion.text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
        <rect x={330} y={36} width={130} height={40} rx={6} fill={C.e4m3 + '20'} stroke={C.e4m3} strokeWidth={1} />
        <text x={395} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.e4m3}>output (E4M3)</text>
        <text x={395} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정밀도 보존</text>
      </motion.g>
      <motion.text x={240} y={104} textAnchor="middle" fontSize={9} fill={C.e4m3}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        per-tensor scale 로 ±448 범위 안에 매핑
      </motion.text>
    </g>
  );
}

function E5M2Step() {
  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e5m2}>
        E5M2 — 1 sign / 5 exponent / 2 mantissa
      </text>
      <FormatBitView which="E5M2" animate />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={114} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.e5m2}>
          범위 ~±57344 / 동적 범위 우선
        </text>
        <text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          그래디언트의 매우 작은~큰 값을 모두 표현
        </text>
      </motion.g>
    </g>
  );
}

function E5M2UseStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.e5m2}>
        Backward pass: gradient
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={30} y={36} width={420} height={40} rx={6} fill={C.e5m2 + '08'} stroke={C.e5m2} strokeWidth={0.8} />
        <text x={240} y={52} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.e5m2}>
          gradient 분포: 1e-7 ~ 1e+4 (매우 넓음)
        </text>
        <text x={240} y={66} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          E5M2 의 5-bit exponent 가 underflow / overflow 모두 방지
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={30} y={94} width={130} height={36} rx={5} fill={C.e5m2 + '12'} stroke={C.e5m2} strokeWidth={0.5} />
        <text x={95} y={108} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.e5m2}>1e-7</text>
        <text x={95} y={122} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">drop-out 아님</text>
        <rect x={175} y={94} width={130} height={36} rx={5} fill={C.e5m2 + '12'} stroke={C.e5m2} strokeWidth={0.5} />
        <text x={240} y={108} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.e5m2}>1e0</text>
        <text x={240} y={122} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">정상</text>
        <rect x={320} y={94} width={130} height={36} rx={5} fill={C.e5m2 + '12'} stroke={C.e5m2} strokeWidth={0.5} />
        <text x={385} y={108} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.e5m2}>1e+4</text>
        <text x={385} y={122} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">overflow 아님</text>
      </motion.g>
    </g>
  );
}

function CompareStep() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
        FP8: 두 포맷의 역할 분담
      </text>
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <rect x={30} y={32} width={200} height={100} rx={8} fill={C.e4m3 + '08'} stroke={C.e4m3} strokeWidth={0.8} />
        <text x={130} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.e4m3}>E4M3 (Forward)</text>
        <text x={50} y={68} fontSize={8} fill="var(--muted-foreground)">• 4 exp / 3 mantissa</text>
        <text x={50} y={82} fontSize={8} fill="var(--muted-foreground)">• 범위 ~±448</text>
        <text x={50} y={96} fontSize={8} fill="var(--muted-foreground)">• weight, activation</text>
        <text x={50} y={110} fontSize={8} fill={C.e4m3} fontWeight={600}>정밀도 우선</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <rect x={250} y={32} width={200} height={100} rx={8} fill={C.e5m2 + '08'} stroke={C.e5m2} strokeWidth={0.8} />
        <text x={350} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.e5m2}>E5M2 (Backward)</text>
        <text x={270} y={68} fontSize={8} fill="var(--muted-foreground)">• 5 exp / 2 mantissa</text>
        <text x={270} y={82} fontSize={8} fill="var(--muted-foreground)">• 범위 ~±57344</text>
        <text x={270} y={96} fontSize={8} fill="var(--muted-foreground)">• gradient</text>
        <text x={270} y={110} fontSize={8} fill={C.e5m2} fontWeight={600}>동적 범위 우선</text>
      </motion.g>
      <motion.text x={240} y={148} textAnchor="middle" fontSize={8} fill="#8b5cf6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Transformer Engine 이 fp8_autocast 로 자동 전환
      </motion.text>
    </g>
  );
}

const R = [E4M3Step, E4M3UseStep, E5M2Step, E5M2UseStep, CompareStep];

export default function Fp8FormatViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 160" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
