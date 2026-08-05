import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. .orc 번들에서 .sgxs 추출', body: 'Bundle.Manifest.Components[0].SGX.Executable 로 SGX 엔클레이브 바이너리 획득.' },
  { label: '2. SIGSTRUCT 서명 검증', body: 'verifySigstruct(enclaveBinary, sig) — Intel SGX 서명 구조체 정합성 확인.' },
  { label: '3. MRENCLAVE 계산 및 대조', body: 'computeMRENCLAVE(enclaveBinary) → cfg.Runtime.MRENCLAVE 와 일치 확인.\n불일치 시 즉시 abort.' },
  { label: '4. 별도 프로세스로 loader 실행', body: 'exec.Command(loader, "--runtime", binary) — 독립 OS 프로세스.\n호스트 권한과 분리, 추가 sandbox 적용.' },
  { label: '5. IPC 채널 연결', body: 'connectIPC(proc.Stderr) — Host ↔ Runtime 양방향 통신 시작.\n이중 격리(프로세스 + TEE) 완성.' },
];

const PHASES = [
  { name: 'extract',    color: '#6366f1' },
  { name: 'verify sig', color: '#10b981' },
  { name: 'MRENCLAVE',  color: '#f59e0b' },
  { name: 'spawn',      color: '#a855f7' },
  { name: 'IPC',        color: '#ec4899' },
];

export default function SgxProvisionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Phase pipeline */}
          {PHASES.map((p, i) => {
            const x = 25 + i * 90;
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.65 : 0.3 }}>
                  <ActionBox x={x} y={30} w={80} h={36} label={p.name} color={p.color} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={x + 80} y1={48} x2={x + 90} y2={48}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />
                )}
              </g>
            );
          })}

          {/* Step 0: extract */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50} y={100} w={160} h={32}
                label=".orc → runtime.sgxs" color="#6366f1" outlined />
              <text x={130} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Bundle.Manifest.Components[0].SGX
              </text>
            </motion.g>
          )}

          {/* Step 1: verify sig */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={120} y={100} w={120} h={28} label="SIGSTRUCT" color="#10b981" outlined />
              <DataBox x={250} y={100} w={120} h={28} label=".sigs (Intel)" color="#10b981" outlined />
              <text x={245} y={150} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                Ed25519 verify ✓
              </text>
            </motion.g>
          )}

          {/* Step 2: MRENCLAVE */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={70} y={100} w={150} h={28}
                label="computed: 0xa3f...c2" color="#f59e0b" outlined />
              <text x={235} y={118} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">==</text>
              <DataBox x={250} y={100} w={170} h={28}
                label="registered: 0xa3f...c2" color="#f59e0b" outlined />
              <AlertBox x={170} y={140} w={130} h={28} label="mismatch → abort" color="#ef4444" />
            </motion.g>
          )}

          {/* Step 3: spawn */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={140} y={100} w={200} h={28}
                label="exec(runtime-loader)" color="#a855f7" outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                seccomp + namespace + cgroup
              </text>
              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                process isolation
              </text>
            </motion.g>
          )}

          {/* Step 4: IPC */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50}  y={100} w={120} h={32} label="Host" color="#3b82f6" outlined />
              <DataBox x={310} y={100} w={120} h={32} label="Runtime (TEE)" color="#ec4899" outlined />
              <motion.line x1={170} y1={108} x2={310} y2={108}
                stroke="#ec4899" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={310} y1={124} x2={170} y2={124}
                stroke="#3b82f6" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Unix socket + CBOR (length-prefixed)
              </text>
            </motion.g>
          )}

          <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            sgxProvisioner.NewRuntime — go/runtime/host/sgx/sgx.go
          </text>
        </svg>
      )}
    </StepViz>
  );
}
