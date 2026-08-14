import ModelPricingViz from "./viz/ModelPricingViz";
import UsageTrackerViz from "./viz/UsageTrackerViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

const usageRows = [
  [
    "input tokens",
    "provider response usage",
    "요청 전체 입력 또는 provider가 정의한 billable input",
  ],
  [
    "output tokens",
    "provider response usage",
    "일반 출력과 reasoning token의 포함 관계를 함께 보존",
  ],
  [
    "cache read",
    "provider-specific usage detail",
    "input total에 이미 포함됐는지 mapping 문서화",
  ],
  [
    "cache creation",
    "provider-specific usage detail",
    "TTL·cache class와 함께 별도 기록",
  ],
];

export default function Usage() {
  return (
    <section id="usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Token usage와 비용을 재현 가능한 원장으로 만들기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          UsageTracker는 숫자를 네 개 더하는 counter가 아니라, 어느 provider의
          어떤 응답에서 어떤 정의의 token usage가 발생했는지 보존하는 원장에
          가깝습니다. 요청 전에 tokenizer로 센 값과 provider가 응답에 포함한
          billable usage를 구분해야 예산 경고와 실제 비용 분석을 동시에 할 수
          있습니다.
        </p>

        <UsageTrackerViz />

        <div id="paper-claw-usage-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code runtime usage.rs @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/usage.rs"
            citeKey={3}
            type="code"
          >
            <p>
              <strong>문제:</strong> session의 input·output·cache usage와 request
              identity를 누적합니다. <strong>기여:</strong> pinned source의 counter,
              merge·serialization과 source-specific field를 확인할 수 있습니다.
              <strong>전제:</strong> commit과 provider response usage를 고정합니다.
              <strong>근거 범위:</strong> runtime usage data model과 test입니다.
              <strong>일반화 금지:</strong> tokenizer estimate와 청구 usage가 항상
              같고 retry duplicate·invoice 할인·가격 변경을 자동 조정한다는 뜻은
              아닙니다.
            </p>
          </CitationBlock>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          estimate와 observed usage를 다른 필드로 둔다
        </h3>
        <p>
          요청 전 estimate는 context limit 검사와 예산 예약에 유용하지만,
          provider tokenizer·system overhead·cache 처리 방식과 달라질 수
          있습니다. 응답 usage는 관측값으로 별도 저장하고, 응답이 오지 않은
          timeout은 “0 token”이 아니라 usage unknown 상태로 남겨야 합니다.
          OpenTelemetry GenAI conventions의
          <a
            href="https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/registry/attributes/gen-ai.md"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            usage attributes
          </a>
          처럼 공통 이름을 참고하되 provider mapping과 convention 버전을 함께
          고정하는 편이 안전합니다.
        </p>
        <div className="not-prose my-6 overflow-x-auto rounded-lg border border-border/70">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">항목</th>
                <th className="px-4 py-3 font-semibold">권장 source</th>
                <th className="px-4 py-3 font-semibold">함께 보존할 의미</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {usageRows.map(([kind, source, meaning]) => (
                <tr key={kind}>
                  <td className="px-4 py-3 font-medium">{kind}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-primary">{source}</code>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          retry와 stream 재연결의 중복을 막는다
        </h3>
        <p>
          네트워크 오류 뒤 같은 응답의 완료 이벤트를 다시 받거나 retry된 요청이
          별도 응답을 만들 수 있습니다. provider response ID와 request attempt
          ID를 함께 저장하고, 한 response의 usage는 idempotency key로 한 번만
          반영해야 합니다. retry가 새 응답을 만들었다면 두 usage 모두 실제
          비용일 수 있으므로 하나를 임의로 지우지 말고 같은 logical turn 아래
          attempt별로 묶습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          단가는 코드 상수가 아니라 버전된 데이터다
        </h3>
        <ModelPricingViz />
        <p>
          가격표에는 provider, billable SKU, service tier, token category,
          currency, 단위, <code>effective_at</code>과 공식 source URL이 있어야
          합니다. 모델 alias만으로 최신 단가를 조회하면 과거 세션을 다시 계산할
          때 값이 달라집니다. 각 usage record가 적용한 catalog version을
          가리키게 하면 당시 추정액과 최신 단가 기준 시뮬레이션을 모두 만들 수
          있습니다.
        </p>

        <ExplainedFormula
          question="한 model attempt의 token usage를 당시 가격표로 어떻게 추정할까?"
          idea={<>Input·output·cache read·cache write를 하나의 token 합계로 뭉치지 않고 각 billable category와 단가를 곱합니다. Retry가 새 response를 만들면 별도 attempt 비용으로 더합니다.</>}
          formula={String.raw`\widehat C=p_iI+p_oO+p_rR+p_wW`}
          terms={[
            { symbol: String.raw`\widehat C`, name: "estimated cost", description: "해당 pricing catalog version으로 계산한 추정 통화 금액입니다." },
            { symbol: "I,O", name: "input and output tokens", description: "Provider가 보고한 일반 input·output billable token 수입니다." },
            { symbol: "R,W", name: "cache read and write tokens", description: "Provider 정의에 따른 cache 재사용·생성 token 수입니다." },
            { symbol: "p_i,p_o,p_r,p_w", name: "versioned unit prices", description: "Request 시점 provider·model·tier·currency의 category별 단가입니다." },
          ]}
          assumptions={[
            "Usage field의 포함 관계와 단가 단위를 provider 문서와 catalog version에 맞춥니다.",
            "계약 할인·세금·credit·반올림은 로컬 추정식과 별도로 invoice에서 reconciliation합니다.",
          ]}
          interpretation="I=1000, O=200, R=500, W=0이고 단가가 각각 1, 4, 0.2, 1.25라는 같은 축의 예라면 추정치는 1900 단가 단위입니다. 이는 billed amount가 아니며 response usage가 unknown이면 0으로 대체하지 않습니다."
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">
          비용은 항상 추정치로 표시하고 청구서와 대조한다
        </h3>
        <p>
          로컬 계산에는 계약 할인, 무료 credit, batch 할인, 세금과 provider의
          반올림 규칙이 빠질 수 있습니다. 따라서 UI에는 “estimated cost”와 계산
          기준 시점을 표시하고, 정확한 오차 범위를 근거 없이 고정하지 않습니다.
          provider invoice를 가져올 수 있다면 기간과 account를 맞춰 추정치와
          대조하고 차이를 <code>discount</code>,<code>missing usage</code>,{" "}
          <code>pricing drift</code>처럼 분류합니다.
        </p>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            ["Observed", "provider가 반환한 token usage와 response identity"],
            ["Estimated", "버전된 가격표로 계산한 통화별 비용"],
            ["Billed", "provider 청구서에서 확인한 최종 금액"],
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
          budget warning과 hard limit을 분리한다
        </h3>
        <p>
          경고는 현재 추정 비용이 threshold를 넘으면 보여주면 되지만, hard
          limit은 동시 요청 때문에 쉽게 초과할 수 있습니다. 요청을 시작할 때
          예상 최대 비용을 reserve하고 완료 후 실제 usage로 정산해야 하며,
          timeout이나 취소 때 reservation을 언제 해제할지도 정해야 합니다. 팀
          환경에서는 일일 한도뿐 아니라 project·user·provider별 scope와
          timezone을 명확히 해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          사용자가 행동할 수 있는 breakdown을 보여준다
        </h3>
        <p>
          총액 하나만 보여주면 무엇을 바꿔야 할지 알 수 없습니다. model과
          operation, input·output·cache category, 성공·실패 attempt별로
          breakdown을 제공하면 긴 prompt를 줄일지, output limit을 조정할지,
          cache hit rate를 개선할지 판단할 수 있습니다. 다만 session ID 같은
          고유 값을 metric label로 만들지 말고 상세 분석은 trace나 usage
          ledger에서 수행합니다.
        </p>

        <div id="paper-otel-genai-semconv" className="scroll-mt-24">
          <CitationBlock
            source="OpenTelemetry — Generative AI semantic conventions"
            href="https://opentelemetry.io/docs/specs/semconv/gen-ai/"
            citeKey={4}
            type="paper"
          >
            <p>
              <strong>문제:</strong> Provider마다 model operation·token usage·tool
              event 이름이 달라 관측 결과를 비교하기 어려운 문제를 다룹니다.
              <strong>기여:</strong> GenAI trace·metric·event attribute의 공통
              naming과 stability 상태를 제공합니다. <strong>전제:</strong> convention
              version과 provider mapping을 함께 기록해야 합니다.
              <strong>근거 범위:</strong> telemetry field vocabulary와 migration
              경계입니다. <strong>일반화 금지:</strong> 표준 이름을 사용하면 token
              accounting·privacy·cost attribution이 자동으로 정확해진다는 뜻은
              아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
