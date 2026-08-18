# transformers/models/bert/modeling_bert.py — eager_attention_forward
# (HuggingFace transformers v5.15.0). BertSelfAttention이 Q/K/V projection과
# head 분할을 마친 뒤 실제 score·mask·softmax·value 결합을 수행하는 부분만
# 발췌했습니다.
# 본문 대응: s_{ij}=q_i^⊤k_j/√d, α_{ij}=softmax_{j∈V_i}(s_{ij}), h_i=Σα_{ij}v_j

def eager_attention_forward(module, query, key, value, attention_mask, scaling=None, dropout=0.0, **kwargs):
    if scaling is None:
        scaling = query.size(-1) ** -0.5

    # article의 s_{ij} = q_i^⊤k_j/√d — 모든 query·key pair의 raw score
    attn_weights = torch.matmul(query, key.transpose(2, 3)) * scaling

    if attention_mask is not None:
        # article의 V_i={j:m_j=1} — PAD 위치는 -inf에 가까운 값을 더해
        # softmax 이후 확률이 0이 되게 만듦 (허용된 key만 남기는 방법)
        attn_weights = attn_weights + attention_mask

    # article의 α_{ij}=softmax_{j∈V_i}(s_{ij})
    attn_weights = nn.functional.softmax(attn_weights, dim=-1)
    attn_weights = nn.functional.dropout(attn_weights, p=dropout, training=module.training)

    # article의 h_i=Σ_j α_{ij}v_j
    attn_output = torch.matmul(attn_weights, value)
    attn_output = attn_output.transpose(1, 2).contiguous()

    return attn_output, attn_weights
