# 신호와 시스템 콘텐츠 사양

## 학습 계약

신호의 index 의미와 system의 memory·causality에서 시작해 LTI, impulse response, convolution, frequency response, sampling을 CNN·audio·SSM으로 연결한다.

첫 화면은 온도를 일정 간격으로 기록하는 장면에서 시작한다. `sample`, `signal`, `system`은 이 장면에서 독자가 이미 이해한 역할에 나중에 붙이는 이름이며, `[1, 2, 1]`과 전문 분야 비교를 그보다 먼저 제시하지 않는다.

## 내부 숙련도 문제

주어진 discrete input과 impulse response로 전체 convolution을 계산하고 causality·BIBO stability를 판단하라. 같은 system에 shifted·scaled input을 넣어 LTI 여부를 반례로 검사하라. 7 Hz 신호를 10 Hz로 sampling했을 때 alias를 구하고, FFT 곱으로 linear convolution을 구현할 때 필요한 padding 길이를 정하라. 마지막으로 CNN layer와 gated SSM 중 어느 범위까지 LTI인지 설명하라.

## 본문 증명 의무

- Linearity와 time invariance가 각각 왜 impulse response 재사용에 필요한지 분리한다.
- Impulse decomposition에서 convolution sum을 순서대로 재구성한다.
- Convolution과 cross-correlation convention 차이를 구현 경계로 남긴다.
- Complex exponential eigenfunction과 frequency response를 통해 convolution theorem을 직관과 수식으로 잇는다.
- Nyquist 조건을 단순 암기가 아니라 서로 다른 연속 신호가 같은 sample을 만드는 식별 불가능성으로 설명한다.
- CNN·audio·SSM 연결에서 nonlinearity와 input-dependent parameter가 LTI 가정을 깨는 지점을 표시한다.

## 출처와 의도

- MIT RES.6-007 Oppenheim 강의: impulse representation -> convolution -> exponential response -> Fourier -> sampling의 원 서사를 기준으로 삼는다.
- MIT 6.003: difference equation, block diagram, pole-zero, frequency response까지 이어지는 후속 범위를 확인한다.
- 혁펜하임 퍼펙트 신호 및 시스템: LTI·convolution을 먼저 다지고 Fourier·sampling·transform으로 확장하는 공개 순서를 비교한다.
- Dumoulin & Visin: 신호처리 index를 CNN stride·padding·shape에 연결한다.

## Viz 책임

Convolution explorer는 flip·shift·multiply·sum을 서로 다른 행으로 보여 주고 출력 전체에서 현재 n을 강조한다. Sampling explorer는 원 파형, 동일 sample, 가능한 alias를 동시에 보여야 한다.

## 완료 기준

독자가 convolution을 kernel sliding 애니메이션으로만 기억하지 않고 LTI system의 완전한 input-output 표현으로 재구성한다.
