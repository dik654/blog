export const repoStructCode = `// github.com/OP-TEE/optee_os 구조
core/
  arch/arm/
    sm/          <- Secure Monitor (SMC 진입, 세계 전환)
      sm.c       <- sm_from_nsec(): Normal->Secure 전환 핵심 함수
    kernel/
      entry_a64.S <- AArch64 예외 벡터, SP/SCTLR 초기화
      boot.c     <- 보안 세계 부팅
  kernel/
    tee_ta_manager.c <- TA 세션 관리 (open/invoke/close)
    huk_subkey.c     <- HUK(Hardware Unique Key) 파생
  mm/            <- 보안 세계 메모리 관리 (mmu, mobj)
  tee/           <- TEE 서비스 (파일 시스템, crypto API)
  pta/           <- Pseudo TA (내장 시스템 TA)

lib/             <- libutee (TA용 라이브러리, TEE Internal API)
ta/              <- 내장 TA (PKCS#11, FTPM, APDU 등)`;

export const repoAnnotations = [
  { lines: [2, 8] as [number, number], color: 'sky' as const, note: 'ARM 아키텍처별 코드' },
  { lines: [9, 14] as [number, number], color: 'emerald' as const, note: '커널 서비스 & 메모리 관리' },
  { lines: [16, 17] as [number, number], color: 'amber' as const, note: 'TA 라이브러리 & 내장 TA' },
];

export const trustzoneCode = `// ARM TrustZone 하드웨어 격리
Normal World (EL0/EL1)         Secure World (S.EL0/S.EL1)
------                         ------
  Linux Kernel (EL1)             OP-TEE OS (S.EL1)
  Rich Applications (EL0)        Trusted Applications (S.EL0)
        |                              |
        | SMC (EL3)                    |
        v                              v
  Secure Monitor (EL3) <- TrustZone 하드웨어 경계

// 세계 전환 트리거:
// 1. Normal World에서 SMC 명령어 실행 (smc #0)
// 2. Secure Monitor(EL3)가 컨텍스트 저장 후 세계 전환
// 3. OP-TEE OS(S.EL1) 진입 -> TA 실행 -> 반환

// TrustZone 격리 보장:
// - S.EL1의 메모리는 Normal World에서 접근 불가
// - TZASC(TrustZone Address Space Controller)로 DRAM 분리
// - 주변 장치도 Secure/Non-Secure로 구분 (TrustZone PAS)`;

export const trustzoneAnnotations = [
  { lines: [1, 9] as [number, number], color: 'sky' as const, note: '2개 세계 구조 + Secure Monitor' },
  { lines: [11, 14] as [number, number], color: 'emerald' as const, note: 'SMC 세계 전환 흐름' },
  { lines: [16, 19] as [number, number], color: 'amber' as const, note: '하드웨어 격리 보장' },
];

export const entryAsmCode = `// core/arch/arm/kernel/entry_a64.S
// OP-TEE S.EL1 예외 벡터 초기화

.macro set_sp
    bl  __get_core_pos          // 현재 CPU 코어 번호 취득
    cmp x0, #CFG_TEE_CORE_NB_CORE
    bge unhandled_cpu           // 지원 외 CPU는 정지

    // SP_EL0: CPU별 임시 스택 (stack_tmp)
    adr_l x2, stack_tmp_rel
    ldr   w0, [x2]
    add   x0, x0, x2
    msr   spsel, #0
    add   sp, x1, x0

    // SP_EL1: thread_core_local[cpu_id] (코어별 메타데이터)
    bl  thread_get_core_local
    msr spsel, #1
    mov sp, x0
.endm

.macro set_sctlr_el1
    mrs x0, sctlr_el1
    orr x0, x0, #SCTLR_I    // 명령 캐시 활성화
    orr x0, x0, #SCTLR_SA   // 스택 정렬 검사
    orr x0, x0, #SCTLR_SPAN // PAN (특권 레벨 접근 방지)
#if CFG_CORE_RWDATA_NOEXEC
    orr x0, x0, #SCTLR_WXN  // 쓰기 가능 영역 실행 금지
#endif
    msr sctlr_el1, x0
.endm`;

export const entryAnnotations = [
  { lines: [4, 20] as [number, number], color: 'sky' as const, note: 'set_sp: CPU별 스택 초기화' },
  { lines: [22, 31] as [number, number], color: 'emerald' as const, note: 'set_sctlr_el1: 시스템 제어 레지스터' },
];
