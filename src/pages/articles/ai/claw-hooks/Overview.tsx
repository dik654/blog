const hookTypes = [
  [
    "PreToolUse",
    "실행 전",
    "검사 결과에 따라 허용·거부·사용자 확인으로 보낼 수 있습니다.",
  ],
  [
    "PostToolUse",
    "실행 후",
    "결과를 기록하거나 추가 검사를 수행하지만 이미 일어난 작업을 되돌리지는 못합니다.",
  ],
  [
    "UserPromptSubmit",
    "요청 제출 시",
    "사용자 요청을 검사하거나 필요한 컨텍스트를 덧붙입니다.",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Hook은 실행 흐름에 조직의 규칙을 연결한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          기본 권한 정책만으로 모든 팀의 요구를 미리 알 수는 없습니다. 어떤 팀은
          배포 명령 전에 티켓 번호를 확인해야 하고, 다른 팀은 파일 변경 결과를
          감사 시스템에 보내야 합니다. Hook은 코어 런타임을 수정하지 않고 이런
          검증과 자동화를 특정 이벤트 전후에 연결하는 확장 지점입니다.
        </p>
        <p>
          다만 hook 자체도 외부 코드를 실행하므로 안전장치로만 볼 수는 없습니다.
          신뢰하지 않은 스크립트에 tool input이나 환경 변수를 넘기면 새로운 유출
          경로가 생기므로, hook의 권한·timeout·출력 스키마도 본 실행과 같은
          수준으로 관리해야 합니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {hookTypes.map(([name, timing, description]) => (
          <div key={name} className="rounded-xl border bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <code className="text-sm font-semibold text-primary">{name}</code>
              <span className="text-xs text-muted-foreground">{timing}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          Matcher는 실행 범위를 좁힌다
        </h3>
        <p>
          모든 이벤트에서 모든 hook을 실행하면 지연이 늘고 예상하지 못한
          상호작용도 생깁니다. 따라서 도구 이름, 명령 패턴, 이벤트 종류처럼
          명시적인 matcher로 적용 범위를 좁혀야 합니다. 여러 hook이 함께 실행될
          때는 순서와 실패 정책도 계약에 포함해야 하며, 앞선 hook의 거부를 뒤의
          hook이 다시 허용하지 못하게 하는 편이 안전합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          JSON 프로토콜은 입력과 판정을 분리한다
        </h3>
        <p>
          런타임이 이벤트와 tool input을 구조화된 JSON으로 보내고 hook이
          <code>allow</code>, <code>deny</code>, <code>prompt</code> 같은 결과를
          반환하면, 셸의 종료 코드만으로 의미를 추측하지 않아도 됩니다. 파싱
          실패, timeout, 알 수 없는 결과는 보안 관련 pre-hook에서{" "}
          <em>fail-closed</em>로 처리해야 하며, 단순 로깅용 post-hook은 본
          작업을 막지 않도록 별도 정책을 둘 수 있습니다.
        </p>
        <p>
          다음에는 <strong>pre/post hook</strong>의 판정 순서를 확인한 뒤,
          <strong>shell execution</strong>에서 프로세스 격리와 데이터 전달
          방식을 살펴보면 됩니다. 마지막 <strong>permission override</strong>
          에서는 hook이 기본 권한을 넓힐 수 있는지, 예외를 어떻게 제한해야
          하는지 다룹니다.
        </p>
      </div>
    </section>
  );
}
