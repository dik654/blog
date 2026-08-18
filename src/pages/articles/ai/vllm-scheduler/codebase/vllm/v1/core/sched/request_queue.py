# vllm/v1/core/sched/request_queue.py (vLLM v0.27.1)
# 본문 대응: RUNNING·WAITING queue가 FCFS와 PRIORITY 두 policy로 갈리는 지점.

class PriorityRequestQueue(RequestQueue):
    """
    A priority queue that supports heap operations.

    Respects the ordering defined in the Request class, where requests with
    a smaller value of `priority` are processed first. If multiple requests
    have the same priority, the one with the earlier `arrival_time` is
    processed first.
    """

    def __init__(self) -> None:
        self._heap: list[Request] = []

    def add_request(self, request: Request) -> None:
        # Request.__lt__가 정의한 (priority, arrival_time, ...) 순서로 정렬 유지
        heapq.heappush(self._heap, request)

    def pop_request(self) -> Request:
        # heap에서 가장 우선순위 높은(=값이 가장 작은) request를 꺼냄
        if not self._heap:
            raise IndexError("pop from empty heap")
        return heapq.heappop(self._heap)

    def prepend_request(self, request: Request) -> None:
        """Add a request to the queue according to priority policy.

        Note: In a priority queue, there is no concept of prepending to the
        front. Requests are ordered by (priority, arrival_time).
        """
        # Preemption으로 되돌아온 request도 앞이 아니라 같은 우선순위 규칙으로 재삽입
        self.add_request(request)
