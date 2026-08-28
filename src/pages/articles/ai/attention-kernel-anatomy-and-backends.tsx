import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import AttentionKernelAnatomyAndBackendsViz from "./attention-kernel-anatomy-and-backends/viz/AttentionKernelAnatomyAndBackendsViz";

/**
 * Attention kernel 은 QK·softmax·PV 를 한 kernel 로 융합하고 prefill 과 decode 에 다른 backend 를 씁니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function AttentionKernelAnatomyAndBackendsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Attention kernel 은 세 단계를 한 tile 안에서 끝내는 GPU 함수입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Attention kernel 은 Q, K, V 를 받아 softmax(QKᵀ/√d)V 를 계산하는 GPU kernel 하나를
            뜻합니다. 안에는 QK matmul, softmax, PV matmul 세 단계가 있고, 빠른 kernel 은 이
            셋을 tile 하나가 on-chip 에 머무는 동안 끝냅니다. 어떤 tile 을 건너뛰고, 어떤
            축으로 병렬화하고, 어떤 세대의 kernel 을 고르는지가 이 글의 내용입니다.
          </p>
          <p>
            앞 글 <Link to="/ai/flash-attention-io-aware-kernel#tiling">FlashAttention</Link> 은
            N×N 행렬을 HBM 에 쓰지 않는 원리를 다뤘습니다. 이 글은 그 kernel 을 열어 단계별
            비용을 재고, causal mask 로 tile 절반을 버리는 계산, prefill 과 decode 가 서로 다른
            kernel 을 요구하는 이유, FlashAttention-2 와 3 가 각각 무엇을 고쳤는지를 봅니다.
          </p>
          <p>
            마지막 절은 serving engine 이 이 kernel 들을 backend 라는 이름으로 어떻게 고르는지
            다룹니다. vLLM 은 FlashAttention, FlashInfer, Triton 구현을 우선순위 목록에서
            hardware 와 설정에 맞춰 하나 고르고, kernel 안의 tile 크기는 autotuning 으로
            정합니다.
          </p>
          <p>
            아래 그림은 이 글 전체의 지도입니다. Q block 과 K/V block 의 격자에서 어떤 tile 이
            실제로 계산되는지가 prefill, causal, decode 마다 달라지고, 그 차이가 kernel 의 모양을
            정합니다.
          </p>
        </div>
        <AttentionKernelAnatomyAndBackendsViz />
        <ContentBoundary article="attention-kernel-anatomy-and-backends" />
      </section>

      <section id="anatomy" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          두 matmul 사이에 softmax 를 끼워 넣은 것이 fused kernel 입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Fused attention kernel 은 QK matmul, softmax, PV matmul 을 kernel 세 개가 아니라
            하나로 돌리는 구현입니다. 세 단계 사이의 중간 결과인 점수 tile 과 확률 tile 이
            register 와 shared memory 에만 머물고, HBM 에는 최종 출력만 갑니다.
          </p>
          <p>
            QK matmul 은 Q block(B_r×d) 과 K block(B_c×d) 의 곱으로 B_r×B_c 점수 tile 을 만드는
            단계입니다. Tensor core 가 처리하고, tile 하나에 2·B_r·B_c·d FLOP 이 듭니다.
            B_r=B_c=128, d=128 이면 4.2 MFLOP 입니다.
          </p>
          <p>
            Softmax fusion 은 그 점수 tile 에 scale, mask, 지수, 행 합을 register 안에서 바로
            적용하는 일을 부릅니다. 이 단계는 tensor core 가 아니라 일반 연산기와 special
            function unit 이 맡고, tile 당 B_r·B_c 번의 지수 계산이 듭니다. 같은 tile 에서
            16,384 번입니다.
          </p>
          <p>
            PV matmul 은 정규화 전 확률 tile(B_r×B_c) 과 V block(B_c×d) 을 곱해 출력 누적
            Õ(B_r×d) 에 더하는 단계입니다. FLOP 수는 QK 와 같은 2·B_r·B_c·d 이고, 결과는 tile 을
            바꿔도 register 에 남아 있습니다. 세 단계를 합치면 tile 당 matmul 8.4 MFLOP 에
            지수 16,384 번입니다.
          </p>
          <p>
            비율이 중요합니다. 점수 원소 하나당 matmul 은 4d = 512 FLOP 인데 지수는 한 번입니다.
            H100 의 matmul 처리량은 989 TFLOP/s 이고 지수 처리량은 3.9 T/s 이므로, 원소당
            matmul 시간은 0.52 ps 이고 지수 시간은 0.26 ps 입니다. 겹치지 않으면 softmax 가
            전체의 3 분의 1 을 차지합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Tile 하나에서 세 단계의 계산 비용은 어떻게 나뉘나요?"
          idea="두 matmul 은 d 에 비례해 커지지만 softmax 의 지수 횟수는 tile 원소 수에만 비례하므로, head dim 이 커질수록 matmul 이 지배하고 softmax 는 처리량이 낮은 연산기 때문에 시간으로는 무시하지 못합니다."
          formula={String.raw`\mathrm{FLOP}_{\text{tile}} = 2B_rB_cd + B_rB_c + 2B_rB_cd,\qquad t_{\text{tile}} \approx \frac{4B_rB_cd}{R_{\text{mm}}} + \frac{B_rB_c}{R_{\exp}}`}
          annotatedFormula={String.raw`t_{\text{tile}} \approx \underbrace{\frac{2B_rB_cd}{R_{\text{mm}}}}_{\text{QK matmul}} + \underbrace{\frac{B_rB_c}{R_{\exp}}}_{\text{softmax 지수}} + \underbrace{\frac{2B_rB_cd}{R_{\text{mm}}}}_{\text{PV matmul}}`}
          operations={[
            { expression: String.raw`\frac{2B_rB_cd}{R_{\text{mm}}}`, annotation: ["Q block 과 K block 의 곱 B_r·B_c·d 회 곱셈과 덧셈을", "tensor core 처리량 R_mm 으로 나눠 시간으로 바꿈"] },
            { expression: String.raw`\frac{B_rB_c}{R_{\exp}}`, annotation: ["점수 원소마다 한 번의 지수를", "special function unit 처리량 R_exp 로 나눔"] },
            { expression: String.raw`\frac{2B_rB_cd}{R_{\text{mm}}}`, annotation: ["확률 tile 과 V block 의 곱을", "같은 tensor core 처리량으로 시간화해 더함"] },
          ]}
          terms={[
            { symbol: String.raw`B_r, B_c`, name: "Q block 행 수, K/V block 행 수", description: "Tile 의 두 변입니다. FlashAttention-2 는 64 또는 128 을 씁니다." },
            { symbol: "d", name: "Head dim", description: "Q, K, V 의 열 수입니다. 64 에서 256 사이가 흔합니다." },
            { symbol: String.raw`R_{\text{mm}}, R_{\exp}`, name: "matmul 과 지수 처리량", description: "H100 FP16 기준 989 TFLOP/s 와 3.9 T/s 로, FlashAttention-3 논문이 적은 값입니다." },
          ]}
          assumptions={["세 단계가 직렬로 실행된다는 가정이며, 겹치면 max 에 가까워집니다.", "Mask, scale, rowmax 의 비용은 지수 항에 묻힌 것으로 봅니다."]}
          interpretation="d=128 에서 matmul 항이 지수 항의 두 배 정도이므로 softmax 를 겹치지 않으면 tensor core 가 시간의 3 분의 1 을 놉니다. 이것이 FlashAttention-3 가 두 단계를 겹치는 이유입니다."
        />
        <TermBreakdown
          title="Fused attention kernel 안의 세 단계"
          description="같은 tile 안에서 차례로 일어나며, 중간 결과는 HBM 에 가지 않습니다."
          items={[
            { term: "QK matmul", description: "Q block 과 K block 의 곱으로 점수 tile 을 만드는 tensor core 단계입니다.", example: "128×128 tile, d=128 에서 4.2 MFLOP", boundary: "Causal mask 로 전부 가려지는 tile 은 이 단계 자체를 건너뜁니다." },
            { term: "Softmax fusion", description: "점수 tile 에 scale, mask, 지수, 행 합을 register 안에서 적용하는 단계입니다.", example: "같은 tile 에서 지수 16,384 번", boundary: "행 전체 정규화는 online softmax 로 마지막에 한 번만 합니다." },
            { term: "PV matmul", description: "확률 tile 과 V block 을 곱해 출력 누적에 더하는 tensor core 단계입니다.", example: "QK 와 같은 4.2 MFLOP", boundary: "출력 누적은 tile 을 바꿔도 register 에 남아 있습니다." },
          ]}
        />
      </section>

      <section id="causal" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Causal kernel 은 대각선 위 tile 을 읽지도 않아 일이 절반으로 줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Causal attention kernel 은 query 가 자기보다 뒤의 key 를 보지 못하는 mask 를 tile
            단위로 적용하는 kernel 입니다. Query block i 보다 뒤에 있는 K/V block j 는 tile
            전체가 가려지므로 HBM 에서 읽지도, 곱하지도 않습니다. 대각선 위의 tile 을 통째로
            건너뛰어 일이 절반 가까이 줄어듭니다.
          </p>
          <p>
            개수를 세어 보겠습니다. N=4096, B_r=B_c=128 이면 Q block 과 K/V block 이 32 개씩이라
            tile 은 32×32 = 1,024 개입니다. Causal 에서는 j ≤ i 인 tile 만 필요하므로
            32×33/2 = 528 개이고, 496 개(48 %)를 건너뜁니다. FLOP 도 같은 비율로 줍니다.
          </p>
          <p>
            남은 528 개 가운데 mask 계산이 실제로 필요한 tile 은 대각선의 32 개뿐입니다. 나머지
            496 개는 행 index 가 열 index 보다 항상 크므로 원소별 비교 없이 통과합니다.
            FlashAttention-2 는 이 두 구분을 명시적으로 나눠 non-causal 대비 1.7~1.8 배를
            보고했습니다.
          </p>
          <p>
            건너뛴 tile 은 load balancing 문제를 남깁니다. 마지막 Q block 은 tile 32 개를
            계산하고 첫 Q block 은 1 개만 계산하므로, Q block 을 순서대로 SM 에 배정하면 뒤쪽
            SM 이 앞쪽보다 32 배 오래 일합니다. FlashAttention-2 는 무거운 block 부터 먼저
            띄우는 순서로 이 편차를 줄입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Causal tile loop: Q block i 를 맡은 thread block 의 K/V block 순회"
          input={["Q block i (B_r×d), K/V block 수 T_c", "block 크기 B_r, B_c, causal 여부"]}
          steps={[
            { code: "j_end ← causal ? ⌈(i+1)·B_r / B_c⌉ : T_c", note: "Query block 의 마지막 행보다 뒤에서 시작하는 K/V block 은 loop 범위에서 제외합니다." },
            { code: "for j = 1 … j_end:", note: "제외된 block 은 HBM 읽기도 일어나지 않습니다." },
            { code: "  load K_j, V_j;  S ← Q_i K_jᵀ / √d", note: "QK matmul 은 여기서만 일어납니다." },
            { code: "  if causal and block j overlaps the diagonal: S[r, c] ← −∞ where col(c) > row(r)", note: "대각선 tile 에서만 원소별 비교를 합니다. 32 개 중 1 개 꼴입니다." },
            { code: "  online-softmax update; Õ ← rescale(Õ) + P̃ V_j", note: "Softmax fusion 과 PV matmul 은 앞 글의 갱신식 그대로입니다." },
            { code: "O_i ← Õ / ℓ → HBM", note: "Q block 마다 출력 한 번만 씁니다." },
          ]}
          output="O block i. Tile 수는 non-causal T_c 에서 causal ⌈(i+1)B_r/B_c⌉ 로 줄어듭니다."
        />
      </section>

      <section id="regimes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Prefill attention 은 FLOP 이, decode attention 은 byte 가 병목입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Prefill attention 은 prompt 의 N 개 query 가 N 개 key 를 동시에 보는 kernel 이고,
            decode attention 은 새 token 하나의 query 가 KV cache 전체를 읽는 kernel 입니다.
            같은 수식이지만 앞은 FLOP 이 병목이고 뒤는 byte 가 병목이라 kernel 을 따로 짭니다.
          </p>
          <p>
            Attention compute intensity 는 kernel 이 HBM 에서 읽은 byte 당 수행하는 FLOP 수입니다.
            Prefill 에서 N=4096, d=128, FP16 이면 head 당 FLOP 은 4N²d = 8.6 GFLOP 이고 읽고 쓰는
            byte 는 Q, K, V, O 네 행렬 4 MiB 이므로 약 2,000 FLOP/B 입니다.
          </p>
          <p>
            H100 의 ridge point 는 989 TFLOP/s ÷ 3.35 TB/s ≈ 295 FLOP/B 이므로 prefill attention 은
            그보다 일곱 배 위에 있어 tensor core 가 시간을 정합니다.{" "}
            <Link to="/ai/prefill-decode-phase-dynamics#arithmetic-intensity">Prefill 이 compute-bound 인 이유</Link>
            가 attention 안에서도 그대로 성립합니다.
          </p>
          <p>
            Decode 는 query 가 한 행뿐입니다. Context 4096 에서 head 당 K 와 V 를 읽는 byte 는
            2×4096×128×2 B = 2 MiB 이고 FLOP 은 4×4096×128 = 2.1 MFLOP 이라 1 FLOP/B 입니다.
            Ridge point 의 300 분의 1 이라 tensor core 는 거의 놀고 HBM 대역폭이 시간을 정합니다.
            이것이 <Link to="/ai/prefill-decode-phase-dynamics#arithmetic-intensity">decode 의 memory-bound 성질</Link>
            입니다.
          </p>
          <p>
            Attention memory footprint 는 kernel 이 step 마다 실제로 만지는 byte 입니다. Prefill
            은 입력 4 MiB 에 비례하지만 decode 는 context 길이에 비례해 KV cache 전체를 다시
            읽습니다. Batch 32, layer 32, head 8(GQA) 이면 step 마다 32·32·8·2 MiB = 16 GiB 를
            읽어 3.35 TB/s 로 5 ms 가 듭니다.
          </p>
          <p>
            그래서 decode kernel 은 Q 축이 아니라 K/V 축을 나눠 병렬화합니다. Query 한 행을
            K/V block 32 개에 대해 SM 32 개가 나눠 맡고, 각자의 부분 max 와 normalizer 를 마지막에
            합칩니다. Online softmax 의 보정식이 그 병합을 정확하게 만듭니다.
          </p>
        </div>
        <ExplainedFormula
          question="Prefill 과 decode 의 attention compute intensity 는 얼마나 다른가요?"
          idea="분자는 두 matmul 의 FLOP, 분모는 HBM 에서 읽는 byte 입니다. Prefill 은 query 수 N 이 분자에만 곱해져 intensity 가 N 에 비례하고, decode 는 query 가 하나라 상수입니다."
          formula={String.raw`I_{\text{prefill}} = \frac{4N^2d}{4Nd\cdot b} = \frac{N}{b},\qquad I_{\text{decode}} = \frac{4Ld}{2Ld\cdot b} = \frac{2}{b}`}
          annotatedFormula={String.raw`I_{\text{prefill}} = \frac{\underbrace{4N^2d}_{\text{QK 와 PV 의 FLOP}}}{\underbrace{4Nd\cdot b}_{\text{Q, K, V, O 의 byte}}} = \frac{N}{b},\qquad I_{\text{decode}} = \frac{\underbrace{4Ld}_{\text{한 query 의 FLOP}}}{\underbrace{2Ld\cdot b}_{\text{K, V 의 byte}}} = \frac{2}{b}`}
          operations={[
            { expression: String.raw`\frac{4N^2d}{4Nd\cdot b}`, annotation: ["N 개 query 가 N 개 key 를 보는 두 matmul FLOP 을", "네 행렬의 byte 로 나눠 N/b 를 얻음"] },
            { expression: String.raw`\frac{4Ld}{2Ld\cdot b}`, annotation: ["query 한 행이 L 개 key 를 보는 FLOP 을", "K 와 V 의 byte 로 나눠 상수 2/b 를 얻음"] },
          ]}
          terms={[
            { symbol: "N", name: "Prefill 의 prompt 길이", description: "Query 와 key 의 수가 같은 경우입니다." },
            { symbol: "L", name: "Decode 시점의 context 길이", description: "KV cache 에 든 key 의 수입니다." },
            { symbol: "b", name: "원소당 byte", description: "FP16 이면 2, FP8 이면 1 입니다." },
          ]}
          assumptions={["Head 하나 기준이며 GQA 로 query head g 개가 KV head 를 공유하면 decode intensity 는 2g/b 가 됩니다.", "Prefill 에서 causal skip 은 분자를 절반으로 줄이지만 차수는 바꾸지 않습니다."]}
          interpretation="N=4096, b=2 이면 prefill 은 2,048 FLOP/B, decode 는 1 FLOP/B 입니다. 같은 kernel 로 두 regime 을 다 잘 돌릴 수 없어 backend 가 둘로 갈립니다."
        />
        <ProgressiveDetail
          title="GQA 와 batch 는 decode attention 의 intensity 를 얼마나 올리나요?"
          preview="GQA 로 query head 8 개가 KV head 하나를 공유하면 8 FLOP/B, 그래도 ridge 의 40 분의 1 입니다. Batch 는 request 마다 KV 가 달라 attention 의 intensity 를 올리지 못합니다."
        >
          <p>
            Weight 를 읽는 linear layer 는 batch 를 키우면 한 번 읽은 weight 를 여러 token 이
            나눠 써 intensity 가 batch 에 비례해 오릅니다. Attention 은 request 마다 KV cache 가
            다르므로 batch 를 키워도 byte 가 같이 늘어 intensity 가 그대로입니다.
          </p>
          <p>
            GQA 는 같은 KV block 을 여러 query head 가 읽으므로 decode kernel 이 query head g 개를
            한 tile 의 행으로 묶으면 K 읽기 한 번에 g 배의 FLOP 을 얻습니다. FlashInfer 와
            FlashDecoding 계열 kernel 이 이 묶음으로 decode 에서도 tensor core 를 씁니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="generations" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          FlashAttention-2 는 warp 분할을, 3 는 단계 겹치기를 고쳤습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            FlashAttention 세 세대는 같은 online softmax 위에서 GPU 자원을 다르게 배치한
            kernel 입니다. 2 는 thread block 안의 warp 가 일을 나누는 방식과 sequence 축
            병렬화를 고쳐 A100 에서 약 2 배, 3 는 Hopper 의 비동기 unit 으로 matmul 과 softmax 를
            겹쳐 H100 에서 1.5~2 배를 얻었습니다. 두 수치 모두 각 논문의 자기보고입니다.
          </p>
          <p>
            첫 세대의 warp 분할은 split-K 였습니다. Thread block 의 warp 4 개가 K block 을 네
            조각으로 나눠 각자 Q(128×d) 와 K 조각(32×d) 을 곱하면 128×32 부분 점수가 나오는데,
            softmax 는 행 전체가 필요하므로 네 warp 가 부분 결과를 shared memory 에 쓰고 동기화한
            뒤 다시 읽어 합쳐야 했습니다.
          </p>
          <p>
            그 왕복을 세어 보면 tile 당 FP32 부분 점수 4×(128×32×4 B) = 64 KiB 를 쓰고 다시
            읽습니다. FlashAttention-2 는 대신 Q 를 네 warp 에 32 행씩 나눕니다. 각 warp 가 자기
            행의 점수 전체를 갖게 되어 softmax 가 warp 안에서 끝나고, V 는 모든 warp 가 읽기만
            하므로 warp 사이 교환이 0 byte 가 됩니다.
          </p>
          <p>
            2 세대의 두 번째 변경은 병렬화 축입니다. 첫 세대는 batch×head 마다 thread block
            하나를 띄워 sequence 가 길고 batch 가 작으면 SM 108 개 가운데 일부만 일했습니다.
            2 세대는 Q block 마다 thread block 을 띄워 batch 1, head 8 에서도 32×8 = 256 개
            block 으로 SM 을 채웁니다.
          </p>
          <p>
            3 세대는 Hopper 의 TMA 와 비동기 WGMMA 를 씁니다. Warp specialization 으로
            producer warpgroup 은 K/V tile 을 TMA 로 불러오기만 하고, consumer warpgroup 둘은
            matmul 과 softmax 를 맡습니다.
          </p>
          <p>
            Pingpong scheduling 은 한 warpgroup 의 softmax 가 도는 동안 다른 warpgroup 의
            matmul 을 돌리는 배치입니다. 앞 절에서 계산한 3 분의 1 의 공백을 이 겹치기가
            메웁니다.
          </p>
          <p>
            3 세대의 FP8 은 block 단위 scale 과 Q, K 에 무작위 직교 행렬을 곱하는 incoherent
            processing 으로 outlier 를 퍼뜨립니다. 논문은 FP16 에서 740 TFLOP/s(75 % 활용),
            FP8 에서 1.2 PFLOP/s 근처와 기본 FP8 대비 2.6 배 낮은 오차를 H100 에서 보고했습니다.
          </p>
        </div>
        <div id="paper-flashattention-2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Dao · FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning"
            citeKey={1}
            href="https://arxiv.org/abs/2307.08691"
          >
            2023 년 논문은 non-matmul FLOP 축소, sequence 축 thread block 병렬화, Q 를 warp 에
            나누는 work partitioning 세 가지로 첫 세대 대비 약 2 배와 A100 이론 FLOP/s 의
            50~73 % 를 보고했습니다. Causal 1.7~1.8 배와 GPT 학습 72 % MFU 도 저자 측정입니다.
          </CitationBlock>
        </div>
        <div id="paper-flashattention-3" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Shah, Bikshandi, Zhang, Thakkar, Ramani, Dao · FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision"
            citeKey={2}
            href="https://arxiv.org/abs/2407.08608"
          >
            2024 년 논문은 Hopper 전용으로 producer–consumer warp specialization, pingpong
            scheduling 과 warpgroup 안 2 단 pipelining, FP8 block quantization 을 제시하고
            H100 에서 FP16 1.5~2 배와 75 % 활용, FP8 1.2 PFLOP/s 근처를 보고했습니다. A100 이하
            세대에는 적용되지 않습니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="세대별 변경이 어떤 자원의 병목을 풀었는지 한 줄씩"
          preview="1 세대는 HBM 왕복, 2 세대는 shared memory 왕복과 SM 점유율, 3 세대는 tensor core 와 special function unit 의 직렬 대기를 풀었습니다."
        >
          <p>
            같은 GPU 안에서도 병목은 층층이 있습니다. HBM 왕복을 없앤 뒤에는 shared memory
            왕복이 보이고, 그것을 없앤 뒤에는 연산기 사이의 대기가 보입니다. 각 세대는 바로
            아래 층의 병목을 겨눴고, 그래서 이전 세대의 수학을 바꾸지 않습니다.
          </p>
          <p>
            2 세대의 FLOP 축소는 앞 글의 지연 정규화와 logsumexp 저장입니다. 3 세대의 warpgroup
            안 2 단 pipelining 은 다음 tile 의 QK matmul 을 현재 tile 의 softmax 와 겹치려고
            register buffer 를 하나 더 두는 방식이라 register 압박이 커져 tile 크기를 제한합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="backends" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Backend 는 kernel 구현을, autotuning 은 tile 크기를 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Attention backend 는 serving engine 이 attention 을 어느 kernel 구현으로 돌릴지
            가리키는 선택지의 이름입니다. vLLM 은 FlashAttention, FlashInfer, Triton,
            FlexAttention 같은 backend 를 우선순위 목록에 두고, 지정이 없으면 GPU 세대, dtype,
            head dim, KV cache 형식에 맞는 첫 번째를 고릅니다.
          </p>
          <p>
            명시 선택은 `--attention-backend FLASH_ATTN` 같은 인자로 합니다. MLA 처럼 prefill 과
            decode 가 다른 kernel 을 요구하는 model 은 prefill backend 와 decode backend 를 따로
            받습니다. 이 구분이 앞 절의 두 regime 이 engine 설정에 드러난 모양입니다.
          </p>
          <p>
            FlashInfer 는 serving 을 겨냥한 attention engine 입니다. KV cache 를 block-sparse row
            형식 하나로 표현해 paged KV, radix tree, 공유 prefix 를 같은 kernel 이 읽고, attention
            변형(RoPE 융합, logit soft-cap, mask)을 JIT 로 kernel 에 끼워 넣습니다.
          </p>
          <p>
            논문은 Triton 기반 backend 대비 inter-token latency 29~69 % 감소를 H100 과 A100
            에서 보고했습니다. 저자 측정이며 FlashAttention 계열과의 직접 비교는 아닙니다.
          </p>
          <p>
            FlashInfer 의 plan–run 구조가 decode 의 load balancing 을 맡습니다. Plan 단계가 긴
            KV 를 chunk 로 나눠 SM 에 greedy 로 배분하고, run 단계는 그 계획대로 kernel 을 돌린
            뒤 부분 결과를 정해진 순서로 합칩니다. 계획이 고정 workspace 에 담기므로 CUDA graph
            안에서도 재생됩니다.
          </p>
          <p>
            Attention kernel autotuning 은 backend 가 정해진 뒤 그 kernel 의 tile 크기, warp 수,
            pipeline 단 수를 실측으로 고르는 절차입니다.
          </p>
          <p>
            FlashAttention-2 는 B_r 과 B_c 를 64 또는 128 가운데 head dim 과 causal 여부별로
            미리 정해 둡니다. Triton 구현은 @triton.autotune 이 config 목록을 처음 보는 shape
            마다 벤치마크해 가장 빠른 것을 기억합니다.
          </p>
          <p>
            비용을 세어 보면 config 가 B_r 2 종, B_c 2 종, warp 수 2 종, stage 수 2 종이면 16
            개이고, 각 config 를 컴파일해 몇 번 돌리는 데 수 초가 듭니다. Shape key 가 (head dim,
            causal, sequence bucket) 이면 key 마다 한 번씩만 치르고 이후 호출은 표에서 꺼내
            씁니다. 첫 요청의 지연이 그 비용입니다.
          </p>
        </div>
        <div id="paper-flashinfer" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Ye, Chen, Lai, Lin, Zhang, Wang, Chen, Kasikci, Grover, Krishnamurthy, Ceze · FlashInfer: Efficient and Customizable Attention Engine for LLM Inference Serving"
            citeKey={3}
            href="https://arxiv.org/abs/2501.01005"
          >
            MLSys 2025 논문은 block-sparse KV 형식, JIT attention template, CUDA graph 와 호환되는
            load-balanced plan–run scheduler 를 제시하고 Triton 기반 backend 대비 ITL 29~69 %,
            긴 context 28~30 %, 병렬 생성 13~17 % 개선을 보고했습니다. vLLM, SGLang, MLC 에
            통합된 구현이며 수치는 저자 측정입니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="Backend 선택에서 결정되는 것과 autotuning 에서 결정되는 것"
          description="층위가 다릅니다. Backend 는 코드 경로를, autotuning 은 그 코드의 launch 상수를 고릅니다."
          items={[
            { term: "Attention backend", description: "Attention 을 돌릴 kernel 구현의 이름으로, engine 이 우선순위 목록에서 hardware 와 설정에 맞는 첫 번째를 고릅니다.", example: "FLASH_ATTN, FLASHINFER, TRITON_ATTN", boundary: "지원하지 않는 head dim 이나 dtype 이면 목록의 다음 backend 로 넘어갑니다." },
            { term: "FlashInfer", description: "Block-sparse KV 형식과 JIT template 으로 여러 KV 배치와 attention 변형을 한 kernel 계열로 다루는 attention engine 입니다.", example: "Paged KV 와 radix tree 를 같은 BSR 로 표현", boundary: "Plan 단계가 필요해 batch 구성이 바뀔 때마다 계획을 다시 세웁니다." },
            { term: "Attention kernel autotuning", description: "정해진 kernel 의 tile 크기, warp 수, stage 수를 shape key 마다 실측해 고르는 절차입니다.", example: "16 config × key 당 1 회 벤치마크", boundary: "첫 호출 지연을 만들고, 측정 GPU 와 다른 GPU 에서는 다시 돌려야 합니다." },
          ]}
        />
        <ProgressiveDetail
          title="어느 backend 를 언제 고르나요?"
          preview="Hopper 이상에서 FlashAttention-3 가 지원하는 dtype 과 head dim 이면 그것이 기본이고, 공유 prefix 가 많거나 attention 변형이 있으면 FlashInfer, 새 GPU 나 실험적 mask 는 Triton 과 FlexAttention 이 대안입니다."
        >
          <p>
            판단 기준은 세 가지입니다. 첫째, GPU 세대와 dtype 이 kernel 의 전제와 맞는지.
            FlashAttention-3 는 Hopper 전용이고 FP8 은 block scale 이 있어야 정확도가 유지됩니다.
            둘째, KV cache 배치가 kernel 이 읽는 형식과 맞는지. 공유 prefix 나 radix tree 는
            block-sparse 형식을 읽는 FlashInfer 가 유리합니다.
          </p>
          <p>
            셋째, 같은 workload 에서 실측했는지입니다. 논문의 배율은 저자의 GPU 와 shape 에서
            잰 값이라 자기 model 의 head dim, context 분포, batch 에서 두 backend 를 바꿔 가며
            ITL 을 재야 선택이 닫힙니다. vLLM 의 backend 인자는 그 비교를 위해 있습니다.
          </p>
          <p>
            다음 글은 이 kernel 위에서 decode step 을 줄이는 다른 축인{" "}
            <Link to="/ai/speculative-decoding-variants">speculative decoding 변형</Link> 을
            다룹니다. Kernel 이 byte 당 시간을 줄인다면, speculation 은 step 당 확정 token 수를
            늘립니다.
          </p>
        </ProgressiveDetail>
      </section>
    </div>
  );
}
