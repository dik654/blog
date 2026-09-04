import SessionStatsViz from "./viz/SessionStatsViz";

const spanRows = [
  [
    "Session",
    "session_id · started_at · privacy policy",
    "사용자 작업의 수명과 보존 경계",
  ],
  [
    "Turn",
    "turn_id · parent session · outcome",
    "한 요청에서 agent loop가 한 일",
  ],
  [
    "Model request",
    "provider · model · operation · response_id",
    "latency·usage·retry·finish reason",
  ],
  [
    "Tool call",
    "tool_call_id · tool name · effect · status",
    "승인부터 실행·검증까지의 경로",
  ],
];

export default function SessionTracer() {
  return (
    <section id="session-tracer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Session trace로 원인 관계 보존하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SessionTracer는 사용자 요청이 어떤 model request와 tool call을 만들었는지, retry나 권한 거부가 어느 단계에서 발생했는지를 parent-child
          관계로 남기는 tracer입니다. 세션별 통계를 모으는 객체에 그치지 않습니다. TelemetrySink는 그 결과를 파일이나 OTLP backend로 보내는 출력
          인터페이스입니다. 책임이 다르니 둘은 분리합니다.
        </p>

        <SessionStatsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          identity와 상태를 span 경계에서 확정한다
        </h3>
        <p>
          모델 응답과 tool 실행을 나중에 문자열로 맞추지 말고 생성 시점에 trace ID와 span ID, domain ID를 함께 전달합니다. span은 시작할 때 parent와
          operation을 확정하고 종료할 때 status와 duration을 한 번만 기록합니다. 취소나 panic 경로에서도 종료가 보장되도록 guard 또는 finally 패턴을
          사용하는 것이 좋습니다.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border/70">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">경계</th>
                <th className="px-4 py-3 font-semibold">주요 attributes</th>
                <th className="px-4 py-3 font-semibold">답할 수 있는 질문</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {spanRows.map(([boundary, attributes, question]) => (
                <tr key={boundary}>
                  <td className="px-4 py-3 font-medium">{boundary}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-primary">{attributes}</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {question}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          metric label에는 고유 ID를 넣지 않는다
        </h3>
        <p>
          session ID나 파일 경로, prompt hash를 metric label로 쓰면 시계열 수가 요청마다 늘어납니다. high-cardinality 문제입니다. 고유 값은
          trace와 log에 두고 metric은 provider, model, operation, status처럼 가능한 값이 제한된 차원만 사용합니다. 평균 latency 하나보다
          histogram을 기록해야 p50·p95·p99와 timeout 근처의 긴 꼬리가 보입니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            ["Counter", "request·error·denied·dropped event처럼 누적되는 횟수"],
            [
              "Histogram",
              "model latency·tool duration·tokens처럼 분포가 중요한 값",
            ],
            ["Gauge", "queue depth·active turns처럼 현재 상태를 나타내는 값"],
          ].map(([title, description]) => (
            <section key={title} className="rounded-lg border bg-card p-4">
              <h4 className="text-sm font-bold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </section>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          sampling은 비용 절감이지 무작위 삭제가 아니다
        </h3>
        <p>
          모든 정상 trace를 장기간 보존할 필요는 없습니다. 다만 오류·권한 거부·느린 요청까지 같은 확률로 버리면 조사에 필요한 표본이 사라집니다. 시작 전에 정하는 head
          sampling은 저렴하지만 결과를 모르고 완료 후 결정하는 tail sampling은 오류와 고지연 trace를 고르는 대신 buffering 비용이 듭니다. 보안 감사 이벤트와
          budget 차단 기록은 일반 sampling과 분리해 보존합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          queue와 flush에도 명시적인 실패 의미가 필요하다
        </h3>
        <p>
          exporter queue는 반드시 bounded여야 합니다. 가득 찼을 때 무엇을 먼저 버릴지도 함께 정합니다. 종료 시 flush는 무한정 기다리지 않고 deadline 안에
          전송된 수와 남은 수, drop된 수를 반환합니다. 로컬 JSONL을 쓸 때도 rotation과 파일 권한, 보존 기간, schema version을 두어야 디버그 로그가 영구적인
          민감 정보 저장소가 되지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          좋은 dashboard는 다음 행동으로 이어진다
        </h3>
        <p>
          “tool 성공률 95%” 같은 단일 숫자보다 어느 tool과 error type에서 실패가 늘었는지, model latency 상승이 retry와 연관됐는지, compaction
          이후 token usage가 실제로 줄었는지를 함께 봅니다. 이렇게 원인과 영향을 연결한 지표는 timeout 조정이나 tool schema 수정, cache 정책 변경 같은
          구체적인 개선으로 이어집니다.
        </p>
      </div>
    </section>
  );
}
