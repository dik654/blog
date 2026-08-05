import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Layer 1: SGX Hardware — 메모리 암호화(MEE) + Enclave 격리 + Attestation' },
  { label: 'Layer 2: pRuntime — Rust 메모리 안전성 + Minimal TCB + Signed binary' },
  { label: 'Layer 3: WASM Sandbox — 결정성 + 리소스 제약 + pink 이외 시스템 콜 차단' },
  { label: 'Layer 4: Contract code — ink! 타입 안전성 + Access control + 입력 검증' },
  { label: '공격 시나리오 대응 — 4계층 순차 방어 + Gas 계산 모델' },
];

const LAYERS = [
  { name: 'SGX Hardware', sub: 'MEE / Enclave / RA', color: '#ef4444', y: 30 },
  { name: 'pRuntime', sub: 'Rust + Signed binary', color: '#f59e0b', y: 70 },
  { name: 'WASM Sandbox', sub: 'Deterministic, no syscalls', color: '#10b981', y: 110 },
  { name: 'Contract Code', sub: 'ink! types + ACL', color: '#0ea5e9', y: 150 },
];

const LAYER_DETAILS: { color: string; details: string[] }[] = [
  {
    color: '#ef4444',
    details: [
      'Memory Encryption Engine (MEE) — DRAM 평문 노출 차단',
      'Enclave 격리 — Host kernel도 EPC 페이지 접근 불가',
      'Remote Attestation — DCAP quote로 워커 신원 검증',
    ],
  },
  {
    color: '#f59e0b',
    details: [
      'Rust 컴파일러 — buffer overflow / use-after-free 방지',
      'Minimal TCB — pRuntime은 약 50K LoC',
      'Signed binary — MRENCLAVE 고정, 변조 시 attestation 실패',
    ],
  },
  {
    color: '#10b981',
    details: [
      'Deterministic execution — 모든 워커가 같은 결과 산출',
      'Gas/memory quota — 무한 루프 / OOM 차단',
      'pink 확장만 시스템 자원 접근 — 일반 syscalls 차단',
    ],
  },
  {
    color: '#0ea5e9',
    details: [
      '#[ink(message)] 타입 시그니처 강제',
      '#[ink(constructor)]에서 admin 등록',
      '입력 validation — 호출자 책임 (블록체인 컨트랙트 일반 원칙)',
    ],
  },
];

const ATTACK_RESPONSE = [
  { atk: '악성 Contract 배포', def: 'Cluster admin 사전 검토', c: '#ef4444' },
  { atk: 'TEE 탈출', def: '4계층 순차 방어', c: '#ef4444' },
  { atk: 'Side channel', def: 'constant-time crypto (앱 책임)', c: '#f59e0b' },
  { atk: '악성 Worker', def: '다수 cluster 합의로 검증', c: '#ef4444' },
];

export default function PhatSecurityLayersViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={LAYERS[step].color}>
              Layer {step + 1}: {LAYERS[step].name}
            </text>
            {LAYERS.map((l, i) => (
              <motion.g key={i} animate={{ opacity: i === step ? 1 : 0.18 }}>
                <ModuleBox x={40} y={l.y} w={150} h={32}
                  label={l.name} sub={l.sub} color={l.color} />
              </motion.g>
            ))}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {LAYER_DETAILS[step].details.map((d, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={210} y={36 + i * 36} width={290} height={28} rx={4}
                    fill={`${LAYERS[step].color}10`} stroke={`${LAYERS[step].color}40`} strokeWidth={0.8} />
                  <text x={222} y={54 + i * 36} fontSize={9.5}
                    fill="var(--foreground)">{d}</text>
                </motion.g>
              ))}
            </motion.g>
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              공격 시나리오 vs 방어
            </text>
            {ATTACK_RESPONSE.map((r, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={40} y={42 + i * 36} width={200} height={28} rx={4}
                  fill={`${r.c}12`} stroke={r.c} strokeWidth={0.8} strokeDasharray="3 2" />
                <text x={140} y={60 + i * 36} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={r.c}>{r.atk}</text>
                <text x={250} y={60 + i * 36} fontSize={11} fill="var(--muted-foreground)">→</text>
                <rect x={270} y={42 + i * 36} width={210} height={28} rx={4}
                  fill="#10b98112" stroke="#10b981" strokeWidth={0.8} />
                <text x={375} y={60 + i * 36} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill="#10b981">{r.def}</text>
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              Gas = CPU + memory + storage + HTTP + 외부 API 응답 크기
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
