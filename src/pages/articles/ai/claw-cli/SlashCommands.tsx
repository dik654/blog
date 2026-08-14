import SlashCommandViz from "./viz/SlashCommandViz";
import { CitationBlock } from "@/components/ui/citation";

const commandGroups = [
  {
    title: "안내와 관찰",
    commands: "/help · /status · /cost",
    description: "세션을 바꾸지 않고 현재 기능·상태·사용량을 보여줍니다.",
  },
  {
    title: "대화 수명주기",
    commands: "/compact · /fork · /clear · /exit",
    description: "문맥을 줄이거나 분기하고, 화면 또는 세션을 정리합니다.",
  },
  {
    title: "런타임 제어",
    commands: "/mode · /config · /mcp · /plugin",
    description:
      "권한과 연결 상태를 바꾸므로 더 강한 검증과 감사 로그가 필요합니다.",
  },
];

export default function SlashCommands() {
  return (
    <section id="slash-commands" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Slash command는 로컬 제어 계약이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Slash command는 채팅창 안에서 쓰지만 모델에게 보내는 프롬프트는
          아닙니다. 사용자가 <code>/compact</code>를 입력하면 CLI가 등록된
          핸들러를 찾아 현재 세션에 정해진 상태 전이를 적용합니다. 자연어 추론을
          거치지 않기 때문에 결과를 예측하고 테스트하기 쉬운 것이 핵심입니다.
        </p>

        <SlashCommandViz />

        <div id="paper-claw-command-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code command registry @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/commands/src/lib.rs"
            citeKey={2}
            type="code"
          >
            <p>
              <strong>문제:</strong> REPL 입력을 로컬 command identity·argument와
              model prompt로 나눕니다. <strong>기여:</strong> pinned source는
              SlashCommandSpec registry, alias·help metadata와 parser/handler surface를
              제공합니다. <strong>전제:</strong> commit과 interactive/resume mode를
              고정합니다. <strong>근거 범위:</strong> 등록된 metadata와 실제 parse
              branch입니다. <strong>일반화 금지:</strong> 모든 argument가 shell-like
              quote·escape grammar를 지원하거나 각 handler가 transaction이라는
              뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          명령 이름보다 효과를 먼저 분류한다
        </h3>
        <p>
          모든 명령을 같은 레지스트리에 넣을 수는 있지만 보안 계약까지 같아지는
          것은 아닙니다. 읽기 전용 명령은 즉시 실행해도 되지만 권한 모드나 외부
          연결을 바꾸는 명령은 현재 정책을 확인하고, 변경된 값을 지속할 범위와
          만료 시점을 분명히 해야 합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {commandGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-lg border border-border/70 bg-card p-4"
            >
              <h4 className="text-sm font-bold">{group.title}</h4>
              <code className="mt-2 block break-words text-xs text-primary">
                {group.commands}
              </code>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {group.description}
              </p>
            </section>
          ))}
        </div>
        <p>
          여기 적은 이름은 이 구현의 예시입니다. 제품마다 명령 집합은 달라도
          되지만, 관찰·세션 수명주기·런타임 제어처럼 효과를 나누는 기준은 유지할
          수 있습니다. <code>/compact</code>의 실제 문맥 축약 방식은
          <a href="/ai/claw-compaction"> compaction 글</a>에서, 권한 모드의
          의미는 <a href="/ai/claw-permissions">권한 모델 글</a>에서 각각 자세히
          다룹니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          파서와 레지스트리의 최소 계약
        </h3>
        <p>
          Pinned parser는 command name과 여러 argument를 주로
          <code>split_whitespace</code>와 <code>split_once</code>로 나눕니다. 따라서
          단순 subcommand에는 충분하지만 공백이 든 path나 JSON을 shell처럼 quote해
          복원하는 일반 parser라고 말할 수 없습니다. 각 command가 remainder를
          통째로 받는지 token 단위로 받는지 source와 fixture로 확인해야 합니다.
        </p>
        <p>
          더 넓은 argument를 지원하려면 quote·escape grammar를 명시하거나 JSON
          input mode를 별도로 두고, parse error에 위치를 포함해야 합니다. 조회
          단계에서는 canonical name과 alias 충돌을 startup에 거부하며, 도움말과
          completion은 같은 registry metadata에서 생성해야 문서와 실제 동작이
          어긋나지 않습니다. 이 문단은 pinned source의 구현 완료를 주장하는 것이
          아니라 안정적인 command contract의 선택 기준입니다.
        </p>
        <div className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["name · aliases", "충돌 없는 명령 identity"],
              ["arg schema", "인자·기본값·오류 위치"],
              ["effect · permission", "읽기·쓰기·연결·종료 효과"],
              ["execute → result", "메시지·상태 변경·UI 지시"],
            ].map(([name, description]) => (
              <div key={name} className="min-w-0 bg-background p-4">
                <code className="text-xs font-bold text-primary">{name}</code>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          실패를 세션 실패로 확대하지 않는다
        </h3>
        <p>
          오타로 입력한 명령은 후보를 제안한 뒤 현재 세션을 그대로 유지하면
          됩니다. 핸들러 내부 오류도 원칙적으로 해당 명령의 실패로 끝내되, 설정
          파일을 일부 기록한 뒤 실패했다면 원래 상태로 되돌리거나 부분 적용
          사실을 명시해야 합니다. 단순히 <code>Continue</code>와
          <code>Exit</code>만 반환하기보다 사용자 메시지, 상태 patch, 재렌더링
          지시를 분리한 결과 타입이 확장에 유리합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          커스텀 명령은 작은 플러그인으로 취급한다
        </h3>
        <p>
          프로젝트 디렉터리의 스크립트를 자동으로 slash command로 노출하면 팀
          워크플로우를 빠르게 공유할 수 있지만, 저장소를 checkout한 것만으로
          임의 코드가 신뢰되는 위험도 생깁니다. 따라서 manifest에 명령 이름,
          입력 schema, 필요한 권한을 선언하고 사용자가 신뢰한 프로젝트에서만
          활성화해야 합니다. 프로세스 격리와 버전 관리까지 필요해지면 이 기능은
          사실상 <a href="/ai/claw-plugin">플러그인 시스템</a>이므로 그쪽이
          소유하는 편이 중복을 줄입니다.
        </p>
      </div>
    </section>
  );
}
