import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FlashAttentionIoAwareKernelViz from "./flash-attention-io-aware-kernel/viz/FlashAttentionIoAwareKernelViz";

/**
 * FlashAttention 은 online softmax 로 attention 행렬을 HBM 에 쓰지 않습니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function FlashAttentionIoAwareKernelArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          표준 attention 은 N×N 행렬을 HBM 에 썼다가 다시 읽느라 느립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Attention 의 곱셈 횟수는 sequence 길이 N 의 제곱에 비례합니다. 그런데 실제 시간을 잡아먹는 것은 N×N 점수 행렬을 GPU 주메모리에 적었다가 다시 읽는
            왕복입니다. FlashAttention 은 그 행렬을 메모리에 만들지 않고 작은 tile 단위로 on-chip 메모리 안에서 소비합니다. 결과는 표준 attention 과 같고
            왕복만 사라집니다.
          </p>
          <p>
            HBM(high bandwidth memory)은 GPU 의 주메모리로, A100 기준 40 GB 용량에
            초당 1.5~2 TB 를 읽습니다. SRAM 은 각 streaming multiprocessor 안에 붙은
            on-chip 메모리로 192 KB 밖에 안 되지만 대역폭이 약 19 TB/s 로 열 배 가까이
            빠릅니다. 이 두 숫자는 FlashAttention 논문이 A100 을 기준으로 적은 값입니다.
          </p>
          <p>
            Attention materialization 은 <Link to="/ai/attention-theory#multiplicative">scaled dot-product attention</Link>
            의 중간 결과인 점수 행렬 S = QKᵀ/√d 와 softmax 결과 P 를 HBM 에 실제 크기로
            써 두는 일을 뜻합니다. PyTorch 의 기본 구현은 matmul, softmax, dropout, matmul 을
            서로 다른 kernel 로 부르므로 kernel 사이마다 이 행렬이 HBM 을 거칩니다.
          </p>
          <p>
            N=4096, head dim d=64, FP16 이면 Q, K, V 는 각각 4096×64×2 B = 512 KiB 입니다. 반면 S 는 4096×4096×2 B = 32
            MiB 이고 P 도 32 MiB 입니다. S 쓰기와 읽기, P 쓰기와 읽기를 더하면 head 하나에 128 MiB, 입력의 64 배가 오갑니다.
          </p>
          <p>
            Head 32 개, batch 8 이면 layer 하나가 32 GiB 를 왕복해 2 TB/s 로도 16 ms 가 듭니다. 같은 layer 의 곱셈은 tensor core 로 1
            ms 안에 끝나므로 병목은 계산이 아니라 메모리입니다. 곱셈 횟수를 줄이는 근사 attention 이 wall-clock 을 못 줄인 이유가 여기에 있습니다.
          </p>
        </div>
        <div id="paper-flashattention" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Dao, Fu, Ermon, Rudra, Ré · FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"
            citeKey={1}
            href="https://arxiv.org/abs/2205.14135"
          >
            2022 년 논문은 attention 의 병목을 FLOPs 가 아닌 HBM 접근으로 진단하고,
            tiling 과 recomputation 으로 N×N 행렬을 쓰지 않는 exact attention kernel 을
            제시했습니다. GPT-2 3 배, BERT-large 15 % 가속과 HBM 접근 9 배 감소는 A100 에서
            저자가 잰 값입니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="flash-attention-io-aware-kernel" />
      </section>

      <section id="io-aware" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          IO-aware 알고리즘은 FLOPs 대신 HBM 접근 횟수를 비용으로 셉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            IO-aware algorithm 은 계산 횟수 대신 메모리 계층 사이를 오가는 byte 수를 비용 함수로 삼습니다. FlashAttention 은 attention 을 이
            비용 함수로 다시 설계한 결과입니다. 그래서 곱셈 횟수는 오히려 늘어도 시간은 줄어듭니다.
          </p>
          <p>
            비용 모델은 두 층입니다. 계산은 크기 M 인 빠른 SRAM 안에서만 일어나고 크고 느린 HBM 과는 block 단위로만 데이터를 주고받습니다. 이 모델에서 표준
            attention 의 HBM 접근량은 Θ(Nd + N²) 이고 FlashAttention 은 Θ(N²d²/M) 입니다.
          </p>
          <p>
            SRAM 에 FP16 원소 5 만 개(약 100 KB)가 들어간다고 두고 N=4096, d=64 를 대입해 보겠습니다. N² 은 1.7×10⁷ 원소이고 N²d²/M 은
            1.3×10⁶ 원소입니다. 접근량이 12 배 넘게 줄어듭니다. SRAM 이 커질수록 격차는 더 벌어집니다.
          </p>
          <p>
            SRAM residency 는 이 절감을 실제로 만드는 조건입니다. Tile 하나가 SRAM 에 올라온
            동안 matmul, mask, softmax, dropout, 두 번째 matmul 을 모두 끝내고 HBM 에는
            최종 출력만 씁니다. 여러 kernel 을 하나로 합치는 <Link to="/gpu/cuda-kernel-fusion">kernel fusion</Link>
            이 attention 에서는 이런 모양으로 나타납니다.
          </p>
          <p>
            HBM traffic reduction 은 그 결과로 줄어든 왕복 byte 를 부르는 이름입니다. 같은
            원리를 GEMM 에서 먼저 쓴 것이 <Link to="/gpu/cuda-matrix-multiply#tiled">shared-memory tile 재사용</Link>
            이고, tile 을 어디에 올리는지는 <Link to="/gpu/cuda-shared-memory#overview">CUDA shared memory</Link>
            글이 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="IO-aware 비용 모델의 네 가지 말"
          description="같은 메모리 이야기를 서로 다른 층위에서 부르는 용어입니다."
          items={[
            { term: "HBM", description: "GPU 주메모리입니다. 크지만 SRAM 보다 열 배쯤 느립니다.", example: "A100 40 GB, 1.5~2 TB/s", boundary: "세대마다 용량과 대역폭이 달라 수치는 hardware 별로 다시 확인합니다." },
            { term: "SRAM", description: "SM 안의 on-chip 메모리로 shared memory 와 register 를 가리킵니다.", example: "A100 SM 당 192 KB, 약 19 TB/s", boundary: "용량이 작아 tile 크기의 상한을 정합니다." },
            { term: "Attention materialization", description: "S 와 P 를 N×N 크기로 HBM 에 실제로 적는 일입니다.", example: "N=4096 FP16 에서 head 당 32 MiB", boundary: "행렬을 만들어도 SRAM 안에서만 쓰면 materialization 이 아닙니다." },
            { term: "IO complexity", description: "SRAM 크기 M 을 고정했을 때 HBM 접근 횟수의 점근 차수입니다.", example: "표준 Θ(N²), FlashAttention Θ(N²d²/M)", boundary: "상수 항과 실제 latency 는 kernel 구현이 정합니다." },
          ]}
        />
      </section>

      <section id="online-softmax" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Online softmax 는 행 전체를 보지 않고도 max 와 normalizer 를 고쳐 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/softmax#overview">Softmax</Link> 는 행의 최댓값을 빼고 지수를 취한
            뒤 합으로 나누므로 한 행을 끝까지 읽어야 답이 나옵니다. Online softmax 는 지금까지
            본 부분의 최댓값 m 과 지수합 ℓ 만 들고 있다가, 더 큰 값이 나타나면 이전 합에
            보정 계수를 곱해 기준점을 옮깁니다. 행을 조각내 읽어도 최종 답이 같습니다.
          </p>
          <p>
            성립 이유는 <Link to="/ai/softmax#overview">softmax 의 max-shift invariance</Link>
            입니다. 기준점을 m_old 에서 m_new 로 바꾸면 모든 항에 {"e^{m_old − m_new}"} 가 똑같이
            곱해지므로, 이미 더해 둔 합에도 그 계수 하나만 곱하면 새 기준점의 합이 됩니다.
            Running maximum 이 m 이고 running normalizer 가 ℓ 입니다.
          </p>
          <p>
            작은 예로 확인합니다. 점수 행 [1, 3, 2, 5] 를 [1, 3] 과 [2, 5] 두 tile 로 읽습니다.
            첫 tile 에서 m=3, ℓ=e⁻²+e⁰=1.135 입니다. 둘째 tile 에서 최댓값이 5 로 바뀌므로
            ℓ={"e^{3−5}"}×1.135+{"e^{2−5}"}+e⁰=0.154+0.050+1=1.203 입니다.
          </p>
          <p>
            행 전체를 한 번에 계산하면 e⁻⁴+e⁻²+e⁻³+e⁰=0.018+0.135+0.050+1=1.203 으로 같은 값이 나옵니다. Milakov 와 Gimelshein 은
            2018 년 이 갱신식으로 세 번 읽던 softmax 를 두 번 읽기로 줄였습니다. FlashAttention 은 같은 식을 tile 사이의 접착제로 씁니다.
          </p>
        </div>
        <ExplainedFormula
          question="다음 tile 의 점수 S_j 를 읽었을 때 running max 와 normalizer 를 어떻게 고치나요?"
          idea="새 최댓값을 먼저 정하고, 옛 기준으로 쌓아 둔 합에는 기준 차이의 지수를 한 번 곱한 뒤 새 tile 의 지수합을 더합니다."
          formula={String.raw`m^{(j)}=\max\!\big(m^{(j-1)},\operatorname{rowmax}(S_j)\big),\qquad \ell^{(j)}=e^{\,m^{(j-1)}-m^{(j)}}\,\ell^{(j-1)}+\operatorname{rowsum}\!\big(e^{\,S_j-m^{(j)}}\big)`}
          annotatedFormula={String.raw`\ell^{(j)}=\underbrace{e^{\,m^{(j-1)}-m^{(j)}}}_{\text{기준점 이동 보정 계수}}\;\underbrace{\ell^{(j-1)}}_{\text{이전 tile 까지의 지수합}}+\underbrace{\operatorname{rowsum}\!\big(e^{\,S_j-m^{(j)}}\big)}_{\text{새 tile 의 지수합}},\qquad \underbrace{m^{(j)}=\max(m^{(j-1)},\operatorname{rowmax}(S_j))}_{\text{running maximum 갱신}}`}
          operations={[
            { expression: String.raw`\max\!\big(m^{(j-1)},\operatorname{rowmax}(S_j)\big)`, annotation: ["새 tile 의 행별 최댓값과 지금까지의 최댓값을 비교해", "지수가 넘치지 않는 새 기준점을 정함"] },
            { expression: String.raw`e^{\,m^{(j-1)}-m^{(j)}}\,\ell^{(j-1)}`, annotation: ["옛 기준으로 쌓은 합에 기준 차이의 지수를 곱해", "새 기준점에서 계산한 값과 일치시킴"] },
            { expression: String.raw`\operatorname{rowsum}\!\big(e^{\,S_j-m^{(j)}}\big)`, annotation: ["새 tile 의 점수에서 새 기준점을 빼고 지수합을 구해", "누적 normalizer 에 더함"] },
          ]}
          terms={[
            { symbol: String.raw`S_j`, name: "j 번째 점수 tile", description: "Q block 과 K_j block 의 곱을 √d 로 나눈 B_r×B_c 행렬입니다." },
            { symbol: String.raw`m^{(j)}`, name: "Running maximum", description: "j 번째 tile 까지 본 점수의 행별 최댓값입니다. 초기값은 −∞ 입니다." },
            { symbol: String.raw`\ell^{(j)}`, name: "Running normalizer", description: "현재 기준점 m^{(j)} 으로 계산한 행별 지수합입니다. 초기값은 0 입니다." },
          ]}
          assumptions={["행마다 독립적으로 적용되므로 m 과 ℓ 은 B_r 길이의 벡터입니다.", "보정 계수 e^{m_old − m_new} 는 항상 1 이하라 FP16 에서도 넘치지 않습니다."]}
          interpretation="최종 softmax 는 마지막 tile 뒤에 e^{S − m^{(T)}} / ℓ^{(T)} 로 나오며, 행 전체를 한 번에 계산한 값과 정확히 같습니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 보정을 P·V 누적에도 적용해야 출력 O 가 맞습니다. 옛 기준으로 쌓은 출력에
            같은 계수를 곱한 뒤 새 tile 의 {"e^{S_j − m}"}·V_j 를 더합니다. 원 논문은 매 tile 마다
            ℓ 로 나눠 O 를 정규화된 상태로 유지하고, FlashAttention-2 는 나눗셈을 맨 끝 한 번으로
            미룹니다.
          </p>
        </div>
        <ExplainedFormula
          question="Tile 마다 갱신되는 출력 누적값은 어떻게 최종 attention 출력이 되나요?"
          idea="정규화하지 않은 출력 Õ 를 같은 보정 계수로 고쳐 가며 쌓고, 모든 tile 이 끝난 뒤 normalizer 로 한 번만 나눕니다."
          formula={String.raw`\tilde O^{(j)}=e^{\,m^{(j-1)}-m^{(j)}}\,\tilde O^{(j-1)}+e^{\,S_j-m^{(j)}}\,V_j,\qquad O=\tilde O^{(T)}/\ell^{(T)}`}
          annotatedFormula={String.raw`\tilde O^{(j)}=\underbrace{e^{\,m^{(j-1)}-m^{(j)}}\,\tilde O^{(j-1)}}_{\text{옛 기준으로 쌓은 출력의 보정}}+\underbrace{e^{\,S_j-m^{(j)}}\,V_j}_{\text{새 tile 의 가중 value 합}},\qquad \underbrace{O=\tilde O^{(T)}/\ell^{(T)}}_{\text{마지막 한 번의 정규화}}`}
          operations={[
            { expression: String.raw`e^{\,m^{(j-1)}-m^{(j)}}\,\tilde O^{(j-1)}`, annotation: ["이전 누적 출력에 기준점 이동 계수를 곱해", "새 기준점의 가중치와 맞춤"] },
            { expression: String.raw`e^{\,S_j-m^{(j)}}\,V_j`, annotation: ["정규화 전 가중치로 value tile 을 곱해", "SRAM 안에서 B_r×d 부분합 생성"] },
            { expression: String.raw`\tilde O^{(T)}/\ell^{(T)}`, annotation: ["마지막 tile 뒤 행마다 normalizer 로 나눠", "표준 softmax 와 같은 출력 완성"] },
          ]}
          terms={[
            { symbol: String.raw`\tilde O^{(j)}`, name: "정규화 전 출력 누적", description: "B_r×d 크기이며 SRAM 이나 register 에 머뭅니다." },
            { symbol: String.raw`V_j`, name: "j 번째 value tile", description: "B_c×d 크기로 K_j 와 함께 HBM 에서 읽어 옵니다." },
            { symbol: "T", name: "K/V tile 수", description: "N/B_c 개입니다. N=4096, B_c=128 이면 32 개입니다." },
          ]}
          assumptions={["원 논문의 Algorithm 1 은 매 tile 마다 ℓ 로 나누는 정규화 상태를 유지합니다. 위 식은 FlashAttention-2 가 택한 지연 정규화 형태입니다.", "Dropout 을 쓰면 e^{S_j − m} 뒤에 같은 tile 위치의 mask 를 곱합니다."]}
          interpretation="출력을 tile 마다 정규화하지 않아도 마지막에 한 번 나누면 같습니다. 계수 곱셈이 줄어드는 만큼 non-matmul 연산이 줄어듭니다."
        />
        <div id="paper-online-softmax" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Milakov, Gimelshein · Online normalizer calculation for softmax"
            citeKey={2}
            href="https://arxiv.org/abs/1805.02867"
          >
            2018 년 NVIDIA 기술 보고서는 softmax 의 max 와 normalizer 를 한 pass 로 함께 갱신하는
            식을 제시하고 메모리 읽기를 세 번에서 두 번으로 줄였습니다. 보고한 1.3 배, TopK 결합
            5 배 가속은 저자 측정이며 attention 에 적용한 결과는 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="tiling" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Tile 하나가 SRAM 에 머무는 동안 attention 을 끝까지 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Tiled attention 은 Q 를 B_r 행짜리 block 으로, K 와 V 를 B_c 행짜리 block 으로 잘라 한 번에 한 쌍씩 SRAM 에 올립니다. Q block
            하나를 맡은 thread block 이 K/V block 을 차례로 읽으며 B_r×B_c 점수 tile 을 만들고 online softmax 로 그 자리에서 소비합니다. N×N
            행렬은 어느 순간에도 통째로 존재하지 않습니다.
          </p>
          <p>
            Tile 크기는 SRAM 이 정합니다. B_r=B_c=128, d=64, FP16 이면 Q tile, K tile, V tile 이
            각각 128×64×2 B = 16 KiB 이고 점수 tile 을 FP32 로 두면 128×128×4 B = 64 KiB 입니다.
            합쳐 112 KiB 로 A100 의 192 KB 안에 들어갑니다. 논문은 B_c 를 ⌈M/4d⌉ 로 잡아 이
            네 조각이 M 을 나눠 쓰게 합니다.
          </p>
          <p>
            HBM 왕복을 세어 보겠습니다. Q block 은 4096/128 = 32 개이고 각 block 이 K 와 V 전체 1 MiB 를 한 번씩 읽으므로 32 MiB, 여기에 Q
            읽기와 O 쓰기 1 MiB 가 더해집니다. 표준 구현의 130 MiB 와 견주면 약 4 배 차이이고 B_r 을 키울수록 비율이 커집니다.
          </p>
          <p>
            아래 그림은 query 행 하나가 K/V tile 두 개를 차례로 만나는 동안 m, ℓ, Õ 가 어떻게
            바뀌고 HBM 에는 무엇이 오가는지 보여 줍니다. 앞 절의 점수 [1, 3, 2, 5] 를 그대로
            씁니다.
          </p>
        </div>
        <FlashAttentionIoAwareKernelViz />
        <AlgorithmBlock
          title="FlashAttention forward: Q block 하나를 맡은 thread block 의 tiling loop"
          input={["Q, K, V ∈ HBM, 각각 N×d", "block 크기 B_r, B_c (SRAM 크기 M 에서 결정)", "scale 1/√d, 선택적 causal mask"]}
          steps={[
            { code: "T_r ← N / B_r,  T_c ← N / B_c", note: "복사 없이 HBM 위의 Q, K, V 를 block 경계로만 나눕니다." },
            { code: "load Q_i → SRAM;  m_i ← −∞;  ℓ_i ← 0;  Õ_i ← 0", note: "Q block 과 세 running state 는 loop 내내 on-chip 에 머뭅니다." },
            { code: "for j = 1 … T_c:", note: "K/V block 을 순서대로 한 쌍씩 스트리밍합니다." },
            { code: "  load K_j, V_j → SRAM", note: "HBM 읽기는 이 줄에서만 일어납니다." },
            { code: "  S_ij ← Q_i K_jᵀ / √d", note: "B_r×B_c 점수 tile 을 tensor core 로 만들고 SRAM 에 둡니다." },
            { code: "  if causal and block j entirely after block i: continue", note: "Mask 로 전부 가려지는 tile 은 읽지도 않고 건너뜁니다." },
            { code: "  m_new ← max(m_i, rowmax(S_ij));  P̃ ← exp(S_ij − m_new)", note: "새 기준점과 정규화 전 가중치를 구합니다." },
            { code: "  ℓ_i ← e^{m_i − m_new} ℓ_i + rowsum(P̃)", note: "Running normalizer 를 보정한 뒤 더합니다." },
            { code: "  Õ_i ← e^{m_i − m_new} Õ_i + P̃ V_j;  m_i ← m_new", note: "출력 누적도 같은 계수로 보정합니다. S_ij 와 P̃ 는 여기서 버려집니다." },
            { code: "O_i ← Õ_i / ℓ_i → HBM;  L_i ← m_i + log ℓ_i → HBM", note: "출력과 행별 logsumexp 만 HBM 에 씁니다. Backward 가 L 을 씁니다." },
          ]}
          repeatUntil="모든 Q block i = 1 … T_r 이 서로 다른 thread block 에서 같은 loop 를 끝낼 때까지 반복합니다."
          output="O ∈ HBM (N×d), L ∈ HBM (N). S 와 P 는 HBM 에 한 번도 쓰이지 않습니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            원 논문의 Algorithm 1 은 바깥 loop 가 K/V block, 안쪽 loop 가 Q block 이라 O, ℓ, m 을 tile 마다 HBM 에서 읽고 씁니다. 위
            pseudocode 처럼 Q block 을 바깥에 두고 running state 를 on-chip 에 고정한 것은 FlashAttention-2 의 재배치입니다. 접근량 차수는
            둘 다 Θ(N²d²/M) 입니다.
          </p>
        </div>
      </section>

      <section id="backward" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Backward 는 P 를 저장하는 대신 logsumexp 하나로 다시 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            역전파는 gradient 를 흘리려면 softmax 결과 P 가 필요합니다. 표준 구현은 forward 에서
            N×N 인 P 를 저장해 두고, FlashAttention 은 행마다 logsumexp 한 값 L = m + log ℓ 만
            저장한 뒤 backward 에서 점수 tile 을 QKᵀ 로 다시 만들어 P = {"e^{S − L}"} 로 복원합니다.
            이것이 recompute-vs-store tradeoff 입니다.
          </p>
          <p>
            N=4096 이면 head 당 P 는 32 MiB 이지만 L 은 4096×4 B = 16 KiB 로 저장량 차이가 큽니다. 대신 backward 가 점수 tile 을 얻으려고
            QKᵀ 곱셈을 한 번 더 하므로 곱셈 횟수는 표준보다 늘어납니다. Memory-bound 인 kernel 에서는 계산이 늘어도 HBM 왕복이 줄면 wall-clock 이
            짧아진다는 것이 논문의 주장이자 측정입니다.
          </p>
          <p>
            같은 판단을 layer 단위로 하는 것이 <Link to="/ai/reverse-mode-autodiff#save-recompute">autodiff 의 save–recompute 경계</Link>
            입니다. Gradient checkpointing 은 activation 을 버리고 layer 를 다시 돌리지만,
            FlashAttention 은 kernel 안 tile 단위로 같은 선택을 하고 저장 대상을 통계량 벡터
            L 하나로 줄입니다.
          </p>
          <p>
            Activation 이 N² 에서 N 으로 줄어든 덕에 같은 GPU 에서 훨씬 긴 sequence 를 학습할 수 있게 됐습니다. 논문은 Path-X(16K) 를 처음 우연
            이상으로 푼 결과로 이 효과를 보고했습니다. 이것 역시 저자 자기보고 범위입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Backward tile 안에서는 어떤 gradient 를 어떤 순서로 만드나요?"
          preview="Tile 마다 S 와 P 를 다시 만들고 dV, dP, dS, dQ, dK 를 순서대로 누적합니다. HBM 에는 dQ, dK, dV 만 씁니다."
        >
          <p>
            먼저 forward 출력으로 행별 상수 D = rowsum(dO ∘ O) 를 계산해 둡니다. 각 K/V block
            j 와 Q block i 마다 S_ij = Q_i K_jᵀ/√d 를 다시 만들고 P_ij = {"e^{S_ij − L_i}"} 로
            복원합니다.
          </p>
          <p>
            그다음 dV_j += P_ijᵀ dO_i, dP_ij = dO_i V_jᵀ, dS_ij = P_ij ∘ (dP_ij − D_i) 를 SRAM
            안에서 계산하고, dQ_i += dS_ij K_j /√d 와 dK_j += dS_ijᵀ Q_i /√d 를 누적합니다. dQ 는
            여러 thread block 이 같은 행에 더하므로 atomic add 나 별도 pass 가 필요합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          SRAM 크기와 head dim 에 묶인 hardware kernel 입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            FlashAttention 의 정체는 수학이 아닌 CUDA kernel 입니다. 특정 GPU 의 메모리 계층에 맞춰 손으로 짠 코드입니다. 결과는 exact 하지만 어떤
            tile 크기가 맞는지, head dim 을 어디까지 받는지, 얼마나 빨라지는지는 전부 hardware 에 달려 있습니다.
          </p>
          <p>
            첫 한계는 head dim 입니다. Q, K, V, S tile 이 한 SM 의 SRAM 에 같이 들어가야 하므로 d 가 커지면 B 를 줄여야 하고 그러면 HBM 왕복이 다시
            늘어납니다. 2022 년 구현은 d ≤ 128 만 지원했고 더 큰 head dim 은 후속 버전에서 열렸습니다.
          </p>
          <p>
            Hardware 에 묶여 있다는 점도 한계입니다. SRAM 용량·tensor core 의 입력 형식·warp 수가 세대마다 달라 A100 용 tile 이 H100 에서 최적이
            아닙니다. 그래서 FlashAttention-2, 3 가 같은 수학 위에 kernel 을 다시 썼습니다. Triton 같은 compiler 로 다시 짜는 시도도 같은 이유에서
            나왔습니다.
          </p>
          <p>
            마지막은 병렬화 축입니다. 2022 년 kernel 은 batch×head 단위로만 thread block 을 띄우기 때문에 sequence 가 길고 batch 가 작으면 SM
            대부분이 놉니다. FlashAttention-2 가 sequence 축 병렬과 loop 순서 교체로 이 문제를 풀었고 그 차이는 다음 글인 attention kernel
            anatomy 에서 다룹니다.
          </p>
          <p>
            Decode 에서는 모양이 달라집니다. Query 가 한 행뿐이라 Q tiling 은 의미가 없고,
            <Link to="/ai/kv-cache-fundamentals#kv-shape">KV cache</Link> 가 page 단위로 흩어져
            있습니다. <Link to="/ai/vllm-paged-attention#memory-kernel-boundary">vLLM 의 PagedAttention</Link>
            은 같은 online softmax 를 block table 위에서 돌리며, 긴 context 에서는 K/V 축을
            나눠 병렬화하는 Flash-Decoding 이 필요해집니다.
          </p>
        </div>
        <ProgressiveDetail
          title="FlashAttention 과 근사 attention 은 어떻게 다른가요?"
          preview="FlashAttention 은 곱셈을 하나도 줄이지 않는 exact attention 입니다. Sparse·low-rank 근사는 FLOPs 를 줄이지만 memory-bound 병목을 건드리지 못해 wall-clock 이 잘 줄지 않았습니다."
        >
          <p>
            논문은 block-sparse FlashAttention 도 함께 제시해 mask 로 통째로 가려지는 tile 을 읽지 않는 방식으로 IO 를 더 줄였습니다. 근사가 들어가는
            곳은 sparsity pattern 뿐이고 kernel 자체는 남은 tile 을 여전히 exact 하게 계산합니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
