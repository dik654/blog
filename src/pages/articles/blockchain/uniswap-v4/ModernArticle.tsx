import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import UniswapV4FlowViz from "./viz/UniswapV4FlowViz";

export default function ModernUniswapV4Article() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Uniswap v4 · singleton settlement</p><h2 className="text-3xl font-bold tracking-tight">V4는 AMM 곡선을 폐기한 버전이 아니라 여러 pool state와 net settlement를 한 PoolManager에 모은 core다</h2></header>
      <p className="text-lg leading-8 text-foreground/90"><Link className="text-primary underline-offset-4 hover:underline" to="/blockchain/uniswap-v3#overview">V3의 concentrated liquidity·tick·swap step</Link>을 재사용하면서 배치 방식을 바꿉니다. Pool마다 contract를 배포하는 대신 하나의 <code>PoolManager</code>가 <code>PoolKey</code>로 pool state를 구분합니다. 고정 사례는 같은 unlock callback 안에서 pool A swap과 pool B liquidity action을 실행한 뒤 token0 delta +30, token1 delta -20을 각각 settle해 둘 다 0으로 만드는 transaction입니다.</p>
      <ContentBoundary article="uniswap-v4" />
      <UniswapV4FlowViz />
      <div id="paper-uniswap-v4-core"><CitationBlock source="Uniswap v4-core v4.0.0 (pinned)" citeKey={1} type="code" href="https://github.com/Uniswap/v4-core/tree/e50237c43811bd9b526eff40f26772152a42daba"><p><strong>문제:</strong> 여러 pools·hooks·native currency 작업을 한 core에서 조합하면서 마지막 token obligations를 강제해야 합니다.</p><p><strong>기여:</strong> PoolManager singleton, PoolKey/PoolId, unlock callback, delta accounting, hook flags와 pool actions의 executable source를 제공합니다.</p><p><strong>전제:</strong> v4.0.0 tag commit e50237c4와 해당 Solidity/EVM semantics를 고정합니다.</p><p><strong>근거 범위:</strong> Pinned v4 core contract의 state·callback·settlement behavior입니다.</p><p><strong>말하지 않는 것:</strong> 임의 router·hook의 안전성, LP 수익, 현재 deployment 주소·fee나 front-end quote를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="singleton-pool-key" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · PoolKey</p><h2 className="mt-2 text-2xl font-bold">Pool identity는 token pair만이 아니라 currencies·fee·tickSpacing·hooks 전체다</h2></header>
      <p><code>PoolKey</code>의 currency0·currency1은 정렬돼야 하며 fee, tick spacing과 hook address까지 같아야 같은 PoolId가 나옵니다. Initialize는 initial sqrt price와 hook validation을 거쳐 state를 만들지만, swap·modifyLiquidity·donate·take·settle 같은 delta-changing action은 보통 unlock context 안에서 수행합니다. V3의 tick math를 알더라도 다른 hook address를 같은 pool로 cache하면 안 됩니다.</p>
      <p>PoolManager는 여러 pools를 한 contract에 담지만 회계 isolation을 없애지 않습니다. PoolId별 price·liquidity·ticks와 caller별 currency delta가 서로 다른 key space에 있습니다.</p>
    </section>

    <section id="hook-permission-boundary" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · hooks</p><h2 className="mt-2 text-2xl font-bold">Hook address bits는 호출 가능한 callback surface를 고정하지만 hook code를 신뢰할 수 있게 만들지는 않는다</h2></header>
      <p>Hook는 initialize, add/remove liquidity, swap, donate 전후 callback 일부를 구현합니다. Permission flags는 hook address의 bit pattern과 일치해야 하며 pool initialization 뒤 어떤 callbacks가 실행될지는 바뀌지 않습니다. 일부 flags는 hook-returned delta까지 허용합니다. 하지만 올바른 selector와 flag는 business logic·access control·oracle·upgrade 안전성의 인증서가 아닙니다.</p>
      <p>Integration은 hook codehash/version, permissions, dynamic fee, returned delta bound, revert behavior와 caller identity를 검증합니다. 특히 hook이 보는 <code>sender</code>가 end user가 아니라 router일 수 있는 boundary를 application policy에 반영합니다.</p>
      <div id="paper-uniswap-v4-hooks"><CitationBlock source="Uniswap v4 · Hooks concept and Hooks.sol" citeKey={2} type="code" href="https://github.com/Uniswap/v4-core/blob/e50237c43811bd9b526eff40f26772152a42daba/src/libraries/Hooks.sol"><p><strong>문제:</strong> Pool lifecycle 확장을 허용하되 어떤 callback·return-delta surface가 활성화되는지 pool identity에 고정해야 합니다.</p><p><strong>기여:</strong> Hook permission flags, address validation, callback dispatch와 response validation을 구현합니다.</p><p><strong>전제:</strong> Pinned v4.0.0 flag layout·IHooks interface·PoolKey를 사용합니다.</p><p><strong>근거 범위:</strong> Hook 호출 여부와 core-level validation surface입니다.</p><p><strong>말하지 않는 것:</strong> Hook code의 경제적 안전성·upgrade governance·router user attribution·감사 완료를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="flash-accounting-release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · unlock and release</p><h2 className="mt-2 text-2xl font-bold">Flash accounting의 invariant는 각 중간 transfer가 아니라 unlock 종료 시 모든 nonzero currency delta가 사라지는 것이다</h2></header>
      <p>Caller가 <code>unlock</code>을 호출하면 PoolManager는 caller의 <code>unlockCallback</code>으로 제어를 넘깁니다. Callback은 여러 actions를 조합하며 caller가 받을 금액은 positive delta, pool에 낼 금액은 negative delta로 netting합니다. <code>take</code>, <code>sync</code>·<code>settle</code>, ERC-6909 claims 등을 올바른 방향으로 적용하고 callback 반환 시 nonzero delta count가 0이 아니면 transaction 전체가 revert합니다.</p>
      <ExplainedFormula question="여러 V4 actions를 마친 뒤 unlock이 성공하려면 currency별 무엇이 0이어야 하나요?" idea="각 currency의 credits와 debits를 net delta로 합산하고, callback 반환 전에 모든 currency를 settle합니다." formula={String.raw`\begin{aligned}\Delta_c&=\sum_k credit_{c,k}-\sum_k debit_{c,k}\\\forall c,\quad\Delta_c&=0\end{aligned}`} terms={[{symbol:"c",name:"currency identity",description:"Native currency 또는 token address로 구분한 회계 단위입니다."},{symbol:"credit_c,k",name:"caller credit",description:"Action k가 caller에게 받을 권리를 만든 amount입니다."},{symbol:"debit_c,k",name:"caller debt",description:"Action k가 caller가 PoolManager에 낼 의무를 만든 amount입니다."},{symbol:"Δ_c",name:"net currency delta",description:"Unlock context에서 caller와 PoolManager 사이에 남은 currency별 순 obligation입니다."}]} assumptions={["같은 caller unlock context와 exact currency identity를 사용합니다.","Signed delta direction을 integration contract에서 한 번 고정합니다.","ERC20 settle 전 sync와 actual received balance를 검증합니다.","Delta zero는 AMM price quality·hook safety·external transfer finality를 보장하지 않습니다."]} interpretation="Token0 credit 50과 debit 20이면 Δ0=+30이므로 take 30이 필요합니다. Token1 debit 20이면 settle 20이 필요합니다. 둘 중 하나라도 남으면 unlock 전체가 revert합니다." />
      <div id="paper-uniswap-v4-whitepaper"><CitationBlock source="Uniswap v4 Core whitepaper" citeKey={3} href="https://app.uniswap.org/whitepaper-v4.pdf"><p><strong>문제:</strong> AMM customization과 multi-pool routing의 deployment·transfer 비용을 줄이면서 atomic settlement를 유지해야 합니다.</p><p><strong>기여:</strong> Singleton, hooks, flash accounting, native ETH와 custom accounting architecture를 제안합니다.</p><p><strong>전제:</strong> Whitepaper의 EVM transient-storage·singleton execution model과 V4 design scope입니다.</p><p><strong>근거 범위:</strong> V4 architectural motivation과 accounting design입니다.</p><p><strong>말하지 않는 것:</strong> 모든 hook·router의 안전성, gas 절감 폭, liquidity·price execution을 보장하지 않습니다.</p></CitationBlock></div>
      <p>Release fixture는 wrong PoolKey, invalid hook flag, hook revert, malicious returned delta, unsynced ERC20, under-settlement와 nested unlock을 주입합니다. Pinned core tag·hook codehash·router version·pool key·events/reverts·gas를 함께 비교하고, 실패 시 기존 router로 되돌리되 이미 finalized transaction을 되감는다고 표현하지 않습니다.</p>
    </section>
  </article>;
}
