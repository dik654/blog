import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: 'API', color: '#6366f1', y: 15 },
  { label: 'Actors', color: '#10b981', y: 35 },
  { label: 'CUDA Pack', color: '#f59e0b', y: 55 },
  { label: 'Storage', color: '#8b5cf6', y: 75 },
  { label: 'VDF', color: '#ec4899', y: 95 },
];
const LX = 80, LW = 180;

const STEPS = [
  { label: 'API 서버 — 업로드 수신', body: '클라이언트 업로드 요청을 HTTP/JSON-RPC로 수신합니다.' },
  { label: 'Actix 액터 시스템 — 비동기 라우팅', body: '컴포넌트 간 분리된 비동기 메시지 라우팅 처리.' },
  { label: 'CUDA 패킹 — GPU 가속', body: '매트릭스 패킹 알고리즘으로 청크 정렬. GPU 가속 적용.' },
  { label: '스토리지 — Merkle 인덱싱', body: '청크 단위 저장 + Merkle 트리 인덱싱. 저장 증명 기반.' },
  { label: 'VDF 합의 — 블록 최종성', body: 'SHA256 순차 체크포인트로 블록 최종성을 보장합니다.' },
];

export default function IrysDataFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = i <= step;
            const cur = i === step;
            return (
              <g key={n.label}>
                <motion.rect x={LX} y={n.y} width={LW} height={16} rx={4}
                  animate={{ fill: cur ? `${n.color}25` : active ? `${n.color}10` : `${n.color}04`,
                    stroke: n.color, strokeWidth: cur ? 2 : 0.5, opacity: active ? 1 : 0.2 }}
                  transition={sp} />
                <text x={LX + LW / 2} y={n.y + 11} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={n.color} opacity={active ? 1 : 0.25}>{n.label}</text>
                {i < NODES.length - 1 && (
                  <motion.line x1={LX + LW / 2} y1={n.y + 17} x2={LX + LW / 2} y2={NODES[i + 1].y - 1}
                    stroke="var(--border)" strokeWidth={0.7}
                    animate={{ opacity: active && step > i ? 0.4 : 0.08 }} transition={sp} />
                )}
                <text x={LX - 8} y={n.y + 11} textAnchor="end" fontSize={10}
                  fill="var(--muted-foreground)" opacity={active ? 0.6 : 0.15}>{i + 1}</text>
              </g>
            );
          })}
          {/* flow arrow */}
          <motion.text x={LX + LW + 15} y={60} fontSize={10} fill="var(--muted-foreground)"
            animate={{ opacity: 0.3 }}>{'↓'}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
