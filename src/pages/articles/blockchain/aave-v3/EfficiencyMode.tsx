import ModernAaveViz from "./viz/ModernAaveViz";

export default function EfficiencyMode() {
  return (
    <section id="efficiency-mode" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">E-Mode와 isolation은 효율을 높이는 대신 asset 조합을 제한한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>E-Mode category는 상관관계가 높은 자산 조합에 별도 LTV·liquidation threshold·bonus를 적용할 수 있습니다. Isolation은 특정 collateral을 활성화한 account가 빌릴 수 있는 asset과 총 debt ceiling을 제한합니다. 둘 다 “안전한 asset”이라는 영구 속성이 아니라 deployment configuration과 account state가 만나는 validation mode입니다.</p>
      </div>
      <ModernAaveViz mode="risk" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">Mode</th><th className="p-3 text-left">의도</th><th className="p-3 text-left">반드시 검사할 반례</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3 font-semibold">E-Mode</td><td className="p-3">같은 category의 correlated assets에 높은 효율</td><td className="p-3">Category 밖 borrow·oracle depeg·category 변경</td></tr>
            <tr><td className="p-3 font-semibold">Isolation</td><td className="p-3">새 collateral exposure를 debt ceiling 안에 제한</td><td className="p-3">허용 밖 debt asset·ceiling 초과·다른 collateral 혼합</td></tr>
          </tbody>
        </table>
      </div>
      <div id="aave-v3-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate</h3>
        <p>Chain ID, Pool proxy/implementation SHA, reserve addresses, oracle sources, decimals, indexes/timestamp, rate data, LTV/LT/bonus/fee, caps, E-Mode/isolation config를 receipt에 고정합니다. Supply/withdraw/borrow/repay, zero debt, 0·optimal·above-optimal utilization, long idle index, stale/negative oracle, HF 1·0.95 경계, partial/full close, insufficient collateral, mode/category/ceiling 변경과 pause/freeze를 base/candidate에 재생합니다. Balances·indexes·rates·HF·events·reverts가 같아진 뒤 gas를 비교하고 이전 implementation/config snapshot으로 rollback rehearsal을 합니다.</p>
      </div>
    </section>
  );
}
