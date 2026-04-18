import { motion } from 'framer-motion';
import { COLORS } from './StepHistoryVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ── Step 0: McCulloch-Pitts 뉴런 ── */
export function McCullochPitts() {
  const inputs = [
    { label: 'x₁', y: 30 },
    { label: 'x₂', y: 75 },
    { label: 'x₃', y: 120 },
  ];
  const sumX = 180;
  const sumY = 75;
  const outX = 340;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">McCulloch-Pitts 뉴런 (1943)</text>

      {/* 입력 노드 + 가중치 화살표 */}
      {inputs.map((inp, i) => (
        <g key={i}>
          <motion.rect x={30} y={inp.y - 12} width={40} height={24} rx={4}
            fill={COLORS.hist} fillOpacity={0.15} stroke={COLORS.hist} strokeWidth={1}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.1 }} />
          <text x={50} y={inp.y + 4} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={COLORS.hist}>{inp.label}</text>
          <motion.line x1={72} y1={inp.y} x2={sumX - 22} y2={sumY}
            stroke={COLORS.hist} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ ...sp, delay: 0.1 + i * 0.08 }} />
          <text x={100} y={inp.y - 3} fontSize={8}
            fill="var(--muted-foreground)">w{i + 1}</text>
        </g>
      ))}

      {/* Σ 노드 */}
      <motion.circle cx={sumX} cy={sumY} r={22}
        fill="var(--card)" stroke={COLORS.hist} strokeWidth={1.5}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={sp} />
      <text x={sumX} y={sumY + 5} textAnchor="middle" fontSize={14}
        fontWeight={700} fill={COLORS.hist}>Σ</text>

      {/* 임계값 비교 */}
      <motion.line x1={sumX + 22} y1={sumY} x2={260} y2={sumY}
        stroke="#666" strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />
      <motion.rect x={260} y={sumY - 16} width={50} height={32} rx={4}
        fill="#fef3c7" stroke="#f59e0b" strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }} />
      <text x={285} y={sumY - 2} textAnchor="middle" fontSize={8}
        fontWeight={600} fill="#92400e">z ≥ θ ?</text>
      <text x={285} y={sumY + 10} textAnchor="middle" fontSize={7}
        fill="#92400e">임계값 비교</text>

      {/* 출력 */}
      <motion.line x1={310} y1={sumY} x2={outX - 18} y2={sumY}
        stroke="#666" strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
      <motion.rect x={outX - 18} y={sumY - 14} width={36} height={28} rx={6}
        fill={COLORS.learn} fillOpacity={0.15} stroke={COLORS.learn} strokeWidth={1.2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.45 }} />
      <text x={outX} y={sumY + 4} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={COLORS.learn}>0/1</text>

      {/* 논리 게이트 예시 (우측 하단) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={370} y={22} width={100} height={72} rx={5}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={0.8} />
        <text x={420} y={36} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">구현 가능 논리</text>
        <text x={380} y={50} fontSize={8} fill={COLORS.hist}
          fontFamily="monospace">AND: θ=1.5</text>
        <text x={380} y={62} fontSize={8} fill={COLORS.hist}
          fontFamily="monospace">OR : θ=0.5</text>
        <text x={380} y={74} fontSize={8} fill={COLORS.hist}
          fontFamily="monospace">NOT: θ=−0.5</text>
        <text x={380} y={86} fontSize={7} fill={COLORS.limit}>XOR: 불가능</text>
      </motion.g>

      {/* 범례 */}
      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        이진 입력 → 가중합(Σ) → 임계값 비교 → 0 또는 1 출력
      </text>
    </g>
  );
}

/* ── Step 1: XOR 한계 ── */
export function XorLimit() {
  /* XOR 데이터: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0 */
  const points = [
    { x: 0, y: 0, label: '0', cls: 0 },
    { x: 0, y: 1, label: '1', cls: 1 },
    { x: 1, y: 0, label: '1', cls: 1 },
    { x: 1, y: 1, label: '0', cls: 0 },
  ];
  /* 좌표 변환: data → SVG */
  const sx = (v: number) => 100 + v * 120;
  const sy = (v: number) => 120 - v * 80;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">XOR 문제 — 선형 분리 불가</text>

      {/* 축 */}
      <line x1={90} y1={130} x2={240} y2={130} stroke="#888" strokeWidth={0.5} />
      <line x1={90} y1={130} x2={90} y2={25} stroke="#888" strokeWidth={0.5} />
      <text x={235} y={143} fontSize={8} fill="#888">x₁</text>
      <text x={78} y={32} fontSize={8} fill="#888">x₂</text>

      {/* 그리드 보조선 */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(1)} y2={sy(0)}
        stroke="#ddd" strokeWidth={0.3} />
      <line x1={sx(0)} y1={sy(1)} x2={sx(1)} y2={sy(1)}
        stroke="#ddd" strokeWidth={0.3} />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(1)}
        stroke="#ddd" strokeWidth={0.3} />
      <line x1={sx(1)} y1={sy(0)} x2={sx(1)} y2={sy(1)}
        stroke="#ddd" strokeWidth={0.3} />

      {/* 데이터 포인트 */}
      {points.map((p, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r={12}
            fill={p.cls === 1 ? COLORS.hist : COLORS.limit}
            fillOpacity={0.2}
            stroke={p.cls === 1 ? COLORS.hist : COLORS.limit}
            strokeWidth={1.5} />
          <text x={sx(p.x)} y={sy(p.y) + 4} textAnchor="middle"
            fontSize={10} fontWeight={700}
            fill={p.cls === 1 ? COLORS.hist : COLORS.limit}>{p.label}</text>
        </motion.g>
      ))}

      {/* 분리 시도 직선 (실패) — 대각선 */}
      <motion.line x1={80} y1={50} x2={240} y2={135}
        stroke={COLORS.limit} strokeWidth={1.2} strokeDasharray="4,3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.5 }} />
      <motion.text x={242} y={128} fontSize={8} fill={COLORS.limit}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.7 }}>
        직선 하나로 분리 불가
      </motion.text>

      {/* 우측 설명 패널 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={280} y={28} width={180} height={90} rx={5}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={0.8} />
        <text x={370} y={44} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">Minsky & Papert (1969)</text>
        <text x={290} y={60} fontSize={8}
          fill="var(--muted-foreground)">• 단일 퍼셉트론 = 선형 분류기</text>
        <text x={290} y={74} fontSize={8}
          fill="var(--muted-foreground)">• XOR은 비선형 경계 필요</text>
        <text x={290} y={88} fontSize={8}
          fill={COLORS.limit}>• → 연구 자금 급감 (AI 겨울)</text>
        <text x={290} y={104} fontSize={8}
          fill={COLORS.dead}>• 해결: 다층 퍼셉트론(MLP)</text>
      </motion.g>

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        파란 원(1) 빨간 원(0) — 직선 하나로 두 클래스를 나눌 수 없음
      </text>
    </g>
  );
}

/* ── Step 2: Perceptron 학습 규칙 ── */
export function PerceptronLearning() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Rosenblatt Perceptron 학습 규칙 (1958)</text>

      {/* 학습 규칙 수식 */}
      <motion.rect x={60} y={26} width={360} height={38} rx={6}
        fill={COLORS.learn} fillOpacity={0.08} stroke={COLORS.learn} strokeWidth={1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <motion.text x={240} y={48} textAnchor="middle" fontSize={12}
        fontWeight={700} fontFamily="monospace" fill={COLORS.learn}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.15 }}>
        w_i ← w_i + η · (y − ŷ) · x_i
      </motion.text>

      {/* 변수 설명 */}
      {[
        { label: 'η', desc: '학습률 (learning rate)', x: 80, delay: 0.25 },
        { label: 'y', desc: '정답 레이블', x: 200, delay: 0.3 },
        { label: 'ŷ', desc: '예측값 (0 or 1)', x: 320, delay: 0.35 },
        { label: 'x_i', desc: 'i번째 입력', x: 430, delay: 0.4 },
      ].map((v, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: v.delay }}>
          <text x={v.x} y={80} textAnchor="middle" fontSize={10}
            fontWeight={700} fontFamily="monospace" fill={COLORS.learn}>{v.label}</text>
          <text x={v.x} y={92} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">{v.desc}</text>
        </motion.g>
      ))}

      {/* 수렴 조건 */}
      <motion.rect x={90} y={104} width={300} height={30} rx={5}
        fill="#fef3c7" stroke="#f59e0b" strokeWidth={0.8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }} />
      <text x={240} y={118} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#92400e">
        수렴 보장 조건: 데이터가 선형 분리 가능할 때만 (Novikoff 정리)
      </text>
      <text x={240} y={129} textAnchor="middle" fontSize={7}
        fill="#92400e">비선형 데이터(XOR) → 영원히 수렴하지 않음</text>

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        McCulloch-Pitts 뉴런에 학습 알고리즘 추가 — gradient descent 아닌 별도 규칙
      </text>
    </g>
  );
}

/* ── Step 3: 미분 불가 → 학습 불가 ── */
export function DeadGradient() {
  const cx = 130;
  const cy = 80;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">f'(x) = 0 → Backprop 전파 차단</text>

      {/* Step 함수 미분 그래프 (좌측) */}
      <text x={cx} y={30} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">f'(x)</text>
      <line x1={30} y1={cy} x2={230} y2={cy} stroke="#888" strokeWidth={0.5} />
      <line x1={cx} y1={35} x2={cx} y2={130} stroke="#888" strokeWidth={0.5} />

      {/* f'(x) = 0 양쪽 */}
      <motion.line x1={30} y1={cy} x2={cx - 3} y2={cy}
        stroke={COLORS.limit} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={sp} />
      <motion.line x1={cx + 3} y1={cy} x2={230} y2={cy}
        stroke={COLORS.limit} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.1 }} />
      <text x={70} y={cy - 6} fontSize={9} fill={COLORS.limit}
        fontWeight={600}>0</text>
      <text x={190} y={cy - 6} fontSize={9} fill={COLORS.limit}
        fontWeight={600}>0</text>

      {/* undefined at x=0 */}
      <circle cx={cx} cy={cy} r={3} fill="none"
        stroke="#f59e0b" strokeWidth={1.5} />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize={7}
        fill="#f59e0b">미정의</text>

      {/* 우측: chain rule 전파 차단 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={260} y={28} width={200} height={102} rx={6}
          fill="var(--muted)" fillOpacity={0.5} stroke="var(--border)" strokeWidth={0.8} />
        <text x={360} y={44} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">Chain Rule 전파</text>

        {/* dL/dw 수식 */}
        <text x={275} y={62} fontSize={9} fontFamily="monospace"
          fill="var(--foreground)">dL/dw = dL/df · f'(x) · x</text>

        {/* 화살표 → 0 강조 */}
        <rect x={373} y={52} width={32} height={14} rx={3}
          fill={COLORS.limit} fillOpacity={0.2} stroke={COLORS.limit} strokeWidth={0.8} />
        <text x={389} y={62} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.limit}>= 0</text>

        {/* 결과 */}
        <line x1={280} y1={72} x2={440} y2={72}
          stroke="var(--border)" strokeWidth={0.5} />

        <text x={275} y={86} fontSize={8}
          fill={COLORS.dead}>• f'(x) = 0 → 곱 전체가 0</text>
        <text x={275} y={100} fontSize={8}
          fill={COLORS.dead}>• Δw = −η · dL/dw = 0</text>
        <text x={275} y={114} fontSize={8}
          fill={COLORS.limit} fontWeight={600}>• 가중치 업데이트 없음 → 학습 정지</text>
      </motion.g>

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        미분이 0이면 경사 하강법의 학습 신호가 완전히 차단됨
      </text>
    </g>
  );
}

/* ── Step 4: 해결법 4가지 ── */
export function FourSolutions() {
  const solutions = [
    {
      title: 'Smooth Approx',
      sub: 'Sigmoid',
      desc: '1/(1+e⁻ˣ)',
      detail: '연속 미분 가능',
      color: COLORS.hist,
      x: 30,
    },
    {
      title: 'Relaxation',
      sub: 'Gumbel-Softmax',
      desc: '학습→smooth',
      detail: '추론→hard',
      color: '#f59e0b',
      x: 140,
    },
    {
      title: 'STE',
      sub: 'Straight-Through',
      desc: 'fwd: step',
      detail: 'bwd: identity',
      color: COLORS.learn,
      x: 250,
    },
    {
      title: 'Reparam',
      sub: 'Trick',
      desc: 'z = μ + σ·ε',
      detail: 'noise 분리',
      color: COLORS.solve,
      x: 360,
    },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">Step Function 미분 불가 → 4가지 해결법</text>

      {/* 상단: 문제 */}
      <motion.rect x={160} y={24} width={160} height={22} rx={4}
        fill={COLORS.limit} fillOpacity={0.12} stroke={COLORS.limit} strokeWidth={0.8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
      <text x={240} y={38} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={COLORS.limit}>f'(x) = 0 → 학습 불가</text>

      {/* 화살표 4개 */}
      {solutions.map((s, i) => (
        <motion.line key={`arrow-${i}`}
          x1={240} y1={46} x2={s.x + 50} y2={60}
          stroke={s.color} strokeWidth={0.8} strokeDasharray="3,2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.15 + i * 0.08 }} />
      ))}

      {/* 해결법 박스 4개 */}
      {solutions.map((s, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
          <rect x={s.x} y={60} width={100} height={72} rx={5}
            fill={s.color} fillOpacity={0.08} stroke={s.color} strokeWidth={1} />
          {/* 상단 바 */}
          <rect x={s.x} y={60} width={100} height={16} rx={5}
            fill={s.color} fillOpacity={0.2} />
          <rect x={s.x} y={71} width={100} height={5}
            fill={s.color} fillOpacity={0.2} />
          <text x={s.x + 50} y={72} textAnchor="middle" fontSize={8}
            fontWeight={700} fill={s.color}>{s.title}</text>
          <text x={s.x + 50} y={90} textAnchor="middle" fontSize={8}
            fontWeight={600} fill="var(--foreground)">{s.sub}</text>
          <text x={s.x + 50} y={104} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fill="var(--muted-foreground)">{s.desc}</text>
          <text x={s.x + 50} y={118} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">{s.detail}</text>
        </motion.g>
      ))}

      <text x={240} y={148} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)">
        현대 응용: 양자화 모델(STE) · 이산 VAE(Gumbel) · 스파이킹 NN
      </text>
    </g>
  );
}
