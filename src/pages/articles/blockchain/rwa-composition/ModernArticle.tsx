import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernRwaViz from "./viz/ModernRwaViz";

export default function ModernRwaCompositionArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            RWA · claim before token
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            RWA token은 현실 자산 그 자체가 아니라, 법적 청구권과 원장을 onchain
            identifier에 연결한 arrangement다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          고정 사례는 단기 국채 포트폴리오 순자산 102달러를 100 tokens가
          나타내는 구조입니다. 계산상 token당 NAV는 1.02달러지만 holder가 국채의
          직접 소유자인지, issuer에 대한 채권자인지, fund share를 가진 것인지는
          법률 문서와 authoritative ownership record가 정합니다. Wallet
          balance만으로 bankruptcy priority나 redemption 권리가 생기지 않습니다.
        </p>
        <p>
          이 글은 교육용 system map이며 법률·투자 자문이 아닙니다. Jurisdiction,
          investor class, securities law, tax, insolvency와 transfer
          restriction은 arrangement마다 달라집니다.
        </p>
        <ContentBoundary article="rwa-composition" />
        <ModernRwaViz />
        <div id="paper-iosco-tokenization">
          <CitationBlock
            source="IOSCO · Tokenization of Financial Assets (2025)"
            citeKey={1}
            type="paper"
            href="https://www.iosco.org/library/pubdocs/pdf/IOSCOPD809.pdf"
          >
            <p>
              <strong>문제:</strong> Tokenized financial asset에서 ownership
              record·investor rights·custody·settlement가 기존 법적 구조와
              어긋날 수 있습니다.
            </p>
            <p>
              <strong>기여:</strong> On/offchain authoritative record, legal
              recognition, third-party dependency와 investor-protection 위험을
              비교합니다.
            </p>
            <p>
              <strong>전제:</strong> 여러 관할의 2025 시장 관행을 조사한 정책
              보고서이며 개별 상품 법률 의견이 아닙니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Token과 legal ownership·transfer
              record를 분리하는 분석 경계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 특정 token이 유가증권인지,
              파산격리됐는지 또는 어느 국가에서 적법한지 판정하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="claim-asset-map" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · legal and asset map
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Issuer·SPV·custodian·servicer·registry의 책임을 한 화살표로 줄이지
            않는다
          </h2>
        </header>
        <p>
          Issuer는 token과 contractual claim을 발행하고, SPV나 fund vehicle은
          reference assets를 보유할 수 있습니다. Custodian은 securities/cash를
          보관하고, servicer는 coupon·rent·loan payment를 모으며,
          administrator는 NAV를 계산합니다. Transfer agent 또는 registry가 legal
          holder record를 관리할 수 있습니다. Smart contract는 mint/burn과
          allowlist를 집행하지만 offchain asset existence·lien·cash collection을
          스스로 관찰하지 못합니다.
        </p>
        <ExplainedFormula
          question="102달러 순자산을 100 tokens가 나타낼 때 token당 NAV와 80% haircut 담보가치는 얼마인가요?"
          idea="같은 cutoff의 asset value에서 liability와 accrued cost를 빼고 eligible token supply로 나눈 뒤, DeFi 담보 사용 시 별도 haircut을 적용합니다."
          formula={String.raw`\begin{aligned}NAV_{token}&=\frac{V_{asset}-L}{N_{eligible}}\\V_{collateral}&=q\,NAV_{token}(1-h)\end{aligned}`}
          terms={[
            {
              symbol: "V_asset",
              name: "asset value",
              description:
                "Valuation cutoff에서 reference assets의 공통 통화 가치입니다.",
            },
            {
              symbol: "L",
              name: "liabilities",
              description:
                "Accrued fee·payable·other senior claims의 같은 cutoff 합계입니다.",
            },
            {
              symbol: "N_eligible",
              name: "eligible token supply",
              description: "NAV claim에 참여하는 reconciled token 수입니다.",
            },
            {
              symbol: "q",
              name: "token quantity",
              description: "담보로 제출한 token 수입니다.",
            },
            {
              symbol: "h",
              name: "haircut",
              description:
                "Oracle·liquidity·legal/operational risk를 반영한 0~1 risk discount입니다.",
            },
          ]}
          assumptions={[
            "Asset, liability, supply가 동일한 valuation cutoff와 currency를 사용합니다.",
            "Token holder의 legal claim과 redemption waterfall이 문서로 확인됩니다.",
            "Stale price·uncollected coupon·blocked redemption은 별도 status입니다.",
            "Haircut은 loss guarantee가 아니라 versioned risk parameter입니다.",
          ]}
          interpretation="Vasset−L=102달러, N=100이면 NAV=1.02달러입니다. q=100, h=20%라면 담보가치는 81.60달러지만 실제 차입한도는 protocol threshold·oracle·liquidity에 더 제한됩니다."
        />
      </section>
      <section id="token-cashflow-control" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · token, cash flow, control
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Mint·transfer·coupon·redemption을 같은 transaction처럼 보이면 끊어진
            reconciliation을 찾을 수 없다
          </h2>
        </header>
        <p>
          Mint 전에는 subscription cash settlement, eligibility/KYC, legal
          register update와 asset acquisition status가 필요합니다. Transfer는
          allowlist와 jurisdiction restriction을 통과해도 legal registry가
          offchain이라면 양쪽 원장을 조정해야 합니다. Coupon은 record
          date·servicer receipt·withholding·distribution claim을, redemption은
          burn intent·cutoff NAV·cash availability·bank settlement·final
          register update를 별도 receipt로 남깁니다.
        </p>
        <p>
          DeFi collateral로 쓰면 token contract risk 외에도 stale NAV, thin
          secondary liquidity, redemption gate, maturity mismatch와
          smart-contract liquidation이 겹칩니다. 1.02달러 NAV를 즉시 1.02달러
          cash로 바꿀 수 있다고 가정하지 않습니다. Oracle timestamp와
          authoritative record mismatch가 나면 신규 mint·borrow를 fail
          closed하고 조사 queue로 보냅니다.
        </p>
        <div id="paper-bis-tokenisation">
          <CitationBlock
            source="BIS · The tokenisation continuum"
            citeKey={2}
            type="paper"
            href="https://www.bis.org/publ/bisbull72.htm"
          >
            <p>
              <strong>문제:</strong> Money·financial·real asset claims를
              programmable platform에 옮길 때 기술적 용이성과 경제·법적 가치가
              일치하지 않을 수 있습니다.
            </p>
            <p>
              <strong>기여:</strong> Core claim layer와 service/governance
              layer, tokenisation feasibility의 연속선을 제시합니다.
            </p>
            <p>
              <strong>전제:</strong> 2023년 공개 제도·시장 구조에 대한 BIS
              분석입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Claim·service·governance를 분리해
              composability를 읽는 개념 근거입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> DLT가 법률·custody·settlement
              finality를 자동 해결하거나 특정 RWA의 수익·유동성을 보장한다는
              뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="rwa-release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Legal opinion·asset ledger·token supply·cash ledger를 같은
            cutoff에서 reconcile한 뒤에만 조합한다
          </h2>
        </header>
        <p>
          Release bundle은 governing documents와 jurisdiction,
          issuer/SPV/custodian/servicer identity, authoritative holder record,
          asset IDs, encumbrance, valuation source/time, liabilities, token
          supply, eligibility policy, cash distribution·redemption queue를
          versioning합니다. Fixtures는 duplicate mint, failed bank settlement,
          late coupon, stale NAV, sanctioned holder, custodian shortfall, chain
          reorg와 insolvency waterfall ambiguity를 포함합니다.
        </p>
        <p>
          기초 6문제는 token/claim, actor map, NAV, transfer와 redemption을
          묻습니다. 심화 4문제는 authoritative-record conflict, stale oracle
          collateral, cashflow reconciliation과 jurisdiction-aware release
          matrix를 설계하게 합니다.
        </p>
      </section>
    </article>
  );
}
