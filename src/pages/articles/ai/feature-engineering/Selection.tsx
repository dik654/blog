import ExplainedFormula from "@/components/ui/explained-formula";
import SelectionViz from "./viz/SelectionViz";

export default function Selection() {
  return (
    <section id="selection" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        피처 선택은 중요도 순위가 아니라 다시 학습해 확인한 제거 결정입니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          피처를 줄이는 목적은 validation 점수만이 아닙니다. Online lookup latency,
          memory, source 장애 범위와 drift 감시 비용도 함께 줄일 수 있습니다.
          먼저 상수·중복·예측 시점에 계산할 수 없는 피처를 계약 검사로 제거하고,
          label을 보는 selection은 model tuning과 마찬가지로 cross-validation의
          training fold 안에서 수행합니다.
        </p>
        <p>
          Model importance, permutation importance와 SHAP은 서로 다른 질문에
          답합니다. Split gain은 현재 tree가 그 피처를 얼마나 사용했는지,
          permutation은 대응 관계를 깨뜨렸을 때 현재 model의 validation 성능이
          얼마나 변하는지, SHAP은 선택한 background와 model 아래에서 한 예측을
          어떻게 배분할지를 보여줍니다. 어느 것도 인과관계를 자동으로 증명하지
          않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Permutation importance는 무엇을 측정하며, 상관된 피처에서 왜 작아질 수 있을까?"
        idea={<>Validation에서 j번째 column만 무작위로 섞어 그 피처와 target·다른 피처의 대응을 끊은 뒤 loss가 얼마나 늘어나는지 봅니다. 같은 정보를 담은 다른 column이 남아 있으면 model이 그 대체재를 사용하므로 개별 중요도는 작게 나올 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
L_0&=L\!\left(f(X),y\right),\\
L_j^{\pi}&=L\!\left(f(X_{-j},X_j^{\pi}),y\right),\\
I_j&=\mathbb E_{\pi}\!\left[L_j^{\pi}-L_0\right].
\end{aligned}`}
        terms={[
          { symbol: "X_j^π", name: "permuted feature", description: "Row 순서를 random permutation π로 바꾼 j번째 validation column입니다." },
          { symbol: "X_−j", name: "remaining features", description: "섞지 않고 그대로 둔 나머지 validation columns입니다." },
          { symbol: "L", name: "evaluation loss", description: "Task와 운영 목표에 맞춰 고정한 validation metric 또는 loss입니다." },
          { symbol: "E_π", name: "permutation average", description: "한 번의 random shuffle noise를 줄이기 위해 여러 permutation 결과를 평균냅니다." },
        ]}
        assumptions={["평가 row는 training과 feature selection에 사용하지 않은 validation data입니다.", "Permutation이 해당 column의 marginal distribution은 유지하면서 대응 관계만 깨뜨립니다.", "상관·group·time structure가 강하면 group permutation 또는 적절한 block shuffle을 검토합니다."]}
        interpretation="I_j는 현재 model과 현재 feature set에서 j가 제공하는 추가 예측 정보의 진단값입니다. 인과 효과나 데이터 자체의 영구적인 가치를 뜻하지 않습니다."
      />

      <div className="not-prose my-8"><SelectionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-feature-selection" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · 선택 목표와 검증</p>
          <p className="mt-2 text-sm font-semibold">An Introduction to Variable and Feature Selection</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Guyon과 Elisseeff는 selection의 목표를 예측 성능, 더 빠르고 저렴한
            predictor, 데이터 생성 과정의 이해로 나누고 ranking·subset selection·
            feature construction의 조건을 정리했습니다. 개별 ranking이 최적 subset을
            보장하거나 선택된 피처가 causal variable이라는 결론은 아닙니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jmlr.org/papers/v3/guyon03a.html" target="_blank" rel="noreferrer">원 논문의 selection checklist와 평가 범위 보기</a>
        </div>

        <h3>중요도는 후보를 만들고, ablation이 결정을 내립니다</h3>
        <p>
          Boruta는 random shadow feature와 비교해 관련 피처를 넓게 찾는
          all-relevant 접근이고, RFE는 estimator를 반복 학습하며 정해진 크기의
          subset을 찾습니다. 목적과 계산 비용이 다르므로 여러 방법의 다수결을
          정답처럼 쓰지 않습니다. 후보를 제거한 model을 같은 fold와 seed에서
          다시 학습하고, 평균 metric·fold 분산·worst-group 성능·latency·수집
          비용을 함께 비교합니다.
        </p>

        <h3>마지막 검사는 training-serving parity입니다</h3>
        <p>
          Offline notebook과 online service가 같은 이름의 피처를 서로 다른 SQL,
          timezone, default value 또는 library version으로 계산하면
          training-serving skew가 생깁니다. 대표 entity와 cutoff를 고정한 golden
          fixture를 두고 batch 결과와 online 결과를 값·dtype·freshness까지
          비교합니다. Model artifact와 함께 feature definition version을 배포하고,
          missing rate·unknown rate·freshness·distribution drift를 운영 지표로
          감시해야 selection 이후의 이득이 production에서도 유지됩니다.
        </p>
      </div>
    </section>
  );
}
