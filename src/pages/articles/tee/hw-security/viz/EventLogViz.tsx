import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Event Log 역할 — PCR 해시만으론 어떤 파일인지 모름, log가 보강' },
  { label: 'tcg_event_entry 구조 — pcr_index + event_type + digests + event_data' },
  { label: 'Verifier 검증 1: TPM Quote + Event Log 수신' },
  { label: 'Verifier 검증 2: Event Log replay → PCR 재계산 → Quote와 비교' },
  { label: 'Verifier 검증 3: Event Log 내용 검증 — 알려진 취약 컴포넌트 탐지' },
  { label: '주요 도구 — tpm2_eventlog, Keylime policy engine, rootfs verification' },
];

const ENTRY_FIELDS = [
  { k: 'pcr_index', v: 'u32 — 어느 PCR에 extend', c: '#6366f1' },
  { k: 'event_type', v: 'u32 — EV_EFI_BOOT_SERVICES_APPLICATION 등', c: '#10b981' },
  { k: 'digests', v: 'digest[N_ALGS] — 측정값 (SHA-1/SHA-256)', c: '#f59e0b' },
  { k: 'event_data_size + event_data[]', v: '파일 경로, 메타데이터', c: '#0ea5e9' },
];

const REPLAY_CODE = [
  { line: 'computed_pcr = 0', c: '#6366f1' },
  { line: 'for (event in event_log) {', c: '#10b981' },
  { line: '  computed_pcr = SHA256(computed_pcr || event.digest)', c: '#10b981' },
  { line: '}', c: '#10b981' },
  { line: 'if (computed_pcr != quote.pcr[i]) reject;', c: '#ef4444' },
];

const CONTENT_CHECKS = [
  { line: '예상된 bootloader인지', c: '#6366f1' },
  { line: '알려진 취약 컴포넌트 없는지', c: '#10b981' },
  { line: '정책 매치 여부', c: '#f59e0b' },
];

const TOOLS = [
  { name: 'tpm2_eventlog', sub: 'ACPI 테이블 덤프', c: '#6366f1' },
  { name: 'Keylime policy engine', sub: 'Continuous attestation', c: '#10b981' },
  { name: 'rootfs verification', sub: 'dm-verity, fs-verity', c: '#f59e0b' },
];

export default function EventLogViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              PCR vs Event Log 역할 분담
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50} y={60} w={180} h={56}
                label="PCR" sub="해시만 (어떤 파일인지 모름)" color="#ef4444" outlined />
              <text x={245} y={92} fontSize={14} fill="var(--muted-foreground)">+</text>
              <DataBox x={270} y={60} w={200} h={56}
                label="Event Log" sub="어떤 파일·메타데이터" color="#10b981" outlined />
            </motion.g>
            <text x={260} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6366f1">
              두 가지 결합 → 검증자가 측정 내역 완전 재구성
            </text>
            <text x={260} y={175} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Event Log는 UEFI memory 또는 ACPI table에 저장
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              struct tcg_event_entry
            </text>
            {ENTRY_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={20} y={42 + i * 42} width={480} height={34} rx={4}
                  fill={`${f.c}10`} stroke={`${f.c}40`} strokeWidth={0.8} />
                <text x={40} y={62 + i * 42} fontSize={10.5} fontWeight={700} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.k}</text>
                <text x={40} y={75 + i * 42} fontSize={9} fill="var(--muted-foreground)">{f.v}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              Verifier 측 검증 1단계
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={50} y={70} w={150} h={56}
                label="TPM Quote" sub="PCR 값 + 서명" color="#6366f1" />
              <text x={215} y={102} fontSize={14} fill="var(--muted-foreground)">+</text>
              <ModuleBox x={245} y={70} w={150} h={56}
                label="Event Log" sub="측정 내역" color="#10b981" />
              <text x={410} y={102} fontSize={14} fill="var(--muted-foreground)">→</text>
              <DataBox x={435} y={80} w={70} h={36}
                label="Verifier" color="#f59e0b" outlined />
            </motion.g>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              Event Log replay → PCR 재계산
            </text>
            {REPLAY_CODE.map((r, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={30} y={42 + i * 32} width={460} height={26} rx={4}
                  fill={`${r.c}10`} stroke={`${r.c}40`} strokeWidth={0.8} />
                <text x={50} y={59 + i * 32} fontSize={10.5} fontWeight={600} fill={r.c}
                  style={{ fontFamily: 'monospace' }}>{r.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#a855f7">
              Event Log 내용 검증 (5단계)
            </text>
            {CONTENT_CHECKS.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${c.c}10`} stroke={`${c.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={c.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={c.c}>{c.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              주요 검증 도구
            </text>
            {TOOLS.map((t, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={50 + i * 56} w={420} h={44}
                  label={t.name} sub={t.sub} color={t.c} />
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
