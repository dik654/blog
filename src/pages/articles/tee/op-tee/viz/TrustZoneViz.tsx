import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Normal World: 리치 OS 환경 (EL0/EL1)' },
  { label: 'Secure World: OP-TEE OS + TA (S.EL0/S.EL1)' },
  { label: 'EL3 Secure Monitor: SMC 브리지로 세계 전환' },
];
const ANNOT = ['CA → libteec → SMC 브리지', 'TA 세션 관리 + HUK 파생', 'Fast/Standard Call (SMC)'];

const NW = [
  { el: 'EL0', label: 'CA (Client App)', y: 30 },
  { el: 'EL1', label: 'Linux + TEE 드라이버', y: 80 },
];
const SW = [
  { el: 'S.EL0', label: 'Trusted App (TA)', y: 30 },
  { el: 'S.EL1', label: 'OP-TEE OS', y: 80 },
];

export default function TrustZoneViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Normal World */}
          <rect x={10} y={10} width={175} height={120} rx={8} fill={step === 0 ? '#6366f112' : '#6366f106'}
            stroke={step === 0 ? '#6366f1' : '#6366f140'} strokeWidth={step === 0 ? 2 : 1} />
          <text x={97} y={25} textAnchor="middle" fontSize={10} fill="#6366f1" fontWeight={600}>Normal World</text>
          {NW.map((n) => (
            <g key={n.el}>
              <motion.rect x={25} y={n.y} width={145} height={36} rx={5}
                fill={step === 0 ? '#6366f118' : '#6366f108'} stroke={step === 0 ? '#6366f1' : '#6366f130'}
                strokeWidth={step === 0 ? 1.5 : 0.5}
                animate={{ opacity: step === 0 ? 1 : 0.4 }} transition={{ duration: 0.3 }} />
              <text x={35} y={n.y + 16} fontSize={10} fontWeight={600} fill="#6366f1">{n.el}</text>
              <text x={35} y={n.y + 28} fontSize={10} fill="var(--muted-foreground)">{n.label}</text>
            </g>
          ))}
          {/* Secure World */}
          <rect x={215} y={10} width={175} height={120} rx={8} fill={step === 1 ? '#10b98112' : '#10b98106'}
            stroke={step === 1 ? '#10b981' : '#10b98140'} strokeWidth={step === 1 ? 2 : 1} />
          <text x={302} y={25} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}>Secure World</text>
          {SW.map((n) => (
            <g key={n.el}>
              <motion.rect x={230} y={n.y} width={145} height={36} rx={5}
                fill={step === 1 ? '#10b98118' : '#10b98108'} stroke={step === 1 ? '#10b981' : '#10b98130'}
                strokeWidth={step === 1 ? 1.5 : 0.5}
                animate={{ opacity: step === 1 ? 1 : 0.4 }} transition={{ duration: 0.3 }} />
              <text x={240} y={n.y + 16} fontSize={10} fontWeight={600} fill="#10b981">{n.el}</text>
              <text x={240} y={n.y + 28} fontSize={10} fill="var(--muted-foreground)">{n.label}</text>
            </g>
          ))}
          {/* EL3 Monitor */}
          <motion.rect x={50} y={148} width={300} height={38} rx={7}
            fill={step === 2 ? '#f59e0b18' : '#f59e0b08'} stroke={step === 2 ? '#f59e0b' : '#f59e0b40'}
            strokeWidth={step === 2 ? 2.5 : 1}
            animate={{ scale: step === 2 ? 1.02 : 1 }} transition={{ duration: 0.3 }} />
          <text x={200} y={165} textAnchor="middle" fontSize={10} fontWeight={600} fill="#f59e0b">EL3 Secure Monitor</text>
          <text x={200} y={178} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Fast Call | Standard Call (SMC)</text>
          {/* SMC arrows */}
          <motion.line x1={97} y1={130} x2={97} y2={148} stroke="#f59e0b" strokeWidth={1.5}
            strokeDasharray="3,3" animate={{ opacity: step === 2 ? 1 : 0.2 }} />
          <motion.line x1={302} y1={130} x2={302} y2={148} stroke="#f59e0b" strokeWidth={1.5}
            strokeDasharray="3,3" animate={{ opacity: step === 2 ? 1 : 0.2 }} />
          {/* Packet animation */}
          {step === 2 && (
            <motion.circle r={5} fill="#f59e0b"
              initial={{ cx: 97, cy: 135 }} animate={{ cx: 302, cy: 135 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }} />
          )}
          <motion.text x={405} y={100} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
