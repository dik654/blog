# docs/source/notes/extending.md — "Extending torch.autograd" 문서의
# LinearFunction 예제 (PyTorch v2.13.0). torch.nn.Linear는 실제로 native
# 연산으로 최적화돼 있지만, 이 문서 예제는 forward·backward를 손으로 직접
# 작성하는 표준 방법을 보여주기 위해 PyTorch가 공식적으로 유지하는
# 참조 구현입니다 — VJP를 autograd engine 뒤에 숨기지 않고 그대로 드러냅니다.
# 본문 대응: ForwardPass의 Z=XW+1b^⊤, ChainRule의 x̄=ȳ·J_f(x).

class LinearFunction(Function):
    @staticmethod
    def forward(input, weight, bias):
        # article의 Z=XW+1b^⊤ (여기서는 weight가 [out,in] 관례라 W^⊤를 곱함)
        output = input.mm(weight.t())
        if bias is not None:
            output += bias.unsqueeze(0).expand_as(output)
        return output

    @staticmethod
    def setup_context(ctx, inputs, output):
        # Backward에서 쓸 forward 시점 값을 저장 — article의 "forward가
        # backward에 필요한 값을 남겨야 한다"는 질문에 대한 실제 답
        input, weight, bias = inputs
        ctx.save_for_backward(input, weight, bias)

    @staticmethod
    def backward(ctx, grad_output):
        # grad_output이 article의 ȳ=∂L/∂y
        input, weight, bias = ctx.saved_tensors
        grad_input = grad_weight = grad_bias = None

        if ctx.needs_input_grad[0]:
            # article의 x̄=ȳ·J_f(x) — 이 linear function에서 input에 대한
            # Jacobian은 weight 자체이므로, VJP는 grad_output과 weight의
            # 행렬곱 하나로 끝남 (Jacobian 전체를 만들지 않음)
            grad_input = grad_output.mm(weight)
        if ctx.needs_input_grad[1]:
            # 같은 grad_output(ȳ)이 weight 방향으로는 다른 VJP를 만듦 —
            # 하나의 forward가 여러 input으로 fan-out되면 각자 별도의
            # local Jacobian과 곱해짐
            grad_weight = grad_output.t().mm(input)
        if bias is not None and ctx.needs_input_grad[2]:
            grad_bias = grad_output.sum(0)

        return grad_input, grad_weight, grad_bias
