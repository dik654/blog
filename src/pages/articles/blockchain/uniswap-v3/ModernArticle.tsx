import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import DefiDexLocator, { DefiDexMapReturn } from "../DefiDexLocator";
import { officialUniswapV3CodeRefs } from "./officialCodeRefs";
import { uniswapV3Tree } from "./fileTrees";
import { PriceEncodingViz, UniswapV3LifecycleViz } from "./viz/UniswapV3LifecycleViz";

const TAG_OBJECT = "ef64f51d0f0dca5346c903484f3e6a771dd69d59";
const COMMIT = "e3589b192d0be27e100cd0daaf6c97204fdb1899";
const SOURCE = `https://github.com/Uniswap/v3-core/tree/${COMMIT}/contracts`;
const TAG = "https://github.com/Uniswap/v3-core/releases/tag/v1.0.0";

export default function ModernUniswapV3Article() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <DefiDexLocator
          currentSlug="uniswap-v3"
          region="가격 구간·활성 유동성·구간별 수수료·단계별 교환"
          question="한 사람이 넣은 40 token1이 두 가격 구간을 지나면, 어느 유동성이 쓰이고 누가 수수료를 받습니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            가격이 경계를 지날 때 교환 계산과 수수료 주인이 어떻게 바뀝니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            Alice는 제곱근 가격 1부터 3까지 유동성 60을 둡니다. Bob은 2.5부터 3.5까지 40을 둡니다.
            현재 값 2에서 시작해 교환자가 token1 40을 넣는 한 번의 호출을 따라가겠습니다.
          </p>
        </div>

        <UniswapV3LifecycleViz />

        <p className="text-lg leading-8">
          <strong>Uniswap V3가 모든 유동성을 한꺼번에 쓰는 것은 아닙니다.</strong> 현재 가격을 덮는 구간의
          유동성만 계산에 참여합니다. 그래서 2에서 시작할 때는 Alice의 60만 쓰고, 2.5를 넘은 뒤에는 Bob의
          40이 더해져 100을 씁니다.
        </p>
        <p>
          앞선 <Link to="/cs/blockchain/uniswap-v2#overview" className="font-bold text-primary hover:underline">Uniswap V2</Link>에서
          본 일정한 곱의 곡선은 사라지지 않았습니다. V3는 그 곡선을 LP가 선택한 가격 구간으로 나누고,
          경계 안에 있는 조각만 현재 교환에 사용합니다. 이 글은 그 구간이 실제 코드의 가격·수수료·교환
          상태로 바뀌는 과정만 소유합니다.
        </p>
      </section>

      <section id="tick-math" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">같은 가격을 사람과 코드가 서로 다른 형태로 적습니다</h2>
        <PriceEncodingViz />
        <p>
          사람이 보는 가격을 <strong>P</strong>라고 하겠습니다. Core는 가격 변화의 위치를 정수 번호인
          <strong> tick</strong>으로 찾고, 실제 양 계산에는 가격의 제곱근을 2<sup>96</sup>배 한 정수
          <strong> sqrtPriceX96</strong>을 사용합니다. Position이 시작하고 끝나는 곳은 tick spacing의
          배수여야 하지만, 교환 중 현재 tick은 그 사이를 지나갈 수 있습니다.
        </p>
        <ExplainedFormula
          question="가격과 저장된 제곱근 가격은 어떻게 같은 상태를 가리킵니까?"
          idea="가격의 곱셈 눈금을 정수 tick으로 바꾸고, 제곱근을 Q64.96 정수로 저장하면 EVM에서 같은 계산을 재현할 수 있습니다."
          formula={String.raw`P(i)=1.0001^i,\qquad \texttt{sqrtPriceX96}=\left\lfloor\sqrt P\,2^{96}\right\rfloor`}
          annotatedFormula={String.raw`P(i)=\underbrace{1.0001^i}_{\text{정수 가격 눈금}},\qquad \texttt{sqrtPriceX96}=\Bigl\lfloor\underbrace{\sqrt P}_{\text{가격의 제곱근}}\,\underbrace{2^{96}}_{\text{Q64.96 배율}}\Bigr\rfloor`}
          operations={[
            { expression: String.raw`1.0001^0=1`, annotation: ["tick 0은 raw token 단위에서 P=1을 가리킵니다."] },
            { expression: String.raw`\sqrt 1\times2^{96}=2^{96}`, annotation: ["P=1이면 저장된 sqrtPriceX96은 정확히 2⁹⁶입니다."] },
            { expression: String.raw`i\approx\log_{1.0001}(4)\approx13864`, annotation: ["설명용 √P=2는 P=4이므로 가까운 tick은 약 13,864입니다. 실제 경계는 정수 반올림과 spacing을 따릅니다."] },
          ]}
          terms={[
            { symbol: "P", name: "Raw token price", description: "token1/token0 방향의 원시 단위 가격입니다. UI decimals 보정 전입니다." },
            { symbol: "i", name: "Tick", description: "가격을 1.0001의 정수 지수로 찾는 위치 번호입니다." },
            { symbol: "2^{96}", name: "Q64.96 scale", description: "제곱근 가격의 소수 부분 96비트를 정수 안에 보존하는 배율입니다." },
          ]}
          assumptions={[
            "token0과 token1의 순서, raw decimals와 가격 방향을 먼저 고정합니다.",
            "본문의 1·2·2.5·3.5는 흐름을 보기 위한 연속값이며 실제 initialized tick은 spacing 제약을 적용합니다.",
          ]}
          interpretation="tick, sqrtPriceX96과 UI 가격은 서로 다른 장부가 아니라 같은 가격을 쓰는 방식입니다. 어느 하나를 바꿔 계산하면 나머지도 같은 방향과 반올림 규칙으로 다시 확인해야 합니다."
        />

        <ExplainedFormula
          question="현재 √P=2일 때 Alice의 구간에는 token0과 token1이 얼마씩 있습니까?"
          idea="범위 안에서는 오른쪽 경계까지 남은 역수 거리가 token0, 왼쪽 경계에서 이동한 제곱근 거리가 token1의 몫을 정합니다."
          formula={String.raw`x=L\frac{\sqrt{p_b}-\sqrt P}{\sqrt P\sqrt{p_b}},\qquad y=L(\sqrt P-\sqrt{p_a})`}
          annotatedFormula={String.raw`x=\underbrace{60\frac{3-2}{2\times3}}_{\text{token0 10}},\qquad y=\underbrace{60(2-1)}_{\text{token1 60}}`}
          operations={[
            { expression: String.raw`60\times(3-2)/(2\times3)=10`, annotation: ["오른쪽 경계 √pᵦ=3에 가까워질수록 token0은 0으로 줄어듭니다."] },
            { expression: String.raw`60\times(2-1)=60`, annotation: ["왼쪽 경계 √pₐ=1에서 멀어진 만큼 token1이 늘어납니다."] },
            { expression: String.raw`P\le p_a:\ (x,y)=(40,0)`, annotation: ["범위 왼쪽에서는 전부 token0입니다. 오른쪽에서는 (0,120)이 됩니다."] },
          ]}
          terms={[
            { symbol: "L", name: "Liquidity", description: "이 position이 자기 범위 안에서 제공하는 계산 단위입니다." },
            { symbol: "p_a,p_b", name: "Range bounds", description: "Position이 시작하고 끝나는 가격입니다." },
            { symbol: "x,y", name: "Token amounts", description: "현재 가격에서 position에 해당하는 token0·token1 양입니다." },
          ]}
          assumptions={["pₐ<P<pᵦ인 범위 안 식입니다.", "실제 mint·burn은 지급 방향에 따라 정수 반올림을 다르게 적용합니다."]}
          interpretation="현재 Alice는 두 token을 함께 가집니다. 가격이 구간 밖으로 나가면 한쪽 token만 남고 해당 position은 교환과 새 수수료 누적에 참여하지 않습니다."
        />
        <ContentBoundary article="uniswap-v3" />
      </section>

      <section id="swap-algorithm" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Pool은 다음 유동성 경계까지만 계산하고 남은 입력을 다시 돌립니다</h2>
        <p>
          정확입력 40에서 0.3%를 한꺼번에 빼고 끝까지 같은 식을 쓰면 중간 경계의 유동성 변화를 놓칩니다.
          Core는 현재 위치에서 다음 initialized tick과 사용자가 정한 price limit 중 먼저 닿는 곳을 고릅니다.
          그곳까지 한 step을 계산하고, 경계를 통과했다면 active liquidity를 바꾼 뒤 남은 입력으로 반복합니다.
        </p>
        <ExplainedFormula
          question="첫 구간과 둘째 구간에서 입력과 출력은 어떻게 이어집니까?"
          idea="token1을 넣어 가격이 오른쪽으로 갈 때 순입력은 L과 제곱근 가격 거리의 곱이고, token0 출력은 역수 거리의 곱입니다."
          formula={String.raw`\Delta y=L(\sqrt P_1-\sqrt P_0),\qquad \Delta x=L\left(\frac1{\sqrt P_0}-\frac1{\sqrt P_1}\right)`}
          annotatedFormula={String.raw`\Delta y_1=\underbrace{60(2.5-2)}_{30},\quad \Delta x_1=\underbrace{60(1/2-1/2.5)}_{6},\quad \sqrt P_2=\underbrace{2.5+9.88/100}_{2.5988}`}
          operations={[
            { expression: String.raw`30/(1-0.003)\approx30.0903`, annotation: ["첫 경계까지 순입력 30이 필요하므로 수수료를 포함한 총입력은 약 30.0903입니다."] },
            { expression: String.raw`40-30.0903\approx9.9097`, annotation: ["경계를 넘은 뒤 다시 계산할 총입력입니다."] },
            { expression: String.raw`9.9097\times0.997\approx9.88`, annotation: ["둘째 구간에 실제 가격 이동으로 쓰이는 순입력입니다."] },
            { expression: String.raw`6+100(1/2.5-1/2.5988)\approx7.5207`, annotation: ["두 step의 token0 출력을 더한 설명용 연속값입니다."] },
          ]}
          terms={[
            { symbol: String.raw`\Delta y`, name: "Token1 net input", description: "수수료를 뺀 뒤 가격 이동에 실제로 쓰인 token1입니다." },
            { symbol: String.raw`\Delta x`, name: "Token0 output", description: "해당 step에서 pool이 내보내는 token0입니다." },
            { symbol: String.raw`\sqrt P_0,\sqrt P_1`, name: "Step prices", description: "한 step의 시작과 목표 제곱근 가격입니다." },
          ]}
          assumptions={[
            "연속값으로 순서를 설명하며 실제 Q64.96 정수 반올림 결과와 동일하다고 주장하지 않습니다.",
            "Protocol fee는 0이고 LP fee tier는 0.3%라고 가정합니다.",
            "첫 경계에서 Bob의 liquidityNet +40이 오른쪽 이동 방향으로 더해집니다.",
          ]}
          interpretation="첫 step은 L=60, 둘째 step은 L=100을 씁니다. 총입력 40과 총수수료 0.12는 같아도 어느 구간에서 수수료가 생겼는지에 따라 Alice와 Bob의 몫이 달라집니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Pool의 반복문" onClick={() => sidebar.open("v3-swap-loop", officialUniswapV3CodeRefs["v3-swap-loop"])} />
          <CodeViewButton label="한 step의 가격·수수료 계산" onClick={() => sidebar.open("v3-compute-step", officialUniswapV3CodeRefs["v3-compute-step"])} />
        </div>
        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">코드에서 확인할 핵심:</strong> <code>while</code> 조건은 남은 입력과
          price limit를 함께 봅니다. 각 반복에서 bitmap으로 다음 경계를 찾고, <code>computeSwapStep</code>이
          target 도달 또는 입력 소진을 판정합니다. 전체 경로를 한 번의 평균 유동성으로 계산하지 않습니다.
        </aside>
      </section>

      <section id="position-nft" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">경계를 넘으면 활성 유동성과 수수료 구간이 함께 바뀝니다</h2>
        <p>
          유동성이 시작하거나 끝나는 경계를 <strong>initialized tick</strong>이라고 합니다. 경계를 오른쪽으로
          넘을 때 더하거나 뺄 양은 <strong>liquidityNet</strong>에 저장합니다. 같은 경계에는 수수료 누적값이
          어느 쪽에서 생겼는지 가르는 <strong>feeGrowthOutside</strong>도 있습니다.
        </p>
        <p>
          첫 step의 수수료 약 0.0903은 Alice의 60만 활성일 때 생깁니다. 경계를 넘은 뒤 약 0.0297은
          Alice 60과 Bob 40이 함께 활성일 때 생기므로 60:40으로 나뉩니다. 설명용 연속값으로 Alice는 약
          0.1081, Bob은 약 0.0119를 얻습니다.
        </p>
        <ExplainedFormula
          question="Pool 전체 누적값에서 한 position의 수수료만 어떻게 꺼냅니까?"
          idea="전체 per-liquidity 누적값에서 현재 range 아래와 위의 몫을 빼고, 마지막 position snapshot 이후 증가분만 유동성에 곱합니다."
          formula={String.raw`f_{inside}=f_{global}-f_{below}-f_{above},\qquad fee=L\,(f_{inside}-f_{last})/2^{128}`}
          annotatedFormula={String.raw`f_{inside}=\underbrace{f_{global}}_{\text{풀 전체}}-\underbrace{f_{below}-f_{above}}_{\text{구간 밖}},\qquad fee=\underbrace{L}_{\text{position 유동성}}\underbrace{(f_{inside}-f_{last})}_{\text{마지막 갱신 이후}}/\underbrace{2^{128}}_{\text{Q128 해제}}`}
          operations={[
            { expression: String.raw`f_{global}-f_{below}-f_{above}`, annotation: ["현재 tick의 위치에 따라 lower·upper 바깥쪽을 해석해 range 안의 성장만 남깁니다."] },
            { expression: String.raw`L(f_{inside}-f_{last})/2^{128}`, annotation: ["직전 snapshot 이후 증가분을 position의 유동성 양만큼 tokensOwed로 바꿉니다."] },
            { expression: String.raw`0.0903+0.0297\times0.6\approx0.1081`, annotation: ["Alice는 첫 구간 전부와 둘째 구간의 60%를 받는 설명용 결과입니다."] },
          ]}
          terms={[
            { symbol: String.raw`f_{global}`, name: "Global fee growth", description: "입력 token별 pool 전체의 Q128 per-liquidity 누적값입니다." },
            { symbol: String.raw`f_{below},f_{above}`, name: "Outside partitions", description: "현재 tick 방향에 따라 해석한 range 아래·위의 누적 몫입니다." },
            { symbol: String.raw`f_{last}`, name: "Position snapshot", description: "position이 마지막으로 갱신됐을 때의 inside growth입니다." },
          ]}
          assumptions={["같은 입력 token의 counter를 비교합니다.", "uint256 modular subtraction과 tick crossing의 outside flip은 고정된 core source 의미를 따릅니다."]}
          interpretation="Swap은 global과 tick 경계의 누적값을 바꿉니다. 각 position의 tokensOwed는 position update가 일어날 때 snapshot 차이를 계산해 늘어나며, NFT를 들고 있다는 이유만으로 매 swap마다 토큰이 자동 전송되지는 않습니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="경계 통과와 outside 전환" onClick={() => sidebar.open("v3-tick-cross", officialUniswapV3CodeRefs["v3-tick-cross"])} />
          <CodeViewButton label="Position 수수료 누적" onClick={() => sidebar.open("v3-position-update", officialUniswapV3CodeRefs["v3-position-update"])} />
        </div>
      </section>

      <section id="uniswap-v3-release-gate" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">대금을 덜 내면 앞선 계산도 모두 사라집니다</h2>
        <p>
          Pool은 계산된 token0 약 7.5207을 수신자에게 먼저 보낸 뒤 호출자에게 callback을 실행합니다.
          호출자는 약속한 token1 40을 같은 transaction 안에서 pool로 보내야 합니다. Callback 뒤 실제 잔액
          증가가 계산값보다 작으면 <code>IIA</code>로 revert되며, 새 가격·tick·fee growth와 출력 전송도 모두
          되돌아갑니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Callback 대금 확인" onClick={() => sidebar.open("v3-callback-settlement", officialUniswapV3CodeRefs["v3-callback-settlement"])} />
        </div>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["입력 0", "swap 시작", "AS로 revert", "상태 변화 없음"],
            ["price limit 방향 오류", "초기 검사", "SPL로 revert", "반복문 진입 전"],
            ["callback 재진입", "잠금 상태", "LOK로 revert", "중첩 swap 차단"],
            ["callback 미납", "잔액 검사", "IIA로 revert", "출력·가격도 복원"],
          ].map(([cause, stage, result, state]) => (
            <div key={cause} className="min-w-0 bg-background p-4">
              <strong className="break-keep text-xs">{cause}</strong>
              <p className="mt-2 text-[10px] leading-5 text-muted-foreground">지점 · {stage}</p>
              <p className="mt-1 text-[10px] leading-5 text-primary">{result}</p>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{state}</p>
            </div>
          ))}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          이 절은 프로토콜 자체의 실패 동작을 설명합니다. 특정 배포의 gas·수익률·운영 SLO나 교체 결정을
          다루는 실무 Runbook은 아닙니다.
        </p>
      </section>

      <section id="paper-uniswap-v3-whitepaper" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설계식과 실행 코드를 같은 증거로 취급하지 않습니다</h2>
        <CitationBlock type="paper" citeKey={1} source="Adams et al. · Uniswap v3 Core whitepaper" href="https://uniswap.org/whitepaper-v3.pdf">
          <p><strong>문제:</strong> LP 자본을 선택한 가격 구간에 집중하면서 position별 수수료와 oracle 값을 회계해야 합니다.</p>
          <p><strong>핵심 기여:</strong> shifted virtual reserves, ticks, liquidity amount와 inside fee-growth 설계를 제시합니다.</p>
          <p><strong>근거 범위:</strong> 이 글의 range 식과 회계 구조입니다.</p>
          <p><strong>일반화 금지:</strong> 좁은 range가 항상 더 높은 순수익을 내거나 impermanent loss가 사라진다는 뜻은 아닙니다.</p>
        </CitationBlock>

        <div id="paper-uniswap-v3-core-source" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={2} source="Uniswap/v3-core · v1.0.0 · commit e3589b1" href={SOURCE}>
            <p><strong>문제:</strong> range, tick, sqrt price, fee growth와 callback settlement를 정수 EVM 연산으로 실행해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Pool, SwapMath, Tick, Position의 방향별 반올림과 상태 전이를 제공합니다.</p>
            <p><strong>고정한 버전:</strong> annotated tag object <code>{TAG_OBJECT.slice(0, 12)}</code>가 가리키는 실제 commit <code>{COMMIT.slice(0, 12)}</code>입니다.</p>
            <p><strong>일반화 금지:</strong> Periphery NFT·Router, 현재 배포 주소·fee protocol, token별 decimals와 대상 환경 성능을 규정하지 않습니다.</p>
          </CitationBlock>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          기존 글은 tag object를 commit이라고 적었습니다. GitHub의 annotated tag를 역참조해 실제 source commit을
          따로 고정했습니다. <a href={TAG} className="font-bold text-primary hover:underline">v1.0.0 태그 보기</a>
        </p>
        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">[M] 확인한 범위:</strong> macOS arm64와 Node 24.13.0에서 commit
          <code> e3589b1</code>의 Solidity 0.7.6 계약 62개를 컴파일했습니다. 공식
          <code> SwapMath.spec.ts</code>, <code>Tick.spec.ts</code>, <code>UniswapV3Pool.swaps.spec.ts</code>의
          283개 테스트가 모두 통과했습니다. 테스트는 29.22초, 최대 RSS 1,112,539,136 bytes, swap 0이었습니다.
          2021년 TypeChain 선언과 현재 TypeScript 실행기의 호환 문제 때문에 타입 검사만 건너뛰었습니다.
          본문의 연속값 40→7.5207을 그대로 EVM fixture로 실행했거나 mainnet 성능을 측정했다고 주장하지 않습니다.
        </aside>
      </section>

      <DefiDexMapReturn
        currentSlug="uniswap-v3"
        closure="Uniswap V3는 하나의 pool 안에 여러 가격 구간을 겹칩니다. 교환은 다음 initialized tick까지만 같은 active liquidity로 계산하고, 경계를 넘으면 liquidityNet과 outside fee counter를 바꾼 뒤 남은 입력을 계속 처리합니다. Callback 대금 확인까지 통과해야 이 모든 변화가 한 transaction의 최종 상태로 남습니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialUniswapV3CodeRefs}
        fileTrees={{ "uniswap-v3": uniswapV3Tree }}
        projectMetas={{
          "uniswap-v3": {
            id: "uniswap-v3",
            label: "Uniswap v3-core · v1.0.0 · e3589b1",
            badgeClass: "border-pink-500 bg-pink-500/10 text-pink-700",
          },
        }}
      />
    </article>
  );
}
