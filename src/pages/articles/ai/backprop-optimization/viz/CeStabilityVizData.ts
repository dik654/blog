export const STEPS = [
  {
    label: 'Naive 구현의 문제 — overflow + log(0)',
    body: 'naive_softmax: exp_x = np.exp(x); return exp_x / exp_x.sum()\nnaive_ce: probs = naive_softmax(x); return -np.log(probs[t])\n3가지 실패 시나리오:\n① exp(1000) = inf → softmax = inf/inf = NaN (overflow)\n② exp(-1000) = 0 → softmax의 한 원소가 정확히 0 (underflow)\n③ log(0) = -inf → loss가 -inf → gradient에 NaN 전파\nfloat32 한계: exp 입력 ~88.7 이상에서 overflow 발생.\n이 세 문제를 모두 해결하려면 수학적 트릭이 필요.',
  },
  {
    label: 'Stable Softmax — max 빼기',
    body: 'x − max(x)로 모든 exp 입력을 0 이하로 변환:\nBefore: x=[1000, 999, 998] → exp=[inf, inf, inf] → NaN\nAfter: x−max=[0, −1, −2] → exp=[1.0, 0.37, 0.14] → 정상\n코드: stable_softmax(x):\n  x_max = x.max()\n  return exp(x − x_max) / Σexp(x − x_max)\n핵심 원리: 가장 큰 값 → exp(0)=1 (항상 안전)\n나머지 → exp(음수) ≤ 1 (절대 overflow 불가)\nsoftmax의 translation invariance 성질이 이를 보장.',
  },
  {
    label: 'Stable Cross-Entropy — LogSumExp',
    body: 'log(softmax(x))를 직접 계산하면 log(0) 위험.\nlog 공간에서 직접 계산: log_softmax(x) = x − logsumexp(x)\nlogsumexp(x) = x_max + log(Σexp(xᵢ − x_max))\n계산 흐름: logits → x_max → Σexp(x−x_max) → log → log_probs → −log_p[t]\n중간에 softmax(확률)를 명시적으로 거치지 않으므로\nsoftmax 출력이 0인 경우에도 log_softmax는 유한값 유지.\nstable_cross_entropy: log_probs = x − logsumexp(x); return −log_probs[t]',
  },
  {
    label: 'Weighted CE — 클래스 불균형 해결',
    body: 'Weighted CE: L = −Σᵢ wᵢ · yᵢ · log(ŷᵢ)\n가중치 wᵢ = total / (n_classes × countᵢ) — inverse frequency 방식.\n의료영상 예 (1000개): 정상 950개, 병변 50개\nw(정상) = 1000/(2×950) = 0.53, w(병변) = 1000/(2×50) = 10.0\n효과: 병변 하나의 오분류가 정상 19개 오분류와 동일한 loss.\n문제: 불균형 없이 학습하면 "전부 정상" 예측만으로 accuracy 95%\n→ 병변을 절대 못 찾음. 가중치가 이 편향을 교정.\nPyTorch: nn.CrossEntropyLoss(weight=torch.tensor([0.53, 10.0]))',
  },
  {
    label: 'Focal Loss — 어려운 샘플 집중',
    body: 'Focal Loss (Lin et al., RetinaNet 2017):\nFL(pₜ) = −α(1 − pₜ)^γ · log(pₜ)\npₜ = 모델이 정답 클래스에 부여한 확률.\n(1−pₜ)^γ = modulating factor: 쉬운 샘플의 loss를 down-weight.\nγ=2일 때 구체 값:\npₜ=0.9(쉬움): (1−0.9)²=0.01 → loss 거의 무시\npₜ=0.5(중간): (1−0.5)²=0.25 → 25%만 반영\npₜ=0.1(어려움): (1−0.1)²=0.81 → 대부분 반영\nα는 클래스별 가중치(보통 0.25). γ=0이면 표준 CE와 동일.\n효과: 쉬운 배경 샘플 수천 개의 누적 loss가 어려운 전경 샘플 loss를 압도하지 못함.',
  },
];

export const C = {
  danger: '#ef4444',
  safe: '#10b981',
  math: '#3b82f6',
  code: '#8b5cf6',
  weight: '#f59e0b',
  dim: '#94a3b8',
};
