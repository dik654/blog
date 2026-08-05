import ErasureOverviewViz from './viz/ErasureOverviewViz';

export default function Overview() {
  return (
    <section id="overview">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        개요 &mdash; 이레이저 코딩
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          n개 조각 중 임의의 k개만으로 원본 복원 &mdash; 분산 저장, DA, 네트워크 전송의 핵심.
        </p>
      </div>
      <div className="not-prose"><ErasureOverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 mb-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Erasure Coding 개요</h3>
        <p>
          데이터를 여러 노드에 분산할 때 가장 단순한 방식은 <strong>복제(replication)</strong>다.
        </p>
        <p>
          하지만 3중 복제로도 저장량은 3배, 그 중 2개가 동시에 사라지면 복원 불가.
        </p>
        <p>
          반면 <strong>erasure coding</strong>은 수학적 중복(redundancy)을 덧붙여 같은 overhead로 훨씬 더 많은 실패를 견딘다.
        </p>
        <p>
          핵심 아이디어: 입력 <strong>k 조각</strong>을 <strong>n 조각</strong>(n ≥ k)으로 인코딩 → 임의의 k개만 모이면 원본 복원.
        </p>
        <p>
          중복도는 <code>n − k</code>, rate는 <code>k/n</code>, overhead는 <code>(n−k)/k</code>.
        </p>
        <p>
          어떤 n-k개가 사라져도 상관없다는 점이 복제와의 결정적 차이.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-5">
          <p className="font-semibold text-sm text-indigo-400 mb-2">(n, k) 파라미터</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li><code>n</code>: total encoded pieces</li>
            <li><code>k</code>: required for recovery</li>
            <li><code>rate = k/n</code></li>
            <li><code>overhead = (n-k)/k</code></li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-semibold text-sm text-amber-400 mb-2">예시: (10, 6)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>6 original, 10 encoded (redundancy 4)</li>
            <li>임의 6개 수신 → 복원 가능</li>
            <li>overhead 60%</li>
          </ul>
        </div>
      </div>

      <div className="not-prose rounded-lg border border-foreground/10 bg-muted/30 p-5 mb-4">
        <p className="font-semibold text-sm text-foreground/60 mb-2">기본 원리</p>
        <ol className="text-sm text-foreground/80 space-y-1 list-decimal list-inside">
          <li>data → k symbols</li>
          <li>redundant encoding → n symbols</li>
          <li>n 조각 분산 저장/전송</li>
          <li>임의 k개 수신 시 decode</li>
        </ol>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>왜 이게 가능한가?</p>
        <p>
          원본 k개 심볼을 <strong>k-1차 다항식의 계수</strong>로 보고, n개의 서로 다른 x값에서 그 다항식을 평가해 n개 값을 얻는다.
        </p>
        <p>
          다항식은 k개 점으로 유일하게 결정되므로, 어떤 k개를 건지더라도 같은 다항식을 복원할 수 있다.
        </p>
        <p>
          — 그게 바로 <strong>Reed-Solomon</strong>의 원리다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="font-semibold text-sm text-emerald-400 mb-2">MDS (Maximum Distance Separable)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>optimal redundancy</li>
            <li>정확히 k개로 복구 가능</li>
            <li>Reed-Solomon 대표</li>
          </ul>
        </div>
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-5">
          <p className="font-semibold text-sm text-rose-400 mb-2">Non-MDS (Fountain, LDPC)</p>
          <ul className="text-sm text-foreground/80 space-y-1.5 list-disc list-inside">
            <li>k(1+ε)개 정도 필요</li>
            <li>더 빠른 encoding/decoding</li>
            <li>tradeoff: 속도 ↔ 최적성</li>
          </ul>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>MDS</strong>는 이론적 최적 — n-k개까지 사라져도 항상 복원되고, k개보다 적은 조각으로는 <em>어떤 방법을 써도</em> 복원 불가능. Reed-Solomon이 이 바운드를 달성한다.
        </p>
        <p>
          <strong>Non-MDS</strong>(Fountain, LDPC)는 조금 더 많은 조각(보통 k(1+ε))이 필요하지만, 그 대신 인코딩·디코딩이 훨씬 빠르고 XOR 중심 연산이라 구현이 단순하다. 방송망처럼 receiver 수가 가변적이거나, 5G처럼 하드웨어 속도가 중요한 상황에서 선택된다.
        </p>
      </div>

      <div className="not-prose rounded-lg border border-foreground/10 bg-muted/30 p-5 mb-4">
        <p className="font-semibold text-sm text-foreground/60 mb-3">블록체인 사용처</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'Data Availability', items: ['Ethereum EIP-4844', 'Celestia', 'EigenDA'] },
            { title: 'Distributed Storage', items: ['Filecoin sector', 'Storj, Sia'] },
            { title: 'Light Clients', items: ['sampling-based', 'DAS'] },
            { title: 'Network Transmission', items: ['gossip redundancy', 'broadcast'] },
          ].map(c => (
            <div key={c.title} className="rounded border border-foreground/5 bg-background/50 p-2.5">
              <p className="font-semibold text-xs text-indigo-400 mb-1">{c.title}</p>
              <ul className="text-xs text-foreground/60 space-y-0.5 list-disc list-inside">
                {c.items.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="not-prose rounded-lg border border-foreground/10 bg-muted/30 p-5">
        <p className="font-semibold text-sm text-foreground/60 mb-2">역사</p>
        <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
          <li><strong>1960</strong>: Reed-Solomon (CD, QR codes)</li>
          <li><strong>1998</strong>: Digital Fountain (rateless)</li>
          <li><strong>2000s</strong>: LDPC (5G, Wi-Fi)</li>
          <li><strong>2020</strong>: blockchain 도입</li>
          <li><strong>2024</strong>: mainstream DA</li>
        </ul>
      </div>
    </section>
  );
}
