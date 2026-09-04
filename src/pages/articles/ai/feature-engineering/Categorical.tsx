import ExplainedFormula from "@/components/ui/explained-formula";
import CategoricalViz from "./viz/CategoricalViz";

export default function Categorical() {
  return (
    <section id="categorical" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        범주형 인코딩은 이름을 숫자로 바꾸면서 어떤 관계를 허용할지 정합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bronze·Silver·Gold처럼 실제 순서가 있는 등급에는 ordinal encoding을 사용할 수 있지만 서울·부산·제주를 1·2·3으로 바꾸면 부산이 서울의 두 배라는
          가짜 거리가 생깁니다. One-hot encoding은 각 범주를 독립된 축으로 두어 이 순서를 만들지 않는 대신 category 수만큼 sparse column이 늘어납니다.
          Cardinality 하나로 방법을 고르기보다 관계의 의미, model의 native categorical 처리, memory와 새 ID 발생 방식을 함께 봅니다.
        </p>
        <p>
          Frequency encoding은 label을 직접 쓰지 않지만 전체 dataset에서 횟수를 세면 validation 분포를 미리 봅니다. Target encoding은
          category별 target 평균을 쓰므로 더 직접적인 누출 경로가 생깁니다. Training row 자신의 label이 자기 피처로 되돌아오지 않게 out-of-fold 또는
          ordered statistics를 써야 하며 validation과 test에는 training에서 만든 mapping만 적용합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Target encoding에서 자기 label을 보지 않으면서 드문 category의 평균을 안정화하려면 어떻게 할까?"
        idea={<>Row i가 속한 fold를 통째로 제외하고 같은 category c의 target 합과 count를 계산합니다. 관측이 적으면 전체 training 평균 μ 쪽으로 당기는 smoothing α를 더합니다. 이렇게 하면 해당 row의 정답이 곧바로 자기 입력이 되는 지름길을 막을 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
S_i&=\sum_{j\notin k(i)}\mathbf 1[c_j=c_i]y_j,\\
N_i&=\sum_{j\notin k(i)}\mathbf 1[c_j=c_i],\\
\operatorname{TE}^{(-k(i))}(c_i)
&=\frac{S_i+\alpha\mu_{\mathrm{train}}}{N_i+\alpha}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
S_i&=\underbrace{\sum_{j\notin k(i)}\mathbf 1[c_j=c_i]y_j,}_{\text{category indicator 계산}}\\
N_i&=\underbrace{\sum_{j\notin k(i)}\mathbf 1[c_j=c_i],}_{\text{category indicator 계산}}\\
\operatorname{TE}^{(-k(i))}(c_i)
&=\underbrace{\frac{S_i+\alpha\mu_{\mathrm{train}}}{N_i+\alpha}.}_{\text{기준량당 비율}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{j\notin k(i)}\mathbf 1[c_j=c_i]y_j,`, annotation: ["category indicator이(가) 식의 결과에 기여하는","방식을 계산합니다.","Row i가 속한 fold를 통째로 제외하고 같은","category c의 target 합과 count를"] },
          { expression: String.raw`\sum_{j\notin k(i)}\mathbf 1[c_j=c_i],`, annotation: ["category indicator이(가) 식의 결과에 기여하는","방식을 계산합니다.","Row i가 속한 fold를 통째로 제외하고 같은","category c의 target 합과 count를"] },
          { expression: String.raw`\frac{S_i+\alpha\mu_{\mathrm{train}}}{N_i+\alpha}.`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Row i가 속한 fold를 통째로 제외하고 같은","category c의 target 합과 count를","계산합니다."] },
        ]}
        terms={[
          { symbol: "k(i)", name: "row i의 fold", description: "Encoding 통계를 만들 때 i와 같은 validation fold 전체를 제외합니다." },
          { symbol: "1[c_j=c_i]", name: "category indicator", description: "Row j가 i와 같은 category일 때만 1이 됩니다." },
          { symbol: "y_j", name: "training target", description: "현재 mapping을 fit하는 fold 안에서만 사용할 target입니다." },
          { symbol: "μ_train", name: "global training mean", description: "해당 fold를 제외한 training target의 전체 평균입니다." },
          { symbol: "α", name: "smoothing strength", description: "Category count가 작을수록 전체 평균 쪽으로 더 당기는 pseudo-count입니다." },
          { symbol: "Sᵢ, Nᵢ", name: "excluded-fold sum and count", description: "Row i의 fold를 제외한 같은 category의 target 합과 관측 수입니다." },
        ]}
        assumptions={["Fold는 실제 evaluation의 시간·entity 경계를 보존합니다.", "Validation·test mapping에는 해당 split의 target을 사용하지 않습니다.", "새 category에는 global mean이나 정해진 fallback을 적용합니다."]}
        interpretation="Cross-fitting은 같은 row의 label이 돌아오는 직접 누출을 막지만, 시간 순서를 무시한 fold나 반복 entity를 섞은 fold까지 자동으로 고치지는 않습니다. Split 설계가 먼저입니다."
      />

      <div className="not-prose my-8"><CategoricalViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div id="paper-catboost" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · Ordered target statistics</p>
          <p className="mt-2 text-sm font-semibold">CatBoost: Unbiased Boosting with Categorical Features</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            CatBoost는 category 통계와 boosting에서 target을 다시 사용하는 과정이 prediction shift를 만들 수 있음을 분석하고 permutation의
            앞부분만 사용한 ordered statistics와 ordered boosting을 제안했습니다. 이는 모든 dataset에서 target encoding이 one-hot보다
            우월하다는 결론이 아니라, label 기반 피처를 만드는 순서 자체가 학습 알고리즘의 일부라는 근거입니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1706.09516" target="_blank" rel="noreferrer">원 논문의 prediction shift와 ordered statistics 보기</a>
        </div>

        <h3>새 범주와 드문 범주도 정상 입력입니다</h3>
        <p>
          Production에서는 학습 때 없던 category가 들어옵니다. Error로 중단할지, unknown token·전체 평균·other bucket으로 보낼지를 사전에
          정합니다. Rare category를 묶는 count 기준도 training fold에서만 계산해야 하며 대소문자·공백·ID 재사용 같은 normalization 규칙까지
          versioning해야 같은 이름이 train과 serving에서 다른 category가 되는 일을 막을 수 있습니다.
        </p>
        <p>
          Embedding은 범주를 dense vector로 학습해 high cardinality를 다룰 수 있지만 category 사이 의미 있는 geometry를 학습할 충분한 관측과
          안정적인 ID가 필요합니다. 새 ID가 자주 생기거나 의미가 바뀌는 column에서는 hashing·frequency baseline이 더 견고할 수 있습니다. Hash
          collision도 사라지는 것이 아니라 서로 다른 category를 같은 bucket에 놓는 명시적 trade-off입니다.
        </p>
      </div>
    </section>
  );
}
