import { CitationBlock } from "@/components/ui/citation";
import ParityFlowViz from "./viz/ParityFlowViz";
import PythonSubsystemsViz from "./viz/PythonSubsystemsViz";

const COMPARISON_SURFACES = [
  ["Request", "같은 login fixture, workspace snapshot, model/tool catalog와 permission mode"],
  ["Trace", "정규화한 provider event, tool name·input, permission outcome와 call order"],
  ["State", "turn 전후 session message와 exit state; 내부 class layout은 제외"],
  ["Effect", "workspace diff, test exit code·stdout와 실패 시 side effect 부재"],
  ["Reply", "근거 artifact와 성공·실패 의미; 문장 byte 일치는 보통 제외"],
] as const;

export default function PythonLayer() {
  return (
    <section id="python-layer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Python reference는 비교용 oracle 후보이지 실행 경로의 자동 정본이 아닙니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Oracle은 test에서 “이 입력의 기대 결과는 이것이다”라고 판정하는 기준을
          뜻합니다. Claw Code root의 <code>src/</code>에는 Python companion/reference
          code와 audit helper가 남아 있지만, repository는 현재 구현 정본을
          <code>rust/</code>라고 밝힙니다. 따라서 Python output을 보았다는
          이유만으로 Rust가 무조건 따라야 하는 명세가 되지는 않습니다.
        </p>
        <p>
          Reference가 유용한 이유는 같은 login bug fixture를 더 독립적인 경로로
          실행해 Rust port가 놓친 behavior를 찾을 수 있기 때문입니다. 그러나 두
          구현이 같은 public behavior를 추정해 만들었다면 같은 오해를 공유할 수도
          있습니다. 어떤 field를 비교하고 어느 쪽을 oracle로 받아들일지는 test
          작성자가 public contract와 product intent를 바탕으로 먼저 정해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <ParityFlowViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>내부 class가 아니라 관찰 가능한 contract를 비교합니다</h3>
        <p>
          Python의 <code>QueryEngine</code> class와 Rust의
          <code>ConversationRuntime</code> type을 1:1로 맞추면 언어별 구현 선택까지
          고정됩니다. 대신 사용자가 관찰하거나 다음 component가 소비하는 request,
          event, permission decision, state transition, file effect와 result를
          비교합니다. 자료구조가 달라도 같은 의미와 side effect를 만들면 contract
          수준에서는 parity일 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 min-w-0 space-y-3">
        {COMPARISON_SURFACES.map(([surface, contract]) => (
          <article key={surface} className="grid min-w-0 gap-3 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <h3 className="break-words text-sm font-semibold text-primary">{surface}</h3>
            <p className="min-w-0 break-words text-xs leading-5 text-muted-foreground">{contract}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>로그인 실패 사례를 paired fixture로 만듭니다</h3>
        <ol>
          <li>동일한 repository snapshot에 실패하는 login test와 수정 전 file hash를 준비합니다.</li>
          <li>같은 user request, tool catalog와 permission mode를 Python과 Rust 경로에 입력합니다.</li>
          <li>시간, UUID, temp path처럼 의미가 없는 차이는 canonicalization rule로 정규화합니다.</li>
          <li>tool call 순서, deny·allow 판정, 최종 diff와 test receipt를 비교합니다.</li>
          <li>mismatch가 나면 한쪽 expected output을 바로 덮지 않고 contract owner가 원인을 분류합니다.</li>
        </ol>
        <p>
          Canonicalization은 다른 값을 억지로 같게 만드는 작업이 아닙니다. 매번
          달라지는 UUID와 timestamp는 각각 <code>$RUN_ID</code>와
          <code>$TIME</code>으로 바꾸고, 임시 workspace의 절대 경로는
          <code>$WORKSPACE</code>로 치환할 수 있습니다. Windows의 역슬래시와
          Unix의 슬래시는 같은 논리 경로로 통일하고, 의미상 순서가 없는 map은
          key를 정렬한 뒤 비교합니다. 그러나 허용된 경로와 workspace 밖 경로를
          모두 같은 문자열로 지우거나 tool call 순서를 정렬하면 보안·제어 흐름의
          차이가 사라집니다. Normalizer 자체도 version과 test가 필요한 verifier
          component입니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <PythonSubsystemsViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Mock I/O가 보여 주는 것과 보이지 않는 것을 나눕니다</h3>
        <p>
          In-memory file map이나 scripted shell을 쓰면 login file의 초기 내용,
          edit 결과와 test exit code를 매번 똑같이 만들 수 있습니다. 이 방식은
          denied edit가 실제 mutation을 만들지 않는지, test failure가 완료 상태로
          바뀌지 않는지 같은 control-flow invariant를 빠르게 검사합니다.
        </p>
        <p>
          반면 symlink resolution, filesystem permission, process signal, locale,
          shell quoting과 network timeout은 실제 운영체제에서 달라집니다. 이런
          위험은 temp repository integration test와 sandboxed end-to-end test로
          넘겨야 합니다. “Python reference와 같았다”는 결과만으로 host security나
          실제 provider compatibility를 인증할 수 없습니다.
        </p>

        <h3>Mismatch는 다섯 갈래로 분류합니다</h3>
        <ul>
          <li><strong>Fixture drift:</strong> 두 실행의 input·workspace·tool catalog가 처음부터 달랐습니다.</li>
          <li><strong>Normalizer bug:</strong> 의미 있는 차이를 지우거나 비결정적 field를 남겼습니다.</li>
          <li><strong>Rust regression:</strong> 합의한 contract와 Rust observation이 다릅니다.</li>
          <li><strong>Reference defect:</strong> Python이 오래됐거나 public contract를 잘못 모델링했습니다.</li>
          <li><strong>Intentional change:</strong> contract 자체를 바꾸기로 했으며 migration과 새 evidence가 필요합니다.</li>
        </ul>
        <p>
          어느 경우든 expected snapshot만 새로 저장하고 끝내면 안 됩니다. 선택한
          근거, 두 implementation SHA, fixture·normalizer version과 review 결과를
          parity receipt에 남겨야 다음 차이가 regression인지 다시 판단할 수
          있습니다.
        </p>
      </div>

      <div
        id="paper-claw-python-reference"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Python companion/reference snapshot</p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned src/ snapshot"
          citeKey={4}
          type="code"
          href="https://github.com/ultraworkers/claw-code/tree/b71afddae100ced324457337925a694686b8fef2/src"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Rust port와 Python tree가 함께 있으면 어느 쪽이 project 구현 정본이고 어느 동작을 비교할 수 있는지 모호해집니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Pinned source tree는 Python query/runtime/permission/tool 관련 reference surface를 실제 code로 확인하고 Rust와 독립적으로 관찰 가능한 contract를 뽑게 합니다.</p>
            <p><strong>전제·조건:</strong> 지정한 commit의 companion/reference·audit workspace이며 각 file의 존재가 정확성이나 현재 실행 경로에서의 사용을 뜻하지 않습니다.</p>
            <p><strong>근거 범위:</strong> 이 절에서 Python을 비교 implementation으로 다룰 수 있는 source surface와 snapshot 경계를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> Python output이 자동 oracle이거나 원 Claude Code source이고, Rust와 내부 class·field까지 같아야 하며, mock parity가 semantic quality를 증명한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
