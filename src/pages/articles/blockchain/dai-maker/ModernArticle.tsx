import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import DaiVaultViz from "./viz/DaiVaultViz";

export default function ModernDaiArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            담보 150달러로 100 DAI를 만들면 무엇이 빚이 될까요?
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            DAI는 달러를 맡기고 받는 영수증이 아니라 담보를 잠그고 만든
            부채입니다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          사용자는 암호자산 같은 담보를 금고에 잠그고 DAI를 꺼냅니다. 꺼낸
          DAI만큼 금고에는 갚아야 할 빚이 남습니다. 담보 가치가 내려가거나
          수수료가 쌓여 빚이 커지면 금고는 청산 대상이 될 수 있습니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          설명용 금고에는 oracle 가치 150달러인 담보를 넣고 100 DAI를 꺼냅니다.
          처음 담보 비율은 150%입니다. 이 숫자는 계산 예시일 뿐 안전선이
          아닙니다. 실제 청산 기준, 부채 한도, 수수료와 경매 설정은 담보 종류와
          governance 시점에 따라 달라집니다.
        </p>
        <p>
          이 글은 Maker에서 시작해 현재 Sky ecosystem으로 이어진 DAI core
          contract의 장부 구조를 설명합니다. 현재 USDS·SKY product와 governance
          migration, 실제 parameter는 별도의 versioned deployment입니다. 과거
          이름과 값을 현재에도 그대로 적용하지 않습니다.
        </p>
        <DaiVaultViz />
        <ContentBoundary article="dai-maker" />
        <div id="paper-dai-dss">
          <CitationBlock
            source="Sky ecosystem · Multi-Collateral DAI core (pinned)"
            citeKey={1}
            type="code"
            href="https://github.com/sky-ecosystem/dss/tree/fa4f6630afb0624d04a003e920b0d71a00331d98"
          >
            <p>
              <strong>문제:</strong> 여러 collateral type의
              담보·부채·rate·authorization을 정밀한 core ledger에서 관리해야
              합니다.
            </p>
            <p>
              <strong>기여:</strong> Vat, Spot, Jug, Dog/Clipper와 adapters의
              executable contract boundary를 제공합니다.
            </p>
            <p>
              <strong>전제:</strong> Commit fa4f6630과 해당 Solidity
              arithmetic·authorization model을 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Pinned DAI core source의 state·module
              seam과 failure behavior입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 현재 mainnet parameter·governance
              decision·collateral 가격·Sky product 전체를 고정하거나 보장하지
              않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="vault-debt-collateral" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · 금고의 세 숫자
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            담보 150달러와 빚 100 DAI는 장부에서 어떻게 만들어질까요?
          </h2>
        </header>
        <p>
          담보 token은 adapter를 거쳐 담보 종류별 장부에 들어갑니다. 이 종류를
          <code>ilk</code>라고 합니다. Oracle 가격을 곱해야 현재 담보 가치를 알
          수 있으므로 token 수량과 달러 가치는 같은 숫자가 아닙니다.
        </p>
        <p>
          사용자가 직접 늘리거나 줄이는 빚의 기준값은 <code>art</code>입니다.
          여기에 담보 종류 전체에 공통으로 누적된 <code>rate</code>를 곱해야
          지금 갚아야 할 빚이 됩니다. Wallet의 ERC-20 DAI, Vat 내부 DAI 잔액과
          금고의 미상환 부채도 서로 다른 상태입니다.
        </p>
        <ExplainedFormula
          question="설명용 Vault의 collateral ratio와 현재 debt를 어떻게 분리해 계산할까요?"
          idea="Collateral token 수량에 oracle price를 곱해 가치 V를 만들고, normalized debt에 누적 rate를 곱해 debt D를 만든 뒤 비율을 계산합니다."
          formula={String.raw`\begin{aligned}D&=art\times rate\\CR&=\frac{V_{collateral}}{D}\times100\%\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}D&=\underbrace{art\times rate}_{\text{fee가 누적된 현재 debt}}\\CR&=\underbrace{\frac{V_{collateral}}{D}\times100\%}_{\text{debt 대비 담보 가치}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`art\times rate`,
              annotation: [
                "normalized debt에 stability fee 누적",
                "multiplier를 곱합니다",
                "art=100, rate=1.05면 D=105",
              ],
            },
            {
              expression: String.raw`\frac{V_{collateral}}{D}\times100\%`,
              annotation: [
                "oracle 가격으로 매긴 담보 가치를 debt로",
                "V=150, D=100이면 150%",
                "D=105가 되면 약 142.86%",
              ],
            },
          ]}
          terms={[
            {
              symbol: "art",
              name: "normalized debt",
              description: "Vault가 보유한 rate 적용 전 debt unit입니다.",
            },
            {
              symbol: "rate",
              name: "accumulated debt multiplier",
              description:
                "Collateral type별 stability fee accrual을 누적한 multiplier입니다.",
            },
            {
              symbol: "V_collateral",
              name: "oracle-valued collateral",
              description:
                "담보 수량에 versioned oracle price와 unit conversion을 적용한 가치입니다.",
            },
            {
              symbol: "CR",
              name: "collateral ratio",
              description:
                "현재 debt 대비 oracle-valued collateral의 비율입니다.",
            },
          ]}
          assumptions={[
            "동일 시점의 oracle, rate와 token decimals를 사용합니다.",
            "Liquidation threshold는 collateral type의 versioned parameter로 별도 조회합니다.",
            "Oracle stale·debt ceiling·auction liquidity를 이 비율 하나로 대체하지 않습니다.",
            "0 debt에서는 비율로 liquidation 판단을 하지 않습니다.",
          ]}
          interpretation="V=150, art=100, rate=1이면 D=100, CR=150%입니다. Rate가 1.05로 오르면 debt=105, CR≈142.86%가 됩니다."
        />
      </section>

      <section id="liquidation-peg-tools" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · 가격이 흔들릴 때의 두 안전장치
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            청산과 PSM은 둘 다 가격을 지키지만 같은 일을 할까요?
          </h2>
        </header>
        <p>
          아닙니다. Oracle update 뒤 위험 조정 담보 가치가 빚보다 작아지면
          liquidation module이 금고를 unsafe로 판정할 수 있습니다. 이때 Dog가
          빚과 담보를 떼어 Clipper 경매로 넘깁니다.
        </p>
        <p>
          Unsafe 판정, 경매 시작, 담보 낙찰과 bad debt 해소는 서로 다른
          단계입니다. 시장 혼잡, oracle과 실제 가격의 차이, keeper 실패 때문에
          경매가 늦어질 수 있습니다. Stability fee는 빚을 늘리는 장치이고,
          savings rate는 보유자에게 주는 별도 유인입니다.
        </p>
        <p>
          Peg Stability Module, 즉 PSM은 승인된 stablecoin과 DAI를 정해진 fee
          조건으로 직접 교환하게 합니다. 시장 가격이 1달러에서 벗어났을 때 차익
          거래가 들어올 통로입니다. 그렇다고 모든 DAI가 법정화폐 reserve로
          바뀌는 것은 아닙니다. Stablecoin 발행사 위험, debt ceiling, pause,
          fee와 실제 liquidity가 남습니다.
        </p>
        <div id="paper-dai-psm">
          <CitationBlock
            source="Sky ecosystem · Lite PSM (pinned)"
            citeKey={2}
            type="code"
            href="https://github.com/sky-ecosystem/dss-lite-psm/tree/dbf0022225f645f5697e5517d0cf00810471bccf"
          >
            <p>
              <strong>문제:</strong> Approved stablecoin과 DAI 사이의
              low-slippage peg rail을 Vat interaction 비용과 risk limit 아래
              운영해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Lite PSM·Pocket·Mom lifecycle, fees와
              capacity control의 executable implementation을 제공합니다.
            </p>
            <p>
              <strong>전제:</strong> Commit dbf00222, configured
              gem·fees·bud·line과 issuer token behavior를 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Pinned Lite PSM swap·liquidity
              architecture입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> PSM collateral의 무위험성,
              unlimited redemption, fee 0 또는 DAI 전체가 fiat-backed라는 뜻이
              아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="dai-release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · 현재 상태를 재현하기
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            “이 금고는 안전하다”는 판단에 어떤 시점 정보가 필요할까요?
          </h2>
        </header>
        <p>
          계산 예시는 담보 가치 150, art 100, rate 1에서 시작합니다. 이어 rate를
          1.05로 올리고, oracle 가격 하락, 청산선 통과, 경매 지연과 PSM pause를
          순서대로 재생합니다. 어느 단계에서 위험해졌는지를 알려면 숫자만이
          아니라 그 숫자를 읽은 시점이 필요합니다.
        </p>
        <p>
          그래서 Vat의 urn·ilk, Spot·Jug timestamp, Dog·Clip version, 경매
          receipt와 PSM inventory·fee·line을 같은 block과 deployment manifest로
          묶습니다. 이 snapshot이 없으면 과거 숫자를 현재 parameter에 넣어 서로
          다른 금고 상태를 비교하게 됩니다.
        </p>
        <p>
          결론적으로 DAI의 1달러 근처 가격은 담보 비율 하나가 보장하지 않습니다.
          담보 장부, 최신 oracle, 청산 경매와 PSM 교환 통로가 각자의 실패 조건을
          드러내며 함께 작동해야 합니다.
        </p>
      </section>
    </article>
  );
}
