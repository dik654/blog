import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TaskArithmeticMergeViz from "./fine-tuning-tradeoffs-forgetting-and-merging/viz/TaskArithmeticMergeViz";

/**
 * ai/fine-tuning-tradeoffs-forgetting-and-merging
 * 작성 규칙: docs/coverage-batch-playbook.md
 */
export default function FineTuningTradeoffsForgettingAndMergingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="goal-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Fine-tuning은 무엇을 바꾸는지에 따라 다섯 갈래로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Fine-tuning이라는 한 단어 안에는 실제로 서로 다른 목적이 섞여
            있습니다. 지시를 따르게 만드는 fine-tuning, 특정 분야 지식을
            넣는 fine-tuning, 특정 작업 하나만 잘하게 만드는 fine-tuning,
            말투를 바꾸는 fine-tuning, 정책상 특정 행동을 하거나 하지 않게
            만드는 fine-tuning은 필요한 데이터와 뒤이어 생기는 forgetting
            위험이 서로 다릅니다.
          </p>
          <p>
            <Link to="/ai/lora-finetuning">LoRA·QLoRA 글</Link>이 다룬
            adapter 메커니즘은 이 다섯 목적 어디에도 그대로 쓸 수 있는
            update 방식입니다. 이 글은 메커니즘이 아니라{" "}
            <strong>무엇을 바꾸려는 fine-tuning인지</strong>를 먼저
            구분한 뒤, 그 선택이 데이터 분포·forgetting·model merging
            판단으로 어떻게 이어지는지를 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="다섯 가지 fine-tuning 목표 축"
          description="같은 학습 절차라도 무엇을 목표로 걸었는지에 따라 데이터를 고르는 기준과 실패로 볼 지표가 달라집니다."
          items={[
            {
              term: "Instruction Fine-Tuning",
              description:
                "임의의 지시(instruction)를 이해하고 그 형식대로 응답하는 일반 능력을 넣습니다. Instruction Fine-Tuning Dataset은 (지시, 입력, 응답) 삼중항을 다양한 task 유형에 걸쳐 모은 데이터입니다.",
              example:
                "요약·번역·코드 작성처럼 서로 다른 지시 수만 건을 섞은 데이터셋 하나로 학습합니다.",
              boundary:
                "특정 분야 지식이나 특정 회사 정책을 새로 넣지는 않습니다.",
            },
            {
              term: "Domain Fine-Tuning",
              description:
                "의료·법률·특정 사내 코드베이스처럼 한 분야의 어휘·사실·문체를 모델에 넣습니다.",
              example:
                "판례 원문과 해설 수백만 토큰을 계속 학습해 법률 용어 문맥을 맞추게 합니다.",
              boundary:
                "분야 지식이 늘어도 지시를 따르는 형식 능력이 저절로 좋아지지는 않습니다.",
            },
            {
              term: "Task Fine-Tuning",
              description:
                "분류·추출·특정 API 호출 형식처럼 출력 형태가 고정된 작업 하나만 잘하게 만듭니다.",
              example:
                "영수증 이미지에서 금액·날짜만 뽑아 고정된 JSON 스키마로 내보내게 학습합니다.",
              boundary:
                "그 task 밖의 자유 형식 대화 능력은 목표에 포함하지 않습니다.",
            },
            {
              term: "Style Fine-Tuning",
              description:
                "사실이나 능력이 아니라 말투·어조·문장 길이 같은 표현 방식을 바꿉니다.",
              example:
                "같은 답변 내용을 존댓말·간결체로만 다시 쓰도록 예시 쌍을 학습시킵니다.",
              boundary:
                "내용의 정확도를 개선하는 목표가 아니므로 사실 오류를 줄이지는 못합니다.",
            },
            {
              term: "Behavior Fine-Tuning",
              description:
                "특정 요청을 거절하거나, 특정 절차를 반드시 따르는 것처럼 정책 수준의 행동 규칙을 넣습니다.",
              example:
                "위험한 요청 앞에서 거절 문구와 대안 제시 순서를 항상 따르도록 학습합니다.",
              boundary:
                "행동 규칙이 늘어난 만큼 다른 요청에 과도하게 거절하는 부작용을 함께 확인해야 합니다.",
            },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            데이터 규모도 목적마다 다릅니다. 예를 들어 instruction
            fine-tuning은 다양한 task 유형을 수만 건만 모아도 형식 일반화가
            시작되는 경우가 흔하지만, domain fine-tuning은 그 분야 어휘
            분포를 안정적으로 덮으려면 수억 토큰 이상의 continued
            pretraining 규모 코퍼스가 필요한 경우가 많습니다. 아래 절에서
            이 규모 차이가 만드는 tradeoff를 봅니다.
          </p>
        </div>
        <ContentBoundary article="fine-tuning-tradeoffs-forgetting-and-merging" />
      </section>

      <section id="data-tradeoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          목적이 다르면 필요한 데이터 분포와 규모도 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Fine-tuning 데이터를 고를 때 답이 갈리는 질문은 규모가 아니라
            분포입니다. Fine-tuning distribution, 즉 학습 데이터가 실제
            배포 시점 입력 분포를 얼마나 대표하는지가 데이터 양보다 먼저
            결과를 결정합니다.
          </p>
          <p>
            좁고 정제된 데이터 1만 건이 넓고 지저분한 데이터 10만 건보다
            나은 경우가 많습니다. 이 dataset size vs quality tradeoff는,
            양을 늘려 얻는 분포 커버리지 이득이 노이즈·중복·라벨 오류가
            함께 늘어나는 비용보다 큰지로 판단합니다.
          </p>
          <p>
            예를 들어 같은 분류 task에서 정제 데이터 2,000건으로 held-out
            정확도 91%를 얻었는데, 중복과 오라벨이 섞인 원본 20,000건을
            그대로 쓰면 정확도가 87%로 오히려 떨어지는 경우가 흔히
            보고됩니다. 데이터를 10배 늘렸는데 품질 저하가 그 이득을
            상쇄한 것입니다.
          </p>
          <p>
            분포가 좁을수록 생기는 또 다른 위험이 fine-tuning
            overfitting입니다. 학습 데이터의 특정 문구·순서·길이 패턴을
            암기해, 같은 의미라도 표현만 다른 held-out 입력에서 성능이
            갑자기 나빠지는 현상입니다. Epoch을 늘릴수록 train loss는
            계속 줄어드는데 held-out 정확도는 어느 지점부터 꺾이는
            곡선으로 관찰됩니다.
          </p>
        </div>
      </section>

      <section id="forgetting" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          새 목적을 학습할수록 기존 능력은 조용히 깎여 나갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Catastrophic forgetting은 새 데이터로 fine-tuning할 때
            parameter가 그 새 목표에 맞춰 움직이면서, 이전에 잘하던 다른
            능력의 성능이 급격히 나빠지는 현상입니다. 새 task를 배우는
            것과 옛 task를 잊는 것이 같은 gradient step 안에서 함께
            일어난다는 뜻입니다.
          </p>
          <p>
            좁은 domain 데이터로 오래 fine-tuning할수록 이 위험이
            커집니다. 예를 들어 법률 domain 코퍼스로 fine-tuning한 뒤
            일반 상식 benchmark 정확도가 68%에서 61%로 7%p 떨어지는
            식입니다. 법률 용어 정확도는 올랐지만 그 대가로 다른 능력이
            깎였습니다.
          </p>
          <p>
            이 하락폭을 capability regression이라고 부릅니다. Forgetting이
            현상의 이름이라면 capability regression은 그 결과로 held-out
            benchmark 점수가 실제로 낮아진 측정치를 가리키는 이름입니다.
          </p>
        </div>
        <CitationBlock
          source="McCloskey, M. & Cohen, N. J. · Catastrophic Interference in Connectionist Networks: The Sequential Learning Problem (Psychology of Learning and Motivation, 1989)"
          citeKey={1}
          href="https://doi.org/10.1016/S0079-7421(08)60536-8"
        >
          연결주의 신경망이 새 항목을 순차 학습할 때 이전에 학습한 항목의
          표현이 급격히 무너지는 현상을 처음 정식화한 논문입니다. 원
          실험은 소규모 역전파 신경망의 순차 학습 과제로 제한되며, 현재
          LLM fine-tuning 규모에서의 정량적 하락폭까지 그대로
          일반화한다는 주장은 아닙니다.
        </CitationBlock>
        <ProgressiveDetail
          title="왜 이 현상에 'catastrophic'이라는 이름이 붙었는가"
          preview="이전 지식의 손실이 점진적이지 않고 특정 시점부터 급격히 일어나기 때문입니다. 다만 급격함의 정도는 task 유사도와 learning rate에 따라 달라집니다."
        >
          <p>
            McCloskey와 Cohen의 원 실험은 순서대로 제시되는 항목을
            학습하는 작은 신경망에서, 새 항목 학습이 시작되자마자 이전
            항목의 재현율이 몇 step 만에 무너지는 것을 보였습니다.
            급격함의 정도는 이후 연구에서 새 task와 이전 task의 유사도,
            learning rate, fine-tuning 길이에 따라 완만할 수도 있다는
            것이 함께 보고되었습니다. 결론은 이름처럼 항상 파국적이라는
            뜻이 아니라, 점진적 완충 장치가 없으면 급격해질 수 있다는
            것입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="mitigation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Forgetting은 재현·완화·측정을 함께 설계해야 잡힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Forgetting을 줄이려면 학습이 시작되기 전에 무엇을 지킬지
            정의하고, 학습 중에는 그 방향으로 이동을 억제하고, 학습 후에는
            실제로 지켜졌는지 측정하는 세 가지를 함께 설계해야 합니다.
          </p>
          <p>
            Forgetting evaluation은 그 측정 방법입니다. 목표 task와
            무관한 held-out general benchmark 점수를 fine-tuning 전후로
            비교해 하락폭을 하나의 숫자로 남깁니다. 이 절 앞부분의
            68%에서 61%로의 하락이 그 값입니다.
          </p>
          <p>
            Data replay는 완화 방법 중 가장 직접적입니다. Fine-tuning
            배치 안에 원래 general instruction 데이터를 일정 비율 섞어,
            모델이 새 목표만 보지 않고 옛 분포도 계속 보게 만듭니다.
            예를 들어 domain 데이터에 general 데이터를 10% 섞으면 앞의
            7%p 하락이 2%p까지 줄어드는 식으로 보고됩니다.
          </p>
          <p>
            Regularization against drift는 데이터를 섞는 대신 loss
            항에 페널티를 더해 parameter가 base 값에서 너무 멀리 움직이지
            못하게 막는 방법입니다. 이동 자체를 제한하므로 data replay와
            함께 쓸 수 있고, 어떤 parameter를 얼마나 억제할지 정하는
            구체적인 계산은{" "}
            <Link to="/ai/continual-learning-foundations#stability-plasticity">
              continual learning 글
            </Link>
            의 stability–plasticity dilemma에서 Fisher information
            기반 페널티로 이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="세 완화 기법이 답하는 서로 다른 질문"
          items={[
            {
              term: "Forgetting Evaluation",
              description:
                "얼마나 잊었는지를 숫자로 남기는 측정입니다.",
              example: "법률 fine-tuning 전후 상식 benchmark 68%→61%.",
              boundary: "측정만 하고 학습 방식 자체를 바꾸지는 않습니다.",
            },
            {
              term: "Data Replay",
              description: "옛 분포를 배치에 다시 섞어 노출을 유지합니다.",
              example: "domain 90% + general 10% 비율로 배치 구성.",
              boundary: "원본 replay 데이터를 보관·재사용할 권리가 있어야 합니다.",
            },
            {
              term: "Regularization Against Drift",
              description:
                "이동 자체를 loss 페널티로 제한합니다.",
              example: "base 대비 parameter 변화량에 비례하는 항을 loss에 더함.",
              boundary:
                "페널티가 너무 크면 새 task 학습(plasticity)이 함께 억제됩니다.",
            },
          ]}
        />
      </section>

      <section id="merging" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Model merging은 벡터 연산으로 여러 fine-tuning을 합칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 base에서 서로 다른 목적으로 fine-tuning한 여러 checkpoint를
            재학습 없이 하나로 합치는 것이 model merging입니다. 가장 단순한
            형태가 weight interpolation, 즉 여러 checkpoint의 parameter를
            좌표별로 평균 내는 것입니다.
          </p>
          <p>
            Weight interpolation이 작동하려면 두 checkpoint가 같은
            loss landscape의 연결된 낮은 지점(basin)에 있어야 합니다.
            Model Soups는 hyperparameter만 바꿔 fine-tuning한
            checkpoint들이 실제로 이 조건을 자주 만족한다는 것을
            ImageNet 계열 실험으로 보였습니다.
          </p>
        </div>
        <CitationBlock
          source="Wortsman, M. et al. · Model soups: averaging weights of multiple fine-tuned models improves accuracy without increasing inference time (ICML, 2022)"
          citeKey={2}
          href="https://arxiv.org/abs/2203.05482"
        >
          같은 base에서 hyperparameter만 바꿔 fine-tuning한 checkpoint들의
          weight를 평균 내는 uniform soup와, 검증 점수가 오르는 checkpoint만
          순서대로 더하는 greedy soup를 비교해 앙상블과 달리 추론 비용
          증가 없이 정확도를 올렸습니다. 실험은 이미지 분류 계열 모델과
          논문이 다룬 hyperparameter sweep 범위로 제한됩니다.
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Task arithmetic은 평균을 넘어, 각 fine-tuned 모델이 base에서
            이동한 방향(task vector)만 따로 뽑아 더하거나 빼는 방법입니다.
            평균은 방향을 무디게 섞지만, task arithmetic은 방향을 그대로
            보존한 채 합치므로 여러 능력을 동시에 편집할 수 있습니다.
          </p>
        </div>
        <ExplainedFormula
          question="여러 fine-tuned 모델의 차이를 재학습 없이 하나의 weight로 합치려면 어떻게 해야 하는가"
          idea="각 fine-tuned 모델이 base에서 이동한 방향만 벡터로 뽑아내면, 그 방향들을 더하고 빼는 것만으로 base 위에 새 행동을 편집할 수 있습니다."
          formula={String.raw`\theta_{new} = \theta_{pre} + \lambda \sum_{t=1}^{T} \left(\theta_{ft}^{(t)} - \theta_{pre}\right)`}
          annotatedFormula={String.raw`\theta_{new} = \theta_{pre} + \lambda \underbrace{\sum_{t=1}^{T} \underbrace{\left(\theta_{ft}^{(t)} - \theta_{pre}\right)}_{\text{task vector } \tau_t}}_{\text{합친 delta}}`}
          operations={[
            {
              expression: String.raw`\theta_{ft}^{(t)} - \theta_{pre}`,
              annotation: [
                "task t로만 fine-tuning한 weight에서 base weight를 빼",
                "그 task가 학습 중 이동한 방향과 크기(task vector)만 남깁니다",
              ],
            },
            {
              expression: String.raw`\sum_{t=1}^{T} \tau_t`,
              annotation: [
                "서로 다른 task의 방향 벡터를 좌표별로 더해",
                "한 base 위에서 여러 능력을 동시에 편집할 delta를 만듭니다",
              ],
            },
            {
              expression: String.raw`\lambda`,
              annotation:
                "task마다 다른 계수가 아니라 합쳐진 delta 전체에 곱하는 단일 세기 계수입니다",
            },
          ]}
          terms={[
            { symbol: String.raw`\theta_{pre}`, name: "Base weight", description: "여러 fine-tuning이 공유하는 시작 parameter" },
            { symbol: String.raw`\theta_{ft}^{(t)}`, name: "Task t의 fine-tuned weight", description: "task t 데이터로만 fine-tuning을 마친 checkpoint" },
            { symbol: String.raw`\tau_t`, name: "Task vector", description: "task t가 base에서 이동한 방향" },
            { symbol: String.raw`\lambda`, name: "Scaling coefficient", description: "합친 delta를 base에 더하는 세기" },
          ]}
          assumptions={[
            "모든 θ가 같은 architecture와 같은 base parameter에서 시작한 fine-tuning 결과",
            "task vector들이 좌표 공간에서 서로 심하게 간섭하지 않는 상대적으로 독립인 방향",
          ]}
          interpretation="λΣτ_t를 base에 그대로 더한다는 것은 재학습 없이 여러 fine-tuning 결과를 한 checkpoint로 합칠 수 있다는 뜻입니다. 동시에 task 수가 늘거나 두 task가 상충하는 방향으로 학습됐다면 이 합이 한쪽 task 성능을 깎을 수 있다는 한계도 함께 읽어야 합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            예를 들어 base를 원점 (0, 0)으로 두는 2차원 toy 예에서 domain
            fine-tuning이 τ_domain=(0.6, −0.2)로, style fine-tuning이
            τ_style=(−0.1, 0.5)로 이동했다면, λ=1일 때 새 weight는
            θ_new=(0.5, 0.3)이 됩니다. Domain 방향과 style 방향이 각각
            보존된 채 한 지점으로 합쳐진 것입니다.
          </p>
        </div>
        <TaskArithmeticMergeViz />
        <AlgorithmBlock
          title="Task arithmetic으로 여러 fine-tuning 합치기"
          input={[
            "Base checkpoint θ_pre",
            "Task별 fine-tuned checkpoint θ_ft^(1..T)",
            "Scaling coefficient λ (기본값 1.0에서 탐색 시작)",
          ]}
          steps={[
            { code: "for t in 1..T: tau[t] = theta_ft[t] - theta_pre", note: "각 task가 base에서 이동한 방향만 남깁니다." },
            { code: "combined = sum(tau[t] for t in 1..T)", note: "방향을 좌표별로 더합니다. 모든 checkpoint가 같은 architecture여야 합니다." },
            { code: "theta_new = theta_pre + lambda * combined", note: "base 위에 스케일된 합을 더해 새 weight를 만듭니다." },
            { code: "score[t] = eval(theta_new, held_out_task[t])", note: "task별 held-out 점수와 forgetting probe를 함께 측정합니다." },
          ]}
          output="여러 fine-tuning 능력을 합친 checkpoint θ_new와 task별 평가 점수"
          repeatUntil="λ를 grid로 바꿔가며 task 평균 점수가 최대인 지점을 찾을 때까지"
        />
        <CitationBlock
          source="Ilharco, G. et al. · Editing Models with Task Arithmetic (arXiv:2212.04089, 2022)"
          citeKey={3}
          href="https://arxiv.org/abs/2212.04089"
        >
          Fine-tuned weight에서 base weight를 뺀 task vector를 더하거나
          부호를 뒤집어 여러 task 성능을 동시에 올리거나 특정 행동을
          지우는 model editing을 제시했습니다. 실험은 논문이 다룬 vision·
          NLP fine-tuning task 조합으로 제한되며, 임의의 task 쌍에서
          간섭이 없다는 보장은 아닙니다.
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            LoRA adapter를 base weight에 합치는 것과 model merging은
            이름은 비슷하지만 다른 연산입니다.{" "}
            <Link to="/ai/lora-finetuning#practice">LoRA merge</Link>는
            하나의 adapter 분기를 같은 값을 유지한 채 행렬 곱의
            분배법칙으로 base에 흡수하는 동치 변환이고, model merging은
            여러 개의 서로 다른 fine-tuned 모델을 평균이나 벡터 합으로
            섞어 값 자체가 달라지는 새 checkpoint를 만드는 연산입니다.
          </p>
        </div>
      </section>

      <section id="checkpoint-ablation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Checkpoint 선택과 ablation이 merging 전 마지막 판정입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여러 checkpoint를 merge하기 전에, 각 fine-tuning 결과 중 어느
            checkpoint를 최종 후보로 남길지 정하는 것이 checkpoint
            selection입니다. 목표 task 점수만 보면 forgetting이 심한
            checkpoint를 고를 수 있으므로 두 지표를 함께 봅니다.
          </p>
          <p>
            Fine-tuning ablation은 학습 조건 중 하나씩만 빼거나 바꿔
            그 조건이 결과에 실제로 얼마나 기여했는지 확인하는 절차입니다.
            데이터 replay 비율, learning rate schedule, epoch 수를 각각
            하나씩 원래 값에서 바꿔 checkpoint selection에 쓸 두 지표가
            어떻게 움직이는지 비교합니다.
          </p>
        </div>
        <AlgorithmBlock
          title="목표 task 성능과 forgetting을 함께 반영하는 checkpoint 선택"
          input={[
            "학습 중 저장된 checkpoint 목록",
            "목표 task held-out 평가셋",
            "forgetting probe(원래 능력 benchmark)와 base 점수",
          ]}
          steps={[
            { code: "for ckpt in checkpoints: task_score = eval(ckpt, target_task)", note: "checkpoint마다 목표 task 성능을 잽니다." },
            { code: "forget_score = base_probe_score - eval(ckpt, probe_benchmark)", note: "probe benchmark 점수 하락폭으로 forgetting을 잽니다." },
            { code: "utility = task_score - alpha * forget_score", note: "두 지표를 하나의 목적함수로 합칩니다. alpha는 forgetting에 대한 민감도입니다." },
            { code: "best = argmax_over(checkpoints, utility)", note: "utility가 가장 큰 checkpoint를 최종 후보로 남깁니다." },
          ]}
          output="목표 task 성능과 forgetting을 함께 반영해 고른 checkpoint 하나"
        />
        <ProgressiveDetail
          title="Ablation 결과를 읽을 때 흔히 하는 과잉 해석"
          preview="한 조건을 뺐을 때 utility가 떨어졌다고 그 조건이 유일한 원인이라고 단정할 수 없습니다. 다른 조건과의 상호작용이 남아 있을 수 있습니다."
        >
          <p>
            예를 들어 data replay를 껐을 때 utility가 떨어졌다고 해서
            replay 비율만 올리면 항상 좋아진다는 뜻은 아닙니다.
            Learning rate schedule과 replay 비율이 함께 바뀌는
            상호작용이 있을 수 있으므로, 한 번에 하나씩 바꾸는 ablation은
            그 조건 하나의 한계 효과만 알려 줍니다. 여러 조건을 동시에
            바꾼 효과는 별도로 확인해야 합니다.
          </p>
        </ProgressiveDetail>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: fine-tuning 하나가 아니라 모델이 배포된 뒤 계속
          업데이트되는 상황의 stability–plasticity, replay buffer,
          parameter isolation, update cadence는{" "}
          <Link to="/ai/continual-learning-foundations">
            continual learning 글
          </Link>
          에서 이어집니다.
        </p>
      </section>
    </div>
  );
}
