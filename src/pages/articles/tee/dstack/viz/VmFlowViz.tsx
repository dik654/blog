import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Docker Compose 제출: app_id = SHA-256(내용)' },
  { label: 'Manifest 생성: VmConfiguration -> Manifest 변환' },
  { label: '작업 디렉토리 준비: /var/lib/dstack/vms/{vm_id}/' },
  { label: 'TDX TD 시작: QEMU로 Trust Domain 생성' },
  { label: '키 발급: Guest Agent -> KMS 키 요청' },
];

const ANNOT = ['Compose app_id=SHA-256', 'vm_id+vsock Manifest 생성', 'manifest 작업 Dir 준비', 'QEMU tdx-guest TD 시작', 'TDX Quote KMS 키 발급'];
const P = [
  { label: 'Compose', color: '#6366f1', icon: 'D' },
  { label: 'Manifest', color: '#8b5cf6', icon: 'M' },
  { label: '작업 Dir', color: '#3b82f6', icon: 'F' },
  { label: 'TDX TD', color: '#10b981', icon: 'T' },
  { label: '키 발급', color: '#f59e0b', icon: 'K' },
];

export default function VmFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Pipeline axis */}
          <line x1={30} y1={70} x2={350} y2={70} stroke="var(--border)" strokeWidth={1.5} />

          {/* Stage nodes */}
          {P.map((s, i) => {
            const active = i === step;
            const done = i < step;
            const cx = 50 + i * 72;
            return (
              <g key={s.label}>
                <motion.circle cx={cx} cy={70} r={22}
                  fill={active ? `${s.color}25` : done ? `${s.color}15` : `${s.color}06`}
                  stroke={active ? s.color : `${s.color}40`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ scale: active ? 1.15 : 1, opacity: done ? 0.45 : active ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }} />
                <text x={cx} y={67} textAnchor="middle" fontSize={12} fontWeight={600}
                  fill={active ? s.color : 'var(--muted-foreground)'}>{s.icon}</text>
                <text x={cx} y={80} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{i + 1}</text>
                <text x={cx} y={108} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? s.color : 'var(--muted-foreground)'}>{s.label}</text>
              </g>
            );
          })}

          {/* Moving packet */}
          <motion.g animate={{ x: step * 72 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}>
            <circle cx={50} cy={140} r={10} fill={P[step].color} />
            <text x={50} y={143} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">VM</text>
          </motion.g>

          {/* TDX boundary on step 3+ */}
          {step >= 3 && (
            <motion.rect x={230} y={40} width={130} height={60} rx={8}
              fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="5,3"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
          )}
                  <motion.text x={385} y={90} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
