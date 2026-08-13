import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import StructuredOutputViz from "./viz/StructuredOutputViz";
import { StrategyViz, BestPracticesViz } from "./viz/StructuredOutputDetailViz";

const OUTPUT_PATHS = [
  [
    "Prompt-only JSON",
    "Prompt에 JSON 예시와 schema 설명을 적고 model이 형식을 따르길 기대합니다.",
    "Decoder-level 보장이 없어 code fence·누락 field·잘린 JSON이 생길 수 있습니다. 한 번에 성공하면 가장 단순하지만 retry가 늘면 tail latency도 커집니다.",
  ],
  [
    "Constrained decoding",
    "생성 중 grammar나 JSON Schema가 허용하지 않는 token을 decoder에서 mask합니다.",
    "지원하는 schema 범위에서는 syntax failure를 크게 줄일 수 있지만 grammar compile·token mask 비용이 있고, 존재하지 않는 item_id 같은 semantic error는 그대로 남습니다.",
  ],
  [
    "Post-hoc repair",
    "첫 output이 validator를 통과하지 못하면 parser 또는 별도 model이 고친 뒤 다시 검증합니다.",
    "기존 endpoint에도 붙이기 쉽지만 repair call만큼 latency·cost가 늘고 의미를 몰래 바꿀 수 있습니다. 횟수를 제한하고 원본·수정본·실패 이유를 함께 기록해야 합니다.",
  ],
] as const;

export default function StructuredOutput() {
  return (
    <section id="structured-output" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        구조화된 출력은 형식 요청이 아니라 downstream consumer와의 계약이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          사람이 읽는 보고서는 표현이 조금 달라도 되지만 program이 읽는 결과는
          field name, type, 허용 값, 누락과 오류 표현이 안정적이어야 합니다.
          “JSON으로 답해 줘”만 적으면 JSON처럼 보이는 text를 유도할 뿐 필요한
          field나 의미까지 고정하지 못합니다. 먼저 consumer가 실제로 필요한
          record를 정의하고 <code>required</code>, <code>enum</code>,
          <code>null</code>, <code>additionalProperties</code>와 error state를 schema에
          포함해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8"><StructuredOutputViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Syntax·schema·domain semantics를 세 단계로 검사한다</h3>
        <p>
          첫 단계는 JSON을 parse할 수 있는지 보는 syntax 검사이고, 둘째는 field와
          type이 schema에 맞는지 보는 structural validation입니다. 마지막은 상품
          ID가 실제 catalog에 있는지, 금액과 상태 전이가 업무 규칙에 맞는지 보는
          semantic validation입니다. 앞의 두 단계를 통과해도 hallucinated ID나
          근거 없는 값은 남을 수 있으므로 세 검사를 하나로 뭉치면 실패 위치를
          찾기 어렵습니다.
        </p>
        <pre className="whitespace-pre-wrap break-words"><code>{`{
  "status": "matched | unknown | rejected",
  "item_id": "string | null",
  "evidence": "source span",
  "reason": "required when status is not matched"
}`}</code></pre>
      </div>

      <div className="not-prose my-8"><StrategyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>세 경로는 “형식이 잘 맞는가”와 “얼마나 오래 걸리는가”를 함께 비교합니다</h3>
        <p>
          같은 schema를 전달해도 runtime 경로는 세 가지로 나뉩니다. Prompt-only는
          model에게 규칙을 요청할 뿐이고, <strong>constrained decoding</strong>은
          생성 가능한 token을 decoder에서 제한합니다. <strong>Post-hoc
          repair</strong>는 이미 생성된 invalid output을 나중에 고치는 경로입니다.
          어느 하나가 항상 가장 빠르다고 단정할 수는 없습니다. Constrained
          decoding에는 grammar 처리 비용이 있지만 retry를 줄일 수 있고, prompt-only
          한 번은 가벼워도 실패가 잦으면 p95 latency가 더 커질 수 있기 때문입니다.
        </p>
      </div>

      <div className="not-prose my-7 divide-y divide-border rounded-lg border border-border">
        {OUTPUT_PATHS.map(([name, mechanism, tradeoff]) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 p-4 md:grid-cols-[10rem_13rem_minmax(0,1fr)] md:gap-5"
          >
            <p className="break-words text-sm font-bold text-primary">{name}</p>
            <p className="break-words text-sm leading-6">{mechanism}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">{tradeoff}</p>
          </div>
        ))}
      </div>

      <ExplainedFormula
        question="세 output 경로의 실패 확률과 tail latency를 같은 기준으로 어떻게 측정할까요?"
        idea={(
          <p>
            동일한 N개 요청을 각 경로에 paired 방식으로 실행합니다. 제한된 retry와
            fallback까지 끝난 뒤에도 validator를 통과하지 못한 요청의 비율을 최종
            실패율로 세고, 요청 시작부터 최종 판정까지의 wall-clock time으로 p95를
            구합니다. 한 번 repair하는 경로의 평균 latency는 첫 검증 실패 확률만큼
            repair와 재검증 비용이 더해진다고 근사할 수 있습니다.
          </p>
        )}
        formula={String.raw`\begin{aligned}
\hat p_{\mathrm{fail}}&=\frac{N_{\mathrm{final\;invalid}}}{N}\\
L_{95}&=\operatorname{percentile}_{0.95}(T_1,\ldots,T_N)\\
\mathbb E[T_{\mathrm{repair}}]&\approx T_g+T_v+p_0(T_r+T_v)
\end{aligned}`}
        terms={[
          { symbol: "N", name: "paired request count", description: "세 경로에 똑같이 넣는 평가 요청 수입니다." },
          { symbol: "N_{\\mathrm{final\\;invalid}}", name: "final invalid count", description: "허용된 retry와 fallback 뒤에도 syntax·schema·domain validator 중 하나를 통과하지 못한 요청 수입니다." },
          { symbol: "T_i", name: "end-to-end latency", description: "i번째 요청이 시작해 최종 valid record 또는 fallback을 반환할 때까지의 wall-clock time입니다." },
          { symbol: "T_g, T_v, T_r", name: "generation·validation·repair time", description: "각각 최초 생성, validator 실행, 한 번의 repair에 든 시간입니다." },
          { symbol: "p_0", name: "first-pass failure rate", description: "repair 전에 최초 output이 validator를 통과하지 못한 비율입니다." },
        ]}
        assumptions={[
          "Model snapshot·prompt·schema·input·temperature·max tokens를 고정하고 경로만 바꿉니다.",
          "Syntax, schema, domain failure를 따로 기록합니다. 최종 실패율 하나만 보면 constrained decoding이 해결하지 못한 semantic error가 가려집니다.",
          "Expected-latency 식은 repair를 최대 한 번 수행하고 각 항을 평가셋 평균으로 두는 근사입니다. 여러 번 retry하면 실제 request별 wall-clock distribution을 사용합니다.",
          "Latency는 평균뿐 아니라 p50·p95를 기록하고 grammar compile cache의 cold/warm 조건, repair token과 fallback 횟수도 함께 남깁니다.",
        ]}
        interpretation="예를 들어 1,000개 요청 중 bounded retry 뒤 8개가 invalid라면 최종 실패율은 0.8%입니다. Constrained decoding의 단일 생성이 조금 느려도 repair 호출이 줄어 p95가 낮아질 수 있으므로, 한 번의 microbenchmark가 아니라 end-to-end 경로로 선택해야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          JSON은 typed API payload에, Markdown은 사람이 읽을 보고서에 적합하고 XML
          tag는 긴 prompt 안에서 instruction·example·evidence의 경계를 표시할 때
          유용합니다. 그러나 XML이나 Markdown을 선택했다고 output validity가
          보장되지는 않습니다. Syntax 실패 비용이 크다면 prompt-only generation이
          아니라 JSON Schema나 grammar로 invalid token을 막는 decoder-level
          constraint를 검토합니다.
        </p>
        <p>
          비교 experiment에서는 세 경로 모두 같은 syntax·schema·domain validator를
          통과시킵니다. First-pass syntax failure, 최종 failure probability, domain
          validity, p50·p95 latency, output·repair token과 fallback 비율을 요청별로
          기록합니다. Repair는 같은 오류를 반복하지 않도록 최대 횟수를 정하고,
          제한을 넘으면 typed <code>unknown</code>이나 사람 검토 queue로 보냅니다.
          Grammar가 지원하는 schema subset과 decoder version은 결과 receipt에 남기며,
          token masking의 세부 원리는
          <Link to="/ai/grammar-constrained-generation"> grammar-constrained generation</Link>
          글에서 이어서 확인할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8"><BestPracticesViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          운영 경로는 generate→parse→schema validate→domain validate→limited retry→
          fallback 순서로 구성합니다. Retry에는 최대 횟수와 원인별 수정 strategy를
          두고, 원문 근거가 없거나 policy상 실행할 수 없는 경우에는 억지로 record를
          채우지 않고 typed abstention을 반환해야 합니다. 이때 validator failure를
          eval set에 축적하면 format prompt와 schema를 어떤 순서로 고쳐야 하는지도
          추적할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
