import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'HUK → SSK: HMAC-SHA256(HUK, "SSK" || chip_die_id)',
  'SSK → FEK: HMAC-SHA256(SSK, file_path_hash)',
  'FEK → AES-GCM 암호화: TA 개인 데이터 보호',
  'RPMB 키: HMAC-SHA256(HUK, usage=RPMB) → 32B 인증키',
  'TA 암호화: HMAC(HUK, TA_ENC || uuid) → AES-GCM 복호화',
];

const LAYERS = [
  { label: 'HUK', desc: 'OTP (128-256b)', color: '#6366f1', y: 12 },
  { label: 'SSK', desc: 'Secure Storage Key', color: '#10b981', y: 62 },
  { label: 'FEK', desc: 'File Encryption Key', color: '#f59e0b', y: 112 },
  { label: '암호화 데이터', desc: 'AES-GCM / RPMB', color: '#10b981', y: 162 },
];

export default function KeyHierarchyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i <= step && i <= 3;
            return (
              <g key={l.label}>
                {i > 0 && i < 4 && (
                  <motion.line x1={140} y1={LAYERS[i - 1].y + 36} x2={140} y2={l.y}
                    stroke={i <= step ? l.color : 'var(--border)'} strokeWidth={1.5}
                    strokeDasharray="4,3" animate={{ opacity: i <= step ? 1 : 0.2 }} />
                )}
                <motion.rect x={50} y={l.y} width={180} height={36} rx={7}
                  fill={active ? `${l.color}18` : `${l.color}06`}
                  stroke={active ? l.color : `${l.color}30`} strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : 0.25 }} transition={{ duration: 0.3 }} />
                <text x={68} y={l.y + 16} fontSize={11} fontWeight={600} fill={l.color}>{l.label}</text>
                <text x={68} y={l.y + 28} fontSize={10} fill="var(--muted-foreground)">{l.desc}</text>
              </g>
            );
          })}

          {/* RPMB branch */}
          <motion.line x1={230} y1={30} x2={310} y2={40} stroke="#f59e0b"
            strokeWidth={1} strokeDasharray="3,3" animate={{ opacity: step >= 3 ? 0.9 : 0.15 }} />
          <motion.rect x={310} y={25} width={120} height={30} rx={5}
            fill={step >= 3 ? '#f59e0b18' : '#f59e0b06'} stroke={step >= 3 ? '#f59e0b' : '#f59e0b30'}
            strokeWidth={1} animate={{ opacity: step >= 3 ? 1 : 0.2 }} />
          <text x={328} y={44} fontSize={10} fontWeight={600} fill="#f59e0b">RPMB 인증키</text>

          {/* TA_ENC branch */}
          <motion.line x1={230} y1={30} x2={310} y2={80} stroke="#6366f1"
            strokeWidth={1} strokeDasharray="3,3" animate={{ opacity: step >= 4 ? 0.9 : 0.15 }} />
          <motion.rect x={310} y={65} width={120} height={30} rx={5}
            fill={step >= 4 ? '#6366f118' : '#6366f106'} stroke={step >= 4 ? '#6366f1' : '#6366f130'}
            strokeWidth={1} animate={{ opacity: step >= 4 ? 1 : 0.2 }} />
          <text x={328} y={84} fontSize={10} fontWeight={600} fill="#6366f1">TA 바이너리 키</text>

          {/* HMAC label */}
          <motion.text x={145} y={LAYERS[0].y + 50} textAnchor="middle"
            fontSize={10} fill="var(--muted-foreground)"
            animate={{ opacity: step > 0 ? 0.7 : 0 }}>HMAC-SHA256</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
