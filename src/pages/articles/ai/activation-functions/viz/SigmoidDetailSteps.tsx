import { motion } from 'framer-motion';
import { COLORS } from './SigmoidDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---------- helpers ---------- */

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDeriv(x: number) {
  const s = sigmoid(x);
  return s * (1 - s);
}

/* ---------- Step 0: σ(x) 수식 + 특성 ---------- */

export function FormulaAndCurve() {
  /* compact graph on left, formula+table on right */
  const ox = 110, oy = 85;
  const scX = 14, scY = 50;
  const mapX = (x: number) => ox + x * scX;
  const mapY = (y: number) => oy - y * scY;

  const pts = Array.from({ length: 49 }, (_, i) => -6 + i * 0.25);
  const fnPath = pts
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${mapX(x).toFixed(1)},${mapY(sigmoid(x)).toFixed(1)}`)
    .join(' ');
  const dPath = pts
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${mapX(x).toFixed(1)},${mapY(sigmoidDeriv(x)).toFixed(1)}`)
    .join(' ');

  const kvs = [
    { input: '-∞', output: '0' },
    { input: '0', output: '0.5' },
    { input: '+∞', output: '1' },
  ];

  return (
    <g>
      {/* ── Left: compact curve ── */}
      <rect x={8} y={10} width={230} height={135} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

      {/* axes */}
      <line x1={mapX(-5)} y1={oy} x2={mapX(5)} y2={oy} stroke="#888" strokeWidth={0.4} />
      <line x1={ox} y1={mapY(-0.05)} x2={ox} y2={mapY(1.05)} stroke="#888" strokeWidth={0.4} />

      {/* y=1 dashed */}
      <line x1={mapX(-5)} y1={mapY(1)} x2={mapX(5)} y2={mapY(1)}
        stroke={COLORS.dim} strokeWidth={0.3} strokeDasharray="3 3" />
      <text x={mapX(-5.5)} y={mapY(1) + 3} fontSize={7} fill={COLORS.dim}>1</text>
      <text x={mapX(-5.5)} y={oy + 3} fontSize={7} fill={COLORS.dim}>0</text>

      {/* σ(x) */}
      <motion.path d={fnPath} fill="none" stroke={COLORS.sig} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.8 }} />
      {/* label with opaque background to avoid curve overlap */}
      <rect x={mapX(3.5)} y={mapY(1.05) - 1} width={28} height={12} rx={3}
        fill="var(--card)" stroke={COLORS.sig} strokeWidth={0.5} />
      <text x={mapX(3.5) + 14} y={mapY(1.05) + 9} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={COLORS.sig}>σ(x)</text>

      {/* σ'(x) */}
      <motion.path d={dPath} fill="none" stroke={COLORS.problem} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.8, delay: 0.3 }} />
      <rect x={mapX(2.5)} y={oy + 6} width={28} height={12} rx={3}
        fill="var(--card)" stroke={COLORS.problem} strokeWidth={0.5} />
      <text x={mapX(2.5) + 14} y={oy + 16} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={COLORS.problem}>σ'(x)</text>

      {/* ── Right: formula + table ── */}
      {/* formula box */}
      <rect x={255} y={10} width={215} height={55} rx={7}
        fill={`${COLORS.sig}08`} stroke={COLORS.sig} strokeWidth={1} />
      <text x={362} y={30} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.sig}>
        σ(x) = 1 / (1 + e⁻ˣ)
      </text>
      <text x={362} y={44} textAnchor="middle" fontSize={9} fill={COLORS.dim}>
        σ'(x) = σ(x) · (1 − σ(x))
      </text>
      <text x={362} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.problem}>
        σ'(0) = 0.25 (최대)
      </text>

      {/* key values table */}
      <rect x={255} y={74} width={215} height={70} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
      <text x={320} y={90} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">입력</text>
      <text x={420} y={90} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">σ(x)</text>
      <line x1={260} y1={95} x2={465} y2={95} stroke="var(--border)" strokeWidth={0.5} />
      {kvs.map((kv, i) => (
        <g key={i}>
          <text x={320} y={110 + i * 16} textAnchor="middle" fontSize={10}
            fontFamily="monospace" fill="var(--foreground)">{kv.input}</text>
          <text x={420} y={110 + i * 16} textAnchor="middle" fontSize={10}
            fontFamily="monospace" fontWeight={600} fill={COLORS.sig}>{kv.output}</text>
        </g>
      ))}
    </g>
  );
}

/* ---------- Step 1: 비영점 출력 → Zig-zag ---------- */

export function ZigzagProblem() {
  /* Left: output distribution bar — always > 0 */
  const barValues = [0.12, 0.27, 0.5, 0.73, 0.88];
  const barLabels = ['-2', '-1', '0', '1', '2'];

  /* Right: zig-zag in w1-w2 plane */
  const zigzag = [
    { x: 370, y: 30 }, { x: 340, y: 70 }, { x: 400, y: 50 },
    { x: 330, y: 100 }, { x: 380, y: 80 },
  ];

  return (
    <g>
      {/* Left section: output values */}
      <text x={95} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.problem}>
        출력 항상 {'>'} 0
      </text>
      {barValues.map((v, i) => {
        const bx = 30 + i * 28;
        const barH = v * 80;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={bx} y={110 - barH} width={22} height={barH} rx={3}
              fill={COLORS.problem} fillOpacity={0.6} />
            <text x={bx + 11} y={118} textAnchor="middle" fontSize={8} fill={COLORS.dim}>{barLabels[i]}</text>
            <text x={bx + 11} y={110 - barH - 4} textAnchor="middle" fontSize={7.5}
              fontWeight={600} fill={COLORS.problem}>{v.toFixed(2)}</text>
          </motion.g>
        );
      })}
      <text x={95} y={133} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
        x 입력값
      </text>

      {/* middle: arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={185} y1={70} x2={220} y2={70} stroke={COLORS.dim} strokeWidth={1} markerEnd="url(#arrowDim)" />
        <text x={203} y={60} textAnchor="middle" fontSize={8} fill={COLORS.dim}>gradient</text>
        <text x={203} y={85} textAnchor="middle" fontSize={7.5} fill={COLORS.problem}>부호 편향</text>
      </motion.g>

      {/* Arrow marker */}
      <defs>
        <marker id="arrowDim" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.dim} />
        </marker>
      </defs>

      {/* Right: w1-w2 zigzag */}
      <text x={360} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
        w₁-w₂ 평면 Zig-zag
      </text>
      <line x1={240} y1={70} x2={460} y2={70} stroke="#888" strokeWidth={0.4} />
      <line x1={350} y1={20} x2={350} y2={140} stroke="#888" strokeWidth={0.4} />
      <text x={455} y={66} fontSize={8} fill="#888">w₁</text>
      <text x={354} y={28} fontSize={8} fill="#888">w₂</text>

      {zigzag.map((p, i) =>
        i === 0 ? null : (
          <motion.line key={i}
            x1={zigzag[i - 1].x} y1={zigzag[i - 1].y}
            x2={p.x} y2={p.y}
            stroke="#f59e0b" strokeWidth={1.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ ...sp, delay: 0.3 + i * 0.12 }} />
        ),
      )}

      {/* ideal path */}
      <line x1={370} y1={30} x2={340} y2={110}
        stroke={COLORS.gate} strokeWidth={1} strokeDasharray="4 2" opacity={0.6} />
      <text x={310} y={118} fontSize={8} fill={COLORS.gate}>이상적 경로</text>

      {/* solution badges */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={30} y={140} width={88} height={14} rx={7} fill={COLORS.gate} fillOpacity={0.12} stroke={COLORS.gate} strokeWidth={0.8} />
        <text x={74} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.gate}>Tanh: (-1,1)</text>

        <rect x={128} y={140} width={88} height={14} rx={7} fill={COLORS.sig} fillOpacity={0.12} stroke={COLORS.sig} strokeWidth={0.8} />
        <text x={172} y={150} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.sig}>BatchNorm</text>
      </motion.g>
    </g>
  );
}

/* ---------- Step 2: 현대 사용처 ---------- */

export function ModernUsages() {
  const usages = [
    { label: 'Binary Classification', desc: '출력을 0~1 확률로 변환', sub: 'σ(logit) = P(class=1)', color: COLORS.sig, x: 10, y: 16 },
    { label: 'LSTM/GRU Gate', desc: '정보 흐름을 0~1 밸브로 조절', sub: 'forget·input·output gate', color: COLORS.gate, x: 246, y: 16 },
    { label: 'Multi-label', desc: '각 클래스 독립 확률 출력', sub: 'softmax 대신 σ → BCE 각각', color: '#f59e0b', x: 10, y: 86 },
    { label: 'GLU Gating', desc: '입력을 선택적으로 통과시킴', sub: '(W₁x) ⊙ σ(W₂x)', color: COLORS.code, x: 246, y: 86 },
  ];

  return (
    <g>
      {/* Hidden layer retired label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={10} y={0} width={460} height={14} rx={7}
          fill={COLORS.problem} fillOpacity={0.1} stroke={COLORS.problem} strokeWidth={0.6} />
        <text x={240} y={10} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.problem}>
          Hidden layer에선 ReLU/GELU로 대체 — Output/Gate에서만 사용
        </text>
      </motion.g>

      {usages.map((u, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.2 + i * 0.12 }}>
          <rect x={u.x} y={u.y} width={224} height={60} rx={7}
            fill={`${u.color}08`} stroke={u.color} strokeWidth={1} />
          <text x={u.x + 10} y={u.y + 16} fontSize={10} fontWeight={700} fill={u.color}>
            {u.label}
          </text>
          <text x={u.x + 10} y={u.y + 32} fontSize={8} fill="var(--foreground)">
            {u.desc}
          </text>
          <text x={u.x + 10} y={u.y + 48} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
            {u.sub}
          </text>
        </motion.g>
      ))}
    </g>
  );
}

/* ---------- Step 3: PyTorch 패턴 ---------- */

export function PyTorchPattern() {
  return (
    <g>
      {/* Bad pattern */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp }}>
        <rect x={10} y={8} width={220} height={138} rx={8}
          fill={COLORS.problem} fillOpacity={0.04} stroke={COLORS.problem} strokeWidth={1.2} />
        <text x={120} y={26} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.problem}>
          Bad: 직접 조합
        </text>

        {/* flow boxes */}
        <rect x={30} y={36} width={80} height={24} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={70} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">logits</text>

        <line x1={110} y1={48} x2={130} y2={48} stroke={COLORS.dim} strokeWidth={0.8}
          markerEnd="url(#arrowSd)" />

        <rect x={130} y={36} width={80} height={24} rx={6}
          fill={COLORS.problem} fillOpacity={0.08} stroke={COLORS.problem} strokeWidth={0.8} />
        <text x={170} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.problem}>sigmoid</text>

        <line x1={170} y1={60} x2={170} y2={72} stroke={COLORS.dim} strokeWidth={0.8}
          markerEnd="url(#arrowSd)" />

        <rect x={130} y={72} width={80} height={24} rx={6}
          fill={COLORS.problem} fillOpacity={0.08} stroke={COLORS.problem} strokeWidth={0.8} />
        <text x={170} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.problem}>log</text>

        <line x1={170} y1={96} x2={170} y2={108} stroke={COLORS.dim} strokeWidth={0.8}
          markerEnd="url(#arrowSd)" />

        <rect x={130} y={108} width={80} height={24} rx={6}
          fill={COLORS.problem} fillOpacity={0.08} stroke={COLORS.problem} strokeWidth={0.8} />
        <text x={170} y={124} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.problem}>BCE loss</text>

        {/* warning */}
        <text x={60} y={80} fontSize={9} fill={COLORS.problem} fontWeight={600}>σ ≈ 0 →</text>
        <text x={60} y={93} fontSize={9} fill={COLORS.problem} fontWeight={600}>log(0) = -∞</text>
        <text x={60} y={108} fontSize={8} fill={COLORS.problem}>수치 불안정!</text>
      </motion.g>

      {/* Good pattern */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={250} y={8} width={220} height={138} rx={8}
          fill={COLORS.gate} fillOpacity={0.04} stroke={COLORS.gate} strokeWidth={1.2} />
        <text x={360} y={26} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.gate}>
          Good: BCEWithLogitsLoss
        </text>

        {/* flow boxes */}
        <rect x={300} y={42} width={120} height={24} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={360} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">raw logits</text>

        <line x1={360} y1={66} x2={360} y2={82} stroke={COLORS.dim} strokeWidth={0.8}
          markerEnd="url(#arrowSd)" />

        <rect x={275} y={82} width={170} height={40} rx={8}
          fill={COLORS.gate} fillOpacity={0.1} stroke={COLORS.gate} strokeWidth={1.2} />
        <text x={360} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.gate}>
          BCEWithLogitsLoss
        </text>
        <text x={360} y={114} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
          내부: log-sum-exp 트릭
        </text>

        {/* check mark */}
        <text x={360} y={140} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.gate}>
          수치 안정 + 빠름
        </text>
      </motion.g>

      {/* arrow defs */}
      <defs>
        <marker id="arrowSd" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.dim} />
        </marker>
      </defs>
    </g>
  );
}
