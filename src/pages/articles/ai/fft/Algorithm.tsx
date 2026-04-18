import Math from '@/components/ui/math';
import CooleyTukeyViz from './viz/CooleyTukeyViz';

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cooley-Tukey 알고리즘</h2>
      <CooleyTukeyViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>DFT의 비효율성</h3>
        <p>
          DFT를 정의대로 계산하면 N개의 출력 각각에 N번의 곱셈-덧셈 → 총 <Math>{'O(N^2)'}</Math><br />
          N = 1,000,000이면 약 10<sup>12</sup>번 연산 — 실시간 오디오 처리에서는 치명적
        </p>

        <h3>핵심 관찰: 홀짝 분할</h3>
        <p>
          DFT 합을 짝수 인덱스와 홀수 인덱스로 나누면:
          <Math display>{'X_k = \\underbrace{\\sum_{m=0}^{N/2-1} x_{2m} \\, \\omega_N^{2mk}}_{\\text{짝수 항 } E_k} + \\omega_N^k \\underbrace{\\sum_{m=0}^{N/2-1} x_{2m+1} \\, \\omega_N^{2mk}}_{\\text{홀수 항 } O_k}'}</Math>
          여기서 <Math>{'\\omega_N = e^{-2\\pi i/N}'}</Math> (N차 단위근)<br />
          <Math>{'\\omega_N^{2mk} = \\omega_{N/2}^{mk}'}</Math>이므로 각 부분은 길이 N/2의 DFT
        </p>

        <h3>Butterfly 연산</h3>
        <p>
          단위근의 대칭성 <Math>{'\\omega_N^{k+N/2} = -\\omega_N^k'}</Math>를 활용하면:
          <Math display>{'X_k = E_k + \\omega_N^k \\cdot O_k'}</Math>
          <Math display>{'X_{k+N/2} = E_k - \\omega_N^k \\cdot O_k'}</Math>
          하나의 <Math>{'E_k'}</Math>와 <Math>{'O_k'}</Math> 쌍으로 두 개의 출력을 동시에 계산<br />
          이 "더하기/빼기" 패턴이 나비 날개 모양이라 butterfly라 부른다
        </p>

        <h3>Twiddle Factor</h3>
        <p>
          butterfly에서 홀수 항에 곱하는 <Math>{'\\omega_N^k = e^{-2\\pi ik/N}'}</Math>를 twiddle factor라 한다<br />
          "비틀기 인자" — 홀수 부분 DFT의 결과를 올바른 위상으로 회전시키는 역할<br />
          N이 고정이면 twiddle factor를 미리 계산해두고 테이블 참조 가능
        </p>

        <h3>재귀 구조와 복잡도</h3>
        <p>
          길이 N의 DFT → 길이 N/2 DFT 2개 + N번의 butterfly<br />
          <Math display>{'T(N) = 2T(N/2) + O(N) \\implies T(N) = O(N \\log N)'}</Math>
          N = 1,000,000일 때 <Math>{'N^2 = 10^{12}'}</Math> vs <Math>{'N\\log N \\approx 2 \\times 10^7'}</Math> — 약 5만 배 차이
        </p>

        <h3>8-point FFT 수치 예시</h3>
        <p>
          입력: <Math>{'x = [1, 1, 1, 1, 0, 0, 0, 0]'}</Math> (처음 4개가 1인 사각 펄스)
        </p>
        <p>
          <strong>1단계 — 길이 4 DFT 2개로 분할</strong><br />
          짝수 인덱스: <Math>{'[x_0, x_2, x_4, x_6] = [1, 1, 0, 0]'}</Math><br />
          홀수 인덱스: <Math>{'[x_1, x_3, x_5, x_7] = [1, 1, 0, 0]'}</Math>
        </p>
        <p>
          <strong>2단계 — 다시 길이 2 DFT로 분할 (재귀)</strong><br />
          각 길이 4 DFT가 길이 2 DFT 2개로 나뉘어 총 4개의 길이 2 DFT<br />
          길이 2 DFT: <Math>{'[a, b] \\to [a+b, \\, a-b]'}</Math>
        </p>
        <p>
          <strong>3단계 — butterfly로 합산</strong><br />
          twiddle factor <Math>{'\\omega_8^k = e^{-2\\pi ik/8}'}</Math>를 곱해가며 역으로 조립<br />
          최종 결과: <Math>{'X = [4, \\; 1{-}2.41i, \\; 0, \\; 1{-}0.41i, \\; 0, \\; 1{+}0.41i, \\; 0, \\; 1{+}2.41i]'}</Math><br />
          <Math>{'|X_0| = 4'}</Math>는 DC 성분(평균값), 나머지는 고주파 성분의 크기와 위상
        </p>

        <h3>Radix-2 제약</h3>
        <p>
          Cooley-Tukey radix-2는 N이 2의 거듭제곱일 때만 동작<br />
          실전에서는 입력을 0으로 패딩(zero-padding)하여 가장 가까운 2의 거듭제곱으로 맞춘다<br />
          mixed-radix FFT는 임의의 N을 소인수 분해하여 처리 — FFTW, cuFFT 등 라이브러리가 이를 구현
        </p>
      </div>
    </section>
  );
}
