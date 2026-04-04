import type { CodeRef } from '@/components/code/types';
import threadSmcC from './codebase/optee_os/core/arch/arm/kernel/thread_optee_smc.c?raw';
import threadSmcS from './codebase/optee_os/core/arch/arm/kernel/thread_optee_smc_a64.S?raw';

export const worldSwitchCodeRefs: Record<string, CodeRef> = {
  'smc-fast-handler': {
    path: 'optee_os/core/arch/arm/kernel/thread_optee_smc.c',
    code: threadSmcC,
    highlight: [33, 50],
    lang: 'c',
    annotations: [
      { lines: [34, 34], color: 'sky', note: '스택 카나리 검증 -- 오버플로 감지' },
      { lines: [36, 40], color: 'emerald', note: '가상화 지원 시 게스트 컨텍스트 설정' },
      { lines: [42, 42], color: 'amber', note: 'Fast 경로 진입 -- tee_entry_fast()로 위임' },
      { lines: [48, 49], color: 'violet', note: 'Fast 핸들러는 예외를 언마스크하면 안 됨' },
    ],
    desc:
`Fast SMC 핸들러입니다. Normal World에서 smc 명령어로 진입하면
어셈블리 벡터(vector_fast_smc_entry)가 이 함수를 호출합니다.

Fast Call은 인터럽트를 마스크한 채 원자적으로 실행됩니다.
OS UUID 조회, 버전 확인 등 짧은 연산에 사용됩니다.`,
  },

  'smc-std-handler': {
    path: 'optee_os/core/arch/arm/kernel/thread_optee_smc.c',
    code: threadSmcC,
    highlight: [52, 80],
    lang: 'c',
    annotations: [
      { lines: [58, 58], color: 'sky', note: '스택 카나리 검증' },
      { lines: [68, 70], color: 'emerald', note: 'RPC 복귀 시 스레드 재개' },
      { lines: [71, 73], color: 'amber', note: '새 요청 시 스레드 할당 + 실행' },
      { lines: [76, 77], color: 'violet', note: '가상화 게스트 해제' },
    ],
    desc:
`Standard SMC 핸들러입니다. TA 세션 열기/명령 실행 등 긴 연산을 처리합니다.

두 가지 경로가 있습니다:
1. RETURN_FROM_RPC: Normal World에서 RPC 응답 후 스레드 재개
2. 새 요청: thread_alloc_and_run()으로 전용 스레드 할당 후 실행

성공 시 thread_exit() 또는 thread_rpc()로 반환하므로,
이 함수가 return하면 에러 상황입니다.`,
  },

  'smc-vector-table': {
    path: 'optee_os/core/arch/arm/kernel/thread_optee_smc_a64.S',
    code: threadSmcS,
    highlight: [61, 73],
    lang: 'c',
    annotations: [
      { lines: [62, 62], color: 'sky', note: 'ARM-TF에 제공하는 벡터 테이블' },
      { lines: [63, 64], color: 'emerald', note: 'STD/Fast SMC 진입점' },
      { lines: [65, 68], color: 'amber', note: 'CPU 전원 관리 (on/off/resume/suspend)' },
      { lines: [69, 71], color: 'violet', note: 'FIQ + 시스템 전원 관리' },
    ],
    desc:
`ARM Trusted Firmware(ATF)에 제공하는 벡터 테이블입니다.

ATF(EL3)가 SMC trap을 받으면 이 테이블의 해당 엔트리로 점프합니다.
각 엔트리는 C 핸들러를 호출한 뒤 smc #0으로 Normal World에 복귀합니다.
테이블 레이아웃은 ATF와 동기화되어야 합니다.`,
  },

  'smc-std-entry-asm': {
    path: 'optee_os/core/arch/arm/kernel/thread_optee_smc_a64.S',
    code: threadSmcS,
    highlight: [75, 93],
    lang: 'c',
    annotations: [
      { lines: [76, 77], color: 'sky', note: 'C 핸들러 호출 + 반환값 보존' },
      { lines: [80, 82], color: 'emerald', note: '예외 마스크 + 임시 스택 전환' },
      { lines: [84, 84], color: 'amber', note: '스레드 상태 해제 (FREE로 전환)' },
      { lines: [86, 91], color: 'violet', note: 'ATF에 CALL_DONE 반환 + smc로 세계 전환' },
    ],
    desc:
`Standard SMC 진입 어셈블리입니다.

__thread_std_smc_entry() C 함수를 호출하고, 완료 후:
1. 모든 예외를 마스크
2. 임시 스택으로 전환 (보안을 위해 TA 스택 미사용)
3. 스레드 상태를 FREE로 해제
4. smc #0으로 Normal World에 복귀

smc 이후 이 코드로 돌아오면 panic입니다.`,
  },
};
