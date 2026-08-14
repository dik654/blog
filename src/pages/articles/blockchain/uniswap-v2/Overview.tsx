import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ModernV2Viz from "./viz/ModernV2Viz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">V2 swap은 quote가 아니라 수수료 반영 뒤의 reserve 불변식으로 끝난다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">두 reserve x,y를 가진 Pair는 거래자가 token0을 넣으면 token1을 내보냅니다. 가격표를 저장하는 대신 거래 전 reserve와 거래 뒤 실제 balance를 비교해 0.3% 수수료를 반영한 곱이 줄지 않았는지 확인합니다. Router의 quote는 이 settlement를 미리 계산한 값일 뿐 실행 보장이 아닙니다.</p>
        <p>이 글은 AMM 정의를 다른 글에 중복시키지 않고 V2 Pair의 invariant → LP share → Router bound → flash callback·TWAP → release 흐름을 소유합니다. V3의 범위 유동성은 <Link to="/blockchain/uniswap-v3">다음 글</Link>에서 이 invariant를 재사용해 확장합니다.</p>
      </div>
      <ContentBoundary article="uniswap-v2" />
      <ModernV2Viz mode="swap" />
      <ExplainedFormula
        question="x=1,000, y=1,000인 풀에 token0 100개를 넣으면 token1을 얼마나 받을까요?"
        idea="입력 전체는 reserve에 들어오지만 가격 이동에는 0.3%를 뺀 유효 입력만 사용합니다. 새 유효 reserve product가 이전 product와 같도록 출력량을 풀면 됩니다."
        formula={String.raw`\Delta y=\frac{y\cdot997\Delta x}{1000x+997\Delta x},\qquad (1000x+997\Delta x)(y-\Delta y)\ge1000xy`}
        terms={[
          { symbol: "x,y", name: "pre-swap reserves", description: "Pair에 기록된 token0·token1 reserve입니다." },
          { symbol: "Δx", name: "observed input", description: "Transfer 뒤 balance 차이로 확인한 token0 입력입니다." },
          { symbol: "997/1000", name: "trader fee factor", description: "V2의 30-bp input fee를 가격 계산에 반영합니다." },
        ]}
        assumptions={["일반 ERC-20처럼 Pair가 관측한 input과 사용자가 보낸 양의 관계가 명확해야 합니다.", "정수 구현은 출력·입력 방향에 맞는 rounding과 reserve overflow 경계를 따릅니다."]}
        interpretation="유효 입력은 99.7이고 출력은 약 90.661 token1입니다. 실제 새 balance는 1,100과 약 909.339라 raw k는 수수료만큼 증가합니다. Δy=100이라고 선형 비율로 내보내면 adjusted product가 작아져 revert됩니다."
      />
      <ExplainedFormula
        question="가격이 두 배가 되면 constant-product LP가 단순 보유보다 얼마나 뒤처질까요?"
        idea="차익거래가 reserve 비율을 새 외부 가격에 맞추면 LP는 오른 자산을 일부 팔고 내린 자산을 일부 산 상태가 됩니다. 초기 50/50 포트폴리오와 같은 자산을 그대로 보유한 가치를 비교합니다."
        formula={String.raw`\operatorname{IL}(r)=\frac{2\sqrt r}{1+r}-1`}
        terms={[
          { symbol: "r", name: "relative price ratio", description: "초기 대비 token0/token1 외부 가격 변화 비율입니다." },
          { symbol: "IL", name: "divergence loss", description: "수수료를 제외한 LP 가치 / HODL 가치 − 1입니다." },
        ]}
        assumptions={["초기 50/50 constant-product position과 frictionless arbitrage를 가정합니다.", "수수료 수익·gas·세금·oracle 지연은 이 비교에 포함하지 않습니다."]}
        interpretation="r=2이면 2√2/3−1≈−5.72%입니다. 이는 LP 잔고 자체가 손실이라는 뜻이 아니라 같은 초기 자산을 보유한 대안보다 뒤처진다는 뜻입니다. 누적 수수료가 5.72%를 넘으면 총 결과는 달라질 수 있습니다."
      />
      <div id="paper-uniswap-v2-whitepaper" className="scroll-mt-24">
        <CitationBlock source="Adams et al. · Uniswap v2 Core whitepaper" href="https://docs.uniswap.org/whitepaper.pdf" citeKey={1}>
          문제: 상시 유동성·ERC-20 pair·price accumulator·flash settlement를 최소 core로 제공합니다. 기여: constant-product invariant, 30-bp trader fee, optional protocol fee와 TWAP accumulator 설계를 설명합니다. 전제: V2 core·EVM transaction atomicity와 문서가 정한 token accounting을 사용합니다. 근거 범위: V2의 수학과 core 설계입니다. 비주장: Router quote가 체결을 보장하거나 모든 ERC-20·oracle 소비자가 안전하다는 뜻은 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
