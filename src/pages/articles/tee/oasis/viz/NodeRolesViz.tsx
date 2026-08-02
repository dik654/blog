import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Validator — 합의 전용', body: 'CometBFT consensus + P2P 활성, Runtime host 비활성.\n검증인 스테이킹 필수, 가장 가벼운 노드 유형.' },
  { label: 'Compute — ParaTime 실행', body: 'Consensus(non-validator) + Runtime host(TEE) + Storage 전부 활성.\nTEE 하드웨어(SGX/TDX) 필수.' },
  { label: 'Storage — MKVS 디스크 노드', body: 'Consensus full + MKVS storage + IAVL sync.\n디스크 I/O 집중형 — Runtime 미실행.' },
  { label: 'Client — RPC 게이트웨이', body: 'Consensus light client 가능, 다른 모든 서비스 비활성.\n웹3 dApp 진입점 역할만.' },
];

const ROLES = [
  { name: 'Validator', x: 30,  color: '#6366f1' },
  { name: 'Compute',   x: 140, color: '#10b981' },
  { name: 'Storage',   x: 250, color: '#a855f7' },
  { name: 'Client',    x: 360, color: '#3b82f6' },
];

const SVCS = [
  { y: 88,  label: 'Consensus' },
  { y: 122, label: 'Runtime'   },
  { y: 156, label: 'MKVS'      },
  { y: 190, label: 'Sentry/RPC' },
];

const MATRIX = [
  // Validator: cons only
  ['cons', 'no', 'no', 'no'],
  // Compute: cons + runtime + storage(local)
  ['cons', 'TEE', 'local', 'no'],
  // Storage: cons + storage
  ['cons', 'no', 'full', 'no'],
  // Client: light cons + RPC
  ['light', 'no', 'ro', 'rpc'],
];

export default function NodeRolesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Headers */}
          {ROLES.map((r, i) => (
            <motion.g key={r.name} animate={{ opacity: step === i ? 1 : 0.35 }}>
              <ModuleBox x={r.x} y={20} w={90} h={42} label={r.name} color={r.color} />
            </motion.g>
          ))}

          {/* Service rows */}
          {SVCS.map((s, si) => (
            <g key={s.label}>
              <text x={20} y={s.y + 14} fontSize={9} fill="var(--muted-foreground)" fontWeight={600}>
                {s.label}
              </text>
              {ROLES.map((r, ri) => {
                const v = MATRIX[ri][si];
                const active = step === ri;
                const isOff = v === 'no';
                return (
                  <motion.g key={`${r.name}-${s.label}`}
                    animate={{ opacity: active ? 1 : 0.4 }}
                    transition={{ duration: 0.3 }}>
                    {isOff ? (
                      <AlertBox x={r.x + 10} y={s.y} w={70} h={24} label="off" color="#ef4444" />
                    ) : (
                      <DataBox x={r.x + 10} y={s.y} w={70} h={24}
                        label={v} color={r.color} outlined={active} />
                    )}
                  </motion.g>
                );
              })}
            </g>
          ))}

          {/* Highlight ring on active column */}
          <motion.rect initial={false}
            animate={{ x: ROLES[step].x - 5, opacity: 1 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
            y={15} width={100} height={210} rx={8}
            fill="none" stroke={ROLES[step].color} strokeWidth={1} opacity={0.4}
            strokeDasharray="3,3" />
        </svg>
      )}
    </StepViz>
  );
}
