import type { CodeRef } from '@/components/code/types';
import keyMgrC from './codebase/optee_os/core/tee/tee_fs_key_manager.c?raw';

export const keysCodeRefs: Record<string, CodeRef> = {
  'key-ssk-struct': {
    path: 'optee_os/core/tee/tee_fs_key_manager.c',
    code: keyMgrC,
    highlight: [33, 37],
    lang: 'c',
    annotations: [
      { lines: [33, 36], color: 'sky', note: 'SSK 구조체 -- 초기화 플래그 + 키 바이트' },
      { lines: [38, 38], color: 'emerald', note: '전역 싱글턴 (부팅 시 1회 초기화)' },
    ],
    desc:
`Secure Storage Key(SSK) 구조체입니다.
HUK에서 파생된 디바이스 고유 키를 보관합니다.
is_init 플래그로 초기화 여부를 추적하며,
부팅 시 tee_fs_init_key_manager()에서 1회 설정됩니다.`,
  },

  'key-hmac': {
    path: 'optee_os/core/tee/tee_fs_key_manager.c',
    code: keyMgrC,
    highlight: [40, 63],
    lang: 'c',
    annotations: [
      { lines: [46, 47], color: 'sky', note: 'NULL 검증 -- 방어적 프로그래밍' },
      { lines: [49, 50], color: 'emerald', note: 'HMAC-SHA256 컨텍스트 할당' },
      { lines: [52, 57], color: 'amber', note: 'init -> update -> final 3단계 HMAC' },
    ],
    desc:
`HMAC-SHA256 래퍼 함수입니다.
키 파생 체인의 기본 빌딩 블록으로:
- SSK 파생: HMAC(HUK, usage)
- TSK 파생: HMAC(SSK, TA UUID)
모든 키 파생이 이 함수를 거칩니다.`,
  },

  'key-fek-crypt': {
    path: 'optee_os/core/tee/tee_fs_key_manager.c',
    code: keyMgrC,
    highlight: [65, 117],
    lang: 'c',
    annotations: [
      { lines: [76, 80], color: 'sky', note: '입력 검증 + SSK 초기화 확인' },
      { lines: [82, 95], color: 'emerald', note: 'TSK 파생: HMAC(SSK, UUID) -- TA별 고유 키' },
      { lines: [97, 109], color: 'amber', note: 'TSK로 FEK 암/복호화 (AES-ECB)' },
      { lines: [113, 115], color: 'violet', note: '민감 데이터 명시적 제로화 (memzero_explicit)' },
    ],
    desc:
`FEK(File Encryption Key) 암/복호화 함수입니다.
TA 보안 스토리지의 핵심 키 파생 경로:
1. SSK + TA UUID를 HMAC해서 TSK 생성
2. TSK로 FEK를 AES 암호화/복호화
3. 사용 후 TSK를 memzero_explicit으로 제거`,
  },
};
