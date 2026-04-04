export const taTypesCode = `// OP-TEE TA 유형
1. User-space TA (user_ta)
   - ELF 바이너리, S.EL0에서 실행 (최소 권한)
   - 파일시스템 또는 early_ta로 로드
   - /lib/optee_armtz/<uuid>.ta 형태로 저장

2. Pseudo TA (pta)
   - OP-TEE 커널(S.EL1) 내부 구현
   - core/pta/에 정적 링크
   - 예: pta_device.c, pta_system.c, pta_stats.c
   - TEE_UUID로 식별, 일반 TA와 동일한 API

3. SP (Secure Partition, FF-A)
   - ARMv8.4+ Firmware Framework for ARM
   - SEL1 SP: OP-TEE 수준의 격리
   - SEL0 SP: S.EL0에서 실행`;

export const openSessionCode = `// core/kernel/tee_ta_manager.c

TEE_Result tee_ta_open_session(
    TEE_ErrorOrigin *err,
    struct tee_ta_session **sess,
    struct tee_ta_session_head *open_sessions,
    const TEE_UUID *uuid,           // TA 고유 ID (16 bytes)
    const TEE_Identity *clnt_id,    // 호출자 신원 (TEEC_Login 타입)
    uint32_t cancel_req_to,         // 취소 타임아웃
    struct tee_ta_param *param)     // 입출력 파라미터 (최대 4개)
{
    // 1. UUID로 TA 컨텍스트 초기화 (이미 로드된 경우 재사용)
    res = tee_ta_init_session(err, open_sessions, uuid, &s);

    // 2. 파라미터 타입 검증 (TEEC_PARAM_TYPE_* 비트필드)
    if (!check_params(s, param))
        return TEE_ERROR_BAD_PARAMETERS;

    ts_ctx = s->ts_sess.ctx;
    ctx = ts_to_ta_ctx(ts_ctx);

    // 3. 단일 인스턴스 TA의 경우 busy 잠금 획득
    if (tee_ta_try_set_busy(ctx)) {
        s->clnt_id = *clnt_id;  // 호출자 신원 저장
        res = ts_ctx->ops->open_session(&s->ts_sess,
                                         param, err);
        tee_ta_clear_busy(ctx);
    } else {
        res = TEE_ERROR_BUSY;
    }
    return res;
}

// 세션 구조체
struct tee_ta_session {
    uint32_t         id;          // 세션 ID (외부 노출)
    TEE_Identity     clnt_id;     // 호출자 신원 (UUID/공개키/사용자 ID)
    struct tee_ta_ctx *ctx;       // TA 컨텍스트 (코드/상태 공유)
    // ...
};`;

export const invokeCommandCode = `// core/kernel/tee_ta_manager.c

TEE_Result tee_ta_invoke_command(
    TEE_ErrorOrigin *err,
    struct tee_ta_session *sess,
    const TEE_Identity *clnt_id,
    uint32_t cancel_req_to,
    uint32_t cmd,           // TA가 정의한 커맨드 ID
    struct tee_ta_param *param)
{
    // 1. 호출자 신원 검증 (화이트리스트 또는 로그인 타입별 정책)
    check_client(sess, clnt_id);

    ctx = ts_to_ta_ctx(sess->ts_sess.ctx);

    // 2. 잠금 + 명령 실행
    if (tee_ta_try_set_busy(ctx)) {
        sess->ts_sess.ctx->ops->enter_invoke_cmd(&sess->ts_sess, cmd);
        res = sess->ts_sess.ctx->ops->invoke_cmd(
                  &sess->ts_sess, cmd, param, err);
        sess->ts_sess.ctx->ops->leave_invoke_cmd(&sess->ts_sess);
        tee_ta_clear_busy(ctx);
    }
}

// TA에서 수신: TA_InvokeCommandEntryPoint(sessionContext, cmd, paramTypes, params)
// 파라미터: MEMREF(공유 메모리), VALUE(32-bit 쌍), NONE`;
