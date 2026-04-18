import { motion } from 'framer-motion';
import { C } from './AEForwardVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: sigmoid curve visualization */
export function Step0() {
  // sigmoid values at key points
  const pts: [number, number][] = [
    [-5, 0.007], [-3, 0.047], [-2, 0.119], [-1, 0.269],
    [0, 0.5], [1, 0.731], [2, 0.881], [3, 0.953], [5, 0.993],
  ];
  const chartX = 40;
  const chartW = 240;
  const chartY = 10;
  const chartH = 120;

  const toSvg = (xv: number, yv: number) => ({
    x: chartX + ((xv + 5) / 10) * chartW,
    y: chartY + (1 - yv) * chartH,
  });

  const pathD = pts.map((p, i) => {
    const { x, y } = toSvg(p[0], p[1]);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const keyPts = [
    { xv: -2, yv: 0.119, label: '0.119' },
    { xv: 0, yv: 0.5, label: '0.5' },
    { xv: 1, yv: 0.731, label: '0.731' },
    { xv: 2, yv: 0.881, label: '0.881' },
  ];

  return (
    <g>
      {/* Axes */}
      <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH}
        stroke={C.muted} strokeWidth={0.6} />
      <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH}
        stroke={C.muted} strokeWidth={0.6} />
      {/* 0.5 line */}
      <line x1={chartX} y1={toSvg(0, 0.5).y} x2={chartX + chartW} y2={toSvg(0, 0.5).y}
        stroke={C.muted} strokeWidth={0.4} strokeDasharray="3 3" />
      <text x={chartX - 5} y={toSvg(0, 0.5).y + 3} textAnchor="end" fontSize={7} fill={C.muted}>0.5</text>
      <text x={chartX - 5} y={toSvg(0, 1).y + 3} textAnchor="end" fontSize={7} fill={C.muted}>1.0</text>
      <text x={chartX - 5} y={toSvg(0, 0).y + 3} textAnchor="end" fontSize={7} fill={C.muted}>0.0</text>

      {/* Curve */}
      <motion.path d={pathD} fill="none" stroke={C.sig} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />

      {/* Key points */}
      {keyPts.map((p, i) => {
        const { x, y } = toSvg(p.xv, p.yv);
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
            <circle cx={x} cy={y} r={3} fill={C.sig} />
            <text x={x + 6} y={y - 4} fontSize={7} fill={C.sig}>{p.label}</text>
          </motion.g>
        );
      })}

      {/* Derivative info */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={310} y={20} width={150} height={55} rx={6} fill={`${C.sig}08`} stroke={C.sig} strokeWidth={0.8} />
        <text x={385} y={36} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.sig}>미분</text>
        <text x={385} y={50} textAnchor="middle" fontSize={8} fill={C.muted}>σ'(x) = σ(x)(1-σ(x))</text>
        <text x={385} y={63} textAnchor="middle" fontSize={8} fill={C.muted}>최대값 = 0.25 (x=0)</text>

        <rect x={310} y={85} width={150} height={45} rx={6} fill={`${C.loss}08`} stroke={C.loss} strokeWidth={0.8} />
        <text x={385} y={100} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.loss}>포화 영역</text>
        <text x={385} y={114} textAnchor="middle" fontSize={8} fill={C.muted}>|x|{'>'}5 → 기울기 ≈ 0</text>
      </motion.g>

      <text x={chartX + chartW / 2} y={chartY + chartH + 14} textAnchor="middle" fontSize={7} fill={C.muted}>x</text>
    </g>
  );
}

/* Step 1: Activation function comparison */
export function Step1() {
  const fns = [
    { name: 'Sigmoid', c: C.sig, pts: '포화→기울기소실', use: '출력층(이미지)' },
    { name: 'ReLU', c: C.relu, pts: 'max(0,x)', use: '은닉층 표준' },
    { name: 'GELU', c: C.gelu, pts: 'smooth ReLU', use: '최신 모델' },
  ];
  const startX = 30;
  const gap = 155;

  return (
    <g>
      {fns.map((f, i) => {
        const x = startX + i * gap;
        const chartW = 110;
        const chartH = 70;
        const cy = 25;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={x} y={cy} width={chartW} height={chartH + 35} rx={6}
              fill={`${f.c}06`} stroke={f.c} strokeWidth={1} />
            <text x={x + chartW / 2} y={cy + 14} textAnchor="middle" fontSize={9} fontWeight={700} fill={f.c}>
              {f.name}
            </text>
            {/* Mini graph area */}
            <line x1={x + 10} y1={cy + 25 + chartH / 2} x2={x + chartW - 10} y2={cy + 25 + chartH / 2}
              stroke={C.muted} strokeWidth={0.4} />
            <line x1={x + chartW / 2} y1={cy + 22} x2={x + chartW / 2} y2={cy + 22 + chartH}
              stroke={C.muted} strokeWidth={0.4} />
            {/* Curves */}
            {i === 0 && (
              <path d={`M${x + 12},${cy + 80} Q${x + 45},${cy + 75} ${x + 55},${cy + 55} Q${x + 65},${cy + 35} ${x + 98},${cy + 28}`}
                fill="none" stroke={f.c} strokeWidth={1.5} />
            )}
            {i === 1 && (<>
              <line x1={x + 12} y1={cy + 55} x2={x + 55} y2={cy + 55}
                stroke={f.c} strokeWidth={1.5} />
              <line x1={x + 55} y1={cy + 55} x2={x + 98} y2={cy + 28}
                stroke={f.c} strokeWidth={1.5} />
            </>)}
            {i === 2 && (
              <path d={`M${x + 12},${cy + 58} Q${x + 40},${cy + 60} ${x + 55},${cy + 55} Q${x + 70},${cy + 42} ${x + 98},${cy + 28}`}
                fill="none" stroke={f.c} strokeWidth={1.5} />
            )}
            <text x={x + chartW / 2} y={cy + chartH + 23} textAnchor="middle" fontSize={7} fill={C.muted}>
              {f.use}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* Step 2: Tensor operation flow */
export function Step2() {
  return (
    <g>
      {/* Input vector */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={15} y={40} width={65} height={50} rx={5} fill={`${C.enc}12`} stroke={C.enc} strokeWidth={1} />
        <text x={47} y={57} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.enc}>x ∈ R^n</text>
        <text x={47} y={72} textAnchor="middle" fontSize={7} fill={C.muted}>[0.8, 0.4]</text>
      </motion.g>

      {/* Encoder op */}
      <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
        <line x1={80} y1={65} x2={105} y2={65} stroke={C.enc} strokeWidth={1} markerEnd="url(#aefwd-a)" />
        <rect x={108} y={35} width={100} height={60} rx={6} fill={`${C.enc}08`} stroke={C.enc} strokeWidth={1} />
        <text x={158} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>Encoder</text>
        <text x={158} y={64} textAnchor="middle" fontSize={7} fill={C.muted}>W_enc @ x + b_enc</text>
        <text x={158} y={76} textAnchor="middle" fontSize={7} fill={C.enc}>→ σ(pre_act)</text>
      </motion.g>

      {/* Latent */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={208} y1={65} x2={228} y2={65} stroke={C.lat} strokeWidth={1} markerEnd="url(#aefwd-a2)" />
        <ellipse cx={262} cy={65} rx={28} ry={22} fill={`${C.lat}12`} stroke={C.lat}
          strokeWidth={1.2} strokeDasharray="3 2" />
        <text x={262} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.lat}>z</text>
        <text x={262} y={75} textAnchor="middle" fontSize={7} fill={C.muted}>0.627</text>
      </motion.g>

      {/* Decoder op */}
      <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={290} y1={65} x2={310} y2={65} stroke={C.dec} strokeWidth={1} markerEnd="url(#aefwd-a3)" />
        <rect x={313} y={35} width={100} height={60} rx={6} fill={`${C.dec}08`} stroke={C.dec} strokeWidth={1} />
        <text x={363} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dec}>Decoder</text>
        <text x={363} y={64} textAnchor="middle" fontSize={7} fill={C.muted}>W_dec @ z + b_dec</text>
        <text x={363} y={76} textAnchor="middle" fontSize={7} fill={C.dec}>→ σ(pre_act)</text>
      </motion.g>

      {/* Output */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={413} y1={65} x2={430} y2={65} stroke={C.dec} strokeWidth={1} markerEnd="url(#aefwd-a3)" />
        <rect x={433} y={40} width={40} height={50} rx={5} fill={`${C.dec}12`} stroke={C.dec} strokeWidth={1} />
        <text x={453} y={60} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dec}>x&#x0302;</text>
        <text x={453} y={73} textAnchor="middle" fontSize={7} fill={C.muted}>[.593,</text>
        <text x={453} y={82} textAnchor="middle" fontSize={7} fill={C.muted}>.608]</text>
      </motion.g>

      {/* Bottom: general formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={80} y={115} width={320} height={25} rx={5} fill={`${C.lat}08`} stroke={C.lat} strokeWidth={0.8} />
        <text x={240} y={132} textAnchor="middle" fontSize={8} fill={C.lat}>
          x ∈ R^n → W_enc(k×n) → z ∈ R^k → W_dec(n×k) → x&#x0302; ∈ R^n
        </text>
      </motion.g>

      <defs>
        <marker id="aefwd-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.enc} />
        </marker>
        <marker id="aefwd-a2" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.lat} />
        </marker>
        <marker id="aefwd-a3" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.dec} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 3: MSE loss computation */
export function Step3() {
  return (
    <g>
      {/* Input vs Output comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={30} y={20} width={90} height={55} rx={6} fill={`${C.enc}10`} stroke={C.enc} strokeWidth={1} />
        <text x={75} y={37} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.enc}>입력 x</text>
        <text x={75} y={52} textAnchor="middle" fontSize={9} fill={C.enc}>x₁ = 0.800</text>
        <text x={75} y={65} textAnchor="middle" fontSize={9} fill={C.enc}>x₂ = 0.400</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={140} y={20} width={90} height={55} rx={6} fill={`${C.dec}10`} stroke={C.dec} strokeWidth={1} />
        <text x={185} y={37} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dec}>출력 x&#x0302;</text>
        <text x={185} y={52} textAnchor="middle" fontSize={9} fill={C.dec}>x&#x0302;₁ = 0.593</text>
        <text x={185} y={65} textAnchor="middle" fontSize={9} fill={C.dec}>x&#x0302;₂ = 0.608</text>
      </motion.g>

      {/* Difference */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={250} y={20} width={100} height={55} rx={6} fill={`${C.loss}08`} stroke={C.loss} strokeWidth={1} />
        <text x={300} y={37} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.loss}>차이²</text>
        <text x={300} y={52} textAnchor="middle" fontSize={8} fill={C.loss}>(0.8-0.593)² = 0.0428</text>
        <text x={300} y={65} textAnchor="middle" fontSize={8} fill={C.loss}>(0.4-0.608)² = 0.0433</text>
      </motion.g>

      {/* Arrow to result */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={350} y1={48} x2={375} y2={48} stroke={C.loss} strokeWidth={1} markerEnd="url(#aefwd-loss)" />
        <rect x={378} y={25} width={85} height={45} rx={8} fill={`${C.loss}12`} stroke={C.loss} strokeWidth={1.5} />
        <text x={420} y={43} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.loss}>MSE</text>
        <text x={420} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.loss}>0.0431</text>
      </motion.g>

      {/* Formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        <rect x={60} y={95} width={360} height={45} rx={6} fill={`${C.lat}06`} stroke={C.lat} strokeWidth={0.8} />
        <text x={240} y={112} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.lat}>
          L = (1/n) Σᵢ (xᵢ - x&#x0302;ᵢ)²
        </text>
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill={C.muted}>
          = (1/2) × (0.0428 + 0.0433) = 0.0431
        </text>
      </motion.g>

      <defs>
        <marker id="aefwd-loss" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.loss} />
        </marker>
      </defs>
    </g>
  );
}
