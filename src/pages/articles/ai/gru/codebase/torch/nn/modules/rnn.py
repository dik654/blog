# torch/nn/modules/rnn.py — GRUCell (PyTorch v2.13.0). 실제 elementwise
# 연산은 `_VF.gru_cell`이라는 native(C++) 함수 하나로 실행되지만, class의
# 공식 docstring이 세 gate 식을 명시합니다.
# 본문 대응: Variants의 r_t,z_t,h̃_t,h_t — 단, candidate 식의 reset 적용
# 위치가 article과 실제 구현 사이에 실제로 다르다는 점이 이 비교의 핵심입니다.

class GRUCell(RNNCellBase):
    r"""A gated recurrent unit (GRU) cell.

    .. math::

        \begin{array}{ll}
        r = \sigma(W_{ir} x + b_{ir} + W_{hr} h + b_{hr}) \\
        z = \sigma(W_{iz} x + b_{iz} + W_{hz} h + b_{hz}) \\
        n = \tanh(W_{in} x + b_{in} + r \odot (W_{hn} h + b_{hn})) \\
        h' = (1 - z) \odot n + z \odot h
        \end{array}

    # article의 h̃_t=tanh(W_h x_t + U_h(r_t⊙h_{t-1}) + b_h)는 reset gate를
    # h_{t-1}에 먼저 곱한 뒤 행렬곱(U_h)을 적용합니다.
    #
    # 실제 PyTorch의 n = tanh(W_in x + b_in + r⊙(W_hn h + b_hn))은 반대로
    # 행렬곱(W_hn h + b_hn)을 먼저 계산한 뒤 그 결과 전체에 reset gate를
    # 곱합니다 — U_h(r⊙h) ≠ r⊙(U_h h)이므로 이 둘은 대수적으로 다른 함수입니다
    # (행렬곱은 elementwise 곱에 분배되지 않음). article이 스스로 명시한
    # "reset 적용 위치는 구현마다 다르다"는 경고가 실제로 참임을 코드 대조가
    # 확인해 줍니다 — 어느 쪽이 "원조"인지가 아니라, 이 두 식이 서로 다른
    # 함수라는 사실 자체가 재현성에서 중요합니다.
    """
