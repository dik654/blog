import type { CodeRef } from './codeRefs';

/** routing_strategy_init — 전략별 로거(CustomLogger) 초기화 */
export const routingStrategyRef: CodeRef = {
  id: 'routing-strategy-init',
  title: 'routing_strategy_init()',
  file: 'litellm/router.py',
  startLine: 797,
  code: `def routing_strategy_init(
    self,
    routing_strategy: Union[RoutingStrategy, str],
    routing_strategy_args: dict
):
    # 전략 유효성 검증
    valid_strategy_strings = (
        ["simple-shuffle"]
        + [s.value for s in RoutingStrategy]
    )

    # 전략별 로거(CustomLogger) 초기화
    if routing_strategy == "least-busy":
        self.leastbusy_logger = LeastBusyLoggingHandler(
            router_cache=self.cache)
        litellm.input_callback.append(self.leastbusy_logger)

    elif routing_strategy == "usage-based-routing":
        self.lowesttpm_logger = LowestTPMLoggingHandler(
            router_cache=self.cache,
            routing_args=routing_strategy_args)

    elif routing_strategy == "latency-based-routing":
        self.lowestlatency_logger = LowestLatencyLoggingHandler(
            router_cache=self.cache,
            routing_args=routing_strategy_args)

    elif routing_strategy == "cost-based-routing":
        self.lowestcost_logger = LowestCostLoggingHandler(
            router_cache=self.cache, routing_args={})`,
  annotations: [
    { lines: [803, 806], color: 'sky', note: 'RoutingStrategy enum에서 유효 전략 목록 생성' },
    { lines: [810, 813], color: 'emerald', note: 'least-busy — 처리 중 요청 수 추적 로거' },
    { lines: [815, 818], color: 'amber', note: 'usage-based — TPM/RPM 사용량 추적 (DualCache)' },
    { lines: [820, 823], color: 'violet', note: 'latency-based — 응답시간 기록, 최저 지연 선택' },
  ],
};
