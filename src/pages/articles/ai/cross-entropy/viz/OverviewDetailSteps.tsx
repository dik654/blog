import { motion } from 'framer-motion';
import { AXIOM_C, FUNC_C, ML_C, LOSS_C, INFO_C } from './OverviewDetailVizData';

/* ────────────────── Shannon Steps ────────────────── */

/** Step 0: 4가지 공리 */
export function AxiomsStep() {
  const axioms = [
    { id: '1', text: 'I(x) ≥ 0', desc: '음수 불가', y: 18 },
    { id: '2', text: 'P(x)→1 ⇒ I→0', desc: '확실한 사건', y: 52 },
    { id: '3', text: 'P(x)<P(y) ⇒ I(x)>I(y)', desc: '드문 사건 ↑', y: 86 },
    { id: '4', text: 'I(x,y) = I(x)+I(y)', desc: '독립 합산', y: 120 },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={AXIOM_C}>정보량의 공리적 요구사항</text>
      {axioms.map((a, i) => (
        <motion.g key={a.id}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          {/* 번호 원 */}
          <circle cx={52} cy={a.y + 10} r={10} fill={AXIOM_C + '18'} stroke={AXIOM_C} strokeWidth={1} />
          <text x={52} y={a.y + 14} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={AXIOM_C}>{a.id}</text>
          {/* 수식 박스 */}
          <rect x={72} y={a.y} width={180} height={24} rx={5}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={82} y={a.y + 15} fontSize={9} fontWeight={600}
            fill="var(--foreground)">{a.text}</text>
          {/* 설명 */}
          <text x={280} y={a.y + 15} fontSize={8.5}
            fill="var(--muted-foreground)">{a.desc}</text>
          {/* 연결선 */}
          <line x1={252} y1={a.y + 12} x2={275} y2={a.y + 12}
            stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 2" />
        </motion.g>
      ))}
    </g>
  );
}

/** Step 1: 유일한 함수 I(x) = -log P(x) */
export function UniqueFunctionStep() {
  return (
    <g>
      {/* 공리 4 요약 (좌측) */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
        <rect x={20} y={20} width={130} height={50} rx={6}
          fill={AXIOM_C + '10'} stroke={AXIOM_C} strokeWidth={1} />
        <text x={85} y={38} textAnchor="middle" fontSize={8.5}
          fontWeight={600} fill={AXIOM_C}>공리 4</text>
        <text x={85} y={52} textAnchor="middle" fontSize={8}
          fill="var(--foreground)">I(x·y) = I(x) + I(y)</text>
      </motion.g>

      {/* 화살표: 곱셈→덧셈 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={155} y1={45} x2={195} y2={45}
          stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrowGreen)" />
        <text x={175} y={38} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">곱→덧</text>
      </motion.g>

      {/* 결과 (우측) */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}>
        <rect x={200} y={15} width={220} height={60} rx={8}
          fill={FUNC_C + '12'} stroke={FUNC_C} strokeWidth={1.5} />
        <text x={310} y={38} textAnchor="middle" fontSize={13}
          fontWeight={700} fill={FUNC_C}>I(x) = -log P(x)</text>
        <text x={310} y={55} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">유일한 해 — 로그만 곱셈을 덧셈으로 변환</text>
      </motion.g>

      {/* 화살표 마커 */}
      <defs>
        <marker id="arrowGreen" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={FUNC_C} />
        </marker>
      </defs>

      {/* 하단 보충 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <rect x={80} y={95} width={300} height={40} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={230} y={112} textAnchor="middle" fontSize={8}
          fill="var(--foreground)">P(A∩B) = P(A)·P(B)  →  log(P(A)·P(B)) = log P(A) + log P(B)</text>
        <text x={230} y={126} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">독립 사건의 곱이 로그를 통해 덧셈으로 분리됨</text>
      </motion.g>
    </g>
  );
}

/** Step 2: log base 선택 */
export function LogBaseStep() {
  const bases = [
    { base: 'base 2', unit: 'bit', desc: 'binary digit', x: 30, color: '#3b82f6' },
    { base: 'base e', unit: 'nat', desc: 'natural unit', x: 180, color: FUNC_C },
    { base: 'base 10', unit: 'hartley', desc: 'dit', x: 330, color: ML_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">log base 선택 → 정보 단위</text>

      {bases.map((b, i) => (
        <motion.g key={b.unit}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={b.x} y={30} width={120} height={55} rx={8}
            fill={b.color + '10'} stroke={b.color} strokeWidth={1} />
          <rect x={b.x} y={30} width={120} height={5} rx={0} fill={b.color} opacity={0.7}
            clipPath={`url(#lb-clip-${i})`} />
          <defs>
            <clipPath id={`lb-clip-${i}`}>
              <rect x={b.x} y={30} width={120} height={55} rx={8} />
            </clipPath>
          </defs>
          <text x={b.x + 60} y={52} textAnchor="middle" fontSize={12}
            fontWeight={700} fill={b.color}>{b.unit}</text>
          <text x={b.x + 60} y={66} textAnchor="middle" fontSize={8}
            fill="var(--muted-foreground)">{b.base} — {b.desc}</text>
        </motion.g>
      ))}

      {/* 변환 관계 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}>
        <rect x={60} y={105} width={150} height={28} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={135} y={123} textAnchor="middle" fontSize={8.5}
          fill="var(--foreground)">1 nat ≈ 1.443 bit</text>
        <rect x={260} y={105} width={160} height={28} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={340} y={123} textAnchor="middle" fontSize={8.5}
          fill="var(--foreground)">1 hartley ≈ 3.322 bit</text>
      </motion.g>
    </g>
  );
}

/** Step 3: Shannon (1948) */
export function ShannonStep() {
  const contributions = [
    { text: '통신 채널의 최대 전송 속도', y: 58 },
    { text: '압축 한계 (source coding theorem)', y: 82 },
    { text: 'ML의 모든 확률적 loss의 기반', y: 106 },
  ];
  return (
    <g>
      {/* 논문 카드 */}
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <rect x={30} y={10} width={200} height={45} rx={8}
          fill={INFO_C + '12'} stroke={INFO_C} strokeWidth={1.5} />
        <text x={130} y={28} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={INFO_C}>Shannon (1948)</text>
        <text x={130} y={42} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">A Mathematical Theory of Communication</text>
      </motion.g>

      {/* 화살표 */}
      <motion.line x1={130} y1={55} x2={130} y2={58}
        stroke={INFO_C} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2 }} />

      {/* 기여 목록 */}
      {contributions.map((c, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.12 }}>
          <rect x={50} y={c.y} width={3} height={16} rx={1.5} fill={INFO_C} opacity={0.7} />
          <text x={62} y={c.y + 12} fontSize={9}
            fill="var(--foreground)">{c.text}</text>
        </motion.g>
      ))}

      {/* 우측: 영향 범위 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={280} y={25} width={170} height={100} rx={8}
          fill="var(--card)" stroke={FUNC_C} strokeWidth={1} strokeDasharray="4 3" />
        <text x={365} y={45} textAnchor="middle" fontSize={8.5}
          fontWeight={600} fill={FUNC_C}>ML 응용</text>
        <text x={365} y={62} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Cross-Entropy Loss</text>
        <text x={365} y={76} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">KL Divergence</text>
        <text x={365} y={90} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Maximum Likelihood</text>
        <text x={365} y={104} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Perplexity</text>
      </motion.g>
    </g>
  );
}

/* ────────────────── ML Connection Steps ────────────────── */

/** Step 0: Cross-Entropy */
export function CrossEntropyMLStep() {
  const barP = [0.7, 0.2, 0.1];
  const barH = 70;
  return (
    <g>
      {/* P 분포 (좌측) */}
      <text x={30} y={14} fontSize={9} fontWeight={700} fill={AXIOM_C}>P (정답 분포)</text>
      {barP.map((v, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}>
          <rect x={30 + i * 40} y={22 + barH * (1 - v)} width={30} height={barH * v}
            rx={3} fill={AXIOM_C + '25'} stroke={AXIOM_C} strokeWidth={0.8} />
          <text x={45 + i * 40} y={22 + barH * (1 - v) - 4} textAnchor="middle"
            fontSize={8} fill={AXIOM_C}>{v}</text>
        </motion.g>
      ))}

      {/* 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.3 }}>
        <line x1={165} y1={55} x2={195} y2={55}
          stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrCE)" />
        <text x={180} y={48} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">log Q</text>
      </motion.g>

      {/* Q 인코딩 비용 */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}>
        <rect x={200} y={20} width={250} height={75} rx={8}
          fill={LOSS_C + '08'} stroke={LOSS_C} strokeWidth={1} />
        <text x={325} y={40} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={LOSS_C}>H(P, Q) = -Σ P(x) log Q(x)</text>
        <text x={325} y={58} textAnchor="middle" fontSize={8.5}
          fill="var(--foreground)">모델 Q로 데이터 P를 인코딩하는 평균 비트 수</text>
        <text x={325} y={75} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Q가 P에 가까울수록 → 비트 수 감소 → 손실 감소</text>
      </motion.g>

      {/* 화살표 마커 */}
      <defs>
        <marker id="arrCE" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={LOSS_C} />
        </marker>
      </defs>

      {/* 하단 요약 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <rect x={120} y={110} width={240} height={30} rx={5}
          fill={FUNC_C + '10'} stroke={FUNC_C} strokeWidth={0.8} />
        <text x={240} y={129} textAnchor="middle" fontSize={8.5}
          fontWeight={600} fill={FUNC_C}>Q → P 수렴 시 CE → H(P) (엔트로피)</text>
      </motion.g>
    </g>
  );
}

/** Step 1: KL Divergence */
export function KLDivergenceMLStep() {
  return (
    <g>
      {/* CE = H + KL 분해 다이어그램 */}
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">H(P, Q) = H(P) + KL(P‖Q)</text>

      {/* 전체 바 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}>
        <rect x={40} y={30} width={400} height={30} rx={6}
          fill={LOSS_C + '10'} stroke={LOSS_C} strokeWidth={1} />
        <text x={240} y={48} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={LOSS_C}>Cross-Entropy H(P, Q)</text>
      </motion.g>

      {/* 분해 */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}>
        {/* H(P) */}
        <rect x={40} y={75} width={160} height={30} rx={6}
          fill={AXIOM_C + '15'} stroke={AXIOM_C} strokeWidth={1} />
        <text x={120} y={93} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={AXIOM_C}>H(P) 엔트로피</text>
        <text x={120} y={115} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">데이터 자체 불확실성 (고정)</text>

        {/* KL */}
        <rect x={220} y={75} width={220} height={30} rx={6}
          fill={ML_C + '15'} stroke={ML_C} strokeWidth={1} />
        <text x={330} y={93} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={ML_C}>KL(P‖Q) 추가 비트</text>
        <text x={330} y={115} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">Q의 비효율성 — 항상 ≥ 0, P=Q 일 때 0</text>
      </motion.g>

      {/* 분해 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.15 }}>
        <line x1={120} y1={60} x2={120} y2={75} stroke={AXIOM_C} strokeWidth={1} />
        <line x1={330} y1={60} x2={330} y2={75} stroke={ML_C} strokeWidth={1} />
      </motion.g>

      {/* 수식 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}>
        <text x={240} y={145} textAnchor="middle" fontSize={9}
          fill="var(--foreground)">KL(P‖Q) = Σ P(x) log( P(x) / Q(x) )</text>
      </motion.g>
    </g>
  );
}

/** Step 2: MLE ≡ CE 최소화 */
export function MLEStep() {
  const equivs = [
    { text: 'log P(data|θ) 최대화', label: 'MLE', color: FUNC_C },
    { text: '-log P(data|θ) 최소화', label: 'NLL', color: ML_C },
    { text: '-Σ P(x) log Q(x) 최소화', label: 'CE', color: LOSS_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">세 가지 동치 표현</text>

      {equivs.map((e, i) => (
        <motion.g key={e.label}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          {/* 라벨 pill */}
          <rect x={40} y={30 + i * 40} width={55} height={26} rx={13}
            fill={e.color + '15'} stroke={e.color} strokeWidth={1} />
          <text x={67.5} y={30 + i * 40 + 17} textAnchor="middle" fontSize={10}
            fontWeight={700} fill={e.color}>{e.label}</text>

          {/* 수식 박스 */}
          <rect x={110} y={30 + i * 40} width={300} height={26} rx={5}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
          <text x={260} y={30 + i * 40 + 17} textAnchor="middle" fontSize={9.5}
            fill="var(--foreground)">{e.text}</text>

          {/* 등호 연결 */}
          {i < 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}>
              <text x={24} y={30 + i * 40 + 37} fontSize={12}
                fontWeight={700} fill="var(--muted-foreground)">=</text>
            </motion.g>
          )}
        </motion.g>
      ))}
    </g>
  );
}

/** Step 3: Perplexity, MI, IB */
export function AdvancedConceptsStep() {
  const concepts = [
    {
      label: 'Perplexity', formula: 'PPL = 2^H(P)',
      desc: '언어 모델 평가', x: 20, color: INFO_C,
    },
    {
      label: 'Mutual Info', formula: 'I(X;Y) = H(X)-H(X|Y)',
      desc: '특징 선택', x: 175, color: FUNC_C,
    },
    {
      label: 'Info Bottleneck', formula: 'min I(X;Z)-βI(Z;Y)',
      desc: '딥러닝 이론', x: 330, color: ML_C,
    },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">정보이론의 ML 확장 개념</text>

      {concepts.map((c, i) => (
        <motion.g key={c.label}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={c.x} y={25} width={130} height={70} rx={8}
            fill={c.color + '08'} stroke={c.color} strokeWidth={1} />
          {/* 상단바 */}
          <defs>
            <clipPath id={`ac-clip-${i}`}>
              <rect x={c.x} y={25} width={130} height={70} rx={8} />
            </clipPath>
          </defs>
          <rect x={c.x} y={25} width={130} height={5} fill={c.color} opacity={0.7}
            clipPath={`url(#ac-clip-${i})`} />
          <text x={c.x + 65} y={50} textAnchor="middle" fontSize={9.5}
            fontWeight={700} fill={c.color}>{c.label}</text>
          <text x={c.x + 65} y={65} textAnchor="middle" fontSize={8}
            fill="var(--foreground)">{c.formula}</text>
          <text x={c.x + 65} y={80} textAnchor="middle" fontSize={7.5}
            fill="var(--muted-foreground)">{c.desc}</text>
        </motion.g>
      ))}

      {/* 하단 공통 기반 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <line x1={85} y1={110} x2={395} y2={110}
          stroke={AXIOM_C} strokeWidth={1} opacity={0.3} />
        <rect x={140} y={115} width={200} height={25} rx={12}
          fill={AXIOM_C + '10'} stroke={AXIOM_C} strokeWidth={0.8} />
        <text x={240} y={131} textAnchor="middle" fontSize={8.5}
          fontWeight={600} fill={AXIOM_C}>공통 기반: Shannon 정보이론</text>
      </motion.g>
    </g>
  );
}

/** Step 4: log를 쓰는 5가지 이유 */
export function WhyLogStep() {
  const reasons = [
    { num: '1', text: '독립 이벤트의 정보 합산', icon: '+' },
    { num: '2', text: 'MLE 수치 안정성 (log-likelihood)', icon: '∞' },
    { num: '3', text: '곱셈 → 덧셈 (계산 편의)', icon: '×' },
    { num: '4', text: 'backprop 기울기가 덧셈 구조', icon: '∇' },
    { num: '5', text: '정보이론적 해석 (bits)', icon: 'I' },
  ];
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={FUNC_C}>왜 log를 쓰는가?</text>

      {reasons.map((r, i) => (
        <motion.g key={r.num}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          {/* 아이콘 원 */}
          <circle cx={55} cy={30 + i * 25} r={9} fill={FUNC_C + '15'} stroke={FUNC_C} strokeWidth={0.8} />
          <text x={55} y={34 + i * 25} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={FUNC_C}>{r.icon}</text>

          {/* 텍스트 */}
          <rect x={75} y={20 + i * 25} width={340} height={20} rx={4}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
          <text x={85} y={34 + i * 25} fontSize={9}
            fill="var(--foreground)">{r.num}. {r.text}</text>
        </motion.g>
      ))}
    </g>
  );
}
