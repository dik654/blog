import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RobotActionRepresentationsViz from "./robot-action-representations/viz/RobotActionRepresentationsViz";

export default function RobotActionRepresentationsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Action 표현은 하나의 정답이 아니라 continuous·discrete 사이의 선택입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            VLA(Vision-Language-Action model)가 다음 action을 낼 때는 먼저 그 값을 실수 벡터로 그대로
            regression할지, 미리 나눠 둔 bin 중 하나를 고를지부터 정해야 합니다. 이 글은 그 구체적인
            선택지들—continuous space, discrete token, pose, action chunking, diffusion·flow head—을
            수치 예와 함께 비교합니다.
          </p>
          <p>
            <Link to="/ai/vla-embodiment-gap#action-interface">앞 글</Link>이 robot이 소비할
            frame·unit·frequency를 고정하는 실행 계약(action-interface contract)을 다뤘다면, 이 글은
            그 계약을 실제로 채우는 표현 방법 자체를 다룹니다. 계약이 "무엇을 표준화해야 하는가"라면
            여기서는 "구체적으로 어떤 표현이 있는가"를 봅니다.
          </p>
        </div>
        <ContentBoundary article="robot-action-representations" />
      </section>

      <section id="continuous-vs-discrete" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Discrete는 bin 해상도를, continuous는 정밀도를 맞바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Continuous action space는 delta position이나 joint velocity 같은 값을 실수 벡터로 그대로 냅니다. 표현 정밀도는 float
            precision만큼 높습니다. 대신 discrete token만 다루는 언어모델의 vocabulary와 cross-entropy loss를 그대로 재사용할 수 없습니다.
          </p>
          <p>
            Discrete action space는 같은 실수 값을 미리 정한 개수의 bin으로 나눠 정수 index로 바꿉니다. RT-2는 이렇게 만든 정수를 language
            token처럼 예측해 image-text 데이터로 미리 학습된 VLM의 next-token 예측 head를 그대로 action 예측에 씁니다. 대신 bin 폭보다 작은 움직임은
            표현하지 못합니다.
          </p>
          <p>
            예를 들어 값의 범위를 256개 bin으로 균등하게 나누면 bin 하나의 폭은 범위의 1/256입니다. 범위가 20cm인 축이라면 bin 하나는 약 0.8mm입니다. 많은
            manipulation task에는 충분하지만 정교한 force control에는 거칠 수 있습니다.
          </p>
        </div>
      </section>

      <section id="pose-and-text-actions" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Pose는 6-DoF 숫자이고 coordinate-as-text는 문자열로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            End-effector pose는 로봇 팔 끝(그리퍼)이 있어야 할 위치와 방향을 나타내는 숫자 집합입니다. 위치는 3차원 공간의 (x, y, z) 세 자유도(degree of
            freedom, DoF)입니다. 방향은 roll·pitch·yaw 회전 세 자유도입니다. 이 둘을 합쳐 6-DoF pose라고 부릅니다.
          </p>
          <p>
            6개 숫자로 충분하다는 사실이 표현 방법까지 정하지는 않습니다. Roll·pitch·yaw를 그대로 쓰면
            gimbal lock이라는 특이점이 생기므로 실무에서는 4개 숫자로 된 quaternion(qx, qy, qz,
            qw)을 더 많이 씁니다. Quaternion은 자유도 3개를 4개 숫자로 표현하므로 unit norm 제약이
            항상 따라붙습니다.
          </p>
          <p>
            RT-2는 이 pose 값과 gripper 상태를 <strong>coordinate-as-text</strong> 방식으로
            예측합니다. 각 차원을 256개 bin으로 균등 discretize한 뒤 정수 하나로 바꾸고, 그 정수들을
            공백으로 이어 하나의 문자열 token sequence로 만듭니다. 6-DoF delta pose와 gripper,
            episode 종료 신호를 더한 8차원 action은 "1 128 91 241 5 101 127"처럼 정수 문자열로
            표현됩니다.
          </p>
          <p>
            이 방식은 VLM의 기존 tokenizer와 vocabulary를 그대로 재사용한다는 게 장점입니다. PaLI-X처럼 숫자 token을 이미 갖는 tokenizer는 bin
            값을 해당 token에 직접 매핑합니다. PaLM-E처럼 그렇지 않은 tokenizer는 가장 적게 쓰이는 token 256개를 action vocabulary로 덮어씁니다.
            대신 문자열이 문법적으로 유효하다고 kinematics나 collision까지 유효한 것은 아닙니다.
          </p>
        </div>

        <ExplainedFormula
          question="Continuous action 값을 어떻게 정수 bin으로 바꿔 text token으로 예측하나요?"
          idea={
            <>
              값의 범위를 <code>B</code>개 구간으로 균등하게 나누고, 값이 속한 구간의 index를 정수
              token으로 씁니다.
            </>
          }
          formula={String.raw`b=\left\lfloor \frac{a-a_{\min}}{a_{\max}-a_{\min}}(B-1) \right\rfloor`}
          annotatedFormula={String.raw`\begin{aligned}
n&=\underbrace{a-a_{\min}}_{\text{action 값에서 최소값만큼 원점 이동}}\\
r&=\underbrace{\frac{n}{a_{\max}-a_{\min}}}_{\text{범위로 나눠 0..1로 정규화}}\\
b&=\underbrace{\left\lfloor r\,(B-1) \right\rfloor}_{\text{bin 개수를 곱하고 내림해 정수 token index로 변환}}
\end{aligned}`}
          operations={[
            { expression: String.raw`a-a_{\min}`, annotation: ["action 값에서", "최소값만큼 원점을 이동"] },
            { expression: String.raw`\frac{a-a_{\min}}{a_{\max}-a_{\min}}`, annotation: ["값 범위로 나눠", "0~1 사이로 정규화"] },
            { expression: String.raw`\left\lfloor r\,(B-1) \right\rfloor`, annotation: ["bin 개수를 곱한 뒤 내림해", "정수 token index로 변환"] },
          ]}
          terms={[
            { symbol: "a", name: "Continuous action 값", description: "한 action 차원의 실수 값입니다(예: delta position 한 축)." },
            { symbol: "a_{\\min}, a_{\\max}", name: "Clipping 범위", description: "discretize 전에 값을 잘라 두는 최소·최대 경계입니다." },
            { symbol: "B", name: "Bin 개수", description: "RT-2는 차원마다 256개 bin을 씁니다." },
            { symbol: "b", name: "정수 token index", description: "0부터 B-1 사이의 정수로, 이후 tokenizer의 실제 token ID에 매핑됩니다." },
          ]}
          assumptions={[
            "값이 [a_min, a_max] 범위 안에 있다고 가정하고, 벗어나면 clip합니다.",
            "모든 차원에 같은 bin 개수를 균등 폭으로 적용한다고 가정합니다.",
            "Tokenizer가 이 정수를 고유 token으로 되돌릴 수 있어야 합니다.",
          ]}
          interpretation="Bin 개수가 커질수록 표현 정밀도는 올라가지만 tokenizer가 덮어써야 할 vocabulary도 커집니다. 문자열이 유효한 정수 sequence라는 사실이 로봇이 실행 가능한 action이라는 뜻은 아닙니다."
        />

        <div id="paper-rt2" className="scroll-mt-20">
          <CitationBlock
            source="RT-2 · Vision-Language-Action Models Transfer Web Knowledge to Robotic Control"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/2307.15818"
          >
            <p><strong>문제:</strong> Web-scale visual-language knowledge를 robot control에 이전합니다.</p>
            <p><strong>핵심 기여:</strong> 8차원 action(6-DoF delta pose + gripper + episode 종료)을 차원별 256 bin discretization으로 정수 문자열 token으로 표현하고, VLM tokenizer의 기존 vocabulary를 재사용합니다.</p>
            <p><strong>전제:</strong> 논문에 포함된 robot embodiments·tasks·action representation입니다.</p>
            <p><strong>근거 범위:</strong> Coordinate-as-text action prediction의 discretization 방식과 정수 문자열 예시("1 128 91 241 5 101 127")의 근거입니다.</p>
            <p><strong>비주장:</strong> 임의 robot·contact-rich task로 zero-shot control이 일반화된다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="action-chunking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Action chunking은 한 번에 k개 timestep을 묶어 호출 수와 오차를 함께 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Action chunking은 매 timestep마다 action 하나만 내지 않고 앞으로 k step 동안 실행할 action을 한 번에 예측하는 방식입니다.
            ACT(Action Chunking with Transformers)는 k=100, 즉 50Hz control에서 2초 분량의 action을 한 번의 forward pass로
            냅니다.
          </p>
          <p>
            저자들의 ablation에서 chunk가 없는 k=1은 성공률 1%에 그쳤지만 k=100에서는 44%까지 올랐습니다. k=200·400처럼 더 늘리면 오히려 소폭 떨어졌습니다.
            Chunk가 커질수록 policy가 독립적으로 결정해야 하는 지점이 줄어 compounding error(작은 오차가 다음 step 입력에 누적되는 현상)의 실효
            horizon이 짧아지기 때문입니다.
          </p>
          <p>
            다만 chunk를 그대로 실행하면 open-loop 구간이 늘어나 그 사이에 물체가 움직여도 반응하지 못합니다. ACT는 이를 temporal ensembling으로
            완화합니다. 매 step마다 새 chunk를 다시 예측한 뒤 여러 chunk가 같은 timestep에 대해 낸 예측을 지수 가중 평균으로 섞어 최종 action을 만듭니다.
          </p>
        </div>

        <AlgorithmBlock
          title="Chunk 예측과 temporal ensembling으로 action 하나를 확정"
          input={[
            "observation o_t",
            "chunk 길이 k, ensembling 속도 m",
            "이전 timestep에서 낸 chunk 예측들 {A_{t-i}}",
          ]}
          steps={[
            { code: "A_t ← POLICY(o_t)  # 길이 k인 action chunk 예측", note: "한 forward pass로 t..t+k-1 action을 한꺼번에 냅니다." },
            { code: "for i in 0..min(t, k-1): a_i ← A_{t-i}[i]", note: "과거 여러 chunk 중 지금 시점 t를 포함하는 예측들을 모읍니다." },
            { code: "w_i ← exp(-m · i)", note: "더 최근에 낸 chunk(i가 작을수록)에 더 큰 가중치를 둡니다." },
            { code: "a_t ← Σ(w_i · a_i) / Σ(w_i)", note: "지수 가중 평균으로 여러 예측을 하나의 action으로 합칩니다." },
            { code: "EXECUTE(a_t); t ← t+1", note: "합쳐진 action만 실제로 실행하고 다음 step으로 넘어갑니다." },
          ]}
          output="실행된 action a_t와 다음 timestep으로 넘어간 policy 상태"
          repeatUntil="episode 종료 또는 실패 감지"
        />

        <RobotActionRepresentationsViz />

        <div id="paper-act" className="scroll-mt-20">
          <CitationBlock
            source="ACT · Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware"
            citeKey={2}
            type="paper"
            href="https://arxiv.org/abs/2304.13705"
          >
            <p><strong>문제:</strong> 작은 demonstration set에서 긴 bimanual task의 compounding error를 줄입니다.</p>
            <p><strong>핵심 기여:</strong> Chunk 길이 k=100(50Hz에서 2초)의 action chunking과 지수 가중 temporal ensembling을 제안하고, k=1→44%(k=100) 성공률 향상과 k=200·400에서의 소폭 하락을 보고합니다.</p>
            <p><strong>전제:</strong> 저자 hardware·teleoperation data·task suite와 action frequency입니다.</p>
            <p><strong>근거 범위:</strong> Chunk length와 closed-loop correction 간 trade-off, temporal ensembling 수식의 근거입니다.</p>
            <p><strong>비주장:</strong> 모든 VLA·모든 task에서 같은 chunk length가 최적이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="diffusion-and-flow-heads" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Diffusion·flow head는 평균 대신 분포에서 표본을 뽑습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Action 값 하나를 regression으로 맞히는 policy는 두 가지 정답이 동시에 그럴듯할 때(컵을
            왼쪽으로 돌아 잡을지 오른쪽으로 돌아 잡을지) 두 정답의 평균이라는 어색한 action을
            냅니다. Diffusion Policy와 π0의 flow-matching action head는 평균 대신 조건부 분포
            자체에서 표본을 뽑아 이 문제를 피합니다.
          </p>
          <p>
            Diffusion Policy는 순수 noise에서 시작해 여러 번 denoising을 반복해 action chunk를 만듭니다. 실시간성을 위해 학습은 100 step
            DDPM으로 하고 추론은 DDIM으로 10 step만 밟아 약 0.1초 지연으로 하나의 action chunk를 생성합니다. 실행 길이(action horizon)는 여러
            task에서 8 step 근처가 가장 좋았습니다.
          </p>
          <p>
            π0는 diffusion 대신 flow matching으로 같은 문제를 풉니다. Action chunk 길이 H=50에서 시작해 50Hz 로봇은 0.5초, 20Hz 로봇은
            0.8초마다 새 chunk를 추론합니다. 추론은 순수 noise에서 시작해 10번의 integration step만 밟으면 됩니다. 저자 측정으로 RTX 4090에서 전체
            inference가 약 73ms(약 13~14Hz)입니다.
          </p>
        </div>

        <ExplainedFormula
          question="Flow matching action head는 무엇을 regression해 continuous action distribution을 배우나요?"
          idea={
            <>
              정답 action에 noise를 τ 비율로 섞은 중간 상태에서, 그 상태를 다시 정답 쪽으로 밀어주는
              velocity(속도장)를 regression합니다.
            </>
          }
          formula={String.raw`L^{\tau}(\theta)=\mathbb{E}\left\|v_\theta(A_t^{\tau},o_t)-(A_t-\epsilon)\right\|^2`}
          annotatedFormula={String.raw`\begin{aligned}
A_t^{\tau}&=\underbrace{\tau A_t+(1-\tau)\epsilon}_{\text{정답 action chunk와 noise를 τ 비율로 선형 결합}}\\
u&=\underbrace{A_t-\epsilon}_{\text{중간 상태를 정답으로 되돌리는 목표 velocity}}\\
L^{\tau}(\theta)&=\underbrace{\mathbb{E}\left\|v_\theta(A_t^{\tau},o_t)-u\right\|^2}_{\text{model이 낸 velocity와 목표 velocity의 오차}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\tau A_t+(1-\tau)\epsilon`, annotation: ["정답 action chunk와 random noise를", "τ 비율로 선형 결합"] },
            { expression: String.raw`A_t-\epsilon`, annotation: ["그 중간 상태에서 정답으로", "돌아가는 방향과 크기(속도)를 정의"] },
            { expression: String.raw`\left\|v_\theta(A_t^{\tau},o_t)-u\right\|^2`, annotation: ["model이 예측한 velocity와", "목표 velocity의 차이를 squared error로 벌점"] },
          ]}
          terms={[
            { symbol: "A_t", name: "정답 action chunk", description: "길이 H(π0는 50)인 미래 action sequence입니다." },
            { symbol: "\\epsilon", name: "Random noise", description: "표준정규분포에서 뽑은 같은 shape의 noise입니다." },
            { symbol: "\\tau", name: "Flow timestep", description: "0(순수 noise)에서 1(정답)까지의 보간 비율입니다." },
            { symbol: "v_\\theta", name: "Model이 학습하는 velocity field", description: "현재 observation과 중간 상태를 보고 목표 velocity를 예측하는 network 출력입니다." },
            { symbol: "o_t", name: "현재 observation", description: "image·proprioception 등 policy의 조건입니다." },
          ]}
          assumptions={[
            "학습 때는 noisy한 구간을 더 많이 보는 timestep 분포(shifted beta 등)에서 τ를 뽑는다고 가정합니다.",
            "추론 때는 순수 noise에서 시작해 유한한 integration step(예: 10 step)만 밟는다고 가정합니다.",
            "Action chunk 안의 여러 timestep을 한 번에 같은 diffusion·flow 과정으로 만든다고 가정합니다.",
          ]}
          interpretation="이 objective는 정답 하나를 직접 맞히지 않고 noise를 정답으로 되돌리는 방향을 배우므로 여러 그럴듯한 action mode를 함께 표현할 수 있습니다. 다만 추론에 여러 integration step이 필요해 한 번의 forward pass로 끝나는 direct regression·token head보다 계산 비용이 더 듭니다."
        />

        <div id="paper-diffusion-and-pi0" className="scroll-mt-20 grid gap-5 lg:grid-cols-2">
          <CitationBlock
            source="Diffusion Policy · Visuomotor Policy Learning via Action Diffusion"
            citeKey={3}
            type="paper"
            href="https://arxiv.org/abs/2303.04137"
          >
            <p><strong>문제:</strong> Multimodal continuous robot action distribution을 안정적으로 표현합니다.</p>
            <p><strong>핵심 기여:</strong> 학습 100 step DDPM·추론 10 step DDIM으로 약 0.1초 지연에 action chunk를 생성하고, action horizon 8 step 근처가 여러 task에서 최적임을 보고합니다.</p>
            <p><strong>전제:</strong> 논문의 robot tasks·observation/action schema·sampling configuration입니다.</p>
            <p><strong>근거 범위:</strong> Diffusion action head의 denoising step 수·horizon 값과 multimodal 표현 근거입니다.</p>
            <p><strong>비주장:</strong> Token·coordinate·flow head보다 모든 task와 control rate에서 우월하다는 뜻은 아닙니다.</p>
          </CitationBlock>
          <CitationBlock
            source="π0 · A Vision-Language-Action Flow Model for General Robot Control"
            citeKey={4}
            type="paper"
            href="https://arxiv.org/abs/2410.24164"
          >
            <p><strong>문제:</strong> VLM 위에서 고주파 continuous robot control을 위한 action 생성을 다룹니다.</p>
            <p><strong>핵심 기여:</strong> Chunk 길이 H=50의 flow-matching action expert를 결합하고, 10 integration step·RTX 4090 기준 약 73ms inference를 저자 측정으로 보고합니다.</p>
            <p><strong>전제:</strong> 논문의 robot embodiments·action chunk 설정·sampling configuration입니다.</p>
            <p><strong>근거 범위:</strong> Flow matching action head의 objective와 chunk 길이·inference latency 수치의 근거입니다.</p>
            <p><strong>비주장:</strong> Direct coordinate·token head에 대한 보편적 우위를 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="comparison-and-boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          무엇이 맞는지는 sampling 비용과 chunk 길이의 trade-off로 결정됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            지금까지 본 continuous 직접 회귀, discrete coordinate-as-text, action chunking, diffusion·flow head는 서로
            배타적이지 않습니다. Chunking은 discrete token 예측에도 diffusion·flow 예측에도 함께 쓸 수 있는 별도의 축입니다. 그래서 “어느 것이
            최신이다”가 아니라 “이 축들을 어떻게 조합했는가”로 비교해야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="네 방법을 정밀도·재사용·multimodality·추론 비용으로 비교"
          items={[
            {
              term: "Continuous 직접 회귀",
              description: "실수 벡터를 그대로 regression하는 가장 단순한 head입니다.",
              example: "MSE loss로 (Δx, Δy, Δz, ...)를 한 번의 forward pass로 직접 맞힙니다.",
              boundary: "여러 그럴듯한 action이 있으면 평균으로 수렴해 각각을 표현하지 못합니다.",
            },
            {
              term: "Discrete coordinate-as-text",
              description: "값을 bin으로 나눠 정수 token sequence로 예측합니다.",
              example: "RT-2는 256 bin discretization으로 8차원 action을 문자열로 냅니다.",
              boundary: "Bin 폭보다 정밀한 움직임은 표현할 수 없습니다.",
            },
            {
              term: "Action chunking",
              description: "여러 timestep의 action을 한 forward pass로 묶어 예측하는 별도 축입니다.",
              example: "k=100에서 성공률이 1%에서 44%로 올랐지만 k=200에서는 다시 떨어졌습니다.",
              boundary: "Chunk가 길수록 새 observation을 반영하지 못하는 open-loop 구간이 늘어납니다.",
            },
            {
              term: "Diffusion·flow action head",
              description: "정답 분포에서 여러 번 denoising·integration으로 표본을 뽑습니다.",
              example: "π0는 10 integration step으로 약 73ms에 하나의 chunk를 생성합니다.",
              boundary: "Direct regression·token head보다 추론에 여러 step이 필요합니다.",
            },
          ]}
        />

        <ProgressiveDetail
          title="Bin 개수·chunk 길이를 바꾸면 생기는 실패 사례"
          preview="Bin이 너무 크거나 chunk가 너무 길면 각각 정밀도와 반응성을 잃습니다."
        >
          <p>
            Bin 개수를 줄이면 tokenizer vocabulary 부담은 줄지만 fine manipulation에서 목표에 못 미치는 discretization error가 커집니다.
            Chunk 길이를 k=400까지 늘리면 ACT 실험에서 성공률이 k=100보다 낮아졌습니다. 그만큼 긴 구간 동안 실제 environment 변화를 무시하기 때문입니다.
          </p>
          <p>
            두 축 모두 클수록 좋은 값이 아닙니다. task가 필요로 하는 정밀도와 disturbance 빈도에 맞춰 고르는 값입니다. 같은 chunk 길이라도 정적인 pick-and-
            place와 미끄러지는 물체를 다시 잡는 task는 최적값이 다릅니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 글에서는 이런 action head를 학습시키는 demonstration data 자체—behavior cloning,
            dataset scale, sim-to-real—를 봅니다.{" "}
            <Link to="/ai/imitation-learning-and-policy-generalization">
              Imitation learning과 policy generalization
            </Link>
            에서 이어집니다.
          </p>
        </div>
      </section>
    </div>
  );
}
