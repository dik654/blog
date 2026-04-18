import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const COLORS = {
  train: '#3b82f6',
  val: '#10b981',
  leak: '#ef4444',
  groupA: '#6366f1',
  groupB: '#f59e0b',
  groupC: '#ec4899',
  groupD: '#14b8a6',
  groupE: '#f97316',
};

const GROUP_COLORS = [COLORS.groupA, COLORS.groupB, COLORS.groupC, COLORS.groupD, COLORS.groupE];

const STEPS = [
  {
    label: '그룹 누출(Group Leakage) — 같은 그룹이 train/val에 동시 존재',
    body: '환자 데이터: 환자 A의 검사 5건 중 4건이 train, 1건이 val에 들어감\n→ 모델이 "이 환자는 양성"을 외워버림 → 검증 점수 과대 추정\n같은 환자/유저/매장의 데이터는 반드시 같은 fold에',
  },
  {
    label: 'GroupKFold: 그룹 단위로 fold 배정',
    body: '각 그룹(환자, 유저, 시나리오)을 통째로 한 fold에 배정\n→ 같은 그룹의 데이터가 train과 val에 동시에 나타나지 않음\nsklearn: GroupKFold(n_splits=5)',
  },
  {
    label: '창고 대회 예시: 시나리오 ID 기반 GroupKFold',
    body: '각 시나리오(창고 레이아웃+주문)가 하나의 그룹\n시나리오 S1의 타임슬롯 데이터가 train/val에 섞이면 → 같은 레이아웃 외움\nGroupKFold(groups=scenario_id) → 새로운 시나리오에 대한 일반화 평가',
  },
  {
    label: 'StratifiedGroupKFold: 그룹 + 클래스 비율 동시 보장',
    body: '그룹 단위 분할하면서도 각 fold의 타겟 분포를 맞춤\n예: 대출 심사 — 은행별 그룹 + 연체율(타겟) 비율 유지\nsklearn: StratifiedGroupKFold(n_splits=5)',
  },
  {
    label: '누출 여부 확인 방법',
    body: '1. CV 점수가 비정상적으로 높은가? → 0.99 이상이면 누출 의심\n2. train/val에 동일 그룹 존재 여부 확인: set(train_groups) & set(val_groups) == 0\n3. GroupKFold 적용 후 점수가 크게 떨어지면 → 이전 CV가 누출이었음',
  },
];

/** Step 0: 그룹 누출 시각화 */
function GroupLeakSVG() {
  // 환자 A의 데이터 5개 — 일부가 train, 일부가 val에 들어감
  const patients = [
    { id: 'A', samples: [0, 1, 2, 3, 4] },
    { id: 'B', samples: [5, 6, 7] },
    { id: 'C', samples: [8, 9] },
  ];
  const valIndices = new Set([2, 6, 9]); // 각 환자에서 1개씩 val
  const cellW = 36;
  const cellH = 24;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.leak}>
        그룹 누출: 같은 환자의 데이터가 양쪽에 분산
      </text>
      {patients.map((p, pi) => {
        const y = 30 + pi * 50;
        const color = GROUP_COLORS[pi];
        return (
          <motion.g key={pi} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: pi * 0.1, ...sp }}>
            <text x={30} y={y + 16} fontSize={9} fontWeight={700} fill={color}>
              환자 {p.id}
            </text>
            {p.samples.map((s, si) => {
              const isVal = valIndices.has(s);
              return (
                <g key={si}>
                  <rect x={80 + si * (cellW + 4)} y={y}
                    width={cellW} height={cellH} rx={4}
                    fill={isVal ? COLORS.leak : COLORS.train}
                    fillOpacity={isVal ? 0.6 : 0.3}
                    stroke={isVal ? COLORS.leak : 'none'}
                    strokeWidth={isVal ? 1.5 : 0}
                  />
                  <text x={80 + si * (cellW + 4) + cellW / 2} y={y + 15}
                    textAnchor="middle" fontSize={7} fill={isVal ? COLORS.leak : COLORS.train}>
                    {isVal ? 'Val' : 'Train'}
                  </text>
                </g>
              );
            })}
          </motion.g>
        );
      })}
      {/* Warning */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={80} y={180} width={320} height={22} rx={4}
          fill={COLORS.leak} fillOpacity={0.06} stroke={COLORS.leak} strokeWidth={0.5} strokeDasharray="4 3" />
        <text x={240} y={194} textAnchor="middle" fontSize={8} fill={COLORS.leak} fontWeight={600}>
          환자 A: Train 4건 + Val 1건 → 모델이 환자 패턴을 외움 → 누출!
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: GroupKFold — 그룹 단위 분할 */
function GroupKFoldSVG() {
  const groups = ['A', 'B', 'C', 'D', 'E'];
  const K = 5;
  const groupW = 75;
  const rowH = 24;
  const startX = 35;
  const startY = 25;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.val}>
        GroupKFold: 그룹 통째로 한 fold에 배정
      </text>
      {/* Headers */}
      {groups.map((g, i) => (
        <text key={i} x={startX + i * (groupW + 4) + groupW / 2} y={startY}
          textAnchor="middle" fontSize={8} fontWeight={600} fill={GROUP_COLORS[i]}>
          그룹 {g}
        </text>
      ))}
      {/* Folds */}
      {Array.from({ length: K }, (_, fold) => (
        <motion.g key={fold} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: fold * 0.08, ...sp }}>
          <text x={14} y={startY + 18 + fold * (rowH + 4) + 14} fontSize={7}
            fill="var(--muted-foreground)" textAnchor="end">
            Fold {fold + 1}
          </text>
          {groups.map((_, gi) => {
            const isVal = gi === fold;
            return (
              <rect key={gi}
                x={startX + gi * (groupW + 4)}
                y={startY + 18 + fold * (rowH + 4)}
                width={groupW}
                height={rowH}
                rx={4}
                fill={isVal ? COLORS.val : COLORS.train}
                fillOpacity={isVal ? 0.7 : 0.2}
              />
            );
          })}
        </motion.g>
      ))}
      <motion.text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        각 그룹의 모든 샘플이 같은 fold → 그룹 간 일반화 평가
      </motion.text>
    </g>
  );
}

/** Step 2: 창고 대회 시나리오 */
function WarehouseGroupSVG() {
  const scenarios = ['S1', 'S2', 'S3', 'S4', 'S5'];
  const timeslots = 5;
  const cellW = 18;
  const cellH = 16;
  const startX = 65;
  const startY = 30;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.groupD}>
        창고 대회: 시나리오 ID별 GroupKFold
      </text>
      {scenarios.map((s, si) => {
        const color = GROUP_COLORS[si];
        const isVal = si === 2; // Scenario S3 = val
        return (
          <motion.g key={si} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: si * 0.08, ...sp }}>
            <text x={50} y={startY + si * 30 + 12} fontSize={8} fontWeight={600} fill={color}
              textAnchor="end">
              {s}
            </text>
            {Array.from({ length: timeslots }, (_, t) => (
              <rect key={t}
                x={startX + t * (cellW + 3)}
                y={startY + si * 30}
                width={cellW}
                height={cellH}
                rx={2}
                fill={isVal ? COLORS.val : color}
                fillOpacity={isVal ? 0.7 : 0.3}
              />
            ))}
            <text x={startX + timeslots * (cellW + 3) + 8} y={startY + si * 30 + 12}
              fontSize={7} fill={isVal ? COLORS.val : 'var(--muted-foreground)'} fontWeight={isVal ? 600 : 400}>
              {isVal ? 'Validation' : 'Train'}
            </text>
          </motion.g>
        );
      })}
      {/* 중요 포인트 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={startX - 5} y1={startY + 2 * 30 - 4}
          x2={startX + timeslots * (cellW + 3)}
          y2={startY + 2 * 30 - 4}
          stroke={COLORS.val} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={320} y={startY + 2 * 30 + 10} fontSize={7} fill={COLORS.val} fontWeight={600}>
          S3의 모든 타임슬롯 → Val
        </text>
      </motion.g>
      <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        같은 시나리오의 타임슬롯은 항상 같은 fold → 레이아웃 외움 방지
      </text>
    </g>
  );
}

/** Step 3: StratifiedGroupKFold */
function StratifiedGroupSVG() {
  const groups = [
    { name: 'Bank A', ratio: 0.15, color: COLORS.groupA },
    { name: 'Bank B', ratio: 0.22, color: COLORS.groupB },
    { name: 'Bank C', ratio: 0.18, color: COLORS.groupC },
    { name: 'Bank D', ratio: 0.12, color: COLORS.groupD },
    { name: 'Bank E', ratio: 0.20, color: COLORS.groupE },
  ];
  const startX = 50;
  const barMaxW = 200;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.groupA}>
        StratifiedGroupKFold: 그룹 단위 + 타겟 비율 유지
      </text>
      <text x={240} y={28} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        대출 심사: 은행(그룹) + 연체율(타겟) 비율
      </text>
      {groups.map((g, i) => {
        const y = 42 + i * 30;
        const barW = barMaxW * g.ratio;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, ...sp }}>
            <text x={40} y={y + 14} fontSize={8} fontWeight={600} fill={g.color} textAnchor="end">
              {g.name}
            </text>
            <rect x={startX} y={y} width={barMaxW} height={18} rx={3}
              fill="var(--border)" fillOpacity={0.2} />
            <motion.rect x={startX} y={y} width={barW} height={18} rx={3}
              fill={g.color} fillOpacity={0.5}
              initial={{ width: 0 }} animate={{ width: barW }} transition={sp} />
            <text x={startX + barMaxW + 8} y={y + 13} fontSize={8} fill={g.color}>
              연체 {(g.ratio * 100).toFixed(0)}%
            </text>
          </motion.g>
        );
      })}
      {/* 화살표 + 결과 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={350} y={60} fontSize={8} fill="var(--muted-foreground)">각 Fold:</text>
        <text x={350} y={75} fontSize={8} fill={COLORS.val} fontWeight={600}>그룹 분리 ✓</text>
        <text x={350} y={90} fontSize={8} fill={COLORS.val} fontWeight={600}>비율 유지 ✓</text>
        <rect x={340} y={100} width={110} height={18} rx={3}
          fill={COLORS.val} fillOpacity={0.06} stroke={COLORS.val} strokeWidth={0.5} />
        <text x={395} y={112} textAnchor="middle" fontSize={7} fill={COLORS.val}>
          연체율 ~17% 유지
        </text>
      </motion.g>
    </g>
  );
}

/** Step 4: 누출 확인 */
function LeakCheckSVG() {
  const checks = [
    { label: 'CV 점수 확인', detail: 'GroupKFold 전: 0.98 → 후: 0.82', status: 'warn', color: COLORS.leak },
    { label: '교집합 검증', detail: 'train_groups ∩ val_groups = ∅', status: 'ok', color: COLORS.val },
    { label: '점수 하락폭', detail: '|0.98 - 0.82| = 0.16 → 누출 있었음', status: 'warn', color: COLORS.leak },
  ];
  const startY = 30;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
        누출 여부 진단 3단계
      </text>
      {checks.map((c, i) => {
        const y = startY + i * 52;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, ...sp }}>
            {/* step number */}
            <circle cx={40} cy={y + 20} r={12} fill={c.color} fillOpacity={0.15}
              stroke={c.color} strokeWidth={0.8} />
            <text x={40} y={y + 24} textAnchor="middle" fontSize={10} fontWeight={700} fill={c.color}>
              {i + 1}
            </text>
            {/* content */}
            <text x={65} y={y + 14} fontSize={9} fontWeight={600} fill="var(--foreground)">{c.label}</text>
            <text x={65} y={y + 28} fontSize={8} fill="var(--muted-foreground)">{c.detail}</text>
            {/* status */}
            <text x={420} y={y + 22} fontSize={9} fontWeight={600}
              fill={c.status === 'ok' ? COLORS.val : COLORS.leak}>
              {c.status === 'ok' ? '✓ 통과' : '⚠ 경고'}
            </text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={185} width={360} height={20} rx={4}
          fill={COLORS.leak} fillOpacity={0.06} stroke={COLORS.leak} strokeWidth={0.5} strokeDasharray="4 3" />
        <text x={240} y={198} textAnchor="middle" fontSize={8} fill={COLORS.leak} fontWeight={600}>
          GroupKFold 적용 전후 점수 차이가 0.05 이상이면 누출 가능성 높음
        </text>
      </motion.g>
    </g>
  );
}

const VISUALS = [GroupLeakSVG, GroupKFoldSVG, WarehouseGroupSVG, StratifiedGroupSVG, LeakCheckSVG];

export default function GroupKFoldViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Visual = VISUALS[step];
        return (
          <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Visual />
          </svg>
        );
      }}
    </StepViz>
  );
}
