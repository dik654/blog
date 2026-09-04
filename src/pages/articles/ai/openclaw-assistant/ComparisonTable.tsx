const OWNERSHIP = [
  {
    layer: "Channel adapter",
    owns: "Telegram·Slack event 정규화와 platform별 delivery",
    doesNotOwn: "model 선택과 conversation policy",
  },
  {
    layer: "Gateway",
    owns: "인증·allowlist·binding·session lookup·reply route",
    doesNotOwn: "model 내부 추론과 native tool 구현",
  },
  {
    layer: "Provider · model",
    owns: "인증·catalog와 이번 turn의 language model",
    doesNotOwn: "channel identity와 답장 목적지",
  },
  {
    layer: "Agent runtime · harness",
    owns: "준비된 prompt, model output, native tool call, finished turn",
    doesNotOwn: "Gateway의 channel delivery",
  },
  {
    layer: "Tool policy · sandbox",
    owns: "호출 가능 도구와 실행 위치의 경계",
    doesNotOwn: "사용자 인증이나 session key 생성",
  },
] as const;

export default function ComparisonTable() {
  return (
    <section className="not-prose my-10 min-w-0" aria-labelledby="ownership-title">
      <h3 id="ownership-title" className="text-xl font-semibold">
        책임표로 다시 확인하기
      </h3>
      <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted-foreground">
        이 표의 핵심은 기능 목록이 아니라 비소유 영역입니다. Telegram A의 요청을 처리한 model이 “Slack으로 답하라”고 생성해도 reply route는 그대로입니다.
        sandbox가 켜져 있어도 사용자 인증을 대신하지 않습니다.
      </p>
      <div className="mt-5 grid min-w-0 gap-3 lg:grid-cols-2">
        {OWNERSHIP.map((item) => (
          <article
            key={item.layer}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h4 className="break-words text-sm font-semibold">{item.layer}</h4>
            <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="font-semibold text-emerald-700 dark:text-emerald-300">
                  소유하는 것
                </dt>
                <dd className="mt-1 break-words text-muted-foreground">{item.owns}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold text-rose-700 dark:text-rose-300">
                  소유하지 않는 것
                </dt>
                <dd className="mt-1 break-words text-muted-foreground">{item.doesNotOwn}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
