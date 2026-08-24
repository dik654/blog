import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TransformerViz from "./viz/TransformerViz";

export default function Transformer() {
  return (
    <section id="transformer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Attention mask는 모델 이름이 아니라 예측 질문에서 결정합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cutoff 이전 history 전체로 “앞으로 24시간 안에 구매할까?”를 한 번
          예측한다면, 입력 안의 과거 event들은 서로를 양방향으로 읽어도 미래
          누출이 아닙니다. 반면 각 위치에서 다음 event를 맞히는 objective라면
          현재 위치보다 오른쪽 token을 가려야 합니다. 두 경우 모두 PAD와 cutoff
          뒤 event는 언제나 보이지 않아야 합니다.
        </p>
        <p>
          Q·K·V와 scaled dot-product의 계산은 <Link to="/ai/attention-theory#self-attention">attention 정본 글</Link>에서,
          residual·normalization·FFN을 포함한 block은 <Link to="/ai/transformer-architecture">Transformer 구조 글</Link>에서
          설명합니다. 여기서는 event prediction에 필요한 visibility contract만
          정의합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Query 위치 q가 key 위치 k를 읽을 수 있는지 어떻게 숫자로 표현할까?"
        idea={<>읽을 수 있는 위치에는 0을 더하고, 가려야 할 위치에는 −∞를 더합니다. Softmax 뒤에는 −∞ 위치의 확률이 0이 되므로 정보가 흐르지 않습니다.</>}
        formula={String.raw`\begin{aligned}A_{\mathrm{whole}}(q,k)&=\mathbf 1[k\le L],\\A_{\mathrm{next}}(q,k)&=\mathbf 1[k\le L,\ k\le q],\\M_{qk}&=\begin{cases}0,&A(q,k)=1,\\-\infty,&A(q,k)=0.\end{cases}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}A_{\mathrm{whole}}(q,k)&=\underbrace{\mathbf 1[k\le L],}_{\text{허용 경계 판정}}\\A_{\mathrm{next}}(q,k)&=\mathbf 1[k\le L,\ k\le q],\\M_{qk}&=\begin{cases}0,&A(q,k)=1,\\-\infty,&A(q,k)=0.\end{cases}\end{aligned}`}
        operations={[
          { expression: String.raw`\mathbf 1[k\le L],`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","읽을 수 있는 위치에는 0을 더하고, 가려야 할 위치에는","−∞를 더합니다."] },
        ]}
        terms={[
          { symbol: "q,k", name: "query·key position", description: "현재 출력을 만드는 위치와 참조하려는 event 위치입니다." },
          { symbol: "L", name: "valid length", description: "PAD를 제외한 실제 event 수입니다." },
          { symbol: "sequence-level", name: "whole-history objective", description: "Cutoff 이전 전체 history를 한 번에 요약해 미래 label 하나를 맞히는 경우입니다." },
          { symbol: "k≤q", name: "causal condition", description: "다음-event 학습에서 현재보다 오른쪽인 미래 token을 읽지 못하게 합니다." },
        ]}
        assumptions={["모든 token은 같은 cutoff 이전의 available history에서 만들어졌습니다.", "Mask는 attention score에 softmax 전에 더해집니다.", "Loss mask와 attention mask는 별개이며 PAD target도 loss에서 제외합니다."]}
        interpretation="Bidirectional과 causal 중 무엇이 더 좋은지를 고르는 문제가 아니라, 예측 시점에 허용된 정보 경로를 그대로 구현하는 문제입니다."
      />

      <div className="not-prose my-8"><TransformerViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>여러 event hidden state를 한 개의 sample representation으로 모읍니다</h3>
        <p>
          Sequence-level target에는 [CLS], 마지막 유효 token, masked mean 같은
          pooling이 필요합니다. 마지막 token은 최근 상태를 강조하고, mean은 모든
          위치를 균등하게 모으며, [CLS]는 attention을 통해 필요한 정보를 학습해
          모읍니다. 어느 방식이 맞는지는 target의 evidence가 어디에 놓이는지에
          따라 달라집니다.
        </p>
      </div>

      <ExplainedFormula
        question="길이가 서로 다른 sequence를 평균낼 때 PAD를 어떻게 제외할까?"
        idea={<>실제 event에는 mask 1, PAD에는 0을 곱한 뒤 실제 event 수 L로만 나눕니다. Tensor의 고정 길이 T와 sample의 유효 길이 L을 구분하는 것이 핵심입니다.</>}
        formula={String.raw`h_{\mathrm{seq}}=\frac{1}{L}\sum_{j=1}^{T}m_jh_j,\qquad L=\sum_{j=1}^{T}m_j`}
        annotatedFormula={String.raw`h_{\mathrm{seq}}=\underbrace{\frac{1}{L}\sum_{j=1}^{T}m_jh_j,\qquad L=\sum_{j=1}^{T}m_j}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{1}{L}\sum_{j=1}^{T}m_jh_j,\qquad L=\sum_{j=1}^{T}m_j`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","실제 event에는 mask 1, PAD에는 0을 곱한 뒤","실제 event 수 L로만 나눕니다."] },
        ]}
        terms={[
          { symbol: "h_j", name: "event hidden state", description: "Transformer를 지난 j번째 위치의 d차원 표현입니다." },
          { symbol: "m_j", name: "valid-token mask", description: "실제 event면 1, PAD면 0입니다." },
          { symbol: "T", name: "padded length", description: "Batch tensor가 공유하는 고정 길이입니다." },
          { symbol: "L", name: "valid length", description: "이 sample에 실제로 존재하는 event 수입니다." },
        ]}
        assumptions={["L>0인 sample만 평균을 정의하거나 empty-history용 별도 token을 둡니다.", "Padding 위치의 hidden state가 어떤 값이더라도 mask로 완전히 제외합니다.", "Mean pooling을 CLS·last-valid와 같은 validation protocol에서 비교합니다."]}
        interpretation="PAD를 분모 T에 포함하면 짧은 sequence일수록 representation 크기가 작아지는 길이 편향이 생깁니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Order-shuffle intervention으로 순서가 실제 성능을 만드는지 확인합니다</h3>
        <p>
          Sequence model이 flat baseline보다 좋아도 그 원인이 순서라고 단정할 수는
          없습니다. 더 큰 parameter 수나 event embedding만으로 좋아졌을 수 있기
          때문입니다. Validation sample 안에서 event multiset과 길이는 유지한 채
          순서만 섞고 같은 model을 평가하면 order signal에 대한 의존도를 분리할 수
          있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="모델이 event 순서를 실제로 사용했는지 어떤 차이로 측정할까?"
        idea={<>원래 순서의 metric에서 entity 안의 순서만 무작위로 바꾼 metric을 뺍니다. 다른 정보는 유지하므로 감소 폭이 클수록 배운 예측 신호가 순서에 의존했다는 증거가 됩니다.</>}
        formula={String.raw`\begin{aligned}m_{\mathrm{original}}&=\operatorname{Metric}(D),\\m_{\mathrm{shuffle}}&=\mathbb E_{\pi}[\operatorname{Metric}(D^{\pi})],\\\Delta_{\mathrm{order}}&=m_{\mathrm{original}}-m_{\mathrm{shuffle}}.\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}m_{\mathrm{original}}&=\underbrace{\operatorname{Metric}(D),}_{\text{오른쪽 항으로 결과 계산}}\\m_{\mathrm{shuffle}}&=\underbrace{\mathbb E_{\pi}[\operatorname{Metric}(D^{\pi})],}_{\text{확률 가중 평균}}\\\Delta_{\mathrm{order}}&=\underbrace{m_{\mathrm{original}}-m_{\mathrm{shuffle}}.}_{\text{변화량 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{Metric}(D),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","원래 순서의 metric에서 entity 안의 순서만 무작위로","바꾼 metric을 뺍니다."] },
          { expression: String.raw`\mathbb E_{\pi}[\operatorname{Metric}(D^{\pi})],`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","원래 순서의 metric에서 entity 안의 순서만 무작위로","바꾼 metric을 뺍니다."] },
          { expression: String.raw`m_{\mathrm{original}}-m_{\mathrm{shuffle}}.`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","원래 순서의 metric에서 entity 안의 순서만 무작위로","바꾼 metric을 뺍니다."] },
        ]}
        terms={[
          { symbol: "π", name: "within-entity permutation", description: "Entity·cutoff·event multiset은 유지하고 유효 event의 순서만 바꾸는 permutation입니다." },
          { symbol: "E_π", name: "shuffle average", description: "한 번의 우연한 permutation 대신 여러 shuffle 결과를 평균합니다." },
          { symbol: "Δ_order", name: "order dependence", description: "클수록 원래 순서가 metric에 기여했다는 진단값입니다." },
        ]}
        assumptions={["Higher-is-better metric을 사용합니다. Loss라면 뺄셈 방향을 반대로 합니다.", "Time delta까지 섞을지 event와 함께 이동할지 intervention 질문에 맞춰 명시합니다.", "Shuffle은 validation에서만 수행하며 새로운 model 선택에 썼다면 최종 test는 따로 보존합니다."]}
        interpretation="Δ_order가 0에 가깝다면 비싼 sequence path가 순서 대신 count·embedding 같은 신호만 사용했을 가능성을 점검합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Dense attention의 메모리·연산은 길이에 따라 빠르게 늘어나므로 max length,
          batch, hidden width를 latency budget 안에서 함께 비교합니다. Flat GBDT와
          sequence model의 out-of-fold error가 실제로 다를 때만 ensemble 비용도
          검토합니다.
        </p>
        <div className="not-prose my-8 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 따라 읽기 · Attention Is All You Need</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            원 논문은 sequence transduction에서 self-attention, position encoding과
            decoder causal mask를 제안했습니다. Event table에서 어떤 cutoff·pooling이
            맞는지는 논문이 자동으로 정해 주지 않으므로 이 글의 sample contract로
            별도 검증해야 합니다.
          </p>
          <Link className="mt-3 inline-block text-sm font-medium text-primary hover:underline" to="/ai/transformer-architecture#paper-transformer">
            Transformer 정본 글의 핵심 아이디어와 근거 범위 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
