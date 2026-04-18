export const STEPS = [
  {
    label: 'Overflow 문제 — exp(1000) = ∞',
    body: 'float32의 최대 exp 입력: ~88.7 (exp(88.7) ≈ 3.4e38 ≈ FLT_MAX)\nexp(89) → inf, exp(1000) → inf → softmax = inf/inf = NaN\n구체 예: x=[2.0, 88, 100, 1000]\nexp(x)=[7.39, 2.35e38, 2.69e43(!!), inf]\n해결 원리: softmax의 translation invariance 성질을 이용\nmax(x)를 빼면 모든 exp 입력이 0 이하 → exp 결과 ≤ 1\n이 한 줄 트릭이 모든 딥러닝 프레임워크의 기본 구현.',
  },
  {
    label: 'Stable Softmax — 증명',
    body: 'Translation invariance 증명:\nsoftmax(xᵢ) = exp(xᵢ) / Σexp(xⱼ)\n= [exp(xᵢ−c)·exp(c)] / [Σexp(xⱼ−c)·exp(c)]\n= exp(xᵢ−c) / Σexp(xⱼ−c)\nexp(c)가 분자·분모에서 상쇄되므로 임의의 상수 c를 빼도 결과 동일.\nc = max(x) 선택 시: 가장 큰 원소 → exp(0)=1, 나머지 → exp(음수) ≤ 1\n예: x=[1000, 999, 998] → x−max=[0,−1,−2] → exp=[1.0, 0.37, 0.14]\n구현: stable_softmax(x) = exp(x−x.max()) / Σexp(x−x.max())',
  },
  {
    label: 'LogSoftmax — 수치 안정의 핵심',
    body: 'log_softmax(x) = x − logsumexp(x)\nlogsumexp(x) = x_max + log(Σexp(xᵢ − x_max))\n— max를 먼저 빼서 exp overflow 방지, log를 나중에 합산.\nCross-entropy = −Σyᵢ·log(softmax(xᵢ)) = −Σyᵢ·log_softmax(xᵢ)\nlog(softmax)을 직접 계산 → 중간에 softmax(0에 가까운 값)를 거치지 않음.\n3가지 이점: ① log(0) 회피 (수치 안정) ② CE와 직접 결합 (연산 절약)\n③ gradient가 ŷ−y 형태 유지 (안정적 역전파).',
  },
  {
    label: 'PyTorch 실전 패턴',
    body: '방법 1 (분리): log_probs = F.log_softmax(logits, dim=-1)\nloss = F.nll_loss(log_probs, targets)\n— 중간값(log_probs) 접근 가능, 디버깅에 유용.\n방법 2 (결합, 권장): loss = F.cross_entropy(logits, targets)\n— 내부에서 log_softmax + nll_loss 자동 결합, 수치 안정 보장.\n두 방법은 수학적으로 동일하지만 결합 시 수치적으로 더 안정.\n실전 규칙: loss = F.cross_entropy(logits, targets) 이것만 쓰면 됨.',
  },
  {
    label: 'Softmax 변형들 — 문제별 특화',
    body: 'Sparsemax: 출력에 정확히 0을 허용 → 해석 가능한 attention (Martins 2016)\nGumbel-Softmax: 이산 샘플링을 미분 가능하게 근사 → VAE, RL에서 사용\nMixture of Softmaxes(MoS): K개 softmax의 가중 혼합 → 언어 모델 perplexity 개선\nHierarchical: 트리 구조 → O(V) → O(log V) 계산 → 대규모 어휘(100K+)\nScaled: softmax(QKᵀ/√d) — √d로 나눠 dot product 분산 제어 (Transformer 핵심)\n각 변형은 표준 softmax의 특정 한계를 보완하며 도메인별 표준으로 정착.',
  },
];

export const C = {
  danger: '#ef4444',
  safe: '#10b981',
  math: '#3b82f6',
  code: '#8b5cf6',
  variant: '#f59e0b',
  dim: '#94a3b8',
};
