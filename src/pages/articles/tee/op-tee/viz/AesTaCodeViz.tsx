import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox } from '@/components/viz/boxes';

const C = {
  alloc: '#6366f1',
  key: '#10b981',
  iv: '#f59e0b',
  enc: '#0ea5e9',
  free: '#8b5cf6',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: '1) TEE_AllocateOperation — AES-CBC-NOPAD ENCRYPT 256-bit handle 할당' },
  { label: '2) TEE_AllocateTransientObject — 휘발성 AES-256 key 객체 생성' },
  { label: '3) TEE_GenerateKey — TRNG로 256-bit 랜덤 키 생성' },
  { label: '4) TEE_SetOperationKey + GenerateRandom IV + CipherInit' },
  { label: '5) TEE_CipherDoFinal — 단일 호출로 암호화 완료' },
  { label: '6) Cleanup — Free operation + transient key 객체' },
];

const STEP_LINES: { line: string; c: string }[][] = [
  [
    { line: 'TEE_OperationHandle op = TEE_HANDLE_NULL;', c: C.alloc },
    { line: 'res = TEE_AllocateOperation(&op,', c: C.alloc },
    { line: '    TEE_ALG_AES_CBC_NOPAD,', c: C.alloc },
    { line: '    TEE_MODE_ENCRYPT,', c: C.alloc },
    { line: '    256);  // key size in bits', c: C.alloc },
    { line: 'if (res != TEE_SUCCESS) return res;', c: C.alloc },
  ],
  [
    { line: 'TEE_ObjectHandle key_obj = TEE_HANDLE_NULL;', c: C.key },
    { line: 'res = TEE_AllocateTransientObject(', c: C.key },
    { line: '    TEE_TYPE_AES,', c: C.key },
    { line: '    256,            // bits', c: C.key },
    { line: '    &key_obj);', c: C.key },
    { line: '// Transient = 메모리에만 (storage 안 함)', c: C.alloc },
  ],
  [
    { line: '// TRNG 기반 랜덤 키', c: C.key },
    { line: 'TEE_GenerateKey(key_obj,', c: C.key },
    { line: '    256,            // bits', c: C.key },
    { line: '    NULL, 0);       // params (없음)', c: C.key },
    { line: '// HW TRNG → CTR_DRBG → key bytes', c: C.alloc },
    { line: '// 키는 객체 안에만 (외부 노출 안 됨)', c: C.alloc },
  ],
  [
    { line: 'res = TEE_SetOperationKey(op, key_obj);', c: C.iv },
    { line: 'if (res != TEE_SUCCESS) goto cleanup;', c: C.iv },
    { line: 'uint8_t iv[16];', c: C.iv },
    { line: 'TEE_GenerateRandom(iv, 16);  // CBC IV', c: C.iv },
    { line: 'TEE_CipherInit(op, iv, 16);  // 상태 초기화', c: C.enc },
    { line: '// Operation state: KeySet → Initialized', c: C.enc },
  ],
  [
    { line: 'res = TEE_CipherDoFinal(op,', c: C.enc },
    { line: '    plain, plain_len,', c: C.enc },
    { line: '    cipher, cipher_len);', c: C.enc },
    { line: '// AES-CBC encryption 수행', c: C.enc },
    { line: '// HW 가속 (CAAM/CE) 또는 mbedTLS', c: C.enc },
    { line: '// state: Initialized → Completed', c: C.alloc },
  ],
  [
    { line: 'cleanup:', c: C.free },
    { line: 'if (op != TEE_HANDLE_NULL)', c: C.free },
    { line: '    TEE_FreeOperation(op);', c: C.free },
    { line: 'if (key_obj != TEE_HANDLE_NULL)', c: C.free },
    { line: '    TEE_FreeTransientObject(key_obj);', c: C.free },
    { line: 'return res;', c: C.free },
  ],
];

const STEP_HINTS = [
  'Allocate', 'Key obj', 'Generate', 'Init', 'Encrypt', 'Cleanup',
];

export default function AesTaCodeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            ta/aes/aes_ta.c — AES-256-CBC 암호화 단계
          </text>
          <g>
            {STEP_HINTS.map((h, i) => (
              <motion.g key={h} animate={{ opacity: i === step ? 1 : 0.3 }} transition={sp}>
                <rect x={10 + i * 78} y={26} width={70} height={20} rx={4}
                  fill={i === step ? `${C.enc}25` : 'transparent'}
                  stroke={i === step ? C.enc : 'var(--border)'} strokeWidth={i === step ? 1 : 0.5} />
                <text x={45 + i * 78} y={40} textAnchor="middle" fontSize={9} fontWeight={i === step ? 700 : 500}
                  fill={i === step ? C.enc : 'var(--muted-foreground)'}>{i + 1}. {h}</text>
              </motion.g>
            ))}
          </g>
          {STEP_LINES[step].map((l, i) => (
            <motion.g key={`${step}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <rect x={20} y={60 + i * 24} width={440} height={20} rx={3}
                fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.6} />
              <text x={32} y={74 + i * 24} fontSize={9.5} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
            </motion.g>
          ))}
          <ActionBox x={40} y={210} w={400} h={26} label="GP TEE Internal Core API" sub="모든 OP-TEE TA에서 동일 호출 가능" color={C.enc} />
        </svg>
      )}
    </StepViz>
  );
}
