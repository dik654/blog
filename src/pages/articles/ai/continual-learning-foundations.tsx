import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ReplayBufferForgettingViz from "./continual-learning-foundations/viz/ReplayBufferForgettingViz";

/**
 * ai/continual-learning-foundations
 * 작성 규칙: docs/coverage-batch-playbook.md
 */
export default function ContinualLearningFoundationsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="learning-modes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          모델을 언제·어떻게 갱신하는지가 학습 방식을 가릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/fine-tuning-tradeoffs-forgetting-and-merging">
              이전 글
            </Link>
            은 fine-tuning 한 번의 목적과 forgetting을 다뤘습니다. 실제
            배포된 모델은 한 번으로 끝나지 않고 계속 갱신됩니다.{" "}
            <strong>Continual learning</strong>은 특정 task 경계 없이
            배포 기간 내내 새 데이터를 반영하는 이 반복 갱신 전체를
            가리키는 이름입니다.
          </p>
          <p>
            그 반복 안에서도 데이터를 다루는 방식이 갈립니다. 가진 데이터를
            한 번에 모아 학습하는지, 들어오는 데이터를 그때그때 즉시
            반영하는지, 이전 모델에 새 데이터 조각만 이어 붙이는지에 따라
            뒤에 나올 forgetting 위험과 필요한 인프라가 달라집니다.
          </p>
        </div>
        <TermBreakdown
          title="학습 데이터를 다루는 네 가지 방식"
          description="네 이름 모두 '언제 데이터를 반영하는가'라는 같은 질문에 대한 서로 다른 답입니다."
          items={[
            {
              term: "Offline Learning",
              description:
                "가진 데이터셋 전체를 한 번에 모아 놓고 학습을 마친 뒤 배포합니다.",
              example: "수집을 끝낸 100만 건 데이터로 한 번 학습해 고정된 모델을 내보냅니다.",
              boundary: "배포 후 들어오는 새 데이터는 다음 학습 사이클까지 반영되지 않습니다.",
            },
            {
              term: "Online Learning",
              description:
                "데이터가 들어오는 즉시, 하나씩 또는 작은 배치 단위로 바로 parameter를 갱신합니다.",
              example: "사용자 클릭이 들어올 때마다 그 샘플로 즉시 한 step 학습합니다.",
              boundary: "한 번 본 데이터를 나중에 다시 학습에 쓰지 않는 경우가 많아 노이즈에 취약합니다.",
            },
            {
              term: "Incremental Learning",
              description:
                "이전에 학습을 마친 모델에 새로 모인 데이터 조각(batch)을 이어 붙여 갱신합니다.",
              example: "매주 새로 쌓인 데이터 10만 건으로 지난주 모델을 이어서 추가 학습합니다.",
              boundary: "온라인 학습처럼 매 샘플마다 갱신하지는 않고, 일정 단위로 묶어 갱신합니다.",
            },
            {
              term: "Continual Learning",
              description:
                "위 세 방식 중 무엇을 쓰든, 특정 task 하나로 끝나지 않고 배포 기간 내내 새 task·새 분포를 계속 반영하는 상위 개념입니다.",
              example: "이번 달은 상품 분류, 다음 달은 신규 카테고리 분류를 이어서 학습합니다.",
              boundary: "이름이 강조하는 것은 갱신 빈도가 아니라 task·분포가 계속 바뀐다는 점입니다.",
            },
          ]}
        />
        <CitationBlock
          source="De Lange, M. et al. · A continual learning survey: Defying forgetting in classification tasks (IEEE TPAMI, 2021)"
          citeKey={1}
          href="https://arxiv.org/abs/1909.08383"
        >
          Continual learning 방법을 replay·regularization-based·parameter
          isolation 계열로 정리하고, stability–plasticity tradeoff를
          분석 틀로 제시하며 11개 방법과 4개 baseline을 여러 classification
          benchmark에서 비교했습니다. 실험은 논문이 다룬 classification
          task와 벤치마크 범위로 제한됩니다.
        </CitationBlock>
        <ContentBoundary article="continual-learning-foundations" />
      </section>

      <section id="stability-plasticity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          새 지식을 받아들일수록 옛 지식은 흔들립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Stability–plasticity dilemma는 continual learning 전체가
            절충해야 하는 근본 긴장입니다. 새 데이터를 잘 반영하는
            능력(plasticity)을 높이면 이전 지식을 지키는 능력(stability)이
            떨어지고, 안정성을 높이면 새 정보 반영이 느려집니다.
          </p>
          <p>
            <Link to="/ai/fine-tuning-tradeoffs-forgetting-and-merging#forgetting">
              앞 글의 catastrophic forgetting
            </Link>
            은 이 dilemma에서 stability가 무너진 한 사례입니다. Continual
            learning은 forgetting을 한 번의 사고가 아니라, 매 갱신마다
            반복해서 관리해야 하는 상시 tradeoff로 봅니다.
          </p>
          <p>
            이 tradeoff를 다루는 세 갈래 전략이 있습니다. 이전 데이터를
            다시 보여주거나, parameter 이동을 억제하거나, 아예 새 task를
            위한 자리를 따로 마련하는 것입니다. 다음 절에서 순서대로
            봅니다.
          </p>
        </div>
      </section>

      <section id="strategies" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Stability를 지키는 세 갈래 전략이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Experience replay는 가장 직접적인 전략입니다. 이전에 본 데이터
            일부를 replay buffer라는 고정 크기 저장소에 남겨 두고, 새
            데이터를 학습할 때 이 buffer에서 표본을 뽑아 함께 학습시켜
            이전 분포에 대한 노출을 계속 유지합니다.
          </p>
          <p>
            Buffer 크기와 forgetting은 뚜렷한 관계를 보입니다. 예를 들어
            task A를 90% 정확도로 학습한 뒤 task B를 배우면, buffer 없이는
            task A 정확도가 55%까지 떨어지고, task A 데이터의 1%만
            buffer에 남겨도 78%로, 10%면 85%로 회복됩니다. Buffer를 50%까지
            늘려도 87%로 개선폭은 작아, 저장 비용 대비 이득이 줄어드는
            지점이 존재합니다.
          </p>
        </div>
        <ReplayBufferForgettingViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Regularization-based continual learning은 데이터를 저장하지
            않고, 이전 task에 중요했던 parameter일수록 그 값에서 멀어지는
            것을 loss 페널티로 억제합니다. Elastic Weight Consolidation
            (EWC)이 이 계열의 대표 방법으로, 각 parameter의 중요도를
            Fisher information으로 근사합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Task A를 잊지 않으면서 task B를 배우려면 어떤 parameter를 얼마나 강하게 지켜야 하는가"
          idea="Task A를 학습한 직후 각 parameter가 그 성능에 얼마나 민감했는지를 Fisher information으로 재고, task B를 학습할 때 민감했던 parameter일수록 원래 값에서 멀어지지 못하게 페널티를 겁니다."
          formula={String.raw`L(\theta) = L_B(\theta) + \sum_i \frac{\lambda}{2} F_i \left(\theta_i - \theta^{*}_{A,i}\right)^2`}
          annotatedFormula={String.raw`L(\theta) = \underbrace{L_B(\theta)}_{\text{task B loss}} + \underbrace{\sum_i \underbrace{\frac{\lambda}{2} F_i}_{\text{parameter } i \text{ 중요도}} \underbrace{\left(\theta_i - \theta^{*}_{A,i}\right)^2}_{\text{task A 최적값에서 이동한 정도}}}_{\text{stability penalty}}`}
          operations={[
            {
              expression: String.raw`F_i`,
              annotation: [
                "Task A를 학습한 뒤 log-likelihood의 곡률(이차 미분)로 근사한",
                "parameter i가 task A 성능에 얼마나 중요했는지의 척도입니다",
              ],
            },
            {
              expression: String.raw`(\theta_i - \theta^{*}_{A,i})^2`,
              annotation: [
                "현재 값이 task A를 막 끝냈을 때의 최적값에서",
                "얼마나 멀어졌는지를 제곱으로 측정합니다",
              ],
            },
            {
              expression: String.raw`\lambda`,
              annotation: "Stability(옛 task 보존)와 plasticity(새 task 학습) 사이 절충 정도를 정하는 전역 계수입니다",
            },
          ]}
          terms={[
            { symbol: String.raw`L_B(\theta)`, name: "Task B loss", description: "현재 학습 중인 task B에 대한 표준 학습 loss" },
            { symbol: String.raw`F_i`, name: "Fisher information", description: "parameter i가 이전 task A에 얼마나 중요했는지의 근사치" },
            { symbol: String.raw`\theta^{*}_{A,i}`, name: "Task A 최적 parameter", description: "task A 학습 직후 parameter i의 값" },
            { symbol: String.raw`\lambda`, name: "Stability 계수", description: "페널티 전체의 세기" },
          ]}
          assumptions={[
            "Fisher information을 diagonal로 근사해 parameter 사이 상관은 무시합니다",
            "Task A와 task B가 순서대로, 경계가 분명하게 주어집니다",
          ]}
          interpretation="F_i가 큰 parameter일수록 페널티 항의 가중치가 커져 task B를 학습해도 거의 움직이지 못하고, F_i가 작은 parameter는 자유롭게 새 task에 맞춰집니다. 한 모델 안에서 parameter마다 stability와 plasticity를 다르게 배분한다는 뜻이며, task 수가 늘어날수록 페널티가 겹쳐 쌓여 plasticity 자체가 줄어드는 한계가 있습니다."
        />
        <AlgorithmBlock
          title="Task A 이후 EWC로 task B를 학습하는 절차"
          input={[
            "Task A 학습을 마친 parameter θ*_A",
            "Task A held-out 표본으로 추정한 Fisher information F",
            "Task B 학습 데이터와 stability 계수 λ",
          ]}
          steps={[
            { code: "F = estimate_fisher(theta_A_star, task_A_samples)", note: "Task A 표본에서 parameter별 log-likelihood 곡률을 근사합니다." },
            { code: "for batch in task_B: penalty = sum(lambda/2 * F * (theta - theta_A_star) ** 2)", note: "Parameter별 중요도(F)로 가중한 이동 페널티를 계산합니다." },
            { code: "loss = L_B(theta, batch) + penalty", note: "새 task loss에 stability penalty를 더합니다." },
            { code: "theta = theta - lr * grad(loss, theta)", note: "F가 큰 parameter는 gradient가 상쇄돼 거의 움직이지 않습니다." },
          ]}
          output="Task A 성능을 크게 잃지 않으면서 task B를 반영한 parameter θ"
          repeatUntil="Task B validation loss가 수렴할 때까지"
        />
        <CitationBlock
          source="Kirkpatrick, J. et al. · Overcoming catastrophic forgetting in neural networks (arXiv:1612.00796, 2017)"
          citeKey={2}
          href="https://arxiv.org/abs/1612.00796"
        >
          중요한 parameter의 학습 속도를 선택적으로 늦추는 Elastic Weight
          Consolidation을 제시하고 MNIST 순차 분류와 Atari 게임 순차 학습에서
          검증했습니다. 실험은 논문이 다룬 task 순서·수 범위로 제한되며,
          task 수가 크게 늘어난 경우까지 같은 정도로 일반화한다는 주장은
          아닙니다.
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Parameter isolation은 아예 간섭을 없애려는 전략입니다. Task마다
            서로 다른 parameter 부분집합을 쓰게 하거나, dynamic architecture
            expansion으로 새 task를 위한 module·layer 자체를 모델에
            추가합니다. Progressive Networks는 이전 task의 column을 그대로
            얼린 채 새 column을 추가하고, lateral connection으로만 이전
            column의 feature를 참조하게 했습니다.
          </p>
        </div>
        <CitationBlock
          source="Rusu, A. A. et al. · Progressive Neural Networks (arXiv:1606.04671, 2016)"
          citeKey={3}
          href="https://arxiv.org/abs/1606.04671"
        >
          Task마다 새 network column을 추가하고 이전 column은 동결한 채
          lateral connection으로만 이전 feature를 참조하게 해, forgetting을
          구조적으로 막으면서 지식 전이도 노렸습니다. 실험은 Atari·3D maze
          강화학습 계열 task로 제한되며, column 수가 계속 늘어날 때의 추론
          비용 증가는 논문이 다루는 claim 밖입니다.
        </CitationBlock>
        <TermBreakdown
          title="세 전략이 stability를 지키는 서로 다른 방식"
          items={[
            {
              term: "Experience Replay / Replay Buffer",
              description: "이전 데이터 표본을 저장해 두고 새 학습에 함께 섞습니다.",
              example: "Task A 데이터의 10%를 buffer에 남겨 task B와 함께 학습.",
              boundary: "원본 데이터를 저장·재사용할 수 있어야 하고, buffer가 커질수록 저장 비용이 듭니다.",
            },
            {
              term: "Regularization-Based Continual Learning",
              description: "중요한 parameter의 이동을 loss 페널티로 억제합니다.",
              example: "EWC의 Fisher information 가중 페널티.",
              boundary: "Task 수가 늘수록 페널티가 겹쳐 쌓여 plasticity가 함께 줄어듭니다.",
            },
            {
              term: "Parameter Isolation / Dynamic Architecture Expansion",
              description: "Task마다 다른 parameter나 module을 써서 아예 간섭을 없앱니다.",
              example: "Task마다 새 network column을 추가하는 Progressive Networks.",
              boundary: "Task 수만큼 parameter·연산량이 늘어나는 대가가 있습니다.",
            },
          ]}
        />
      </section>

      <section id="adaptation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          재학습 없이도 배포 중 입력 변화에 대응할 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 세 전략은 모두 parameter를 gradient로 갱신하는 학습을
            전제합니다. Test-time adaptation은 그 학습 없이, label도 없이
            배포 중 들어오는 입력만으로 모델 일부를 그때그때 조정합니다.
          </p>
          <p>
            흔히 조정하는 것은 전체 parameter가 아니라 batch normalization
            통계 같은 소수 값입니다. 입력 분포가 학습 때와 달라졌다는
            신호(distribution shift)가 있을 때, 예측 자신의 불확실성을
            줄이는 방향으로 이 통계만 업데이트합니다.
          </p>
          <p>
            이 조정을 한 배치로 끝내지 않고 배포 기간 내내 계속 반영하면
            online adaptation이라고 부릅니다. 예를 들어 이미지 손상으로
            정확도가 76%에서 61%까지 떨어진 상황에서, test-time adaptation을
            몇 배치만 적용해도 70% 안팎까지 회복되는 경우가 보고됩니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Label 없이 배포 중 입력 변화에 적응하는 test-time adaptation loop"
          input={[
            "배포된 모델 θ_deploy",
            "Label 없는 test 입력 배치",
            "조정 대상 parameter 부분집합(흔히 batch norm 통계)",
          ]}
          steps={[
            { code: "stats = update_running_stats(batch_features)", note: "Label 없이도 계산 가능한 배치 평균·분산만 갱신합니다." },
            { code: "pred = model(batch, stats)", note: "갱신된 통계로 예측합니다." },
            { code: "loss = entropy(pred)", note: "Label이 없으므로 예측 자신의 불확실성을 신호로 씁니다." },
            { code: "theta_subset -= lr * grad(loss, theta_subset)", note: "전체가 아니라 소수 parameter만 갱신해 원래 능력을 크게 벗어나지 않게 합니다." },
          ]}
          output="다음 배치 예측에 반영되는, 살짝 조정된 통계·parameter"
        />
        <ProgressiveDetail
          title="Test-time adaptation이 continual learning을 대체하지 못하는 이유"
          preview="통계 몇 개만 조정하므로 반영할 수 있는 변화의 크기가 작습니다. 새 class나 큰 지식 변화는 여전히 재학습이 필요합니다."
        >
          <p>
            Test-time adaptation이 조정하는 parameter 부분집합은 대개
            전체의 1% 미만입니다. 입력 분포가 살짝 달라진 정도(조명·화질
            변화 같은)에는 효과적이지만, 완전히 새로운 class를 인식하게
            만들거나 근본적인 지식을 추가하는 일은 여전히 이 글 앞부분의
            replay·regularization·parameter isolation 같은 학습 기반
            갱신이 필요합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="cadence-freshness" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          갱신 주기가 길수록 모델 답은 조용히 낡습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Model update cadence는 모델을 얼마나 자주 재학습·재배포할지
            정하는 운영 주기입니다. 이 주기가 길수록 세상이 바뀐 만큼
            모델이 아는 사실이 실제와 어긋나는 knowledge freshness 문제가
            커집니다.
          </p>
          <p>
            예를 들어 가격이나 재고처럼 하루 단위로 바뀌는 정보를 다루는
            서비스에서 주 단위로만 재학습하면, 최대 6일치 변화가 반영되지
            않은 채 서빙됩니다. 반대로 매일 재학습하면 freshness는
            좋아지지만 <Link to="/ai/continued-pretraining#forgetting-release">
              이전 글의 adaptation gain–forgetting frontier
            </Link>
            처럼 매 cycle마다 gain과 forgetting을 다시 확인해야 하는
            운영 비용이 늘어납니다.
          </p>
          <p>
            Cadence를 정하는 것은 결국 이 글에서 다룬 세 축을 한 번에
            거는 결정입니다. 얼마나 자주(cadence) 어떤 전략으로
            (replay·regularization·isolation) 갱신해 stability와
            plasticity를 어디서 절충할지, 그리고 그 사이 기간의 freshness
            손실을 test-time adaptation으로 얼마나 메울지를 함께
            정합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
