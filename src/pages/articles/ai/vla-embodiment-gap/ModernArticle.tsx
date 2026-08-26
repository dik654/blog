import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import EmbodimentGapViz from "./viz/EmbodimentGapViz";
import SystemBoundaryViz from "./viz/SystemBoundaryViz";

function EvidenceTag({ children }: { children: string }) {
  return (
    <span className="not-prose mr-2 inline-flex border border-border bg-muted/30 px-2 py-0.5 text-[11px] font-bold text-foreground/75">
      {children}
    </span>
  );
}

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>컵을 알아보는 것과 컵을 집는 것 사이에는 실행 계약이 다섯 개 있습니다</h2>
          <p className="text-lg leading-8">
            LLM이 “컵”이라는 말을 알고 VLM이 image에서 컵을 찾았다고 해도 robot은 아직 움직일 수
            없습니다. Pixel을 camera 좌표의 3D 위치로 바꾸고, 현재 robot morphology가 실행할 action으로
            표현하고, collision과 contact를 견디는 controller로 내린 뒤, 새 observation에서 성공 여부를
            다시 확인해야 합니다. 이 연속된 간극을 이 글에서는 <strong>Embodiment Gap</strong>이라고
            부릅니다.
          </p>
          <p className="leading-8">
            따라서 <strong>LLM → VLM → VLA</strong>를 modality 하나씩 붙이는 선형 확장으로만 보면 핵심을
            놓칩니다. 아래로 갈수록 semantic correctness 외에 coordinate frame, dynamics, control rate,
            embodiment-specific interface가 추가됩니다. VLM 지식의 transfer는 출발점이지 physical action
            generalization의 보증서가 아닙니다.
          </p>
          <p className="leading-8">
            <EvidenceTag>2026-08-26 · 연구 프레임</EvidenceTag>
            최근 TMLR survey가 “embodiment gap”을 robot foundation model의 재사용 가능한 기반과 target robot에서
            여전히 필요한 adaptation 사이로 정식화했지만, arXiv v1이 공개된 지 일주일 남짓입니다. 이 글은
            그 용어를 결론으로 사용하지 않고 RT-2·OpenVLA·Octo·독립 robustness 평가가 공통으로 드러내는
            경계를 묶는 분석 틀로만 사용합니다.
          </p>
        </div>

        <EmbodimentGapViz />
        <ContentBoundary article="vla-embodiment-gap" />

        <div id="paper-embodiment-gap-survey" className="scroll-mt-20">
          <CitationBlock source="The Embodiment Gap in Robot Foundation Models (TMLR, arXiv v1 2026-08-19)" citeKey={1} type="paper" href="https://arxiv.org/abs/2608.18433">
            <p><strong>문제:</strong> Foundation model의 재사용 가능한 표현과 target robot에서 필요한 embodiment adaptation 사이를 분류합니다.</p>
            <p><strong>핵심 기여:</strong> 재사용되는 structure type과 target 실행에 adaptation이 필요한 stage를 두 축으로 정리하고 reporting framework를 제안합니다.</p>
            <p><strong>전제:</strong> TMLR 2026년 8월 논문과 2026-08-19 arXiv v1의 문헌 선정 범위입니다.</p>
            <p><strong>근거 범위:</strong> 이 글이 사용하는 “embodiment gap”의 최신 분류 틀입니다. 블로그 편집부가 2026-09-19에 공개 revision을 다시 확인합니다.</p>
            <p><strong>비주장:</strong> Survey의 taxonomy가 합의된 표준이거나 특정 architecture의 우월성을 입증한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="action-interface" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>1단계 · Action head는 “더 정교한 것”보다 robot이 소비할 interface를 먼저 맞춥니다</h2>
          <p className="leading-8">
            VLA(Vision-Language-Action model)는 visual observation과 language instruction을 조건으로 robot
            action을 생성하는 model family입니다. 하지만 action은 자연어 token처럼 이미 표준화된 한
            vocabulary가 아닙니다. 6-DoF end-effector pose, joint position·velocity, gripper state, mobile
            waypoint는 차원·단위·주기부터 다릅니다.
          </p>
          <p className="leading-8">
            RT-2는 robot action을 text token으로 표현했고, ACT는 여러 미래 action을 chunk로 예측했으며,
            Diffusion Policy와 π0는 각각 diffusion과 flow matching으로 continuous trajectory distribution을
            다룹니다. 이 순서는 세대 교체가 아닙니다. Multimodal action을 표현하는 능력, iterative sampling
            cost, control frequency, demonstration 수가 함께 맞아야 합니다. Flow matching의 일반 objective는
            <Link to="/ai/diffusion-continuous-time#flow-matching">별도 정본 글</Link>에서 재사용합니다.
          </p>
        </div>

        <TermBreakdown
          title="Action 표현은 같은 출력층의 옵션이 아니라 서로 다른 실행 계약입니다"
          items={[
            {
              term: "Action tokenization",
              description: "Continuous coordinate나 command bin을 discrete token ID로 바꿔 autoregressive LM이 예측합니다.",
              example: "RT-2는 robot action을 token sequence로 표현해 web-scale vision-language training과 함께 학습합니다.",
              boundary: "문법적으로 유효한 token이 kinematics·collision·contact까지 유효하다는 뜻은 아닙니다.",
            },
            {
              term: "Coordinate / pose prediction",
              description: "Position과 orientation 또는 waypoint를 숫자·문자 sequence로 직접 냅니다.",
              example: "(x,y,z,qx,qy,qz,qw,gripper)처럼 end-effector target을 표현할 수 있습니다.",
              boundary: "좌표 frame·단위·calibration을 잃으면 같은 숫자도 다른 행동입니다.",
            },
            {
              term: "Action chunking",
              description: "다음 한 step이 아니라 짧은 horizon의 action 여러 개를 한 번에 예측합니다.",
              example: "50Hz controller에 1초 chunk를 내면 model 호출 수를 줄일 수 있습니다.",
              boundary: "긴 chunk는 새 observation을 늦게 반영해 disturbance에 취약할 수 있습니다.",
            },
            {
              term: "Diffusion / flow action head",
              description: "하나의 평균 action 대신 continuous trajectory distribution에서 sample을 생성합니다.",
              example: "π0는 VLM 위에 flow-matching action model을 결합합니다.",
              boundary: "표현력이 커져도 sampling latency·data·optimization이 맞지 않으면 direct head보다 낫다고 단정할 수 없습니다.",
            },
          ]}
        />

        <div id="paper-rt2" className="scroll-mt-20">
          <CitationBlock source="RT-2 · Vision-Language-Action Models Transfer Web Knowledge to Robotic Control" citeKey={2} type="paper" href="https://arxiv.org/abs/2307.15818">
            <p><strong>문제:</strong> Web-scale visual-language knowledge를 robot control에 이전합니다.</p>
            <p><strong>핵심 기여:</strong> Action을 text token으로 표현하고 VLM data와 robot trajectory를 함께 fine-tune합니다.</p>
            <p><strong>전제:</strong> 논문에 포함된 robot embodiments·tasks·action representation입니다.</p>
            <p><strong>근거 범위:</strong> Semantic pretraining과 action tokenization을 연결한 대표적인 monolithic VLA 사례입니다.</p>
            <p><strong>비주장:</strong> 임의 robot·contact-rich task로 zero-shot control이 일반화된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-act" className="scroll-mt-20">
          <CitationBlock source="ACT · Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware" citeKey={3} type="paper" href="https://arxiv.org/abs/2304.13705">
            <p><strong>문제:</strong> 작은 demonstration set에서 긴 bimanual task의 compounding error를 줄입니다.</p>
            <p><strong>핵심 기여:</strong> Action chunking과 temporal ensemble로 여러 future actions를 공동 예측합니다.</p>
            <p><strong>전제:</strong> 저자 hardware·teleoperation data·task suite와 action frequency입니다.</p>
            <p><strong>근거 범위:</strong> Chunk length와 closed-loop correction 간 trade-off의 근거입니다.</p>
            <p><strong>비주장:</strong> 모든 VLA에서 같은 chunk length가 최적이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-diffusion-policy" className="scroll-mt-20">
          <CitationBlock source="Diffusion Policy · Visuomotor Policy Learning via Action Diffusion" citeKey={4} type="paper" href="https://arxiv.org/abs/2303.04137">
            <p><strong>문제:</strong> Multimodal continuous robot action distribution을 안정적으로 표현합니다.</p>
            <p><strong>핵심 기여:</strong> Receding-horizon action sequence를 conditional diffusion process로 생성합니다.</p>
            <p><strong>전제:</strong> 논문의 robot tasks·observation/action schema·sampling configuration입니다.</p>
            <p><strong>근거 범위:</strong> Diffusion action head와 iterative inference trade-off의 근거입니다.</p>
            <p><strong>비주장:</strong> Token·coordinate·flow head보다 모든 task와 control rate에서 우월하다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="embodiment-alignment" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>2단계 · Cross-embodiment pretraining은 adaptation을 없애지 않고 시작점을 바꿉니다</h2>
          <p className="leading-8">
            Internet에는 image-text pair와 video가 많지만 정확한 robot state-action trajectory는 비싸고
            embodiment-specific합니다. Open X-Embodiment는 여러 기관의 data를 22개 robot, 527개 skill,
            160,266개 task 규모로 표준화했고, Octo는 80만 trajectory, OpenVLA는 97만 real-world demonstration을
            사용했습니다. 이 숫자는 embodied data scaling의 진전을 보여 주지만 web data와 동일한 coverage나
            target robot의 calibration을 뜻하지 않습니다.
          </p>
          <p className="leading-8">
            중요한 점은 특정 모델만 fine-tuning이 필요하다는 식으로 선을 긋지 않는 것입니다. VLA family
            전체가 정도의 차이는 있어도 sensor, morphology, action normalization, controller와 target
            distribution을 맞춰야 합니다. Foundation policy의 이점은 adaptation을 0으로 만드는 것이 아니라
            더 적은 data로 맞출 가능성을 높이는 데 있습니다.
          </p>
          <p className="leading-8">
            <EvidenceTag>논문 자기보고</EvidenceTag>
            2026년 Qwen-VLA는 Qwen3.5-4B와 DiT action decoder로 manipulation·navigation·trajectory generation을
            하나의 framework에서 다룬다고 보고합니다. 이를 “통합했다”는 확정 사실로 확대하면 안 됩니다.
            논문 자체도 embodied data 규모, joint-training trade-off, short-horizon benchmark, tactile·force·long-term
            memory를 남은 과제로 적습니다. 별도 paper인 Qwen-RobotNav의 planner 구조와도 하나의 system처럼
            합치지 않습니다.
          </p>
        </div>

        <TermBreakdown
          title="Embodiment adaptation receipt에 남길 네 가지"
          items={[
            { term: "Observation schema", description: "Camera 수·pose, depth, proprioception과 시간 동기화를 고정합니다.", example: "Wrist camera가 추가되면 input axis뿐 아니라 visibility와 latency가 바뀝니다.", boundary: "같은 RGB resolution이 같은 observation distribution은 아닙니다." },
            { term: "Action schema", description: "Joint/Cartesian space, frame, unit, bounds, frequency와 gripper convention을 기록합니다.", example: "Δx=0.01이 meter인지 normalized bin인지 분리합니다.", boundary: "출력 dimension이 같아도 robot kinematics가 같다는 뜻은 아닙니다." },
            { term: "Demonstration coverage", description: "Object·layout·lighting·failure recovery와 operator별 다양성을 slice로 셉니다.", example: "성공 trajectory만 있으면 미끄러진 grasp 뒤 복구를 배울 근거가 없습니다.", boundary: "총 hour 수가 rare contact state의 coverage를 대신하지 않습니다." },
            { term: "Adaptation delta", description: "Frozen zero-shot, linear/action-head tuning, full policy tuning을 같은 task에서 비교합니다.", example: "새 arm에서 20·100·500 demonstrations의 success curve를 기록합니다.", boundary: "Fine-tuned 최종 score만으로 foundation transfer를 분리할 수 없습니다." },
          ]}
        />

        <div id="paper-open-x" className="scroll-mt-20">
          <CitationBlock source="Open X-Embodiment · Robotic Learning Datasets and RT-X Models" citeKey={5} type="paper" href="https://arxiv.org/abs/2310.08864">
            <p><strong>문제:</strong> 서로 다른 robot dataset의 observation·action schema를 묶어 cross-embodiment transfer를 연구합니다.</p>
            <p><strong>핵심 기여:</strong> 22 robot·527 skill·160,266 task의 data mixture와 RT-X 실험을 공개합니다.</p>
            <p><strong>전제:</strong> 참여 dataset의 정규화·task distribution과 평가 robot입니다.</p>
            <p><strong>근거 범위:</strong> Embodied data standardization과 transfer 가능성입니다.</p>
            <p><strong>비주장:</strong> Morphology와 action space가 자동으로 같아지거나 unseen embodiment adaptation이 사라진다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-openvla-octo" className="scroll-mt-20 grid gap-5 lg:grid-cols-2">
          <CitationBlock source="OpenVLA · An Open-Source Vision-Language-Action Model" citeKey={6} type="paper" href="https://arxiv.org/abs/2406.09246">
            <p><strong>문제:</strong> 공개 VLM과 대규모 robot data로 generalist manipulation policy를 만듭니다.</p>
            <p><strong>핵심 기여:</strong> 7B model과 970k real-world demonstration, parameter-efficient adaptation 결과를 보고합니다.</p>
            <p><strong>전제:</strong> Open X mixture·평가 suite·finetuning recipe입니다.</p>
            <p><strong>근거 범위:</strong> VLM prior와 robot data의 결합 사례입니다.</p>
            <p><strong>비주장:</strong> 새 robot의 action head와 data가 불필요하다는 뜻은 아닙니다.</p>
          </CitationBlock>
          <CitationBlock source="Octo · An Open-Source Generalist Robot Policy" citeKey={7} type="paper" href="https://arxiv.org/abs/2405.12213">
            <p><strong>문제:</strong> 여러 embodiment와 task에 재사용할 policy 초기화를 만듭니다.</p>
            <p><strong>핵심 기여:</strong> 800k trajectory로 학습하고 새 observation·action space에 adaptation하는 경로를 제시합니다.</p>
            <p><strong>전제:</strong> 지원된 input modality·action readout·evaluation tasks입니다.</p>
            <p><strong>근거 범위:</strong> Cross-embodiment pretraining 뒤 adaptation이라는 spectrum입니다.</p>
            <p><strong>비주장:</strong> 모든 robot에 그대로 꽂는 universal low-level controller가 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="system-boundary" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>3단계 · Foundation model이 직접 할 일과 기존 robotics stack에 맡길 일을 분리합니다</h2>
          <p className="leading-8">
            Monolithic VLA는 perception부터 action까지 공동 학습하지만, hierarchical system은 느린 semantic
            decision과 빠른 geometry·planning·control을 나눕니다. 후자가 언제나 더 안전하거나 전자가 언제나
            더 일반적인 것은 아닙니다. Modular path에서는 component를 개별 시험할 수 있는 대신 calibration,
            stale observation, planner/controller interface error가 합성됩니다.
          </p>
          <p className="leading-8">
            OK-Robot처럼 VLM, navigation, grasp primitive를 조합한 system은 foundation model이 모든 low-level
            dynamics를 직접 예측하지 않아도 open-world task를 시도할 수 있음을 보여 줍니다. 동시에 component
            success를 곱하면 end-to-end success가 급격히 낮아진다는 현실도 드러냅니다. 이것은 CFD에서 AI가
            solver를 대체하기보다 적절한 solver와 조건을 선택하게 하는 경계와 닮았지만, 물리 실행의 error
            feedback이 더 빠르다는 차이가 있습니다.
          </p>
        </div>

        <SystemBoundaryViz />

        <div id="paper-ok-robot" className="scroll-mt-20">
          <CitationBlock source="OK-Robot · What Really Matters in Integrating Open-Knowledge Models for Robotics" citeKey={8} type="paper" href="https://arxiv.org/abs/2401.12202">
            <p><strong>문제:</strong> 별도 task-specific training 없이 open-knowledge vision models와 robotics primitives를 실제 mobile manipulation에 연결합니다.</p>
            <p><strong>핵심 기여:</strong> Open-vocabulary perception·navigation·grasping을 modular pipeline으로 통합하고 실제 home 평가를 보고합니다.</p>
            <p><strong>전제:</strong> 사용한 robot·homes·object set·component configuration입니다.</p>
            <p><strong>근거 범위:</strong> Modular hierarchy가 가능한 system boundary와 component error composition입니다.</p>
            <p><strong>비주장:</strong> Classical module이 항상 learned low-level policy보다 낫거나 실패가 독립이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-qwen-robotnav" className="scroll-mt-20">
          <CitationBlock source="Qwen-RobotNav · Agentic Navigation with a Parameterized Interface" citeKey={9} type="paper" href="https://arxiv.org/abs/2606.18112">
            <p><strong>문제:</strong> General VLM과 embodied navigation의 task·observation·action interface를 분리합니다.</p>
            <p><strong>핵심 기여:</strong> Parameterized interface와 outer planner를 둔 agentic navigation system을 저자들이 보고합니다.</p>
            <p><strong>전제:</strong> 2026 preprint의 navigation environments·models·planner configuration입니다.</p>
            <p><strong>근거 범위:</strong> Hierarchical navigation의 최신 자기보고 사례입니다.</p>
            <p><strong>비주장:</strong> Qwen-VLA와 같은 artifact이거나 manipulation·low-level control까지 통합했다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="pixel-to-3d" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>4단계 · 2D pixel 선택은 3D action을 없애지 않고 geometry module로 넘깁니다</h2>
          <p className="leading-8">
            Navigation에서는 VLM이 이미 잘 다루는 image pixel이나 region을 목표로 고르고, depth·camera
            calibration·SLAM이 이를 3D waypoint로 바꾸는 interface가 등장합니다. Goal2Pixel과 2026-08-18
            공개된 TAMP-Nav가 이 방향을 보고했습니다. 그러나 이는 최근 preprint의 자기보고 결과이며 이
            글의 전체 결론이 아닙니다. 또한 manipulation의 grasp orientation·force·contact를 pixel 하나로
            환원하지 못합니다.
          </p>
        </div>

        <ExplainedFormula
          question="선택한 image pixel과 depth를 camera-frame 3D point로 어떻게 바꾸나요?"
          idea={<>Pixel ray를 camera intrinsic의 역행렬로 정규화하고, 같은 pixel에서 측정한 depth를 곱한 뒤 world frame으로 변환합니다.</>}
          formula={String.raw`p_w=T_{wc}\left(zK^{-1}[u,v,1]^{\mathsf T}\right)`}
          annotatedFormula={String.raw`\begin{aligned}
r_c&=\underbrace{K^{-1}\begin{bmatrix}u\\v\\1\end{bmatrix}}_{\text{pixel을 camera ray로 역투영}}\\
p_c&=\underbrace{z r_c}_{\text{depth로 camera-frame 위치 결정}}\\
p_w&=\underbrace{T_{wc}p_c}_{\text{world·map frame으로 변환}}
\end{aligned}`}
          operations={[
            { expression: String.raw`K^{-1}[u,v,1]^{\mathsf T}`, annotation: ["pixel 좌표에서", "camera ray 방향 복원"] },
            { expression: String.raw`z r_c`, annotation: ["ray에 depth 단위를 곱해", "camera-frame 3D point 생성"] },
            { expression: String.raw`T_{wc}p_c`, annotation: ["camera extrinsic을 적용해", "planner가 쓰는 world frame으로 이동"] },
          ]}
          terms={[
            { symbol: "u,v", name: "Image pixel", description: "VLM이 선택한 image plane의 pixel coordinate입니다." },
            { symbol: "K", name: "Camera intrinsic", description: "Focal length와 principal point를 담은 calibration matrix입니다." },
            { symbol: "z", name: "Depth", description: "Pixel ray의 거리 또는 camera z축 깊이로, sensor convention과 단위를 고정해야 합니다." },
            { symbol: "T_{wc}", name: "Camera-to-world transform", description: "Camera frame point를 map/world reference frame으로 옮기는 rigid transform입니다." },
          ]}
          assumptions={["Pinhole camera와 유효한 intrinsic·extrinsic calibration을 가정합니다.", "Depth convention, meter 단위와 camera/world reference frame이 timestamp까지 일치해야 합니다.", "Occlusion·reflective surface·dynamic object와 robot footprint clearance는 이 식 밖의 검사입니다."]}
          interpretation="2D grounding은 VLM의 출력 interface를 단순하게 만들지만 depth noise와 calibration error가 3D waypoint로 전파됩니다. Pixel 선택 성공률만으로 navigation 성공을 보장할 수 없습니다."
        />

        <AlgorithmBlock
          title="Pixel-grounded waypoint를 검증 가능한 navigation command로 변환"
          input={["observation image I_t and instruction g", "depth D_t, intrinsics K, transform T_wc", "occupancy map, robot footprint and safety constraints"]}
          steps={[
            { code: "(u, v, confidence) ← VLM_GROUND(I_t, g)", note: "2D semantic target와 confidence를 얻습니다." },
            { code: "z ← VALID_DEPTH(D_t[u, v])", note: "Missing·outlier depth면 주변 region 또는 재관측으로 돌아갑니다." },
            { code: "p_w ← T_wc · (z · K⁻¹ · [u, v, 1]ᵀ)", note: "Timestamp가 맞는 camera/world frame으로 역투영합니다." },
            { code: "q ← PROJECT_TO_FREE_SPACE(p_w, map, footprint)", note: "Obstacle·clearance를 만족하는 reachable waypoint로 제한합니다." },
            { code: "trajectory ← PLAN_AND_CONTROL(current_state, q)", note: "VLM이 아니라 planner와 controller가 motor-level command를 냅니다." },
            { code: "result ← REOBSERVE_AND_VERIFY(I_{t+1}, state_{t+1}, g)", note: "도달·진행·실패를 새 observation으로 판정합니다." },
          ]}
          output="verified waypoint transition or typed recovery reason"
          repeatUntil="Goal success, safety stop, timeout 또는 recovery budget 소진"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">
            반대 방향도 함께 봐야 합니다. 3D Diffuser Actor와 PointVLA처럼 point cloud·3D scene representation을
            model input에 직접 넣는 계열은 geometry를 외부 module에 모두 맡기지 않습니다. Pixel-to-3D는
            유일한 정답이 아니라 2D prior를 재사용하는 한 system decomposition입니다.
          </p>
        </div>

        <div id="paper-native-3d" className="scroll-mt-20">
          <CitationBlock source="3D Diffuser Actor · Policy Diffusion with 3D Scene Representations" citeKey={10} type="paper" href="https://arxiv.org/abs/2402.10885">
            <p><strong>문제:</strong> Image-only policy가 camera viewpoint와 3D geometry 변화에 취약한 문제를 다룹니다.</p>
            <p><strong>핵심 기여:</strong> Point-cloud scene representation과 3D relative-attention diffusion policy를 결합합니다.</p>
            <p><strong>전제:</strong> 논문의 manipulation tasks·point-cloud construction·camera configuration입니다.</p>
            <p><strong>근거 범위:</strong> Native 3D representation을 model에 넣는 대조 설계축입니다.</p>
            <p><strong>비주장:</strong> Pixel grounding과 classical geometry가 불필요하거나 모든 real robot에서 더 낫다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-goal2pixel" className="scroll-mt-20">
          <CitationBlock source="Goal2Pixel · From Language Goals to Pixel-Level Action" citeKey={11} type="paper" href="https://arxiv.org/abs/2606.01621">
            <p><strong>문제:</strong> VLM이 navigation action token을 매 step 직접 생성할 때 생기는 call·grounding 비용을 줄입니다.</p>
            <p><strong>핵심 기여:</strong> 2D pixel goal을 depth·geometry로 3D waypoint에 연결하고 저자 실험에서 54.1% SR, 52.5% SPL, 평균 7.75 VLM calls를 보고합니다.</p>
            <p><strong>전제:</strong> 논문의 simulator·task·perception·controller와 비교 baseline입니다.</p>
            <p><strong>근거 범위:</strong> Pixel interface가 가능한 navigation setting의 자기보고 결과입니다.</p>
            <p><strong>비주장:</strong> 수치가 real robot manipulation이나 다른 VLM·SLAM stack에 그대로 재현된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-tamp-nav" className="scroll-mt-20">
          <CitationBlock source="Embodied-Navigator · TAMP-Nav (preprint, 2026-08-18)" citeKey={12} type="paper" href="https://arxiv.org/abs/2608.17512">
            <p><strong>문제:</strong> Continuous VLN에서 매 step의 비싼 reasoning과 긴 trajectory memory를 줄입니다.</p>
            <p><strong>핵심 기여:</strong> Pixel pointing, selective reasoning, anchor-trajectory memory와 process/outcome alignment를 결합하고 저자 R2R-CE 결과를 보고합니다.</p>
            <p><strong>전제:</strong> 공개 직후 preprint의 model·90k trajectory·benchmark protocol입니다.</p>
            <p><strong>근거 범위:</strong> 2D interface와 memory/controller 분해의 최신 사례입니다. 블로그 편집부가 2026-09-18에 공개 revision을 다시 확인합니다.</p>
            <p><strong>비주장:</strong> 독립 재현, manipulation transfer 또는 “VLN과 VLA가 같다”는 결론이 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="closed-loop-release" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>5단계 · Release 단위는 한 frame의 action accuracy가 아니라 closed-loop trajectory입니다</h2>
          <p className="leading-8">
            Mobile navigation은 observe→infer→move를 계속 반복하므로 waypoint가 맞아도 inference·planning
            latency가 길면 이미 다른 위치의 observation을 사용하게 됩니다. Robot arm도 정적인 pick만 보면
            느려도 되는 것처럼 보이지만, 미끄러지는 물체를 다시 잡거나 peg insertion 중 force spike를 피하는
            contact-rich task에는 높은 feedback frequency와 force/tactile sensing이 필요합니다.
          </p>
          <p className="leading-8">
            독립 benchmark도 이 경계를 지지합니다. RADAR는 dynamics와 observation noise 아래에서 여러 VLA의
            fragility를 측정했고, SO-101 real-robot benchmark는 failure taxonomy와 recovery를 별도로 평가합니다.
            이는 “VLM 성능이 VLA로 온전히 전이되지 않는다”는 경험담을 보편 법칙으로 바꾸는 증거가 아니라,
            semantic benchmark와 embodied release test를 분리해야 한다는 독립 반증입니다.
          </p>
        </div>

        <TermBreakdown
          title="Closed-loop release receipt는 성공률 하나보다 실패가 어디서 생겼는지 남깁니다"
          items={[
            { term: "Environment fingerprint", description: "Robot·firmware·sensor·camera calibration·controller·model revision·action head와 rate를 고정합니다.", example: "같은 policy라도 wrist-camera pose가 바뀌면 별도 generation입니다.", boundary: "Model 이름과 success rate만으로 재현할 수 없습니다." },
            { term: "Perturbation slices", description: "Object pose·lighting·background·camera·morphology·instruction paraphrase·dynamics를 한 축씩 바꿉니다.", example: "컵 위치만 5cm 이동한 slice와 camera yaw가 바뀐 slice를 분리합니다.", boundary: "평균 success가 특정 shift의 cliff를 숨길 수 있습니다." },
            { term: "Latency and control", description: "Observation timestamp부터 action commit까지 p50/p95와 controller frequency를 함께 기록합니다.", example: "10Hz target인데 p95 inference가 180ms면 stale observation이 누적됩니다.", boundary: "Offline action accuracy가 real-time feasibility를 보장하지 않습니다." },
            { term: "Recovery trace", description: "Failure detection, safe stop, replan·backtrack과 최종 outcome을 trajectory로 보존합니다.", example: "Grasp slip → force threshold → release → re-observe → retry를 typed states로 남깁니다.", boundary: "성공 trajectory만 모으면 compounding error를 진단할 수 없습니다." },
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>경험적 주장은 버리지 말고 등급과 환경을 붙입니다</h3>
          <p className="leading-8">
            <EvidenceTag>현장 경험</EvidenceTag>
            “환경이 조금만 달라져도 무너졌다”, “flow head보다 coordinate token이 나았다”, “navigation latency가
            더 아팠다”는 관찰은 다음 실험을 설계하는 좋은 가설입니다. 다만 model·revision, robot·sensor,
            dataset, action space, frequency, baseline과 반복 측정이 없으면 논문 결과나 보편 임계점이 아닙니다.
            이 블로그는 <strong>공식 artifact / 논문 자기보고 / 독립 평가 / project 실측 / 현장 경험 /
            추정</strong>을 같은 문장에 섞지 않습니다.
          </p>
          <p className="leading-8">
            결국 핵심 연구 질문은 “VLM의 semantic generalization을 physical action generalization으로 어떻게
            옮길 것인가”입니다. 답은 더 큰 action head 하나가 아니라 data, action interface, geometry,
            controller와 recovery를 어디서 학습하고 어디서 deterministic하게 검증할지 정하는 system design에
            가깝습니다.
          </p>
        </div>

        <div id="paper-radar" className="scroll-mt-20 grid gap-5 lg:grid-cols-2">
          <CitationBlock source="RADAR · Robustness Assessment of Vision-Language-Action Models" citeKey={13} type="paper" href="https://arxiv.org/abs/2602.10980">
            <p><strong>문제:</strong> Nominal benchmark success 밖에서 dynamics·noise에 대한 VLA robustness를 측정합니다.</p>
            <p><strong>핵심 기여:</strong> 여러 perturbation에서 policy fragility를 독립 비교하는 평가 틀을 제시합니다.</p>
            <p><strong>전제:</strong> 평가한 models·tasks·perturbation ranges입니다.</p>
            <p><strong>근거 범위:</strong> OOD와 dynamic robustness를 별도 release slice로 둘 필요성입니다.</p>
            <p><strong>비주장:</strong> 모든 real robot failure의 원인이 VLM representation이라는 뜻은 아닙니다.</p>
          </CitationBlock>
          <CitationBlock source="SO-101 real-robot VLA failure and recovery benchmark" citeKey={14} type="paper" href="https://arxiv.org/abs/2606.08881">
            <p><strong>문제:</strong> 저비용 실제 robot에서 VLA failure와 recovery capability를 관찰합니다.</p>
            <p><strong>핵심 기여:</strong> Failure taxonomy와 recovery evaluation을 final success와 분리합니다.</p>
            <p><strong>전제:</strong> SO-101 hardware·task suite·tested policies입니다.</p>
            <p><strong>근거 범위:</strong> Trajectory와 recovery receipt가 필요한 독립 평가 사례입니다.</p>
            <p><strong>비주장:</strong> 해당 failure 비율이 다른 robot·controller에서 동일하다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
