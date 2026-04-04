import type { CodeRef } from './codeRefs';

/** async_function_with_fallbacks — 폴백 체인 실행 핵심 로직 */
export const fallbackRef: CodeRef = {
  id: 'fallback-handler',
  title: 'async_function_with_fallbacks()',
  file: 'litellm/router.py',
  startLine: 5523,
  code: `async def async_function_with_fallbacks(
    self, *args, **kwargs
):
    """
    1차: async_function_with_retries로 호출 시도
    실패 시: 폴백 모델 그룹으로 순차 전환
    """
    model_group = kwargs.get("model")
    fallbacks = kwargs.get("fallbacks", self.fallbacks)
    context_window_fallbacks = kwargs.get(
        "context_window_fallbacks",
        self.context_window_fallbacks)
    content_policy_fallbacks = kwargs.get(
        "content_policy_fallbacks",
        self.content_policy_fallbacks)

    try:
        # 1) 리트라이 포함 호출 시도
        response = await self.async_function_with_retries(
            *args, **kwargs)
        response = add_fallback_headers_to_response(
            response=response, attempted_fallbacks=0)
        return response

    except Exception as e:
        # 2) 실패 → 폴백 체인 실행
        return await (
            self.async_function_with_fallbacks_common_utils(
                e,
                disable_fallbacks=False,
                fallbacks=fallbacks,
                context_window_fallbacks=context_window_fallbacks,
                content_policy_fallbacks=content_policy_fallbacks,
                model_group=model_group,
                args=args, kwargs=kwargs,
            ))`,
  annotations: [
    { lines: [5531, 5537], color: 'sky', note: '3종 폴백 — 일반 / 컨텍스트 윈도 / 콘텐츠 정책' },
    { lines: [5540, 5545], color: 'emerald', note: '1차 시도 — retries 수만큼 동일 그룹 내 재시도' },
    { lines: [5548, 5558], color: 'rose', note: '전부 실패 → fallback_common_utils로 모델 전환' },
  ],
};
