const examples = [
  [
    "2 nodes",
    "8 cables / pair",
    "8 ports/node",
    "6.4 Tb/s nominal per direction",
  ],
  [
    "4 nodes",
    "2 cables / pair",
    "6 ports/node, 12 cables total",
    "1.6 Tb/s per pair",
  ],
  [
    "8 nodes",
    "1 cable / pair",
    "7 ports/node, 28 cables total",
    "0.8 Tb/s per pair",
  ],
] as const;

export default function Topology() {
  return (
    <section id="topology" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        full mesh는 node 수가 늘수록 pair당 bandwidth를 내준다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          N개 노드를 full mesh로 연결하고 노드 쌍마다 c개의 800G cable을 쓰면
          전체 cable은 c·N(N−1)/2개, 노드당 port는 c·(N−1)개다. DGX B300의
          physical port가 8개이므로 c·(N−1) ≤ 8이어야 한다.
        </p>
        <ExplainedFormula
          question="Node 수를 늘릴 때 cable 수와 node당 port 수는 얼마나 빨리 늘어나는가?"
          idea={
            <p>
              Full mesh의 node pair 수는 조합 N choose 2입니다. Pair마다 c개
              cable을 놓으면 전체 cable 수에는 c를 곱하고, 한 node는 나머지
              N−1개 node마다 c개 port를 사용합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            E_{\mathrm{cable}} &= c\binom{N}{2}
              = \frac{cN(N-1)}{2} \\
            P_{\mathrm{node}} &= c(N-1) \le 8
          \end{aligned}`}
          terms={[
            { symbol: "N", name: "node count", description: "Full mesh에 참여하는 DGX B300 node 수입니다." },
            { symbol: "c", name: "cables per pair", description: "모든 node pair에 동일하게 배정하는 physical 800G cable 수입니다." },
            { symbol: "E_{\\mathrm{cable}}", name: "total cable edges", description: "Cluster 전체에서 필요한 physical cable 수입니다." },
            { symbol: "P_{\\mathrm{node}}", name: "ports per node", description: "각 node가 peer 연결에 소비하는 physical OSFP port 수입니다." },
          ]}
          assumptions={[
            "모든 node pair를 직접 연결하는 균일한 full mesh입니다.",
            "한 physical cable은 한 node pair만 연결하며 DGX당 사용 가능한 ConnectX-8 OSFP는 여덟 개입니다.",
            "관리·storage용 BlueField-3 port는 이 예산에 포함하지 않습니다.",
          ]}
          interpretation="Cable 총수는 node 수의 제곱에 가깝게 늘고, node당 port는 선형으로 늘어납니다. 여덟 node에서는 c=1만 가능하므로 peer당 physical 800G 한 개가 상한입니다."
        />
        <div
          data-viz="switchless-fullmesh-budget-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[6rem_1fr_1.3fr_1fr] gap-4 border-b bg-muted/25 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>규모</span><span>pair 구성</span><span>물리량</span><span>nominal rate</span>
          </div>
          <div className="divide-y divide-border/70">
            {examples.map(([scale, pair, physical, rate]) => (
              <article key={scale} className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[6rem_1fr_1.3fr_1fr] md:gap-4">
                {[
                  ["규모", scale, "font-semibold"],
                  ["pair 구성", pair, "text-muted-foreground"],
                  ["물리량", physical, "text-muted-foreground"],
                  ["nominal rate", rate, "text-muted-foreground"],
                ].map(([label, value, tone]) => (
                  <div key={label} className="min-w-0">
                    <span className="text-[11px] font-semibold text-muted-foreground md:hidden">{label}</span>
                    <p className={`break-words text-sm ${tone}`}>{value}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
        <p className="leading-7">
          한 800G OSFP direct cable이 split된 두 400G logical link를 같은 peer에
          제공한다고 가정한 nominal 수치다. protocol overhead, collective
          topology, PCIe·GPU affinity, 양방향 traffic 때문에 application
          bandwidth와 같지 않다. 4-node·12-cable 구성은 pair마다 cable 두 개를
          배정한 사례이며 8-node에도 그대로 적용할 수 없다.
        </p>
      </div>
    </section>
  );
}
import ExplainedFormula from "@/components/ui/explained-formula";
