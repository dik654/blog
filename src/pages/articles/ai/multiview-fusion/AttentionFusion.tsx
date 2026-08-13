import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import AttentionFusionViz from "./viz/AttentionFusionViz";

export default function AttentionFusion() {
  return (
    <section id="attention-fusion" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Attention fusion은 pooled feature보다 늦게 spatial token을 압축하며, 그 대가로 correspondence와 비용 계약이 필요합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cross-attention에서는 한 view의 token이 query가 되고 다른 view의
          key·value에서 필요한 정보를 가져옵니다. Pooled vector를 합치는 것보다
          공간 correspondence를 늦게까지 보존하지만, 서로 다른 camera의 같은 2D
          좌표가 같은 물리 지점을 뜻하지는 않습니다. 따라서 content embedding뿐
          아니라 view ID·2D position·camera pose·timestamp·availability를 token의
          의미에 포함합니다.
        </p>
        <p>
          Q·K·V와 scaled dot-product 계산 자체는 <Link to="/ai/attention-theory">attention
          정본</Link>의 계산을 그대로 사용합니다. 멀티뷰에서 새로 결정할 것은
          어떤 token끼리 볼 수 있는지, pose를 좌표 변환에 사용할지 단순 embedding으로
          넣을지, 그리고 view 수가 달라질 때 계산량을 어디에서 제한할지입니다.
        </p>
      </div>
      <ExplainedFormula
        question="멀티뷰 token 하나가 어느 관측의 어느 위치인지 어떻게 구분할까?"
        idea={<>Image content embedding에 spatial position만 더하면 서로 다른 camera의 같은 grid index가 충돌합니다. View·pose·time 정보를 별도 항으로 더하거나 attention bias로 사용합니다.</>}
        formula={String.raw`t_{v,n}=E(x_{v,n})+p_n+q_v+r(c_v)`}
        terms={[
          { symbol: "xᵥ,ₙ", name: "local observation", description: "View v의 spatial location n에서 얻은 patch 또는 feature입니다." },
          { symbol: "E", name: "content projection", description: "관측값을 model dimension의 token content로 바꿉니다." },
          { symbol: "pₙ", name: "within-view position", description: "한 image 안에서 patch n의 2D 위치를 나타냅니다." },
          { symbol: "qᵥ", name: "view identity", description: "어느 camera·sensor·view slot에서 온 token인지 구분합니다." },
          { symbol: "r(cᵥ)", name: "metadata encoding", description: "Pose·timestamp·calibration처럼 view coordinate를 설명하는 metadata를 model dimension으로 바꿉니다." },
        ]}
        assumptions={["Metadata cᵥ는 각 token의 원래 view와 함께 이동합니다.", "서로 다른 단위의 position·pose·time은 명시적인 normalization 또는 embedding을 거칩니다.", "단순 합이 충분한지는 task별 ablation으로 확인하며 geometric correspondence를 자동 보장한다고 가정하지 않습니다."]}
        interpretation="이 token은 ‘무엇이 보였는가’뿐 아니라 ‘어느 camera의 어느 위치에서 언제 보였는가’를 함께 표현합니다. 다만 pose embedding을 넣었다는 사실만으로 정확한 3D 대응 관계가 학습된 것은 아닙니다."
      />
      <div className="not-prose my-8"><AttentionFusionViz /></div>
      <ExplainedFormula
        question="모든 view token을 한 sequence에 넣으면 왜 비용이 빠르게 커질까?"
        idea={<>Full attention score matrix는 모든 query와 key 쌍을 저장합니다. 유효 token 수를 view별로 더한 Ntotal에 대해 pair 수가 Ntotal²이므로 view 수까지 제곱에 들어갑니다.</>}
        formula={String.raw`\begin{aligned}
N_{\mathrm{total}}&=\sum_{v=1}^{V}m_vN_v,\\
\text{score pairs}&=N_{\mathrm{total}}^2.
\end{aligned}`}
        terms={[
          { symbol: "Nᵥ", name: "tokens per view", description: "v번째 view에서 attention에 남기는 patch 또는 feature token 수입니다." },
          { symbol: "mᵥ", name: "view availability", description: "결측 view의 token을 비용 계산에서 제외하는 0·1 mask입니다." },
          { symbol: "Ntotal²", name: "attention score pairs", description: "Joint full self-attention에서 만드는 query–key 조합 수입니다." },
        ]}
        assumptions={["모든 유효 token 사이에 dense bidirectional attention을 허용합니다.", "Projection과 MLP 비용은 생략하고 attention score·probability memory의 성장만 비교합니다.", "FlashAttention은 materialization memory를 줄일 수 있지만 pairwise 계산의 구조적 크기 자체를 없애지는 않습니다."]}
        interpretation="4개 view에서 각각 196 token을 유지하면 Ntotal=784이고 score pair는 614,656개입니다. View별 pooling, bottleneck token, local correspondence, cross-attention을 쓰면 비용을 줄일 수 있지만 어느 정보를 미리 압축했는지 함께 비교해야 합니다."
      />
      <div id="paper-set-transformer" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Set Transformer</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Lee 등은 순서가 없는 set의 원소 간 interaction을 attention으로 처리하고 invariant pooling으로 set-level output을 만드는 architecture를 제안했습니다. Inducing point로 self-attention 비용을 줄이는 경로도 제시합니다. 이 보장은 architecture의 set 처리 조건에 관한 것이며, 고정 view position embedding을 잘못 더한 구현까지 자동으로 invariant하게 만들지는 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v97/lee19d.html" target="_blank" rel="noreferrer">Permutation invariance와 inducing-point 범위 보기</a>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>평가는 정상 상태의 평균 점수보다 view intervention을 먼저 설계합니다</h3>
        <p>
          단일-view, masked mean, gated pooling, attention fusion을 같은 split·encoder
          budget·preprocessing에서 비교합니다. 그다음 view drop, 순서 재배열,
          timestamp·pose 오차, blur·noise를 한 축씩 바꿉니다. Attention map이나 gate
          weight가 커 보인다는 사실보다 실제 prediction error가 어떻게 변했는지가
          더 직접적인 관측입니다.
        </p>
      </div>
      <ExplainedFormula
        question="View v를 제거했을 때 성능이 얼마나 나빠지는지 어떻게 paired metric으로 잴까?"
        idea={<>같은 sample을 full-view와 view-v-drop 조건에서 각각 평가해 loss 차이를 냅니다. Sample별 차이를 평균하면 data 난이도 차이를 줄인 paired ablation이 됩니다.</>}
        formula={String.raw`\Delta_v=\frac1n\sum_{i=1}^{n}\Big[\ell\!\left(F(X_i\setminus v),y_i\right)-\ell\!\left(F(X_i),y_i\right)\Big]`}
        terms={[
          { symbol: "Xᵢ∖v", name: "view-drop episode", description: "같은 sample에서 view v와 그 token만 availability mask로 제거한 입력입니다." },
          { symbol: "ℓ", name: "evaluation loss", description: "Full-view와 view-drop condition에서 동일하게 계산하는 sample-level error입니다." },
          { symbol: "Δᵥ", name: "paired loss increase", description: "View v가 없을 때 평균적으로 늘어난 loss입니다. 양수가 크면 prediction이 그 view에 민감합니다." },
        ]}
        assumptions={["두 조건은 같은 sample·label·나머지 view·evaluation code를 공유합니다.", "Drop pattern이 실제 배포에서 가능한 결측을 나타냅니다.", "Interaction이 있는 model에서 Δᵥ를 독립적 causal contribution이나 사람 수준 설명으로 해석하지 않습니다."]}
        interpretation="Δᵥ가 크면 해당 view가 현재 model의 예측에 중요하다는 진단은 가능하지만, 그 view만으로 정보가 충분하다는 뜻은 아닙니다. 두 view를 함께 제거하는 pairwise ablation과 결측 조합별 confidence interval도 확인합니다."
      />
    </section>
  );
}
