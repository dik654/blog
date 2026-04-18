import { motion } from 'framer-motion';
import { COLORS } from './AdamWDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---------- Step 0: Adam + L2 문제 ---------- */

export function AdamL2Problem() {
  /* 왼쪽: 수식 흐름, 오른쪽: v가 decay를 삼키는 시각화 */
  const steps = [
    { text: '∇L\' = ∇L + λ·θ', desc: 'L2가 gradient에 추가' },
    { text: 'v += (∇L + λ·θ)²', desc: 'v에도 decay가 흡수' },
    { text: '(∇L + λ·θ) / √v', desc: '큰 v가 decay를 축소' },
  ];

  /* 오른쪽: 파라미터별 decay 비율 비교 */
  const params = [
    { label: 'θ₁', grad: 0.9, decay: 0.15, barColor: COLORS.problem },
    { label: 'θ₂', grad: 0.3, decay: 0.55, barColor: COLORS.problem },
    { label: 'θ₃', grad: 0.05, decay: 0.85, barColor: COLORS.problem },
  ];
  const barX = 310, barW = 130, barH = 18;

  return (
    <g>
      {/* 왼쪽: 수식 흐름 */}
      <rect x={8} y={6} width={200} height={142} rx={7}
        fill={`${COLORS.problem}06`} stroke={COLORS.problem} strokeWidth={0.8} />
      <text x={108} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.problem}>
        Adam + L2 경로
      </text>

      {steps.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          <rect x={20} y={32 + i * 38} width={178} height={30} rx={6}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={109} y={46 + i * 38} textAnchor="middle"
            fontSize={10} fontWeight={600} fontFamily="monospace" fill="var(--foreground)">
            {s.text}
          </text>
          <text x={109} y={58 + i * 38} textAnchor="middle"
            fontSize={7.5} fill={COLORS.dim}>{s.desc}</text>
          {i < steps.length - 1 && (
            <line x1={109} y1={62 + i * 38} x2={109} y2={70 + i * 38}
              stroke={COLORS.dim} strokeWidth={0.7} markerEnd="url(#arrowAL)" />
          )}
        </motion.g>
      ))}

      {/* 오른쪽: 실질 decay 비율 비교 */}
      <text x={375} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
        실질 decay 비율
      </text>
      <text x={375} y={35} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
        gradient 클수록 v 커짐 → decay 약화
      </text>

      {params.map((p, i) => {
        const by = 44 + i * 30;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.12 }}>
            <text x={barX - 36} y={by + 7} fontSize={9} fontWeight={600} fill="var(--foreground)">
              {p.label}
            </text>
            <text x={barX - 36} y={by + 18} fontSize={7} fill={COLORS.dim}>
              ∇={p.grad}
            </text>
            {/* bg bar */}
            <rect x={barX} y={by} width={barW} height={barH} rx={4}
              fill="var(--border)" opacity={0.2} />
            {/* effective decay bar */}
            <motion.rect x={barX} y={by} rx={4}
              initial={{ width: 0 }} animate={{ width: barW * p.decay }}
              height={barH} fill={p.barColor} fillOpacity={0.5}
              transition={{ ...sp, delay: 0.4 + i * 0.12 }} />
            <text x={barX + barW + 8} y={by + 12} fontSize={8} fontWeight={600} fill={COLORS.problem}>
              {(p.decay * 100).toFixed(0)}%
            </text>
          </motion.g>
        );
      })}

      {/* 결론 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={265} y={140} width={200} height={16} rx={8}
          fill={COLORS.problem} fillOpacity={0.1} stroke={COLORS.problem} strokeWidth={0.6} />
        <text x={365} y={151} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.problem}>
          gradient 큰 θ₁ → decay 15%만 남음
        </text>
      </motion.g>

      <defs>
        <marker id="arrowAL" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.dim} />
        </marker>
      </defs>
    </g>
  );
}

/* ---------- Step 1: AdamW 해법 ---------- */

export function AdamWFix() {
  return (
    <g>
      {/* 업데이트 규칙 다이어그램 */}
      <rect x={8} y={6} width={464} height={50} rx={7}
        fill={`${COLORS.fix}06`} stroke={COLORS.fix} strokeWidth={1} />
      <text x={240} y={25} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.fix}>
        θ = θ − η · ( m̂/(√v̂+ε) + λ·θ )
      </text>
      <text x={240} y={42} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
        Adam update (적응적)         weight decay (고정 비율)
      </text>
      {/* 밑줄 강조 */}
      <line x1={118} y1={48} x2={286} y2={48} stroke={COLORS.fix} strokeWidth={1.5} opacity={0.5} />
      <line x1={320} y1={48} x2={380} y2={48} stroke={COLORS.alt} strokeWidth={1.5} opacity={0.5} />

      {/* 왼쪽: Adam update 경로 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={14} y={66} width={210} height={82} rx={7}
          fill="var(--card)" stroke={COLORS.fix} strokeWidth={0.8} />
        <rect x={14} y={66} width={210} height={5} rx={0}
          fill={COLORS.fix} opacity={0.7}
          clipPath="inset(0 round 7px 7px 0 0)" />
        <text x={119} y={82} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.fix}>
          Adam Update
        </text>
        <text x={119} y={96} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          m = β₁·m + (1-β₁)·∇L
        </text>
        <text x={119} y={110} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          v = β₂·v + (1-β₂)·∇L²
        </text>
        <text x={119} y={124} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">
          → m̂/(√v̂+ε)
        </text>
        <text x={119} y={138} textAnchor="middle" fontSize={7.5} fill={COLORS.dim}>
          gradient만 사용 (λ·θ 없음)
        </text>
      </motion.g>

      {/* 가운데: + 기호 */}
      <motion.text x={240} y={112} textAnchor="middle" fontSize={18} fontWeight={700}
        fill={COLORS.dim}
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        +
      </motion.text>

      {/* 오른쪽: Weight decay 경로 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={256} y={66} width={210} height={82} rx={7}
          fill="var(--card)" stroke={COLORS.alt} strokeWidth={0.8} />
        <rect x={256} y={66} width={210} height={5} rx={0}
          fill={COLORS.alt} opacity={0.7}
          clipPath="inset(0 round 7px 7px 0 0)" />
        <text x={361} y={82} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.alt}>
          Weight Decay (분리)
        </text>
        <text x={361} y={100} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          λ · θ
        </text>
        <text x={361} y={116} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
          v에 의존하지 않음
        </text>
        <text x={361} y={132} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
          모든 파라미터 동일 비율 감소
        </text>
      </motion.g>
    </g>
  );
}

/* ---------- Step 2: LLM 훈련 표준 ---------- */

export function LLMTraining() {
  /* Learning rate schedule curve: warmup → cosine decay */
  const schedW = 380, schedH = 70;
  const ox = 50, oy = 105;
  const warmupPct = 0.05;
  const nPts = 60;

  const pts = Array.from({ length: nPts }, (_, i) => {
    const t = i / (nPts - 1);
    let lr: number;
    if (t < warmupPct) {
      lr = t / warmupPct;           // linear warmup
    } else {
      const prog = (t - warmupPct) / (1 - warmupPct);
      lr = 0.1 + 0.9 * 0.5 * (1 + Math.cos(Math.PI * prog)); // cosine → 10%
    }
    return { x: ox + t * schedW, y: oy - lr * schedH };
  });

  const pathD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const configs = [
    { label: 'λ = 0.1', desc: 'weight decay' },
    { label: 'β₁=0.9, β₂=0.95', desc: 'LLM 표준' },
    { label: 'batch 2M+', desc: 'tokens' },
  ];

  return (
    <g>
      {/* LR schedule */}
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.llm}>
        Learning Rate Schedule
      </text>

      {/* axes */}
      <line x1={ox} y1={oy} x2={ox + schedW} y2={oy} stroke={COLORS.dim} strokeWidth={0.4} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - schedH - 8} stroke={COLORS.dim} strokeWidth={0.4} />
      <text x={ox - 8} y={oy - schedH + 2} fontSize={7} fill={COLORS.dim}>lr</text>
      <text x={ox + schedW + 4} y={oy + 4} fontSize={7} fill={COLORS.dim}>t</text>

      {/* 10% baseline */}
      <line x1={ox} y1={oy - schedH * 0.1} x2={ox + schedW} y2={oy - schedH * 0.1}
        stroke={COLORS.dim} strokeWidth={0.3} strokeDasharray="3 3" />
      <text x={ox + schedW + 4} y={oy - schedH * 0.1 + 3} fontSize={7} fill={COLORS.dim}>10%</text>

      {/* warmup region */}
      <motion.rect x={ox} y={oy - schedH - 5} width={schedW * warmupPct} height={schedH + 5}
        rx={3} fill={COLORS.llm} fillOpacity={0.06}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
      <text x={ox + schedW * warmupPct * 0.5} y={oy - schedH - 8}
        textAnchor="middle" fontSize={7} fill={COLORS.llm}>warmup</text>

      {/* curve */}
      <motion.path d={pathD} fill="none" stroke={COLORS.llm} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 1 }} />

      {/* config badges */}
      {configs.map((c, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.5 + i * 0.1 }}>
          <rect x={ox + 10 + i * 130} y={oy + 10} width={120} height={28} rx={6}
            fill={`${COLORS.llm}08`} stroke={COLORS.llm} strokeWidth={0.6} />
          <text x={ox + 70 + i * 130} y={oy + 24} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={COLORS.llm}>{c.label}</text>
          <text x={ox + 70 + i * 130} y={oy + 34} textAnchor="middle"
            fontSize={7} fill={COLORS.dim}>{c.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

/* ---------- Step 3: 대안 옵티마이저 ---------- */

export function Alternatives() {
  const alts = [
    {
      name: 'Lion',
      desc: 'sign(m) 기반 업데이트',
      pros: '2-3x 메모리 절약',
      color: COLORS.alt,
      x: 10,
    },
    {
      name: '8-bit Adam',
      desc: '상태를 INT8로 양자화',
      pros: '75% 메모리 절약',
      color: '#06b6d4',
      x: 170,
    },
    {
      name: 'Shampoo',
      desc: '2차 정보(Hessian) 근사',
      pros: '수렴 빠름, 비용 높음',
      color: '#ec4899',
      x: 330,
    },
  ];

  return (
    <g>
      {/* 기준선: AdamW */}
      <rect x={130} y={4} width={220} height={22} rx={11}
        fill={`${COLORS.fix}10`} stroke={COLORS.fix} strokeWidth={1} />
      <text x={240} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.fix}>
        AdamW = 기본 (default)
      </text>

      {/* 대안 카드들 */}
      {alts.map((a, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.15 }}>
          <rect x={a.x} y={36} width={150} height={82} rx={8}
            fill="var(--card)" stroke={a.color} strokeWidth={1} />
          {/* top bar */}
          <rect x={a.x} y={36} width={150} height={5} rx={0} fill={a.color} opacity={0.8}
            clipPath={`inset(0 round 8px 8px 0 0)`} />

          <text x={a.x + 75} y={54} textAnchor="middle"
            fontSize={11} fontWeight={700} fill={a.color}>{a.name}</text>
          <text x={a.x + 75} y={70} textAnchor="middle"
            fontSize={8} fill="var(--foreground)">{a.desc}</text>

          {/* pros pill */}
          <rect x={a.x + 15} y={82} width={120} height={18} rx={9}
            fill={`${a.color}10`} stroke={a.color} strokeWidth={0.5} />
          <text x={a.x + 75} y={94} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={a.color}>{a.pros}</text>
        </motion.g>
      ))}

      {/* 하단: 선택 기준 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={128} width={360} height={20} rx={10}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={141} textAnchor="middle" fontSize={8} fill={COLORS.dim}>
          기본 AdamW → 메모리 부족 시 Lion/8-bit → 빠른 수렴 필요 시 Shampoo
        </text>
      </motion.g>
    </g>
  );
}
