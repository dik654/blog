export default function HarnessChannels() {
  return (
    <section id="harness-channels" className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-normal text-slate-950">
        하네스와 채널: Codex도 하나의 오케스트레이터가 된다
      </h2>

      <p className="leading-8 text-slate-700">
        Context Manager의 흥미로운 지점은 내부 AgentLoop만 고집하지 않는다는 데
        있다. Codex 같은 외부 CLI 하네스도 같은 오케스트레이터 인터페이스 뒤에
        붙일 수 있다. 내부 루프는 function call로 도구를 실행하고, 외부 하네스는
        별도 프로세스로 뜨며 MCP를 통해 Context Manager 도구를 호출한다. 표면은
        다르지만 사용자는 같은 방식으로 작업을 시작한다.
      </p>

      <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-100">
{`interface Orchestrator {
  setup(): Promise<void>
  run(opts): Promise<Result>
}

InternalOrchestrator -> AgentLoop
ExternalOrchestrator -> codex / claude-code / future harness`}
      </pre>

      <p className="leading-8 text-slate-700">
        이 추상화의 가치는 두 번째 외부 하네스가 들어올 때 드러난다. CLI 입력,
        Telegram 메시지, 웹 UI 작업, 스케줄러 태스크가 모두 같은 core로 들어오면
        채널별 기능을 따로 만들 필요가 줄어든다. 채널 어댑터는 사용자와 시스템
        사이의 입출력 형식만 맞추고, 라우팅과 메모리와 권한은 core가 처리한다.
      </p>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-semibold text-slate-950">세션 핸드오프가 중요한 이유</h3>
        <p className="mt-2 leading-7 text-slate-700">
          외부 CLI는 매번 새 프로세스로 시작될 수 있다. 단순히 현재 프롬프트 한 줄만
          넘기면 어제의 디버깅 맥락을 잃는다. Context Manager는 최근 대화와 지식
          요약을 prompt 앞에 붙이고, 가능한 경우 외부 하네스의 resume 기능을 사용해
          세션 연속성을 유지한다. 내부에서 외부로, 다시 내부로 돌아와도 사용자의
          작업 흐름은 끊기지 않아야 한다.
        </p>
      </div>
    </section>
  );
}
