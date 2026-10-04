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
  {
    "id": "overview",
    "title": "1 · 여러 숫자로 적은 이동에서 길이와 방향을 따로 읽는다"
  },
  {
    "id": "black-box",
    "title": "2 · 좌표 두 개를 넣고 질문에 맞는 값을 받는다"
  },
  {
    "id": "case",
    "title": "3 · 3²+4²로 길이 5를 구하고 가로 이동 3을 떼어 낸다"
  },
  {
    "id": "picture",
    "title": "4 · 한 화살표에서 전체 길이와 가로 부분을 함께 본다"
  },
  {
    "id": "need",
    "title": "5 · 크기를 비교할지 방향을 비교할지 먼저 정한다"
  },
  {
    "id": "vectors",
    "title": "6 · 숫자 하나는 스칼라, 순서 있는 좌표 묶음은 벡터다"
  },
  {
    "id": "norm",
    "title": "7 · 노름은 전체 크기를, 차이의 노름은 두 점 사이 거리를 잰다"
  },
  {
    "id": "dot-product",
    "title": "8 · 내적에는 두 벡터의 길이와 방향이 함께 들어간다"
  },
  {
    "id": "projection",
    "title": "9 · 기준 길이를 보정해야 같은 방향에 같은 투영이 나온다"
  },
  {
    "id": "cauchy-schwarz",
    "title": "10 · 한 방향의 성분은 전체 길이를 넘지 못한다"
  },
  {
    "id": "source",
    "title": "11 · 실제 교재의 투영식과 PyTorch의 분모에 같은 숫자를 넣는다"
  },
  {
    "id": "applications",
    "title": "12 · 내적의 전진량과 전체 길이를 묶으면 학습 횟수도 제한할 수 있다"
  },
  {
    "id": "boundaries",
    "title": "13 · 크기와 방향, 의미는 다르다"
  }
],
    component: () => import("@/pages/articles/ai/math-vectors-inner-products"),
  },
  {
    slug: "math-matrices-svd",
    title: "행렬·선형변환·SVD: embedding 압축을 읽는 최소 선형대수",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 두 숫자를 섞는 계산에서 어떤 차이가 살아남을까"
  },
  {
    "id": "black-box",
    "title": "2 · 입력의 순서와 두 출력 규칙을 먼저 고정한다"
  },
  {
    "id": "case",
    "title": "3 · 함께 움직이는 부분과 서로 다른 부분을 나눈다"
  },
  {
    "id": "picture",
    "title": "4 · 나누고 늘리고 합치는 경로를 한 그림으로 본다"
  },
  {
    "id": "need",
    "title": "5 · 큰 표를 줄이려면 어떤 변화가 사라지는지 알아야 한다"
  },
  {
    "id": "names",
    "title": "6 · 방금 계산한 자리에 이름을 붙인다"
  },
  {
    "id": "matrix-map",
    "title": "7 · 한 행은 출력 한 칸의 계산을 맡는다"
  },
  {
    "id": "multiplication",
    "title": "8 · 두 규칙의 곱은 오른쪽부터 적용한다"
  },
  {
    "id": "rank-basis",
    "title": "9 · 표가 커도 출력이 움직이는 방향은 하나일 수 있다"
  },
  {
    "id": "svd",
    "title": "10 · 같은 입력을 기준 변경, 배율 적용, 출력 합성으로 추적한다"
  },
  {
    "id": "svd-shapes",
    "title": "11 · reduced는 모양을 줄이며 0인 특잇값도 남을 수 있다"
  },
  {
    "id": "low-rank",
    "title": "12 · 큰 방향 하나를 남기면 (9,9)가 되고 차이가 사라진다"
  },
  {
    "id": "source-paper",
    "title": "13 · MIT 원문 문제의 같은 행렬에 계산을 대입한다"
  },
  {
    "id": "source-code",
    "title": "14 · PyTorch의 실제 분기는 입력 모양과 bias를 확인한다"
  },
  {
    "id": "applications",
    "title": "15 · 표를 잘 복원해도 분류에 필요한 차이를 지울 수 있다"
  },
  {
    "id": "boundaries",
    "title": "16 · 크기, 독립 방향, 사용 목적을 각각 확인한다"
  }
],
    component: () => import("@/pages/articles/ai/math-matrices-svd"),
  },
  {
    slug: "math-high-dimensional-geometry",
    title: "고차원 데이터: 거리 보존, 내재 차원, 압축의 조건",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 숫자 칸을 줄여도 점 사이의 차이를 남길 수 있을까"
  },
  {
    "id": "black-box",
    "title": "2 · 점들을 받아 더 적은 칸으로 쓰고 거리를 비교한다"
  },
  {
    "id": "case",
    "title": "3 · 네 칸에 반복된 값을 합하고 2로 나눈다"
  },
  {
    "id": "picture",
    "title": "4 · 같은 네 점을 줄이는 좋은 규칙과 나쁜 규칙을 비교한다"
  },
  {
    "id": "problem",
    "title": "5 · 줄일 수 있는 양보다 남겨야 할 관계를 먼저 정한다"
  },
  {
    "id": "names",
    "title": "6 · 칸 수, 실제 자유도, 줄이는 규칙에 이름을 붙인다"
  },
  {
    "id": "distance",
    "title": "7 · 같은 직선에서는 모든 거리가 2배의 차이로 계산된다"
  },
  {
    "id": "concentration",
    "title": "8 · 독립적인 무작위 좌표에서는 제곱거리의 상대 요동이 줄어든다"
  },
  {
    "id": "jl-lemma",
    "title": "9 · 일반적인 거리 보존의 충분조건과 사례의 최소 크기를 구별한다"
  },
  {
    "id": "probability",
    "title": "10 · 존재 증명과 한 번 뽑아 성공할 확률을 나눈다"
  },
  {
    "id": "source",
    "title": "11 · 실제 코드에서 행렬 배율과 자동 크기 선택을 읽는다"
  },
  {
    "id": "intrinsic-dimension",
    "title": "12 · 실제로 변하는 자유도와 추정한 숫자의 범위를 구별한다"
  },
  {
    "id": "latent-representation",
    "title": "13 · 좁은 통로를 만들었다고 중요한 정보가 저절로 남지는 않는다"
  },
  {
    "id": "applications",
    "title": "14 · 거리를 보존했는지와 과제를 해결했는지를 따로 확인한다"
  }
],
    component: () => import("@/pages/articles/ai/math-high-dimensional-geometry"),
  },
  {
    slug: "math-numerical-precision-stability",
    title: "같은 덧셈이 다른 답을 만드는 이유: 부동소수점·안정성·축의 짝짓기",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "problem",
    "title": "1 · 분명히 두 번 더했는데 저장된 값은 그대로다"
  },
  {
    "id": "black-box",
    "title": "2 · 계산할 값과 저장할 자리를 따로 본다"
  },
  {
    "id": "case",
    "title": "3 · 작은 양 하나는 반 칸이고 두 개는 한 칸이다"
  },
  {
    "id": "picture",
    "title": "4 · 계산한 위치에서 저장할 자리로 이동한다"
  },
  {
    "id": "why",
    "title": "5 · 저장 공간을 아끼는 선택이 계산 경로에도 들어온다"
  },
  {
    "id": "names",
    "title": "6 · 지금 본 자리와 선택 규칙에 이름을 붙인다"
  },
  {
    "id": "precision",
    "title": "7 · 저장하는 소수부 10 bit에 숨은 1이 더해진다"
  },
  {
    "id": "rounding-trace",
    "title": "8 · 같은 세 입력을 괄호 두 가지로 끝까지 따라간다"
  },
  {
    "id": "code-storage",
    "title": "9 · 실제 Python에서 두 바이트로 저장하고 다시 읽는다"
  },
  {
    "id": "code-rounding",
    "title": "10 · 코드의 0.5 비교에 같은 가운데 값을 넣는다"
  },
  {
    "id": "formats",
    "title": "11 · 같은 16 bit라도 촘촘함과 범위가 다르다"
  },
  {
    "id": "stability",
    "title": "12 · 큰 지수를 만들기 전에 공통 크기를 뺀다"
  },
  {
    "id": "underflow",
    "title": "13 · 작은 비중이 0이 되면 로그는 따로 계산한다"
  },
  {
    "id": "cancellation",
    "title": "14 · 큰 두 모멘트가 같아지면 작은 분산이 지워진다"
  },
  {
    "id": "shape",
    "title": "15 · 정확하게 더해도 잘못 짝지으면 아홉 값이 나온다"
  },
  {
    "id": "applications",
    "title": "16 · 입력·연산·누산·출력의 형식을 따로 확인한다"
  },
  {
    "id": "limits",
    "title": "17 · 값이 다른 이유를 재현 가능한 조건으로 적는다"
  },
  {
    "id": "review",
    "title": "18 · 바꾸기 전에 다음 저장값을 예측한다"
  }
],
    component: () => import("@/pages/articles/ai/math-numerical-precision-stability"),
  },
  {
    slug: "math-complex-numbers-oscillations",
    title: "복소수·회전·Euler 공식: Fourier 수식을 읽는 최소 수학",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 한 점을 돌리는 일을 두 숫자의 계산으로 바꾼다"
  },
  {
    "id": "black-box",
    "title": "2 · 현재 위치와 돌릴 양을 받아 새 위치를 만든다"
  },
  {
    "id": "case",
    "title": "3 · (3,4)를 네 번 돌려 같은 점으로 돌아온다"
  },
  {
    "id": "picture",
    "title": "4 · 같은 원 위의 점과 두 축의 그림자를 함께 본다"
  },
  {
    "id": "why",
    "title": "5 · 반복할 수 있는 규칙에 방향과 크기를 함께 남긴다"
  },
  {
    "id": "names",
    "title": "6 · 이미 본 좌표와 회전에 이름을 붙인다"
  },
  {
    "id": "radians",
    "title": "7 · 지나간 호를 반지름으로 나누어 같은 회전량을 얻는다"
  },
  {
    "id": "unit-circle",
    "title": "8 · 길이를 1로 맞추면 두 좌표가 코사인과 사인이 된다"
  },
  {
    "id": "complex-plane",
    "title": "9 · i를 곱하면 두 좌표가 (−b,a)로 바뀐다"
  },
  {
    "id": "series",
    "title": "10 · 유한한 합을 늘려 함수 값에 가까이 간다"
  },
  {
    "id": "euler-formula",
    "title": "11 · 같은 급수의 짝수 항과 홀수 항이 회전 좌표가 된다"
  },
  {
    "id": "roots-of-unity",
    "title": "12 · 네 방향을 반복해서 곱하면 정해진 회전을 골라낼 수 있다"
  },
  {
    "id": "source",
    "title": "13 · 실제 Python 코드는 두 실수의 네 곱을 계산한다"
  },
  {
    "id": "applications",
    "title": "14 · 같은 네 점에서 회전 성분을 더하고 배율을 확인한다"
  },
  {
    "id": "limits",
    "title": "15 · 방향, 누적 회전, 수치 근사와 계수 배율을 구분한다"
  }
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
  {
    "id": "overview",
    "title": "1 · 계산 두 개를 연결할 때 무엇을 확인해야 할까"
  },
  {
    "id": "black-box",
    "title": "2 · 밖에서는 2가 들어가 49가 나온다"
  },
  {
    "id": "case",
    "title": "3 · 2를 세 배 하고 1을 더한 뒤 제곱한다"
  },
  {
    "id": "picture",
    "title": "4 · 앞 계산의 결과가 다음 계산의 재료가 된다"
  },
  {
    "id": "need",
    "title": "5 · 순서와 허용 범위를 따로 검사하는 이유"
  },
  {
    "id": "names",
    "title": "6 · 계산 규칙은 함수, 규칙의 연결은 합성이다"
  },
  {
    "id": "shape",
    "title": "7 · 선언한 출력 집합과 실제 나오는 값은 다르다"
  },
  {
    "id": "composition",
    "title": "8 · 안쪽 g를 계산한 다음 바깥 f를 계산한다"
  },
  {
    "id": "source",
    "title": "9 · 교재의 합성 정의에 같은 2를 넣는다"
  },
  {
    "id": "boundaries",
    "title": "10 · 괄호를 바꾸는 것과 실행 순서를 바꾸는 것은 다르다"
  }
],
    component: () => import("@/pages/articles/ai/math-functions-composition"),
  },
  {
    slug: "math-functions-derivatives-gradients",
    title: "Derivative와 chain rule: local rate를 연결하는 법",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 값을 조금 바꾸면 결과는 얼마나 달라질까"
  },
  {
    "id": "black-box",
    "title": "2 · 입력 차이와 결과 차이를 함께 본다"
  },
  {
    "id": "case",
    "title": "3 · 간격을 줄이면 7, 6.1, 6.01이 6으로 모인다"
  },
  {
    "id": "picture",
    "title": "4 · 두 결과를 비교한 뒤 간격을 줄인다"
  },
  {
    "id": "need",
    "title": "5 · 값 자체와 변화에 대한 비율은 다른 정보다"
  },
  {
    "id": "names",
    "title": "6 · 작은 변화의 비율을 미분계수라고 부른다"
  },
  {
    "id": "derivative",
    "title": "7 · 같은 제곱 계산을 끝까지 정리하면 6+h가 남는다"
  },
  {
    "id": "local-linearity",
    "title": "8 · 9.6이라는 예측과 실제 9.61 사이에는 오차가 남는다"
  },
  {
    "id": "chain-rule",
    "title": "9 · 변화가 두 단계를 지나면 배율을 곱한다"
  },
  {
    "id": "source",
    "title": "10 · 원문 식의 기준점과 중간값에 각각 3과 7을 넣는다"
  },
  {
    "id": "nonsmooth",
    "title": "11 · 모서리에서 코드가 고른 값은 유일한 미분값이 아니다"
  }
],
    component: () =>
      import("@/pages/articles/ai/math-functions-derivatives-gradients"),
  },
  {
    slug: "math-gradients-jacobians",
    title: "Gradient와 Jacobian: 여러 입력의 민감도를 묶는 법",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 바꿀 입력이 여러 개이면 변화의 원인을 어떻게 나눌까"
  },
  {
    "id": "black-box",
    "title": "2 · 두 수를 받아 한 수를 돌려주는 계산을 살펴본다"
  },
  {
    "id": "case",
    "title": "3 · 같은 0.01 이동이 0.0401과 0.03을 만든다"
  },
  {
    "id": "picture",
    "title": "4 · 입력별 기여를 모아 결과별로 합친다"
  },
  {
    "id": "need",
    "title": "5 · 순서와 이동 길이를 맞춰야 방향을 비교할 수 있다"
  },
  {
    "id": "names",
    "title": "6 · 편미분을 모으면 기울기와 야코비안이 된다"
  },
  {
    "id": "partials",
    "title": "7 · 다른 좌표를 고정하면 4와 3이 남는다"
  },
  {
    "id": "gradient-direction",
    "title": "8 · 방향의 두 성분에 4와 3을 곱해 더한다"
  },
  {
    "id": "jacobian",
    "title": "9 · 합과 곱의 변화는 서로 다른 행에서 계산한다"
  },
  {
    "id": "source",
    "title": "10 · 원문의 방향미분 식과 야코비안에 같은 수를 넣는다"
  },
  {
    "id": "boundaries",
    "title": "11 · 좌표별 비율만 있거나 단위를 바꾸면 무엇이 달라질까"
  }
],
    component: () => import("@/pages/articles/ai/math-gradients-jacobians"),
  },
  {
    slug: "math-differential-equations-numerical-solvers",
    title: "미분방정식·수치적분: diffusion의 ODE·SDE를 읽는 최소 수학",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 지금 줄어드는 속도로 잠시 뒤의 양을 계산한다"
  },
  {
    "id": "black-box",
    "title": "2 · 현재 양과 시간을 받아 조금 뒤의 양을 돌려준다"
  },
  {
    "id": "case",
    "title": "3 · 1에서 시작해 0.5, 다시 0.25로 간다"
  },
  {
    "id": "picture",
    "title": "4 · 곡선을 짧은 선분으로 따라가는 모습을 본다"
  },
  {
    "id": "why",
    "title": "5 · 원래 규칙을 고치는 일과 계산 간격을 고치는 일을 나눈다"
  },
  {
    "id": "names",
    "title": "6 · 지금 본 규칙과 계산 방법에 이름을 붙인다"
  },
  {
    "id": "initial-value",
    "title": "7 · 변화율의 단위와 시작값을 정하면 기준 경로를 구할 수 있다"
  },
  {
    "id": "euler-method",
    "title": "8 · 현재 변화율에 간격을 곱하고 현재 값에 더한다"
  },
  {
    "id": "error",
    "title": "9 · 한 번 놓친 굽음과 여러 번 누적된 오차를 구별한다"
  },
  {
    "id": "stability",
    "title": "10 · 줄어드는 원래 문제를 계산이 키우지 않도록 간격을 제한한다"
  },
  {
    "id": "heun-runge-kutta",
    "title": "11 · 예상 끝점의 기울기도 읽어 첫 결과를 고친다"
  },
  {
    "id": "source",
    "title": "12 · 실제 코드의 반환값이 새 상태인지 변화량인지 읽는다"
  },
  {
    "id": "adaptive",
    "title": "13 · 간격을 자동으로 바꿀 때도 무엇을 허용했는지 확인한다"
  },
  {
    "id": "ode-sde-boundary",
    "title": "14 · 무작위 흔들림은 시간의 제곱근 크기로 더한다"
  },
  {
    "id": "noise-variance",
    "title": "15 · 잡음의 합과 최종 상태의 분산은 다를 수 있다"
  },
  {
    "id": "applications",
    "title": "16 · 신경망의 변화율과 이를 따라가는 계산 비용을 따로 잰다"
  },
  {
    "id": "predict",
    "title": "17 · 설정을 바꾸기 전에 결과를 예측한다"
  }
],
    component: () =>
      import("@/pages/articles/ai/math-differential-equations-numerical-solvers"),
  },
  {
    slug: "math-exponents-logarithms",
    title: "지수·로그: 확률과 정보량을 읽는 최소 수학",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 절반으로 줄인 양과 줄인 횟수를 함께 기록한다"
  },
  {
    "id": "black-box",
    "title": "2 · 한 번마다 같은 배율을 받고 남은 양을 돌려준다"
  },
  {
    "id": "case",
    "title": "3 · 세 결과를 확인하는 두 기록은 같은 상황을 나타낸다"
  },
  {
    "id": "picture",
    "title": "4 · 위 막대는 절반씩 줄고 아래 눈금은 한 칸씩 늘어난다"
  },
  {
    "id": "need",
    "title": "5 · 아주 작은 양도 변화의 횟수로 비교할 수 있다"
  },
  {
    "id": "names",
    "title": "6 · 배율, 적용 정도, 거꾸로 묻는 계산에 이름을 붙인다"
  },
  {
    "id": "exponents",
    "title": "7 · 같은 밑의 곱은 적용한 지수를 더한다"
  },
  {
    "id": "logarithms",
    "title": "8 · 결과 1/8에서 필요한 지수 −3을 되찾는다"
  },
  {
    "id": "log-identities",
    "title": "9 · 곱을 합으로 옮겨 같은 세 번을 추적한다"
  },
  {
    "id": "log-bases",
    "title": "10 · 밑 2와 자연로그는 같은 양을 다른 단위로 쓴다"
  },
  {
    "id": "applications",
    "title": "11 · 낮게 예측한 실제 사건에는 큰 비용을 준다"
  },
  {
    "id": "source",
    "title": "12 · 교재의 역관계와 CPython의 실제 나눗셈에 대입한다"
  },
  {
    "id": "numerical",
    "title": "13 · 2000번의 곱은 0이 되지만 로그의 합은 남는다"
  },
  {
    "id": "boundaries",
    "title": "14 · 연산을 바꾸기 전에 입력 조건과 비교 대상을 확인한다"
  }
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
  {
    "id": "overview",
    "title": "1 · 가장 낮은 점수를 찾아도 쓸 수 없는 답일 수 있다"
  },
  {
    "id": "black-box",
    "title": "2 · 선택을 받아 허용 여부와 점수를 돌려준다"
  },
  {
    "id": "case",
    "title": "3 · 점수 2인 선택을 제외하면 점수 3인 선택이 남는다"
  },
  {
    "id": "picture",
    "title": "4 · 허용된 선택끼리 비교한 뒤 위치와 점수를 기록한다"
  },
  {
    "id": "need",
    "title": "5 · 비교 기준과 필수 규칙은 서로 다른 질문에 답한다"
  },
  {
    "id": "names",
    "title": "6 · 선택·평가·허용 범위에 이름을 붙인다"
  },
  {
    "id": "feasible-set",
    "title": "7 · 제약을 벌점으로 바꾸면 허용되지 않은 값이 다시 후보가 된다"
  },
  {
    "id": "minimizer",
    "title": "8 · 같은 함수를 두 범위에서 풀면 위치와 점수가 함께 바뀐다"
  },
  {
    "id": "source",
    "title": "9 · 실제 교재의 식에 같은 점수와 두 제약을 대입한다"
  },
  {
    "id": "boundaries",
    "title": "10 · 최솟값의 존재와 실제 목표까지 따로 확인한다"
  }
],
    component: () => import("@/pages/articles/ai/math-optimization-objectives"),
  },
  {
    slug: "math-optimization-convexity",
    title: "Convexity·smoothness: 보장을 가능하게 하는 함수 구조",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 지금의 기울기만 보고 얼마나 멀리 움직여도 될까"
  },
  {
    "id": "black-box",
    "title": "2 · 같은 점수 계산에서 위치와 변화율을 함께 읽는다"
  },
  {
    "id": "case",
    "title": "3 · 두 끝의 평균 2보다 중간의 실제 점수 1이 낮다"
  },
  {
    "id": "picture",
    "title": "4 · 곡선의 위치와 예측 오차를 두 번 비교한다"
  },
  {
    "id": "need",
    "title": "5 · 함수 전체의 조건이 있어야 한 위치의 정보를 넓혀 쓸 수 있다"
  },
  {
    "id": "names",
    "title": "6 · 볼록성은 모양을, 매끄러움은 기울기 변화의 상한을 정한다"
  },
  {
    "id": "convexity",
    "title": "7 · 제곱 함수의 현과 곡선 사이 차이는 항상 0 이상이다"
  },
  {
    "id": "smoothness",
    "title": "8 · 기울기 변화 상한 2로 예측 오차 d²를 덮는다"
  },
  {
    "id": "curvature-range",
    "title": "9 · 아래 굽음 1과 위 굽음 100이면 한 보폭으로 맞추기 어렵다"
  },
  {
    "id": "source",
    "title": "10 · 실제 교재의 θ·m·M을 같은 사례의 비율과 경계에 맞춘다"
  },
  {
    "id": "boundaries",
    "title": "11 · 매끈한 그림만으로 전체 학습의 보장을 얻을 수는 없다"
  }
],
    component: () => import("@/pages/articles/ai/math-optimization-convexity"),
  },
  {
    slug: "math-gradient-descent-convergence",
    title: "Gradient descent와 convergence: 보폭·전제·실패 경계",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1 · 낮아지는 방향을 알아도 멀리 가면 점수가 커질 수 있다"
  },
  {
    "id": "black-box",
    "title": "2 · 현재 위치와 기울기로 다음 위치를 만든다"
  },
  {
    "id": "case",
    "title": "3 · 절반씩 빼면 4→2→1→0.5로 움직인다"
  },
  {
    "id": "picture",
    "title": "4 · 평가하고 이동한 뒤 새 위치에서 다시 시작한다"
  },
  {
    "id": "need",
    "title": "5 · 방향·이동 계수·종료 조건을 함께 정해야 한다"
  },
  {
    "id": "names",
    "title": "6 · 경사하강법의 보폭과 수렴의 뜻을 구별한다"
  },
  {
    "id": "update",
    "title": "7 · 현재 위치에서 기울기의 η배를 빼면 (1−η)x가 된다"
  },
  {
    "id": "step-size",
    "title": "8 · 배율의 크기가 1보다 작으면 0까지의 거리가 줄어든다"
  },
  {
    "id": "convergence",
    "title": "9 · 한 번의 감소와 현재 오차를 연결하면 반복 뒤의 경계가 나온다"
  },
  {
    "id": "source",
    "title": "10 · 실제 교재의 한 번 감소 식에 시작값 4를 대입한다"
  },
  {
    "id": "stopping-boundary",
    "title": "11 · 작은 기울기와 작은 이동은 서로 다른 종료 이유다"
  }
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
  {
    "id": "overview",
    "title": "1. 앞으로 보낼 값과 뒤로 보낼 변화율을 함께 고릅니다"
  },
  {
    "id": "black-box",
    "title": "2. 숫자를 바꾸는 상자를 양쪽 방향으로 읽습니다"
  },
  {
    "id": "case",
    "title": "3. 입력을 조금 움직였을 때 출력이 얼마나 움직이는지 봅니다"
  },
  {
    "id": "parts",
    "title": "4. 출력을 만드는 규칙과 기울기를 읽는 규칙을 구분합니다"
  },
  {
    "id": "why-curve",
    "title": "5. 단순한 합성과 딱 잘라 내는 규칙은 다른 한계를 가집니다"
  },
  {
    "id": "names",
    "title": "6. 활성함수의 이름은 출력의 의미와 연결해 읽습니다"
  },
  {
    "id": "trace",
    "title": "7. 입력 2의 앞 계산과 뒤 계산을 이어 봅니다"
  },
  {
    "id": "step-function",
    "title": "8. 계단 함수에서는 작은 입력 변화가 앞쪽 학습으로 이어지지 않습니다"
  },
  {
    "id": "sigmoid",
    "title": "9. 공식 정의에 입력 2를 넣으면 값과 기울기를 다시 얻습니다"
  },
  {
    "id": "tanh",
    "title": "10. 부호를 남기는 곡선에서도 양 끝의 기울기는 작아집니다"
  },
  {
    "id": "comparison",
    "title": "11. 출력의 의미와 학습 경로를 함께 고릅니다"
  }
],
    component: () => import("@/pages/articles/ai/activation-functions"),
  },
  {
    slug: "rectifier-activations",
    title: "Rectifier 활성화: ReLU · Dying ReLU · SELU",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 음수 값을 지우면 학습에 돌아갈 신호도 지워집니다"
  },
  {
    "id": "black-box",
    "title": "2. 앞 방향의 통과 여부를 뒤 방향에서도 다시 씁니다"
  },
  {
    "id": "case",
    "title": "3. −2를 조금 움직여도 0이면 뒤 변화율은 없습니다"
  },
  {
    "id": "parts",
    "title": "4. 부호 판단과 관측 기록을 다른 일로 둡니다"
  },
  {
    "id": "why-negative-path",
    "title": "5. 음수를 조금 남기면 변화율에도 작은 통로가 생깁니다"
  },
  {
    "id": "names",
    "title": "6. 음수를 다루는 선택에 따라 이름이 달라집니다"
  },
  {
    "id": "trace",
    "title": "7. 같은 (−2,3)을 두 규칙으로 끝까지 보냅니다"
  },
  {
    "id": "relu",
    "title": "8. 원문의 음수 기울기를 0으로 놓으면 ReLU가 됩니다"
  },
  {
    "id": "negative-slope",
    "title": "9. 학습하는 음수 기울기는 입력과 뒤 변화율로 갱신됩니다"
  },
  {
    "id": "self-normalization",
    "title": "10. SELU의 식에 같은 값을 넣어도 두 값이 자동으로 표준화되지는 않습니다"
  },
  {
    "id": "dying-relu",
    "title": "11. 여러 자료에서 닫힌 경로와 다른 갱신 경로를 구분합니다"
  },
  {
    "id": "comparison",
    "title": "12. 같은 계산 조건에서 값의 분포와 비용까지 비교합니다"
  }
],
    component: () => import("@/pages/articles/ai/rectifier-activations"),
  },
  {
    slug: "gated-activations",
    title: "Smooth·Gated 활성화: GELU · SiLU · SwiGLU",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 전달할 값과 그 값을 조절할 신호를 따로 만듭니다"
  },
  {
    "id": "black-box",
    "title": "2. 두 경로가 만나는 곱셈을 전체 흐름에서 찾습니다"
  },
  {
    "id": "case",
    "title": "3. 0–1 비율에 원래 값을 곱하면 결과는 음수일 수 있습니다"
  },
  {
    "id": "parts",
    "title": "4. 두 변환을 따로 배우기 때문에 같은 입력에서 다른 역할이 나옵니다"
  },
  {
    "id": "why-two-paths",
    "title": "5. 구조를 바꾸면 늘어난 계산도 함께 비교해야 합니다"
  },
  {
    "id": "names",
    "title": "6. 곡선 하나와 두 경로를 결합하는 구조를 나누어 부릅니다"
  },
  {
    "id": "trace",
    "title": "7. 세 행렬에 같은 입력을 넣어 (2.268941,0)을 만듭니다"
  },
  {
    "id": "gelu-silu",
    "title": "8. 원문의 한 칸 정의에 −1을 직접 넣습니다"
  },
  {
    "id": "gated-ffn",
    "title": "9. 원문 식 (6)의 세 행렬에 같은 숫자를 대응합니다"
  },
  {
    "id": "parameter-budget",
    "title": "10. 같은 숫자 수를 맞출 때 중간 폭은 3에서 2로 줄어듭니다"
  },
  {
    "id": "comparison",
    "title": "11. 조절값의 뜻과 실제 실험 조건을 함께 남깁니다"
  }
],
    component: () => import("@/pages/articles/ai/gated-activations"),
  },
  {
    slug: "reverse-mode-autodiff",
    title: "Reverse-mode autodiff: Graph · Tape · VJP",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 중간값을 두 번 썼다면, 돌아오는 변화도 두 길에서 더합니다"
  },
  {
    "id": "black-box",
    "title": "2. 값을 만드는 계산을 먼저 끝내고 그 계산의 반대 순서로 돌아옵니다"
  },
  {
    "id": "case",
    "title": "3. 한 길의 기여를 덮어쓰면 26 대신 24 또는 2가 됩니다"
  },
  {
    "id": "parts",
    "title": "4. 값의 저장 공간, 연산 기록, 돌아오는 기여를 구분합니다"
  },
  {
    "id": "why-reuse",
    "title": "5. 처음 숫자를 하나씩 바꿔 전체 계산을 반복하지 않아도 됩니다"
  },
  {
    "id": "names",
    "title": "6. 이미 본 기록과 기여에 이름을 붙입니다"
  },
  {
    "id": "tape",
    "title": "7. 실제 backward에 필요한 값만 저장합니다"
  },
  {
    "id": "trace",
    "title": "8. 42에서 시작해 13을 합친 뒤 26과 39를 반환합니다"
  },
  {
    "id": "reverse-mode",
    "title": "9. VJP는 필요한 곱을 구하며 모든 편미분 표를 먼저 만들지 않습니다"
  },
  {
    "id": "source-forward",
    "title": "10. 공식 LinearFunction 원문에 같은 입력 2와 가중치 3을 넣습니다"
  },
  {
    "id": "source-backward",
    "title": "11. 공식 backward에 돌아온 13을 넣으면 입력별 세 답이 나옵니다"
  },
  {
    "id": "save-recompute",
    "title": "12. 기록을 버리거나 바꿀 때는 같은 forward를 재현해야 합니다"
  },
  {
    "id": "boundaries",
    "title": "13. 한 그래프의 경로 합과 여러 backward 호출의 저장 정책을 구별합니다"
  }
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
  {
    "id": "overview",
    "title": "1. 오답 하나가 공유 값마다 다른 수정 신호를 보냅니다"
  },
  {
    "id": "black-box",
    "title": "2. 입력으로 답과 오차를 만든 뒤 같은 계산을 반대로 따라갑니다"
  },
  {
    "id": "case",
    "title": "3. 같은 크기로 고쳐도 입력 2에 붙은 값은 점수를 두 배 움직입니다"
  },
  {
    "id": "parts",
    "title": "4. 공유 곱셈 값과 자료마다 다른 입력을 구분합니다"
  },
  {
    "id": "why-reuse",
    "title": "5. 연산의 크기는 여전히 중요하지만 입력마다 전체 계산을 반복할 필요는 없습니다"
  },
  {
    "id": "names",
    "title": "6. 이미 본 값과 두 작업에 이름을 붙입니다"
  },
  {
    "id": "loss-function",
    "title": "7. 오차의 정의가 돌아올 신호의 의미와 크기를 정합니다"
  },
  {
    "id": "trace",
    "title": "8. 두 점수의 신호를 입력과 짝지으면 네 가중치의 답이 나옵니다"
  },
  {
    "id": "tensor-backward",
    "title": "9. 전치 위치와 합산 축을 모양과 미분으로 확인합니다"
  },
  {
    "id": "source-paper",
    "title": "10. 1986년 원문 식의 입력과 뒤 기여에 같은 숫자를 넣습니다"
  },
  {
    "id": "source-code",
    "title": "11. 공식 코드의 weight 저장 방향을 바꾸어 같은 gradient를 얻습니다"
  },
  {
    "id": "boundaries",
    "title": "12. Gradient 계산이 끝났다고 학습의 다음 단계까지 검증된 것은 아닙니다"
  }
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
  {
    "id": "overview",
    "title": "1. 여러 묶음에서 계산한 변화율을 모아 숫자를 한 번 고칩니다"
  },
  {
    "id": "black-box",
    "title": "2. 현재 값을 고정하고, 기여를 모으고, 마지막에 한 번 움직입니다"
  },
  {
    "id": "case",
    "title": "3. 묶음 평균을 똑같이 평균하면 짧은 묶음이 과대평가됩니다"
  },
  {
    "id": "parts",
    "title": "4. 합계를 저장하는 곳과 현재 숫자를 바꾸는 곳을 나눕니다"
  },
  {
    "id": "why-step-size",
    "title": "5. 현재의 변화율은 멀리 이동한 뒤까지 예언하지 않습니다"
  },
  {
    "id": "names",
    "title": "6. 변화율과 실제 이동량을 다른 이름으로 부릅니다"
  },
  {
    "id": "gradient-estimate",
    "title": "7. 한 묶음의 변화율은 전체 자료의 변화율과 다를 수 있습니다"
  },
  {
    "id": "trace",
    "title": "8. 오차 2.5와 변화율 4를 구분해 3을 2.6으로 바꿉니다"
  },
  {
    "id": "update-contract",
    "title": "9. 실제 SGD 원문의 마지막 줄에 3, 4, 0.1을 넣습니다"
  },
  {
    "id": "effective-batch",
    "title": "10. 실제 loss 함수는 받은 공통 분모로 각 합을 나눕니다"
  },
  {
    "id": "release-boundary",
    "title": "11. 갱신 기록에는 값과 횟수, 분모의 정의가 함께 필요합니다"
  }
],
    component: () => import("@/pages/articles/ai/optimizers"),
  },
  {
    slug: "momentum-optimizer",
    title: "Momentum: Gradient History를 Velocity로",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 방향이 바뀌어도, 쌓인 기록 때문에 잠시 더 움직일 수 있습니다"
  },
  {
    "id": "black-box",
    "title": "2. 직전 기록을 줄이고, 새 방향을 더하고, 현재 값을 고칩니다"
  },
  {
    "id": "case",
    "title": "3. 양수 두 번 뒤의 음수 한 번은 기록을 바로 뒤집지 못합니다"
  },
  {
    "id": "parts",
    "title": "4. 학습 값과 방향 기록은 재개할 때 함께 필요합니다"
  },
  {
    "id": "why-memory",
    "title": "5. 오래된 방향을 남기는 비율은 잡음과 방향 전환을 함께 바꿉니다"
  },
  {
    "id": "names",
    "title": "6. 먼저 본 역할을 실제 이름과 연결합니다"
  },
  {
    "id": "ema",
    "title": "7. 같은 기억도 현재 신호 앞의 계수에 따라 크기가 달라집니다"
  },
  {
    "id": "trace",
    "title": "8. 같은 세 변화율을 기록과 학습 값에 차례로 적용합니다"
  },
  {
    "id": "velocity",
    "title": "9. 실제 PyTorch 원문도 기록을 먼저 고친 뒤 이동에 사용합니다"
  },
  {
    "id": "nesterov",
    "title": "10. Nesterov 분기는 같은 기록에서 다른 최종 방향을 만듭니다"
  },
  {
    "id": "damping-boundary",
    "title": "11. 기억이 커지는 것과 학습이 좋아지는 것을 구별합니다"
  }
],
    component: () => import("@/pages/articles/ai/momentum-optimizer"),
  },
  {
    slug: "adam-optimizer",
    title: "Adam: Raw Moments에서 Adaptive Step까지",
    subcategory: "ai-foundations",
    sections: [
  {
    "id": "overview",
    "title": "1. 반대 신호가 와도, 기억한 방향과 크기를 함께 보고 움직입니다"
  },
  {
    "id": "black-box",
    "title": "2. 부호 있는 장부와 제곱한 장부를 갱신하고 비율을 구합니다"
  },
  {
    "id": "case",
    "title": "3. 2와 −2는 방향 장부에서 상쇄되지만 제곱 장부에는 둘 다 4입니다"
  },
  {
    "id": "parts",
    "title": "4. 현재 값만 저장하면 두 번째 이동을 재현할 수 없습니다"
  },
  {
    "id": "why-two-records",
    "title": "5. 방향의 크기를 과거에 본 크기와 비교하려고 제곱근으로 나눕니다"
  },
  {
    "id": "names",
    "title": "6. 두 장부와 보정을 실제 이름에 연결합니다"
  },
  {
    "id": "moments",
    "title": "7. 부호가 다른 신호를 두 장부에 다르게 반영합니다"
  },
  {
    "id": "bias-correction",
    "title": "8. 초기 보정의 지수는 자료 묶음 수가 아니라 실제 갱신 수입니다"
  },
  {
    "id": "trace",
    "title": "9. 두 번째 이동이 약 0.005263인 이유를 끝까지 계산합니다"
  },
  {
    "id": "source-moments",
    "title": "10. 실제 원문의 두 저장 공간에 같은 2와 −2를 넣습니다"
  },
  {
    "id": "preconditioning",
    "title": "11. 실제 분모는 제곱근을 보정한 뒤 작은 양수를 더합니다"
  },
  {
    "id": "release-boundary",
    "title": "12. 같은 한 단계 계산과 전체 학습의 수렴은 다른 검증입니다"
  }
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
