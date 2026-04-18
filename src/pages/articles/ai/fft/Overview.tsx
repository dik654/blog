import Math from '@/components/ui/math';
import FFTOverviewViz from './viz/FFTOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FFT란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>FFT (Fast Fourier Transform)</strong> — 이산 푸리에 변환(DFT)을
          <Math>{'O(n^2)'}</Math>에서 <Math>{'O(n \\log n)'}</Math>으로 가속하는 알고리즘<br />
          1965년 Cooley와 Tukey가 발표했지만, 아이디어 자체는 가우스(1805년)에게까지 거슬러 올라간다<br />
          신호 처리, 이미지 분석, 오디오 압축, 통신 등 거의 모든 공학 분야에서 사용
        </p>
      </div>
      <FFTOverviewViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3>시간 영역 vs 주파수 영역</h3>
        <p>
          <strong>시간 영역(time domain)</strong> — "시간에 따라 신호가 어떻게 변하는가"<br />
          예: 마이크로 녹음한 파형, 1초에 44,100번 샘플링한 진폭 값의 나열<br />
          <strong>주파수 영역(frequency domain)</strong> — "이 신호에 어떤 주파수 성분이 얼마나 포함되어 있는가"<br />
          예: 440Hz(라 음) 성분이 강하고, 880Hz(배음)도 약간 섞여 있다
        </p>
        <p>
          시간 영역에서는 복잡해 보이는 신호가 주파수 영역에서는 깔끔한 구조로 드러난다<br />
          FFT가 하는 일: 시간 영역 데이터를 주파수 영역으로 변환
        </p>

        <h3>AI가 FFT를 필요로 하는 이유</h3>
        <p>
          <strong>오디오/음성 처리</strong> — 원시 파형 대신 스펙트로그램(주파수 분해 결과)을 모델 입력으로 사용<br />
          <strong>이미지 처리</strong> — 큰 커널의 합성곱을 주파수 영역에서 점곱(pointwise multiply)으로 대체<br />
          <strong>시계열 분석</strong> — 주기적 패턴 탐지, 노이즈 제거<br />
          <strong>효율적 어텐션</strong> — 긴 시퀀스의 어텐션 연산을 주파수 영역에서 근사
        </p>

        <h3>DFT의 정의</h3>
        <p>
          길이 N인 시퀀스 <Math>{'x_0, x_1, \\ldots, x_{N-1}'}</Math>이 주어졌을 때:
          <Math display>{'X_k = \\sum_{n=0}^{N-1} x_n \\cdot e^{-2\\pi i \\, kn/N}, \\quad k = 0, 1, \\ldots, N-1'}</Math>
          각 <Math>{'X_k'}</Math>는 주파수 k에 해당하는 성분의 크기와 위상을 담는다<br />
          이 합을 모든 k에 대해 직접 계산하면 <Math>{'O(N^2)'}</Math> — FFT가 이것을 <Math>{'O(N \\log N)'}</Math>으로 줄인다
        </p>
      </div>
    </section>
  );
}
