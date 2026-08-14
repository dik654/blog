import ModernV2Viz from "./viz/ModernV2Viz";

export default function RouterSwap() {
  return (
    <section id="router-swap" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Router는 경로를 계산하지만 사용자가 실행 경계를 정한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Router는 각 hop의 reserve snapshot으로 <code>getAmountOut</code>을 연쇄 계산하고 토큰을 첫 Pair로 보냅니다. 그러나 block inclusion 전 다른 거래가 reserve를 바꿀 수 있으므로 quote는 서명이 아닙니다. 사용자는 path·recipient·<code>amountOutMin</code> 또는 <code>amountInMax</code>·deadline을 transaction에 넣어야 합니다.</p>
      </div>
      <ModernV2Viz mode="router" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-sm">
          <thead><tr className="border-b"><th className="p-3 text-left">경계</th><th className="p-3 text-left">막는 실패</th><th className="p-3 text-left">막지 못하는 것</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-3 font-semibold">amountOutMin</td><td className="p-3">허용치보다 나쁜 최종 output</td><td className="p-3">허용 범위 안의 MEV·gas 낭비</td></tr>
            <tr className="border-b"><td className="p-3 font-semibold">deadline</td><td className="p-3">오래된 주문의 늦은 실행</td><td className="p-3">deadline 전 reserve 변화</td></tr>
            <tr><td className="p-3 font-semibold">path·recipient</td><td className="p-3">다른 pair·수신자로의 의도 변경</td><td className="p-3">악성·fee-on-transfer·rebasing token 의미</td></tr>
          </tbody>
        </table>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Token behavior는 invariant 바깥의 입력 계약이다</h3>
        <p>Pair는 callback 뒤 실제 balance로 입력을 관측하지만, Router가 중간 hop의 nominal amount를 다음 Pair에 그대로 전달한다고 가정하면 transfer fee가 있는 token에서 경로 계산이 어긋날 수 있습니다. “supportingFeeOnTransferTokens” 계열도 모든 rebasing·callback·blacklist token을 일반적으로 안전하게 만드는 보증이 아닙니다. Release fixture에는 nominal sent, received balance delta, final recipient delta를 따로 기록합니다.</p>
      </div>
    </section>
  );
}
