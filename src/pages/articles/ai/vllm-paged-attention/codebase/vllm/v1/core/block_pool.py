# vllm/v1/core/block_pool.py — BlockPool.touch · free_blocks (vLLM v0.27.1)
# 본문 대응: ref(b)가 실제로 언제 오르고 내리는지, ref(b)=0이 되는 순간
# free_block_queue(eviction 후보 목록)에 어떻게 들고 나는지의 발췌입니다.

class BlockPool:
    def touch(self, blocks: Sequence[KVCacheBlock]) -> None:
        """Touch a block increases its reference count by 1, and may remove
        the block from the free queue. This is used when a block is hit by
        another request with the same prefix.
        """
        for block in blocks:
            # ref_cnt=0이면 이 block은 현재 free list(=eviction 후보)에 있으므로 뺌
            if block.ref_cnt == 0 and not block.is_null:
                self.free_block_queue.remove(block)
            block.ref_cnt += 1

    def free_blocks(self, ordered_blocks: Iterable[KVCacheBlock]) -> None:
        """Free a list of blocks. The blocks should be ordered by their
        eviction priority, where the first block will be evicted first.
        """
        blocks_with_hash = []
        blocks_without_hash = []
        for block in ordered_blocks:
            block.ref_cnt -= 1
            if block.ref_cnt == 0 and not block.is_null:
                # ref_cnt가 0이 된 순간에만 free_block_queue로 되돌림
                # (article의 evictable(b) ⟹ ref(b)=0)
                if block.block_hash is None and self.enable_caching:
                    blocks_without_hash.append(block)
                else:
                    blocks_with_hash.append(block)

        # Hash 없는 block(캐시 재사용 불가)을 먼저 evict — tail 앞쪽에 prepend
        self.free_block_queue.prepend_n(blocks_without_hash)
        # Hash 있는 block(cache hit 후보)은 뒤에 append — 더 오래 살아남음
        self.free_block_queue.append_n(blocks_with_hash)
