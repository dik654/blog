import { CitationBlock } from '@/components/ui/citation';

export default function AsyncFallback() {
  return (
    <section id="async-fallback" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비동기 폴백 (Tusk와 비교)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Spiegelman et al. — Bullshark §5" citeKey={3} type="paper">
          <p className="italic">
            "Bullshark provides both a partially synchronous protocol with 2-round latency and an asynchronous fallback with 4-round latency."
          </p>
        </CitationBlock>

        {/* ── Async Fallback 동작 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Async Fallback 동작 원리</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Bullshark의 2 modes</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Mode 1: Partial Sync (Fast Path)</p>
                <p className="text-muted-foreground">2-round wave, deterministic anchor, <code>f+1+</code> votes → commit. latency: <code>2δ</code></p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Mode 2: Async (Fallback)</p>
                <p className="text-muted-foreground">4-round wave, randomized anchor (VRF/coin), more robust voting rules. latency: <code>4δ</code>, guaranteed liveness</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Transition: consecutive skipped waves (3+) / network timeout → Mode 2. Recovery: successful commits 재개 → Mode 1
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Async mode 메커니즘</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">4-round wave</p>
                <p className="text-muted-foreground"><code>wave w = rounds [4w, 4w+3]</code>. round 4w: potential anchors, 4w+1~4w+2: voting, 4w+3: commit decision</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Randomized anchor</p>
                <p className="text-muted-foreground">common coin at end of wave. <code>anchor = coin_result mod n</code>. unpredictable, uniform random, Byzantine can't bias</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Voting rules</p>
                <p className="text-muted-foreground">round 4w+1: "strong" votes, round 4w+2: "weak" votes (backup), round 4w+3: final decision</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Commit conditions</p>
                <p className="text-muted-foreground"><code>2f+1</code> strong votes → commit. 부족 시 weak votes + coin 사용. commit 확률 &ge; 1/3 per wave</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm">
              <strong>Expected commit</strong>: probability 1/3 per wave → expected 3 waves (12 rounds), probability 1 eventually.<br />
              <strong>Safety</strong>: both modes safe independently, transition safe (wave boundaries), committed anchors preserved
            </p>
          </div>
        </div>
        <p className="leading-7">
          Async mode: <strong>4-round wave + randomized anchor</strong>.<br />
          expected 3 waves (12 rounds) for commit.<br />
          probability 1 eventually — async-safe liveness.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Tusk vs Bullshark</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">속성</th>
                <th className="border border-border px-4 py-2 text-left">Tusk</th>
                <th className="border border-border px-4 py-2 text-left">Bullshark (부분동기)</th>
                <th className="border border-border px-4 py-2 text-left">Bullshark (비동기)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['네트워크 가정', '비동기', '부분 동기', '비동기'],
                ['커밋 지연', '4 라운드', '2 라운드', '4 라운드'],
                ['앵커 선택', '코인 플립', '결정론적', '코인 플립'],
                ['Safety', '항상', '항상', '항상'],
                ['Liveness', '비동기', 'GST 후', '비동기'],
              ].map(([attr, ...rest]) => (
                <tr key={attr}>
                  <td className="border border-border px-4 py-2 font-medium">{attr}</td>
                  {rest.map((v, i) => (
                    <td key={i} className="border border-border px-4 py-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── 하이브리드 전환 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Hybrid 전환 메커니즘</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">자동 전환 메커니즘</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Fast → Slow</p>
                <p className="text-muted-foreground">3 consecutive skipped waves 감지 → next wave: 4-round mode. special marker로 announce → all validators switch</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Slow → Fast</p>
                <p className="text-muted-foreground">2 consecutive successful commits (slow mode) → next wave: 2-round mode. optimistic restart</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              상태 공유: mode state in DAG (special field). validators 동일 상태 유지, Byzantine의 잘못된 state 삽입 감지 가능
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">실제 시나리오</p>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">정상 운영</p>
                <p className="text-muted-foreground">99% time fast mode, 2-round commits, 130K+ TPS</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">DDoS 공격</p>
                <p className="text-muted-foreground">일시적 slow mode, 4-round commits. throughput 감소하지만 progress 유지</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">회복</p>
                <p className="text-muted-foreground">공격 종료 → fast mode 복귀 → 정상 throughput</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Tusk vs Bullshark</p>
            <p className="text-sm text-muted-foreground">
              <strong>Tusk</strong>: only async mode, always 4 rounds, simpler but slower — Sui initial choice.<br />
              <strong>Bullshark</strong>: hybrid benefits, fast in common case, async safety in worst case — optimal adaptive BFT
            </p>
          </div>
        </div>
        <p className="leading-7">
          Hybrid 전환: <strong>consecutive skips → slow, successful commits → fast</strong>.<br />
          99% fast mode + 1% slow mode (실제).<br />
          DDoS 공격에도 progress 유지.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">비동기 폴백 메커니즘</h3>
        <p className="leading-7">
          Bullshark는 부분 동기 모드에서 2라운드 지연으로 빠르게 커밋.<br />
          네트워크가 비동기 상태에 빠지면 자동으로 비동기 모드 전환.<br />
          비동기 모드에서는 코인 플립(공통 동전) 기반 앵커 선택으로<br />
          4라운드 지연으로 합의를 유지.
        </p>
        <p className="leading-7">
          Tusk는 처음부터 비동기만 지원하여 항상 4라운드.<br />
          Bullshark는 정상 시 2라운드, 비동기 시 4라운드 — 최적 조합.<br />
          Sui 블록체인이 Narwhal+Bullshark 조합을 채택한 이유.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "hybrid"가 최선인가</strong> — async safety + sync speed.<br />
          Pure sync: DDoS에 취약 (liveness halt).<br />
          Pure async: 느림 (4+ rounds 항상).<br />
          Hybrid: 평소 빠름 + 위기에도 progress → 양쪽 장점.
        </p>
      </div>
    </section>
  );
}
