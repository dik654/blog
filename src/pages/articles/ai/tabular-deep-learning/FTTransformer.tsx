import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import FTTransformerViz from "./viz/FTTransformerViz";

export default function FTTransformer() {
  return (
    <section id="ft-transformer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">FT-Transformer는 각 column의 값과 정체성을 하나의 token에 담습니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          숫자 42만으로는 나이인지 계좌 잔액인지 알 수 없습니다. Feature
          tokenizer는 각 numerical column에 별도의 방향 vector와 bias를 두어
          scalar 값을 d차원 token으로 펼칩니다. Categorical column은 그 column
          전용 lookup table에서 category row를 고릅니다. 따라서 같은 category ID나
          같은 숫자라도 column이 다르면 서로 다른 representation을 가집니다.
        </p>
        <p>
          이 token들 앞에 learned [CLS] token을 붙이고 Transformer layer를
          통과시키면, 각 feature가 같은 row의 다른 feature를 조건부로 읽을 수
          있습니다. 마지막 [CLS] representation이 전체 row summary가 되어
          classification이나 regression head로 전달됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="Numerical scalar 하나를 column 정체성이 보존된 d차원 token으로 어떻게 바꿀까?"
        idea={<>j번째 numerical column만의 direction vector wⱼ를 scalar xᵢⱼ만큼 늘리고, feature bias bⱼ를 더합니다. 값의 크기와 column identity를 함께 학습 가능한 vector로 만드는 계산입니다.</>}
        formula={String.raw`T^{(\mathrm{num})}_{i,j}=b_j+x^{(\mathrm{num})}_{i,j}w_j\in\mathbb R^d`}
        terms={[
          { symbol: "x_i,j", name: "numerical value", description: "i번째 row의 j번째 수치형 scalar이며 단위·missing 처리는 schema contract가 정합니다." },
          { symbol: "w_j", name: "feature direction", description: "j번째 column 값이 token space에서 움직일 고유한 d차원 방향입니다." },
          { symbol: "b_j", name: "feature bias", description: "값이 0일 때도 column의 정체성을 남기는 d차원 기준 vector입니다." },
          { symbol: "T_i,j", name: "feature token", description: "Transformer가 한 위치로 처리할 d차원 representation입니다." },
        ]}
        assumptions={["Numerical scaling과 missing indicator 정책은 training fold에서 정해져 serving에 고정됩니다.", "w_j와 b_j는 column마다 다르며 모든 numerical feature가 같은 방향을 공유하지 않습니다.", "Token dimension d는 representation capacity와 memory·compute를 함께 바꿉니다."]}
        interpretation="Tokenizer는 scalar를 복사하는 것이 아니라 feature별 affine line을 d차원 공간에 만듭니다. 이 단계부터 column 이름에 해당하는 정체성이 parameter에 들어갑니다."
      />

      <ExplainedFormula
        question="Categorical 값과 numerical token을 어떻게 하나의 row token matrix로 모을까?"
        idea={<>Categorical column은 one-hot을 직접 큰 vector로 유지하지 않고 column 전용 embedding table에서 해당 category vector를 lookup합니다. 모든 feature token과 [CLS]를 위아래로 쌓아 Transformer input을 만듭니다.</>}
        formula={String.raw`T^{(\mathrm{cat})}_{i,j}=b_j+E_j[c_{i,j}],\qquad T_i=\operatorname{stack}([\mathrm{CLS}],T_{i,1},\ldots,T_{i,k})\in\mathbb R^{(k+1)\times d}`}
        terms={[
          { symbol: "c_i,j", name: "category index", description: "j번째 column vocabulary 안에서 현재 category를 가리키는 discrete ID입니다." },
          { symbol: "E_j", name: "column embedding table", description: "j번째 categorical column의 category별 d차원 vector를 저장합니다." },
          { symbol: "k+1", name: "sequence length", description: "k개 feature token에 row summary를 위한 [CLS] token 하나를 더한 길이입니다." },
          { symbol: "d", name: "token dimension", description: "모든 heterogeneous feature가 맞춰지는 공통 representation width입니다." },
        ]}
        assumptions={["Unknown·rare·missing category의 vocabulary mapping이 artifact에 포함됩니다.", "Table column은 원래 sequence가 아니므로 임의의 시간 순서 의미를 부여하지 않습니다.", "Feature 수 k가 커질수록 dense self-attention의 pair 수는 (k+1)²로 늘어납니다."]}
        interpretation="Feature tokenizer가 이질적인 column을 같은 shape로 맞춘 뒤에야 self-attention이 feature-to-feature interaction을 계산할 수 있습니다."
      />

      <div className="not-prose my-8"><FTTransformerViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>비교에서는 representation 비용까지 포함합니다</h3>
        <p>
          Token 수는 feature 수에 비례하고 dense attention score 수는 대략
          feature 수의 제곱으로 늘어납니다. 자세한 Q·K·V 계산은{" "}
          <Link to="/ai/attention-theory#self-attention">attention 글</Link>이
          소유합니다. 여기서 중요한 점은 attention이 한 row 안의 interaction을
          학습한다는 것이지, weight 하나가 곧 causal feature importance라는 뜻은
          아니라는 점입니다.
        </p>
        <p>
          고 cardinality embedding은 parameter와 unknown category 정책도
          필요합니다. Cutoff를 지키는 aggregation과 leakage-free encoding 역시
          모델 밖에 남습니다. “attention이 interaction을 알아서 찾는다”는 이유로
          미래 정보가 섞인 column을 허용할 수는 없습니다.
        </p>

        <div id="paper-ft-transformer" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · 강한 baseline과 FT-Transformer</p>
          <p className="mt-2 text-sm font-semibold">Revisiting Deep Learning Models for Tabular Data</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Gorishniy 등은 논문마다 dataset과 protocol이 달라 비교가 불분명했던 문제를 제기하고, 강한 ResNet baseline과 FT-Transformer를 같은 benchmark에서 비교했습니다. 저자들의 결론 역시 GBDT와 딥러닝 중 보편적으로 우월한 해법은 없다는 것이며, FT-Transformer의 경쟁력이 모든 dataset·예산·serving 조건의 승리를 뜻하지는 않습니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2106.11959" target="_blank" rel="noreferrer">원 논문의 tokenizer·비교 protocol·한계 보기</a>
        </div>
      </div>
    </section>
  );
}
