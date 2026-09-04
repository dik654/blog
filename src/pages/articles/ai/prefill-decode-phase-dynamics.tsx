import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import PrefillDecodePhaseDynamicsViz from "./prefill-decode-phase-dynamics/viz/PrefillDecodePhaseDynamicsViz";

/**
 * Prefill 은 compute-bound, decode 는 memory-bound: 간섭과 chunk 크기
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 수치 예는 모두 "7B dense · FP16 · H100 급(989 TFLOP/s dense, 3.35 TB/s)" 가정이며
 * 특정 장비의 실측이 아니라 roofline 하한 계산이다.
 */
export default function PrefillDecodePhaseDynamicsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 weight 를 읽어도 prefill 은 연산기가, decode 는 memory 가 먼저 막힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Prefill 은 prompt 의 모든 token 을 한 번에 밀어 넣으니 한 번 읽은 weight 로 수천 token 분의 곱셈을 합니다. decode 는 token 하나를
            만들기 위해 같은 weight 전체를 다시 읽습니다. 연산량 대비 memory 읽기 비율이 수천 배 차이 나므로 두 phase 는 같은 GPU 에서 서로 다른 자원에 먼저
            부딪힙니다.
          </p>
          <p>
            이 차이는 <Link to="/ai/vllm-serving#prefill-decode">prefill 과 decode 를 나누는 이유</Link>를
            hardware 쪽에서 다시 설명합니다. 문제는 continuous batching 이 두 phase 를 한
            step 에 섞는다는 점입니다. Compute 를 다 쓰는 prefill 이 들어오면 memory 만 기다리던
            decode 가 그 시간만큼 늦어지고, 사용자는 token 이 끊기는 것으로 느낍니다.
          </p>
          <p>
            이 글은 arithmetic intensity 로 두 phase 의 위치를 계산하고, 섞인 batch 의 step
            시간이 어떻게 결정되는지, 그리고 decode 지연 상한에서 거꾸로 prefill chunk 크기를
            정하는 절차를 다룹니다. Step 조립 규칙 자체는{" "}
            <Link to="/ai/continuous-batching-step-anatomy">scheduling step 해부</Link>가, TTFT 와
            TPOT 지표의 정의는 <Link to="/ai/serving-latency-metrics-and-slo">latency 지표 글</Link>이
            맡습니다.
          </p>
        </div>
        <PrefillDecodePhaseDynamicsViz />
        <ContentBoundary article="prefill-decode-phase-dynamics" />
      </section>

      <section id="arithmetic-intensity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Intensity 가 ridge point 의 어느 쪽인지가 phase 의 병목을 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Arithmetic intensity 는 한 kernel 이 memory 에서 읽고 쓴 byte 당 수행한 FLOP 수입니다.
            GPU 의 peak FLOP/s 를 memory bandwidth 로 나눈 값이 ridge point 이고, intensity 가
            그보다 낮으면 bandwidth 가, 높으면 연산기가 시간을 정합니다. 이것이{" "}
            <Link to="/gpu/cuda-perf-analysis#throughput-ledger">roofline model</Link>의 전부입니다.
          </p>
          <p>
            수치를 넣어 보겠습니다. H100 급 GPU 를 dense FP16 989 TFLOP/s, HBM 3.35 TB/s 로
            가정하면 ridge point 는 약 295 FLOP/byte 입니다. 7B dense model 은 FP16 weight 가
            14 GB 이고 token 하나를 linear layer 에 통과시키는 데 parameter 당 2 FLOP, 곧 14 GFLOP
            이 듭니다.
          </p>
          <p>
            Batch 1 decode 는 step 마다 14 GB 를 읽고 14 GFLOP 을 계산하니 intensity 가 약 1 FLOP/byte 입니다. Ridge 의 300 분의
            1 이므로 시간은 14 GB ÷ 3.35 TB/s ≈ 4.2 ms 라는 bandwidth 하한이 정합니다. 연산 시간 0.014 ms 는 그 안에 숨습니다. 이것이 decode
            의 memory-bound 성질입니다.
          </p>
          <p>
            같은 model 에 4,096-token prompt 를 prefill 하면 weight 는 여전히 한 번만 읽는데 연산은
            4,096 배가 되어 intensity 가 약 4,000 FLOP/byte 로 뜁니다. Ridge 를 훌쩍 넘으니 시간은
            57 TFLOP ÷ 989 TFLOP/s ≈ 58 ms 라는 연산 하한이 정합니다. 이것이 prefill 의
            compute-bound 성질입니다.
          </p>
          <p>
            Decode 를 batch 로 묶으면 weight 는 한 번 읽고 B 개 token 을 계산하니 linear layer 의
            intensity 는 B 까지 오릅니다. 하지만 attention 은 request 마다 자기 KV cache 를 따로
            읽어야 해서 batch 를 키워도 intensity 가 1 근처에 머뭅니다. GQA 로 query head g 개가
            KV 를 공유하면 g 배가 될 뿐입니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 phase 가 bandwidth 와 연산기 중 어느 쪽에 먼저 막히는지 어떻게 계산하나요?"
          idea="한 step 의 FLOP 을 그 step 이 움직인 byte 로 나눈 intensity 를 hardware 의 ridge point 와 비교합니다. Decode 는 weight 를 token 하나마다 다시 읽어 intensity 가 1 근처이고, prefill 은 같은 weight 로 n 개 token 을 계산해 n 근처입니다."
          formula={String.raw`I=\frac{\text{FLOPs}}{\text{Bytes}},\qquad I^{\ast}=\frac{F_{\text{peak}}}{BW},\qquad I_{\text{decode}}\approx\frac{2P\cdot B}{W+B\cdot L\cdot k},\quad I_{\text{prefill}}\approx\frac{2P\cdot n}{W}`}
          annotatedFormula={String.raw`\underbrace{I^{\ast}=\frac{F_{\text{peak}}}{BW}}_{\text{ridge point}},\qquad \underbrace{I_{\text{decode}}\approx\frac{2P\cdot B}{W+B\cdot L\cdot k}}_{\text{weight 와 KV 를 다시 읽는 decode}},\qquad \underbrace{I_{\text{prefill}}\approx\frac{2P\cdot n}{W}}_{\text{weight 한 번에 n token 을 계산하는 prefill}}`}
          operations={[
            { expression: String.raw`\frac{F_{\text{peak}}}{BW}`, annotation: ["Peak FLOP/s 를 bandwidth 로 나눠", "두 roof 가 만나는 intensity 를 구함"] },
            { expression: String.raw`\frac{2P\cdot B}{W+B\cdot L\cdot k}`, annotation: ["Batch B 의 linear FLOP 을 weight 와 KV byte 로 나눠", "batch 가 커져도 KV 항이 intensity 를 누름"] },
            { expression: String.raw`\frac{2P\cdot n}{W}`, annotation: ["Prompt n token 의 FLOP 을 한 번 읽은 weight 로 나눠", "n 에 비례해 ridge 를 넘음"] },
          ]}
          terms={[
            { symbol: "P", name: "Parameter 수", description: "Dense model 의 parameter 수입니다. Token 하나의 linear 연산은 약 2P FLOP 입니다." },
            { symbol: "W", name: "Weight byte", description: "한 forward 가 읽어야 하는 weight 크기로 7B FP16 이면 14 GB 입니다." },
            { symbol: "k", name: "Token 당 KV byte", description: "Layer 수 × 2 × KV head 차원 × dtype byte 로 7B MHA FP16 이면 0.5 MB 입니다." },
            { symbol: "B, L, n", name: "Batch·context·prompt 길이", description: "Decode batch 크기, 각 request 의 현재 context 길이, prefill 할 prompt token 수입니다." },
          ]}
          assumptions={["Activation 과 workspace 읽기는 weight 와 KV 에 비해 작다고 보고 생략했습니다.", "F_peak 는 dense FP16 값이며 sparsity·FP8 수치를 쓰면 ridge point 가 달라집니다.", "Attention 의 FLOP 은 prefill 에서는 n² 항으로 따로 더하며, 긴 context 절에서 다룹니다."]}
          interpretation="Intensity 는 kernel 이 어느 roof 에 먼저 닿는지를 말할 뿐 실제 도달 성능을 말하지 않습니다. 실측은 언제나 roof 아래에 있고, 그 간격이 kernel 최적화의 몫입니다."
        />
      </section>

      <section id="interference" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          섞인 batch 에서는 decode 가 prefill chunk 의 연산 시간을 떠안습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            한 step 의 시간은 그 step 이 움직인 byte 를 bandwidth 로 나눈 memory 항과 FLOP 을 연산 성능으로 나눈 compute 항 중 큰 쪽이
            하한입니다. Decode 만 있는 step 은 memory 항이 큽니다. prefill chunk 를 얹으면 compute 항만 자랍니다. 두 항이 교차하기 전까지는 chunk
            가 공짜처럼 보이고 넘어서면 step 시간이 chunk 크기에 비례해 늘어납니다.
          </p>
          <p>
            예를 들어 64 개 decode request 가 각각 1,024 token 의 context 를 갖고 있으면 KV 읽기는 64 × 1,024 × 0.5 MB ≈ 33.5 GB
            입니다. Weight 14 GB 를 더한 47.5 GB 를 3.35 TB/s 로 나누면 memory 항은 14.2 ms 입니다. compute 항은 0.9 TFLOP ÷ 989
            TFLOP/s ≈ 0.9 ms 에 불과합니다.
          </p>
          <p>
            여기에 512-token prefill chunk 를 얹으면 compute 항이 7.2 TFLOP 만큼 늘어 8.2 ms 가 되지만 아직 memory 항 14.2 ms 아래라
            roofline 하한은 그대로입니다. Chunk 를 2,048 로 키우면 compute 항이 30 ms 로 memory 항을 넘어섭니다. 64 개 decode 모두의 다음
            token 이 14 ms 가 아니라 30 ms 뒤에 나옵니다.
          </p>
          <p>
            이것이 prefill-decode interference 의 mechanism 입니다. Decode request 는 자기 일이
            늘어난 게 아닌데 같은 step 에 탄 prefill 의 연산이 끝날 때까지 기다립니다. Step 시간이
            곧 그 step 에 있던 모든 request 의 token 간격이므로 한 개의 긴 prompt 가 batch 전체의
            TPOT 를 밀어 올립니다.
          </p>
          <p>
            Roofline 의 최댓값 모델은 하한입니다. 실제 kernel 은 memory 읽기와 연산을 완전히 겹치지 못하므로 측정값은 max 와 두 항의 합 사이에 놓입니다.
            Sarathi-Serve 는 chunk 가 ridge 아래여도 decode 의 token 간격이 눈에 띄게 늘어나는 것을 관찰했습니다. 그래서 chunk 크기는 하한 계산보다
            보수적으로 잡습니다.
          </p>
          <p>
            Decode priority 는 이 구조에서 나옵니다. Decode 는 bandwidth 로 정해지는 step 의
            바닥 시간을 채우는 일이고, prefill 은 그 바닥 위에 남은 연산 여유를 채우는 일입니다.
            vLLM V1 scheduler 가 대기 중인 decode 를 모두 먼저 넣고 남은 token budget 에만 prefill 을
            채우는 이유가 여기에 있습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Decode B 개와 prefill chunk c token 을 한 step 에 섞으면 step 시간은 어떻게 되나요?"
          idea="Memory 항은 weight 와 모든 decode 의 KV 읽기가 정하고, compute 항은 decode 와 chunk 의 linear FLOP 에 chunk 의 attention FLOP 을 더한 값이 정합니다. Roofline 은 그중 큰 쪽을 하한으로 줍니다."
          formula={String.raw`T_{\text{step}}\;\ge\;\max\!\left(\frac{W+B\cdot L\cdot k}{BW},\;\frac{2P\,(B+c)+A(c,\ell)}{F_{\text{eff}}}\right)`}
          annotatedFormula={String.raw`T_{\text{step}}\ge\max\!\Bigl(\underbrace{\frac{W+B\cdot L\cdot k}{BW}}_{\text{decode 가 정하는 memory 항}},\;\underbrace{\frac{2P\,(B+c)+A(c,\ell)}{F_{\text{eff}}}}_{\text{chunk 가 키우는 compute 항}}\Bigr)`}
          operations={[
            { expression: String.raw`\frac{W+B\cdot L\cdot k}{BW}`, annotation: ["Weight 와 B 개 request 의 KV byte 를 bandwidth 로 나눠", "decode 만 있을 때의 step 바닥 시간"] },
            { expression: String.raw`2P\,(B+c)`, annotation: ["Decode token B 개와 chunk token c 개의 linear FLOP 을 합쳐", "chunk 가 커질수록 선형으로 증가"] },
            { expression: String.raw`A(c,\ell)`, annotation: ["Chunk c 가 이미 처리된 prefix ℓ 에 attention 하는 FLOP 을 더해", "긴 prompt 뒤쪽 chunk 일수록 증가"] },
            { expression: String.raw`\max(\cdot,\cdot)`, annotation: ["두 항 중 큰 쪽을 골라", "겹침이 완전할 때의 하한 결정"] },
          ]}
          terms={[
            { symbol: "c", name: "Prefill chunk token 수", description: "이번 step 에 함께 넣는 prompt token 수입니다." },
            { symbol: String.raw`A(c,\ell)`, name: "Chunk attention FLOP", description: "약 4·c·ℓ·d·N 으로, chunk 가 prefix ℓ 의 KV 를 읽고 곱하는 양입니다." },
            { symbol: String.raw`F_{\text{eff}}`, name: "실효 연산 성능", description: "Peak 가 아니라 해당 kernel 이 실제로 내는 FLOP/s 로, 측정해서 넣습니다." },
            { symbol: "BW", name: "Memory bandwidth", description: "HBM 의 실효 bandwidth 입니다." },
          ]}
          assumptions={["Memory 읽기와 연산이 완전히 겹친다는 이상적 가정이라 실측은 max 와 합 사이에 놓입니다.", "Chunk 의 KV 쓰기와 activation 은 decode 의 KV 읽기에 비해 작다고 보고 memory 항에서 생략했습니다.", "Kernel launch 와 scheduler overhead 는 포함하지 않았습니다."]}
          interpretation="Compute 항이 memory 항을 넘는 chunk 크기가 그 batch 의 임계점입니다. 그 아래에서는 chunk 가 decode 의 남는 연산기를 쓰고, 그 위에서는 모든 decode 가 chunk 의 연산 시간을 기다립니다."
        />
      </section>

      <section id="chunk-size" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Chunk 크기는 decode 지연 상한에서 거꾸로 계산하고 TTFT 로 검산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Chunk 크기는 decode 의 token 간격 상한을 지키기 위해 고릅니다. throughput 을 위해 고르는 값이 아닙니다. 허용할 step 시간에서 decode 만의
            바닥 시간을 빼면 prefill 에 쓸 수 있는 연산 시간이 나옵니다. 그 시간을 token 하나의 연산 시간으로 나누면 chunk 의 token 수가 나옵니다.
          </p>
          <p>
            앞의 예로 계산하면 이렇습니다. TPOT 목표가 25 ms 이고 decode 64 개의 바닥이 14.2 ms 이면 남는 시간은 10.8 ms 입니다. 실효 성능을 peak 의
            60% 인 600 TFLOP/s 로 잡으면 그 시간에 6.5 TFLOP 을 계산할 수 있고 token 당 14 GFLOP 으로 나누면 약 460 token 이라 block
            배수인 448 로 내립니다.
          </p>
          <p>
            이 값은 TTFT 를 늘립니다. 4,096-token prompt 는 한 번에 prefill 하면 약 100 ms 안팎이지만 448 씩 나누면 10 step 이 필요하고 각
            step 이 25 ms 근처이므로 첫 token 까지 250 ms 가까이 걸립니다. TTFT 목표가 그보다 빡빡하면 chunk 를 키우고 TPOT 를 내주거나 decode
            batch 를 줄여 바닥 시간을 낮춰야 합니다.
          </p>
          <p>
            너무 작은 chunk 에도 비용이 있습니다. Chunk 마다 weight 14 GB 를 다시 읽고 prefix 의 KV 를
            다시 읽으므로 chunk 수에 비례한 고정 비용이 붙습니다. vLLM 문서가 큰 GPU 의 작은 model 에는
            8,192 이상을, ITL 이 중요하면 2,048 정도를 권하는 것은 이 두 방향의 절충입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Decode SLO 에서 prefill chunk 크기를 정하는 절차"
          input={["TPOT 목표 T_slo (예: 25 ms)", "TTFT 목표 T_ttft (예: 300 ms)", "최대 decode batch B_max 와 대표 context 길이 L", "측정한 BW_eff, F_eff, weight byte W, token 당 KV byte k", "대표 prompt 길이 n"]}
          steps={[
            { code: "T_dec ← (W + B_max·L·k) / BW_eff", note: "Decode 만 있을 때의 step 바닥 시간입니다. Chunk 가 없어도 이 시간은 걸립니다." },
            { code: "if T_dec > T_slo: B_max 를 줄이거나 KV 를 줄이고 1 로", note: "Prefill 을 넣기 전에 decode 만으로 SLO 를 넘으면 chunk 로 해결할 수 없습니다." },
            { code: "budget ← T_slo − T_dec", note: "Prefill 연산에 내줄 수 있는 시간입니다." },
            { code: "c ← floor(budget · F_eff / (2P + a(ℓ)))", note: "Token 당 linear 2P FLOP 에 prefix ℓ 에 대한 attention 몫 a(ℓ) 을 더해 나눕니다. 긴 prompt 는 뒤쪽 chunk 에서 a(ℓ) 이 커지므로 대표 ℓ 을 n/2 로 잡습니다." },
            { code: "c ← round_down(c, block_size)", note: "KV block 경계에 맞춰 내립니다." },
            { code: "T_first ← ceil(n / c) · T_slo", note: "Prompt 를 chunk 수만큼의 step 으로 처리할 때 첫 token 까지의 시간입니다." },
            { code: "if T_first > T_ttft: c 를 키우고 T_slo 를 다시 협상하거나 B_max 를 줄임", note: "TPOT 와 TTFT 는 같은 step 시간을 나눠 갖습니다. 둘 다 만족할 수 없으면 batch 를 줄여 바닥을 낮춥니다." },
            { code: "max_num_batched_tokens ← B_max + c", note: "Decode 는 token 하나씩 budget 을 쓰므로 decode 몫을 더한 값이 scheduler 의 token budget 입니다." },
          ]}
          repeatUntil="측정한 p50 TPOT 와 TTFT 가 목표 안에 들 때까지 B_max 와 c 를 조정합니다."
          output="Prefill chunk 크기 c 와 scheduler 의 token budget"
        />
      </section>

      <section id="long-context" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          64K 를 넘는 prompt 에서는 attention 의 n² 항이 prefill 시간을 지배합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefill 의 연산은 linear layer 의 n 에 비례하는 항과 attention 의 n² 에 비례하는 항의 합입니다. 짧은 prompt 에서는 linear 항이
            크지만 두 항이 같아지는 길이를 넘으면 prompt 길이를 두 배로 늘릴 때 시간이 세 배 가까이 늘어납니다. 7B 급에서 그 교차점은 5만 token 근처입니다.
          </p>
          <p>
            계산해 보면 causal mask 로 절반을 건너뛴 attention FLOP 은 약 2n²dN 이고, linear FLOP 은 2Pn 입니다. 둘이 같아지는 n 은
            P/(dN) 이고 7B 에서 d = 4,096, N = 32 를 넣으면 약 53K 입니다. 64K prompt 에서는 attention 이 이미 linear 보다 크고 128K
            에서는 2.4 배, 256K 에서는 4.8 배입니다.
          </p>
          <p>
            시간으로 옮기면 64K prefill 은 linear 917 TFLOP 과 attention 약 1,100 TFLOP 을 합쳐 989 TFLOP/s 기준 2 초, 실효 60%
            면 3.4 초입니다. 128K 는 6.3 PFLOP 으로 peak 기준 6.4 초가 됩니다. 이것이 long-context prefill 이 길이에 비해 더 나빠지는
            이유입니다. kernel 이 느려서가 아니라 일이 n² 으로 늘어서입니다.
          </p>
          <p>
            Chunking 은 이 시간을 줄이지 못하고 나눌 뿐입니다. 오히려 chunk 마다 prefix 의 KV 를
            다시 읽으므로 KV 재읽기 byte 가 k·n² ÷ (2c) 로 늘어납니다. 64K prompt 를 2,048 씩 나누면
            재읽기가 약 520 GB 로 0.16 초, 512 씩 나누면 2 TB 를 넘어 0.6 초가 넘습니다. 긴
            prompt 일수록 chunk 를 작게 잡는 비용이 커집니다.
          </p>
          <p>
            Memory 도 같이 봐야 합니다. MHA 7B 는 token 당 0.5 MB 이므로 64K context 한 request 가
            32 GB 의 KV 를 차지하고, GQA 8 group 이면 4 GB 로 줄어듭니다. 이 예산은{" "}
            <Link to="/ai/model-vram-budgeting#kv-state">VRAM budgeting 글</Link>이 다루며, 여기서는
            긴 context 가 prefill 의 연산과 decode 의 bandwidth 를 동시에 키운다는 점만 기억하면
            됩니다.
          </p>
        </div>
        <ExplainedFormula
          question="Prompt 길이 n 에 따라 prefill 시간이 어떻게 자라나요?"
          idea="Linear layer 는 token 마다 같은 일을 하니 n 에 비례하고, attention 은 각 token 이 앞선 모든 token 을 보니 n² 에 비례합니다. 두 항이 같아지는 길이가 prefill 이 quadratic regime 으로 넘어가는 문턱입니다."
          formula={String.raw`T_{\text{prefill}}(n)\approx\frac{2P\,n+2\,n^{2}\,d\,N}{F_{\text{eff}}},\qquad n^{\ast}=\frac{P}{d\,N}`}
          annotatedFormula={String.raw`T_{\text{prefill}}(n)\approx\frac{\overbrace{2P\,n}^{\text{linear 항 (n 에 비례)}}+\overbrace{2\,n^{2}\,d\,N}^{\text{causal attention 항 (n² 에 비례)}}}{F_{\text{eff}}},\qquad \underbrace{n^{\ast}=\frac{P}{d\,N}}_{\text{두 항이 같아지는 길이}}`}
          operations={[
            { expression: String.raw`2P\,n`, annotation: ["Token 마다 2P FLOP 의 linear 연산을 n 번 더해", "길이에 비례하는 몫"] },
            { expression: String.raw`2\,n^{2}\,d\,N`, annotation: ["QKᵀ 와 PV 두 곱셈을 layer N 개에서 causal 절반만 세어", "길이 제곱에 비례하는 몫"] },
            { expression: String.raw`\frac{P}{d\,N}`, annotation: ["두 항을 같다고 놓고 n 으로 풀어", "quadratic regime 의 문턱을 구함"] },
          ]}
          terms={[
            { symbol: "d", name: "Model 차원", description: "Hidden size 로 7B 급이면 4,096 입니다." },
            { symbol: "N", name: "Layer 수", description: "Attention layer 수로 7B 급이면 32 입니다." },
            { symbol: String.raw`n^{\ast}`, name: "교차 길이", description: "Linear 항과 attention 항이 같아지는 prompt 길이로 7B 에서 약 53K token 입니다." },
          ]}
          assumptions={["FlashAttention 처럼 causal 로 가려진 block 을 건너뛰는 kernel 을 가정해 4·n²·d·N 의 절반만 세었습니다.", "MoE 는 활성 parameter 로 P 를 바꿔 넣어야 하고, sliding-window 나 linear attention 층은 n² 항에서 빠집니다.", "F_eff 는 linear 와 attention kernel 이 다를 수 있어 하나의 값으로 근사했습니다."]}
          interpretation="n 이 n* 보다 짧으면 prefill 은 linear 항의 세계라 chunk 나눔이 자유롭고, n* 를 넘으면 attention 항의 세계라 kernel 과 attention 구조가 시간을 정합니다."
        />
      </section>

      <section id="prefill-optimization" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Prefill 최적화는 네 층에서 서로 다른 항을 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefill 을 빠르게 하는 방법은 한 가지가 아니고 각 층이 다른 항을 줄입니다. Kernel 층은 attention 의 n² 항이 memory 를 오가는 횟수를 줄입니다.
            chunking 층은 시간을 나눠 decode 와 공존하게 합니다. scheduling 층은 어느 request 의 chunk 를 먼저 넣을지 정합니다. 분리 배치는 간섭
            자체를 다른 GPU 로 보냅니다.
          </p>
          <p>
            어느 층을 먼저 만질지는 병목이 어디인지에 달려 있습니다. Prompt 가 짧고 decode batch 가 큰 workload 에서는 chunk 크기와 decode
            priority 가 TPOT 를 정합니다. 64K 를 넘는 prompt 가 흔한 workload 에서는 attention kernel 과 attention 구조가 TTFT 를
            정합니다. 두 지표를 동시에 빡빡하게 요구하면 한 GPU 안의 절충으로는 부족해 분리 배치로 넘어갑니다.
          </p>
        </div>
        <TermBreakdown
          title="Prefill 최적화의 네 층과 각 층이 줄이는 항"
          description="같은 이름의 최적화라도 어느 항을 줄이는지가 다르므로 병목을 먼저 재고 층을 고릅니다."
          items={[
            { term: "Kernel 층", description: "FlashAttention 계열은 attention 행렬을 HBM 에 쓰지 않아 n² 항의 memory traffic 을 줄이고 causal block 을 건너뜁니다.", example: "64K prefill 에서 attention 항 1,100 TFLOP 을 연산기 가까이에서 처리합니다.", boundary: "FLOP 자체는 줄지 않으므로 n² 성장은 그대로이며, 자세한 mechanism 은 FlashAttention 글이 맡습니다." },
            { term: "Chunking 층", description: "Prompt 를 c token 씩 나눠 decode 와 같은 step 에 넣어 token 간격 상한을 지킵니다.", example: "4,096 prompt 를 448 씩 10 step 으로 나누면 TPOT 25 ms 를 지키고 TTFT 는 250 ms 가 됩니다.", boundary: "총 연산은 줄지 않고 chunk 수만큼 weight 와 prefix KV 재읽기가 늘어납니다." },
            { term: "Scheduling 층", description: "Decode 를 먼저 채우고 남은 token budget 에 prefill 을 넣으며, 긴 prompt 가 짧은 prompt 를 굶기지 않게 순서를 정합니다.", example: "vLLM V1 은 대기 중 decode 를 모두 넣은 뒤 남는 budget 만큼 prefill 을 자동으로 chunk 합니다.", boundary: "Step 조립 규칙과 starvation 은 scheduler 글이 소유합니다." },
            { term: "분리 배치 층", description: "Prefill 과 decode 를 다른 GPU 에 두어 간섭을 없애고 각 phase 의 parallelism 을 따로 고릅니다.", example: "DistServe 는 자기 실험에서 같은 SLO 로 7.4 배 많은 request 를 처리했다고 보고했습니다.", boundary: "KV 를 GPU 사이로 옮기는 비용과 두 pool 의 비율 조정이 새 문제가 되며, 이 글의 범위 밖입니다." },
          ]}
        />
        <ProgressiveDetail
          title="특정 model 이 64K 에서 prefill 이 몇 배 느려졌다는 수치를 어떻게 읽어야 하나요?"
          preview="그 수치는 그 model 의 d·N·attention 구조와 그 장비의 F_eff 에서만 성립하므로 다른 model 에 옮기지 말고 n* 와 F_eff 를 다시 계산합니다."
        >
          <p>
            같은 64K 라도 GQA group 수, sliding-window 나 linear attention 층의 비율, MoE 의 활성
            parameter 수가 다르면 n* 가 수 배씩 달라집니다. 예를 들어 attention 층의 4 분의 1 만
            full attention 이면 n² 항이 4 분의 1 이 되어 교차점이 200K 근처로 밀립니다.
          </p>
          <p>
            그래서 이 글은 특정 model 의 체감치를 사실로 적지 않고 조건식으로만 말합니다. 어떤 model 의 long-context prefill 이 느리다는 보고를 읽으면 순서는
            이렇습니다. 그 model 의 P, d, N, attention 구조를 식에 넣어 n* 를 구하고 측정 장비의 F_eff 로 T_prefill 을 다시 계산해 보고와 맞는지
            확인합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 roofline 원 논문과 두 serving 논문, vLLM 공식 문서입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글의 수치는 모두 roofline 하한 계산이고 특정 장비의 실측이 아닙니다. Sarathi-Serve 와
            DistServe 의 배수는 저자 자기보고이며 각자의 model 과 hardware, workload 에서만 성립합니다.
            vLLM 문서의 권장값은 공식 문서이지만 model 크기와 GPU 에 따라 다시 재라는 전제가 붙어
            있습니다.
          </p>
        </div>
        <div id="paper-roofline" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Williams, Waterman, Patterson · Roofline: An Insightful Visual Performance Model for Multicore Architectures (CACM 2009)"
            citeKey={1}
            href="https://doi.org/10.1145/1498765.1498785"
          >
            Operational intensity 를 가로축, 도달 가능한 FLOP/s 를 세로축에 두고 bandwidth roof 와
            compute roof 가 만나는 ridge point 로 kernel 의 병목을 판단하는 model 을 제안했습니다.
            원 논문은 multicore CPU 를 대상으로 했고 GPU 와 LLM 은 같은 논리의 적용입니다.
          </CitationBlock>
        </div>
        <div id="paper-sarathi-serve" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Agrawal et al. · Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve (OSDI 2024)"
            citeKey={2}
            href="https://arxiv.org/abs/2403.02310"
          >
            Prefill 은 연산기를 채우고 decode 는 채우지 못한다는 관찰에서 출발해, prompt 를 비슷한
            크기의 chunk 로 나누고 진행 중인 decode 를 멈추지 않는 stall-free scheduling 을 제안했습니다.
            Mistral-7B 2.6 배, Falcon-180B 5.6 배의 capacity 향상은 저자 실험 범위입니다.
          </CitationBlock>
        </div>
        <div id="paper-distserve" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhong et al. · DistServe: Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving (OSDI 2024)"
            citeKey={3}
            href="https://arxiv.org/abs/2401.09670"
          >
            같은 GPU 에 두 phase 를 두면 강한 간섭이 생기고 두 phase 의 자원 배분이 묶인다는 점을
            정량화한 뒤 phase 를 다른 GPU 로 분리했습니다. 7.4 배 request, 12.6 배 빡빡한 SLO 는
            저자 자기보고이며, 이 글은 간섭의 정량화만 가져오고 분리 서빙 자체는 다루지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-vllm-chunked-prefill" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM · Optimization and Tuning: Chunked Prefill"
            citeKey={4}
            href="https://docs.vllm.ai/en/latest/configuration/optimization.html"
            type="code"
          >
            V1 에서 chunked prefill 이 기본으로 켜지며 scheduler 가 decode 를 먼저 채우고 남은
            token budget 에 prefill 을 자동 chunk 한다는 점, 작은 budget 은 ITL 을 큰 budget 은 TTFT 를
            개선한다는 절충을 공식 문서로 적고 있습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/ai/serving-latency-metrics-and-slo">TTFT·TPOT·ITL 과 SLO</Link>
        </p>
      </section>
    </div>
  );
}
