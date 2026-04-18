import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const COLORS = {
  cv: '#10b981',
  lb: '#3b82f6',
  bad: '#ef4444',
  warn: '#f59e0b',
  good: '#10b981',
  line: '#8b5cf6',
};

const STEPS = [
  {
    label: 'CV-LB 상관관계란?',
    body: 'CV(교차 검증) 점수와 LB(리더보드) 점수가 같은 방향으로 움직이는지 확인\nCV가 오르면 LB도 올라야 → 신뢰할 수 있는 CV\nCV와 LB가 반대로 움직이면 → CV 설계에 문제가 있음',
  },
  {
    label: '좋은 상관: CV ↑ = LB ↑',
    body: 'CV 점수가 높은 모델이 LB에서도 높은 점수\n산점도에서 양의 상관관계 → "Trust your CV" 가능\nCV 점수 기준으로 모델 선택하면 Private LB에서도 좋은 결과',
  },
  {
    label: '나쁜 상관: CV ↑ ≠ LB ↑',
    body: 'CV 점수와 LB 점수가 무관하거나 역상관\n→ CV를 믿고 제출하면 shake-up(순위 뒤집힘) 발생\n원인: 데이터 누출, train-test 분포 차이, 잘못된 CV 전략',
  },
  {
    label: '불일치 원인 3가지',
    body: '1. 데이터 누출(Leakage): 미래 정보가 train에 포함 → CV 과대 추정\n2. 분포 차이(Distribution Shift): train과 test의 분포가 다름\n3. CV 전략 미스매치: K-Fold vs GroupKFold 등 전략이 데이터 구조와 불일치',
  },
  {
    label: 'Trust Your CV — 실전 가이드',
    body: '1. 매 실험마다 (CV, LB) 쌍을 기록\n2. 산점도로 상관 확인 — Pearson r > 0.7 목표\n3. CV가 안정적이면 LB에 과적합하지 말고 CV 기준으로 최종 모델 선택\n4. Public LB는 전체 test의 30%일 뿐 — Private에서 뒤집힐 수 있음',
  },
];

/** Step 0: CV-LB 개념 */
function ConceptSVG() {
  return (
    <g>
      {/* CV 박스 */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={40} y={30} width={160} height={80} rx={8}
          fill={COLORS.cv} fillOpacity={0.06} stroke={COLORS.cv} strokeWidth={0.8} />
        <text x={120} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.cv}>CV Score</text>
        <text x={120} y={55} textAnchor="middle" fontSize={9} fill="var(--foreground)">로컬 데이터로 K번 평가</text>
        <text x={120} y={73} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.cv}>0.874</text>
        <text x={120} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">내가 통제 가능</text>
      </motion.g>
      {/* 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={210} y1={70} x2={270} y2={70}
          stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#arrowCVLB)" />
        <defs>
          <marker id="arrowCVLB" viewBox="0 0 6 6" refX={5} refY={3}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
          </marker>
        </defs>
        <text x={240} y={60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">상관?</text>
      </motion.g>
      {/* LB 박스 */}
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, ...sp }}>
        <rect x={280} y={30} width={160} height={80} rx={8}
          fill={COLORS.lb} fillOpacity={0.06} stroke={COLORS.lb} strokeWidth={0.8} />
        <text x={360} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.lb}>LB Score</text>
        <text x={360} y={55} textAnchor="middle" fontSize={9} fill="var(--foreground)">숨겨진 test로 1번 평가</text>
        <text x={360} y={73} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.lb}>0.881</text>
        <text x={360} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">통제 불가 (블랙박스)</text>
      </motion.g>
      <motion.text x={240} y={140} textAnchor="middle" fontSize={8} fontWeight={600}
        fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        CV↑ → LB↑ 이면 신뢰 가능한 CV
      </motion.text>
    </g>
  );
}

/** Step 1: 좋은 상관 — 산점도 */
function GoodCorrelationSVG() {
  // 좋은 상관: 양의 기울기
  const points = [
    { cv: 0.82, lb: 0.80 },
    { cv: 0.84, lb: 0.83 },
    { cv: 0.85, lb: 0.84 },
    { cv: 0.87, lb: 0.86 },
    { cv: 0.88, lb: 0.87 },
    { cv: 0.89, lb: 0.89 },
    { cv: 0.91, lb: 0.90 },
  ];
  const mapX = (cv: number) => 60 + (cv - 0.80) * 2800;
  const mapY = (lb: number) => 150 - (lb - 0.78) * 800;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.good}>
        좋은 상관: r = 0.97
      </text>
      {/* axes */}
      <line x1={55} y1={155} x2={400} y2={155} stroke="var(--muted-foreground)" strokeWidth={0.5} />
      <line x1={55} y1={20} x2={55} y2={155} stroke="var(--muted-foreground)" strokeWidth={0.5} />
      <text x={230} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CV Score</text>
      <text x={20} y={90} fontSize={8} fill="var(--muted-foreground)"
        transform="rotate(-90, 20, 90)">LB Score</text>
      {/* trend line */}
      <motion.line
        x1={mapX(0.81)} y1={mapY(0.79)}
        x2={mapX(0.92)} y2={mapY(0.91)}
        stroke={COLORS.good} strokeWidth={1} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }} />
      {/* points */}
      {points.map((p, i) => (
        <motion.circle key={i}
          cx={mapX(p.cv)} cy={mapY(p.lb)} r={5}
          fill={COLORS.good} fillOpacity={0.7}
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, ...sp }} />
      ))}
    </g>
  );
}

/** Step 2: 나쁜 상관 — 산점도 */
function BadCorrelationSVG() {
  const points = [
    { cv: 0.82, lb: 0.88 },
    { cv: 0.85, lb: 0.81 },
    { cv: 0.84, lb: 0.90 },
    { cv: 0.88, lb: 0.79 },
    { cv: 0.87, lb: 0.85 },
    { cv: 0.90, lb: 0.82 },
    { cv: 0.91, lb: 0.84 },
  ];
  const mapX = (cv: number) => 60 + (cv - 0.80) * 2800;
  const mapY = (lb: number) => 150 - (lb - 0.76) * 700;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.bad}>
        나쁜 상관: r = -0.12
      </text>
      {/* axes */}
      <line x1={55} y1={155} x2={400} y2={155} stroke="var(--muted-foreground)" strokeWidth={0.5} />
      <line x1={55} y1={20} x2={55} y2={155} stroke="var(--muted-foreground)" strokeWidth={0.5} />
      <text x={230} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CV Score</text>
      <text x={20} y={90} fontSize={8} fill="var(--muted-foreground)"
        transform="rotate(-90, 20, 90)">LB Score</text>
      {/* points — scattered */}
      {points.map((p, i) => (
        <motion.circle key={i}
          cx={mapX(p.cv)} cy={mapY(p.lb)} r={5}
          fill={COLORS.bad} fillOpacity={0.7}
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, ...sp }} />
      ))}
      {/* confusion zone */}
      <motion.rect x={100} y={40} width={250} height={100} rx={8}
        fill={COLORS.bad} fillOpacity={0.04} stroke={COLORS.bad} strokeWidth={0.5} strokeDasharray="4 3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
      <motion.text x={225} y={35} textAnchor="middle" fontSize={8} fill={COLORS.bad} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        CV를 믿을 수 없음 → 모델 선택 근거 없음
      </motion.text>
    </g>
  );
}

/** Step 3: 불일치 원인 3가지 */
function CausesSVG() {
  const causes = [
    {
      num: '1',
      title: '데이터 누출 (Leakage)',
      desc: '미래 정보 → Train 포함',
      fix: 'GroupKFold / TimeSeriesSplit',
      color: COLORS.bad,
    },
    {
      num: '2',
      title: '분포 차이 (Dist. Shift)',
      desc: 'Train ≠ Test 분포',
      fix: 'Adversarial Validation',
      color: COLORS.warn,
    },
    {
      num: '3',
      title: 'CV 전략 미스매치',
      desc: '데이터 구조와 CV 불일치',
      fix: '그룹/시계열 구조 분석',
      color: COLORS.line,
    },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
        CV-LB 불일치 원인 & 해결책
      </text>
      {causes.map((c, i) => {
        const y = 30 + i * 50;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, ...sp }}>
            {/* number circle */}
            <circle cx={40} cy={y + 18} r={12} fill={c.color} fillOpacity={0.12}
              stroke={c.color} strokeWidth={0.8} />
            <text x={40} y={y + 22} textAnchor="middle" fontSize={10} fontWeight={700} fill={c.color}>
              {c.num}
            </text>
            {/* content */}
            <rect x={60} y={y} width={370} height={38} rx={5}
              fill={c.color} fillOpacity={0.04} stroke={c.color} strokeWidth={0.4} />
            <text x={72} y={y + 15} fontSize={9} fontWeight={600} fill={c.color}>{c.title}</text>
            <text x={72} y={y + 28} fontSize={8} fill="var(--muted-foreground)">{c.desc}</text>
            {/* fix */}
            <text x={420} y={y + 22} textAnchor="end" fontSize={8} fontWeight={600} fill={COLORS.good}>
              {c.fix}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

/** Step 4: Trust Your CV */
function TrustCVSVG() {
  const steps = [
    { label: '매 실험 (CV, LB) 기록', icon: '1' },
    { label: '산점도 → r > 0.7 확인', icon: '2' },
    { label: 'CV 기준 모델 선택', icon: '3' },
    { label: 'Public LB 과적합 금지', icon: '4' },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.good}>
        Trust Your CV
      </text>
      {steps.map((s, i) => {
        const y = 30 + i * 36;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, ...sp }}>
            <circle cx={60} cy={y + 14} r={10} fill={COLORS.good} fillOpacity={0.12}
              stroke={COLORS.good} strokeWidth={0.8} />
            <text x={60} y={y + 18} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.good}>
              {s.icon}
            </text>
            <text x={82} y={y + 18} fontSize={9} fontWeight={600} fill="var(--foreground)">
              {s.label}
            </text>
            {/* connecting line */}
            {i < steps.length - 1 && (
              <line x1={60} y1={y + 25} x2={60} y2={y + 36}
                stroke={COLORS.good} strokeWidth={0.5} strokeDasharray="2 2" />
            )}
          </motion.g>
        );
      })}
      {/* final message */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={200} y={50} width={250} height={80} rx={8}
          fill={COLORS.good} fillOpacity={0.06} stroke={COLORS.good} strokeWidth={0.8} />
        <text x={325} y={72} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.good}>
          Public LB = test의 30%
        </text>
        <text x={325} y={88} textAnchor="middle" fontSize={9} fill="var(--foreground)">
          Private LB에서 뒤집힐 수 있음
        </text>
        <text x={325} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.good}>
          CV가 안정적이면 → CV를 믿어라
        </text>
      </motion.g>
    </g>
  );
}

const VISUALS = [ConceptSVG, GoodCorrelationSVG, BadCorrelationSVG, CausesSVG, TrustCVSVG];

export default function CVLBViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Visual = VISUALS[step];
        return (
          <svg viewBox="0 0 480 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Visual />
          </svg>
        );
      }}
    </StepViz>
  );
}
