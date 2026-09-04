import ExplainedFormula from "@/components/ui/explained-formula";
import OnPolicyViz from "./viz/OnPolicyViz";

export default function OnPolicy() {
  return (
    <section id="on-policy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        On-policy distillation은 student가 실제로 만든 prefix를 teacher가 token마다 채점하는 학습입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 절의 sequence distillation에서는 보통 teacher가 완성한 response를 고정 dataset으로 만들고 student가 그 문자열을 학습합니다. 그러나 inference에서는 student가 자기 token을 이어 붙입니다. 초반에 작은 실수를 하면 이후 prefix가 training dataset에 없던 상태로 바뀌고, student는 바로 그 상태에서 다음 token을 골라야 합니다. 이 차이를 <em>train–inference distribution mismatch</em> 또는 exposure bias라고 부릅니다.
        </p>
        <p>
          On-policy distillation은 sequence를 만드는 역할을 student에게 돌려줍니다. 현재 student가 prompt에서 response를 sampling하면
          frozen teacher는 그 student prefix를 그대로 입력받아 다음 token distribution을 계산합니다. 그렇게 해서 “student가 자주 방문하는
          상태에서 teacher라면 무엇을 선택했는가”라는 dense feedback을 얻습니다. 여기서 on-policy는 teacher와 student가 같은 checkpoint이라는
          뜻도, student가 자기 답을 정답으로 삼는다는 뜻도 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8"><OnPolicyViz /></div>

      <ExplainedFormula
        question="고정된 teacher sequence와 student가 만든 sequence를 한 식에서 어떻게 구분할까요?"
        idea={<>두 항의 차이는 divergence가 아니라 prefix의 표본 분포입니다. 첫 항은 dataset·teacher가 만든 고정 response에서 배우고, 둘째 항은 현재 student policy가 만든 response에서 teacher와 student의 token distribution을 비교합니다.</>}
        formula={String.raw`\begin{aligned}\mathcal L_{\mathrm{fixed}}&=\mathbb E_{(x,y)\sim\mathcal D}[D(p_T\Vert p_\theta)(y\mid x)],\\\mathcal L_{\mathrm{on}}&=\mathbb E_{x\sim\mathcal X,\ \tilde y\sim p_\theta}[D(p_T\Vert p_\theta)(\tilde y\mid x)],\\\mathcal L_{\mathrm{GKD}}&=(1-\lambda)\mathcal L_{\mathrm{fixed}}+\lambda\mathcal L_{\mathrm{on}}.\end{aligned}`}
        terms={[
          { symbol: String.raw`\mathcal D`, name: "fixed sequence dataset", description: "Ground-truth 또는 teacher가 미리 생성한 prompt–response pair입니다." },
          { symbol: String.raw`p_\theta`, name: "current student policy", description: "현재 parameter θ로 response와 token distribution을 만드는 student입니다." },
          { symbol: String.raw`p_T`, name: "frozen teacher policy", description: "같은 prefix에서 token distribution을 제공하지만 update하지 않는 teacher입니다." },
          { symbol: String.raw`D`, name: "token-distribution divergence", description: "Forward/reverse KL 또는 JSD처럼 teacher와 student의 next-token distribution을 비교하는 함수입니다." },
          { symbol: String.raw`\lambda`, name: "student-data fraction", description: "0이면 fixed off-policy data만, 1이면 student-generated on-policy data만 사용합니다." },
        ]}
        assumptions={[
          "Student가 완전히 random하지 않고 teacher feedback을 받을 만한 prefix를 생성하도록 보통 SFT checkpoint에서 시작합니다.",
          "Student sampling 과정 자체로는 gradient를 역전파하지 않고, sampling된 prefix에서 계산한 divergence gradient만 사용합니다.",
          "Prompt distribution·sampling temperature·stop condition이 바뀌면 student가 방문하는 state distribution도 바뀌므로 모두 training receipt에 남깁니다.",
        ]}
        interpretation="λ는 teacher를 얼마나 믿는지 정하는 값이 아니라, 어느 주체가 만든 response prefix에서 학습할지를 정합니다. λ=1이어도 target distribution은 teacher가 제공하며 student의 sampled token을 그대로 정답 처리하지 않습니다."
      />

      <ExplainedFormula
        question="Student가 만든 한 response에서 reverse KL은 무엇을 token마다 비교할까요?"
        idea={<>Student가 만든 prefix hₜ를 teacher와 student 양쪽에 넣고, 그 다음 token 전체 vocabulary 분포를 비교합니다. Reverse KL은 student가 probability를 둔 token을 teacher가 얼마나 지지하는지 student expectation으로 계산합니다.</>}
        formula={String.raw`\begin{aligned}\tilde y&\sim p_\theta(\cdot\mid x),\\h_t&=(x,\tilde y_{<t}),\\d_t&=D_{\mathrm{KL}}(p_\theta(\cdot\mid h_t)\Vert p_T(\cdot\mid h_t)),\\\mathcal L_{\mathrm{OPD}}&=\frac1L\sum_{t=0}^{L-1}d_t.\end{aligned}`}
        terms={[
          { symbol: String.raw`\tilde y`, name: "student rollout", description: "현재 student가 직접 sampling한 길이 L의 response입니다." },
          { symbol: String.raw`h_t`, name: "student-visited prefix", description: "Prompt x와 student가 t 이전까지 만든 token을 합친 현재 state입니다." },
          { symbol: String.raw`p_\theta(\cdot\mid h_t)`, name: "student next-token policy", description: "현재 prefix에서 vocabulary 전체에 둔 student probability입니다." },
          { symbol: String.raw`p_T(\cdot\mid h_t)`, name: "teacher next-token policy", description: "똑같은 student prefix를 읽은 teacher의 probability입니다." },
          { symbol: "L", name: "rollout length", description: "Mask와 stop rule 뒤 loss에 포함되는 response token 수입니다." },
        ]}
        assumptions={[
          "식은 per-token reverse KL의 단순 평균이며 padding·tool observation·reasoning token을 어디까지 mask하는지 별도 정의해야 합니다.",
          "Teacher와 student가 같은 vocabulary/tokenizer를 쓰거나 정확한 token distribution mapping이 있어야 full-vocabulary KL을 직접 계산할 수 있습니다.",
          "Reverse KL은 dense teacher signal이지만 teacher가 student prefix에서 항상 옳다는 보장은 없으므로 held-out task quality를 따로 평가합니다.",
        ]}
        interpretation="Outcome reward가 마지막 정답 하나만 알려 주는 것과 달리 모든 visited prefix에서 token-level 신호를 얻습니다. 다만 긴 trajectory의 미래 결과를 직접 credit assignment하는 식은 아니며, 즉시 다음-token behavior를 맞추는 objective입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>On-policy는 자동으로 더 좋은 것이 아니라 다른 실패를 고릅니다</h3>
        <p>
          Fixed sequence KD는 teacher response를 한 번 생성해 재사용할 수 있어 단순하고 저렴하지만 student가 inference에서 만드는 낯선
          prefix를 직접 교정하지 못합니다. On-policy distillation은 이 mismatch를 줄이는 대신 매 step student rollout과 teacher
          scoring이 필요합니다. student의 초반 품질이 너무 낮으면 teacher가 익숙하지 않은 state를 계속 채점하게 됩니다. Multi-turn agent에서는 작은
          오류가 다음 observation과 tool state까지 바꾸므로 이 문제가 더 커집니다.
        </p>
        <p>
          따라서 비교 실험에서는 같은 SFT 시작점·prompt set·token budget 아래 fixed-sequence KD와 on-policy KD를 나누고 final
          accuracy뿐 아니라 teacher KL, rollout length, invalid/tool-error rate, domain별 slice와 teacher-scoring
          비용을 함께 기록해야 합니다. Forward KL·reverse KL·JSD의 선택은 on/off-policy와 별개의 축입니다.
        </p>
      </div>

      <div id="paper-gkd" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · On-Policy Distillation of Language Models: Learning from Self-Generated Mistakes</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문의 핵심은 autoregressive student가 inference에서 방문하는 prefix와 고정 training sequence의 불일치를 줄이기 위해 student-generated output에서 teacher의 token distribution을 받는 Generalized KD를 제안한 것입니다. T5 계열의 summarization·translation·arithmetic·instruction tuning 실험이며, 모든 decoder-only frontier LLM이나 multi-turn agent에서 같은 divergence와 sampling recipe가 최적이라는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2306.13649" target="_blank" rel="noreferrer">GKD의 λ·divergence·task별 ablation 보기</a>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>여러 teacher를 쓰면 model을 평균내는 대신 prompt domain마다 채점자를 고릅니다</h3>
        <p>
          Multi-teacher on-policy distillation에서는 math·instruction following·software engineering처럼 서로 다른 RL
          recipe로 만든 teacher를 frozen 상태로 둡니다. Student가 각 prompt에서 rollout을 만들면 domain router가 담당 teacher를 고르고
          그 teacher가 student prefix의 token distribution을 제공합니다. 이는 teacher weight를 합치는 model merging과도, 여러
          reward를 한 run에서 동시에 최적화하는 mixed RL과도 다릅니다.
        </p>
      </div>

      <ExplainedFormula
        question="Domain teacher가 여러 명일 때 하나의 student objective는 어떻게 구성할까요?"
        idea={<>각 prompt에 domain d가 붙어 있다고 보고, student rollout은 하나의 공통 policy가 만들되 teacher distribution은 해당 domain의 frozen teacher T_d에서 가져옵니다. 최종 loss는 domain mixture의 기대값입니다.</>}
        formula={String.raw`\begin{aligned}d&\sim\rho,\quad x\sim\mathcal X_d,\\\tilde y&\sim p_\theta(\cdot\mid x),\\r_{d,t}&=D_{\mathrm{KL}}(p_\theta(\cdot\mid h_t)\Vert p_{T_d}(\cdot\mid h_t)),\\\mathcal L_{\mathrm{MOPD}}&=\mathbb E_{d,x,\tilde y}\left[\frac1L\sum_t r_{d,t}\right].\end{aligned}`}
        terms={[
          { symbol: String.raw`\rho`, name: "domain sampling mixture", description: "Math·instruction·software 등 domain prompt를 training step에 배분하는 확률입니다." },
          { symbol: String.raw`\mathcal X_d`, name: "domain-d prompt set", description: "Domain label과 teacher routing이 고정된 prompt source입니다." },
          { symbol: String.raw`T_d`, name: "domain teacher", description: "공통 시작점에서 해당 domain RL을 거쳐 만든 frozen specialist입니다." },
          { symbol: String.raw`p_\theta`, name: "shared student", description: "모든 domain capability를 하나의 policy에 통합하는 학습 대상입니다." },
        ]}
        assumptions={[
          "Prompt의 domain routing이 맞고 둘 이상의 teacher가 충돌하는 cross-domain prompt 처리 규칙이 정의돼 있다고 가정합니다.",
          "Teacher와 student의 초기 policy가 지나치게 멀면 KL optimization이 불안정할 수 있으며 MOPD 논문은 same-origin teacher의 안정성을 별도 분석합니다.",
          "Domain 평균이 높아도 worst-domain regression이 숨을 수 있으므로 각 teacher 대비 headroom closure와 일반 capability를 함께 봅니다.",
        ]}
        interpretation="여러 teacher의 weight나 logit을 매 token 평균내는 식이 아닙니다. Prompt domain이 teacher를 고르고 student가 방문한 state에서 그 specialist의 dense signal을 받습니다."
      />

      <div id="paper-mopd" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · MOPD: Multi-Teacher On-Policy Distillation for Capability Integration in LLM Post-Training</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 논문은 domain별 RL teacher를 독립적으로 만든 뒤 하나의 student가 자기 rollout에서 각 specialist의 dense token signal을 받게 해 capability를 policy space에서 통합합니다. Qwen3-30B-A3B의 math·instruction following·SWE와 MiMo-V2-Flash 적용 범위에서 비교했으며, 임의의 서로 다른 base model teacher를 섞어도 안정적이거나 모든 domain에서 teacher를 넘는다는 주장은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2606.30406" target="_blank" rel="noreferrer">MOPD pipeline·same-origin ablation·domain별 결과 보기</a>
      </div>

      <div id="source-thinking-machines-opd" className="not-prose my-8 scroll-mt-24 border-l border-border pl-4">
        <p className="text-xs font-bold text-muted-foreground">구현 읽기 · Thinking Machines Lab On-Policy Distillation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공개 구현 글은 SFT를 off-policy+dense, RL을 on-policy+sparse, on-policy distillation을 on-policy+dense로 비교하고 per-token reverse KL recipe를 설명합니다. 이는 구현 가능한 한 사례이며 reverse KL·discount 0·해당 benchmark 비용 비교를 모든 task의 보편 설정으로 간주하면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://thinkingmachines.ai/blog/on-policy-distillation/" target="_blank" rel="noreferrer">공개 recipe와 측정 범위 보기</a>
      </div>
    </section>
  );
}
