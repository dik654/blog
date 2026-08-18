# torch/optim/adam.py — _single_tensor_adam의 기본 경로 (PyTorch v2.13.0).
# amsgrad·capturable·differentiable·complex tensor 분기는 생략하고 가장
# 흔히 실행되는 기본 경로만 발췌했습니다. Adam은 RNN/LSTM과 달리 이 핵심
# 연산이 하나의 native 함수로 뭉쳐 있지 않고 실제로 순수 PyTorch tensor
# 연산으로 작성되어 있습니다.
# 본문 대응: m_t=β1 m_{t-1}+(1-β1)g_t, v_t=β2 v_{t-1}+(1-β2)g_t²,
# m̂_t, v̂_t bias correction, θ_{t+1}=θ_t-η·m̂_t/(√v̂_t+ε).

def _single_tensor_adam(params, grads, exp_avgs, exp_avg_sqs, state_steps,
                         *, beta1, beta2, lr, weight_decay, eps):
    for i, param in enumerate(params):
        grad = grads[i]
        exp_avg = exp_avgs[i]      # article의 m_{t-1}
        exp_avg_sq = exp_avg_sqs[i]  # article의 v_{t-1}
        step_t = state_steps[i]
        step_t += 1

        # article의 m_t=β1 m_{t-1}+(1-β1)g_t
        # lerp_(grad, 1-beta1)는 exp_avg = exp_avg*beta1 + grad*(1-beta1)과 같음
        exp_avg.lerp_(grad, 1 - beta1)

        # article의 v_t=β2 v_{t-1}+(1-β2)g_t²
        exp_avg_sq.mul_(beta2).addcmul_(grad, grad, value=1 - beta2)

        step = _get_value(step_t)
        bias_correction1 = 1 - beta1**step  # article의 (1-β1^t)
        bias_correction2 = 1 - beta2**step  # article의 (1-β2^t)

        # article처럼 m̂_t=m_t/(1-β1^t)를 별도로 만들지 않고, 그 보정을
        # learning rate 쪽으로 접어 넣은 실질적 step size로 계산
        # (η·m̂_t = η/(1-β1^t)·m_t = step_size·m_t와 수학적으로 동일)
        step_size = lr / bias_correction1

        bias_correction2_sqrt = bias_correction2**0.5
        # article의 q_t=√v̂_t+ε — √(v_t/bias_correction2)+ε = √v̂_t+ε
        denom = (exp_avg_sq.sqrt() / bias_correction2_sqrt).add_(eps)

        # article의 θ_{t+1}=θ_t-η·m̂_t/q_t
        # param += -step_size * (exp_avg/denom) = param - η·m̂_t/q_t
        param.addcdiv_(exp_avg, denom, value=-step_size)
