import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import CosmosCoreLocator, { CosmosCoreMapReturn } from "../CosmosCoreLocator";
import { cosmosTree } from "./fileTrees";
import { officialCosmosCodeRefs } from "./officialCodeRefs";
import { CosmosTxViz, ExecutionModeViz } from "./viz/ModernCosmosSDKViz";

const COMMIT = "64fd208a11fb54f7ffdca1a1290c2cfbbc254e49";
const SOURCE = `https://github.com/cosmos/cosmos-sdk/tree/${COMMIT}`;

export default function ModernCosmosSDKArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <CosmosCoreLocator
          currentSlug="cosmos-sdk"
          region="Transaction 해석 · state branch · durable commit"
          question="Alice가 보낸 MsgSend 한 건은 언제부터 Bob의 잔액을 바꾼 committed state가 됩니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            CheckTx OK와 송금 성공, durable Commit은 왜 서로 다른 영수증입니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            높이 40에서 Alice가 100 stake, Bob이 20 stake를 가진 상태를 고정합니다. Alice는 fee 1과
            송금액 10을 담은 transaction에 서명합니다. 같은 bytes가 CheckTx, FinalizeBlock의 ante,
            bank MsgSend와 root Commit을 지나며 어느 장부에 무엇을 남기는지 끝까지 추적합니다.
          </p>
        </div>

        <CosmosTxViz />

        <p className="text-lg leading-8">
          <strong>Cosmos SDK는 합의 엔진이 아니라 합의된 transaction을 application state로 해석하는 틀입니다.</strong>
          CometBFT는 bytes의 순서와 block 포함을 정합니다. BaseApp은 실행 mode와 state branch를 고르고,
          AnteHandler는 transaction 봉투를 검사하며, bank MsgServer와 keeper가 실제 잔액 규칙을 실행합니다.
        </p>
        <p>
          합의와 application 사이의 ABCI request 순서, proposal 권한과 crash replay는
          <Link to="/cs/blockchain/cometbft-abci" className="ml-1 font-bold text-primary hover:underline">CometBFT ABCI 글</Link>이
          소유합니다. 이 글은 Cosmos SDK v0.55.0 안에서 <strong>한 transaction의 state가 어디에 쓰이고 언제 정본이 되는지</strong>에
          집중합니다.
        </p>
        <ContentBoundary article="cosmos-sdk" />
      </section>

      <section id="baseapp" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">같은 transaction을 실행해도 mode마다 쓰는 장부가 다릅니다</h2>
        <p>
          BaseApp의 <code>stateManager</code>는 CheckTx와 FinalizeBlock이 같은 root를 직접 고치지 않게
          mode별 state를 나눕니다. 중요한 점은 CheckTx를 곧바로 버리는 simulation으로 보면 안 된다는 것입니다.
          성공한 ante 변경은 node-local check state에 누적되어 다음 CheckTx가 sequence 충돌을 판단할 때 읽습니다.
          다만 committed query에는 보이지 않고 block Commit 뒤 최신 root에서 다시 만들어집니다.
        </p>

        <ExecutionModeViz />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="CheckTx가 유지되는 공식 테스트" onClick={() => sidebar.open("cosmos-check-commit-tests", officialCosmosCodeRefs["cosmos-check-commit-tests"])} />
          <CodeViewButton label="Working AppHash와 Commit" onClick={() => sidebar.open("cosmos-working-commit", officialCosmosCodeRefs["cosmos-working-commit"])} />
        </div>

        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">정확한 표현:</strong> CheckTx OK는 이 node의 현재 mempool admission을
          통과했다는 뜻입니다. Block 포함, 모든 validator에서의 동일 결과, bank 송금 성공이나 durable Commit을
          보장하지 않습니다.
        </aside>

        <div id="paper-cosmos-baseapp-v055" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={1} source="cosmos/cosmos-sdk · v0.55.0 BaseApp" href={`${SOURCE}/baseapp`}>
            <p><strong>문제:</strong> ABCI request, simulation과 query를 서로 다른 실행 권한과 state 수명에 연결해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Mode별 context, CheckTx·FinalizeBlock state, transaction branch와 Commit 경계를 구현합니다.</p>
            <p><strong>고정한 버전:</strong> v0.55.0이 가리키는 commit <code>{COMMIT.slice(0, 12)}</code>입니다.</p>
            <p><strong>일반화 금지:</strong> CheckTx OK를 block inclusion이나 durable application state로 확대하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="runtx-pipeline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Ante와 message는 한 transaction 안에서도 서로 다른 child branch를 씁니다</h2>
        <p>
          <code>RunTx</code>는 먼저 ante 전용 cache를 만듭니다. Ante가 실패하면 이 cache를 버립니다. 성공하면
          fee 차감과 sequence 증가를 현재 mode의 parent에 합친 뒤, message 전용 cache를 새로 만듭니다.
          따라서 FinalizeBlock에서 bank message가 실패해도 ante에서 이미 반영한 fee와 sequence는 남고,
          message가 계산한 잔액 변경만 버릴 수 있습니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["ANTE 실패", "fee·sequence 0", "첫 child를 합치기 전에 반환합니다."],
            ["MESSAGE 실패", "ante만 남음", "Message child는 버리고 fee·sequence는 유지합니다."],
            ["전체 성공", "ante + message", "두 branch를 순서대로 block parent에 합칩니다."],
          ].map(([result, state, detail]) => (
            <div key={result} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-primary">{result}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{state}</strong>
              <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <ExplainedFormula
          question="Gas limit은 ante와 message를 어떻게 한 transaction 한도에 묶습니까?"
          idea="같은 gas meter에 ante, message와 post-handler의 소비를 누적합니다. Gas는 wall-clock 시간이 아니라 chain 코드가 정한 deterministic accounting 단위입니다."
          formula={String.raw`G_{used}=G_{ante}+\sum_{i=1}^{m}G_{msg_i}+G_{post}\le G_{limit}`}
          annotatedFormula={String.raw`\underbrace{G_{used}}_{\text{누적 소비}}=\underbrace{G_{ante}}_{\text{봉투 검사}}+\underbrace{\sum_{i=1}^{m}G_{msg_i}}_{\text{message 실행}}+\underbrace{G_{post}}_{\text{후처리}}\le\underbrace{G_{limit}}_{\text{tx 상한}}`}
          operations={[
            { expression: String.raw`G_{ante}=30`, annotation: ["설명용 수치", "tx bytes·fee·signature·sequence 검사"] },
            { expression: String.raw`G_{msg}=50`, annotation: ["MsgSend routing과 keeper store 접근"] },
            { expression: String.raw`G_{post}=5`, annotation: ["선택한 post-handler의 소비"] },
            { expression: String.raw`30+50+5=85`, annotation: ["limit 80이면 message child를 합치지 않음", "실제 gas 표는 chain release 설정에 귀속"] },
          ]}
          terms={[
            { symbol: String.raw`G_{ante}`, name: "ante gas", description: "Transaction 봉투 검증에 든 deterministic gas입니다." },
            { symbol: String.raw`G_{msg_i}`, name: "message gas", description: "i번째 MsgServer와 keeper 실행에 든 gas입니다." },
            { symbol: String.raw`G_{post}`, name: "post gas", description: "구성된 post-handler가 소비한 gas입니다." },
            { symbol: String.raw`G_{limit}`, name: "gas limit", description: "Transaction이 신청한 application gas 상한입니다." },
          ]}
          assumptions={[
            "30·50·5는 branch 동작을 설명하는 가정값이며 v0.55.0 측정값이 아닙니다.",
            "실제 gas cost는 chain의 ante 구성, message와 store 구현에 따라 달라집니다.",
            "Block gas meter와 transaction gas meter는 별도 한도입니다.",
            "Out-of-gas는 recovery path에서 transaction 실패로 변환됩니다.",
          ]}
          interpretation="Gas가 부족해 message가 실패해도 ante가 이미 parent에 합친 fee·sequence와 message child의 잔액 변경은 같은 방식으로 처리되지 않습니다. 두 cache 경계를 함께 봐야 합니다."
        />

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="RunTx의 두 cache branch" onClick={() => sidebar.open("cosmos-runtx-branches", officialCosmosCodeRefs["cosmos-runtx-branches"])} />
          <CodeViewButton label="공식 실패 경계 테스트" onClick={() => sidebar.open("cosmos-branch-tests", officialCosmosCodeRefs["cosmos-branch-tests"])} />
        </div>
      </section>

      <section id="module-architecture" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">MsgServiceRouter는 요청을 찾고 keeper가 state 수정 권한을 가집니다</h2>
        <p>
          Transaction decoder가 얻은 <code>MsgSend</code>는 protobuf type URL로 bank MsgServer에 연결됩니다.
          MsgServer는 주소와 amount, denom별 송금 허용 정책, blocked recipient를 검사하고 bank keeper의
          <code>SendCoins</code>를 호출합니다. 서명이 맞다는 사실과 bank 송금 규칙을 통과했다는 사실은 별개의 단계입니다.
        </p>
        <p>
          Keeper 경계는 단순한 파일 정리가 아닙니다. App wiring이 bank module에 자기 store service와 필요한
          account keeper interface만 주면, 다른 module이 raw balance key를 직접 고쳐 bank invariant를 우회하기
          어려워집니다. 반대로 넓은 raw store나 과도한 interface를 공유하면 이 권한 경계도 약해집니다.
        </p>

        <div className="not-prose grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-y border-border py-5 text-center">
          <div className="min-w-0 p-2"><strong className="break-keep text-xs">MsgSend</strong><p className="mt-1 text-[10px] text-muted-foreground">type URL·fields</p></div>
          <span aria-hidden className="text-primary">→</span>
          <div className="min-w-0 p-2"><strong className="break-keep text-xs">Bank MsgServer</strong><p className="mt-1 text-[10px] text-muted-foreground">송금 규칙 검사</p></div>
          <span aria-hidden className="text-primary">→</span>
          <div className="min-w-0 p-2"><strong className="break-keep text-xs">Bank keeper</strong><p className="mt-1 text-[10px] text-muted-foreground">balance key 수정</p></div>
        </div>

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="Bank MsgSend 실제 검사" onClick={() => sidebar.open("cosmos-bank-send", officialCosmosCodeRefs["cosmos-bank-send"])} />
        </div>

        <div id="paper-cosmos-ante-bank-v055" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={2} source="cosmos/cosmos-sdk · v0.55.0 auth ante · bank MsgServer" href={`${SOURCE}/x/bank/keeper/msg_server.go`}>
            <p><strong>문제:</strong> Transaction 발신자와 fee를 검사하는 일, bank 송금 정책과 잔액을 검사하는 일을 분리해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Ordered ante decorators와 MsgServiceRouter·bank keeper 경계를 구현합니다.</p>
            <p><strong>전제:</strong> Application이 v0.55.0 기본 ante chain과 bank MsgServer를 이 순서로 wiring해야 합니다.</p>
            <p><strong>일반화 금지:</strong> Custom ante chain이나 다른 module이 같은 정책을 쓴다고 가정하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="state-management" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Child Write, Working AppHash와 root Commit은 세 가지 다른 경계입니다</h2>
        <p>
          CacheMultiStore의 <code>Write()</code>는 child의 key 변경을 parent branch에 합칩니다. FinalizeBlock의
          <code>workingHash()</code>는 성공한 block branch를 root multistore에 쓰고 다음 AppHash를 계산합니다.
          마지막 <code>app.cms.Commit()</code>이 root store의 다음 version을 저장합니다. 앞 단계의 성공 영수증을
          마지막 단계의 durability로 읽으면 안 됩니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["CHILD WRITE", "parent branch", "선택한 임시 변경을 상위 초안에 합칩니다."],
            ["WORKING HASH", "next AppHash", "현재 write set의 root를 Commit 전에 계산합니다."],
            ["ROOT COMMIT", "durable version", "각 substore를 다음 version으로 저장합니다."],
          ].map(([boundary, output, detail]) => (
            <div key={boundary} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-primary">{boundary}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{output}</strong>
              <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>

        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">[M] 공식 테스트 재실행:</strong>{" "}
          <code>{"go test ./baseapp -run '^(TestBaseAppAnteHandler|TestABCI_CheckTx)$' -count=1"}</code>이
          commit <code>{COMMIT.slice(0, 12)}</code>에서 통과했습니다. 45.59초, 최대 RSS 1,342,226,432 bytes,
          swap 0이었습니다. 이는 두 테스트의 state semantics를 확인한 결과이며 전체 SDK 성능 측정이 아닙니다.
        </aside>

        <div id="paper-cosmos-cachemulti-v055" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={3} source="cosmos/cosmos-sdk · v0.55.0 CacheMultiStore · baseapp tests" href={`${SOURCE}/baseapp/baseapp_test.go`}>
            <p><strong>문제:</strong> Ante 실패, message 실패와 전체 성공에서 남겨야 할 state를 서로 다르게 처리해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Nested cache branch의 Write 시점과 mode별 state 재설정을 공식 테스트로 고정합니다.</p>
            <p><strong>확인한 범위:</strong> TestBaseAppAnteHandler와 TestABCI_CheckTx의 state mutation·reset 동작입니다.</p>
            <p><strong>일반화 금지:</strong> 외부 API 호출이나 off-chain side effect까지 CacheMultiStore가 되돌린다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <CosmosCoreMapReturn
        currentSlug="cosmos-sdk"
        closure="Cosmos SDK v0.55의 한 transaction은 CheckTx의 node-local state, FinalizeBlock의 ante parent와 message child, root multistore를 차례로 지납니다. Ante 실패는 첫 child를 버리고, message 실패는 ante 변경만 남깁니다. Working AppHash가 계산된 뒤에도 root Commit이 끝나야 다음 query가 읽는 durable version이 됩니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialCosmosCodeRefs}
        fileTrees={{ "cosmos-sdk": cosmosTree }}
      />
    </article>
  );
}
