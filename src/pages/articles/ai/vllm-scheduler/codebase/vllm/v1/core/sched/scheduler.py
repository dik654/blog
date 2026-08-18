# vllm/v1/core/sched/scheduler.py (vLLM v0.27.1)
# 이 글에서 다루는 두 실제 메커니즘만 발췌했습니다 — 긴 prefill을 chunk로
# 자르는 조건(schedule() 안 RUNNING 처리 일부)과, KV block이 모자랄 때
# request를 되돌리는 절차(_preempt_request 전체)입니다.

class Scheduler(SchedulerInterface):
    def schedule(self) -> SchedulerOutput:
        ...
        req_index = 0
        while req_index < len(self.running) and token_budget > 0:
            request = self.running[req_index]
            ...
            # 이번 request가 이번 step에 처리할 token 수 (prefill 잔여 + decode)
            num_new_tokens = (
                request.num_tokens_with_spec
                + request.num_output_placeholders
                - request.num_computed_tokens
            )
            # 긴 prefill을 한 iteration에 전부 넣지 않고 상한으로 자름
            # (C = ceil(P/c)에서 c가 바로 이 threshold)
            if 0 < self.scheduler_config.long_prefill_token_threshold < num_new_tokens:
                num_new_tokens = self.scheduler_config.long_prefill_token_threshold
            # 남은 token budget으로 한 번 더 clip — decode가 예산을 다 뺏기지 않게 함
            num_new_tokens = min(num_new_tokens, token_budget)
            ...

    def _preempt_request(
        self, request: Request, timestamp: float, drop_stale_output: bool = False
    ) -> None:
        """Preempt a request and put it back to the waiting queue.

        NOTE: The request should be popped from the running queue outside of
        this method.
        """
        assert request.status == RequestStatus.RUNNING, (
            "Only running requests can be preempted"
        )
        # KV block과 encoder cache를 모두 반환 — 재개 시 처음부터 다시 확보해야 함
        self._free_request_blocks(request)
        self.encoder_cache_manager.free(request)
        self._inflight_prefills.discard(request)

        # 상태를 PREEMPTED로 바꾸고 진행 counter를 0으로 재설정
        request.status = RequestStatus.PREEMPTED
        request.num_computed_tokens = 0
        if request.spec_token_ids:
            # 검증 전이던 speculative 후보도 함께 비움 — 재개 후 처음부터 다시 draft
            request.spec_token_ids = []
        request.num_output_placeholders = 0
        request.num_preemptions += 1
        if self.log_stats:
            request.record_event(EngineCoreEventType.PREEMPTED, timestamp)

        # WAITING queue로 되돌림 — FCFS면 맨 앞, PRIORITY면 (priority, arrival_time) 순서
        self.waiting.prepend_request(request)
