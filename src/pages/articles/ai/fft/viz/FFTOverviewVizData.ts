import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '시간 영역 vs 주파수 영역',
    body: '시간 영역: x(t) — 시간 t에 따른 진폭 변화. 오실로스코프에서 보이는 파형.\n주파수 영역: X(f) — 각 주파수 f 성분의 크기(진폭)와 위상(시작점). 스펙트럼 분석기에서 보이는 막대.\n예시: 피아노 "라"음(440Hz) — 시간 영역에서는 복잡한 파형, 주파수 영역에서는 440Hz + 배음(880, 1320Hz) 피크.\nFFT(Fast Fourier Transform)가 시간→주파수 변환. IFFT가 주파수→시간 역변환. 정보 손실 없음(가역).\n왜 주파수 영역이 유용한가: 필터링(노이즈 제거), 압축(중요 주파수만 보존), 합성곱 가속(곱셈으로 대체).\nAI에서의 핵심: 오디오 전처리(스펙트로그램), 이미지 주파수 분석, 효율적 어텐션(FNet) 등.',
  },
  {
    label: 'DFT 수식: X_k = Sigma x_n * e^(-2pi*i*kn/N)',
    body: 'DFT 정의: X_k = Σ_{n=0}^{N-1} x_n · e^{-2πi·kn/N}, k = 0, 1, ..., N-1.\nx_n: n번째 시간 샘플(실수 또는 복소수). X_k: 주파수 k의 복소 계수.\ne^{-2πi·kn/N} = cos(2πkn/N) - i·sin(2πkn/N) — 회전 인자(twiddle factor). 단위원 위의 점.\n|X_k| = 주파수 k의 진폭(크기). arg(X_k) = 주파수 k의 위상(시작 각도). 하나의 복소수에 두 정보 인코딩.\n역변환 IDFT: x_n = (1/N) Σ_{k=0}^{N-1} X_k · e^{+2πi·kn/N}. 부호 반전 + 1/N 스케일링.\nDFT 직접 계산: 각 k마다 N번 곱셈-덧셈 → N개 주파수 → 총 N² 연산. N=1024면 약 100만 번.',
  },
  {
    label: 'O(N^2) -> O(N log N): 1000배 가속',
    body: 'DFT 직접 계산: O(N²) 복소수 곱셈. FFT(Cooley-Tukey 1965): 분할 정복으로 O(N log₂ N).\n핵심 아이디어: N-point DFT를 짝수/홀수 인덱스로 나눠 2개의 N/2-point DFT로 분해. 재귀 적용.\n구체적 연산 횟수 비교:\nN=256: DFT 65,536 vs FFT 2,048 — 32배. N=1,024: DFT 1,048,576 vs FFT 10,240 — 102배.\nN=65,536: DFT 4.3×10⁹ vs FFT 1,048,576 — 4,096배. N=10⁶: DFT 10¹² vs FFT 2×10⁷ — 50,000배.\nN이 2의 거듭제곱(2^m)일 때 가장 효율적 — radix-2 FFT. 아닌 경우 zero-padding으로 2^m으로 맞춤.',
  },
  {
    label: 'AI에서 FFT가 쓰이는 4가지 영역',
    body: '① 스펙트로그램: 오디오 파형 → STFT(Short-Time FFT) → 시간×주파수 2D 행렬. Whisper, WaveNet 등 모든 오디오 AI의 입력.\n② FFT 합성곱: 합성곱 정리 f*g = IFFT(FFT(f)·FFT(g)). 직접 O(NK) vs FFT O(N log N). 커널 K≥64에서 FFT 유리.\n③ 효율적 어텐션: FNet — Self-Attention O(N²)을 1D FFT O(N log N)으로 대체. BERT 대비 정확도 92~97%, 속도 80% 향상.\n④ 노이즈 제거: 신호→FFT→스펙트럼에서 노이즈 주파수 대역 제거→IFFT. ECG, 센서, 오디오 전처리.\n공통점: 주파수 영역에서 연산하면 더 빠르거나(합성곱, 어텐션), 더 자연스러운(필터링, 분석) 결과.\n추가 응용: Diffusion 모델의 주파수 스케줄링, 이미지 압축(JPEG = DCT ≈ 실수 FFT), 양자 컴퓨팅(QFT).',
  },
];

export const C = {
  time: '#3b82f6',
  freq: '#f59e0b',
  fft: '#10b981',
  accent: '#8b5cf6',
  alert: '#ef4444',
};
