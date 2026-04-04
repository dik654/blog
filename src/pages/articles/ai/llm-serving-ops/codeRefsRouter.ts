import type { CodeRef } from './codeRefs';

/** Router.__init__ — 라우터 초기화, 전략·폴백·쿨다운 설정 */
export const routerInitRef: CodeRef = {
  id: 'router-init',
  title: 'Router.__init__()',
  file: 'litellm/router.py',
  startLine: 225,
  code: `def __init__(
    self,
    model_list: Optional[
        Union[List[DeploymentTypedDict], List[Dict[str, Any]]]
    ] = None,
    ## RELIABILITY ##
    num_retries: Optional[int] = None,
    max_fallbacks: Optional[int] = None,
    fallbacks: List = [],
    context_window_fallbacks: List = [],
    ## ROUTING ##
    routing_strategy: Literal[
        "simple-shuffle",        # 기본값 — 랜덤 분배
        "least-busy",            # 현재 처리 중 요청 최소
        "usage-based-routing",   # TPM/RPM 사용량 기반
        "latency-based-routing", # 응답 지연시간 기반
        "cost-based-routing",    # 비용 기반 최저가
    ] = "simple-shuffle",
    ## COOLDOWN ##
    allowed_fails: Optional[int] = None,
    cooldown_time: Optional[float] = None,
) -> None:`,
  annotations: [
    { lines: [228, 230], color: 'sky', note: 'model_list — 배포 목록 (프로바이더별 모델 매핑)' },
    { lines: [233, 235], color: 'emerald', note: 'fallbacks — 실패 시 순차적으로 시도할 모델 그룹' },
    { lines: [237, 244], color: 'amber', note: 'routing_strategy — 6가지 라우팅 전략 중 선택' },
    { lines: [246, 248], color: 'rose', note: 'cooldown — 실패 배포를 일시적으로 비활성화' },
  ],
};

export { routerCompletionRef } from './codeRefsRouterCompletion';
export { routingStrategyRef } from './codeRefsRouterStrategy';
