# torch/nn/modules/sparse.py — Embedding.forward (PyTorch v2.13.0).
# 실제 row 선택은 native(C++) torch.embedding()이 index로 직접 gather하며,
# one-hot vector를 실제로 만들거나 W와 matmul하지 않습니다. class의 공식
# docstring이 "simple lookup table... using indices"라고 그 사실을 그대로
# 설명합니다.
# 본문 대응: v_w = o_w^⊤ W의 실제 구현 — "sparse gather로 계산합니다"라는
# article의 문장이 실제로 참인지 확인.

class Embedding(Module):
    r"""A simple lookup table that stores embeddings of a fixed dictionary and size.

    This module is often used to retrieve word embeddings using indices.
    The input to the module is a list of indices, and the embedding matrix,
    and the output is the corresponding word embeddings.
    """

    def forward(self, input: Tensor) -> Tensor:
        # article의 v_w=o_w^⊤W 계산을 실제로는 one-hot·matmul 없이
        # F.embedding(index 기반 lookup)으로 대체
        return F.embedding(
            input,
            self.weight,  # article의 W(또는 W') — 전체 vocabulary table
            self.padding_idx,
            self.max_norm,
            self.norm_type,
            self.scale_grad_by_freq,
            self.sparse,
        )


# torch/nn/functional.py — F.embedding의 실제 dispatch 마지막 줄
def embedding(input, weight, padding_idx=None, max_norm=None, norm_type=2.0,
              scale_grad_by_freq=False, sparse=False):
    ...
    # article의 o_w^⊤W 전체를 계산하지 않고, index(input)로 필요한 row만
    # native gather — one-hot 표현은 개념적 설명이지 실제 실행 경로가 아님
    return torch.embedding(weight, input, padding_idx, scale_grad_by_freq, sparse)
