import ExplainedFormula from "@/components/ui/explained-formula";
import ModernV2Viz from "./viz/ModernV2Viz";

export default function FlashSwap() {
  return (
    <section id="flash-swap" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Flash callback과 TWAP도 마지막에는 관측 가능한 receipt가 필요하다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><code>data.length&gt;0</code>인 swap은 output을 먼저 보내고 수신자의 callback을 실행합니다. Callback이 다른 거래·상환을 마치면 Pair가 balance 차이로 input을 계산하고 adjusted product를 검사합니다. 같은 token을 빌렸다 갚을 때 withdrawn amount 대비 유효 수수료는 정확히 0.3%가 아니라 3/997≈0.3009027%입니다.</p>
      </div>
      <ModernV2Viz mode="flash" />
      <ExplainedFormula
        question="두 cumulative price snapshot으로 5분 TWAP을 어떻게 계산할까요?"
        idea="Pair는 이전 reserve 비율에 경과 시간을 곱해 누적합니다. 소비자는 서로 다른 두 시점의 누적값 차이를 실제 경과 시간으로 나눕니다."
        formula={String.raw`P_{TWAP}=\frac{C(t_1)-C(t_0)}{t_1-t_0},\qquad C\leftarrow C+P_{old}\Delta t`}
        terms={[
          { symbol: "C", name: "cumulative price", description: "Q112.112 price×seconds 누적값입니다." },
          { symbol: "P_old", name: "pre-update price", description: "해당 시간 구간 동안 유지됐다고 보는 이전 reserve 비율입니다." },
          { symbol: "Δt", name: "elapsed seconds", description: "32-bit timestamp modular subtraction으로 구한 시간입니다." },
        ]}
        assumptions={["두 snapshot의 token order·Pair·cumulative direction이 같습니다.", "Oracle 소비자는 충분한 window, freshness, liquidity와 overflow-aware subtraction을 검증합니다."]}
        interpretation="C가 1,200에서 1,800으로 늘고 300초가 지났다면 TWAP은 2입니다. Window가 0이면 나눌 수 없고, 얕은 풀을 짧은 window로 보면 한 block manipulation 비용이 충분하지 않을 수 있습니다."
      />
      <div id="uniswap-v2-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate</h3>
        <p>Core tag/SHA·factory/pair init-code hash·router version·token behavior profile을 receipt에 고정합니다. zero liquidity, first mint, imbalanced mint, exact-in/out rounding, reserve edge, protocol fee on/off, fee-on-transfer/rebase, callback underpayment·reentrancy, multi-hop min/max, stale deadline, timestamp wrap와 short-window manipulation을 재생합니다. Candidate와 pinned source의 balances·reserves·LP supply·events·revert selector·cumulative price가 같아진 뒤 gas를 비교합니다.</p>
      </div>
    </section>
  );
}
