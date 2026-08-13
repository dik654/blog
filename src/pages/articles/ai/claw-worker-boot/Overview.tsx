const states = [
  ["Launching", "프로세스와 통신 채널을 준비합니다."],
  ["TrustResolving", "실행 주체와 작업 경계를 확인합니다."],
  ["Ready", "검증을 마치고 작업을 받을 수 있습니다."],
  ["Working", "할당된 작업을 수행하고 이벤트를 보냅니다."],
  ["WaitingInput", "추가 입력이 필요해 실행을 잠시 멈춥니다."],
  ["Completed / Failed", "결과나 실패 원인을 남기고 실행을 끝냅니다."],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Worker는 시작됐다고 곧바로 신뢰할 수 없다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서브에이전트나 외부 작업 프로세스를 실행하면 프로세스 ID 하나만으로는
          작업을 맡길 준비가 됐는지 알 수 없습니다. 통신 채널이 열렸는지, 예상한
          워크스페이스와 권한으로 동작하는지, 초기 상태 보고를 정상적으로
          보냈는지 확인한 뒤에야 스케줄러가 작업을 전달할 수 있습니다.
        </p>
        <p>
          Claw Code의 worker 상태 머신은 이 부팅 과정을 명시적인 단계로
          나눕니다. 분석한 스냅샷의 정확한 enum과 전이 수는 바뀔 수 있지만,
          준비되지 않은 worker를 <code>Ready</code>로 취급하지 않는 것이
          핵심입니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {states.map(([state, description], index) => (
          <div key={state} className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <code className="text-sm font-semibold">{state}</code>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          상태 전이는 운영 불변식을 코드로 만든다
        </h3>
        <p>
          상태 머신의 목적은 화면에 진행 단계를 보여주는 데 그치지 않습니다.
          <code>Launching</code>에서 바로 작업을 수행하거나 종료된 worker에 새
          작업을 보내는 잘못된 경로를 거부해, “검증된 worker만 작업을 받는다”는
          불변식을 강제합니다. 전이가 일어날 때 이벤트를 남기면 어느 단계에서
          멈췄는지도 재현할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          신뢰 판정과 관측은 서로 다른 문제다
        </h3>
        <p>
          trust resolver는 worker의 출처·설정·권한을 기준으로 작업 가능 여부를
          판정하고, observe 단계는 부팅 중 실제로 들어오는 신호를 해석합니다.
          설정이 올바르더라도 기대한 worker가 아닌 프로세스가 응답하거나, 이전
          실행의 메시지가 늦게 도착하는 misdelivery가 생길 수 있으므로 식별자와
          세대 번호를 함께 검증해야 합니다.
        </p>
        <p>
          다음에는 <strong>trust resolver</strong>에서 신뢰 기준을,{" "}
          <strong>observe</strong>
          에서 준비 신호와 timeout을 살펴본 뒤, <strong>misdelivery</strong>에서
          잘못된 worker로 메시지가 전달되는 경우를 확인하면 됩니다.
        </p>
      </div>
    </section>
  );
}
