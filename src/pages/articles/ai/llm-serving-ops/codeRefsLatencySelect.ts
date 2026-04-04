import type { CodeRef } from './codeRefs';

/** async_get_available_deployment — 전략별 배포 선택 분기점 */
export const deploymentSelectRef: CodeRef = {
  id: 'deployment-select',
  title: 'async_get_available_deployment()',
  file: 'litellm/router.py',
  startLine: 9233,
  code: `async def async_get_available_deployment(
    self, model: str, request_kwargs: Dict,
    messages=None, specific_deployment=False,
):
    """라우팅 전략에 따라 최적 배포를 비동기 선택"""
    healthy_deployments = await self.async_get_healthy_deployments(
        model=model, request_kwargs=request_kwargs,
        messages=messages)
    if isinstance(healthy_deployments, dict):
        return healthy_deployments

    # 전략별 분기
    if self.routing_strategy == "usage-based-routing-v2":
        deployment = await (
            self.lowesttpm_logger_v2
            .async_get_available_deployments(
                model_group=model,
                healthy_deployments=healthy_deployments))

    elif self.routing_strategy == "cost-based-routing":
        deployment = await (
            self.lowestcost_logger
            .async_get_available_deployments(
                model_group=model,
                healthy_deployments=healthy_deployments))

    elif self.routing_strategy == "latency-based-routing":
        deployment = await (
            self.lowestlatency_logger
            .async_get_available_deployments(
                model_group=model,
                healthy_deployments=healthy_deployments,
                request_kwargs=request_kwargs))

    elif self.routing_strategy == "simple-shuffle":
        return simple_shuffle(
            llm_router_instance=self,
            healthy_deployments=healthy_deployments,
            model=model)

    elif self.routing_strategy == "least-busy":
        deployment = await (
            self.leastbusy_logger
            .async_get_available_deployments(
                model_group=model,
                healthy_deployments=healthy_deployments))`,
  annotations: [
    { lines: [9239, 9242], color: 'sky', note: '건강한 배포만 필터링 (쿨다운 제외)' },
    { lines: [9246, 9252], color: 'emerald', note: 'usage-based — TPM/RPM 여유 있는 배포' },
    { lines: [9260, 9267], color: 'amber', note: 'latency-based — 평균 응답시간 최소 배포' },
    { lines: [9269, 9273], color: 'violet', note: 'simple-shuffle — 가중 랜덤 (기본)' },
  ],
};
