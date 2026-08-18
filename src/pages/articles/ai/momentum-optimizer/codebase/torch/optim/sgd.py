# torch/optim/sgd.py — _single_tensor_sgd의 momentum·nesterov 경로
# (PyTorch v2.13.0). weight_decay·lr이 Tensor인 분기(differentiable 지원용)는
# 생략했습니다. Adam처럼 이 핵심 연산도 native 함수 하나가 아니라 순수
# PyTorch tensor 연산으로 작성돼 있습니다.
# 본문 대응: v_t=β v_{t-1}+g_t, θ_{t+1}=θ_t-η v_t, 그리고 "구현마다
# look-ahead 적용 순서가 다르다"고 article이 이미 hedge한 Nesterov 부분.

def _single_tensor_sgd(params, grads, momentum_buffer_list, *,
                        weight_decay, momentum, lr, dampening, nesterov):
    for i, param in enumerate(params):
        grad = grads[i]

        if momentum != 0:
            buf = momentum_buffer_list[i]

            if buf is None:
                buf = grad.detach().clone()
                momentum_buffer_list[i] = buf
            else:
                # article의 v_t=β v_{t-1}+g_t (dampening=0이 기본값일 때)
                buf.mul_(momentum).add_(grad, alpha=1 - dampening)

            if nesterov:
                # article이 소개한 "classic" Nesterov는 θ_{t-1}-β v_{t-1}
                # 지점에서 gradient를 다시 계산하지만, 실제 PyTorch는 그 대신
                # 방금 만든 새 buf(v_t)를 momentum 배율만큼 현재 gradient에
                # 더하는 형태(Sutskever formulation)를 씁니다 — look-ahead
                # 지점에서 gradient를 다시 구하지 않고도 같은 효과를 냅니다.
                grad = grad.add(buf, alpha=momentum)
            else:
                # article의 θ_{t+1}=θ_t-η v_t에 쓸 v_t
                grad = buf

        # article의 θ_{t+1}=θ_t-η v_t (nesterov=False일 때 grad==buf==v_t)
        param.add_(grad, alpha=-lr)
