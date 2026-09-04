import ObserveViz from "./viz/ObserveViz";

const signals = [
  {
    title: "Process",
    body: "PID 생존, exit status와 signal을 authoritative signal로 사용합니다.",
  },
  {
    title: "Protocol",
    body: "가능하면 ready·progress·result를 structured event로 받습니다.",
  },
  {
    title: "Terminal",
    body: "protocol이 없는 CLI에서는 PTY output을 보조 signal로 해석합니다.",
  },
] as const;

export default function Observe() {
  return (
    <section id="observe" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Worker 상태는 process·protocol·terminal 신호를 합쳐 판단한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          외부 CLI를 worker로 재사용하면 내부 상태 API가 없을 수 있습니다. 이때 pseudo-terminal(PTY)의 화면을 읽어 prompt나 error를 추정할 수 있지만
          화면 문구는 버전과 locale, theme에 따라 달라지므로 authoritative state로 쓰기에는 약합니다.
        </p>
        <p className="leading-7">
          observer는 하나의 문자열 패턴으로 상태를 덮어쓰기보다 process
          lifecycle, structured event와 terminal hint를 우선순위에 따라
          합칩니다. 확신이 없는 관찰은 <code>Unknown</code>으로 남기고 자동
          완료나 입력 전송으로 연결하지 않는 것이 안전합니다.
        </p>

        <div className="not-prose my-8">
          <ObserveViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {signals.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          PTY snapshot은 원문과 파생 상태를 함께 남긴다
        </h3>
        <p className="leading-7">
          terminal adapter는 최근 output을 bounded buffer에 보관하고 ANSI escape와 screen update를 해석합니다. 단순히 마지막 열 줄을
          자르면 progress UI나 carriage return으로 갱신된 화면을 잘못 읽습니다. 가능하면 terminal emulator가 만든 logical screen과 raw
          event 둘 다 보관합니다.
        </p>
        <p className="leading-7">
          관찰 결과에는 inferred status와 confidence, 근거가 된 pattern, snapshot reference를 넣습니다. secret과 command
          output이 포함될 수 있으므로 저장 전 redaction과 retention limit도 필요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          polling 주기는 고정 숫자보다 상태에 맞춘다
        </h3>
        <p className="leading-7">
          launching과 input wait처럼 빠른 반응이 필요한 동안은 짧게 polling하고 장시간 build에서는 event-driven process notification이나
          느린 interval로 전환합니다. worker마다 별도 tight loop를 만드는 대신 하나의 supervisor가 timer와 process event를 관리하면 worker
          수가 늘어도 안정적입니다.
        </p>
        <p className="leading-7">
          timeout은 “화면이 변하지 않았다” 하나로 판단하지 않습니다. process CPU와 child activity, protocol heartbeat를 함께 봅니다. 종료할
          때는 process tree와 terminal handle을 정리합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          관찰 불일치는 state correction보다 진단이 먼저다
        </h3>
        <p className="leading-7">
          runtime은 <code>Working</code>인데 화면에 shell prompt가 보인다고 바로
          <code>Completed</code>로 바꾸면, command가 실패해 shell로 돌아온
          상황을 성공으로 오판할 수 있습니다. mismatch를 event로 기록하고 exit
          status, task ID와 result artifact를 확인한 뒤 terminal state를
          결정합니다.
        </p>
        <p className="leading-7">
          제어 가능한 worker에는 JSON event나 local IPC처럼 명시적인 protocol을 우선합니다. PTY 관찰은 기존 CLI를 통합하기 위한 compatibility
          adapter로 남기고 pattern마다 fixture와 버전 범위를 관리하는 것이 좋습니다.
        </p>
      </div>
    </section>
  );
}
