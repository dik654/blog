# vllm/v1/core/kv_cache_utils.py — hash_block_tokens (vLLM v0.27.1)
# 본문 대응: 블록 해시가 parent hash·token·extra key를 어떻게 하나로 묶는지.

def hash_block_tokens(
    hash_function: Callable[[Any], bytes],
    parent_block_hash: BlockHash | None,
    curr_block_token_ids: Sequence[int],
    extra_keys: tuple[Any, ...] | None = None,
) -> BlockHash:
    """Computes a hash value corresponding to the contents of a block and
    the contents of the preceding block(s). The hash value is used for
    prefix caching.

    Args:
        hash_function: The hash function used to compute block hash.
        parent_block_hash: The hash of the parent block. None
            if this is the first block.
        curr_block_token_ids: A list of token ids in the current
            block. The current block is assumed to be full.
        extra_keys: Extra keys for the block.
    """
    if not parent_block_hash:
        parent_block_hash = NONE_HASH  # 첫 block은 고정된 sentinel parent를 씀

    curr_block_token_ids_tuple = tuple(curr_block_token_ids)
    # article의 H_i = Hash(H_{i-1}, x_i, e_i) 그 자체 —
    # (parent hash, 현재 block token, extra key) 세 요소를 하나의 튜플로 묶어 해싱
    return BlockHash(
        hash_function((parent_block_hash, curr_block_token_ids_tuple, extra_keys))
    )
