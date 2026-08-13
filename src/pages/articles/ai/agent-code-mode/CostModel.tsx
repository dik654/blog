const repeatedToolLoop = `LLM → listIssues()
결과 10,000건 → LLM context
LLM → getIssue(...)
상세 결과 → LLM context
LLM → filter / group / sort 판단
...`;

const codeModeExample = `const issues = await github.listIssues({ since });

const summary = issues
  .filter((issue) => issue.labels.includes("security"))
  .filter((issue) => issue.assignee == null)
  .reduce(groupByTeam, {});

return summary; // 집계 결과만 모델로 반환`;

export default function CostModel() {
  return (
    <section id="cost-model" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        토큰 절감은 코드가 짧아서가 아니라 중간 결과가 밖에 남아서다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          일반 tool loop에서는 각 round마다 이전 대화, 관련 tool schema, 직전
          결과와 다음 판단이 모델 입력으로 돌아오기 쉽다. Code Mode는 loop,
          branch, filter, sort와 집계를 일반 runtime으로 옮기고 최종적으로
          필요한 결과만 모델에 돌려준다.
        </p>

        <div data-viz="code-mode-cost-paths" className="not-prose my-6 grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 rounded-lg border bg-muted/20 p-4">
            <p className="mb-3 text-sm font-semibold">반복 tool call</p>
            <pre className="overflow-x-auto rounded-lg bg-background p-4 text-xs leading-6">
              <code className="text-xs">{repeatedToolLoop}</code>
            </pre>
          </div>
          <div className="min-w-0 rounded-lg border bg-muted/20 p-4">
            <p className="mb-3 text-sm font-semibold">Code Mode</p>
            <pre className="overflow-x-auto rounded-lg bg-background p-4 text-xs leading-6">
              <code className="text-xs">{codeModeExample}</code>
            </pre>
          </div>
        </div>

        <h3 id="code-mode-cost" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">비용을 가르는 항</h3>
        <ExplainedFormula
          question="Code Mode가 program token을 추가하고도 전체 model token을 줄이는 조건은 무엇인가?"
          idea={
            <p>
              일반 loop는 각 round의 prompt·tool schema·중간 result·다음 판단을
              더합니다. Code Mode는 discovery·program·최종 result 비용을 내는
              대신 중간 result와 반복 inference를 sandbox computation으로
              바꿉니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            C_{\mathrm{loop}} &= \sum_{i=1}^{n}(P_i+S_i+R_i+D_i) \\
            C_{\mathrm{code}} &= P_{\mathrm{find}}+P_{\mathrm{prog}}+R_{\mathrm{final}} \\
            \mathrm{use\ code}\quad &\text{if}\quad C_{\mathrm{code}}<C_{\mathrm{loop}}
          \end{aligned}`}
          terms={[
            { symbol: "n", name: "model rounds", description: "Tool 실행 전후로 model이 다시 inference하는 round 수입니다." },
            { symbol: "P_i", name: "carried prompt/context", description: "i번째 round에 다시 전달되는 대화·지침·작업 상태 token입니다." },
            { symbol: "S_i", name: "tool schema", description: "해당 round에서 model이 읽는 tool description·argument schema token입니다." },
            { symbol: "R_i", name: "intermediate result", description: "Tool이 반환해 model context로 들어가는 row·file·response token입니다." },
            { symbol: "D_i", name: "next decision", description: "다음 tool·filter·branch를 고르는 model output token입니다." },
            { symbol: "P_{\\mathrm{prog}}", name: "program generation", description: "Sandbox가 실행할 program을 model이 작성하는 token입니다." },
            { symbol: "R_{\\mathrm{final}}", name: "bounded final result", description: "Sandbox가 filter·aggregate 후 model에 반환하는 최종 결과 token입니다." },
          ]}
          assumptions={[
            "각 항은 model input/output token을 비교하는 구조적 비용이며 CPU time·tool billing·sandbox cold start는 별도입니다.",
            "Provider prompt caching·schema caching·parallel execution·result compression 조건을 같은 workload에서 고정합니다.",
            "Sandbox가 중간 data를 실제로 local 처리하고 final result budget을 강제합니다.",
          ]}
          interpretation="10,000개 row를 filter하는 program이 200 token이어도 수만 token의 중간 결과와 여러 model round를 제거하면 이득입니다. Tool 한 번이면 끝나는 작업은 n과 R_i가 작아 program 비용이 오히려 큽니다."
        />
        <p className="leading-7">
          이 부등식은 청구 금액 공식이 아니라 구조를 보는 모델이다. Provider의
          prompt caching, 병렬 호출, tool result 압축에 따라 실제 비용은
          달라진다. 핵심은
          <strong>
            {" "}
            program token 비용보다 제거되는 중간 데이터와 반복 추론 비용이 클
            때만
          </strong>{" "}
          이득이라는 점이다.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-semibold">절감되지 않는 경우</h3>
        <p className="leading-7">
          날씨 API 하나를 한 번 부르면 되는 작업에 program 생성·compile·sandbox
          기동을 추가하면 오히려 느리고 비싸다. 중간 결과가 작거나 각 단계마다
          자연어 의미 판단이 꼭 필요할 때도 직접 tool loop가 단순하다. Code
          Mode는 “항상 더 적은 token”이 아니라{" "}
          <strong>
            반복과 데이터 이동이 큰 구간을 모델 밖으로 빼는 선택지
          </strong>
          다.
        </p>
      </div>
    </section>
  );
}
import ExplainedFormula from "@/components/ui/explained-formula";
