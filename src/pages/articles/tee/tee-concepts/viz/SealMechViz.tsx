import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Intel SGX — EGETKEY 명령어, Root Seal Key → Derived, AES-128-GCM' },
  { label: 'ARM TrustZone (OP-TEE) — Secure Storage API, HUK 기반' },
  { label: 'Intel TDX — TDG.MR.GET_KEY, per-TD unique key' },
  { label: 'AMD SEV-SNP — snp_get_derived_key, VMPCK 기반, VMPL별 분리' },
  { label: '공통 원칙 — chip 결속 + identity 정책 + AEAD + counter' },
];

const MECH_DATA: { color: string; title: string; rows: { k: string; v: string }[] }[] = [
  {
    color: '#6366f1',
    title: 'Intel SGX',
    rows: [
      { k: '명령어', v: 'EGETKEY (ring 3, enclave 내부)' },
      { k: '키 체인', v: 'Root Seal Key → Derived Seal Key' },
      { k: '암호화', v: 'AES-128-GCM (AEAD)' },
      { k: 'API', v: 'sgx_seal_data() / sgx_unseal_data()' },
    ],
  },
  {
    color: '#10b981',
    title: 'ARM TrustZone (OP-TEE)',
    rows: [
      { k: 'API', v: 'Secure Storage API (GP TEE Spec)' },
      { k: '키', v: 'HUK (Hardware Unique Key) 기반' },
      { k: '저장', v: 'REE fs 또는 RPMB (Replay Protected MMC Block)' },
      { k: 'TEE Object', v: 'TEE_CreatePersistentObject()' },
    ],
  },
  {
    color: '#f59e0b',
    title: 'Intel TDX',
    rows: [
      { k: '명령어', v: 'TDG.MR.GET_KEY (TD 내부에서 호출)' },
      { k: '키', v: 'Per-TD unique key' },
      { k: '수명', v: 'TD lifecycle과 결합 (TD 종료 시 키 사라짐)' },
      { k: '영속성', v: 'TD key → external persist key 체인 필요' },
    ],
  },
  {
    color: '#0ea5e9',
    title: 'AMD SEV-SNP',
    rows: [
      { k: '명령어', v: 'snp_get_derived_key (VMPCK 기반)' },
      { k: '계층', v: 'VMPL별 별도 키 파생 (0~3)' },
      { k: '책임', v: 'Guest가 자체 sealing 구현 필요' },
      { k: 'AEAD', v: '암호화는 guest-side AES-GCM 사용' },
    ],
  },
];

const COMMON = [
  { line: 'Key는 CPU/chip에 결속', c: '#6366f1' },
  { line: 'Policy가 코드 identity 포함', c: '#10b981' },
  { line: 'AEAD 암호화 (AES-GCM)', c: '#f59e0b' },
  { line: 'Monotonic counter 지원 (anti-replay)', c: '#0ea5e9' },
];

export default function SealMechViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 4 && (() => {
            const m = MECH_DATA[step];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={m.color}>
                {m.title}
              </text>
              {m.rows.map((r, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={30} y={42 + i * 40} width={460} height={32} rx={4}
                    fill={`${m.color}10`} stroke={`${m.color}40`} strokeWidth={0.8} />
                  <text x={50} y={62 + i * 40} fontSize={10.5} fontWeight={700} fill={m.color}>{r.k}</text>
                  <text x={140} y={62 + i * 40} fontSize={10} fill="var(--foreground)">{r.v}</text>
                </motion.g>
              ))}
            </g>);
          })()}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              4가지 공통 원칙
            </text>
            {COMMON.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 40} width={420} height={32} rx={5}
                  fill={`${c.c}10`} stroke={`${c.c}50`} strokeWidth={0.8} />
                <text x={70} y={71 + i * 40} fontSize={11} fontWeight={600} fill={c.c}>{c.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
