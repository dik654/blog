import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'RMP 엔트리: 물리 페이지마다 소유권 기록' },
  { label: 'VMPL 계층: 게스트 내부 4단계 권한 격리' },
  { label: 'Validated 비트: 이중 매핑 공격 차단' },
  { label: '격리 결과: 하이퍼바이저 제외 신뢰 모델' },
];

const ANNOT = ['물리 페이지별 RMP 소유권', 'VMPL 0~3 4단계 권한 격리', 'PVALIDATE 이중 매핑 차단', 'RMP+VMPL HV 제외 신뢰'];
const ROWS = [
  { spa: '0x001', owner: 'HV', color: '#ef4444', asid: '0', gpa: '-' },
  { spa: '0x003', owner: 'VMPL0', color: '#a855f7', asid: '1', gpa: '0x0' },
  { spa: '0x004', owner: 'VMPL1', color: '#3b82f6', asid: '1', gpa: '0x1' },
  { spa: '0x006', owner: 'VMPL2', color: '#10b981', asid: '1', gpa: '0x3' },
  { spa: '0x007', owner: '공유', color: '#f59e0b', asid: '1', gpa: '0x4' },
];

const VMPL = [
  { level: 0, role: 'Paravisor', color: '#a855f7', w: 180 },
  { level: 1, role: '커널', color: '#3b82f6', w: 140 },
  { level: 2, role: '유저', color: '#10b981', w: 100 },
  { level: 3, role: '격리 앱', color: '#f59e0b', w: 60 },
];

export default function RMPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0,2,3: RMP Table */}
          {(step === 0 || step === 2 || step === 3) && ROWS.map((r, i) => (
            <g key={r.spa}>
              <motion.rect x={30} y={20 + i * 42} width={320} height={34} rx={5}
                fill={step === 2 && i >= 1 ? `${r.color}25` : `${r.color}12`}
                stroke={r.color} strokeWidth={step === 2 && i >= 1 ? 2 : 1}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.08, duration: 0.3 }} style={{ originX: 0 }} />
              <text x={42} y={41 + i * 42} fontSize={10} fontFamily="monospace" fill={r.color} fontWeight={600}>{r.spa}</text>
              <text x={100} y={41 + i * 42} fontSize={10} fill={r.color}>{r.owner}</text>
              <text x={170} y={41 + i * 42} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">ASID={r.asid}</text>
              <text x={240} y={41 + i * 42} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">GPA={r.gpa}</text>
              {step === 2 && i >= 1 && (
                <motion.text x={310} y={41 + i * 42} fontSize={10} fill="#10b981" fontWeight={600}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Valid</motion.text>
              )}
            </g>
          ))}
          {/* Step 1: VMPL Hierarchy */}
          {step === 1 && VMPL.map((v, i) => (
            <g key={v.level}>
              <motion.rect x={190 - v.w / 2} y={30 + i * 52} width={v.w} height={38} rx={6}
                fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5}
                initial={{ y: -20, opacity: 0 }} animate={{ y: 30 + i * 52, opacity: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', bounce: 0.3 }} />
              <motion.text x={190} y={53 + i * 52} textAnchor="middle" fontSize={11} fontWeight={600} fill={v.color}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.15 }}>
                VMPL {v.level} - {v.role}
              </motion.text>
              {i < 3 && (
                <motion.line x1={190} y1={68 + i * 52} x2={190} y2={82 + i * 52}
                  stroke="var(--border)" strokeWidth={1.5} strokeDasharray="3,3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }} />
              )}
            </g>
          ))}
          {/* Step 3: shield icon */}
          {step === 3 && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
              <rect x={130} y={75} width={120} height={80} rx={10} fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
              <text x={190} y={110} textAnchor="middle" fontSize={11} fontWeight={600} fill="#10b981">HV 제외</text>
              <text x={190} y={126} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">AES-XTS + RMP</text>
            </motion.g>
          )}
                  <motion.text x={385} y={120} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
