import type { CodeRef } from '@/components/code/types';
import keyMgrC from './codebase/optee_os/core/tee/tee_fs_key_manager.c?raw';

export const keysInitCodeRefs: Record<string, CodeRef> = {
  'key-init-manager': {
    path: 'optee_os/core/tee/tee_fs_key_manager.c',
    code: keyMgrC,
    highlight: [119, 133],
    lang: 'c',
    annotations: [
      { lines: [122, 122], color: 'sky', note: '컴파일 타임 어서트 -- SSK 크기 검증' },
      { lines: [124, 125], color: 'emerald', note: 'HUK에서 SSK 파생 (huk_subkey_derive)' },
      { lines: [126, 127], color: 'amber', note: '성공 시 초기화 플래그 설정' },
      { lines: [129, 129], color: 'violet', note: '실패 시 전체 구조체 제로화 (보안)' },
    ],
    desc:
`부팅 시 키 매니저 초기화 함수입니다.
service_init_late() 매크로로 부팅 후반에 자동 호출:
1. HUK_SUBKEY_SSK 용도로 huk_subkey_derive() 호출
2. HUK(OTP) -> HMAC-SHA256 -> SSK 32바이트 파생
3. 실패 시 보안을 위해 구조체 전체를 제로화
이후 모든 파일 암호화가 이 SSK를 루트로 사용합니다.`,
  },

  'key-generate-fek': {
    path: 'optee_os/core/tee/tee_fs_key_manager.c',
    code: keyMgrC,
    highlight: [135, 147],
    lang: 'c',
    annotations: [
      { lines: [139, 140], color: 'sky', note: 'FEK 크기 검증' },
      { lines: [142, 143], color: 'emerald', note: '암호학적 난수로 FEK 생성' },
      { lines: [145, 147], color: 'amber', note: 'TSK로 FEK 암호화 (저장용)' },
    ],
    desc:
`새 파일용 FEK 생성 함수입니다.
1. crypto_rng_read()로 랜덤 FEK 생성
2. tee_fs_fek_crypt()로 TSK 기반 암호화
3. 암호화된 FEK가 파일 메타데이터에 저장
복호화 시 동일 UUID의 TSK로 FEK를 복원합니다.`,
  },
};
