const contract = [
  ["Request", "메시지, tool schema, 모델 옵션을 공통 요청으로 표현합니다."],
  [
    "Stream",
    "공급자별 이벤트를 text·tool use·usage 같은 내부 chunk로 바꿉니다.",
  ],
  [
    "Error",
    "인증, rate limit, timeout, 잘못된 응답을 구분해 복구 판단에 전달합니다.",
  ],
  [
    "Usage",
    "입출력과 cache usage를 기록하되 비용은 현재 가격 정보와 분리합니다.",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        API client는 공급자 차이를 대화 런타임에서 숨긴다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모델 공급자마다 요청 필드, tool call 표현, 스트리밍 이벤트와 오류
          형식이 다릅니다. 이 차이가 conversation loop까지 새어 나오면 공급자를
          추가할 때마다 세션과 도구 실행 코드를 함께 바꿔야 합니다. Claw Code의
          API client 계층은 공통 요청과 스트림 이벤트를 정의하고 공급자별 변환을
          경계 안에 모읍니다.
        </p>
        <p>
          “OpenAI-compatible”이라는 이름도 모든 의미가 같다는 보장은 아닙니다.
          엔드포인트가 비슷해도 tool call delta, usage 보고 시점, 종료 이유가
          다를 수 있으므로 호환성은 실제 계약 테스트로 확인해야 합니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {contract.map(([title, description]) => (
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
          스트리밍은 텍스트 조각만 이어 붙이는 일이 아니다
        </h3>
        <p>
          한 응답에는 텍스트 delta, 여러 tool call의 이름과 인자 조각, usage,
          stop reason이 섞여 도착할 수 있습니다. client는 호출 식별자별로 인자를
          조립하고 완료 이벤트가 올 때만 실행 가능한 tool call로 확정해야
          합니다. 연결이 중간에 끊겼을 때 부분 응답을 성공으로 처리하지 않는
          것도 중요합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Prompt caching은 공급자 기능을 의식해야 한다
        </h3>
        <p>
          캐시 키와 적용 가능한 콘텐츠, usage 필드의 의미는 공급자마다 다릅니다.
          공통 인터페이스는 차이를 감추되 캐시가 항상 적중하거나 동일한 비용을
          보장하는 것처럼 추상화해서는 안 됩니다. 가격은 자주 바뀌므로 코드에
          적힌 고정 배율보다 공급자의 현재 문서와 실제 API usage를 기준으로
          계산해야 합니다.
        </p>
        <p>
          다음에는 <strong>Anthropic</strong>과{" "}
          <strong>OpenAI-compatible</strong>
          구현을 나란히 보며 요청·스트림 매핑을 비교하고, 마지막
          <strong>prompt cache</strong>에서 캐시 가능한 경계와 관측 지표를
          확인하면 됩니다.
        </p>
      </div>
    </section>
  );
}
