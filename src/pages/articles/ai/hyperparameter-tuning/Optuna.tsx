import ExplainedFormula from "@/components/ui/explained-formula";
import OptunaFlowViz from "./viz/OptunaFlowViz";

export default function Optuna() {
  return (
    <section id="optuna" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Optuna에서는 Study가 실험이고, Trial은 그 실험 안의 관측 한 건입니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          <strong>Objective</strong>는 trial에서 설정을 받아 모델을 학습하고 하나 이상의 값을 돌려주는 함수입니다. <strong>Sampler</strong>는
          지금까지의 trial history로 다음 설정을 제안하고, <strong>Pruner</strong>는 같은 resource step의 중간값을 보고 일부 trial을
          멈춥니다. <strong>Storage</strong>는 이 셋을 이어 주는 이력입니다. 이 역할을 구분하면 “Optuna가 모델을 학습한다”가 아니라
          “우리 objective를 여러 번 실행하고 관측을 관리한다”는 구조가 보입니다.
        </p>
        <p>
          Sequential sampler는 과거의 좋은 trial을 이용하므로 무조건 random보다 낫지 않습니다. 초반 관측이 적거나 score noise가
          크고 worker가 비동기로 끝나면 surrogate가 불완전한 history를 학습합니다. 같은 총 예산의 random study와 비교하고, 시작
          trial·seed·parallelism을 기록해야 sampler 자체의 이득을 판단할 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Adaptive sampler는 과거 trial을 이용해 다음 후보를 어떤 형태로 고를까요?"
        idea={<>지금까지 관측한 설정과 score를 history로 모은 뒤, 유망함과 아직 모르는 정도를 수치화한 acquisition이 큰 후보를 선택합니다.</>}
        formula={String.raw`\lambda_{t+1}=\arg\max_{\lambda\in\Lambda}\;a_t\!\left(\lambda\mid\mathcal H_t\right),\qquad \mathcal H_t=\{(\lambda_i,y_i,s_i)\}_{i=1}^{t}`}
        terms={[
          { symbol: "H_t", name: "trial history", description: "t시점까지의 configuration, 관측 score, COMPLETE·PRUNED·FAIL 상태를 모은 기록입니다." },
          { symbol: "a_t", name: "acquisition rule", description: "현재 좋은 후보를 활용할지, 불확실한 영역을 탐색할지를 정하는 sampler의 선택 기준입니다." },
          { symbol: "Lambda", name: "search space", description: "Type·scale·conditional branch·feasibility가 명시된 전체 후보 공간입니다." },
          { symbol: "s_i", name: "trial state", description: "완료·중단·실패를 구분해 score가 없는 이유를 보존합니다." },
        ]}
        assumptions={[
          "각 y_i가 같은 objective·split·resource에서 비교 가능해야 history가 의미를 가집니다.",
          "Batch로 동시에 제안한 후보는 서로의 아직 끝나지 않은 결과를 보지 못할 수 있습니다.",
          "Acquisition의 정확한 정의는 sampler마다 다르며 이 식은 공통 구조를 나타냅니다.",
        ]}
        interpretation="Sampler를 바꾸는 것은 ‘더 똑똑한 random’ 버튼이 아니라 history를 어떤 모델과 규칙으로 다음 실행에 사용하는지 바꾸는 일입니다."
      />

      <ExplainedFormula
        question="TPE가 좋은 trial에서 자주 나온 설정을 어떻게 선호하는지 가장 짧게 표현하면 무엇일까요?"
        idea={<>관측 score를 기준으로 좋은 집합과 나머지로 나누고, 좋은 집합의 설정 밀도 l은 높고 나머지 밀도 g는 낮은 지점을 찾습니다.</>}
        formula={String.raw`\ell(\lambda)=p(\lambda\mid y<y^*),\quad g(\lambda)=p(\lambda\mid y\ge y^*),\quad \text{prefer large }\frac{\ell(\lambda)}{g(\lambda)}`}
        terms={[
          { symbol: "y*", name: "score quantile threshold", description: "Minimization에서 관측을 좋은 집합과 나머지로 나누는 quantile 경계입니다." },
          { symbol: "l(lambda)", name: "good density", description: "좋은 trial 집합에서 해당 설정 근처가 나타날 조건부 밀도입니다." },
          { symbol: "g(lambda)", name: "other density", description: "나머지 trial 집합에서 해당 설정 근처가 나타날 조건부 밀도입니다." },
        ]}
        assumptions={[
          "Minimization 표기이며 maximization이면 좋은 집합의 부등호 방향이 달라집니다.",
          "실제 TPE 구현에는 prior·candidate sampling·multivariate/group 옵션 등 추가 규칙이 있습니다.",
          "l/g가 인과적으로 좋은 설정임을 증명하지 않으며 search distribution 안의 관측에 의존합니다.",
        ]}
        interpretation="좋은 trial에서만 흔한 범위를 다시 살펴보되, 나쁜 trial에서도 흔한 범위는 피하는 밀도비 관점입니다."
      />

      <div className="not-prose my-8"><OptunaFlowViz /></div>

      <div id="paper-optuna" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · Optuna</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          논문의 핵심 기여는 특정 sampler의 우월성 하나가 아니라 실행 중 conditional search space를 구성하는 define-by-run API,
          search와 pruning의 결합, local부터 distributed storage까지 이어지는 software architecture입니다. 따라서 논문 benchmark는
          당시 task와 구현 조건의 근거이며, 현재 Optuna의 모든 default나 특정 sampler가 언제나 최선이라는 근거는 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1907.10902" target="_blank" rel="noreferrer">논문과 설계 기준 보기</a>
      </div>

      <div id="paper-tpe" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">알고리즘 원 논문 · Algorithms for Hyper-Parameter Optimization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          TPE는 목적함수 y를 설정 λ에서 직접 회귀하는 대신 p(λ|y)를 좋은 관측과 나머지로 나누어 모델링합니다. 이 표현은 tree-shaped
          conditional space를 다루기 좋다는 설계와 연결됩니다. 위 밀도비는 직관을 위한 핵심 골격이며 실제 구현의 모든 heuristic을
          대신하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://papers.nips.cc/paper/4443-algorithms-for-hyper-parameter-optimization" target="_blank" rel="noreferrer">원 논문의 derivation과 실험 보기</a>
      </div>

      <div id="standard-optuna-study" className="not-prose my-8 scroll-mt-24 border-l border-border pl-4">
        <p className="text-xs font-bold text-foreground">공식 문서 · Study API</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현재 API에서 Study는 optimization task와 trials history를 나타내며 sampler·pruner·storage를 함께 가집니다. 재현할 때는
          설치 version, study name, direction, search-space version, code/data revision을 저장하고 FAIL을 단순 삭제하지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://optuna.readthedocs.io/en/stable/reference/generated/optuna.study.Study.html" target="_blank" rel="noreferrer">현재 공식 API 보기</a>
      </div>
    </section>
  );
}
