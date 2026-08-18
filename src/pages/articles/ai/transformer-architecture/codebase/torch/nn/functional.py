# torch/nn/functional.py — scaled_dot_product_attention의 공식 문서에 실린
# "Efficient implementation equivalent to the following" 참조 구현
# (PyTorch v2.13.0). 실제 F.scaled_dot_product_attention 자체는 FlashAttention 등
# fused C++/CUDA kernel로 실행되지만, PyTorch가 그 kernel과 수학적으로 같은 결과를
# 내는 순수 Python 버전을 공식 docstring에 함께 명시해 둔 것을 그대로 옮겼습니다.
# 본문 대응: QKVComputation의 A=softmax(QKᵀ/√d_k+M), Y=AV.

def scaled_dot_product_attention(
    query, key, value, attn_mask=None, dropout_p=0.0,
    is_causal=False, scale=None, enable_gqa=False,
):
    L, S = query.size(-2), key.size(-2)
    # article의 1/√d_k — scale factor를 명시하지 않으면 head dimension으로 자동 계산
    scale_factor = 1 / math.sqrt(query.size(-1)) if scale is None else scale
    attn_bias = torch.zeros(L, S, dtype=query.dtype, device=query.device)

    if is_causal:
        # article의 QKVComputation이 말하는 "미래 key를 가리는" causal mask를
        # bool tril로 만들고, 금지된 자리를 -inf로 채워 additive mask M을 완성
        assert attn_mask is None
        temp_mask = torch.ones(L, S, dtype=torch.bool, device=query.device).tril(diagonal=0)
        attn_bias.masked_fill_(temp_mask.logical_not(), float("-inf"))

    if attn_mask is not None:
        if attn_mask.dtype == torch.bool:
            attn_bias.masked_fill_(attn_mask.logical_not(), float("-inf"))
        else:
            attn_bias = attn_mask + attn_bias

    if enable_gqa:
        # Grouped-Query Attention — key/value head 수가 query보다 적을 때 반복해서 맞춤
        key = key.repeat_interleave(query.size(-3) // key.size(-3), -3)
        value = value.repeat_interleave(query.size(-3) // value.size(-3), -3)

    # article의 QKᵀ/√d_k — dot-product score를 head dimension 제곱근으로 정규화
    attn_weight = query @ key.transpose(-2, -1) * scale_factor
    # article의 "+M" — additive mask를 score에 더함
    attn_weight += attn_bias
    # article의 A=softmax(...) — row(query)별로 정규화한 attention weight
    attn_weight = torch.softmax(attn_weight, dim=-1)
    attn_weight = torch.dropout(attn_weight, dropout_p, train=True)
    # article의 Y=AV — attention weight로 value를 가중합
    return attn_weight @ value
