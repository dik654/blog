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
    </section>
  );
}
