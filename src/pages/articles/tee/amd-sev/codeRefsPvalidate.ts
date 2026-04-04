import type { CodeRef } from '@/components/code/types';

const PVALIDATE_RMPCHECK = `/* arch/x86/kernel/sev.c — PVALIDATE 구현 */
static int pvalidate(unsigned long vaddr, bool rmp_psize,
                     bool validate)
{
    bool no_rmpchange;
    int rc;

    /* PVALIDATE 명령 실행 */
    asm volatile(".byte 0xF2, 0x0F, 0x01, 0xFF"
                 : "=a"(rc), "=@ccc"(no_rmpchange)
                 : "a"(vaddr),
                   "c"(rmp_psize),
                   "d"(validate)
                 : "memory", "cc");

    if (no_rmpchange)
        return PVALIDATE_FAIL_NOUPDATE;
    return rc;
}

/* RMPCHECK — RMP 엔트리 검증 (읽기 전용) */
// .byte 0xF3, 0x0F, 0x01, 0xFE
// → 지정 GPA의 RMP 상태를 레지스터에 반환
// → 게스트가 자신의 메모리 보호 상태를 확인`;

export const pvalidateCodeRefs: Record<string, CodeRef> = {
  'pvalidate': {
    path: 'linux/arch/x86/kernel/sev.c',
    code: PVALIDATE_RMPCHECK,
    highlight: [2, 20],
    lang: 'c',
    annotations: [
      { lines: [2, 4], color: 'sky', note: 'PVALIDATE 함수 시그니처' },
      { lines: [9, 14], color: 'emerald', note: '인라인 ASM — 전용 CPU 명령어 호출' },
      { lines: [23, 26], color: 'amber', note: 'RMPCHECK — RMP 상태 읽기 전용 조회' },
    ],
    desc:
`PVALIDATE는 SEV-SNP 전용 CPU 명령어로, 게스트가 자신의 메모리 페이지를
유효(validated)로 표시하는 데 사용합니다.

하이퍼바이저는 이 명령을 실행할 수 없어, 게스트의 메모리 무결성이 보장됩니다.
RMPCHECK는 읽기 전용 버전으로, 현재 RMP 상태를 조회합니다.`,
  },
};
