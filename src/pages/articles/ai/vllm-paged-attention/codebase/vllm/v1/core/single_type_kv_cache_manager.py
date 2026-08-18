# vllm/v1/core/single_type_kv_cache_manager.py — get_num_blocks_to_allocate
# (vLLM v0.27.1, full-attention 단일 cache group 경로만 발췌)
# 원본은 hybrid model(SWA·chunked-local)의 admission cap 분기가 추가로 있습니다.
# 본문이 이미 "단일 full-attention cache group을 설명하는 개념 식"이라고 명시한
# 범위에 맞춰 그 분기는 생략했습니다.

class SingleTypeKVCacheManager:
    def get_num_blocks_to_allocate(
        self,
        request_id: str,
        num_tokens: int,
        new_computed_blocks: Sequence[KVCacheBlock],
    ) -> int:
        """
        Get the number of blocks needed to be allocated for the request.

        Args:
            request_id: The request ID.
            num_tokens: The total number of tokens that need a slot
                (computed + new scheduled + lookahead 포함).
            new_computed_blocks: 이번에 prefix caching으로 새로 hit한 block.
        """
        # article의 ceil((n^computed + n^new + n^look) / B)
        num_required_blocks = cdiv(num_tokens, self.block_size)
        # article의 m^owned — 이미 이 request가 들고 있는 block 수
        num_req_blocks = len(self.req_to_blocks.get(request_id, ()))

        # article의 m^alloc = max(0, ceil(...) - m^owned)
        return max(num_required_blocks - num_req_blocks, 0)
