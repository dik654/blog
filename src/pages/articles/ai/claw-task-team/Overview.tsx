const packetParts = [
  ["Goal", "무엇이 달라져야 하는지 결과 중심으로 적습니다."],
  ["Scope", "읽고 바꿀 수 있는 저장소·경로·서비스 범위를 정합니다."],
  [
    "Constraints",
    "건드리면 안 되는 파일, 시간, 권한과 호환성 조건을 남깁니다.",
  ],
  ["Acceptance", "테스트, 명령, 관측값처럼 완료를 판정할 기준을 적습니다."],
  ["Ownership", "담당 worker와 팀, 생성자, 의존 작업을 연결합니다."],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        TaskPacket은 작업 지시를 검증 가능한 계약으로 바꾼다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “로그인 버그를 고쳐줘” 같은 요청만 worker에게 넘기면 어디까지 수정해도
          되는지, 무엇을 통과해야 완료인지 알기 어렵습니다. Claw Code의
          <code>TaskPacket</code>은 목표, 범위, 제약, 완료 조건과 소유권을 한
          작업 명세로 묶어 Task 도구, 팀, 스케줄러가 같은 기준을 공유하게
          합니다.
        </p>
        <p>
          <code>TaskPacket</code>이라는 이름과 세부 enum은 이 저장소의 내부
          모델입니다. 업계 표준 용어로 외우기보다, 자연어 작업을 상태 머신과
          검증 루프가 읽을 수 있는 구조로 바꾼다는 역할을 보면 됩니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 lg:grid-cols-5">
        {packetParts.map(([title, description]) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <code className="text-sm font-semibold text-primary">{title}</code>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          Goal과 acceptance criteria는 다른 질문에 답한다
        </h3>
        <p>
          Goal은 원하는 결과를 설명하고, acceptance criteria는 그 결과를 어떻게
          확인할지 정합니다. “인증 로직을 미들웨어로 분리한다”가 목표라면 특정
          테스트 통과, 공개 API 호환성 유지, 금지된 파일 미변경이 완료 조건이 될
          수 있습니다. 완료 조건은 가능한 한 명령이나 파일 diff처럼 결정론적으로
          확인할 수 있어야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Registry와 Team은 작업의 소유권을 관리한다
        </h3>
        <p>
          registry는 작업 ID, 상태, 의존성과 결과를 추적하고, team은 여러
          worker의 역할과 전달 경계를 관리합니다. Cron은 같은 작업을 반복
          생성하는 것이므로 중복 실행과 이전 실행 미완료 상태를 확인해야 합니다.
          어느 경로로 생성되든 같은 validation을 통과해야 제약 없는 작업이 우회
          등록되는 일을 막을 수 있습니다.
        </p>
        <p>
          다음에는 <strong>registry</strong>에서 상태와 의존성 갱신을,
          <strong>team·cron</strong>에서 담당자 배정과 반복 실행을 확인합니다.
          마지막
          <strong>validation</strong>은 작업 시작 전과 완료 판정 시 어떤
          불변식을 검사해야 하는지 다룹니다.
        </p>
      </div>
    </section>
  );
}
