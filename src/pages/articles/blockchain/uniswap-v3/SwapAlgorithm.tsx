import ModernV3Viz from "./viz/ModernV3Viz";

export default function SwapAlgorithm() {
  return (
    <section id="swap-algorithm" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Swap은 다음 initialized tick까지 같은 liquidity로 한 step씩 이동한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Exact-input이면 남은 입력에서 fee를 먼저 분리하고, 현재 √P·active L·다음 initialized tick 또는 사용자의 price limit으로 한 step을 계산합니다. Target에 도달하면 bitmap이 표시한 tick의 <code>liquidityNet</code>을 방향에 맞게 더하거나 뺀 뒤 반복합니다. 입력이 소진되거나 price limit에 닿으면 멈춥니다.</p>
      </div>
      <ModernV3Viz mode="swap" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">상태</th><th className="p-3 text-left">확인할 값</th><th className="p-3 text-left">대표 반례</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3 font-semibold">step</td><td className="p-3">amount remaining·fee·sqrt target·rounding</td><td className="p-3">exact-output을 exact-input 부호로 처리</td></tr>
            <tr className="border-b"><td className="p-3 font-semibold">cross</td><td className="p-3">initialized·direction·liquidityNet</td><td className="p-3">왼쪽 이동에서도 liquidityNet을 그대로 더함</td></tr>
            <tr><td className="p-3 font-semibold">settle</td><td className="p-3">callback payment·price limit·final tick</td><td className="p-3">quote만 믿고 callback underpayment 허용</td></tr>
          </tbody>
        </table>
      </div>
      <div id="uniswap-v3-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate</h3>
        <p>Core/periphery version·SHA, factory/pool, token order/decimals, fee, tick spacing, current slot0와 position bounds를 receipt에 고정합니다. Min/max tick, spacing mismatch, sqrt boundary rounding, one-sided/in-range amounts, zero liquidity, exact-in/out, partial step, price limit, initialized/uninitialized crossing, fee-growth wrap, callback underpayment와 multi-cross swap을 official source vectors와 differential execution으로 비교합니다. Amounts·slot0·liquidity·ticks·fee growth·events·reverts가 같아진 뒤 gas와 capital efficiency를 봅니다.</p>
      </div>
    </section>
  );
}
