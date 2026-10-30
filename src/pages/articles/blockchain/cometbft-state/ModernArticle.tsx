import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosCoreLocator, { CosmosCoreMapReturn } from "../CosmosCoreLocator";
import { RecoveryDecisionViz, StateRecoveryViz, StateSyncBoundaryViz } from "./viz/ModernStateViz";
import { codeRefs } from "./codeRefs";
import { cometbftStateTree } from "./fileTrees";

const sourceCommit = "0880b4d378f347ab16e54ec677ff50d803f37d62";

export default function ModernCometBFTStateArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosCoreLocator
            currentSlug="cometbft-state"
            region="서로 다른 저장 기록을 대조하는 crash replay"
            question="Block 42를 Commit한 직후 node가 종료되면, 같은 transaction을 두 번 실행하지 않고 어디서부터 복구할까요?"
          />
          <h2 className="mb-6 text-2xl font-bold">높이 42의 잔액 변경을 한 번만 반영하며 재시작합니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              <code>B42</code>에는 <code>alice→bob 10</code> transaction <code>T1</code>이 들어 있습니다. Node N은 block 원본과
              <code>FinalizeBlock</code> 결과를 저장하고 application <code>Commit</code>까지 마쳤지만, 새 CometBFT <code>State</code>를
              저장하기 직전에 종료됐습니다.
            </p>
            <p className="text-lg leading-8">
              디스크에는 BlockStore 높이 42, State 높이 41, application 높이 42가 남습니다. CometBFT는 가장 높은 숫자를 그대로
              선택하지 않습니다. 각 저장 기록의 owner와 AppHash를 대조해 application은 건드리지 않고 State만 42로 재구성합니다.
            </p>
            <p>
              앞 글의 mempool은 transaction이 block 후보가 되기 전까지를 다뤘습니다. 후보와 Commit 경계가 필요하면
              <Link to="/cs/blockchain/cometbft-mempool#recheck"> mempool의 Commit 뒤 재검사</Link>부터 이어 읽으면 됩니다.
            </p>
          </div>
          <ContentBoundary article="cometbft-state" />
          <StateRecoveryViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>네 기록은 같은 사실을 복제한 사본이 아닙니다</h3>
            <ul>
              <li><strong>BlockStore</strong>는 합의한 block bytes·parts·commit을 <code>Base…Height</code> 범위로 보존합니다.</li>
              <li><strong>FinalizeBlock 응답</strong>은 State Store DB에 height와 함께 남아 다음 State를 다시 계산할 입력이 됩니다.</li>
              <li><strong>State snapshot</strong>은 마지막 block 위치와 다음 block을 검증할 validator·parameter·AppHash를 보존합니다.</li>
              <li><strong>Application DB</strong>는 잔액처럼 서비스가 정의한 business state와 committed height·AppHash를 소유합니다.</li>
            </ul>
            <p>
              따라서 <code>F42</code>를 “별도 ABCI response 서버”로 이해하면 안 됩니다. 높이별 응답과 crash recovery용 마지막 응답은
              CometBFT State Store가 같은 DB에 저장합니다. Application DB는 이 기록으로 대체할 수 없습니다.
            </p>
          </div>
        </section>

        <section id="durable-stores" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">저장 순서가 복구 가능한 한 칸 차이를 만듭니다</h2>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Consensus State는 B42와 seen commit을 BlockStore에 먼저 저장하고 WAL에 높이 종료를 동기 기록합니다. BlockExecutor는
              <code>FinalizeBlock</code>으로 F42를 계산한 뒤 F42를 State Store DB에 저장합니다. 그다음 application <code>Commit</code>을
              호출하고 마지막에 <code>state.AppHash=X42</code>인 S42를 저장합니다.
            </p>
            <p>
              이 순서는 여러 DB를 하나의 원자 transaction으로 묶지 않습니다. 대신 어느 지점에서 종료돼도 BlockStore가 State보다 두 칸
              이상 앞서지 않도록 하고, application Commit 뒤에는 F42를 남겨 State만 복구할 수 있게 합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="영속화 순서 원문" onClick={() => sidebar.open("persistence-order", codeRefs["persistence-order"])} />
            <CodeViewButton label="State 구조체 원문" onClick={() => sidebar.open("state-struct", codeRefs["state-struct"])} />
            <CodeViewButton label="F42 저장·조회 원문" onClick={() => sidebar.open("finalize-receipt", codeRefs["finalize-receipt"])} />
          </div>

          <ExplainedFormula
            question="재시작 시 어느 저장 기록이 뒤졌는지 어떤 값으로 먼저 표시할 수 있습니까?"
            idea={<>BlockStore 최고 높이에서 State와 application 높이를 각각 뺍니다. 값 자체가 복구를 결정하지는 않지만 가능한 종료 지점을 빠르게 분류합니다.</>}
            formula={String.raw`g_s=H_b-H_s,\qquad g_a=H_b-H_a`}
            annotatedFormula={String.raw`\underbrace{g_s=H_b-H_s}_{\text{State가 뒤진 높이}},\qquad\underbrace{g_a=H_b-H_a}_{\text{application이 뒤진 높이}}`}
            operations={[
              { expression: String.raw`42-41=1`, annotation: ["BlockStore B42", "State S41", "State 저장 전 종료 가능"] },
              { expression: String.raw`42-42=0`, annotation: ["Application A42", "Commit 완료", "실제 app 재실행 금지"] },
              { expression: String.raw`(g_s,g_a)=(1,0)`, annotation: ["F42 height 확인", "mock app replay", "S42만 저장"] },
            ]}
            terms={[
              { symbol: "H_b", name: "BlockStore height", description: "연속 보존한 마지막 block 높이입니다." },
              { symbol: "H_s", name: "State height", description: "State.LastBlockHeight입니다." },
              { symbol: "H_a", name: "Application height", description: "ABCI Info가 보고한 마지막 committed height입니다." },
              { symbol: "g_s,g_a", name: "높이 차이", description: "Block 원본에 비해 두 상태가 얼마나 뒤졌는지 나타냅니다." },
            ]}
            assumptions={[
              "세 높이는 같은 chain·genesis·application instance에서 읽습니다.",
              "BlockStore Base가 필요한 replay 구간보다 높다면 원본이 prune된 상태이므로 별도 error입니다.",
              "높이가 같아도 AppHash가 다르면 복구 성공으로 보지 않습니다.",
              "Application이나 State가 BlockStore보다 앞선 조합은 자동 rollback하지 않습니다.",
            ]}
            interpretation="(Hb,Hs,Ha)=(42,41,42)는 application Commit 뒤 State 저장 전 종료와 맞습니다. 하지만 저장된 F42와 최종 AppHash까지 확인해야 같은 실행의 기록이라고 판단할 수 있습니다."
          />

          <div id="paper-cometbft-state-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · State·Block persistence" citeKey={1} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/state/execution.go`}>
              <p><strong>문제:</strong> 합의 원본, application 결과와 다음 검증 State가 서로 다른 저장 경계에 남습니다.</p>
              <p><strong>기여:</strong> Block→FinalizeBlock response→application Commit→State 순서와 crash recovery receipt를 구현합니다.</p>
              <p><strong>전제:</strong> v0.40.0 consensus·State Store·ABCI application 계약을 함께 사용합니다.</p>
              <p><strong>근거 범위:</strong> 한 node의 block 적용 과정에서 생기는 durable height와 AppHash입니다.</p>
              <p><strong>말하지 않는 것:</strong> 여러 DB의 원자 commit, external API exactly-once, 손상된 디스크 자동 복구를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="replay" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Handshaker는 높이 조합마다 replay owner를 바꿉니다</h2>
          <RecoveryDecisionViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              재시작한 Handshaker는 application의 <code>Info</code> 응답에서 <code>H_a</code>와 AppHash를 읽습니다. 이어 BlockStore의
              <code>Base·Height</code>와 <code>State.LastBlockHeight</code>를 대조합니다. 정상적인 CometBFT 기록은
              <code>H_s≤H_b≤H_s+1</code>이어야 하며 application은 <code>H_b</code>보다 앞설 수 없습니다.
            </p>
            <p>
              B42·S41·A42에서는 <code>LoadLastFinalizeBlockResponse(42)</code>로 F42를 읽고
              <code>newMockProxyApp(F42)</code>을 만듭니다. <code>replayBlock</code>은 B42와 F42로 S42를 계산하지만 application DB에는
              T1을 다시 적용하지 않습니다. 마지막에는 S42의 AppHash와 application이 보고한 X42가 같은지 확인합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="높이 불변식 원문" onClick={() => sidebar.open("replay-guards", codeRefs["replay-guards"])} />
            <CodeViewButton label="Replay 분기 원문" onClick={() => sidebar.open("replay-decision", codeRefs["replay-decision"])} />
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>실제 application replay가 필요한 경우도 있습니다</h3>
            <p>
              B42·S41·A41이면 application도 41에 있으므로 B42를 실제 application에 실행해 A42와 S42를 함께 만듭니다. B42·S42·A40처럼
              State만 앞선 경우에는 A41…A42를 실제 application에 replay하지만 State를 이미 다시 전진시키지는 않습니다.
            </p>
            <h3>진행하지 않는 조합이 안전 경계입니다</h3>
            <ul>
              <li>Application이 BlockStore보다 앞서면 <code>ErrAppBlockHeightTooHigh</code>를 반환합니다.</li>
              <li>State가 BlockStore보다 앞서거나 BlockStore가 State보다 두 칸 이상 앞서면 내부 불변식 위반으로 중단합니다.</li>
              <li>Application이 뒤졌는데 필요한 block이 이미 prune됐다면 <code>ErrAppBlockHeightTooLow</code>를 반환합니다.</li>
              <li>Height가 같아도 AppHash가 다르면 assertion이 실패합니다. 숫자 일치는 동일 상태의 증명이 아닙니다.</li>
              <li>F42가 없거나 저장된 receipt height가 다르면 mock replay를 추측으로 대신하지 않습니다.</li>
            </ul>
          </div>
          <div id="paper-cometbft-blockstore-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · consensus/replay.go" citeKey={2} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/consensus/replay.go`}>
              <p><strong>문제:</strong> 재시작 시 BlockStore·State·application의 durable progress가 다를 수 있습니다.</p>
              <p><strong>기여:</strong> Height 불변식, real application replay, saved response 기반 mock replay와 AppHash 검사를 구현합니다.</p>
              <p><strong>전제:</strong> 필요한 block 구간과 마지막 FinalizeBlock 응답이 local store에 남아 있습니다.</p>
              <p><strong>근거 범위:</strong> ABCI handshake부터 local crash replay가 끝날 때까지의 분기입니다.</p>
              <p><strong>말하지 않는 것:</strong> 임의 DB 손상 복구, 잘못 초기화한 application 자동 rollback, 외부 side effect 중복 제거를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="state-sync" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">새 node의 state sync는 로컬 crash replay와 다른 문제입니다</h2>
          <StateSyncBoundaryViz />
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Crash replay는 같은 node의 local records를 대조합니다. State sync는 genesis부터 모든 block을 실행하지 않고 외부에서 application
              snapshot chunk를 받으므로, 먼저 <code>trust_height·trust_hash·trust_period</code>로 light client 신뢰 기준을 세워야 합니다.
            </p>
            <p>
              State provider는 snapshot height <code>h</code>뿐 아니라 <code>h+1</code>과 <code>h+2</code>의 verified light blocks를 읽어
              Last·Current·Next validator set을 구성합니다. Chunk 적용 뒤 application이 보고한 height·AppHash·app version이 trusted state와
              모두 맞아야 <code>Bootstrap</code>으로 State와 seen commit을 저장하고 block sync로 전진합니다.
            </p>
          </div>
          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="State sync 검증 원문" onClick={() => sidebar.open("state-sync-verify", codeRefs["state-sync-verify"])} />
          </div>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>Snapshot bytes만 받았다고 신뢰가 생기지는 않습니다</h3>
            <p>
              Snapshot provider와 trusted header provider는 같은 책임이 아닙니다. Application이 모든 chunk를 적용했다는 응답만으로도 충분하지
              않습니다. 적용한 결과의 AppHash와 height가 light client로 검증한 값과 일치해야 새 node의 시작점이 됩니다.
            </p>
            <h3>이 글만으로 확인할 질문</h3>
            <ol>
              <li>F42가 State Store와 별도 서버에 있는 것이 아닌데도 별도 receipt로 구분하는 이유를 설명할 수 있습니까?</li>
              <li>B42·S41·A42에서 실제 application 대신 mock application을 쓰는 이유를 말할 수 있습니까?</li>
              <li>B42·S41·A41과 B42·S42·A41의 replay 경로 차이를 설명할 수 있습니까?</li>
              <li>Height가 모두 42여도 AppHash 비교가 필요한 반례를 만들 수 있습니까?</li>
              <li>State sync에서 h·h+1·h+2 header를 각각 어디에 쓰는지 설명할 수 있습니까?</li>
            </ol>
          </div>
          <div id="paper-cometbft-state-sync-v040" className="scroll-mt-24">
            <CitationBlock source="CometBFT v0.40.0 · statesync/syncer.go · stateprovider.go" citeKey={3} type="code" href={`https://github.com/cometbft/cometbft/blob/${sourceCommit}/statesync/syncer.go`}>
              <p><strong>문제:</strong> 외부 snapshot으로 복원한 application state를 검증된 consensus state에 연결합니다.</p>
              <p><strong>기여:</strong> Trusted AppHash·State·commit 조회, chunk 적용, app version·height·hash 확인과 local bootstrap을 구현합니다.</p>
              <p><strong>전제:</strong> 유효한 trust anchor, light client providers와 application snapshot protocol 지원이 필요합니다.</p>
              <p><strong>근거 범위:</strong> Snapshot 선택부터 State·seen commit bootstrap까지의 검증 경계입니다.</p>
              <p><strong>말하지 않는 것:</strong> 임의 provider의 정직성, 만료된 trust root의 안전성, snapshot 밖 external state를 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <CosmosCoreMapReturn
          currentSlug="cometbft-state"
          closure="CometBFT는 BlockStore·State Store의 FinalizeBlock receipt·State snapshot·application DB를 서로 다른 durable progress로 취급합니다. 재시작 시 height 불변식과 AppHash로 real replay와 mock replay를 고르며, 새 node의 state sync에는 별도의 light-client trust와 snapshot 결과 검증이 필요합니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ cometbft: cometbftStateTree }}
        projectMetas={{ cometbft: { id: "cometbft", label: "CometBFT v0.40.0 · Go", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" } }}
      />
    </>
  );
}
