# torch/nn/modules/conv.py — Conv2d class docstring의 Shape 명세
# (PyTorch v2.13.0). 실제 계산은 native kernel이 수행하지만, output shape
# 계약 자체는 이 공식 문서가 유일한 근거이며 article의 H_out 식과 LaTeX까지
# byte 단위로 동일합니다.
# 본문 대응: H_out = floor((H+2P-D(K-1)-1)/S + 1)

class Conv2d(_ConvNd):
    r"""
    - Input: :math:`(N, C_{in}, H_{in}, W_{in})` or :math:`(C_{in}, H_{in}, W_{in})`
    - Output: :math:`(N, C_{out}, H_{out}, W_{out})` or :math:`(C_{out}, H_{out}, W_{out})`, where

      .. math::
          H_{out} = \left\lfloor\frac{H_{in}  + 2 \times \text{padding}[0] - \text{dilation}[0]
                    \times (\text{kernel\_size}[0] - 1) - 1}{\text{stride}[0]} + 1\right\rfloor

      .. math::
          W_{out} = \left\lfloor\frac{W_{in}  + 2 \times \text{padding}[1] - \text{dilation}[1]
                    \times (\text{kernel\_size}[1] - 1) - 1}{\text{stride}[1]} + 1\right\rfloor
    """
