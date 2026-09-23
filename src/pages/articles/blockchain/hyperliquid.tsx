import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { HyperCoreEvmViz, HyperliquidBoundaryViz } from "./hyperliquid/viz/HyperliquidBoundaryViz";

export default function HyperliquidArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">공식 문서 기준 · 2026-09-20</p>
          <h2 className="text-3xl font-bold tracking-tight">Hyperliquid의 속도를 이해하려면 먼저 무엇이 어디에서 확정되는지 나눠야 한다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          사용자는 중앙화 거래소처럼 주문장을 보고 버튼을 누르지만, 자산을 회사 계정에 맡긴 뒤 사내 데이터베이스에서 거래하는 구조와는 다릅니다.
          지갑이 주문 action에 서명하고, HyperCore가 주문장과 마진 상태를 바꾸며, 검증자 합의가 그 순서를 확정합니다. 조회 API와 프런트엔드는 그 결과를
          빠르게 보여 주지만 합의 상태의 소유자는 아닙니다.
        </p>
        <p>
          이 글은 “빠르다”는 결과보다 주문 접수, 체결, 위험 검사, 합의, EVM 호출, 브리지 출금이 각각 어떤 영수증을 남기는지 따라갑니다.
          Hyperliquid의 핵심 구현은 전부 공개 소스가 아니므로, 공식 문서가 설명한 interface를 넘어 내부 알고리즘을 추정하지 않습니다.
        </p>
        <HyperliquidBoundaryViz />
      </section>

      <section id="order-lifecycle" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · 주문</p><h2 className="mt-2 text-2xl font-bold">서명 성공, API 접수, 주문장 포함, 체결은 네 개의 다른 상태다</h2></header>
        <p>
          주문에는 시장, 매수·매도 방향, 가격, 수량, 주문 방식과 nonce가 들어갑니다. 지갑 서명은 “이 계정이 이 action을 승인했다”는 증거일 뿐입니다.
          잘못된 tick, 부족한 마진, 만료된 nonce라면 유효한 서명도 거절될 수 있습니다. API가 성공 응답을 줬더라도 resting order인지 즉시 체결됐는지,
          일부만 체결됐는지, 이후 취소됐는지는 order status와 fills로 다시 확인해야 합니다.
        </p>
        <p>
          지정가 매수 가격이 최우선 매도 가격 이상이면 가격 조건은 맞지만 체결량은 양쪽 잔량 중 작은 값까지만 가능합니다. 여기에 reduce-only,
          self-trade prevention, 자산별 수량 단위와 계정 위험 검사가 더해집니다. 그래서 “가격이 교차했다”는 말은 후보를 만들 뿐 최종 포지션을 보장하지 않습니다.
        </p>
        <ExplainedFormula
          question="서로 가격이 맞는 두 주문이 처음 만들 수 있는 체결 후보는 얼마인가?"
          idea={<>가격 조건을 먼저 확인하고, 이미 체결된 양을 뺀 두 주문의 잔량 가운데 작은 값을 상한으로 잡습니다. 실제 체결은 위험 규칙 때문에 더 작거나 0일 수 있습니다.</>}
          formula={String.raw`p_b\ge p_a,\qquad q_c=\min(q_b-f_b,\;q_a-f_a)`}
          annotatedFormula={String.raw`p_b\ge p_a,\qquad q_c=\underbrace{\min(q_b-f_b,\;q_a-f_a)}_{\text{두 주문 잔량의 공통 상한}}`}
          operations={[
            { expression: String.raw`q_b-f_b`, annotation: ["매수 주문의 최초 수량에서", "이미 체결된 수량을 뺍니다."] },
            { expression: String.raw`q_a-f_a`, annotation: ["매도 주문에도 같은 계산을 해", "현재 제공 가능한 수량을 구합니다."] },
            { expression: String.raw`\min(q_b-f_b,\;q_a-f_a)`, annotation: ["어느 한쪽도 잔량을 넘겨", "체결되지 않도록 작은 값을 택합니다."] },
          ]}
          terms={[
            { symbol: "p_b,p_a", name: "bid·ask limit", description: "매수자가 낼 최대 가격과 매도자가 받을 최소 가격입니다." },
            { symbol: "q_b,q_a", name: "original size", description: "두 주문이 처음 제출한 수량입니다." },
            { symbol: "f_b,f_a", name: "filled size", description: "각 주문에 이미 누적된 체결량입니다." },
            { symbol: "q_c", name: "candidate size", description: "가격과 잔량만 본 체결 후보 상한입니다." },
          ]}
          assumptions={["가격과 수량은 해당 자산의 tick·lot 제약을 만족합니다.", "주문이 취소·만료되지 않았고 nonce가 유효합니다.", "마진, reduce-only와 계정 위험 검사는 이 식 뒤에서 별도로 적용됩니다."]}
          interpretation="매수 잔량이 8, 매도 잔량이 5라면 후보는 5입니다. 하지만 이 5가 계정의 유지 증거금 조건을 깨면 전부 체결된다고 읽으면 안 됩니다."
        />
        <div id="paper-hyperliquid-trading">
          <CitationBlock source="Hyperliquid Docs · Trading" citeKey={1} href="https://hyperliquid.gitbook.io/hyperliquid-docs/trading">
            <p><strong>문제:</strong> 주문 유형과 체결·취소 상태를 사용자가 구분해야 합니다.</p>
            <p><strong>기여:</strong> 주문장 거래, 시장·지정가 주문과 주문 옵션의 공개 동작을 설명합니다.</p>
            <p><strong>전제:</strong> 문서와 해당 시점의 mainnet 설정을 함께 확인해야 합니다.</p>
            <p><strong>근거 범위:</strong> 공개된 거래 interface와 사용자 관찰 상태입니다.</p>
            <p><strong>말하지 않는 것:</strong> 비공개 matching-engine source, 전역 도착 순서의 공정성이나 모든 주문의 체결을 증명하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="margin-liquidation" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 위험</p><h2 className="mt-2 text-2xl font-bold">포지션의 손익은 잔액을 바꾸고, 유지 증거금 아래로 내려가면 청산 경로가 열린다</h2></header>
        <p>
          무기한 선물은 만기 대신 funding을 사용해 계약 가격과 현물 지표의 괴리를 줄입니다. 포지션이 열려 있는 동안 가격 변동 손익과 funding payment가
          account value에 반영됩니다. Cross margin은 여러 포지션이 담보를 공유하고, isolated margin은 지정한 담보 범위 안에서 손실을 격리합니다.
          둘은 레버리지 버튼의 다른 표시가 아니라 청산 시 서로 영향을 주는 범위가 다릅니다.
        </p>
        <p>
          가장 작은 위험 판정은 계정 가치가 유지 증거금보다 큰지 묻는 것입니다. 실제 시스템은 자산별 margin tier, mark price, 포지션 방향, funding,
          열린 주문이 만드는 추가 노출을 함께 계산하므로 아래 식은 직관이지 정확한 청산가 계산기가 아닙니다.
        </p>
        <ExplainedFormula
          question="왜 가격이 조금 움직여도 레버리지 포지션은 청산될 수 있는가?"
          idea={<>담보와 미실현 손익을 합친 계정 가치에서 유지 증거금 요구액을 뺀 여유분을 봅니다. 여유분이 0 이하가 되면 포지션을 그대로 유지할 수 없습니다.</>}
          formula={String.raw`B=C+P-F-M,qquad B\le 0\Rightarrow \text{liquidation eligible}`}
          annotatedFormula={String.raw`B=\underbrace{C+P-F}_{\text{현재 계정 가치}}-\underbrace{M}_{\text{유지 증거금}},qquad B\le 0\Rightarrow \text{청산 가능 상태}`}
          operations={[
            { expression: String.raw`C+P-F`, annotation: ["담보에 미실현 손익을 더하고", "누적 funding 비용을 반영합니다."] },
            { expression: String.raw`(C+P-F)-M`, annotation: ["현재 계정 가치에서 유지해야 할", "최소 증거금을 빼 여유분을 구합니다."] },
          ]}
          terms={[
            { symbol: "C", name: "collateral", description: "위험 계산에 인정되는 담보 가치입니다." },
            { symbol: "P", name: "unrealized PnL", description: "mark price로 평가한 미실현 손익입니다." },
            { symbol: "F", name: "funding net cost", description: "지급한 funding에서 수취한 funding을 뺀 순비용입니다." },
            { symbol: "M", name: "maintenance requirement", description: "포지션을 유지하는 데 필요한 증거금입니다." },
            { symbol: "B", name: "margin buffer", description: "청산 경계까지 남은 단순화한 여유분입니다." },
          ]}
          assumptions={["실제 자산별 tier와 protocol rounding을 생략한 교육용 식입니다.", "Oracle·mark price가 같다고 가정하지 않습니다.", "Cross와 isolated의 C 범위가 서로 다릅니다."]}
          interpretation="담보 1,000, 손실 700, funding 순비용 20, 유지 증거금 300이면 B=-20입니다. 가격만이 아니라 funding과 유지 증거금도 경계를 움직입니다."
        />
        <p>
          청산은 손실을 없애는 보험이 아닙니다. 주문장 유동성이 얕거나 가격이 급변하면 청산 가격과 실제 체결 가격이 달라지고, protocol vault와
          auto-deleveraging 같은 후속 안전장치가 개입할 수 있습니다. trader는 표시된 청산가 한 숫자보다 mark source, margin mode, 열린 주문,
          자산별 한도와 비상 처리 규칙을 함께 확인해야 합니다.
        </p>
        <div id="paper-hyperliquid-margin">
          <CitationBlock source="Hyperliquid Docs · Margining" citeKey={2} href="https://hyperliquid.gitbook.io/hyperliquid-docs/trading/margining">
            <p><strong>문제:</strong> 포지션 손익과 담보를 어떤 범위에서 공유하고 언제 청산 대상으로 볼지 정해야 합니다.</p>
            <p><strong>기여:</strong> Cross·isolated margin, 유지 증거금과 청산의 공개 규칙을 설명합니다.</p>
            <p><strong>전제:</strong> 자산별 현재 margin table과 oracle 설정을 별도로 고정합니다.</p>
            <p><strong>근거 범위:</strong> 공식 문서가 공개한 위험 모델입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 시장 상황에서 표시 청산가와 실제 체결가가 같거나 손실이 일정 한도에서 멈춘다고 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="consensus" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 합의</p><h2 className="mt-2 text-2xl font-bold">HyperCore가 계산한 거래 상태는 HyperBFT가 정한 순서 안에서 재현돼야 한다</h2></header>
        <p>
          검증자는 사용자가 서명한 action과 시스템 action의 순서를 합의하고 같은 상태 전이를 실행합니다. 이 때문에 한 API 서버가 주문을 받았다는 사실과
          검증자 집합이 그 action이 포함된 상태에 합의했다는 사실을 구분해야 합니다. 클라이언트는 order ID와 status만 보지 말고 fill 시각, block,
          포지션·잔액 변화가 함께 맞는지 확인해야 합니다.
        </p>
        <p>
          합의가 체결 순서의 권위를 제공해도 사용자가 원하는 의미의 공정성을 자동 증명하지는 않습니다. 네트워크 지연, validator 접근 경로, 취소와
          신규 주문의 경쟁은 여전히 결과에 영향을 줄 수 있습니다. 또한 문서에 공개되지 않은 validator 내부 코드를 Ethereum식 공개 실행 클라이언트와
          동일하다고 가정해서는 안 됩니다.
        </p>
        <div id="paper-hyperliquid-consensus">
          <CitationBlock source="Hyperliquid Docs · HyperBFT" citeKey={3} href="https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/hyperbft">
            <p><strong>문제:</strong> 거래 action의 단일 순서와 결정된 상태를 검증자들이 합의해야 합니다.</p>
            <p><strong>기여:</strong> Hyperliquid L1의 합의 역할과 validator 운영 표면을 공개합니다.</p>
            <p><strong>전제:</strong> 현재 validator set, staking power와 network configuration을 기준 시점과 함께 읽습니다.</p>
            <p><strong>근거 범위:</strong> 프로젝트가 공식적으로 설명한 consensus architecture입니다.</p>
            <p><strong>말하지 않는 것:</strong> 비공개 구현 전체의 독립 재현, 주문 도착의 전역 공정성 또는 API 가용성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="hyperevm-bridge" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 경계 연결</p><h2 className="mt-2 text-2xl font-bold">HyperEVM과 HyperCore의 상태 경계를 구분한다</h2></header>
        <p>
          HyperEVM은 EVM 스마트 컨트랙트를 실행합니다. HyperCore와 같은 L1 합의에 묶여 있어도 두 실행 환경의 상태와 호출 방식은 구분됩니다.
          컨트랙트는 precompile을 통해 Core의 공개 상태를 읽고, CoreWriter system contract에 action을 제출해 Core 쪽 상태 전이를 요청합니다.
          컨트랙트 호출 성공만 보고 perp 주문 체결까지 성공했다고 결론 내리지 말고, Core 쪽 후속 상태를 확인해야 합니다.
        </p>
        <HyperCoreEvmViz />
        <p>
          외부 체인에서 들어오는 자산은 또 다른 경계입니다. 브리지 예치 transaction, Hyperliquid validator의 예치 인식, Core 잔액 반영은 서로 다른
          단계입니다. 출금도 Core debit, validator authorization, 목적 체인의 최종 수령을 각각 대조해야 합니다.
        </p>
        <p>
          따라서 브리지 UI의 “완료” 한 줄보다 source transaction hash, 목적지, 수량, validator 처리 상태와 destination receipt를 함께 보관하는 편이
          안전합니다.
        </p>
        <div id="paper-hyperliquid-hyperevm">
          <CitationBlock source="Hyperliquid Docs · HyperEVM" citeKey={4} href="https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/hyperevm">
            <p><strong>문제:</strong> 일반 EVM contract와 고성능 금융 상태가 서로 안전하게 읽고 action을 전달해야 합니다.</p>
            <p><strong>기여:</strong> HyperEVM, Core state precompile과 CoreWriter interface의 공개 경계를 설명합니다.</p>
            <p><strong>전제:</strong> 배포된 system address, ABI와 network revision을 확인합니다.</p>
            <p><strong>근거 범위:</strong> 문서화된 EVM↔Core 상호운용 interface입니다.</p>
            <p><strong>말하지 않는 것:</strong> EVM transaction 성공이 Core action 체결, bridge finality 또는 application-level atomicity를 자동 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="risk-checklist" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">05 · 검증</p><h2 className="mt-2 text-2xl font-bold">평가할 때는 낮은 지연과 탈중앙성이라는 두 단어보다 실패했을 때 남는 증거를 본다</h2></header>
        <p>
          거래 봇은 같은 action을 재전송했을 때 nonce가 중복 체결을 막는지, timeout 뒤 상태가 unknown일 때 조회로 reconcile할 수 있는지 검사해야 합니다.
          일부 체결 뒤 취소, cross·isolated 전환, oracle 급변, funding 반영 직전과 직후, API 장애 중 주문 상태를 failure fixture로 남깁니다.
        </p>
        <p>
          컨트랙트 앱은 EVM receipt와 Core state receipt를 따로 저장하고, 브리지 앱은 source와 destination receipt를 묶어야 합니다.
        </p>
        <p>
          자산별 설정과 validator·bridge 운영 규칙은 바뀔 수 있습니다. 수수료·margin tier·withdrawal 조건을 코드에 고정하지 말고 기준 block과 설정
          snapshot을 기록해야 합니다. 이 과정을 통과해야 “빠른 주문 화면”을 “복구 가능한 금융 시스템”으로 사용할 수 있습니다.
        </p>
        <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3>
        <p>
          기초 6문제는 주문의 네 상태, 체결 후보, cross·isolated, margin buffer, HyperCore·HyperEVM과 bridge 단계를 확인합니다.
          심화 4문제는 timeout 재조정, 일부 체결·취소 경쟁, oracle·funding 경계, CoreWriter와 bridge의 이중 영수증 검사를 설계하게 합니다.
        </p>
      </section>
    </article>
  );
}
