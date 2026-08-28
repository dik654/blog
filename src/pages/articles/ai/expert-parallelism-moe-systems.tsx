import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ExpertParallelismMoeSystemsViz from "./expert-parallelism-moe-systems/viz/ExpertParallelismMoeSystemsViz";

/**
 * Expert parallelism은 all-to-all 통신량이 expert 계산 시간을 넘지 않게 설계합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "expert를 GPU에 어떻게 나누고, token이 GPU 사이를 어떻게 오가며, 그 통신이 언제 병목이 되는가"
 * 하나만 소유한다. Router·top-k·load-balance loss·capacity factor의 정의는 mixture-of-experts 가,
 * dispatch payload 하한식은 그 글의 system-cost 절이, collective rank 계약은 gpu-collective-network 가 맡는다.
 */
export default function ExpertParallelismMoeSystemsArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Expert를 GPU에 나누는 순간 token이 GPU 사이를 두 번 건너야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            MoE layer의 expert는 전체를 한 GPU에 올리기에 너무 많고 크므로 GPU마다 일부
            expert만 둡니다. 그러면 token은 자기 GPU에 없는 expert에게 가야 하고, 계산이
            끝나면 돌아와야 합니다. 이 두 번의 이동이 all-to-all 통신이고, expert 계산보다
            오래 걸리는 순간 MoE는 연산이 아니라 network에 막힙니다.
          </p>
          <p>
            이 글은 그 이동만 다룹니다. Expert를 어느 GPU에 둘지 정하는 sharding, token을
            보내고 되가져오는 all-to-all의 byte와 시간, token이 건너는 node 수를 제한하는
            locality, 그리고 통신 시간과 느린 GPU가 step을 끄는 병목 순서로 갑니다.
            수치 예는 64 expert를 8 GPU에 8개씩 둔 구성으로 통일합니다.
          </p>
          <p>
            Router가 top-k를 어떻게 고르고 load-balance loss와 capacity factor가 무엇인지는{" "}
            <Link to="/ai/mixture-of-experts#routing">MoE 글</Link>이, dispatch payload의 하한식은{" "}
            <Link to="/ai/mixture-of-experts#system-cost">같은 글의 system cost 절</Link>이
            설명합니다. 이 글은 그 payload가 실제 GPU와 link 위에서 시간으로 바뀌는 부분을
            맡습니다.
          </p>
        </div>
        <ExpertParallelismMoeSystemsViz />
        <ContentBoundary article="expert-parallelism-moe-systems" />
      </section>

      <section id="sharding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Expert parallelism은 expert를 나누고 token을 expert 쪽으로 보냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Expert parallelism(EP)은 MoE layer의 expert 집합을 여러 GPU에 나눠 두고, 각
            token을 자기가 고른 expert가 있는 GPU로 보내 계산하는 병렬화입니다. Tensor
            parallel이 한 weight 행렬을 여러 GPU가 조각내 함께 계산하는 것과 달리, EP는
            expert 하나를 통째로 한 GPU가 맡고 token 쪽이 움직입니다.
          </p>
          <p>
            Expert sharding은 그 배치표입니다. 64 expert를 8 GPU에 8개씩 두면 GPU g는
            expert 8g부터 8g+7까지를 갖습니다. GShard는 expert 하나를 device 하나에 두는
            가장 단순한 배치였고, DeepSeek-V3의 decode 배포는 320 GPU에 expert를 하나씩
            두되 64 GPU를 자주 뽑히는 expert의 복제본에 썼습니다.
          </p>
          <p>
            배치표가 정해지면 token 하나의 경로가 정해집니다. GPU 0에 있는 token이 expert
            13과 42를 골랐다면 expert 13은 GPU 1에, 42는 GPU 5에 있으므로 token의 hidden
            vector를 두 GPU로 복사해 보내고, 각 GPU가 자기 expert FFN을 계산한 뒤 결과를
            GPU 0으로 돌려보내 gate 가중치로 합칩니다.
          </p>
          <p>
            EP는 보통 data parallel과 함께 씁니다. 8 GPU가 각자 다른 batch를 들고
            attention과 shared layer는 replica처럼 따로 계산하다가 MoE layer에서만 token을
            교환합니다. 그래서 EP group의 GPU 수는 곧 all-to-all에 참여하는 rank 수이고,
            이 수가 클수록 한 token이 자기 GPU에 남을 확률이 낮아집니다.
          </p>
          <p>
            Weight memory 관점에서 EP는 expert weight를 GPU 수로 나눕니다. Expert 하나가
            hidden 4,096에 FFN 폭 11,008, 행렬 3개, FP16이면 약 258 MiB이고 64개면 16 GiB인데,
            8 GPU에 나누면 GPU당 2 GiB입니다. Total과 active parameter를 memory와 compute
            장부로 나누는 계산은{" "}
            <Link to="/ai/model-vram-budgeting#moe-serving-boundary">VRAM budgeting 글</Link>이
            맡습니다.
          </p>
        </div>
        <TermBreakdown
          title="MoE에서 세 병렬화가 나누는 것과 옮기는 것"
          items={[
            { term: "Expert parallelism", description: "Expert를 GPU에 나누고 token을 expert가 있는 GPU로 보냅니다. 옮기는 것은 token의 hidden vector입니다.", example: "64 expert를 8 GPU에 8개씩 두면 GPU당 expert weight 2 GiB이고 token당 top-2 복사본이 최대 2개 이동합니다.", boundary: "Expert 하나가 GPU memory보다 크면 EP만으로는 못 올리고 expert 안에서 TP를 더 써야 합니다." },
            { term: "Tensor parallelism", description: "Weight 행렬 하나를 여러 GPU가 조각내 계산하고 partial sum을 all-reduce로 합칩니다. 옮기는 것은 activation의 partial sum입니다.", example: "Expert FFN을 TP 2로 나누면 GPU당 weight는 절반이지만 layer마다 all-reduce가 추가됩니다.", boundary: "GPU 수만큼 통신 횟수가 늘어 작은 batch에서는 EP보다 비쌉니다." },
            { term: "Data parallelism", description: "각 GPU가 전체 weight를 갖고 다른 batch를 처리합니다. 추론에서는 replica이고 옮기는 것이 없습니다.", example: "EP 8과 DP 8을 겹치면 8 GPU가 각자 batch를 들고 MoE layer에서만 token을 교환합니다.", boundary: "MoE의 전체 expert weight를 GPU마다 갖기 어렵기 때문에 EP와 겹쳐 씁니다." },
          ]}
        />
      </section>

      <section id="all-to-all" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          All-to-all의 byte는 token 수, top-k, hidden 폭에 비례합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            All-to-all은 group의 모든 rank가 다른 모든 rank에게 서로 다른 조각을 보내는
            collective입니다. All-reduce가 같은 값을 모두에게 합쳐 주는 것과 달리, rank i가
            rank j에게 보내는 chunk는 j마다 다르고 크기도 다를 수 있습니다. MoE의 dispatch는
            GPU i의 token 가운데 GPU j의 expert를 고른 것만 j에게 보내므로 정확히 이 모양입니다.
          </p>
          <p>
            한 MoE layer에는 all-to-all이 두 번 있습니다. Dispatch는 token의 hidden vector를
            expert가 있는 GPU로 보내고, combine은 expert 출력을 원래 GPU로 돌려보냅니다.
            둘의 byte는 같으므로 layer당 통신량은 dispatch의 두 배입니다. Combine 뒤에
            gate 가중치를 곱해 더하는 계산은 원래 GPU에서 합니다.
          </p>
          <p>
            수치로 보겠습니다. GPU마다 token 2,048개, top-2, hidden 4,096, FP16이면 GPU 하나가
            내보내는 dispatch payload는 2,048 × 2 × 4,096 × 2 B = 32 MiB이고 combine까지 64
            MiB입니다. Expert가 8 GPU에 고르게 퍼져 있으면 그중 1/8은 자기 GPU에 남으므로
            실제로 link를 건너는 byte는 56 MiB입니다.
          </p>
          <p>
            시간은 link가 정합니다. NVLink를 단방향 450 GB/s로 잡으면 56 MiB는 0.13 ms이고,
            node 사이 InfiniBand를 50 GB/s로 잡으면 1.2 ms입니다. 같은 GPU가 받은 token
            4,096개에 expert FFN 3개 행렬을 곱하는 계산은 약 1.1 TFLOP이라 600 TFLOP/s에서
            1.85 ms입니다. NVLink에서는 통신이 계산의 7%, InfiniBand에서는 63%입니다.
          </p>
          <p>
            이 비율이 EP 설계의 첫 번째 숫자입니다. Payload는 token 수와 top-k, hidden에
            비례하고 GPU 수에는 거의 무관하지만, 계산은 GPU당 받은 token 수에 비례합니다.
            그래서 GPU를 늘려 expert를 더 잘게 나눠도 GPU당 통신은 줄지 않고 계산만
            줄어, 비율은 GPU 수와 함께 나빠집니다.
          </p>
        </div>
        <ExplainedFormula
          question="GPU 하나가 한 MoE layer에서 link로 내보내고 받는 byte는 얼마인가요?"
          idea="GPU의 token마다 top-k개의 hidden vector 복사본을 보내고 같은 수를 돌려받습니다. Expert가 G개 GPU에 고르게 퍼져 있으면 복사본 가운데 1/G은 자기 GPU에 남으므로 그만큼을 뺍니다."
          formula={String.raw`B_{gpu}=2\,m\,k\,d\,s\left(1-\frac{1}{G}\right)`}
          annotatedFormula={String.raw`B_{gpu}=\underbrace{2}_{\text{dispatch + combine}}\cdot\underbrace{m\,k}_{\text{GPU당 복사본 수}}\cdot\underbrace{d\,s}_{\text{복사본 하나의 byte}}\cdot\underbrace{\left(1-\frac{1}{G}\right)}_{\text{자기 GPU에 남는 몫 제외}}`}
          operations={[
            { expression: String.raw`m\,k`, annotation: ["GPU의 token 수에 top-k를 곱해", "보내야 할 hidden vector 복사본 수 계산"] },
            { expression: String.raw`d\,s`, annotation: ["hidden 차원에 dtype byte를 곱해", "복사본 하나의 byte 계산"] },
            { expression: String.raw`1-\frac{1}{G}`, annotation: ["G개 GPU 가운데 자기 GPU 몫을 빼", "실제로 link를 건너는 비율 계산"] },
            { expression: String.raw`2\,m\,k\,d\,s\left(1-\frac{1}{G}\right)`, annotation: ["dispatch와 combine을 더해", "layer당 GPU 하나의 통신 byte 확정"] },
          ]}
          terms={[
            { symbol: "m", name: "GPU당 token 수", description: "이 GPU의 batch가 MoE layer에 넣는 token 수입니다. 예시에서는 2,048입니다." },
            { symbol: "k", name: "Top-k", description: "Token 하나가 고르는 expert 수입니다. 예시에서는 2입니다." },
            { symbol: "d", name: "Hidden 차원", description: "Expert로 보내는 vector의 길이입니다. 예시에서는 4,096입니다." },
            { symbol: "s", name: "Dtype byte", description: "FP16·BF16은 2, FP8 dispatch는 1입니다." },
            { symbol: "G", name: "EP group의 GPU 수", description: "All-to-all에 참여하는 rank 수입니다. 예시에서는 8입니다." },
          ]}
          assumptions={["Expert 선택이 GPU에 고르게 퍼진다고 가정합니다. 특정 GPU의 expert가 자주 뽑히면 그 GPU의 수신 byte가 이 값을 넘습니다.", "Index·gate 가중치·metadata와 padding은 제외한 payload만 셉니다."]}
          interpretation="m = 2,048, k = 2, d = 4,096, s = 2, G = 8이면 56 MiB입니다. G를 키워도 괄호 항은 1에 가까워질 뿐이라 GPU당 통신은 거의 그대로이고, 계산은 GPU당 받은 token 수에 비례해 줄어들므로 통신 대 계산 비율은 G와 함께 나빠집니다."
        />
        <AlgorithmBlock
          title="한 MoE layer의 dispatch → local expert 계산 → combine"
          input={["GPU g의 token hidden X_g (m × d)", "router 출력: token별 top-k expert index와 gate 가중치", "expert 배치표 place(e) → GPU", "EP group의 G개 rank"]}
          steps={[
            { code: "for each token t, each (e, w) in topk(t): dest[t,e] ← place(e)", note: "배치표로 각 복사본의 목적지 GPU를 정합니다. 여기까지는 통신이 없습니다." },
            { code: "counts[g→j] ← |{(t,e): dest = j}|;  all_to_all(counts)", note: "Payload보다 먼저 rank별로 몇 개를 보낼지 교환합니다. 받는 쪽이 buffer를 잡기 위한 작은 all-to-all이며 EP routing overhead의 일부입니다." },
            { code: "X_sorted ← permute(X_g, by dest, then by e)", note: "같은 목적지와 같은 expert의 복사본이 연속되도록 정렬해 한 번의 memcpy로 보낼 수 있게 합니다." },
            { code: "Y_in ← all_to_all(X_sorted, counts)   # dispatch, m·k·d·s byte", note: "GPU j는 자기 expert를 고른 모든 GPU의 복사본을 받습니다. 받은 수가 GPU마다 다르면 여기서 imbalance가 드러납니다." },
            { code: "for e in local experts: Y_out[e] ← FFN_e(Y_in[e])   # batched GEMM", note: "Expert마다 받은 token을 하나의 GEMM으로 계산합니다. 받은 token이 적은 expert는 GEMM이 작아 효율이 떨어집니다." },
            { code: "Z ← all_to_all(Y_out, counts^T)   # combine, 같은 byte", note: "결과를 원래 GPU로 되돌립니다. 전송량은 dispatch와 같습니다." },
            { code: "H_g[t] ← Σ_e w[t,e] · unpermute(Z)[t,e]", note: "원래 GPU에서 gate 가중치로 합칩니다. 정렬을 되돌리는 index는 dispatch 때 만든 것을 재사용합니다." },
          ]}
          output="GPU g의 MoE layer 출력 H_g (m × d)"
        />
      </section>

      <section id="locality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Expert locality는 token이 건너는 node 수를 제한해 IB 통신을 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            EP group이 한 node를 넘으면 link가 두 종류가 됩니다. Node 안은 NVLink, node 사이는
            InfiniBand이고 DeepSeek-V3는 그 비율을 NVLink 160 GB/s 대 IB 50 GB/s, 약 3.2배로
            적었습니다. 같은 byte라도 어느 link를 건너느냐에 따라 시간이 세 배 넘게 달라지므로
            IB를 건너는 복사본 수를 줄이는 것이 expert locality의 목표입니다.
          </p>
          <p>
            가장 직접적인 방법이 node-limited routing입니다. Router가 token마다 top-k를 고를
            때 expert가 속한 node 수를 M개 이하로 제한합니다. DeepSeek-V3는 256 expert 가운데
            8개를 고르되 64-way EP가 8 node에 걸쳐 있으므로, token 하나가 보내지는 node를
            최대 4개로 묶었습니다.
          </p>
          <p>
            제한이 없을 때와 비교해 보겠습니다. 8 node에 expert가 32개씩 있고 8개를 고르게
            뽑으면 token 하나가 닿는 node 수의 기대값은 약 5.3입니다. M = 4로 묶으면 그
            상한이 4이므로 IB를 건너는 복사본이 기대값 기준 4/5.3, 약 25% 줄어듭니다.
            대신 router가 고를 수 있는 조합이 줄어 품질과의 맞바꿈이 됩니다.
          </p>
          <p>
            같은 node로 가는 복사본 여러 개를 하나로 묶으면 더 줄어듭니다. DeepSeek-V3의
            all-to-all kernel은 token을 목적 node의 같은 in-node index GPU로 IB를 통해 한 번만
            보내고, 그 node 안에서 NVLink로 목적 GPU에 뿌립니다. IB를 건너는 byte가 expert
            수가 아니라 node 수에 비례하게 되어 M = 4면 token당 최대 4 복사본입니다.
          </p>
          <p>
            이 두 단계 전송이 hierarchical all-to-all입니다. DeepSpeed-MoE가 같은 이름으로
            node 안 all-to-all과 node 사이 all-to-all을 나눠 hop 수를 줄였고, DeepSeek-V3는
            거기에 IB와 NVLink의 forwarding을 겹쳐 20개 SM만으로 두 link를 채웠다고
            보고했습니다. 나머지 SM은 계산에 남습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Node-limited routing과 node 단위 묶음이 IB를 건너는 byte를 얼마나 줄이나요?"
          idea="복사본을 expert마다 보내면 IB byte는 top-k에 비례하지만, 같은 node로 가는 복사본을 하나로 묶으면 token이 닿는 node 수에 비례합니다. Routing이 그 node 수를 M 이하로 묶으면 상한이 정해집니다."
          formula={String.raw`B_{IB}=m\,d\,s\,\mathbb{E}\!\left[N_{node}\right],\qquad N_{node}\le\min(k,M)`}
          annotatedFormula={String.raw`B_{IB}=\underbrace{m}_{\text{token 수}}\cdot\underbrace{d\,s}_{\text{복사본 byte}}\cdot\underbrace{\mathbb{E}\!\left[N_{node}\right]}_{\text{token이 닿는 다른 node 수}},\qquad\underbrace{N_{node}\le\min(k,M)}_{\text{routing이 정한 상한}}`}
          operations={[
            { expression: String.raw`\mathbb{E}\!\left[N_{node}\right]`, annotation: ["token 하나의 top-k expert가 흩어진 node 수를 평균해", "IB로 한 번씩 보내야 할 복사본 수 계산"] },
            { expression: String.raw`m\,d\,s\,\mathbb{E}\!\left[N_{node}\right]`, annotation: ["token 수와 복사본 byte를 곱해", "GPU 하나가 dispatch에서 IB로 내보내는 byte 계산"] },
            { expression: String.raw`N_{node}\le\min(k,M)`, annotation: ["expert 수 k와 node 제한 M 가운데 작은 쪽으로 묶어", "IB byte의 상한 확정"] },
          ]}
          terms={[
            { symbol: String.raw`N_{node}`, name: "Token이 닿는 node 수", description: "자기 node를 제외하고 top-k expert가 있는 서로 다른 node의 수입니다." },
            { symbol: "M", name: "Node 제한", description: "Node-limited routing이 허용하는 최대 node 수입니다. DeepSeek-V3는 4입니다." },
            { symbol: "k", name: "Top-k", description: "DeepSeek-V3는 256 expert 가운데 8입니다." },
          ]}
          assumptions={["Node 안 forwarding이 NVLink에서 IB보다 충분히 빠르다고 봅니다. 두 link가 비슷하면 묶는 이득이 사라집니다.", "Expert가 node에 고르게 분포한다고 가정합니다. Hot expert가 한 node에 몰리면 그 node의 IB 수신이 이 값을 넘습니다."]}
          interpretation="8 node·top-8에서 제한 없이 뽑으면 E[N_node] ≈ 5.3, M = 4면 4 이하입니다. Expert마다 보내는 방식의 8 복사본에 비하면 IB byte가 절반이고, 이 절약은 router의 선택지를 좁힌 대가입니다."
        />
      </section>

      <section id="bottleneck" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          통신 병목은 all-to-all 시간이 계산을 넘거나 느린 GPU가 모두를 세울 때 생깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            MoE communication bottleneck은 한 MoE layer의 step 시간이 expert GEMM이 아니라
            all-to-all이 정하는 상태입니다. 두 조건 가운데 하나면 충분합니다. 통신 시간이
            계산 시간보다 길거나, 둘을 겹쳐도 가장 늦게 끝나는 GPU가 나머지를 기다리게 하는
            경우입니다. 앞의 것은 byte와 link의 문제이고 뒤의 것은 imbalance의 문제입니다.
          </p>
          <p>
            첫 조건은 앞 절의 비율입니다. 예시 구성에서 InfiniBand는 통신 1.2 ms 대 계산
            1.85 ms로 아직 계산이 길지만, batch가 절반으로 줄면 계산은 0.9 ms로 떨어지는데
            통신은 latency 바닥 때문에 그만큼 줄지 않습니다. Decode처럼 GPU당 token이 수십
            개면 payload는 수백 KiB뿐이라 시간은 byte가 아니라 kernel 왕복 latency가 정합니다.
          </p>
          <p>
            둘째 조건은 straggler입니다. All-to-all은 모든 rank가 끝나야 끝나므로 expert
            하나가 자주 뽑히면 그 GPU는 더 많은 token을 받아 GEMM이 길어지고 나머지 GPU는
            combine에서 기다립니다. 8 GPU가 평균 4,096 복사본을 받는데 한 GPU가 1.75배인
            7,168개를 받으면 그 GPU의 계산은 3.2 ms이고 step 전체가 3.2 ms가 됩니다.
          </p>
          <p>
            Straggler를 막는 장치는 세 층입니다. 학습 시{" "}
            <Link to="/ai/mixture-of-experts#load-balancing">load-balance loss나 bias 갱신</Link>이
            router를 고르게 만들고, capacity factor가 expert당 받을 token 상한을 정해 넘치는
            token을 버리며, 배포 시 자주 뽑히는 expert를 여러 GPU에 복제합니다. Switch
            Transformer의 capacity는 batch token 수를 expert 수로 나눈 값에 factor를 곱한
            것입니다.
          </p>
          <p>
            Capacity는 straggler의 상한을 정하지만 공짜가 아닙니다. Factor 1.0이면 평균만큼만
            받으므로 hot expert의 초과분은 계산되지 않고 residual로 지나가며, 2.0이면 버리는
            token은 줄지만 buffer의 절반이 padding이 되어 GEMM과 all-to-all이 빈 자리를
            옮깁니다. DeepSeek-V3는 학습에서 token을 버리지 않고 bias로만 균형을 잡았습니다.
          </p>
          <p>
            EP routing overhead는 payload가 아닌 비용의 묶음입니다. Top-k 정렬과 permutation,
            rank별 count 교환, receive buffer 할당, CPU와 GPU 사이의 동기화, all-to-all kernel의
            고정 latency가 여기에 듭니다. Batch가 크면 payload 시간에 묻히지만 decode에서는 이
            overhead가 layer마다 반복되어 통신 시간의 대부분이 됩니다.
          </p>
          <p>
            DeepEP는 이 두 영역을 kernel 두 벌로 나눴습니다. 학습과 prefill용 normal kernel은
            대역폭을 채우는 데 맞추고, decode용 low-latency kernel은 routing metadata를
            iteration 사이에 재사용해 CPU 동기화를 줄입니다. README는 SM90과 CX7 기준
            node 사이 dispatch 약 90 GB/s, node 안 NVLink 700 GB/s대를 표로 적었습니다.
          </p>
        </div>
        <ExplainedFormula
          question="한 MoE layer의 step 시간은 무엇이 정하나요?"
          idea="통신과 계산을 완전히 겹친다는 낙관적 가정에서도 step은 둘 중 긴 쪽이고, 계산은 가장 많은 복사본을 받은 GPU가 정합니다. 통신에는 byte 시간에 고정 latency가 더해집니다."
          formula={String.raw`t_{layer}\ge\max\!\left(\frac{B_{gpu}}{B_{link}}+t_{lat},\ \ \frac{\max_{g} n_{g}\cdot F_{e}}{P}\right)`}
          annotatedFormula={String.raw`t_{layer}\ge\max\!\left(\underbrace{\frac{B_{gpu}}{B_{link}}+t_{lat}}_{\text{all-to-all 시간}},\ \ \underbrace{\frac{\max_{g} n_{g}\cdot F_{e}}{P}}_{\text{가장 바쁜 GPU의 expert 계산}}\right)`}
          operations={[
            { expression: String.raw`\frac{B_{gpu}}{B_{link}}`, annotation: ["GPU당 통신 byte를 link 대역폭으로 나눠", "payload 전송 시간 계산"] },
            { expression: String.raw`\frac{B_{gpu}}{B_{link}}+t_{lat}`, annotation: ["kernel 왕복과 count 교환의 고정 latency를 더해", "작은 batch에서도 사라지지 않는 통신 시간 완성"] },
            { expression: String.raw`\max_{g} n_{g}`, annotation: ["GPU마다 받은 복사본 수 가운데 최대를 골라", "straggler가 되는 GPU 확정"] },
            { expression: String.raw`\frac{\max_{g} n_{g}\cdot F_{e}}{P}`, annotation: ["복사본 수에 expert FFN의 FLOP을 곱하고 GPU FLOP/s로 나눠", "가장 바쁜 GPU의 계산 시간 계산"] },
          ]}
          terms={[
            { symbol: String.raw`B_{gpu}`, name: "GPU당 통신 byte", description: "앞 절의 식으로 예시에서는 56 MiB입니다." },
            { symbol: String.raw`t_{lat}`, name: "고정 latency", description: "Count 교환·buffer 할당·kernel 왕복처럼 byte와 무관한 시간이며 EP routing overhead의 핵심입니다." },
            { symbol: "n_g", name: "GPU g가 받은 복사본 수", description: "균형이면 m·k, 예시에서는 4,096입니다." },
            { symbol: "F_e", name: "복사본 하나의 expert FLOP", description: "SwiGLU 3 행렬이면 2 × 3 × d × d_ff, 예시에서는 약 270 MFLOP입니다." },
            { symbol: "P", name: "GPU FLOP/s", description: "예시에서는 유효 600 TFLOP/s입니다." },
          ]}
          assumptions={["통신과 계산이 완전히 겹친다는 하한입니다. 겹침이 없으면 두 항의 합에 가까워집니다.", "Dispatch와 combine이 한 덩어리로 흐른다고 보며, 실제로는 combine이 계산 뒤에 따로 옵니다."]}
          interpretation="균형 상태의 예시는 max(1.2 + t_lat, 1.85) ms로 계산이 정하지만, 한 GPU가 1.75배를 받으면 둘째 항이 3.2 ms로 커지고, batch가 작아지면 첫째 항의 t_lat이 남아 통신이 정합니다."
        />
        <TermBreakdown
          title="병목의 두 원인과 각각을 다루는 장치"
          items={[
            { term: "MoE communication bottleneck", description: "All-to-all 시간이 expert 계산을 넘거나 straggler가 step을 끄는 상태입니다.", example: "InfiniBand 1.2 ms 대 계산 1.85 ms는 아직 계산이 길지만 batch가 절반이면 통신이 정합니다.", boundary: "Link 대역폭과 batch가 함께 정하므로 같은 model도 배포마다 병목 여부가 다릅니다." },
            { term: "Expert locality", description: "Token이 닿는 node 수를 제한하고 같은 node 복사본을 묶어 IB byte를 줄입니다.", example: "8 node·top-8에서 M = 4면 IB 복사본이 기대값 5.3에서 4 이하로 줄어듭니다.", boundary: "Router의 선택지를 좁히므로 품질과의 맞바꿈이고, node 안 link가 충분히 빨라야 이득입니다." },
            { term: "EP routing overhead", description: "정렬·count 교환·buffer 할당·동기화·kernel latency처럼 byte와 무관한 비용입니다.", example: "Decode에서 GPU당 token 32개면 payload는 512 KiB뿐이라 시간의 대부분이 이 overhead입니다.", boundary: "큰 batch에서는 payload에 묻히므로 prefill 측정값을 decode로 옮기면 안 됩니다." },
            { term: "Capacity factor", description: "Expert당 받을 token 상한을 평균의 배수로 정하고 초과분을 버립니다.", example: "Factor 1.25면 평균의 25%까지만 초과를 받고 나머지는 residual로 지나갑니다.", boundary: "Straggler 상한을 주는 대신 token을 버리거나 padding을 옮기므로 품질과 byte 양쪽에 비용이 있습니다." },
          ]}
        />
        <ProgressiveDetail
          title="Redundant expert와 auxiliary-loss-free balancing은 straggler를 다른 층에서 막습니다"
          preview="복제는 배포 시 hot expert의 token을 여러 GPU로 나누고, bias 갱신은 학습 시 router가 처음부터 고르게 뽑게 합니다. 둘 다 capacity처럼 token을 버리지 않습니다."
        >
          <p>
            DeepSeek-V3의 prefill 배포는 4 node 32 GPU에 EP 32와 redundant expert 32개를, decode
            배포는 40 node 320 GPU에 EP 320과 redundant expert 64개를 두었습니다. 자주 뽑히는
            expert를 여러 GPU에 두면 router는 그대로인데 배치표가 복사본으로 흩어 straggler를
            줄입니다. 대신 복제된 expert만큼 weight memory가 늘어납니다.
          </p>
          <p>
            학습 쪽의 bias 갱신은 expert마다 routing score에 더하는 bias를 두고, 과부하면
            γ만큼 내리고 부족하면 γ만큼 올립니다. DeepSeek-V3는 γ를 처음 14.3T token 동안
            0.001로 두고 이후 0으로 내렸습니다. Loss 항이 없어 gradient가 균형 때문에
            왜곡되지 않는다는 것이 논문의 주장이며, 그 효과는 논문의 학습 범위 안의
            자기보고입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 GShard, Switch, DeepSeek-V3 논문과 DeepEP입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            GShard가 expert 하나를 device 하나에 두는 EP와 einsum all-to-all, capacity를 처음
            정의했고, Switch Transformer가 capacity factor와 top-1을 더했습니다. DeepSpeed-MoE는
            추론용 hierarchical all-to-all을, DeepSeek-V3는 node-limited routing과 IB에서
            NVLink로 잇는 forwarding을 보탰습니다.
          </p>
          <p>
            수치는 모두 각 논문의 hardware 범위 안의 저자 자기보고입니다.
          </p>
          <p>
            이 글의 56 MiB, 0.13 ms, 1.85 ms, 5.3 같은 수치는 논문 값이 아니라 위 예시 구성으로
            직접 계산한 것입니다. DeepEP의 대역폭은 README 표의 값이며 hardware와 version에
            묶여 있습니다.
          </p>
        </div>
        <div id="paper-gshard" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Lepikhin et al. · GShard: Scaling Giant Models with Conditional Computation and Automatic Sharding (ICLR 2021)"
            citeKey={1}
            href="https://arxiv.org/abs/2006.16668"
          >
            Expert 하나를 device 하나에 두는 sharded MoE layer와 einsum으로 표현한 all-to-all
            dispatch·combine, expert당 약 2N/E token의 capacity, 두 번째 expert의 random routing,
            auxiliary load-balance loss를 정의하고 600B parameter를 2,048 TPU v3에서 학습했습니다.
            추론 효율이나 다른 hardware에서의 비용은 주장하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-switch" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Fedus, Zoph, Shazeer · Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity (JMLR 2022)"
            citeKey={2}
            href="https://arxiv.org/abs/2101.03961"
          >
            Expert capacity를 batch token 수를 expert 수로 나눈 값에 capacity factor를 곱한 것으로
            정의하고 초과 token은 residual로 지나가게 했습니다. Factor 1.0·1.25·2.0을 비교했고
            top-1 routing과 α = 0.01의 balance loss를 썼습니다. Straggler 상한과 dropped token의
            맞바꿈이 이 논문의 범위이며 all-to-all 시간 자체는 측정 대상이 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-deepspeed-moe" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Rajbhandari et al. · DeepSpeed-MoE: Advancing Mixture-of-Experts Inference and Training to Power Next-Generation AI Scale (ICML 2022)"
            citeKey={3}
            href="https://arxiv.org/abs/2201.05596"
          >
            추론을 위해 expert parallel을 data·tensor parallel과 겹치고 hierarchical all-to-all로
            node 안과 node 사이 통신을 나눴습니다. 기존 MoE 추론 대비 7.3배, 같은 품질의 dense
            대비 4.5배 빠르고 9배 싸다는 수치는 저자 자기보고이며 당시 A100 cluster와 비교
            대상 system 범위의 값입니다.
          </CitationBlock>
        </div>
        <div id="paper-deepseek-v3" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="DeepSeek-AI · DeepSeek-V3 Technical Report (2024)"
            citeKey={4}
            href="https://arxiv.org/abs/2412.19437"
          >
            256 expert 가운데 top-8, 64-way EP가 8 node에 걸친 구성에서 token당 최대 4 node의
            node-limited routing, NVLink 160 GB/s 대 IB 50 GB/s의 3.2배 비율, IB로 같은 in-node
            index GPU에 보낸 뒤 NVLink로 forwarding하는 kernel과 20 SM, bias 갱신 γ = 0.001,
            prefill EP 32·redundant 32와 decode EP 320·redundant 64 배포가 이 보고서의 내용입니다.
          </CitationBlock>
        </div>
        <div id="paper-deepep" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="deepseek-ai · DeepEP README"
            citeKey={5}
            href="https://github.com/deepseek-ai/DeepEP"
            type="code"
          >
            MoE dispatch·combine용 all-to-all kernel을 학습·prefill용 normal kernel과 decode용
            low-latency kernel로 나누고, SM90과 CX7 기준 node 사이 RDMA dispatch 약 90 GB/s와
            node 안 NVLink 700 GB/s대의 표를 적었습니다. Hopper 이상과 NVLink·RDMA를 요구하며
            수치는 README 기준일의 hardware에 묶여 있습니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 읽기는 collective의 rank 계약과 NCCL 대역폭 측정을 다루는{" "}
            <Link to="/gpu/gpu-collective-network#collective-rank-semantics">GPU collective 글</Link>과,
            NVLink와 node 밖 경로의 경계를 정하는{" "}
            <Link to="/gpu/gpu-interconnects#nvlink-device-fabric-boundary">interconnect 글</Link>입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
