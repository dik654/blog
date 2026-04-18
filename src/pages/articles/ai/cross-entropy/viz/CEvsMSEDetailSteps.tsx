import { motion } from 'framer-motion';
import { MSE_C, CE_C, ACCENT, DIM, DANGER } from './CEvsMSEDetailVizData';

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

/* ─── Step 0: 기울기 공식 비교 ─── */
export function GradientFormulas() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* MSE side */}
      <rect x={15} y={10} width={215} height={60} rx={8}
        fill="#f59e0b0a" stroke={MSE_C} strokeWidth={1} />
      <text x={122} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={MSE_C}>
        MSE 기울기
      </text>
      <text x={122} y={42} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">
        dL/dz = (ŷ−y) · ŷ(1−ŷ)
      </text>
      <text x={122} y={56} textAnchor="middle" fontSize={8} fill={DIM}>
        ↑ sigmoid'(z) 항이 곱해짐
      </text>

      {/* CE side */}
      <rect x={250} y={10} width={215} height={60} rx={8}
        fill="#6366f10a" stroke={CE_C} strokeWidth={1} />
      <text x={357} y={26} textAnchor="middle" fontSize={9} fontWeight={700} fill={CE_C}>
        CE 기울기
      </text>
      <text x={357} y={42} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">
        dL/dz = ŷ − y
      </text>
      <text x={357} y={56} textAnchor="middle" fontSize={8} fill={ACCENT}>
        ↑ sigmoid'(z) 상쇄됨!
      </text>

      {/* vs arrow */}
      <text x={240} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={DIM}>vs</text>

      {/* bottom note */}
      <rect x={100} y={85} width={280} height={30} rx={6}
        fill="#10b98110" stroke={ACCENT} strokeWidth={0.8} />
      <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={ACCENT}>
        CE의 log가 sigmoid 미분을 정확히 상쇄 → 단순한 (ŷ−y)
      </text>
      <text x={240} y={112} textAnchor="middle" fontSize={8} fill={DIM}>
        -log(sigmoid(z)) 미분 = -1/ŷ · ŷ(1-ŷ) = -(1-ŷ) → 분모 상쇄
      </text>
    </motion.g>
  );
}

/* ─── Step 1: ŷ=0.01 수치 비교 ─── */
export function NumericComparison() {
  const barX = 140;
  const barY = 30;
  const maxW = 280;
  // MSE: 0.0098 → scaled to maxW at 0.99
  const mseW = (0.0098 / 0.99) * maxW; // ~2.8
  const ceW = maxW; // 0.99 → full

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* title */}
      <text x={240} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
        y = 1, ŷ = 0.01 (매우 틀린 예측)
      </text>

      {/* MSE bar */}
      <text x={barX - 5} y={barY + 14} textAnchor="end" fontSize={9} fontWeight={600} fill={MSE_C}>
        MSE
      </text>
      <rect x={barX} y={barY + 4} width={maxW} height={18} rx={4}
        fill="var(--border)" opacity={0.2} />
      <motion.rect x={barX} y={barY + 4} width={mseW} height={18} rx={4}
        fill={MSE_C} opacity={0.8}
        initial={{ width: 0 }} animate={{ width: mseW }}
        transition={{ duration: 0.6 }} />
      <text x={barX + mseW + 6} y={barY + 17} fontSize={8} fontWeight={600} fill={MSE_C}>
        −0.0098
      </text>

      {/* CE bar */}
      <text x={barX - 5} y={barY + 48} textAnchor="end" fontSize={9} fontWeight={600} fill={CE_C}>
        CE
      </text>
      <rect x={barX} y={barY + 38} width={maxW} height={18} rx={4}
        fill="var(--border)" opacity={0.2} />
      <motion.rect x={barX} y={barY + 38} width={ceW} height={18} rx={4}
        fill={CE_C} opacity={0.8}
        initial={{ width: 0 }} animate={{ width: ceW }}
        transition={{ duration: 0.6, delay: 0.2 }} />
      <text x={barX + ceW + 6} y={barY + 51} fontSize={8} fontWeight={600} fill={CE_C}>
        −0.99
      </text>

      {/* ratio */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <rect x={165} y={105} width={150} height={28} rx={6}
          fill="#ef444415" stroke={DANGER} strokeWidth={1} />
        <text x={240} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill={DANGER}>
          CE가 약 100배 큰 기울기!
        </text>
      </motion.g>

      {/* computation detail */}
      <text x={50} y={barY + 14} textAnchor="end" fontSize={7.5} fill={DIM}>
        ×0.01×0.99
      </text>
      <text x={50} y={barY + 48} textAnchor="end" fontSize={7.5} fill={DIM}>
        단순 차이
      </text>
    </motion.g>
  );
}

/* ─── Step 2: 예측 정확도별 기울기 비교 차트 ─── */
export function GradientRatioChart() {
  const data = [
    { yhat: '0.01', mse: 0.0098, ce: 0.99, ratio: '≈100×' },
    { yhat: '0.5', mse: 0.125, ce: 0.5, ratio: '4×' },
    { yhat: '0.99', mse: 0.0099, ce: 0.01, ratio: '≈1×' },
  ];
  const maxVal = 1.0;
  const chartX = 105;
  const chartW = 200;
  const rowH = 36;
  const startY = 12;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* header */}
      <text x={60} y={startY} textAnchor="middle" fontSize={8} fontWeight={600} fill={DIM}>ŷ</text>
      <text x={chartX + chartW / 2} y={startY} textAnchor="middle" fontSize={8} fontWeight={600}
        fill="var(--foreground)">|기울기| 크기</text>
      <text x={chartX + chartW + 50} y={startY} textAnchor="middle" fontSize={8} fontWeight={600}
        fill={DANGER}>배율</text>

      {data.map((d, i) => {
        const y = startY + 10 + i * rowH;
        const mseW = (d.mse / maxVal) * chartW;
        const ceW = (d.ce / maxVal) * chartW;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            {/* label */}
            <text x={60} y={y + 16} textAnchor="middle" fontSize={9} fontWeight={600}
              fill="var(--foreground)">{d.yhat}</text>
            {/* MSE bar */}
            <rect x={chartX} y={y} width={Math.max(mseW, 2)} height={12} rx={3}
              fill={MSE_C} opacity={0.7} />
            <text x={chartX + Math.max(mseW, 2) + 4} y={y + 10} fontSize={7.5} fill={MSE_C}>
              {d.mse.toFixed(4)}
            </text>
            {/* CE bar */}
            <rect x={chartX} y={y + 16} width={Math.max(ceW, 2)} height={12} rx={3}
              fill={CE_C} opacity={0.7} />
            <text x={chartX + Math.max(ceW, 2) + 4} y={y + 26} fontSize={7.5} fill={CE_C}>
              {d.ce.toFixed(2)}
            </text>
            {/* ratio */}
            <text x={chartX + chartW + 50} y={y + 18} textAnchor="middle" fontSize={10}
              fontWeight={700} fill={DANGER}>{d.ratio}</text>
          </motion.g>
        );
      })}

      {/* legend */}
      <rect x={140} y={130} width={10} height={8} rx={2} fill={MSE_C} opacity={0.7} />
      <text x={155} y={137} fontSize={8} fill={MSE_C}>MSE</text>
      <rect x={190} y={130} width={10} height={8} rx={2} fill={CE_C} opacity={0.7} />
      <text x={205} y={137} fontSize={8} fill={CE_C}>CE</text>
      <text x={240} y={137} fontSize={8} fill={DIM}>
        (y=1 기준, |dL/dz|)
      </text>
    </motion.g>
  );
}

/* ─── Step 3: Sigmoid 포화 문제 ─── */
export function SigmoidSaturation() {
  // sigmoid'(z) curve data points
  const pts: [number, number][] = [];
  for (let i = -10; i <= 10; i += 0.5) {
    const s = 1 / (1 + Math.exp(-i));
    pts.push([i, s * (1 - s)]);
  }
  const ox = 60, oy = 15, w = 300, h = 100;
  const maxD = 0.25;

  const toX = (z: number) => ox + ((z + 10) / 20) * w;
  const toY = (d: number) => oy + h - (d / maxD) * h;

  const path = pts.map(([z, d], i) =>
    `${i === 0 ? 'M' : 'L'}${toX(z).toFixed(1)},${toY(d).toFixed(1)}`
  ).join(' ');

  const markers = [
    { z: -10, label: 'z=−10', val: '≈0.00005' },
    { z: -5, label: 'z=−5', val: '≈0.007' },
    { z: 0, label: 'z=0', val: '0.25' },
    { z: 5, label: 'z=5', val: '≈0.007' },
    { z: 10, label: 'z=10', val: '≈0.00005' },
  ];

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* axes */}
      <line x1={ox} y1={oy} x2={ox} y2={oy + h} stroke="var(--border)" strokeWidth={0.8} />
      <line x1={ox} y1={oy + h} x2={ox + w} y2={oy + h} stroke="var(--border)" strokeWidth={0.8} />
      <text x={ox - 5} y={oy + 4} textAnchor="end" fontSize={7.5} fill={DIM}>0.25</text>
      <text x={ox - 5} y={oy + h + 3} textAnchor="end" fontSize={7.5} fill={DIM}>0</text>
      <text x={ox + w / 2} y={oy + h + 14} textAnchor="middle" fontSize={8} fill={DIM}>z (logit)</text>
      <text x={ox - 22} y={oy + h / 2} textAnchor="middle" fontSize={8} fill={DIM}
        transform={`rotate(-90,${ox - 22},${oy + h / 2})`}>sigmoid'(z)</text>

      {/* curve */}
      <motion.path d={path} fill="none" stroke={ACCENT} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }} />

      {/* saturation zones */}
      <rect x={ox} y={oy} width={75} height={h} fill={DANGER} opacity={0.06} />
      <rect x={ox + w - 75} y={oy} width={75} height={h} fill={DANGER} opacity={0.06} />
      <text x={ox + 37} y={oy + 10} textAnchor="middle" fontSize={7.5} fill={DANGER} fontWeight={600}>포화</text>
      <text x={ox + w - 37} y={oy + 10} textAnchor="middle" fontSize={7.5} fill={DANGER} fontWeight={600}>포화</text>

      {/* markers */}
      {markers.map((m, i) => {
        const s = 1 / (1 + Math.exp(-m.z));
        const d = s * (1 - s);
        const mx = toX(m.z);
        const my = toY(d);
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}>
            <circle cx={mx} cy={my} r={2.5}
              fill={Math.abs(m.z) >= 5 ? DANGER : ACCENT} />
            <text x={mx} y={oy + h + 12} textAnchor="middle" fontSize={7} fill={DIM}>
              {m.z}
            </text>
          </motion.g>
        );
      })}

      {/* peak label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <line x1={toX(0)} y1={toY(0.25)} x2={toX(0) + 45} y2={toY(0.25) - 10}
          stroke={ACCENT} strokeWidth={0.5} strokeDasharray="2 2" />
        <text x={toX(0) + 48} y={toY(0.25) - 6} fontSize={8} fontWeight={600} fill={ACCENT}>
          최대 0.25
        </text>
      </motion.g>

      {/* note in right margin */}
      <rect x={385} y={25} width={85} height={50} rx={6}
        fill="#ef444408" stroke={DANGER} strokeWidth={0.8} strokeDasharray="3 2" />
      <text x={427} y={40} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={DANGER}>
        MSE 문제
      </text>
      <text x={427} y={52} textAnchor="middle" fontSize={7} fill={DIM}>
        기울기에
      </text>
      <text x={427} y={62} textAnchor="middle" fontSize={7} fill={DIM}>
        sigmoid'(z)
      </text>
      <text x={427} y={72} textAnchor="middle" fontSize={7} fill={DIM}>
        가 곱해짐
      </text>
    </motion.g>
  );
}

/* ─── Step 4: z=10 포화 영역 비교 ─── */
export function SaturationComparison() {
  const barX = 140;
  const maxW = 240;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {/* scenario */}
      <rect x={80} y={5} width={320} height={24} rx={6}
        fill="#ef444410" stroke={DANGER} strokeWidth={0.8} />
      <text x={240} y={21} textAnchor="middle" fontSize={9} fontWeight={600} fill={DANGER}>
        z = 10, y = 0 → ŷ ≈ 0.99995 (완전히 틀린 예측)
      </text>

      {/* MSE */}
      <text x={barX - 5} y={55} textAnchor="end" fontSize={9} fontWeight={600} fill={MSE_C}>
        MSE
      </text>
      <rect x={barX} y={42} width={maxW} height={20} rx={4}
        fill="var(--border)" opacity={0.15} />
      <motion.rect x={barX} y={42} width={2} height={20} rx={1}
        fill={MSE_C} opacity={0.9}
        initial={{ width: 0 }} animate={{ width: 2 }}
        transition={{ duration: 0.4 }} />
      <text x={barX + 10} y={55} fontSize={8} fontWeight={600} fill={MSE_C}>
        ≈ 0.00005
      </text>
      <text x={barX + 75} y={55} fontSize={7.5} fill={DIM}>
        (0.99995 × 0.00005)
      </text>

      {/* CE */}
      <text x={barX - 5} y={85} textAnchor="end" fontSize={9} fontWeight={600} fill={CE_C}>
        CE
      </text>
      <rect x={barX} y={72} width={maxW} height={20} rx={4}
        fill="var(--border)" opacity={0.15} />
      <motion.rect x={barX} y={72} width={maxW} height={20} rx={4}
        fill={CE_C} opacity={0.7}
        initial={{ width: 0 }} animate={{ width: maxW }}
        transition={{ duration: 0.6, delay: 0.2 }} />
      <text x={barX + maxW - 60} y={85} fontSize={8} fontWeight={600} fill="#ffffff">
        ≈ 0.99995
      </text>

      {/* conclusion */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={50} y={108} width={180} height={32} rx={6}
          fill="#10b98115" stroke={ACCENT} strokeWidth={1} />
        <text x={140} y={122} textAnchor="middle" fontSize={8} fontWeight={700} fill={ACCENT}>
          CE: log가 sigmoid'를 상쇄
        </text>
        <text x={140} y={134} textAnchor="middle" fontSize={7.5} fill={ACCENT}>
          포화 영역에서도 강한 교정
        </text>

        <rect x={255} y={108} width={180} height={32} rx={6}
          fill="#ef444410" stroke={DANGER} strokeWidth={1} strokeDasharray="3 2" />
        <text x={345} y={122} textAnchor="middle" fontSize={8} fontWeight={700} fill={DANGER}>
          MSE: sigmoid' 그대로 곱해짐
        </text>
        <text x={345} y={134} textAnchor="middle" fontSize={7.5} fill={DANGER}>
          포화 영역에서 학습 정지
        </text>
      </motion.g>
    </motion.g>
  );
}
