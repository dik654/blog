const evaluation = [
  [
    "상태 수집",
    "브랜치, 빌드, 테스트, 승인과 대기 사유를 현재 컨텍스트로 만듭니다.",
  ],
  ["규칙 매칭", "현재 작업 상태에 적용되는 조건만 평가합니다."],
  ["품질 게이트", "완료·병합 전에 필요한 검증 결과가 모두 있는지 확인합니다."],
  ["동작 실행", "상태 전이, 재시도, 중단, 알림처럼 허용된 동작만 수행합니다."],
  ["이력 기록", "어떤 규칙이 어떤 근거로 발동했는지 남깁니다."],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Policy engine은 자율 작업에 결정론적인 경계를 넣는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          에이전트가 오래 작업하면 “테스트가 끝났으니 병합할지”, “같은 실패를 다시 시도할지”, “사람에게 넘길지”를 몇 번이고 판단해야 합니다. 이런 운영 규칙까지 매번 모델의 자연어
          판단에 맡기면 같은 상태에서도 결과가 달라질 수 있습니다. Policy engine은 관측된 상태와 명시적 규칙을 바탕으로 다음 동작을 결정합니다.
        </p>
        <p>
          이 구현의 <code>Lane</code>은 브랜치·워크스페이스·작업을 묶은 병렬
          작업 단위이고, <code>GreenContract</code>는 완료 전에 통과해야 할 품질
          게이트를 가리키는 내부 코드 이름입니다. 업계 표준 용어로
          일반화하기보다 이 저장소에서 어떤 책임을 맡는지 기준으로 읽어야
          합니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 lg:grid-cols-5">
        {evaluation.map(([title, description], index) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <span className="text-xs font-bold text-primary">{index + 1}</span>
            <strong className="mt-2 block text-sm">{title}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          Rule은 condition과 action을 분리한다
        </h3>
        <p>
          “빌드와 테스트가 성공하면 병합 가능 상태로 이동한다”는 규칙은 관측 가능한 조건과 허용된 동작으로 나눌 수 있습니다. 평가 시점의 상태를 고정한 뒤 조건을 검사합니다. 동작을
          수행하는 동안 상태가 바뀌었다면 같은 규칙을 다시 검증해야 합니다. 주기적 평가에서는 같은 이벤트가 여러 번 들어와도 결과가 망가지지 않도록 action을 idempotent하게
          만드는 것이 중요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          품질 게이트는 “완료했다”는 모델 주장과 다르다
        </h3>
        <p>
          테스트 통과, 변경 파일 범위, 필수 리뷰처럼 기계적으로 확인할 수 있는
          결과를 품질 게이트로 두면 에이전트의 자기 보고와 실제 상태를 구분할 수
          있습니다. 검사 결과가 없거나 오래된 경우에는 통과로 간주하지 않는
          <em>fail-closed</em> 정책이 필요하고, 자동 병합처럼 되돌리기 어려운
          동작은 별도 승인이나 더 강한 검증을 요구해야 합니다.
        </p>
        <p>
          다음에는 <strong>rules</strong>에서 조건과 우선순위를,{" "}
          <strong>lane context</strong>에서 평가 입력의 스냅샷을 확인하면
          됩니다. 마지막
          <strong>GreenContract</strong>는 내부 이름 자체보다 완료 판정에 필요한
          검증 결과를 어떻게 묶는지에 초점을 맞춥니다.
        </p>
      </div>
    </section>
  );
}
