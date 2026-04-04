import type { CodeRef } from './codeRefs';

/** proxy chat_completion — FastAPI 엔드포인트에서 Router 호출까지 */
export const proxyHandlerRef: CodeRef = {
  id: 'proxy-chat-completion',
  title: 'chat_completion() → Router',
  file: 'litellm/proxy/proxy_server.py',
  startLine: 6970,
  code: `async def chat_completion(
    request: Request,
    fastapi_response: Response,
    model: Optional[str] = None,
    user_api_key_dict: UserAPIKeyAuth = Depends(
        user_api_key_auth),
):
    """OpenAI-compatible /v1/chat/completions"""
    data = await _read_request_body(request=request)

    # 사용자 메타데이터 주입 (팀·조직·에이전트 ID)
    if user_api_key_dict is not None:
        if data.get("metadata") is None:
            data["metadata"] = {}
        data["metadata"]["user_api_key_user_id"] = (
            user_api_key_dict.user_id)
        data["metadata"]["user_api_key_team_id"] = (
            user_api_key_dict.team_id)

    # 공통 요청 처리 파이프라인으로 위임
    processor = ProxyBaseLLMRequestProcessing(data=data)
    result = await processor.base_process_llm_request(
        request=request,
        user_api_key_dict=user_api_key_dict,
        route_type="acompletion",  # → Router.acompletion()
        llm_router=llm_router,    # 전역 Router 인스턴스
    )
    return result`,
  annotations: [
    { lines: [6977, 6979], color: 'sky', note: 'OpenAI 포맷 그대로 — curl로 바로 호출 가능' },
    { lines: [6983, 6990], color: 'emerald', note: '팀·조직 메타데이터 자동 주입 → 비용 추적' },
    { lines: [6993, 7000], color: 'amber', note: 'route_type="acompletion" → Router.acompletion()' },
  ],
};

export { fallbackRef } from './codeRefsProxyFallback';
export { cooldownRef } from './codeRefsProxyCooldown';
