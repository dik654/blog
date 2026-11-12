import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { usdcCodeRefs } from "./codeRefs";
import { cctpTree, stablecoinTree } from "./fileTrees";
import CctpDestinationChecksViz from "./viz/CctpDestinationChecksViz";
import UsdcLifecycleViz from "./viz/UsdcLifecycleViz";

const STABLECOIN_COMMIT = "fc85788bc7c23cefe3df1a757133048bfddadeaa";
const CCTP_COMMIT = "a92a2b4e7e6ef99bf0b05dca71780f5ec190e729";

export default function ModernUsdcArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14 [overflow-wrap:anywhere]">
      <section id="overview" className="space-y-6 scroll-mt-20">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            한 문장으로 먼저 답하기
          </p>
          <h2 className="max-w-4xl break-keep text-3xl font-bold tracking-tight">
            USDC는 달러가 아니라 상환 약속을 표시한 token입니다
          </h2>
        </header>

        <p className="text-lg leading-8 text-foreground/90">
          은행 계좌의 달러가 blockchain 안으로 들어가는 것은 아닙니다. Circle이
          별도 reserve를 보유하고, 조건을 충족한 holder에게 1 USDC를 1달러로
          상환하겠다고 약속합니다. 각 chain의 native USDC contract는 이 약속이
          현재 몇 단위 유통되는지를 기록합니다.
        </p>
        <p className="text-lg leading-8 text-foreground/90">
          설명용 고객이 100달러를 입금해 Ethereum에서 100 USDC를 발행하고,
          그중 25를 CCTP로 Base에 옮긴 뒤 40을 다시 달러로 상환한다고
          하겠습니다. 이 한 건만 따라가도 은행·발행자·두 chain·CCTP가 서로 다른
          원장이라는 사실이 보입니다.
        </p>
        <p>
          그래서 “USDC는 1달러다”라는 문장에는 세 질문이 숨어 있습니다. Circle에
          직접 1달러를 요구할 자격이 있는지, chain의 token supply가 reserve와
          맞는지, 지금 거래소에서 실제로 1달러에 팔 수 있는지는 서로 다른
          문제입니다.
        </p>

        <UsdcLifecycleViz />
        <ContentBoundary article="usdc-circle" />

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            [
              "CHAIN이 기록",
              "Token balance와 supply",
              "누가 몇 USDC를 보유하고 mint·burn으로 총량이 어떻게 바뀌었는지 기록합니다.",
            ],
            [
              "약관이 정함",
              "직접 상환 권리와 조건",
              "Circle Mint 계정·지역·KYC·법적 제한을 통과해야 발행자에게 직접 상환할 수 있습니다.",
            ],
            [
              "시장이 결정",
              "지금 거래되는 가격",
              "거래소 유동성·상환 접근성·은행과 발행자에 대한 인식이 1달러 부근의 가격을 만듭니다.",
            ],
          ].map(([scope, title, body]) => (
            <article key={scope} className="min-w-0 bg-background p-4">
              <p className="text-[9px] font-bold text-primary">{scope}</p>
              <h3 className="mt-2 break-keep text-sm font-black">{title}</h3>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                {body}
              </p>
            </article>
          ))}
        </div>

        <div id="paper-circle-terms" className="scroll-mt-24">
          <CitationBlock
            source="Circle · USDC Terms · 2026-10-15"
            citeKey={1}
            href="https://www.circle.com/legal/usdc-terms"
          >
            <p>
              <strong>문제:</strong> Token을 보유한 사람과 Circle에 직접 상환을
              요구할 수 있는 사람을 구분해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> EEA 밖의 User Type A·B, Circle Mint 계정,
              1:1 발행·상환 조건, 제3자 시장 가격과 예금보험 부재를 명시합니다.
            </p>
            <p>
              <strong>전제:</strong> 2026년 10월 15일 개정본이며 EEA holder는
              별도 MiCA white paper를 봅니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Direct redemption의 법적·계정 경계와
              holder가 reserve 이자에 권리를 갖지 않는다는 약관입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 특정 보유자의 상환 자격, 즉시 지급,
              제3자 거래소의 1달러 가격이나 법률 자문을 제공하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="issuance-redemption" className="space-y-6 scroll-mt-20">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · 100달러가 token이 되고 다시 은행으로 돌아오기
          </p>
          <h2 className="mt-2 break-keep text-2xl font-bold">
            Mint와 burn은 은행 입금·지급과 같은 사건이 아닙니다
          </h2>
        </header>

        <p>
          먼저 eligible Circle Mint 고객의 100달러 입금이 되돌릴 수 없는 상태로
          정산돼야 합니다. 그다음 승인된 minter가 선택한 chain의 contract를
          호출합니다. 실제 EVM reference contract는 pause 상태, minter 권한,
          blacklist와 남은 mint allowance를 확인한 뒤에만 total supply와 고객
          balance를 함께 100 늘립니다.
        </p>
        <p>
          반대 방향도 두 사건입니다. 상환 요청에 연결된 40 USDC를 burn하면
          onchain supply는 40 줄어듭니다. 하지만 burn transaction에는 고객 은행
          계좌로 40달러를 보냈다는 정보가 없습니다. Bank payout receipt까지
          확인해야 상환이 닫힙니다.
        </p>

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="승인된 minter의 실제 mint"
            onClick={() =>
              sidebar.open("fiat-token-mint", usdcCodeRefs["fiat-token-mint"])
            }
          />
          <CodeViewButton
            label="Supply만 줄이는 실제 burn"
            onClick={() =>
              sidebar.open("fiat-token-burn", usdcCodeRefs["fiat-token-burn"])
            }
          />
        </div>

        <ExplainedFormula
          question="Token이 잠시 사라져 보일 때 100이라는 가치는 어디에 남아 있을까요?"
          idea="이 글의 한 고객 사례에서는 circulating supply뿐 아니라 발행 대기·CCTP 대기·은행 지급 대기를 따로 더해 진행 중인 값을 추적합니다."
          formula={String.raw`V=I+\sum_c S_c+X+P`}
          annotatedFormula={String.raw`\underbrace{V}_{\text{설명용 추적 가치}}=\underbrace{I}_{\text{발행 대기}}+\underbrace{\sum_c S_c}_{\text{chain별 native supply}}+\underbrace{X}_{\text{CCTP 대기}}+\underbrace{P}_{\text{은행 지급 대기}}`}
          operations={[
            {
              expression: String.raw`I`,
              annotation: [
                "100달러 입금은 끝났지만 mint 전이면 100",
                "mint가 끝나면 0",
              ],
            },
            {
              expression: String.raw`\sum_c S_c`,
              annotation: [
                "Ethereum·Base 같은 native contract supply 합",
                "발행 뒤 100, CCTP source burn 직후 75",
              ],
            },
            {
              expression: String.raw`X`,
              annotation: [
                "Source burn 뒤 destination mint 전의 message 수량",
                "25 burn 직후 25, destination mint 뒤 0",
              ],
            },
            {
              expression: String.raw`P`,
              annotation: [
                "상환 burn 뒤 bank payout 전의 지급 대기",
                "40 burn 직후 40, USD 지급 뒤 0",
              ],
            },
          ]}
          terms={[
            {
              symbol: "V",
              name: "teaching trace value",
              description:
                "한 고객의 발행·이동·상환 상태를 빠뜨리지 않기 위한 설명용 합계입니다.",
            },
            {
              symbol: "I",
              name: "pending issuance",
              description: "Fiat 정산 뒤 token mint 전의 고객별 진행 상태입니다.",
            },
            {
              symbol: String.raw`S_c`,
              name: "native supply on chain c",
              description: "같은 contract generation과 cutoff에서 읽은 chain별 supply입니다.",
            },
            {
              symbol: "X",
              name: "pending CCTP message",
              description: "Source burn 뒤 destination mint 전의 순수한 이동 상태입니다.",
            },
            {
              symbol: "P",
              name: "pending fiat payout",
              description: "상환 burn 뒤 은행 지급 완료 전의 고객별 상태입니다.",
            },
          ]}
          assumptions={[
            "100·25·40 한 고객 사례이고 CCTP fee는 0으로 둡니다.",
            "Chain finality와 issuer·bank receipt를 단계마다 따로 확인합니다.",
            "이 식은 이해를 위한 운영 장부이지 Circle의 GAAP 회계식이나 monthly reserve assurance 기준이 아닙니다.",
            "Reserve는 수익·비용·다른 고객의 흐름 때문에 V와 항상 정확히 같다고 가정하지 않습니다.",
          ]}
          interpretation="입금 직후에는 I=100, mint 뒤에는 S=100입니다. CCTP burn 직후에는 S=75·X=25, destination mint 뒤에는 S=100입니다. 40을 상환 burn하면 S=60·P=40이고, 은행 지급 뒤에는 S=60·P=0이 됩니다."
        />

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            [
              "CIRCLE MINT 고객",
              "조건부 direct redemption",
              "계정 상태·KYC·지역·법적 제한과 fee 조건을 통과해 Circle에 직접 상환을 요청합니다.",
            ],
            [
              "일반 wallet holder",
              "Token과 조건부 권리 보유",
              "Circle Mint에 적격 등록하지 않으면 Circle에 직접 redeem하지 못하고 거래소·onramp를 사용할 수 있습니다.",
            ],
            [
              "거래소 이용자",
              "제3자 가격·출금 경로",
              "거래소의 USD·USDC 교환은 Circle 약관의 direct redemption과 별도 계약입니다.",
            ],
          ].map(([actor, right, detail]) => (
            <article key={actor} className="min-w-0 bg-background p-4">
              <p className="text-[9px] font-bold text-primary">{actor}</p>
              <h3 className="mt-2 break-keep text-sm font-black">{right}</h3>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>

        <p>
          EEA에서는 Circle SAS와 MiCA white paper의 reserve·redemption 체계를 함께
          봐야 합니다. EEA 밖 약관의 “Circle LLC 한 곳”이라는 표현을 전 세계
          holder에게 그대로 적용하면 안 됩니다. 같은 USDC가 기술적으로
          fungible해도 법적 issuer와 적용 문서는 holder의 지역에 따라 달라질 수
          있습니다.
        </p>

        <div id="paper-circle-mica" className="scroll-mt-24">
          <CitationBlock
            source="Circle · MiCA USDC White Paper"
            citeKey={2}
            href="https://www.circle.com/legal/mica-usdc-whitepaper"
          >
            <p>
              <strong>문제:</strong> EEA holder에게 적용되는 issuer·reserve·상환
              구조를 비EEA 약관과 분리해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Circle SAS의 MiCA상 발행, EEA reserve와
              Circle LLC 발행분의 fungibility, EEA holder 절차를 설명합니다.
            </p>
            <p>
              <strong>전제:</strong> 현재 white paper와 holder의 실제 관할·자격을
              확인해야 합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> EEA 규제 문서의 issuer·reserve·complaint
              경계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 모든 국가의 규제, 세무 처리나 특정
              holder의 법적 결론을 대신하지 않습니다.
            </p>
          </CitationBlock>
        </div>

        <div id="paper-stablecoin-evm" className="scroll-mt-24">
          <CitationBlock
            type="code"
            citeKey={3}
            source={`circlefin/stablecoin-evm · ${STABLECOIN_COMMIT.slice(0, 8)}`}
            href={`https://github.com/circlefin/stablecoin-evm/tree/${STABLECOIN_COMMIT}`}
          >
            <p>
              <strong>문제:</strong> Native USDC supply를 권한 있는 mint·burn과
              pause·blacklist·upgrade 경계 아래 관리해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> FiatToken의 executable role·supply·balance
              transition을 제공합니다.
            </p>
            <p>
              <strong>고정한 버전:</strong> Commit <code>fc85788b</code>의 EVM
              reference source입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 모든 chain의 bytecode가 이 commit과
              같거나 admin key·upgrade·policy가 무위험이라는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="cctp-burn-mint" className="space-y-6 scroll-mt-20">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · 25 USDC가 chain 사이를 건널 때
          </p>
          <h2 className="mt-2 break-keep text-2xl font-bold">
            CCTP는 한 chain에서 없애고 다른 chain에서 다시 만듭니다
          </h2>
        </header>

        <p>
          Ethereum의 25 USDC를 Base로 옮긴다고 하겠습니다. Source
          <code>TokenMessengerV2</code>는 25를 자기 쪽 minter로 옮겨 burn하고,
          destination domain, mint recipient, amount, max fee와 최소 finality가 든
          message를 냅니다. 이 순간 두 chain의 native supply 합은 100에서 75로
          내려가지만 reserve는 그대로입니다.
        </p>
        <p>
          Circle의 offchain service인 Iris는 source confirmation을 기다린 뒤 이
          message에 서명합니다. 이것이 CCTP attestation입니다. Reserve report를
          검토하는 회계 assurance와 이름은 비슷하지만, CCTP attestation이
          증명하는 것은 특정 burn message입니다.
        </p>

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Source burn과 message 생성"
            onClick={() =>
              sidebar.open("cctp-deposit-burn", usdcCodeRefs["cctp-deposit-burn"])
            }
          />
          <CodeViewButton
            label="Attestation·domain·nonce 검사"
            onClick={() =>
              sidebar.open("cctp-validate", usdcCodeRefs["cctp-validate"])
            }
          />
          <CodeViewButton
            label="Nonce 사용과 handler 호출"
            onClick={() =>
              sidebar.open("cctp-receive", usdcCodeRefs["cctp-receive"])
            }
          />
          <CodeViewButton
            label="Destination mint와 fee 분리"
            onClick={() =>
              sidebar.open(
                "cctp-mint-destination",
                usdcCodeRefs["cctp-mint-destination"],
              )
            }
          />
        </div>

        <CctpDestinationChecksViz />

        <p>
          Base의 <code>MessageTransmitterV2</code>는 attester signature, destination
          domain, 제한된 caller, message version과 아직 쓰이지 않은 nonce를
          확인합니다. 통과하면 nonce를 사용 처리하고 TokenMessenger handler를
          부릅니다.
        </p>
        <p>
          이어서 handler가 message body의 version·expiration·fee를 검사합니다.
          검사를 통과하면 recipient와 fee recipient에 합계 25를 mint합니다. 같은
          nonce를 다시 내면 두 번째 mint는 막힙니다.
        </p>

        <ExplainedFormula
          question="CCTP 이동 중 chain별 supply 합이 잠시 75가 되어도 25가 사라진 것은 아닐까요?"
          idea="Confirmed native supply와 아직 destination mint를 기다리는 burn message를 따로 봅니다."
          formula={String.raw`T=\sum_c S_c+X`}
          annotatedFormula={String.raw`\underbrace{T}_{\text{이동 중 추적 합계}}=\underbrace{\sum_c S_c}_{\text{모든 chain의 native supply}}+\underbrace{X}_{\text{burn 뒤 mint 전 message}}`}
          operations={[
            {
              expression: String.raw`100+0`,
              annotation: ["이동 전 Ethereum 100", "CCTP 대기 0", "T=100"],
            },
            {
              expression: String.raw`75+25`,
              annotation: [
                "Source burn 뒤 native supply 합 75",
                "Attestation·destination mint 대기 25",
                "T=100",
              ],
            },
            {
              expression: String.raw`100+0`,
              annotation: [
                "Destination mint 뒤 Ethereum 75+Base 25",
                "Message 대기 0",
                "T=100",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`S_c`,
              name: "native supply",
              description: "Chain c의 공식 native USDC contract confirmed supply입니다.",
            },
            {
              symbol: "X",
              name: "pending burn message",
              description:
                "Source burn은 확정됐지만 destination mint가 아직 성공하지 않은 설명용 수량입니다.",
            },
            {
              symbol: "T",
              name: "transfer trace total",
              description: "한 CCTP 이동을 놓치지 않기 위한 운영 추적 합계입니다.",
            },
          ]}
          assumptions={[
            "같은 native USDC generation과 같은 finality 기준으로 supply를 읽습니다.",
            "설명용 전송의 fee는 0입니다. Fee가 있으면 recipient와 fee recipient의 mint 합계를 봅니다.",
            "X는 공식 reserve report 항목이 아니라 운영자가 source burn과 destination mint를 조정하기 위한 상태입니다.",
            "Bridged wrapper나 unsupported token을 native supply에 섞지 않습니다.",
          ]}
          interpretation="Source burn 직후에는 onchain native supply만 보면 75이지만, 아직 끝나지 않은 message 25를 함께 추적해야 어느 단계에서 멈췄는지 알 수 있습니다."
        />

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["Confirmed 1000", "Fast 후보", "Iris가 confirmed 수준에서 attest할 수 있는 V2 threshold"],
            ["Finalized 2000", "Standard", "Finalized 수준을 기다리는 V2 threshold"],
            ["Nonce used", "Replay 차단", "한 destination에서 같은 message를 두 번 처리하지 않음"],
            ["Expiration", "재서명 경로", "만료된 fast burn은 source burn을 되돌리는 대신 re-attest 가능"],
          ].map(([value, name, detail]) => (
            <article key={value} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[10px] font-black text-primary">{value}</p>
              <h3 className="mt-2 break-keep text-sm font-black">{name}</h3>
              <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">
                {detail}
              </p>
            </article>
          ))}
        </div>

        <p>
          Fast가 항상 더 좋은 것은 아닙니다. 더 낮은 confirmation에서 빠르게
          실행하는 대신 integrator가 reorg·allowance·fee·expiration을 운영해야
          합니다. Standard는 더 오래 기다리지만 finalized threshold를 사용합니다.
          어느 쪽이든 destination hook의 사업 로직과 recipient address 검증은
          integrator의 책임으로 남습니다.
        </p>

        <div id="paper-circle-cctp" className="scroll-mt-24">
          <CitationBlock
            source="Circle · CCTP V2 Technical Guide"
            citeKey={4}
            href="https://developers.circle.com/cctp/references/technical-guide"
          >
            <p>
              <strong>문제:</strong> Native USDC를 source에서 제거하고 다른
              domain에서 중복 없이 다시 발행해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Message header·burn body, Iris attestation,
              nonce, 1000/2000 finality threshold, expiration·fee·re-attestation을
              정의합니다.
            </p>
            <p>
              <strong>전제:</strong> CCTP V2, 지원 domain·contract와 해당 시점의
              fee·allowance·finality policy를 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Burn message에서 destination handler까지의
              protocol 경계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> Reserve solvency, destination app의
              hook 안전, zero-latency나 모든 reorg 손실 방지를 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>

        <div id="paper-cctp-contracts" className="scroll-mt-24">
          <CitationBlock
            type="code"
            citeKey={5}
            source={`circlefin/evm-cctp-contracts · ${CCTP_COMMIT.slice(0, 8)}`}
            href={`https://github.com/circlefin/evm-cctp-contracts/tree/${CCTP_COMMIT}`}
          >
            <p>
              <strong>문제:</strong> 문서의 burn·message·replay·mint 순서를 실제
              EVM state transition에서 확인해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> TokenMessengerV2와 MessageTransmitterV2의
              executable validation·nonce·handler·fee 경계를 제공합니다.
            </p>
            <p>
              <strong>고정한 버전:</strong> Commit <code>a92a2b4e</code>의 V2
              source입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 모든 non-EVM 구현, 현재 배포 주소,
              attester key 운영이나 integrator hook의 안전을 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="reserve-release" className="space-y-6 scroll-mt-20">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · 준비금, 시장 가격, 권한과 사업 모델
          </p>
          <h2 className="mt-2 break-keep text-2xl font-bold">
            “1달러를 뒷받침한다”는 말은 네 가지 검사를 통과해야 합니다
          </h2>
        </header>

        <p>
          Circle은 reserve holdings를 주간 공개하고 Big Four 회계법인의 monthly
          assurance를 게시한다고 설명합니다. 이 assurance는 정해진 기준일의
          management assertion과 reserve·USDC in circulation을 대상으로 합니다.
          실시간 모든 transaction의 증명도 아니고, 한 사용자의 payout SLA나
          제3자 거래소 가격을 보장하는 문서도 아닙니다.
        </p>

        <div className="not-prose overflow-hidden border border-border">
          <div className="grid grid-cols-[minmax(6.5rem,0.75fr)_minmax(0,1.25fr)_minmax(0,1.25fr)] bg-muted/50 text-[9px] font-black">
            <div className="p-3">이름</div>
            <div className="p-3">확인하는 것</div>
            <div className="p-3">확인하지 않는 것</div>
          </div>
          {[
            [
              "Reserve assurance",
              "기준일의 reserve와 USDC in circulation에 대한 특정 assertion",
              "실시간 solvency·모든 holder의 즉시 상환·시장가격",
            ],
            [
              "Financial audit",
              "회사 재무제표와 내부통제에 대한 연간 감사 범위",
              "매일의 모든 reserve movement를 실시간 공개",
            ],
            [
              "CCTP attestation",
              "특정 burn message와 executed finality에 대한 signature",
              "Reserve asset·Circle 전체 재무·destination app 안전",
            ],
          ].map(([name, yes, no]) => (
            <div
              key={name}
              className="grid grid-cols-[minmax(6.5rem,0.75fr)_minmax(0,1.25fr)_minmax(0,1.25fr)] border-t border-border text-[10px] leading-5"
            >
              <strong className="break-words p-3">{name}</strong>
              <p className="break-keep p-3 text-muted-foreground">{yes}</p>
              <p className="break-keep p-3 text-muted-foreground">{no}</p>
            </div>
          ))}
        </div>

        <p>
          Primary market에서 적격 고객이 1 USDC를 1달러로 발행·상환할 수 있는
          길은 secondary market의 차익 거래 기준점이 됩니다. 하지만 거래소의
          실제 가격은 매수·매도 유동성, 상환 rail의 개방 여부, 은행과 issuer에
          대한 사람들의 인식에 따라 1달러 위아래로 움직일 수 있습니다. Contract의
          <code>totalSupply</code>만 보고 시장 peg까지 증명할 수 없는 이유입니다.
        </p>

        <h3 className="break-keep text-xl font-bold">
          통제 권한은 안정 장치이면서 동시에 신뢰 경계입니다
        </h3>
        <p>
          EVM reference contract에는 minter, master minter, pauser, blacklister,
          owner와 proxy admin 같은 역할이 있습니다. 잘못된 발행, 제재 대상 주소,
          심각한 bug에 대응할 수 있다는 장점이 있습니다. 반대로 transfer 중단,
          주소 차단, 구현 upgrade가 가능한 중앙 권한이라는 뜻이기도 합니다.
          “규제 준수”와 “검열·key compromise 위험”을 한쪽만 보고 평가하면 안
          됩니다.
        </p>

        <h3 className="break-keep text-xl font-bold">
          Holder에게 이자를 주지 않는 reserve가 Circle의 핵심 수익원이 됩니다
        </h3>
        <p>
          Circle의 2025 Form 10-K는 reserve income이 계속사업 총수익의 96.0%였다고
          보고합니다. 다만 “모든 이자를 Circle이 그대로 가진다”도 틀립니다.
          Coinbase와 다른 유통 파트너에게 지급하는 distribution cost, blockchain
          transaction cost와 운영비가 빠집니다.
        </p>

        <ExplainedFormula
          question="2025년 공개 재무 숫자로 distribution cost까지 뺀 규모는 얼마였을까요?"
          idea="총 revenue와 reserve income에서 distribution·transaction·other cost를 뺍니다. 이것은 순이익이 아니라 다음 비용을 빼기 전의 회사 지표입니다."
          formula={String.raw`RLDC=2{,}746.642-1{,}663.651=1{,}082.991\ \text{million USD}`}
          annotatedFormula={String.raw`\underbrace{1{,}082.991}_{\text{revenue less distribution costs}}=\underbrace{2{,}746.642}_{\text{total revenue + reserve income}}-\underbrace{1{,}663.651}_{\text{distribution + transaction + other costs}}`}
          operations={[
            {
              expression: String.raw`2{,}746.642`,
              annotation: [
                "2025 total revenue and reserve income",
                "단위는 million USD",
              ],
            },
            {
              expression: String.raw`-1{,}663.651`,
              annotation: [
                "distribution·transaction·other costs",
                "유통 파트너와 chain 실행 비용 포함",
              ],
            },
            {
              expression: String.raw`=1{,}082.991`,
              annotation: [
                "공시의 반올림 표기는 약 1,083 million",
                "operating expense·tax 전이므로 net profit 아님",
              ],
            },
          ]}
          terms={[
            {
              symbol: "RLDC",
              name: "revenue less distribution costs",
              description: "Circle이 사용하는 비GAAP 지표로 유통 관련 비용을 뺀 수익 규모입니다.",
            },
            {
              symbol: "reserve income",
              name: "reserve assets에서 난 수익",
              description:
                "평균 segregated reserve balance와 reserve return rate의 영향을 받습니다.",
            },
            {
              symbol: "distribution costs",
              name: "유통 파트너 비용",
              description: "USDC 보유·유통을 넓히는 파트너 arrangement에 연결된 비용입니다.",
            },
          ]}
          assumptions={[
            "2025 Form 10-K의 실제 보고 숫자를 million USD 단위로 사용합니다.",
            "RLDC는 SEC가 정의한 GAAP 순이익이 아니며 operating expense와 tax를 더 빼야 합니다.",
            "향후 금리·circulation·partner agreement가 달라지면 같은 숫자가 반복되지 않습니다.",
            "USDC holder는 약관상 reserve 이자나 이 수익에 대한 권리를 갖지 않습니다.",
          ]}
          interpretation="2,746.642−1,663.651=1,082.991 million USD입니다. 10-K의 반올림 표기 1,083 million과 맞지만, 이 숫자를 Circle의 순이익이라고 부르면 안 됩니다."
        />

        <p>
          같은 10-K의 금리 민감도 예시는 2025년 말 circulation을 고정했을 때
          금리 100bp 하락이 향후 12개월 reserve income을 약 756 million USD,
          distribution·transaction cost를 약 369 million USD 줄이는 것으로
          모델링합니다. 이는 예측값이 아니라 공시의 가정 실험입니다. 사용자
          수요, circulation과 파트너 계약이 함께 변하면 실제 결과는 달라집니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Reserve cutoff", "같은 기준일·valuation", "Supply와 날짜가 다르면 coverage 비교 중단"],
            ["Redemption", "burn + bank payout", "한쪽 receipt만 있으면 pending 유지"],
            ["CCTP", "burn + message + mint", "wrong domain·recipient·nonce 재사용 거절"],
            ["Admin·market", "role·pause + 거래 유동성", "Contract 정상만으로 1달러 가격을 선언하지 않음"],
          ].map(([gate, evidence, fail]) => (
            <article key={gate} className="min-w-0 bg-background p-4">
              <p className="text-[9px] font-bold text-primary">{gate}</p>
              <h3 className="mt-2 break-keep text-sm font-black">{evidence}</h3>
              <p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">
                {fail}
              </p>
            </article>
          ))}
        </div>

        <div id="paper-circle-transparency" className="scroll-mt-24">
          <CitationBlock
            source="Circle · Transparency & Stability"
            citeKey={6}
            href="https://www.circle.com/transparency"
          >
            <p>
              <strong>문제:</strong> Circulating USDC와 이를 뒷받침한다고 발행자가
              공개하는 reserve의 구성과 cadence를 확인해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Weekly holdings·mint/burn disclosure, monthly
              third-party assurance와 Circle Reserve Fund의 issuer claim을
              제공합니다.
            </p>
            <p>
              <strong>전제:</strong> Circle이 게시한 현재 disclosure와 연결된
              report의 기준일·scope를 함께 읽습니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Reserve 구성·공시 주기·1:1 redeemability
              claim입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> Real-time proof, 모든 holder의 direct
              redemption, 즉시 payout이나 secondary-market 1달러 체결을 보장하지
              않습니다.
            </p>
          </CitationBlock>
        </div>

        <div id="paper-circle-10k" className="scroll-mt-24">
          <CitationBlock
            source="Circle Internet Group · 2025 Form 10-K"
            citeKey={7}
            href="https://www.sec.gov/Archives/edgar/data/1876042/000187604226000062/crcl-20251231.htm"
          >
            <p>
              <strong>문제:</strong> Reserve yield가 issuer의 수익과 partner 비용,
              금리 민감도로 어떻게 이어지는지 marketing 문구가 아닌 재무 공시로
              확인해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> 2025 reserve income, distribution·transaction
              costs, RLDC와 ±100bp interest-rate scenario를 제공합니다.
            </p>
            <p>
              <strong>전제:</strong> 2025 회계연도 실제치와 filing이 명시한 향후
              12개월 가정 실험을 구분합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Issuer economics와 당시 risk disclosure에
              한정합니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 미래 수익·금리·USDC circulation,
              주가나 투자 성과를 예측하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={usdcCodeRefs}
        fileTrees={{
          "stablecoin-evm": stablecoinTree,
          "evm-cctp-contracts": cctpTree,
        }}
        projectMetas={{
          "stablecoin-evm": {
            id: "stablecoin-evm",
            label: "Circle stablecoin-evm · fc85788",
            badgeClass: "border-sky-500 bg-sky-500/10 text-sky-700",
          },
          "evm-cctp-contracts": {
            id: "evm-cctp-contracts",
            label: "Circle CCTP V2 · a92a2b4",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
