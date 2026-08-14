import ExplainedFormula from "@/components/ui/explained-formula";

export default function DPO() {
  return (
    <section id="dpo" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        DPO는 pairwise preference를 policy loss로 직접 옮긴다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Direct Preference Optimization(DPO)은 PPO-RLHF의 “reward model을
          학습하고 그 score를 online으로 최대화한다”는 두 단계를 하나의 pairwise
          classification loss로 바꾼다. 출발점은 KL-regularized reward objective의
          optimal policy를 reward에 대해 다시 쓰는 것이다. 이 관계를
          Bradley–Terry preference model에 대입하면 prompt마다 생기는 partition
          function이 chosen과 rejected의 차이에서 상쇄된다.
        </p>
      </div>

      <ExplainedFormula
        question="Chosen·rejected pair만으로 reference 대비 policy의 선호 방향을 어떻게 학습할까?"
        idea={<>각 response의 log probability가 아니라 policy가 reference보다 그 response를 얼마나 더 선호하게 됐는지 log-ratio를 비교합니다. Chosen의 relative log-ratio가 rejected보다 클수록 sigmoid 안의 margin이 커집니다.</>}
        formula={String.raw`\begin{aligned}r_\theta(x,y)&=\log\frac{\pi_\theta(y\mid x)}{\pi_{ref}(y\mid x)}\\\Delta_\theta&=r_\theta(x,y_+)-r_\theta(x,y_-)\\\mathcal L_{DPO}&=-\mathbb E_{\mathcal D}\log\sigma(\beta\Delta_\theta)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
r_+(x)
 &=\underbrace{\log\frac{\pi_\theta(y_+\mid x)}{\pi_{ref}(y_+\mid x)}}_{\text{chosen의 reference 대비 상승량}}\\
r_-(x)
 &=\underbrace{\log\frac{\pi_\theta(y_-\mid x)}{\pi_{ref}(y_-\mid x)}}_{\text{rejected의 reference 대비 상승량}}\\
\Delta_\theta
 &=\underbrace{r_+(x)-r_-(x)}_{\text{chosen 방향의 상대 margin}}\\
\mathcal L_{DPO}
 &=\underbrace{-\mathbb E_{\mathcal D}\log\sigma(\beta\Delta_\theta)}_{\text{chosen label의 logistic loss}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\pi_\theta(y)/\pi_{ref}(y)`, annotation: ["Response의 절대 likelihood가 아니라", "reference에서 변한 비율을 계산"] },
          { expression: String.raw`r_+-r_-`, annotation: ["Chosen과 rejected의 이동량을 빼", "공통 prompt normalization을 상쇄"] },
          { expression: String.raw`\beta\Delta_\theta`, annotation: ["Relative margin의", "preference update 민감도를 조절"] },
          { expression: String.raw`-\log\sigma(\beta\Delta_\theta)`, annotation: ["Chosen margin이 음수인 pair를", "큰 손실로 교정"] },
        ]}
        terms={[
          { symbol: String.raw`\pi_\theta`, name: "trainable policy", description: "Preference pair로 update되는 model입니다." },
          { symbol: String.raw`\pi_{ref}`, name: "reference policy", description: "보통 SFT checkpoint를 고정한 기준 model입니다." },
          { symbol: String.raw`\Delta_\theta`, name: "relative preference margin", description: "Reference 대비 chosen 쪽으로 이동한 정도에서 rejected 쪽 이동을 뺍니다." },
          { symbol: String.raw`\beta`, name: "temperature·regularization scale", description: "DPO 유도에서 KL coefficient와 연결되지만 library별 convention을 확인해야 합니다." },
        ]}
        assumptions={["같은 prompt의 chosen·rejected pair와 고정 reference log-probability를 사용합니다.", "표준 유도는 KL-regularized reward maximization과 Bradley–Terry preference model을 전제로 합니다."]}
        interpretation="DPO는 별도 scalar reward network와 training 중 online rollout을 제거합니다. Reference, pair quality, offline support와 독립 평가까지 제거하는 방법은 아닙니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>단순한 pipeline이 해결하지 않는 문제</h3>
        <p>
          DPO는 offline preference pair의 support 안에서 학습하므로 현재 policy가
          새롭게 생성하는 response를 그 자리에서 평가하지 않는다. Pair가 noisy하거나
          chosen과 rejected의 실질적 품질 차이가 작고 length·style shortcut이 있으면
          그 편향도 margin에 들어간다. Reference checkpoint와 chat template,
          sequence log-prob의 length normalization을 바꾸면 같은 β라도 유효 update
          scale이 달라질 수 있어 implementation contract를 함께 기록해야 한다.
        </p>
        <p>
          <a href="https://arxiv.org/abs/2305.18290" target="_blank" rel="noreferrer">DPO 원 논문</a>의
          비교 결과는 summarization·single-turn dialogue와 sentiment control이라는
          실험 조건에서 읽어야 한다. 새로운 base model과 dataset에서도 PPO보다
          항상 우월하다는 일반 법칙으로 확장하지 않는다.
        </p>
      </div>

      <div
        id="paper-dpo"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · DPO</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          핵심 아이디어는 reward를 없앤 것이 아니라 optimal policy 안으로 흡수한 것이다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          KL-regularized reward maximization의 closed-form optimal policy를 reward에
          대해 다시 쓰고 Bradley–Terry preference likelihood에 대입하면, prompt별
          partition function이 chosen–rejected 차이에서 상쇄됩니다. 그래서 별도
          reward network와 online rollout 없이 policy log-ratio를 직접 학습하지만,
          preference model의 가정과 reference policy는 그대로 남습니다.
        </p>
      </div>
    </section>
  );
}
