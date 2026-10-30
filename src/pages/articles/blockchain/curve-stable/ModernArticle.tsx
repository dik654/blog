import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import DefiDexLocator, { DefiDexMapReturn } from "../DefiDexLocator";
import { curveStableTree } from "./fileTrees";
import { officialCurveStableCodeRefs } from "./officialCodeRefs";
import ModernCurveStableViz from "./viz/ModernCurveStableViz";

const COMMIT = "2abe778f40206a6c0fd108a0a53ad3266cbedeee";
const SOURCE = `https://github.com/curvefi/stableswap-ng/tree/${COMMIT}`;

export default function ModernCurveStableArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <DefiDexLocator
          currentSlug="curve-stable"
          region="정규화 잔액·StableSwap invariant·실제 교환"
          question="균형 pool에 token0 1,000개를 넣으면 약 999.899666 token1이 나오기까지 계약 안에서 어떤 값이 바뀝니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            Raw 잔액은 어떻게 D와 y를 거쳐 실제 출력 금액이 됩니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            공식 StableSwap-NG의 plain-token 테스트 fixture 한 건을 따라갑니다. 각 자산 1,500,000개,
            A=2000, fee 0.01%인 균형 pool에 token0 1,000개를 넣습니다. Rate 정규화부터
            정수 반복, fee, 최소 출력 검사와 전송까지 같은 transaction 안의 순서로 봅니다.
          </p>
        </div>

        <ModernCurveStableViz />

        <p className="text-lg leading-8">
          <strong>StableSwap은 token의 가격을 1로 보장하는 장치가 아닙니다.</strong> 이미 비슷한 가치로
          거래될 것으로 기대되는 자산을 균형 부근에서 작은 가격 충격으로 바꾸도록 만든 곡선입니다. Peg가
          깨지면 곡선은 손실을 없애지 못하고 약해진 자산을 pool에 더 많이 남길 수 있습니다.
        </p>
        <p>
          앞선 <Link to="/cs/blockchain/uniswap-v4#overview" className="font-bold text-primary hover:underline">Uniswap V4</Link> 글은
          계산 결과를 router의 debt·credit으로 정산하는 경계를 다뤘습니다. 이 글은 router 전체가 아니라
          <strong> Curve pool 하나가 현재 balance·rate·A에서 출력 금액을 계산하고 전송하는 과정</strong>을 소유합니다.
        </p>
        <ContentBoundary article="curve-stable" />
      </section>

      <section id="official-fixture" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">먼저 계산 조건을 한 transaction의 입력으로 고정합니다</h2>
        <p>
          공식 테스트는 plain 18-decimal token 둘을 쓰는 basic pool을 만들고 각 자산 1,500,000개를
          예치합니다. Bob은 token0 1,000개를 보내기 전에 <code>get_dy</code>로 현재 상태의 예상 출력을
          읽고, 이어서 <code>exchange</code>를 실행합니다. 실제 받은 token1과 quote의 차이는 1 wei 이하여야 합니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["POOL BALANCE", "1,500,000 / 1,500,000", "Plain token 둘의 균형 상태"],
            ["AMPLIFICATION", "A = 2,000", "Fixture의 사용자 표시값"],
            ["SWAP FEE", "0.01%", "1e10 분모에서 fee 1,000,000"],
            ["REQUEST", "token0 1,000", "Bob → pool → token1 receiver"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-primary">{label}</span>
              <strong className="mt-2 block break-keep text-xs leading-5">{value}</strong>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="공식 pool·교환 fixture" onClick={() => sidebar.open("curve-fixture", officialCurveStableCodeRefs["curve-fixture"])} />
          <CodeViewButton label="실제 exchange 순서" onClick={() => sidebar.open("curve-exchange", officialCurveStableCodeRefs["curve-exchange"])} />
        </div>

        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">숫자의 범위:</strong> 1,500,000·A 2000·fee 0.01%는 고정 commit의
          테스트 fixture입니다. 현재 mainnet의 모든 pool 설정이나 보편적인 권장값으로 확대하지 않습니다.
        </aside>
      </section>

      <section id="normalize-state" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Token 개수보다 먼저 같은 가치 단위의 xp를 만듭니다</h2>
        <p>
          Token0 1개와 token1 1개가 같은 raw 정수를 가진다는 보장은 없습니다. Decimals가 다를 수 있고,
          이자 누적 token이나 ERC-4626 share는 underlying 가치도 변합니다. StableSwap-NG는 token별
          <code>rate</code>를 읽어 raw balance를 공통 1e18 precision의 <code>xp</code>로 바꿉니다.
        </p>

        <ExplainedFormula
          question="Raw balance는 invariant가 읽는 xp로 어떻게 바뀝니까?"
          idea="Token별 decimals·oracle·ERC-4626 환산이 들어간 rate를 raw balance에 곱하고 1e18로 나눕니다."
          formula={String.raw`xp_i=\frac{rate_i\times balance_i}{10^{18}}`}
          annotatedFormula={String.raw`\underbrace{xp_i}_{\text{공통 가치 단위}}=\frac{\underbrace{rate_i}_{\text{decimals·oracle·share 환산}}\times\underbrace{balance_i}_{\text{raw token 잔액}}}{\underbrace{10^{18}}_{\text{precision}}}`}
          operations={[
            { expression: String.raw`rate_i`, annotation: ["Plain token은 decimals multiplier", "Oracle·ERC-4626 token은 현재 환산값까지 반영"] },
            { expression: String.raw`rate_i\times balance_i`, annotation: ["서로 다른 raw 단위를 같은 가치 축으로 옮김"] },
            { expression: String.raw`\div 10^{18}`, annotation: ["Contract의 공통 precision으로 복원"] },
          ]}
          terms={[
            { symbol: String.raw`balance_i`, name: "raw balance", description: "Pool이 보유한 i번째 token의 실제 최소 단위 잔액입니다." },
            { symbol: String.raw`rate_i`, name: "rate artifact", description: "Decimals와 필요하면 oracle 또는 share 환산을 결합한 값입니다." },
            { symbol: String.raw`xp_i`, name: "normalized balance", description: "StableSwap invariant가 읽는 공통 precision 잔액입니다." },
          ]}
          assumptions={[
            "Fixture의 plain token 둘은 18 decimals이고 rate는 1e18입니다.",
            "Oracle 또는 ERC-4626 token은 execution 중 외부 static call이 성공해야 합니다.",
            "Quote 시점과 exchange 시점의 rate·balance는 달라질 수 있습니다.",
          ]}
          interpretation="이 fixture에서는 rate가 1이므로 xp도 1,500,000 / 1,500,000입니다. 다른 token 유형에서는 같은 raw balance라도 xp가 달라집니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Rate와 xp 만드는 코드" onClick={() => sidebar.open("curve-normalize", officialCurveStableCodeRefs["curve-normalize"])} />
          <CodeViewButton label="Ramp 중 현재 A" onClick={() => sidebar.open("curve-ramp-a", officialCurveStableCodeRefs["curve-ramp-a"])} />
        </div>

        <p>
          같은 transaction 안에서도 계산 순서는 중요합니다. Contract는 현재 rate와 LP 귀속 balance를 읽고,
          입력 token을 실제로 받은 뒤 그 수량을 rate로 정규화합니다. 사용자가 요청한 1,000이 아니라
          <code>_transfer_in</code>이 확인한 실제 <code>dx</code>가 새 x에 더해집니다.
        </p>
      </section>

      <section id="solve-output" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">기존 D를 유지하는 새 y를 찾은 뒤 fee를 뺍니다</h2>
        <p>
          먼저 기존 xp와 현재 A에서 invariant <code>D</code>를 구합니다. 균형 fixture의 첫 추정값은 잔액
          합계 3,000,000이고 바로 수렴합니다. 다음으로 token0 입력을 반영한 x=1,501,000을 고정하고,
          같은 D를 만족하는 token1의 남을 잔액 y를 반복 계산합니다.
        </p>

        <ExplainedFormula
          question="StableSwap은 합과 곱의 성질을 어떻게 한 D에 묶습니까?"
          idea="A가 붙은 합 항은 균형 부근을 평평하게 만들고, 잔액 곱 항은 한쪽이 마를 때 가격 충격을 키웁니다."
          formula={String.raw`A n^n\sum_i x_i+D=A D n^n+\frac{D^{n+1}}{n^n\prod_i x_i}`}
          annotatedFormula={String.raw`\underbrace{A n^n\sum_i x_i}_{\text{균형 부근의 합 성질}}+D=\underbrace{A D n^n}_{\text{합 기준}}+\underbrace{\frac{D^{n+1}}{n^n\prod_i x_i}}_{\text{불균형에서 커지는 곱 항}}`}
          operations={[
            { expression: String.raw`\sum_i x_i`, annotation: ["정규화 잔액 전체의 합"] },
            { expression: String.raw`A n^n`, annotation: ["균형 부근에서 합 성질을 증폭"] },
            { expression: String.raw`\prod_i x_i`, annotation: ["한 잔액이 작아지면 분수 항이 커져 고갈을 억제"] },
            { expression: String.raw`D`, annotation: ["Swap 전 상태에서 구한 뒤 새 y 계산 동안 고정"] },
          ]}
          terms={[
            { symbol: String.raw`x_i`, name: "normalized balance", description: "앞 절에서 rate를 반영한 공통 단위 잔액입니다." },
            { symbol: "n", name: "coin count", description: "Pool에 들어 있는 자산 수입니다. 이 fixture에서는 2입니다." },
            { symbol: "A", name: "amplification", description: "균형 부근의 곡선 모양을 정하는 parameter입니다." },
            { symbol: "D", name: "invariant", description: "현재 xp와 A를 만족하는 pool의 불변량입니다." },
          ]}
          assumptions={[
            "모든 xp는 양수이며 같은 precision입니다.",
            "D와 y는 contract와 같은 정수 나눗셈으로 최대 255번 반복합니다.",
            "Fee와 1 wei 보수적 반올림은 y를 찾은 다음 적용합니다.",
          ]}
          interpretation="A가 크다고 곱 항이 사라지지는 않습니다. 균형에서 멀어질수록 고갈 방지 성질이 다시 강해집니다."
        />

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">
          {[
            ["D", "3,000,000", "균형 xp에서 1회 수렴"],
            ["NEW x", "1,501,000", "token0 1,000 반영"],
            ["SOLVED y", "1,499,000.000333…", "8회 정수 반복"],
            ["GROSS dy", "999.999666833…", "old y - new y - 1 wei"],
            ["FINAL dy", "999.899666866…", "0.01% fee 적용"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-3">
              <span className="text-[8px] font-bold text-primary">{label}</span>
              <strong className="mt-2 block break-keep font-mono text-[10px] leading-5">{value}</strong>
              <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="D와 y의 정수 반복" onClick={() => sidebar.open("curve-invariant", officialCurveStableCodeRefs["curve-invariant"])} />
          <CodeViewButton label="1 wei·fee·출력 단위" onClick={() => sidebar.open("curve-output", officialCurveStableCodeRefs["curve-output"])} />
        </div>

        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">[O]와 [M]의 구분:</strong> 위 숫자는 pinned source의 정수식을 같은
          입력으로 재생한 source trace입니다. 공식 테스트는 <code>get_dy</code>와 실제 수령량 차이가 1 wei
          이하인지 검사하지만, 이 환경에서는 Titanoboa contract test를 새로 실행하지 않았으므로 성능이나
          배포 결과를 [M] 측정값으로 표현하지 않습니다.
        </aside>
      </section>

      <section id="amplification-risk" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">A는 곡선을 바꾸지만 peg와 손실 위험을 없애지는 않습니다</h2>
        <p>
          A가 클수록 균형 부근의 같은 거래에서 출력이 constant-sum에 가까워집니다. 그러나 한 자산의 외부
          가치가 1에서 0.8로 떨어져도 pool이 한동안 1에 가까운 교환 비율을 유지하면, 거래자는 약한 자산을 넣고
          강한 자산을 꺼냅니다. 결과적으로 LP의 inventory가 약한 자산 쪽으로 기웁니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["A가 보장", "곡선 모양", "현재 balance와 parameter가 만드는 가격 반응"],
            ["A가 미보장", "외부 상환 가치", "Issuer·bridge·oracle·redemption의 안전"],
            ["LP가 관찰", "Inventory 변화", "Balance·rate·외부 가격·출구 유동성"],
          ].map(([scope, subject, detail]) => (
            <div key={scope} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-primary">{scope}</span>
              <strong className="mt-2 block break-keep text-xs leading-5">{subject}</strong>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <p>
          A가 ramp 중이면 quote와 execution 사이의 <code>block.timestamp</code> 차이만으로도 현재 A가 달라질 수
          있습니다. Rate oracle이나 ERC-4626 환산값, 다른 거래가 바꾼 balance도 마찬가지입니다. 그러므로
          <code>get_dy</code>는 현재 상태의 계산 결과이지 미래 transaction의 지급 보증서가 아닙니다.
        </p>
      </section>

      <section id="failure-source" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">최소 출력이나 계산 전제가 깨지면 입력 전송까지 함께 되돌아갑니다</h2>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["min_dy가 1 wei 큼", "출력 검사 실패", "입력 전송과 state 변화도 revert"],
            ["같은 coin index", "i == j", "수학 실행 전에 거절"],
            ["0개 입력", "dx == 0", "Transfer와 계산을 시작하지 않음"],
            ["D·y 미수렴", "255회 초과", "부분 출력 없이 transaction 실패"],
          ].map(([cause, result, effect]) => (
            <div key={cause} className="min-w-0 bg-background p-4">
              <strong className="break-keep text-xs leading-5">{cause}</strong>
              <p className="mt-2 text-[10px] font-bold leading-5 text-destructive">{result}</p>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{effect}</p>
            </div>
          ))}
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          여기서 다루는 실패는 한 pool transaction의 자체 동작입니다. 어느 Curve deployment를 채택할지,
          oracle 허용 목록과 A ramp 권한을 누가 운영할지, canary·rollback을 어떻게 구성할지는 특정 환경의
          실무 글에서 별도로 판단해야 합니다.
        </p>

        <div id="paper-curve-stableswap" className="scroll-mt-24">
          <CitationBlock type="paper" citeKey={1} source="Curve · StableSwap whitepaper" href="https://curve.fi/files/stableswap-paper.pdf">
            <p><strong>문제:</strong> 비슷한 가치의 자산을 constant-product로 교환할 때 균형 부근의 slippage와 필요한 capital이 큽니다.</p>
            <p><strong>핵심 기여:</strong> Constant-sum과 constant-product 성질을 A로 연결하는 invariant와 반복 계산을 제시합니다.</p>
            <p><strong>전제:</strong> 자산을 공통 단위로 환산할 수 있고 목표 상대가격이 가깝다고 가정합니다.</p>
            <p><strong>일반화 금지:</strong> Peg 유지, issuer solvency, LP 무손실이나 현재 deployment parameter를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-curve-stableswap-ng" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={2} source="curvefi/stableswap-ng · commit 2abe778f" href={SOURCE}>
            <p><strong>문제:</strong> 여러 token 유형의 balance·rate·A·fee를 실제 정수 contract 경로로 연결해야 합니다.</p>
            <p><strong>핵심 기여:</strong> StableSwap-NG pool, rate profile, get_D/get_y, exchange와 failure path를 구현합니다.</p>
            <p><strong>고정한 버전:</strong> Commit <code>{COMMIT.slice(0, 12)}</code>과 해당 source·test fixture입니다.</p>
            <p><strong>일반화 금지:</strong> Main branch의 이후 변경, 모든 historical pool, 임의 token·oracle·parameter의 안전을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-curve-exchange-test" className="scroll-mt-24">
          <CitationBlock
            type="code"
            citeKey={3}
            source="stableswap-ng · test_min_dy · commit 2abe778f"
            href={`https://github.com/curvefi/stableswap-ng/blob/${COMMIT}/tests/pools/exchange/test_exchange.py`}
          >
            <p><strong>문제:</strong> View quote와 실제 token 수령량이 같은 execution semantics를 따르는지 확인해야 합니다.</p>
            <p><strong>핵심 기여:</strong> 1,000-token 입력에서 get_dy와 exchange 뒤 balance 증가량을 비교합니다.</p>
            <p><strong>근거 범위:</strong> 고정 fixture의 plain·oracle·rebasing token별 허용 오차와 실제 transfer behavior입니다.</p>
            <p><strong>일반화 금지:</strong> Quote 이후 상태가 바뀌지 않거나 모든 token 유형이 1 wei 안에서 일치한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <DefiDexMapReturn
        currentSlug="curve-stable"
        closure="Curve StableSwap은 raw token 잔액을 rate로 정규화하고 현재 A에서 D를 구한 뒤, 입력을 반영한 x와 같은 D를 만족하는 y를 정수 반복으로 찾습니다. Fee와 min_dy 검사를 통과해야 실제 출력이 전송됩니다. A는 균형 부근의 곡선을 바꾸지만 token의 peg나 LP 무손실을 보장하지 않습니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialCurveStableCodeRefs}
        fileTrees={{ "curve-stable": curveStableTree }}
      />
    </article>
  );
}
