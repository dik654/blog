export default function Usage() {
  const items = [
    {
      name: 'INTT (역 NTT)',
      desc: 'NTT로 평가한 값들로부터 원래 다항식의 계수를 복원하는 것이 Lagrange 보간의 특수한 경우.',
      color: 'indigo',
      href: '/crypto/fft',
    },
    {
      name: 'PLONK Copy Constraint',
      desc: '와이어 값들이 일치함을 증명할 때 Lagrange basis 다항식 사용.',
      color: 'emerald',
    },
    {
      name: 'STARK AIR',
      desc: '실행 트레이스를 다항식으로 인코딩할 때 Lagrange 보간으로 변환.',
      color: 'amber',
    },
    {
      name: 'Vanishing Polynomial',
      desc: '특정 점들에서 0이 되는 다항식. Lagrange 보간의 분모 부분과 관련.',
      color: 'indigo',
    },
  ];

  return (
    <section id="usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZKP에서의 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lagrange 보간은 "점 → 다항식" 변환이다.
          <br />
          ZKP에서는 실행 결과(점)를 다항식으로 인코딩하여 증명하므로, 이 변환이 곳곳에서 쓰인다.
        </p>
      </div>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>
              {p.href ? <a href={p.href} className="hover:underline">{p.name} →</a> : p.name}
            </p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange ZKP 활용 사례</h3>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          {
            name: '1. 위트니스 인코딩',
            desc: '실행 결과 n개 값 y_i를 도메인 H 위 다항식 f(x)로 보간. ZK 증명이 원시 값이 아닌 다항식에 대해 동작하므로 랜덤 평가를 통한 효율적 건전성이 가능해진다',
            color: 'indigo',
          },
          {
            name: '2. Shamir 비밀 분산',
            desc: '비밀 s를 f(0) = s인 다항식의 n개 평가값으로 분배. t+1개 이상의 조각으로 보간하면 s 복원, 그 미만이면 정보 0. Chainlink, 분산 키 생성 등에 사용',
            color: 'emerald',
          },
          {
            name: '3. PLONK Copy Constraint',
            desc: '게이트 간 와이어 값 일치를 순열 다항식 σ(ω^3) = ω^7로 인코딩. 곱 인자(product argument)에서 z(x)를 Lagrange basis로 표현하여 확인',
            color: 'amber',
          },
          {
            name: '4. STARK AIR',
            desc: '실행 트레이스(2D 테이블)의 각 열을 트레이스 도메인 {1, w, w², ...} 위에서 보간. 전이 제약과 경계 제약을 다항식 항등식으로 표현',
            color: 'indigo',
          },
          {
            name: '5. INTT (역 NTT)',
            desc: '단위근 위 평가값에서 계수 복원 — Lagrange 보간의 특수 경우. FFT 구조로 O(n log n). KZG 커밋, 다항식 곱셈, 계수 추출에 사용',
            color: 'emerald',
          },
          {
            name: '6. Kate/KZG 다항식 커밋먼트',
            desc: '커밋 C = g^{f(τ)}. 점 z에서 f(z) = y를 증명할 때 q(x) = (f(x)-y)/(x-z) 사용. f가 n개 평가값으로 알려진 경우 Lagrange로 계수 형태 계산하거나 Lagrange basis 커밋으로 직접 커밋',
            color: 'amber',
          },
          {
            name: '7. Lookup 인자 (Plookup, Halo2)',
            desc: '위트니스 값이 룩업 테이블에 있음을 증명. 지시 다항식 L_i(x)를 Lagrange basis로 표현 — ω^i에서 1, 나머지에서 0',
            color: 'indigo',
          },
          {
            name: '8. 곱 인자 (Grand Product)',
            desc: 'z(1)=1, z(ω^{i+1}) = z(ω^i)·f(ω^i)로 누적 곱 z(x) 구성. 랜덤 점에서 다항식 항등식으로 검증. 순열 인자, 룩업 인자에 사용',
            color: 'emerald',
          },
          {
            name: '9. Fiat-Shamir 전사본',
            desc: '챌린지 r = hash(transcript)는 도메인 H 밖의 점. f(r)을 H 위 평가값으로부터 Barycentric 공식으로 O(n)에 계산',
            color: 'amber',
          },
          {
            name: '10. 다중 점 평가 증명',
            desc: '다항식을 여러 점 z_1, ..., z_k에서 개방. y_i = f(z_i)를 보간하고 나머지 다항식으로 차이를 처리. Fflonk 등에서 여러 개방을 하나의 확인으로 축소',
            color: 'indigo',
          },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
