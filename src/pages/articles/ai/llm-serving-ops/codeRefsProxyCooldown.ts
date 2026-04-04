import type { CodeRef } from './codeRefs';

/** cooldown_handlers — 실패 배포 일시 비활성화 판단 */
export const cooldownRef: CodeRef = {
  id: 'cooldown-handler',
  title: '_is_cooldown_required()',
  file: 'litellm/router_utils/cooldown_handlers.py',
  startLine: 40,
  code: `def _is_cooldown_required(
    litellm_router_instance: LitellmRouter,
    model_id: str,
    exception_status: Union[str, int],
    exception_str: Optional[str] = None,
) -> bool:
    """
    HTTP 상태코드로 쿨다운 필요 여부 판단
    - 429 Rate Limit → 쿨다운 O (일시 과부하)
    - 401 Auth Error → 쿨다운 O (키 만료)
    - 408 Timeout    → 쿨다운 O (서버 무응답)
    - 기타 4xx       → 쿨다운 X (클라이언트 오류)
    - 5xx            → 쿨다운 O (서버 장애)
    """
    # APIConnectionError는 쿨다운하지 않음
    ignored_strings = ["APIConnectionError"]
    if exception_str is not None:
        for s in ignored_strings:
            if s in exception_str:
                return False

    if isinstance(exception_status, str):
        exception_status = int(exception_status)

    if 400 <= exception_status < 500:
        if exception_status == 429:   # Rate Limit
            return True
        elif exception_status == 401: # Auth Error
            return True
        elif exception_status == 408: # Timeout
            return True
        else:
            return False  # 기타 4xx는 쿨다운 안함
    else:
        return True  # 5xx 서버 에러 → 쿨다운`,
  annotations: [
    { lines: [47, 53], color: 'sky', note: 'HTTP 상태코드별 쿨다운 판단 규칙' },
    { lines: [57, 60], color: 'emerald', note: 'APIConnectionError 제외 — 순간 끊김은 무시' },
    { lines: [65, 72], color: 'amber', note: '429·401·408만 쿨다운 — 기타 4xx는 통과' },
    { lines: [74, 75], color: 'rose', note: '5xx = 서버 장애 → 무조건 쿨다운 등록' },
  ],
};
