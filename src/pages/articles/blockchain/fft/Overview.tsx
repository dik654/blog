import M from '@/components/ui/math';
import NTTConceptViz from './viz/NTTConceptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FFT / NTT란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          다항식 곱셈을 O(n2) &rarr; O(n log n)으로 가속.
          <br />
          ZKP는 유한체 위에서 동작하므로 NTT(Number Theoretic Transform) 사용.
        </p>
      </div>
      <div className="not-prose"><NTTConceptViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FFT/NTT 전체 개요</h3>

        <h4 className="text-lg font-semibold mt-5 mb-2">FFT vs NTT</h4>
        <p>
          FFT(Fast Fourier Transform)는 DFT를 <M>{'O(n \\log n)'}</M>에 계산하는 알고리즘이다.
          Gauss(1805)가 발견하고 Cooley-Tukey(1965)가 대중화했다.
          <br />
          NTT(Number Theoretic Transform)는 복소수 대신 유한체 <M>{'\\mathbb{F}_p'}</M> 위에서 동작하는 FFT다.
          <M>{'\\mathbb{F}_p'}</M>의 단위근을 사용하며, 변환 크기 n이 <M>{'(p-1)'}</M>을 나눠야 한다
        </p>
        <p>
          ZK에서 NTT를 쓰는 이유: FFT는 복소수/부동소수점/반올림 오차가 발생하지만,
          NTT는 정확한 산술로 정밀도 문제가 없다. 다항식 커밋먼트와 ZK 증명에 적합하다
        </p>
      </div>

      <h4 className="text-lg font-semibold mt-5 mb-2">암호학 응용</h4>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: '다항식 곱셈', desc: '차수 n 다항식 곱을 O(n log n)에 수행. ZK-SNARK, 격자 암호의 핵심', color: 'indigo' },
          { name: '다항식 커밋먼트', desc: 'KZG 셋업에 O(n log n) NTT, FRI는 평가 기반 사용', color: 'emerald' },
          { name: '동형 암호', desc: 'CKKS, BFV, BGV 모두 NTT 사용. 암호문 곱셈 가속', color: 'amber' },
          { name: '양자 후 암호', desc: 'Kyber, Dilithium이 NTT 사용. 격자 기반 키 교환', color: 'indigo' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">NTT용 체 선택</h4>
        <p>
          조건: 변환 크기 n이 <M>{'(p-1)'}</M>을 나눠야 한다
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: 'Goldilocks (Plonky2)', desc: 'p = 2⁶⁴ - 2³² + 1. 최대 NTT: 2³²', color: 'indigo' },
          { name: 'BN254 스칼라체', desc: 'p-1에 2²⁸ 인수. 최대 NTT: 2²⁸', color: 'emerald' },
          { name: 'BLS12-381 스칼라체', desc: 'p-1에 2³² 인수. 최대 NTT: 2³²', color: 'amber' },
          { name: 'M31 (Stwo)', desc: 'p = 2³¹ - 1. 2^k 인수 없음 → 확장체 또는 CFFT 사용', color: 'indigo' },
        ].map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">세 가지 기본 연산</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400">NTT (순방향)</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            계수 → 평가값.
            <code>[a₀, ..., a_{'{n-1}'}]</code> → <code>[f(w⁰), ..., f(w^{'{n-1}'})]</code>.
            <code>O(n log n)</code>
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="font-semibold text-sm text-emerald-400">INTT (역방향)</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            평가값 → 계수. <code>O(n log n)</code>
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="font-semibold text-sm text-amber-400">점별 곱셈</p>
          <p className="text-sm mt-1.5 text-foreground/75">
            두 평가 벡터의 원소별 곱. <code>O(n)</code>
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <h4 className="text-lg font-semibold mt-5 mb-2">NTT를 이용한 다항식 곱셈</h4>
        <p>
          차수 <M>{'< n'}</M>인 <M>{'f(x), g(x)'}</M>의 곱은 차수 <M>{'< 2n'}</M>이다
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 my-3">
        {[
          { step: '1. 패딩', desc: 'f, g를 길이 2n으로 확장 (0 추가)', color: 'indigo' },
          { step: '2. 순방향 NTT', desc: 'f_evals = NTT(f), g_evals = NTT(g) — 각 O(n log n)', color: 'emerald' },
          { step: '3. 점별 곱셈', desc: 'h_evals[i] = f_evals[i] · g_evals[i] — O(n)', color: 'amber' },
          { step: '4. 역변환', desc: 'h = INTT(h_evals) — O(n log n). 결과: 차수 < 2n 다항식', color: 'indigo' },
        ].map(p => (
          <div key={p.step} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>{p.step}</p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p>
          총 <M>{'O(n \\log n)'}</M> vs 직접 곱셈 <M>{'O(n^2)'}</M>
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">성능</h4>
        <p>
          NTT 크기 <M>{'2^{20}'}</M>(100만 계수): 나이브 ~1000초, FFT ~20ms (50000배 가속).
          <br />
          NTT 크기 <M>{'2^{24}'}</M>(1600만): 단일 코어 ~500ms, GPU ~50ms.
          <br />
          최적화: bit-reversal permutation, radix-r butterfly, six-step NTT(매우 큰 n), cache-oblivious 구현
        </p>

        <h4 className="text-lg font-semibold mt-5 mb-2">주요 구현체</h4>
      </div>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {[
          { name: 'icicle (CUDA GPU)', desc: '배치 NTT, 멀티 GPU. Filecoin, Aleo에서 사용', color: 'indigo' },
          { name: 'ark-poly (Rust CPU)', desc: 'Arkworks 참조 구현. 체에 대해 제네릭', color: 'emerald' },
          { name: 'plonky2 goldilocks', desc: 'Radix-2 NTT, 멀티스레드', color: 'amber' },
          { name: 'circl / gnark (Go)', desc: '프로덕션 품질의 Go 구현', color: 'indigo' },
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
