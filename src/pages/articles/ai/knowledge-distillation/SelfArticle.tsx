import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DistillationLearningFlowViz from "./viz/DistillationLearningFlowViz";

export default function SelfDistillationArticle() {
  return (
    <article>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
        <header>
          <p className="text-sm font-semibold text-primary">
            먼저 세대 경계를 고정합니다
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Self-distillation은 같은 이름의 model이 아니라 frozen teacher 세대와
            새 student 세대의 계약이다
          </h2>
        </header>
        <p className="text-lg leading-8">
          한 checkpoint를 teacher로 freeze하고 같은 architecture 또는 같은
          family의 새 initialization을 student로 학습합니다. Student가 teacher와
          더 비슷해지는 것과 ground truth에 더 가까워지는 것은 다르므로 세대별
          artifact와 두 지표를 분리합니다.
        </p>
        <DistillationLearningFlowViz mode="self" />
        <ContentBoundary article="self-distillation" />
      </section>
      <section
        id="generation-contract"
        className="mb-16 scroll-mt-20 space-y-6"
      >
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · generation contract
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Teacher snapshot·student initialization·data·target policy를
            세대마다 동결한다
          </h2>
        </header>
        <p>
          G0 checkpoint를 teacher로 freeze하고 G1을 새로 initialize합니다. 같은
          data split과 label anchor에서 soft target을 추가하고, G1이 승인된
          뒤에만 다음 teacher 후보가 됩니다. Teacher와 student가 같은
          process에서 동시에 움직이면 어느 세대의 신호를 배웠는지 사라집니다.
        </p>
        <ExplainedFormula
          question="한 self-distillation 세대의 update target은 어떻게 고정하는가?"
          idea={
            <>
              Teacher θg는 freeze하고 새 student θg+1만 hard·soft loss로
              update합니다. 세대 경계 뒤에만 student snapshot을 다음 teacher로
              승격합니다.
            </>
          }
          formula={String.raw`\begin{aligned}L_h&=(1-\alpha)L_y\\L_t&=\alpha L(q_g,p_\theta)\\L_{g+1}&=L_h+L_t\\\theta_{g+1}&\leftarrow\arg\min_\theta L_{g+1}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}q_g&=\underbrace{p_{\theta_g}(\cdot\mid x)}_{\text{frozen generation g target}}\\[4pt]L_h&=\underbrace{(1-\alpha)L_y}_{\text{ground-truth anchor}}\\[4pt]L_t&=\underbrace{\alpha L(q_g,p_\theta)}_{\text{직전 세대 imitation}}\\[4pt]L_{g+1}&=L_h+L_t\\[4pt]\theta_{g+1}&=\underbrace{\arg\min_\theta L_{g+1}}_{\text{새 student만 update}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`p_{\theta_g}(\cdot\mid x)`,
              annotation: [
                "승인된 이전 checkpoint를 freeze해",
                "재현 가능한 teacher target 생성",
              ],
            },
            {
              expression: String.raw`(1-\alpha)L_y+\alpha L(q_g,p_\theta)`,
              annotation: [
                "정답 anchor와 이전 세대 signal을 더해",
                "bias 복제만 하는 것을 제한",
              ],
            },
            {
              expression: String.raw`\arg\min_\theta L_{g+1}`,
              annotation: [
                "새 initialization의 student parameter만 바꿔",
                "세대별 provenance 보존",
              ],
            },
          ]}
          terms={[
            {
              symbol: "g",
              name: "generation index",
              description:
                "Frozen teacher와 새 student를 구분하는 세대 번호입니다.",
            },
            {
              symbol: String.raw`\theta_g`,
              name: "teacher snapshot",
              description: "Generation g의 변경되지 않는 parameters입니다.",
            },
            {
              symbol: String.raw`\theta_{g+1}`,
              name: "student parameters",
              description: "현재 학습하는 다음 세대입니다.",
            },
            {
              symbol: "L_y",
              name: "hard-label loss",
              description: "Ground truth에 대한 anchor입니다.",
            },
            {
              symbol: String.raw`L(q_g,p_\theta)`,
              name: "imitation loss",
              description: "Teacher와 student prediction 차이입니다.",
            },
          ]}
          assumptions={[
            "Teacher checkpoint·data split·seed를 세대 receipt에 고정합니다.",
            "Teacher는 training 동안 update하지 않습니다.",
            "다음 세대 승격은 독립 release gate 뒤에만 합니다.",
          ]}
          interpretation="같은 architecture여도 G0와 G1은 역할과 artifact가 다릅니다. Online co-training이나 EMA teacher는 별도 algorithm 계약입니다."
        />
      </section>
      <section id="inheritance-audit" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · inheritance audit
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Teacher agreement 증가에서 ground-truth quality 변화를 빼 bias
            inheritance를 찾는다
          </h2>
        </header>
        <p>
          Student가 teacher와 더 많이 일치해도 둘이 함께 틀릴 수 있습니다.
          Frozen holdout에서 agreement 변화 ΔA와 accuracy 변화 ΔQ를 같은
          percentage-point 단위로 측정합니다.
        </p>
        <ExplainedFormula
          question="Agreement는 올랐지만 accuracy가 떨어진 세대를 어떻게 표시하는가?"
          idea={
            <>
              Teacher를 닮은 정도의 증가에서 정답 quality 증가를 뺍니다.
              Agreement만 오르고 quality가 내리면 inheritance gap이 더 커집니다.
            </>
          }
          formula={String.raw`R_g=(A_{g+1}-A_g)-(Q_{g+1}-Q_g)=\Delta A_g-\Delta Q_g`}
          annotatedFormula={String.raw`\begin{aligned}\Delta A_g&=\underbrace{A_{g+1}-A_g}_{\text{teacher agreement 변화}}\\[4pt]\Delta Q_g&=\underbrace{Q_{g+1}-Q_g}_{\text{ground-truth quality 변화}}\\[4pt]R_g&=\underbrace{\Delta A_g-\Delta Q_g}_{\text{닮음이 quality보다 앞선 정도}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`A_{g+1}-A_g`,
              annotation: [
                "다음 세대 agreement에서 이전 값을 빼",
                "teacher similarity 증가량 측정",
              ],
            },
            {
              expression: String.raw`Q_{g+1}-Q_g`,
              annotation: [
                "같은 holdout의 quality 차이를 구해",
                "실제 task 개선량 측정",
              ],
            },
            {
              expression: String.raw`\Delta A_g-\Delta Q_g`,
              annotation: [
                "닮음 증가에서 quality 증가를 빼",
                "bias inheritance 의심 gap 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "A_g",
              name: "teacher agreement",
              description:
                "고정 evaluation policy에서 teacher와 prediction이 같은 비율입니다.",
            },
            {
              symbol: "Q_g",
              name: "ground-truth quality",
              description: "Frozen holdout의 accuracy 또는 task metric입니다.",
            },
            {
              symbol: "R_g",
              name: "inheritance gap",
              description:
                "Agreement gain이 quality gain을 앞선 percentage-point 차이입니다.",
            },
          ]}
          assumptions={[
            "A와 Q를 같은 evaluation set·policy·단위에서 측정합니다.",
            "Aggregate와 worst slice를 함께 계산합니다.",
            "R 하나로 인과적 bias transfer를 증명하지 않습니다.",
          ]}
          interpretation="Agreement +5%p, accuracy -1%p이면 R=6%p입니다. Teacher를 더 닮았지만 정답에서 멀어진 강한 경고입니다."
        />
        <div id="paper-born-again">
          <CitationBlock
            source="Furlanello et al. — Born Again Neural Networks"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1805.04770"
          >
            <p>
              <strong>문제:</strong> 같은 architecture의 teacher signal이 새
              student 학습에 도움이 되는지 봅니다.
            </p>
            <p>
              <strong>기여:</strong> Teacher–student generation을 반복하는
              born-again training을 평가합니다.
            </p>
            <p>
              <strong>전제:</strong> 논문의 model·dataset·generation
              recipe입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 보고된 vision benchmark와 ensemble
              결과입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 세대를 계속 반복하면 단조
              개선한다는 보장은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="stop-gate" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · stop gate</p>
          <h2 className="mt-2 text-2xl font-bold">
            Marginal gain이 작거나 worst slice가 악화되면 다음 세대를 만들지
            않는다
          </h2>
        </header>
        <p>
          세대별 independent quality, calibration, worst slice, agreement,
          compute와 student-only runtime을 비교합니다. 평균 quality가 좋아도
          보호 slice가 하락하거나 세대 비용 대비 gain이 threshold 아래면 직전
          승인 checkpoint로 rollback합니다.
        </p>
        <ExplainedFormula
          question="다음 teacher 세대로 승격할 최소 gate는 어떻게 쓰는가?"
          idea={
            <>
              평균 gain은 최소값을 넘어야 하고 모든 보호 slice 하락은 허용치
              안이어야 하며 inheritance gap도 상한 아래여야 합니다.
            </>
          }
          formula={String.raw`\Delta Q_g\ge\varepsilon,\qquad \min_k\Delta Q_{g,k}\ge-\delta,\qquad R_g\le\tau`}
          annotatedFormula={String.raw`\begin{aligned}\Delta Q_g&\ge\underbrace{\varepsilon}_{\text{최소 평균 quality gain}}\\[4pt]\min_k\Delta Q_{g,k}&\ge\underbrace{-\delta}_{\text{worst-slice 허용 하락}}\\[4pt]R_g&\le\underbrace{\tau}_{\text{inheritance gap 상한}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\Delta Q_g\ge\varepsilon`,
              annotation: [
                "평균 quality gain을 최소 threshold와 비교해",
                "미미한 세대 반복을 중단",
              ],
            },
            {
              expression: String.raw`\min_k\Delta Q_{g,k}\ge-\delta`,
              annotation: [
                "가장 나쁜 보호 slice를 골라",
                "허용 하락보다 큰 regression을 차단",
              ],
            },
            {
              expression: String.raw`R_g\le\tau`,
              annotation: [
                "agreement-quality gap을 상한과 비교해",
                "bias inheritance 위험을 제한",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\varepsilon`,
              name: "minimum useful gain",
              description: "세대 반복 비용을 정당화할 최소 평균 개선입니다.",
            },
            {
              symbol: String.raw`\delta`,
              name: "slice regression budget",
              description: "보호 slice에 허용하는 최대 하락입니다.",
            },
            {
              symbol: String.raw`\tau`,
              name: "inheritance threshold",
              description: "허용하는 agreement-quality gap 상한입니다.",
            },
            {
              symbol: "k",
              name: "protected slice",
              description: "언어·domain·안전성 등 별도 보호할 평가 묶음입니다.",
            },
          ]}
          assumptions={[
            "Threshold를 결과 보기 전에 고정합니다.",
            "Confidence interval과 sample size를 기록합니다.",
            "불통과 시 이전 승인 checkpoint로 rollback합니다.",
          ]}
          interpretation="세대 수 자체가 목표가 아닙니다. 평균·worst slice·inheritance가 모두 gate를 통과한 student만 다음 teacher 후보가 됩니다."
        />
      </section>
    </article>
  );
}
