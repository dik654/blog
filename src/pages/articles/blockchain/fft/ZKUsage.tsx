import Math from '@/components/ui/math';

const items = [
  {
    name: 'PLONK — Quotient Polynomial',
    desc: '게이트 제약 다항식 t(x) 계산에 NTT/INTT를 반복 사용. 증명 시간의 40~60%를 차지한다',
    color: 'indigo',
    href: '/crypto/plonk',
  },
  {
    name: 'Groth16 — QAP 다항식 곱',
    desc: 'A(x)·B(x) 곱셈을 NTT로 가속. witness가 클수록 NTT 비중이 커진다',
    color: 'emerald',
    href: '/crypto/groth16',
  },
  {
    name: 'STARK / FRI',
    desc: 'Reed-Solomon 인코딩과 FRI 라운드마다 NTT/INTT. 다항식 차수 바운드 검증의 핵심',
    color: 'amber',
  },
  {
    name: 'KZG 커밋먼트',
    desc: '다항식 평가와 커밋 생성에 NTT 사용. MSM(Multi-Scalar Multiplication)과 함께 병목',
    color: 'indigo',
    href: '/crypto/polycommit',
  },
  {
    name: 'GPU 가속 (Icicle, Bellman)',
    desc: 'Butterfly 구조는 병렬화에 적합. GPU에서 10~100배 가속 가능',
    color: 'emerald',
  },
];

export default function ZKUsage() {
  return (
    <section id="zk-usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZKP에서의 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          NTT는 ZKP 증명 생성에서 <strong>가장 많은 시간을 소비하는 연산</strong>이다.
          <br />
          모든 SNARK/STARK 시스템이 내부적으로 다항식 곱셈에 NTT를 사용한다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">다항식 곱셈 파이프라인</h3>
        <p>
          두 다항식 <Math>{'A(x), B(x)'}</Math>의 곱 <Math>{'C(x) = A(x) \\cdot B(x)'}</Math>를 구하려면:
        </p>
        <div className="not-prose grid grid-cols-1 gap-3 my-4">
          {[
            { step: '1. NTT', desc: 'A(x), B(x)를 평가 표현으로 변환 — O(n log n) × 2', color: 'indigo' },
            { step: '2. Pointwise 곱', desc: 'C(ωⁱ) = A(ωⁱ) · B(ωⁱ) — O(n)', color: 'emerald' },
            { step: '3. INTT', desc: 'C의 평가 표현을 계수로 역변환 — O(n log n)', color: 'amber' },
          ].map(p => (
            <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">증명 시스템별 NTT 활용</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>
              {p.href
                ? <a href={p.href} className="hover:underline">{p.name} &rarr;</a>
                : p.name}
            </p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
