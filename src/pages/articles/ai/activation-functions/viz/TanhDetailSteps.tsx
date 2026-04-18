import { motion } from 'framer-motion';
import { COLORS } from './TanhDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: 수식 + 핵심 값 + 미분 ── */
export function FormulaAndValues() {
  const keyValues = [
    { x: -2, tanh: '−0.964', deriv: '0.071' },
    { x: -1, tanh: '−0.762', deriv: '0.420' },
    { x: 0, tanh: ' 0.000', deriv: '1.000' },
    { x: 1, tanh: ' 0.762', deriv: '0.420' },
    { x: 2, tanh: ' 0.964', deriv: '0.071' },
  ];
  return (
    <g>
      {/* 수식 박스 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0 }}>
        <rect x={10} y={8} width={220} height={56} rx={8}
          fill="var(--card)" stroke={COLORS.tanh} strokeWidth={1} />
        <rect x={10} y={8} width={220} height={5} rx={0}
          fill={COLORS.tanh} opacity={0.85}
          clipPath="inset(0 round 8px 8px 0 0)" />
        <text x={120} y={30} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">tanh(x)</text>
        <text x={120} y={44} textAnchor="middle" fontSize={9}
          fontFamily="monospace" fill={COLORS.tanh}>
          (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)
        </text>
        <text x={120} y={58} textAnchor="middle" fontSize={8}
          fill={COLORS.dim}>= sinh(x) / cosh(x) = 2σ(2x) − 1</text>
      </motion.g>

      {/* 범위 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.15 }}>
        <text x={120} y={78} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">범위: (−1, 1) | 원점 대칭</text>
      </motion.g>

      {/* 핵심 값 테이블 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        {/* 헤더 */}
        <text x={22} y={98} fontSize={8} fontWeight={700}
          fill="var(--foreground)">x</text>
        <text x={62} y={98} fontSize={8} fontWeight={700}
          fill={COLORS.tanh}>tanh(x)</text>
        <text x={122} y={98} fontSize={8} fontWeight={700}
          fill={COLORS.advantage}>tanh'(x)</text>
        <line x1={10} y1={101} x2={170} y2={101}
          stroke="var(--border)" strokeWidth={0.5} />

        {keyValues.map((v, i) => {
          const ty = 112 + i * 10;
          const isZero = v.x === 0;
          return (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: 0.25 + i * 0.05 }}>
              <text x={22} y={ty} fontSize={8} fontFamily="monospace"
                fontWeight={isZero ? 700 : 400}
                fill="var(--foreground)">{v.x}</text>
              <text x={62} y={ty} fontSize={8} fontFamily="monospace"
                fontWeight={isZero ? 700 : 400}
                fill={COLORS.tanh}>{v.tanh}</text>
              <text x={122} y={ty} fontSize={8} fontFamily="monospace"
                fontWeight={isZero ? 700 : 400}
                fill={isZero ? COLORS.advantage : COLORS.dim}>{v.deriv}</text>
            </motion.g>
          );
        })}
      </motion.g>

      {/* 미분 시각화 (오른쪽) */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={250} y={8} width={220} height={56} rx={8}
          fill="var(--card)" stroke={COLORS.advantage} strokeWidth={1} />
        <rect x={250} y={8} width={220} height={5} rx={0}
          fill={COLORS.advantage} opacity={0.85}
          clipPath="inset(0 round 8px 8px 0 0)" />
        <text x={360} y={30} textAnchor="middle" fontSize={10} fontWeight={700}
          fill="var(--foreground)">미분: tanh'(x)</text>
        <text x={360} y={44} textAnchor="middle" fontSize={9}
          fontFamily="monospace" fill={COLORS.advantage}>
          1 − tanh²(x) = sech²(x)
        </text>
        <text x={360} y={58} textAnchor="middle" fontSize={8}
          fill={COLORS.dim}>x=0에서 최대 1.0 (sigmoid: 0.25)</text>
      </motion.g>

      {/* 미분 곡선 간이 시각화 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        {/* 축 */}
        <line x1={270} y1={120} x2={450} y2={120}
          stroke={COLORS.dim} strokeWidth={0.4} />
        <line x1={360} y1={78} x2={360} y2={150}
          stroke={COLORS.dim} strokeWidth={0.4} />
        <text x={453} y={123} fontSize={7} fill={COLORS.dim}>x</text>
        <text x={363} y={85} fontSize={7} fill={COLORS.dim}>1.0</text>

        {/* 미분 곡선 (bell shape) */}
        {(() => {
          const pts = Array.from({ length: 41 }, (_, i) => {
            const x = -4 + i * 0.2;
            const t = Math.tanh(x);
            const d = 1 - t * t;
            const px = 360 + x * 22;
            const py = 120 - d * 38;
            return `${i === 0 ? 'M' : 'L'}${px},${py}`;
          }).join(' ');
          return <path d={pts} fill="none" stroke={COLORS.advantage}
            strokeWidth={1.5} />;
        })()}

        {/* 꼭대기 표시 */}
        <circle cx={360} cy={82} r={2.5} fill={COLORS.advantage} />
        <text x={378} y={80} fontSize={8} fontWeight={700}
          fill={COLORS.advantage}>max = 1.0</text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Sigmoid 대비 3가지 장점 ── */
export function ThreeAdvantages() {
  const cards = [
    {
      title: '① Zero-centered',
      left: { label: 'sigmoid', value: '(0, 1)', avg: '평균 ≈ 0.5', color: COLORS.sig },
      right: { label: 'tanh', value: '(−1, 1)', avg: '평균 ≈ 0', color: COLORS.tanh },
      note: 'gradient 부호 자유 → 대각선 이동',
    },
    {
      title: '② 최대 기울기 4배',
      left: { label: "σ'(0)", value: '0.25', avg: '', color: COLORS.sig },
      right: { label: "tanh'(0)", value: '1.00', avg: '4× 빠른 학습', color: COLORS.tanh },
      note: '포화 전 영역에서 학습 속도 우위',
    },
    {
      title: '③ 업데이트 방향',
      left: { label: 'sigmoid', value: '1,3분면만', avg: '지그재그', color: COLORS.sig },
      right: { label: 'tanh', value: '전 방향', avg: '직선 경로', color: COLORS.tanh },
      note: 'w₁, w₂ 독립적 부호 업데이트',
    },
  ];

  return (
    <g>
      {cards.map((card, ci) => {
        const cy = 6 + ci * 50;
        return (
          <motion.g key={ci} initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: ci * 0.12 }}>
            {/* 카드 배경 */}
            <rect x={10} y={cy} width={460} height={44} rx={7}
              fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
            {/* 좌측 액센트 바 */}
            <rect x={10} y={cy} width={3.5} height={44} rx={0}
              fill={COLORS.advantage}
              clipPath={`inset(0 round 7px 0 0 7px)`} />

            {/* 제목 */}
            <text x={24} y={cy + 16} fontSize={10} fontWeight={700}
              fill={COLORS.advantage}>{card.title}</text>

            {/* sigmoid 측 */}
            <rect x={140} y={cy + 5} width={72} height={34} rx={5}
              fill={`${COLORS.sig}12`} stroke={COLORS.sig} strokeWidth={0.7} />
            <text x={176} y={cy + 19} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={COLORS.sig}>{card.left.label}</text>
            <text x={176} y={cy + 31} textAnchor="middle" fontSize={9}
              fontFamily="monospace" fontWeight={700}
              fill={COLORS.sig}>{card.left.value}</text>

            {/* 화살표 */}
            <text x={222} y={cy + 26} textAnchor="middle" fontSize={10}
              fill={COLORS.dim}>→</text>

            {/* tanh 측 */}
            <rect x={238} y={cy + 5} width={72} height={34} rx={5}
              fill={`${COLORS.tanh}12`} stroke={COLORS.tanh} strokeWidth={0.7} />
            <text x={274} y={cy + 19} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={COLORS.tanh}>{card.right.label}</text>
            <text x={274} y={cy + 31} textAnchor="middle" fontSize={9}
              fontFamily="monospace" fontWeight={700}
              fill={COLORS.tanh}>{card.right.value}</text>

            {/* 우측 설명 */}
            <text x={322} y={cy + 19} fontSize={8} fill="var(--foreground)">
              {card.right.avg}
            </text>
            <text x={322} y={cy + 33} fontSize={7.5}
              fill={COLORS.dim}>{card.note}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* ── Step 2: 한계 & LSTM 역할 ── */
export function LimitAndLSTM() {
  return (
    <g>
      {/* 왼쪽: Vanishing Gradient 한계 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0 }}>
        {/* 경고 점선 박스 */}
        <rect x={10} y={8} width={210} height={70} rx={8}
          fill="var(--card)" />
        <rect x={10} y={8} width={210} height={70} rx={8}
          fill={`${COLORS.limit}06`} stroke={COLORS.limit}
          strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={115} y={28} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={COLORS.limit}>Vanishing Gradient</text>
        <text x={115} y={42} textAnchor="middle" fontSize={8}
          fill="var(--foreground)">|x| &gt; 2 → 기울기 ≈ 0.07</text>
        <text x={115} y={54} textAnchor="middle" fontSize={8}
          fill={COLORS.dim}>깊은 네트워크에서 여전히 소실</text>
        <text x={115} y={66} textAnchor="middle" fontSize={8}
          fill={COLORS.dim}>sigmoid와 공통 단점</text>
      </motion.g>

      {/* 왼쪽: exp 비용 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={10} y={86} width={210} height={30} rx={6}
          fill="var(--card)" />
        <rect x={10} y={86} width={210} height={30} rx={6}
          fill={`${COLORS.limit}06`} stroke={COLORS.limit}
          strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={115} y={105} textAnchor="middle" fontSize={9}
          fill={COLORS.limit}>exp 연산 필요 — ReLU보다 느림</text>
      </motion.g>

      {/* 오른쪽: LSTM 역할 분담 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={240} y={8} width={230} height={136} rx={8}
          fill="var(--card)" stroke={COLORS.tanh} strokeWidth={1} />
        <rect x={240} y={8} width={230} height={5} rx={0}
          fill={COLORS.tanh} opacity={0.85}
          clipPath="inset(0 round 8px 8px 0 0)" />
        <text x={355} y={28} textAnchor="middle" fontSize={10}
          fontWeight={700} fill="var(--foreground)">LSTM 역할 분담</text>
      </motion.g>

      {/* Sigmoid = Gate */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={252} y={38} width={206} height={32} rx={5}
          fill={`${COLORS.sig}10`} stroke={COLORS.sig} strokeWidth={0.7} />
        <text x={264} y={50} fontSize={9} fontWeight={700}
          fill={COLORS.sig}>Sigmoid</text>
        <text x={320} y={50} fontSize={8} fill="var(--foreground)">
          = Gate (0~1 밸브)
        </text>
        <text x={264} y={64} fontSize={7} fill={COLORS.dim}>
          forget / input / output gate
        </text>
      </motion.g>

      {/* Tanh = Candidate */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={252} y={76} width={206} height={32} rx={5}
          fill={`${COLORS.tanh}10`} stroke={COLORS.tanh} strokeWidth={0.7} />
        <text x={264} y={88} fontSize={9} fontWeight={700}
          fill={COLORS.tanh}>Tanh</text>
        <text x={305} y={88} fontSize={8} fill="var(--foreground)">
          = Candidate (−1~1 값)
        </text>
        <text x={264} y={102} fontSize={7} fill={COLORS.dim}>
          새 정보의 부호와 강도 결정
        </text>
      </motion.g>

      {/* 결합 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.45 }}>
        <text x={355} y={122} textAnchor="middle" fontSize={8}
          fontFamily="monospace" fill="var(--foreground)">
          C_t = f·C + i·tanh(...)
        </text>
        <text x={355} y={136} textAnchor="middle" fontSize={7.5}
          fill={COLORS.dim}>
          gate가 크기 결정, tanh가 방향 결정
        </text>
      </motion.g>
    </g>
  );
}
