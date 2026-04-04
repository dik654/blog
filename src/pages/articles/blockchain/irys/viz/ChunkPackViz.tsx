import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const BX = [50, 130, 210, 290];
const BY = 45;

const STEPS = [
  { label: '청크 구조 — Merkle 포함 증명', body: 'data_root(Merkle 루트) + data_path(경로) + bytes(256KB) + tx_offset.' },
  { label: '패킹 — 주소별 고유 XOR', body: 'packing_key = SHA256(address||offset). packed = bytes XOR keystream.' },
  { label: '저장 증명 — 랜덤 챌린지', body: '네트워크가 랜덤 chunk_offset 요청 → unpack → Merkle 검증.' },
  { label: '실패 시 페널티', body: '응답 실패 = 저장 증명 실패. 노드에 패널티 부과.' },
];

const NODES = [
  { label: 'Chunk', color: '#6366f1' },
  { label: 'Pack', color: '#10b981' },
  { label: 'Verify', color: '#f59e0b' },
  { label: 'Result', color: '#8b5cf6' },
];

export default function ChunkPackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cp" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {NODES.map((n, i) => {
            const active = i <= step;
            const cur = i === step;
            return (
              <g key={n.label}>
                <motion.rect x={BX[i] - 28} y={BY - 14} width={56} height={28} rx={6}
                  animate={{ fill: cur ? `${n.color}25` : active ? `${n.color}12` : `${n.color}06`,
                    stroke: n.color, strokeWidth: cur ? 2 : 0.8, opacity: active ? 1 : 0.25 }}
                  transition={sp} />
                <text x={BX[i]} y={BY + 3} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={n.color} opacity={active ? 1 : 0.3}>{n.label}</text>
                {i < NODES.length - 1 && (
                  <motion.line x1={BX[i] + 30} y1={BY} x2={BX[i + 1] - 30} y2={BY}
                    stroke={n.color} strokeWidth={1} markerEnd="url(#cp)"
                    animate={{ opacity: active && step > i ? 0.5 : 0.1 }} transition={sp} />
                )}
              </g>
            );
          })}
          {/* detail labels */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              {['data_root', 'bytes', 'path'].map((f, i) => (
                <text key={f} x={50} y={80 + i * 9} fontSize={10} fill="#6366f1" fontWeight={600}>{f}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.text x={130} y={84} textAnchor="middle" fontSize={10} fill="#10b981"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>XOR keystream</motion.text>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={242} y={78} width={80} height={14} rx={4} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1} />
              <text x={282} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">
                {step === 3 ? '패널티 / 보상' : ''}
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
