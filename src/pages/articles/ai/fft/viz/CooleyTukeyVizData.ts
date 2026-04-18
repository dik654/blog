export const STEPS = [
  {
    label: '홀짝 분할 — N-point DFT를 절반으로',
    body: 'X_k = Σ_{n=0}^{N-1} x_n · ω_N^{kn}. 짝수(n=2m)와 홀수(n=2m+1) 인덱스로 분리:\nX_k = Σ_{m=0}^{N/2-1} x_{2m} · ω_N^{2mk} + Σ_{m=0}^{N/2-1} x_{2m+1} · ω_N^{(2m+1)k}.\nω_N^{2mk} = ω_{N/2}^{mk} (주기성). 정리하면: X_k = E_k + ω_N^k · O_k.\nE_k = N/2-point DFT(짝수 샘플), O_k = N/2-point DFT(홀수 샘플). 각각 독립 계산.\nN-point DFT 1개 → N/2-point DFT 2개로 분해. 재귀 적용: N/2 → N/4 → ... → 2 → 1.\n재귀 깊이 = log₂N. N=1024이면 10단계. 각 단계에서 N번 butterfly 연산 → 총 N·log₂N.',
  },
  {
    label: 'Butterfly 연산 — 하나의 쌍으로 두 출력',
    body: 'Butterfly 수식: X_k = E_k + ω_N^k · O_k, X_{k+N/2} = E_k - ω_N^k · O_k.\n하나의 곱셈(ω_N^k · O_k)과 덧셈/뺄셈으로 두 출력을 동시에 계산 — 이것이 효율성의 핵심.\n시각적 형태: 두 입력이 교차하며 두 출력을 만드는 X자 패턴 → 나비 날개 모양.\n2-point butterfly 예시: x_0=1, x_1=1. X_0 = 1+1·1 = 2, X_1 = 1-1·1 = 0.\n복소수 곱셈 1회 + 덧셈 1회 + 뺄셈 1회 = butterfly 1회의 비용.\nN/2개 butterfly가 한 단계. log₂N 단계 → 총 (N/2)·log₂N 복소수 곱셈. N=8이면 12회.',
  },
  {
    label: 'Twiddle Factor — 단위원 위의 회전',
    body: 'Twiddle factor: ω_N^k = e^{-2πik/N} = cos(2πk/N) - i·sin(2πk/N). 단위원을 N등분한 k번째 점.\n핵심 대칭성: ω_N^{k+N/2} = e^{-2πi(k+N/2)/N} = e^{-2πik/N} · e^{-iπ} = -ω_N^k. 부호 반전.\n이 대칭성 덕분에: X_k = E_k + ω_N^k·O_k, X_{k+N/2} = E_k - ω_N^k·O_k. 곱셈을 재사용.\nN=8 예시: ω_8^0=1, ω_8^1=(√2/2 - i√2/2), ω_8^2=-i, ω_8^3=(-√2/2 - i√2/2).\nω_8^4 = -ω_8^0 = -1, ω_8^5 = -ω_8^1, ω_8^6 = -ω_8^2 = i, ω_8^7 = -ω_8^3. 후반부는 전반부의 부호 반전.\n추가 최적화: ω_N^0=1(곱셈 불필요), ω_N^{N/4}=-i(실수 곱셈만) → 특수 twiddle factor로 연산 절감.',
  },
  {
    label: '8-point FFT — 3단계 재귀 분해',
    body: '입력: x = [1, 1, 1, 1, 0, 0, 0, 0]. N=8, log₂8 = 3 단계.\nBit-reversal 재배치: 인덱스의 이진수를 뒤집음. 0(000)→0, 1(001)→4(100), 2(010)→2, 3(011)→6(110), ...\n재배치 결과: [x_0, x_4, x_2, x_6, x_1, x_5, x_3, x_7] = [1, 0, 1, 0, 1, 0, 1, 0].\nStage 1 (길이 2): 4개 butterfly. (1,0)→(1,1), (1,0)→(1,1), (1,0)→(1,1), (1,0)→(1,1).\nStage 2 (길이 4): 2개 butterfly 그룹. twiddle ω_4^0=1, ω_4^1=-i 적용.\nStage 3 (길이 8): 1개 butterfly 그룹. twiddle ω_8^0~ω_8^3 적용. 최종 X = [4, 1-2.41i, 0, 1-0.41i, 0, 1+0.41i, 0, 1+2.41i].',
  },
  {
    label: '복잡도 비교 — O(N²) vs O(N log N)',
    body: '정확한 연산 횟수: DFT = N² 복소수 곱셈. FFT = (N/2)·log₂N 복소수 곱셈.\n속도 비율 R = N²/((N/2)·log₂N) = 2N/log₂N. N이 클수록 R이 급격히 증가.\nN=2^10(1K): R=205. N=2^16(65K): R=8,192. N=2^20(1M): R=104,858. N=2^24(16M): R=1,398,101.\n실제 시간(1GHz 프로세서 가정): N=10⁶일 때 DFT ≈ 16분 40초, FFT ≈ 0.01초.\n현대 라이브러리: FFTW("Fastest FFT in the West"), cuFFT(NVIDIA GPU), torch.fft(PyTorch).\ncuFFT 성능: H100에서 N=2^24(16M) complex FFT ≈ 1ms. 실시간 오디오/이미지 처리 가능.',
  },
];

export const C = {
  even: '#3b82f6',   // blue — 짝수(Even)
  odd: '#f59e0b',    // amber — 홀수(Odd)
  out: '#10b981',    // green — 출력
  twiddle: '#8b5cf6', // purple — twiddle factor
  dft: '#ef4444',    // red — DFT / N²
  fft: '#10b981',    // green — FFT / NlogN
  dim: '#94a3b8',    // slate — 보조선/텍스트
};
