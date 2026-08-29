import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { OutputValidationViz } from "./viz/OutputValidationViz";

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
          field나 의미까지 고정하지 못합니다.
        </p>
        <p>
          먼저 consumer가 실제로 필요한 record를 정의하고 <code>required</code>,{" "}
          <code>enum</code>, <code>null</code>, <code>additionalProperties</code>와
          error state를 schema에 포함해야 합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="prompt-design-layer" className="scroll-mt-20">
          Structured prompting은 설계이고 강제는 decoder의 책임입니다
        </h3>
        <p>
          Structured prompting은 원하는 field·type·example을 prompt 문장으로
          미리 보여주는 설계 기법입니다. Model이 그 설명을 따르길 기대할
          뿐이고, 다른 token을 아예 못 내놓게 막는 decoder-level 강제는 이
          층에 없습니다.
        </p>
        <p>
          반면 grammar-constrained generation은 JSON Schema나 CFG를
          tokenizer에 맞게 compile해, 생성 중 허용되지 않는 token의 logit을
          직접 지우는 decoding 강제입니다. 두 층은 함께 쓸 수 있지만 막는
          실패가 다릅니다. Prompt 설계는 model에게 모양을 알려줄 뿐이고, 실제
          token 강제의 원리는{" "}
          <Link to="/ai/grammar-tokenizer-decoding#token-mask">
            grammar-tokenizer decoding
          </Link>
          에서 이어집니다.
        </p>
      </div>

      <TermBreakdown
        title="Record를 믿기 전에 네 단어를 한 문씩 통과시킵니다"
        description="앞 단계 성공이 뒤 단계 성공을 뜻하지 않으므로 각 판정의 입력과 책임을 따로 둡니다."
        items={[
          {
            term: "Parse",
            description: "문자열이 JSON 같은 문법으로 끝까지 해석되는지 확인합니다.",
            example: "닫는 괄호가 없거나 code fence가 섞인 output을 syntax failure로 분류합니다.",
            boundary: "Parse 성공은 field·type·실제 상품 존재를 확인하지 않습니다.",
          },
          {
            term: "Schema validation",
            description: "Required field·type·enum·null·additional property 규칙을 검사합니다.",
            example: "status는 matched|unknown|rejected 중 하나이고 item_id는 string|null이어야 합니다.",
            boundary: "Schema-valid한 가짜 item_id나 근거 없는 값은 여전히 남을 수 있습니다.",
          },
          {
            term: "Domain validation",
            description: "ID 존재·상태 전이·금액 범위·source span처럼 실제 업무 규칙을 검사합니다.",
            example: "item_id를 catalog에서 조회하고 evidence가 입력 원문에 존재하는지 확인합니다.",
            boundary: "Domain service가 가진 snapshot과 권한 범위 밖의 사실을 판정할 수는 없습니다.",
          },
          {
            term: "Bounded fallback",
            description: "실패 원인을 남기고 제한된 repair 뒤 typed unknown이나 human review로 끝내는 경로입니다.",
            example: "Repair 한 번 뒤에도 invalid면 원본·수정본·failure stage를 보존하고 review queue로 보냅니다.",
            boundary: "무제한 retry는 tail latency와 의미 변형을 키우므로 종료 조건이 필요합니다.",
          },
        ]}
      />

      <div className="not-prose my-8"><OutputValidationViz /></div>
      <ContentBoundary article="prompt-structured-output" />

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

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="output-paths" className="scroll-mt-24">세 경로는 “형식이 잘 맞는가”와 “얼마나 오래 걸리는가”를 함께 비교합니다</h3>
        <p>
          같은 schema를 전달해도 runtime 경로는 세 가지로 나뉩니다. Prompt-only는
          model에게 규칙을 요청할 뿐이고, constrained decoding은 생성 가능한
          token을 decoder에서 제한합니다. Post-hoc repair는 이미 생성된 invalid
          output을 나중에 고치는 경로입니다.
        </p>
        <p>
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

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="json-mode-boundary" className="scroll-mt-20">
          JSON mode는 문법만 보장하고 schema는 보장하지 않습니다
        </h3>
        <p>
          <strong>Output constraint</strong>는 prompt 설계·decoder token
          mask·post-hoc validation 가운데 어느 층에서 model 출력의 가능한
          모양을 좁히느냐를 통칭하는 말입니다. 한 층만 쓰면 그 층이 막지
          못하는 실패가 그대로 남습니다.
        </p>
        <p>
          <strong>JSON mode</strong>는 여러 provider가 제공하는 decoder
          옵션으로, 출력이 문법적으로 유효한 JSON임을 보장합니다. 그러나 어떤
          field가 있어야 하는지, <code>item_id</code>가 string인지 number인지
          같은 schema 제약은 검사하지 않습니다.
        </p>
        <p>
          예를 들어 JSON mode를 켜면 <code>{`{"result": true}`}</code>처럼
          항상 parse되는 JSON이 나오지만, schema가 <code>status</code>·
          <code>item_id</code> field를 요구해도 JSON mode 혼자서는 그 누락을
          막지 못합니다. 그래서 JSON mode 뒤에도 schema validation을 그대로
          둬야 합니다.
        </p>
      </div>

      <div id="output-measurement" className="scroll-mt-24">
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
        annotatedFormula={String.raw`\begin{aligned}
\hat p_{\mathrm{fail}}&=\underbrace{N_{\mathrm{final\;invalid}}/N}_{\text{끝까지 invalid인 요청 비율}}\\[3pt]
L_{95}&=\underbrace{Q_{0.95}(\{T_i\})}_{\text{95\% 요청이 끝나는 시간 경계}}\\[3pt]
\mathbb E[T_{\mathrm{repair}}]&\approx\underbrace{T_g+T_v}_{\text{첫 생성·검증}}\\
&\quad+\underbrace{p_0(T_r+T_v)}_{\text{첫 실패 때만 repair·재검증}}
\end{aligned}`}
        operations={[
          {
            expression: String.raw`N_{\mathrm{final\;invalid}}/N`,
            annotation: ["최종 invalid 수를", "같은 paired request 수로 나눕니다"],
          },
          {
            expression: String.raw`\operatorname{percentile}_{0.95}(T_1,\ldots,T_N)`,
            annotation: ["요청별 wall-clock 시간을 정렬해", "95%가 끝나는 latency 경계를 고릅니다"],
          },
          {
            expression: String.raw`p_0(T_r+T_v)`,
            annotation: ["첫 검증이 실패할 확률에만", "repair와 재검증 비용을 곱해 기대 비용을 더합니다"],
          },
        ]}
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
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="output-release" className="scroll-mt-24">Repair는 횟수와 종료 상태를 먼저 정합니다</h3>
        <p>
          JSON은 typed API payload에, Markdown은 사람이 읽을 보고서에 적합하고 XML
          tag는 긴 prompt 안에서 instruction·example·evidence의 경계를 표시할 때
          유용합니다. 그러나 XML이나 Markdown을 선택했다고 output validity가
          보장되지는 않습니다.
        </p>
        <p>
          Syntax 실패 비용이 크다면 prompt-only generation이 아니라 JSON
          Schema나 grammar로 invalid token을 막는 decoder-level constraint를
          검토합니다.
        </p>
        <p>비교 experiment에서는 세 경로를 같은 validator에 통과시킨 뒤 결과를 세 묶음으로 기록합니다.</p>
        <ul>
          <li><strong>Validity:</strong> first-pass syntax, final failure, domain validity</li>
          <li><strong>Latency:</strong> p50·p95 end-to-end와 repair 횟수</li>
          <li><strong>Cost:</strong> output·repair token, fallback 비율, grammar cold/warm 상태</li>
        </ul>
        <p>
          Repair는 최대 횟수를 넘으면 typed <code>unknown</code>이나 사람 검토 queue로
          끝냅니다. 지원 schema subset과 decoder version도 receipt에 남깁니다. Token
          masking의 세부 원리는
          <Link to="/ai/grammar-constrained-generation"> grammar-constrained generation</Link>
          글에서 이어서 확인할 수 있습니다.
        </p>
        <div id="paper-json-schema" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            source="JSON Schema Draft 2020-12"
            citeKey={1}
            href="https://json-schema.org/draft/2020-12"
          >
            Draft 2020-12는 JSON document의 core·validation vocabulary와 meta-schema를
            정의합니다. Schema validation은 document 구조를 판정하며 catalog ID의
            실제 존재나 업무 상태 전이를 자동으로 판정하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-structured-output" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="Anthropic — Structured outputs"
            citeKey={2}
            href="https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
          >
            현재 공식 문서는 JSON Schema를 grammar로 compile해 schema-compliant
            output을 제한하는 경로와 지원 subset·cache 조건을 설명합니다. 이 보장은
            domain validity·사실성·authorization까지 확장되지 않습니다.
          </CitationBlock>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          운영 경로는 generate→parse→schema validate→domain validate→limited retry→
          fallback 순서로 구성합니다. Retry에는 최대 횟수와 원인별 수정 strategy를
          두고, 원문 근거가 없거나 policy상 실행할 수 없는 경우에는 억지로 record를
          채우지 않고 typed abstention을 반환해야 합니다.
        </p>
        <p>
          이때 validator failure를 eval set에 축적하면 format prompt와 schema를
          어떤 순서로 고쳐야 하는지도 추적할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
