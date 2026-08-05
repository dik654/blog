import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  rom: '#8b5cf6',
  ocb: '#0ea5e9',
  fw: '#10b981',
  cmd: '#f59e0b',
};

const STEPS = [
  { label: 'Stage 0 — Boot ROM (immutable)', body: 'AMD root key 내장, stage1 서명 검증 후 점프' },
  { label: 'Stage 1 — OCB (Off-Chip Bootloader)', body: 'flash에서 ASP firmware 로드 + AMD ASP key 검증' },
  { label: 'Stage 2 — ASP firmware event loop', body: 'crypto 초기화 + mailbox 셋업 + 명령 dispatch' },
  { label: 'SEV Command 처리 — INIT/LAUNCH_START/ATTESTATION', body: '키 생성, ASID 할당, attestation 서명' },
];

const STAGES = [
  { x: 20, y: 26, label: 'Stage 0', sub: 'Boot ROM', color: C.rom, body: 'verify_sig(stage1, amd_root_key)' },
  { x: 170, y: 26, label: 'Stage 1', sub: 'OCB', color: C.ocb, body: 'verify_sig(asp_fw, amd_asp_key)' },
  { x: 320, y: 26, label: 'Stage 2', sub: 'ASP firmware', color: C.fw, body: 'event_loop { dispatch(cmd) }' },
];

const COMMANDS = [
  { id: 'SEV_CMD_INIT', sub: 'generate_cek()', color: C.cmd },
  { id: 'SEV_CMD_LAUNCH_START', sub: 'asid + vm_key 생성', color: C.cmd },
  { id: 'SEV_CMD_ATTESTATION', sub: 'measure + sign VCEK', color: C.cmd },
];

export default function ASPBootChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STAGES.map((s, i) => {
            const active = step === i;
            const past = step > i;
            return (
              <motion.g key={s.label}
                animate={{ opacity: active ? 1 : past ? 0.55 : 0.25 }}>
                <ModuleBox x={s.x} y={s.y} w={130} h={50} label={s.label} sub={s.sub} color={s.color} />
                <text x={s.x + 65} y={94} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{s.body}</text>
                {i < 2 && step >= i && (
                  <motion.line x1={s.x + 130} y1={50} x2={s.x + 170} y2={50}
                    stroke={s.color} strokeWidth={1.2} markerEnd={`url(#bc${i})`}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
                )}
                <defs>
                  <marker id={`bc${i}`} markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                    <polygon points="0 0, 5 2.5, 0 5" fill={s.color} />
                  </marker>
                </defs>
              </motion.g>
            );
          })}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <text x={20} y={120} fontSize={9} fontWeight={700} fill={C.cmd}>이벤트 루프 — sev_handler dispatch</text>
              {COMMANDS.map((c, i) => (
                <motion.g key={c.id}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <ActionBox x={20 + i * 155} y={130} w={140} h={50} label={c.id.replace('SEV_CMD_', '')} sub={c.sub} color={c.color} />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <DataBox x={60} y={140} w={360} h={36}
                label={step === 0 ? 'AMD Root Key — Boot ROM 내장 (변경 불가)' :
                       step === 1 ? 'AMD ASP Key — flash 펌웨어 검증' :
                       'mailbox + crypto engines ready'}
                color={STAGES[step].color} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
