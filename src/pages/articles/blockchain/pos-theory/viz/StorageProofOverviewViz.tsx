import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const PROOFS = [
  { label: 'PoR', sub: 'Retrievability', x: 60, color: C[0] },
  { label: 'PoRep', sub: 'Replication', x: 200, color: C[1] },
  { label: 'PoSt', sub: 'Spacetime', x: 340, color: C[2] },
];
const STEPS = [
  { label: '저장 증명의 세 가지 분류', body: '저장 증명은 검증자 없이 저장자의 정직성을 수학적으로 보장합니다.' },
  { label: 'PoR: 데이터를 실제로 꺼낼 수 있는가?', body: 'PoR은 서버가 파일의 특정 블록을 응답할 수 있는지 챌린지합니다.' },
  { label: 'PoRep: 고유한 물리적 복제본인가?', body: 'PoRep은 데이터가 물리적으로 독립된 복제본임을 증명합니다.' },
  { label: 'PoSt: 시간에 걸쳐 지속 저장하는가?', body: 'PoSt는 주기적 챌린지로 시간 경과에 따른 저장 지속성을 증명합니다.' },
];
const BW = 100, BH = 40;

export default function StorageProofOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* central storage icon */}
          <rect x={170} y={80} width={140} height={28} rx={5}
            fill={`${C[0]}06`} stroke={C[0]} strokeWidth={1} />
          <text x={240} y={98} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">Storage Provider</text>
          {/* proof type boxes */}
          {PROOFS.map((p, i) => {
            const active = step === i + 1;
            return (
              <motion.g key={p.label}
                animate={{ opacity: step === 0 || active ? 1 : 0.2 }}>
                <rect x={p.x - BW / 2} y={15} width={BW} height={BH} rx={6}
                  fill={active ? `${p.color}20` : `${p.color}08`}
                  stroke={p.color} strokeWidth={active ? 2 : 1} />
                <text x={p.x} y={33} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={p.color}>{p.label}</text>
                <text x={p.x} y={45} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{p.sub}</text>
                {/* arrow to storage */}
                <line x1={p.x} y1={55} x2={p.x < 200 ? 180 : p.x > 300 ? 300 : p.x} y2={80}
                  stroke={p.color} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.5} />
              </motion.g>
            );
          })}
          {step > 0 && (
            <motion.circle cx={PROOFS[step - 1].x} cy={8} r={4}
              fill={PROOFS[step - 1].color} initial={{ scale: 0 }} animate={{ scale: 1 }}
              style={{ filter: `drop-shadow(0 0 4px ${PROOFS[step - 1].color}88)` }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
