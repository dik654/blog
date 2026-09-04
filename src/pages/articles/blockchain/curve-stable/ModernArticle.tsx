import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernCurveStableViz from "./viz/ModernCurveStableViz";

export default function ModernCurveStableArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Curve StableSwap · pegged-asset AMM
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            StableSwap은 peg를 만드는 장치가 아니라, 이미 비슷한 가치인 자산을
            균형 부근에서 덜 미끄럽게 교환하는 invariant다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          고정 사례는 같은 단위로 정규화한 X=100, Y=100 두 자산 pool입니다. 10
          X를 넣으면 constant-sum은 fee 전 10 Y를 내지만 한쪽 reserve를 0까지
          소진할 수 있습니다. Constant-product <code>xy=k</code>는{" "}
          <code>10000/110≈90.91</code>이므로 약 9.09 Y를 냅니다. StableSwap은
          amplification coefficient <code>A</code>로 균형 근처에서는 전자에, 큰
          불균형에서는 후자에 가까워집니다.
        </p>
        <p>
          낮은 slippage를 두 자산이 실제로 같은 가치라는 보증으로 읽으면 어긋납니다. Issuer default·bridge failure·redemption 중단으로 X가
          depeg하면 arbitrage가 약한 자산을 pool에 몰아 넣을 수 있습니다. 결국 그 자산을 더 많이 떠안는 쪽은 LP입니다.
        </p>
        <ContentBoundary article="curve-stable" />
        <ModernCurveStableViz />
        <div id="paper-curve-stableswap">
          <CitationBlock
            source="Curve · StableSwap whitepaper"
            citeKey={1}
            type="paper"
            href="https://curve.fi/files/stableswap-paper.pdf"
          >
            <p>
              <strong>문제:</strong> Pegged assets를 constant-product로 교환할
              때 균형 부근 slippage와 capital requirement가 큽니다.
            </p>
            <p>
              <strong>기여:</strong> Constant-sum과 constant-product를 잇는
              amplification invariant와 반복 계산 방법을 제안합니다.
            </p>
            <p>
              <strong>전제:</strong> 자산 잔액이 공통 가치 단위로 정규화되고
              목표 상대가격이 가깝다고 가정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> StableSwap invariant·A의 역할·slippage
              곡선의 수학적 설계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> Peg 유지, issuer solvency, 무손실
              LP 수익 또는 임의 pool의 현재 parameter를 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="invariant" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · invariant</p>
          <h2 className="mt-2 text-2xl font-bold">
            Token raw balance를 precision·rate로 정규화한 뒤 D를 풀고, swap 동안
            같은 D의 새 y를 찾는다
          </h2>
        </header>
        <ExplainedFormula
          question="n개 자산 StableSwap invariant에서 어떤 값이 swap 전후 보존될까요?"
          idea="정규화 잔액의 합과 곱을 A로 결합해 invariant D를 정합니다. Swap은 입력 후 잔액에서 같은 D를 만족하는 출력 잔액을 반복법으로 구합니다."
          formula={String.raw`A n^n\sum_i x_i+D=A D n^n+\frac{D^{n+1}}{n^n\prod_i x_i}`}
          annotatedFormula={String.raw`A n^n\sum_i x_i+D=\underbrace{A D n^n+\frac{D^{n+1}}{n^n\prod_i x_i}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`A D n^n+\frac{D^{n+1}}{n^n\prod_i x_i}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","정규화 잔액의 합과 곱을 A로 결합해 invariant D를","정합니다."] },
          ]}
          terms={[
            {
              symbol: "xᵢ",
              name: "normalized balance",
              description:
                "Token decimals와 rate를 공통 precision으로 바꾼 i번째 pool 잔액입니다.",
            },
            {
              symbol: "n",
              name: "coin count",
              description: "Pool에 속한 자산 수입니다.",
            },
            {
              symbol: "A",
              name: "amplification coefficient",
              description:
                "균형 부근 constant-sum 성질의 강도를 정하는 versioned parameter입니다.",
            },
            {
              symbol: "D",
              name: "StableSwap invariant",
              description:
                "현재 정규화 잔액과 A에서 반복 계산한 pool invariant입니다.",
            },
          ]}
          assumptions={[
            "모든 xᵢ가 양수이고 같은 가치·precision 단위입니다.",
            "Swap 계산 중 A와 rate artifact가 고정됩니다.",
            "Integer rounding·fee·admin fee는 invariant 식 뒤의 별도 구현 단계입니다.",
            "Newton iteration은 bounded convergence와 revert 조건을 가집니다.",
          ]}
          interpretation="X=Y=100처럼 완전 균형이면 D는 200의 직관을 갖습니다. 입력 후 한 잔액을 바꾸고 D를 고정해 다른 잔액 y를 구한 뒤 fee와 rounding을 적용합니다."
        />
        <p>
          입력 token index, 출력 token index, raw amount, decimals,
          stored/rate-oracle value와 A generation이 swap statement입니다.{" "}
          <code>min_dy</code>는 사용자가 허용한 최소 출력으로, 계산값이 작으면
          effect 전에 revert해야 합니다. Offchain quote와 onchain execution 사이
          rate·balance가 바뀔 수 있으므로 quote는 receipt가 아닙니다.
        </p>
      </section>
      <section id="amplification-risk" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · amplification and risk
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            A를 높이면 균형 부근 가격은 평평해지지만 depeg 손실과 parameter
            risk가 사라지지 않는다
          </h2>
        </header>
        <p>
          작은 A는 더 빨리 constant-product처럼 반응하고 큰 A는 균형 부근의 같은 거래에 더 작은 price impact를 줍니다. 그렇다고 무료 liquidity가 생기는
          것은 아닙니다. 한 자산의 외부 공정가격이 1에서 0.8로 내려갔는데 pool이 여전히 1 근처에서 교환하면 arbitrageur가 약한 자산을 넣고 강한 자산을 빼 갑니다. A가
          클수록 pool price가 외부 충격을 늦게 드러낼 수 있으므로 imbalance와 oracle/rate stale, virtual price를 따로 떼어 보지 않습니다.
        </p>
        <p>
          A ramp는 시작값·목표값·시작/종료시각이 있는 parameter transition입니다. Swap quote가 쓰는 A는 해당 block timestamp의 값이어야 합니다.
          Fee는 trader output과 LP/admin accounting을 바꿉니다. Token의 transfer fee·rebasing·ERC-4626 rate는 지원
          profile과 구현 generation까지 함께 확인할 대상입니다.
        </p>
        <div id="paper-curve-stableswap-ng">
          <CitationBlock
            source="Curve StableSwap-NG · pinned source"
            citeKey={2}
            type="code"
            href="https://github.com/curvefi/stableswap-ng/tree/2abe778f40206a6c0fd108a0a53ad3266cbedeee"
          >
            <p>
              <strong>문제:</strong> 여러 pegged-token 유형에서
              invariant·rate·fee·liquidity accounting을 executable contract로
              구현해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Pool/factory contracts, bounded invariant
              iteration과 supported token/rate profiles를 제공합니다.
            </p>
            <p>
              <strong>전제:</strong> Commit 2abe778f와 그
              Vyper/compiler·deployment configuration을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 현재 source snapshot의 계산 경로와
              revert·parameter surface입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 모든 historical Curve pool과
              동일하거나 특정 deployment·A·fee·token이 안전하다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="curve-release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Invariant parity보다 먼저 token·rate·A artifact를 고정하고
            depeg·rounding·reentrancy를 실패시킨다
          </h2>
        </header>
        <p>
          Release fixture에는 100/100 균형과 110/90 불균형, 10-unit swap, A ramp 중간 시각이 들어갑니다. 여기에 stale rate,
          zero/near-zero balance, fee-on-transfer, min-output failure, one-asset depeg까지 포함합니다. Reference
          calculator와 onchain result를 같은 integer precision에서 비교하고 D drift·output·fee·LP supply를 기록합니다.
        </p>
        <p>
          기초 6문제가 묻는 건 constant-sum/product 비교와 정규화, D, A, fee, depeg 경계입니다. 심화 4문제는 bounded iteration과 ramp
          race, adversarial token, paired release matrix를 설계하는 자리입니다.
        </p>
      </section>
    </article>
  );
}
