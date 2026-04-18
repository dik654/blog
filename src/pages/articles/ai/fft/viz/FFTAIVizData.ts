import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '스펙트로그램 — 오디오를 2D 이미지로 변환',
    body: 'STFT 과정: 오디오 파형을 짧은 윈도우(25ms)로 잘라 각 윈도우에 FFT 적용. hop_size=10ms로 슬라이딩.\n결과: 시간(가로) × 주파수(세로) 2D 행렬. 각 셀 = 해당 시점·주파수의 에너지(dB).\nMel 스케일: 인간 청각은 저주파에 민감(100~1000Hz 구분력↑), 고주파에 둔감(4000~8000Hz 뭉뚱그림).\nMel 필터뱅크(80개): 선형 주파수를 Mel 스케일로 변환. m = 2595·log₁₀(1 + f/700). 비선형 압축.\nWhisper 입력: 16kHz 샘플링, 30초 오디오 → 80 Mel bins × 3000 frames = 240,000 값의 2D 텐서.\nlog-Mel 스펙트로그램: 에너지에 log 적용 → dB 스케일. 인간 청각의 로그 감도 반영. CNN/Transformer 입력.',
  },
  {
    label: '합성곱 정리 — 큰 커널의 FFT 가속',
    body: '합성곱 정리: (f * g)(t) = IFFT(FFT(f) · FFT(g)). 시간 영역의 합성곱 = 주파수 영역의 점별 곱.\n직접 합성곱: 각 출력 위치마다 K번 곱셈-덧셈 → O(N·K). N=이미지 크기, K=커널 크기.\nFFT 합성곱: FFT(f) O(N log N) + FFT(g) O(K log K) + 점별 곱 O(N) + IFFT O(N log N) → O(N log N).\n손익분기점: K ≈ log₂N일 때. N=1024이면 K≈10. 실무에서 K≥32~64일 때 FFT가 유리.\n2D 이미지: 직접 O(N²·K²) vs FFT O(N²·log N). K=64 커널, 512×512 이미지에서 FFT가 약 100배 빠름.\ncuDNN 자동 선택: 커널 크기에 따라 직접/FFT/Winograd 중 최적 알고리즘 자동 선택.',
  },
  {
    label: 'FNet — FFT로 어텐션 대체',
    body: 'Self-Attention: Attn(Q,K,V) = softmax(QKᵀ/√d_k)V. Q,K,V ∈ R^{N×d}. N²·d 곱셈 → O(N²).\nFNet(Lee-Thorp 2021): Attention 대신 2D FFT. 시퀀스 축 FFT + 은닉 차원 축 FFT. O(N log N).\ny = FFT_hidden(FFT_seq(x)). 학습 파라미터 0 — 가중치 행렬(Q,K,V) 불필요.\n토큰 혼합 원리: FFT가 모든 토큰 정보를 주파수 영역에서 전역 결합 → 장거리 의존성 포착.\nGLUE 벤치마크: BERT-Base 82.0 vs FNet 76.7 (92~97% 수준). 학습 속도 80% 향상, 메모리 절감.\n한계: Attention의 동적 가중치(입력에 따라 다른 패턴)가 없음 → 복잡한 추론 과제에서 성능 열위.',
  },
  {
    label: '노이즈 제거 — 주파수 필터링',
    body: '파이프라인: 오염된 신호 x_noisy(t) → FFT → X_noisy(f) → 필터 H(f) 곱 → IFFT → 깨끗한 신호.\n저역 통과 필터(Low-pass): H(f) = 1 (f < f_c), 0 (f ≥ f_c). 고주파 노이즈 제거. f_c=컷오프 주파수.\n대역 통과 필터(Band-pass): f_low < f < f_high만 통과. ECG에서 0.5~40Hz만 추출(근전도/전원 노이즈 제거).\n노치 필터(Notch): 특정 주파수만 제거. 전원 60Hz 잡음 제거에 사용.\n스펙트럼 뺄셈: 노이즈만 있는 구간의 스펙트럼 N(f) 추정 → |X_clean(f)| = |X_noisy(f)| - α|N(f)|.\n딥러닝 결합: 스펙트로그램 기반 U-Net/WaveNet이 전통 필터 대비 SNR 5~10dB 추가 개선.',
  },
  {
    label: 'Diffusion 주파수 — 저주파 먼저, 고주파 나중',
    body: 'Diffusion forward process: 노이즈가 먼저 고주파(텍스처, 디테일)를 파괴 → 나중에 저주파(윤곽, 구조)를 파괴.\nReverse(생성): 반대 순서. 초기 step에서 저주파(전체 구성, 색상 분포) 복원 → 후기 step에서 고주파(피부 질감, 머리카락) 복원.\nFFT 분석으로 확인: 생성 중간 이미지를 FFT → 시간이 지날수록 고주파 에너지가 점차 증가.\n주파수 인지 스케줄링(Freq-aware scheduling): 저주파 step에는 큰 stride, 고주파 step에는 작은 stride.\n효과: 총 denoising step 1000 → 50으로 줄여도 품질 유지. DDIM/DPM-Solver가 이 원리 활용.\nLatent Diffusion(Stable Diffusion): VAE가 고주파를 미리 인코딩하므로 latent 공간에서 저주파 diffusion에 집중.',
  },
];

export const C = {
  wave: '#3b82f6',    // 파형/스펙트로그램
  fft: '#8b5cf6',     // FFT/주파수 영역
  conv: '#10b981',    // 합성곱
  attn: '#ef4444',    // 어텐션
  noise: '#f59e0b',   // 노이즈
  clean: '#06b6d4',   // 클린 시그널
  lowf: '#6366f1',    // 저주파
  highf: '#ec4899',   // 고주파
};
