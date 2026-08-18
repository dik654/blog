# transformers/masking_utils.py — padding_mask_function · eager_mask
# (HuggingFace transformers v5.15.0). 실제 시스템은 vmap 기반 mask factory로
# 여러 mask 종류(causal·padding·packed sequence)를 조합 가능하게 만들지만,
# padding mask 자체의 핵심 규칙은 한 줄입니다.
# 본문 대응: V_i={j:m_j=1} — visible-key set을 만드는 규칙.

def padding_mask_function(padding_mask):
    """2D padding mask(batch, kv_len)를 mask_function으로 바꿉니다."""
    def inner_mask(batch_idx, head_idx, q_idx, kv_idx):
        # article의 V_i={j:m_j=1} 그 자체 — kv_idx(j)가 실제 token이면
        # (padding_mask==1) True, PAD면 False
        return padding_mask[batch_idx, kv_idx]
    return inner_mask


def eager_mask(mask, dtype):
    """Boolean visibility mask를 attention score에 더할 수 있는 float mask로 변환."""
    # article의 s_{ij}에 더할 additive mask — True(허용)는 0, False(금지)는
    # 해당 dtype에서 표현 가능한 가장 작은 값(사실상 -inf)
    min_dtype = torch.finfo(dtype).min
    return torch.where(mask, torch.tensor(0.0, dtype=dtype), min_dtype)
