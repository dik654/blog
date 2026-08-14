import ReplLoopViz from "./viz/ReplLoopViz";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        CLI는 입력창이 아니라 런타임의 제어면이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          코딩 에이전트의 CLI를 단순한 채팅 입력창으로 보면 설계 책임을 놓치기
          쉽습니다. CLI는 세션을 시작하고, 로컬 제어 명령과 모델에 보낼
          프롬프트를 나누며, tool call과 권한 요청을 사용자에게 보여주는 실행
          인터페이스입니다. 따라서 대화형 REPL(Read-Eval-Print Loop)이면서
          런타임을 조작하는 control plane 역할도 맡습니다.
        </p>
        <p>
          이 글의 핵심 아이디어는 입력·실행 상태·표시를 한 덩어리로 만들지 않는
          것입니다. REPL은 한 줄을 반복해서 읽고(Read), 입력 종류를 판정해
          실행하고(Eval), 결과를 보여주는(Print) loop입니다. 여기서 slash
          command는 로컬 제어, 일반 프롬프트는 model turn, renderer는 구조화된
          event의 projection으로 분리해야 취소·재시도·CI 출력에서도 같은 의미를
          유지할 수 있습니다.
        </p>
        <p>
          구현 설명은 독립 공개 Claw Code commit <code>b71afdd…</code>의
          <code>commands</code>와 <code>rusty-claude-cli</code> source에 한정합니다.
          제안하는 reducer·inspect/plan/apply·atomic update가 source에 없으면
          현재 기능이 아니라 hardening contract로 표시합니다.
        </p>

        <div id="paper-claw-cli-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code CLI entry @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/rusty-claude-cli/src/main.rs"
            citeKey={1}
            type="code"
          >
            <p>
              <strong>문제:</strong> interactive REPL·one-shot command·session·provider
              event를 한 binary entry에서 조정합니다. <strong>기여:</strong> pinned
              source는 input dispatch와 runtime 연결, streaming 표시 경로를
              제공합니다. <strong>전제:</strong> commit·terminal mode·CLI args·config를
              고정합니다. <strong>근거 범위:</strong> 이 entry가 실제 호출하는
              command와 renderer입니다. <strong>일반화 금지:</strong> 모든 terminal,
              crash recovery, remote UI나 private product 내부구조의 보장은 아닙니다.
            </p>
          </CitationBlock>
        </div>

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
          한 turn의 최소 receipt에는 input kind, session·turn ID, command 또는
          prompt identity, event sequence, tool/permission terminal state, exit code와
          output mode가 들어갑니다. 이 receipt를 기준으로 TTY와 JSONL을 비교하면
          색상이나 줄바꿈 차이를 무시하면서도 실행 의미가 사라지지 않았는지 확인할
          수 있습니다.
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
