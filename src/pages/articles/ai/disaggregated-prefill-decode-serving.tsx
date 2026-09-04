import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DisaggregatedPrefillDecodeServingViz from "./disaggregated-prefill-decode-serving/viz/DisaggregatedPrefillDecodeServingViz";

/**
 * Prefill과 decode를 분리 배치하면 KV transfer 비용만큼 간섭이 사라집니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 * 이 글은 "요청을 어느 replica로 보내고, prefill과 decode를 다른 GPU 풀에 두었을 때 KV를 어떻게 옮기며,
 * 두 풀의 크기를 어떻게 정하는가" 하나만 소유한다. 두 phase가 왜 다른 자원에 막히는지는
 * prefill-decode-phase-dynamics 가, 한 replica 안의 scheduler 는 vllm-scheduler 가 맡는다.
 */
export default function DisaggregatedPrefillDecodeServingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Prefill과 decode를 같은 GPU에 섞으면 한쪽의 latency를 다른 쪽이 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Prefill은 연산기가, decode는 memory bandwidth가 시간을 정하는 phase입니다. 두
            phase를 한 replica의 같은 step에 섞으면 큰 prompt 하나가 들어올 때마다 이미
            돌던 decode 요청 전부의 token 간격이 늘어납니다. 이 간섭을 chunk 크기로
            달래는 대신 두 phase를 다른 GPU 풀에 두는 것이 disaggregated serving입니다.
          </p>
          <p>
            분리에는 값이 붙습니다. Prefill이 만든 KV cache를 decode GPU로 옮겨야 하고 그 전송이 decode step보다 오래 걸리면 간섭 대신 대기가 생깁니다.
            그래서 이 글은 요청을 어느 replica로 보낼지 정하는 routing에서 출발해 prefill worker와 decode worker의 역할, KV transfer의
            byte와 시간, 두 풀의 크기 비율 순서로 갑니다.
          </p>
          <p>
            두 phase가 왜 다른 자원에 막히는지는{" "}
            <Link to="/ai/prefill-decode-phase-dynamics#arithmetic-intensity">phase dynamics 글</Link>이,
            한 replica 안에서 step마다 요청을 고르는 규칙은{" "}
            <Link to="/ai/vllm-scheduler#running-waiting-order">scheduler 글</Link>이 설명합니다.
            이 글은 replica 바깥, 요청이 GPU에 닿기 전과 phase 사이의 이동만 다룹니다.
          </p>
        </div>
        <DisaggregatedPrefillDecodeServingViz />
        <ContentBoundary article="disaggregated-prefill-decode-serving" />
      </section>

      <section id="routing" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Replica routing은 prefix hit과 queue 길이를 함께 저울질합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 model을 여러 replica가 서빙하면 요청마다 어느 replica로 보낼지 정해야 합니다. 그 결정을 내리는 구성 요소가 load balancer이고 결정 규칙이
            replica routing입니다. 가장 단순한 round-robin은 replica의 상태를 보지 않아 긴 요청이 몰린 replica와 비어 있는 replica를 똑같이
            대합니다.
          </p>
          <p>
            상태를 보는 첫 단계는 shortest queue입니다. 실행 중이거나 대기 중인 요청 수가
            가장 적은 replica로 보내면 load는 고르게 퍼집니다. 그런데 LLM serving에는
            load 말고 한 가지가 더 있습니다. 같은 system prompt나 같은 대화를 이어 가는
            요청은 이전 요청의 KV cache를 가진 replica로 가야 prefill을 건너뜁니다.
          </p>
          <p>
            이 성질을 쓰는 규칙이 request affinity입니다. 같은 session이나 같은 prefix를 가진
            요청을 같은 replica에 붙여 두면{" "}
            <Link to="/ai/vllm-paged-attention#full-block-boundary">automatic prefix cache</Link>가
            hit합니다. 대신 인기 있는 prefix를 가진 replica에 요청이 쏠려 load 균형이
            깨집니다. Hit rate와 load 균형은 한쪽을 얻으면 다른 쪽을 잃는 관계입니다.
          </p>
          <p>
            둘을 함께 보는 것이 cache-aware load balancing입니다. SGLang router는 replica마다 보낸 prompt의 근사 radix tree를 들고
            있다가 load가 균형 안에 있으면 prefix가 가장 길게 맞는 replica로, 균형이 깨지면 tree를 무시하고 shortest queue로 보냅니다. 균형의 기준은 절대
            차이와 상대 비율 두 threshold입니다.
          </p>
          <p>
            수치로 보면 이렇습니다. Replica A에 40개, B에 8개가 돌고 있고 새 요청의 prefix 3,000 token이 A에 cache되어 있다고 합시다. 절대
            threshold가 32이면 40 − 8 = 32는 32를 넘지 않으므로 균형 상태이고 요청은 A로 갑니다. A가 41개였다면 균형이 깨져 B로 가고 3,000 token의
            prefill을 다시 계산합니다.
          </p>
          <p>
            Routing의 앞 단계인 model 선택, 즉 context 길이나 tool 지원 같은 hard
            compatibility로 backend를 거르는 일은{" "}
            <Link to="/ai/llm-serving-ops#litellm-gateway">serving ops 글의 capability-first routing</Link>이
            맡습니다. 이 절의 replica routing은 그 필터를 통과한 같은 model의 replica
            사이에서만 고릅니다.
          </p>
        </div>
        <ExplainedFormula
          question="Cache-aware routing은 어떤 값을 비교해 replica를 고르나요?"
          idea="요청이 replica r에서 첫 token을 받기까지의 시간은 그 replica의 queue 대기에, prefix hit으로 줄어든 prefill 시간을 더한 값입니다. 이 추정치가 가장 작은 replica를 고르면 hit rate와 load를 한 저울에 올린 셈입니다."
          formula={String.raw`\hat{T}_{r}=W_{r}+\left(L-H_{r}\right)c_{tok},\qquad r^{*}=\arg\min_{r}\hat{T}_{r}`}
          annotatedFormula={String.raw`\hat{T}_{r}=\underbrace{W_{r}}_{\text{replica } r \text{의 queue 대기}}+\underbrace{\left(L-H_{r}\right)}_{\text{hit을 뺀 prefill token}}\cdot\underbrace{c_{tok}}_{\text{token당 prefill 시간}}`}
          operations={[
            { expression: String.raw`L-H_{r}`, annotation: ["prompt 길이에서 replica r에 이미 있는 prefix 길이를 빼", "실제로 계산해야 할 token 수 계산"] },
            { expression: String.raw`\left(L-H_{r}\right)c_{tok}`, annotation: ["남은 token에 token당 prefill 시간을 곱해", "이 replica에서의 prefill 시간 추정"] },
            { expression: String.raw`W_{r}+\left(L-H_{r}\right)c_{tok}`, annotation: ["queue 대기를 더해", "첫 token까지의 시간 추정치 완성"] },
            { expression: String.raw`\arg\min_{r}\hat{T}_{r}`, annotation: ["replica마다 추정치를 비교해", "가장 빨리 첫 token을 줄 replica 선택"] },
          ]}
          terms={[
            { symbol: String.raw`\hat{T}_{r}`, name: "Replica r의 TTFT 추정치", description: "Router가 요청을 보내기 전에 계산하는 값이며 실측이 아닙니다." },
            { symbol: "W_r", name: "Queue 대기", description: "Replica r에 이미 쌓인 요청이 prefill을 끝내기까지의 시간입니다. 대기 요청 수에 평균 prefill 시간을 곱해 근사합니다." },
            { symbol: "L", name: "Prompt 길이", description: "새 요청의 token 수입니다." },
            { symbol: "H_r", name: "Prefix hit 길이", description: "Replica r의 cache와 앞부분이 일치하는 token 수입니다. SGLang은 근사 radix tree로 셉니다." },
            { symbol: String.raw`c_{tok}`, name: "Token당 prefill 시간", description: "Model과 GPU가 정하는 상수입니다. 7B FP16을 600 TFLOP/s로 돌리면 약 23 µs입니다." },
          ]}
          assumptions={["Prefill 시간이 token 수에 비례한다고 봅니다. 수만 token 이상에서는 attention의 n² 항 때문에 어긋납니다.", "Threshold 방식의 router는 이 식을 직접 계산하지 않고 load 균형 판정 뒤 hit 길이만 비교하는 근사를 씁니다."]}
          interpretation="Hit 길이 H_r이 커서 얻는 이득은 (L − H_r)c_tok의 감소이고, 그 replica에 몰려서 잃는 것은 W_r의 증가입니다. 둘의 크기가 비슷해지는 지점이 affinity를 포기해야 하는 경계입니다."
        />
        <ProgressiveDetail
          title="SGLang router의 균형 판정과 기본값"
          preview="Load가 max − min > 절대 threshold 이고 동시에 max > 상대 threshold × min 일 때만 불균형으로 보고 shortest queue로 떨어집니다. 두 조건을 함께 두는 이유는 작은 절대 차이와 작은 상대 차이를 각각 무시하기 위해서입니다."
        >
          <p>
            sgl-router README가 적은 기본값은 cache_threshold 0.5, balance_abs_threshold 32,
            balance_rel_threshold 1.0001, eviction_interval 60초, max_tree_size 2²⁴입니다.
            Prefix 일치율이 cache_threshold보다 낮으면 어느 replica에도 cache가 없다고 보고
            tree가 가장 작은 replica로 보내 새 prefix를 심습니다.
          </p>
          <p>
            Tree는 실제 KV cache가 아니라 router가 본 prompt의 근사이므로 replica가 그 block을 이미 evict했을 수 있습니다.
            eviction_interval마다 tree를 비워 router의 추정과 replica의 실제 cache가 너무 멀어지지 않게 합니다. 기본값은 version마다 바뀔 수
            있으므로 배포 시점의 README를 확인해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="disaggregation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Disaggregation은 prefill worker의 KV를 decode worker가 이어받습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefill–decode disaggregation은 한 요청의 두 phase를 서로 다른 GPU 풀에서 실행하는 배치입니다. Prefill worker는 prompt 전체를
            한 번에 계산해 KV cache를 만듭니다. Decode worker는 그 KV를 받아 token을 하나씩 생성합니다. 한 요청이 두 worker를 차례로 거치므로 요청은
            GPU 사이를 한 번 이동합니다.
          </p>
          <p>
            이렇게 나누면 얻는 것은 두 가지입니다. 첫째, decode worker의 step에는 prefill이
            끼어들지 않으므로{" "}
            <Link to="/ai/prefill-decode-phase-dynamics#interference">phase 간섭</Link>이
            사라지고 token 간격의 tail이 안정됩니다. 둘째, 두 풀의 parallelism과 batch를
            따로 정할 수 있습니다. Prefill은 512 token 하나로도 A100을 채우므로 batch를
            키울 이유가 없고, decode는 batch를 키워야 bandwidth를 활용합니다.
          </p>
          <p>
            잃는 것도 분명합니다. 같은 GPU 수로 두 풀을 나누면 한 풀이 놀 때 다른 풀이 그 GPU를 쓰지 못합니다. vLLM 문서는 disaggregated prefill이
            throughput을 높이지 않는다고 적어 두었고 목적을 TTFT와 ITL을 따로 조정하는 것과 tail ITL을 통제하는 것으로 한정합니다.
          </p>
          <p>
            구현에서 두 worker는 같은 engine의 다른 역할입니다. vLLM은 kv_transfer_config의 kv_role로 prefill instance를
            kv_producer, decode instance를 kv_consumer로 지정하고 SGLang은 disaggregation-mode를 prefill 또는 decode로
            띄웁니다. 앞에 선 proxy나 router가 요청을 prefill로 보낸 뒤 같은 요청을 decode로 넘깁니다.
          </p>
          <p>
            Decode worker는 prefill이 만든 token id도 함께 받습니다. Tokenization을 다시 하지 않기 위해서입니다. vLLM은
            kv_transfer_params의 prompt_token_ids로 이를 전달합니다. Decode worker의 첫 step은 KV가 도착한 뒤에야 시작되므로 이 시점이
            TTFT에 더해지는 transfer 비용의 자리입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="요청 하나가 router에서 decode worker까지 가는 절차"
          input={["요청 (prompt token L개, 생성 상한 L_out)", "prefill worker 풀 P, decode worker 풀 D", "router의 replica 상태 (queue 길이, 근사 prefix tree)", "KV connector (transfer 경로)"]}
          steps={[
            { code: "p ← argmin_{r∈P} Ŵ_r + (L − H_r)·c_tok", note: "Prefill 풀 안에서 cache-aware routing으로 prefill worker를 고릅니다. Decode 풀에는 prefix cache가 의미 없으므로 load만 봅니다." },
            { code: "d ← argmin_{r∈D} running(r) subject to KV_free(d) ≥ blocks(L + L_out)", note: "Decode worker는 이 요청의 최종 KV footprint를 받을 수 있는 곳 가운데 가장 한가한 곳입니다. Mooncake는 이 선택을 prefill 전에 미리 하고 끝난 뒤 다시 확인합니다." },
            { code: "p.prefill(prompt) → KV[layer 0..n−1], first_token", note: "Prefill worker가 prompt 전체를 한 번에 계산합니다. 첫 token은 여기서 나오므로 TTFT는 prefill 시간과 transfer 시간을 더한 값입니다." },
            { code: "for l in layers: connector.send(KV[l] → d)   # layer-wise, 계산과 겹침", note: "Layer l의 KV가 완성되는 즉시 보내면 전송 대부분이 뒤 layer의 계산 아래에 숨습니다. 마지막 layer의 KV만 계산 뒤에 남습니다." },
            { code: "d.recv(KV, prompt_token_ids, first_token)", note: "Decode worker는 KV block을 자기 pool에 쓰고 token id를 이어 붙입니다. Tokenization을 다시 하지 않습니다." },
            { code: "p.free(KV); d.decode_loop()", note: "Prefill worker는 block을 즉시 돌려주어 다음 prompt를 받고, decode worker는 자기 batch에 이 요청을 넣고 step을 돕니다." },
          ]}
          output="Decode worker d의 batch에 들어간 요청과 client로 흐르는 token stream"
        />
        <TermBreakdown
          title="두 worker가 각각 무엇을 갖고 무엇을 넘기는지"
          items={[
            { term: "Prefill worker", description: "Prompt 전체를 한 번 계산해 KV cache와 첫 token을 만드는 GPU입니다. Compute-bound이므로 batch를 키울 이득이 작습니다.", example: "7B FP16에 4,096 token prompt는 약 57 TFLOP이고 600 TFLOP/s에서 약 95 ms입니다.", boundary: "KV를 넘긴 뒤 block을 즉시 비워야 하므로 prefix cache를 오래 들고 있으려면 별도의 cache 층이 필요합니다." },
            { term: "Decode worker", description: "받은 KV로 token을 하나씩 생성하는 GPU입니다. Memory-bound이므로 batch를 키워야 bandwidth를 씁니다.", example: "7B FP16 batch 64에 KV 33.5 GB면 step당 약 14 ms이고 요청 하나가 256 token을 만들 때 GPU 시간은 약 57 ms입니다.", boundary: "KV가 도착해야 첫 step을 시작하므로 transfer 시간이 TTFT에 더해집니다." },
            { term: "KV connector", description: "두 worker 사이에서 KV block을 옮기는 계층입니다. vLLM은 NixlConnector·LMCacheConnector·MooncakeConnector 등을 kv_connector로 고릅니다.", example: "NIXL은 비동기 send·recv를 제공해 layer-wise 전송을 계산과 겹칩니다.", boundary: "Connector는 경로를 추상화할 뿐 대역폭을 만들지 않습니다. 시간은 아래 절의 link 계산이 정합니다." },
          ]}
        />
      </section>

      <section id="kv-transfer" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          KV transfer 시간은 KV byte를 link 대역폭으로 나눈 값입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            KV transfer는 prefill worker의 KV block을 decode worker의 KV pool로 복사하는
            일입니다. 옮길 byte는 요청 길이에 비례하므로{" "}
            <Link to="/ai/kv-cache-fundamentals#kv-shape">token당 KV byte</Link>에 token
            수를 곱하면 됩니다. 시간은 그 byte를 두 GPU 사이 link의 대역폭으로 나눈 값이고,
            link가 무엇인지가 전부를 정합니다.
          </p>
          <p>
            수치로 보겠습니다. 32 layer, KV head 8, head dim 128, FP16 model은 token당 128 KiB입니다. 4,096 token 요청이면 KV는
            512 MiB가 됩니다. 같은 node 안의 NVLink를 600 GB/s로 잡으면 0.9 ms, 400 Gb/s InfiniBand는 50 GB/s이므로 10.7 ms,
            PCIe Gen4 x16을 실효 25 GB/s로 잡으면 21 ms, 25 Gb/s Ethernet이면 172 ms입니다.
          </p>
          <p>
            이 시간을 비교할 기준은 decode worker의 step 시간입니다. 같은 model의 batch 1 decode step은 weight 14 GB를 3.35 TB/s로
            읽는 4.2 ms이고 batch 64면 약 14 ms입니다. NVLink의 0.9 ms는 step 하나에 묻힙니다. InfiniBand의 10.7 ms는 step 하나에 가깝고
            Ethernet의 172 ms는 step 수십 개 분량이라 TTFT에 그대로 드러납니다.
          </p>
          <p>
            전송을 계산과 겹치면 드러나는 시간이 줄어듭니다. Splitwise는 layer마다 KV가
            완성되는 즉시 보내는 layer-wise 전송으로, Llama-70B의 1,500 token prompt에서
            직렬 전송이 두 번째 token에 더하던 64%의 지연을 16.5%로 줄였고 end-to-end
            영향은 0.8%였다고 보고했습니다. 마지막 layer의 KV만 계산 뒤에 남기 때문입니다.
          </p>
          <p>
            KV transfer bandwidth는 요청 하나가 아니라 초당 요청 수로 세어야 합니다. 초당 10개의 4,096 token 요청이 오면 link는 초당 5 GiB, 약
            43 Gb/s를 계속 흘려야 합니다. DistServe는 OPT-66B의 512 token 요청 1.13 GB를 초당 10개 옮기려면 90 Gbps가 필요하다고 계산했고 이
            값이 node 사이 link를 넘으면 두 worker를 같은 node에 두는 배치를 택했습니다.
          </p>
          <p>
            Mooncake는 이 전송을 GPU 사이 직접 복사에 묶지 않고 CPU DRAM과 SSD에 paged block으로 둔 분산 KV cache를 거치게 했습니다. Prefill이
            끝난 KV를 DRAM에 내려놓고 decode가 RDMA로 가져가므로 prefill worker는 즉시 비고 같은 prefix를 다른 prefill worker가 다시 쓸 수
            있습니다. 대신 link는 node당 800 Gbps급 RDMA를 전제합니다.
          </p>
        </div>
        <ExplainedFormula
          question="KV transfer가 TTFT에 드러나지 않으려면 어떤 부등식이 성립해야 하나요?"
          idea="요청 하나의 KV byte를 link 대역폭으로 나눈 시간이 decode step보다 짧아야 하고, 초당 요청 수가 만드는 byte 흐름이 link 대역폭 아래여야 합니다. 앞의 것은 latency, 뒤의 것은 throughput 조건입니다."
          formula={String.raw`\begin{aligned}S_{kv}&=L\cdot 2\,n_{layer}\,n_{kv}\,d_h\,s\\t_{xfer}&=\frac{S_{kv}}{B_{link}}\le t_{step}\\\lambda\,S_{kv}&\le B_{link}\end{aligned}`}
          annotatedFormula={String.raw`\underbrace{\frac{\overbrace{L\cdot 2\,n_{layer}\,n_{kv}\,d_h\,s}^{\text{요청 하나의 KV byte } S_{kv}}}{B_{link}}}_{\text{전송 시간 } t_{xfer}}\le\underbrace{t_{step}}_{\text{decode step 시간}},\qquad\underbrace{\lambda\,S_{kv}}_{\text{초당 흘려야 할 byte}}\le\underbrace{B_{link}}_{\text{link 대역폭}}`}
          operations={[
            { expression: String.raw`L\cdot 2\,n_{layer}\,n_{kv}\,d_h\,s`, annotation: ["token당 KV byte에 요청 길이를 곱해", "옮겨야 할 byte 계산"] },
            { expression: String.raw`\frac{S_{kv}}{B_{link}}`, annotation: ["byte를 link 대역폭으로 나눠", "요청 하나의 전송 시간 계산"] },
            { expression: String.raw`t_{xfer}\le t_{step}`, annotation: ["전송 시간을 decode step과 비교해", "layer-wise 겹침으로 숨길 수 있는지 판정"] },
            { expression: String.raw`\lambda\,S_{kv}\le B_{link}`, annotation: ["초당 요청 수에 요청당 byte를 곱해", "link가 지속적으로 감당할 수 있는지 판정"] },
          ]}
          terms={[
            { symbol: String.raw`S_{kv}`, name: "요청 하나의 KV byte", description: "4,096 token, 32 layer, KV head 8, head dim 128, FP16이면 512 MiB입니다." },
            { symbol: String.raw`B_{link}`, name: "Link 대역폭", description: "NVLink 600 GB/s, 400 Gb/s InfiniBand 50 GB/s, PCIe Gen4 x16 실효 25 GB/s처럼 두 GPU 사이 실제 경로의 값입니다." },
            { symbol: String.raw`t_{step}`, name: "Decode step 시간", description: "Decode worker가 batch 하나를 한 token 진행시키는 시간입니다. 7B FP16 batch 1은 약 4.2 ms입니다." },
            { symbol: String.raw`\lambda`, name: "초당 요청 수", description: "Prefill을 끝내고 decode로 넘어가는 요청의 도착률입니다." },
          ]}
          assumptions={["Link 대역폭을 전부 KV에 쓸 수 있다고 봅니다. Tensor parallel의 all-reduce가 같은 link를 쓰면 몫이 줄어듭니다.", "Full attention layer만 셉니다. MLA·sliding-window·quantized KV는 token당 byte가 달라집니다."]}
          interpretation="첫 부등식이 깨지면 요청마다 TTFT가 늘고, 둘째가 깨지면 전송 queue가 쌓여 시간이 갈수록 TTFT가 늘어납니다. 둘째는 요청률이 오르면 반드시 먼저 깨지므로 disaggregation의 상한은 link가 정합니다."
        />
      </section>

      <section id="provisioning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          두 풀의 GPU 수는 요청률에 phase별 GPU 시간을 곱해 따로 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefill 풀과 decode 풀의 크기는 같은 식으로 따로 계산합니다. 초당 요청 수에 요청 하나가 그 phase에서 쓰는 GPU 시간을 곱하면 초당 필요한 GPU 시간이
            나옵니다. 이를 목표 이용률로 나눠 올림하면 GPU 수입니다. 두 phase의 GPU 시간이 다르므로 비율은 1:1이 아니라 workload가 정합니다.
          </p>
          <p>
            수치로 보겠습니다. 초당 100개의 요청이 오고 prompt는 4,096 token, 생성은 256 token, 목표 이용률은 0.8이라고 합시다. Prefill은 요청당 95
            ms이므로 100 × 0.095 ÷ 0.8 = 11.9, 즉 12 GPU입니다. Decode는 batch 64에서 step 14.2 ms이므로 요청당 256 × 14.2 ÷
            64 = 57 ms입니다. 100 × 0.057 ÷ 0.8 = 7.1, 즉 8 GPU입니다.
          </p>
          <p>
            Prompt가 1,024 token으로 짧아지면 prefill은 요청당 24 ms로 줄어 3 GPU면 되고 decode는 그대로 8 GPU입니다. 12:8이던 비율이 3:8로
            뒤집힙니다. 같은 model, 같은 요청률에서도 prompt와 생성 길이의 분포가 비율을 정합니다. 고정해 둘 설정이 아니라 trace를 볼 때마다 다시 계산하는 값입니다.
          </p>
          <p>
            DistServe는 이 계산을 simulator로 바꿔 각 phase의 parallelism 후보를 전부 시험해 GPU당 goodput이 가장 높은 구성을 찾은 뒤 요청률에
            맞춰 복제합니다. 그 결과가 같은 SLO에서 7.4배의 요청 또는 12.6배 엄격한 SLO를 감당한다는 저자 자기보고입니다. Chatbot SLO는 TTFT 0.25초와
            TPOT 0.1초였습니다.
          </p>
          <p>
            두 풀이 다른 자원에 막히니 두 풀에 서로 다른 GPU를 써도 됩니다. 이것이 heterogeneous serving이고 두 풀의 GPU가 세대나 종류에서 다른 상태를
            resource heterogeneity라고 부릅니다. Prefill은 FLOP/s가 큰 GPU에, decode는 bandwidth 대비 값이 싼 GPU에 두면 같은 비용으로
            더 많은 요청을 받습니다.
          </p>
          <p>
            A100은 312 TFLOP/s에 2.0 TB/s, H100 SXM은 989 TFLOP/s에 3.35 TB/s입니다. FLOP/s는 3.2배 차이지만 bandwidth는
            1.7배 차이이므로 decode를 A100에 두면 잃는 것이 prefill을 A100에 두는 것보다 작습니다. Splitwise는 이 배치로 같은 비용에서 1.4배
            throughput, 또는 같은 전력과 비용에서 2.35배 throughput을 보고했습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Prefill 풀과 decode 풀에 GPU를 몇 개씩 두어야 하나요?"
          idea="각 풀은 초당 도착하는 요청이 그 phase에서 쓰는 GPU 시간의 합을 감당해야 합니다. Decode는 batch로 GPU 시간을 나눠 쓰므로 step 시간을 batch 크기로 나눈 몫만 요청 하나의 몫입니다."
          formula={String.raw`N_{p}=\left\lceil\frac{\lambda\,t_{p}}{u}\right\rceil,\qquad N_{d}=\left\lceil\frac{\lambda\,L_{out}\,t_{step}(b)}{b\,u}\right\rceil`}
          annotatedFormula={String.raw`N_{p}=\left\lceil\frac{\overbrace{\lambda\,t_{p}}^{\text{초당 prefill GPU 시간}}}{\underbrace{u}_{\text{목표 이용률}}}\right\rceil,\qquad N_{d}=\left\lceil\frac{\lambda\,\overbrace{L_{out}\,t_{step}(b)/b}^{\text{요청 하나의 decode GPU 시간}}}{u}\right\rceil`}
          operations={[
            { expression: String.raw`\lambda\,t_{p}`, annotation: ["초당 요청 수에 요청당 prefill 시간을 곱해", "prefill 풀이 초당 써야 할 GPU 시간 계산"] },
            { expression: String.raw`L_{out}\,t_{step}(b)/b`, annotation: ["생성 token 수에 step 시간을 곱하고 batch로 나눠", "요청 하나가 decode GPU를 점유하는 시간 계산"] },
            { expression: String.raw`\frac{\lambda\,t_{p}}{u}`, annotation: ["필요한 GPU 시간을 목표 이용률로 나눠", "여유를 둔 GPU 수로 환산"] },
            { expression: String.raw`\left\lceil\cdot\right\rceil`, annotation: ["GPU는 정수이므로 올림해", "각 풀의 최소 GPU 수 확정"] },
          ]}
          terms={[
            { symbol: String.raw`\lambda`, name: "초당 요청 수", description: "예시에서는 100입니다." },
            { symbol: "t_p", name: "요청당 prefill 시간", description: "4,096 token 7B FP16을 600 TFLOP/s로 계산하면 약 95 ms입니다." },
            { symbol: String.raw`L_{out}`, name: "요청당 생성 token 수", description: "예시에서는 256입니다." },
            { symbol: String.raw`t_{step}(b)`, name: "Batch b의 decode step 시간", description: "Batch 64에 KV 33.5 GB면 약 14.2 ms입니다. Batch가 커지면 KV 읽기 때문에 함께 커집니다." },
            { symbol: "u", name: "목표 이용률", description: "Queue가 무한히 자라지 않도록 1보다 작게 둡니다. 예시에서는 0.8입니다." },
          ]}
          assumptions={["요청률이 정상 상태이고 Little's law가 성립하는 안정 system을 가정합니다. Burst가 있으면 u를 더 낮춰야 합니다.", "Prefill worker는 batch 이득이 없다고 보고 요청을 하나씩 처리한다고 가정합니다."]}
          interpretation="비율 N_p : N_d는 t_p와 L_out t_step/b의 비율이므로 prompt 길이가 길수록 prefill 쪽으로, 생성이 길수록 decode 쪽으로 기웁니다. 한 GPU를 두 풀이 나눠 쓰지 못하므로 올림에서 생기는 낭비가 disaggregation의 고정 비용입니다."
        />
        <ProgressiveDetail
          title="Chunked prefill과 disaggregation은 서로를 대체하지 않습니다"
          preview="Chunked prefill은 한 GPU 안에서 간섭의 크기를 줄이고, disaggregation은 간섭을 없애는 대신 link와 풀 분할 비용을 냅니다. Link가 느리거나 GPU가 적으면 chunking이, tail ITL이 SLO를 정하면 disaggregation이 맞습니다."
        >
          <p>
            Chunked prefill은 prefill을 잘게 나눠 decode step에 얹으므로 총 연산은 그대로이고 TTFT가 늘어납니다. Disaggregation은 TTFT에
            transfer 시간을 더하는 대신 decode step에는 아무것도 얹지 않습니다. DistServe는 자기 구현에 chunking을 넣지 않았다고 밝혔고 vLLM은 두
            기능을 함께 켤 수 있게 두었습니다.
          </p>
          <p>
            GPU가 두 개뿐인 배포에서 하나를 prefill, 하나를 decode로 나누면 prefill GPU가
            비는 시간이 그대로 손실입니다. 이 경우 chunked prefill 한 replica 두 개가 더 많은
            요청을 받습니다. Disaggregation은 GPU가 충분해 올림 낭비가 작아지는 규모에서
            이득이 커집니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 DistServe, Splitwise, Mooncake 논문과 engine 문서입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            세 논문은 같은 분리를 다른 자리에서 봤습니다. DistServe는 phase별 parallelism
            최적화와 배치 알고리즘을, Splitwise는 이종 GPU와 layer-wise transfer를,
            Mooncake는 분산 KV cache와 cache-aware scheduler를 기여로 내세웁니다. 성능
            수치는 모두 저자 자기보고이며 각자의 model과 cluster 범위 안의 값입니다.
          </p>
          <p>
            이 글의 512 MiB, 0.9 ms, 12 GPU 같은 수치는 논문 값이 아니라 위 예시 구성으로
            직접 계산한 것입니다. 설정 이름과 기본값은 vLLM과 SGLang 문서에서 가져왔고
            version마다 바뀔 수 있습니다.
          </p>
        </div>
        <div id="paper-distserve" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhong et al. · DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving (OSDI 2024)"
            citeKey={1}
            href="https://arxiv.org/abs/2401.09670"
          >
            Prefill과 decode를 다른 GPU에 두고 phase별 parallelism과 replica 수를 simulator로
            정합니다. OPT-66B 512 token 요청의 KV 1.13 GB, 초당 10개에 90 Gbps, A100 NVLink
            600 GB/s, 25 Gbps cross-node에서도 95%의 요청이 30 ms 미만 지연이라는 수치와
            7.4배 요청·12.6배 SLO 결과가 이 논문의 것입니다.
          </CitationBlock>
        </div>
        <div id="paper-splitwise" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Patel et al. · Splitwise: Efficient Generative LLM Inference Using Phase Splitting (ISCA 2024)"
            citeKey={2}
            href="https://arxiv.org/abs/2311.18677"
          >
            Prompt machine과 token machine을 나누고 InfiniBand 위 layer-wise KV 전송을
            prefill 계산과 겹칩니다. Llama-70B 1,500 token에서 직렬 64%, layer-wise 16.5%,
            end-to-end 0.8%의 전송 overhead, H100 400 Gbps와 A100 200 Gbps의 GPU 쌍 대역폭,
            1.4배 throughput·20% 비용 절감과 2.35배 throughput이 이 논문의 자기보고입니다.
          </CitationBlock>
        </div>
        <div id="paper-mooncake" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Qin et al. · Mooncake: A KVCache-centric Disaggregated Architecture for LLM Serving (FAST 2025)"
            citeKey={3}
            href="https://arxiv.org/abs/2407.00079"
          >
            Prefill 풀과 decode 풀 사이에 CPU DRAM과 SSD의 분산 KV cache를 두고 Conductor가
            prefix hit 길이와 queue 시간, transfer 시간을 합쳐 prefill instance를 고릅니다.
            Decode node는 TBT SLO를 지킬 load 기준으로 미리 고르고 prefill 뒤 다시 확인하며,
            simulation에서 최대 525%, Kimi 운영에서 75% 더 많은 요청이 저자 보고입니다.
          </CitationBlock>
        </div>
        <div id="paper-vllm-disagg" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="vLLM 문서 · Disaggregated Prefilling"
            citeKey={4}
            href="https://docs.vllm.ai/en/latest/features/disagg_prefill.html"
            type="code"
          >
            목적을 TTFT와 ITL의 독립 조정, tail ITL 통제로 두고 throughput은 높이지 않는다고
            적습니다. kv_transfer_config의 kv_connector, kv_role(kv_producer·kv_consumer),
            kv_buffer_device와 NixlConnector·LMCacheConnectorV1·MooncakeConnector 등 connector
            목록, prompt_token_ids 전달이 이 문서의 내용입니다.
          </CitationBlock>
        </div>
        <div id="paper-sglang-router" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="SGLang 문서 · PD Disaggregation 및 sgl-router README"
            citeKey={5}
            href="https://docs.sglang.io/advanced_features/pd_disaggregation.html"
            type="code"
          >
            disaggregation-mode prefill·decode, Mooncake와 NIXL transfer backend,
            disaggregation-bootstrap-port, router의 pd-disaggregation·prefill·decode 인자를
            정의합니다. Cache-aware policy의 근사 radix tree와 balance_abs_threshold·
            balance_rel_threshold 판정, cache_threshold는 sgl-router README가 설명합니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 읽기는 한 replica 안에서 tensor·pipeline·data parallel을 어떻게 나누는지
            다루는 <Link to="/ai/vllm-serving#parallel-layout">vLLM serving 글의 parallel layout</Link>과,
            요청률에서 replica 수와 admission을 정하는{" "}
            <Link to="/ai/llm-serving-capacity#capacity-admission">serving capacity 글</Link>입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
