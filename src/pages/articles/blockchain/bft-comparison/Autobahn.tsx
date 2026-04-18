import AutobahnLayersViz from './viz/AutobahnLayersViz';
import AutobahnArchViz from './viz/AutobahnArchViz';
import AutobahnBlipViz from './viz/AutobahnBlipViz';

export default function Autobahn() {
  return (
    <section id="autobahn" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Autobahn</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Autobahn (SOSP 2024) — <strong>전통 BFT 저지연 + DAG 빠른 복구</strong> 결합.<br />
          Highway(합의) + Lanes(데이터) 분리 + Ride-Sharing piggyback.<br />
          blip(일시 장애) 발생 시 전통 BFT보다 10배+ 빠른 복구.
        </p>
      </div>
      <div className="not-prose mb-8"><AutobahnLayersViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Highway · Lanes · Ride-Sharing</h3>
        <p className="leading-7">
          합의(Highway)와 데이터 전파(Lanes)를 분리 — Ride-Sharing으로 메시지 피기백.
        </p>
      </div>
      <div className="not-prose mb-8"><AutobahnArchViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Blip 복구 비교</h3>
        <p className="leading-7">
          Blip(일시 장애) 발생 시 복구 방식 — 전통 BFT vs DAG vs Autobahn.
        </p>
      </div>
      <div className="not-prose mb-6"><AutobahnBlipViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Autobahn 등장 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Autobahn 등장 동기</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-1">전통 BFT (HotStuff, Tendermint)</p>
            <p className="text-sm">낮은 정상 latency (3-4δ). but blip 복구 느림 — timeout + view change로 <strong>~2-5s halt</strong>.</p>
          </div>
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-1">DAG-BFT (Narwhal, Mysticeti)</p>
            <p className="text-sm">빠른 blip 복구 (parallel progress, <strong>~100-200ms</strong>). but 높은 정상 latency + DAG 구축 overhead.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Blip(일시 장애) 정의</p>
            <p className="text-sm">brief failure — 수 백 ms 동안 validator 응답 없음. 네트워크 jitter, 일시적 DDoS, restart 등. 현실 운영에서 자주 발생.</p>
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-1">Autobahn의 해결</p>
            <p className="text-sm">happy path: 전통 BFT 스타일(저지연). blip 감지 시: DAG-like 구조로 전환. <strong>hybrid benefit</strong> — "둘 다 얻을 수 없을까?"에 대한 답.</p>
          </div>
        </div>
        <p className="leading-7">
          Autobahn = <strong>BFT 저지연 + DAG 빠른 복구</strong>.<br />
          blip (일시 장애)는 현실 자주 발생.<br />
          기존 BFT는 5초+, Autobahn은 수백ms 복구.
        </p>

        {/* ── Highway-Lanes 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Highway + Lanes 구조</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Tier 1: Lanes (data dissemination)</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>각 validator가 독립 lane 소유</li>
              <li>TX batch 생성 + broadcast</li>
              <li>Narwhal-style parallel dissemination</li>
              <li><code className="text-xs">O(n)</code> lanes in parallel → high throughput</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Tier 2: Highway (consensus)</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>sequential ordering</li>
              <li>BFT consensus on batch references</li>
              <li>low latency commit</li>
              <li>HotStuff-like 3-chain or 2-chain</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">분리의 장점: throughput decoupled from latency</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Ride-Sharing (piggyback)</p>
          <p className="text-sm mb-2">validator가 lane batch 생성 시 다른 validator의 batch signature를 포함(piggyback) — additional messages 절감.</p>
          <p className="text-sm text-muted-foreground">예: validator A가 batch A1 생성 시 <code className="text-xs">ack(B3, C2)</code> 포함 → <code className="text-xs">N²</code> ack → <code className="text-xs">N</code> ack. latency도 감소.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Blip 복구 메커니즘</p>
            <p className="text-sm">정상 시: highway sequential commit. validator failure 감지 → 해당 lane skip + 다른 batch로 continue. failure 복구 시 누락된 batch replay + highway catch up.</p>
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-1">성능 (SOSP 2024)</p>
            <p className="text-sm">Happy path: 2-3δ (HotStuff급). Blip recovery: 100-200ms (DAG급). Throughput: 100K+ TPS. Validators: 50-100.</p>
          </div>
        </div>
        <p className="leading-7">
          Highway (consensus) + Lanes (dissemination) 분리.<br />
          Ride-Sharing = <strong>ack piggybacking으로 N² → N</strong>.<br />
          happy path 2-3δ, blip recovery 100ms.
        </p>

        {/* ── 실무 적용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실무 적용과 비교</h3>
        <div className="overflow-x-auto not-prose mb-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로토콜</th>
                <th className="border border-border px-3 py-2 text-left">Happy Path</th>
                <th className="border border-border px-3 py-2 text-left">Blip 복구</th>
                <th className="border border-border px-3 py-2 text-left">Throughput</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['HotStuff', '3δ', '2-5s (timeout + VC)', '25K TPS'],
                ['Narwhal+Bullshark', '6-10δ', '100-200ms', '100K+ TPS'],
                ['Mysticeti', '3-4δ (390ms e2e)', '100-200ms', '160K+ TPS'],
                ['Autobahn', '2-3δ', '100-200ms', '100K+ TPS'],
              ].map(([proto, happy, blip, tps]) => (
                <tr key={proto}>
                  <td className="border border-border px-3 py-2 font-medium">{proto}</td>
                  <td className="border border-border px-3 py-2">{happy}</td>
                  <td className="border border-border px-3 py-2">{blip}</td>
                  <td className="border border-border px-3 py-2">{tps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">2024년 현재 상황</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>Autobahn — 학술 (SOSP 2024)</li>
              <li>Mysticeti — mainnet (Sui)</li>
              <li>Jolteon — mainnet (Aptos)</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">DAG + sequential hybrid가 주류 전망</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">설계 교훈</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li>happy path와 sad path 분리 설계</li>
              <li>piggyback으로 overhead 감소</li>
              <li>각 tier에 최적 프로토콜 선택</li>
              <li>blip은 현실 — 복구 속도 중요</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          Autobahn vs Mysticeti/Jolteon 비교 — <strong>happy path 최적</strong>.<br />
          2024 SOSP, 아직 mainnet 없음.<br />
          DAG + sequential hybrid가 future 방향 제시.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Autobahn이 "다음 세대" 후보인가</strong> — 두 세계의 장점.<br />
          기존 BFT: 낮은 latency, but 느린 복구.<br />
          DAG-BFT: 빠른 복구, but 높은 latency.<br />
          Autobahn: 둘 다 달성 — 2-tier 설계로 각 tier 최적화.
        </p>
      </div>
    </section>
  );
}
