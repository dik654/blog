# torch/nn/modules/transformer.py — TransformerEncoderLayer.forward의
# norm_first 분기와 _sa_block·_ff_block (PyTorch v2.13.0).
# 원본은 fused fastpath(NestedTensor·autocast·hook 감지 등) 최적화 분기가
# forward 앞부분에 크게 자리잡고 있어, 실제 residual+norm 계산만 발췌했습니다.
# 본문 대응: FeedForward의 y_pre=x+F(Norm(x)), y_post=Norm(x+F(x))와
# Summary의 forward-pass AlgorithmBlock이 정의한 layer 하나의 본문.

class TransformerEncoderLayer(Module):
    def forward(self, src, src_mask=None, src_key_padding_mask=None, is_causal=False):
        # see Fig. 1 of https://arxiv.org/pdf/2002.04745v1.pdf
        x = src
        if self.norm_first:
            # article의 y_pre = x + F(Norm(x))
            x = x + self._sa_block(
                self.norm1(x), src_mask, src_key_padding_mask, is_causal=is_causal
            )
            x = x + self._ff_block(self.norm2(x))
        else:
            # article의 y_post = Norm(x + F(x))
            x = self.norm1(
                x
                + self._sa_block(x, src_mask, src_key_padding_mask, is_causal=is_causal)
            )
            x = self.norm2(x + self._ff_block(x))

        return x

    # self-attention block — article의 F(x) 중 attention 쪽
    def _sa_block(self, x, attn_mask, key_padding_mask, is_causal=False):
        x = self.self_attn(
            x, x, x,  # article의 Q,K,V — 모두 같은 x에서 나오는 self-attention
            attn_mask=attn_mask,
            key_padding_mask=key_padding_mask,
            need_weights=False,
            is_causal=is_causal,
        )[0]
        return self.dropout1(x)

    # feed forward block — article의 FFN(x_t)=W_2·φ(W_1x_t+b_1)+b_2
    def _ff_block(self, x):
        x = self.linear2(self.dropout(self.activation(self.linear1(x))))
        return self.dropout2(x)
