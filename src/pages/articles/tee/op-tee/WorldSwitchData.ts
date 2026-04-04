export const smFromNsecCode = `// core/arch/arm/sm/sm.c — 실제 구현

// Normal World(비보안) -> Secure World 진입 함수
uint32_t sm_from_nsec(struct sm_ctx *ctx) {
    uint32_t *nsec_r0 = (uint32_t *)(&ctx->nsec.r0);
    struct thread_smc_args *args = (struct thread_smc_args *)nsec_r0;

    // 1. WDT (워치독 타이머) 핸들러 우선 처리
    if (wdt_sm_handler(args) == SM_HANDLER_SMC_HANDLED)
        return SM_EXIT_TO_NON_SECURE;

    // 2. 플랫폼별 커스텀 핸들러 (약한 심볼, 기본은 SM_HANDLER_PENDING_SMC)
    if (IS_ENABLED(CFG_SM_PLATFORM_HANDLER) &&
        sm_platform_handler(ctx) == SM_HANDLER_SMC_HANDLED)
        return SM_EXIT_TO_NON_SECURE;

    // 3. PSCI / SMCCC_ARCH 표준 SMC -> Non-Secure 세계에서 처리
    switch (OPTEE_SMC_OWNER_NUM(args->a0)) {
    case OPTEE_SMC_OWNER_STANDARD:
        smc_std_handler(args, &ctx->nsec);
        return SM_EXIT_TO_NON_SECURE;
    case OPTEE_SMC_OWNER_ARCH:
        smc_arch_handler(args);     // SMCCC_VERSION, SOC_ID 등
        return SM_EXIT_TO_NON_SECURE;
    default:
        break;  // OP-TEE 전용 SMC -> Secure World로 진행
    }

    // 4. 레지스터 컨텍스트 교환 (Non-Secure <-> Secure)
    sm_save_unbanked_regs(&ctx->nsec.ub_regs);    // r8-r12 저장
    sm_restore_unbanked_regs(&ctx->sec.ub_regs);  // Secure 레지스터 복원
    memcpy(&ctx->sec.r0, args, sizeof(*args));    // SMC 인자 전달

    // 5. Fast vs Standard Call 분기
    if (OPTEE_SMC_IS_FAST_CALL(ctx->sec.r0))
        ctx->sec.mon_lr = (uint32_t)vector_fast_smc_entry;   // 인터럽트 금지
    else
        ctx->sec.mon_lr = (uint32_t)vector_std_smc_entry;    // 선점 허용

    return SM_EXIT_TO_SECURE;  // -> OP-TEE OS S.EL1으로 점프
}`;

export const smAnnotations = [
  { lines: [8, 10] as [number, number], color: 'sky' as const, note: 'WDT 핸들러 우선 처리' },
  { lines: [17, 26] as [number, number], color: 'emerald' as const, note: 'SMC Owner별 분기 처리' },
  { lines: [28, 31] as [number, number], color: 'amber' as const, note: '레지스터 컨텍스트 교환' },
  { lines: [33, 38] as [number, number], color: 'violet' as const, note: 'Fast/Standard Call 분기' },
];

export const smcIdCode = `// include/sm/optee_smc.h
// SMC 함수 ID: ARM SMCCC 규격
//   [31]    Fast Call (1) or Standard Call (0)
//   [30:24] Owner (0x3E = Trusted OS, 0x00 = Standard)
//   [15:0]  Function number

// 주요 OP-TEE SMC 호출
OPTEE_SMC_CALL_GET_OS_UUID        // OP-TEE UUID 조회 (빠른 호출)
OPTEE_SMC_CALL_OPEN_SESSION       // TA 세션 열기 (표준 호출)
OPTEE_SMC_CALL_INVOKE_COMMAND     // TA 명령 실행 (표준 호출)
OPTEE_SMC_CALL_CLOSE_SESSION      // TA 세션 닫기 (표준 호출)
OPTEE_SMC_ENABLE_SHM_CACHE        // 공유 메모리 캐시 활성화

// Fast Call: 짧은 처리, 인터럽트 마스크됨, 즉시 반환
// Standard Call: RPC를 통해 Normal World 서비스 요청 가능
// -> 예: 파일 읽기 시 OP-TEE가 Normal World 파일 시스템 요청
//    Normal World가 RPC로 데이터 전달 -> OP-TEE 재진입`;

export const smcIdAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'ARM SMCCC 비트 레이아웃' },
  { lines: [7, 12] as [number, number], color: 'emerald' as const, note: '주요 SMC 호출 목록' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: 'Fast vs Standard Call 차이' },
];
