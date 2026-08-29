import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";
import DistillationLearningFlowViz from "./viz/DistillationLearningFlowViz";
import ScopeTaxonomy from "./ScopeTaxonomy";

export default function ClassicDistillationArticle() {
  return (
    <article>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
        <header>
          <p className="text-sm font-semibold text-primary">
            먼저 무엇을 전달할지 정합니다
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            Knowledge distillation은 큰 모델을 복사하는 일이 아니라 teacher
            signal을 student target으로 번역하는 일이다
          </h2>
        </header>
        <p className="text-lg leading-8">
          Teacher는 class logit이나 hidden feature를 관측하게 해 줍니다.
          Student는 그 신호를 그대로 담을 수 없으므로 공유 class 순서,
          temperature, layer·position 대응과 projection을 먼저 고정합니다.
          Distillation loss가 작아져도 정답 성능이 좋아졌다는 뜻은 아니므로 hard
          label과 독립 test를 남깁니다.
        </p>
        <TermBreakdown
          title="Teacher model · student model · knowledge distillation이 가리키는 관계"
          description="이 글이 반복해 쓰는 세 역할의 정의입니다."
          items={[
            {
              term: "Teacher model",
              description:
                "이미 학습이 끝나 고정된 채로만 참조하는 모델입니다. Gradient를 받지 않고 student가 맞춰야 할 target만 만듭니다.",
              example: "24층·1024차원 대형 classifier가 teacher 역할을 맡습니다.",
              boundary:
                "Teacher가 크거나 유명하다는 사실이 student 품질을 보장하지 않고, teacher 자신의 오류도 그대로 target에 남습니다.",
            },
            {
              term: "Student model",
              description:
                "실제로 backprop되어 갱신되는, 대개 더 작고 배포 비용이 싼 모델입니다.",
              example: "12층·384차원 모델이 teacher의 판단을 student target으로 학습합니다.",
              boundary:
                "Student capacity가 너무 작으면 teacher signal을 아무리 잘 만들어도 담아낼 곳이 없습니다.",
            },
            {
              term: "Knowledge distillation",
              description:
                "Teacher가 관측하게 해 준 신호(logit·feature·sequence)를 student가 재현하도록 학습시키는 전체 절차의 이름입니다.",
              example:
                "이 글은 logit·feature 신호를 다루고, sequence 신호는 별도 글로 넘어갑니다.",
              boundary:
                "Distillation loss 하나만으로는 완결되지 않고 hard label과 독립 test로 최종 승인합니다.",
            },
          ]}
        />
        <DistillationLearningFlowViz mode="classic" />
        <ContentBoundary article="knowledge-distillation" />
      </section>
      <section id="soft-target" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · soft target</p>
          <h2 className="mt-2 text-2xl font-bold">
            Temperature는 class 순서를 바꾸지 않고 probability 차이를 완만하게
            만든다
          </h2>
        </header>
        <p>
          Logit은 softmax 전 class score입니다. 큰 score 하나가 probability를
          독점하면 non-target class 관계가 보이지 않습니다. 모든 logit 차이를
          같은 양수 T로 나누면 class odds가 완만해져 teacher가 여우와 고양이를
          자동차보다 비슷하게 본 정보가 남습니다.
        </p>
        <ExplainedFormula
          question="Temperature가 두 class의 teacher odds를 어떻게 바꾸는가?"
          idea={
            <>
              Logit을 T로 나눈 뒤 지수화하고 합으로 정규화합니다. 공통 분모를
              약분하면 두 class의 차이만 T로 나뉜 odds가 남습니다.
            </>
          }
          formula={String.raw`q_i^{(T)}=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}},\qquad \frac{q_i^{(T)}}{q_k^{(T)}}=e^{(z_i-z_k)/T}`}
          annotatedFormula={String.raw`\begin{aligned}a_i&=\underbrace{z_i/T}_{\text{logit 차이를 T로 축소}}\\[4pt]w_i&=\underbrace{e^{a_i}}_{\text{순서를 보존한 양수 weight}}\\[4pt]q_i^{(T)}&=\underbrace{w_i/\sum_jw_j}_{\text{합이 1인 soft target}}\\[4pt]q_i^{(T)}/q_k^{(T)}&=\underbrace{e^{(z_i-z_k)/T}}_{\text{class 상대 odds}}
\end{aligned}`}
          operations={[
            {
              expression: String.raw`z_i/T`,
              annotation: [
                "모든 class score 차이를 같은 T로 줄여",
                "분포의 sharpness를 낮춤",
              ],
            },
            {
              expression: String.raw`e^{a_i}`,
              annotation: [
                "score 순서를 유지하며 양수 weight로 바꿔",
                "softmax 정규화 준비",
              ],
            },
            {
              expression: String.raw`w_i/\sum_jw_j`,
              annotation: [
                "class weight를 전체 합으로 나눠",
                "teacher probability 생성",
              ],
            },
            {
              expression: String.raw`e^{(z_i-z_k)/T}`,
              annotation: ["공통 분모를 약분해", "두 class의 상대 선호만 측정"],
            },
          ]}
          terms={[
            {
              symbol: "z_i",
              name: "teacher logit",
              description: "Class i의 softmax 전 score입니다.",
            },
            {
              symbol: "T",
              name: "temperature",
              description: "양수이며 class odds의 sharpness를 조절합니다.",
            },
            {
              symbol: "w_i",
              name: "positive weight",
              description: "Exponentiation을 마친 class weight입니다.",
            },
            {
              symbol: "q_i^{(T)}",
              name: "soft target",
              description: "Temperature를 적용한 teacher probability입니다.",
            },
          ]}
          assumptions={[
            "Teacher와 student가 같은 class 집합·순서를 공유합니다.",
            "T>0이며 training·artifact convention을 함께 기록합니다.",
            "Teacher 오류와 calibration은 별도 held-out slice에서 평가합니다.",
          ]}
          interpretation="Logit 차이가 4이면 T=1의 odds는 e⁴≈54.6, T=2에서는 e²≈7.4입니다. 순서는 같지만 작은 class에도 더 큰 신호가 남습니다."
        />
        <p>
          Temperature가 실제로 얼마나 부드러워지는지는{" "}
          <a className="text-primary hover:underline" href="#paper-hinton-kd">
            Hinton et al.(2015)
          </a>{" "}
          원 논문의 MNIST 실험이 보여줍니다. Dropout을 쓴 큰 net은 test error
          67개, 정규화 없는 작은 net은 146개를 냈습니다. 같은 작은 net을 정답
          label 없이 T=20 soft target만으로 학습하자 오류가 74개로 줄었습니다.
        </p>
        <p>
          Baseline 146개보다 훨씬 적은 74개까지 내려간 셈이라, class 순서만
          유지한 채 완만해진 확률에도 teacher가 학습한 class 간 관계가 담겨
          있다는 뜻입니다.
        </p>
        <p>
          음성 인식 실험에서도 같은 패턴이 나옵니다. Baseline 단일 모델은 test
          frame accuracy 58.9%·WER 10.9%였고, model 10개 ensemble은
          61.1%·10.7%까지 좋아졌습니다. 그 ensemble의 soft target으로
          distillation한 단일 모델은 60.8%·10.7%를 냈고, ensemble이 만든
          개선분의 80% 이상을 student 하나가 그대로 가져갔습니다.
        </p>
      </section>
      <section id="hard-soft-loss" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · two anchors</p>
          <h2 className="mt-2 text-2xl font-bold">
            Hard label은 정답에, soft target은 teacher의 class 관계에 student를
            고정한다
          </h2>
        </header>
        <p>
          Teacher가 틀릴 수 있으므로 soft target만 모방하지 않습니다. Dataset
          label cross-entropy와 teacher-to-student forward KL을 α로 섞고, 큰
          T에서 약해지는 soft gradient를 T²로 보정합니다.
        </p>
        <ExplainedFormula
          question="Hard와 soft loss를 왜 함께 더하는가?"
          idea={
            <>
              Hard term은 ground truth를 잃지 않게 하고 soft term은 teacher가
              배분한 non-target 관계를 전달합니다. α는 두 목표 사이의 실험
              가능한 trade-off입니다.
            </>
          }
          formula={String.raw`\mathcal L=(1-\alpha)\operatorname{CE}(y,p_s)+\alpha T^2D_{\rm KL}(q_t^{(T)}\Vert p_s^{(T)})`}
          annotatedFormula={String.raw`\begin{aligned}L_h&=\underbrace{\operatorname{CE}(y,p_s)}_{\text{ground-truth anchor}}\\[4pt]L_t&=\underbrace{D_{\rm KL}(q_t^{(T)}\Vert p_s^{(T)})}_{\text{teacher 분포를 student가 덮도록}}\\[4pt]L&=\underbrace{(1-\alpha)L_h}_{\text{정답 비중}}+\underbrace{\alpha T^2L_t}_{\text{teacher 비중과 scale 보정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{CE}(y,p_s)`,
              annotation: [
                "dataset label과 student probability를 비교해",
                "정답 방향의 anchor 생성",
              ],
            },
            {
              expression: String.raw`D_{\rm KL}(q_t\Vert p_s)`,
              annotation: [
                "teacher expectation으로 student 누락을 벌줘",
                "teacher class support 전달",
              ],
            },
            {
              expression: String.raw`(1-\alpha)L_h+\alpha T^2L_t`,
              annotation: [
                "두 gradient 목표를 weight해 더하고",
                "temperature로 줄어든 soft gradient를 보정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "y",
              name: "hard label",
              description: "Dataset ground truth입니다.",
            },
            {
              symbol: "p_s",
              name: "student distribution",
              description: "Student가 낸 class probability입니다.",
            },
            {
              symbol: "q_t",
              name: "teacher distribution",
              description: "고정된 soft target입니다.",
            },
            {
              symbol: String.raw`\alpha`,
              name: "distillation weight",
              description: "Hard와 soft target 사이의 비중입니다.",
            },
            {
              symbol: "T^2",
              name: "gradient scale compensation",
              description: "큰 T의 약한 gradient를 보정하는 고전 recipe입니다.",
            },
          ]}
          assumptions={[
            "Forward KL의 input·target 순서와 reduction을 고정합니다.",
            "Teacher는 stop-gradient target입니다.",
            "α·T는 validation에서 함께 선택합니다.",
          ]}
          interpretation="α=0이면 supervised baseline, α=1이면 teacher-only imitation입니다. 둘 사이의 개선은 agreement가 아니라 독립 test quality로 승인합니다."
        />
      </section>
      <section id="feature-alignment" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · hidden bridge
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Feature distillation은 tensor를 빼기 전에 layer·position·dimension
            대응을 정의한다
          </h2>
        </header>
        <p>
          Teacher 24층·1024 channel과 student 12층·384 channel은 좌표계가
          다릅니다. 어느 layer와 token을 대응할지 정하고 student feature를
          teacher dimension으로 보내는 projection을 둡니다. Shape가 같아져도
          의미가 같다는 보장은 없습니다.
        </p>
        <ExplainedFormula
          question="서로 다른 hidden shape를 어떤 bridge로 비교하는가?"
          idea={
            <>
              Student hidden을 trainable projection으로 teacher channel에 맞추고
              aligned position의 차이를 평균합니다.
            </>
          }
          formula={String.raw`L_{\rm feat}=\frac1{BLC_t}\left\|H_t^{(\ell_t)}-r_\phi(H_s^{(\ell_s)})\right\|_F^2`}
          annotatedFormula={String.raw`\begin{aligned}\widehat H_s&=\underbrace{r_\phi(H_s^{(\ell_s)})}_{\text{student를 teacher shape로 projection}}\\[4pt]\Delta&=\underbrace{H_t^{(\ell_t)}-\widehat H_s}_{\text{대응 layer·position의 차이}}\\[4pt]L_{\rm feat}&=\underbrace{\|\Delta\|_F^2/(BLC_t)}_{\text{비교 원소 수로 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`r_\phi(H_s)`,
              annotation: [
                "student channel·resolution을 변환해",
                "teacher feature와 뺄 수 있는 shape 생성",
              ],
            },
            {
              expression: String.raw`H_t-\widehat H_s`,
              annotation: [
                "고정한 layer·position끼리 빼",
                "representation discrepancy 생성",
              ],
            },
            {
              expression: String.raw`\|\Delta\|_F^2/(BLC_t)`,
              annotation: [
                "모든 유효 원소의 제곱 차이를 합하고",
                "원소 수로 나눠 loss scale 고정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "H_t,H_s",
              name: "teacher and student features",
              description: "선택한 layer의 hidden tensors입니다.",
            },
            {
              symbol: String.raw`r_\phi`,
              name: "feature projection",
              description: "Student shape를 teacher shape에 맞춥니다.",
            },
            {
              symbol: String.raw`\ell_t,\ell_s`,
              name: "layer pair",
              description: "대응한다고 선언한 두 layer입니다.",
            },
            {
              symbol: "B,L,C_t",
              name: "normalization axes",
              description: "Batch·aligned positions·teacher channels입니다.",
            },
          ]}
          assumptions={[
            "Example와 token/spatial position이 정렬됩니다.",
            "Padding은 mask로 제외합니다.",
            "Projection이 export graph에 남는지 명시합니다.",
          ]}
          interpretation="384→1024 projection은 뺄셈을 가능하게 할 뿐 semantic alignment를 증명하지 않습니다. Output metric과 ablation을 함께 봅니다."
        />
        <div id="paper-hinton-kd">
          <CitationBlock
            source="Hinton et al. — Distilling the Knowledge in a Neural Network"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1503.02531"
          >
            <p>
              <strong>문제:</strong> 비싼 ensemble behavior를 작은 model로
              옮깁니다.
            </p>
            <p>
              <strong>기여:</strong> Temperature soft target과 hard target의
              결합을 제안합니다.
            </p>
            <p>
              <strong>전제:</strong> 공유 class interface와 논문의 model·dataset
              조건입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> MNIST·speech·specialist ensemble
              실험입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 모든 작은 student가 teacher
              quality를 보존한다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
        <div id="paper-fitnets">
          <CitationBlock
            source="Romero et al. — FitNets"
            citeKey={2}
            type="paper"
            href="https://arxiv.org/abs/1412.6550"
          >
            <p>
              <strong>문제:</strong> 얇은 student의 intermediate optimization을
              돕습니다.
            </p>
            <p>
              <strong>기여:</strong> Hint layer와 regressor를 둔 feature
              distillation을 제안합니다.
            </p>
            <p>
              <strong>전제:</strong> 논문의 CNN·hint mapping·두 단계
              training입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> CIFAR·SVHN 계열 실험입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 임의 layer raw MSE가 항상
              유리하다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <ScopeTaxonomy />
      <section id="release-gate" className="mb-16 scroll-mt-20 space-y-5">
        <header>
          <p className="text-sm font-semibold text-primary">
            05 · release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Teacher agreement가 아니라 student-only quality·memory·latency로
            승인한다
          </h2>
        </header>
        <p>
          같은 base·data·seed에서 hard-label baseline과 비교하고 teacher
          agreement, independent test quality, calibration, worst slice와 실제
          student-only runtime을 별도 열로 남깁니다. Teacher가 text만 제공하는
          경우는{" "}
          <a
            className="text-primary hover:underline"
            href="/ai/sequence-distillation"
          >
            sequence distillation
          </a>
          로 넘어갑니다.
        </p>
      </section>
    </article>
  );
}
