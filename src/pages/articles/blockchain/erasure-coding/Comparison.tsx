import ECComparisonViz from './viz/ECComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        RS vs Fountain vs LDPC 비교
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          MDS(최적) vs Rateless vs Near-MDS &mdash; 코드 유형별 트레이드오프 비교.
        </p>
      </div>
      <div className="not-prose"><ECComparisonViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 mb-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">EC 코드 비교 상세</h3>
        <p>
          세 코드는 같은 "k of n" 문제를 풀지만 <strong>수학적 기반</strong>이 완전히 다르다.
        </p>
        <p>
          RS는 다항식 보간, Fountain은 XOR 기반 랜덤 bipartite graph, LDPC는 sparse parity-check matrix 위의 반복 디코딩(belief propagation).
        </p>
        <p>
          이 차이가 각 코드의 성능 프로파일과 활용처를 결정한다.
        </p>
        <p>
          <strong>RS</strong>는 정확성·증명 가능성이 최우선일 때.
        </p>
        <p>
          인코딩·디코딩이 다항식 연산이라 "올바르게 인코딩됐는가"를 제3자가 검증하기 쉽다 → 블록체인 DA가 RS를 고수하는 이유.
        </p>
        <p>
          <strong>Fountain</strong>은 "receiver가 언제 얼마나 도착할지 모를 때" 빛난다 — 송신자가 무한히 서로 다른 조각을 생성할 수 있어서, receiver는 "충분하다"고 판단될 때까지 받다가 중단하면 된다.
        </p>
        <p>
          <strong>LDPC</strong>는 하드웨어에 극도로 최적화 — sparse matrix 덕분에 ASIC·FPGA로 digits/cycle 수준의 throughput을 뽑을 수 있어 5G/Wi-Fi/NAND에 깔린다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">1. Reed-Solomon (MDS)</p>
          <p className="text-xs text-foreground/50 mb-1 font-semibold">Properties</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>Maximum Distance Separable</li>
            <li>any k of n</li>
            <li>optimal redundancy</li>
            <li>polynomial-based</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Performance</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>encode <code>O(nk)</code> / <code>O(n log n)</code></li>
            <li>decode <code>O(k²)</code> / <code>O(k log k)</code></li>
            <li>GF field ops</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Use cases</p>
          <p className="text-sm text-foreground/70">storage, blockchain DA, CD/DVD, satellite</p>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Libraries</p>
          <p className="text-xs text-foreground/70">ISA-L · leopard · klauspost/reedsolomon · cauchy-rs</p>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">2. Fountain (Rateless)</p>
          <p className="text-xs text-foreground/50 mb-1 font-semibold">Properties</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>rateless (n 무한대)</li>
            <li>k(1+ε)개 필요</li>
            <li>ε ≈ 0.05–0.1</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Performance</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>encode <code>O(n log k)</code></li>
            <li>decode <code>O(k log k)</code></li>
            <li>XOR 연산, RS보다 단순</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Types</p>
          <p className="text-sm text-foreground/70">LT · Raptor · RaptorQ (RFC 6330)</p>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Use cases</p>
          <p className="text-sm text-foreground/70">broadcast, streaming, flexible rate</p>
        </div>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-2">3. LDPC (Near-MDS)</p>
          <p className="text-xs text-foreground/50 mb-1 font-semibold">Properties</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>Near-MDS</li>
            <li>iterative decoding</li>
            <li>parity-check matrix</li>
            <li>sparse graph 표현</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Performance</p>
          <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
            <li>decode <code>O(n)</code> (iterative)</li>
            <li>하드웨어 매우 빠름</li>
            <li>특정 n에 최적화</li>
          </ul>
          <p className="text-xs text-foreground/50 mt-2 mb-1 font-semibold">Use cases</p>
          <p className="text-sm text-foreground/70">5G (3GPP), Wi-Fi 802.11n+, 10G Ethernet, NAND ECC</p>
        </div>
      </div>

      <div className="not-prose overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-foreground/10">
              {['Code', 'MDS', 'Speed', 'Complexity'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-xs text-foreground/50 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { code: 'RS', mds: 'Yes', speed: 'Medium', cplx: 'Low' },
              { code: 'Fountain', mds: 'No', speed: 'Fast', cplx: 'Medium' },
              { code: 'LDPC', mds: 'Near', speed: 'Fast+', cplx: 'High' },
            ].map(r => (
              <tr key={r.code} className="border-b border-foreground/5">
                <td className="py-2 px-3 font-mono font-semibold text-indigo-400">{r.code}</td>
                <td className="py-2 px-3 text-foreground/70">{r.mds}</td>
                <td className="py-2 px-3 text-foreground/70">{r.speed}</td>
                <td className="py-2 px-3 text-foreground/70">{r.cplx}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose rounded-lg border border-foreground/10 bg-muted/30 p-5">
        <p className="font-semibold text-sm text-foreground/60 mb-2">선택 기준</p>
        <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
          <li>optimal redundancy 필요 → <strong>RS</strong></li>
          <li>unknown channel / rate 유연 → <strong>Fountain</strong></li>
          <li>속도가 핵심 → <strong>LDPC</strong></li>
          <li>블록체인 (provable) → <strong>RS</strong></li>
        </ul>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>
          정리하면: 블록체인이 RS에 수렴한 이유는 <em>속도</em>가 아니라 <em>증명</em> 때문이다.
        </p>
        <p>
          잘못된 인코딩에 대한 fraud proof, KZG commitment 같은 polynomial-friendly 구조와의 호환성, MDS 보장에서 오는 엄격한 하한 — 이 모두가 다항식 기반인 RS와 자연스럽게 맞물린다.
        </p>
        <p>
          반대로 네트워크 전송(Fountain)이나 물리 채널(LDPC)은 "속도·유연성"이 승부라 서로 다른 답으로 진화했다.
        </p>
      </div>
    </section>
  );
}
