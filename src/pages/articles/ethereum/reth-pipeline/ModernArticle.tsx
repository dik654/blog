import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import RethPipelineLocator, { RethPipelineMapReturn } from "./RethPipelineLocator";
import { rethPipelineTree } from "./fileTree";
import { RETH_PIPELINE_PROJECT_META, rethPipelineCodeRefs } from "./modernCodeRefs";
import RethPipelineViz from "./viz/RethPipelineViz";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <RethPipelineLocator current="reth-pipeline" />
        <div><p className="text-xs font-bold text-primary">이 글이 답할 질문</p><h2 className="mt-2 break-keep text-3xl font-bold">긴 과거 동기화를 중단하고 다시 시작해도 어떻게 같은 지점에서 이어갈까요?</h2></div>
        <RethPipelineViz />
        <p className="text-lg leading-8">설명용 상황은 과거 블록 100부터 250까지 채워야 하는 노드입니다. 현재 stage checkpoint는 99이고 한 번에 64개 블록까지 처리한다고 하겠습니다. 이 숫자는 실행 범위를 계산하기 위한 가정이며 실제 Reth 설정값이나 체인 높이가 아닙니다.</p>
        <p>Reth Pipeline은 동기화 전체를 하나의 긴 함수로 실행하지 않습니다. 입력을 확보하고, 실행에 필요한 자료를 파생하고, state commitment와 index를 만드는 stage로 나눕니다. 각 stage는 자신의 마지막 영속 지점에서 다시 시작하고, 잘못된 suffix는 소비자 stage부터 역순으로 되돌립니다.</p>
      </section>

      <section id="order" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">뒤 stage는 바로 앞 stage가 저장한 범위까지만 진행합니다</h2>
        <div className="not-prose overflow-x-auto border-y border-border"><table className="w-full min-w-[48rem] border-collapse text-left text-xs leading-5"><thead><tr className="text-muted-foreground"><th className="px-3 py-3">구간</th><th className="px-3 py-3">v2.8.1 기본 순서</th><th className="px-3 py-3">만드는 자료</th></tr></thead><tbody>{[
          ["입력 확보", "ERA1(선택) → Headers → Bodies", "검증한 header와 block body"],
          ["실행 파생", "Sender Recovery → Execution → sender pruning(선택)", "sender, state change, receipt"],
          ["상태 commitment", "Merkle unwind → Account Hashing → Storage Hashing → Merkle execute", "hashed state와 state root"],
          ["조회·보존", "Transaction Lookup → Storage History → Account History → Prune → Finish", "index, history와 완료 checkpoint"],
        ].map((row) => <tr key={row[0]} className="border-t border-border">{row.map((cell) => <td key={cell} className="px-3 py-3">{cell}</td>)}</tr>)}</tbody></table></div>
        <p>Pipeline runner는 첫 stage에 전체 target을 줍니다. 그다음 stage부터는 바로 앞 stage의 checkpoint를 target으로 사용합니다. 그래서 Headers가 250까지 끝났더라도 Bodies가 227이면 Senders는 227보다 멀리 갈 수 없습니다. Stage별 checkpoint가 다르다는 사실 자체는 오류가 아닙니다.</p>
        <p>Checkpoint는 consensus finality가 아닙니다. 그 stage가 해당 블록까지 자신의 output과 진행 상태를 영속화했다는 뜻입니다. Network에서 받은 head나 메모리 속 처리 위치도 checkpoint로 바꾸어 부르면 안 됩니다.</p>
      </section>

      <section id="batch" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Checkpoint 다음 블록부터 threshold만큼 처리합니다</h2>
        <div className="not-prose border-y border-border py-4"><div className="grid gap-3 sm:grid-cols-3">{[
          ["1차", "100..163", "checkpoint 99 + 64"], ["2차", "164..227", "checkpoint 163 + 64"], ["3차", "228..250", "target에서 종료"],
        ].map(([title, range, detail]) => <div key={title} className="border border-border p-4"><span className="text-[9px] font-bold text-muted-foreground">{title}</span><strong className="mt-2 block text-sm text-primary">{range}</strong><p className="mt-2 text-xs text-muted-foreground">{detail}</p></div>)}</div></div>
        <pre className="not-prose overflow-x-auto border-y border-border bg-muted/20 p-4 text-[11px] leading-5"><code>{`// 마지막으로 저장한 블록 다음에서 시작합니다.
start = checkpoint.block_number + 1

// 목표와 한 번의 처리 한도 중 가까운 지점을 고릅니다.
end = min(target, checkpoint.block_number + threshold)

// 예: c=99, t=250, threshold=64
range = 100..=163`}</code></pre>
        <p>Reth v2.8.1의 <code>ExecInput::next_block_range_with_threshold</code>가 이 계산을 수행합니다. Stage가 입력 부족이나 검증 오류를 만나면 계산한 end까지 무조건 진행하는 것이 아니라 오류를 반환하고 checkpoint를 전진시키지 않습니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("next-block-range", rethPipelineCodeRefs["next-block-range"])} /><span className="text-xs text-muted-foreground">stage.rs L74–84 · 실제 batch 범위 계산</span></div>
      </section>

      <section id="commit" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Output과 새 checkpoint를 같은 provider transaction에 저장합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">{[
          ["01", "RW provider 열기", "아직 외부에 공개되지 않은 transaction"], ["02", "stage.execute", "선택한 batch output 작성"], ["03", "save_stage_checkpoint", "실제 완료 block 기록"], ["04", "provider.commit", "Output과 checkpoint 함께 공개"],
        ].map(([step, title, body]) => <div key={step} className="bg-background p-4"><span className="text-[9px] font-bold text-primary">{step}</span><strong className="mt-2 block text-sm">{title}</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</div>
        <p>기존 글은 output을 먼저 commit하고 checkpoint marker를 나중에 쓰는 두 단계처럼 설명했습니다. 현재 pipeline runner는 stage output과 checkpoint를 같은 read-write provider transaction에 넣은 뒤 commit합니다. 따라서 정상 contract에서 둘 사이의 독립적인 공개 틈을 전제로 설명하면 안 됩니다.</p>
        <p><code>post_execute_commit</code>은 commit 뒤 호출되는 hook입니다. 이것을 durable checkpoint의 대체 owner로 사용하거나, hook 성공 여부가 이미 commit된 DB transaction을 되돌린다고 해석하지 않습니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("execute-commit", rethPipelineCodeRefs["execute-commit"])} /><span className="text-xs text-muted-foreground">pipeline/mod.rs L486–554 · target·execute·checkpoint·commit</span></div>
      </section>

      <section id="stage-api" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Stage trait은 준비·실행·되감기의 경계를 분리합니다</h2>
        <pre className="not-prose overflow-x-auto border-y border-border bg-muted/20 p-4 text-[11px] leading-5"><code>{`trait Stage<Provider> {
    // Stage checkpoint를 저장할 고유 ID입니다.
    fn id(&self) -> StageId;

    // 필요한 외부 입력이 준비될 때까지 poll합니다.
    fn poll_execute_ready(&mut self, cx: &mut Context<'_>, input: ExecInput);

    // Forward 범위를 처리하고 새 checkpoint를 반환합니다.
    fn execute(&mut self, provider: &Provider, input: ExecInput) -> ExecOutput;

    // 잘못된 suffix를 target까지 되돌립니다.
    fn unwind(&mut self, provider: &Provider, input: UnwindInput) -> UnwindOutput;
}`}</code></pre>
        <p>위 코드는 메서드 역할을 읽기 쉽게 축약했습니다. 실제 v2.8.1 trait에는 오류 형식과 ready 결과, commit 뒤 hook이 더 있습니다. 핵심은 stage가 DB commit 자체를 따로 소유하지 않는다는 점입니다. Stage는 provider에 output을 쓰고 새 checkpoint를 반환하며, pipeline runner가 checkpoint 저장과 transaction commit을 묶습니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("stage-contract", rethPipelineCodeRefs["stage-contract"])} /><span className="text-xs text-muted-foreground">stage.rs L241–308 · 실제 Stage trait</span></div>
      </section>

      <section id="unwind" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">되돌릴 때는 실행 순서의 반대로 140 이후를 지웁니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-5">{["Merkle", "Execution", "Senders", "Bodies", "Headers"].map((stage, index) => <div key={stage} className="bg-background p-3"><span className="text-[9px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</span><strong className="mt-2 block text-xs">{stage}</strong><p className="mt-2 text-[10px] leading-4 text-muted-foreground">checkpoint → 140</p></div>)}</div>
        <p>예를 들어 공통 조상이 140이면 먼저 derived state와 index를 소비하는 뒤 stage를 되돌립니다. Pipeline은 stage 목록을 역순으로 순회하고 각 stage의 <code>unwind</code> 결과를 저장한 뒤 provider transaction을 commit합니다. 한 번에 target까지 못 가는 stage는 같은 과정을 반복합니다.</p>
        <p>Prune 설정이 필요한 되감기 자료를 이미 제거했다면 무조건 140까지 내려갈 수 있는 것은 아닙니다. Pipeline은 unwind target을 prune checkpoint와 대조합니다. 이 한계는 별도 실무 글에서 fixture와 설정을 고정해 검증해야 합니다.</p>
        <div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={() => sidebar.open("unwind-order", rethPipelineCodeRefs["unwind-order"])} /><span className="text-xs text-muted-foreground">pipeline/mod.rs L365–420 · prune 확인과 역순 unwind</span><CodeViewButton onClick={() => sidebar.open("unwind-commit", rethPipelineCodeRefs["unwind-commit"])} /><span className="text-xs text-muted-foreground">pipeline/mod.rs L420–463 · checkpoint commit</span></div>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">설명은 Reth v2.8.1의 stage set과 pipeline runner에 고정했습니다</h2>
        <CitationBlock source="Reth v2.8.1 release" citeKey={1} href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1"><p><b>확인한 범위:</b> 이 글의 구현 기준 release입니다.</p><p><b>확대하지 않은 범위:</b> 현재 main branch나 대상 노드의 처리량을 뜻하지 않습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · default stage set" citeKey={2} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/stages/stages/src/sets.rs"><p><b>확인한 범위:</b> 기본 stage의 실제 추가 순서와 선택 stage입니다.</p><p><b>주의:</b> Feature와 prune 설정에 따라 일부 stage가 달라질 수 있습니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Pipeline runner" citeKey={3} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/stages/api/src/pipeline/mod.rs"><p><b>확인한 범위:</b> 앞 stage checkpoint를 target으로 삼는 규칙, execute 뒤 checkpoint 저장과 commit, 역순 unwind입니다.</p><p><b>확대하지 않은 범위:</b> 모든 filesystem·database failure에서 데이터 손실이 없다는 실측 근거가 아닙니다.</p></CitationBlock>
        <CitationBlock source="Reth v2.8.1 · Stage API" citeKey={4} href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/stages/api/src/stage.rs"><p><b>확인한 범위:</b> Stage ID, ready, execute, unwind와 commit 뒤 hook의 책임 경계입니다.</p><p><b>주의:</b> 본문의 trait은 학습용 축약이며 정확한 generic과 오류 형식은 링크의 원본을 따릅니다.</p></CitationBlock>
      </section>

      <section className="not-prose border-y border-border py-5" aria-labelledby="reth-pipeline-review"><p className="text-[10px] font-bold text-primary">그림 없이 다시 설명하기</p><h2 id="reth-pipeline-review" className="mt-2 text-xl font-bold">Checkpoint 99에서 250까지 가는 과정을 세 문장으로 추적해 보세요</h2><ol className="mt-4 grid gap-px bg-border p-px text-sm leading-6 md:grid-cols-3"><li className="bg-background p-4"><strong className="block text-xs text-primary">01 · 범위</strong><span className="mt-2 block">왜 첫 batch가 100..163일까요?</span></li><li className="bg-background p-4"><strong className="block text-xs text-primary">02 · 저장</strong><span className="mt-2 block">Output과 checkpoint는 언제 외부에 보일까요?</span></li><li className="bg-background p-4"><strong className="block text-xs text-primary">03 · 복구</strong><span className="mt-2 block">왜 reorg 때 뒤 stage부터 unwind할까요?</span></li></ol></section>

      <RethPipelineMapReturn current="reth-pipeline" />
      <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={rethPipelineCodeRefs} fileTrees={{ reth: rethPipelineTree }} projectMetas={RETH_PIPELINE_PROJECT_META} />
    </article>
  );
}
