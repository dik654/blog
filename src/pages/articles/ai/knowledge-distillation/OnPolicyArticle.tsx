import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DistillationLearningFlowViz from "./viz/DistillationLearningFlowViz";

export default function OnPolicyDistillationArticle() {
  return (
    <article>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-7">
        <header>
          <p className="text-sm font-semibold text-primary">
            먼저 prefix를 누가 만들었는지 봅니다
          </p>
          <h2 className="mt-2 text-3xl font-bold">
            On-policy distillation은 student가 실제 방문한 상태에서 teacher
            feedback을 받는다
          </h2>
        </header>
        <p className="text-lg leading-8">
          고정 teacher response만 학습한 student는 inference 때 자기 token으로
          다른 prefix를 만듭니다. On-policy distillation은 현재 student
          rollout을 teacher에게 다시 보여 주고 같은 prefix의 다음-token
          distribution을 target으로 받아 이 state-distribution mismatch를
          줄입니다.
        </p>
        <DistillationLearningFlowViz mode="on-policy" />
        <ContentBoundary article="on-policy-distillation" />
      </section>
      <section id="state-mismatch" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · visited state
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            고정 prefix A→B와 student가 만든 A→X는 서로 다른 학습 상태다
          </h2>
        </header>
        <p>
          Autoregressive decoding에서는 방금 생성한 token이 다음 input이 됩니다.
          고정 teacher sequence에서만 학습하면 student의 실수 뒤에 어떤 token을
          내야 하는지 관측하지 못합니다.
        </p>
        <ExplainedFormula
          question="Fixed response와 student rollout을 어떤 mixture로 고르는가?"
          idea={
            <>
              λ는 example마다 현재 student가 만든 prefix를 사용할 확률입니다.
              Teacher는 어느 prefix가 선택되든 다음-token target을 제공하며 λ는
              teacher weight가 아닙니다.
            </>
          }
          formula={String.raw`s\sim(1-\lambda)d_{\rm fixed}+\lambda d_{\pi_s}`}
          annotatedFormula={String.raw`\begin{aligned}b&=\underbrace{\operatorname{Bernoulli}(\lambda)}_{\text{student prefix 사용 여부 추첨}}\\[4pt]s&=\underbrace{(1-b)s_{\rm fixed}+b\,s_{\pi_s}}_{\text{학습할 prefix source 선택}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{Bernoulli}(\lambda)`,
              annotation: [
                "0과 1 사이 λ로 source flag를 뽑아",
                "fixed와 student state 비율을 통제",
              ],
            },
            {
              expression: String.raw`(1-b)s_{\rm fixed}+b\,s_{\pi_s}`,
              annotation: [
                "flag가 0이면 고정, 1이면 student prefix를 골라",
                "teacher가 채점할 실제 state 결정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\lambda`,
              name: "on-policy mixture",
              description: "Student-generated prefix를 사용할 확률입니다.",
            },
            {
              symbol: String.raw`d_{\rm fixed}`,
              name: "fixed-prefix distribution",
              description: "Dataset·teacher response가 만든 state 분포입니다.",
            },
            {
              symbol: String.raw`d_{\pi_s}`,
              name: "student-visited distribution",
              description:
                "현재 student policy가 rollout에서 방문한 state입니다.",
            },
            {
              symbol: "b",
              name: "source flag",
              description:
                "이번 example의 prefix source를 고르는 0/1 변수입니다.",
            },
          ]}
          assumptions={[
            "Sampling에는 gradient를 통과시키지 않습니다.",
            "λ schedule과 decoding policy를 artifact에 기록합니다.",
            "λ=1이어도 teacher가 target을 제공합니다.",
          ]}
          interpretation="λ=0은 fixed response, λ=1은 student rollout입니다. λ=.5는 두 source를 섞지만 teacher confidence를 절반으로 낮춘다는 뜻은 아닙니다."
        />
      </section>
      <section id="teacher-feedback" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · dense correction
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            같은 student prefix에서 teacher와 student의 다음-token 분포를
            비교한다
          </h2>
        </header>
        <p>
          Student가 만든 prefix s를 teacher와 student 양쪽에 넣습니다. Teacher
          distribution은 stop-gradient target이고 student distribution만
          update합니다. 선택 token 하나가 아니라 vocabulary 전체의 상대 정보가
          feedback입니다.
        </p>
        <ExplainedFormula
          question="Student-visited prefix의 token feedback은 어떻게 계산하는가?"
          idea={
            <>
              같은 prefix에서 teacher q와 student p를 만들고 teacher support를
              student가 덮도록 forward KL을 평균합니다.
            </>
          }
          formula={String.raw`L_{\rm OP}=\mathbb E_{s\sim d_{\pi_s}}D_{\rm KL}(q_t(\cdot\mid s)\Vert p_s(\cdot\mid s))`}
          annotatedFormula={String.raw`\begin{aligned}s&\sim\underbrace{d_{\pi_s}}_{\text{현재 student가 방문한 prefix}}\\[4pt]q&=\underbrace{q_t(\cdot\mid s)}_{\text{teacher의 다음-token target}}\\[4pt]p&=\underbrace{p_s(\cdot\mid s)}_{\text{student의 다음-token 분포}}\\[4pt]L_{\rm OP}&=\underbrace{\mathbb E_sD_{\rm KL}(q\Vert p)}_{\text{방문 state에서 teacher support 모방}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`s\sim d_{\pi_s}`,
              annotation: [
                "현재 student로 rollout해",
                "실제 inference에 가까운 prefix 수집",
              ],
            },
            {
              expression: String.raw`q_t(\cdot\mid s)`,
              annotation: [
                "동일 prefix를 frozen teacher에 넣어",
                "vocabulary 전체 target 생성",
              ],
            },
            {
              expression: String.raw`D_{\rm KL}(q\Vert p)`,
              annotation: [
                "teacher expectation으로 student 누락을 벌줘",
                "dense token feedback으로 update",
              ],
            },
          ]}
          terms={[
            {
              symbol: "s",
              name: "visited prefix",
              description: "Student가 지금까지 생성한 token sequence입니다.",
            },
            {
              symbol: "q_t",
              name: "teacher token distribution",
              description: "같은 prefix에 대한 frozen target입니다.",
            },
            {
              symbol: "p_s",
              name: "student token distribution",
              description: "Update할 현재 policy입니다.",
            },
            {
              symbol: String.raw`d_{\pi_s}`,
              name: "student state distribution",
              description: "현재 policy rollout이 만드는 prefix 분포입니다.",
            },
          ]}
          assumptions={[
            "Teacher와 student vocabulary가 같거나 explicit mapping이 있습니다.",
            "Teacher scoring cost와 cache policy를 기록합니다.",
            "Teacher 오류 slice에는 hard·verifier anchor가 필요합니다.",
          ]}
          interpretation="Student가 A→X를 만들면 teacher도 A→X 뒤를 채점합니다. 고정 A→B→C만 반복하는 것과 달리 student가 실제로 낸 실수 뒤의 correction을 배웁니다."
        />
        <div id="paper-gkd">
          <CitationBlock
            source="Agarwal et al. — On-Policy Distillation of Language Models"
            citeKey={1}
            type="paper"
            href="https://arxiv.org/abs/2306.13649"
          >
            <p>
              <strong>문제:</strong> 고정 data와 student rollout 사이의 state
              mismatch를 줄입니다.
            </p>
            <p>
              <strong>기여:</strong> On/off-policy mixture에서 teacher
              divergence를 줄이는 GKD를 제안합니다.
            </p>
            <p>
              <strong>전제:</strong> 논문의 model·task·sampling·divergence
              조건입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Language-model distillation
              실험입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> On-policy data가 teacher 오류나
              reward hacking을 자동 제거하지 않습니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="multi-teacher" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · policy-space integration
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            여러 specialist의 weight를 섞지 않고 prompt domain에서 teacher를
            route한다
          </h2>
        </header>
        <p>
          Math·instruction·SWE teacher를 checkpoint 평균으로 합치면
          representation 정렬을 가정하게 됩니다. Policy-space integration은
          prompt domain k를 먼저 정하고 student rollout s에서 해당 frozen
          teacher qk를 target으로 사용합니다.
        </p>
        <ExplainedFormula
          question="Multi-teacher on-policy loss에서 domain mixture는 어디에 들어가는가?"
          idea={
            <>
              Domain k를 target mixture ρ로 뽑고 해당 prompt에서 student
              rollout을 만든 뒤 teacher k가 같은 prefix를 채점합니다.
            </>
          }
          formula={String.raw`L=\sum_k\rho_k\,\mathbb E_{s\sim d_{\pi_s}(\cdot\mid k)}D(q_k(\cdot\mid s)\Vert p_s(\cdot\mid s))`}
          annotatedFormula={String.raw`\begin{aligned}k&\sim\underbrace{\rho}_{\text{target domain mixture}}\\[4pt]s&\sim\underbrace{d_{\pi_s}(\cdot\mid k)}_{\text{domain prompt의 student rollout}}\\[4pt]q_k&=\underbrace{q_k(\cdot\mid s)}_{\text{선택 domain teacher의 feedback}}\\[4pt]L&=\underbrace{\sum_k\rho_k\,\mathbb E_sD(q_k\Vert p_s)}_{\text{domain별 loss를 목표 비율로 통합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`k\sim\rho`,
              annotation: [
                "배포 목표 비율로 domain을 선택해",
                "specialist routing과 batch mixture 고정",
              ],
            },
            {
              expression: String.raw`s\sim d_{\pi_s}(\cdot\mid k)`,
              annotation: [
                "선택 domain prompt에서 student가 생성해",
                "현재 capability의 visited state 수집",
              ],
            },
            {
              expression: String.raw`\sum_k\rho_k\mathbb E_sD(q_k\Vert p_s)`,
              annotation: [
                "각 specialist feedback을 domain weight로 합쳐",
                "한 student policy objective 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "k",
              name: "domain index",
              description: "Math·instruction·SWE 같은 specialist domain입니다.",
            },
            {
              symbol: String.raw`\rho_k`,
              name: "target domain weight",
              description: "Training과 배포에서 원하는 domain 비율입니다.",
            },
            {
              symbol: "q_k",
              name: "domain teacher",
              description: "Domain k의 frozen token policy입니다.",
            },
            {
              symbol: "p_s",
              name: "shared student",
              description: "모든 domain capability를 담을 하나의 policy입니다.",
            },
          ]}
          assumptions={[
            "Prompt domain label과 routing rule을 고정합니다.",
            "Teacher vocabulary·chat template 호환성을 확인합니다.",
            "Worst-domain과 general capability regression을 별도 승인합니다.",
          ]}
          interpretation="좋은 평균 score만으로 승인하지 않습니다. 한 specialist를 통합하며 다른 domain이 무너지는지 worst-domain slice를 함께 봅니다."
        />
        <div id="paper-mopd">
          <CitationBlock
            source="MOPD — Multi-Teacher On-Policy Distillation"
            citeKey={2}
            type="paper"
            href="https://arxiv.org/abs/2606.30406"
          >
            <p>
              <strong>문제:</strong> Domain별 post-training capability를 한
              student에 통합합니다.
            </p>
            <p>
              <strong>기여:</strong> Student rollout에서 specialist teacher를
              route하는 policy-space 증류를 평가합니다.
            </p>
            <p>
              <strong>전제:</strong> 논문의 teacher origin·domain·model·training
              조건입니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 보고된 LLM capability-integration
              실험입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 임의 checkpoint 조합이나 모든
              domain의 무손실 통합 보장은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="release-gate" className="mb-16 scroll-mt-20 space-y-5">
        <header>
          <p className="text-sm font-semibold text-primary">
            04 · release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Rollout policy·teacher cost·worst-domain regression을 함께 승인한다
          </h2>
        </header>
        <p>
          λ schedule, sampler, teacher revision, token divergence, rollout
          quality, domain mixture, cost와 independent evaluation을 보존합니다.
          같은 model 세대를 teacher로 반복하는 문제는{" "}
          <a
            className="text-primary hover:underline"
            href="/ai/self-distillation"
          >
            self-distillation
          </a>
          에서 분리합니다.
        </p>
      </section>
    </article>
  );
}
