import ReplLoopViz from "./viz/ReplLoopViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        CLI는 입력창이 아니라 런타임의 제어면이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          코딩 에이전트의 CLI를 단순한 채팅 입력창으로 보면 설계 책임을 놓치기
          쉽습니다. CLI는 세션을 시작하고, 로컬 제어 명령과 모델에 보낼
          프롬프트를 나누며, tool call과 권한 요청을 사용자에게 보여주는 실행
          인터페이스입니다. 따라서 대화형 REPL(Read-Eval-Print Loop)이면서
          런타임을 조작하는 control plane 역할도 맡습니다.
        </p>

        <ReplLoopViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          먼저 입력의 의미가 아니라 실행 경계를 나눈다
        </h3>
        <p>
          <code>/help</code>, <code>/config</code>, <code>/exit</code> 같은
          slash command는 CLI가 문법과 효과를 알고 있는 로컬 명령입니다. 반면
          “테스트를 고쳐줘” 같은 일반 요청은 현재 세션 문맥과 함께 모델로
          보냅니다. 이 둘을 입력 직후 분리해야 제어 명령이 프롬프트로 섞이지
          않고, 모델 응답에 따라 종료나 설정 변경이 우연히 일어나는 문제도 막을
          수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          실행 코어와 표시 방식은 분리한다
        </h3>
        <p>
          같은 실행도 사람이 터미널에서 볼 때와 CI가 파이프로 받을 때 필요한
          출력이 다릅니다. 대화형 TTY에서는 text delta, tool 진행 상태, 권한
          요청을 읽기 쉽게 갱신할 수 있지만, 비대화형 환경에서는 ANSI 커서
          제어를 제거하고 순서가 보존된 JSONL 같은 형식을 제공해야 합니다. 실행
          이벤트를 먼저 구조화해 두면 두 표현 방식을 하나의 코어 위에 올릴 수
          있습니다.
        </p>
        <p>
          아래에서는 먼저 slash command의 로컬 실행 계약을 정리하고, 이어서
          스트리밍 이벤트를 터미널 화면으로 바꾸는 과정을 살펴봅니다. 마지막
          초기화 절에서는 새 프로젝트를 감지하되 기존 파일의 소유권을 침범하지
          않는 방법까지 연결합니다.
        </p>
      </div>
    </section>
  );
}
