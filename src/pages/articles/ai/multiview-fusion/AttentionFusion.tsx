import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { MultiviewFusionMapReturn } from "./MultiviewFusionLocator";
import AttentionFusionViz from "./viz/AttentionFusionViz";

export default function AttentionFusion() {
  return (
    <section id="attention-fusion" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">위치 관계를 남길수록 계산과 검사가 늘어납니다</h2>
      <AttentionFusionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cross-attention에서는 정면 사진의 패치가 query가 되어 밑창이나 위쪽 사진의
          key·value에서 필요한 정보를 가져옵니다. 사진 하나를 벡터 하나로 먼저 줄이는 것보다
          공간 관계를 오래 남길 수 있지만, 서로 다른 카메라의 같은 2차원 좌표가 같은 물리
          지점을 뜻하지는 않습니다. 그래서 내용뿐 아니라 카메라 ID, 사진 안 위치, pose,
          촬영 시각과 유효성까지 토큰에 연결합니다.
        </p>
        <p>
          Q·K·V와 scaled dot-product 계산은 <Link to="/cs/ai/attention-theory">attention 글</Link>의
          계산을 그대로 사용합니다. 여기서 새로 정할 것은 어떤 관측의 토큰끼리 볼 수
          있는지, pose를 실제 좌표 변환에 쓸지 단순한 embedding으로 넣을지, 관측 수가
          달라질 때 계산량을 어디에서 제한할지입니다.
        </p>
      </div>
      <ExplainedFormula
        question="멀티뷰 토큰 하나가 어느 관측의 어느 위치인지 어떻게 구분할까?"
        idea={<>사진 내용 embedding에 내부 위치만 더하면 서로 다른 카메라의 같은 격자 번호가 충돌합니다. 카메라·pose·시각 정보를 별도 항으로 더하거나 attention bias로 사용합니다.</>}
        formula={String.raw`t_{v,n}=E(x_{v,n})+p_n+q_v+r(c_v)`}
        annotatedFormula={String.raw`t_{v,n}=\underbrace{E(x_{v,n})}_{\text{무엇이 보였나}}+\underbrace{p_n}_{\text{사진 안 위치}}+\underbrace{q_v}_{\text{어느 카메라}}+\underbrace{r(c_v)}_{\text{pose·시각}}`}
        operations={[
          { expression: String.raw`E(x_{v,n})`, annotation: ["관측 v의 패치 n 내용을 모델 차원의 벡터로","이 항만으로는 다른 카메라의 같은 격자 번호를 구분하지 못함"] },
          { expression: String.raw`p_n`, annotation: ["한 사진 안에서 패치 n의 2차원 위치","카메라가 달라도 같은 격자 번호면 같은 값"] },
          { expression: String.raw`q_v`, annotation: ["어느 카메라·센서·관측 자리인지 구분","p_n 충돌을 깨는 관측 식별자"] },
          { expression: String.raw`r(c_v)`, annotation: ["pose·촬영 시각·보정값을 embedding으로 변환","단위가 다르므로 정규화한 뒤 더함","이 항만으로 3차원 대응이 보장되지는 않음"] },
        ]}
        terms={[
          { symbol: "xᵥ,ₙ", name: "국소 관측", description: "관측 v의 위치 n에서 얻은 패치 또는 표현입니다." },
          { symbol: "E", name: "내용 투영", description: "관측값을 모델 차원의 토큰 내용으로 바꿉니다." },
          { symbol: "pₙ", name: "사진 내부 위치", description: "한 사진 안에서 패치 n의 2차원 위치를 나타냅니다." },
          { symbol: "qᵥ", name: "관측 식별자", description: "어느 카메라·센서·관측 자리에서 온 토큰인지 구분합니다." },
          { symbol: "r(cᵥ)", name: "메타데이터 표현", description: "Pose·촬영 시각·보정값처럼 관측 좌표를 설명하는 정보를 모델 차원으로 바꿉니다." },
        ]}
        assumptions={["메타데이터 cᵥ는 각 토큰의 원래 관측과 함께 이동합니다.", "서로 다른 단위의 위치·pose·시각은 명시적인 정규화 또는 embedding을 거칩니다.", "단순 합이 충분한지는 과제별 제거 실험으로 확인하며 기하학적 대응을 자동 보장한다고 가정하지 않습니다."]}
        interpretation="이 토큰은 ‘무엇이 보였는가’뿐 아니라 ‘어느 카메라의 어느 위치에서 언제 보였는가’를 함께 표현합니다. 다만 pose embedding을 넣었다는 사실만으로 정확한 3차원 대응 관계가 학습된 것은 아닙니다."
      />
      <ExplainedFormula
        question="모든 관측 토큰을 한 sequence에 넣으면 왜 비용이 빠르게 커질까?"
        idea={<>전체 attention 점수 행렬은 모든 query와 key 쌍을 다룹니다. 관측별 유효 토큰을 더한 Ntotal에 대해 쌍 수가 Ntotal²이므로 관측 수까지 제곱에 들어갑니다.</>}
        formula={String.raw`\begin{aligned}
N_{\mathrm{total}}&=\sum_{v=1}^{V}m_vN_v,\\
\text{score pairs}&=N_{\mathrm{total}}^2.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
N_{\mathrm{total}}&=\underbrace{\sum_{v=1}^{V}m_vN_v}_{\text{유효 토큰 총수}},\\
\text{score pairs}&=\underbrace{N_{\mathrm{total}}^2}_{\text{query·key 쌍 수}}.
\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{v=1}^{V}m_vN_v`, annotation: ["관측별 토큰 수 N_v를 mask로 걸러 합산","누락 관측(m_v=0)은 비용에서 빠짐","4관측 × 196토큰 = 784"] },
          { expression: String.raw`N_{\mathrm{total}}^2`, annotation: ["모든 query–key 조합을 다루는 전체 attention","784²=614,656쌍으로 관측 수도 제곱에 포함","FlashAttention도 쌍을 비교하는 구조 자체는 없애지 못함"] },
        ]}
        terms={[
          { symbol: "Nᵥ", name: "관측별 토큰 수", description: "v번째 관측에서 attention에 남기는 패치 또는 표현 토큰 수입니다." },
          { symbol: "mᵥ", name: "관측 유효성", description: "누락 관측의 토큰을 비용 계산에서 제외하는 0·1 표시입니다." },
          { symbol: "Ntotal²", name: "attention 점수 쌍", description: "모든 관측을 함께 처리하는 self-attention의 query–key 조합 수입니다." },
        ]}
        assumptions={["모든 유효 토큰 사이에 양방향 dense attention을 허용합니다.", "투영과 MLP 비용은 생략하고 attention 점수와 확률 메모리의 성장만 비교합니다.", "FlashAttention은 중간 행렬 메모리를 줄일 수 있지만 토큰 쌍을 비교하는 구조적 크기 자체를 없애지는 않습니다."]}
        interpretation="관측 4개에서 각각 196개 토큰을 유지하면 Ntotal=784이고 점수 쌍은 614,656개입니다. 측면이 빠지면 588개와 345,744쌍으로 줄어듭니다. 관측별 pooling, bottleneck token, 국소 대응, cross-attention으로 비용을 줄일 수 있지만 어느 정보를 미리 압축했는지 함께 비교해야 합니다."
      />
      <div id="paper-set-transformer" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Set Transformer</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Lee 등은 순서가 없는 집합의 원소 사이 관계를 attention으로 처리하고, 순서에
            영향을 받지 않는 pooling으로 집합 단위 출력을 만드는 구조를 제안했습니다.
            Inducing point로 self-attention 비용을 줄이는 경로도 제시합니다. 다만 이 보장은
            논문이 정의한 집합 처리 구조에 적용됩니다. 고정된 관측 자리 embedding을 잘못
            더한 구현까지 자동으로 순서 불변으로 만들어 주지는 않습니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.mlr.press/v97/lee19d.html" target="_blank" rel="noreferrer">Permutation invariance와 inducing-point 범위 보기</a>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>평균 점수만 보지 않고 실제 누락을 재현합니다</h3>
        <p>
          단일 관측, mask가 적용된 평균, 학습된 가중합, attention 결합을 같은 자료 분리와
          인코더 예산, 전처리에서 비교합니다. 그다음 관측 누락, 순서 재배열, 촬영 시각·pose
          오차, blur·noise를 한 축씩 바꿉니다. attention map이나 gate weight가 커 보이는
          것보다 실제 예측 오차가 어떻게 변했는지가 더 직접적인 근거입니다.
        </p>
      </div>
      <ExplainedFormula
        question="관측 v를 제거했을 때 성능이 얼마나 나빠지는지 어떻게 짝지어 잴까?"
        idea={<>같은 상품 묶음을 전체 관측과 관측 v 누락 조건에서 각각 평가해 loss 차이를 냅니다. 상품별 차이를 평균하면 자료 난이도 차이를 줄인 짝지은 제거 실험이 됩니다.</>}
        formula={String.raw`\begin{aligned}
\ell_i^{(-v)}&=\ell(F(X_i\setminus v),y_i),\\
\ell_i^{(\mathrm{full})}&=\ell(F(X_i),y_i),\\
\Delta_v&=\frac1n\sum_{i=1}^{n}
\left(\ell_i^{(-v)}-\ell_i^{(\mathrm{full})}\right).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\ell_i^{(-v)}&=\underbrace{\ell(F(X_i\setminus v),y_i)}_{\text{관측 v를 뺀 loss}},\\
\ell_i^{(\mathrm{full})}&=\underbrace{\ell(F(X_i),y_i)}_{\text{전체 관측 loss}},\\
\Delta_v&=\underbrace{\frac1n\sum_{i=1}^{n}
\left(\ell_i^{(-v)}-\ell_i^{(\mathrm{full})}\right)}_{\text{짝지은 평균 증가}}.
\end{aligned}`}
        operations={[
          { expression: String.raw`\ell(F(X_i\setminus v),y_i)`, annotation: ["관측 v의 토큰만 mask로 지우고 평가","나머지 관측·판정값·평가 코드는 동일"] },
          { expression: String.raw`\ell(F(X_i),y_i)`, annotation: ["모든 관측을 넣은 기준 loss","같은 상품이라 자료 난이도가 상쇄됨"] },
          { expression: String.raw`\frac1n\sum_{i=1}^{n}
\left(\ell_i^{(-v)}-\ell_i^{(\mathrm{full})}\right)`, annotation: ["상품별 차이를 n개 평균한 짝지은 제거 실험","양수가 크면 예측이 관측 v의 누락에 민감","그 관측만으로 충분하다는 뜻은 아님"] },
        ]}
        terms={[
          { symbol: "Xᵢ∖v", name: "관측 누락 묶음", description: "같은 상품에서 관측 v와 그 토큰만 유효성 표시로 제거한 입력입니다." },
          { symbol: "ℓ", name: "평가 loss", description: "전체 관측과 누락 조건에서 똑같이 계산하는 상품 단위 오차입니다." },
          { symbol: "Δᵥ", name: "짝지은 loss 증가량", description: "관측 v가 없을 때 평균적으로 늘어난 loss입니다. 양수가 크면 예측이 그 관측의 누락에 민감합니다." },
        ]}
        assumptions={["두 조건은 같은 상품·판정값·나머지 관측·평가 코드를 공유합니다.", "누락 형태가 실제 배포에서 가능한 상황을 나타냅니다.", "관측 사이 상호작용이 있는 모델에서 Δᵥ를 독립적인 인과 기여나 사람 수준 설명으로 해석하지 않습니다."]}
        interpretation="Δᵥ가 크면 현재 모델이 그 관측의 누락에 민감하다고 진단할 수 있지만, 그 관측만으로 정보가 충분하다는 뜻은 아닙니다. 두 관측을 함께 제거하는 실험과 누락 조합별 신뢰구간도 확인합니다."
      />
      <MultiviewFusionMapReturn />
    </section>
  );
}
