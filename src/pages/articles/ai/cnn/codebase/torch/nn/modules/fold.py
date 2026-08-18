# torch/nn/modules/fold.py — nn.Unfold 공식 문서(docstring)에 실린
# "Convolution is equivalent with Unfold + Matrix Multiplication + Fold"
# 예제 (PyTorch v2.13.0). im2col 방식으로 convolution을 patch 추출→행렬곱→
# 재배치 세 단계로 풀어 쓴, PyTorch가 공식적으로 검증까지 실어 둔 참조 예제입니다.
# F.conv2d 자체는 최적화된 native kernel로 실행되지만 이 예제와 같은 결과를 냅니다.
# 본문 대응: Y_{o,p,q}=b_o+Σ_{c,u,v} W_{o,c,u,v}X_{c,p+u,q+v}

# each patch contains 30 values (2x3=6 vectors, each of 5 channels)
# 4 blocks (2x3 kernels) in total in the 3x4 input
unfold = torch.nn.Unfold(kernel_size=(2, 3))
input = torch.randn(2, 5, 3, 4)
output = unfold(input)  # article의 X_{c,p+u,q+v} — 매 output 위치의 local patch를 미리 다 뽑아 둠

# Convolution is equivalent with Unfold + Matrix Multiplication + Fold (or view to output shape)
inp = torch.randn(1, 3, 10, 12)   # article의 X — [batch, C_in, H, W]
w = torch.randn(2, 3, 4, 5)       # article의 W — [C_out, C_in, K_h, K_w]

# 1) 모든 local window를 [batch, C_in*K_h*K_w, num_windows]로 펼침
#    (article의 P_{cuv}=X_{c,p+u,q+v}를 한 번에 모아 둔 것)
inp_unf = torch.nn.functional.unfold(inp, (4, 5))

# 2) kernel을 [C_out, C_in*K_h*K_w]로 펴서 행렬곱 — 채널·offset을 곱해 더하는
#    article의 M_{ocuv}=W_{ocuv}P_{cuv}, Y_{opq}=Σ M을 행렬곱 하나로 계산
out_unf = inp_unf.transpose(1, 2).matmul(w.view(w.size(0), -1).t()).transpose(1, 2)

# 3) 다시 [batch, C_out, H_out, W_out] spatial grid로 되돌림
out = torch.nn.functional.fold(out_unf, (7, 8), (1, 1))
# or equivalently (and avoiding a copy),
# out = out_unf.view(1, 2, 7, 8)

# 공식 문서가 F.conv2d의 native kernel과 이 세 단계가 수치적으로 같음을 직접 검증
(torch.nn.functional.conv2d(inp, w) - out).abs().max()
# tensor(1.9073e-06)  <- 부동소수점 오차 수준의 차이만 남음
