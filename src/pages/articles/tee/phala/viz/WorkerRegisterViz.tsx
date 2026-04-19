import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Step 1: pruntime_init — identity_key + ecdh_key 생성, genesis state 로드' },
  { label: 'Step 2: request_attestation — user_data = pubkeys, sgx_get_quote 호출' },
  { label: 'Step 3: register_worker extrinsic — 1000 PHA stake와 함께 on-chain 제출' },
  { label: 'Step 4: 체인 검증 — quote 서명 + MRENCLAVE 화이트리스트 + TCB 최신성' },
  { label: 'Step 5: 네트워크 가입 — Gatekeeper 승인 + Cluster 배정 + 실행 대기' },
];

const INIT_STEPS = [
  { label: 'identity_key = generate_keypair()', sub: 'Ed25519, 워커 식별', c: '#6366f1' },
  { label: 'ecdh_key = generate_keypair()', sub: 'X25519, 클라이언트 envelope', c: '#10b981' },
  { label: 'load_genesis_from_chain()', sub: 'block 0 state 로드', c: '#f59e0b' },
];

const ATTEST_STEPS = [
  { label: 'user_data = id_pub || ecdh_pub', sub: '64 bytes', c: '#6366f1' },
  { label: 'quote = sgx_get_quote(user_data)', sub: 'DCAP ECDSA-P256', c: '#10b981' },
  { label: 'return (quote, pck_cert_chain)', sub: '검증자 측 cert chain 검증용', c: '#f59e0b' },
];

const REG_FIELDS = [
  { name: 'worker_pubkey', val: 'identity_key.public()', c: '#6366f1' },
  { name: 'attestation', val: 'quote (DCAP)', c: '#10b981' },
  { name: 'operator', val: 'owner_account', c: '#f59e0b' },
  { name: 'deposit', val: 'WORKER_DEPOSIT (1000 PHA)', c: '#ef4444' },
];

const VERIFY_CHECKS = [
  { check: 'Quote signature (PCK chain)', ok: true },
  { check: 'MRENCLAVE 화이트리스트', ok: true },
  { check: 'TCB version 최신', ok: true },
];

const JOIN_PHASES = [
  { name: 'Gatekeeper', sub: '합류 승인', color: '#6366f1', progress: 1 },
  { name: 'Cluster 배정', sub: '논리 그룹 가입', color: '#10b981', progress: 1 },
  { name: '실행 대기', sub: 'Phat Contract ready', color: '#f59e0b', progress: 0.6 },
];

export default function WorkerRegisterViz() {
  const STEP_DATA = [INIT_STEPS, ATTEST_STEPS];
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
              fill={step === 0 ? '#6366f1' : '#10b981'}>
              {step === 0 ? 'pruntime_init() — Enclave 시작' : 'request_attestation() — DCAP quote'}
            </text>
            {STEP_DATA[step].map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={40} y={50 + i * 50} width={440} height={36} rx={5}
                  fill={`${s.c}10`} stroke={`${s.c}50`} strokeWidth={0.8} />
                <rect x={40} y={50 + i * 50} width={4} height={36} fill={s.c} />
                <text x={60} y={66 + i * 50} fontSize={10.5} fontWeight={600} fill={s.c}
                  style={{ fontFamily: 'monospace' }}>{s.label}</text>
                <text x={60} y={80 + i * 50} fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              register_worker extrinsic
            </text>
            {REG_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={40} y={42 + i * 36} width={440} height={28} rx={4}
                  fill={`${f.c}10`} stroke={`${f.c}40`} strokeWidth={0.8} />
                <text x={55} y={60 + i * 36} fontSize={10} fontWeight={700} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.name}</text>
                <text x={200} y={60 + i * 36} fontSize={10} fill="var(--foreground)"
                  style={{ fontFamily: 'monospace' }}>{f.val}</text>
              </motion.g>
            ))}
            <text x={260} y={205} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              1000 PHA stake로 sybil 방지 + slashing 담보
            </text>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              체인 측 검증
            </text>
            {VERIFY_CHECKS.map((v, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 44} width={420} height={36} rx={5}
                  fill="#10b98112" stroke="#10b981" strokeWidth={0.8} />
                <circle cx={70} cy={68 + i * 44} r={9} fill="#10b981" />
                <text x={70} y={72 + i * 44} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="#fff">✓</text>
                <text x={90} y={72 + i * 44} fontSize={11} fontWeight={600} fill="var(--foreground)">{v.check}</text>
              </motion.g>
            ))}
            <text x={260} y={200} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              하나라도 실패 시 등록 reject + stake 반환
            </text>
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              네트워크 가입 단계
            </text>
            {JOIN_PHASES.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}>
                <StatusBox x={20 + i * 165} y={70} w={155} h={62}
                  label={p.name} sub={p.sub} color={p.color} progress={p.progress} />
              </motion.g>
            ))}
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Cluster 가입 후 master key fragment 수신 → contract 실행 가능
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
