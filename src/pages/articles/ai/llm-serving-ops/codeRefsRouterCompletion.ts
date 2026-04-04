import type { CodeRef } from './codeRefs';

/** Router._completion — 실제 모델 호출 수행 */
export const routerCompletionRef: CodeRef = {
  id: 'router-completion',
  title: 'Router._completion()',
  file: 'litellm/router.py',
  startLine: 1465,
  code: `def _completion(
    self, model: str, messages: List[Dict[str, str]], **kwargs
) -> Union[ModelResponse, CustomStreamWrapper]:
    try:
        # 1) 라우팅 전략에 따라 최적 배포 선택
        deployment = self.get_available_deployment(
            model=model,
            messages=messages,
            specific_deployment=kwargs.pop(
                "specific_deployment", None),
            request_kwargs=kwargs,
        )

        # 2) 배포의 litellm_params에서 실제 모델명 추출
        litellm_params = deployment["litellm_params"].copy()
        self._update_kwargs_with_deployment(
            deployment=deployment, kwargs=kwargs)
        model_name = litellm_params["model"]

        # 3) 캐시된 클라이언트 가져오기
        model_client = self._get_client(
            deployment=deployment, kwargs=kwargs)

        # 4) 라우팅 전략 사전 체크 (TPM/RPM 한도)
        if not self.has_model_id(model):
            self.routing_strategy_pre_call_checks(
                deployment=deployment)

        # 5) 실제 LLM API 호출
        response = litellm.completion(
            **litellm_params,
            messages=messages,
            client=model_client,
            **kwargs,
        )
        return response`,
  annotations: [
    { lines: [1471, 1478], color: 'sky', note: 'get_available_deployment() — 전략별 최적 배포 선택' },
    { lines: [1481, 1485], color: 'emerald', note: '선택된 배포의 실제 API 파라미터 추출' },
    { lines: [1493, 1496], color: 'amber', note: '사전 체크 — TPM/RPM 한도 초과 시 다른 배포' },
    { lines: [1498, 1505], color: 'violet', note: 'litellm.completion() — 프로바이더 SDK 자동 변환' },
  ],
};
