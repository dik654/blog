import { motion } from 'framer-motion';
import { COLORS } from './CEDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: CE 수학적 의미 ── */
export function CEMathMeaning() {
  return (
    <g>
      {/* 제목 수식 */}
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        H(P, Q) = -Σ P(x) · log Q(x)
      </text>

      {/* 분해: H(P) + KL */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        {/* H(P,Q) 큰 박스 */}
        <rect x={30} y={28} width={420} height={36} rx={7}
          fill="#ef444408" stroke={COLORS.ce} strokeWidth={1}
          strokeDasharray="4 2" />
        <text x={240} y={42} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.ce}>H(P, Q)</text>
        <text x={240} y={56} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">P의 확률로 Q의 놀라움을 측정한 평균 bits</text>
      </motion.g>

      {/* 분해 화살표 */}
      <motion.line x1={240} y1={66} x2={240} y2={76}
        stroke={COLORS.dim} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />

      {/* 두 조각 */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        {/* H(P) 고정 부분 */}
        <rect x={30} y={78} width={200} height={38} rx={6}
          fill="#6366f110" stroke={COLORS.p} strokeWidth={0.8} />
        <text x={130} y={93} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.p}>H(P)</text>
        <text x={130} y={106} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">고유 엔트로피 (모델 통제 불가)</text>
      </motion.g>

      <motion.text x={240} y={100} textAnchor="middle" fontSize={12}
        fontWeight={700} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>+</motion.text>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        {/* KL 줄일 수 있는 부분 */}
        <rect x={250} y={78} width={200} height={38} rx={6}
          fill="#f59e0b10" stroke={COLORS.q} strokeWidth={0.8} />
        <text x={350} y={93} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.q}>KL(P || Q)</text>
        <text x={350} y={106} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">P와 Q의 거리 (학습으로 축소)</text>
      </motion.g>

      {/* Gibbs 부등식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.65 }}>
        <rect x={100} y={126} width={280} height={24} rx={5}
          fill="#10b98110" stroke={COLORS.ok} strokeWidth={0.8} />
        <text x={240} y={142} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.ok}>
          Gibbs: KL(P||Q) ≥ 0 → H(P,Q) ≥ H(P), 등호는 P=Q일 때만
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 분류에서 CE Loss ── */
export function ClassificationCE() {
  const classes = ['A', 'B', 'C', 'D', 'E'];
  const pVals = [0, 0, 1, 0, 0];
  const qVals = [0.1, 0.15, 0.5, 0.15, 0.1];
  const losses = [
    { q: '1.0', loss: '0', y: 28 },
    { q: '0.9', loss: '0.105', y: 44 },
    { q: '0.5', loss: '0.693', y: 60 },
    { q: '0.1', loss: '2.303', y: 76 },
    { q: '0.01', loss: '4.605', y: 92 },
  ];

  return (
    <g>
      <text x={140} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">one-hot → CE = -log(Q_correct)</text>

      {/* P 분포 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <text x={15} y={38} fontSize={8} fontWeight={700} fill={COLORS.p}>P</text>
        {classes.map((c, i) => (
          <g key={`p-${i}`}>
            <rect x={30 + i * 48} y={28} width={42} height={22} rx={4}
              fill={pVals[i] ? '#6366f118' : '#6366f106'}
              stroke={COLORS.p} strokeWidth={pVals[i] ? 1.2 : 0.4}
              strokeOpacity={pVals[i] ? 1 : 0.3} />
            <text x={51 + i * 48} y={43} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={COLORS.p}
              fillOpacity={pVals[i] ? 1 : 0.3}>{pVals[i]}</text>
          </g>
        ))}
        <text x={51 + 2 * 48} y={62} textAnchor="middle" fontSize={7}
          fill={COLORS.p}>정답 class</text>
      </motion.g>

      {/* Q 분포 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <text x={15} y={84} fontSize={8} fontWeight={700} fill={COLORS.q}>Q</text>
        {classes.map((_, i) => (
          <g key={`q-${i}`}>
            <rect x={30 + i * 48} y={72} width={42} height={22} rx={4}
              fill={i === 2 ? '#f59e0b18' : '#f59e0b08'}
              stroke={COLORS.q} strokeWidth={i === 2 ? 1.2 : 0.6} />
            <text x={51 + i * 48} y={87} textAnchor="middle" fontSize={8}
              fontWeight={i === 2 ? 700 : 400} fill={COLORS.q}>{qVals[i]}</text>
          </g>
        ))}
      </motion.g>

      {/* 화살표: P→Q 정답 class만 */}
      <motion.line x1={51 + 2 * 48} y1={52} x2={51 + 2 * 48} y2={70}
        stroke={COLORS.ce} strokeWidth={1.5} strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.35 }} />

      {/* CE 계산 결과 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={30} y={100} width={235} height={22} rx={5}
          fill="#ef444410" stroke={COLORS.ce} strokeWidth={0.8} />
        <text x={148} y={115} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.ce}>
          CE = -log(0.5) ≈ 0.693
        </text>
      </motion.g>

      {/* 오른쪽: Q_correct에 따른 loss 표 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <text x={370} y={14} textAnchor="middle" fontSize={9}
          fontWeight={700} fill="var(--foreground)">Q_correct vs Loss</text>

        {/* 헤더 */}
        <text x={320} y={28} fontSize={7.5} fontWeight={600}
          fill="var(--muted-foreground)">Q_correct</text>
        <text x={400} y={28} fontSize={7.5} fontWeight={600}
          fill="var(--muted-foreground)">-log(Q)</text>

        {losses.map((l, i) => {
          const barW = parseFloat(l.loss) * 18;
          const isHigh = parseFloat(l.loss) > 2;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
              <text x={330} y={l.y + 12} textAnchor="middle" fontSize={8}
                fill="var(--foreground)">{l.q}</text>
              <text x={400} y={l.y + 12} textAnchor="middle" fontSize={8}
                fontWeight={600} fill={isHigh ? COLORS.ce : COLORS.ok}>{l.loss}</text>
              {/* loss 막대 */}
              <motion.rect x={430} y={l.y + 2} width={barW} height={10} rx={2}
                fill={isHigh ? COLORS.ce : COLORS.ok} fillOpacity={0.25}
                initial={{ width: 0 }} animate={{ width: barW }}
                transition={{ ...sp, delay: 0.5 + i * 0.08 }} />
            </motion.g>
          );
        })}

        {/* 특성 요약 */}
        <motion.text x={370} y={112} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.9 }}>
          Q→0 이면 loss→∞ (로그 폭발)
        </motion.text>
        <motion.text x={370} y={124} textAnchor="middle" fontSize={7.5}
          fill={COLORS.ok}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 1 }}>
          자연스러운 gradient scaling
        </motion.text>
      </motion.g>

      {/* 구분선 */}
      <line x1={275} y1={18} x2={275} y2={130}
        stroke="var(--border)" strokeWidth={0.5} />
    </g>
  );
}

/* ── Step 2: PyTorch 구현 ── */
export function PyTorchImpl() {
  const methods = [
    {
      title: 'nn.CrossEntropyLoss',
      sub: 'logits → softmax → log → NLL',
      detail: '수치 안정 (권장)',
      color: COLORS.ok,
      x: 15, y: 24,
    },
    {
      title: 'softmax → log → pick',
      sub: 'F.softmax + torch.log',
      detail: 'log(very_small) = -inf 위험',
      color: COLORS.ce,
      x: 165, y: 24,
    },
    {
      title: 'log_softmax + nll_loss',
      sub: 'F.log_softmax + F.nll_loss',
      detail: 'Method 1과 동일 결과',
      color: COLORS.code,
      x: 315, y: 24,
    },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">PyTorch CE 구현 3가지</text>

      {methods.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.1 + i * 0.15 }}>
          <rect x={m.x} y={m.y} width={145} height={55} rx={7}
            fill={`${m.color}10`} stroke={m.color} strokeWidth={0.8} />
          <rect x={m.x} y={m.y} width={145} height={4} rx={2}
            fill={m.color} opacity={0.6} />
          <text x={m.x + 72} y={m.y + 20} textAnchor="middle" fontSize={8.5}
            fontWeight={700} fill={m.color}>{m.title}</text>
          <text x={m.x + 72} y={m.y + 33} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">{m.sub}</text>
          <text x={m.x + 72} y={m.y + 46} textAnchor="middle" fontSize={7.5}
            fontWeight={600} fill={m.color}>{m.detail}</text>
        </motion.g>
      ))}

      {/* 흐름도: logits → 내부 과정 → loss */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <text x={240} y={96} textAnchor="middle" fontSize={9}
          fontWeight={700} fill="var(--foreground)">권장 경로 (수치 안정)</text>

        {/* logits 박스 */}
        <rect x={25} y={104} width={72} height={26} rx={5}
          fill="#6366f110" stroke={COLORS.p} strokeWidth={0.8} />
        <text x={61} y={121} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.p}>logits</text>

        {/* 화살표 1 */}
        <line x1={99} y1={117} x2={120} y2={117}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <text x={110} y={111} textAnchor="middle" fontSize={7}
          fill={COLORS.dim}>→</text>

        {/* log_softmax */}
        <rect x={122} y={104} width={96} height={26} rx={5}
          fill="#8b5cf610" stroke={COLORS.code} strokeWidth={0.8} />
        <text x={170} y={121} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.code}>log_softmax</text>

        {/* 화살표 2 */}
        <line x1={220} y1={117} x2={240} y2={117}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <text x={230} y={111} textAnchor="middle" fontSize={7}
          fill={COLORS.dim}>→</text>

        {/* log_probs */}
        <rect x={242} y={104} width={72} height={26} rx={5}
          fill="#f59e0b10" stroke={COLORS.q} strokeWidth={0.8} />
        <text x={278} y={121} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.q}>log_probs</text>

        {/* 화살표 3 */}
        <line x1={316} y1={117} x2={336} y2={117}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <text x={326} y={111} textAnchor="middle" fontSize={7}
          fill={COLORS.dim}>→</text>

        {/* nll_loss */}
        <rect x={338} y={104} width={72} height={26} rx={5}
          fill="#ef444410" stroke={COLORS.ce} strokeWidth={0.8} />
        <text x={374} y={121} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.ce}>NLL loss</text>

        {/* 결과 */}
        <line x1={412} y1={117} x2={430} y2={117}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <text x={455} y={121} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.ok}>≈ 0.417</text>
      </motion.g>

      {/* 수치 안정 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.85 }}>
        <rect x={85} y={136} width={310} height={16} rx={4}
          fill="#10b98110" stroke={COLORS.ok} strokeWidth={0.6} />
        <text x={240} y={148} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={COLORS.ok}>
          log_softmax = x - log(Σexp(x)) → max 빼기로 overflow 방지
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: Binary Cross-Entropy ── */
export function BinaryCE() {
  return (
    <g>
      {/* BCE 수식 */}
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        BCE = -[y · log(ŷ) + (1-y) · log(1-ŷ)]
      </text>

      {/* y=1 케이스와 y=0 케이스 시각화 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        {/* y=1 */}
        <rect x={20} y={24} width={210} height={42} rx={6}
          fill="#6366f110" stroke={COLORS.p} strokeWidth={0.8} />
        <text x={125} y={40} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.p}>y = 1 일 때</text>
        <text x={125} y={56} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">L = -log(ŷ) → ŷ↑ loss↓</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        {/* y=0 */}
        <rect x={250} y={24} width={210} height={42} rx={6}
          fill="#f59e0b10" stroke={COLORS.q} strokeWidth={0.8} />
        <text x={355} y={40} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.q}>y = 0 일 때</text>
        <text x={355} y={56} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">L = -log(1-ŷ) → ŷ↓ loss↓</text>
      </motion.g>

      {/* Gradient 장점 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={100} y={74} width={280} height={22} rx={5}
          fill="#10b98110" stroke={COLORS.ok} strokeWidth={0.8} />
        <text x={240} y={89} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.ok}>
          Sigmoid 결합 시 gradient: dL/dz = ŷ - y (단순!)
        </text>
      </motion.g>

      {/* Multi-class vs Multi-label 비교 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <text x={130} y={112} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.code}>Multi-class</text>
        <rect x={40} y={116} width={180} height={34} rx={6}
          fill="#8b5cf610" stroke={COLORS.code} strokeWidth={0.8} />
        <text x={130} y={131} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">정확히 1개 class 선택</text>
        <text x={130} y={143} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.code}>softmax + CE</text>
      </motion.g>

      <motion.text x={240} y={138} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>vs</motion.text>

      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.65 }}>
        <text x={360} y={112} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.ce}>Multi-label</text>
        <rect x={270} y={116} width={180} height={34} rx={6}
          fill="#ef444410" stroke={COLORS.ce} strokeWidth={0.8} />
        <text x={360} y={131} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">여러 class 동시 가능</text>
        <text x={360} y={143} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.ce}>sigmoid + BCE</text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: Perplexity ── */
export function PerplexityStep() {
  const models = [
    { name: 'Human', ppl: 7, color: COLORS.ok },
    { name: 'GPT-4', ppl: 10, color: COLORS.ok },
    { name: 'GPT-3', ppl: 20, color: COLORS.q },
    { name: 'GPT-2', ppl: 30, color: COLORS.ce },
  ];
  const maxPPL = 35;
  const barStart = 130;
  const barMax = 300;

  return (
    <g>
      {/* 수식 */}
      <text x={240} y={14} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Perplexity = exp(Cross-Entropy)
      </text>

      {/* 직관 설명 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={60} y={22} width={360} height={22} rx={5}
          fill="#6366f110" stroke={COLORS.p} strokeWidth={0.6} />
        <text x={240} y={37} textAnchor="middle" fontSize={8}
          fill={COLORS.p}>
          PPL = 33 → "다음 단어를 33개 후보 중에서 고르는 불확실성"
        </text>
      </motion.g>

      {/* 모델별 PPL 막대 */}
      {models.map((m, i) => {
        const y = 54 + i * 22;
        const barW = (m.ppl / maxPPL) * barMax;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.12 }}>
            <text x={barStart - 8} y={y + 13} textAnchor="end" fontSize={8}
              fontWeight={600} fill="var(--foreground)">{m.name}</text>
            <motion.rect x={barStart} y={y + 2} width={0} height={14} rx={3}
              fill={m.color} fillOpacity={0.2}
              stroke={m.color} strokeWidth={0.8}
              animate={{ width: barW }}
              transition={{ ...sp, delay: 0.3 + i * 0.12 }} />
            <motion.text x={barStart + barW + 6} y={y + 13}
              fontSize={8} fontWeight={700} fill={m.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: 0.45 + i * 0.12 }}>
              ≈{m.ppl}
            </motion.text>
          </motion.g>
        );
      })}

      {/* 이론적 하한 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.8 }}>
        <line x1={barStart} y1={140} x2={barStart + barMax} y2={140}
          stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={152} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          이론 하한: true language entropy ≈ Shannon 1 bit/char
        </text>
      </motion.g>
    </g>
  );
}
