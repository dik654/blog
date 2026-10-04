import type { Article } from "../types";
import { dlNlpArticles } from "./articlesDL2";
import { dlFoundation2Articles, dlVisionArticles } from "./articlesDL3";

// ── Foundations (읽기 순서: 공통 수학 → 퍼셉트론 → 신경망 → 활성화 → 역전파 → 옵티마이저 → 목적함수) ──
export const dlFoundationArticles: Article[] = [
  {
    slug: "deep-learning-overview",
    title: "딥러닝의 출발점: 표현을 층으로 쌓는 이유",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 입력을 다른 숫자로 바꾸면 풀 수 있는 문제가 생깁니다"
  },
  {
    "id": "black-box",
    "title": "2. 관측한 값과 답 사이에 바꿔 적는 단계를 둡니다"
  },
  {
    "id": "case",
    "title": "3. 네 입력을 같은 계산 규칙으로 처리해 봅니다"
  },
  {
    "id": "shape",
    "title": "4. 음수를 지우는 동작이 입력 사이의 관계를 바꿉니다"
  },
  {
    "id": "why-parts",
    "title": "5. 중간 단계 없이 한 번에 더하기만 하면 왜 실패할까요"
  },
  {
    "id": "names",
    "title": "6. 바꿔 적은 숫자와 그것을 만드는 과정에 이름을 붙입니다"
  },
  {
    "id": "trace",
    "title": "7. (1, 1)이 중간 표현을 거쳐 0이 되는 경로를 따라갑니다"
  },
  {
    "id": "source-xor",
    "title": "8. 교과서의 식에 같은 입력을 직접 넣습니다"
  },
  {
    "id": "depth",
    "title": "9. 여러 층의 합성과 선형 계산의 한계를 식으로 확인합니다"
  },
  {
    "id": "boundaries",
    "title": "10. 표현할 수 있음과 배울 수 있음은 다른 확인입니다"
  }
],
    component: () => import("@/pages/articles/ai/deep-learning-overview"),
  },
  {
    slug: "supervised-learning-loop",
    title: "지도학습 한 바퀴: example에서 parameter update까지",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 정답과의 차이로 계산에 쓰는 숫자를 고칩니다"
  },
  {
    "id": "black-box",
    "title": "2. 답 만들기와 숫자 고치기를 다른 단계로 봅니다"
  },
  {
    "id": "case",
    "title": "3. 두 오차를 제곱한 뒤 같은 기준으로 평균합니다"
  },
  {
    "id": "parts",
    "title": "4. 채점 상자 안에는 두 비교와 하나의 합산이 있습니다"
  },
  {
    "id": "why-parts",
    "title": "5. 정답은 채점에 쓰고, 다음 답을 만들 때는 숨깁니다"
  },
  {
    "id": "names",
    "title": "6. 한 바퀴의 역할을 실제 용어에 대응합니다"
  },
  {
    "id": "tensor-batch",
    "title": "7. 여러 문제를 묶되 각 축의 뜻을 보존합니다"
  },
  {
    "id": "training-step",
    "title": "8. 1에서 시작한 공통 숫자가 1.25가 되는 한 바퀴"
  },
  {
    "id": "source-update",
    "title": "9. 원문의 평균 기울기와 갱신 식에 대입합니다"
  },
  {
    "id": "inference",
    "title": "10. 학습을 멈춘 뒤에는 같은 숫자로 새 답만 계산합니다"
  },
  {
    "id": "limits",
    "title": "11. 손실 감소가 보장하는 범위를 확인합니다"
  }
],
    component: () => import("@/pages/articles/ai/supervised-learning-loop"),
  },
  {
    slug: "train-validation-test",
    title: "Train·validation·test: 데이터 역할을 섞지 않는 법",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 연습에 쓴 문제로 마지막 성적까지 매기면 무엇이 빠질까요"
  },
  {
    "id": "black-box",
    "title": "2. 배우기, 고르기, 보고하기의 순서를 고정합니다"
  },
  {
    "id": "case",
    "title": "3. 연습 성적이 좋은 후보와 새 자료 성적이 좋은 후보가 다릅니다"
  },
  {
    "id": "parts",
    "title": "4. 자료 묶음마다 나갈 수 있는 정보가 다릅니다"
  },
  {
    "id": "why-holdout",
    "title": "5. 선택에 쓰인 점수에는 선택한 흔적이 남습니다"
  },
  {
    "id": "names",
    "title": "6. 세 자료의 표준 이름은 역할을 나타냅니다"
  },
  {
    "id": "selection-feedback",
    "title": "7. B를 선택한 뒤 마지막 200명에서 44번 틀렸습니다"
  },
  {
    "id": "source-choice",
    "title": "8. 공식 문서의 ‘모델 선택에 쓰지 않는다’를 사례에 적용합니다"
  },
  {
    "id": "source-preprocessing",
    "title": "9. 입력의 평균을 구할 때도 같은 경계를 유지합니다"
  },
  {
    "id": "generalization",
    "title": "10. 점수 차이는 진단의 출발점이고 원인의 증명은 아닙니다"
  }
],
    component: () => import("@/pages/articles/ai/train-validation-test"),
  },
  {
    slug: "math-vectors-inner-products",
    title: "벡터·내적·norm: AI 수식을 읽는 최소 선형대수",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "좌표를 하나의 대상으로 묶기" },
      { id: "vectors", title: "Scalar와 vector" },
      { id: "norm", title: "Norm과 거리" },
      { id: "dot-product", title: "Dot product와 방향" },
      { id: "projection", title: "Projection으로 성분 읽기" },
      { id: "cauchy-schwarz", title: "Cauchy–Schwarz 부등식" },
      { id: "applications", title: "퍼셉트론·attention으로 연결" },
    ],
    component: () => import("@/pages/articles/ai/math-vectors-inner-products"),
  },
  {
    slug: "math-matrices-svd",
    title: "행렬·선형변환·SVD: embedding 압축을 읽는 최소 선형대수",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "행렬을 숫자 표 이상으로 읽기" },
      { id: "matrix-map", title: "행렬과 linear map" },
      { id: "multiplication", title: "행렬 곱과 함수 합성" },
      { id: "rank-basis", title: "Rank와 orthonormal basis" },
      { id: "svd", title: "SVD의 세 단계" },
      { id: "low-rank", title: "Low-rank approximation" },
      { id: "applications", title: "Embedding·PCA로 연결" },
    ],
    component: () => import("@/pages/articles/ai/math-matrices-svd"),
  },
  {
    slug: "math-high-dimensional-geometry",
    title: "고차원에서는 거리가 무너지고 그 틈을 JL 사영과 latent 표현이 메운다",
    subcategory: "ai-foundations",
    sections: [
      { id: "problem", title: "거리 하나로 가까움을 구분하기 어려워지는 이유" },
      { id: "distance", title: "Euclidean distance와 고차원 거리 집중" },
      { id: "jl-lemma", title: "Johnson–Lindenstrauss lemma" },
      { id: "intrinsic-dimension", title: "Ambient dimension과 intrinsic dimension" },
      { id: "latent-representation", title: "Low-rank·latent·bottleneck representation" },
      { id: "applications", title: "Autoencoder·분포 의미론·vector search로 연결" },
    ],
    component: () => import("@/pages/articles/ai/math-high-dimensional-geometry"),
  },
  {
    slug: "math-numerical-precision-stability",
    title: "부동소수점은 유효숫자를 잘라 저장하고 그 오차가 계산 순서에 따라 증폭되거나 사라진다",
    subcategory: "ai-foundations",
    sections: [
      { id: "problem", title: "유한 bit 저장이 남기는 오차" },
      { id: "precision", title: "FP32·FP16·BF16의 유효숫자" },
      { id: "stability", title: "계산 순서와 오차 증폭" },
      { id: "shape", title: "Tensor shape와 broadcasting" },
      { id: "applications", title: "Quantization·AMP·행렬로 연결" },
    ],
    component: () => import("@/pages/articles/ai/math-numerical-precision-stability"),
  },
  {
    slug: "math-complex-numbers-oscillations",
    title: "복소수·회전·Euler 공식: Fourier 수식을 읽는 최소 수학",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "복소수가 회전을 기록하는 이유" },
      { id: "radians", title: "Radian과 한 바퀴" },
      { id: "unit-circle", title: "Sine·cosine과 단위원" },
      { id: "complex-plane", title: "복소수와 복소평면" },
      { id: "euler-formula", title: "Euler 공식과 회전 곱셈" },
      { id: "roots-of-unity", title: "Roots of unity" },
      { id: "applications", title: "DFT·FFT로 연결" },
    ],
    component: () =>
      import("@/pages/articles/ai/math-complex-numbers-oscillations"),
  },
  {
    slug: "text-unicode-encoding",
    title: "문자·Unicode·UTF-8: tokenizer를 읽는 최소 텍스트 기초",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "화면의 한 글자와 저장 단위 구분" },
      { id: "bits-bytes", title: "Bit와 byte" },
      { id: "code-points", title: "Code point와 grapheme cluster" },
      { id: "utf-8", title: "UTF-8 encoding" },
      { id: "normalization", title: "Unicode normalization" },
      { id: "offsets", title: "Offset 좌표와 round-trip" },
      { id: "applications", title: "Tokenizer로 연결" },
    ],
    component: () => import("@/pages/articles/ai/text-unicode-encoding"),
  },
  {
    slug: "math-functions-composition",
    title: "함수와 합성: input→output 규칙을 읽는 법",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Input과 output" },
      { id: "shape", title: "Domain과 codomain" },
      { id: "composition", title: "함수 합성의 실행 순서" },
      { id: "boundaries", title: "순서·shape·domain 경계" },
    ],
    component: () => import("@/pages/articles/ai/math-functions-composition"),
  },
  {
    slug: "math-functions-derivatives-gradients",
    title: "Derivative와 chain rule: local rate를 연결하는 법",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Difference quotient와 limit" },
      { id: "derivative", title: "Derivative의 세 연산" },
      { id: "local-linearity", title: "Local linear approximation" },
      { id: "chain-rule", title: "연결된 rate를 곱하는 이유" },
      { id: "nonsmooth", title: "Subgradient와 구현 경계" },
    ],
    component: () =>
      import("@/pages/articles/ai/math-functions-derivatives-gradients"),
  },
  {
    slug: "math-gradients-jacobians",
    title: "Gradient와 Jacobian: 여러 입력의 민감도를 묶는 법",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "손잡이 하나씩 움직이기" },
      { id: "gradient-direction", title: "Gradient와 방향 변화율" },
      { id: "jacobian", title: "Jacobian과 JVP" },
      { id: "boundaries", title: "Gradient·JVP·VJP 경계" },
    ],
    component: () => import("@/pages/articles/ai/math-gradients-jacobians"),
  },
  {
    slug: "math-differential-equations-numerical-solvers",
    title: "미분방정식·수치적분: diffusion의 ODE·SDE를 읽는 최소 수학",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "변화 법칙에서 경로 만들기" },
      { id: "initial-value", title: "초기값 문제와 vector field" },
      { id: "euler-method", title: "Euler method와 오차" },
      { id: "stability", title: "Step size와 수치 안정성" },
      { id: "heun-runge-kutta", title: "Heun·Runge–Kutta" },
      { id: "ode-sde-boundary", title: "ODE와 SDE의 경계" },
      { id: "applications", title: "Diffusion·Neural ODE로 연결" },
    ],
    component: () =>
      import("@/pages/articles/ai/math-differential-equations-numerical-solvers"),
  },
  {
    slug: "math-exponents-logarithms",
    title: "지수·로그: 확률과 정보량을 읽는 최소 수학",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "곱셈을 덧셈으로 옮기기" },
      { id: "exponents", title: "지수와 반복 배율" },
      { id: "logarithms", title: "로그는 지수의 역질문" },
      { id: "log-identities", title: "곱·나눗셈의 log 규칙" },
      { id: "log-bases", title: "밑과 단위" },
      { id: "applications", title: "정보량과 loss로 연결" },
    ],
    component: () => import("@/pages/articles/ai/math-exponents-logarithms"),
  },
  {
    slug: "math-probability-expectation-variance",
    title:
      "Probability experiment와 conditional probability: 경우를 먼저 세는 법",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "실험·sample space·outcome" },
      { id: "outcomes", title: "Distribution과 event" },
      { id: "conditional-probability", title: "조건 뒤에 다시 정규화" },
      { id: "chain-rule", title: "Joint probability를 곱으로 분해" },
      { id: "independence-boundary", title: "독립과 상호배타 경계" },
    ],
    component: () =>
      import("@/pages/articles/ai/math-probability-expectation-variance"),
  },
  {
    slug: "math-random-variables-expectation",
    title: "Random variable과 expectation: outcome을 숫자로 요약하는 법",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Outcome에서 숫자로" },
      { id: "mapping", title: "Random variable의 함수 형태" },
      { id: "distribution", title: "값별 probability mass" },
      { id: "expectation", title: "가중 무게중심" },
      { id: "transform-boundary", title: "선형성과 비선형 경계" },
    ],
    component: () =>
      import("@/pages/articles/ai/math-random-variables-expectation"),
  },
  {
    slug: "math-variance-sampling",
    title: "Variance·sample mean·mini-batch: 흔들림을 추정하는 법",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "중심과 흔들림 분리" },
      { id: "variance", title: "Variance와 standard deviation" },
      { id: "sample-estimation", title: "Sample mean·sample variance" },
      { id: "law-of-large-numbers", title: "큰 수의 법칙과 1/B" },
      { id: "gradient-estimator", title: "Mini-batch gradient" },
      { id: "boundaries", title: "상관·편향·heavy-tail 경계" },
    ],
    component: () => import("@/pages/articles/ai/math-variance-sampling"),
  },
  {
    slug: "math-optimization-objectives",
    title: "Optimization objective와 feasible set: 문제를 먼저 정의하는 법",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "선택·점수·허용 범위" },
      { id: "feasible-set", title: "Constraint와 feasible set" },
      { id: "minimizer", title: "Argmin과 minimum value" },
      { id: "boundaries", title: "Constrained 문제 경계" },
    ],
    component: () => import("@/pages/articles/ai/math-optimization-objectives"),
  },
  {
    slug: "math-optimization-convexity",
    title: "Convexity·smoothness: 보장을 가능하게 하는 함수 구조",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "함수 지형의 네 조건" },
      { id: "convexity", title: "Chord inequality" },
      { id: "smoothness", title: "L-smoothness와 descent lemma" },
      { id: "curvature-range", title: "Strong convexity와 condition number" },
    ],
    component: () => import("@/pages/articles/ai/math-optimization-convexity"),
  },
  {
    slug: "math-gradient-descent-convergence",
    title: "Gradient descent와 convergence: 보폭·전제·실패 경계",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "반복 규칙과 보폭" },
      { id: "update", title: "Negative gradient update" },
      { id: "step-size", title: "수축·진동·발산" },
      { id: "convergence", title: "Convergence guarantee" },
      { id: "stopping-boundary", title: "Stationary와 stopping signal" },
    ],
    component: () =>
      import("@/pages/articles/ai/math-gradient-descent-convergence"),
  },
  {
    slug: "perceptron",
    title: "퍼셉트론: 신경망의 기원",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "선형 결정 경계에서 시작하기" },
      { id: "convergence", title: "수렴 정리의 전제와 margin" },
      { id: "logic-gates", title: "논리 회로 구현" },
      { id: "limitation", title: "퍼셉트론의 한계" },
      { id: "multilayer", title: "다층 퍼셉트론" },
    ],
    component: () => import("@/pages/articles/ai/perceptron"),
  },
  {
    slug: "neural-network",
    title: "신경망: 퍼셉트론에서 다층 네트워크로",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "함수 합성과 learned representation" },
      { id: "activation", title: "Affine collapse와 비선형성" },
      { id: "forward", title: "Tensor shape와 signal scale" },
      { id: "output-layer", title: "Target의 확률 계약" },
      { id: "mnist", title: "MNIST 실험과 일반화 진단" },
    ],
    component: () => import("@/pages/articles/ai/neural-network"),
  },
  {
    slug: "activation-functions",
    title: "활성화 함수 기초: Step · Sigmoid · Tanh",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "값과 local slope" },
      { id: "step-function", title: "계단 함수와 gradient" },
      { id: "sigmoid", title: "Sigmoid와 saturation" },
      { id: "tanh", title: "Tanh와 signed state" },
      { id: "comparison", title: "출력 의미와 경계" },
    ],
    component: () => import("@/pages/articles/ai/activation-functions"),
  },
  {
    slug: "rectifier-activations",
    title: "Rectifier 활성화: ReLU · Dying ReLU · SELU",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "0에서 꺾이는 선" },
      { id: "relu", title: "ReLU hinge" },
      { id: "dying-relu", title: "Dying state" },
      { id: "negative-slope", title: "Leaky ReLU · PReLU" },
      { id: "self-normalization", title: "SELU 조건" },
      { id: "comparison", title: "측정과 선택" },
    ],
    component: () => import("@/pages/articles/ai/rectifier-activations"),
  },
  {
    slug: "gated-activations",
    title: "Smooth·Gated 활성화: GELU · SiLU · SwiGLU",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "값과 통과 비율" },
      { id: "gelu-silu", title: "GELU · SiLU" },
      { id: "gated-ffn", title: "SwiGLU 구조" },
      { id: "parameter-budget", title: "공정한 parameter 예산" },
      { id: "comparison", title: "구조·kernel 비교" },
    ],
    component: () => import("@/pages/articles/ai/gated-activations"),
  },
  {
    slug: "reverse-mode-autodiff",
    title: "Reverse-mode autodiff: Graph · Tape · VJP",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Computational graph" },
      { id: "tape", title: "Saved tape" },
      { id: "reverse-mode", title: "VJP와 branch sum" },
      { id: "save-recompute", title: "Save·recompute 경계" },
    ],
    component: () => import("@/pages/articles/ai/reverse-mode-autodiff"),
  },
  {
    slug: "softmax",
    title: "Softmax: Logit에서 공동 확률까지",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 서로 다른 점수 두 개를 하나의 확률로 읽으려면"
  },
  {
    "id": "black-box",
    "title": "2. 양수로 바꾸고, 합을 구하고, 각자의 몫을 읽습니다"
  },
  {
    "id": "case",
    "title": "3. 점수가 0인 후보도 몫을 가집니다"
  },
  {
    "id": "parts",
    "title": "4. 한 후보의 계산 안에 다른 후보도 들어갑니다"
  },
  {
    "id": "why-exponential",
    "title": "5. 점수의 차이가 비율이 되도록 지수를 씁니다"
  },
  {
    "id": "names",
    "title": "6. Logit은 점수이고 softmax는 공동 몫을 만드는 계산입니다"
  },
  {
    "id": "trace",
    "title": "7. 같은 두 점수에서 큰 공통값을 빼도 답은 같습니다"
  },
  {
    "id": "source-normalization",
    "title": "8. 원문 식 (6.29)와 (6.33)에 같은 숫자를 대입합니다"
  },
  {
    "id": "temperature",
    "title": "9. 차이를 줄이면 같은 후보가 더 비슷한 몫을 가집니다"
  },
  {
    "id": "output-boundary",
    "title": "10. 합이 1이라는 조건과 실제 정답률은 다른 질문입니다"
  }
],
    component: () => import("@/pages/articles/ai/softmax"),
  },
  {
    slug: "backprop-optimization",
    title: "신경망 Backprop: Loss에서 Tensor Gradient까지",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "왜 역전파인가" },
      { id: "loss-function", title: "Scalar loss 만들기" },
      { id: "tensor-backward", title: "출력에서 weight까지" },
    ],
    component: () => import("@/pages/articles/ai/backprop-optimization"),
  },
  {
    slug: "training-memory-budget",
    title: "학습 메모리는 weight·gradient·optimizer state 합으로 커진다",
    subcategory: "ai-foundations",
    sections: [
      { id: "problem", title: "Parameter 크기만으로 메모리를 가늠할 수 없는 이유" },
      { id: "memory-math", title: "Model-state memory: 16byte/param" },
      { id: "checkpointing", title: "Activation checkpointing" },
      { id: "applications", title: "QLoRA·autodiff·AMP로 연결" },
    ],
    component: () => import("@/pages/articles/ai/training-memory-budget"),
  },
  {
    slug: "spiking-neural-networks",
    title: "SNN: LIF·Surrogate Gradient·저전력의 조건",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "SNN과 학습 알고리즘 구분" },
      { id: "lif-dynamics", title: "LIF membrane state와 spike" },
      { id: "surrogate-gradient", title: "Hard forward·surrogate backward" },
      { id: "bptt", title: "시간축 unroll과 BPTT" },
      { id: "brain-boundary", title: "뇌·Hebbian learning 비유 경계" },
      { id: "hardware", title: "Event-driven hardware와 PVT" },
    ],
    component: () => import("@/pages/articles/ai/spiking-neural-networks"),
  },
  {
    slug: "optimizers",
    title: "SGD와 Effective Batch: Gradient를 한 Update로",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Gradient와 update의 역할" },
      { id: "update-contract", title: "Update contract" },
      { id: "gradient-estimate", title: "Mini-batch estimate" },
      { id: "sgd-update", title: "SGD update" },
      { id: "effective-batch", title: "Gradient accumulation" },
      { id: "release-boundary", title: "Update receipt" },
    ],
    component: () => import("@/pages/articles/ai/optimizers"),
  },
  {
    slug: "momentum-optimizer",
    title: "Momentum: Gradient History를 Velocity로",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "왜 과거 방향을 기억하나" },
      { id: "ema", title: "Exponential moving average" },
      { id: "velocity", title: "Momentum velocity" },
      { id: "damping-boundary", title: "Overshoot와 검증 경계" },
    ],
    component: () => import("@/pages/articles/ai/momentum-optimizer"),
  },
  {
    slug: "adam-optimizer",
    title: "Adam: Raw Moments에서 Adaptive Step까지",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "두 optimizer state" },
      { id: "moments", title: "First·second raw moments" },
      { id: "bias-correction", title: "Initialization bias correction" },
      { id: "preconditioning", title: "Coordinate preconditioning" },
      { id: "release-boundary", title: "State와 convergence 경계" },
    ],
    component: () => import("@/pages/articles/ai/adam-optimizer"),
  },
  {
    slug: "cross-entropy",
    title: "크로스 엔트로피: 정보 이론에서 손실 함수로",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Surprisal에서 loss까지" },
      { id: "expectation", title: "기대값과 empirical risk" },
      { id: "entropy", title: "Entropy: 피할 수 없는 불확실성" },
      { id: "cross-entropy", title: "Cross-entropy와 likelihood" },
      { id: "kl-divergence", title: "KL: 모델의 추가 비용" },
      { id: "ce-vs-mse", title: "Likelihood로 loss 고르기" },
      { id: "softmax-ce-gradient", title: "Softmax–CE fused gradient" },
    ],
    component: () => import("@/pages/articles/ai/cross-entropy"),
  },
  {
    slug: "fft",
    title: "FFT (Fast Fourier Transform) — AI 관점",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "DFT와 FFT의 역할 분리" },
      { id: "fourier", title: "Sampling·window·spectrum" },
      { id: "algorithm", title: "Cooley–Tukey의 계산 재사용" },
      { id: "ai-usage", title: "AI 적용과 실제 선택 기준" },
    ],
    component: () => import("@/pages/articles/ai/fft"),
  },
  {
    slug: "word2vec",
    title: "Word2Vec 기초: Word ID에서 Context Pair까지",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "ID에서 trainable row로" },
      { id: "dual-tables", title: "Input·output table" },
      { id: "window", title: "Context window의 형태" },
      { id: "pairs", title: "Versioned pair receipt" },
    ],
    component: () => import("@/pages/articles/ai/word2vec"),
  },
  {
    slug: "word2vec-prediction-objectives",
    title: "Word2Vec Objectives: CBOW·Skip-gram·Hierarchical Softmax",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "예측 방향 먼저 고르기" },
      { id: "cbow", title: "Context에서 center로" },
      { id: "skipgram", title: "Center에서 context로" },
      { id: "hierarchical", title: "Vocabulary를 tree path로" },
    ],
    component: () =>
      import("@/pages/articles/ai/word2vec-prediction-objectives"),
  },
  {
    slug: "word2vec-negative-sampling",
    title: "Word2Vec Negative Sampling: Pair Discrimination과 Update",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Full softmax에서 sampled pair로" },
      { id: "sgns", title: "Positive·noise logistic loss" },
      { id: "noise", title: "Noise distribution과 k" },
      { id: "subsampling", title: "고빈도 token을 덜 보기" },
    ],
    component: () => import("@/pages/articles/ai/word2vec-negative-sampling"),
  },
  {
    slug: "subword-static-embeddings",
    title: "Subword Static Embeddings: fastText에서 Release까지",
    subcategory: "ai-foundations",
    sections: [
      { id: "overview", title: "Word row의 OOV 경계" },
      { id: "ngrams", title: "Character n-gram 합" },
      { id: "static-contextual", title: "Static과 contextual" },
      { id: "release", title: "Vocabulary·matrix artifact" },
    ],
    component: () => import("@/pages/articles/ai/subword-static-embeddings"),
  },
];

/** Combined DL articles: foundations + foundation2 + NLP + vision */
export const dlArticles: Article[] = [
  ...dlFoundationArticles,
  ...dlFoundation2Articles,
  ...dlNlpArticles,
  ...dlVisionArticles,
];
