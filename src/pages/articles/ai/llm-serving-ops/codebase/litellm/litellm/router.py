# BerriAI/litellm 저장소 · litellm/router.py (main branch, commit 007bd43,
# 2026년 8월 기준). 전체 12257줄 중 이 글이 다루는 _pre_call_checks만
# 발췌했습니다. RPM cache 조회, invalid-params 검사, async 버전은
# 생략했습니다.
# 본문 대응: LiteLLMGateway section의 "먼저 context·tool·output schema·
# region 조건을 만족하지 않는 backend를 제외한 뒤, 남은 후보에서
# health·queue·cost에 따라 route를 고른다"는 eligibility-before-ranking
# claim의 실제 구현.

def _pre_call_checks(
    self,
    model: str,
    healthy_deployments: list,
    messages=None,
    input=None,
    request_kwargs=None,
):
    """
    Filter out model in model group, if:

    - model context window < message length.
    - filter models above rpm limits
    - if region given, filter out models not in that region / unknown region
    """
    _returned_deployments = list(healthy_deployments)
    invalid_model_indices = set()

    for idx, deployment in enumerate(_returned_deployments):
        _litellm_params = deployment.get("litellm_params", {})
        _model_info = deployment.get("model_info", {})

        # article의 "context 조건을 만족하지 않는 backend를 제외" —
        # deployment의 max_input_tokens보다 실제 prompt token 수가 크면
        # 이 deployment를 candidate에서 뺀다(ranking 이전 단계)
        model_info = self.get_router_model_info(deployment=deployment, received_model_name=model)
        max_input_tokens = model_info.get("max_input_tokens") if isinstance(model_info, dict) else None
        if isinstance(max_input_tokens, int):
            input_tokens = self._count_pre_call_check_tokens(messages=messages, input=input)
            if input_tokens > max_input_tokens:
                invalid_model_indices.add(idx)
                continue

        # article에는 없는 실제 세부 조건 — RPM(분당 요청 수) 한도를 넘긴
        # deployment도 ranking 이전에 candidate에서 제외한다
        model_id = _model_info.get("id", "")
        current_request = self.cache.get_cache(key=model_id, local_only=True) or 0
        if _litellm_params.get("rpm") is not None and _litellm_params["rpm"] <= current_request:
            invalid_model_indices.add(idx)
            continue

        # article의 "region 조건을 만족하지 않는 backend를 제외" —
        # 요청이 allowed_model_region을 지정하면 그 region 밖의
        # deployment는 후보에서 제외한다
        allowed_model_region = (request_kwargs or {}).get("allowed_model_region")
        if allowed_model_region is not None:
            if not is_region_allowed(
                litellm_params=LiteLLM_Params(**_litellm_params),
                allowed_model_region=allowed_model_region,
            ):
                invalid_model_indices.add(idx)
                continue

    # 여기서 살아남은 deployment만 이후 routing_strategy(lowest_latency 등)
    # 로 넘어가 health·queue·cost 기준 ranking을 받는다 — article이 말한
    # "이 순서를 뒤집으면 안 된다"의 실제 순서
    if len(invalid_model_indices) > 0:
        return [m for idx, m in enumerate(_returned_deployments) if idx not in invalid_model_indices]
    return _returned_deployments
