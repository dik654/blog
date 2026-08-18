# vllm/v1/request.py — Request.__lt__ (vLLM v0.27.1)
# 본문 대응: priority scheduling에서 두 요청의 순서를 정하는 실제 비교 규칙.

class Request:
    def __lt__(self, other: "Request") -> bool:
        """
        Compare two requests based on priority, arrival time, and request ID.
        Used in priority scheduling.
        """
        # 1) priority 값이 다르면 작은 값이 우선 (article의 p_i, p_j 비교)
        if self.priority != other.priority:
            return self.priority < other.priority
        # 2) priority가 같으면 arrival_time이 이른 쪽이 우선 (article의 a_i, a_j 비교)
        if self.arrival_time != other.arrival_time:
            return self.arrival_time < other.arrival_time
        # 3) 둘 다 같으면 request_id, 그마저 같으면 object id로 결정적 순서를 보장
        #    (article의 lexicographic order 식에는 나오지 않는, 실제 구현의 tie-break)
        if self.request_id != other.request_id:
            return self.request_id < other.request_id
        return id(self) < id(other)
