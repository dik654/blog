import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import SglangRuntimeAnatomyViz from "./sglang-runtime-anatomy/viz/SglangRuntimeAnatomyViz";
import AdmissionPolicyViz from "./sglang-runtime-anatomy/viz/AdmissionPolicyViz";
import RatioRetractViz from "./sglang-runtime-anatomy/viz/RatioRetractViz";
import RetractOrderViz from "./sglang-runtime-anatomy/viz/RetractOrderViz";
import OverlapTimelineViz from "./sglang-runtime-anatomy/viz/OverlapTimelineViz";
import { codeRefs } from "./sglang-runtime-anatomy/codeRefs";
import { sglangRuntimeTrees } from "./sglang-runtime-anatomy/fileTree";
import {
  InferenceRuntimeMapReturn,
  InferenceRuntimeSeriesLocator,
} from "./shared/InferenceRuntimeSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function SglangRuntimeAnatomyArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => (
    <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />
  );

  return (
    <>
      <InferenceRuntimeSeriesLocator current="sglang" />
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 같은 4,096칸에 3개를 받을지 20개를 받을지는 장부가 정합니다</h2>
          <SglangRuntimeAnatomyViz />
          <div className={prose}>
            <p className="text-lg leading-8">
              GPU 한 장에 KV를 담을 칸이 4,096개 있고 입력 200 token에 출력 상한 1,000 token인 요청이 줄지어 기다린다고 해 봅시다. 실제 출력은 300
              token에서 끝나지만 서버는 그 사실을 미리 모릅니다. 끝까지 쓸 칸을 미리 잡으면 3개, 지금 쓸 칸만 잡으면 20개가 들어갑니다. (가정)
            </p>
            <p>
              SGLang은 그 사이를 고릅니다. KV를 한 token 칸 단위로 나눠 요청별 번호 표로 잇고 아직 만들지 않은 출력은 상한에 비율을 곱한 만큼만 장부에 올립니다. 그
              비율은 0.7에서 시작해 조금씩 내려가며 칸이 모자라 요청을 되돌릴 때마다 실제 진행률로 다시 셉니다.
            </p>
            <p>
              장부를 덜 보수적으로 잡으면 CPU가 매 step 할 일도 늘어납니다. SGLang은 GPU가 지금 batch를 계산하는 동안 CPU가 앞 batch의 결과를 처리하고
              다음 batch를 고르도록 순서를 바꿉니다. 이 글은 이 네 가지를 같은 요청 하나로 따라가고, 마지막에 고정 원문의 줄 번호로 확인합니다.
            </p>
          </div>
          <ContentBoundary article="sglang-runtime-anatomy" />
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 스케줄러는 매 step 세 가지를 정합니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 SGLang 서버는 요청을 받아 token을 돌려주는 상자입니다. 안에서는 scheduler 하나가 반복해서 돌며 매번 세 질문에 답합니다. 기다리는
              요청 중 몇 개를 새로 받을지, 받은 요청의 KV를 어느 칸에 쓸지, 칸이 모자라면 누구를 뺄지입니다.
            </p>
            <p>
              입력은 대기열, 지금 비어 있는 칸 수, 실행 중 요청들이 지금까지 만든 출력 수입니다. 출력은 이번 step에 GPU가 계산할 batch와 대기열로 돌려보낼
              요청 목록입니다. 모델의 가중치나 attention 계산 방법은 이 상자의 질문이 아닙니다.
            </p>
            <p>
              같은 상자를 vLLM과 TensorRT-LLM도 가지고 있습니다. 세 엔진이 갈리는 곳은 아직 생성하지 않은 출력을 장부에 어떻게 적느냐입니다. 미리 세는 양이
              다르면 같은 4,096칸에서도 받는 요청 수와 되돌리는 빈도가 달라집니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 입력 200, 상한 1,000, 실제 300인 요청을 넣어 봅니다</h2>
          <div className={prose}>
            <p>
              칸은 token 하나의 KV를 담는 자리입니다. 요청 A·B·C·D…는 모두 입력 200 token, 출력 상한 1,000 token이고, 실제로는 300 token을 만든 뒤 끝을
              뜻하는 token을 냅니다. prefix 재사용은 없고 칸은 한 token 단위로 나눈다고 둡니다. (가정)
            </p>
            <p>
              첫째 장부는 끝까지 예약합니다. 요청 하나에 200+1,000=1,200칸을 잡으므로 4,096÷1,200=3.41, 즉 3개입니다. 세 요청이 끝까지 가도 실제로 쓰는
              칸은 3×500=1,500칸이고 나머지 2,596칸은 한 번도 쓰이지 않습니다.
            </p>
            <p>
              둘째 장부는 이번에 쓸 칸만 셉니다. 입력 200칸씩이면 4,096÷200=20.48, 즉 20개가 들어가 4,000칸이 찹니다. decode 한 번에 20칸씩 늘어나므로
              네 번 뒤에는 16칸이 남고, 다섯 번째 decode에서 한 요청을 빼야 합니다. 그 요청의 KV 204칸은 버리고 나중에 다시 계산합니다.
            </p>
            <p>
              셋째 장부가 SGLang입니다. 새 요청은 200+1,000에 한 칸을 더한 1,201칸으로 심사해 첫 회에는 3개를 받습니다. 그다음 회에는 실행 중인 A·B·C의
              남은 출력 999개를 0.7배인 699.3칸으로 줄여 셈하므로 D가 들어와 4개가 됩니다.
            </p>
          </div>
        </section>

        <section id="picture" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 세 장부를 같은 막대 위에 그려 봅니다</h2>
          <div className={prose}>
            <p>
              그림의 막대 하나가 4,096칸입니다. 진한 칸은 KV를 실제로 쓴 자리이고 옅은 칸은 아직 쓰지 않았지만 장부에 잡아 둔 자리입니다. 장면을 넘기며
              옅은 칸의 길이가 어떻게 받는 요청 수를 바꾸는지 보세요.
            </p>
            <p>
              첫 장면은 옅은 칸이 막대의 대부분을 차지합니다. 둘째와 셋째 장면은 옅은 칸이 아예 없어 진한 칸이 막대를 채운 뒤 넘칩니다. 넷째와 다섯째 장면의 옅은 칸은 두 극단
              사이 길이이며 둘째 회에 줄어든 몫만큼 D가 들어옵니다.
            </p>
          </div>
          <AdmissionPolicyViz />
        </section>

        <section id="why" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 출력 길이를 모르니 세 장부 모두 무언가를 포기합니다</h2>
          <div className={prose}>
            <p>
              출력이 몇 token에서 끝날지는 모델이 끝 token을 뽑는 순간에야 압니다. 서버가 아는 것은 상한 1,000뿐입니다. 그래서 미래 칸을 얼마나 잡을지는
              추측이며, 추측이 어긋나는 방향에 따라 치르는 비용이 다릅니다.
            </p>
            <p>
              끝까지 예약하면 되돌릴 일이 없지만 2,596칸이 비어 있는 동안 다른 요청이 기다립니다. 이번 칸만 잡으면 처음에 많이 받지만 출력이 자라는 순간 누군가를
              빼고 그 KV를 다시 계산해야 합니다. 앞쪽은 동시성을, 뒤쪽은 계산량과 지연의 흔들림을 포기합니다.
            </p>
            <p>
              SGLang의 장부는 미래 몫을 일부만 세고 틀렸을 때 고칩니다. 그러려면 세 가지가 필요합니다. 칸을 잘게 나눠 남는 자리가 적어야 하고, 비율을 고칠 규칙이 있어야
              하고, 틀렸을 때 뺄 요청을 고르는 규칙이 있어야 합니다. 장부 계산이 잦아지면 CPU 시간이 GPU를 기다리게 하지 않을 방법도 필요합니다.
            </p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 칸, 표, 비율, 되돌리기, 겹치기에 이름을 붙입니다</h2>
          <div className={prose}>
            <p>
              이제부터는 원문 이름을 씁니다. 칸이 한 token씩인 저장소는 token_to_kv pool이고, 요청마다 한 행을 주어 위치별 칸 번호를 적는 표는 req_to_token
              입니다. 둘을 함께 token 단위 2단 KV pool이라고 부르겠습니다.
            </p>
            <p>실행 중 요청의 남은 출력에 곱하는 수는 new_token_ratio입니다. 이 값으로 줄여 센 예약을 쓰는 심사를 비율 기반 수용 추정이라고 부르겠습니다.</p>
            <p>
              다음 decode에 쓸 칸이 없을 때 요청을 빼서 KV를 돌려주고 대기열로 보내는 일을 SGLang은 retract라고 부릅니다. vLLM 문서의 recompute preemption과
              결과는 같지만 고르는 순서와 비율 재계산이 붙는다는 점이 다릅니다.
            </p>
            <p>
              CPU의 결과 처리와 다음 batch 준비를 GPU 계산과 겹쳐 돌리는 반복문은 overlap scheduler입니다. SGLang v0.4 발표에서는 zero-overhead batch
              scheduler라는 이름으로 소개했습니다.
            </p>
          </div>
          <TermBreakdown
            title="이 글에서 쓰는 원문 이름"
            items={[
              { term: "token_to_kv pool", description: "층마다 K와 V를 한 token 칸씩 담는 GPU 배열입니다.", example: "4,096칸이면 첫 축이 4,097행입니다(덧붙인 1행 포함).", boundary: "page_size를 1보다 크게 주면 칸을 page 단위로 할당합니다." },
              { term: "req_to_token", description: "요청 행 × 위치 열의 int32 표로, 칸에는 token_to_kv pool의 번호가 들어갑니다.", example: "D행의 0~199열에 D 입력 KV의 칸 번호가 적힙니다.", boundary: "행 길이는 실제 길이가 아니라 max_context_len으로 고정합니다." },
              { term: "new_token_ratio", description: "실행 중 요청의 남은 출력 상한에 곱해 장부에 올리는 비율입니다.", example: "남은 999개 × 0.7 = 699.3칸.", boundary: "새로 심사받는 요청에는 곱하지 않고 ignore_eos 요청은 1.0을 씁니다." },
              { term: "retract", description: "다음 decode 칸이 부족할 때 요청을 빼 KV를 반환하고 대기열로 보냅니다.", example: "출력 100개인 요청을 빼면 300칸이 비고 나중에 최대 300 token을 다시 계산합니다.", boundary: "decode 분리 배치에서는 host로 백업해 재계산을 피하는 경로가 따로 있습니다." },
              { term: "overlap scheduler", description: "GPU가 step n을 계산하는 동안 CPU가 step n−1 결과를 처리하고 step n+1을 고르는 반복문입니다.", example: "CPU 2ms·GPU 10ms 가정에서 step 간격 12ms가 10ms가 됩니다.", boundary: "결과를 한 step 늦게 읽으므로 EOS 뒤 token 하나를 더 계산할 수 있습니다." },
            ]}
          />
        </section>

        <section id="request-trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 요청 D 하나를 도착부터 반환까지 따라갑니다</h2>
          <div className={prose}>
            <p>
              첫 회에 A·B·C가 들어가 prefill을 마쳤습니다. 각자 입력 200칸에 KV를 썼고 첫 출력 token을 하나 뽑았습니다. 그 token의 KV는 다음 decode에서 쓰므로
              지금 쓴 칸은 600칸입니다. 둘째 회의 scheduler가 D를 심사합니다.
            </p>
            <p>
              빈 칸은 4,096−600=3,496입니다. 실행 중 요청의 예약은 (1,000−1)×0.7=699.3칸씩, 합 2,097.9칸입니다. 남은 몫은 3,496−2,097.9=1,398.1이고 D의
              1,201보다 크므로 D가 batch에 들어갑니다. 다음 E는 남은 197.1칸과 비교해 기다립니다.
            </p>
            <p>
              D가 들어가면 req_to_token의 빈 행 하나를 받습니다. allocator가 token_to_kv pool에서 200칸을 내주고 그 번호들이 D행의 0~199열에
              적힙니다. prefill은 이 번호가 가리키는 칸에 32층의 K와 V를 씁니다.
            </p>
            <p>
              decode마다 D는 한 칸을 더 받습니다. 300번째 출력이 끝 token이면 D는 끝나고, D행과 500칸이 반환됩니다. radix cache를 켰다면 이 칸들은 바로
              지워지지 않고 다른 요청이 같은 앞부분을 다시 쓸 수 있게 tree에 남습니다. 그 과정은{" "}
              <Link to="/cs/ai/prefix-caching-radix-attention#radix-source">프리픽스 캐시 글</Link>에서 다룹니다.
            </p>
          </div>
        </section>

        <section id="kv-pool" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 칸 번호 표와 층별 KV 배열을 원문에서 봅니다</h2>
          <div className={prose}>
            <p>
              고정한 SGLang commit 4560da5의 memory_pool.py 374–408행에서 ReqToTokenPool은 (size+1, max_context_len) 모양의 int32 tensor를 만듭니다. 덧붙인
              0번 행은 CUDA graph가 빈자리를 채우려고 넣은 가짜 요청이 읽고 쓰는 자리입니다. 그래서 free_slots는 1부터 셉니다.
            </p>
            <p>
              같은 파일 2518–2529행의 _kv_buffer_shapes는 기본 NHD 배치에서 (size+page_size, head_num, head_dim)을 돌려줍니다. 2574–2582행은 이 모양으로
              층마다 K tensor 하나와 V tensor 하나를 만듭니다. 칸 번호 i는 모든 층 배열의 i번째 행을 가리킵니다.
            </p>
            <p>
              vLLM은 같은 일을 block table로 합니다. 요청의 논리 block을 16칸짜리 물리 block에 잇고, attention이 그 table을 따라 읽습니다. 201칸이 필요한
              요청은 block 13개, 즉 208칸을 잡아 7칸이 빕니다. page 1인 SGLang은 201칸만 씁니다.
            </p>
            <p>
              칸이 잘면 재사용 길이도 정확해집니다. 앞 6 token이 같은 두 요청은 page 1에서 6칸을 함께 쓰지만 page 4에서는 4칸만 함께 씁니다. 대신 표는
              요청마다 최대 길이만큼의 행을 미리 차지합니다.
            </p>
          </div>
          {code("req-to-token", "요청 행과 칸 번호 표")}
          {code("kv-buffer-shape", "층별 K·V 배열의 모양")}
          <CalculationWalkthrough
            title="KV 배열과 칸 번호 표의 크기"
            question="4,096칸 pool과 요청 64개분 표는 각각 몇 byte인가요?"
            scope="32층, KV head 8개, head 차원 128, BF16(2byte), max_running_requests 64, max_context_len 8,192를 가정합니다. allocator의 부가 구조와 CUDA graph 버퍼는 넣지 않았습니다."
            steps={[
              { label: "한 층 한 칸의 K", expression: "8 head × 128 × 2byte", result: "2,048byte", reason: "NHD 배열의 한 행이 head 8개의 key 벡터입니다." },
              { label: "한 층 한 칸의 K와 V", expression: "2,048 × 2", result: "4,096byte", reason: "K tensor와 V tensor가 층마다 따로 있으므로 두 배입니다." },
              { label: "모든 층의 한 칸", expression: "4,096 × 32층", result: "131,072byte = 128KiB", reason: "칸 번호 하나가 32층 배열 모두의 같은 행을 가리킵니다." },
              { label: "pool 전체", expression: "(4,096+1)행 × 128KiB", result: "512.1MiB", reason: "page_size 1을 더한 4,097행입니다. 덧붙인 행은 padding token의 가짜 쓰기를 받습니다." },
              { label: "칸 번호 표", expression: "(64+1)행 × 8,192열 × 4byte", result: "2,129,920byte ≈ 2.03MiB", reason: "행 길이는 실제 길이와 관계없이 max_context_len입니다. KV pool의 약 0.4%입니다." },
            ]}
            conclusion="칸을 한 token으로 잘게 나눠도 칸 번호 표는 KV의 1%에도 못 미칩니다. 대신 표의 행 수와 길이가 동시 요청 수와 최대 문맥을 먼저 고정합니다."
            caveats={["모델 크기는 설명용 가정입니다.", "page_size를 키우거나 HND 배치를 고르면 배열 모양이 달라집니다."]}
          />
        </section>

        <section id="admission-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 새 요청은 1,201칸, 실행 중 요청은 남은 출력×비율로 셉니다</h2>
          <div className={prose}>
            <p>
              비율이 어디에 곱해지는지가 이 장부의 핵심입니다. schedule_policy.py 1336–1354행의 add_one_req는 새 요청을 입력 길이와 잘린 max_new_tokens 전체,
              page 하나를 더한 total_tokens로 심사합니다. 새 요청에는 비율을 곱하지 않습니다.
            </p>
            <p>
              비율은 이미 실행 중인 요청에만 붙습니다. 642–649행이 running batch의 각 요청에 대해 754–764행의 함수를 불러, 남은 출력 상한에
              new_token_ratio를 곱한 값을 장부에 더합니다. 그래서 첫 회에는 끝까지 예약과 같은 3개가 들어가고 둘째 회부터 차이가 납니다.
            </p>
            <p>
              prefill_budget.py 114–129행의 심사는 엄격한 부등식입니다. 남은 몫이 정확히 1,201칸이면 1,201칸짜리 요청은 들어가지 못합니다. 받아들인 요청은
              155–171행의 reserve가 같은 회의 장부에 바로 더해, 다음 후보는 줄어든 몫과 비교합니다.
            </p>
            <p>
              80–87행의 주석은 4096이라는 상한이 장부에만 쓰인다고 적습니다. max_new_tokens가 32,000인 요청도 4096으로 셈하지만 실제 생성은 32,000까지 갈
              수 있습니다. 그 차이는 retract가 메웁니다.
            </p>
          </div>
          {code("new-request-charge", "새 요청의 total_tokens")}
          {code("running-offset", "실행 중 요청의 예약 합")}
          {code("ratio-offset", "남은 출력×비율")}
          {code("prefill-budget", "엄격한 부등식과 reserve")}
          {code("clip-max-new", "추정 상한 4096")}
          <ExplainedFormula
            question="둘째 회에 D를 받을 수 있는지는 어떤 부등식으로 정하나요?"
            idea="지금 비어 있는 칸에서 실행 중 요청이 앞으로 쓸 것으로 추정한 칸과 이번 회에 이미 받은 요청의 몫을 뺍니다. 새 요청의 전체 몫이 그보다 작아야 합니다."
            formula={String.raw`e+m+1 < (A+E)-\sum_{i\in\text{run}}\min(m_i-g_i,\,4096)\,\rho-\sum_{j\in\text{new}}(e_j+1+m_j)`}
            annotatedFormula={String.raw`\underbrace{e+m+1}_{\text{새 요청의 전체 몫}} < \underbrace{(A+E)}_{\text{빈 칸+지울 수 있는 칸}}-\underbrace{\sum_{i\in\text{run}}\min(m_i-g_i,\,4096)\,\rho}_{\text{실행 중 요청의 추정 예약}}-\underbrace{\sum_{j\in\text{new}}(e_j+1+m_j)}_{\text{이번 회에 먼저 받은 몫}}`}
            operations={[
              { expression: String.raw`e+m+1`, annotation: ["입력 칸과 잘린 출력 상한, page 하나를 더해", "새 요청에는 비율 없이 전체 몫 계산"] },
              { expression: String.raw`\min(m_i-g_i,\,4096)\,\rho`, annotation: ["실행 중 요청의 남은 상한을 4096으로 자르고 비율을 곱해", "끝까지 예약보다 작은 추정 몫 계산"] },
              { expression: String.raw`(A+E)-\sum\cdots-\sum\cdots`, annotation: ["빈 칸에서 두 예약을 빼", "이번 후보가 비교할 남은 몫 확정"] },
            ]}
            terms={[
              { symbol: "e", name: "새로 계산할 입력 길이", description: "prefix cache에서 찾은 앞부분을 뺀 입력 token 수입니다. D는 200입니다." },
              { symbol: "m", name: "잘린 출력 상한", description: "min(max_new_tokens, 4096)입니다. D는 1,000입니다." },
              { symbol: "A", name: "빈 칸 수", description: "allocator가 지금 내줄 수 있는 칸입니다. 둘째 회는 4,096−600=3,496입니다." },
              { symbol: "E", name: "지울 수 있는 칸", description: "radix cache에 남았지만 아무 요청도 잠그지 않은 칸입니다. 이 사례는 0입니다." },
              { symbol: String.raw`g_i`, name: "실행 중 요청이 만든 출력 수", description: "A·B·C는 둘째 회에 1입니다." },
              { symbol: String.raw`\rho`, name: "new_token_ratio", description: "기본 시작값 0.7입니다. ignore_eos 요청에는 1.0을 씁니다." },
            ]}
            assumptions={["page_size 1, prefix 재사용 없음, KV 분할과 Mamba 상태 없음의 단순 경로입니다.", "실제 코드의 total_tokens에는 shard·Mamba·요청 슬롯 예약이 더해질 수 있습니다."]}
            interpretation="A·B·C 예약 합 2,097.9를 빼면 남은 몫은 1,398.1이고 D의 1,201이 더 작아 들어갑니다. D를 받은 뒤 남은 197.1은 E의 1,201보다 작아 E는 기다립니다."
          />
          <CalculationWalkthrough
            title="둘째 회의 장부"
            question="A·B·C가 첫 출력을 하나씩 만든 직후 D와 E는 들어갈 수 있나요?"
            scope="4,096칸, 입력 200, 상한 1,000, page 1, ρ=0.7, prefix 재사용 없음의 가정입니다. 실행 중 요청의 첫 출력 token KV는 아직 쓰지 않았습니다."
            steps={[
              { label: "빈 칸", expression: "4,096 − 3 × 200", result: "3,496칸", reason: "prefill이 입력 200칸씩 썼습니다." },
              { label: "실행 중 요청 하나의 예약", expression: "(1,000 − 1) × 0.7", result: "699.3칸", reason: "남은 상한 999에 비율을 곱합니다." },
              { label: "세 요청의 예약", expression: "699.3 × 3", result: "2,097.9칸", reason: "A·B·C 세 행의 몫을 더합니다." },
              { label: "D가 비교할 남은 몫", expression: "3,496 − 2,097.9", result: "1,398.1칸", reason: "1,201 < 1,398.1이므로 D가 들어갑니다." },
              { label: "E가 비교할 남은 몫", expression: "1,398.1 − 1,201", result: "197.1칸", reason: "1,201 < 197.1이 거짓이므로 E는 기다립니다." },
            ]}
            conclusion="같은 요청이라도 실행 중에는 699.3칸, 새로 들어올 때는 1,201칸으로 셈합니다. 이 비대칭 덕분에 둘째 회부터 끝까지 예약보다 1개를 더 받습니다."
          />
        </section>

        <section id="ratio-decay" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 비율은 step마다 0.001003씩 내려가 0.098에서 멈춥니다</h2>
          <div className={prose}>
            <p>
              new_token_ratio_tracker.py 21–32행의 from_config는 시작값을 0.7×schedule_conservativeness로, 바닥을 시작값×0.14로, 한 step 감소량을 둘의 차를
              600으로 나눈 값으로 정합니다. 환경 기본값은 environ.py 597–601행에 있고 schedule_conservativeness의 기본값은 1.0입니다.
            </p>
            <p>
              기본값을 넣으면 시작 0.7, 바닥 0.098, 감소량 (0.7−0.098)÷600=0.001003입니다. scheduler.py 4416–4418행은 retract가 없던 decode step마다
              decay_step을 부릅니다. 600번 연속 무사히 지나가면 비율은 바닥에 닿습니다.
            </p>
            <p>
              바닥 0.098에서는 남은 출력 850개짜리 요청도 83.3칸으로만 셈합니다. 서버가 오래 안정적으로 돌수록 장부가 점점 과감해지고, 더 많은 요청이 함께
              들어옵니다. schedule_conservativeness를 크게 주면 시작값과 바닥이 함께 올라갑니다. 그 설정의 운영 맥락은{" "}
              <Link to="/cs/ai/serving-memory-admission-and-preemption#engine-settings">메모리 수용 글의 엔진 설정 절</Link>에 있습니다.
            </p>
          </div>
          {code("ratio-tracker", "비율의 시작·바닥·감소량")}
          {code("ratio-env", "다섯 기본값")}
          <RatioRetractViz />
        </section>

        <section id="retract" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 칸이 모자라면 출력이 가장 적은 요청부터 대기열로 돌려보냅니다</h2>
          <div className={prose}>
            <p>
              비율이 낮아질수록 장부는 틀릴 수 있습니다. schedule_batch.py 3281–3298행의 check_decode_mem은 다음 decode 한 번에 필요한 칸이 있는지만 봅니다.
              page 1에서 요청 네 개면 네 칸입니다. 이 검사가 실패하면 retract_decode가 불립니다.
            </p>
            <p>
              3390–3429행의 기본 순서는 출력 수 내림차순이고 출력 수가 같으면 입력이 짧은 요청을 앞에 둡니다. 3300–3388행은 이 목록의 끝에서부터 하나씩 빼므로 출력을
              가장 적게 만든 요청이 먼저 나갑니다. 끝에 가까운 요청을 살려 두는 순서입니다.
            </p>
            <p>
              출력 250·200·150·100개인 네 요청이 있다고 해 봅시다. 100개짜리가 먼저 빠지고 그 KV 300칸은 radix tree에 넣지 않고 바로 반환됩니다. 다시
              들어올 때는 입력 200과 이미 만든 출력 100을 합친 최대 300 token을 prefill로 다시 계산합니다. (가정)
            </p>
            <p>
              빼고 나면 남은 세 요청의 실제 진행률로 비율을 다시 셉니다. 원문의 식은 이미 만든 출력 합에 요청당 20 step의 여유를 더하고 상한 합으로 나눕니다.
              바닥 근처에 있던 비율이 0.2199로 올라가 다음 수용을 다시 조심스럽게 만듭니다.
            </p>
          </div>
          <RetractOrderViz />
          {code("decode-mem", "다음 decode의 칸 검사")}
          {code("retract-order", "기본 retract 순서")}
          {code("retract-decode", "retract와 비율 재계산")}
          {code("update-running", "decode 직전의 분기")}
          <ExplainedFormula
            question="retract 뒤의 새 비율은 어떻게 정하나요?"
            idea="남은 요청들이 상한 대비 지금까지 얼마나 만들었는지에 앞으로 20 step의 여유를 더해 비율로 씁니다."
            formula={String.raw`\rho' = \min\!\left(1,\ \frac{\sum_i g_i + 20\,n}{\sum_i M_i + 1}\right)`}
            annotatedFormula={String.raw`\rho' = \min\!\left(1,\ \frac{\overbrace{\sum_i g_i}^{\text{이미 만든 출력}} + \overbrace{20\,n}^{\text{요청당 20 step 여유}}}{\underbrace{\sum_i M_i}_{\text{max\_new\_tokens 합}} + \underbrace{1}_{\text{0 나눗셈 방지}}}\right)`}
            operations={[
              { expression: String.raw`\sum_i g_i + 20\,n`, annotation: ["남은 요청이 만든 출력을 더하고", "요청마다 20 step 몫을 얹어 분자 계산"] },
              { expression: String.raw`\sum_i M_i + 1`, annotation: ["잘리지 않은 max_new_tokens를 더해", "1을 더한 분모 계산"] },
              { expression: String.raw`\min(1,\cdot)`, annotation: ["1을 넘지 않게 잘라", "끝까지 예약보다 보수적이 되지 않게 제한"] },
            ]}
            terms={[
              { symbol: String.raw`g_i`, name: "남은 요청 i가 만든 출력 수", description: "retract 뒤 batch에 남은 요청만 셉니다." },
              { symbol: "n", name: "남은 요청 수", description: "이 사례는 3입니다." },
              { symbol: String.raw`M_i`, name: "요청 i의 max_new_tokens", description: "4096으로 자르지 않은 원래 값입니다." },
              { symbol: "20", name: "SGLANG_RETRACT_DECODE_STEPS", description: "환경 기본값 20입니다." },
            ]}
            interpretation="(250+200+150+20×3)÷(3×1,000+1)=660÷3,001=0.2199입니다. 다음 수용부터는 남은 출력 850개짜리 요청을 83.3칸이 아니라 186.9칸으로 셈합니다."
          />
          <ProgressiveDetail
            title="retract가 요청을 버리는 경우는 언제인가요?"
            preview="빔 탐색 묶음과, 하나만 남아도 칸이 모자란 요청은 대기열이 아니라 오류로 끝납니다."
          >
            <div className={prose}>
              <p>
                같은 함수에서 beam_group이 있는 요청은 되돌리지 않고 FINISH_ABORT로 끝냅니다. 원문 주석은 빔 묶음을 retract할 수 없다고 적습니다. 마지막
                한 요청까지 남겼는데도 다음 칸이 없으면 scheduler를 멈추는 대신 그 요청을 중단합니다.
              </p>
              <p>
                decode 분리 배치에서는 release_req가 KV를 host로 백업한 뒤 반환합니다. 백업에 실패하면 되살릴 KV가 없으므로 그 요청도 중단합니다. 일반 단일
                서버 경로에서는 백업 없이 반환하고 나중에 다시 계산합니다.
              </p>
            </div>
          </ProgressiveDetail>
        </section>

        <section id="overlap-loop" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. CPU는 한 batch 앞서 고르고 결과는 한 step 늦게 읽습니다</h2>
          <div className={prose}>
            <p>
              장부 심사, radix 탐색, 결과의 끝 판정은 모두 CPU에서 일어납니다. 이 일을 GPU가 끝나기를 기다렸다가 하면 그동안 GPU가 놉니다. CPU 일을 1ms씩
              두 번, GPU decode를 10ms로 가정하면 한 step이 12ms이고 GPU는 그중 2ms를 쉽니다. (가정)
            </p>
            <p>
              scheduler.py 1975–2048행의 event_loop_overlap은 순서를 바꿉니다. 이번 batch를 run_batch로 GPU에 넣으면 결과를 기다리지 않고
              돌아오고 그 결과 묶음은 result_queue에 쌓입니다. 그다음에야 queue 앞의 결과, 즉 한 step 앞 batch의 결과를 처리합니다.
            </p>
            <p>
              다음 step의 입력은 방금 뽑은 token인데, CPU는 아직 그 값을 모릅니다. overlap_utils.py 116–121행은 다음 batch의 input_ids를 GPU 버퍼
              output_tokens_buf에서 요청 행 번호로 모아 씁니다. 값이 CPU를 거치지 않으니 CPU는 숫자를 모른 채 다음 step을 제출할 수 있습니다.
            </p>
            <p>
              가정한 시간으로 세 step을 돌리면 직렬은 36ms, 겹치기는 32ms에 끝납니다. 길게 돌리면 step 간격이 12ms에서 10ms로 줄어 같은 시간에 1.2배의
              step을 돌립니다. 이 배수는 가정에서 나온 값이며 SGLang 팀이 발표한 측정값과는 다릅니다.
            </p>
            <p>
              CPU가 GPU를 기다리는 일반적인 모습과 비동기 제출의 원리는{" "}
              <Link to="/cs/ai/launch-overhead-and-cpu-gpu-synchronization#async-trace">launch 오버헤드 글</Link>에서 작은 수치로 다룹니다. 이 절은 그
              원리를 SGLang의 반복문이 어떻게 구현하는지에 한정합니다.
            </p>
          </div>
          {code("overlap-loop", "event_loop_overlap")}
          {code("future-map", "GPU 버퍼에서 다음 입력 읽기")}
          <AlgorithmBlock
            title="겹치는 scheduler 반복문 (의사코드, 원문 1975–2048행 요약)"
            input={["대기열과 running batch", "result_queue: 아직 처리하지 않은 (batch, 결과) 묶음"]}
            steps={[
              { code: "ingest_requests()", note: "새 요청을 대기열에 넣습니다." },
              { code: "batch_n ← get_next_batch_to_run(running, last_batch)", note: "장부 심사·retract·끝날 요청 제외가 여기서 일어납니다." },
              { code: "if disable_overlap(batch_n, last_batch): process(result_queue.popleft())", note: "겹치기를 끄는 batch면 앞 결과를 먼저 처리합니다." },
              { code: "result_n ← run_batch(batch_n)", note: "GPU에 넣고 결과를 기다리지 않고 돌아옵니다." },
              { code: "result_queue.append((batch_n, result_n))", note: "결과는 다음 바퀴에 처리합니다." },
              { code: "if last_batch and not disabled: process(result_queue.popleft())", note: "step n이 GPU에서 도는 동안 step n−1의 결과를 처리합니다." },
              { code: "last_batch ← batch_n", note: "다음 바퀴의 비교 기준을 바꿉니다." },
            ]}
            output="GPU가 쉬지 않는 batch 순서와, 한 step 늦게 반영되는 결과"
            repeatUntil="서버 종료"
          />
          <OverlapTimelineViz />
        </section>

        <section id="overlap-edges" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 길이로 끝날 요청은 미리 빼고, EOS로 끝날 요청은 한 token을 더 계산합니다</h2>
          <div className={prose}>
            <p>
              결과를 한 step 늦게 읽는 대가는 끝 판정이 늦어진다는 점입니다. 요청 X가 step 1에서 끝 token을 뽑아도 CPU는 step 2를 이미 X를 포함해 제출한
              뒤에야 그 사실을 압니다. 그림의 셋째 장면처럼 X의 token 하나를 더 계산하고 버립니다.
            </p>
            <p>
              끝나는 시점을 미리 아는 경우는 다릅니다. scheduler.py 4320–4333행의 _reqs_finishing_inflight는 queue에 남은 결과가 max_new_tokens에 닿는
              요청을 찾아 다음 batch에서 뺍니다. 길이 상한은 token 값과 무관하게 셀 수 있기 때문입니다.
            </p>
            <p>
              2050–2086행은 겹치기를 끄는 조건입니다. 연속 prefill에서 끄는 선택은 첫 batch의 첫 token 지연을 줄이기 위한 것으로 환경 변수
              SGLANG_DISABLE_CONSECUTIVE_PREFILL_OVERLAP으로만 켜지며 기본값은 False입니다. 문법 제약 생성과 speculative decoding이 함께 쓰이는 일부
              경우에도 결과를 먼저 처리합니다.
            </p>
            <p>
              TensorRT-LLM 문서도 같은 발상의 overlap scheduler를 기본으로 켜고, 한 decode step이 추가로 생긴다는 대가를 적습니다. 그 문서의 참고 목록에
              SGLang v0.4 발표가 들어 있습니다.
            </p>
          </div>
          {code("update-running", "끝날 요청 제외")}
          {code("overlap-disable", "겹치기를 끄는 조건")}
          <div id="trtllm-overlap" className="mt-8 scroll-mt-20">
            <CitationBlock source="TensorRT-LLM · Overlap Scheduler · Tradeoff" citeKey={1} href="https://nvidia.github.io/TensorRT-LLM/features/overlap-scheduler.html">
              <q>The optimization introduces one extra decoding step but significantly improves throughput.</q>
            </CitationBlock>
            <div className={prose}>
              <p>문서는 처리량 개선의 크기를 수치로 적지 않습니다. 같은 문서의 참고 목록이 NanoFlow 논문과 SGLang v0.4 글을 듭니다.</p>
            </div>
          </div>
        </section>

        <section id="backends" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">14. attention 커널은 갈아 끼우는 부품이고 장부가 엔진의 성격입니다</h2>
          <div className={prose}>
            <p>
              SGLang 공식 서버 인자 문서는 --attention-backend의 선택지로 triton, fa3, fa4, flashinfer, flashmla, trtllm_mha 등을 나열하고 기본값은 None입니다.
              지정하지 않으면 모델과 GPU에 맞춰 고릅니다. prefill과 decode의 backend를 따로 지정하는 인자도 있습니다.
            </p>
            <p>
              trtllm_mha라는 이름이 보여 주듯 SGLang은 TensorRT-LLM 계열의 attention 커널도 부를 수 있습니다. 같은 커널을 여러 엔진이 공유한다면 엔진을
              가르는 것은 커널보다 이 글이 따라온 장부와 반복문입니다.
            </p>
            <p>
              같은 문서의 기본값 중 이 글의 장부와 관계있는 값은 아래와 같습니다. 2026-10-14에 고정 commit의 server_arguments.mdx에서 확인했습니다.
            </p>
          </div>
          <TermBreakdown
            title="장부와 반복문을 바꾸는 인자의 기본값"
            items={[
              { term: "--page-size", description: "한 page의 token 수입니다.", example: "기본값 1. 이 글의 한 token 칸입니다.", boundary: "FlashMLA backend는 page 64만 받아 값을 64로 바꿉니다." },
              { term: "--schedule-policy", description: "대기열에서 후보를 고르는 순서입니다.", example: "기본값 fcfs. lpm·dfs-weight·priority 등을 고를 수 있습니다.", boundary: "장부의 비율 계산과는 별개입니다." },
              { term: "--schedule-conservativeness", description: "new_token_ratio의 시작값과 바닥에 곱하는 배수입니다.", example: "기본값 1.0. retract가 잦으면 키우라고 문서가 안내합니다.", boundary: "시작값은 1.0을 넘지 않게 잘립니다." },
              { term: "--mem-fraction-static", description: "가중치와 KV pool에 쓰는 GPU 메모리 비율입니다.", example: "지정하지 않으면 (GPU 메모리−예약)÷GPU 메모리로 계산하고, 메모리를 못 읽으면 0.88입니다.", boundary: "이 비율이 4,096칸 같은 pool 크기를 정합니다." },
              { term: "--radix-eviction-policy", description: "지울 수 있는 칸을 고르는 순서입니다.", example: "기본값 lru. lfu·slru·priority도 있습니다.", boundary: "retract한 KV는 tree에 넣지 않으므로 이 정책의 대상이 아닙니다." },
              { term: "--disable-overlap-schedule", description: "overlap scheduler를 끕니다.", example: "기본값 False. 즉 겹치기가 켜져 있습니다.", boundary: "CPU 장치 같은 일부 설정은 자동으로 끕니다." },
            ]}
          />
          <div id="paper-sglang-server-args" className="mt-8 scroll-mt-20">
            <CitationBlock source="SGLang docs · Server Arguments" citeKey={2} href="https://docs.sglang.io/docs/advanced_features/server_arguments">
              <q>A larger value means more conservative scheduling.</q>
            </CitationBlock>
            <div className={prose}>
              <p>schedule_conservativeness 설명의 한 문장입니다. 이 값이 원문에서 0.7과 곱해진다는 연결은 new_token_ratio_tracker.py에서 확인했습니다.</p>
            </div>
          </div>
        </section>

        <section id="paper-sglang-v04" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">15. SGLang 팀은 겹치기로 1.1배를 보고했습니다</h2>
          <div className={prose}>
            <p>
              SGLang v0.4 발표 글은 CPU의 batch 고르기, 메모리 할당, prefix 탐색을 GPU 계산과 겹쳐 GPU가 쉬지 않게 했다고 설명합니다. 발상은 NanoFlow에서
              왔다고 밝히고, 미래 token을 만들어 의존성을 푼다고 적습니다. 이 글 12절의 output_tokens_buf가 그 미래 token 자리입니다.
            </p>
            <p>
              같은 글은 이전 버전 대비 1.1배, 다른 기준 엔진 대비 1.3배의 처리량을 보고합니다. 작은 모델과 큰 tensor 병렬에서 차이가 가장 크다고 적습니다.
              Llama-3.2-3B 등 그 글의 조건에서 저자가 잰 값이며, 이 글의 1.2배 가정과 직접 비교할 수 없습니다.
            </p>
          </div>
          <CitationBlock source="LMSYS · SGLang v0.4 (2024-12-04) · Zero-Overhead Batch Scheduler" citeKey={3} href="https://lmsys.org/blog/2024-12-04-sglang-v0-4/">
            <q>The scheduler runs one batch ahead and prepares all the metadata required for the next batch.</q>
          </CitationBlock>
          <div className={prose}>
            <p>
              발표 시점은 2024년 12월이고 지금 원문은 그 뒤로 많이 바뀌었습니다. 반복문의 구조는 고정 commit에서 다시 확인했지만 1.1배라는 수치는 현재 버전에서
              다시 잰 값이 아닙니다.
            </p>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">16. 추정이 빗나가는 조건을 알고 세 장부 중 하나를 고릅니다</h2>
          <div className={prose}>
            <p>
              비율 장부는 출력이 상한보다 일찍 끝나는 workload를 전제합니다. ignore_eos로 항상 상한까지 생성하는 요청은 비율 1.0을 써서 끝까지 예약과 같아집니다.
              max_new_tokens가 4096을 넘는 요청은 장부가 몫을 적게 보므로 retract가 늘 수 있습니다.
            </p>
            <p>
              retract는 계산을 버립니다. 출력 100개인 요청을 빼면 최대 300 token을 다시 prefill합니다. 장부가 과감할수록 이런 재계산이 잦아지고 한 요청의 응답
              시간이 다른 요청의 도착에 따라 흔들립니다. 첫 token까지의 시간을 엄격히 지켜야 하면 비율을 올리는 편이 맞습니다.
            </p>
            <p>
              page 1의 정확함에도 비용이 있습니다. req_to_token 표는 동시 요청 수와 최대 문맥을 미리 고정하고 칸 번호가 흩어지면 커널이 읽는 주소도 흩어집니다.
              FlashMLA처럼 page 64만 받는 backend를 고르면 SGLang이 page 크기를 64로 바꿉니다.
            </p>
            <p>
              고르는 기준을 같은 축에 놓으면 이렇습니다. 되돌림이 없어야 하고 출력 길이가 상한에 가깝다면 끝까지 예약이 맞습니다. 출력이 짧고 재계산을 견딜 수
              있다면 이번 칸만 잡는 장부가 동시성을 가장 많이 얻습니다. 출력 길이가 들쭉날쭉하고 둘 다 아쉽다면 비율 장부가 그 사이를 스스로 찾아갑니다.
              TensorRT-LLM의 정책은 <Link to="/cs/ai/tensorrt-llm-kv-cache-and-kernels">TensorRT-LLM KV 관리 글</Link>에서 원문으로 봅니다.
            </p>
          </div>
          {code("vllm-preempt", "vLLM의 이번 칸만 할당과 선점")}
          <ProgressiveDetail
            title="세 장부를 같은 요청 24개로 끝까지 돌리면 어떻게 되나요?"
            preview="단순 모형에서는 최대 동시 요청이 끝까지 예약 3, 비율 장부 9, 이번 칸만 20이었고 다시 계산한 token은 0, 402, 6,555개였습니다."
          >
            <div className={prose}>
              <p>
                같은 가정의 요청 24개를 token 단위로 흉내 낸 Python 모형입니다. 매 step에 실행 중 요청이 한 token씩 만들고, SGLang 모형은 prefill과 decode를
                번갈아 돌리며 비율 감소와 retract 재추정을 원문대로 넣었습니다. vLLM 모형은 선점한 요청의 입력과 출력을 다시 계산합니다. (가정)
              </p>
              <p>
                끝까지 예약은 되돌림이 없지만 동시 요청이 3개에 머뭅니다. 이번 칸만 잡는 모형은 처음에 20개를 받지만 선점 25회로 6,555 token을 다시 계산했습니다.
                비율 모형은 최대 9개, retract 1회, 재계산 402 token이었습니다.
              </p>
              <p>
                이 수치는 요청 길이가 모두 같고 batch 크기가 계산 시간에 영향을 주지 않는 장난감 모형의 결과입니다. 모든 요청을 끝내는 데 걸린 step은 2,400, 1,217, 800이었지만, 재계산이 step 시간을 늘리지 않는 모형이라 이번 칸만 잡는 장부에 유리하게 나옵니다. 실제 처리량이나 지연의 순위를 뜻하지 않습니다. 모형은 이 글의 verification/admission_sim.py에 있습니다.
              </p>
            </div>
          </ProgressiveDetail>
        </section>

        <section id="prediction-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">17. 같은 요청으로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>
              둘째 회에 A·B·C가 첫 출력만 만든 상태에서 비율이 0.7이 아니라 바닥 0.098이었다면 D 다음에 E도 들어갈까요? 남은 몫을 직접 세어 보세요.
              (답: 9절)
            </p>
            <p>
              출력 250·200·150·100개인 네 요청에서 하나를 retract하면 누가 빠지고, 비율은 얼마가 되나요? 다시 들어올 때 계산할 token은 최대 몇 개인가요?
              (답: 11절)
            </p>
            <p>
              겹치는 반복문에서 max_new_tokens로 끝나는 요청과 EOS로 끝나는 요청은 왜 다르게 다뤄지나요? (답: 13절)
            </p>
          </div>
        </section>
      </div>
      <InferenceRuntimeMapReturn current="sglang" />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={sglangRuntimeTrees}
        projectMetas={{
          sglang: { id: "sglang", label: "SGLang 고정 원문 (4560da5)", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          vllm: { id: "vllm", label: "vLLM v0.27.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
