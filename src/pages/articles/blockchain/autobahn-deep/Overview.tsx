import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Autobahn 하이브리드 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Autobahn (SOSP 2024) — <strong>PBFT 저지연 + HotStuff 확장성</strong>.<br />
          Highway(consensus) + Lanes(data) + Ride-Sharing(piggyback) 3-tier.<br />
          blip(일시 장애) 복구 10배+ 빠름.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 설계</h3>
        <p className="leading-7">
          정상 상태: <strong>PBFT 스타일 fast path 2단계 커밋</strong>.<br />
          리더 장애 시: HotStuff 스타일 slow path 전환.<br />
          파이프라인으로 여러 합의 인스턴스 동시 실행 → 처리량 극대화.
        </p>

        {/* ── Autobahn 문제 의식 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Autobahn 문제 의식 (SOSP 2024)</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">BFT Scalability Trilemma</p>
            <p className="text-sm mb-2">기존 BFT는 3가지 중 2개만 선택: Low latency, High throughput, Fast blip recovery</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">Latency</th>
                    <th className="border border-border px-3 py-1.5 text-left">Throughput</th>
                    <th className="border border-border px-3 py-1.5 text-left">Blip Recovery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">PBFT</td><td className="border border-border px-3 py-1.5">low (3delta)</td><td className="border border-border px-3 py-1.5">low (O(n2))</td><td className="border border-border px-3 py-1.5">slow (O(n3) VC)</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">HotStuff</td><td className="border border-border px-3 py-1.5">moderate (3-7delta)</td><td className="border border-border px-3 py-1.5">higher (O(n) + pipeline)</td><td className="border border-border px-3 py-1.5">moderate</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Narwhal+Bullshark</td><td className="border border-border px-3 py-1.5">higher (2-4 rounds)</td><td className="border border-border px-3 py-1.5">highest (DAG)</td><td className="border border-border px-3 py-1.5">fast (parallel)</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Mysticeti</td><td className="border border-border px-3 py-1.5">low (390ms)</td><td className="border border-border px-3 py-1.5">high (uncertified DAG)</td><td className="border border-border px-3 py-1.5">fast</td></tr>
                  <tr><td className="border border-border px-3 py-1.5 font-semibold">Autobahn</td><td className="border border-border px-3 py-1.5">PBFT급</td><td className="border border-border px-3 py-1.5">HotStuff+</td><td className="border border-border px-3 py-1.5">DAG급</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Autobahn 메커니즘</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Highway</p>
                <p className="text-muted-foreground">PBFT-style consensus → low latency</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Lanes</p>
                <p className="text-muted-foreground">parallel data dissemination → throughput</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Ride-Sharing</p>
                <p className="text-muted-foreground">piggyback → bandwidth 효율</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Blip handling</p>
                <p className="text-muted-foreground">explicit protocol → fast recovery</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Target: WAN (global validators), 100+ validators, real network conditions. 2024 SOSP publication, 학술 단계
            </p>
          </div>
        </div>
        <p className="leading-7">
          Autobahn: <strong>low latency + high throughput + fast recovery</strong> 동시 달성.<br />
          Highway/Lanes/Ride-Sharing 3-tier 구조.<br />
          2024 SOSP 논문, 학술 단계.
        </p>

        {/* ── Blip 문제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Blip 문제의 중요성</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Blip (brief interruption) 정의</p>
            <p className="text-sm text-muted-foreground">
              짧은 validator failure, network jitter, temporary DDoS, restart/GC pause. typically 100-1000ms duration.<br />
              빈도: 매 validator 분당 수차례, 전체 committee 초당 수차례 — 완벽한 uptime 불가능
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">기존 BFT의 blip 대응</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">감지</th>
                    <th className="border border-border px-3 py-1.5 text-left">복구 시간</th>
                    <th className="border border-border px-3 py-1.5 text-left">blip 영향</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">PBFT</td><td className="border border-border px-3 py-1.5">timeout 1-3s</td><td className="border border-border px-3 py-1.5">3-10s (O(n3) VC)</td><td className="border border-border px-3 py-1.5">수 초 halt</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">HotStuff</td><td className="border border-border px-3 py-1.5">timeout 1s</td><td className="border border-border px-3 py-1.5">1-3s (linear VC)</td><td className="border border-border px-3 py-1.5">1-3s halt</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Tendermint</td><td className="border border-border px-3 py-1.5">timeout + round++</td><td className="border border-border px-3 py-1.5">2-5s</td><td className="border border-border px-3 py-1.5">2-5s halt</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">DAG-BFT</td><td className="border border-border px-3 py-1.5">parallel propose</td><td className="border border-border px-3 py-1.5">100-300ms</td><td className="border border-border px-3 py-1.5">거의 무시</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              누적 효과: 10 blips/hour x 3s halt = 30s downtime/hour → 12 min/day downtime
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">Autobahn 성능 (SOSP 2024)</p>
            <p className="text-sm text-muted-foreground">
              no blip: 200-300ms latency / with blip: 350ms (PBFT는 3s+) / throughput: 100K+ TPS — happy path + blip 둘 다 최적
            </p>
          </div>
        </div>
        <p className="leading-7">
          Blip = <strong>brief interruption</strong> — 현실에서 자주 발생.<br />
          PBFT/HotStuff: 수 초 halt, Autobahn: 수백 ms.<br />
          누적 downtime 차이 10배+ → SLO 중요.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Autobahn이 L1 blockchain의 미래 후보인가</strong> — real-world robustness.<br />
          실제 운영에서 blip은 불가피 (cloud, ISP, validator).<br />
          BFT 선택 시 "평균" 성능보다 "worst case" 성능이 SLO 결정.<br />
          Autobahn은 happy + blip 둘 다 최적 → 실무 적합.
        </p>
      </div>
    </section>
  );
}
