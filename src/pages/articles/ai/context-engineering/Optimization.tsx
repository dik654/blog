import { Link } from "react-router-dom";
import OptimizationViz from "./viz/OptimizationViz";
import { BudgetViz, CacheViz } from "./viz/OptimizationDetailViz";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">선택·배치·compaction을 함께 조정한다</h2>
      <div className="not-prose mb-8">
        <OptimizationViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          컨텍스트 윈도우가 커져도 지시, 검색 문서, 대화와 tool 결과가 경쟁하는
          문제는 남습니다. 먼저 반드시 유지할 정책과 현재 목표에 예산을
          배정하고, 검색 문서와 과거 기록은 관련도와 최신성을 기준으로
          선택합니다. 한도를 넘기기 시작하면 오래된 tool 원문을 artifact로
          옮기고, 다음 행동에 필요한 상태만 compaction으로 남깁니다.
        </p>
        <p>
          <strong>lost in the middle</strong>은 긴 문맥의 가운데 놓인 정보를
          덜 활용하는 경향을 가리키는 표준 용어입니다. 모든 모델과 작업에서 같은
          정도로 나타나는 법칙은 아니므로, 중요한 정보를 무조건 앞이나 끝에
          복제하기보다 needle-in-a-haystack 평가와 실제 질문을 사용해
          확인합니다. 관련 없는 distractor를 늘린 조건도 함께 평가해야 문맥
          길이와 검색 품질을 구분할 수 있습니다.
        </p>

        <ExplainedFormula
          question="입력 한도를 다 써 버려 답변이 잘리기 전에 context source별 예산을 어떻게 확인할까요?"
          idea={
            <p>
              먼저 생성할 output과 tool follow-up을 위한 여유를 떼어 두고,
              instruction·현재 task·검색 근거·history·tool result의 실제 tokenizer
              token을 합산합니다. 한도를 넘으면 중요도와 freshness에 따라 선택하거나
              원문을 artifact로 옮기고 compaction합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            B_{\mathrm{used}}
            &=B_{\mathrm{sys}}+B_{\mathrm{task}}+B_{\mathrm{ret}}\\
            &\quad+B_{\mathrm{hist}}+B_{\mathrm{tool}}+B_{\mathrm{out}}\\
            B_{\mathrm{used}}&\le B_{\max}
          \end{aligned}`}
          terms={[
            { symbol: String.raw`B_{\mathrm{sys}}`, name: "instruction budget", description: "System/developer instruction과 stable tool definition이 차지하는 token입니다." },
            { symbol: String.raw`B_{\mathrm{task}}`, name: "current-task budget", description: "현재 user request·acceptance condition·즉시 필요한 example이 차지하는 token입니다." },
            { symbol: String.raw`B_{\mathrm{ret}}`, name: "retrieval budget", description: "검색한 근거와 source metadata를 context에 넣은 token입니다." },
            { symbol: String.raw`B_{\mathrm{hist}}`, name: "history budget", description: "최근 message와 compaction summary가 차지하는 token입니다." },
            { symbol: String.raw`B_{\mathrm{tool}}`, name: "tool-result budget", description: "현재 판단에 필요한 tool output이며 오래된 원문은 외부 artifact로 옮길 수 있습니다." },
            { symbol: String.raw`B_{\mathrm{out}}`, name: "output reserve", description: "답변·tool call·후속 reasoning을 생성하기 전에 남겨 둔 token 예산입니다." },
            { symbol: String.raw`B_{\max}`, name: "model/request limit", description: "Model과 API 설정이 이 request에서 허용하는 입력+출력 token 상한입니다." },
          ]}
          assumptions={[
            "같은 tokenizer와 실제 chat/tool serialization으로 token을 계산합니다.",
            "Provider가 input·output·cached token에 적용하는 별도 한도와 billing을 함께 확인합니다.",
            "예산을 맞추는 것과 model이 모든 근거를 활용하는 것은 별개이므로 위치·distractor 평가를 수행합니다.",
          ]}
          interpretation="이 식은 source별 token의 장부이며 품질 점수나 최적 배분 공식은 아닙니다. 합이 한도 안이어도 오래되거나 서로 충돌하는 정보가 많으면 품질이 떨어질 수 있고, cache hit가 나도 token의 의미상 혼잡은 그대로 남습니다."
        />

        <div id="paper-lost-in-middle" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="Lost in the Middle: How Language Models Use Long Contexts"
            citeKey={2}
            href="https://arxiv.org/abs/2307.03172"
          >
            Multi-document QA와 key-value retrieval에서 relevant evidence의 위치를
            바꾸며 long-context utilization을 측정했고, 여러 model에서 가운데
            evidence 성능 저하를 관찰했습니다. 모든 최신 model·task가 같은 U자형
            곡선을 보이거나 중요한 정보를 앞뒤에 복제하면 문제가 해결된다는
            뜻은 아닙니다.
          </CitationBlock>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Context budget</h3>
        <div className="not-prose mb-6">
          <BudgetViz />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Prompt caching</h3>
        <div className="not-prose mb-6">
          <CacheViz />
        </div>
        <p className="leading-7">
          Prompt caching은 반복되는 stable prefix의 계산을 재사용하는 기능이며,
          실제 할인율과 cache 조건은 provider와 모델에 따라 달라집니다. 자주
          바뀌는 사용자 입력을 뒤에 두고 공통 지침과 도구 정의를 앞에 두면
          재사용 가능성이 높아지지만, cache를 위해 오래된 지침을 유지해서는 안
          됩니다. 세션 compaction의 구체적인 상태 보존 방식은{" "}
          <Link to="/ai/claw-compaction">컨텍스트 Compaction 글</Link>에서 더
          자세히 다룹니다.
        </p>
      </div>
    </section>
  );
}
