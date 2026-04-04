import Math from '@/components/ui/math';

export default function Fourier() {
  return (
    <section id="fourier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">푸리에 변환 직관</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>핵심 아이디어: 모든 신호는 사인파의 합</h3>
        <p>
          조제프 푸리에(1807년)의 발견 — 아무리 복잡한 주기 신호라도
          서로 다른 주파수의 사인파(정현파)를 적절히 더하면 재현할 수 있다<br />
          사각파, 톱니파, 음성 파형 모두 사인파의 중첩으로 분해 가능
        </p>

        <h3>연속 푸리에 변환 (Continuous FT)</h3>
        <p>
          연속 신호 <Math>{'f(t)'}</Math>에 대해:
          <Math display>{'F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) \\, e^{-i\\omega t} \\, dt'}</Math>
          <Math>{'\\omega'}</Math>는 각주파수(angular frequency) — 특정 주파수 성분이 신호에 얼마나 포함되어 있는지를 추출<br />
          역변환은 주파수 성분을 다시 더해서 원래 신호를 복원:
          <Math display>{'f(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} F(\\omega) \\, e^{i\\omega t} \\, d\\omega'}</Math>
        </p>

        <h3>오일러 공식이 연결하는 것</h3>
        <p>
          <Math display>{'e^{i\\theta} = \\cos\\theta + i\\sin\\theta'}</Math>
          복소 지수(complex exponential) 하나로 코사인과 사인을 동시에 표현<br />
          푸리에 변환에서 <Math>{'e^{-i\\omega t}'}</Math>를 쓰는 이유: 크기(진폭)와 위상(시작점)을
          하나의 복소수로 깔끔하게 인코딩하기 위함
        </p>

        <h3>연속 → 이산: DFT</h3>
        <p>
          컴퓨터는 연속 신호를 직접 다룰 수 없다 — 일정 간격으로 샘플링한 이산 데이터만 처리<br />
          적분 <Math>{'\\int'}</Math>이 합 <Math>{'\\sum'}</Math>으로 바뀌고,
          연속 주파수 <Math>{'\\omega'}</Math>가 이산 인덱스 k로 바뀐 것이 DFT
        </p>

        <h3>수치 예시: 2개 사인파의 합성</h3>
        <p>
          신호: <Math>{'f(t) = 3\\sin(2\\pi \\cdot 5t) + 1.5\\sin(2\\pi \\cdot 12t)'}</Math><br />
          5Hz 성분(진폭 3)과 12Hz 성분(진폭 1.5)의 합<br />
          시간 영역에서는 두 파형이 겹쳐 복잡한 모양 —
          FFT를 적용하면 주파수 5와 12에서만 뾰족한 피크가 나타난다<br />
          피크의 높이가 각 성분의 진폭에 비례 — 이것이 스펙트럼(spectrum)
        </p>

        <h3>위상(phase)의 의미</h3>
        <p>
          DFT 결과 <Math>{'X_k'}</Math>는 복소수 — 크기 <Math>{'|X_k|'}</Math>는 진폭,
          편각 <Math>{'\\angle X_k'}</Math>는 위상<br />
          같은 주파수라도 시작 시점이 다르면 위상이 달라진다<br />
          오디오 처리에서는 보통 크기 스펙트럼(magnitude spectrum)만 사용하고 위상은 버린다
        </p>
      </div>
    </section>
  );
}
