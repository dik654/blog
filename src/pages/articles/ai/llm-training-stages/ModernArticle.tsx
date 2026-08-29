import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import TrainingStageFlowViz from "./viz/TrainingStageFlowViz";

const postTrainingSignals = [
  ["SFT", "좋은 demonstration response", "Response token NLL", "/ai/supervised-fine-tuning"],
  ["Preference", "Chosen·rejected 또는 binary feedback", "Pair·label objective", "/ai/rlhf"],
  ["RLVR", "검증 가능한 결과", "Trajectory의 scalar outcome reward", "/ai/open-r1"],
  ["OPD", "Student가 방문한 prefix", "Teacher의 token-level feedback", "/ai/on-policy-distillation"],
] as const;

export default function LlmTrainingStagesArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader number="00" eyebrow="큰 방향을 정확히 말하기" title="관심이 post-training과 agentic system으로 넓어졌지만 capability의 바닥은 여전히 pretraining과 architecture가 만든다">
          최근 LLM 연구에서 SFT·RL·distillation·tool-use environment의 비중이 커진 것은 맞습니다. 다만 이것은 앞 단계를 버렸다는 뜻이 아닙니다. <strong>Pretraining은 가능한 행동의 재료를 만들고, post-training은 그 재료를 어떤 상황에서 꺼낼지 조정하며, agent harness는 여러 turn의 실행 조건을 제공합니다.</strong>
        </LessonHeader>
        <TermLesson
          name="LLM training stage boundary"
          oneLine="Data·feedback·environment가 모델의 어느 state를 바꾸는지 구분하는 단계 지도입니다."
          shape="pretraining → continued/mid-training → post-training → serving·agent harness"
          example="같은 coding capability도 corpus에서 code pattern을 배우는 단계, test reward로 repository 수정 행동을 고치는 단계, 실제 shell을 허용하는 runtime 단계가 다릅니다."
          boundary="뒤 단계의 benchmark 향상을 앞 단계의 capability가 불필요하다는 증거로 읽지 않습니다."
        />
        <TrainingStageFlowViz />
      </section>

      <section id="pretraining" className="space-y-6">
        <LessonHeader number="01" eyebrow="Capability substrate" title="Pretraining은 입력을 복사하는 단계가 아니라 다음 token 예측으로 reusable representation을 학습하는 단계다">
          대규모 corpus의 실제 다음 token에 높은 probability를 주도록 model weight 전체를 반복해서 바꿉니다. 이 objective 하나가 어떤 내부 algorithm을 반드시 만들도록 보장하지는 않지만, 언어·지식·code·수학 pattern을 새 문맥에서 조합할 수 있는 표현을 형성합니다.
        </LessonHeader>
        <ExplainedFormula
          question="Autoregressive pretraining은 한 sequence에서 무엇을 최소화할까요?"
          idea="각 위치에서 앞 token만 조건으로 실제 다음 token의 negative log probability를 계산하고, target 위치 전체를 평균합니다."
          formula={String.raw`\mathcal L_{\rm PT}=-\frac1T\sum_{t=1}^{T}\log p_\theta(x_t\mid x_{<t})`}
          annotatedFormula={String.raw`\mathcal L_{\rm PT}=\underbrace{-\frac1T\sum_{t=1}^{T}}_{\substack{\text{target 위치 전체의 비용을}\text{token 수로 평균}}}\underbrace{\log p_\theta(x_t\mid x_{<t})}_{\substack{\text{실제 다음 token에 준 확률을}\text{log loss로 변환}}}`}
          operations={[
            { expression: String.raw`-\log p_\theta(x_t\mid x_{<t})`, annotation: ["실제 token probability가 작을수록", "더 큰 학습 비용 부여"] },
            { expression: String.raw`\frac1T\sum_{t=1}^{T}`, annotation: ["sequence 안의 target 비용을 더하고", "길이 T로 나눠 평균"] },
          ]}
          terms={[
            { symbol: String.raw`x_{<t}`, name: "causal prefix", description: "현재 위치보다 앞에 있어 model이 볼 수 있는 token들입니다." },
            { symbol: String.raw`p_\theta`, name: "language-model policy", description: "Parameter θ가 만드는 다음-token categorical distribution입니다." },
            { symbol: "T", name: "target-token count", description: "Mask 뒤 loss에 포함한 token 수입니다." },
          ]}
          assumptions={["Causal visibility와 tokenizer·corpus mixture를 고정합니다.", "낮은 token loss가 사실성·안전성·tool 성공을 자동 보장하지 않습니다.", "Representation의 내용은 objective뿐 아니라 data와 architecture에도 의존합니다."]}
          interpretation="Pretraining은 corpus 문자열을 그대로 재생하는 lookup table이 아닙니다. 그러나 next-token objective만으로 사용자의 의도나 장기 task 성공이 완전히 정의되는 것도 아닙니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3 id="mid-training" className="scroll-mt-20">
            Mid-training은 pretrain과 SFT 사이에서 같은 objective를 좁은 분포로 이어 갑니다
          </h3>
          <p>
            Mid-training은 위 next-token objective를 그대로 두고 corpus만 code·수학·특정 언어·long-context처럼 좁은 분포로 바꿔 이어 학습하는 단계입니다. 아직 labeled instruction-response 쌍을 쓰지 않는다는 점에서 뒤에 오는 SFT와 다릅니다.
          </p>
          <p>
            예를 들어 pretraining 말기 mixture에서 10%였던 code 비중을 40%로 올려 수백억 token을 더 학습하면, 이후 SFT가 더 적은 demonstration만으로도 code 관련 목표 행동에 도달하기 쉬워집니다. Label 없는 target 분포에서 같은 self-supervised objective를 이어간다는 점에서, 이 단계는 <Link to="/ai/transfer-learning-practice#domain-shift">domain-adaptive continued pretraining</Link>과 같은 축 위에 있습니다.
          </p>
          <p>
            “Mid-training”이라는 이름은 조직마다 범위가 달라질 수 있으므로, 이름보다 data mixture·objective·checkpoint handoff를 명시해야 합니다. 자세한 corpus mixture와 forgetting 검사는 <Link to="/ai/continued-pretraining">continued pretraining 글</Link>이 소유합니다.
          </p>
        </div>
      </section>

      <section id="post-training" className="space-y-6">
        <LessonHeader number="02" eyebrow="Behavior shaping" title="Post-training은 하나의 기법이 아니라 서로 다른 feedback interface의 묶음이다">
          좋은 정답 문자열, 사람의 선호, verifier reward, teacher distribution은 모두 다른 정보를 줍니다. 따라서 SFT·RLVR·OPD를 “fine-tuning” 한 단어로 합치지 않고 어떤 state에서 얼마나 촘촘한 신호를 받는지 비교합니다.
        </LessonHeader>
        <div className="not-prose overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead className="bg-muted/20"><tr>{["방법", "관측하는 것", "학습 신호", "정본"].map((cell) => <th key={cell} className="border-b border-border px-4 py-3 font-black">{cell}</th>)}</tr></thead>
            <tbody>{postTrainingSignals.map(([method, observation, signal, href]) => <tr key={method} className="border-b border-border last:border-b-0"><td className="px-4 py-3 font-black">{method}</td><td className="px-4 py-3 text-muted-foreground">{observation}</td><td className="px-4 py-3 text-muted-foreground">{signal}</td><td className="px-4 py-3"><Link className="text-primary hover:underline" to={href}>이어 읽기</Link></td></tr>)}</tbody>
          </table>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SFT가 학습하는 각 sample, 즉 demonstration data는 prompt와 원하는 response를 role·template·provenance와 함께 기록한 것입니다. 이 data를 어떻게 만들고 검증하는지는 <Link to="/ai/supervised-fine-tuning#data-contract">SFT의 data contract 글</Link>이 다룹니다.
          </p>
          <p>
            이 SFT가 특히 지시-형식을 따르는 능력 자체를 목표로 할 때를 흔히 instruction tuning이라고 부릅니다. Fine-tuning이 바꾸는 목표를 instruction·domain·task·style·behavior 다섯 축으로 나눈 <Link to="/ai/fine-tuning-tradeoffs-forgetting-and-merging#goal-taxonomy">fine-tuning 목표 분류 글</Link>에서 instruction 축이 이 이름에 대응합니다.
          </p>
          <p>
            Preference 항목의 chosen·rejected 쌍, 즉 preference data의 pair 구조와 상대 비교 label은 <Link to="/ai/dpo#pair-contract">DPO의 pair contract 글</Link>이 정의합니다.
          </p>
        </div>
        <TermLesson
          name="Post-training terminology boundary"
          oneLine="LLM policy를 feedback으로 조정하는 연구 단계와, 학습이 끝난 artifact를 변환하는 배포 단계를 이름의 ‘post-training’만 보고 섞지 않는 규칙입니다."
          shape="LLM post-training: SFT·RL·OPD · PTQ: learned weight를 low-bit artifact로 변환 · LoRA: update parameterization"
          example={<><Link className="text-primary hover:underline" to="/ai/ptq-calibration">PTQ</Link>의 post-training은 calibration 뒤 weight를 양자화한다는 뜻이고, <Link className="text-primary hover:underline" to="/ai/lora-finetuning">LoRA</Link>는 full weight 대신 low-rank branch를 학습하는 방법입니다.</>}
          boundary="LoRA를 썼다고 objective가 SFT인지 RL인지 결정되지 않으며, PTQ를 했다고 model behavior를 새 feedback으로 학습한 것도 아닙니다."
        />
      </section>

      <section id="agentic-training" className="space-y-6">
        <LessonHeader number="03" eyebrow="Trajectory learning" title="Agentic training의 sample은 prompt–answer 한 쌍이 아니라 action과 observation이 이어지는 trajectory다">
          Tool call이 environment를 바꾸면 다음 state도 달라집니다. Repository test, shell exit status, 생성한 document처럼 관측 가능한 결과를 verifier가 채점하고, 실패한 decision 뒤의 복구 경로까지 학습 data가 될 수 있습니다.
        </LessonHeader>
        <AlgorithmBlock
          title="Agentic trajectory rollout과 verifier feedback"
          input={["goal x", "policy πθ", "isolated environment E", "tool schema A", "episode budget B", "outcome verifier V"]}
          steps={[
            { code: "state₀ ← E.reset(goal=x)", note: "Task마다 filesystem·credentials·network 권한을 새 environment에 고정합니다." },
            { code: "actionₜ ← πθ(historyₜ, allowed=A)", note: "Text response와 tool call을 같은 typed action space에서 구분합니다." },
            { code: "observationₜ₊₁, effectₜ ← E.step(actionₜ)", note: "Tool output뿐 아니라 실제 file·service effect를 기록합니다." },
            { code: "historyₜ₊₁ ← historyₜ ⊕ (actionₜ, observationₜ₊₁)", note: "실패 observation도 다음 복구 판단의 조건으로 남깁니다." },
            { code: "reward, receipt ← V(final artifact, trajectory, effects)", note: "Final answer와 실행 흔적·side effect를 분리해 채점합니다." },
            { code: "update dataset or policy from accepted trajectory", note: "SFT·RL·OPD 중 선택한 objective에 맞는 신호로 변환합니다." },
          ]}
          repeatUntil="Success/failure terminal state 또는 turn·token·wall-clock budget에 도달할 때까지 2–4단계를 반복합니다."
          output="versioned trajectory + verifier receipt + updated policy candidate"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            좋은 “실험상자”는 단지 reward를 주는 장소가 아닙니다. 초기 state, 허용 action, observation, timeout, reset, verifier와 side-effect isolation을 재현할 수 있어야 합니다. 실행 loop 자체의 권한과 종료 상태는 <Link to="/ai/agent-loop-foundations">agent loop 글</Link>, artifact·trajectory·effect 평가는 <Link to="/ai/agent-verification">agent verification 글</Link>에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="limits" className="space-y-6">
        <LessonHeader number="04" eyebrow="Soft·hard limit" title="어디가 paradigm의 hard limit인지는 성능 곡선이 아니라 개입 실험으로 판단해야 한다">
          “Soft limit”과 “hard limit”은 편리한 대화 표현이지 합의된 학술 분류가 아닙니다. 더 좋은 data·search·RL·harness로 계속 개선되는지, architecture나 learning rule을 바꾸어야만 실패가 사라지는지는 같은 budget의 intervention을 비교해야 알 수 있습니다.
        </LessonHeader>
        <TermLesson
          name="Paradigm-limit evidence boundary"
          oneLine="현재 recipe의 최적화 부족과 model·learning paradigm이 만드는 구조적 제약을 관측만으로 성급히 구분하지 않는 근거 규칙입니다."
          shape="failure slice → data/harness/post-training interventions → architecture/learning-rule intervention → matched evaluation"
          example="Long-horizon drift가 context 관리로 줄어들면 곧바로 Transformer의 hard limit이라고 부를 수 없습니다."
          boundary="Agent가 막다른 골목이라는 결론도, post-training만 scale하면 된다는 결론도 현재 evidence보다 강합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            행동주의 심리학은 feedback과 환경의 역할을 떠올리는 비유로는 유용하지만, next-token likelihood를 파블로프의 고전적 조건화와 동일한 mechanism으로 만들지는 않습니다. 현대 RL 역시 reward를 쓰지만 MDP·policy optimization·credit assignment라는 별도 수학 체계를 가집니다.
          </p>
          <p>
            <Link to="/ai/motif-3-architecture">Motif 3</Link>처럼 최신 모델도 새 attention·residual·expert architecture와 SFT·RL·MOPD를 동시에 사용합니다. 이 사례는 관심의 중심이 하나에서 다른 하나로 완전히 이동했다기보다, architecture와 post-training·system co-design이 함께 커졌다는 쪽에 가깝습니다.
          </p>
        </div>
        <div id="paper-motif3-training" className="scroll-mt-24">
          <CitationBlock source="Motif 3: Technical Report" citeKey={1} href="https://arxiv.org/abs/2608.09119">
            <EvidenceGrid problem="큰 MoE의 architecture·pretraining·specialist post-training을 하나의 모델로 조합하는 문제" contribution="GDLA·mHC·PolyNorm과 SFT·전문 teacher·MOPD·agent environment를 함께 보고" assumptions="Motif 3 v1의 model·data·training system·evaluation protocol" scope="보고서가 공개한 구성·학습 recipe·benchmark" notClaim="Architecture보다 post-training이 더 중요하다는 보편적 인과 결론" />
          </CitationBlock>
        </div>
        <ContentBoundary article="llm-training-stages" />
      </section>
    </article>
  );
}
