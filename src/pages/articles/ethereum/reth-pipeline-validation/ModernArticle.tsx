import type { ReactNode } from "react";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import { rethPipelineTree } from "../reth-pipeline/fileTree";
import { RETH_PIPELINE_PROJECT_META, rethPipelineCodeRefs } from "../reth-pipeline/modernCodeRefs";
import RethPipelineLocator, { RethPipelineMapReturn } from "../reth-pipeline/RethPipelineLocator";
import RethPipelineValidationViz from "./viz/RethPipelineValidationViz";

const LABEL = ({ children }: { children: ReactNode }) => <span className="mr-2 inline-block border border-primary/40 px-1.5 py-0.5 align-middle text-[9px] font-black text-primary">{children}</span>;

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethPipelineLocator current="reth-pipeline-validation" />
        <div><p className="text-xs font-bold text-primary">실무 글 · 개념을 운영 판단으로 연결하기</p><h2 className="mt-2 break-keep text-3xl font-bold">Pipeline 변경은 중단 뒤 output과 checkpoint가 같은 범위를 가리키는지 먼저 검증합니다</h2></div>
        <RethPipelineValidationViz />
        <p className="text-lg leading-8"><LABEL>A</LABEL>이 글은 Reth Pipeline 변경을 운영에 바로 적용하라는 승인안이 아닙니다. 격리한 chain fixture에서 stage commit 경계와 invalid input, reorg를 재생하고 기준 구현과 같은 output, checkpoint와 state root로 복구되는지 확인하는 실험 계획입니다.</p>
      </section>

      <section id="environment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Release·stage set·저장 자료를 한 run manifest에 고정합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[45rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">영역</th><th className="px-3 py-3">고정할 값</th><th className="px-3 py-3">비교에서 맡는 역할</th></tr></thead><tbody>{[
          ["Binary", "Reth v2.8.1 · source d763342… · build features", "실제 Pipeline과 Stage 구현"],
          ["Pipeline", "stage set · thresholds · prune settings", "순서와 batch·unwind 한계"],
          ["Fixture", "block 100..250 · invalid variants · common ancestor 140", "old/new에 같은 입력"],
          ["Storage", "database·static files·storage mode snapshot", "재시작과 rollback 기준"],
          ["Runtime", "filesystem · CPU/RAM · cache · worker settings", "정확성 뒤 비용 비교"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><LABEL>O</LABEL>이 글은 Reth v2.8.1 tag와 commit <code>d763342fa185e4e90ee79dc65f6a5706168b0bcb</code>를 기준으로 합니다. 이전 v2.2.0 stage layout과 fault 결과를 현재 release의 결과로 재사용하지 않습니다.</p>
      </section>

      <section id="ownership" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Stage output과 checkpoint의 권위 있는 writer를 나눕니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[44rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">상태</th><th className="px-3 py-3">권위 있는 owner</th><th className="px-3 py-3">검증자</th></tr></thead><tbody>{[
          ["Stage output", "각 Stage implementation", "output digest·semantic oracle"],
          ["Stage checkpoint", "Pipeline runner·provider transaction", "checkpoint dependency audit"],
          ["Pipeline target", "sync controller·previous stage checkpoint", "event trace"],
          ["Unwind target", "reorg decision·pipeline", "common ancestor fixture"],
          ["Database commit", "RW provider", "restart·reopen parity"],
          ["채택 상태", "ADR·배포 파이프라인", "서비스 소유 팀"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p><LABEL>A</LABEL>실험용 collector는 checkpoint를 쓰지 않습니다. 별도의 복구 controller가 같은 checkpoint를 수정하게 두면 pipeline runner와 권한이 겹치므로, 관측과 복구 실행을 분리합니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("execute-commit", rethPipelineCodeRefs["execute-commit"])} /><span className="text-xs text-muted-foreground">권위 있는 write 경계 · pipeline/mod.rs L486–554</span></div>
      </section>

      <section id="baseline" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">오류 없는 기준 run에서 stage별 golden receipt를 만듭니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["입력", "block hash·range·fork"], ["Output", "table·file digest·row count"], ["진행", "before/after checkpoint"], ["검증", "receipts·state root·events"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>정상 완료 뒤 head 하나만 비교하지 않습니다. Stage별 input과 output 범위, checkpoint, state root를 함께 남겨 어디서 처음 달라졌는지 찾을 수 있어야 합니다. 이 receipt는 Reth가 기본 제공하는 단일 파일 형식이라는 주장이 아니라 실험에서 만들 증거 묶음입니다.</p>
      </section>

      <section id="experiment" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Commit 전후와 invalid suffix를 같은 fixture에서 재생합니다</h2>
        <ol className="not-prose grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-2">{[
          ["01 · Execute 전 종료", "Checkpoint 99에서 process를 끝내고 재시작이 100부터 시작하는지 확인합니다."],
          ["02 · Commit 전 종료", "Output과 checkpoint가 transaction 안에 있는 시점에 종료해 둘 다 공개되지 않는지 확인합니다."],
          ["03 · Commit 직후 종료", "Checkpoint 163과 output 100..163이 함께 남고 164부터 이어지는지 확인합니다."],
          ["04 · Invalid input", "Missing body, 잘못된 sender와 state-root mismatch가 첫 오류에서 downstream 진행을 멈추는지 봅니다."],
          ["05 · Reorg unwind", "250에서 140으로 역순 unwind하고 140 이후 stale output과 checkpoint가 남지 않는지 확인합니다."],
          ["06 · Prune limit", "되감기 자료가 prune된 경계에서 조용한 부분 복구 대신 명시적 실패가 나는지 검사합니다."],
        ].map(([title, body]) => <li key={title} className="bg-background p-4"><strong>{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></li>)}</ol>
        <p><LABEL>?</LABEL>Fault injection 위치와 종료 횟수, 허용 가능한 복구 시간은 대상 환경에서 정해야 합니다. 운영 노드에는 강제 종료나 database 손상을 주입하지 않습니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("unwind-order", rethPipelineCodeRefs["unwind-order"])} /><span className="text-xs text-muted-foreground">장애 주입 전에 고정할 unwind 경계 · L365–420</span><CodeViewButton onClick={() => sidebar.open("unwind-commit", rethPipelineCodeRefs["unwind-commit"])} /><span className="text-xs text-muted-foreground">되감기 commit 경계 · L420–463</span></div>
      </section>

      <section id="recovery" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Checkpoint와 output 범위가 다르면 sync를 격리합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{[
          ["발견", "range·root parity fail"], ["격리", "candidate sync 중지"], ["보존", "DB·checkpoint·logs"], ["복구", "snapshot 또는 이전 binary"], ["재진입", "전체 stage parity"],
        ].map(([title, body]) => <div key={title} className="bg-background p-3"><strong className="text-xs">{title}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>A</LABEL>Schema와 stage output 형식이 같다면 이전 binary와 검증한 snapshot으로 돌아갈 수 있습니다. Storage migration이나 prune 설정이 함께 바뀌었다면 binary rollback만으로는 충분하지 않습니다. 필요한 저장 자료와 설정을 함께 복원하거나 신뢰할 수 있는 chain source에서 해당 stage를 다시 구축합니다.</p>
      </section>

      <section id="metrics" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">정확성과 복구 뒤에만 속도와 비용을 비교합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">{[
          ["정합성", "output·checkpoint·root parity"], ["복구", "restart·unwind·rollback RTO"], ["처리", "stage별 blocks/s·catch-up lag"], ["자원", "CPU·RAM·read/write bytes"],
        ].map(([title, body]) => <div key={title} className="bg-background p-4"><strong className="text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p><LABEL>M</LABEL>현재 대상 장비에서 얻은 측정값은 없습니다. v2.8.1이나 candidate 변경이 더 빠르다는 결론도 아직 내리지 않습니다.</p>
      </section>

      <section id="decision" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">실험 전 상태는 proposed이며 mixed range 한 번으로 기각합니다</h2>
        <div className="not-prose border-y border-border py-4 text-sm leading-6"><p><strong>Status:</strong> proposed</p><p className="mt-2"><strong>채택 조건:</strong> 모든 종료·invalid input·unwind에서 stage output과 checkpoint, state root가 기준 구현과 같습니다. 이어서 rollback과 운영 SLO를 통과해야 합니다.</p><p className="mt-2"><strong>기각 조건:</strong> Checkpoint가 output보다 앞서거나, invalid suffix가 downstream에 남거나, safe rollback이 없습니다.</p><p className="mt-2"><strong>다시 검토할 조건:</strong> Reth release, stage set, storage version, prune 정책, filesystem 또는 workload가 바뀝니다.</p></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">공식 구현과 아직 없는 측정 결과를 분리합니다</h2>
        <CitationBlock source="Reth v2.8.1 · Pipeline runner" citeKey={1} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/stages/api/src/pipeline/mod.rs"><p><LABEL>O</LABEL>Stage target, execute 뒤 checkpoint 저장과 provider commit, 역순 unwind 경계를 확인했습니다.</p><p><LABEL>M</LABEL>대상 filesystem에서 commit 중단을 재생한 결과는 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Stage tests" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/stages/stages/tests/pipeline.rs"><p><LABEL>O</LABEL>공식 저장소가 포함한 Pipeline test의 범위와 fixture 구성을 확인할 출발점입니다.</p><p><b>범위:</b> 우리 장비의 process kill·filesystem·rollback 검증을 대신하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 release" citeKey={3} href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"><p><LABEL>O</LABEL>실험 대상으로 고정한 release입니다.</p><p><LABEL>?</LABEL>대상 노드의 실제 build, feature와 prune 설정은 run manifest에서 확인해야 합니다.</p></CitationBlock>
      </section>

      <RethPipelineMapReturn current="reth-pipeline-validation" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethPipelineCodeRefs} fileTrees={{ reth: rethPipelineTree }} projectMetas={RETH_PIPELINE_PROJECT_META} />
    </article>
  );
}
