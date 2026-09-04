import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ImitationLearningAndPolicyGeneralizationViz from "./imitation-learning-and-policy-generalization/viz/ImitationLearningAndPolicyGeneralizationViz";

export default function ImitationLearningAndPolicyGeneralizationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Demonstration data가 IL·BC로 학습되고 generalization 한계를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Robot policy는 사람이 남긴 demonstration data를 모사하는 imitation learning(IL)으로
            가장 널리 학습됩니다. 이 글은 그 데이터가 무엇이고, behavior cloning이 무엇을
            최적화하며, 학습한 policy가 어떤 축으로 일반화하거나 실패하는지, simulation에서 real
            robot으로 넘어갈 때 무엇이 깨지는지를 봅니다.
          </p>
          <p>
            <Link to="/ai/robot-action-representations">앞 글</Link>이 action을 어떤 형태로
            표현할지를 다뤘다면, 이 글은 그 표현을 학습시키는 데이터와 그 학습 결과가 얼마나
            넓게 통하는지를 다룹니다.
          </p>
        </div>
        <ContentBoundary article="imitation-learning-and-policy-generalization" />
      </section>

      <section id="imitation-and-behavior-cloning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Behavior cloning은 demonstration을 supervised label처럼 맞힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Robot demonstration data는 사람이 teleoperation이나 직접 시연으로 만든 (observation,
            action) 쌍의 모음입니다. Imitation learning(IL)은 이 데이터에서 policy를 학습해 사람의
            행동을 재현하는 문제 전체를 가리키고, behavior cloning(BC)은 그중 가장 단순한
            방법으로 각 observation에 대한 action을 supervised learning처럼 직접 맞힙니다.
          </p>
          <p>
            1989년 ALVINN은 도로 주행 image를 input으로, 사람 운전자의 steering 방향을 output으로
            삼아 이 방식을 이미 썼습니다. Input은 30×32 camera grid와 8×32 range-finder grid를
            합친 1,217개 unit이고, output은 45개 steering 방향 unit 중 가장 활성화된 것을 고르는
            discrete 표현이었습니다.
          </p>
          <p>
            여러 시연을 모아 만든 것이 robot action dataset입니다. Dataset은 image·proprioception
            같은 observation과 그에 대응하는 action, 그리고 어떤 robot·task에서 모았는지의
            metadata를 함께 저장해야 나중에 재사용할 수 있습니다.
          </p>
        </div>

        <ExplainedFormula
          question="Behavior cloning은 demonstration에서 무엇을 최소화해 policy를 학습하나요?"
          idea={
            <>
              Demonstration에 있는 (observation, action) 쌍마다 policy가 낸 action과 실제 사람
              action의 차이를 supervised loss로 벌점을 줍니다.
            </>
          }
          formula={String.raw`L(\theta)=\mathbb{E}_{(o,a)\sim D}\left[\ell(\pi_\theta(o),a)\right]`}
          annotatedFormula={String.raw`\begin{aligned}
(o,a)&\sim \underbrace{D}_{\text{사람 demonstration 데이터셋에서 표본}}\\
\hat a&=\underbrace{\pi_\theta(o)}_{\text{policy가 같은 observation에서 낸 action}}\\
L(\theta)&=\underbrace{\mathbb{E}\,\ell(\hat a,a)}_{\text{모든 쌍에서 예측 action과 사람 action의 오차 평균}}
\end{aligned}`}
          operations={[
            { expression: String.raw`(o,a)\sim D`, annotation: ["사람이 남긴 demonstration에서", "observation-action 쌍을 하나 표본"] },
            { expression: String.raw`\pi_\theta(o)`, annotation: ["같은 observation을 policy에 넣어", "예측 action을 얻음"] },
            { expression: String.raw`\mathbb{E}\,\ell(\hat a,a)`, annotation: ["예측과 실제 사람 action의 차이를", "loss로 평균"] },
          ]}
          terms={[
            { symbol: "D", name: "Demonstration dataset", description: "사람이 남긴 (observation, action) 쌍의 모음입니다." },
            { symbol: "\\pi_\\theta", name: "학습 대상 policy", description: "observation에서 action을 내는, 파라미터 θ를 갖는 함수입니다." },
            { symbol: "\\ell", name: "Per-sample loss", description: "action이 discrete면 cross-entropy, continuous면 MSE 같은 오차 함수입니다." },
          ]}
          assumptions={[
            "Demonstration의 (observation, action) 쌍이 독립적으로 sampling된다고 가정합니다.",
            "Demonstration을 남긴 사람의 행동이 재현하고 싶은 좋은 policy라고 가정합니다.",
            "학습·배포 시 observation 분포가 같다고 가정합니다.",
          ]}
          interpretation="BC는 강화학습처럼 reward를 시행착오로 찾지 않고 이미 있는 demonstration을 그대로 맞히므로 구현이 단순합니다. 다만 policy가 낸 action이 demonstration에 없던 상태로 조금만 벗어나도 그 상태에서 무엇을 해야 할지 배운 적이 없다는 문제가 남고, 이는 뒤 절의 generalization 논의로 이어집니다."
        />

        <div id="paper-alvinn" className="scroll-mt-20">
          <CitationBlock
            source="Pomerleau · ALVINN: An Autonomous Land Vehicle in a Neural Network (NeurIPS 1988)"
            citeKey={1}
            type="paper"
            href="https://proceedings.neurips.cc/paper/1988/hash/812b4ba287f5ee0bc9d43bbf5bbe87fb-Abstract.html"
          >
            <p><strong>문제:</strong> 사람 운전자의 시연으로부터 도로를 따라가는 steering을 학습합니다.</p>
            <p><strong>핵심 기여:</strong> Camera·range-finder image를 입력으로, discrete steering 방향을 출력으로 하는 3-layer network를 behavior cloning으로 학습합니다.</p>
            <p><strong>전제:</strong> 저자가 사용한 simulated·실제 도로 image와 CMU 시험 차량 환경입니다.</p>
            <p><strong>근거 범위:</strong> Behavior cloning의 초기 구현과 discrete action head 설계의 근거입니다.</p>
            <p><strong>비주장:</strong> 이 결과가 임의 도로·기상 조건이나 현대 sensor suite에 그대로 재현된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="embodied-data-scaling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Embodied data scaling은 21개 기관 데이터를 100만 trajectory로 합칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Robot demonstration은 사람이 직접 로봇을 움직여 모아야 해서 web text나 image보다 훨씬
            비쌉니다. Embodied data scaling은 여러 기관·여러 robot의 demonstration을 표준 형식으로
            합쳐 하나의 policy가 볼 수 있는 데이터 양을 키우는 흐름입니다.
          </p>
          <p>
            Open X-Embodiment는 21개 기관이 모은 22종 robot의 dataset 60개를 RLDS라는 공통 형식으로 합쳐 527개 skill과 160,266개 task,
            100만 개 이상의 trajectory를 표준화했습니다. 이 규모는 한 실험실이 혼자 모으던 양보다 훨씬 큽니다.
          </p>
          <p>
            이 흐름은 <Link to="/ai/vla-embodiment-gap#embodiment-alignment">cross-embodiment
            adaptation</Link>과 다른 축입니다. Cross-embodiment adaptation이 이렇게 모은 데이터로
            학습한 policy를 새 target robot에 맞추는 절차라면, embodied data scaling은 그 절차에
            넣을 원재료 자체가 얼마나 크고 다양해지고 있는지를 말합니다.
          </p>
        </div>

        <div id="paper-open-x-scale" className="scroll-mt-20">
          <CitationBlock
            source="Open X-Embodiment · Robotic Learning Datasets and RT-X Models"
            citeKey={2}
            type="paper"
            href="https://arxiv.org/abs/2310.08864"
          >
            <p><strong>문제:</strong> 서로 다른 robot dataset을 표준 형식으로 합쳐 학습·평가 가능한 규모로 키웁니다.</p>
            <p><strong>핵심 기여:</strong> 21개 기관·22종 robot·60개 dataset을 RLDS 형식으로 통합해 527개 skill, 160,266개 task, 100만 개 이상 trajectory를 공개합니다.</p>
            <p><strong>전제:</strong> 참여 dataset의 수집 방식·normalization과 공개 시점 범위입니다.</p>
            <p><strong>근거 범위:</strong> Embodied data scaling의 규모 수치 근거입니다.</p>
            <p><strong>비주장:</strong> Trajectory 총량이 특정 robot·task의 coverage나 품질을 보장한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="policy-generalization-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Compositional과 OOD generalization은 서로 다른 지점에서 실패합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Policy generalization은 학습 때 보지 못한 상황에서도 policy가 옳게 행동하는 능력을
            통틀어 가리키는 말입니다. 이 능력은 다시 "무엇에 대해 일반화하는가"로 나뉩니다.
          </p>
          <p>
            Compositional generalization은 이미 아는 요소들의 새로운 조합에 대응하는 능력입니다. Policy가 "컵을 왼쪽에서 집기"와 "병을 오른쪽에서 집기"는
            봤지만 "병을 왼쪽에서 집기"는 못 봤어도, object와 location이라는 같은 두 축 안의 새 조합이라면 맞힐 가능성이 있습니다.
          </p>
          <p>
            Out-of-distribution(OOD) generalization은 축 자체가 다른 상황을 가리킵니다. 학습에
            없던 새 물체 종류, 새 조명, 새 robot처럼 관측·행동 분포 자체가 바뀌면 조합의 문제가
            아니라 아예 본 적 없는 입력을 만나는 것입니다.
          </p>
          <p>
            Policy generalization이라는 말을 쓸 때는 이 둘 중 무엇을 측정했는지 밝혀야 합니다.
            평균 성공률 하나로는 어떤 축에서 강하고 약한지 구분할 수 없습니다.
          </p>
        </div>

        <ImitationLearningAndPolicyGeneralizationViz />

        <TermBreakdown
          title="세 용어가 가리키는 범위를 구분"
          items={[
            {
              term: "Compositional generalization",
              description: "이미 학습에서 본 요소들의 새로운 조합에 대응하는 능력입니다.",
              example: "Object 3종·location 4곳 중 학습에 없던 한 조합만 새로 나옵니다.",
              boundary: "조합 폭이 넓을수록 이 능력만으로는 부족해질 수 있습니다.",
            },
            {
              term: "Out-of-distribution(OOD) generalization",
              description: "관측·행동 분포 자체가 학습과 달라진 상황에 대응하는 능력입니다.",
              example: "학습에 없던 새 object 종류나 새 로봇 embodiment가 등장합니다.",
              boundary: "Data를 더 모아도 그 축 자체가 없으면 여전히 처음 보는 입력입니다.",
            },
            {
              term: "Policy generalization",
              description: "위 두 축을 포함해 학습 분포 밖 상황 전반에서의 성능을 가리키는 상위 개념입니다.",
              example: "Release 평가에서는 두 축을 분리한 slice별 성공률로 보고합니다.",
              boundary: "한 숫자로 뭉뚱그리면 어느 축이 약한지 알 수 없습니다.",
            },
          ]}
        />
      </section>

      <section id="sim-to-real-and-domain-randomization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Domain randomization은 sim 색상·질감·조명을 흔들어 real gap을 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sim-to-real은 simulation에서 학습한 policy를 real robot에 그대로 또는 약간의 조정만으로 옮기는 문제입니다. Simulation은 저렴하고
            안전하게 많은 rollout을 만들 수 있지만 렌더링·물리·센서 noise가 실제와 다른 sim-to-real gap이 항상 남습니다.
          </p>
          <p>
            Domain randomization은 이 gap을 줄이기 위해 simulation의 물체 색상·질감·조명 개수와
            위치, camera 위치와 화각을 매 episode 무작위로 바꿔 학습합니다. Tobin et al.은 camera
            위치를 원래 지점 기준 10×5×10cm 범위, 화각을 ±5% 범위에서 무작위화했습니다.
          </p>
          <p>
            이렇게 학습한 detector를 real Fetch robot에 그대로 배포한 실험에서 40번 중 38번(95%),
            실제 음식 물체로는 10번 중 9번(90%) 물체를 찾아 집는 데 성공했습니다. 무작위화 범위가
            실제 환경의 변화 폭을 덮지 못하면 이 성공률은 그대로 유지되지 않습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="매 episode마다 simulation을 무작위화해 policy를 학습"
          input={[
            "시뮬레이터 sim, 무작위화 파라미터 범위(색상·질감·조명·camera pose·fov)",
            "policy π_θ",
            "학습 episode 수 N",
          ]}
          steps={[
            { code: "for episode in 1..N:", note: "매 episode마다 새로 무작위화합니다." },
            { code: "  params ← SAMPLE_RANDOM(color, texture, lights, camera_pose, fov)", note: "각 파라미터를 정해진 범위 안에서 무작위로 뽑습니다." },
            { code: "  env ← sim.reset(params)", note: "그 파라미터로 이번 episode의 simulation 환경을 만듭니다." },
            { code: "  rollout ← COLLECT(π_θ, env)", note: "이 환경에서 policy를 굴려 observation·action·outcome을 모읍니다." },
            { code: "  θ ← UPDATE(θ, rollout)", note: "모은 데이터로 policy를 갱신합니다." },
          ]}
          output="여러 무작위화된 환경 분포 전체에서 동작하도록 학습된 θ"
          repeatUntil="검증 성공률이 목표치에 도달하거나 episode 예산 소진"
        />

        <div id="paper-domain-randomization" className="scroll-mt-20">
          <CitationBlock
            source="Tobin et al. · Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World"
            citeKey={3}
            type="paper"
            href="https://arxiv.org/abs/1703.06907"
          >
            <p><strong>문제:</strong> Simulation에서 학습한 vision policy를 fine-tuning 없이 real robot에 옮깁니다.</p>
            <p><strong>핵심 기여:</strong> 색상·질감·조명·camera pose·fov를 episode마다 무작위화해 학습하고, real Fetch robot에서 40회 중 38회(95%) object 검출·pick 성공을 보고합니다.</p>
            <p><strong>전제:</strong> 저자의 simulator·object set·camera randomization 범위입니다.</p>
            <p><strong>근거 범위:</strong> Domain randomization의 무작위화 항목과 sim-to-real 성공률 수치 근거입니다.</p>
            <p><strong>비주장:</strong> 이 무작위화 범위가 모든 real 환경의 변화 폭을 덮는다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="comparison-and-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">네 개념은 서로 다른 실패를 막지, 서로를 대체하지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Demonstration 품질, dataset 규모, generalization 축, sim-to-real 격리는 서로 다른 실패를 막는 장치입니다. 데이터를 더 모은다고
            compositional gap이 자동으로 없어지지 않고 domain randomization을 세게 건다고 아예 새로운 object category(OOD)까지 항상
            해결되지는 않습니다.
          </p>
        </div>

        <TermBreakdown
          title="무엇을 늘리면 어떤 실패가 줄어드는가"
          items={[
            {
              term: "Behavior cloning 품질",
              description: "Demonstration이 깨끗할수록 학습 목표 자체의 잡음이 줄어듭니다.",
              example: "일관된 teleoperation과 성공 trajectory 위주로 dataset을 정리합니다.",
              boundary: "Policy가 조금만 벗어난 상태는 여전히 배운 적 없는 채로 남습니다.",
            },
            {
              term: "Embodied data scaling",
              description: "더 많은 robot·task를 더하면 policy가 접하는 조합의 폭이 넓어집니다.",
              example: "Open X-Embodiment처럼 100만 trajectory 규모로 합칩니다.",
              boundary: "Trajectory 수가 많아도 특정 실패 상태의 coverage를 보장하지 않습니다.",
            },
            {
              term: "Generalization 축 구분",
              description: "Compositional gap은 데이터로, OOD는 축 자체 추가로 줄어듭니다.",
              example: "Release 평가에서 두 실패를 별도 slice로 보고합니다.",
              boundary: "두 축을 구분하지 않으면 실패 원인을 잘못 진단합니다.",
            },
            {
              term: "Sim-to-real domain randomization",
              description: "무작위화 범위를 넓히면 실제 환경 변화에 덜 취약해집니다.",
              example: "색상·질감·조명·camera를 episode마다 무작위화합니다.",
              boundary: "무작위화 범위가 실제 변화 폭보다 좁으면 gap이 남습니다.",
            },
          ]}
        />

        <ProgressiveDetail
          title="데이터를 늘렸는데도 실패가 남는 두 사례"
          preview="Scaling은 compositional gap을 줄이는 데는 잘 듣지만 새 축 자체를 만들어 주지는 않습니다."
        >
          <p>
            Open X-Embodiment 규모로 학습해도 평가 robot이 gripper 형태가 아예 다르면 이는
            embodiment라는 새 축의 OOD이지 조합 부족이 아닙니다. 마찬가지로 domain randomization
            범위를 색상·조명까지만 넓히고 표면 마찰이나 조명 반사처럼 다른 물리량을 무작위화하지
            않으면, 그 축에서는 randomization을 하지 않은 것과 같은 결과가 나옵니다.
          </p>
          <p>
            그래서 release 전에는 어떤 축을 무작위화했고 어떤 축은 그대로 두었는지, 그리고 평가
            상황이 그중 어느 축을 건드리는지 함께 기록해야 실패를 정확히 진단할 수 있습니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 글에서는 이 generalization 축들이 navigation이라는 구체적 task에서 waypoint,
            trajectory memory, process·outcome reward로 어떻게 나타나는지를 봅니다.{" "}
            <Link to="/ai/vision-language-navigation">Vision-Language Navigation</Link>에서
            이어집니다.
          </p>
        </div>
      </section>
    </div>
  );
}
