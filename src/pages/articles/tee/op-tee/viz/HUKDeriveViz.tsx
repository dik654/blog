import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'HUK: OTP에 저장된 하드웨어 고유키 (128-256b)' },
  { label: 'SSK: HMAC-SHA256(HUK, "SSK" || chip_die_id)' },
  { label: 'FEK: HMAC-SHA256(SSK, file_path_hash)' },
  { label: '암호화 데이터: AES-GCM으로 TA 개인 데이터 보호' },
];
const ANNOT = ['OTP 기록, 키 파생 루트', '디바이스 고유 키 파생', '파일별 고유 키 (TA 격리)', 'AES-GCM → RPMB 저장'];

const NODES = [
  { label: 'HUK', sub: 'OTP 하드웨어 키', color: '#a855f7', y: 15 },
  { label: 'SSK', sub: 'HMAC(HUK, die_id)', color: '#6366f1', y: 65 },
  { label: 'FEK', sub: 'HMAC(SSK, path)', color: '#3b82f6', y: 115 },
  { label: 'AES-GCM', sub: 'TA 암호화 데이터', color: '#10b981', y: 165 },
];

const SIDE = [
  { label: 'RPMB', color: '#f59e0b', y: 30 },
  { label: 'TA_ENC', color: '#ef4444', y: 60 },
];

export default function HUKDeriveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Main derivation chain */}
          {NODES.map((n, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <g key={n.label}>
                {/* connector */}
                {i > 0 && (
                  <motion.line x1={160} y1={NODES[i - 1].y + 36} x2={160} y2={n.y}
                    stroke={done || active ? n.color : 'var(--border)'} strokeWidth={1.5}
                    strokeDasharray="4,3"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }} />
                )}
                {/* node box */}
                <motion.rect x={80} y={n.y} width={160} height={36} rx={7}
                  fill={active ? `${n.color}22` : `${n.color}08`}
                  stroke={active ? n.color : `${n.color}40`}
                  strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: done ? 0.4 : active ? 1 : 0.25 }}
                  transition={{ duration: 0.3 }} />
                <text x={100} y={n.y + 16} fontSize={11} fontWeight={600} fill={n.color}>{n.label}</text>
                <text x={100} y={n.y + 28} fontSize={10} fill="var(--muted-foreground)">{n.sub}</text>
              </g>
            );
          })}

          {/* Side keys from HUK */}
          {SIDE.map((s) => (
            <g key={s.label}>
              <motion.line x1={240} y1={NODES[0].y + 18} x2={290} y2={s.y + 10}
                stroke={`${s.color}40`} strokeWidth={1} strokeDasharray="3,3"
                animate={{ opacity: step === 0 ? 0.8 : 0.2 }} />
              <motion.rect x={290} y={s.y} width={72} height={22} rx={4}
                fill={`${s.color}12`} stroke={`${s.color}50`} strokeWidth={1}
                animate={{ opacity: step === 0 ? 1 : 0.25 }} />
              <text x={326} y={s.y + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color}>{s.label}</text>
            </g>
          ))}

          {/* Moving key ball */}
          <motion.g animate={{ y: NODES[step].y + 18 - (NODES[0].y + 18) }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.2 }}>
            <circle cx={60} cy={NODES[0].y + 18} r={9} fill={NODES[step].color} />
            <text x={60} y={NODES[0].y + 21} textAnchor="middle" fontSize={10} fontWeight={600} fill="white">KEY</text>
          </motion.g>
          <motion.text x={385} y={105} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
