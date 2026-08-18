# torch/nn/functional.py — _in_projection_packed(self-attention 분기)와
# multi_head_attention_forward의 head 분할·SDPA·병합·output projection
# (PyTorch v2.13.0). 원본은 encoder-decoder attention(k,v가 다른 tensor)과
# static_k/static_v·bias_k/bias_v·attn_mask 여러 shape 분기가 있어, self-attention
# 경로와 SDPA fastpath만 남기고 나머지는 생략했습니다.
# 본문 대응: SelfAttention의 Q=XW_Q,K=XW_K,V=XW_V와
# Q_h,K_h,V_h→Attention→Concat→MHA(X)=YW_O.

def _in_projection_packed(q, k, v, w, b=None):
    """Self-attention(q is k is v)일 때 Q,K,V projection."""
    E = q.size(-1)
    if q is k and k is v:
        # article의 Q=XW_Q, K=XW_K, V=XW_V를 하나로 합친 형태 — 세 개의 별도
        # 행렬 대신 [3E,E] 크기의 packed weight 하나로 한 번에 계산합니다
        # (메모리 접근 효율을 위한 구현 선택이며 결과는 수학적으로 동일합니다).
        proj = linear(q, w, b)
        proj = proj.unflatten(-1, (3, E)).unsqueeze(0).transpose(0, -2).squeeze(-2).contiguous()
        return proj[0], proj[1], proj[2]  # article의 Q, K, V


def multi_head_attention_forward(
    q, k, v, num_heads, out_proj_weight, out_proj_bias,
    bsz, tgt_len, src_len, head_dim, embed_dim,
    attn_mask=None, dropout_p=0.0, is_causal=False,
):
    # article의 Q_h, K_h, V_h — head 수만큼 나눠 각 head가 독립된 부분공간을 보게 함
    q = q.view(bsz, num_heads, tgt_len, head_dim)
    k = k.view(bsz, num_heads, src_len, head_dim)
    v = v.view(bsz, num_heads, src_len, head_dim)

    # article의 a_h = Attention(Q_h, K_h, V_h) — head마다 독립적으로 SDPA 수행
    attn_output = scaled_dot_product_attention(q, k, v, attn_mask, dropout_p, is_causal)

    # article의 Y = Concat(a_1, ..., a_H) — head별 output을 다시 이어 붙임
    attn_output = attn_output.permute(2, 0, 1, 3).reshape(bsz * tgt_len, embed_dim)

    # article의 MHA(X) = Y·W_O — 이어붙인 결과를 output projection에 통과
    attn_output = linear(attn_output, out_proj_weight, out_proj_bias)
    attn_output = attn_output.view(tgt_len, bsz, attn_output.size(1))
    return attn_output
