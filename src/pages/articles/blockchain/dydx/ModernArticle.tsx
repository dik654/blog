import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import DefiDexLocator, { DefiDexMapReturn } from "../DefiDexLocator";
import { AuthorityViz, DydxOrderLifecycleViz, OrderPathViz } from "./viz/ModernDydxViz";
import { officialDydxCodeRefs } from "./officialCodeRefs";
import { dydxTree } from "./fileTrees";

const COMMIT = "5935cb7c5dd684b17836e75093fc5c3ca5019ea3";
const SOURCE = `https://github.com/dydxprotocol/v4-chain/tree/${COMMIT}`;
const RELEASE = "https://github.com/dydxprotocol/v4-chain/releases/tag/protocol%2Fv9.7.1";

export default function ModernDydxArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <DefiDexLocator
          currentSlug="dydx"
          region="주문 접수·proposer operation·합의 실행·indexer projection"
          question="Alice의 매수 주문과 Bob의 매도 주문은 언제 단순한 로컬 기록을 벗어나 모든 검증자가 인정하는 체결이 됩니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            주문을 받았다는 응답과 돈·포지션이 바뀐 settlement 사이에는 무엇이 있습니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            Alice는 101에 10계약을 사겠다고 하고 Bob은 100에 6계약을 팔겠다고 합니다. 두 주문이 한
            validator의 orderbook에 보이는 순간부터 proposer의 후보, 다른 validator의 검사, application 실행,
            block commit과 indexer 조회까지 한 번 끝까지 따라갑니다.
          </p>
        </div>

        <DydxOrderLifecycleViz />

        <p className="text-lg leading-8">
          <strong>dYdX에는 하나의 “주문 상태”만 있지 않습니다.</strong> 각 노드의 MemClob, proposer의
          operations queue, consensus application state, indexer의 PostgreSQL projection은 서로 다른 owner와
          복구 경로를 가집니다.
        </p>
        <p>
          CometBFT가 proposal을 결정하고 Cosmos SDK가 state를 commit하는 일반 경로는{" "}
          <Link to="/cs/blockchain/cometbft-abci" className="font-bold text-primary hover:underline">ABCI++</Link>와{" "}
          <Link to="/cs/blockchain/cosmos-sdk" className="font-bold text-primary hover:underline">Cosmos SDK</Link> 글이
          설명합니다. 이 글은 dYdX Chain <code>protocol/v9.7.1</code>에서 order class와 CLOB operation이 그
          경로에 어떻게 들어가는지만 추적합니다.
        </p>
        <ContentBoundary article="dydx" />
      </section>

      <section id="orderbook-architecture" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          OrderId flag는 주문을 어느 상태에 얼마나 오래 보관할지 고릅니다
        </h2>
        <OrderPathViz />
        <p>
          Short-term order는 <code>OrderFlags=0</code>이고 block height로 만료합니다. CheckTx를 통과한 뒤
          node-local MemClob과 gossip 경로에 들어갑니다. Long-term·conditional·TWAP 계열은 stateful order로
          분류되어 KV state와 별도 lifecycle을 사용하고, 실행 가능한 순간에는 MemClob view에도 반영됩니다.
        </p>
        <p>
          따라서 한 node가 “주문 접수”를 응답했다는 사실은 그 주문이 block에 포함됐거나 체결됐다는 뜻이
          아닙니다. Short-term order의 도착 순서와 local book은 node마다 잠시 다를 수 있습니다. v9.7.1은
          short-term order의 equity tier를 CheckTx에서 강제하도록 고쳤지만, 그 검사도 최종 settlement 전체를
          대신하지는 않습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="OrderId flag와 stateful 경계" onClick={() => sidebar.open("dydx-order-flags", officialDydxCodeRefs["dydx-order-flags"])} />
        </div>
        <aside className="border-l-2 border-destructive/70 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">실패 동작:</strong> v9.7.1의 공식 <code>x/clob/types</code> tests는
          0부터 512까지 flag를 훑어 0·32·64·128·256 이외의 값을 stateful 또는 short-term으로 잘못 분류하지
          않는지 검사합니다. 중복 OrderId를 deterministic sort helper에 넣으면 panic을 발생시켜 즉시 실패
          처리합니다.
        </aside>
      </section>

      <section id="matching-engine" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          가격이 교차해도 잔량의 최솟값은 체결 확정값이 아니라 후보 상한입니다
        </h2>
        <ExplainedFormula
          question="Alice와 Bob의 두 주문에서 이번 match 후보는 몇 계약입니까?"
          idea={<>매수 한도가 매도 한도 이상일 때만 가격이 교차하고, 이미 체결된 양을 뺀 두 잔량 가운데 작은 값이 후보 상한입니다.</>}
          formula={String.raw`p_{bid}\ge p_{ask},\qquad q_{candidate}=\min(q_{bid}-f_{bid},\;q_{ask}-f_{ask})`}
          annotatedFormula={String.raw`\underbrace{101\ge100}_{\text{가격 교차}},\qquad q_{candidate}=\min(\underbrace{10-2}_{\text{Alice 잔량 8}},\underbrace{6-1}_{\text{Bob 잔량 5}})=\underbrace{5}_{\text{후보 상한}}`}
          operations={[
            { expression: String.raw`101\ge100`, annotation: ["Alice의 최대 매수가 Bob의 최소 매도가 이상이므로 두 주문이 맞붙을 수 있습니다."] },
            { expression: String.raw`10-2=8`, annotation: ["Alice 주문은 10계약 중 2계약이 이미 체결되어 8계약 남았습니다."] },
            { expression: String.raw`6-1=5`, annotation: ["Bob 주문은 6계약 중 1계약이 이미 체결되어 5계약 남았습니다."] },
            { expression: String.raw`\min(8,5)=5`, annotation: ["수량만 보면 5계약까지 가능하지만 담보·position·reduce-only·rate limit 검사가 남습니다."] },
          ]}
          terms={[
            { symbol: String.raw`p_{bid},p_{ask}`, name: "Limit prices", description: "매수자가 낼 최대 가격과 매도자가 받을 최소 가격입니다." },
            { symbol: String.raw`q_{bid},q_{ask}`, name: "Order quantums", description: "각 주문의 최초 정수 수량입니다." },
            { symbol: String.raw`f_{bid},f_{ask}`, name: "Filled quantums", description: "해당 주문에 이미 누적된 체결 수량입니다." },
            { symbol: String.raw`q_{candidate}`, name: "Candidate upper bound", description: "이 두 주문이 수량 조건만으로 제공할 수 있는 상한입니다." },
          ]}
          assumptions={[
            "가격과 수량은 해당 market의 tick·step과 integer unit 제약을 통과했습니다.",
            "두 주문이 만료·취소되지 않았고 같은 CLOB pair를 가리킵니다.",
            "실제 execution price·maker/taker·fee는 이 최소 식만으로 정하지 않습니다.",
            "담보와 position transition 검사는 FinalizeBlock의 application 실행에서 별도로 통과해야 합니다.",
          ]}
          interpretation="Bob의 잔량이 먼저 0이 되므로 수량 후보는 5입니다. 실행까지 성공하면 Alice 누적 fill은 7, Bob은 6이 되지만, risk check가 실패하면 이 계산만으로 chain fill이 생기지 않습니다."
        />
        <p>
          Local matching engine은 executable liquidity와 operations queue를 만듭니다. 이번 proposer는 그 queue에서
          short-term placement, match, removal 등을 꺼내 <code>MsgProposedOperations</code>로 묶습니다. 이 message는
          “이미 확정된 체결 목록”이 아니라 다른 validator가 받아 검사하고 application이 실행할 candidate입니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="PrepareProposal의 operations 삽입" onClick={() => sidebar.open("dydx-prepare-proposal", officialDydxCodeRefs["dydx-prepare-proposal"])} />
        </div>
      </section>

      <section id="cosmos-integration" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          제안 검증과 체결 상태 실행은 다른 단계입니다
        </h2>
        <AuthorityViz />
        <p>
          Validator의 <code>ProcessProposalHandler</code>는 candidate bytes를 해석하고 transaction 순서, 필요한
          app-injected messages, 중복, <code>ValidateBasic</code>을 검사합니다. 이 단계가 REJECT를 반환하면 해당
          proposal은 합의 후보가 될 수 없습니다. 다만 ACCEPT는 5계약 fill의 잔액·position이 이미 commit됐다는
          영수증이 아닙니다.
        </p>
        <p>
          결정된 block을 <code>FinalizeBlock</code>에서 실행할 때 <code>ProposedOperations</code> message handler가
          <code>ProcessProposerOperations</code>를 호출합니다. 여기서 operation 순서, remaining fill, 담보와
          position 전이가 실제 application state에 적용됩니다. 그 실행과 block commit이 끝나야 authoritative
          balances·positions·fills가 생깁니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="ProcessProposal ACCEPT·REJECT" onClick={() => sidebar.open("dydx-process-proposal", officialDydxCodeRefs["dydx-process-proposal"])} />
          <CodeViewButton label="FinalizeBlock의 operation 실행" onClick={() => sidebar.open("dydx-proposed-operations", officialDydxCodeRefs["dydx-proposed-operations"])} />
        </div>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["Decode 실패", "ProcessProposal", "REJECT", "state 변경 없음"],
            ["필수 tx 순서 오류", "ProcessProposal", "REJECT", "다른 proposal 필요"],
            ["담보·operation 오류", "FinalizeBlock", "execution error", "성공 settlement 없음"],
            ["Indexer 중단", "파생 계층", "API stale", "chain commit은 유지"],
          ].map(([cause, stage, result, state]) => (
            <div key={cause} className="min-w-0 bg-background p-4">
              <strong className="break-keep text-xs">{cause}</strong>
              <p className="mt-2 text-[10px] leading-5 text-muted-foreground">지점 · {stage}</p>
              <p className="mt-1 text-[10px] leading-5 text-primary">{result}</p>
              <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground">{state}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="indexer" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          조회 화면은 확정 상태를 다시 펼친 파생 장부입니다
        </h2>
        <p>
          Protocol은 transaction event마다 subtype과 version, bytes, block 안의 순서를 붙입니다. 이 event는
          transient store에 모입니다. EndBlocker에서 <code>ProduceBlock</code>이 한 block의 event 묶음을 만들고
          message sender가 indexer 쪽으로 전달합니다. Indexer는 이를 주문, 체결, 계정, 시세 조회 화면으로
          바꿉니다.
        </p>
        <p>
          이 경로에는 지연과 중복 전달, 순서 역전, schema migration이 생길 수 있습니다. 그래서 block
          height/hash와 transaction index, event index, version을 함께 저장해 중복 처리와 재시작 지점을
          통제합니다.
        </p>
        <p>
          파생 장부를 비운 뒤에도 보존된 원본 event로 같은 결과를 다시 만들 수 있어야 합니다. 분쟁이 생기면
          indexer API 응답이 아니라 commit된 chain state와 event를 기준으로 대조합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Versioned indexer event 경계" onClick={() => sidebar.open("dydx-indexer-event", officialDydxCodeRefs["dydx-indexer-event"])} />
        </div>
        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">[M] 확인한 범위:</strong> macOS arm64, Go 1.26.2에서
          <code>protocol/v9.7.1</code>의 <code>./x/clob/types</code>와 <code>./app/process</code> tests를
          <code>GOMAXPROCS=2</code>, <code>-p 1</code>로 실행해 모두 통과했습니다. 첫 실행 188.26초, 최대 RSS
          1,619,886,080 bytes, swap 0이었습니다. 실제 validator network·거래 성능·완전한 5계약 settlement를
          실행했다고 주장하지 않습니다.
        </aside>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">릴리스 source와 이 글의 축소 예시를 구분해서 읽습니다</h2>
        <div id="paper-dydx-protocol-v971">
          <CitationBlock type="code" citeKey={1} source="dydxprotocol/v4-chain · protocol/v9.7.1 · commit 5935cb7" href={SOURCE}>
            <p><strong>문제:</strong> 로컬 CLOB의 order intent를 합의 가능한 operation과 application state로 바꿔야 합니다.</p>
            <p><strong>핵심 기여:</strong> OrderId flags, Prepare/ProcessProposal, CLOB keeper와 versioned indexer event source를 함께 제공합니다.</p>
            <p><strong>중요 전제:</strong> v9.7.1의 Cosmos SDK·CometBFT fork, module ordering과 market/subaccount state를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 이 글에서 연 pinned source와 두 package의 공식 tests입니다.</p>
            <p><strong>일반화 금지:</strong> local price-time view가 global arrival fairness를, unit test 통과가 mainnet 운영 안정성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          2026-09-14 공개된 v9.7.1은 short-term order의 equity tier를 CheckTx에서 강제하는 수정을 포함합니다.
          이후 main의 rate-limit 변경은 이 글의 구현 사실로 사용하지 않았습니다.{" "}
          <a href={RELEASE} className="font-bold text-primary hover:underline">v9.7.1 릴리스 보기</a>
        </p>
      </section>

      <DefiDexMapReturn
        currentSlug="dydx"
        closure="dYdX Chain의 주문은 node-local MemClob에서 곧바로 체결 장부가 되지 않습니다. proposer가 operation 후보를 만들고, validator가 proposal 형식을 검사하며, application 실행과 block commit이 끝나야 authoritative settlement가 되고 indexer는 그 결과를 다시 읽기 좋은 view로 만듭니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialDydxCodeRefs}
        fileTrees={{ dydx: dydxTree }}
        projectMetas={{
          dydx: {
            id: "dydx",
            label: "dydxprotocol · v4-chain protocol/v9.7.1",
            badgeClass: "border-sky-500 bg-sky-500/10 text-sky-700",
          },
        }}
      />
    </article>
  );
}
