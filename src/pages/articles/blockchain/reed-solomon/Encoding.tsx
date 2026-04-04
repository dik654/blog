import Math from '@/components/ui/math';

export default function Encoding() {
  const evals = [
    { x: '0', calc: '1 + 0 + 0 = 1', result: '1', color: 'indigo' },
    { x: '1', calc: '1 + 2 + 3 = 6', result: '6', color: 'emerald' },
    { x: '2', calc: '1 + 4 + 12 = 17 ≡ 3', result: '3', color: 'amber' },
    { x: '3', calc: '1 + 6 + 27 = 34 ≡ 6', result: '6', color: 'indigo' },
    { x: '4', calc: '1 + 8 + 48 = 57 ≡ 1', result: '1', color: 'emerald' },
    { x: '5', calc: '1 + 10 + 75 = 86 ≡ 2', result: '2', color: 'amber' },
  ];

  return (
    <section id="encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">부호화: 다항식 평가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">메시지를 다항식으로</h3>
        <p>
          메시지 <Math>{'[m_0, m_1, \\ldots, m_{k-1}]'}</Math>을 다항식의 계수로 해석한다:
        </p>
        <Math display>{'f(x) = m_0 + m_1 x + m_2 x^2 + \\cdots + m_{k-1} x^{k-1}'}</Math>
        <p>
          이 다항식의 차수는 최대 <Math>{'k-1'}</Math>이다.
          <br />
          <Math>{'k'}</Math>개 점만 알면{' '}
          <a href="/crypto/lagrange" className="text-indigo-400 hover:underline">Lagrange 보간</a>으로
          다항식을 완벽히 복원할 수 있다.
          <br />
          그래서 <Math>{'n > k'}</Math>개 점에서 평가하면, <Math>{'n - k'}</Math>개의 여분이 오류 복구용 중복이 된다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">평가점 선택</h3>
        <p>
          유한체 <Math>{'\\mathbb{F}_p'}</Math> 위에서 서로 다른 <Math>{'n'}</Math>개의 점을 고른다.
          <br />
          ZKP에서는{' '}
          <a href="/crypto/fft" className="text-indigo-400 hover:underline">NTT</a>의
          단위근 <Math>{'\\{\\omega^0, \\omega^1, \\ldots, \\omega^{n-1}\\}'}</Math>을 평가점으로 사용한다.
          <br />
          단위근을 쓰면{' '}
          <a href="/crypto/fft" className="text-indigo-400 hover:underline">FFT</a>로
          <Math>{'O(n \\log n)'}</Math>에 평가가 가능하다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          구체적 예시: <Math>{'\\mathbb{F}_7'}</Math>
        </h3>
        <p>
          메시지 <Math>{'[1, 2, 3]'}</Math> → 다항식 <Math>{'f(x) = 1 + 2x + 3x^2'}</Math> (차수 2, 계수 3개).
          <br />
          6개 점 <Math>{'x = 0, 1, 2, 3, 4, 5'}</Math>에서 평가하여 코드워드를 만든다 (mod 7):
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        {evals.map(e => (
          <div key={e.x} className={`rounded-lg border border-${e.color}-500/20 bg-${e.color}-500/5 p-3`}>
            <p className={`font-semibold text-sm text-${e.color}-400`}>f({e.x})</p>
            <p className="text-xs mt-1 text-foreground/60">{e.calc}</p>
            <p className="text-lg font-bold mt-1 text-foreground">{e.result}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          코드워드: <Math>{'[1,\\; 6,\\; 3,\\; 6,\\; 1,\\; 2]'}</Math>.
          <br />
          원래 메시지 3개 심볼에서 6개 값을 만들었다 — 중복률 <Math>{'n - k = 3'}</Math>.
          <br />
          이 3개의 여분으로 최대 <Math>{'\\lfloor 3/2 \\rfloor = 1'}</Math>개의 오류를 정정할 수 있다
        </p>
      </div>
    </section>
  );
}
