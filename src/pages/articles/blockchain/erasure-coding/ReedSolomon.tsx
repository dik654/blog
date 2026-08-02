import RSCodingViz from './viz/RSCodingViz';

export default function ReedSolomon() {
  return (
    <section id="reed-solomon">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        Reed-Solomon 코딩
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          데이터를 유한체 위 다항식 계수로 매핑, n개 평가점에서 코드워드 생성. MDS 코드.
        </p>
      </div>
      <div className="not-prose"><RSCodingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 mb-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Reed-Solomon 코딩 원리</h3>
        <p>
          핵심 직관은 "<strong>k-1차 다항식은 k개 점으로 유일하게 결정된다</strong>"는 대수 기본정리.
        </p>
        <p>
          원본 데이터 k개 심볼을 다항식 계수로 보면, n개의 서로 다른 x값에서 평가해 n개 값을 얻는다.
        </p>
        <p>
          이 n개 중 어떤 k개가 남든지 — 각자의 x좌표와 함께 — 라그랑주 보간으로 원래 다항식을 복원하고 계수를 꺼내면 원본이 된다.
        </p>
        <p>
          모든 연산은 <strong>유한체 GF(q)</strong>에서 수행된다.
        </p>
        <p>
          실수 다항식은 값이 무한대로 자랄 수 있어 고정 비트로 저장할 수 없지만, GF(q)에서는 결과가 반드시 0 ~ q-1 범위로 들어오고 덧셈·곱셈·역원이 정확히 정의된다.
        </p>
        <p>
          바이트 단위 저장과 맞물려 GF(2⁸)가 가장 흔하다 — 256개 원소, 한 심볼 = 한 바이트.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">Encoding</p>
          <ol className="text-sm text-foreground/80 space-y-1.5 list-decimal list-inside">
            <li>data k symbols: <code>[d₀, d₁, …, d_{'{k−1}'}]</code></li>
            <li>polynomial <code>p(x) = d₀ + d₁·x + … + d_{'{k−1}'}·x^(k−1)</code></li>
            <li>n개 점에서 평가 <code>[p(α₀), …, p(α_{'{n−1}'})]</code></li>
            <li>codeword = evaluations</li>
          </ol>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">Decoding</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>임의 k개 (값 + 위치) 수신</li>
            <li>Lagrange interpolation</li>
            <li>다항식 <code>p(x)</code> 복원</li>
            <li>원본 계수 추출</li>
          </ul>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>MDS 속성</strong>은 특별한 의미를 갖는다 — 저장 효율의 이론적 상한선을 달성한다는 것.
        </p>
        <p>
          "어떤 방법을 써도 n-k+1개 이상의 손실은 복구 불가" 가 선형 코드의 Singleton bound인데, RS가 이 바운드를 정확히 달성해 MDS라 불린다.
        </p>
        <p>
          즉 blockchain DA처럼 <em>증명 가능한 최적성</em>이 중요한 곳에서 RS가 사실상 유일한 선택지가 된다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg border border-foreground/10 bg-muted/30 p-4">
          <p className="font-semibold text-sm text-foreground/60 mb-2">Finite Field GF(q)</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li><code>q = 2^m</code> (binary field)</li>
            <li>흔히 <code>GF(2^8)</code> (byte 단위)</li>
            <li><code>GF(2^16)</code>, <code>GF(2^32)</code></li>
            <li>add, mul, inv 연산</li>
          </ul>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-muted/30 p-4">
          <p className="font-semibold text-sm text-foreground/60 mb-2">MDS Property</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>any k of n으로 복원</li>
            <li>optimal redundancy (더 적게 불가)</li>
            <li>정확히 k개면 충분</li>
          </ul>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-muted/30 p-4">
          <p className="font-semibold text-sm text-foreground/60 mb-2">Performance</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>encode <code>O(nk)</code></li>
            <li>decode <code>O(k²)</code> / <code>O(k log k)</code></li>
            <li>matrix multiplication</li>
            <li>SIMD 최적화 → 10+ GB/s</li>
          </ul>
        </div>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-foreground/10 bg-muted/30 p-5">
          <p className="font-semibold text-sm text-foreground/60 mb-2">일반 응용</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>QR codes (Level L 7% ~ H 30%)</li>
            <li>CD / DVD error correction</li>
            <li>DSL modems</li>
            <li>satellite communication</li>
            <li>DNSSEC</li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-2">Blockchain RS 구현</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>Ethereum blobs: RS over <code>GF(2^8)</code></li>
            <li>Celestia: 2D RS</li>
            <li>Filecoin: sector redundancy</li>
            <li>Avalanche: network coding</li>
          </ul>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          실무에서는 "RS"라고 묶어 부르지만 세부 구현이 꽤 갈라진다.
        </p>
        <p>
          <strong>Systematic RS</strong>는 앞쪽 k 심볼을 원본 그대로 유지하고 뒤에 parity만 붙여, 원본을 모두 받으면 디코딩을 건너뛸 수 있다 — 대부분의 실무 저장 시스템이 이 방식.
        </p>
        <p>
          <strong>Cauchy RS</strong>는 encoding matrix를 Cauchy 구조로 잡아 필드 연산 수를 줄여 CPU 효율을 높인다.
        </p>
        <p>
          <strong>FFT-based RS</strong>는 GF 위에서 NTT를 돌려 O(n log n) 인코딩을 달성한다 (Ethereum의 blob 인코딩이 이 계열).
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400 mb-1">Cauchy RS</p>
          <ul className="text-xs text-foreground/70 space-y-0.5 list-disc list-inside">
            <li>최적화된 인코딩</li>
            <li>Cauchy matrix (invertible submatrix)</li>
            <li>field ops 감소</li>
            <li>leopard, klauspost/reedsolomon</li>
          </ul>
        </div>
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400 mb-1">Systematic RS</p>
          <ul className="text-xs text-foreground/70 space-y-0.5 list-disc list-inside">
            <li>앞 k = 원본 그대로</li>
            <li>뒤 n−k = parity</li>
            <li>data 수신 시 decoding 불필요</li>
            <li>storage system 표준</li>
          </ul>
        </div>
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
          <p className="font-semibold text-sm text-indigo-400 mb-1">GF ops 가속</p>
          <ul className="text-xs text-foreground/70 space-y-0.5 list-disc list-inside">
            <li>AVX2 / AVX-512 SIMD</li>
            <li>10+ GB/s throughput</li>
            <li>ISA-L (Intel)</li>
            <li>FLAKY (LFSR-based)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
