import { CitationBlock } from "@/components/ui/citation";
import CrateGraphViz from "./viz/CrateGraphViz";

const CRATE_ROLES = [
  {
    names: "rusty-claude-cli",
    role: "입력·출력과 composition root",
    scenario: "로그인 실패 요청을 받고 runtime, provider client, tool executor를 조립합니다.",
    mustNotOwn: "provider protocol이나 permission rule의 정본",
  },
  {
    names: "runtime",
    role: "turn과 session state",
    scenario: "message를 append하고 provider↔tool 왕복과 성공·실패 종료를 연결합니다.",
    mustNotOwn: "terminal rendering과 concrete file tool 구현",
  },
  {
    names: "api",
    role: "provider transport adapter",
    scenario: "HTTP request와 SSE를 typed response/event로 바꿉니다.",
    mustNotOwn: "login bug를 어떻게 고칠지와 tool 실행 승인",
  },
  {
    names: "tools · commands",
    role: "built-in capability와 dispatch",
    scenario: "read·search·edit·test 요청을 registry에서 찾고 structured result를 돌려줍니다.",
    mustNotOwn: "전체 conversation state와 최종 response",
  },
  {
    names: "plugins",
    role: "외부 capability 등록",
    scenario: "plugin tool metadata를 registry에 연결하되 built-in과 같은 schema·permission 경로를 사용합니다.",
    mustNotOwn: "host policy 우회와 session 직접 변경",
  },
  {
    names: "telemetry",
    role: "관측 artifact",
    scenario: "turn·provider·tool·test event를 상관관계 ID로 기록합니다.",
    mustNotOwn: "성공 여부를 바꾸는 제어 흐름",
  },
  {
    names: "mock-anthropic-service · compat-harness",
    role: "결정론적 test support",
    scenario: "고정 stream과 expected behavior를 재생해 주 실행 경로를 검사합니다.",
    mustNotOwn: "정본 Rust runtime의 dependency나 실제 provider truth",
  },
] as const;

export default function CrateMap() {
  return (
    <section id="crate-map" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Crate map은 폴더 목록이 아니라 책임과 의존 방향을 읽는 도구입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Rust의 crate는 독립적으로 compile되는 package 단위입니다. 하나의
          repository가 여러 crate를 묶으면 Cargo workspace가 되고, 각
          <code>Cargo.toml</code>의 dependency가 어느 package가 어느 interface를
          사용할 수 있는지 드러냅니다. 파일 이름만 훑는 것보다 state owner와
          dependency direction을 먼저 보면 수정의 영향 범위를 예측하기 쉽습니다.
        </p>
        <p>
          고정 사례에서 UI는 로그인 실패 요청을 받지만 agent loop를 직접 구현하지
          않습니다. CLI는 runtime을 구성하고, runtime은 session과 turn을 진행하며,
          API adapter는 provider stream을 해석합니다. Tool registry와 executor는
          허용된 file edit와 test만 수행합니다. 이 책임이 섞이면 같은 permission
          check나 session update가 여러 경로에 복제되어 한쪽에서 빠지기 쉽습니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <CrateGraphViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned snapshot을 일곱 책임 묶음으로 읽습니다</h3>
        <p>
          Repository에는 아래 묶음 밖의 <code>claw-analog</code>와
          <code>claw-rag-service</code> 같은 별도 surface도 있습니다. 그러나 모든
          crate를 로그인 버그 turn의 중심 경로처럼 그리면 핵심 dependency가
          흐려집니다. 먼저 fixed scenario에 직접 참여하는 package와 test-only
          package를 나누고, 필요할 때 주변 service로 넓혀 갑니다.
        </p>
      </div>

      <div className="not-prose my-7 min-w-0 space-y-3">
        {CRATE_ROLES.map((item) => (
          <article
            key={item.names}
            className="grid min-w-0 gap-4 rounded-lg border border-border/70 bg-background p-4 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.2fr)_minmax(0,1fr)]"
          >
            <div className="min-w-0">
              <p className="break-words font-mono text-xs font-semibold text-primary">{item.names}</p>
              <h3 className="mt-1 break-words text-sm font-semibold">{item.role}</h3>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">로그인 사례에서 하는 일</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.scenario}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">소유하면 안 되는 것</p>
              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">{item.mustNotOwn}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Dependency arrow는 호출 횟수가 아니라 compile-time 지식을 뜻합니다</h3>
        <p>
          이 글이 고정한 commit의 Cargo manifest에서 CLI는 <code>api</code>, <code>runtime</code>,
          <code>tools</code>, <code>commands</code>, <code>plugins</code>를 조립합니다.
          <code>tools</code>는 runtime contract를 사용하지만 runtime crate는 tools
          crate에 의존하지 않습니다. 이 방향 덕분에 runtime의 generic
          <code>ToolExecutor</code> contract를 실제 executor와 test double이
          각각 구현할 수 있습니다.
        </p>
        <p>
          “runtime이 tool을 호출한다”는 실행 순서와 “tools crate가 runtime type에
          의존한다”는 compile-time 방향은 반대처럼 보일 수 있습니다. 전자는
          control flow이고 후자는 source dependency입니다. Runtime이 concrete
          tool을 import하지 않고 interface를 호출하면 의존성 역전이 일어나며,
          test harness도 같은 interface를 끼울 수 있습니다.
        </p>
        <p>
          역방향 의존도 경계 위반을 찾는 신호입니다. Runtime이 CLI rendering
          type을 import하면 다른 UI가 중심 loop를 재사용하기 어렵고, provider나
          tool이 session store를 직접 갱신하면 state owner가 둘이 됩니다. 실제 실행
          crate가 parity harness의 fixture type을 import하는 경우도 test support가
          실제 실행 경로의 전제가 되므로 dependency direction을 다시 설계해야
          합니다.
        </p>

        <h3>고정 사례를 crate 경계에서 추적합니다</h3>
        <ol>
          <li><code>rusty-claude-cli</code>가 prompt, cwd, model, permission mode를 파싱해 composition root를 만듭니다.</li>
          <li><code>runtime</code>의 conversation/session 책임이 user message를 commit하고 다음 model request를 시작합니다.</li>
          <li><code>api</code>가 provider stream을 text와 tool-use event로 변환합니다.</li>
          <li><code>tools</code> registry가 read·edit·test capability와 schema를 찾고 host permission 경계를 통과시킵니다.</li>
          <li>Executor가 workspace diff와 deterministic test receipt를 반환하면 runtime이 이를 다음 observation으로 commit합니다.</li>
          <li>마지막 provider response를 CLI가 rendering하되, session의 정본 상태를 화면 문자열로 대체하지 않습니다.</li>
        </ol>
        <p>
          단계가 실패하면 owner도 달라집니다. 잘린 SSE JSON은 API/parser 문제이고,
          거부됐는데 file이 바뀌면 permission enforcement 문제이며, test가 실패했는데
          “완료”로 종료되면 runtime exit condition 문제입니다. Crate map은 이런
          진단 순서를 주는 지도이지 package 수가 많을수록 설계가 좋다는 순위표가
          아닙니다.
        </p>

        <h3>Registry, permission, executor는 연속되지만 같은 판정이 아닙니다</h3>
        <p>
          Registry discovery는 <code>edit_file</code>이라는 이름이 실제 등록됐는지와
          input이 schema에 맞는지를 확인합니다. 그다음 permission layer가 현재
          mode, user approval과 canonical target path를 보고 allow·deny·ask를
          결정합니다. <code>ask</code>라면 approval 전까지 run을 멈추고,
          <code>deny</code>라면 executor를 만들거나 process를 시작하거나 file handle을
          열어서는 안 됩니다. 오직 <code>allow</code>된 canonical operation만
          executor가 workspace 안에서 실행합니다.
        </p>
        <p>
          Executor의 typed result는 runtime으로 돌아가 session observation이 되지만,
          executor가 session을 직접 고치는 것은 아닙니다. Login test도 model의
          확신을 점수화하는 tool이 아니라 patch가 지정된 behavior를 만들었는지
          결정론적으로 확인하는 verifier입니다. Test 실패는 성공 response로
          바꾸지 않고 exit state와 evidence에 남깁니다.
        </p>

        <h3>변경되는 snapshot과 유지할 invariant를 나눕니다</h3>
        <p>
          Crate 이름과 개수, public type은 commit마다 바뀔 수 있습니다. 분석을
          갱신할 때는 version 또는 git SHA, Cargo dependency, public interface와
          state mutation path를 함께 기록해야 합니다. 반면 주 실행 경로가
          test harness에 의존하지 않고, denied tool이 executor에 도달하지 않으며,
          tool이 session을 몰래 수정하지 않는다는 조건은 regression test로 오래
          유지할 invariant입니다.
        </p>
      </div>

      <div
        id="paper-cargo-workspaces"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Cargo Workspaces</p>
        <CitationBlock
          source="The Cargo Book — Workspaces"
          citeKey={3}
          type="code"
          href="https://doc.rust-lang.org/cargo/reference/workspaces.html"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 여러 package가 한 repository에 있을 때 build·dependency·lockfile과 공통 설정을 어떻게 함께 관리하는지 구분할 기준이 필요합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Cargo workspace가 여러 member package를 한 단위로 관리하고 root manifest에서 member·resolver·공통 package·dependency 설정을 공유하는 방식을 정의합니다.</p>
            <p><strong>전제·조건:</strong> Rust/Cargo package graph의 공식 동작을 설명하며 application의 domain 책임은 각 repository가 별도로 설계해야 합니다.</p>
            <p><strong>근거 범위:</strong> crate, package, workspace와 manifest dependency를 compile-time 구조로 읽는 이 절의 기초 개념을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> Claw Code의 crate 이름·책임 grouping을 Cargo가 표준으로 정했거나 package를 많이 나누면 architecture가 좋아진다는 뜻은 아닙니다. Project-specific graph는 pinned repository source에서 다시 확인해야 합니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
