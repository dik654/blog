import type { CodeRef } from '@/components/code/types';
import raw from './codebase/sgx/sealing.c?raw';

export const codeRefs: Record<string, CodeRef> = {
  'seal-key-derivation': {
    path: 'sgx/sealing.c',
    lang: 'c',
    highlight: [1, 31],
    desc:
`EGETKEY 하드웨어 명령어로 Seal Key를 파생합니다.
CPU 내부 Root Seal Key에 MRENCLAVE/MRSIGNER, SVN, KEYID를 결합합니다.
KDF는 AES-CMAC 기반이며, 결과는 128-bit Seal Key입니다.`,
    code: raw,
    annotations: [
      { lines: [2, 8], color: 'sky', note: 'sealed_data_t: 키 파생 파라미터 + AES-GCM 암호문을 하나로 묶는 구조체' },
      { lines: [10, 17], color: 'emerald', note: 'Key Derivation Tree: Root → MRENCLAVE/MRSIGNER 두 경로로 분기' },
      { lines: [24, 26], color: 'amber', note: 'EGETKEY 래퍼: key_request 검증 후 CPU 명령어 실행' },
      { lines: [28, 30], color: 'violet', note: 'CPU 마이크로코드가 CMAC(Root, policy_fields) 계산 → 128-bit 키 반환' },
    ],
  },

  'seal-unseal': {
    path: 'sgx/sealing.c',
    lang: 'c',
    highlight: [33, 87],
    desc:
`sgx_seal_data_ex()는 EGETKEY → AES-128-GCM 암호화를 수행합니다.
sgx_unseal_data()는 동일 키로 복호화 + MAC 검증합니다.
MAC 불일치 시 SGX_ERROR_MAC_MISMATCH를 반환합니다.`,
    code: raw,
    annotations: [
      { lines: [44, 46], color: 'sky', note: 'Step 1: EGETKEY로 Seal Key 파생 — 정책에 따라 키가 결정됨' },
      { lines: [51, 57], color: 'emerald', note: 'Step 3: AES-128-GCM 암호화 — plaintext → ciphertext + 128-bit MAC' },
      { lines: [71, 74], color: 'amber', note: '개봉: 저장된 key_request로 동일 Seal Key 재파생' },
      { lines: [76, 83], color: 'violet', note: 'AES-GCM 복호화 + MAC 검증 — 불일치 시 변조 감지' },
    ],
  },
};
