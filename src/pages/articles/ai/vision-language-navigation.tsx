import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import VisionLanguageNavigationViz from "./vision-language-navigation/viz/VisionLanguageNavigationViz";

export default function VisionLanguageNavigationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          VLN은 waypoint·memory·reward를 navigation이라는 구체 task에 배치합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Vision-Language Navigation(VLN)은 언어 instruction("복도 끝까지 가서 왼쪽 방으로
            들어가")을 보고 실제 environment를 이동하는 embodied task입니다. 이 글은{" "}
            <Link to="/ai/imitation-learning-and-policy-generalization">
              앞 글
            </Link>의 policy generalization 축이 navigation에서 구체적으로 어떤 action space,
            memory, reward 구조로 나타나는지를 봅니다.
          </p>
          <p>
            VLN은 discrete navigation graph 위의 문제로 시작했습니다. 지금은 continuous environment에서 waypoint 단위로 움직이고, 지나온
            경로를 anchor로 압축해 기억하며, 고수준 계획과 저수준 제어를 서로 다른 reward로 정렬하는 방향으로 발전했습니다.
          </p>
        </div>
        <ContentBoundary article="vision-language-navigation" />
      </section>

      <section id="vln-taxonomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          VLN-CE는 discrete graph 대신 continuous waypoint로 행동합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원래 VLN은 Room-to-Room(R2R) benchmark처럼 미리 만들어 둔 navigation graph 위에서 정의됐습니다. 매 step "다음으로 갈 수 있는
            viewpoint" 중 하나를 고르는 discrete action space를 agent가 씁니다. R2R은 90개 건물, 7,189개 경로, 평균 29단어짜리
            instruction 21,567개로 구성되고 경로 하나는 평균 4~6개의 graph edge, 약 10m 길이입니다.
          </p>
          <p>
            이 graph는 각 viewpoint 사이의 연결과 agent의 정확한 위치를 미리 안다고 가정합니다. VLN-CE(VLN in Continuous Environments)는
            이 가정을 없앴습니다. Agent가 실제 물리 environment에서 low-level action(전진·회전)만으로 움직여야 하는 훨씬 어려운 설정이 되고 여기서 성능이
            크게 떨어짐을 보였습니다.
          </p>
          <p>
            Waypoint prediction은 이 low-level action과 완전히 연속적인 이동 사이의 spectrum을
            메웁니다. 한쪽 끝은 고정 거리(0.25m)·고정 방향으로만 움직이는 VLN-CE 표준 action을
            모사하고, 다른 쪽 끝은 거리 0.25~4m, 방향 오프셋 ±15˚까지 자유로운 waypoint를
            예측합니다. 표현력이 큰 예측일수록 더 짧고 실행이 빠른 경로를 만들었습니다.
          </p>
          <p>
            선택한 waypoint를 실제 3D 목표로 바꾸는 절차는 새로 만들 필요가 없습니다.{" "}
            <Link to="/ai/vla-embodiment-gap#pixel-to-3d">Pixel-to-3D waypoint interface</Link>가
            image에서 고른 점을 depth·camera calibration으로 map frame의 3D 위치로 바꾸는 절차를
            이미 정의하고 있고, VLN의 waypoint prediction은 그 입력을 만드는 앞단입니다.
          </p>
        </div>

        <div id="paper-vln" className="scroll-mt-20">
          <CitationBlock
            source="Anderson et al. · Vision-and-Language Navigation: Interpreting Visually-Grounded Navigation Instructions in Real Environments"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/1711.07280"
          >
            <p><strong>문제:</strong> 자연어 navigation instruction을 실제 건물 image와 연결해 목표 지점까지 이동합니다.</p>
            <p><strong>핵심 기여:</strong> Matterport3D simulator와 R2R dataset(90개 건물·7,189개 경로·21,567개 instruction)을 공개하고 discrete navigation graph 기반 task를 정의합니다.</p>
            <p><strong>전제:</strong> 논문의 simulator·건물 scan·instruction 수집 방식입니다.</p>
            <p><strong>근거 범위:</strong> VLN task 정의와 discrete navigation action space, R2R 규모의 근거입니다.</p>
            <p><strong>비주장:</strong> 이 결과가 continuous real robot 배포 성능을 뜻하지는 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-vln-ce" className="scroll-mt-20">
          <CitationBlock
            source="Krantz et al. · Beyond the Nav-Graph: Vision-and-Language Navigation in Continuous Environments"
            citeKey={2}
            type="paper"
            href="https://arxiv.org/abs/2004.02857"
          >
            <p><strong>문제:</strong> Navigation graph가 가정하는 known topology·oracle navigation·perfect localization 없이 VLN을 수행합니다.</p>
            <p><strong>핵심 기여:</strong> Low-level action만으로 continuous environment를 이동하는 VLN-CE를 정의하고 discrete graph 대비 큰 성능 하락을 보고합니다.</p>
            <p><strong>전제:</strong> 저자 simulator·action set·evaluation protocol입니다.</p>
            <p><strong>근거 범위:</strong> Discrete graph와 continuous environment 사이 action space 차이의 근거입니다.</p>
            <p><strong>비주장:</strong> 모든 discrete VLN 결과가 continuous 설정에서 비례해 재현된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-waypoint" className="scroll-mt-20">
          <CitationBlock
            source="Krantz et al. · Waypoint Models for Instruction-guided Navigation in Continuous Environments"
            citeKey={3}
            type="paper"
            href="https://arxiv.org/abs/2110.02207"
          >
            <p><strong>문제:</strong> Low-level action과 완전 continuous waypoint 사이 표현력·실행 비용의 trade-off를 탐색합니다.</p>
            <p><strong>핵심 기여:</strong> 12개 panoramic RGB-D observation을 입력으로, 거리 0.25~4m·방향 ±15˚ 범위의 waypoint를 예측하는 network를 제안하고 더 표현력 있는 예측이 더 짧고 빠른 경로를 만든다고 보고합니다.</p>
            <p><strong>전제:</strong> 저자 simulator·panoramic sensor 구성·waypoint 범위 설정입니다.</p>
            <p><strong>근거 범위:</strong> Waypoint prediction의 표현력 spectrum과 경로 효율성 근거입니다.</p>
            <p><strong>비주장:</strong> 이 범위가 모든 robot embodiment의 이동 한계를 대표한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="slam-controller-and-selective-reasoning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          SLAM controller가 이동을 맡고 VLM은 필요할 때만 추론합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Waypoint를 고르는 것과 그 waypoint까지 안전하게 이동하는 것은 다른 책임입니다. SLAM controller는 sensor로 자기 위치를 계속
            추정(localization)하고 지도를 갱신합니다(mapping). 그 위에서 장애물을 피해 실제 motor command를 내는 저수준 실행도 맡습니다.
          </p>
          <p>
            VLM이 매 step 전체 상황을 다시 추론하면 계산 비용이 크고 느립니다. Selective reasoning은 이 비용을 줄이려고 language
            reasoning(chain-of-thought)을 켜는 자리를 고릅니다. 분기점이나 지시문의 새 landmark처럼 판단이 실제로 필요한 지점에서만 켜고 나머지 구간은
            SLAM controller에게 이동을 맡깁니다.
          </p>
          <p>
            이 구조는{" "}
            <Link to="/ai/vla-embodiment-gap#system-boundary">hierarchical VLA system
            boundary</Link>의 한 구체적 사례입니다. 느린 semantic 판단과 빠른 geometry·control을
            나누는 원칙을, "언제 semantic 판단을 다시 호출할지"까지 조건화한 것이 selective
            reasoning입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="매 step 전체를 재추론하지 않고 필요한 지점에서만 reasoning을 호출"
          input={[
            "현재 observation o_t, 남은 instruction 조각",
            "SLAM state(위치 추정, local map)",
            "직전 reasoning 이후 이동한 거리·분기점 여부",
          ]}
          steps={[
            { code: "if IS_DECISION_POINT(o_t, slam_state):", note: "분기점·새 landmark처럼 언어 판단이 필요한 조건인지 봅니다." },
            { code: "  plan ← VLM_REASON(o_t, instruction)", note: "이때만 chain-of-thought reasoning으로 다음 목표 waypoint·sub-goal을 다시 정합니다." },
            { code: "else:", note: "분기점이 아니면 reasoning을 건너뜁니다." },
            { code: "  plan ← plan  # 이전 계획 유지", note: "직전에 정한 목표를 그대로 씁니다." },
            { code: "action ← SLAM_CONTROLLER(plan, slam_state)", note: "목표까지의 저수준 motor command는 항상 SLAM controller가 냅니다." },
          ]}
          output="다음 저수준 action과 갱신된 SLAM state"
          repeatUntil="목표 도달, 새 결정 지점 도달, 또는 실패 감지"
        />
      </section>

      <section id="trajectory-and-spatial-temporal-memory" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Anchor로 압축한 memory가 같은 곳을 다른 시간에 알아봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Trajectory memory에는 지금까지 지나온 경로의 observation과 결정이 쌓입니다. 이 기록이 반복 방문이나 이미 실패한 경로를 다시 시도하지 않도록 돕습니다.
            문제는 매 step을 전부 고해상도로 쌓으면 경로가 길어질수록 메모리와 검색 비용이 함께 늘어난다는 점입니다.
          </p>
          <p>
            Anchor-trajectory memory는 분기점처럼 다시 참조할 가치가 큰 step만 anchor로 남기고 나머지는 위치·시간만 담은 가벼운 space-time
            indicator로 압축합니다. Spatial-temporal memory는 이 indicator를 위치와 시간 두 축으로 함께 인덱싱합니다. 그러면 "같은 위치를 다른 시간에
            다시 지난다"는 사실을 알아볼 수 있습니다.
          </p>
        </div>

        <VisionLanguageNavigationViz />

        <div id="paper-tamp-nav-memory" className="scroll-mt-20">
          <CitationBlock
            source="Embodied-Navigator · TAMP-Nav (preprint, 2026-08-18)"
            citeKey={4}
            type="paper"
            href="https://arxiv.org/abs/2608.17512"
          >
            <p><strong>문제:</strong> Continuous VLN에서 매 step의 비싼 reasoning과 긴 trajectory 저장 비용을 줄입니다.</p>
            <p><strong>핵심 기여:</strong> Selective reasoning, anchor에만 고해상도 memory를 남기는 anchor-trajectory memory, space-time indicator 기반 spatial-temporal memory를 결합하고 90k trajectory 학습 후 R2R-CE에서 66.2% success rate를 저자 실험으로 보고합니다.</p>
            <p><strong>전제:</strong> 2026-08-18 공개 preprint의 model·90k trajectory·benchmark protocol입니다.</p>
            <p><strong>근거 범위:</strong> Selective reasoning·anchor-trajectory memory·spatial-temporal memory 정의와 R2R-CE 수치의 근거입니다.</p>
            <p><strong>비주장:</strong> 독립 재현, manipulation transfer 또는 다른 benchmark로의 일반화를 주장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="two-level-alignment" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Two-level alignment는 계획과 제어를 서로 다른 reward로 정렬합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            "어디로 갈지"를 정하는 고수준 계획과 "어떻게 그곳에 갈지"를 정하는 저수준 제어를 하나의
            reward로 뭉치면, 목적지는 맞았지만 경로가 비효율적이었는지, 경로는 효율적이었지만
            목적지가 틀렸는지 구분할 수 없습니다. Two-level alignment는 이 둘을{" "}
            <Link to="/ai/reward-design-for-verifiable-rl#outcome-vs-process">
              outcome reward와 process reward
            </Link>
            로 나눠 각각 정렬합니다.
          </p>
          <p>
            Outcome reward는 episode가 끝났을 때 목적지에 도달했는지처럼 최종 결과만 채점합니다. Process reward는 각 step의 waypoint 선택이나
            selective reasoning 판단이 지시문에 비춰 타당했는지를 중간중간 채점합니다. TAMP-Nav는 이 둘을 겹쳐 학습해 R2R-CE에서 66.2% success
            rate를 보고했습니다.
          </p>
        </div>

        <ExplainedFormula
          question="Two-level alignment는 고수준 계획과 저수준 제어를 각각 어떤 reward로 학습하나요?"
          idea={
            <>
              Episode 전체의 최종 성공 여부는 outcome reward로, 매 step의 계획·제어 타당성은
              process reward로 따로 채점한 뒤 둘을 함께 더해 학습합니다.
            </>
          }
          formula={String.raw`L(\theta)=-\,\lambda_o\,R_{\text{outcome}}(\tau)-\lambda_p\sum_{t=1}^{T} R_{\text{process}}(s_t,a_t)`}
          annotatedFormula={String.raw`\begin{aligned}
R_{\text{outcome}}(\tau)&=\underbrace{\mathbb{1}[\text{episode 목적지 도달}]}_{\text{trajectory 전체의 최종 결과 한 번}}\\
\sum_{t=1}^{T} R_{\text{process}}(s_t,a_t)&=\underbrace{\text{매 step 계획·제어 타당성 채점의 합}}_{\text{고수준 waypoint 선택과 저수준 이동 각각}}\\
L(\theta)&=\underbrace{-\lambda_o R_{\text{outcome}}-\lambda_p\sum_t R_{\text{process}}}_{\text{두 채점을 함께 최소화}}
\end{aligned}`}
          operations={[
            { expression: String.raw`R_{\text{outcome}}(\tau)`, annotation: ["episode가 끝났을 때", "목적지 도달 여부만 한 번 채점"] },
            { expression: String.raw`\sum_{t=1}^{T} R_{\text{process}}(s_t,a_t)`, annotation: ["매 step의 waypoint 선택·이동을", "타당성 기준으로 개별 채점 후 합산"] },
            { expression: String.raw`-\lambda_o R_{\text{outcome}}-\lambda_p\sum_t R_{\text{process}}`, annotation: ["두 채점에 각각 가중치를 곱해", "하나의 학습 목표로 결합"] },
          ]}
          terms={[
            { symbol: "\\tau", name: "전체 trajectory", description: "episode 시작부터 끝까지의 (observation, action) sequence입니다." },
            { symbol: "R_{\\text{outcome}}", name: "Outcome reward", description: "episode 끝에서 목적지 도달 같은 최종 결과만 보는 채점입니다." },
            { symbol: "R_{\\text{process}}", name: "Process reward", description: "각 step의 계획·제어가 지시문에 비춰 타당했는지 보는 채점입니다." },
            { symbol: "\\lambda_o, \\lambda_p", name: "가중치", description: "두 채점을 하나의 loss로 합칠 때의 상대적 비중입니다." },
          ]}
          assumptions={[
            "Outcome reward는 episode마다 한 번만 계산된다고 가정합니다.",
            "Process reward는 각 step에서 독립적으로 계산 가능하다고 가정합니다.",
            "두 reward의 스케일이 다를 수 있어 가중치 λ로 맞춘다고 가정합니다.",
          ]}
          interpretation="이 목표는 목적지에 도달했다는 사실만으로 중간의 비효율적이거나 위험한 경로를 눈감아 주지 않습니다. 다만 process reward를 무엇으로 정의하느냐에 따라 결과가 크게 갈리므로, 그 채점 기준 자체가 새로운 설계 대상이 됩니다."
        />
      </section>

      <section id="comparison-and-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">네 층은 각자 다른 실패를 막는 독립된 설계 축입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            VLN taxonomy, SLAM controller와 selective reasoning, trajectory·spatial-temporal memory, two-level
            alignment는 순서대로 쌓이는 층이지만 서로 대체하지 않습니다. Waypoint를 잘 골라도 memory가 없으면 같은 곳을 맴돌고 memory가 있어도 reward가
            결과만 보면 비효율적인 경로를 그대로 강화합니다.
          </p>
        </div>

        <TermBreakdown
          title="네 층이 각각 막는 실패"
          items={[
            {
              term: "VLN taxonomy(action space)",
              description: "Discrete graph인지 continuous waypoint인지에 따라 실행 가능한 이동의 표현력이 정해집니다.",
              example: "Waypoint 거리 0.25~4m·방향 ±15˚ 범위가 넓을수록 더 짧은 경로를 낼 수 있습니다.",
              boundary: "표현력이 커도 그 waypoint를 3D로 바꾸는 pixel-to-3D interface와 SLAM이 없으면 실행할 수 없습니다.",
            },
            {
              term: "SLAM controller·selective reasoning",
              description: "저수준 실행과 고수준 재추론 시점을 분리해 계산 비용을 낮춥니다.",
              example: "분기점에서만 reasoning을 켜고 나머지는 SLAM controller가 이동을 맡습니다.",
              boundary: "결정 지점을 잘못 판정하면 정말 필요한 순간에 reasoning을 건너뛸 수 있습니다.",
            },
            {
              term: "Trajectory·spatial-temporal memory",
              description: "지나온 경로를 anchor로 압축해 반복 방문을 걸러냅니다.",
              example: "Anchor 3개만 고해상도로 남기고 나머지 step은 가벼운 indicator로 압축합니다.",
              boundary: "Anchor 선정이 나쁘면 정작 중요한 재방문을 놓칠 수 있습니다.",
            },
            {
              term: "Two-level alignment",
              description: "고수준 계획과 저수준 제어를 outcome·process reward로 각각 정렬합니다.",
              example: "TAMP-Nav는 이 결합으로 R2R-CE 66.2% success rate를 보고했습니다.",
              boundary: "Process reward 정의가 부정확하면 결과만 보는 것보다 나쁜 신호를 줄 수 있습니다.",
            },
          ]}
        />

        <ProgressiveDetail
          title="한 층만 개선했을 때 남는 실패 사례"
          preview="Action space만 넓히거나 memory만 추가해도 나머지 층의 실패는 그대로 남습니다."
        >
          <p>
            Waypoint 표현력을 넓혀도 selective reasoning의 결정 지점 판정이 나쁘면 정말 방향을 바꿔야 할 순간에 SLAM controller가 이전 계획을 그대로
            실행합니다. 반대로 memory를 정교하게 anchor로 압축해도 two-level alignment의 process reward가 없으면 목적지에 도달하기만 하면 되는
            policy가 비효율적이거나 위험한 경로를 그대로 강화학습으로 강화할 수 있습니다.
          </p>
          <p>
            그래서 이 네 층을 release 평가에 넣을 때는 waypoint 정확도, 결정 지점 판정 정확도,
            반복 방문 횟수, outcome·process reward 각각의 값을 따로 기록해야 어느 층이 실패의
            원인인지 구분할 수 있습니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
