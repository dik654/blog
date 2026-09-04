import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FastWeightMemoryAndChunkwiseRecurrenceViz from "./fast-weight-memory-and-chunkwise-recurrence/viz/FastWeightMemoryAndChunkwiseRecurrenceViz";

/**
 * Fast weight memory 는 delta rule 로 쓰고 chunkwise scan 으로 병렬화합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function FastWeightMemoryAndChunkwiseRecurrenceArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Outer-product 로 눌러 쓴 기억은 겹쳐 쓰기 때문에 삭제·수정이 안 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/linear-attention-and-state-space-models#recurrent-state">Linear attention 의 φ(K)ᵀV 누적</Link>
            은 key·value 쌍을 고정 크기 행렬 하나에 눌러 담는 기억입니다. 이 글은 그 눌러
            담기를 delta rule 로 고쳐 겹쳐 쓴 값을 지우고 다시 쓰는 방법과, 이 수정 때문에
            생긴 순차 의존성을 chunk 단위 병렬 scan 으로 되돌리는 방법을 다룹니다.
          </p>
          <p>
            순수 덧셈으로 값을 눌러 담으면 지우거나 고칠 방법이 없습니다. 한 번 쓴 key-value association 은 계속 남아 있고 비슷한 key 로 다시 쓰면 새 값이 기존
            값 위에 더해질 뿐입니다. 문맥이 바뀌어 예전 정보가 필요 없어져도 지울 수단이 없습니다.
          </p>
          <p>
            Delta rule 은 새 값을 더하기 전에 지금 이 key 로 이미 읽히는 값을 먼저 빼서
            얻은 오차만 씁니다. 그런데 이 뺄셈이 상태 전체(S_{"{t-1}"})에 의존해, 표준
            linear attention 처럼 모든 step 을 한 번의 행렬곱으로 병렬 계산할 수 없게
            만듭니다. Chunkwise parallel form 이 이 문제를 되돌리는 절충입니다.
          </p>
          <p>
            수치로 미리 봅니다. 4096 token 시퀀스를 64 개씩 chunk 로 나누면 순차적으로 기다려야 하는 단계가 4096 개에서 64 개로 줄고 그 대가로 head 당 곱셈은
            대략 50 % 늘어납니다. 이 교환이 순이익인 이유는 chunkwise-scan 절에서 계산합니다.
          </p>
        </div>
        <div id="paper-schlag" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Schlag, Irie, Schmidhuber · Linear Transformers Are Secretly Fast Weight Programmers"
            citeKey={1}
            href="https://arxiv.org/abs/2102.11174"
          >
            2021년 논문은 linear attention 이 1990년대 fast weight programmer 와 수학적으로
            같은 구조임을 보이고, 순수 덧셈 누적이 만드는 간섭 문제를 지적하며 delta rule
            변형을 제안합니다. 실험은 기계번역·언어모델링 두 task 로 저자가 직접 측정한
            결과입니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="fast-weight-memory-and-chunkwise-recurrence" />
      </section>

      <section id="associative-memory" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          k⊗v 외적의 합이 곧 content-addressable 기억입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Key-value 쌍을 k⊗v 외적의 합으로 하나의 행렬 M 에 눌러 담고 query 때 M 과 곱해 값을 읽어내는 기억이 associative memory 입니다. Key 로
            값을 찾아간다는 점에서 주소가 아니라 내용으로 찾는다고 해서 content-addressable 이라 부릅니다.
          </p>
          <p>
            신경망에서는 이 M 을 fast weight memory 라 부릅니다. 고정 weight 는 학습으로 천천히 정해지는데, 그와 구분해 매 시퀀스마다 새로 쓰이고 지워지는
            weight 라는 뜻입니다. Fast weight programmer 는 이 구도 자체를 가리킵니다. 느린 학습으로 고정된 slow network 가 매 시점 key·value
            를 내보내 fast weight 행렬을 프로그래밍하고 그 행렬이 별도의 계산을 수행합니다.
          </p>
          <p>
            숫자로 겹쳐 쓰기를 봅니다. 4차원에서 k₁=(1,0,0,0), v₁=(2,0,0,0)과
            k₂=(0.6,0.8,0,0), v₂=(0,3,0,0)을 M=v₁k₁ᵀ+v₂k₂ᵀ 로 눌러 담습니다. k₁ 로
            읽으면 M k₁=(k₁·k₁)v₁+(k₁·k₂)v₂=1·(2,0,0,0)+0.6·(0,3,0,0)=(2, 1.8, 0, 0)
            으로, 원래 값 (2,0,0,0)에 v₂ 의 조각이 섞여 나옵니다.
          </p>
          <p>
            두 key 가 직교하면(k₁·k₂=0) 이 섞임이 사라집니다. 실제로는 head 차원보다
            훨씬 많은 token 을 같은 행렬에 눌러 담으므로 완전한 직교를 기대할 수 없고,
            <Link to="/ai/linear-attention-and-state-space-models#tradeoff">이 겹쳐 쓰기가 왜 고정 크기 상태의 근본 한계인지</Link>
            는 그 글이 다룹니다. 이 글은 겹쳐 쓰기 자체를 고치는 쓰기 규칙에 집중합니다.
          </p>
        </div>
        <TermBreakdown
          title="Fast weight memory 를 이루는 두 가지 말"
          description="같은 구조를 가리키는 용어를 신경망 문헌과 옛 fast weight 문헌이 다르게 부릅니다."
          items={[
            { term: "Associative memory", description: "k⊗v 외적의 합으로 값을 눌러 담고 곱으로 읽어내는 기억 구조 자체입니다.", example: "M=Σ vᵢkᵢᵀ, 읽기는 Mq", boundary: "Key 가 직교하지 않으면 읽기 결과에 다른 항이 섞여 듭니다." },
            { term: "Fast weight memory", description: "위 행렬 M 을 학습된 고정 weight 와 구분해 부르는 이름입니다. 시퀀스마다 새로 쓰입니다.", example: "Linear attention 의 φ(K)ᵀV", boundary: "가중치라는 이름과 달리 gradient 로 학습되지 않고 forward pass 중 계산됩니다." },
            { term: "Fast weight programmer", description: "Slow network 가 key·value 를 내보내 fast weight 를 프로그래밍하는 구도 전체를 가리킵니다.", example: "Schlag et al. 2021", boundary: "Linear attention 이 이 구도의 한 사례임은 사후에 밝혀진 대응 관계입니다." },
          ]}
        />
      </section>

      <section id="delta-rule" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Delta rule 은 더하기 전에 이미 읽히는 값을 먼저 뺍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Delta rule 은 새 값을 그대로 더하지 않고 지금 key 로 이미 읽히는 값을 먼저 빼서 얻은 예측 오차(prediction error, delta)만 다시 씁니다.
            같은 key 에 다시 쓸 때 옛 값과 새 값이 함께 쌓이지 않고 새 값이 옛 값을 대체합니다.
          </p>
          <p>
            앞 절의 M 을 그대로 이어 씁니다. k₁ 의 값을 (2,0,0,0)에서 (5,0,0,0)으로
            바꾸고 싶다고 합시다. 그냥 v₁_new k₁ᵀ 를 더하면 옛 (2,1.8,0,0)이 여전히 섞여
            남습니다. Delta rule 은 M k₁=(2,1.8,0,0)을 먼저 구해 목표값에서 뺀 뒤
            (3,−1.8,0,0)만 k₁ 방향으로 씁니다.
          </p>
          <p>
            β=1(완전 대체)이면 k₁ 로 다시 읽었을 때 정확히 (5,0,0,0)이 나옵니다. k₁ 이
            단위벡터라 자기 자신과의 내적이 1이기 때문입니다. 다만 k₂ 로 읽은 값도
            (1.2,3,0,0)에서 (3.0,1.92,0,0)으로 바뀝니다. k₁·k₂=0.6 만큼 이번 correction 이
            k₂ 의 읽기에도 새어 들어간 결과입니다.
          </p>
        </div>
        <ExplainedFormula
          question="새 값을 어떻게 더해야 같은 key 로 다시 읽었을 때 옛 값이 남지 않나요?"
          idea="지금 state 로 이 key 를 읽었을 때 나오는 값을 먼저 계산해 목표값에서 빼면, 그 차이(오차)만 다시 써도 같은 key 의 읽기 결과가 목표값이 됩니다."
          formula={String.raw`S_t=S_{t-1}(I-\beta_t \mathbf{k}_t\mathbf{k}_t^\top)+\beta_t \mathbf{v}_t\mathbf{k}_t^\top \;=\; S_{t-1}+\beta_t(\mathbf{v}_t-S_{t-1}\mathbf{k}_t)\mathbf{k}_t^\top`}
          annotatedFormula={String.raw`\underbrace{S_{t-1}(I-\beta_t \mathbf{k}_t\mathbf{k}_t^\top)}_{\text{옛 상태에서 }k_t\text{ 방향 성분을 }\beta_t\text{만큼 제거}}+\underbrace{\beta_t \mathbf{v}_t\mathbf{k}_t^\top}_{\text{새 값을 그 방향에 다시 씀}} \;=\; S_{t-1}+\beta_t\underbrace{(\mathbf{v}_t-S_{t-1}\mathbf{k}_t)}_{\text{prediction error, delta}}\mathbf{k}_t^\top`}
          operations={[
            { expression: String.raw`S_{t-1}\mathbf{k}_t`, annotation: ["지금 state 로 이 key 를 읽으면 무엇이 나오는지 먼저 구함", "= 겹쳐 쓰인 다른 key 들의 기여까지 포함한 현재 예측값"] },
            { expression: String.raw`\mathbf{v}_t-S_{t-1}\mathbf{k}_t`, annotation: ["목표값에서 현재 예측을 빼 오차만 남김", "옛 값이 이미 옳다면 이 오차는 0"] },
            { expression: String.raw`\beta_t(\cdot)\mathbf{k}_t^\top`, annotation: ["오차를 학습률 β_t 만큼 줄여 k_t 방향으로만 씀", "다른 key 방향의 저장값은 그대로 둠(단, k 가 직교하지 않으면 일부 새어듦)"] },
          ]}
          terms={[
            { symbol: String.raw`S_{t-1}`, name: "이전 fast weight 상태", description: "d×d 행렬로, 지금까지 쓰인 모든 key-value correction 의 합입니다." },
            { symbol: String.raw`\beta_t`, name: "학습률(쓰기 강도)", description: "0과 1 사이 스칼라로, 1이면 이 key 의 값을 완전히 새 값으로 대체합니다." },
            { symbol: String.raw`\mathbf{v}_t-S_{t-1}\mathbf{k}_t`, name: "prediction error · delta", description: "지금 state 가 이 key 로 이미 예측하는 값과 목표값의 차이입니다." },
          ]}
          assumptions={["k_t 가 단위벡터가 아니면 β_t 의 범위와 정확한 대체 조건이 달라집니다.", "k 들이 서로 직교하지 않으면 한 key 의 correction 이 다른 key 의 읽기에도 일부 새어 듭니다."]}
          interpretation="왼쪽 두 항의 형태는 상태 전체를 지우고 다시 쓰는 것처럼 보이지만, 오른쪽으로 다시 쓰면 실제로는 딱 하나의 오차 항만 더하는 것과 같습니다. 이 오차가 S_{t-1} 전체에 의존한다는 사실이 다음 절 병렬화 문제의 원인입니다."
        />
      </section>

      <section id="memory-gate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Delta rule 만으로는 못 지우는 것을 gate 가 한꺼번에 지웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Delta rule 은 한 step 에 정확히 하나의 key 방향만 고칩니다. 문맥이 완전히
            바뀌어 기억 전체를 빠르게 지워야 하는 상황에는 맞지 않습니다. Memory update
            gate 는 상태 전체에 곱해지는 decay 계수로 이 빠른 삭제를 담당합니다.
          </p>
          <p>
            Gated delta rule 은 α_t 라는 0과 1 사이의 data-dependent 계수를 delta rule 앞에 곱합니다. α_t 를 0에 가깝게 만들면
            correction 이 적용되기 전에 옛 상태 전체가 거의 지워지고 1에 가까우면 delta rule 만 남아 특정 key 방향만 고칩니다.
          </p>
          <p>
            앞 절의 M 에 α=0.1 을 곱하면 k₁ 방향의 (2,1.8,0,0)은 (0.2,0.18,0,0)로 거의
            사라진 뒤에 delta rule 이 새 값을 씁니다. Delta rule 혼자서는 이렇게 다른 모든
            key 의 기여를 한꺼번에 낮출 수 없습니다.
          </p>
        </div>
        <ExplainedFormula
          question="옛 기억을 빠르게 지우는 것과 특정 key 만 정확히 고치는 것을 어떻게 한 식에 같이 넣나요?"
          idea="상태 전체에 곱하는 decay 계수 하나와, 특정 key 방향만 골라 고치는 delta rule 항 하나를 곱해서 이어 붙입니다. 서로 다른 스칼라가 서로 다른 범위(전체 대 한 방향)를 담당합니다."
          formula={String.raw`S_t=\alpha_t\,S_{t-1}(I-\beta_t \mathbf{k}_t\mathbf{k}_t^\top)+\beta_t \mathbf{v}_t\mathbf{k}_t^\top`}
          annotatedFormula={String.raw`S_t=\underbrace{\alpha_t}_{\text{전체 decay, 문맥 전환 시 }\to 0}\underbrace{S_{t-1}(I-\beta_t \mathbf{k}_t\mathbf{k}_t^\top)}_{\text{delta rule 로 이미 }k_t\text{ 방향만 고친 상태}}+\underbrace{\beta_t \mathbf{v}_t\mathbf{k}_t^\top}_{\text{새 값 쓰기(decay 영향 밖)}}`}
          operations={[
            { expression: String.raw`\alpha_t\,S_{t-1}`, annotation: ["상태 전체를 한 스칼라로 줄여", "특정 key 와 무관하게 옛 기억 전부를 빠르게 낮춤"] },
            { expression: String.raw`(I-\beta_t \mathbf{k}_t\mathbf{k}_t^\top)`, annotation: ["decay 뒤 남은 상태에서 다시 k_t 방향만 골라 고쳐", "delta rule 의 표적 수정이 여전히 적용됨"] },
            { expression: String.raw`\beta_t \mathbf{v}_t\mathbf{k}_t^\top`, annotation: ["새 값은 decay 를 거치지 않고 그대로 써", "이번 step 의 기여가 줄어들지 않게 함"] },
          ]}
          terms={[
            { symbol: String.raw`\alpha_t`, name: "memory decay · forgetting gate", description: "0과 1 사이 스칼라로, 매 step data 로부터 계산됩니다. 0이면 전체 삭제, 1이면 delta rule 만 남습니다." },
            { symbol: String.raw`\beta_t`, name: "delta rule 학습률", description: "α_t 와 별도로 특정 key 방향의 correction 강도를 정합니다." },
          ]}
          assumptions={["α_t 는 head 전체에 하나의 스칼라로 쓰이거나 채널별로 다르게 쓰일 수 있고, 어느 쪽이든 특정 key 방향에 한정되지 않습니다.", "α_t=1 이면 이 식은 앞 절의 순수 delta rule 로 정확히 되돌아갑니다."]}
          interpretation="Delta rule 혼자서는 한 step 에 한 방향만 고치므로 문맥 전환처럼 다수의 연관을 한꺼번에 지워야 하는 상황에서 느립니다. Gate 가 그 빠른 삭제를, delta rule 이 표적 수정을 각각 맡아 나눠 가집니다."
        />
        <div id="paper-gated-deltanet" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yang, Kautz, Hatamizadeh · Gated Delta Networks: Improving Mamba2 with Delta Rule"
            citeKey={2}
            href="https://arxiv.org/abs/2412.06464"
          >
            2024년 논문(ICLR 2025)은 delta rule 만으로는 문맥 전환에서 옛 정보를 빠르게
            지우지 못한다고 지적하고 Mamba2 의 decay gate 와 delta rule 을 결합합니다.
            1.3B 모델 기준 perplexity·retrieval 벤치마크는 저자 자기보고입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="chunkwise-scan" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Chunk 안은 행렬곱으로, chunk 사이만 순서대로 진행합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            같은 상태 갱신 식은 한 step 씩 순서대로 계산하는 recurrent 형태로도, 여러 step 을 한 번의 행렬곱으로 계산하는 parallel 형태로도 쓸 수 있습니다.
            학습은 parallel 형태로 GPU 를 채우고 추론은 recurrent 형태로 고정 크기 상태만 들고 이어갑니다. 이 둘이 같은 계산의 다른 표현이라는 사실이 duality
            입니다.
          </p>
          <p>
            문제는 delta rule 의 오차 항 v_t−S_{"{t-1}"}k_t 가 이전 상태 전체에 의존한다는
            점입니다. 표준 linear attention 은 φ(K)ᵀV 를 한 번의 행렬곱으로 구할 수
            있지만, delta rule 은 S_{"{t-1}"} 을 먼저 알아야 다음 오차를 계산할 수 있어
            순서를 강제합니다.
          </p>
          <p>
            Chunkwise parallel form 은 시퀀스를 길이 C 의 chunk 로 나눠 절충합니다. Chunk 안에서는 WY 표현과 UT transform 으로 순차 의존성을
            C×C 크기의 작은 행렬 역행렬 하나로 미리 풀어 두고 chunk 사이에서만 상태를 순서대로 넘깁니다.
          </p>
          <p>
            수치로 보면 절충이 뚜렷합니다. L=4096, C=64, d=128 이면 chunk 안 계산은
            L·C·d≈3.355×10⁷, chunk 사이 상태 갱신은 L·d²≈6.711×10⁷ 로 합쳐 약 1.007×10⁸
            입니다. 순수 순차 recurrence 는 상태 갱신만 필요해 6.711×10⁷ 이지만 4096 개
            단계를 하나씩 기다려야 합니다. Chunkwise 는 계산을 정확히 C/d=50 % 더 하는
            대신 기다려야 하는 단계를 4096 개에서 64 개로 줄입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Chunk 하나의 출력과 다음 chunk 로 넘길 상태를 어떻게 한 번의 행렬곱으로 얻나요?"
          idea="Chunk 진입 시점의 상태가 예측하는 값을 행렬 형태로 한 번에 빼고, chunk 안에서는 causal mask 를 곱한 QKᵀ 로 표준 attention 처럼 병렬 계산합니다."
          formula={String.raw`O=QS^\top+(QK^\top\odot M)\,\tilde U,\qquad S_{\text{next}}=S+\tilde U^\top K,\qquad \tilde U=U-WS^\top`}
          annotatedFormula={String.raw`O=\underbrace{QS^\top}_{\text{chunk 진입 상태가 바로 주는 기여}}+\underbrace{(QK^\top\odot M)}_{\text{chunk 안 causal 유사도}}\underbrace{\tilde U}_{\text{chunk 안에서 미리 푼 correction}},\qquad S_{\text{next}}=S+\underbrace{\tilde U^\top K}_{\text{이 chunk 전체의 쓰기를 한 번에 반영}}`}
          operations={[
            { expression: String.raw`QS^\top`, annotation: ["이전 chunk 까지의 상태 하나로 이번 chunk 전체 query 를 한 번에 읽어", "chunk 진입 시점의 기억 기여를 계산"] },
            { expression: String.raw`(QK^\top\odot M)\tilde U`, annotation: ["Chunk 안에서는 표준 attention 처럼 QKᵀ 에 causal mask 를 곱해", "각 위치가 자기 이전 위치의 correction 만 보게 함"] },
            { expression: String.raw`S+\tilde U^\top K`, annotation: ["Chunk 안 C 개 step 의 correction 을 한 번의 행렬곱으로 합쳐", "다음 chunk 로 넘길 상태 하나만 갱신"] },
          ]}
          terms={[
            { symbol: String.raw`\tilde U`, name: "chunk 안 prediction error", description: "UT transform 으로 chunk 진입 상태 S 의 예측까지 마저 뺀 C×d 행렬입니다." },
            { symbol: "M", name: "causal mask", description: "Chunk 안에서 뒤 위치가 앞 위치의 correction 을 보지 못하게 막는 C×C 하삼각 mask." },
            { symbol: String.raw`S`, name: "chunk 진입 상태", description: "이전 chunk 가 넘긴 d×d 상태로, chunk 안 모든 step 이 공유합니다." },
          ]}
          assumptions={["Ũ 를 구하는 UT transform 은 C×C 크기의 하삼각행렬 역행렬 하나만 필요해 C 가 64~128 정도면 저렴합니다.", "Gate α_t 가 있으면 Ũ, S_next 계산에 chunk 안 누적 decay 항이 추가로 곱해집니다."]}
          interpretation="Chunk 안의 모든 step 은 하나의 행렬곱 묶음으로 병렬 계산되고, chunk 와 chunk 사이에서만 상태 하나가 순서대로 전달됩니다. Chunk 수(L/C)만큼만 순차 대기가 남습니다."
        />
        <FastWeightMemoryAndChunkwiseRecurrenceViz />
        <AlgorithmBlock
          title="Chunkwise forward: chunk 하나를 병렬로 처리하고 상태 하나만 다음 chunk 로 넘김"
          input={[
            "이번 chunk 의 Q, K, V, β ∈ R^{C×d} (또는 β ∈ R^C)",
            "이전 chunk 가 넘긴 상태 S ∈ R^{d×d}",
            "Causal mask M ∈ R^{C×C} (하삼각)",
          ]}
          steps={[
            { code: "T ← (I − tril(diag(β) K Kᵀ, −1))⁻¹ diag(β)", note: "C×C 하삼각행렬의 역행렬 하나로 chunk 안의 순차 의존성을 미리 풀어 둡니다. C≈64면 저렴합니다." },
            { code: "W ← T K;  U ← T V", note: "실제 값과 그 방향을 chunk 진입 이전 상태와 무관한 형태로 재표현합니다." },
            { code: "Ũ ← U − W Sᵀ", note: "이전 chunk 가 넘긴 상태 S 가 예측할 값을 마저 빼 완전한 prediction error 를 얻습니다." },
            { code: "O ← Q Sᵀ + (Q Kᵀ ⊙ M) Ũ", note: "Chunk 진입 상태의 기여와 chunk 안 causal 항을 더해 이 chunk 의 모든 출력을 한 번에 계산합니다." },
            { code: "S ← S + Ũᵀ K", note: "Chunk 전체가 쓴 correction 을 한 번에 반영해 다음 chunk 로 넘길 상태를 갱신합니다." },
          ]}
          repeatUntil="L/C 개 chunk 를 순서대로 반복합니다. 각 chunk 내부의 다섯 줄은 chunk 사이에서만 순차이고, chunk 안에서는 행렬곱으로 병렬입니다."
          output="이번 chunk 의 출력 O ∈ R^{C×d}, 다음 chunk 로 넘길 상태 S ∈ R^{d×d}"
        />
        <div id="paper-deltanet-parallel" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yang, Wang, Zhang, Shen, Kim · Parallelizing Linear Transformers with the Delta Rule over Sequence Length"
            citeKey={3}
            href="https://arxiv.org/abs/2406.06484"
          >
            2024년 논문은 WY 표현과 UT transform 으로 delta rule 의 순차 recurrence 를
            chunkwise 행렬곱으로 재구성합니다. 1.3B 모델·100B token 학습과 H100 에서
            recurrent 형태 대비 4~16배 속도는 저자 측정값이며 chunk 크기·head 차원에
            따라 달라집니다.
          </CitationBlock>
        </div>
      </section>

      <section id="prefix-scan" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Parallel scan 은 순차 누적을 O(log n) 단계로 바꾸는 일반 해법입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            순차 누적을 병렬화하는 문제는 delta rule 이전부터 있었습니다. Parallel scan (prefix scan)은 이 누적합을 두 단계로 바꾸는 일반 알고리즘입니다.
            균형 이진 트리로 n 개 원소의 부분합을 모았다가 다시 내려보내므로 n 번이 아니라 O(log n) 번의 병렬 단계면 됩니다.
          </p>
          <p>
            n=64 라면 log₂64=6 이라 up-sweep 여섯 단계와 down-sweep 여섯 단계를 더해 열두 번의 병렬 단계로 끝납니다. 순차로 하나씩 누적하면 64 단계가
            필요하니 단계 수가 약 5.3배 줄어듭니다. 앞 절의 chunk 크기 C=64 를 그대로 넣은 값입니다.
          </p>
          <p>
            DeltaNet 의 chunkwise 알고리즘은 이 일반 scan 을 그대로 쓰지는 않습니다. 대신 C×C 하삼각행렬을 통째로 역행렬 계산해 같은 목표(순차 의존성을 병렬
            단계로 바꾸기)를 다른 방식으로 이룹니다. 둘은 같은 문제의 서로 다른 해법이고 한쪽이 다른 쪽의 상위호환은 아닙니다.
          </p>
        </div>
        <ProgressiveDetail
          title="균형 이진 트리로 부분합을 모았다가 내려보내는 두 단계는 각각 무엇을 하나요?"
          preview="Up-sweep 은 트리를 따라 올라가며 부분합을 모으고, down-sweep 은 그 부분합을 이용해 각 위치의 정확한 prefix 값을 다시 내려보냅니다."
        >
          <p>
            Up-sweep 은 인접한 두 원소를 합쳐 상위 노드에 저장하는 과정을 log₂n 번 반복해 루트에 전체 합을 남깁니다. 이 단계만으로는 각 원소의 prefix 값을 아직 알
            수 없고 부분합만 트리에 흩어져 있습니다.
          </p>
          <p>
            Down-sweep 은 루트에서부터 내려오며 왼쪽 자식이 가진 값을 오른쪽 자식에게
            더해 주는 과정을 다시 log₂n 번 반복합니다. 끝나면 각 원소 위치에 그 앞까지의
            정확한 누적값이 남습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          병렬화는 계산을 늘리고, delta rule 은 직교하지 않는 key 앞에서 완전하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Chunkwise parallel form 은 공짜가 아닙니다. Chunk 크기 C 를 키우면 순차 대기 단계는 줄지만 chunk 안 계산(L·C·d 항)이 늘어 어느
            지점부터는 GPU 활용이 늘어난 만큼의 이득을 계산 증가가 갉아먹습니다. 논문이 보고한 4~16배는 H100, 특정 head 차원·chunk 크기 조합에서 저자가 잰 값입니다.
          </p>
          <p>
            Delta rule 은 정확한 key 재현에서만 완전합니다. β=1 로 정확히 겹쳐 썼던 key 는 정확히 대체되지만 겹쳐 쓰지 않은 비슷한 key 는 이번 글의 수치 예처럼
            여전히 일부 새어 듭니다. 완전한 직교 기저를 강제하지 않는 한 이 누출은 남습니다.
          </p>
          <p>
            <Link to="/ai/qwen36-hybrid-architecture#delta-update">Qwen3.6 의 Gated DeltaNet</Link>
            은 이 글의 gated delta rule 을 48 개 head·128×128 상태로 구체화한 실제
            production 사례입니다. Head 수·상태 크기·layer 배치 같은 구현 세부는 이 글이
            아니라 그 글이 정본으로 다룹니다.
          </p>
          <p>
            <Link to="/ai/multi-head-latent-attention-mechanics">MLA</Link> 는 같은
            "고정 크기로 압축"이라는 동기를 attention 쪽에서 latent 압축으로 풀었고,
            이 글은 attention 을 아예 recurrent state 로 바꾸는 다른 계열입니다. 두 계열을
            결합하는 설계는 이 글의 범위 밖입니다.
          </p>
        </div>
        <div id="paper-blelloch" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Blelloch · Prefix Sums and Their Applications (CMU-CS-90-190)"
            citeKey={4}
            href="https://www.cs.cmu.edu/~guyb/papers/Ble93.pdf"
          >
            1990년 기술보고서는 up-sweep·down-sweep 두 단계로 이뤄진 work-efficient
            parallel scan 을 제시합니다. 정렬·문자열 비교 등 다른 응용까지 포함하며,
            이 글은 그중 순차 누적을 병렬 단계로 바꾸는 일반 원리만 인용합니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
