import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LinearAttentionAndStateSpaceModelsViz from "./linear-attention-and-state-space-models/viz/LinearAttentionAndStateSpaceModelsViz";

/**
 * Linear attention과 SSM은 고정 크기 state로 attention의 KV 성장을 없앱니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function LinearAttentionAndStateSpaceModelsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Sequence mixer는 과거를 token 기록 대신 고정 state로 저장할 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Attention은 이전 token 전부의 key와 value를 그대로 남겨 두고 현재 query가 그 기록을
            다시 훑습니다. Linear attention과 state space model(SSM)은 그 기록을 다시 훑는 대신
            하나의 고정 크기 state에 미리 눌러 담아, 문맥이 아무리 길어져도 state 크기와 한 token
            처리 비용이 늘지 않게 만드는 계열입니다.
          </p>
          <p>
            이 두 계열과 attention을 한데 묶어 부르는 이름이 sequence mixer입니다. 현재 위치의
            representation에 다른 위치의 정보를 섞어 넣는 sublayer라는 자리는 같고, 그 자리를
            채우는 구현이 다를 뿐입니다.{" "}
            <Link to="/ai/attention-theory">Attention의 Q, K, V</Link>가 낯설다면 거기서부터
            시작할 수 있습니다.
          </p>
          <p>
            이 글은 그 state가 무엇이고 어떻게 갱신되는지부터 봅니다. Q, K, V를 kernel feature
            map으로 바꿔 attention을 recurrent 형태로 다시 쓰는 선형화, 그 recurrence를
            일반화한 state space model과 Mamba의 선택 메커니즘, 고정 state가 치르는
            검색-압축 trade-off, 마지막으로 두 계열을 섞는 hybrid 구조까지 순서대로 다룹니다.
          </p>
          <p>
            아래 그림은 이 대비를 한눈에 보여 줍니다. Attention의 KV 기록이 token마다 자라는
            동안, linear attention과 SSM의 state는 크기를 그대로 유지한 채 내용만 갱신됩니다.
          </p>
        </div>
        <LinearAttentionAndStateSpaceModelsViz />
        <ContentBoundary article="linear-attention-and-state-space-models" />
      </section>

      <section id="kernel-trick" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Kernel feature map은 φ(K)ᵀV를 먼저 묶어 attention을 선형으로 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Linear attention은 softmax(QKᵀ)의 지수 유사도를 kernel feature map φ의 내적으로
            바꿔 attention을 kernel 함수로 다시 씁니다. Similarity(q, k)를 φ(q)·φ(k)로 정의하면
            곱셈의 결합법칙에 따라 key와 value를 먼저 묶은 φ(K)ᵀV를 계산해 두고, 그 결과를
            query마다 재사용할 수 있습니다.
          </p>
          <p>
            이 순서 교환이 계산량을 바꿉니다. 원래 attention은 query n개마다 key n개와의
            유사도를 전부 계산해 O(n²)이 들지만, φ(K)ᵀV를 먼저 만들면 query는 그 결과 하나만
            읽으면 되므로 전체 비용이 O(n)으로 줄어듭니다.
          </p>
          <p>
            d=128인 head 하나를 예로 들면 φ(K)ᵀV는 128×128 행렬, 즉 원소 16,384개입니다. Query
            수 n이 1,000이든 100만이든 이 행렬의 크기는 바뀌지 않고, 늘어나는 것은 그 행렬을
            만드는 데 더해지는 key-value 쌍의 수뿐입니다.
          </p>
        </div>
        <ExplainedFormula
          question="왜 φ(Q)(φ(K)ᵀV)로 묶으면 attention이 recurrent 형태가 되나요?"
          idea="Kernel feature map을 쓰면 softmax의 지수 유사도 대신 내적 유사도를 쓰므로, 결합법칙으로 key와 value를 먼저 묶은 뒤 query를 마지막에 곱할 수 있습니다. 그 묶음은 query 순서와 무관하게 하나씩 누적되는 state가 됩니다."
          formula={String.raw`O = \phi(Q)\big(\phi(K)^\top V\big),\qquad S_t = S_{t-1} + \phi(k_t)v_t^\top,\ \ o_t = \phi(q_t)^\top S_t`}
          annotatedFormula={String.raw`O = \underbrace{\phi(Q)}_{\text{query 사상}}\underbrace{\big(\phi(K)^\top V\big)}_{\text{query 와 무관한 누적}},\qquad \underbrace{S_t = S_{t-1} + \phi(k_t)v_t^\top}_{\text{위치마다 rank-1 누적}},\ \ \underbrace{o_t = \phi(q_t)^\top S_t}_{\text{현재 state 를 읽음}}`}
          operations={[
            { expression: String.raw`\phi(K)^\top V`, annotation: ["Key feature map 과 value 를 outer product 로 먼저 결합해", "query 와 무관한 d×d 결과를 만듦"] },
            { expression: String.raw`\phi(Q)\big(\phi(K)^\top V\big)`, annotation: ["그 결과를 query feature map 과 곱해 출력을 얻음", "결합법칙으로 계산 순서만 바꾼 것"] },
            { expression: String.raw`S_t = S_{t-1} + \phi(k_t)v_t^\top`, annotation: ["Causal 버전에서는 이 결합을 위치마다 하나씩 누적", "매 step 마다 rank-1 update"] },
            { expression: String.raw`o_t=\phi(q_t)^\top S_t`, annotation: ["갱신된 state 를 현재 query feature map 으로 읽어", "출력 하나를 얻음"] },
          ]}
          terms={[
            { symbol: String.raw`\phi`, name: "Kernel feature map", description: "Q, K를 양수 값의 다른 공간으로 사상해 내적이 similarity 역할을 하게 만드는 함수입니다." },
            { symbol: "Q, K, V", name: "Query · key · value", description: "표준 attention과 같은 세 입력이며, 여기서는 φ를 거친 뒤 곱해집니다." },
            { symbol: String.raw`S_t`, name: "d×d state 행렬", description: "위치 t까지의 φ(K)ᵀV 누적입니다. d는 feature 차원입니다." },
          ]}
          assumptions={["정규화 항(softmax의 분모에 해당)은 그림을 단순히 하려고 생략했고, 실제 구현은 φ(k)의 합을 별도 벡터로 함께 누적합니다.", "비causal 형태는 전체 합을 한 번에 계산하고, causal 형태만 위치별 누적이 필요합니다."]}
          interpretation="Attention을 다시 계산하지 않고 state 하나만 유지하면 다음 token 출력을 d×d 크기의 곱셈만으로 얻을 수 있습니다. d=128이면 state는 16,384개 값으로 고정됩니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 재구성에는 아직 causal 조건이 빠져 있습니다. 언어 모델은 미래 key를 보면 안
            되므로 φ(K)ᵀV는 한 번에 만드는 것이 아니라 위치마다 순서대로 누적해야 합니다.
            다음 절이 그 누적을 recurrent state로 씁니다.
          </p>
        </div>
        <div id="paper-linear-attention" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Katharopoulos, Vyas, Pappas, Fleuret · Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention"
            citeKey={1}
            href="https://arxiv.org/abs/2006.16236"
          >
            2020년 ICML 논문은 softmax(QKᵀ)V를 kernel feature map으로 재구성해 self-attention을
            O(n)에 계산하는 linear attention을 제시하고, 이 형태가 recurrent neural network와
            같은 constant-memory autoregressive inference로 다시 쓰일 수 있음을 보였습니다.
            저자 측정으로 매우 긴 autoregressive 생성에서 최대 4,000배 빠른 속도를 보고했으며,
            수치는 논문이 택한 실험 설정 범위입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="recurrent-state" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          고정 크기 state 하나로 다음 token 출력을 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Causal linear attention은 φ(K)ᵀV의 누적을 위치마다 순서대로 쌓는 대신, 그 누적을
            하나의 d×d 행렬 state로 유지하며 매 token마다 rank-1 항 하나만 더합니다. 이 state가
            recurrent linear attention의 유일한 기억이고, 크기는 문맥 길이 n과 무관하게
            고정됩니다.
          </p>
          <p>
            State 크기를 숫자로 보면 차이가 분명합니다. d=128, FP16 attention에서 token 하나가
            남기는 key와 value는 512 byte이므로 문맥이 65,536 token(64K)이면 attention 기록은
            32 MiB까지 자랍니다. 같은 d에서 FP32 recurrent state는 128×128×4 byte, 즉 64
            KiB로 고정되어 있고 문맥이 64K든 100만이든 그대로입니다.
          </p>
          <p>
            두 값의 비는 512배입니다. Attention은 매 token마다 기록을 추가하므로 읽고 쓰는
            byte가 문맥에 비례해 늘지만, recurrent linear attention은 같은 크기의 state를
            읽고 다시 쓰는 것만 반복하므로 한 step의 state 크기가 문맥 길이에 갇히지 않습니다.
          </p>
          <p>
            다만 전체 sequence를 처리하는 시간은 그래도 token 수 n에 비례해 늘어납니다. 이
            O(n²)이 아니라 O(n)이라는 성질을 linear-time sequence modeling이라 부릅니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Recurrent linear attention inference: token 하나의 한 step"
          input={["이전 state S_{t-1} (d×d), 정규화 벡터 z_{t-1}", "현재 token의 q_t, k_t, v_t", "kernel feature map φ"]}
          steps={[
            { code: "k̃_t ← φ(k_t);  q̃_t ← φ(q_t)", note: "Key와 query를 kernel feature space로 사상합니다." },
            { code: "S_t ← S_{t-1} + k̃_t v_tᵀ", note: "d×d state에 rank-1 outer product를 더합니다. 지수 계산 없이 순수 누적입니다." },
            { code: "z_t ← z_{t-1} + k̃_t", note: "정규화용 분모 벡터도 같은 방식으로 누적합니다." },
            { code: "o_t ← (q̃_tᵀ S_t) / (q̃_tᵀ z_t)", note: "현재 query로 state를 읽고 분모로 정규화해 출력 하나를 얻습니다." },
          ]}
          output="o_t, 그리고 다음 step이 재사용할 S_t, z_t"
          repeatUntil="sequence 끝(모든 token 처리)까지 반복하며, state 크기는 t와 무관하게 d×d로 고정됩니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원래 attention의 softmax는 정규화 항 하나를 행 전체에서 계산하지만, 여기서는 그
            정규화도 z_t라는 별도 벡터로 함께 누적해야 합니다. 뒤에서 볼 selective state space
            model은 이 recurrence를 다른 방식으로 확장합니다.
          </p>
        </div>
      </section>

      <section id="ssm" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          State space model은 같은 recurrence를 행렬-벡터 곱으로 일반화합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            State space model(SSM)은 continuous-time 신호 처리에서 온 recurrence로, 이전
            state x_{"{t-1}"}과 현재 입력을 고정 행렬 A, B로 선형결합해 다음 state를 만들고
            행렬 C로 그 state에서 출력을 읽습니다. Linear attention의 state update가 outer
            product 하나였다면, SSM의 state update는 행렬과 벡터의 곱입니다.
          </p>
          <p>
            초기 SSM인 S4는 A, B, C를 학습은 하되 추론 중에는 고정된 값으로 씁니다. 이런
            linear time-invariant 성질 덕분에 전체 sequence를 convolution으로 한 번에 계산할
            수 있지만, 모든 token을 같은 강도로 기억하거나 잊어 내용에 따라 다르게 반응하지
            못합니다.
          </p>
          <p>
            Mamba는 A, B, C와 discretization 간격 Δ를 현재 입력의 함수로 만들어 이 한계를
            풉니다. 정보가 적은 token은 Δ를 작게 만들어 state를 거의 바꾸지 않고, 새로운
            사실이 담긴 token은 Δ를 크게 만들어 state에 강하게 반영합니다. 이 input-dependent
            선택이 selective state space model이라는 이름의 이유입니다.
          </p>
          <p>
            선택 자체는 병렬화를 어렵게 만듭니다. Mamba는 state 차원을 channel마다 독립인
            대각 A로 두고, 이 recurrence를 GPU에서 hardware-aware scan 알고리즘으로 계산해
            선택 메커니즘과 긴 sequence 처리 속도를 함께 얻습니다.
          </p>
        </div>
        <TermBreakdown
          title="S4와 Mamba가 같은 recurrence에서 갈리는 지점"
          description="둘 다 state x_t = Ax_{t-1}+Bu_t, y_t=Cx_t 형태를 쓰지만, A, B, C를 언제 고정하는지가 다릅니다."
          items={[
            { term: "S4 · linear time-invariant", description: "A, B, C를 학습한 뒤 추론에서는 고정해 전체 sequence를 convolution으로 한 번에 계산합니다.", example: "Long Range Arena의 16K 길이 Path-X 문제 해결", boundary: "모든 token에 같은 recurrence를 적용해 content에 따라 다르게 반응하지 못합니다." },
            { term: "Mamba · selective SSM", description: "A, B, C와 Δ를 입력의 함수로 만들어 token 내용에 따라 state를 강하게 또는 약하게 갱신합니다.", example: "정보 없는 token은 Δ 작게, 새 사실은 Δ 크게", boundary: "입력에 따라 달라지는 recurrence라 convolution으로 한 번에 계산할 수 없어 별도 scan 알고리즘이 필요합니다." },
          ]}
        />
        <div id="paper-s4" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Gu, Goel, Ré · Efficiently Modeling Long Sequences with Structured State Spaces"
            citeKey={2}
            href="https://arxiv.org/abs/2111.00396"
          >
            2021년 논문(S4)은 HiPPO 이론으로 초기화한 구조적 state space model을 제시하고,
            행렬 A를 대각 성분과 저계수 보정으로 안정적으로 대각화해 Cauchy kernel 계산으로
            바꿉니다. 저자 측정으로 Long Range Arena 전 과제에서 최고 성능과 길이 16K인
            Path-X 해결을 보고했으며, 이는 A, B, C를 추론 중 고정한 LTI 조건에서의 결과입니다.
          </CitationBlock>
        </div>
        <div id="paper-mamba" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Gu, Dao · Mamba: Linear-Time Sequence Modeling with Selective State Spaces"
            citeKey={3}
            href="https://arxiv.org/abs/2312.00752"
          >
            2023년 논문은 SSM 파라미터를 입력의 함수로 만드는 selection mechanism과, 그로 인해
            사라진 convolution 표현을 대신할 hardware-aware parallel scan을 제시합니다. 저자
            측정으로 Mamba-3B가 같은 크기 Transformer를 능가하고 2배 큰 Transformer와
            동등했으며, attention이나 MLP 없이도 언어·오디오·유전체 모달리티에서 좋은 성능을
            보고했습니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Mamba 저자들은 이어진 논문에서 이 selective SSM과 linear attention이 사실 같은
            semiseparable 행렬 계산의 두 표현이라는 state space duality를 보였습니다. 그
            동등성 덕분에 이 글에서 recurrent state로 설명한 성질, 즉 고정 크기와 O(n) 전체
            비용은 SSM 계열에도 그대로 옮겨집니다.
          </p>
        </div>
        <div id="paper-mamba2-ssd" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Dao, Gu · Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality"
            citeKey={4}
            href="https://arxiv.org/abs/2405.21060"
          >
            2024년 ICML 논문은 SSM을 semiseparable 행렬 곱으로 표현하는 state space duality
            (SSD) 프레임워크로 선택적 SSM과 linear attention의 이론적 동등성을 세우고, 이를
            바탕으로 한 Mamba-2 구현이 Mamba보다 2~8배 빠르다고 저자가 측정했습니다. 실험은
            small-to-medium 규모 언어 모델링에서의 비교이며, 모든 규모에서 같은 배율이라는
            뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="tradeoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          고정 state는 용량을 넘는 문맥에서 서로 다른 사실을 겹쳐씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            d×d state가 표현할 수 있는 독립적인 key-value 연관의 수는 대략 d²개로 제한됩니다.
            문맥에 담긴 사실 수가 이 용량을 넘어서면 서로 다른 연관이 같은 state 좌표에 겹쳐
            쓰이고, 나중에 읽을 때 둘 중 하나 또는 둘 다 부정확하게 나옵니다.
          </p>
          <p>
            d=128이면 용량은 16,384 근처입니다. 문맥에 있는 서로 다른 사실이 이 수를 크게
            밑돌면 state는 거의 손실 없이 요약하지만, 문맥이 수만 token을 넘는 긴 문서에서
            사실 하나를 정확히 다시 꺼내야 하는 질의는 이 한계를 직접 건드립니다.
          </p>
          <p>
            Full attention은 token별 key와 value를 그대로 두므로 이런 겹침이 없습니다. 대신
            그 대가로 기록이 문맥 길이만큼 자랍니다. 그래서 두 계열의 선택은 압축을 얼마나
            감수하고 얼마나 정확한 검색을 사려는지의 문제이지, 한쪽이 다른 쪽의 상위 호환이
            아닙니다.
          </p>
        </div>
        <ProgressiveDetail
          title="용량을 넘기 전에는 압축이 손실이 아닌 이유는 무엇인가요?"
          preview="문맥의 실제 정보량이 state 용량보다 훨씬 작으면 서로 다른 사실이 같은 좌표를 두고 다툴 일이 적어, 고정 state도 attention과 비슷한 결과를 냅니다."
        >
          <p>
            자연어 문맥은 대개 중복과 예측 가능한 부분이 많아, token 수만큼의 독립적인 정보를
            담고 있지 않습니다. State 용량이 그 실제 정보량보다 크게 남아 있는 동안에는
            겹쳐쓰기가 드물어 요약이 원문과 거의 같은 답을 줍니다.
          </p>
          <p>
            문제는 이 여유가 얼마나 남았는지 문맥만 보고는 알기 어렵다는 점입니다. 무작위
            UUID나 서로 무관한 사실을 촘촘히 채운 needle-in-a-haystack benchmark는 정보량이
            용량에 가까워지도록 일부러 설계해 이 한계를 드러냅니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="hybrid" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hybrid 구조는 대부분을 압축하고 소수 layer만 정확한 기록으로 남깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Hybrid sequence architecture는 대부분의 layer를 linear attention이나 SSM으로 두어
            state를 압축하고, 그중 일부 layer만 token별 key와 value를 그대로 남기는 full
            attention으로 둡니다. 압축 layer가 메모리와 시간을 아끼고, 남은 attention layer가
            정확한 검색이 필요한 순간의 통로가 됩니다.
          </p>
          <p>
            Jamba는 이 비율을 attention 1개당 Mamba 7개, 즉 8개 layer마다 attention을 1개만
            두는 방식으로 공개했습니다. 이 글의 예로 layer 32개가 있다고 하면, 전부 attention일
            때 KV는 32×32 MiB = 1 GiB입니다.
          </p>
          <p>
            8분의 1인 4개만 attention이면 4×32 MiB = 128 MiB에 나머지 28개 layer의 고정 state
            약 1.75 MiB(28×64 KiB)를 더해 약 130 MiB로, 전부 attention일 때보다 약 8배
            줄어듭니다.
          </p>
          <p>
            State가 아무리 압축되어 있어도 나머지 attention layer는 여전히 token 전체를
            정확히 조회할 수 있습니다. 이것이 attention layer를 8분의 1만 남겨도 검색 성능
            대부분을 지킬 수 있는 이유이고, 나머지 7/8이 얻는 시간과 메모리 이득은 그대로
            남습니다.
          </p>
          <p>
            정확한 비율과 어느 depth에 attention을 배치할지는 model마다 다르고, 이 글은 그
            배치를 최적화하는 방법이 아니라 왜 이런 배치가 성립하는지를 다룹니다. 실제
            checkpoint가 이 비율을 어떻게 골랐는지는{" "}
            <Link to="/ai/qwen36-hybrid-architecture">Qwen3.6의 3:1 hybrid schedule</Link>과{" "}
            <Link to="/ai/kimi-k3-sequence-mixer">Kimi K3의 sequence mixer</Link>에서
            이어집니다.
          </p>
        </div>
        <div id="paper-jamba" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Lieber et al. (AI21 Labs) · Jamba: A Hybrid Transformer-Mamba Language Model"
            citeKey={5}
            href="https://arxiv.org/abs/2403.19887"
          >
            2024년 논문은 Transformer attention block과 Mamba block을 번갈아 배치하고 일부
            layer에 mixture-of-experts를 더한 hybrid 구조를 공개하며, attention을 Mamba 7개당
            1개 비율로만 남겨 단일 80GB GPU에 올라가는 규모에서 256K token context를
            지원한다고 보고했습니다. 이 비율과 수치는 저자가 공개한 구성 기준이며, 이 글의
            32-layer 예시 계산은 그 비율을 적용한 것이지 논문이 보고한 실제 layer 총수는
            아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
