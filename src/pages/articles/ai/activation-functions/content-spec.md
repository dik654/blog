# 활성화 함수 글 재구성 사양

## 중심 질문

활성화 함수는 layer composition의 표현력과 backward gradient 흐름을 어떻게 동시에 바꾸는가?

## 포함 범위

- 선형층 합성의 축약과 비선형성.
- 함수값과 도함수의 동시 관찰.
- Sigmoid, tanh, ReLU, Leaky ReLU, GELU, SiLU의 구조적 비교.
- saturation, dying ReLU, scale drift.
- initialization, normalization, residual path와의 연결.
- hidden activation과 output activation의 구분.

## 시각 기준

- 함수별 고정 Scene을 반복하지 않는다.
- 입력 slider 하나에서 함수값과 도함수를 동시에 갱신한다.
- 모든 탭과 slider 극단값에서 SVG point와 label이 viewBox 안에 있어야 한다.
- 긴 gradient 식은 모바일에서 동적 축소가 아니라 의미 단위 설명을 붙인다.
