import type { CodeRef } from '@/components/code/types';
import raw from './codebase/tee/memory_isolation.c?raw';

export const codeRefs: Record<string, CodeRef> = {
  'sgx-epc': {
    path: 'tee/memory_isolation.c',
    lang: 'c',
    highlight: [1, 31],
    desc:
`SGX EADD: 일반 메모리 페이지를 EPC에 추가합니다.
EPCM 엔트리에 소유 enclave, 페이지 타입, RWX 권한을 기록합니다.
ELDU: EPC에서 퇴거된 페이지를 복호화+MAC 검증 후 복원합니다.`,
    code: raw,
    annotations: [
      { lines: [2, 7], color: 'sky', note: 'PAGEINFO: 소스 페이지 + SECINFO + 대상 SECS' },
      { lines: [10, 14], color: 'emerald', note: 'EPCM 엔트리 생성: enclave·타입·권한 기록' },
      { lines: [16, 16], color: 'amber', note: 'MEE가 페이지를 암호화하여 EPC DRAM에 저장' },
      { lines: [22, 24], color: 'violet', note: 'ELDU: 복호화 + MAC 검증 — 변조 시 #GP' },
    ],
  },
  'sev-launch-update': {
    path: 'tee/memory_isolation.c',
    lang: 'c',
    highlight: [34, 52],
    desc:
`SEV LAUNCH_UPDATE_DATA: PSP가 게스트별 VEK를 파생합니다.
AES-128-XEX로 게스트 물리 주소(GPA)를 tweak으로 블록 암호화합니다.
암호화된 데이터는 launch digest에 반영되어 증명에 사용됩니다.`,
    code: raw,
    annotations: [
      { lines: [42, 42], color: 'sky', note: 'PSP가 ASID로부터 VEK 파생' },
      { lines: [44, 46], color: 'emerald', note: 'AES-128-XEX: GPA를 tweak으로 블록 암호화' },
      { lines: [49, 49], color: 'amber', note: 'launch digest 갱신 → 원격 증명에 반영' },
    ],
  },
  'mktme-key': {
    path: 'tee/memory_isolation.c',
    lang: 'c',
    highlight: [54, 73],
    desc:
`TDX MKTME: TD별 고유 KeyID를 할당하고 AES-XTS-256 키를 설정합니다.
SEAMCALL로 하드웨어 RNG가 키를 생성 — 소프트웨어에 노출되지 않습니다.
메모리 컨트롤러가 캐시 라인 퇴거/적재 시 자동 암복호화합니다.`,
    code: raw,
    annotations: [
      { lines: [60, 60], color: 'sky', note: 'TD별 고유 KeyID 할당' },
      { lines: [65, 65], color: 'emerald', note: 'SEAMCALL: HW RNG가 키 생성, SW 접근 불가' },
      { lines: [68, 69], color: 'amber', note: '메모리 컨트롤러 AES 엔진: writeback 암호화' },
      { lines: [70, 70], color: 'violet', note: 'DRAM → 캐시 읽기 시 자동 복호화' },
    ],
  },
};
