import ExplainedFormula from "@/components/ui/explained-formula";
import LogitViz from "./viz/LogitViz";

export default function Logit() {
  return (
    <section id="logit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Logit distillation은 temperature로 class 관계를 드러낸 뒤 teacher 분포와 student 분포를 맞춥니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Logit은 softmax를 적용하기 전 class별 실수 score입니다. Teacher가 정답 class에 거의 1을 주면 나머지 class 관계가 매우 작은 probability 안에 묻힙니다. Temperature <code>T</code>로 logit을 나누면 분포가 평평해져 non-target class의 상대 관계가 보입니다. <code>T=1</code>은 원래 분포이고, <code>T</code>가 클수록 완만해집니다.
        </p>
      </div>
      <ExplainedFormula
        question="Temperature는 teacher가 두 class에 주는 상대 확률을 어떻게 바꿀까요?"
        idea={<>두 class의 softmax 확률비에서는 공통 분모가 사라지고 logit 차이만 남습니다. 그 차이를 <code>T</code>로 나누므로 큰 temperature는 odds 차이를 줄이고 작은 class에도 학습 신호를 남깁니다.</>}
        formula={String.raw`q_i^{(T)}=\frac{e^{z_i^{\mathrm{teacher}}/T}}{\sum_j e^{z_j^{\mathrm{teacher}}/T}},\qquad \frac{q_i^{(T)}}{q_k^{(T)}}=\exp\!\left(\frac{z_i-z_k}{T}\right)`}
        terms={[
          { symbol: "z_i", name: "teacher logit", description: "Softmax 전 class i의 실수 score입니다." },
          { symbol: "T", name: "temperature", description: "양수이며 logit 차이를 나누어 분포의 sharpness를 조절합니다." },
          { symbol: "q_i^(T)", name: "soft target", description: "Temperature를 적용한 teacher의 class-i probability입니다." },
          { symbol: "q_i/q_k", name: "class odds", description: "Teacher가 class i를 k보다 얼마나 더 선호하는지 나타내는 비율입니다." },
        ]}
        assumptions={[
          "Teacher와 student가 같은 class 집합과 순서를 공유하는 classification interface를 가정합니다.",
          "T는 0보다 커야 하며 training과 저장된 teacher logits의 temperature convention을 함께 기록합니다.",
          "분포가 부드러워져도 teacher 오류가 정답으로 바뀌지는 않으므로 held-out teacher quality와 calibration을 먼저 봅니다.",
        ]}
        interpretation="Logit 차이가 4라면 T=1에서 odds는 e⁴≈54.6이지만 T=2에서는 e²≈7.4입니다. 순서는 유지하면서 덜 선호한 class에도 더 큰 probability가 남습니다."
      />
      <ExplainedFormula
        question="Soft target만 따라가면 teacher의 오류까지 복제하므로 ground-truth와 어떻게 함께 학습할까요?"
        idea={<>정답 one-hot에 대한 cross-entropy는 실제 label에 model을 고정하고, temperature 분포의 forward KL은 teacher가 class 사이에 배분한 상대 probability를 전달합니다.</>}
        formula={String.raw`\mathcal L=(1-\alpha)\,\operatorname{CE}(y,p_s^{(1)})+\alpha T^2\,D_{\mathrm{KL}}\!\left(q_t^{(T)}\,\Vert\,p_s^{(T)}\right)`}
        terms={[
          { symbol: "y", name: "hard label", description: "Dataset의 ground-truth one-hot 또는 target distribution입니다." },
          { symbol: "p_s^(1)", name: "student task distribution", description: "원래 temperature 1에서 student가 내는 배포용 probability입니다." },
          { symbol: "q_t^(T)", name: "teacher soft target", description: "Teacher logit을 T로 완화한 target distribution입니다." },
          { symbol: "p_s^(T)", name: "student soft distribution", description: "같은 T를 적용해 teacher와 비교하는 student distribution입니다." },
          { symbol: "alpha", name: "distillation weight", description: "Hard-label anchor와 teacher imitation의 비중을 정하는 0–1 계수입니다." },
          { symbol: "T^2", name: "gradient-scale compensation", description: "큰 T에서 softmax gradient가 약해지는 효과를 보정하는 고전 recipe의 계수입니다." },
        ]}
        assumptions={[
          "Forward KL DKL(teacher||student)를 사용하며 reduction과 batch weighting을 고정합니다.",
          "Teacher는 stop-gradient target이고 student만 update합니다.",
          "T²는 자동 정답이 아니라 Hinton recipe의 scale 보정입니다. Alpha·T·optimizer와 class 수를 validation에서 함께 선택합니다.",
        ]}
        interpretation="Alpha=0이면 일반 supervised learning이고 alpha=1이면 teacher distribution만 모방합니다. Teacher가 틀린 sample에서도 hard-label 항이 반대 방향의 anchor를 제공하므로 둘의 gradient conflict를 slice별로 확인해야 합니다."
      />
      <ExplainedFormula
        question="왜 큰 temperature를 쓸 때 distillation 항에 T²를 곱하나요?"
        idea={<>Temperature-softmax cross-entropy를 student logit으로 미분하면 먼저 <code>1/T</code>가 나옵니다. 큰 T에서는 teacher와 student probability 차이도 대략 <code>1/T</code>로 줄어 gradient가 약 <code>1/T²</code> 규모가 되므로 이를 보정합니다.</>}
        formula={String.raw`\frac{\partial\,\operatorname{CE}(q^{(T)},p^{(T)})}{\partial z_{s,i}}=\frac{p_i^{(T)}-q_i^{(T)}}{T},\qquad p_i^{(T)}-q_i^{(T)}=O(T^{-1})\ \text{for large }T`}
        terms={[
          { symbol: "z_s,i", name: "student logit", description: "Student가 학습하는 class-i score입니다." },
          { symbol: "p-q", name: "probability residual", description: "Student와 teacher의 softened class probability 차이입니다." },
          { symbol: "O(T^-1)", name: "large-T scale", description: "Centered logit 차이가 고정일 때 probability residual 크기가 temperature에 반비례하는 근사입니다." },
        ]}
        assumptions={[
          "큰 T에서 centered logits가 T보다 충분히 작다는 1차 softmax 근사를 사용합니다.",
          "Loss implementation이 mean/sum 중 무엇인지와 logits·probability 입력 여부를 확인합니다.",
          "T²를 곱해도 optimization curvature·teacher calibration·hard-loss gradient와의 비율이 완전히 같아지는 것은 아닙니다.",
        ]}
        interpretation="미분식의 1/T와 residual의 약 1/T가 곱해져 soft-target gradient가 빠르게 작아집니다. T² 보정은 T를 바꿀 때 distillation 항이 단순히 사라지는 일을 줄이는 장치입니다."
      />
      <ExplainedFormula
        question="KL의 두 인수 순서를 바꾸면 왜 같은 distillation loss가 되지 않을까요?"
        idea={<>Forward KL은 teacher가 probability를 둔 class를 student가 놓칠 때 크게 벌주며 teacher expectation으로 계산합니다. 순서를 바꾸면 student가 선택한 class 중심으로 teacher를 보게 되어 낮은 teacher probability를 피하는 쪽이 강해집니다.</>}
        formula={String.raw`D_{\mathrm{KL}}(q_t\Vert p_s)=\sum_i q_{t,i}\log\frac{q_{t,i}}{p_{s,i}},\qquad D_{\mathrm{KL}}(p_s\Vert q_t)=\sum_i p_{s,i}\log\frac{p_{s,i}}{q_{t,i}}`}
        terms={[
          { symbol: "q_t", name: "teacher distribution", description: "고정된 distillation target probability입니다." },
          { symbol: "p_s", name: "student distribution", description: "Student logit에서 나온 학습 대상 probability입니다." },
          { symbol: "q log(q/p)", name: "forward-KL contribution", description: "Teacher probability가 큰 class를 student가 작게 두면 커집니다." },
          { symbol: "p log(p/q)", name: "reverse-KL contribution", description: "Student가 probability를 둔 class의 teacher probability가 작으면 커집니다." },
        ]}
        assumptions={[
          "두 분포는 같은 class support에 있고 numerical implementation은 log-softmax로 zero underflow를 피합니다.",
          "고전 logit distillation은 보통 teacher-to-student cross-entropy와 동치인 forward KL을 사용합니다.",
          "Reverse KL의 mode-seeking 직관은 분포와 parameterization에 따른 일반적 경향이며 모든 finite classification example의 단일 행동 규칙은 아닙니다.",
        ]}
        interpretation="Teacher가 여우에도 .25를 주는데 student가 거의 0을 주면 forward KL이 이를 강하게 벌줍니다. 두 인수를 바꾸면 objective와 gradient가 달라지므로 라이브러리 함수의 input·target 순서를 확인해야 합니다."
      />
      <div className="not-prose my-8"><LogitViz /></div>
      <div id="paper-hinton-kd" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Distilling the Knowledge in a Neural Network</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">핵심 문제는 여러 model의 ensemble이 정확하지만 deployment가 비싸다는 점이며, temperature-softened output과 hard target을 이용해 한 model로 behavior를 옮겼습니다. MNIST·speech system·specialist ensemble이라는 당시 범위의 결과이며, 모든 teacher–student 조합에서 작은 model이 teacher 성능을 보존한다는 보장은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1503.02531" target="_blank" rel="noreferrer">Temperature·T²·specialist 실험 범위 보기</a>
      </div>
    </section>
  );
}
