# transformers/models/mixtral/modeling_mixtral.py — repeat_kv
# (HuggingFace transformers v5.15.0). GQA/MQA를 쓰는 모델들이 공통으로
# 재사용하는 유틸 함수입니다.
# 본문 대응: K,V∈R^{T×H_KV×D_head}가 attention 계산 시점에 H_Q개 Q head와
# 짝지어지는 실제 방식, 그리고 g=H_Q/H_KV(group 크기)의 실제 이름(n_rep).

def repeat_kv(hidden_states: torch.Tensor, n_rep: int) -> torch.Tensor:
    """
    This is the equivalent of torch.repeat_interleave(x, dim=1, repeats=n_rep).
    The hidden states go from (batch, num_key_value_heads, seqlen, head_dim)
    to (batch, num_attention_heads, seqlen, head_dim)
    """
    # article의 K,V shape — (batch, H_KV, T, D_head)
    batch, num_key_value_heads, slen, head_dim = hidden_states.shape
    if n_rep == 1:
        return hidden_states  # MHA(H_Q=H_KV)면 그대로 반환 — 복제 불필요
    # article의 g=H_Q/H_KV — 각 KV head를 n_rep번 복제해 Q head 수에 맞춤
    # expand는 실제 memory를 복사하지 않고 broadcast view만 만듦(read 시점까지 복제 지연)
    hidden_states = hidden_states[:, :, None, :, :].expand(
        batch, num_key_value_heads, n_rep, slen, head_dim
    )
    # article의 H_Q=H_KV×g — reshape에서 비로소 (batch, H_Q, T, D_head) 모양이 됨
    return hidden_states.reshape(batch, num_key_value_heads * n_rep, slen, head_dim)
