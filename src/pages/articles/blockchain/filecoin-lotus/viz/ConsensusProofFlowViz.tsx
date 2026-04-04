import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

const NODES = [
  { label: 'VRF 티켓', color: '#6366f1' },
  { label: 'Tipset 구성', color: '#8b5cf6' },
  { label: 'PoRep 봉인', color: '#10b981' },
  { label: 'WindowPoSt', color: '#f59e0b' },
  { label: 'FVM 실행', color: '#ec4899' },
  { label: '체인 확정', color: '#ef4444' },
];

const EDGES = ['당선 블록', '섹터 검증', '증명 제출', '액터 호출', '상태 전이'];

const STEPS = [
  { label: 'VRF 리더 선출', body: '마이너가 VRF로 티켓 생성\n스토리지 파워에 비례한 확률로 블록 생성 권한 획득' },
  { label: 'Tipset 구성', body: '같은 에폭에서 당선된 여러 블록이\n하나의 Tipset을 구성' },
  { label: 'PoRep 봉인', body: 'SDR 인코딩(CPU) + Merkle Tree(GPU)\n+ Groth16 증명(GPU)으로 복제 증명' },
  { label: 'WindowPoSt 증명', body: '24시간을 48개 데드라인으로 나누어\n각 데드라인마다 저장 중임을 증명' },
  { label: 'FVM 실행', body: 'WASM 기반 FVM에서 Built-in Actor\n(스토리지 마이너, 마켓 등) 실행' },
  { label: '체인 확정 (F3)', body: 'F3 프로토콜로 수 분 내 확정\n(기존 EC: ~7.5시간)' },
];

const BW = 100, BH = 38, COL_GAP = 150, ROW_GAP = 40;

function pos(i: number) {
  const row = i < 3 ? 0 : 1;
  const col = i < 3 ? i : i - 3;
  return { x: 10 + col * COL_GAP, y: 12 + row * (BH + ROW_GAP) };
}

export default function ConsensusProofFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cpf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((label, i) => {
            const from = pos(i), to = pos(i + 1);
            const vis = i < step;
            if (i === 2) {
              /* Row break: from end of row 1 → start of row 2 */
              const midY = from.y + BH + ROW_GAP / 2;
              return (
                <motion.g key={`e-${i}`} animate={{ opacity: vis ? 0.5 : 0.1 }} transition={sp}>
                  <path d={`M${from.x + BW / 2},${from.y + BH + 2} L${from.x + BW / 2},${midY} L${to.x + BW / 2},${midY} L${to.x + BW / 2},${to.y - 4}`}
                    fill="none" stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#cpf-arr)" />
                  <rect x={from.x + BW / 2 - 28} y={midY - 8} width={56} height={14} rx={3} fill="var(--card)" />
                  <text x={from.x + BW / 2} y={midY + 2} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">{label}</text>
                </motion.g>
              );
            }
            return (
              <motion.g key={`e-${i}`} animate={{ opacity: vis ? 0.5 : 0.1 }} transition={sp}>
                <line x1={from.x + BW + 2} y1={from.y + BH / 2} x2={to.x - 2} y2={to.y + BH / 2}
                  stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#cpf-arr)" />
                <rect x={(from.x + BW + to.x) / 2 - 26} y={from.y + BH / 2 - 14} width={52} height={14} rx={3} fill="var(--card)" />
                <text x={(from.x + BW + to.x) / 2} y={from.y + BH / 2 - 4} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{label}</text>
              </motion.g>
            );
          })}

          {/* Nodes (rendered last for opaque background) */}
          {NODES.map((n, i) => {
            const p = pos(i);
            const active = i === step;
            const vis = i <= step;
            return (
              <motion.g key={n.label} animate={{ opacity: vis ? 1 : 0.15 }} transition={sp}>
                <rect x={p.x} y={p.y} width={BW} height={BH} rx={6}
                  fill={active ? `${n.color}20` : 'var(--card)'}
                  stroke={n.color} strokeWidth={active ? 2 : 0.8} />
                <text x={p.x + BW / 2} y={p.y + BH / 2 + 4} textAnchor="middle"
                  fontSize={11} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
