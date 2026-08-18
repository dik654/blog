# vllm/v1/core/sched/scheduler.py — Scheduler.schedule() (vLLM v0.27.1, RUNNING 처리 핵심 발췌)
# 원본은 encoder input, speculative decode, DP prefill balancing, mamba block
# 정렬 등 여러 부가 조건을 함께 처리하는 800줄 이상의 단일 method입니다.
# 본문 대응: token budget 상한과 KV block 확보 여부라는 두 hard feasibility
# 조건만 남기고, WAITING queue 처리와 부가 조건은 생략했습니다.

def schedule(self) -> SchedulerOutput:
    scheduled_running_reqs: list[Request] = []
    preempted_reqs: list[Request] = []

    req_to_new_blocks: dict[str, KVCacheBlocks] = {}
    num_scheduled_tokens: dict[str, int] = {}
    # 이번 iteration에 허용된 전체 token 예산 (n_tok <= B_tok의 B_tok)
    token_budget = self.max_num_scheduled_tokens

    # 1) RUNNING request부터 순회 — token budget이 남아 있는 동안만 진행
    req_index = 0
    while req_index < len(self.running) and token_budget > 0:
        request = self.running[req_index]

        # 이번 request가 이번 step에 처리할 token 수 (prefill chunk + decode token)
        num_new_tokens = (
            request.num_tokens_with_spec
            + request.num_output_placeholders
            - request.num_computed_tokens
        )
        # token budget 상한을 적용 — 남은 예산보다 많이 쓸 수 없음
        num_new_tokens = min(num_new_tokens, token_budget)

        if num_new_tokens == 0:
            # 이미 이번 step에 더 처리할 token이 없는 request는 건너뜀
            req_index += 1
            continue

        # 2) KV block 할당 시도 — 실패하면 우선순위 낮은 request를 preempt하고 재시도
        #    (M_KV^need <= M_KV^free가 즉시 성립하지 않을 때의 복구 경로)
        while True:
            new_blocks = self.kv_cache_manager.allocate_slots(
                request,
                num_new_tokens,
                num_lookahead_tokens=self.num_lookahead_tokens,
            )
            if new_blocks is not None:
                # 이번 request가 쓸 KV block을 확보함
                break

            # Free KV block이 모자람 — 가장 나중에 추가된 running request부터 선점
            preempted_req = self.running.pop()
            self._preempt_request(
                preempted_req,
                scheduled_timestamp=self.scheduled_timestamp,
            )
            preempted_reqs.append(preempted_req)

            if preempted_req == request:
                # 더 이상 뺏을 request가 없음 — 이번 request는 이번 step에 스케줄 불가
                new_blocks = None
                break

        if new_blocks is None:
            # KV block을 못 구하면 token budget이 남아도 RUNNING 순회를 중단
            break

        # 3) 이번 request를 이번 step의 batch에 확정
        scheduled_running_reqs.append(request)
        req_to_new_blocks[request.request_id] = new_blocks
        num_scheduled_tokens[request.request_id] = num_new_tokens
        token_budget -= num_new_tokens  # 이번 request가 쓴 만큼 예산 차감
        req_index += 1

    # WAITING queue를 남은 token_budget과 KV 여유로 마저 채우는 절차는 이어서 진행
    # (prefix cache hit, chunked prefill 경계는 vllm-paged-attention · vllm-scheduler 글에서 다룸)
    ...
