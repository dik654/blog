import SystemPromptViz from "./viz/SystemPromptViz";
import { LayerViz, GuardViz } from "./viz/SystemPromptDetailViz";

export default function SystemPrompt() {
  return (
    <section id="system-prompt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시스템 프롬프트는 공통 규칙을 둔다</h2>
      <div className="not-prose mb-8">
        <SystemPromptViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시스템 프롬프트는 여러 요청에 공통으로 적용할 역할, 행동 범위와 출력
          원칙을 둡니다. 실제 메시지 우선순위와 명칭은 provider API에 따라
          다르지만, 사용자의 매 요청에 같은 규칙을 반복하지 않도록 상위 지침을
          분리한다는 목적은 같습니다. 반면 현재 작업의 데이터나 수시로 바뀌는
          업무 지식은 시스템 프롬프트에 고정하기보다 검색하거나 tool로 가져오는
          편이 관리하기 쉽습니다.
        </p>
        <p>
          Role → Context → Task → Rules → Format은 내용을 빠뜨리지 않기 위한
          유용한 점검 틀이지 업계 표준 5단계는 아닙니다. 짧은 서비스라면 역할과
          금지 범위만으로 충분할 수 있고, 복잡한 에이전트라면 tool 사용 규칙,
          완료 조건과 실패 시 행동이 더 필요합니다. 중요한 것은 각 규칙의
          우선순위가 서로 충돌하지 않고 실제 평가 항목과 연결되는 것입니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">구성 요소를 나누어 본다</h3>
        <div className="not-prose mb-6">
          <LayerViz />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Guardrail은 프롬프트만으로 완성되지 않는다
        </h3>
        <div className="not-prose mb-6">
          <GuardViz />
        </div>
        <p className="leading-7">
          프롬프트는 모델이 어떤 선택을 해야 하는지 설명하지만, 실행 권한을
          강제하지는 못합니다. 개인정보 마스킹, 허용된 tool 목록, schema
          validation, 승인과 audit log처럼 반드시 지켜야 할 규칙은 application
          layer에서 함께 적용해야 합니다. 시스템 프롬프트를 보안 경계가 아니라
          정책을 전달하는 한 계층으로 보면 책임이 분명해집니다.
        </p>
      </div>
    </section>
  );
}
