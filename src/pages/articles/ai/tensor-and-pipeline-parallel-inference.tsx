import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TensorAndPipelineParallelInferenceViz from "./tensor-and-pipeline-parallel-inference/viz/TensorAndPipelineParallelInferenceViz";

/**
 * Tensor·pipeline·data·context parallel 은 서로 다른 축을 나눠 서로 다른 통신을 만듭니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "네 parallel 축이 각각 무엇을 나누고 layer 마다 어떤 collective 를 몇 byte 보내는가"만 소유한다.
 * 어느 축을 어떤 hardware 에 놓을지 고르는 절차는 parallelism-strategy-and-placement 가,
 * collective 의 rank 계약과 NCCL 측정은 gpu-collective-network 가 소유한다.
 */
export default function TensorAndPipelineParallelInferenceArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="axes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          네 parallel 축은 나누는 차원이 달라 통신의 종류와 횟수도 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Distributed inference 는 model 하나를 여러 GPU 에 나누거나 복제해 forward 를 돌리는
            일입니다. 나눌 수 있는 차원은 넷입니다. weight 행렬의 안쪽 차원을 나누는 tensor
            parallel(TP), layer 를 구간으로 나누는 pipeline parallel(PP), model 을 통째로 복제하는
            data parallel(DP), token 열을 나누는 sequence·context parallel 입니다.
          </p>
          <p>
            어느 차원을 나누느냐가 GPU 사이에 오가는 통신을 정합니다. TP 는 layer 마다 부분합을
            합치는 all-reduce 를 두 번 보내고, PP 는 stage 경계에서 activation 을 한 번 넘기며, DP
            는 요청을 나눠 받을 뿐 forward 중에는 아무것도 보내지 않습니다. context parallel 은
            attention 안에서 key·value 블록을 이웃 GPU 로 돌립니다.
          </p>
          <p>
            이 글은 그 통신을 byte 와 μs 로 셉니다. hidden 8192 인 layer 하나를 TP 8 로 나누면
            token 2048 개의 prefill 에서 all-reduce 한 번이 GPU 당 약 59 MB 를 옮기고, PP 4 에
            microbatch 8 개를 흘리면 시간의 27% 가 bubble 로 빕니다. 이런 숫자가 다음 글의 배치
            판단 입력이 됩니다.
          </p>
          <p>
            GPU 수가 세 축의 곱 DP × TP × PP 라는 layout 규칙은{" "}
            <Link to="/ai/vllm-serving#parallel-layout">vLLM 입문의 DP·TP·PP layout</Link> 절이
            이미 다뤘습니다. 여기서는 그 각 축이 layer 안에서 정확히 무엇을 자르고 무엇을
            보내는지로 내려갑니다.
          </p>
        </div>
        <TensorAndPipelineParallelInferenceViz />
        <ContentBoundary article="tensor-and-pipeline-parallel-inference" />
      </section>

      <section id="tensor-parallel" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          TP 는 열로 자른 뒤 행으로 잘라 layer 당 all-reduce 두 번으로 끝냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Tensor parallelism 은 한 layer 의 weight 행렬을 GPU 여러 장이 조각으로 나눠 갖고 같은
            입력에 대해 각자 자기 조각의 곱만 계산하는 방식입니다. 나누는 GPU 수가 TP degree 이고,
            degree 가 8 이면 각 GPU 의 weight 와 그 weight 를 읽는 시간이 8 분의 1 이 됩니다.
          </p>
          <p>
            자르는 축은 두 가지입니다. 행렬 A 를 열 방향으로 A = [A₁, A₂] 로 나누면 각 GPU 가 XA₁,
            XA₂ 를 독립적으로 계산하고 결과도 열 조각으로 남는데 이것이 column parallelism 입니다.
            행 방향으로 B = [B₁; B₂] 로 나누면 입력도 열 조각으로 들어와야 하고 출력은 Y₁B₁ + Y₂B₂
            의 부분합이 되어 합쳐야 하는데 이것이 row parallelism 입니다.
          </p>
          <p>
            Megatron-LM 은 MLP 의 첫 GEMM 을 column, 둘째 GEMM 을 row 로 자릅니다. 이유는 그 사이의
            GeLU 때문입니다. 첫 GEMM 을 row 로 자르면 GeLU(X₁A₁ + X₂A₂) 를 계산하기 전에 부분합을
            합쳐야 하지만, column 으로 자르면 GeLU(XA₁) 과 GeLU(XA₂) 를 따로 적용해도 결과가
            같습니다. 그 열 조각이 둘째 GEMM 의 row 입력으로 그대로 들어갑니다.
          </p>
          <p>
            Attention 도 같은 꼴입니다. Q·K·V projection 은 head 단위로 column 을 나눠 각 GPU 가 자기
            head 의 attention 을 완전히 로컬로 계산하고, 그 뒤의 output projection 을 row 로 잘라
            부분합을 만듭니다. 그래서 transformer layer 하나의 forward 에는 attention 끝과 MLP 끝,
            딱 두 곳에서만 all-reduce 가 필요합니다.
          </p>
          <p>
            All-reduce 가 옮기는 byte 는 그 지점의 activation 크기입니다. token 수 T, hidden h, FP16
            이면 T × h × 2 byte 이고, 아래 식은 ring 방식으로 그 byte 를 합칠 때 GPU 하나가 실제로
            내보내는 양과 시간을 셉니다. TP degree 를 올릴수록 각 GPU 의 계산은 줄지만 이 두 번의
            all-reduce 는 layer 마다 그대로 남는 것이 TP communication overhead 입니다.
          </p>
        </div>
        <ExplainedFormula
          question="TP 로 자른 layer 하나가 all-reduce 에 몇 byte 와 몇 μs 를 쓰나요?"
          idea="합쳐야 할 activation 은 token 수 × hidden × dtype byte 입니다. ring all-reduce 는 그 byte 를 reduce-scatter 와 all-gather 두 단계로 옮기므로 GPU 하나가 내보내는 양은 원본의 2(p−1)/p 배이고, 그것을 link 대역폭으로 나누면 한 번의 시간이 됩니다. layer 마다 두 번이므로 2 를 곱합니다."
          formula={String.raw`T_{\text{TP,layer}} = 2\left(\alpha + \frac{2(p-1)}{p}\cdot\frac{T\,h\,b}{B}\right)`}
          annotatedFormula={String.raw`\underbrace{T_{\text{TP,layer}}}_{\text{layer 당 통신 시간}} = \underbrace{2}_{\text{attention·MLP 두 번}}\left(\underbrace{\alpha}_{\text{collective 고정 latency}} + \underbrace{\frac{2(p-1)}{p}}_{\text{ring 전송 배수}}\cdot\underbrace{\frac{T\,h\,b}{B}}_{\text{activation byte ÷ 대역폭}}\right)`}
          operations={[
            { expression: String.raw`T\,h\,b`, annotation: ["token 수에 hidden 과 dtype byte 를 곱해", "all-reduce 가 합칠 activation 의 byte 확정"] },
            { expression: String.raw`\frac{2(p-1)}{p}`, annotation: ["reduce-scatter 와 all-gather 각각 (p−1)/p 를 더해", "GPU 하나가 ring 에서 실제로 내보내는 배수"] },
            { expression: String.raw`\alpha + \frac{2(p-1)}{p}\cdot\frac{T\,h\,b}{B}`, annotation: ["고정 latency 에 byte 를 대역폭으로 나눈 시간을 더해", "all-reduce 한 번의 시간"] },
            { expression: String.raw`2(\cdots)`, annotation: ["attention 뒤와 MLP 뒤 두 번을 합쳐", "layer 하나의 TP 통신 시간"] },
          ]}
          terms={[
            { symbol: "T", name: "Token 수", description: "이 forward 에 들어간 token 수입니다. prefill 이면 prompt 길이 합, decode 면 batch 의 sequence 수입니다." },
            { symbol: "h", name: "Hidden 크기", description: "layer 출력의 hidden 차원입니다. 예시는 8192 입니다." },
            { symbol: "b", name: "Dtype byte", description: "activation 원소 하나의 byte 입니다. FP16·BF16 이면 2 입니다." },
            { symbol: "p", name: "TP degree", description: "all-reduce 에 참여하는 GPU 수입니다." },
            { symbol: "B", name: "GPU 당 link 대역폭", description: "GPU 하나가 ring 이웃으로 보낼 수 있는 초당 byte 입니다." },
            { symbol: String.raw`\alpha`, name: "Collective latency", description: "byte 가 0 에 가까워도 남는 synchronization·launch 고정 비용입니다." },
          ]}
          assumptions={["ring 알고리즘 기준이며 tree 나 NVLS 같은 다른 알고리즘은 배수가 다릅니다.", "GPU 당 대역폭 B 를 송신 한 방향에 모두 쓴다고 단순화했습니다. 실제 ring 은 송수신을 동시에 하므로 방향당 절반으로 계산하면 두 배 남짓입니다.", "α 는 hardware 와 NCCL version 에 따라 수 μs 에서 수십 μs 까지 달라지는 현장 값이며 이 글은 계산 예시에 5 μs 를 씁니다."]}
          interpretation="h=8192, T=2048, b=2 이면 activation 은 33.6 MB 이고 p=8 에서 GPU 당 58.7 MB 를 내보냅니다. B=900 GB/s 면 65 μs, 두 번이면 layer 당 약 130 μs 이고 80 layer 면 prefill 한 번에 약 10 ms 입니다. decode 에서 T=64 면 byte 는 1 MB 로 줄어 1 μs 남짓이지만 α 5 μs 가 남아 layer 당 12 μs, 80 layer 면 token 마다 약 1 ms 가 TPOT 에 더해집니다."
        />
        <div id="paper-megatron" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Shoeybi et al. · Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism (arXiv 1909.08053, 2019)"
            citeKey={1}
            href="https://arxiv.org/abs/1909.08053"
          >
            MLP 의 첫 GEMM 을 column, 둘째 GEMM 을 row 로 나눠 GeLU 앞의 synchronization 을 없애고,
            attention 은 head 단위 column 과 output projection 의 row 로 나눠 transformer layer 하나에
            forward all-reduce 두 번, backward 두 번만 남긴다고 적습니다. 512 V100 에서 8.3B model 의
            74% weak scaling 은 저자 자기보고이며 training 수치이므로 이 글은 분해 방식만 인용하고 그
            효율을 inference 에 옮겨 적지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="collectives" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          All-reduce 는 두 collective 의 합이고 비용은 α + n/B 로 셉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Communication collective 는 communicator 안의 모든 rank 가 같은 크기의 buffer 를 들고
            동시에 참여하는 통신 연산입니다. point-to-point send 와 달리 결과가 어느 rank 에 어떻게
            놓이는지가 연산 이름에 정해져 있습니다. rank 와 count 계약 자체는{" "}
            <Link to="/gpu/gpu-collective-network#collective-rank-semantics">collective rank semantics</Link>{" "}
            글이 소유하고, 여기서는 parallel 추론이 쓰는 세 가지만 봅니다.
          </p>
          <p>
            All-reduce 는 rank 마다 N 개 값을 내고 모든 rank 가 원소별 합 N 개를 똑같이 받습니다.
            Reduce-scatter 는 같은 합을 계산하되 결과를 rank 수만큼 등분해 각 rank 가 자기 index 의
            조각만 받습니다. All-gather 는 rank 마다 N 개 조각을 모아 k × N 크기의 전체를 모든 rank
            에 돌려줍니다.
          </p>
          <p>
            NCCL 문서는 reduce-scatter 뒤에 all-gather 를 실행하면 all-reduce 와 같다고 적습니다. 이
            등식이 중요한 이유는 둘로 쪼개면 그 사이에 계산을 끼울 수 있기 때문입니다. sequence
            parallel 절에서 보듯 all-reduce 하나를 reduce-scatter 와 all-gather 로 바꾸면 추가
            통신 없이 그 사이의 LayerNorm 을 sequence 축으로 나눌 수 있습니다.
          </p>
          <p>
            비용은 두 항으로 셉니다. byte 가 0 이어도 남는 collective communication latency α 와,
            byte n 을 communication bandwidth B 로 나눈 전송 시간입니다. 작은 message 는 α 가, 큰
            message 는 n/B 가 지배하고, 그 경계는 n = αB 입니다. B 가 900 GB/s 이고 α 가 5 μs 면
            경계는 4.5 MB 이므로 decode 의 1 MB all-reduce 는 latency 영역에 있습니다.
          </p>
          <p>
            같은 collective 라도 알고리즘에 따라 실제 옮기는 byte 가 다릅니다. ring 은 GPU 당
            2(p−1)/p × n 을 보내 대역폭 효율이 좋지만 p 단계를 거쳐 latency 가 p 에 비례하고, tree 는
            log p 단계라 작은 message 에 유리합니다. NCCL 이 어느 것을 골랐는지와 측정 대역폭의
            정의는 <Link to="/gpu/gpu-collective-network#nccl-bandwidth-boundary">algbw · busbw</Link>{" "}
            글이 다룹니다.
          </p>
        </div>
        <ExplainedFormula
          question="Collective 한 번의 시간은 message 크기에 따라 어떻게 변하나요?"
          idea="어떤 collective 든 시작하고 끝을 맞추는 고정 비용이 있고, 그 위에 옮겨야 할 byte 를 대역폭으로 나눈 시간이 붙습니다. 두 항이 같아지는 크기 αB 를 기준으로 그보다 작으면 latency 가, 크면 bandwidth 가 병목입니다."
          formula={String.raw`T_{\text{coll}}(n) = \alpha + \frac{c_{\text{alg}}\,n}{B}`}
          annotatedFormula={String.raw`\underbrace{T_{\text{coll}}(n)}_{\text{collective 한 번의 시간}} = \underbrace{\alpha}_{\text{크기와 무관한 고정 latency}} + \underbrace{\frac{c_{\text{alg}}\,n}{B}}_{\text{알고리즘 배수 × byte ÷ 대역폭}}`}
          operations={[
            { expression: String.raw`c_{\text{alg}}\,n`, annotation: ["입력 byte 에 알고리즘 배수를 곱해", "GPU 하나가 실제로 내보내는 byte"] },
            { expression: String.raw`\frac{c_{\text{alg}}\,n}{B}`, annotation: ["그 byte 를 대역폭으로 나눠", "전송에 걸리는 시간"] },
            { expression: String.raw`\alpha + \frac{c_{\text{alg}}\,n}{B}`, annotation: ["고정 latency 를 더해", "collective 한 번의 완료 시간"] },
          ]}
          terms={[
            { symbol: "n", name: "입력 byte", description: "rank 하나가 collective 에 넣는 buffer 의 byte 입니다." },
            { symbol: String.raw`c_{\text{alg}}`, name: "알고리즘 배수", description: "ring all-reduce 는 2(p−1)/p, ring reduce-scatter 와 all-gather 는 각각 (p−1)/p 입니다." },
            { symbol: "B", name: "Communication bandwidth", description: "rank 하나가 쓸 수 있는 link 의 초당 byte 입니다. NVLink 와 InfiniBand 가 한 자리 수 이상 다릅니다." },
            { symbol: String.raw`\alpha`, name: "Collective communication latency", description: "kernel launch, rank 간 synchronization, 첫 packet 왕복이 만드는 고정 시간입니다." },
          ]}
          assumptions={["link 가 다른 traffic 과 공유되지 않는다고 가정합니다.", "α 와 B 는 같은 hardware 라도 topology·NCCL 설정에 따라 달라지는 측정값이지 사양표 값이 아닙니다."]}
          interpretation="n = αB 가 두 영역의 경계입니다. 900 GB/s · 5 μs 면 4.5 MB 이고, 50 GB/s · 15 μs 인 inter-node link 면 0.75 MB 입니다. prefill 의 33 MB all-reduce 는 어느 link 에서든 bandwidth 영역이고, decode 의 1 MB 는 NVLink 에서는 latency 영역, InfiniBand 에서는 두 항이 비슷한 영역입니다."
        />
        <div id="paper-nccl" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="NVIDIA · NCCL User Guide: Collective Operations"
            citeKey={2}
            href="https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html"
            type="code"
          >
            AllReduce 는 각 rank 가 N 개 값을 내고 원소별 합 N 개를 똑같이 받는 연산, ReduceScatter 는
            그 합을 rank index 순으로 등분해 나눠 받는 연산, AllGather 는 k 개 rank 의 N 개 조각을
            k × N 으로 모아 모두에 돌려주는 연산이라고 정의하고, ReduceScatter 뒤 AllGather 가
            AllReduce 와 같다고 적습니다. 이 글의 α + n/B 모델과 ring 배수는 그 문서가 아니라 일반
            성능 모델이며 NCCL 이 실제로 고르는 알고리즘을 보장하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="pipeline-parallel" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          PP 는 통신이 가장 적지만 bubble 과 decode latency 를 대가로 냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pipeline parallelism 은 layer 열을 연속 구간으로 잘라 GPU 마다 한 구간을 맡기는
            방식입니다. 그 구간이 분산 추론의 pipeline stage 이고, GPU 실행 pipeline 의 stage 와는
            이름만 같은 다른 개념입니다. 80 layer 를 PP 4 로 나누면 stage 마다 20 layer 이고, GPU 당
            weight 는 4 분의 1 입니다.
          </p>
          <p>
            통신은 stage 경계에서 activation 을 다음 GPU 로 넘기는 point-to-point send 한 번뿐입니다.
            token 2048 개, hidden 8192, FP16 이면 33.6 MB 이고, TP 처럼 layer 마다가 아니라 stage
            경계마다이므로 80 layer 에 세 번입니다. 이것이 PP 가 느린 link 를 건너는 데 쓰이는
            이유입니다.
          </p>
          <p>
            대가는 순서 의존입니다. stage 1 은 stage 0 이 끝나야 시작하므로 batch 하나만 흘리면 한
            시점에 GPU 하나만 일합니다. 그래서 batch 를 m 개의 microbatch 로 잘라 stage 0 이 두 번째
            microbatch 를 처리하는 동안 stage 1 이 첫 번째를 처리하게 합니다. 이것이 microbatching
            이고, GPipe 가 이 schedule 을 처음 정리했습니다.
          </p>
          <p>
            그래도 pipeline 이 차기 전과 비워질 때의 빈 시간은 남습니다. 이것이 pipeline bubble 이고,
            stage p 개와 microbatch m 개에서 전체 시간의 (p−1)/(m+p−1) 을 차지합니다. PP 4 에
            microbatch 8 이면 3/11 로 27% 이고, 32 로 늘리면 3/35 로 8.6% 입니다. GPipe 는 m ≥ 4p 면
            무시할 만하다고 적습니다.
          </p>
          <p>
            Decode 에서는 microbatch 로도 숨길 수 없는 비용이 있습니다. 한 sequence 의 다음 token 은
            네 stage 를 차례로 다 지나야 나오므로 그 token 의 latency 는 stage 시간의 합에 hop 세 번이
            더해진 값입니다. 같은 8 GPU 를 TP 8 로 쓰면 각 GPU 가 weight 의 8 분의 1 만 읽어 step 이
            8 분의 1 로 줄지만, PP 8 은 8 분의 1 짜리 step 여덟 개를 직렬로 지납니다.
          </p>
          <p>
            숫자로 보면 70B FP16 을 PP 8 로 두면 stage 마다 17.5 GB 를 읽어 3.35 TB/s 에서 5.2 ms
            이고, 한 token 은 여덟 stage 를 지나 약 42 ms 가 됩니다. TP 8 은 5.2 ms 에 all-reduce 약
            1 ms 를 더한 6 ms 남짓입니다. 이것이 PP latency penalty 이며, PP 는 동시 요청이 많아
            microbatch 가 채워질 때 throughput 을 지키는 도구이지 한 요청을 빠르게 하는 도구가
            아닙니다.
          </p>
        </div>
        <ExplainedFormula
          question="PP 에서 GPU 가 노는 bubble 은 전체 시간의 몇 퍼센트인가요?"
          idea="microbatch m 개가 stage p 개를 지나는 데 걸리는 slot 수는 m + p − 1 입니다. 그중 실제로 모든 stage 가 바쁜 slot 은 m 개이고 나머지 p − 1 개가 pipeline 을 채우고 비우는 동안의 빈 slot 입니다. 두 수의 비가 bubble 비율입니다."
          formula={String.raw`f_{\text{bubble}} = \frac{p-1}{m+p-1}`}
          annotatedFormula={String.raw`\underbrace{f_{\text{bubble}}}_{\text{빈 시간 비율}} = \frac{\underbrace{p-1}_{\text{채우고 비우는 slot}}}{\underbrace{m+p-1}_{\text{microbatch 가 다 지나는 slot}}}`}
          operations={[
            { expression: String.raw`p-1`, annotation: ["stage 수에서 1 을 빼", "첫 microbatch 가 마지막 stage 에 닿기까지의 빈 slot 수"] },
            { expression: String.raw`m+p-1`, annotation: ["microbatch 수에 그 빈 slot 을 더해", "batch 전체가 pipeline 을 빠져나가는 총 slot 수"] },
            { expression: String.raw`\frac{p-1}{m+p-1}`, annotation: ["빈 slot 을 총 slot 으로 나눠", "GPU 가 노는 시간의 비율"] },
          ]}
          terms={[
            { symbol: "p", name: "Stage 수", description: "pipeline parallel degree 이며 layer 열을 나눈 구간 수입니다." },
            { symbol: "m", name: "Microbatch 수", description: "한 batch 를 잘라 pipeline 에 연속으로 흘리는 조각 수입니다." },
            { symbol: String.raw`f_{\text{bubble}}`, name: "Bubble 비율", description: "전체 slot 중 어느 stage 가 비어 있는 slot 의 비율입니다. 바쁜 시간 대비로 재면 (p−1)/m 입니다." },
          ]}
          assumptions={["모든 stage 의 처리 시간이 같다고 가정합니다. 한 stage 가 느리면 그 stage 가 pipeline 전체의 박자를 정해 bubble 이 더 커집니다.", "microbatch 사이의 activation 전송 시간은 계산에 포함하지 않았습니다."]}
          interpretation="p=4, m=8 이면 3/11 = 27%, m=32 면 8.6% 입니다. microbatch 를 늘리면 bubble 은 줄지만 microbatch 하나의 token 수가 줄어 GEMM 효율이 떨어지므로 무한히 늘릴 수 없고, decode 처럼 microbatch 가 요청 수로 제한되는 경우 bubble 을 지울 방법이 없습니다."
        />
        <div id="paper-gpipe" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Huang et al. · GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism (arXiv 1811.06965, 2018)"
            citeKey={3}
            href="https://arxiv.org/abs/1811.06965"
          >
            mini-batch 를 M 개 micro-batch 로 나눠 K 개 accelerator 에 pipeline 으로 흘리는 schedule
            을 정의하고, partition 이 만드는 idle 시간을 bubble 이라 부르며 그 크기를 O((K−1)/(M+K−1))
            로 적고 M ≥ 4K 면 무시할 만하다고 보고합니다. NVLink 없는 P100 에서도 activation 만 넘기므로
            통신 병목이 없었다는 관찰도 있습니다. training 논문이므로 backward 와 re-materialization
            부분은 이 글이 인용하지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="data-parallel" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          DP 는 forward 중 통신이 없어 throughput 이 replica 수에 비례합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Data parallelism 은 model 전체를 GPU 묶음마다 복제하고 들어오는 요청을 replica 사이에
            나누는 방식입니다. training 의 DP 는 step 마다 gradient all-reduce 를 하지만, inference 는
            weight 가 바뀌지 않으므로 replica 끼리 forward 중에 주고받을 것이 없습니다.
          </p>
          <p>
            그래서 DP throughput scaling 은 거의 선형입니다. replica 하나가 초당 1000 token 을 내면
            replica 4 개는 4000 token 에 가깝고, 각 요청의 latency 는 replica 하나일 때와 같습니다.
            replica 하나가 감당하는 동시 요청 수를 셈하는 방법은{" "}
            <Link to="/ai/llm-serving-capacity#capacity">serving capacity</Link> 글에 있습니다.
          </p>
          <p>
            비용은 memory 입니다. replica 마다 weight 전체를 다시 올리므로 70B FP16 을 DP 2 로 두면
            weight 만 280 GB 이고, replica 마다 KV pool 도 따로 잡습니다. weight 가 한 GPU 묶음에
            들어가지 않으면 DP 는 아예 선택지가 아니며, 그때 TP 나 PP 가 먼저 옵니다.
          </p>
          <p>
            선형에서 벗어나는 지점은 두 곳입니다. 요청을 나누는 router 가 한쪽 replica 에 긴 요청을
            몰아 주면 그 replica 의 queue 만 길어지고, prefix cache 가 replica 마다 따로 있어 같은
            prompt 가 다른 replica 로 가면 cache 가 빗나갑니다. 둘 다 통신이 아니라 routing 문제입니다.
          </p>
          <p>
            예외는 MoE 입니다. expert 를 GPU 에 나눠 두면 attention 은 DP 로 돌리고 expert 층에서만
            all-to-all 을 보내는 배치가 흔한데, 이때는 DP rank 끼리 step 을 맞춰야 하므로 통신이 다시
            생깁니다. 그 비용은{" "}
            <Link to="/ai/mixture-of-experts#system-cost">MoE 의 expert-parallel dispatch cost</Link>{" "}
            글이 소유합니다.
          </p>
        </div>
      </section>

      <section id="sequence-context-parallel" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Context parallel 은 token 축을 나눠 attention 의 KV 통신을 숨깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TP 가 나누지 못하는 부분이 있습니다. LayerNorm 과 dropout, residual add 는 hidden 축으로
            나눌 수 없어 모든 TP rank 가 같은 계산을 중복하고 같은 activation 을 통째로 들고 있습니다.
            Sequence parallelism 은 그 구간을 token 축으로 나눠 rank 마다 sequence 의 1/p 만 들게
            하는 방식입니다.
          </p>
          <p>
            추가 통신은 없습니다. TP 구간이 끝나는 all-reduce 를 reduce-scatter 로 바꾸면 각 rank 는
            자기 token 조각의 완성된 합만 받고, 다음 TP 구간이 시작하기 전에 all-gather 로 다시 전체
            sequence 를 모읍니다. 앞 절의 등식대로 reduce-scatter 와 all-gather 를 합치면 all-reduce
            와 byte 가 같으므로 memory 만 줄고 통신은 그대로입니다.
          </p>
          <p>
            Context parallelism 은 한 걸음 더 나가 attention 자체를 token 축으로 나눕니다. sequence
            를 GPU 수만큼의 block 으로 잘라 각 GPU 가 자기 query block 을 들고, key·value block 은
            ring 을 따라 이웃 GPU 로 한 칸씩 돌립니다. GPU 는 지금 손에 있는 KV block 으로 부분
            attention 을 계산하면서 동시에 그 block 을 다음 GPU 로 보냅니다.
          </p>
          <p>
            이것이 context-parallel attention 이며 Ring Attention 이 그 대표 구현입니다. 부분 결과를
            합칠 수 있는 이유는 softmax 의 running max 와 분모를 block 마다 갱신하는 online softmax
            덕분이고, 그 원리는{" "}
            <Link to="/ai/flash-attention-io-aware-kernel#online-softmax">FlashAttention 의 online softmax</Link>{" "}
            절이 소유합니다.
          </p>
          <p>
            통신이 숨겨지는 조건은 block 하나의 계산 시간이 그 block 의 KV 전송 시간보다 길다는
            것입니다. block 크기 c, hidden d 에서 계산은 4dc² FLOP, 전송은 4cd byte 이므로 조건은
            c ≥ F/B 입니다. Ring Attention 논문의 A100 예시로 NVLink 300 GB/s 면 block 은 약 1000
            token 이면 되고, InfiniBand 12.5 GB/s 면 약 25000 token 이 필요합니다.
          </p>
          <p>
            추론에서 이 축이 필요한 곳은 긴 prompt 의 prefill 입니다. 100 만 token 의 KV 는 GPU 한
            장에 들어가지 않고, prefill 계산은 sequence 길이의 제곱이라 token 축으로 나누면 계산도
            같이 나뉩니다. decode 에서는 query 가 token 하나라 block 계산이 짧아 c ≥ F/B 를 만족하지
            못하므로, KV 를 나눠 둔 채 부분 attention 결과만 모으는 쪽이 보통입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Ring Attention 의 context-parallel prefill (host N_h 개)"
          input={["입력 sequence x 와 GPU 수 N_h", "GPU 마다 hidden d, 처리 능력 F FLOP/s, 이웃 link 대역폭 B byte/s", "block 크기 c = len(x) / N_h, 조건 c ≥ F/B 확인"]}
          steps={[
            { code: "x 를 N_h 개 block 으로 잘라 GPU i 가 block i 를 받음", note: "각 GPU 는 자기 block 의 token 만 들고 있으며 전체 sequence 를 어디에도 모으지 않습니다." },
            { code: "GPU i: Q_i, K_i, V_i ← projection(block i)", note: "projection 은 token 별 연산이므로 통신 없이 로컬에서 끝납니다." },
            { code: "for layer in layers:", note: "layer 마다 ring 을 한 바퀴 돕니다." },
            { code: "  for step in 0 .. N_h−1 (모든 GPU 동시에):", note: "step 마다 손에 있는 KV block 이 하나씩 바뀝니다." },
            { code: "    O_i, m_i, l_i ← blockwise_attention(Q_i, K_cur, V_cur, O_i, m_i, l_i)", note: "online softmax 로 running max m_i 와 분모 l_i 를 갱신하며 부분 결과를 누적합니다." },
            { code: "    동시에 send(K_cur, V_cur → GPU i+1); recv(K_cur, V_cur ← GPU i−1)", note: "계산과 전송을 겹치므로 c ≥ F/B 면 전송이 계산 뒤에 숨습니다." },
            { code: "  H_i ← O_i / l_i; H_i ← feedforward(H_i)", note: "attention 출력을 정규화하고 MLP 는 token 별이라 로컬로 처리합니다." },
          ]}
          output="GPU i 마다 자기 block 의 layer 출력과 KV cache. 전체 sequence 를 한 GPU 에 모으지 않고도 각 token 이 모든 token 을 참조한 결과"
        />
        <div id="paper-ring-attention" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Liu, Zaharia, Abbeel · Ring Attention with Blockwise Transformers for Near-Infinite Context (arXiv 2310.01889, 2023)"
            citeKey={4}
            href="https://arxiv.org/abs/2310.01889"
          >
            host 를 ring 으로 묶어 각 host 가 query block 하나를 들고 key·value block 을 다음 host 로
            보내면서 blockwise attention 을 계산하고, 계산 시간이 전송 시간을 넘으면 추가 통신 비용이
            없다고 적습니다. 조건 4dc²/F ≥ 4cd/B 에서 c ≥ F/B 를 유도하고, A100 NVLink 300 GB/s 에서
            최소 block 약 1.0K token, InfiniBand 12.5 GB/s 에서 약 24.5K token 을 표로 보고합니다.
            memory 가 block 크기에 선형이라 device 수 배의 context 가 가능하다는 주장은 저자
            자기보고이며 inference decode 의 효율은 별도로 다루지 않습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="decode-impact" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Decode 에서는 byte 가 아니라 layer 마다 붙는 latency 가 TPOT 을 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 parallel 축이 prefill 과 decode 에서 다르게 비쌉니다. prefill 은 token 이 수천 개라
            all-reduce 가 bandwidth 영역에 있고 계산도 커서 통신 비율이 10% 대에 머뭅니다. decode 는
            token 이 batch 수만큼이라 byte 는 작지만 α 가 layer 마다 두 번씩 그대로 붙습니다.
          </p>
          <p>
            70B, 80 layer, TP 8 에서 α 를 5 μs 로 잡으면 token 마다 80 × 2 × 5 = 0.8 ms 가 통신 하한이고
            byte 항을 더하면 약 1 ms 입니다. weight 읽기 5.2 ms 에 더하면 TPOT 은 6 ms 대이고 통신이
            그 중 약 16% 입니다. TP 를 16 으로 올려 weight 읽기를 2.6 ms 로 줄여도 통신은 줄지 않아
            비율은 28% 로 오릅니다.
          </p>
          <p>
            이 비율이 TP degree 의 실질 상한을 정합니다. α 가 15 μs 인 inter-node link 로 TP 를
            넘기면 통신만 2.4 ms 가 되어 weight 절감분을 먹어 버립니다. TPOT 과 ITL 의 정의는{" "}
            <Link to="/ai/serving-latency-metrics-and-slo#metrics">latency metric</Link> 글에, 어느
            축을 어느 link 에 놓을지는 다음 글에 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="네 parallel 축이 layer 마다 보내는 것"
          description="80 layer, hidden 8192, FP16 의 70B model 을 8 GPU 에 놓았을 때의 통신 요약입니다. 수치는 이 글의 계산 예시입니다."
          items={[
            { term: "Tensor parallel", description: "layer 마다 all-reduce 두 번. weight 읽기와 계산이 degree 분의 1 로 줄어 decode latency 가 낮아집니다.", example: "prefill 2048 token 에 GPU 당 59 MB × 2 × 80, decode 에 α × 160", boundary: "degree 를 올려도 α × 160 은 그대로라 통신 비율이 오릅니다." },
            { term: "Pipeline parallel", description: "stage 경계마다 activation 한 번. 통신이 가장 적지만 한 token 이 모든 stage 를 직렬로 지납니다.", example: "PP 4 에 33.6 MB × 3, bubble 27% (m=8)", boundary: "decode 의 한 요청 latency 는 stage 수만큼 길어집니다." },
            { term: "Data parallel", description: "forward 중 통신 없음. throughput 이 replica 수에 비례합니다.", example: "DP 2 면 weight 280 GB, 초당 token 약 2 배", boundary: "replica 하나가 한 GPU 묶음에 들어가야 합니다." },
            { term: "Sequence · context parallel", description: "LayerNorm 구간을 token 축으로 나누거나 attention 의 KV block 을 ring 으로 돌립니다.", example: "A100 NVLink 에서 block 1000 token 이상이면 전송이 숨음", boundary: "decode 처럼 query 가 짧으면 c ≥ F/B 를 만족하지 못합니다." },
          ]}
        />
        <ProgressiveDetail
          title="TP degree 를 올렸는데 왜 decode TPOT 이 기대만큼 줄지 않나요?"
          preview="weight 읽기 시간은 degree 분의 1 로 줄지만 layer 마다 붙는 all-reduce latency α × 2 × layers 는 degree 와 무관하게 남기 때문입니다."
        >
          <p>
            TP 8 에서 TP 16 으로 올리면 GPU 당 weight 는 17.5 GB 에서 8.75 GB 로, 읽기 시간은 5.2 ms
            에서 2.6 ms 로 줍니다. 통신은 all-reduce 참여 rank 가 16 으로 늘어 ring 단계가 두 배가
            되므로 오히려 조금 늘어, TPOT 은 6.2 ms 에서 3.7 ms 로 41% 만 줄고 통신 비율은 28% 로
            오릅니다.
          </p>
          <p>
            게다가 TP 16 은 한 node 의 8 GPU 를 넘으므로 all-reduce 의 한 hop 이 NVLink 가 아니라
            InfiniBand 를 지납니다. α 가 5 μs 에서 15 μs 로 오르면 통신은 2.4 ms 가 되어 TPOT 은 5 ms
            로, TP 8 대비 20% 밖에 줄지 않습니다. 이 계산이 다음 글에서 TP 를 NVLink 도메인 안에
            가두는 근거입니다.
          </p>
        </ProgressiveDetail>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 읽기는 이 byte 와 μs 를 실제 node 와 link 위에 올려 TP·PP·DP degree 를 고르는{" "}
            <Link to="/ai/parallelism-strategy-and-placement">parallelism 전략과 placement</Link>{" "}
            글입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
