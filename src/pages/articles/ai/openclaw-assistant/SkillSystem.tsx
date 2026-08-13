import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";

const SKILL_PIPELINE = [
  ["Discover", "workspace·project·personal·managed·bundled·plugin 위치에서 후보 탐색"],
  ["Resolve precedence", "workspace → project-agent → personal → managed → bundled → extra/plugin 순서"],
  ["Eligibility", "OS, binary, env, configuration 조건을 만족하는지 판정"],
  ["Prompt snapshot", "session 시작 때 적격 skill의 이름·설명을 compact 목록으로 고정"],
  ["Progressive disclosure", "model이 필요할 때 SKILL.md와 연결 자료를 읽고 tool을 사용"],
] as const;

export default function SkillSystem({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold">
        skill은 실행 파일 목록이 아니라 context loading 규칙입니다
      </h3>
      <p>
        SKILL.md는 model에게 특정 작업을 언제, 어떤 순서로, 어떤 tool을 사용해
        수행할지 알려 주는 markdown 지침입니다. OpenClaw는 session 시작 때 적격
        후보의 compact 목록을 prompt snapshot으로 만들고 후속 turn에서
        재사용합니다. watcher·configuration·node 상태로 후보가 달라지면 다음
        turn에 snapshot을 새로 고치며, 선택된 skill의 상세 지침은 필요할 때
        읽습니다. 자세한
        구조는 <Link to="/ai/skills-anatomy">Skills anatomy</Link>에서 이어집니다.
      </p>

      <ol className="not-prose my-6 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SKILL_PIPELINE.map(([title, body], index) => (
          <li
            key={title}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <p className="text-xs font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 break-words text-sm font-semibold">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ol>

      <p>
        여기서 allowlist의 의미를 구분해야 합니다. skill 후보를 걸러 prompt에
        보이지 않게 하는 설정은 유용한 제어 수단이지만 host shell authorization을
        대신하지 않습니다. third-party skill은 untrusted code와 지침으로
        취급하고, 실제 tool 호출은 별도의 tool policy와 sandbox 경계를 통과시켜야
        합니다. 또한 host 환경 변수를 잠시 주입하는 skill 설정이 sandbox 내부에
        자동으로 secret을 전달한다는 뜻도 아닙니다.
      </p>

      <div className="not-prose my-6 min-w-0 rounded-lg border border-border/70 bg-muted/20 p-4">
        <h4 className="text-sm font-semibold">Resource discovery는 skill 하나보다 넓습니다</h4>
        <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
          현재 runtime generation은 extension·skill·prompt·theme 같은 resource를
          하나의 snapshot으로 준비합니다. package는 <code>package.json</code>의
          <code>openclaw.extensions</code>, <code>skills</code>, <code>prompts</code>,
          <code>themes</code>에 상대 경로나 glob을 선언할 수 있고, 선언하지 않은
          종류는 conventional directory를 탐색할 수 있습니다. workspace skill은
          project·personal·managed·bundled source와 precedence를 비교한 뒤
          eligibility를 통과해야 prompt 후보가 됩니다.
        </p>
        <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground">tool</strong>은 실행 capability,
          <strong className="text-foreground"> skill</strong>은 workflow 지침,
          <strong className="text-foreground"> plugin</strong>은 runtime·tool·resource를
          등록할 수 있는 trusted in-process code입니다. prompt와 theme는 표현
          resource일 뿐 실행 권한을 만들지 않습니다. 발견된 source, 선택된
          version, eligibility 이유를 trace에 남겨야 update 전후를 비교할 수
          있습니다.
        </p>
      </div>

      <div
        id="paper-openclaw-skills"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Skills
        </p>
        <CitationBlock
          source="OpenClaw Docs — Skills"
          citeKey={6}
          type="paper"
          href="https://docs.openclaw.ai/tools/skills"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 도구 사용 지침과 참고 자료를 모두 system prompt에 넣으면 context가 커지고, 어떤 skill이 실제 환경에서 실행 가능한지 알기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> SKILL.md를 여러 scope에서 발견하고 precedence와 eligibility를 적용한 뒤 compact 목록을 run의 prompt snapshot에 넣습니다.</p>
            <p><strong>전제·조건:</strong> skill이 요구하는 binary·environment·configuration을 host와 sandbox 각각에서 확인해야 하며, third-party skill은 신뢰하지 않은 코드로 검토해야 합니다.</p>
            <p><strong>근거 범위:</strong> skill discovery, precedence, eligibility, system prompt 주입과 session snapshot 갱신의 현재 동작을 설명하는 공식 근거입니다.</p>
            <p><strong>비주장:</strong> skill allowlist가 tool policy, shell 승인, sandbox, secret boundary를 대신한다는 주장은 하지 않습니다.</p>
          </div>
        </CitationBlock>
      </div>
    </>
  );
}
