import Math from '@/components/ui/math';

export default function INTT() {
  return (
    <section id="intt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">INTT (역변환)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          NTT가 계수 → 평가 변환이라면, INTT는 평가 → 계수 역변환이다.
          <br />
          평가 결과 [f(ω⁰), f(ω¹), …]로부터 원래 계수 [a₀, a₁, …]를 복원한다.
          <br />
          이것은 <a href="/crypto/lagrange" className="text-indigo-400 hover:underline">Lagrange 보간</a>의
          특수한 경우다 — 평가점이 단위근이므로 공식이 단순해진다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">NTT와의 관계</h3>
        <p>
          NTT를 행렬로 쓰면 <Math>{'\\mathbf{y} = W \\cdot \\mathbf{a}'}</Math> (W는 단위근 행렬).
          <br />
          INTT는 역행렬: <Math>{'\\mathbf{a} = W^{-1} \\cdot \\mathbf{y}'}</Math>.
          <br />
          단위근의 성질 덕분에 <Math>{'W^{-1} = \\frac{1}{n} \\cdot \\bar{W}'}</Math>
          (<Math>{'\\bar{W}'}</Math>는 ω를 ω⁻¹로 바꾼 행렬).
          <br />
          즉 INTT = "ω 대신 ω⁻¹을 쓰고, 결과를 n으로 나누는" NTT다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          수치 예시: <Math>{'\\mathbb{F}_{17}'}</Math>, n=4, ω=4
        </h3>
        <p>
          NTT 결과 [14, 12, 14, 9]로부터 원래 계수를 복원:
          <br />
          ω⁻¹ = 4⁻¹ mod 17. 4×13=52≡1 → ω⁻¹ = 13.
          <br />
          n⁻¹ = 4⁻¹ mod 17 = 13
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: 'NTT', desc: '계수 → 평가. ω 사용. O(n log n).', color: 'indigo' },
            { name: 'INTT', desc: '평가 → 계수. ω⁻¹ 사용, ÷n. O(n log n).', color: 'emerald' },
          ].map(p => (
            <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
