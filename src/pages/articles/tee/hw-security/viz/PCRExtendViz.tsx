import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'PCR_new = SHA-256(PCR_old || measurement) — extend만 가능, set 불가' },
  { label: '초기값 — PCR[0..23] = 0x00...0 (24 bytes SHA-1 또는 32 bytes SHA-256)' },
  { label: 'Stage 0~2 — UEFI extends PCR[0], bootloader extends PCR[4], kernel extends PCR[4]' },
  { label: '표준 PCR 할당 — PCR[0]=BIOS, PCR[4]=Bootloader/MBR, PCR[7]=SecureBoot policy' },
  { label: '복원 불가능성 — PCR_old를 PCR_new에서 유도 못함, clean measurement 덮어쓰기 불가' },
];

const STAGES = [
  { stage: '0', name: 'UEFI extends PCR[0]', code: 'PCR[0] = SHA256(0 || uefi_fw)', c: '#6366f1' },
  { stage: '1', name: 'UEFI extends PCR[4]', code: 'PCR[4] = SHA256(PCR[4] || bootloader)', c: '#10b981' },
  { stage: '2', name: 'Bootloader extends PCR[4]', code: 'PCR[4] = SHA256(PCR[4] || kernel)', c: '#f59e0b' },
];

const PCR_MAP = [
  { idx: 'PCR[0]', use: 'SRTM + BIOS' },
  { idx: 'PCR[1]', use: 'Host Platform Configuration' },
  { idx: 'PCR[2]', use: 'Option ROM Code' },
  { idx: 'PCR[4]', use: 'MBR/GPT + Boot Manager' },
  { idx: 'PCR[7]', use: 'Secure Boot Policy' },
  { idx: 'PCR[8-15]', use: 'OS Boot (distro-specific)' },
];

const IRREV = [
  { line: '이전 PCR 값을 몰라도 현재 PCR 알 수 있음', c: '#6366f1' },
  { line: '하지만 PCR_old를 PCR_new에서 유도 불가 (one-way)', c: '#10b981' },
  { line: '악의적 bootloader가 clean measurement 덮어쓰기 불가', c: '#ef4444' },
];

export default function PCRExtendViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              PCR Extend 연산
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={70} w={130} h={50}
                label="PCR_old" sub="현재 누적값" color="#6b7280" outlined />
              <text x={155} y={100} fontSize={20} fill="var(--muted-foreground)">||</text>
              <DataBox x={175} y={70} w={130} h={50}
                label="measurement" sub="새 단계 hash" color="#6366f1" outlined />
              <text x={310} y={100} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={335} y={70} w={70} h={50}
                label="SHA-256" color="#10b981" />
              <text x={415} y={100} fontSize={20} fill="var(--muted-foreground)">→</text>
              <DataBox x={435} y={70} w={75} h={50}
                label="PCR_new" color="#f59e0b" outlined />
            </motion.g>
            <text x={260} y={170} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">
              "extend만 가능, set 불가" — 단방향 누적이 변조 방지의 핵심
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              초기값 — PCR[0..23] = 0
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50} y={60} w={200} h={56}
                label="SHA-1 모드" sub="24 bytes 0x00" color="#6366f1" outlined />
              <DataBox x={270} y={60} w={200} h={56}
                label="SHA-256 모드" sub="32 bytes 0x00" color="#10b981" outlined />
            </motion.g>
            <text x={260} y={150} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              매 부팅마다 0에서 시작 → 같은 부팅 = 같은 PCR 시퀀스
            </text>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              TPM_Reset / DRTM 외에는 PCR 0 복귀 불가
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              Boot stage extends
            </text>
            {STAGES.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={30} y={50 + i * 50} width={460} height={36} rx={5}
                  fill={`${s.c}10`} stroke={`${s.c}50`} strokeWidth={0.8} />
                <circle cx={50} cy={68 + i * 50} r={11} fill={s.c} />
                <text x={50} y={72 + i * 50} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="#fff">{s.stage}</text>
                <text x={70} y={64 + i * 50} fontSize={10.5} fontWeight={600} fill={s.c}>{s.name}</text>
                <text x={70} y={80 + i * 50} fontSize={9} fill="var(--muted-foreground)"
                  style={{ fontFamily: 'monospace' }}>{s.code}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              표준 PCR 할당 (TCG PC Client Spec)
            </text>
            {PCR_MAP.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}>
                <rect x={30} y={42 + i * 28} width={460} height={22} rx={3}
                  fill="#0ea5e910" stroke="#0ea5e940" strokeWidth={0.8} />
                <text x={50} y={58 + i * 28} fontSize={10} fontWeight={700} fill="#0ea5e9"
                  style={{ fontFamily: 'monospace' }}>{p.idx}</text>
                <text x={150} y={58 + i * 28} fontSize={10} fill="var(--foreground)">{p.use}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              복원 불가능성 — 변조 방지 핵심
            </text>
            {IRREV.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={30} y={50 + i * 50} width={460} height={36} rx={5}
                  fill={`${p.c}10`} stroke={`${p.c}50`} strokeWidth={0.8} />
                <rect x={30} y={50 + i * 50} width={4} height={36} fill={p.c} />
                <text x={50} y={72 + i * 50} fontSize={11} fontWeight={600} fill={p.c}>{p.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
