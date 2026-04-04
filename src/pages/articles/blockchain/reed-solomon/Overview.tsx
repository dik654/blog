import Math from '@/components/ui/math';

export default function Overview() {
  const useCases = [
    { name: 'CD / DVD', desc: '스크래치로 손상된 비트를 자동 복구한다', color: 'indigo' },
    { name: 'QR 코드', desc: '일부가 가려져도 원본 데이터를 복원한다', color: 'emerald' },
    { name: '심우주 통신', desc: 'Voyager, Mars Rover 등 NASA 탐사선이 수십억 km 너머로 데이터를 전송할 때 사용한다', color: 'amber' },
    { name: 'ZKP (STARK)', desc: '다항식 차수 바운드 검증에 Reed-Solomon 근접성 테스트(FRI)를 사용한다', color: 'indigo' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reed-Solomon이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">동기: 데이터 전송과 오류</h3>
        <p>
          통신 채널은 완벽하지 않다. 우주 방사선, 디스크 스크래치, 네트워크 잡음 — 전송 중 데이터가 깨질 수 있다.
          <br />
          단순히 데이터를 두 번 보내면 어디가 틀렸는지 알 수 없다.
          <br />
          세 번 보내면 다수결로 복구할 수 있지만, 대역폭을 3배 소모한다
        </p>
        <p>
          Reed-Solomon 부호는 <strong>수학적으로 최소한의 중복</strong>만 추가하여
          오류를 감지하고 복구하는 방법이다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 아이디어</h3>
        <p>
          차수 <Math>{'d'}</Math>인 다항식은 <Math>{'d+1'}</Math>개의 점으로 유일하게 결정된다.
          <br />
          이것이{' '}
          <a href="/crypto/lagrange" className="text-indigo-400 hover:underline">Lagrange 보간</a>의 핵심이다
        </p>
        <p>
          메시지가 <Math>{'k'}</Math>개 심볼이면, 이를 차수 <Math>{'k-1'}</Math> 다항식의 계수로 삼는다.
          <br />
          이 다항식을 <Math>{'n > k'}</Math>개 점에서 평가하면 <Math>{'n'}</Math>개의 값(코드워드)을 얻는다.
          <br />
          <Math>{'n - k'}</Math>개의 추가 값이 중복(redundancy)이다 — 이것으로 오류를 감지하고 복구한다
        </p>
        <Math display>{'k \\text{개 메시지} \\xrightarrow{\\text{다항식 평가}} n \\text{개 코드워드} \\quad (n - k \\text{개 중복})'}</Math>
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-3">어디에 쓰이는가?</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {useCases.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
