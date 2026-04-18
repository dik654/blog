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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">INTT 수식 유도 및 응용</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">유도</h4>
        <p>
          NTT: <Math>{'\\mathbf{y} = W \\cdot \\mathbf{a}'}</Math>, INTT: <Math>{'\\mathbf{a} = W^{-1} \\cdot \\mathbf{y}'}</Math>.
          <br />
          <Math>{'W^{-1}[i][j] = \\frac{1}{n} \\omega^{-ij}'}</Math> 임을 증명:
        </p>
        <Math display>{'\\underbrace{(W \\cdot W^{-1})[i][k]}_{\\text{항등 행렬의 (i,k) 원소}} = \\underbrace{\\frac{1}{n}}_{\\text{정규화}} \\sum_j \\underbrace{\\omega^{j(i-k)}}_{\\text{단위근 거듭제곱}} = \\begin{cases} 1 & i = k \\\\ 0 & i \\neq k \\end{cases}'}</Math>
        <p className="text-sm text-muted-foreground mt-2">
          W = DFT 행렬 (<Math>{'W[i][j] = \\omega^{ij}'}</Math>), W⁻¹ = IDFT 행렬 (<Math>{'W^{-1}[i][j] = \\frac{1}{n}\\omega^{-ij}'}</Math>)<br />
          i=k이면 <Math>{'\\sum_j \\omega^0 = n'}</Math>이므로 1/n × n = 1, i≠k이면 등비급수 합이 0 → 항등 행렬
        </p>
        <p>
          따라서: <Math>{'a_j = \\frac{1}{n} \\sum_k y_k \\cdot \\omega^{-jk}'}</Math>.
          순방향 NTT와 동일한 구조이며 <Math>{'\\omega \\to \\omega^{-1}'}</Math>로 대체하고 결과를 n으로 나누면 된다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">핵심 관찰</h4>
        <p>
          INTT는 NTT와 <strong>정확히 같은 알고리즘</strong>을 사용한다.
          <Math>{'\\omega \\to \\omega^{-1}'}</Math> 대체, 결과에 <Math>{'1/n'}</Math> 스케일링.
          <br />
          실용적 이점: 하나의 구현으로 순방향과 역방향 모두 처리
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">
          <Math>{'n^{-1}'}</Math> 계산
        </h4>
        <p>
          <Math>{'\\mathbb{F}_p'}</Math>에서 <Math>{'n^{-1} = n^{p-2} \\bmod p'}</Math> (Fermat 소정리).
          <Math>{'O(\\log p)'}</Math> 곱셈으로 한 번만 계산하면 n번 재사용한다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">정규화 전략</h4>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          { name: '전략 1: 마지막에 나누기', desc: 'ω⁻¹로 순방향 수행 후 최종 결과에 a[i] *= n⁻¹ 적용. O(n) 추가 패스 1회', color: 'indigo' },
          { name: '전략 2: 트위들 인자에 접기', desc: 'ω⁻¹ 대신 ω⁻¹·n^{-1/k}를 사용하여 butterfly를 통해 스케일링 분배. 동일한 총 연산, 적은 패스', color: 'emerald' },
          { name: '전략 3: bit-reversal과 결합', desc: 'bit-rev이 어차피 필요하면 통합 → 거의 오버헤드 없음', color: 'amber' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">왕복 일관성</h4>
        <p>
          임의 벡터 a에 대해 <code>INTT(NTT(a)) == a</code>.
          테스트에서는 랜덤 벡터로 이 항등식을 검증한다
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">INTT 응용</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: '다항식 곱셈', desc: 'c = INTT(NTT(a) ⊙ NTT(b)). 마지막 단계에서 계수 복원', color: 'indigo' },
          { name: '다항식 보간', desc: '평가값 → 계수. 단위근 위 Lagrange 보간과 동치', color: 'emerald' },
          { name: '다항식 나눗셈', desc: 'p(x)/q(x)를 역수로 계산. 여러 NTT/INTT 필요', color: 'amber' },
          { name: '합성곱', desc: '이산 합성곱 = 주파수 영역 점별 곱. INTT로 시간 영역 복귀', color: 'indigo' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">복잡도 요약</h4>
        <p>
          NTT <Math>{'O(n \\log n)'}</Math> + 점별곱 <Math>{'O(n)'}</Math> + INTT <Math>{'O(n \\log n)'}</Math>
          = 총 <Math>{'O(n \\log n)'}</Math>.
          <br />
          현대 ZK에서 일반적 크기: <Math>{'n = 2^{20}'}</Math> ~ <Math>{'2^{28}'}</Math>.
          배치 처리: GPU 32-128, CPU SIMD 4-8개 병렬
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">Bit-reverse 트릭</h4>
        <p>
          순방향 NTT: natural → bit-rev, 역방향: bit-rev → natural.
          bit-rev 출력이 허용되면 명시적 permutation을 건너뛰어 <Math>{'O(n)'}</Math> 절약.
          <br />
          ZK 프로버 패턴: <code>NTT(계수_natural) → 평가_bitrev → 점별연산 → INTT</code>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">구현 계층</h4>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          { name: '고수준 (ark-poly)', desc: 'DensePolynomial<F>::{fft, ifft}, EvaluationDomain<F>::{fft_in_place, ifft_in_place}', color: 'indigo' },
          { name: '저수준 (bellperson, plonk-core)', desc: 'fn ntt(values: &mut [F], omega: F, log_n: u32) — Cooley-Tukey radix-2 butterfly', color: 'emerald' },
          { name: '어셈블리 (BLST, IceCream)', desc: '수동 튜닝된 butterfly 루프, AVX-512/NEON 인트린식. Rust 대비 ~2-3x 빠름', color: 'amber' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75 font-mono text-xs">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
