import { motion } from 'framer-motion';
import { IC, EC, MC, CC, RC } from './EntropyDetailVizData';

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

/* ── Step 0: Information Content ── */
export function InformationContentStep() {
  // 3가지 사건의 확률과 정보량
  const events = [
    { label: '동전', prob: 0.5, info: 1.0, emoji: '🪙' },
    { label: '주사위', prob: 1 / 6, info: 2.58, emoji: '🎲' },
    { label: '복권', prob: 0.0000001, info: 23.3, emoji: '🎰' },
  ];
  const maxInfo = 23.3;
  const barMax = 200;

  return (
    <g>
      {/* 수식 */}
      <rect x={130} y={4} width={220} height={22} rx={6}
        fill={`${IC}12`} stroke={IC} strokeWidth={1} />
      <text x={240} y={19} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={IC}>I(x) = -log₂ P(x)</text>

      {/* 세 사건 비교 막대 */}
      {events.map((e, i) => {
        const y = 42 + i * 36;
        const barW = (e.info / maxInfo) * barMax;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: i * 0.12 }}>
            {/* 라벨 */}
            <text x={12} y={y + 12} fontSize={9} fontWeight={600}
              fill="var(--foreground)">{e.label}</text>
            <text x={12} y={y + 23} fontSize={8}
              fill="var(--muted-foreground)">P={e.prob < 0.01 ? '10⁻⁷' : e.prob.toFixed(2)}</text>

            {/* 막대 */}
            <rect x={80} y={y + 2} width={barMax} height={18} rx={4}
              fill="var(--border)" opacity={0.15} />
            <motion.rect x={80} y={y + 2} height={18} rx={4}
              fill={`${IC}30`} stroke={IC} strokeWidth={0.8}
              initial={{ width: 0 }} animate={{ width: barW }}
              transition={{ ...sp, delay: i * 0.12 + 0.1 }} />

            {/* 값 */}
            <motion.text x={85 + barW} y={y + 15} fontSize={9}
              fontWeight={700} fill={IC}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.12 + 0.3 }}>
              {e.info.toFixed(1)} bits
            </motion.text>
          </motion.g>
        );
      })}

      {/* 해설: 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <text x={340} y={60} fontSize={8} fill="var(--muted-foreground)">확률 ↓</text>
        <line x1={355} y1={64} x2={355} y2={105}
          stroke={IC} strokeWidth={1} markerEnd="url(#arrowIC)" />
        <text x={340} y={120} fontSize={8} fill={IC} fontWeight={600}>놀라움 ↑</text>
        <defs>
          <marker id="arrowIC" markerWidth={6} markerHeight={6}
            refX={5} refY={3} orient="auto">
            <path d="M0,0 L6,3 L0,6" fill={IC} />
          </marker>
        </defs>
      </motion.g>

      {/* log base 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <text x={400} y={92} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">base 2 → bits</text>
        <text x={400} y={104} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">base e → nats</text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Shannon Entropy ── */
export function ShannonEntropyStep() {
  const dists = [
    { label: 'Uniform', probs: '각 0.25', h: 2.0, color: EC, desc: '최대 불확실' },
    { label: 'Biased', probs: '0.9/0.05/...', h: 0.63, color: MC, desc: '거의 확실' },
    { label: 'Deterministic', probs: '1/0/0/0', h: 0.0, color: RC, desc: '완전 확실' },
  ];
  const gaugeW = 140;

  return (
    <g>
      {/* 수식 */}
      <rect x={80} y={4} width={320} height={22} rx={6}
        fill={`${EC}08`} stroke={EC} strokeWidth={1} />
      <text x={240} y={19} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={EC}>H(P) = −Σ P(x) · log₂ P(x)</text>

      {/* 3행: 분포 이름 | 확률 | 엔트로피 게이지 */}
      {dists.map((d, i) => {
        const y = 38 + i * 38;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: i * 0.12 }}>
            {/* 분포 이름 + 확률 */}
            <text x={10} y={y + 12} fontSize={9} fontWeight={700} fill={d.color}>
              {d.label}
            </text>
            <text x={10} y={y + 24} fontSize={7} fill="var(--muted-foreground)">
              P = {d.probs}
            </text>

            {/* 엔트로피 게이지 바 */}
            <rect x={160} y={y + 4} width={gaugeW} height={14} rx={4}
              fill="var(--border)" opacity={0.15} />
            <motion.rect x={160} y={y + 4} height={14} rx={4}
              fill={`${d.color}35`}
              initial={{ width: 0 }}
              animate={{ width: (d.h / 2) * gaugeW }}
              transition={{ ...sp, delay: i * 0.12 + 0.2 }} />

            {/* 엔트로피 값 */}
            <text x={160 + (d.h / 2) * gaugeW + 6} y={y + 16}
              fontSize={10} fontWeight={700} fill={d.color}>
              {d.h.toFixed(2)} bit
            </text>

            {/* 설명 */}
            <text x={380} y={y + 16} fontSize={8} fill="var(--muted-foreground)">
              {d.desc}
            </text>
          </motion.g>
        );
      })}

      {/* 축 라벨 */}
      <text x={160} y={152} fontSize={7} fill="var(--muted-foreground)">0 (확실)</text>
      <text x={282} y={152} fontSize={7} fill="var(--muted-foreground)">2.0 (최대)</text>
    </g>
  );
}

/* ── Step 2: ML 활용 ── */
export function MLUsageStep() {
  const items = [
    {
      label: 'Decision Tree',
      what: '어떤 feature로 나눌지 선택',
      how: 'IG = 나누기 전 H − 나눈 후 H',
      why: '엔트로피 감소량이 큰 feature가 좋은 분류 기준',
      color: MC,
    },
    {
      label: 'Cross-Entropy Loss',
      what: '모델 예측 vs 정답 비교',
      how: 'H(P,Q) = H(P) + KL(P‖Q)',
      why: '정답 분포 P로 예측 Q를 인코딩할 때 낭비되는 bit',
      color: RC,
    },
    {
      label: 'MaxEnt 원칙',
      what: '가장 공정한 분포 찾기',
      how: '제약 조건 만족하는 최대 H 분포',
      why: '모르는 정보에 편향 없이 — 과적합 방지',
      color: EC,
    },
    {
      label: 'RL 탐색',
      what: '에이전트의 다양한 행동 유도',
      how: 'reward + α·H(π) 최대화',
      why: '엔트로피 높으면 탐색 ↑, 낮으면 착취 ↑',
      color: IC,
    },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Entropy가 ML 곳곳에서 쓰이는 이유: 불확실성을 수치화
      </text>

      {items.map((it, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 10 + col * 236;
        const y = 22 + row * 68;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={x} y={y} width={228} height={60} rx={7}
              fill={`${it.color}06`} stroke={it.color} strokeWidth={1} />
            <text x={x + 10} y={y + 14} fontSize={9} fontWeight={700} fill={it.color}>
              {it.label}
            </text>
            <text x={x + 10} y={y + 28} fontSize={8} fill="var(--foreground)">
              {it.what}
            </text>
            <text x={x + 10} y={y + 42} fontSize={7} fontFamily="monospace" fill={it.color}>
              {it.how}
            </text>
            <text x={x + 10} y={y + 54} fontSize={7} fill="var(--muted-foreground)">
              {it.why}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

/* ── Step 3: Conditional Entropy & Mutual Information ── */
export function ConditionalMIStep() {
  const circR = 38;
  const cxL = 165;  // H(X) 원 중심
  const cxR = 225;  // H(Y) 원 중심
  const cy = 78;
  const overlap = 2 * circR - (cxR - cxL); // 겹침 영역

  return (
    <g>
      {/* Chain Rule 수식 */}
      <rect x={100} y={2} width={280} height={18} rx={4}
        fill={`${CC}10`} stroke={CC} strokeWidth={0.8} />
      <text x={240} y={14} textAnchor="middle" fontSize={8.5}
        fontWeight={600} fill={CC}>H(X,Y) = H(X) + H(Y|X) = H(Y) + H(X|Y)</text>

      {/* Venn diagram */}
      <defs>
        <clipPath id="clipL">
          <circle cx={cxL} cy={cy} r={circR} />
        </clipPath>
        <clipPath id="clipR">
          <circle cx={cxR} cy={cy} r={circR} />
        </clipPath>
      </defs>

      {/* H(X) circle */}
      <motion.circle cx={cxL} cy={cy} r={circR}
        fill={`${CC}12`} stroke={CC} strokeWidth={1.5}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ ...sp, delay: 0.1 }} />

      {/* H(Y) circle */}
      <motion.circle cx={cxR} cy={cy} r={circR}
        fill={`${EC}12`} stroke={EC} strokeWidth={1.5}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ ...sp, delay: 0.2 }} />

      {/* 겹침 영역 (MI) — clipPath로 교집합 표현 */}
      <motion.circle cx={cxR} cy={cy} r={circR}
        fill={`${RC}20`} clipPath="url(#clipL)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }} />

      {/* 라벨 */}
      <motion.text x={cxL - 18} y={cy + 3} fontSize={9}
        fontWeight={700} fill={CC}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>H(X|Y)</motion.text>

      <motion.text x={(cxL + cxR) / 2} y={cy - 3} textAnchor="middle"
        fontSize={9} fontWeight={700} fill={RC}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>I(X;Y)</motion.text>
      <motion.text x={(cxL + cxR) / 2} y={cy + 9} textAnchor="middle"
        fontSize={7.5} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}>상호정보</motion.text>

      <motion.text x={cxR + 18} y={cy + 3} fontSize={9}
        fontWeight={700} fill={EC} textAnchor="end"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>H(Y|X)</motion.text>

      {/* H(X), H(Y) 외부 라벨 */}
      <text x={cxL} y={cy - circR - 6} textAnchor="middle"
        fontSize={10} fontWeight={700} fill={CC}>H(X)</text>
      <text x={cxR} y={cy - circR - 6} textAnchor="middle"
        fontSize={10} fontWeight={700} fill={EC}>H(Y)</text>

      {/* 우측: MI 해석 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={300} y={36} width={170} height={80} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={310} y={52} fontSize={8} fontWeight={600}
          fill={RC}>I(X;Y) = H(X) - H(X|Y)</text>
        <text x={310} y={66} fontSize={7.5}
          fill="var(--muted-foreground)">= 0 → X, Y 독립</text>
        <text x={310} y={80} fontSize={7.5}
          fill="var(--muted-foreground)">= H(X) → X = f(Y)</text>
        <line x1={310} y1={88} x2={460} y2={88}
          stroke="var(--border)" strokeWidth={0.5} />
        <text x={310} y={102} fontSize={7.5}
          fill="var(--muted-foreground)">Feature selection, NMI,</text>
        <text x={310} y={113} fontSize={7.5}
          fill="var(--muted-foreground)">InfoGAN, Info Bottleneck</text>
      </motion.g>
    </g>
  );
}
