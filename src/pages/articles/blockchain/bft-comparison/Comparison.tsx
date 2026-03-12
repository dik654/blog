export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">종합 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">PBFT</th>
                <th className="border border-border px-3 py-2 text-left">HotStuff</th>
                <th className="border border-border px-3 py-2 text-left">Autobahn</th>
                <th className="border border-border px-3 py-2 text-left">Casper FFG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">년도</td>
                <td className="border border-border px-3 py-2">1999</td>
                <td className="border border-border px-3 py-2">2019</td>
                <td className="border border-border px-3 py-2">2024</td>
                <td className="border border-border px-3 py-2">2020</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">정상 경로 복잡도</td>
                <td className="border border-border px-3 py-2">O(n²)</td>
                <td className="border border-border px-3 py-2">O(n)</td>
                <td className="border border-border px-3 py-2">O(n)</td>
                <td className="border border-border px-3 py-2">O(n) 위원회</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">View Change</td>
                <td className="border border-border px-3 py-2">O(n³)</td>
                <td className="border border-border px-3 py-2">O(n)</td>
                <td className="border border-border px-3 py-2">O(n)</td>
                <td className="border border-border px-3 py-2">N/A (fork choice)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">커밋 지연</td>
                <td className="border border-border px-3 py-2">3 RTT</td>
                <td className="border border-border px-3 py-2">3 RTT (기본)</td>
                <td className="border border-border px-3 py-2">1.5 RTT (fast)</td>
                <td className="border border-border px-3 py-2">2 에폭 (~12.8분)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">최종성</td>
                <td className="border border-border px-3 py-2">즉시</td>
                <td className="border border-border px-3 py-2">즉시</td>
                <td className="border border-border px-3 py-2">즉시</td>
                <td className="border border-border px-3 py-2">지연 (2 에폭)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">장애 복구</td>
                <td className="border border-border px-3 py-2">느림 (hangover)</td>
                <td className="border border-border px-3 py-2">느림 (hangover)</td>
                <td className="border border-border px-3 py-2">빠름 (no hangover)</td>
                <td className="border border-border px-3 py-2">자동 (fork choice)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">검증자 확장성</td>
                <td className="border border-border px-3 py-2">~20</td>
                <td className="border border-border px-3 py-2">~100</td>
                <td className="border border-border px-3 py-2">~100</td>
                <td className="border border-border px-3 py-2">~1,000,000+</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">데이터 전파</td>
                <td className="border border-border px-3 py-2">합의에 포함</td>
                <td className="border border-border px-3 py-2">합의에 포함</td>
                <td className="border border-border px-3 py-2">분리 (Lanes)</td>
                <td className="border border-border px-3 py-2">분리 (gossip)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">포크</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">가능 (reorg)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">채택 사례</td>
                <td className="border border-border px-3 py-2">Hyperledger</td>
                <td className="border border-border px-3 py-2">Diem, Aptos</td>
                <td className="border border-border px-3 py-2">Sei Giga</td>
                <td className="border border-border px-3 py-2">이더리움</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">트레이드오프 요약</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">Safety vs Liveness 우선순위</p>
            <p className="text-sm text-muted-foreground">
              PBFT/HotStuff/Autobahn: Safety 우선 (합의 실패 시 멈춤).
              이더리움: Liveness 우선 (합의 실패 시 포크, 나중에 최종화).
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">검증자 수 vs 최종성 속도</p>
            <p className="text-sm text-muted-foreground">
              전통 BFT: 소수 검증자 + 즉시 최종성.
              이더리움: 대규모 검증자 + 지연된 최종성.
              이 트레이드오프는 근본적.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
