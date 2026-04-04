import type { CodeRef } from '@/components/code/types';
import measurementC from './codebase/sgx/measurement.c?raw';

export const codeRefs: Record<string, CodeRef> = {
  'mrenclave-measurement': {
    path: 'sgx/measurement.c',
    code: measurementC,
    lang: 'c',
    highlight: [5, 51],
    annotations: [
      { lines: [5, 11], color: 'sky', note: 'ECREATE: SHA-256 컨텍스트 초기화, MRENCLAVE 해시 체인 시작' },
      { lines: [14, 20], color: 'emerald', note: 'EADD: 페이지 오프셋과 보안 속성(R/W/X)을 해시에 추가' },
      { lines: [24, 34], color: 'amber', note: 'EEXTEND: 256바이트씩 16회 = 4KB 페이지 전체를 해시 확장' },
      { lines: [37, 51], color: 'violet', note: 'EINIT: 최종 MRENCLAVE 확정, SIGSTRUCT 서명 검증, MRSIGNER 파생' },
    ],
    desc:
`SGX Enclave의 무결성은 MRENCLAVE 해시로 보장됩니다.
ECREATE → EADD → EEXTEND → EINIT 순서로 SHA-256 해시 체인을 구성합니다.
코드 한 바이트라도 변경되면 MRENCLAVE 값이 달라져 원격 증명에서 검출됩니다.

하이라이트 구간: 전체 측정 흐름 (ECREATE ~ EINIT)`,
  },

  'tpm-pcr-extend': {
    path: 'sgx/measurement.c',
    code: measurementC,
    lang: 'c',
    highlight: [65, 72],
    annotations: [
      { lines: [65, 66], color: 'sky', note: '기존 PCR 값과 새 측정값을 연결 (concatenation)' },
      { lines: [67, 68], color: 'emerald', note: 'SHA-256 해시로 PCR 값 갱신 — 덮어쓰기 불가, 확장만 가능' },
      { lines: [69, 69], color: 'amber', note: '리셋은 재부팅 시에만 — 부팅 시점 상태의 변조 불가 증명' },
    ],
    desc:
`TPM의 PCR(Platform Configuration Register)은 측정값을 축적하는 단방향 레지스터입니다.
PCR[i] = SHA-256(PCR[i] || measurement) — 새 값은 기존 값에 "확장"만 가능합니다.
한번 기록되면 리셋(재부팅) 전까지 변경할 수 없어, 부팅 시점의 소프트웨어 상태를 증명합니다.

하이라이트 구간: PCR extend 연산`,
  },
};
