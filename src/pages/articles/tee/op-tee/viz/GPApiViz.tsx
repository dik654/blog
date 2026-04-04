import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  '영구 저장소: TEE_Open/CreatePersistentObject',
  '암호화 연산: AES-GCM 초기화 → 암호화 → 완료',
  '키 파생: TEE_DeriveKey (HKDF/SP800-56C)',
  '보안 시간: 시스템 시간 vs REE 시간',
];

const GROUPS = [
  { label: '영구 저장소', items: ['OpenPersistentObject', 'CreatePersistentObject'], color: '#6366f1', x: 20 },
  { label: '암호화 연산', items: ['AllocateOperation', 'AEInit → AEEncryptFinal'], color: '#10b981', x: 185 },
  { label: '키 파생', items: ['DeriveKey (HKDF)'], color: '#f59e0b', x: 365 },
  { label: '보안 시간', items: ['GetSystemTime', 'GetREETime'], color: '#6366f1', x: 365 },
];

export default function GPApiViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={270} y={16} textAnchor="middle" fontSize={11} fontWeight={600}
            fill="var(--foreground)">GlobalPlatform TEE Internal Core API</text>
          <line x1={60} y1={24} x2={480} y2={24} stroke="var(--border)" strokeWidth={1} />

          {GROUPS.map((g, gi) => {
            const active = gi === step;
            const w = gi < 2 ? 155 : 155;
            const y = gi < 3 ? 40 : 110;
            const x = gi === 3 ? 365 : g.x;
            return (
              <g key={g.label}>
                <motion.rect x={x} y={y} width={w} height={55} rx={6}
                  fill={active ? `${g.color}14` : `${g.color}06`}
                  stroke={active ? g.color : `${g.color}30`}
                  strokeWidth={active ? 1.5 : 1}
                  animate={{ opacity: active ? 1 : 0.3 }} transition={{ duration: 0.3 }} />
                <text x={x + 10} y={y + 16} fontSize={10} fontWeight={600} fill={g.color}>{g.label}</text>
                {g.items.map((item, ii) => (
                  <text key={ii} x={x + 10} y={y + 30 + ii * 13} fontSize={10}
                    fill="var(--muted-foreground)">{item}</text>
                ))}
              </g>
            );
          })}

          {/* Arrow from TA to API */}
          <motion.text x={270} y={135} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)" animate={{ opacity: 0.7 }}>
            TA (S.EL0) → TEE Internal API → 커널 디스패치
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
