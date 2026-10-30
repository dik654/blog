import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import CosmosCoreLocator, { CosmosCoreMapReturn } from "../CosmosCoreLocator";
import { codeRefs } from "./codeRefs";
import { cometbftTree } from "./fileTrees";
import { officialCometBFTCodeRefs } from "./officialCodeRefs";
import CometBFTArchFlowViz from "./viz/CometBFTArchFlowViz";

const COMMIT = "0880b4d378f347ab16e54ec677ff50d803f37d62";
const SOURCE = `https://github.com/cometbft/cometbft/tree/${COMMIT}`;
const ALL_CODE_REFS = { ...codeRefs, ...officialCometBFTCodeRefs };

const OWNER_ROWS = [
  ["P2P · RPC", "bytes를 받고 peer에 운반합니다.", "수신·전파", "/cs/blockchain/cometbft-p2p"],
  ["Mempool", "각 node의 다음 block 후보를 관리합니다.", "CheckTx·recheck", "/cs/blockchain/cometbft-mempool"],
  ["Consensus", "proposal과 vote로 block 순서를 결정합니다.", "height·round·commit", "/cs/blockchain/cometbft-consensus"],
  ["ABCI application", "결정된 bytes를 application state transition으로 해석합니다.", "FinalizeBlock·Commit", "/cs/blockchain/cometbft-abci"],
  ["BlockExecutor · stores", "block·response·AppHash·다음 State를 복구 가능한 순서로 남깁니다.", "검증·영속화", "/cs/blockchain/cometbft-execution"],
] as const;

export default function Overview() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <CosmosCoreLocator
          currentSlug="cometbft"
          region="Transaction 운반 · 순서 결정 · application handoff"
          question="한 node가 transaction을 받았다는 사실은 언제 모든 validator가 실행할 하나의 block order가 됩니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            CheckTx OK와 block commit, application Commit은 왜 서로 다른 영수증입니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            높이 40까지 저장된 node에 Alice→Bob 10이라는 transaction bytes가 도착했다고 가정합니다.
            같은 bytes가 어느 node의 후보에서 validator들의 결정 증거로, 다시 application의 높이 41 state로
            바뀌는지 한 번만 끝까지 추적합니다.
          </p>
        </div>

        <CometBFTArchFlowViz />

        <p className="text-lg leading-8">
          <strong>CometBFT는 Alice와 Bob의 잔액 규칙을 모릅니다.</strong> P2P와 mempool로 opaque bytes를 모으고,
          validator vote로 모든 correct node가 사용할 block order를 정한 뒤 ABCI application에 전달합니다.
          잔액·권한·fee를 해석하고 AppHash를 계산하는 주체는 application입니다.
        </p>
        <p>
          앞 글인 <Link to="/cs/blockchain/cosmos-sdk" className="font-bold text-primary hover:underline">Cosmos SDK transaction 글</Link>은
          application 안의 state branch를 소유합니다. 이 글은 그보다 한 단계 위에서 <strong>어떤 bytes가 어느 height의 입력이 되는지</strong>를
          소유합니다. 둘을 합치면 consensus commit과 application durable state를 같은 순간으로 오해하게 됩니다.
        </p>
        <ContentBoundary article="cometbft" />
      </section>

      <section id="owners" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">한 경로지만 상태를 쓰는 주체는 다섯 곳입니다</h2>
        <p>
          각 구성요소는 앞 단계의 receipt를 입력으로 받을 뿐, 뒤 단계의 성공을 대신 약속하지 않습니다. 특히 RPC가 성공한
          transaction은 다른 node에 없을 수 있고, +2/3 precommit을 본 node도 해당 block bytes를 아직 받지 못했을 수 있습니다.
        </p>

        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-5">
          {OWNER_ROWS.map(([owner, role, state, href], index) => (
            <Link key={owner} to={href} className="min-w-0 bg-background p-4 hover:bg-muted/40">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{owner}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{role}</p>
              <p className="mt-3 border-t border-border pt-2 text-[10px] font-bold text-primary">{state}</p>
            </Link>
          ))}
        </div>

        <aside className="border-l-2 border-primary/60 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">상태 소유권:</strong> Mempool membership은 node-local이고 consensus는 block order를
          결정합니다. Application은 transaction result와 AppHash를 계산하며, BlockExecutor는 여러 저장 경계를 순서대로 연결합니다.
          어느 한 컴포넌트도 이 네 상태를 혼자 소유하지 않습니다.
        </aside>
      </section>

      <section id="lifecycle" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 코드는 admission·결정·영속화를 세 경계로 나눕니다</h2>
        <p>
          v0.40.0에서 <code>CListMempool.CheckTx</code>는 local capacity와 duplicate를 확인하고 application의
          CheckTx를 비동기로 호출합니다. Consensus의 <code>enterCommit</code>은 같은 round에 +2/3 precommit이 있는지 확인하고,
          그 hash의 block bytes까지 있을 때 <code>finalizeCommit</code>으로 넘어갑니다. 마지막으로 BlockExecutor가
          FinalizeBlock response, application Commit과 CometBFT State를 차례로 저장합니다.
        </p>

        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton label="CheckTx admission 코드" onClick={() => sidebar.open("cometbft-checktx-v040", officialCometBFTCodeRefs["cometbft-checktx-v040"])} />
          <CodeViewButton label="+2/3 precommit 판정 코드" onClick={() => sidebar.open("cometbft-entercommit-v040", officialCometBFTCodeRefs["cometbft-entercommit-v040"])} />
          <CodeViewButton label="FinalizeBlock·Commit 순서" onClick={() => sidebar.open("cometbft-applycommit-v040", officialCometBFTCodeRefs["cometbft-applycommit-v040"])} />
        </div>

        <div className="not-prose grid gap-px bg-border p-px md:grid-cols-3">
          {[
            ["ADMISSION", "CheckTx OK", "이 node의 후보가 됐다는 뜻입니다. 포함·합의·실행은 남아 있습니다."],
            ["DECISION", "+2/3 precommit", "특정 height·round의 BlockID가 결정됐다는 증거입니다. Application result는 남아 있습니다."],
            ["DURABILITY", "Commit + State", "Application height·AppHash와 CometBFT State가 맞아야 다음 height의 정본이 됩니다."],
          ].map(([kind, receipt, boundary]) => (
            <div key={kind} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-primary">{kind}</span>
              <strong className="mt-2 block break-keep text-sm leading-6">{receipt}</strong>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{boundary}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="failure" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">중간에 멈추면 마지막으로 남은 receipt에서 다시 시작합니다</h2>
        <p>
          시스템의 실패 동작도 같은 경계로 읽을 수 있습니다. CheckTx 뒤 node가 멈추면 committed state는 바뀌지 않았고 client가
          transaction을 다시 제출할 수 있습니다. +2/3 precommit은 모았지만 block bytes가 없으면 consensus state는 그 hash의 parts를
          받을 때까지 application 실행으로 넘어가지 않습니다.
        </p>
        <p>
          Application Commit 뒤 CometBFT State 저장 전에 멈춘 경우는 더 조심해야 합니다. Restart handshake는 BlockStore,
          저장한 FinalizeBlock response, application height·AppHash와 CometBFT State를 비교해 빠진 단계를 재생해야 합니다.
          이때 email·결제 API 같은 외부 효과를 FinalizeBlock 안에서 무조건 다시 호출하면 중복될 수 있으므로 합의 state의 outbox와
          stable transaction ID로 별도 조정해야 합니다.
        </p>

        <div className="not-prose overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs leading-5">
            <thead><tr className="border-y border-border"><th className="p-3">마지막 receipt</th><th className="p-3">정본 상태</th><th className="p-3">재개할 일</th></tr></thead>
            <tbody>
              <tr className="border-b border-border"><td className="p-3 font-bold">CheckTx OK</td><td className="p-3">h40 unchanged</td><td className="p-3 text-muted-foreground">재전파·재제출 가능, inclusion을 다시 확인합니다.</td></tr>
              <tr className="border-b border-border"><td className="p-3 font-bold">+2/3 precommit, block 없음</td><td className="p-3">B41 order decided</td><td className="p-3 text-muted-foreground">같은 BlockID의 parts를 받아 hash를 확인합니다.</td></tr>
              <tr className="border-b border-border"><td className="p-3 font-bold">Application h41, State h40</td><td className="p-3">app가 한 단계 앞섬</td><td className="p-3 text-muted-foreground">height·AppHash를 대조해 deterministic replay와 state save를 조정합니다.</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="source" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">이 글은 CometBFT v0.40.0 한 snapshot에 고정합니다</h2>
        <p>
          Repository main, 최신 문서와 실제 binary가 서로 다른 revision이면 method 이름과 persistence 순서를 섞게 됩니다.
          이 글은 tag v0.40.0이 가리키는 commit <code>{COMMIT.slice(0, 12)}</code>을 기준으로 읽었습니다. 실제 node를 분석할 때는
          CometBFT semver·git SHA, ABCI protocol, application binary/config, chain ID·height와 database schema를 함께 남겨야 합니다.
        </p>

        <div id="paper-cometbft-repository" className="scroll-mt-24">
          <CitationBlock type="code" citeKey={1} source="cometbft/cometbft · v0.40.0" href={SOURCE}>
            <p><strong>문제:</strong> Transaction admission, BFT decision과 application durability가 서로 다른 code path에 있습니다.</p>
            <p><strong>확인한 구현:</strong> <code>mempool/clist_mempool.go</code>, <code>consensus/state.go</code>, <code>state/execution.go</code>입니다.</p>
            <p><strong>고정한 버전:</strong> v0.40.0 annotated tag의 content commit <code>{COMMIT.slice(0, 12)}</code>입니다.</p>
            <p><strong>일반화 금지:</strong> 이 source snapshot만으로 application business logic이나 외부 side effect의 exactly-once를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-cometbft-abci-spec" className="scroll-mt-24">
          <CitationBlock type="paper" citeKey={2} source="CometBFT v0.40.0 · ABCI++ methods" href={`${SOURCE}/spec/abci/abci%2B%2B_methods.md`}>
            <p><strong>문제:</strong> Consensus engine과 application 사이의 request·response 권한과 호출 순서를 고정합니다.</p>
            <p><strong>직접 뒷받침하는 범위:</strong> CheckTx, PrepareProposal, ProcessProposal, FinalizeBlock과 Commit의 의미입니다.</p>
            <p><strong>전제:</strong> 같은 v0.40.0 protocol과 호환되는 deterministic application을 사용해야 합니다.</p>
            <p><strong>일반화 금지:</strong> Application database의 atomicity나 외부 API의 exactly-once까지 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-cometbft-consensus-spec" className="scroll-mt-24">
          <CitationBlock type="paper" citeKey={3} source="CometBFT v0.40.0 · Byzantine consensus" href={`${SOURCE}/spec/consensus/consensus.md`}>
            <p><strong>문제:</strong> Byzantine validator와 network delay가 있어도 하나의 block order를 결정합니다.</p>
            <p><strong>직접 뒷받침하는 범위:</strong> Proposal·prevote·precommit, round change와 commit evidence입니다.</p>
            <p><strong>전제:</strong> Version이 정한 voting power, fault bound, signature와 partial-synchrony 가정을 따릅니다.</p>
            <p><strong>일반화 금지:</strong> Application 실행, storage durability나 모든 배포의 latency를 고정하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <CosmosCoreMapReturn
        currentSlug="cometbft"
        closure="CometBFT는 transaction bytes를 node-local mempool 후보로 받고, proposal·prevote·precommit으로 하나의 block order를 결정한 뒤 ABCI application에 넘깁니다. CheckTx OK, +2/3 precommit, FinalizeBlock result와 application Commit은 서로 다른 owner가 남기는 별도 receipt이며, block·State·application height와 AppHash가 맞아야 다음 height의 durable 정본이 됩니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={ALL_CODE_REFS}
        fileTrees={{ cometbft: cometbftTree }}
      />
    </article>
  );
}
