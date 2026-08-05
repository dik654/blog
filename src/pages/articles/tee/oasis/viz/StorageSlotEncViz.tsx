import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Slot key 파생 (HKDF)', body: 'slot_key = HKDF(runtime_master, contract || slot_index).\n슬롯마다 독립 키 — rainbow table 무력.' },
  { label: '2. 결정적 nonce 생성', body: 'nonce = hash(contract, slot, round)[:12].\n같은 slot/round 면 동일 nonce — 결정적 실행 보장.' },
  { label: '3. AES-256-GCM 암호화', body: 'ciphertext = aes_gcm(slot_key, nonce, value).\n암호화 + 무결성 tag 동시 보장.' },
  { label: '4. 외부 관측 — 암호문만', body: '노드 운영자/관리자/외부 — 암호문만 보임.\n빈 슬롯은 저장 안 함 (공간 절약).' },
];

const PHASES = [
  { name: 'derive key', color: '#6366f1' },
  { name: 'gen nonce',  color: '#3b82f6' },
  { name: 'AES-GCM',    color: '#f59e0b' },
  { name: 'persist',    color: '#a855f7' },
];

export default function StorageSlotEncViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const x = 30 + i * 110;
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.6 : 0.3 }}>
                  <ActionBox x={x} y={20} w={100} h={40} label={p.name} color={p.color} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={x + 100} y1={40} x2={x + 110} y2={40}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />
                )}
              </g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={90} w={120} h={28} label="master_key" color="#a855f7" outlined />
              <DataBox x={155} y={90} w={120} h={28} label="contract addr" color="#10b981" outlined />
              <DataBox x={290} y={90} w={120} h={28} label="slot index" color="#3b82f6" outlined />
              <ActionBox x={170} y={140} w={140} h={32} label="HKDF expand" color="#6366f1" />
              <DataBox x={170} y={185} w={140} h={28} label="slot_key (32B)" color="#6366f1" outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30}  y={90} w={120} h={28} label="contract" color="#10b981" outlined />
              <DataBox x={170} y={90} w={120} h={28} label="slot" color="#3b82f6" outlined />
              <DataBox x={310} y={90} w={120} h={28} label="round" color="#f59e0b" outlined />
              <ActionBox x={170} y={140} w={140} h={32} label="hash(...)[:12]" color="#3b82f6" />
              <DataBox x={170} y={185} w={140} h={28} label="nonce 12B" color="#3b82f6" outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30}  y={90} w={100} h={28} label="slot_key" color="#6366f1" outlined />
              <DataBox x={140} y={90} w={100} h={28} label="nonce" color="#3b82f6" outlined />
              <DataBox x={250} y={90} w={100} h={28} label="value" color="#10b981" outlined />
              <ActionBox x={130} y={140} w={220} h={36} label="aes_256_gcm_encrypt" color="#f59e0b" />
              <DataBox x={130} y={190} w={220} h={28} label="ciphertext + 16B tag" color="#f59e0b" outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={30}  y={90} w={150} h={50} label="MKVS storage" color="#a855f7" />
              <DataBox x={200} y={100} w={140} h={28}
                label="encrypted blob" color="#a855f7" outlined />
              <ModuleBox x={350} y={90} w={120} h={50}
                label="external view" sub="ciphertext only" color="#94a3b8" />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                빈 슬롯은 저장 안 함 (공간 절약)
              </text>
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            runtime-sdk/modules/evm/src/storage.rs
          </text>
        </svg>
      )}
    </StepViz>
  );
}
