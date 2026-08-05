import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: '① 문제: 서로 다른 높이의 다항식',
    body: 'STARK 에서는 Trace 2^20 rows, Quotient 2^22 rows 처럼 서로 다른 크기의 다항식이 공존. 각각 별도 Merkle 트리로 커밋하면 비효율.',
  },
  {
    label: '② 순진한 방식: 별도 Merkle 트리',
    body: '두 다항식을 각자의 트리로 커밋하면 루트가 둘, transcript interaction 이 두 배, 열기(open) 도 두 배. 약 2~3x overhead.',
  },
  {
    label: '③ MMCS 통합: virtual zeros 로 하나의 트리',
    body: '작은 matrix 를 "virtual zeros" 로 확장해 큰 matrix 와 높이를 맞추고, 하나의 root 로 모두 커밋. 루트 하나 = 커밋 하나.',
  },
  {
    label: '④ Query 비용 비교',
    body: 'MMCS: k × 22 Poseidon2 해시 (k=60~100 일반).\n별도 트리: 트리마다 k × 22 → 약 2k × 22 (+ transcript overhead). 총 2~3x 차이.',
  },
];

const TRACE = '#6366f1';
const QUOTIENT = '#f59e0b';
const ROOT = '#10b981';
const OVERHEAD = '#ef4444';
const MUTED = '#94a3b8';

// Step ①: 두 matrix 를 서로 다른 높이로 직사각형 표시
function StepProblem() {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* trace 2^20 (짧은 높이) */}
      <motion.rect x={70} y={110} width={90} height={70} rx={4}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${TRACE}22`, stroke: TRACE, strokeWidth: 1.4 }} />
      {[0,1,2,3,4].map((i) => (
        <line key={`tr-${i}`} x1={70} y1={110 + 14*(i+1)} x2={160} y2={110 + 14*(i+1)}
          stroke={TRACE} strokeWidth={0.3} opacity={0.5} />
      ))}
      <text x={115} y={102} textAnchor="middle" fontSize={10} fontWeight={600} fill={TRACE}>Trace</text>
      <text x={115} y={196} textAnchor="middle" fontSize={9} fill={TRACE}>height = 2^20</text>

      {/* quotient 2^22 (긴 높이) */}
      <motion.rect x={260} y={40} width={90} height={140} rx={4}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${QUOTIENT}22`, stroke: QUOTIENT, strokeWidth: 1.4 }}
        transition={{ delay: 0.15 }} />
      {[0,1,2,3,4,5,6,7,8,9].map((i) => (
        <line key={`qt-${i}`} x1={260} y1={40 + 14*(i+1)} x2={350} y2={40 + 14*(i+1)}
          stroke={QUOTIENT} strokeWidth={0.3} opacity={0.5} />
      ))}
      <text x={305} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={QUOTIENT}>Quotient</text>
      <text x={305} y={196} textAnchor="middle" fontSize={9} fill={QUOTIENT}>height = 2^22</text>

      {/* 높이 차 주석 */}
      <motion.line x1={200} y1={40} x2={200} y2={110} stroke={MUTED} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
      <text x={205} y={78} fontSize={8} fill={MUTED}>4x 높이 차</text>

      <text x={240} y={214} textAnchor="middle" fontSize={9} fill={MUTED}>
        서로 다른 높이 → 단순 트리 결합 불가
      </text>
    </svg>
  );
}

// Step ②: 두 matrix 위에 각각 독립된 Merkle tree (overhead 경고)
function StepSeparate() {
  // 좌측 tree (trace)
  const leftRoot = { x: 100, y: 14 };
  const leftMid = [{ x: 60, y: 44 }, { x: 140, y: 44 }];
  // 우측 tree (quotient)
  const rightRoot = { x: 340, y: 14 };
  const rightMid = [{ x: 300, y: 44 }, { x: 380, y: 44 }];

  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 좌측 트리: trace */}
      <motion.circle cx={leftRoot.x} cy={leftRoot.y} r={8}
        initial={{ scale: 0 }} animate={{ scale: 1, fill: `${TRACE}33`, stroke: TRACE, strokeWidth: 1.5 }} />
      <text x={leftRoot.x} y={leftRoot.y + 3} textAnchor="middle" fontSize={7} fill={TRACE}>R1</text>
      {leftMid.map((n, i) => (
        <g key={`lm-${i}`}>
          <line x1={leftRoot.x} y1={leftRoot.y + 8} x2={n.x} y2={n.y - 6} stroke={TRACE} strokeWidth={0.8} opacity={0.6} />
          <motion.circle cx={n.x} cy={n.y} r={6} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.1 + i*0.05 }} fill={`${TRACE}22`} stroke={TRACE} strokeWidth={1} />
        </g>
      ))}
      {/* trace matrix (짧은) */}
      <motion.rect x={60} y={70} width={80} height={60} rx={3}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${TRACE}22`, stroke: TRACE, strokeWidth: 1 }} />
      <text x={100} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill={TRACE}>Trace</text>
      <text x={100} y={118} textAnchor="middle" fontSize={8} fill={TRACE}>2^20</text>

      {/* 우측 트리: quotient */}
      <motion.circle cx={rightRoot.x} cy={rightRoot.y} r={8}
        initial={{ scale: 0 }} animate={{ scale: 1, fill: `${QUOTIENT}33`, stroke: QUOTIENT, strokeWidth: 1.5 }}
        transition={{ delay: 0.2 }} />
      <text x={rightRoot.x} y={rightRoot.y + 3} textAnchor="middle" fontSize={7} fill={QUOTIENT}>R2</text>
      {rightMid.map((n, i) => (
        <g key={`rm-${i}`}>
          <line x1={rightRoot.x} y1={rightRoot.y + 8} x2={n.x} y2={n.y - 6} stroke={QUOTIENT} strokeWidth={0.8} opacity={0.6} />
          <motion.circle cx={n.x} cy={n.y} r={6} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.25 + i*0.05 }} fill={`${QUOTIENT}22`} stroke={QUOTIENT} strokeWidth={1} />
        </g>
      ))}
      {/* quotient matrix (긴) */}
      <motion.rect x={300} y={70} width={80} height={110} rx={3}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${QUOTIENT}22`, stroke: QUOTIENT, strokeWidth: 1 }}
        transition={{ delay: 0.2 }} />
      <text x={340} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={QUOTIENT}>Quotient</text>
      <text x={340} y={142} textAnchor="middle" fontSize={8} fill={QUOTIENT}>2^22</text>

      {/* overhead 경고 배너 */}
      <motion.rect x={170} y={150} width={140} height={34} rx={6}
        initial={{ opacity: 0, y: 156 }} animate={{ opacity: 1, y: 150, fill: `${OVERHEAD}18`, stroke: OVERHEAD, strokeWidth: 1.2, strokeDasharray: '4 2' }}
        transition={{ delay: 0.5 }} />
      <text x={240} y={165} textAnchor="middle" fontSize={9} fontWeight={700} fill={OVERHEAD}>
        독립 트리 2개
      </text>
      <text x={240} y={177} textAnchor="middle" fontSize={8} fill={OVERHEAD}>
        transcript 2x · open 2x → 2~3x overhead
      </text>

      <text x={240} y={208} textAnchor="middle" fontSize={8} fill={MUTED}>
        각 트리마다 별도 commit, 별도 query path
      </text>
    </svg>
  );
}

// Step ③: 한 matrix 가 "virtual zeros" 로 패딩되어 하나의 tree 에
function StepMMCS() {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 단일 Root */}
      <motion.circle cx={240} cy={20} r={10}
        initial={{ scale: 0 }} animate={{ scale: 1, fill: `${ROOT}33`, stroke: ROOT, strokeWidth: 2 }} />
      <text x={240} y={23} textAnchor="middle" fontSize={8} fontWeight={700} fill={ROOT}>Root</text>

      {/* 중간 레이어 (2 노드) */}
      {[{x:180, y:54}, {x:300, y:54}].map((n, i) => (
        <g key={`mid-${i}`}>
          <motion.line x1={240} y1={30} x2={n.x} y2={n.y-6} stroke={ROOT} strokeWidth={1} opacity={0.7}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
          <motion.circle cx={n.x} cy={n.y} r={7} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i*0.05 }} fill={`${ROOT}22`} stroke={ROOT} strokeWidth={1.2} />
        </g>
      ))}

      {/* 리프 레이어 (4 노드) */}
      {[{x:150, y:90, parent:{x:180,y:60}}, {x:210, y:90, parent:{x:180,y:60}},
        {x:270, y:90, parent:{x:300,y:60}}, {x:330, y:90, parent:{x:300,y:60}}].map((n, i) => (
        <g key={`leaf-${i}`}>
          <motion.line x1={n.parent.x} y1={n.parent.y} x2={n.x} y2={n.y-5} stroke={ROOT} strokeWidth={0.7} opacity={0.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
          <motion.circle cx={n.x} cy={n.y} r={5} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.35 + i*0.03 }} fill={`${ROOT}22`} stroke={ROOT} strokeWidth={0.8} />
        </g>
      ))}

      {/* 하단 matrix 들 (통합) */}
      {/* quotient (원래 크기) */}
      <motion.rect x={250} y={115} width={80} height={70} rx={3}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${QUOTIENT}22`, stroke: QUOTIENT, strokeWidth: 1 }}
        transition={{ delay: 0.4 }} />
      <text x={290} y={138} textAnchor="middle" fontSize={9} fontWeight={600} fill={QUOTIENT}>Quotient</text>
      <text x={290} y={150} textAnchor="middle" fontSize={8} fill={QUOTIENT}>2^22</text>

      {/* trace: 원래 부분 + virtual zeros 패딩 */}
      <motion.rect x={150} y={115} width={80} height={20} rx={3}
        initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${TRACE}22`, stroke: TRACE, strokeWidth: 1 }}
        transition={{ delay: 0.4 }} />
      <text x={190} y={129} textAnchor="middle" fontSize={8} fontWeight={600} fill={TRACE}>Trace 2^20</text>

      {/* virtual zeros 패딩 */}
      <motion.rect x={150} y={135} width={80} height={50} rx={3}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, fill: `${MUTED}12`, stroke: MUTED, strokeWidth: 0.8, strokeDasharray: '3 2' }}
        transition={{ delay: 0.55 }} />
      <text x={190} y={158} textAnchor="middle" fontSize={8} fill={MUTED}>virtual</text>
      <text x={190} y={170} textAnchor="middle" fontSize={8} fill={MUTED}>zeros</text>

      {/* 하단 라벨 */}
      <motion.text x={240} y={204} textAnchor="middle" fontSize={9} fontWeight={600} fill={ROOT}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        단일 root = 단일 커밋먼트
      </motion.text>
      <text x={240} y={215} textAnchor="middle" fontSize={8} fill={MUTED}>
        batch open · single transcript interaction
      </text>
    </svg>
  );
}

// Step ④: 막대 그래프 비교
function StepCost() {
  const k = 80;
  const logN = 22;
  const mmcsHash = k * logN;        // 1760
  const sepHash = 2 * k * logN;     // 3520

  const maxBar = 260;
  const mmcsWidth = (mmcsHash / sepHash) * maxBar; // proportion
  const sepWidth = maxBar;

  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">
        Query 비용 (k=80, log(2^22)=22)
      </text>

      {/* MMCS bar */}
      <text x={20} y={60} fontSize={9} fontWeight={600} fill={ROOT}>MMCS</text>
      <motion.rect x={90} y={48} height={22} rx={3}
        initial={{ width: 0 }} animate={{ width: mmcsWidth, fill: `${ROOT}33`, stroke: ROOT, strokeWidth: 1.2 }}
        transition={{ duration: 0.7 }} />
      <text x={90 + mmcsWidth + 6} y={62} fontSize={9} fill={ROOT} fontWeight={600}>
        k × 22 = {mmcsHash} hashes
      </text>

      {/* Separate trees bar */}
      <text x={20} y={100} fontSize={9} fontWeight={600} fill={OVERHEAD}>Separate</text>
      <motion.rect x={90} y={88} height={22} rx={3}
        initial={{ width: 0 }} animate={{ width: sepWidth, fill: `${OVERHEAD}33`, stroke: OVERHEAD, strokeWidth: 1.2 }}
        transition={{ duration: 0.7, delay: 0.3 }} />
      <text x={90 + sepWidth + 6} y={102} fontSize={9} fill={OVERHEAD} fontWeight={600}>
        2k × 22 = {sepHash} hashes
      </text>

      {/* 비율 표시 */}
      <motion.line x1={90 + mmcsWidth} y1={44} x2={90 + mmcsWidth} y2={118}
        stroke={MUTED} strokeWidth={0.8} strokeDasharray="3 2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />

      {/* 추가 항목: transcript overhead */}
      <motion.rect x={20} y={140} width={440} height={58} rx={6}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, fill: '#f1f5f910', stroke: MUTED, strokeWidth: 0.6 }}
        transition={{ delay: 0.9 }} />
      <text x={32} y={158} fontSize={9} fontWeight={700} fill="#334155">요약</text>
      <text x={32} y={173} fontSize={8} fill={ROOT}>
        • MMCS: single root, single transcript, batch open
      </text>
      <text x={32} y={186} fontSize={8} fill={OVERHEAD}>
        • Separate: 2x hash + transcript interaction → 총 2~3x overhead
      </text>

      <text x={240} y={213} textAnchor="middle" fontSize={8} fill={MUTED}>
        k 는 FRI security 에서 결정 (일반적으로 60~100)
      </text>
    </svg>
  );
}

export default function MixedMatrixViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <StepProblem />;
        if (step === 1) return <StepSeparate />;
        if (step === 2) return <StepMMCS />;
        return <StepCost />;
      }}
    </StepViz>
  );
}
