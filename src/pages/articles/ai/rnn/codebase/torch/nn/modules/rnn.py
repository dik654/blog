# torch/nn/modules/rnn.py — RNNCellBase.__init__ · RNNCell.forward
# (PyTorch v2.13.0). 실제 elementwise 연산(W_ih·x+b_ih+W_hh·h+b_hh, tanh)은
# `_VF.rnn_tanh_cell`이라는 native(C++) 함수 하나로 실행되지만, 그 native
# 함수가 정확히 무엇을 계산하는지는 class의 공식 docstring이 수식으로
# 명시하고, weight·bias의 실제 shape는 __init__이 그대로 보여줍니다.
# 본문 대응: a_t=W_xh x_t+W_hh h_{t-1}+b_h, h_t=tanh(a_t)

class RNNCellBase(Module):
    def __init__(self, input_size, hidden_size, bias, num_chunks=1, device=None, dtype=None):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        # article의 W_xh — shape [hidden_size, input_size]
        self.weight_ih = Parameter(torch.empty((num_chunks * hidden_size, input_size)))
        # article의 W_hh — shape [hidden_size, hidden_size]
        self.weight_hh = Parameter(torch.empty((num_chunks * hidden_size, hidden_size)))
        if bias:
            # article의 b_h를 bias_ih·bias_hh 두 벡터로 나눠 저장(합치면 b_h와 동일)
            self.bias_ih = Parameter(torch.empty(num_chunks * hidden_size))
            self.bias_hh = Parameter(torch.empty(num_chunks * hidden_size))


class RNNCell(RNNCellBase):
    r"""An Elman RNN cell with tanh or ReLU non-linearity.

    .. math::
        h' = \tanh(W_{ih} x + b_{ih} + W_{hh} h + b_{hh})

    article의 a_t=W_xh x_t+W_hh h_{t-1}+b_h, h_t=tanh(a_t)과 변수 이름만 다를 뿐
    정확히 같은 식입니다(W_ih=W_xh, b_ih+b_hh=b_h).
    """

    def forward(self, input, hx=None):
        if hx is None:
            hx = torch.zeros(input.size(0), self.hidden_size, dtype=input.dtype, device=input.device)

        if self.nonlinearity == "tanh":
            # article의 h_t=tanh(a_t) 전체를 계산하는 native(C++) 함수 —
            # 이 함수 내부에서 a_t=W_ih·x+b_ih+W_hh·h+b_hh를 만든 뒤 tanh를 적용
            ret = _VF.rnn_tanh_cell(
                input, hx, self.weight_ih, self.weight_hh, self.bias_ih, self.bias_hh,
            )
        elif self.nonlinearity == "relu":
            ret = _VF.rnn_relu_cell(
                input, hx, self.weight_ih, self.weight_hh, self.bias_ih, self.bias_hh,
            )
        return ret
