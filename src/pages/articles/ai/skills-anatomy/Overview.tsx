import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Agent Skill은 반복 작업의 매뉴얼을 필요할 때만 꺼내 쓰는 형식이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          같은 종류의 pull request를 검토할 때마다 확인 순서, 실행할 test,
          결과 형식을 긴 프롬프트로 다시 설명하면 빠뜨리는 단계가 생기고
          context도 계속 늘어납니다. <strong>Agent Skill</strong>은 이 반복 가능한
          workflow를 instructions, references, assets와 선택적 script로 묶어 둔
          authoring format입니다. 요청과 맞는 순간에만 전체 지침을 읽기 때문에
          상시 system prompt를 무겁게 만들지 않고도 팀의 작업 방식을 재사용할 수
          있습니다.
        </p>
        <p>
          여기서 가장 먼저 구분할 것은 Tool·Skill·Plugin입니다. Tool은 파일을
          읽거나 API를 호출하는 <em>실행 capability</em>이고, Skill은 그 capability를
          언제 어떤 순서로 사용하고 무엇으로 완료를 검증할지 적은 workflow입니다.
          Plugin은 하나 이상의 Skill과 connector를 다른 사람이 설치할 수 있도록
          묶는 distribution package입니다. 세 용어는 성숙도 단계가 아니라 서로
          다른 책임을 가리킵니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          따라서 좋은 Skill의 질문은 “무슨 tool을 넣을까?”에서 시작하지 않습니다.
          먼저 반복되는 job과 적용하지 않을 경계를 정하고, 입력·산출물·검증·실패
          시 fallback을 적은 뒤, 결정적으로 반복할 부분에만 script를 둡니다. 실제
          tool 실행 권한은 Skill 밖의 runtime이 계속 검사합니다.
        </p>
        <ContentBoundary article="skills-anatomy" />

        <div id="paper-openai-build-skills" className="not-prose scroll-mt-24">
          <CitationBlock
            source="OpenAI — Build skills"
            citeKey={1}
            href="https://learn.chatgpt.com/docs/build-skills"
          >
            OpenAI의 현재 공식 문서는 Skill을 reusable workflow의 authoring
            format으로, Plugin을 설치 가능한 distribution package로 구분합니다.
            아래의 Codex 경로·초기 목록 budget·호출 방식은 2026년 8월 13일에
            확인한 제품 규약이며 모든 agent host의 보편 표준을 뜻하지 않습니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
