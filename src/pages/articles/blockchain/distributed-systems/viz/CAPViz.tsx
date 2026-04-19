import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'CAP 정리 (Brewer, 2000)', body: '분산 시스템은 Consistency, Availability, Partition tolerance 중 최대 2가지만 동시 보장.' },
  { label: 'CP — 일관성 + 분할 내성', body: '네트워크 분할 시 가용성 포기. 예: 전통 BFT, Tendermint — 합의 못하면 멈춤.' },
  { label: 'AP — 가용성 + 분할 내성', body: '네트워크 분할 시 일관성 포기. 예: Nakamoto 합의 — 포크 허용, 나중에 수렴.' },
  { label: 'PACELC — 정상 시에도 트레이드오프', body: 'P분할 시 A vs C 선택, Else(정상) 시 Latency vs Consistency. 더 현실적 모델.' },
];

const NODE_R = 22;
const TRI_R = 78;
const CX = 175, CY = 110;
const angles = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6];
const labels = ['C', 'A', 'P'];
const fullLabels = ['Consistency', 'Availability', 'Partition Tol.'];
const colors = [C1, C2, C3];

const vertices = angles.map(a => ({
  x: CX + Math.cos(a) * TRI_R,
  y: CY + Math.sin(a) * TRI_R,
  a,
}));

// 풀 레이블 위치 — 각 정점에서 충분히 바깥으로
const labelOffset = NODE_R + 16;
const labelPos = angles.map((a, i) => {
  // 위쪽 정점은 위로, 아래 두 정점은 좌/우 바깥
  if (i === 0) return { x: CX, y: vertices[0].y - NODE_R - 8, anchor: 'middle' as const };
  if (i === 1) return {
    x: vertices[1].x + labelOffset * 0.55,
    y: vertices[1].y + 6,
    anchor: 'start' as const,
  };
  return {
    x: vertices[2].x - labelOffset * 0.55,
    y: vertices[2].y + 6,
    anchor: 'end' as const,
  };
});

// 두 점 사이를 NODE_R 만큼 양쪽으로 줄여 원 가장자리에서 끝나게
function trimEdge(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  return {
    x1: x1 + ux * NODE_R,
    y1: y1 + uy * NODE_R,
    x2: x2 - ux * NODE_R,
    y2: y2 - uy * NODE_R,
  };
}

export default function CAPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Triangle edges — 먼저 그려서 원 뒤에 깔리게 (그리고 원 가장자리에서 끝남) */}
          {[0, 1, 2].map(i => {
            const j = (i + 1) % 3;
            const v1 = vertices[i], v2 = vertices[j];
            const edge = trimEdge(v1.x, v1.y, v2.x, v2.y);
            const edgeActive =
              (step === 1 && (i === 0 || j === 0) && (i === 2 || j === 2)) ||
              (step === 2 && (i === 1 || j === 1) && (i === 2 || j === 2));
            const color = edgeActive ? colors[Math.max(i, j)] : 'var(--border)';
            return (
              <line key={`e${i}`} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
                stroke={color}
                strokeWidth={edgeActive ? 2 : 1} strokeLinecap="round" />
            );
          })}

          {/* Vertex circles + letters + full labels */}
          {labels.map((l, i) => {
            const v = vertices[i];
            const lp = labelPos[i];
            const active =
              step === 0 ||
              (step === 1 && (i === 0 || i === 2)) ||
              (step === 2 && (i === 1 || i === 2));
            return (
              <motion.g key={l} animate={{ opacity: active ? 1 : 0.3 }} transition={{ duration: 0.3 }}>
                {/* 배경 원 — solid 로 채워 라인을 가림 */}
                <circle cx={v.x} cy={v.y} r={NODE_R} fill="var(--background)" />
                <circle cx={v.x} cy={v.y} r={NODE_R}
                  fill={`${colors[i]}18`}
                  stroke={colors[i]}
                  strokeWidth={active ? 2 : 1.2} />
                <text x={v.x} y={v.y + 6} textAnchor="middle"
                  fontSize={18} fontWeight={700} fill={colors[i]}>
                  {l}
                </text>
                {/* 풀 레이블 — 원 바깥, 충분한 간격 */}
                <text x={lp.x} y={lp.y} textAnchor={lp.anchor}
                  fontSize={10} fontWeight={500} fill={colors[i]}>
                  {fullLabels[i]}
                </text>
              </motion.g>
            );
          })}

          {/* Right side info panel */}
          <rect x={300} y={30} width={150} height={155} rx={8}
            fill={`${C1}06`} stroke="var(--border)" strokeWidth={0.6} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={310} y={55} fontSize={10} fontWeight={600} fill={C1}>3가지 중 2가지만</text>
              <text x={310} y={73} fontSize={10} fontWeight={600} fill={C1}>동시 보장 가능</text>
              <text x={310} y={100} fontSize={10} fill="var(--muted-foreground)">네트워크 분할(P)은</text>
              <text x={310} y={115} fontSize={10} fill="var(--muted-foreground)">불가피 → C vs A 선택</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={310} y={55} fontSize={10} fontWeight={600} fill={C1}>CP 시스템</text>
              <text x={310} y={75} fontSize={10} fill="var(--muted-foreground)">분할 시 → 서비스 중단</text>
              <text x={310} y={92} fontSize={10} fill="var(--muted-foreground)">Tendermint, Raft</text>
              <text x={310} y={109} fontSize={10} fill="var(--muted-foreground)">즉시 최종성 보장</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={310} y={55} fontSize={10} fontWeight={600} fill={C2}>AP 시스템</text>
              <text x={310} y={75} fontSize={10} fill="var(--muted-foreground)">분할 시 → 포크 허용</text>
              <text x={310} y={92} fontSize={10} fill="var(--muted-foreground)">Bitcoin, Ethereum PoW</text>
              <text x={310} y={109} fontSize={10} fill="var(--muted-foreground)">확률적 최종성</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={310} y={50} fontSize={10} fontWeight={600} fill={C3}>PACELC</text>
              <text x={310} y={70} fontSize={10} fill="var(--muted-foreground)">P: A vs C 선택</text>
              <text x={310} y={87} fontSize={10} fill="var(--muted-foreground)">E: Latency vs C</text>
              <text x={310} y={108} fontSize={10} fill="var(--muted-foreground)">PA/EL: Dynamo</text>
              <text x={310} y={123} fontSize={10} fill="var(--muted-foreground)">PC/EC: BigTable</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
