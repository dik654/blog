import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DifferentialAttentionViz from "./differential-attention/viz/DifferentialAttentionViz";

/**
 * Differential attention 은 두 독립 softmax attention map 의 차로 공통 성분을 지웁니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function DifferentialAttentionArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          표준 attention 은 무관한 context 에도 상당한 점수를 나눠 줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/attention-theory#multiplicative">Scaled dot-product attention</Link>은
            모든 key 에 softmax 로 확률을 나눠 주므로, 답과 무관한 위치도 0 이 아닌 점수를 받습니다.
            Differential attention 은 독립적으로 계산한 두 softmax map 의 차를 점수로 써서, 두
            map 에 공통으로 나타나는 성분을 상쇄하고 실제로 필요한 위치만 남깁니다.
          </p>
          <p>
            Ye 등은 긴 context 에서 정답을 찾는 실험에서 표준 Transformer 를 관찰했습니다. 정답 span 에는 아주 작은 점수만 주고 나머지를 무관한 문서에
            흩뿌렸습니다. 이렇게 새어 나가는 점수를 논문은 attention noise 라 부르고 이것이 긴 context 에서 검색·환각·in-context learning 성능을
            갉아먹는 원인이라고 진단합니다.
          </p>
          <p>
            이 글은 두 map 을 만드는 절차(paired attention maps), 차를 만드는 계수 λ(differential
            attention coefficient), 그 결과로 보고된 selectivity·robustness 수치를 순서대로
            봅니다. 다음 글은 이 mechanism 을 residual stream 여러 개로 확장하는 hyper-connection 을
            다룹니다.
          </p>
        </div>
        <div id="paper-differential-transformer" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Ye, Dong, Xia, Sun, Zhu, Huang, Wei · Differential Transformer"
            citeKey={1}
            href="https://arxiv.org/abs/2410.05258"
          >
            2024 년 Microsoft Research·Tsinghua 논문(ICLR 2025)은 두 softmax attention map 의
            차로 attention noise 를 상쇄하는 differential attention 을 제시하고, 3B 규모 model 로
            key information retrieval·hallucination·in-context learning·activation outlier
            실험을 통제 비교했습니다. 수치는 저자가 학습한 Transformer 대조군 대비입니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="differential-attention" />
      </section>

      <section id="paired-maps" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Query 와 key 를 절반씩 나눠 독립적인 두 attention map 을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Paired attention maps 는 같은 입력에서 만든 두 벌의 query·key(Q1, K1 과 Q2, K2)로 각각 독립적인 softmax 확률 분포를 계산한
            결과입니다. 두 map 은 계산 방식이 표준 attention 과 완전히 같고 다른 점은 나중에 하나를 다른 하나에서 뺀다는 것뿐입니다.
          </p>
          <p>
            남겨 두는 쪽을 signal attention, 빼는 데 쓰는 쪽을 noise attention 이라 부릅니다. 이 이름은 정답을 미리 아는 분류표가 아니라 두 map 의
            역할을 가리키는 이름입니다. Noise map 이 실제로 무관한 token 만 가리킨다는 보장은 없고 학습이 공통 성분으로 추정한 분포를 근사할 뿐입니다.
          </p>
          <p>
            <Link to="/ai/attention-theory#self-attention">Multi-head attention</Link>의 각
            head 가 이제 두 배의 query·key projection(Q1, K1, Q2, K2)과 폭이 두 배인 value
            V ∈ R^{"{N×2d}"} 를 만듭니다. head 하나가 값 두 벌을 만드는 대신, 같은 예산에서 head
            수를 줄이는 이유는 다음 절에서 파라미터 산수로 확인합니다.
          </p>
        </div>
        <TermBreakdown
          title="Paired attention map 의 두 역할"
          description="같은 계산을 두 번 하고 이름만 다르게 붙인 것입니다."
          items={[
            {
              term: "Signal attention (A1)",
              description: "Q1, K1 로 만든 softmax map 으로, D 를 만들 때 그대로 남습니다.",
              example: "4-token 예에서 [0.10, 0.10, 0.70, 0.10]",
              boundary: "표준 attention 과 계산식이 같아 그 자체로는 새로운 능력이 없습니다.",
            },
            {
              term: "Noise attention (A2)",
              description: "Q2, K2 로 독립적으로 만든 softmax map 으로, λ 를 곱해 A1 에서 뺍니다.",
              example: "같은 예에서 [0.25, 0.25, 0.25, 0.25]",
              boundary: "사람이 지정한 무관 token 목록이 아니라 학습된 추정치입니다.",
            },
          ]}
        />
      </section>

      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          λ 로 스케일한 noise map 을 signal map 에서 빼면 음수 점수가 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            DiffAttn 은 A1 에서 λA2 를 뺀 값을 value 에 곱합니다. λ 는 층마다 공유되는 학습된 스칼라이고 두 map 이 각각 확률 분포(합 1)이므로 차의 합은
            1−λ 로 줄어듭니다. 표준 softmax 와 달리 개별 항이 음수가 될 수 있다는 점이 이 식의 핵심 차이입니다.
          </p>
          <p>
            4-token 예로 확인합니다. Signal map 이 [0.10, 0.10, 0.70, 0.10], noise map 이
            [0.25, 0.25, 0.25, 0.25], λ=0.8 이면 λA2=[0.20, 0.20, 0.20, 0.20]이고 D=A1−λA2=
            [−0.10, −0.10, 0.50, −0.10] 입니다. 합은 0.20(=1−0.8)이고 세 자리가 음수입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Signal·noise map 을 어떻게 합쳐 하나의 attention 점수로 만드나요?"
          idea="같은 방식으로 두 확률 분포를 만든 뒤, 학습된 스칼라 λ 로 크기를 맞춰 하나를 다른 하나에서 뺍니다."
          formula={String.raw`\mathrm{DiffAttn}(X)=\Big(\operatorname{softmax}\!\big(\tfrac{Q_1K_1^\top}{\sqrt d}\big)-\lambda\,\operatorname{softmax}\!\big(\tfrac{Q_2K_2^\top}{\sqrt d}\big)\Big)V`}
          annotatedFormula={String.raw`\mathrm{DiffAttn}(X)=\Big(\underbrace{\operatorname{softmax}\!\big(\tfrac{Q_1K_1^\top}{\sqrt d}\big)}_{\text{signal map }A_1}-\underbrace{\lambda\,\operatorname{softmax}\!\big(\tfrac{Q_2K_2^\top}{\sqrt d}\big)}_{\text{$\lambda$ 로 스케일한 noise map}}\Big)\underbrace{V}_{\text{value}}`}
          operations={[
            {
              expression: String.raw`\operatorname{softmax}(Q_1K_1^\top/\sqrt d)`,
              annotation: ["Query·key 를 절반씩 나눈 첫 그룹으로", "표준 attention 과 같은 방식의 확률 분포(signal map)를 만듦"],
            },
            {
              expression: String.raw`\lambda\,\operatorname{softmax}(Q_2K_2^\top/\sqrt d)`,
              annotation: ["같은 방식으로 만든 두 번째 확률 분포에", "학습된 스칼라 λ 를 곱해 크기를 맞춤(noise map)"],
            },
            {
              expression: String.raw`(A_1-\lambda A_2)V`,
              annotation: ["두 분포의 차를 value 에 곱해", "공통으로 나타나는 성분을 상쇄"],
            },
          ]}
          terms={[
            { symbol: "Q_1, K_1", name: "signal query·key", description: "첫 번째 projection 그룹으로 만든 R^{N×d} 값입니다." },
            { symbol: "Q_2, K_2", name: "noise query·key", description: "두 번째 projection 그룹으로 만든 독립적인 R^{N×d} 값입니다." },
            { symbol: "V", name: "value", description: "R^{N×2d} 로, 두 map 이 같은 value 에 곱해집니다." },
            { symbol: String.raw`\lambda`, name: "differential attention coefficient", description: "층 안에서 모든 head 가 공유하는 학습된 스칼라입니다." },
          ]}
          assumptions={["Q1,K1 과 Q2,K2 는 서로 다른 학습된 projection에서 나온 독립 값입니다.", "λ 는 0 근처에서 시작해 학습 중 값이 바뀝니다."]}
          interpretation="D 의 각 원소는 두 확률의 차이라 음수가 될 수 있습니다. 이는 계산 오류가 아니라 noise 로 추정된 성분을 실제로 뺀 결과입니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            λ 를 직접 학습하면 초기 gradient 크기가 표준 attention 과 달라져 학습이 불안정해질 수
            있습니다. 논문은 λ 를 두 벡터쌍의 내적차와 층별 상수 λinit 으로 다시 씁니다.
          </p>
        </div>
        <ExplainedFormula
          question="λ 를 스칼라 하나로 직접 학습하지 않고 왜 벡터쌍으로 다시 쓰나요?"
          idea="지수함수로 항상 양수인 두 항의 차를 만들고, 층 깊이에 따라 정해지는 상수를 더해 초기 gradient 크기를 표준 attention 과 맞춥니다."
          formula={String.raw`\lambda=\exp(\lambda_{q1}\cdot\lambda_{k1})-\exp(\lambda_{q2}\cdot\lambda_{k2})+\lambda_{\text{init}}`}
          annotatedFormula={String.raw`\lambda=\underbrace{\exp(\lambda_{q1}\cdot\lambda_{k1})-\exp(\lambda_{q2}\cdot\lambda_{k2})}_{\text{두 학습 벡터쌍의 내적차를 지수화}}+\underbrace{\lambda_{\text{init}}}_{\text{층 깊이 }l\text{ 에 따른 시작값}}`}
          operations={[
            {
              expression: String.raw`\exp(\lambda_{q1}\cdot\lambda_{k1})-\exp(\lambda_{q2}\cdot\lambda_{k2})`,
              annotation: ["두 학습 벡터쌍의 내적을 각각 지수화해 뺀 값으로", "λ 가 학습 중 자유롭게 움직이게 함"],
            },
            {
              expression: String.raw`\lambda_{\text{init}}=0.8-0.6\exp(-0.3(l-1))`,
              annotation: ["층 번호 l 에 따라 정해지는 상수로", "얕은 층은 0.2 근처, 깊은 층은 0.8 근처에서 시작"],
            },
          ]}
          terms={[
            { symbol: String.raw`\lambda_{q1},\lambda_{k1},\lambda_{q2},\lambda_{k2}`, name: "학습 벡터", description: "head 마다 갖는 R^d 벡터로 λ 를 다시 매개변수화합니다." },
            { symbol: String.raw`\lambda_{\text{init}}`, name: "층별 초기값", description: "층 번호 l 로 정해지는 상수이며 학습되지 않습니다." },
          ]}
          assumptions={["λ 는 같은 층의 모든 head 가 공유합니다.", "λinit 은 (0,1) 구간이며 층이 깊어질수록 1에 가까워지는 형태로 저자가 정했습니다."]}
          interpretation="layer 1 은 λinit=0.2 로 시작해 noise 를 약하게 지우고, layer 6 은 λinit≈0.67 로 더 적극적으로 지웁니다. 깊은 층일수록 초기값이 0.8 에 가까워집니다."
        />
        <AlgorithmBlock
          title="한 differential attention head 의 forward"
          input={["X ∈ R^{N×d_model}", "W^Q, W^K, W^V ∈ R^{d_model×2d} (head 하나 몫)", "λ (층 공유 스칼라), λinit (층별 상수)"]}
          steps={[
            { code: "[Q1; Q2] ← X W^Q,  [K1; K2] ← X W^K,  V ← X W^V", note: "각각 절반씩 나눠 Q1,K1,Q2,K2 ∈ R^{N×d}, V ∈ R^{N×2d} 를 얻습니다." },
            { code: "A1 ← Q1 K1ᵀ/√d,  A2 ← Q2 K2ᵀ/√d", note: "두 독립 점수 행렬을 표준 attention과 같은 방식으로 만듭니다." },
            { code: "headOut ← (softmax(A1) − λ·softmax(A2)) V", note: "두 확률 분포의 차를 value 에 곱해 공통 성분을 상쇄합니다." },
            { code: "headOut ← (1 − λinit) · RMSNorm_head(headOut)", note: "GroupNorm(head 별 RMSNorm)으로 head 마다 다른 통계량을 맞추고 고정 배율로 스케일합니다." },
          ]}
          repeatUntil="같은 층의 h = d_model/2d 개 head 가 같은 λ 를 공유하며 이 절차를 병렬로 반복합니다."
          output="headOut ∈ R^{N×2d}, h개를 이어붙인 뒤 W^O 로 최종 projection"
        />
        <DifferentialAttentionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Head 하나가 값 두 벌을 계산하므로 같은 파라미터·연산 예산을 맞추려면 head 수를 줄여야 합니다. 저자의 3B model 은 hidden 3072, head dim
            128 에서 표준 Transformer 가 24 head(3072/128)를 쓰는 자리에 differential attention 은 12 head(3072/256)만 둡니다.
          </p>
        </div>
      </section>

      <section id="properties" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          공통 성분을 지운 결과로 정답 span 에 더 많은 점수가 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            논문은 이 mechanism 이 만드는 attention selectivity 를 key information retrieval 에서 직접 측정했습니다. 정답이 깊이 0% 에
            있는 4K-길이 다중 문서에서 표준 Transformer 는 정답 span 에 점수 0.03, 무관한 context 에 0.51 을 줬습니다. 같은 자리에서
            differential Transformer 는 정답에 0.27, 무관한 context 에 0.01 을 줬습니다.
          </p>
          <p>
            검색 정확도로도 나타납니다. 4K 길이에서 needle 6개·질의 2개(N=6, R=2) 조건은
            표준 0.55, differential 0.85 로 정확도 차이가 30%p 였습니다. 64K 로 늘린 조건에서는
            정답이 depth 25% 에 있을 때 정확도가 76% 개선됐습니다.
          </p>
          <p>
            Attention robustness 는 in-context 예시의 순서를 바꿔도 정확도가 크게 흔들리지
            않는 성질입니다. TREC 데이터에서 예시를 무작위로 섞으며 정확도 편차를 재면
            표준 Transformer 는 최댓값과 최솟값 차이가 19.0%p, differential Transformer 는
            4.0%p 였습니다. 예시를 class 별로 번갈아 배치하면 그 차이가 56.7%p 대 13.4%p 로
            벌어졌습니다.
          </p>
          <p>
            같은 성질이 활성값 크기에도 나타납니다. Attention logit 의 최댓값이 표준 Transformer 에서 318.0(중앙값 5.4의 약 59 배)까지 오른 반면
            differential Transformer 는 38.8(중앙값 3.3의 약 12 배)에 그쳤습니다. 이 덕분에 4-bit 양자화에서도 6-bit 표준 Transformer 와
            비슷한 정확도를 유지했습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="이 수치들은 어떤 조건에서 측정됐나요?"
          preview="3B 규모 model 을 같은 데이터·같은 학습 예산으로 맞춰 학습한 저자 자신의 대조군 비교이며, 다른 아키텍처나 다른 3rd-party 벤치마크로 일반화한 결과는 아닙니다."
        >
          <p>
            Key information retrieval 은 Needle-In-A-Haystack 프로토콜을 따르고, in-context
            learning 은 분류 class 수가 다른 네 데이터셋에서 시연 예시를 1-shot 부터 64K token
            까지 늘려 갔습니다.
          </p>
          <p>Hallucination 실험은 LongBench 의 단일·다중 문서 질의응답 데이터셋으로 측정했습니다.</p>
          <p>
            모든 비교는 같은 논문이 학습한 3B differential Transformer 와 3B 표준 Transformer
            checkpoint 사이의 상대 비교입니다. 다른 연구자의 독립 재현이나 더 큰 모델 규모에서도
            같은 폭의 개선이 나온다는 근거는 아닙니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Noise 를 지우는 축과 KV cache 를 압축하는 축은 서로 다른 병목을 풉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Differential attention 은 attention 이 무엇에 점수를 주는지를 바꾸는 selectivity
            축입니다. <Link to="/ai/motif-3-architecture#gdla">MLA 의 latent KV 압축</Link>은
            decode 에서 얼마나 많은 KV 를 저장·전송하는지를 바꾸는 memory 축입니다. 두 축은 서로
            다른 병목을 풀므로 하나가 다른 하나의 상위 호환은 아닙니다.
          </p>
          <p>
            Head 마다 signal·noise query 를 같은 수만큼 두면 noise 추정에 signal 만큼의 계산을
            씁니다. Motif 3 가 쓰는 grouped differential attention 은 이 비대칭을 겨냥해 signal
            head 를 더 많이, 공유 noise head 를 적게 두고 group 단위로 반복해 뺍니다.
          </p>
          <p>
            이 변형은 differential attention 의 signal·noise 축을 재사용하되 head 비율을 다시
            설계한 결과이며, 이 글이 새로 만든 mechanism 은 아닙니다.
          </p>
          <p>
            연산 비용도 공짜가 아닙니다. Head 수는 절반이 되지만 head 마다 두 번의 QKᵀ·softmax·PV
            를 계산하므로 전체 FLOPs 는 표준 attention 과 비슷하게 맞춰질 뿐 줄지 않습니다. 또한
            <Link to="/ai/flash-attention-io-aware-kernel#tiling">FlashAttention</Link> 커널
            하나로 바로 감싸지지 않아, 저자들은 두 번의 FlashAttention 호출 결과를 조합하는 방식을
            부록에서 제시합니다.
          </p>
          <p>
            Signal·noise 를 전기공학의 differential amplifier 나 노이즈 캔슬링 이어폰에 빗대는
            설명은 두 신호를 빼서 공통 성분을 지운다는 직관을 여는 장치일 뿐입니다. Noise map 이
            실제 물리적 잡음의 원천이라거나 D 가 항상 더 해석 가능하다는 증명은 아닙니다. 다음 글은
            이 attention 출력이 지나가는 residual stream 자체를 여러 갈래로 늘리는
            <Link to="/ai/hyper-connections-residual-streams">hyper-connection</Link>을 다룹니다.
          </p>
        </div>
      </section>
    </div>
  );
}
