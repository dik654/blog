import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'ReLU 정의와 혁명 — max(0,x)가 딥러닝을 열다',
    body: '수식: f(x) = max(0, x). 도함수: f\'(x) = 1 (x>0), 0 (x<0), 미정의 (x=0).\n실제 구현에서 x=0일 때는 0 또는 1 중 하나를 선택 — 실무상 차이 없음.\n예: x=3.5 → f=3.5, f\'=1 | x=−2.1 → f=0, f\'=0 | x=0 → f=0.\n2012년 AlexNet(Krizhevsky) — sigmoid → ReLU 교체로 CIFAR-10 학습 6배 가속.\nImageNet error: 26.2%(2011 SIFT) → 16.4%(AlexNet) — 딥러닝 혁명의 기폭제.\n핵심 이유: 양수 구간에서 기울기=1 고정 → 층을 깊게 쌓아도 gradient가 줄지 않는다.',
  },
  {
    label: 'ReLU의 5가지 장점 — 단순함이 곧 강점',
    body: '① 연산 효율: max(0,x)는 비교 1회 → sigmoid의 exp 연산 대비 ~10배 빠름.\nGPU에서 수십억 뉴런을 처리할 때 이 차이가 학습 시간을 결정.\n② Vanishing gradient 해결: x>0에서 f\'=1 고정. 100층 쌓아도 gradient ∝ 1¹⁰⁰=1.\nsigmoid 100층: 0.25¹⁰⁰ ≈ 6×10⁻⁶¹ → 학습 불가. ReLU의 결정적 장점.\n③ Sparse activation: 무작위 입력 시 약 50% 뉴런이 0 출력.\nGlorot 외(2011) 실증 — sparsity가 더 의미 있는 feature 추출에 기여.\n④ 생물학적 유사성: 실제 뉴런도 임계값 이하 자극엔 미발화(0), 이상이면 비례 발화.\n⑤ 양수 비포화(non-saturating): x→∞여도 f(x)=x, f\'(x)=1 → 큰 값에서도 gradient 보존.',
  },
  {
    label: 'Dying ReLU — 음수 뉴런의 영구 사망',
    body: '5단계 죽음의 사이클: ① weight가 큰 음수로 업데이트됨 (lr이 클 때 발생).\n② 해당 뉴런의 z = Σwᵢxᵢ+b가 모든 입력에 대해 음수가 됨.\n③ ReLU(z) = max(0, z) = 0 → 출력 항상 0.\n④ ∂L/∂w = (∂L/∂f)·f\'(z)·x에서 f\'(z)=0 → gradient=0.\n⑤ gradient가 0이므로 weight 갱신 불가 → 영구 사망(irreversible).\nLu 외(2019): 학습률 0.01 + Xavier init 조합에서 전체 뉴런의 20~40% 사망 관찰.\n방지: He init(W~N(0,√(2/n))), LeakyReLU, 낮은 lr(0.001), BatchNorm, gradient clipping.',
  },
  {
    label: 'PyTorch 구현 & He 초기화',
    body: '함수형: y = F.relu(x) — forward pass에서 직접 호출. 간결하지만 state 없음.\n모듈형: self.relu = nn.ReLU(inplace=True) — nn.Sequential에 넣을 수 있음.\ninplace=True: 입력 텐서를 직접 수정 → 메모리 절약(별도 출력 텐서 불필요).\n단, autograd에서 입력을 다시 참조하면 오류 — residual 연결 전에는 사용 금지.\nHe 초기화(2015, He et al.): W ~ N(0, √(2/nᵢₙ)). nᵢₙ은 입력 차원 수.\n왜 2/nᵢₙ인가? ReLU가 음수 절반을 잘라내므로 분산이 1/2로 감소 → 2배 보상.\n예: nᵢₙ=512면 std=√(2/512)≈0.0625. Xavier(√(1/n))보다 √2배 큰 초기 분산.',
  },
];

export const COLORS = {
  relu: '#ef4444',
  advantage: '#10b981',
  dying: '#94a3b8',
  code: '#8b5cf6',
  dim: '#94a3b8',
};
