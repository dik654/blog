import type { CodeRef } from './codeRefs';

/** LowestLatencyLoggingHandler._get_available_deployments */
export const latencyStrategyRef: CodeRef = {
  id: 'latency-strategy',
  title: 'LowestLatency._get_available_deployments()',
  file: 'litellm/router_strategy/lowest_latency.py',
  startLine: 422,
  code: `def _get_available_deployments(
    self, model_group: str, healthy_deployments: list,
    messages=None, input=None,
    request_kwargs=None, request_count_dict=None,
):
    """배포별 평균 레이턴시 비교 → 최저 지연 배포 선택"""
    _latency_per_deployment = {}
    # 분 단위 시간 키 — TPM/RPM 윈도 기준
    precise_minute = datetime.now().strftime(
        "%Y-%m-%d-%H-%M")

    all_deployments = request_count_dict
    for d in healthy_deployments:
        if d["model_info"]["id"] not in all_deployments:
            all_deployments[d["model_info"]["id"]] = {
                "latency": [0],  # 미사용 → 레이턴시 0
                precise_minute: {"tpm": 0, "rpm": 0}}

    # 랜덤 셔플 → 동일 레이턴시 시 편향 방지
    _items = all_deployments.items()
    all_deployments = dict(
        random.sample(list(_items), len(_items)))

    potential_deployments = []
    for item, item_map in all_deployments.items():
        # TPM/RPM 한도 초과 → 스킵
        item_tpm = item_map.get(precise_minute, {}).get("tpm", 0)
        if item_tpm > _deployment_tpm:
            continue

        # 스트리밍이면 TTFT, 아니면 전체 레이턴시
        use_ttft = (request_kwargs and
            request_kwargs.get("stream") is True)
        latency_key = "time_to_first_token" if use_ttft else "latency"
        avg_lat = _avg(item_map.get(latency_key, []))
        potential_deployments.append((_deployment, avg_lat))

    # 최저 레이턴시 + 버퍼 범위 내 랜덤 선택
    sorted_deps = sorted(potential_deployments, key=lambda x: x[1])
    lowest = sorted_deps[0][1]
    buffer = self.routing_args.lowest_latency_buffer * lowest
    valid = [x for x in sorted_deps if x[1] <= lowest + buffer]
    return random.choice(valid)[0]`,
  annotations: [
    { lines: [432, 435], color: 'sky', note: '분 단위 윈도 키 — TPM/RPM 한도 체크용' },
    { lines: [444, 447], color: 'emerald', note: '랜덤 셔플 — 동일 레이턴시 편향 방지' },
    { lines: [455, 460], color: 'amber', note: '스트리밍 시 TTFT(첫 토큰 시간) 기준 전환' },
    { lines: [463, 467], color: 'violet', note: '최저 레이턴시 + buffer% 범위에서 랜덤 선택' },
  ],
};
