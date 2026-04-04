import Math from '@/components/ui/math';

export default function Folding() {
  return (
    <section id="folding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">재귀적 접기 (Folding)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FRI의 핵심 연산이다.
          <br />
          FFT의 butterfly 분할과 같은 원리로, 다항식을 짝수/홀수 부분으로 나눈다.
          <br />
          랜덤 챌린지로 두 부분을 합치면 차수가 절반으로 줄어든다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">짝수/홀수 분해</h3>
        <p>
          다항식 <Math>{'f(x)'}</Math>를 짝수 차수 항과 홀수 차수 항으로 나눈다:
        </p>
        <Math display>{'f(x) = f_{\\text{even}}(x^2) + x \\cdot f_{\\text{odd}}(x^2)'}</Math>
        <p>
          <Math>{'f_{\\text{even}}'}</Math>은 짝수 계수만, <Math>{'f_{\\text{odd}}'}</Math>는 홀수 계수만 포함한다.
          <br />
          두 다항식 모두 원래 차수의 <strong>절반</strong>이다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">접기 라운드</h3>
        <p>
          검증자가 랜덤 챌린지 <Math>{'\\alpha \\in \\mathbb{F}'}</Math>를 보낸다.
          <br />
          증명자는 새 다항식을 계산한다:
        </p>
        <Math display>{'g(y) = f_{\\text{even}}(y) + \\alpha \\cdot f_{\\text{odd}}(y)'}</Math>
        <p>
          <Math>{'g'}</Math>의 차수는 <Math>{'f'}</Math>의 절반이고,
          도메인도 <Math>{'D \\to D^2 = \\{x^2 : x \\in D\\}'}</Math>로 절반이 된다.
          <br />
          <a href="/crypto/fft" className="text-indigo-400 hover:underline">NTT 도메인</a>의
          coset 구조 덕분에 <Math>{'D^2'}</Math>도 깔끔한 곱셈 부분군이 된다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          구체적 예시: 차수-3 다항식 접기
        </h3>
        <p>
          <Math>{'f(x) = 2 + 3x + 5x^2 + 7x^3'}</Math>으로 시작하자
        </p>
        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          {[
            {
              step: '1. 짝수/홀수 분해',
              desc: 'f_even(t) = 2 + 5t (짝수 계수: 2, 5), f_odd(t) = 3 + 7t (홀수 계수: 3, 7)',
              color: 'indigo',
            },
            {
              step: '2. 검증자가 α = 4 전송',
              desc: '랜덤 챌린지 값. 증명자는 이 값으로 두 부분을 결합한다',
              color: 'emerald',
            },
            {
              step: '3. 접기 결과',
              desc: 'g(y) = (2 + 5y) + 4·(3 + 7y) = 14 + 33y — 차수 1 다항식',
              color: 'amber',
            },
            {
              step: '4. 차수 변화',
              desc: '차수 3 → 차수 1. 도메인 크기도 절반. 한 번 더 접으면 상수가 된다',
              color: 'indigo',
            },
          ].map(p => (
            <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">검증자의 일관성 검사</h3>
        <p>
          접기가 정직하게 수행되었는지 확인하려면 랜덤 점 <Math>{'x_0'}</Math>를 골라
          <br />
          <Math>{'f(x_0)'}</Math>와 <Math>{'f(-x_0)'}</Math>를 쿼리한다.
          <br />
          이 두 값으로 <Math>{'f_{\\text{even}}(x_0^2)'}</Math>와 <Math>{'f_{\\text{odd}}(x_0^2)'}</Math>를 복원한다:
        </p>
        <Math display>{'f_{\\text{even}}(x_0^2) = \\frac{f(x_0) + f(-x_0)}{2}, \\quad f_{\\text{odd}}(x_0^2) = \\frac{f(x_0) - f(-x_0)}{2x_0}'}</Math>
        <p>
          복원한 값으로 <Math>{'g(x_0^2) = f_{\\text{even}}(x_0^2) + \\alpha \\cdot f_{\\text{odd}}(x_0^2)'}</Math>를 계산하고,
          증명자가 커밋한 <Math>{'g(x_0^2)'}</Math>와 비교한다.
          <br />
          불일치하면 증명자가 부정직한 것이다
        </p>
      </div>
    </section>
  );
}
