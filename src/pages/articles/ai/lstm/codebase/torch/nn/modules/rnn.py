# torch/nn/modules/rnn.py — LSTMCell (PyTorch v2.13.0). 실제 4-gate
# elementwise 연산은 `_VF.lstm_cell`이라는 native(C++) 함수 하나로
# 실행되지만, 그 함수가 정확히 무엇을 계산하는지는 class의 공식 docstring이
# 네 gate 식으로 명시하고, weight shape가 num_chunks=4로 네 gate를 하나의
# packed 행렬에 담는다는 걸 보여줍니다.
# 본문 대응: Gates의 u_t=[x_t;h_{t-1}], a_t=Wu_t+b, f_t/i_t/g_t/o_t와
# Overview의 C_t=f_t⊙C_{t-1}+i_t⊙g_t, h_t=o_t⊙tanh(C_t).

class LSTMCell(RNNCellBase):
    r"""A long short-term memory (LSTM) cell.

    .. math::

        \begin{array}{ll}
        i = \sigma(W_{ii} x + b_{ii} + W_{hi} h + b_{hi}) \\
        f = \sigma(W_{if} x + b_{if} + W_{hf} h + b_{hf}) \\
        g = \tanh(W_{ig} x + b_{ig} + W_{hg} h + b_{hg}) \\
        o = \sigma(W_{io} x + b_{io} + W_{ho} h + b_{ho}) \\
        c' = f \odot c + i \odot g \\
        h' = o \odot \tanh(c') \\
        \end{array}

    Attributes:
        weight_ih: the learnable input-hidden weights, of shape
            `(4*hidden_size, input_size)`
        weight_hh: the learnable hidden-hidden weights, of shape
            `(4*hidden_size, hidden_size)`
    """

    def __init__(self, input_size, hidden_size, bias=True, device=None, dtype=None):
        # article의 f_t,i_t,g_t,o_t 네 gate를 하나의 packed weight로 담음
        # (Gates의 a_t=[a_f;a_i;a_g;a_o]가 실제로 이렇게 저장되어 있다는 증거)
        super().__init__(input_size, hidden_size, bias, num_chunks=4)

    def forward(self, input, hx=None):
        if hx is None:
            zeros = torch.zeros(input.size(0), self.hidden_size, dtype=input.dtype, device=input.device)
            hx = (zeros, zeros)  # article의 (h_{t-1}, C_{t-1})

        # article의 i_t,f_t,g_t,o_t 계산 → C_t=f_t⊙C_{t-1}+i_t⊙g_t → h_t=o_t⊙tanh(C_t)
        # 전체를 하나의 native(C++) 함수로 실행
        ret = _VF.lstm_cell(input, hx, self.weight_ih, self.weight_hh, self.bias_ih, self.bias_hh)
        return ret  # (h_t, C_t)
