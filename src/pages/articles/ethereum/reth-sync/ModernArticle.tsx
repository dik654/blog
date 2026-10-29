import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ExecutionClientLocator from "../shared/ExecutionClientLocator";
import { rethSyncCodeRefs, RETH_SYNC_PROJECT_META } from "./modernCodeRefs";
import { rethSyncV281Tree } from "./modernFileTree";
import RethSyncLocator, { RethSyncMapReturn } from "./RethSyncLocator";
import RethSyncFlowViz from "./viz/RethSyncFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethSyncLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            CL이 가리킨 head의 부모가 없으면, Reth는 언제 다운로드하고 언제 pipeline을 실행합니까?
          </h2>
        </div>
        <RethSyncFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Reth는 동기화를 Full·Snap·Live 가운데 하나를 계속 선택하는 세 제품 모드로 처리하지 않습니다. Reth v2.8.1의 기본 경로에서는 engine tree가 head 근처의 블록을 처리하고, 간격이 커지면 backfill orchestrator가 staged pipeline을 단독 writer로 실행합니다. 저장 상태가 target까지 이어지면 engine tree가 남은 블록을 연결하고 live 요청을 다시 맡습니다.
        </p>
        <p>
          이 글은 <Link to="/cs/blockchain/node-architecture#case">이더리움 노드 전체 지도의 A→B 10 ETH 송금</Link>이 포함된 후보 블록을 그대로 따라갑니다. 실행 클라이언트에 그 후보의 부모 자료가 없는 순간부터 시작합니다. 특정 설정을 배포하거나 성능을 비교하는 판단은 다루지 않습니다.
        </p>
        <ContentBoundary article="reth-sync" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">같은 후보 블록에서 부모 구간만 비어 있습니다</h2>
        <ExecutionClientLocator
          current="sync"
          path={["p2p", "sync", "engine-api", "execution", "provider", "execution-store"]}
          question="빠진 부모를 받은 뒤 어느 경로가 저장 상태를 채우고 같은 후보를 다시 계산합니까?"
        />
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Reth 동기화 설명에 사용할 한 후보의 시작 상태">
          {[
            ["로컬 canonical", "block 1,000", "실행·검증·저장 완료"],
            ["CL이 고른 head", "block 1,008", "A→B 송금 포함 후보"],
            ["빠진 부모", "1,001–1,007", "로컬 provider에서 찾지 못함"],
            ["첫 응답", "SYNCING", "VALID이나 INVALID로 단정하지 않음"],
          ].map(([title, value, note]) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block break-all text-[11px] text-primary">{value}</code>
              <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p>
          1,000과 1,008은 경로를 설명하기 위한 번호입니다. 실제 backfill 전환은 고정된 여덟 블록 규칙이 아니라 활성 설정의 threshold와 현재 canonical tip, target block의 거리로 판단합니다. 따라서 이 예시는 어느 경로가 더 빠르다는 측정값이 아닙니다.
        </p>
      </section>

      <section id="missing-head" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">모르는 head에는 SYNCING과 자료 요청을 함께 내보냅니다</h2>
        <p>
          Consensus client는 Engine API의 <code>forkchoiceUpdated</code>로 head·safe·finalized hash를 전달합니다. Engine tree는 먼저 head가 이미 canonical인지, 메모리 tree의 유효한 fork인지 확인합니다. 어느 쪽에서도 찾지 못하면 초기 상황에서는 safe block을, 그 밖에는 head 또는 가장 낮은 buffered ancestor를 다운로드 목표로 잡습니다.
        </p>
        <p>
          이때 응답은 <code>PayloadStatusEnum::Syncing</code>입니다. 아직 실행하지 못했다는 뜻이지 block이 잘못됐다는 판정이 아닙니다. 같은 결과에 <code>DownloadRequest::single_block</code>을 붙여 engine handler 위쪽의 P2P downloader에 전달합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("engine-path", rethSyncCodeRefs["engine-path"])} />
          <span className="text-xs text-muted-foreground">FCU → SYNCING → DownloadRequest의 실제 분기</span>
        </div>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["입력", "head·safe·finalized hash", "CL이 원하는 체인 관점"],
            ["현재 판정", "SYNCING", "자료 부족으로 유효성 미확정"],
            ["다음 작업", "single block 또는 range", "P2P에서 부모를 찾음"],
          ].map(([title, value, note]) => (
            <div key={title} className="bg-background p-4">
              <strong className="text-xs">{title}</strong>
              <code className="mt-2 block text-[11px] text-primary">{value}</code>
              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="short-gap" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">짧은 누락 구간은 downloader와 engine tree가 이어 붙입니다</h2>
        <p>
          Downloader가 target block을 받았는데 부모가 비어 있으면 engine tree는 missing parent와 현재 canonical tip 사이의 거리를 계산합니다. Backfill 기준보다 짧으면 <code>DownloadRequest::block_range</code>로 연속 부모를 가져옵니다. Side branch처럼 높이만으로 연속 범위를 정할 수 없으면 한 block씩 요청합니다.
        </p>
        <p>
          받은 block은 곧바로 canonical 기록이 되지 않습니다. Engine tree가 header·body와 실행 결과를 검증하고, 부모에서 이어지는 유효한 chain을 만들었을 때만 forkchoice head를 canonical로 바꿉니다. 따라서 <strong>다운로드 완료</strong>, <strong>실행 완료</strong>, <strong>canonical 반영</strong>은 서로 다른 상태입니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">확인한 사실</th><th className="px-3 py-3">아직 확인하지 않은 사실</th></tr></thead>
            <tbody>
              {[
                ["downloaded", "요청한 block bytes를 받음", "실행 유효성·canonical 여부"],
                ["executed", "부모 상태에 transaction을 적용함", "CL이 고른 canonical head인지"],
                ["canonical", "forkchoice와 일치하는 chain으로 반영함", "finalized 이전 reorg 가능성"],
                ["persisted", "저장소 경계까지 기록함", "downstream 소비자의 처리 완료"],
              ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </section>

      <section id="backfill-sync" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">큰 누락 구간에서는 pipeline이 canonical state의 단독 writer가 됩니다</h2>
        <p>
          누락 거리가 threshold를 넘고 target을 아직 저장소에서 찾지 못하면 engine tree는 <code>BackfillAction::Start(PipelineTarget::Sync)</code>를 내보냅니다. Chain orchestrator가 이 action을 <code>PipelineSync</code>에 전달하고, 시작·종료 event를 다시 engine tree에 알려 줍니다.
        </p>
        <p>
          Backfill 상태는 <code>Idle → Pending → Active → Idle</code>로 이동합니다. Persistence나 payload build가 아직 DB view를 사용 중이면 바로 시작하지 않고 <code>PendingRevalidation</code>에서 작업이 끝나기를 기다린 뒤 target을 다시 확인합니다. 이 재확인은 오래 기다리는 동안 head가 바뀌었을 수 있기 때문에 필요합니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("backfill-control", rethSyncCodeRefs["backfill-control"])} />
          <span className="text-xs text-muted-foreground">Backfill 상태와 live writer를 분리하는 실제 코드</span>
        </div>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4" aria-label="Backfill 상태 전이">
          {[
            ["Idle", "engine tree가 live payload 실행"],
            ["Pending", "Start 전달 · writer 전환 대기"],
            ["Active", "pipeline이 DB write lock 보유"],
            ["Idle", "저장 head 정리 뒤 live 복귀"],
          ].map(([state, body], index) => (
            <div key={`${state}-${index}`} className="relative bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block text-sm">{state}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
              {index < 3 ? <span aria-hidden className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-0.5 text-primary sm:block">→</span> : null}
            </div>
          ))}
        </div>
        <p>
          Pipeline이 active인 동안 새 <code>forkchoiceUpdated</code>에는 <code>SYNCING</code>으로 답하고 최신 target·finalized hash만 전달합니다. 새 <code>newPayload</code>는 실행하지 않고 메모리 buffer에 둡니다. 두 경로가 같은 canonical state를 동시에 쓰지 않게 하는 제어입니다.
        </p>
      </section>

      <section id="full-sync" className="space-y-6 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Pipeline은 stage별 결과와 checkpoint를 같은 순서로 전진시킵니다</h2>
        <p>
          Staged pipeline은 등록된 stage를 순서대로 실행합니다. Header와 body를 확보하고 sender를 복구한 뒤 transaction을 실행하고, trie·index처럼 다음 조회에 필요한 파생 상태를 만듭니다. 정확한 stage 집합은 storage mode와 활성 feature에 따라 달라질 수 있으므로 이 글은 고정된 이름 목록보다 <strong>앞 stage의 검증된 연속 범위만 다음 stage가 소비한다</strong>는 규칙에 초점을 둡니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["Headers·Bodies", "network 입력을 block 단위로 정렬"],
            ["Sender·Execution", "서명 발신자와 state transition 계산"],
            ["Trie·Root", "결과를 header commitment와 대조"],
            ["Finish·Index", "저장·조회 경계와 checkpoint 갱신"],
          ].map(([title, body], index) => (
            <div key={title} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block break-keep text-xs">{title}</strong>
              <p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <ExplainedFormula
          question="Stage가 서로 다른 block까지 끝났다면 전체 동기화 진척은 어디까지입니까?"
          idea="필수 stage가 모두 연속해서 끝난 가장 낮은 checkpoint까지만 다음 경로가 신뢰할 수 있습니다."
          formula={String.raw`c_{\mathrm{sync}}=\min(c_{\mathrm{headers}},c_{\mathrm{bodies}},c_{\mathrm{execution}},c_{\mathrm{finish}})`}
          annotatedFormula={String.raw`c_{\mathrm{sync}}=\underbrace{\min(c_{\mathrm{headers}},c_{\mathrm{bodies}},c_{\mathrm{execution}},c_{\mathrm{finish}})}_{\text{필수 stage의 가장 낮은 연속 checkpoint}}`}
          operations={[
            { expression: String.raw`\min(1008,1008,1005,1005)=1005`, annotation: ["Headers와 bodies가 1,008까지 있어도", "실행과 finish가 1,005라면", "전체 검증 진척은 1,005입니다."] },
          ]}
          terms={[
            { symbol: "c_stage", name: "stage checkpoint", description: "해당 stage가 같은 chain generation에서 결과와 함께 durable commit한 마지막 연속 block입니다." },
            { symbol: "c_sync", name: "공통 동기화 checkpoint", description: "Live handoff와 다음 consumer가 신뢰할 수 있는 공통 prefix입니다." },
          ]}
          assumptions={[
            "비교하는 checkpoint는 같은 network·fork·target generation에 속합니다.",
            "Stage 결과와 checkpoint가 같은 원자적 저장 경계에서 기록됩니다.",
            "완료 판단에 포함할 필수 stage 집합을 먼저 고정합니다.",
          ]}
          interpretation="다운로드 높이를 실행 높이로 보고하면 안 됩니다. Reth의 PipelineProgress도 stage별 진행 가운데 최소 block을 별도로 추적합니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("pipeline", rethSyncCodeRefs.pipeline)} />
          <span className="text-xs text-muted-foreground">Stage 순차 실행과 checkpoint 기반 unwind</span>
        </div>
      </section>

      <section id="unwind" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">검증 실패는 뒤 stage부터 역순으로 되돌립니다</h2>
        <p>
          Execution 또는 root 검증에서 잘못된 block이 발견되면 pipeline은 <code>ControlFlow::Unwind</code>를 반환합니다. 실행 순서의 반대로 stage를 순회하며 target보다 높은 결과와 checkpoint를 제거합니다. 이렇게 해야 body는 남아 있는데 execution checkpoint만 앞서 있거나, index가 이미 사라진 state를 가리키는 혼합 상태를 피할 수 있습니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5" aria-label="Root mismatch 뒤 Reth pipeline이 되돌아가는 순서">
          {[
            ["발견", "root mismatch"],
            ["멈춤", "진척 공개 중지"],
            ["역순", "index→trie→execution"],
            ["저장", "output·checkpoint 후퇴"],
            ["재시작", "새 canonical target"],
          ].map(([title, body], index) => (
            <div key={title} className="bg-background p-3">
              <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
              <strong className="mt-1 block text-xs">{title}</strong>
              <p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p>
          이 동작은 운영자가 장애 대응 절차로 임의 실행하는 rollback 설명이 아니라 pipeline 자체의 검증 실패 처리입니다. 잘못된 block은 invalid header cache에 남고, unwind 뒤에는 CL이 보낸 새 forkchoice를 기준으로 다음 sync target을 다시 잡습니다.
        </p>
      </section>

      <section id="live-sync" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Backfill이 끝나면 저장 head를 맞춘 뒤 남은 짧은 구간을 live 경로가 처리합니다</h2>
        <p>
          Pipeline이 끝났다는 event를 받으면 engine tree는 backfill 상태를 <code>Idle</code>로 돌리고, provider에서 완료 높이의 hash를 읽어 tree와 persistence head를 맞춥니다. 실행 중 target이 더 앞으로 이동했다면 새 간격이 여전히 큰지 다시 판단합니다. 크면 backfill을 한 번 더 실행하고, 작으면 남은 block range를 내려받아 buffered child를 연결합니다.
        </p>
        <p>
          이 handoff에는 별도의 “전환 버튼”이 없습니다. <strong>저장된 canonical prefix</strong>, <strong>최신 forkchoice target</strong>, <strong>buffered block의 부모 연결</strong>이 맞아야 live owner가 이어집니다. 같은 block을 pipeline과 engine tree가 동시에 commit하거나 어느 쪽도 처리하지 않는 구간이 생기지 않아야 합니다.
        </p>
        <div className="not-prose overflow-x-auto border-y border-border">
          <table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5">
            <thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">Canonical writer</th><th className="px-3 py-3">새 payload</th><th className="px-3 py-3">다음 조건</th></tr></thead>
            <tbody>{[
              ["Idle · live", "engine tree", "실행·검증", "큰 gap 발견"],
              ["Pending / revalidation", "아직 전환 안 함", "새 실행 차단 또는 buffer", "reader·persistence 종료"],
              ["Active backfill", "staged pipeline", "buffer", "pipeline Finished"],
              ["Handoff", "저장 head 정리 뒤 engine tree", "buffered child 연결", "최신 head와 연속"],
            ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <h3 className="break-keep text-xl font-bold">ExEx는 이 흐름의 마지막 소비자이지 동기화 방식이 아닙니다</h3>
        <p>
          Canonical chain이 바뀌면 ExEx는 commit·reorg·revert notification을 받을 수 있습니다. 하지만 ExEx가 parent block을 내려받거나 pipeline checkpoint를 전진시키지는 않습니다. 외부 인덱서가 알림을 처리했는지, 어디까지 durable하게 저장했는지는 그 소비자가 별도 checkpoint로 관리합니다. 자세한 구조는 다음 <Link to="/cs/blockchain/reth-exex#overview">Reth ExEx 글</Link>에서 이어집니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Reth v2.8.1 구현과 Engine API 계약까지만 결론을 냅니다</h2>
        <CitationBlock source="Reth v2.8.1 · engine tree와 backfill" citeKey={1} href="https://github.com/paradigmxyz/reth/tree/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/engine/tree">
          <p><Label>O</Label><code>EngineHandler</code>, downloader, <code>BackfillSyncState</code>, <code>BackfillAction</code>과 pipeline handoff의 실제 구현 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> Commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>에 고정한 source입니다. 다른 release와 설정의 threshold·storage backend까지 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock source="Reth v2.8.1 · staged pipeline" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/d763342fa185e4e90ee79dc65f6a5706168b0bcb/crates/stages/api/src/pipeline/mod.rs">
          <p><Label>O</Label>Stage 순차 실행, <code>PipelineProgress</code>, <code>ControlFlow::Unwind</code>와 역순 unwind를 확인했습니다.</p>
          <p><strong>범위:</strong> Pipeline 내부 상태 전이의 근거이며 특정 하드웨어의 동기화 시간이나 처리량 측정은 아닙니다.</p>
        </CitationBlock>
        <CitationBlock source="Ethereum Execution APIs · pinned snapshot" citeKey={3} href="https://github.com/ethereum/execution-apis/blob/3d627c95a4d3510a8187dd02e0250ecb4331d27e/src/engine/paris.md">
          <p><Label>O</Label><code>forkchoiceUpdated</code>에서 unknown head의 sync를 시작할 수 있고 응답 상태가 VALID·INVALID·SYNCING으로 구분된다는 외부 계약을 확인했습니다.</p>
          <p><strong>범위:</strong> 이 규격은 Reth 내부의 downloader, threshold, pipeline checkpoint와 ExEx를 정하지 않습니다.</p>
        </CitationBlock>
        <p><Label>M</Label>대상 장비의 동기화 시간, stage별 처리량, 저장 I/O와 recovery 시간은 측정하지 않았습니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>모르는 forkchoice head에 INVALID 대신 SYNCING으로 답하는 이유는 무엇입니까? <strong>(답: 자료가 부족해 아직 실행 유효성을 판정하지 못했기 때문입니다.)</strong></li>
          <li>Downloader가 block 1,008을 받았다는 사실과 canonical state가 1,008까지 전진했다는 사실은 왜 다릅니까? <strong>(답: 부모 연결·실행·root 검증·forkchoice 반영이 남아 있습니다.)</strong></li>
          <li>Backfill active 동안 engine tree가 새 payload를 buffer에 두는 이유는 무엇입니까? <strong>(답: pipeline과 live path가 같은 DB state를 동시에 쓰지 않게 하기 위해서입니다.)</strong></li>
          <li>Headers 1,008·Bodies 1,008·Execution 1,005·Finish 1,005라면 공통 checkpoint는 어디입니까? <strong>(답: 필수 stage의 최솟값인 1,005입니다.)</strong></li>
          <li>ExEx notification이 동기화 완료를 대신할 수 없는 이유는 무엇입니까? <strong>(답: canonical 결과의 downstream 알림이며 자료 수집·실행·checkpoint를 소유하지 않기 때문입니다.)</strong></li>
        </ol>
      </section>

      <RethSyncMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={rethSyncCodeRefs}
        fileTrees={{ reth: rethSyncV281Tree }}
        projectMetas={RETH_SYNC_PROJECT_META}
      />
    </article>
  );
}
