import type { CodeRef } from '@/components/code/types';

import vdfLibRs from './codebase/irys/crates/vdf/src/lib.rs?raw';
import vdfRs from './codebase/irys/crates/vdf/src/vdf.rs?raw';

export const vdfRefs: Record<string, CodeRef> = {
  'irys-vdf-sha': {
    path: 'crates/vdf/src/lib.rs',
    code: vdfLibRs,
    lang: 'rust',
    highlight: [18, 43],
    desc: 'vdf_sha는 SHA256 기반 VDF의 핵심 순차 해싱 루프입니다. salt+seed를 반복 해싱하며 체크포인트마다 결과를 저장합니다.',
    annotations: [
      { lines: [28, 35], color: 'sky', note: '체크포인트별 SHA256 반복 해싱' },
      { lines: [38, 38], color: 'emerald', note: '체크포인트 저장' },
      { lines: [41, 41], color: 'amber', note: 'salt 증가 (다음 체크포인트)' },
    ],
  },
  'irys-vdf-run': {
    path: 'crates/vdf/src/vdf.rs',
    code: vdfRs,
    lang: 'rust',
    highlight: [55, 68],
    desc: 'run_vdf는 VDF 메인 루프로 SHA256 해싱, fast-forward 수신, 리셋 시드 적용, 마이닝 브로드캐스트를 반복합니다.',
    annotations: [
      { lines: [84, 88], color: 'sky', note: '셧다운 토큰 확인' },
      { lines: [91, 126], color: 'emerald', note: 'fast-forward 스텝 수신 & 적용' },
      { lines: [163, 170], color: 'amber', note: 'vdf_sha 순차 해싱 실행' },
      { lines: [189, 193], color: 'violet', note: '마이닝 서비스에 시드 브로드캐스트' },
    ],
  },
  'irys-vdf-reset': {
    path: 'crates/vdf/src/lib.rs',
    code: vdfLibRs,
    lang: 'rust',
    highlight: [122, 128],
    desc: 'apply_reset_seed는 리셋 주기마다 블록 해시 엔트로피를 VDF 시드에 주입합니다. SHA256(seed || reset_seed)로 새 시드를 생성합니다.',
    annotations: [
      { lines: [124, 127], color: 'sky', note: 'SHA256(seed + reset_seed) 엔트로피 주입' },
    ],
  },
};
