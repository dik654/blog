import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './LinearVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- arrow marker ---- */
function ArrowDefs() {
  return (
    <defs>
      <marker id="linArrow" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
      </marker>
      <marker id="linArrowCA" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
      </marker>
      <marker id="linArrowCE" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={CE} />
      </marker>
      <marker id="linArrowCV" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={CV} />
      </marker>
    </defs>
  );
}

export function XavierStep() {
  const bars = [0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.5, 0.2];
  return (
    <g>
      <text x={30} y={20} fontSize={10} fill="var(--muted-foreground)">in=4 → scale=0.5</text>
      {bars.map((h, i) => (
        <motion.rect key={i} x={30 + i * 22} y={130 - h * 80} width={16} height={h * 80}
          rx={2} fill={i < 4 ? `${CA}60` : `${CE}60`}
          stroke={i < 4 ? CA : CE} strokeWidth={0.5}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          style={{ transformOrigin: `${30 + i * 22 + 8}px 130px` }}
          transition={{ delay: i * 0.08 }} />
      ))}
      <text x={74} y={148} textAnchor="middle" fontSize={10} fill={CA}>randn()</text>
      <text x={206} y={148} textAnchor="middle" fontSize={10} fill={CE}>* sqrt(1/4)</text>
    </g>
  );
}

export function BoxMullerStep() {
  /* Flow: LCG → u1,u2 (uniform) → r,θ (polar) → z (normal) → w (scaled) */
  return (
    <g>
      <ArrowDefs />
      {/* Stage 1: LCG generates uniform values */}
      <VizBox x={10} y={10} w={90} h={36} label="LCG" sub="seed → 난수" c={CA} />
      <motion.line x1={100} y1={28} x2={130} y2={28} stroke={CA} strokeWidth={0.8}
        markerEnd="url(#linArrowCA)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.1 }} />

      {/* u1, u2 boxes */}
      <VizBox x={135} y={8} w={80} h={24} label="u1 = 0.37" sub="균등분포" c={CA} delay={0.15} />
      <VizBox x={135} y={38} w={80} h={24} label="u2 = 0.82" sub="균등분포" c={CA} delay={0.2} />

      {/* Stage 2: polar conversion */}
      <motion.line x1={215} y1={28} x2={245} y2={65} stroke={CE} strokeWidth={0.8}
        markerEnd="url(#linArrowCE)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.25 }} />

      <VizBox x={250} y={50} w={100} h={24} label="r = sqrt(-2ln(u1))" sub="= 1.409" c={CE} delay={0.3} />
      <VizBox x={250} y={80} w={100} h={24} label="θ = 2π × u2" sub="= 5.152" c={CE} delay={0.35} />

      {/* Stage 3: normal sample */}
      <motion.line x1={350} y1={75} x2={375} y2={120} stroke={CV} strokeWidth={0.8}
        markerEnd="url(#linArrowCV)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />

      <VizBox x={250} y={115} w={100} h={24} label="z = r·cos(θ)" sub="= 0.537  N(0,1)" c={CV} delay={0.45} />

      {/* Stage 4: Xavier scaling */}
      <motion.line x1={250} y1={127} x2={215} y2={140} stroke={CV} strokeWidth={0.8}
        markerEnd="url(#linArrowCV)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.5 }} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
        <rect x={80} y={130} width={135} height={26} rx={5}
          fill={`${CV}15`} stroke={CV} strokeWidth={1.2} />
        <text x={147} y={143} textAnchor="middle" fontSize={9} fontWeight={600} fill={CV}>
          w = 0.537 × 0.5 = 0.269
        </text>
        <text x={147} y={153} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          × sqrt(1/in_size)
        </text>
      </motion.g>
    </g>
  );
}

export function ForwardStep() {
  /* Matrix multiplication diagram: x(2,3) @ W(3,2) + b(2,) → y(2,2) */
  const xData = [[1, 2, 3], [4, 5, 6]];
  const wData = [[0.3, -0.1], [0.5, 0.2], [-0.4, 0.6]];
  const cellW = 28, cellH = 16;

  return (
    <g>
      <ArrowDefs />
      {/* x matrix (2×3) */}
      <text x={30} y={14} fontSize={8} fontWeight={600} fill={CA}>x (2,3)</text>
      {xData.map((row, r) =>
        row.map((v, c) => (
          <motion.g key={`x${r}${c}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: (r * 3 + c) * 0.04 }}>
            <rect x={20 + c * cellW} y={20 + r * cellH} width={cellW} height={cellH}
              fill={`${CA}12`} stroke={CA} strokeWidth={0.5} rx={2} />
            <text x={20 + c * cellW + cellW / 2} y={20 + r * cellH + 11}
              textAnchor="middle" fontSize={8} fill={CA}>{v}</text>
          </motion.g>
        ))
      )}

      {/* @ symbol */}
      <motion.text x={112} y={42} fontSize={12} fontWeight={700} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        @
      </motion.text>

      {/* W matrix (3×2) */}
      <text x={137} y={8} fontSize={8} fontWeight={600} fill={CV}>W (3,2)</text>
      {wData.map((row, r) =>
        row.map((v, c) => (
          <motion.g key={`w${r}${c}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.15 + (r * 2 + c) * 0.04 }}>
            <rect x={130 + c * cellW} y={12 + r * cellH} width={cellW} height={cellH}
              fill={`${CV}12`} stroke={CV} strokeWidth={0.5} rx={2} />
            <text x={130 + c * cellW + cellW / 2} y={12 + r * cellH + 11}
              textAnchor="middle" fontSize={8} fill={CV}>{v}</text>
          </motion.g>
        ))
      )}

      {/* + b */}
      <motion.text x={195} y={42} fontSize={10} fontWeight={600} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        +
      </motion.text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <text x={210} y={30} fontSize={8} fontWeight={600} fill={CE}>b</text>
        <rect x={208} y={34} width={cellW} height={cellH} fill={`${CE}12`} stroke={CE} strokeWidth={0.5} rx={2} />
        <text x={208 + cellW / 2} y={45} textAnchor="middle" fontSize={8} fill={CE}>0.1</text>
        <rect x={208} y={34 + cellH} width={cellW} height={cellH} fill={`${CE}12`} stroke={CE} strokeWidth={0.5} rx={2} />
        <text x={208 + cellW / 2} y={45 + cellH} textAnchor="middle" fontSize={8} fill={CE}>-0.1</text>
      </motion.g>

      {/* Arrow to result */}
      <motion.line x1={245} y1={42} x2={265} y2={42} stroke="var(--muted-foreground)" strokeWidth={0.8}
        markerEnd="url(#linArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />

      {/* Result y (2×2) */}
      <text x={275} y={14} fontSize={8} fontWeight={600} fill={CE}>y (2,2)</text>
      {[[0.2, 2.0], [1.3, 4.6]].map((row, r) =>
        row.map((v, c) => (
          <motion.g key={`y${r}${c}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: 0.45 + (r * 2 + c) * 0.06 }}>
            <rect x={270 + c * (cellW + 4)} y={20 + r * cellH} width={cellW + 4} height={cellH}
              fill={`${CE}18`} stroke={CE} strokeWidth={1} rx={2} />
            <text x={270 + c * (cellW + 4) + (cellW + 4) / 2} y={20 + r * cellH + 11}
              textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>{v}</text>
          </motion.g>
        ))
      )}

      {/* Computation detail */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        <rect x={20} y={70} width={310} height={22} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.5} />
        <text x={175} y={84} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          y[0,0] = 1×0.3 + 2×0.5 + 3×(−0.4) + 0.1 = 0.2   |   broadcast: (2,3)@(3,2)+(2,) → (2,2)
        </text>
      </motion.g>
    </g>
  );
}

export function BackwardStep() {
  /* Gradient flow: gy → gx (via W^T), gW (via x^T), gb (via sum) */
  return (
    <g>
      <ArrowDefs />
      {/* gy input box */}
      <VizBox x={170} y={5} w={110} h={30} label="gy (2,2)" sub="상위에서 온 기울기" c={CA} />

      {/* Three gradient branches */}
      {/* Branch 1: gx */}
      <motion.line x1={195} y1={35} x2={70} y2={55} stroke={CE} strokeWidth={0.8}
        markerEnd="url(#linArrowCE)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.15 }} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={10} y={55} width={125} height={42} rx={5}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={72} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={CE}>
          gx = gy @ W^T
        </text>
        <text x={72} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          (2,2)@(2,3) → (2,3) 전파용
        </text>
        <text x={72} y={92} textAnchor="middle" fontSize={7} fill={CE}>
          [[0.25, 0.60, −0.10], ...]
        </text>
      </motion.g>

      {/* Branch 2: gW */}
      <motion.line x1={225} y1={35} x2={225} y2={55} stroke={CV} strokeWidth={0.8}
        markerEnd="url(#linArrowCV)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={155} y={55} width={135} height={42} rx={5}
          fill={`${CV}10`} stroke={CV} strokeWidth={1} />
        <text x={222} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={CV}>
          gW = x^T @ gy
        </text>
        <text x={222} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          (3,2)@(2,2) → (3,2) 업데이트용
        </text>
        <text x={222} y={92} textAnchor="middle" fontSize={7} fill={CV}>
          [[2.2, 3.7], [2.5, 5.0], ...]
        </text>
      </motion.g>

      {/* Branch 3: gb */}
      <motion.line x1={260} y1={35} x2={370} y2={55} stroke={CA} strokeWidth={0.8}
        markerEnd="url(#linArrowCA)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.45 }} />
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={310} y={55} width={125} height={42} rx={5}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={372} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={CA}>
          gb = sum(gy, axis=0)
        </text>
        <text x={372} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          (2,2) → (2,) 축소
        </text>
        <text x={372} y={92} textAnchor="middle" fontSize={7} fill={CA}>
          [1.3, 1.3]
        </text>
      </motion.g>

      {/* Downstream arrow from gx */}
      <motion.line x1={72} y1={97} x2={72} y2={115} stroke={CE} strokeWidth={0.6}
        strokeDasharray="3 2" markerEnd="url(#linArrowCE)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.6 }} />
      <motion.text x={72} y={125} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.65 }}>
        하위 레이어로 전파
      </motion.text>
    </g>
  );
}
