import BroadcastViz from './viz/BroadcastViz';

export default function Broadcast() {
  return (
    <section id="broadcast" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">브로드캐스트 & DSMR</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          기존 블록체인 데이터 전파: 리더가 전체 블록을 모든 검증자에게 전송
          <br />
          문제 — 대역폭 낭비(중복 전송), 리더 병목(단일 노드 의존), 리더 비응답 시 성능 저하
        </p>
        <p className="leading-7">
          <strong>ordered_broadcast</strong> — Commonware의 데이터 전파 프리미티브
          <br />
          합의와 분리: 브로드캐스트는 합의 없이 독립적으로 동작
          <br />
          다중 시퀀서: 리더 병목 없이 병렬 데이터 전파
          <br />
          연결된 인증서: 각 메시지가 이전 메시지의 임계 서명을 포함 — Pre-Consensus Receipt
        </p>
        <p className="leading-7">
          <strong>DSMR</strong>(Decoupled State Machine Replication) — Replicate → Sequence → Execute를 독립 단계로 분리
          <br />
          <strong>ZODA</strong>(Zero-Overhead Data Availability) — Reed-Solomon 인코딩으로 샤드 분할, 신뢰 설정 불필요
        </p>
      </div>
      <div className="not-prose mb-8"><BroadcastViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">DSMR Architecture</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Decoupled State Machine Replication — 전통 BFT의 monolithic 구조를 3단계로 분해
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">전통 SMR (Tendermint, HotStuff)</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Consensus + Execution 일체</li>
              <li>Block proposal → Vote → Commit → Execute</li>
              <li>All sequential</li>
              <li className="text-red-500 dark:text-red-400">문제: 병목 쉬움, 전체 재시작</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-1">Phase 1: Replicate <span className="font-normal text-muted-foreground">(data availability)</span></h4>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Multiple sequencers</li>
                <li>Parallel data broadcast</li>
                <li>Threshold signatures</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Phase 2: Sequence <span className="font-normal text-muted-foreground">(ordering)</span></h4>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>BFT consensus only on order</li>
                <li>Not data content</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Phase 3: Execute <span className="font-normal text-muted-foreground">(state transition)</span></h4>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Deterministic execution</li>
                <li>Can be batched/parallel</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">장점</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Horizontal scaling — multiple sequencers</li>
              <li>Execution parallelism</li>
              <li>Data availability separate concern</li>
              <li>Modular composability</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Related Work</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><strong className="text-foreground">Narwhal/Bullshark</strong> — Aptos, Sui</li>
              <li><strong className="text-foreground">Celestia</strong> — DA layer</li>
              <li><strong className="text-foreground">EigenDA</strong></li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ZODA Data Availability</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Zero-Overhead Data Availability — 블록 데이터(MBs~GBs)를 모든 노드가 저장할 수 없는 문제를 해결, "data is available" 증명을 제공
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">1. Reed-Solomon Encoding</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>n data chunks → n+k encoded chunks</li>
              <li>Any n chunks can recover original</li>
              <li>Redundancy factor: <code className="text-xs">(n+k)/n</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">2. Horizontal Sharding</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Each node stores subset of chunks</li>
              <li>Probabilistic sampling for verification</li>
              <li><code className="text-xs">O(sqrt(n))</code> verification</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">3. No Trusted Setup</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>기존 DA (KZG-based) needs trusted setup</li>
              <li>ZODA uses hash-based commitments</li>
              <li>Transparent, post-quantum secure</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">4. Fraud Proofs</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Light client sampling</li>
              <li>Invalid encoding → proof submittable</li>
              <li>Cryptoeconomic security</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">성능 지표 (1GB block, 100 validators)</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong className="text-foreground">노드당 저장</strong> <span className="text-muted-foreground">— ~20MB (2%)</span></div>
            <div><strong className="text-foreground">Sample 검증</strong> <span className="text-muted-foreground">— <code className="text-xs">O(log n)</code></span></div>
            <div><strong className="text-foreground">Recovery</strong> <span className="text-muted-foreground">— 30% validators로 가능</span></div>
          </div>
        </div>

      </div>
    </section>
  );
}
