import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Compressed', sub: 'BabyBear STARK', color: '#6366f1' },
  { label: 'Shrink', sub: 'BN254 재증명', color: '#10b981' },
  { label: 'Wrap', sub: '회로 입력 준비', color: '#f59e0b' },
  { label: 'Groth16', sub: 'R1CS 증명', color: '#8b5cf6' },
  { label: '온체인 검증', sub: '~250k gas', color: '#ec4899' },
];

const NW = 86, GAP = 96, SY = 40;
const nx = (i: number) => 6 + i * GAP;
const EDGES = ['BabyBear→BN254', 'BN254 STARK', 'R1CS 입력', '~192B 증명'];

const STEPS = [
  { label: 'Compressed STARK', body: 'BabyBear 필드 위의 압축된 STARK 증명.' },
  { label: 'Shrink', body: 'BabyBear 원소를 BN254 스칼라체로 임베딩해 재증명합니다.' },
  { label: 'Wrap', body: 'BN254 STARK를 Groth16 R1CS 회로의 입력 형식으로 변환.' },
  { label: 'Groth16', body: 'BN254 페어링 기반 R1CS 증명 생성. ~192바이트.' },
  { label: '온체인 검증', body: 'Solidity 검증 컨트랙트에서 ~250k gas로 검증.' },
];

export default function SNARKWrapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 630 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sw-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => step > i && (
            <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={nx(i) + NW} y1={SY + 20} x2={nx(i + 1)} y2={SY + 20}
                stroke="var(--muted-foreground)" strokeWidth={1.2} markerEnd="url(#sw-ah)" />
              <rect x={(nx(i) + NW + nx(i + 1)) / 2 - 24} y={SY + 7} width={48} height={11} rx={2} fill="var(--card)" />
              <text x={(nx(i) + NW + nx(i + 1)) / 2} y={SY + 14}
                textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
            </motion.g>
          ))}
          {NODES.map((n, i) => i <= step && (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}>
              <rect x={nx(i)} y={SY} width={NW} height={40} rx={8}
                fill={n.color + '18'} stroke={n.color} strokeWidth={step === i ? 2 : 1} />
              <text x={nx(i) + NW / 2} y={SY + 16} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={nx(i) + NW / 2} y={SY + 30} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
            </motion.g>
          ))}
          {/* Final checkmark animation */}
          {step === 4 && (
            <motion.text x={nx(4) + NW / 2} y={SY + 54} textAnchor="middle"
              fontSize={9} fontWeight={600} fill="#10b981"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>verified</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
