import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  OnchainCloudFlowViz,
  PaymentRailViz,
  PeriodStateViz,
} from "./OnchainCloudFlowViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { filecoinServicesTree, filecoinPayTree } from "./fileTree";

const SERVICES_SPEC =
  "https://github.com/FilOzone/filecoin-services/blob/a391c1cd23c95ee8d8eadec462cdc35569ae486d/SPEC.md";
const WARM_CONTRACT =
  "https://github.com/FilOzone/filecoin-services/blob/a391c1cd23c95ee8d8eadec462cdc35569ae486d/service_contracts/src/FilecoinWarmStorageService.sol";
const PAY_SPEC =
  "https://github.com/FilOzone/filecoin-pay/blob/04ded6af6c15c4b5d98545f393dc656004d4aede/SPEC.md";
const SYNAPSE_MANAGER =
  "https://github.com/FilOzone/synapse-sdk/blob/44ffc12fd9b5390820d9642148f6a36b9b2baed4/packages/synapse-sdk/src/storage/manager.ts";

export default function ModernFilecoinOnchainCloud() {
  const sidebar = useCodeSidebar();
  return (
    <>
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            파일 조각 하나를 맡긴 뒤, 실제 보관 기간만큼만 지급하기
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            먼저 네 개의 기록을 따로 이해하고 마지막에 하나의 서비스로
            연결합니다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          상황부터 잡아 봅시다. 사용자가 파일 조각 하나를 보관 업체에
          맡겼습니다. 이제 네 질문에 차례로 답해야 합니다. 업체가 파일을 실제로
          받았는가, chain에는 누구의 어떤 파일로 기록됐는가, 각 기간의 보관
          증명이 끝났는가, 끝난 기간의 비용이 얼마인가. 네 답을 한 문장에
          압축하지 않고 아래에서 한 줄씩 읽습니다.
        </p>
        <TermBreakdown
          title="서비스를 구성하는 네 기록"
          description="지금은 각 기록이 소유하는 사실 하나만 봅니다. 네 기록을 서로 연결하는 일은 마지막 절에서 합니다."
          items={[
            {
              term: "Upload receipt",
              description:
                "보관 업체가 특정 파일 bytes를 실제로 받았다는 off-chain 응답입니다.",
              example:
                "Provider endpoint가 piece CID와 저장 성공 ID를 돌려줍니다.",
              boundary:
                "파일을 받았다는 뜻일 뿐, chain에 dataset으로 등록됐다는 뜻은 아닙니다.",
            },
            {
              term: "Dataset record",
              description:
                "누가 어떤 파일을 어느 provider에게 맡겼는지 chain에서 다시 식별하는 주문 명세서입니다.",
              example:
                "Client, provider, dataset ID와 순서가 있는 piece 목록을 함께 기록합니다.",
              boundary:
                "주문 identity를 고정하지만 이후 proof의 성공까지 보장하지는 않습니다.",
            },
            {
              term: "Period state",
              description:
                "정해진 보관 기간 하나가 아직 판정 중인지, proof를 통과했는지, 실패했는지를 나타냅니다.",
              example:
                "한 period는 open, proven, faulted 중 하나로 판정됩니다.",
              boundary:
                "Proof transaction을 보냈다는 사실과 canonical proven 판정은 다릅니다.",
            },
            {
              term: "Payment rail",
              description:
                "누가 누구에게 어떤 속도로 어디까지 지급했는지를 계속 갱신하는 on-chain 지급 원장입니다.",
              example:
                "Deposit, rate, lockup과 settledUpTo cursor를 한 rail에서 관리합니다.",
              boundary:
                "정기 송금 자체가 아니라 proof 판정에 따라 정산할 수 있는 범위를 가진 원장입니다.",
            },
          ]}
        />
        <p>
          이 글의 마지막에서만 네 기록을 연결합니다. 따라서 upload 성공을 곧바로
          보관 증명이나 지급 성공으로 읽지 않습니다.{" "}
          <a
            className="text-primary hover:underline"
            href="/blockchain/filecoin-pdp#overview"
          >
            PDP의 challenge·fault 정본
          </a>
          은 재사용하고, 여기서는 Warm Storage가 proof 결과를 payment에 연결하는
          방법만 설명합니다.
        </p>
        <ContentBoundary article="filecoin-onchain-cloud" />
        <div id="paper-filecoin-services-spec">
          <CitationBlock
            type="code"
            citeKey={1}
            source="Filecoin Services specification · commit a391c1c"
            href={SERVICES_SPEC}
          >
            <p>
              <strong>문제:</strong> Dataset proving lifecycle과 storage/CDN
              payment rails, rate changes·termination을 같은 service
              contract에서 일관되게 연결해야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Pinned specification은 dataset
              callbacks, proving-period verdicts, proof-gated validation, rail
              lockup·settlement와 teardown ordering을 설명합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> commit a391c1c의 contracts, deployed
              addresses·price list, PDP/Filecoin Pay revisions와 chain epoch를
              함께 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 Filecoin Services implementation
              specification snapshot의 현재 설계에 한정합니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> 문서의 예시 가격·기간·CDN 구성이나
              successful proof를 모든 deployment의 고정 SLA·retrieval·영구
              보존으로 확대하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="dataset-service" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · Dataset record
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Dataset record는 “누가 어떤 파일을 누구에게 맡겼는가”를 고정한 한
            장의 명세서입니다
          </h2>
        </header>
        <p>
          <strong>Dataset record</strong>부터 정의하겠습니다. 이것은 파일 bytes
          자체가 아니라, 보관 계약을 다시 식별하는 데 필요한 이름표들의
          묶음입니다. 영수증에 주문 번호와 판매자와 상품 목록이 서로 다른 줄에
          적히듯, dataset record도 역할이 다른 필드를 분리해서 읽어야 합니다. 이
          기록이 있어야 나중의 proof와 payment가 같은 주문을 가리키는지 확인할
          수 있습니다.
        </p>
        <div className="not-prose">
          <CodeViewButton
            label="DataSetInfo struct"
            onClick={() => sidebar.open("dataset-info", codeRefs["dataset-info"])}
          />
        </div>
        <TermBreakdown
          title="Dataset generation을 고정하는 필드"
          description="필드 이름을 한꺼번에 외우지 않습니다. 각 줄에서 ‘무엇을 식별하는가’와 ‘무엇까지는 보장하지 않는가’를 확인합니다."
          items={[
            {
              term: "Client address",
              description:
                "보관을 요청하고 비용을 부담하며 dataset 변경 권한을 가진 계정입니다.",
              example:
                "0xClient가 dataset 42의 생성과 piece 추가를 승인합니다.",
              boundary:
                "Transaction sender가 항상 최종 payer나 dataset owner와 같다고 가정하지 않습니다.",
            },
            {
              term: "Provider ID",
              description:
                "파일을 보관하고 PDP proof를 제출할 service provider의 protocol identity입니다.",
              example: "Provider 17이 piece A와 B의 보관 책임을 갖습니다.",
              boundary:
                "Provider ID만으로 실제 네트워크 주소나 지급 주소를 추론하지 않습니다.",
            },
            {
              term: "Payee address",
              description:
                "검증된 보관 기간의 대금을 최종적으로 받는 payment 수취 계정입니다.",
              example:
                "Provider 17이 지정한 0xPayee로 rail 지급액이 귀속됩니다.",
              boundary:
                "보관 주체와 수취 계정이 같을 수도 있지만 서로 다른 필드로 검증합니다.",
            },
            {
              term: "Service endpoint",
              description:
                "Client가 실제 piece bytes를 전송하고 retrieval을 시험할 off-chain 접속 위치입니다.",
              example:
                "HTTPS endpoint에 piece CID를 보내고 upload receipt를 받습니다.",
              boundary:
                "Endpoint 응답 성공은 on-chain 등록이나 장기 retrieval 가능성을 보장하지 않습니다.",
            },
            {
              term: "Dataset ID",
              description:
                "여러 piece와 proving schedule을 하나의 논리적 보관 주문으로 묶는 on-chain 식별자입니다.",
              example: "Dataset 42 아래에 piece A 다음 piece B가 등록됩니다.",
              boundary:
                "다른 chain이나 다른 Warm Storage contract의 같은 숫자 42는 같은 dataset이 아닙니다.",
            },
            {
              term: "Ordered piece entries",
              description:
                "각 piece의 ID, content CID, piece CID, byte size와 Merkle leaf count를 순서대로 보존한 목록입니다.",
              example:
                "A가 60 leaves, B가 40 leaves이면 logical range 0–59는 A, 60–99는 B입니다.",
              boundary:
                "같은 두 piece라도 순서나 leaf count가 바뀌면 challenge 좌표가 달라집니다.",
            },
            {
              term: "PDP verifier and listener",
              description:
                "어떤 verifier가 proof를 판정하고 어느 listener가 결과 callback을 받을지 고정합니다.",
              example:
                "Dataset 42의 proven/faulted event를 특정 Warm Storage listener가 받습니다.",
              boundary:
                "Worker의 로컬 성공 로그를 verifier의 canonical 판정으로 대신하지 않습니다.",
            },
            {
              term: "Warm Storage contract",
              description:
                "Dataset lifecycle과 proof callback을 payment 정책에 연결하는 배포 contract 주소입니다.",
              example:
                "같은 dataset ID라도 contract generation이 바뀌면 별도 artifact로 취급합니다.",
              boundary:
                "Proxy address만 보존하지 않고 실제 implementation revision도 함께 고정합니다.",
            },
            {
              term: "Payment rail IDs",
              description:
                "PDP storage 지급용 rail과 선택적으로 delivery 비용을 처리하는 rails를 식별합니다.",
              example:
                "Storage rail 9와 delivery rail 12가 서로 다른 rate와 cursor를 가집니다.",
              boundary:
                "Rail이 존재한다는 사실만으로 deposit과 lockup이 충분하다고 판단하지 않습니다.",
            },
            {
              term: "Price-list version",
              description:
                "Piece size를 epoch당 지급 rate로 바꿀 때 사용한 가격 규칙의 정확한 revision입니다.",
              example:
                "Price list v3에서 계산한 rate를 v4 dataset update에 재사용하지 않습니다.",
              boundary:
                "현재 화면의 가격을 과거 transaction 계산에 소급 적용하지 않습니다.",
            },
            {
              term: "Transaction confidence",
              description:
                "addPieces transaction hash와 포함 block, 확인 수, canonical 여부를 함께 기록한 상태입니다.",
              example:
                "Transaction은 block N에 포함됐지만 required confidence 전 reorg될 수 있습니다.",
              boundary:
                "Hash가 있다는 것과 finalized on-chain commit은 같은 상태가 아닙니다.",
            },
            {
              term: "SDK and contract revisions",
              description:
                "Receipt를 만들고 해석한 SDK commit, contract implementation과 ABI generation입니다.",
              example:
                "SDK 44ffc12와 Warm Storage a391c1c 조합을 manifest에 기록합니다.",
              boundary:
                "필드 이름이 같아도 revision이 다르면 serialization과 의미가 같다고 가정하지 않습니다.",
            },
          ]}
        />
        <TermBreakdown
          title="같아 보이지만 다른 두 receipt"
          description="파일 전송과 chain 등록은 서로 다른 시스템에서 끝납니다. 하나가 성공해도 다른 하나의 성공으로 합치지 않습니다."
          items={[
            {
              term: <code>store response</code>,
              description:
                "Provider가 piece bytes를 받았다는 off-chain upload receipt입니다.",
              example:
                "Endpoint가 piece CID와 provider-side upload ID를 반환합니다.",
              boundary:
                "이 응답 뒤 addPieces가 실패하면 stored-but-not-committed 상태입니다.",
            },
            {
              term: <code>addPieces transaction</code>,
              description:
                "이미 전송한 piece를 특정 on-chain dataset의 ordered 목록에 넣는 transaction입니다.",
              example:
                "Transaction hash, block number와 confidence가 승인 기준에 도달해야 commit receipt가 됩니다.",
              boundary:
                "Chain commit이 성공해도 provider disk에 올바른 bytes가 남아 있는지는 별도로 확인합니다.",
            },
          ]}
        />
        <ExplainedFormula
          question="같은 dataset service generation인지 어떻게 재현할까?"
          idea={
            <>
              Off-chain upload와 on-chain identities·contract versions을
              canonical manifest에 묶어 hash합니다.
            </>
          }
          formula={String.raw`D=H(C\|P\|S\|\{(c_i,z_i)\}\|V\|R\|G)`}
          terms={[
            {
              symbol: "D",
              name: "Dataset-service digest",
              description:
                "한 service generation의 재현 가능한 artifact identity입니다.",
            },
            {
              symbol: "H",
              name: "Cryptographic hash",
              description:
                "Canonical manifest serialization에 적용한 hash입니다.",
            },
            {
              symbol: "C",
              name: "Client",
              description:
                "서비스 비용과 dataset authority를 가진 client address입니다.",
            },
            {
              symbol: "P",
              name: "Provider",
              description: "선택된 provider ID·payee·endpoint identity입니다.",
            },
            {
              symbol: "S",
              name: "Dataset",
              description: "PDP dataset ID와 listener/service binding입니다.",
            },
            {
              symbol: "c_i",
              name: "Piece identifier",
              description: "i번째 uploaded piece의 content/piece CID입니다.",
            },
            {
              symbol: "z_i",
              name: "Piece size",
              description:
                "같은 piece commitment가 다루는 byte/leaf size입니다.",
            },
            {
              symbol: "V",
              name: "Verifier/service versions",
              description:
                "PDPVerifier와 Warm Storage contract revisions입니다.",
            },
            {
              symbol: "R",
              name: "Rail identifiers",
              description: "PDP storage rail과 선택한 delivery rails입니다.",
            },
            {
              symbol: "G",
              name: "Generation context",
              description: "Chain ID, price list와 SDK version을 포함합니다.",
            },
          ]}
          assumptions={[
            "주소·IDs·piece order와 numeric fields를 동일 canonical encoding으로 직렬화합니다.",
            "Digest 일치는 service identity일 뿐 bytes availability나 proof success를 보장하지 않습니다.",
          ]}
          interpretation="PieceCID가 같아도 provider, dataset ID 또는 Warm Storage implementation이 달라지면 D가 달라져 기존 proof/payment receipt를 붙일 수 없습니다."
        />
        <div id="paper-filecoin-warm-contract">
          <CitationBlock
            type="code"
            citeKey={2}
            source="FilecoinWarmStorageService.sol · commit a391c1c"
            href={WARM_CONTRACT}
          >
            <p>
              <strong>문제:</strong> PDP dataset callbacks를 provider identity,
              rail creation·rate, lifecycle fees와 termination state에 연결해야
              합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Pinned Solidity source는 dataset/rail
              state, creation·piece callbacks, proving/fault events와 Filecoin
              Pay integration을 구현합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> Matching proxy implementation,
              PDPVerifier, ServiceProviderRegistry, FilecoinPay address, storage
              layout와 price-list deployment를 사용합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> commit a391c1c의 Warm Storage contract
              behavior와 event/state boundary에 한정합니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Contract state가 provider disk
              durability, retrieval path, off-chain upload completion 또는
              arbitrary token economics를 검증하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="proof-settlement" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · Period state
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Period state는 한 보관 기간의 proof 판정표입니다
          </h2>
        </header>
        <p>
          <strong>Period</strong>는 proof를 한 번 평가하는 고정된 epoch
          구간입니다. 각 period에는 시작점과 deadline이 있고, provider는 그 안에
          proof를 제출합니다. <strong>Period state</strong>는 이 한 구간이 아직
          판정 전인지, proof를 통과했는지, deadline을 놓쳤는지를 기록한
          값입니다.
        </p>
        <div className="not-prose">
          <CodeViewButton
            label="possessionProven() · nextProvingPeriod()"
            onClick={() => sidebar.open("period-state", codeRefs["period-state"])}
          />
        </div>
        <TermBreakdown
          title="Period state의 세 가지 값"
          description="세 상태를 한 문장에 섞지 않습니다. 각 상태가 확정됐는지와 settlement cursor가 움직일 수 있는지를 따로 봅니다."
          items={[
            {
              term: "Open",
              description:
                "Proof 제출 deadline이 아직 지나지 않아 성공과 실패를 확정할 수 없는 진행 중 상태입니다.",
              example: "현재 period의 deadline까지 20 epochs가 남아 있습니다.",
              boundary:
                "아직 proof가 없더라도 faulted로 간주하지 않고 settlement를 이 앞에서 멈춥니다.",
            },
            {
              term: "Proven",
              description:
                "정해진 challenge와 verifier 규칙을 만족한 proof가 canonical state에서 받아들여진 상태입니다.",
              example:
                "이 period가 포함하는 epochs의 rate는 지급액 계산에 기여합니다.",
              boundary:
                "Worker success나 제출 transaction만으로 proven이 되지 않으며 required confidence를 확인합니다.",
            },
            {
              term: "Faulted",
              description:
                "Deadline까지 유효한 proof가 확정되지 않아 해당 period의 보관 실패가 결정된 상태입니다.",
              example:
                "지급 기여는 0이지만 판정은 끝났으므로 cursor는 다음 period로 이동할 수 있습니다.",
              boundary:
                "0원 지급과 미판정 open 상태는 다르며 두 상태를 같은 값으로 압축하지 않습니다.",
            },
          ]}
        />
        <PeriodStateViz />
        <p>
          이제 세 상태를 정산과 연결할 수 있습니다. Proven period의 epoch는
          금액에 기여합니다. Faulted period는 금액 기여가 0이지만 판정이
          끝났으므로 다음 period로 이동합니다. Open period는 아직 실패가
          아니므로 0으로 처리하지 않고 정산 자체를 그 앞에서 멈춥니다. Piece
          추가·제거로 rate가 바뀌면 어느 period부터 새 rate가 적용되는지도
          dataset revision과 함께 기록합니다.
        </p>
        <ExplainedFormula
          question="Proof 상태가 섞인 기간의 정산 가능액을 어떻게 계산할까?"
          idea={
            <>
              Epoch별 rate에 proven 여부를 곱하고, open period 직전까지만
              더합니다.
            </>
          }
          formula={String.raw`P[a,b)=\sum_{e=a}^{b-1} r_e\,v_e,\qquad v_e\in\{0,1\}`}
          annotatedFormula={String.raw`\begin{aligned}P[a,b)&=\underbrace{\sum_{e=a}^{b-1}r_e\,v_e}_{\substack{\text{검증이 끝난 epoch의}\\\text{지급 기여만 누적}}}\\v_e&\in\underbrace{\{0,1\}}_{\substack{\text{proven이면 1}\\\text{fault면 0}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`r_e\,v_e`,
              annotation: [
                "요금에 proof-valid mask를 곱해",
                "faulted epoch의 기여를 0으로 만듦",
              ],
            },
            {
              expression: String.raw`\sum_{e=a}^{b-1}r_e\,v_e`,
              annotation: ["a부터 b 직전까지", "승인된 epoch 기여만 누적"],
            },
          ]}
          terms={[
            {
              symbol: "P[a,b)",
              name: "Validated payment",
              description:
                "Epoch a부터 b 직전까지 validator가 허용한 token amount입니다.",
            },
            {
              symbol: "e",
              name: "Epoch",
              description:
                "Rate와 proving verdict를 평가하는 chain time index입니다.",
            },
            {
              symbol: "r_e",
              name: "Rate per epoch",
              description:
                "해당 epoch의 dataset size·price segment에 적용되는 payment rate입니다.",
            },
            {
              symbol: "v_e",
              name: "Proof-valid indicator",
              description:
                "해당 epoch를 포함하는 period가 proven이면 1, faulted면 0입니다.",
            },
            {
              symbol: "a",
              name: "From epoch",
              description: "기존 settledUpTo 이후 정산 시작점입니다.",
            },
            {
              symbol: "b",
              name: "Settle boundary",
              description:
                "검증 완료된 마지막 구간 다음 epoch이며 open period를 넘지 않습니다.",
            },
          ]}
          assumptions={[
            "Exact contract는 rate segments, integer units·rounding과 validator callback schema를 따르며 이 식은 그 누적 의도를 설명합니다.",
            "Open period는 v=0으로 확정하지 않고 b를 그 period 시작/경계에서 멈춥니다.",
          ]}
          interpretation="세 period가 proven·faulted·open이면 첫 period만 금액에 기여하고 faulted period는 0으로 cursor가 진행하지만 open period 앞에서 정산을 멈춥니다."
        />
        <p>
          반례는 proof transaction이 제출됐지만 required confidence 전에 reorg된
          경우입니다. 이때 off-chain worker 성공을 proven으로 쓰지 않고
          canonical PDP state와 service callback receipt를 다시 확인합니다.
        </p>
      </section>

      <section id="payment-rail" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · Payment rail
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Payment rail은 잔액과 지급 규칙을 함께 가진 두 사람 사이의
            원장입니다
          </h2>
        </header>
        <p>
          <strong>Payment rail</strong>을 먼저 한 문장으로 정의하겠습니다.
          Payer가 payee에게 계속 지급할 때, 돈을 매 epoch 바로 보내는 대신
          “얼마를 맡겨 두었고, 누가 얼마까지 조작할 수 있으며, 어느 속도로
          어디까지 지급했는가”를 한 줄에 기록한 on-chain ledger입니다. 그래서
          단순 정기 송금과 다릅니다.
        </p>
        <div className="not-prose">
          <CodeViewButton
            label="Rail struct · settleRail()"
            onClick={() => sidebar.open("rail-settle", codeRefs["rail-settle"])}
          />
        </div>
        <TermBreakdown
          title="Payment rail의 다섯 장부 항목"
          description="각 항목은 서로 다른 질문에 답합니다. 한 줄씩 읽은 뒤 아래 Viz에서 값이 움직이는 순서를 확인합니다."
          items={[
            {
              term: "Deposit",
              description:
                "Payer account가 실제로 맡겨 둔 token 잔액입니다. 모든 rails가 사용하는 자금의 출발점입니다.",
              example:
                "Deposit이 1,000이면 여러 rail의 lockup과 withdrawal이 이 잔액을 나눠 씁니다.",
              boundary:
                "전체 deposit과 새 rail이 자유롭게 쓸 수 있는 available funds는 다릅니다.",
            },
            {
              term: "Operator allowance",
              description:
                "Storage service operator가 payer를 대신해 rail을 만들거나 갱신할 수 있는 최대 권한 범위입니다.",
              example:
                "Allowance 300이면 operator가 payer의 deposit 1,000 전체를 임의로 예약할 수 없습니다.",
              boundary:
                "조작 권한의 상한이지 provider에게 이미 지급된 금액은 아닙니다.",
            },
            {
              term: "Variable rate",
              description:
                "검증된 epoch가 하나 늘 때마다 누적 지급액이 얼마나 증가하는지를 정한 속도입니다.",
              example:
                "Rate가 epoch당 2이고 10 epochs가 proven이면 variable 지급 기여는 20입니다.",
              boundary:
                "Open이나 faulted epoch를 proven처럼 곱하지 않으며, rate 변경 경계도 따로 보존합니다.",
            },
            {
              term: "Fixed lockup",
              description:
                "종료나 일회성 lifecycle 비용처럼 rate와 무관한 의무를 위해 미리 예약한 금액입니다.",
              example:
                "Variable obligation 20과 fixed reserve 5가 필요하면 최소 25를 사용할 수 있어야 합니다.",
              boundary:
                "미리 묶인 돈이지 곧바로 provider에게 확정 지급된 돈은 아닙니다.",
            },
            {
              term: "settledUpTo",
              description:
                "어느 epoch 직전까지 proof 판정과 지급 계산을 이미 끝냈는지 나타내는 반열린 cursor입니다.",
              example:
                "settledUpTo=120이면 다음 계산은 120부터 시작해 검증 완료 경계 직전까지 진행합니다.",
              boundary:
                "Open period를 건너뛰어 cursor를 전진시키거나 같은 구간을 두 번 정산하지 않습니다.",
            },
          ]}
        />
        <PaymentRailViz />
        <p>
          필드의 뜻을 확인했으므로 이제 admission 규칙으로 조합합니다. 새 piece
          때문에 rate가 커지면 미래 구간용 variable lockup과 fixed reserve를
          모두 감당할 수 있어야 합니다. Lockup은 provider의 미지급 위험을
          낮추지만, proof 실패에도 무조건 지급되는 보험이나 protocol 전체의
          solvency 보장은 아닙니다.
        </p>
        <ExplainedFormula
          question="새 storage rate를 적용하기 전에 필요한 자금 여유를 어떻게 생각할까?"
          idea={
            <>
              정해진 lockup horizon의 variable obligation과 lifecycle fixed
              reserve를 합쳐 available funds와 비교합니다.
            </>
          }
          formula={String.raw`F_{required}=r\,L+F_{fixed},\qquad ready\iff F_{available}\ge F_{required}`}
          terms={[
            {
              symbol: "F_{required}",
              name: "Required lockup",
              description:
                "Rate update·piece admission 전에 rail이 요구하는 총 reserve입니다.",
            },
            {
              symbol: "r",
              name: "Payment rate",
              description:
                "Dataset size와 pinned price list에서 계산한 token per epoch rate입니다.",
            },
            {
              symbol: "L",
              name: "Lockup horizon",
              description:
                "Deployed rail policy가 요구하는 future epochs 수입니다.",
            },
            {
              symbol: "F_{fixed}",
              name: "Fixed reserve",
              description:
                "Lifecycle·one-time operations에 배정한 fixed lockup입니다.",
            },
            {
              symbol: "F_{available}",
              name: "Available funds",
              description:
                "이미 다른 rails가 예약한 금액을 제외한 payer account의 usable balance·allowance입니다.",
            },
            {
              symbol: "ready",
              name: "Funding admission",
              description: "새 rate/operation을 받을 수 있으면 참입니다.",
            },
          ]}
          assumptions={[
            "Token decimals, price list, chain epoch, rate rounding과 allowance semantics를 exact deployed contracts에서 읽습니다.",
            "L·fees를 모든 network의 상수로 복제하지 않고 artifact receipt에 pin합니다.",
          ]}
          interpretation="Available funds가 current storage payment는 감당해도 새 piece로 늘어난 rate×lockup과 fixed reserve 합보다 작으면 admission을 거절합니다."
        />
        <p>
          Rail update와 dataset update가 같은 transaction에서 모두 성공했는지는
          event와 현재 state를 대조합니다. 한쪽만 바뀌었다면 새 rate를 사용하지
          않고 reconciliation 대상으로 남깁니다.
        </p>
        <div id="paper-filecoin-pay">
          <CitationBlock
            type="code"
            citeKey={3}
            source="Filecoin Pay specification · commit 04ded6a"
            href={PAY_SPEC}
          >
            <p>
              <strong>문제:</strong> Payer funds·operator allowances와 payee
              rail의 streaming rate·lockup·settlement·termination을 중복 인출
              없이 관리해야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Pinned specification은 accounts,
              rails, validators, rate changes, lockup, settlement cursor와
              finalization lifecycle을 정의합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> commit 04ded6a의 FilecoinPayV1
              contract, token behavior/decimals, validator implementation과
              chain epoch semantics를 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 Filecoin Pay implementation
              specification snapshot의 payment accounting boundary에 한정합니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> Rail lockup을 bank deposit
              insurance·fixed yield·service quality, validator callback을 proof
              system 전체 correctness로 해석하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="release-gate" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · Service release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            각 기록을 따로 확인한 뒤 마지막에 같은 service generation으로
            조합합니다
          </h2>
        </header>
        <p>
          이제 앞에서 정의한 네 기록을 처음으로 한 흐름에 놓습니다. Upload
          receipt는 bytes 수신, dataset record는 주문 identity, period state는
          보관 판정, payment rail은 지급 위치를 각각 소유합니다. 한 단계의
          성공이 다른 단계의 성공을 대신하지 않으므로 네 receipt가 같은
          dataset과 contract generation을 가리키는지 대조합니다.
        </p>
        <OnchainCloudFlowViz />
        <p>
          검증 fixture에는 stored-but-not-committed upload, wrong
          provider/dataset, duplicate piece, underfunded rail, stale price list,
          proven→reorg, fault/open 혼동, rate-change boundary와 double
          settlement를 주입합니다. Canary는 event log만 보지 않고 contract
          state와 piece bytes retrieval sample을 대조합니다. 실패하면 이전
          SDK·contract manifest와 price-list policy로 rollback하되 이미
          finalized된 transaction은 idempotency key로 중복 실행하지 않습니다.
        </p>
        <ExplainedFormula
          question="Onchain Cloud service를 사용자에게 완료로 표시할 조건은 무엇일까?"
          idea={
            <>
              Upload, on-chain identity, proof state, payment state와
              retrieval·recovery를 독립 gates로 묶습니다.
            </>
          }
          formula={String.raw`A=U_{bytes}\land D_{chain}\land P_{period}\land R_{pay}\land Q_{retrieve}\land O_{recover}`}
          terms={[
            {
              symbol: "A",
              name: "Service acceptance",
              description:
                "선택한 storage service generation을 채택하면 1입니다.",
            },
            {
              symbol: "U_{bytes}",
              name: "Upload receipt",
              description:
                "Provider가 expected piece bytes·CID를 저장했다는 검증된 receipt입니다.",
            },
            {
              symbol: "D_{chain}",
              name: "Dataset receipt",
              description:
                "Client·provider·piece·listener·rails가 canonical chain state에 결속되면 1입니다.",
            },
            {
              symbol: "P_{period}",
              name: "Proof state",
              description:
                "Required periods의 proven/fault/open 상태와 confidence가 정책에 맞으면 1입니다.",
            },
            {
              symbol: "R_{pay}",
              name: "Rail reconciliation",
              description:
                "Rate, lockup, settledUpTo와 withdrawals가 validator verdict와 일치하면 1입니다.",
            },
            {
              symbol: "Q_{retrieve}",
              name: "Retrieval sample",
              description:
                "정해진 regions/sizes에서 returned bytes를 CID로 검증하면 1입니다.",
            },
            {
              symbol: "O_{recover}",
              name: "Operational recovery",
              description:
                "Retry owner, alerts, rollback manifests와 idempotency가 준비되면 1입니다.",
            },
          ]}
          assumptions={[
            "모든 receipts가 같은 chain ID, dataset/service/rail IDs와 contract/SDK versions를 사용합니다.",
            "Marketing의 composability·durability 표현 대신 배포에서 관찰한 state·events·bytes만 승인합니다.",
          ]}
          interpretation="PDP proof와 payment가 맞아도 실제 piece retrieval sample이 실패하면 A=0입니다. 반대로 upload 성공만으로 proof-gated payment 준비 완료가 아닙니다."
        />
        <div id="paper-synapse-manager">
          <CitationBlock
            type="code"
            citeKey={4}
            source="Synapse StorageManager · commit 44ffc12"
            href={SYNAPSE_MANAGER}
          >
            <p>
              <strong>문제:</strong> Client가 provider 선택, primary upload,
              secondary pulls와 각 provider의 on-chain piece commit을 retries와
              함께 조율해야 합니다.
            </p>
            <p>
              <strong>핵심 기여:</strong> Pinned TypeScript source는 upload
              contexts, primary store, secondary replication, parallel commits와
              stored-but-not-on-chain failure를 구분합니다.
            </p>
            <p>
              <strong>중요 가정:</strong> commit 44ffc12의 SDK package, provider
              endpoints, compatible contracts, wallet/network와 callback
              behavior를 고정합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 Synapse SDK storage manager
              snapshot의 client orchestration behavior에 한정합니다.
            </p>
            <p>
              <strong>일반화 금지:</strong> SDK success가 provider durability,
              independent replicas, PDP proof, Filecoin Pay settlement 또는
              fixed upload speed를 자동 보장하지 않습니다.
            </p>
          </CitationBlock>
        </div>
        <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Article-only 10/10:</strong>{" "}
          Upload/dataset/PDP/payment 책임, dataset artifact, proven·faulted·open
          settlement, rail lockup, failure reconciliation과 rollback을 이
          글만으로 답할 수 있습니다.
        </aside>
      </section>
    </article>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{
        "filecoin-services": filecoinServicesTree,
        "filecoin-pay": filecoinPayTree,
      }}
      projectMetas={{
        "filecoin-services": {
          id: "filecoin-services",
          label: "filecoin-services · Solidity",
          badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
        },
        "filecoin-pay": {
          id: "filecoin-pay",
          label: "filecoin-pay · Solidity",
          badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700",
        },
      }}
    />
    </>
  );
}
