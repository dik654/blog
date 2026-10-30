import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import DefiDexLocator, { DefiDexMapReturn } from "../DefiDexLocator";
import { uniswapV4Tree } from "./fileTrees";
import { officialUniswapV4CodeRefs } from "./officialCodeRefs";
import UniswapV4FlowViz from "./viz/UniswapV4FlowViz";

const COMMIT = "e50237c43811bd9b526eff40f26772152a42daba";
const SOURCE = `https://github.com/Uniswap/v4-core/tree/${COMMIT}`;

export default function ModernUniswapV4Article() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <DefiDexLocator
          currentSlug="uniswap-v4"
          region="PoolManager singleton·hook·unlock 정산"
          question="Router가 100 token0을 넣고 98 token1을 받을 때, 계산 결과는 어떻게 실제 송금으로 바뀝니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            PoolManager가 계산한 -100과 +98을 누가 어떻게 0으로 만듭니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            공식 v4.0.0 테스트의 정확입력 교환 한 건을 따라갑니다. Router는 token0 100을 내야 하는
            음수 delta와 token1 98을 받을 수 있는 양수 delta를 얻습니다. 이 두 값이 실제 token 이동을
            거쳐 모두 0이 되어야 transaction이 성공합니다.
          </p>
        </div>

        <UniswapV4FlowViz />

        <p className="text-lg leading-8">
          <strong>V4가 V3의 교환 수학을 버린 것은 아닙니다.</strong> 가격 구간과 활성 유동성을 계산하는
          pool logic은 이어집니다. 달라진 핵심은 여러 pool의 상태를 하나의 <code>PoolManager</code>에
          두고, action 결과를 즉시 송금하는 대신 router별 임시 장부에 기록한 뒤 한 번에 정산한다는 점입니다.
        </p>
        <p>
          앞선 <Link to="/cs/blockchain/uniswap-v3#overview" className="font-bold text-primary hover:underline">Uniswap V3</Link> 글은
          pool 안에서 가격이 tick 경계를 지나는 계산을 다뤘습니다. 이 글은 그 계산을 다시 설명하지 않고,
          <strong> 어떤 pool state를 고르고, hook를 거쳐, 계산 결과를 실제 token 이동으로 확정하는지</strong>를
          소유합니다.
        </p>
        <ContentBoundary article="uniswap-v4" />
      </section>

      <section id="singleton-pool-key" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Singleton은 여러 pool의 가격과 유동성을 한 장부로 섞는다는 뜻이 아닙니다</h2>
        <p>
          PoolManager 계약은 하나지만 pool state는 <code>PoolId</code>별로 나뉩니다. PoolId는
          <code>currency0</code>, <code>currency1</code>, <code>fee</code>, <code>tickSpacing</code>,
          <code>hooks</code>를 담은 PoolKey 전체를 해시해 만듭니다. 같은 token pair라도 수수료나 hook
          주소가 다르면 다른 pool입니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["계약 주소", "PoolManager 하나", "모든 pool action의 공통 진입점"],
            ["상태 주소", "PoolId마다 별도", "가격·tick·liquidity는 서로 분리"],
            ["호출 자료", "PoolKey를 매번 전달", "Key를 잘못 보내면 다른 pool을 가리킴"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[10px] font-bold text-primary">{label}</span>
              <strong className="mt-2 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="PoolKey에서 PoolId 만들기" onClick={() => sidebar.open("v4-pool-key", officialUniswapV4CodeRefs["v4-pool-key"])} />
        </div>
        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">같이 보아야 할 경계:</strong> PoolKey는 storage에 원본 그대로 저장되지
          않으므로 caller가 맞는 값을 제공해야 합니다. Hook 주소도 pool identity의 일부라서 hook를 바꾸면 기존
          pool의 설정 변경이 아니라 다른 PoolId가 됩니다.
        </aside>
      </section>

      <section id="unlock-callback" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">PoolManager는 router에게 실행 순서를 맡기고 마지막 잔액만 강제합니다</h2>
        <p>
          사용자가 PoolManager의 <code>swap</code>을 직접 호출하면 잠겨 있어서 실패합니다. 먼저 router가
          <code>unlock(data)</code>을 호출해야 합니다. PoolManager는 잠금을 열고 그 router의
          <code>unlockCallback(data)</code>을 호출합니다. Callback 안에서만 router가 swap, 정산, 인출을
          이어서 실행합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["1", "Router", "unlock(data)"],
            ["2", "PoolManager", "lock 열기"],
            ["3", "Router callback", "swap·settle·take"],
            ["4", "PoolManager", "delta count 확인"],
            ["5", "Transaction", "성공 또는 전체 revert"],
          ].map(([order, owner, action]) => (
            <div key={order} className="relative min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{order}</span>
              <strong className="mt-2 block break-keep text-xs leading-5">{owner}</strong>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{action}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Unlock의 마지막 검사" onClick={() => sidebar.open("v4-unlock", officialUniswapV4CodeRefs["v4-unlock"])} />
          <CodeViewButton label="공식 테스트 router의 callback" onClick={() => sidebar.open("v4-router-settlement", officialUniswapV4CodeRefs["v4-router-settlement"])} />
        </div>
        <p>
          Router가 실행 순서를 정한다는 말은 마음대로 잔액을 남겨도 된다는 뜻이 아닙니다. PoolManager는
          caller와 currency마다 transient delta를 소유하고, callback이 돌아온 순간 nonzero delta의 개수가
          0이 아니면 <code>CurrencyNotSettled</code>로 전체 transaction을 거절합니다.
        </p>
      </section>

      <section id="hook-permission-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Hook 주소는 실행 지점을 표시하지만 그 코드가 안전하다는 인증서는 아닙니다</h2>
        <p>
          Hook 주소의 하위 14비트는 initialize, 유동성 변경, swap, donate 전후의 어느 callback을 호출할지
          나타냅니다. 별도 flag가 있으면 hook가 swap이나 유동성 변경의 delta를 보완해 반환할 수도 있습니다.
          PoolManager는 flag 조합과 callback selector를 확인하지만, hook의 가격 정책·접근 권한·업그레이드가
          사용자에게 안전한지는 판정하지 않습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Core가 확인", "주소 flag와 callback 조합", "예정된 함수가 올바른 selector를 반환하는지"],
            ["Hook가 결정", "수수료·접근 정책·추가 회계", "허용된 callback 안의 실제 business logic"],
            ["통합자가 확인", "codehash·권한·업그레이드", "사용자 identity와 불리한 delta 가능성"],
          ].map(([owner, subject, detail]) => (
            <div key={owner} className="min-w-0 bg-background p-4">
              <span className="text-[10px] font-bold text-primary">{owner}</span>
              <strong className="mt-2 block break-keep text-xs leading-5">{subject}</strong>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Hook 주소의 14개 flag" onClick={() => sidebar.open("v4-hook-flags", officialUniswapV4CodeRefs["v4-hook-flags"])} />
          <CodeViewButton label="Swap과 hook 호출 순서" onClick={() => sidebar.open("v4-swap-account", officialUniswapV4CodeRefs["v4-swap-account"])} />
        </div>
        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          Permissioned Pools처럼 wallet 권한을 검사하는 구조도 hook의 한 응용입니다. 이는 Uniswap V4 core가 모든
          pool에 신원 확인을 제공한다는 뜻이 아닙니다. 어떤 주소를 최종 사용자로 볼지, 우회 가능한 router가
          있는지, 권한 변경 뒤 LP position을 어떻게 처리할지는 해당 응용 계약의 별도 책임입니다.
        </aside>
      </section>

      <section id="flash-accounting-settlement" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">음수는 낼 돈, 양수는 받을 돈이며 두 값을 실제 token 이동으로 없앱니다</h2>
        <p>
          공식 fixture에서 <code>zeroForOne=true</code>, <code>amountSpecified=-100</code>은 token0 100을
          정확입력한다는 뜻입니다. Swap 결과는 <code>amount0=-100</code>, <code>amount1=+98</code>입니다.
          이 부호는 pool reserve가 아니라 router의 장부 관점입니다. Router는 token0 100을 내야 하고 token1
          98을 받을 수 있습니다.
        </p>
        <ExplainedFormula
          question="Router의 두 currency delta가 어떻게 0이 됩니까?"
          idea="Swap이 만든 debt에는 실제 입금을 더하고, credit에는 실제 인출을 빼서 callback 끝의 잔액을 0으로 만듭니다."
          formula={String.raw`\Delta_0=-100+100=0,\qquad \Delta_1=+98-98=0`}
          annotatedFormula={String.raw`\Delta_0=\underbrace{-100}_{\text{swap debt}}+\underbrace{100}_{\text{sync·transfer·settle}}=0,\qquad \Delta_1=\underbrace{+98}_{\text{swap credit}}-\underbrace{98}_{\text{take}}=0`}
          operations={[
            { expression: String.raw`\Delta_0=-100`, annotation: ["Router가 PoolManager에 token0 100을 내야 합니다."] },
            { expression: String.raw`-100+100=0`, annotation: ["Sync 뒤 실제 잔액이 100 늘어난 것을 settle이 확인합니다."] },
            { expression: String.raw`\Delta_1=+98`, annotation: ["Router가 token1 98을 꺼낼 수 있는 권리를 가집니다."] },
            { expression: String.raw`+98-98=0`, annotation: ["Take가 credit을 줄이고 사용자에게 token1을 보냅니다."] },
          ]}
          terms={[
            { symbol: String.raw`\Delta_0`, name: "Router의 token0 delta", description: "음수이면 PoolManager에 내야 하는 debt입니다." },
            { symbol: String.raw`\Delta_1`, name: "Router의 token1 delta", description: "양수이면 PoolManager에서 꺼낼 수 있는 credit입니다." },
            { symbol: "NonzeroDeltaCount", name: "미정산 currency 수", description: "Delta가 0에서 nonzero 또는 반대로 바뀔 때만 증감하는 transient counter입니다." },
          ]}
          assumptions={[
            "공식 v4.0.0 fixture의 initialized pool, liquidity 1e18, fee 3000과 price limit를 사용합니다.",
            "Hook가 swap delta를 추가로 바꾸지 않는 fixture입니다.",
            "ERC-20 지급은 sync 뒤 PoolManager의 실제 잔액 증가로 확인합니다.",
          ]}
          interpretation="Swap 직후에는 미정산 currency가 두 개입니다. Token0을 settle하면 하나, token1을 take하면 0이 됩니다. 금액이 부족하거나 한 단계를 빼면 callback의 다른 작업까지 모두 revert됩니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Sync·settle·take의 장부 변화" onClick={() => sidebar.open("v4-settle-take", officialUniswapV4CodeRefs["v4-settle-take"])} />
          <CodeViewButton label="Swap 결과를 router에 기록" onClick={() => sidebar.open("v4-swap-account", officialUniswapV4CodeRefs["v4-swap-account"])} />
        </div>
        <p>
          Flash accounting의 장점은 callback 안에서 여러 action의 중간 전송을 줄이고 currency별 순액만 마지막에
          처리할 수 있다는 점입니다. 그러나 이 글의 한 교환에서는 상계 구조 자체만 확인합니다. 여러 pool을
          거치는 route의 gas 절감 폭이나 특정 hook의 가격 품질은 별도 측정 없이 단정하지 않습니다.
        </p>
      </section>

      <section id="failure-source" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정산이 끝나지 않으면 pool 상태와 전송도 함께 되돌아갑니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["잠긴 상태에서 swap", "ManagerLocked", "unlock callback 전에 거절"],
            ["중첩 unlock", "AlreadyUnlocked", "열린 회계 구간 안에서 재진입 거절"],
            ["Token0 99만 입금", "delta0=-1", "CurrencyNotSettled로 전체 revert"],
            ["Token1 take 생략", "delta1=+98", "Pool 가격 변화와 지급도 복원"],
          ].map(([cause, result, effect]) => (
            <div key={cause} className="min-w-0 bg-background p-4">
              <strong className="break-keep text-xs leading-5">{cause}</strong>
              <p className="mt-2 text-[10px] font-bold leading-5 text-destructive">{result}</p>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{effect}</p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          여기서 설명하는 것은 protocol transaction의 실패 동작입니다. Router 배포 롤백, hook 감사, gas 기준,
          mainnet 주소 교체와 장애 대응 Runbook은 특정 운영 환경의 실무 글에서 다뤄야 합니다.
        </p>

        <div id="paper-uniswap-v4-core" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={1} source="Uniswap/v4-core · v4.0.0 · commit e50237c" href={SOURCE}>
            <p><strong>문제:</strong> 여러 pool action과 hook 결과를 한 singleton에서 실행하면서 마지막 token 의무를 원자적으로 강제해야 합니다.</p>
            <p><strong>핵심 기여:</strong> PoolManager, PoolKey/PoolId, unlock callback, transient delta와 hook flag의 실행 코드를 제공합니다.</p>
            <p><strong>고정한 버전:</strong> lightweight tag <code>v4.0.0</code>이 직접 가리키는 commit <code>{COMMIT.slice(0, 12)}</code>입니다.</p>
            <p><strong>일반화 금지:</strong> 임의 router·hook의 안전성, 현재 배포 주소, LP 수익, 특정 route의 gas 절감을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-uniswap-v4-hooks" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={2} source="Uniswap/v4-core · Hooks.sol · commit e50237c" href={`https://github.com/Uniswap/v4-core/blob/${COMMIT}/src/libraries/Hooks.sol`}>
            <p><strong>문제:</strong> 어떤 lifecycle callback과 return-delta 권한이 활성화됐는지 pool identity에 고정해야 합니다.</p>
            <p><strong>핵심 기여:</strong> 하위 14비트 flag, permission/address 검증, callback 응답 검사를 구현합니다.</p>
            <p><strong>근거 범위:</strong> Core가 어느 hook 함수를 언제 부르고 어떤 형태를 거절하는지입니다.</p>
            <p><strong>일반화 금지:</strong> Hook의 경제 정책·접근 제어·업그레이드·oracle이 안전하다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-uniswap-v4-whitepaper" className="scroll-mt-24">
          <CitationBlock type="paper" citeKey={3} source="Adams et al. · Uniswap v4 Core whitepaper" href="https://app.uniswap.org/whitepaper-v4.pdf">
            <p><strong>문제:</strong> AMM 확장과 여러 action의 조합에서 반복 배포·중간 전송 비용을 줄여야 합니다.</p>
            <p><strong>핵심 기여:</strong> Singleton, hooks, flash accounting, custom accounting의 설계를 제시합니다.</p>
            <p><strong>근거 범위:</strong> V4 architecture의 동기와 개념적 accounting model입니다.</p>
            <p><strong>일반화 금지:</strong> 모든 hook·route가 싸거나 안전하고 좋은 가격을 제공한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">[O] 확인한 범위:</strong> GitHub의 <code>v4.0.0</code> tag와 commit
          <code> e50237c</code>가 일치함을 확인했습니다. <code>PoolManagerTest.test_swap_succeedsIfInitialized</code>의
          기대 이벤트는 amount0 -100, amount1 +98, fee 3000입니다. 이 환경에는 <code>forge</code>가 없어
          공식 테스트를 다시 실행하지 않았으므로 [M] 측정 결과로 표현하지 않습니다.
        </aside>
      </section>

      <DefiDexMapReturn
        currentSlug="uniswap-v4"
        closure="Uniswap V4는 여러 pool을 하나의 PoolManager에 두되 PoolKey 전체로 상태를 분리합니다. Router가 unlock callback 안에서 swap을 실행하면 결과는 caller별 currency debt·credit으로 기록되고, settle과 take로 모두 0이 되어야 가격 변화와 token 이동이 한 transaction의 최종 상태로 남습니다. Hook 주소 flag는 이 경로의 확장 지점을 정하지만 hook 코드의 안전성까지 보장하지는 않습니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialUniswapV4CodeRefs}
        fileTrees={{ "uniswap-v4": uniswapV4Tree }}
        projectMetas={{
          "uniswap-v4": {
            id: "uniswap-v4",
            label: "Uniswap v4-core · v4.0.0 · e50237c",
            badgeClass: "border-pink-500 bg-pink-500/10 text-pink-700",
          },
        }}
      />
    </article>
  );
}
