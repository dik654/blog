import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: 'PRM 예약: BIOS가 물리 메모리 일부를 격리' },
  { label: 'EADD: 페이지 추가 + EPCM 메타데이터 생성' },
  { label: '메모리 접근: EPCM 권한 검사 → MEE 복호화' },
  { label: 'EPC 부족: EWBLOCK(암호화+MAC) → ELDU(검증+복원)' },
];

function PrmBox({ active }: { active: boolean }) {
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.3 }} transition={sp}>
      <rect x={20} y={10} width={200} height={60} rx={6}
        fill="#6366f110" stroke="#6366f1" strokeWidth={active ? 1.5 : 0.6} />
      <text x={120} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">PRM (Reserved)</text>
      <rect x={35} y={35} width={170} height={28} rx={4}
        fill="#10b98118" stroke="#10b981" strokeWidth={0.8} />
      <text x={120} y={53} textAnchor="middle" fontSize={10} fill="#10b981">EPC: 4KB Page Pool</text>
    </motion.g>
  );
}

function EpcmEntry({ active }: { active: boolean }) {
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
      <rect x={250} y={10} width={220} height={60} rx={6}
        fill="#f59e0b10" stroke="#f59e0b" strokeWidth={active ? 1.5 : 0.6} />
      <text x={360} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">EPCM Entry</text>
      <text x={290} y={48} fontSize={10} fill="var(--foreground)">SECS</text>
      <text x={340} y={48} fontSize={10} fill="var(--foreground)">Type</text>
      <text x={390} y={48} fontSize={10} fill="var(--foreground)">RWX</text>
      <text x={440} y={48} fontSize={10} fill="var(--foreground)">Valid</text>
    </motion.g>
  );
}

export default function EpcViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <PrmBox active={step === 0 || step === 1} />
          <EpcmEntry active={step >= 1} />
          {/* EADD arrow */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={220} y1={50} x2={248} y2={40} stroke="#10b981" strokeWidth={1}
                markerEnd="url(#epcArrow)" />
              <text x={234} y={38} fontSize={10} fill="#10b981" fontWeight={600}>EADD</text>
            </motion.g>
          )}
          {/* MEE decrypt flow */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={80} y={78} width={120} height={22} rx={4}
                fill="#6366f118" stroke="#6366f1" strokeWidth={1} />
              <text x={140} y={93} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">
                MEE 복호화
              </text>
              <line x1={120} y1={70} x2={120} y2={78} stroke="#6366f1" strokeWidth={0.8}
                strokeDasharray="3,2" />
            </motion.g>
          )}
          {/* EWBLOCK → ELDU paging */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={78} width={110} height={22} rx={4}
                fill="#ef444418" stroke="#ef4444" strokeWidth={1} />
              <text x={85} y={93} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">
                EWBLOCK+MAC
              </text>
              <rect x={160} y={78} width={110} height={22} rx={4}
                fill="#10b98118" stroke="#10b981" strokeWidth={1} />
              <text x={215} y={93} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
                ELDU+검증
              </text>
              <line x1={140} y1={89} x2={160} y2={89} stroke="var(--muted-foreground)"
                strokeWidth={0.8} markerEnd="url(#epcArrow2)" />
            </motion.g>
          )}
          <defs>
            <marker id="epcArrow" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6Z" fill="#10b981" />
            </marker>
            <marker id="epcArrow2" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L6,3 L0,6Z" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
