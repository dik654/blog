import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { FailureAblationViz } from "../llm-harness/viz/ModernHarnessViz";

export default function HarnessFailureAblationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="failure-layer" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          실패 증상보다 먼저 고장 난 contract layer를 찾습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            필요한 문서를 못 찾았는데 reviewer를 늘리거나 권한이 없는데 prompt를
            길게 쓰면 비용만 커집니다. <strong>Failure-layer ablation</strong>은
            trace를 재현하고 한 layer만 바꿔 실제 기여를 측정합니다.
          </p>
        </div>
        <TermBreakdown
          title="한 번의 ablation이 갖는 네 물체"
          items={[
            {
              term: "Replay fixture",
              description:
                "같은 input·model·tool·runtime·expected state를 재생합니다.",
            },
            {
              term: "Failure label",
              description:
                "Objective·context·schema·capability·verifier·recovery 중 원인 layer를 분류합니다.",
            },
            {
              term: "Single change",
              description: "후보 장치 하나만 추가·제거·교체합니다.",
              boundary:
                "Model·prompt·tool을 함께 바꾸면 원인을 귀속할 수 없습니다.",
            },
            {
              term: "Paired ledger",
              description:
                "Target failure와 기존 success의 quality·token·latency·effect를 함께 비교합니다.",
            },
          ]}
        />
        <FailureAblationViz />
        <ContentBoundary article="harness-failure-ablation" />
      </section>
      <section id="classify" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Context miss와 capability denial은 다른 수정이 필요합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li>정본을 못 찾음 → discovery index와 freshness를 수정합니다.</li>
            <li>
              Argument가 반복해서 틀림 → schema와 actionable error를 수정합니다.
            </li>
            <li>
              실행 권한 없음 → identity·scope·approval contract를 수정합니다.
            </li>
            <li>잘못된 성공 보상 → verifier와 acceptance를 수정합니다.</li>
          </ul>
        </div>
      </section>
      <section id="ablation" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          후보 layer 하나의 순기여와 회귀를 같이 봅니다
        </h2>
        <ExplainedFormula
          question="새 장치가 실패를 고쳤지만 기존 성공을 망치지 않았는지 어떻게 비교하나요?"
          idea={
            <p>
              같은 fixture에서 candidate와 baseline의 target recovery를 빼고,
              기존 success regression은 별도 gate로 둡니다.
            </p>
          }
          formula={String.raw`\Delta_k=M_k-M_0,\quad G=I[\Delta_k>0]\land I[R_k\le\tau]`}
          annotatedFormula={String.raw`\begin{aligned}\Delta_k&=\underbrace{M_k-M_0}_{\text{장치 k의 순변화}}\\G&=\underbrace{\mathbf1[\Delta_k>0]}_{\text{target 개선}}\land\underbrace{\mathbf1[R_k\le\tau]}_{\text{회귀 한도 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`M_k-M_0`,
              annotation: [
                "같은 fixture의 baseline을 빼",
                "장치 k 순기여 분리",
              ],
            },
            {
              expression: String.raw`\mathbf1[\Delta_k>0]\land\mathbf1[R_k\le\tau]`,
              annotation: ["개선과 회귀 한도를", "둘 다 release 조건으로"],
            },
          ]}
          terms={[
            {
              symbol: "M_k",
              name: "Candidate metric",
              description:
                "장치 k를 적용한 target failure의 성공 metric입니다.",
            },
            {
              symbol: "M_0",
              name: "Baseline metric",
              description: "동일 fixture의 기존 harness metric입니다.",
            },
            {
              symbol: "R_k",
              name: "Regression rate",
              description:
                "기존 success fixture가 candidate에서 실패한 비율입니다.",
            },
            {
              symbol: "tau",
              name: "Regression tolerance",
              description: "배포 전에 허용한 최대 회귀율입니다.",
            },
          ]}
          assumptions={[
            "Baseline과 candidate의 model·input·tool·runtime은 장치 k 외에 같습니다.",
            "Target metric과 regression set을 변경 전에 고정합니다.",
            "Latency·token·effect 비용도 paired ledger에 함께 둡니다.",
          ]}
          interpretation="Target가 좋아져도 regression rate가 tolerance를 넘으면 G=0이라 장치를 배포하지 않습니다."
        />
      </section>
      <section id="paper-harness-ablation" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — Harness design for long-running apps"
            citeKey={1}
            href="https://www.anthropic.com/engineering/harness-design-long-running-apps"
          >
            Planner·generator·evaluator와 persistent state를 조합하고 구성
            요소를 제거해 기여를 비교합니다. 모든 model에 같은 역할 분할이 항상
            필요하다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
