# BerriAI/litellm 저장소 · litellm/router_utils/get_retry_from_policy.py
# (main branch, commit 007bd43, 2026년 8월 기준). 56줄 전체를 그대로
# 실었습니다(생략 없음).
# 본문 대응: LiteLLMGateway section의 retry budget 식(D_remain 기반 남은
# 시간 판정)과 비교할 실제 구현 — 실제 LiteLLM router는 연속시간 deadline
# 부등식이 아니라 "exception 종류별 고정 retry count"로 재시도 여부를
# 결정한다. article의 D_remain·T_backoff 식은 일반적인 정책 설명이고, 이
# 파일은 그 정책을 실제로 구현한 한 가지 concrete 방식(count-based)이다.

def get_num_retries_from_retry_policy(
    exception: Exception,
    retry_policy=None,
    model_group=None,
    model_group_retry_policy=None,
):
    """
    BadRequestErrorRetries, AuthenticationErrorRetries, TimeoutErrorRetries,
    RateLimitErrorRetries, ContentPolicyViolationErrorRetries
    """
    # article과 다른 점 — 남은 시간(D_remain)이 아니라 model_group별로
    # 설정된 policy에서 exception 종류에 맞는 고정 retry count를 찾는다
    if model_group_retry_policy is not None and model_group is not None and model_group in model_group_retry_policy:
        retry_policy = model_group_retry_policy.get(model_group, None)

    if retry_policy is None:
        return None
    if isinstance(retry_policy, dict):
        retry_policy = RetryPolicy(**retry_policy)

    # article이 "요청 자체를 수행할 수 없는 상황"과 구분한 것처럼, 여기서도
    # exception 종류(auth/timeout/rate-limit/content-policy/bad-request)마다
    # 다른 retry count를 적용한다 — 모든 실패를 같은 정책으로 뭉치지 않음
    if isinstance(exception, AuthenticationError) and retry_policy.AuthenticationErrorRetries is not None:
        return retry_policy.AuthenticationErrorRetries
    if isinstance(exception, Timeout) and retry_policy.TimeoutErrorRetries is not None:
        return retry_policy.TimeoutErrorRetries
    if isinstance(exception, RateLimitError) and retry_policy.RateLimitErrorRetries is not None:
        return retry_policy.RateLimitErrorRetries
    if (
        isinstance(exception, ContentPolicyViolationError)
        and retry_policy.ContentPolicyViolationErrorRetries is not None
    ):
        return retry_policy.ContentPolicyViolationErrorRetries
    if isinstance(exception, BadRequestError) and retry_policy.BadRequestErrorRetries is not None:
        return retry_policy.BadRequestErrorRetries
