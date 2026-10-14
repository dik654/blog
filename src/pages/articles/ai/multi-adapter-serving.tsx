import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import AdapterLedgerViz from "./multi-adapter-serving/viz/AdapterLedgerViz";
import SegmentBatchViz from "./multi-adapter-serving/viz/SegmentBatchViz";
import AdapterMemoryViz from "./multi-adapter-serving/viz/AdapterMemoryViz";
import SoftPromptKvViz from "./multi-adapter-serving/viz/SoftPromptKvViz";
import { codeRefs } from "./multi-adapter-serving/codeRefs";
import { adapterTrees } from "./multi-adapter-serving/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function MultiAdapterServingArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => (
    <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />
  );

  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 고객 천 명의 미세조정 모델을 GPU 한 벌로 서빙할 수 있을까요?</h2>
          <div className={prose}>
            <p>
              고객 천 곳이 같은 8B 모델을 각자 자기 데이터로 미세조정했다고 합시다. 모델 전체를 고객마다 따로 두면 BF16 한 벌 16 GB가 천 벌, 16 TB입니다. GPU에
              올리는 것은 고사하고 저장만으로도 감당하기 어렵습니다.
            </p>
            <p>
              LoRA로 미세조정했다면 사정이 다릅니다. 고객마다 바뀐 부분은 작은 행렬 두 장씩뿐이고 원래 가중치는 그대로 공유할 수 있습니다. 이 글의 답은 다음과
              같습니다. base 한 벌을 GPU에 두고 고객별 adapter를 얹어 서빙할 수 있습니다. 다만 그러려면 세 가지 일을 엔진이 새로 맡아야 합니다.
            </p>
            <p>
              첫째는 한 batch 안에서 요청마다 다른 adapter를 곱하는 kernel입니다. 둘째는 GPU에 다 올라가지 않는 adapter를 KV cache와 함께 들이고 내보내는 메모리
              관리입니다. 셋째는 처음 보는 adapter를 요청이 올 때 불러오는 적재 경로입니다. 가중치 대신 입력 앞에 학습된 가상 token을 붙이는 prompt tuning은 이
              세 일을 거의 덜어 주지만 요청마다 문맥 길이와 KV를 더 씁니다.
            </p>
            <p>
              LoRA 학습 자체와 adapter를 base에 합치는 방법은 <Link to="/cs/ai/lora-finetuning#practice">LoRA 미세조정</Link>에서 다룹니다. 이 글은 이미 학습된 adapter
              여러 개를 하나의 서빙 엔진에서 동시에 돌릴 때 생기는 일만 따라갑니다.
            </p>
          </div>
          <ContentBoundary article="multi-adapter-serving" />
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 요청은 입력과 adapter 이름을 함께 가져옵니다</h2>
          <div className={prose}>
            <p>
              엔진 입구에서 보면 요청 하나는 입력 문장과 어떤 adapter를 쓸지 가리키는 이름 하나로 이루어집니다. 출구에서는 그 adapter가 반영된 출력 token이 나옵니다.
              엔진 안에는 base 가중치가 한 벌만 있고 요청마다 다른 부분만 덧붙여 계산합니다.
            </p>
            <p>
              바깥에서 지켜야 할 약속은 하나입니다. adapter A를 요청한 사람의 출력은 A만 따로 띄운 모델의 출력과 같아야 합니다. 옆 자리에 adapter B 요청이 함께
              돌았다고 결과가 섞이면 안 됩니다. 앞부분을 재사용하는 cache가 있다면 A로 계산한 기록을 B 요청에 빌려줘서도 안 됩니다.
            </p>
            <p>
              엔진이 보장하지 않는 것도 있습니다. adapter의 품질, 학습에 쓴 rank, 어느 층에 붙였는지는 고객이 정한 값입니다. 엔진은 받은 adapter의 모양이 자기
              한도 안에 드는지 확인하고 그대로 계산합니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. adapter 하나는 26 MiB, 천 개면 base보다 큽니다</h2>
          <div className={prose}>
            <p>
              모델 모양은 <Link to="/cs/ai/kv-cache-fundamentals#kv-shape-formula">KV cache 기초</Link>에서 쓴 Llama 3 8B를 따릅니다. 폭 4,096, 32층, query head 32개,
              KV head 8개입니다. adapter는 attention의 q·k·v·o 네 행렬에만 rank 16으로 붙였다고 둡니다. (가정)
            </p>
            <p>
              rank 16이라는 말은 원래 행렬 W 옆에 입력 폭×16짜리 A와 16×출력 폭짜리 B를 둔다는 뜻입니다. 입력을 A로 16칸까지 줄였다가 B로 다시 펼쳐 원래 출력에
              더합니다. q는 입력과 출력이 모두 4,096이므로 두 장의 원소는 65,536개씩, 합 131,072개입니다.
            </p>
            <p>
              k와 v는 KV head가 8개라 출력 폭이 1,024입니다. B가 16×1,024로 작아져 한 행렬이 81,920개입니다. 네 행렬을 더하면 한 층에 425,984개이고 아래 장부가
              나머지 곱셈을 이어 갑니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="LoRA adapter 하나의 크기"
            question="q·k·v·o에 rank 16을 붙인 adapter는 GPU에서 몇 byte를 차지하나요?"
            scope="attention 네 행렬의 A·B만 셉니다. MLP에 붙인 adapter, 양자화된 adapter, 실행 중 중간 buffer는 넣지 않았습니다."
            steps={[
              { label: "q·o 한 행렬", expression: "4,096×16 + 16×4,096", result: "131,072개", reason: "A는 입력 폭×rank, B는 rank×출력 폭입니다. q와 o는 입력·출력이 모두 4,096입니다." },
              { label: "k·v 한 행렬", expression: "4,096×16 + 16×1,024", result: "81,920개", reason: "KV head 8개 × head 폭 128 = 1,024가 출력 폭입니다." },
              { label: "한 층", expression: "131,072×2 + 81,920×2", result: "425,984개", reason: "q·o 두 장과 k·v 두 장을 더합니다." },
              { label: "모델 전체", expression: "425,984 × 32층", result: "13,631,488개", reason: "32층에 같은 모양으로 붙였습니다." },
              { label: "byte", expression: "13,631,488 × 2 byte", result: "27,262,976 byte = 26 MiB", reason: "adapter를 base와 같은 BF16으로 둡니다." },
              { label: "base와 비교", expression: "27,262,976 ÷ 16.0×10⁹", result: "0.17%", reason: "base 8.0×10⁹개를 BF16으로 둔 16.0 GB와 비교합니다." },
            ]}
            conclusion="adapter 하나는 base의 0.17%이지만 천 개를 모으면 26,000 MiB, 약 25.4 GiB로 base 16.0 GB보다 커집니다."
            caveats={["base 원소 수 8.0×10⁹는 반올림한 가정값입니다.", "MLP까지 붙이면 adapter가 몇 배 커집니다. 비율보다 계산 순서를 따라가 주세요."]}
          />
          <AdapterLedgerViz />
          <div className={prose}>
            <p>
              계산량도 같은 방식으로 셉니다. token 하나가 q 행렬을 지날 때 base는 곱셈·덧셈 쌍 16,777,216회를 하고 LoRA는 A와 B를 거치며 131,072회를 더합니다.
              q 하나로는 128분의 1, 네 행렬을 합쳐도 base의 약 1%입니다.
            </p>
            <p>
              그러니 adapter 서빙의 어려움은 계산의 양에 있지 않습니다. 다음 절에서 보듯 요청마다 다른 작은 행렬을 한 batch에서 어떻게 곱하느냐가 문제입니다. 천
              개를 다 올릴 수 없으니 어떤 adapter를 언제 GPU에 둘지도 정해야 합니다.
            </p>
          </div>
        </section>

        <section id="batch-picture" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 같은 adapter를 쓰는 token끼리 모으면 adapter를 한 번만 읽습니다</h2>
          <div className={prose}>
            <p>
              decode 한 step에 token 네 개가 함께 들어왔다고 합시다. 첫째와 셋째는 고객 A, 둘째는 B, 넷째는 C의 adapter를 씁니다. base 행렬 곱은 네 token을 쌓아
              한 번에 처리하면 됩니다. 모두 같은 W를 곱하기 때문입니다.
            </p>
            <p>
              덧셈 항은 token마다 곱할 행렬이 다릅니다. 가장 단순한 방법은 token마다 따로 계산하는 것입니다. 그러면 A를 두 번 읽고 batch 크기 1짜리 곱셈을 네 번
              합니다. adapter가 같은 token이 붙어 있지 않으니 묶을 수도 없습니다.
            </p>
            <p>
              그래서 token을 adapter 번호로 다시 줄 세웁니다. A를 쓰는 두 token이 이웃하게 되고 번호별 개수와 시작 위치를 적은 작은 표가 생깁니다. kernel은 이
              표를 보고 구간 하나에 adapter 하나를 맡깁니다. 그림은 이 표가 만들어지는 과정을 네 장면으로 보여 줍니다.
            </p>
          </div>
          <SegmentBatchViz />
          <div className={prose}>
            <p>
              네 장면이 끝나면 adapter 행렬을 세 번 읽습니다. 서로 다른 adapter가 세 개이기 때문입니다. 요청이 같은 adapter에 몰릴수록 읽는 횟수는 adapter 종류 수로
              줄어듭니다. 반대로 요청마다 다른 adapter를 쓰면 줄일 것이 없습니다.
            </p>
          </div>
        </section>

        <section id="why-three" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 한 batch에 섞는 순간 kernel, 메모리, 적재가 같이 문제가 됩니다</h2>
          <div className={prose}>
            <p>
              adapter가 하나뿐이면 W에 미리 더해 두면 끝입니다. 합친 모델은 원래 모델과 같은 속도로 돕니다. 고객이 둘만 되어도 이 방법은 막힙니다. W를 A용으로
              바꾸면 B 요청을 같은 batch에 넣을 수 없습니다.
            </p>
            <p>
              합치지 않고 따로 두면 4절의 정렬과 구간 표가 필요합니다. 요청이 바뀔 때마다 어느 token이 어느 adapter인지가 달라지므로 이 표는 step마다 다시 만듭니다.
              kernel은 adapter가 GPU 메모리의 어디에 있는지도 알아야 합니다.
            </p>
            <p>
              GPU에 둘 수 있는 adapter 수에도 한도가 있습니다. 3절의 천 개는 25.4 GiB라 80 GB GPU에 base와 함께 올리면 KV cache 자리가 크게 줄어듭니다. 그래서 지금
              batch에 필요한 것만 GPU에 두고 나머지는 CPU 메모리나 디스크에 둡니다. 어떤 adapter를 올리고 내릴지가 새 결정이 됩니다.
            </p>
            <p>
              처음 보는 adapter를 쓰는 요청이 오면 파일을 읽어 GPU로 옮겨야 합니다. 그동안 그 요청만 기다리게 할지, batch 전체를 멈출지가 지연 시간을 정합니다. 한
              step에 들어갈 adapter 종류 수를 제한해야 메모리와 kernel 격자가 정해진 크기 안에 머뭅니다.
            </p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 줄이는 곱, 펼치는 곱, 공용 page, 두 층의 cache에 이름을 붙입니다</h2>
          <div className={prose}>
            <p>
              4절에서 adapter별 구간마다 행렬 곱을 하는 연산을 Punica 논문은 SGMV(Segmented Gather Matrix-Vector multiplication)라고 부릅니다. 덧셈 항 x·A·B는 두 번의 곱으로
              나뉩니다. 4,096칸을 16칸으로 줄이는 앞 단계는 shrink입니다. 16칸을 다시 4,096칸으로 펼치는 뒤 단계는 expand입니다.
            </p>
            <p>
              token마다 자기 adapter 번호를 보고 그 행렬을 직접 찾아 곱하는 방식은 구간을 만들지 않습니다. S-LoRA 논문은 이것을 decode용 MBGMV, prefill용 MBGMM이라고
              부르며 rank가 다른 adapter도 한 batch에 섞습니다. 흔히 BGMV라고 줄여 부르는 계열입니다.
            </p>
            <p>
              adapter 가중치와 KV cache를 같은 크기의 칸으로 나눈 한 저장소에서 함께 관리하는 방식은 S-LoRA의 Unified Paging입니다. GPU에 올린 adapter와 CPU에만 둔
              adapter를 각각 개수 한도와 LRU 순서로 관리하는 구조는 이 글에서 두 층 adapter cache라고 부르겠습니다.
            </p>
          </div>
          <TermBreakdown
            title="이 글에서 계속 쓰는 이름"
            items={[
              { term: "SGMV", description: "adapter별 연속 구간마다 그 adapter의 행렬을 곱하는 연산입니다.", example: "구간 [0,2)는 A, [2,3)은 B, [3,4)는 C.", boundary: "token을 adapter 번호로 정렬해 둔 뒤에만 구간이 연속합니다." },
              { term: "shrink · expand", description: "x·A로 rank 폭까지 줄이는 곱과 그 결과에 B를 곱해 원래 폭으로 펼치는 곱입니다.", example: "4,096 → 16 → 4,096.", boundary: "둘 사이의 16칸 중간값은 token마다 따로 남깁니다." },
              { term: "Unified Paging", description: "adapter 가중치와 KV를 같은 크기의 page로 나눠 한 pool에서 함께 빌려 쓰는 방식입니다.", example: "rank 16 adapter 26 MiB = 8 KiB page 3,328개.", boundary: "S-LoRA의 설계입니다. vLLM 기본 경로는 고정 슬롯을 씁니다(9절)." },
              { term: "두 층 adapter cache", description: "GPU 슬롯 수와 CPU 보관 수를 따로 정하고 각각 가장 오래 안 쓴 adapter부터 내립니다.", example: "vLLM max_loras=4, max_cpu_loras=32.", boundary: "CPU에도 없으면 디스크나 원격 저장소에서 다시 읽습니다." },
            ]}
          />
        </section>

        <section id="request-trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 처음 보는 adapter C 요청 하나를 끝까지 따라갑니다</h2>
          <div className={prose}>
            <p>
              GPU 슬롯이 둘이고 A와 B가 이미 올라가 있다고 합시다. CPU에는 A·B만 등록되어 있습니다. 이때 C를 쓰는 요청이 대기열에 들어옵니다. (가정)
            </p>
            <p>
              scheduler는 이번 step에 이미 A와 B 요청을 넣었는지 봅니다. 한 step의 adapter 종류 한도가 2라면 C 요청은 이번에 들어가지 못하고 다음 step을 기다립니다.
              한도에 여유가 있으면 들어갑니다. 이 확인은 11절에서 코드로 봅니다.
            </p>
            <p>
              들어가기로 정해지면 worker가 C 파일을 읽어 CPU 쪽에 등록합니다. 읽기가 성공한 뒤에야 CPU 한도를 넘는지 보고 가장 오래 안 쓴 adapter를 지웁니다. 이어
              GPU 슬롯이 모두 차 있으므로 마지막 사용이 더 오래된 A나 B 하나를 슬롯에서 내리고 그 자리에 C를 복사합니다.
            </p>
            <p>
              forward 직전에 이번 batch의 token별 adapter 번호로 4절의 구간 표를 만듭니다. 각 층에서 base 곱을 마친 뒤 shrink와 expand가 구간마다 A·B를 곱해 결과에
              더합니다. 아래 의사코드는 이 마지막 부분을 한 줄씩 실행해 볼 수 있게 펼친 것입니다.
            </p>
          </div>
          <AlgorithmBlock
            title="한 layer에서 여러 adapter의 덧셈 항을 더하는 순서 (SGMV)"
            input={[
              "x: 이번 batch token들의 입력 [4, 4096]",
              "ids: token별 adapter 번호 [0, 1, 0, 2]",
              "A[i]: [4096, 16], B[i]: [16, 4096] — GPU 슬롯 i의 adapter",
              "y: base 곱을 마친 출력 [4, 4096]",
            ]}
            steps={[
              { code: "order = stable_argsort(ids)", note: "→ [0, 2, 1, 3]. 같은 adapter의 token이 이웃합니다." },
              { code: "lora, count = unique(ids)", note: "→ lora [0, 1, 2], count [2, 1, 1]." },
              { code: "start = [0] + cumsum(count)", note: "→ [0, 2, 3, 4]. 구간 i는 start[i]부터 start[i+1] 앞까지입니다." },
              { code: "for i in range(len(lora)):  rows = order[start[i]:start[i+1]]", note: "i=0이면 rows=[0, 2], adapter A입니다." },
              { code: "    v[rows] = scale * (x[rows] @ A[lora[i]])", note: "shrink. 4096칸을 16칸으로 줄이며 scale을 곱합니다. A를 이 구간에서 한 번 읽습니다." },
              { code: "    y[rows] += v[rows] @ B[lora[i]]", note: "expand. 16칸을 4096칸으로 펼쳐 base 출력에 더합니다." },
            ]}
            repeatUntil="구간 세 개를 모두 처리할 때까지 4–6줄을 반복합니다. 실제 kernel은 이 반복을 격자의 한 축으로 동시에 실행합니다."
            output="y: token마다 자기 adapter의 x·A·B가 더해진 출력. A·B·C 행렬은 각각 한 번씩만 읽혔습니다."
          />
        </section>

        <section id="kernel-source" data-teach-level="5" className="scroll-mt-20">
          <span id="paper-punica" className="scroll-mt-20" />
          <h2 className="mb-6 text-2xl font-bold">8. 실제 kernel은 정렬 표로 구간을 나누고 메모리 읽기에 묶입니다</h2>
          <div className={prose}>
            <p>
              vLLM v0.27.1의 lora_kernel_metadata.py 135–168행은 7절의 첫 세 줄과 같은 일을 합니다. token별 번호를 안정 정렬하고 unique로 번호별 개수를 얻은 뒤
              누적합으로 시작 위치를 만듭니다. 번호 [0,1,0,2]를 넣으면 시작 위치 [0,2,3,4]가 나옵니다.
            </p>
            <p>
              lora_shrink_op.py 70–92행은 kernel 격자의 세 번째 축을 adapter 하나에 대응시킵니다. 각 프로그램은 자기 adapter의 개수와 시작 위치를 읽고 그 구간의
              token만 처리합니다. 번호가 -1인 구간은 adapter를 쓰지 않는 token이라 바로 끝납니다.
            </p>
            <p>
              punica_gpu.py의 add_lora_linear는 덧셈 항을 shrink 한 번과 expand 한 번으로 부릅니다. 둘 사이에 token 수×rank 크기의 float32 중간 buffer를 둡니다.
              Punica 논문이 말한 두 번의 kernel 실행과 같은 구조입니다.
            </p>
          </div>
          {code("segment-metadata", "번호 [0,1,0,2]로 구간 표를 만드는 원문")}
          {code("shrink-kernel", "격자 한 축이 adapter 구간 하나를 맡는 원문")}
          {code("shrink-expand", "x·A·B를 두 번의 곱으로 나누는 원문")}
          <div className={prose}>
            <p>
              이 연산이 빠른지 느린지는 계산보다 메모리 읽기로 정해집니다. Punica 논문은 SGMV 한 번의 계산량과 읽고 쓰는 byte를 아래처럼 셉니다. 식의 각 항에
              7절의 숫자를 넣어 보겠습니다.
            </p>
          </div>
          <ExplainedFormula
            question="expand 한 번이 계산 하나당 몇 byte를 옮기나요?"
            idea="계산량은 token 수에 비례하지만 adapter 행렬을 읽는 양은 adapter 종류 수에 비례합니다. 종류가 많을수록 byte당 계산이 줄어듭니다."
            formula={String.raw`\mathrm{FLOP}=2\,s_n h_i h_o,\qquad \mathrm{IO}=2\left[s_n(h_i+h_o)+n\,h_i h_o\right]`}
            annotatedFormula={String.raw`\mathrm{FLOP}=\underbrace{2}_{\text{곱·덧셈}}\,\underbrace{s_n}_{\text{token 수}}\underbrace{h_i h_o}_{\text{행렬 크기}},\qquad \mathrm{IO}=\underbrace{2}_{\text{BF16 byte}}\Big[\underbrace{s_n(h_i+h_o)}_{\text{입출력}}+\underbrace{n\,h_i h_o}_{\text{종류별 행렬}}\Big]`}
            operations={[
              { expression: String.raw`2\,s_n h_i h_o`, annotation: ["token 4개가 16×4,096 행렬을 곱해", "524,288 FLOP"] },
              { expression: String.raw`s_n(h_i+h_o)`, annotation: ["token마다 16칸 읽고 4,096칸 써", "4×4,112 = 16,448개"] },
              { expression: String.raw`n\,h_i h_o`, annotation: ["adapter 3종의 B를 한 번씩 읽어", "3×65,536 = 196,608개"] },
              { expression: String.raw`2\left[\cdot\right]`, annotation: ["원소 213,056개에 2 byte를 곱해", "426,112 byte"] },
            ]}
            terms={[
              { symbol: "s_n", name: "batch의 token 수", description: "구간 표 마지막 시작 위치와 같습니다. 7절에서는 4입니다." },
              { symbol: "n", name: "adapter 종류 수", description: "이번 batch에 등장한 서로 다른 adapter 수입니다. 7절에서는 3입니다." },
              { symbol: "h_i, h_o", name: "입력·출력 폭", description: "expand는 rank 16에서 4,096으로 펼치므로 h_i=16, h_o=4,096입니다." },
            ]}
            assumptions={["Punica 논문의 식이며 실제 kernel의 tile·cache 재사용은 반영하지 않은 하한 모형입니다.", "원문 I/O 식의 마지막 항은 n×h1×h2로 인쇄되어 있으며 앞 줄의 정의에 맞춰 h_i·h_o로 읽었습니다."]}
            interpretation="524,288 FLOP ÷ 426,112 byte ≈ 1.23 FLOP/byte입니다. 네 token이 모두 같은 adapter면 n=1이라 I/O가 163,968 byte로 줄어 3.20이 됩니다. 논문이 그린 A100 경계(312 TFLOP/s ÷ 1.935 TB/s ≈ 161)보다 훨씬 낮아 두 경우 모두 메모리 읽기에 묶입니다."
          />
          <div className={prose}>
            <p>
              token마다 따로 계산하면 같은 A를 두 번 읽어 n 자리에 4가 들어갑니다. 원소는 16,448 + 262,144 = 278,592개, 557,184 byte입니다. 구간으로 묶은 426,112
              byte보다 31% 많습니다.
            </p>
            <p>
              Punica 논문은 또 다른 비교 대상으로 Gather-BMM을 듭니다. token마다 필요한 행렬을 한 덩어리로 복사해 쌓은 뒤 batch 행렬 곱을 하는 방식입니다. 복사한
              행렬을 쓰고 다시 읽느라 SGMV보다 token 수×입력 폭×출력 폭의 두 배만큼 원소를 더 옮긴다고 적습니다.
            </p>
          </div>
          <div className="not-prose mt-8">
            <CitationBlock source="Chen 외 · Punica: Multi-Tenant LoRA Serving (arXiv 2310.18547v1), §4와 §7.1" citeKey={1} href="https://arxiv.org/abs/2310.18547">
              SGMV를 shrink와 expand 두 번의 실행으로 정의하고 LoRA 번호를 blockIdx.y에 묶는 schedule을 설명합니다. FLOP·I/O 식과 roofline 분석도 같은 절에
              있습니다. 12배 처리량과 token당 2 ms 추가 지연은 저자들의 시험대에서 잰 자기보고 수치입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="memory" data-teach-level="5" className="scroll-mt-20">
          <span id="paper-slora" className="scroll-mt-20" />
          <h2 className="mb-6 text-2xl font-bold">9. 고정 슬롯은 최대 rank만큼, Unified Paging은 실제 rank만큼 잡습니다</h2>
          <div className={prose}>
            <p>
              adapter를 GPU 어디에 둘지는 엔진마다 다릅니다. vLLM은 시작할 때 adapter 자리를 미리 만듭니다. base_linear.py 129–150행이 max_loras개의 슬롯을
              max_lora_rank 크기로 할당합니다. 이 자리는 adapter가 하나도 없어도 KV cache로 돌아가지 않습니다.
            </p>
            <p>
              max_loras=4, max_lora_rank=16이면 3절의 adapter 네 개 분량, 104 MiB를 미리 잡습니다. rank 8 adapter는 13 MiB인데 rank 16 슬롯에 들어가므로 슬롯의 절반이
              빕니다. set_lora가 A·B를 슬롯의 앞부분에만 복사하기 때문입니다.
            </p>
          </div>
          {code("stacked-slots", "max_loras × max_lora_rank 슬롯을 미리 잡는 원문")}
          {code("set-lora", "작은 rank를 슬롯 앞부분에만 복사하는 원문")}
          <div className={prose}>
            <p>
              S-LoRA는 다른 길을 택합니다. adapter 행렬의 한 줄과 KV cache의 한 줄이 모두 hidden 폭 H를 가진다는 점에 주목해 H개짜리 칸을 page 하나로
              삼고 두 종류를 한 pool에 섞어 담습니다. rank R의 행렬은 R page, 길이 S의 KV는 S page를 씁니다.
            </p>
            <p>
              같은 104 MiB를 8 KiB page로 나누면 13,312 page입니다. rank 8 두 개와 rank 16 두 개는 9,984 page만 쓰고 나머지 3,328 page, 26 MiB를 KV에 줍니다. 한
              token의 KV가 128 KiB이므로 208 token 자리입니다. 그림은 같은 총량을 두 방식으로 나눈 모습을 비교합니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="같은 104 MiB의 두 가지 배치"
            question="rank 8 두 개와 rank 16 두 개를 올릴 때 KV에 남는 자리는 얼마인가요?"
            scope="adapter와 KV가 함께 쓸 수 있는 104 MiB만 봅니다. page 크기 8 KiB와 token당 KV 128 KiB는 3절 모델의 가정값입니다."
            steps={[
              { label: "고정 슬롯", expression: "max_loras 4 × 26 MiB", result: "104 MiB", reason: "슬롯 크기는 max_lora_rank 16 기준입니다." },
              { label: "슬롯 안의 빈칸", expression: "(26 − 13) × 2", result: "26 MiB", reason: "rank 8 adapter 두 개가 슬롯을 절반만 채웁니다." },
              { label: "page 수", expression: "104 MiB ÷ 8 KiB", result: "13,312 page", reason: "page 하나는 hidden 4,096개 × 2 byte입니다." },
              { label: "adapter page", expression: "1,664 + 1,664 + 3,328 + 3,328", result: "9,984 page", reason: "rank 8은 13 MiB, rank 16은 26 MiB를 page로 나눈 값입니다." },
              { label: "KV로 가는 몫", expression: "3,328 page × 8 KiB ÷ 128 KiB", result: "208 token", reason: "남은 26 MiB를 한 token의 KV 크기로 나눕니다." },
            ]}
            conclusion="같은 총량에서 고정 슬롯은 26 MiB를 빈칸으로 묶고 Unified Paging은 그만큼을 KV 208 token으로 씁니다."
            caveats={["GQA 모델은 KV 한 줄의 폭이 hidden과 다릅니다. 이 장부는 byte로 환산한 근사입니다.", "S-LoRA의 실제 page 배치와 kernel은 논문 구현 기준이며 vLLM에는 이 pool이 없습니다."]}
          />
          <AdapterMemoryViz />
          <div className={prose}>
            <p>
              고정 슬롯이 손해만 보는 것은 아닙니다. adapter 위치가 슬롯 번호로 정해져 kernel은 행렬을 연속된 메모리에서 읽고 CUDA graph를 잡을 때 주소가 바뀌지
              않습니다. page에 흩어 둔 adapter를 읽으려면 S-LoRA처럼 흩어진 주소를 모아 읽는 별도 kernel이 필요합니다.
            </p>
            <p>
              고르는 기준은 adapter rank가 얼마나 섞여 있는지입니다. 대부분 같은 rank라면 고정 슬롯의 빈칸이 작고 구현이 단순합니다. rank가 크게 다르거나 GPU에 올릴
              adapter 수가 자주 바뀌면 공용 pool이 KV 자리를 더 남깁니다.
            </p>
          </div>
          <div className="not-prose mt-8">
            <CitationBlock source="Sheng 외 · S-LoRA: Serving Thousands of Concurrent LoRA Adapters (arXiv 2311.03285v3), §5" citeKey={2} href="https://arxiv.org/abs/2311.03285">
              모든 adapter를 주 메모리에 두고 실행 중인 batch가 쓰는 것만 GPU로 가져옵니다. KV는 (S, H), adapter는 (R, H) 모양이라 H 크기 page 하나로 둘을 함께 담는
              Unified Paging을 제안하고, 다음 batch에 필요한 adapter를 미리 가져오는 prefetch를 함께 씁니다. 최대 4배 처리량은 당시 HuggingFace PEFT·vLLM 단순 지원과
              비교한 저자 측정입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="loading" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. GPU 슬롯과 CPU 보관을 다른 한도의 LRU로 관리합니다</h2>
          <div className={prose}>
            <p>
              7절의 C 요청이 겪은 두 번의 내리기는 서로 다른 cache에서 일어났습니다. vLLM model_manager.py 288–295행은 GPU 슬롯 수를 max_loras로, CPU 보관 수를
              max_cpu_loras로 따로 둡니다. max_cpu_loras를 비우면 max_loras와 같아지고, 더 작게 두면 설정 단계에서 오류가 납니다.
            </p>
            <p>
              worker_manager.py 285–319행은 처음 보는 adapter를 먼저 읽고 검증합니다. 읽기에 성공한 다음에야 CPU 한도를 넘는지 보고 가장 오래된 등록을 지웁니다.
              잘못된 파일 때문에 멀쩡한 adapter가 밀려나지 않게 하는 순서입니다.
            </p>
            <p>
              GPU 쪽은 model_manager.py 1191–1209행이 맡습니다. 슬롯이 다 찼고 새 adapter가 아직 올라가 있지 않으면 마지막 사용이 가장 오래된 adapter를 슬롯에서
              내립니다. 슬롯에서 내려도 CPU 쪽 등록은 남아 있어 다시 쓸 때 파일을 읽지 않고 복사만 합니다.
            </p>
          </div>
          {code("lora-config", "max_loras · max_lora_rank · max_cpu_loras 정의")}
          {code("slot-activate", "GPU 슬롯과 CPU 보관 한도를 나누는 원문")}
          {code("lru-evict", "슬롯이 차면 가장 오래된 adapter를 내리는 원문")}
          {code("worker-load", "읽기 성공 뒤에만 CPU 등록을 지우는 원문")}
          <div className={prose}>
            <p>
              파일을 어디서 읽어 올지는 별도 문제입니다. vLLM 문서는 실행 중에 adapter를 추가하는 API와 resolver plugin을 설명합니다. 요청이 모르는 adapter 이름을
              가져오면 로컬 디렉터리나 Hugging Face Hub에서 찾아 받습니다. 문서는 원격 다운로드를 운영 환경에서 쓰기에는 안전하지 않다고 경고합니다.
            </p>
            <p>
              LoRAX는 이 적재를 제품의 중심 기능으로 둡니다. README는 요청에 adapter 경로를 넣으면 다른 요청을 막지 않고 그때 불러온다고 설명합니다. GPU와 CPU 사이에서
              adapter를 미리 가져오고 내보내는 scheduling도 함께 내세웁니다.
            </p>
          </div>
          <div className="not-prose mt-8 grid gap-4">
            <CitationBlock source="predibase/lorax · README, Features" citeKey={3} href="https://github.com/predibase/lorax">
              Dynamic Adapter Loading, Heterogeneous Continuous Batching, Adapter Exchange Scheduling을 기능으로 적고 SGMV kernel을 사용한다고 밝힙니다. 2026-10-14에
              확인한 프로젝트 소개이며 성능 주장은 검증하지 않았습니다.
            </CitationBlock>
            <CitationBlock source="vLLM docs · LoRA Adapters, Dynamically serving LoRA Adapters" citeKey={4} href="https://docs.vllm.ai/en/latest/features/lora/">
              실행 중 adapter 추가 API와 LoRAResolver plugin, VLLM_ALLOW_RUNTIME_LORA_UPDATING 설정을 설명합니다. 원격 다운로드가 운영 환경에 안전하지 않다는 경고도
              같은 쪽에 있습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="admission" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. scheduler는 KV와 함께 adapter 자리도 세고 들입니다</h2>
          <div className={prose}>
            <p>
              GPU 슬롯이 넷인데 한 step에 다섯 종류의 adapter가 들어오면 그 step은 실행할 수 없습니다. 그래서 요청을 batch에 넣는 단계에서 adapter 종류를 셉니다. 두
              엔진은 같은 문제를 조금 다르게 셉니다.
            </p>
            <p>
              vLLM scheduler.py 724–737행은 이번 step에 이미 max_loras종류가 들어갔고 새 요청의 adapter가 그 안에 없으면 그 요청을 건너뜁니다. max_loras=2이고 대기열이
              A, B, C, A 순서라면 A와 B가 들어가고 C는 건너뛰며 마지막 A는 들어갑니다. 멈추지 않고 다음 요청을 계속 봅니다.
            </p>
            <p>
              TensorRT-LLM capacityScheduler.cpp 135–146행은 adapter 무게를 PEFT cache page로 셉니다. 같은 task id가 이미 이번
              batch에 있으면 0 page로 세어 같은 adapter를 쓰는 요청이 여럿이어도 한 번만 더합니다.
            </p>
            <p>
              새 요청을 받는 417–446행은 KV block과 adapter page가 모두 남을 때만 받습니다. adapter page만 모자라면 그 요청을 건너뛰고, KV block이 모자랄 때는 반복을
              멈춥니다. adapter마다 3 page, 여유 8 page라면 A·B로 6 page를 쓰고 C는 건너뛰며 A를 쓰는 뒤 요청은 들어갑니다. (가정)
            </p>
          </div>
          {code("max-loras-skip", "max_loras를 넘는 새 adapter 요청을 건너뛰는 원문")}
          {code("peft-claim", "같은 task id의 page를 한 번만 세는 원문")}
          {code("peft-admit", "KV block과 adapter page를 함께 확인하는 원문")}
          <div className={prose}>
            <p>
              두 방식 모두 adapter 종류가 많은 대기열에서 일부 요청을 뒤로 미룹니다. 요청이 같은 adapter에 몰려 있으면 한 step에 많이 들어가고, 천 고객이 고르게
              섞여 있으면 종류 한도에 먼저 걸립니다. 그래서 router가 같은 adapter 요청을 같은 replica로 모아 보내면 종류 한도에 덜 걸립니다.
            </p>
          </div>
          <div className="not-prose mt-8">
            <CitationBlock source="TensorRT-LLM docs · LoRA, Multi-LoRA Support와 Cache Management" citeKey={5} href="https://nvidia.github.io/TensorRT-LLM/features/lora.html">
              PyTorch backend의 LoraConfig에 max_lora_rank·max_loras·max_cpu_loras를 두고, PeftCacheConfig의 host_cache_size와 device_cache_percent로 CPU·GPU 쪽
              adapter cache 크기를 정합니다. 고정 commit 681cff1의 docs/source/features/lora.md를 읽었습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="prompt-tuning" data-teach-level="6" className="scroll-mt-20">
          <span id="paper-prompt-tuning" className="scroll-mt-20" />
          <h2 className="mb-6 text-2xl font-bold">12. prompt tuning은 가중치 대신 입력 앞에 학습된 token 20개를 붙입니다</h2>
          <div className={prose}>
            <p>
              LoRA를 섞으려면 kernel, 슬롯, 적재가 모두 필요했습니다. 고객별 차이를 가중치가 아닌 입력에 담으면 이 셋이 거의 사라집니다. prompt tuning이 그
              방법입니다. 모델은 그대로 두고 입력 앞에 붙일 가상 token의 embedding만 학습합니다.
            </p>
            <p>
              Lester 외 논문은 k개의 학습 가능한 token을 입력 앞에 붙인다고 정의합니다. 같은 논문의 길이 실험에서 20개를 넘기면 이득이 작았습니다. 그래서 고객마다 20행
              짜리 표를 둔다고 합시다. 한 행이 hidden 4,096개이므로 표는 160 KiB, LoRA 26 MiB의 170분의 1입니다.
            </p>
            <p>
              서빙에서는 token embedding을 찾는 단계에서 첫 20칸만 이 표의 행으로 바꿉니다. 그 뒤로는 평범한 입력과 똑같이 32층을 지납니다. 모든 요청이 같은 base
              행렬을 쓰므로 4절의 정렬도, 9절의 슬롯도 필요 없습니다. 고객이 다른 요청을 같은 batch에 그냥 섞으면 됩니다.
            </p>
            <p>
              대가는 길이입니다. 가상 token 20개도 각 층에서 K·V를 남기므로 요청 하나가 20×128 KiB=2.5 MiB를 더 씁니다. 같은 task 요청 100개가 공유 없이 동시에 돌면
              250 MiB입니다. prefill은 20 token만큼 길어지고 최대 문맥 길이에서도 20칸이 빠집니다.
            </p>
          </div>
          <SoftPromptKvViz />
          <CalculationWalkthrough
            title="soft prompt 20 token의 비용"
            question="표가 160 KiB인 soft prompt는 동시 요청이 늘면 얼마나 쓰나요?"
            scope="가상 token에서만 생기는 몫을 셉니다. 원래 입력과 출력의 KV는 LoRA를 쓸 때와 같으므로 뺐습니다."
            steps={[
              { label: "표 크기", expression: "20행 × 4,096 × 2 byte", result: "163,840 byte = 160 KiB", reason: "embedding 한 행이 hidden 폭과 같습니다." },
              { label: "한 요청의 KV", expression: "20 token × 128 KiB", result: "2.5 MiB", reason: "token당 KV 128 KiB는 32층·KV head 8·head 128·BF16에서 나옵니다." },
              { label: "공유 없는 100 요청", expression: "2.5 MiB × 100", result: "250 MiB", reason: "요청마다 같은 20칸의 K·V를 따로 만듭니다." },
              { label: "LoRA와 같아지는 지점", expression: "26 MiB ÷ 2.5 MiB", result: "10.4 요청", reason: "LoRA는 요청 수와 무관하게 26 MiB 한 벌입니다." },
            ]}
            conclusion="같은 task 요청이 11개 이상 동시에 돌면 공유하지 않는 soft prompt KV가 LoRA adapter 한 벌보다 커집니다."
            caveats={["앞 20칸을 prefix cache로 공유하면 KV는 2.5 MiB 한 벌로 줄어듭니다. 조건은 13절에서 봅니다.", "품질 비교는 하지 않았습니다. 같은 task에서 prompt tuning과 LoRA가 같은 정확도를 낸다는 뜻이 아닙니다."]}
          />
          <div className={prose}>
            <p>
              P-tuning v2는 입력 embedding에만 붙이면 학습할 수 있는 양이 문맥 길이에 묶이고 예측에 미치는 영향도 간접적이라고 지적합니다. 그래서 각 층에 prefix
              token을 붙이는 deep prompt tuning을 씁니다. 서빙에서 보면 층마다 미리 정해진 K·V가 앞에 붙는 셈이라 KV 비용은 같고, 입력 표만 바꾸는 경로로는 처리할 수
              없습니다.
            </p>
            <p>
              엔진 쪽 경로도 확인했습니다. TensorRT-LLM 고정 commit의 PyTorch executor는 요청의 prompt tuning 설정에서 embedding 표를 꺼내 prompt_embedding_table로
              넘깁니다. vLLM은 별도 prompt tuning 기능 대신 token ID 대신 embedding 열을 직접 받는 prompt_embeds 입력을 제공합니다. 표의 20행을 원래 입력 embedding
              앞에 붙여 보내면 같은 효과를 냅니다.
            </p>
          </div>
          {code("prompt-table", "요청의 prompt tuning 표를 실행 요청으로 넘기는 원문")}
          <div className={prose}>
            <p>
              고르는 기준은 동시 요청 수와 바꾸려는 동작의 크기입니다. 요청이 적은 고객이 아주 많고 task가 분류나 형식 맞추기처럼 가벼우면 soft prompt가 단순합니다.
              한 고객의 요청이 많이 몰리거나 모델의 동작을 크게 바꿔야 하면 LoRA 쪽이 메모리와 품질 모두에서 유리할 수 있습니다. (가정)
            </p>
          </div>
          <div className="not-prose mt-8 grid gap-4">
            <CitationBlock source="Lester 외 · The Power of Scale for Parameter-Efficient Prompt Tuning (EMNLP 2021), §2와 §3.2" citeKey={6} href="https://arxiv.org/abs/2104.08691">
              모델 전체를 고정하고 task마다 k개의 학습 가능한 token을 입력 앞에 붙이는 방법을 정의합니다. 길이 {"{1, 5, 20, 100, 150}"} 실험에서 20을 넘기면 이득이
              작았다고 적습니다. 실험 모델은 T5 계열이라 decoder 전용 모델의 수치로 옮기지 않았습니다.
            </CitationBlock>
            <CitationBlock source="Liu 외 · P-Tuning v2 (ACL 2022), §3" citeKey={7} href="https://arxiv.org/abs/2110.07602">
              입력 embedding에만 붙인 prompt의 두 한계를 들고, 층마다 prompt를 prefix token으로 붙이는 deep prompt tuning을 씁니다. 학습 가능한 비율이 0.01%에서
              0.1–3%로 늘어난다고 설명합니다.
            </CitationBlock>
            <CitationBlock source="vLLM docs · Prompt Embedding Inputs" citeKey={8} href="https://docs.vllm.ai/en/latest/features/prompt_embeds/">
              (sequence_length, hidden_size) 모양의 embedding 열을 입력으로 받고, 서버에서는 --enable-prompt-embeds로 켭니다. Completions API는 이 입력에 chat
              template을 적용하지 않습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="cache-key" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. prefix cache의 key에 adapter와 가상 token의 정체가 들어가야 합니다</h2>
          <div className={prose}>
            <p>
              두 요청이 같은 system prompt로 시작하면 앞부분의 KV를 재사용하는 것이 <Link to="/cs/ai/prefix-caching-radix-attention#block-hash">prefix cache</Link>입니다.
              adapter를 섞으면 이 재사용에 조건이 붙습니다. adapter A는 q·k·v 행렬을 바꾸므로 같은 token 열이라도 A로 만든 K·V와 B로 만든 K·V는 다릅니다.
            </p>
            <p>
              vLLM kv_cache_utils.py 517–529행은 LoRA 요청의 adapter 이름을 block hash의 추가 key에 넣습니다. 그래서 같은 token 열이라도 A 요청과 B 요청은 서로 다른
              block을 찾습니다. 531–555행은 prompt_embeds가 있으면 그 block 범위의 embedding 값을 SHA-256으로 묶어 같은 key에 넣습니다.
            </p>
            <p>
              soft prompt에는 함정이 하나 더 있습니다. TensorRT-LLM의 p-tuning 경로는 가상 token을 vocabulary 크기보다 큰 가짜 ID로 표시합니다. 다른 고객의 표도
              같은 가짜 ID 100, 101, …을 쓰므로 ID만 보면 같은 입력으로 보입니다. 문서는 그래서 표마다 다른 extra id를 함께 넘겨야 올바르게 재사용된다고 설명합니다.
            </p>
            <p>
              이 조건을 지키면 12절의 250 MiB가 2.5 MiB로 줄어듭니다. 같은 표를 쓰는 요청은 앞 20칸의 KV를 한 벌만 남기고, 다른 표를 쓰는 요청은 key가 달라 섞이지
              않습니다. key에 정체를 빠뜨리면 메모리는 아끼지만 다른 고객의 동작이 섞인 출력을 냅니다.
            </p>
          </div>
          {code("cache-key", "block hash에 LoRA 이름과 embedding hash를 넣는 원문")}
          <div className="not-prose mt-8">
            <CitationBlock source="TensorRT-LLM docs · KV cache reuse, Enable kv cache reuse for p-tuning" citeKey={9} href="https://nvidia.github.io/TensorRT-LLM/legacy/advanced/kv-cache-reuse.html">
              p-tuning의 가상 token ID는 vocabulary 크기 이상이라 요청 사이에 겹칠 수 있고, ID만으로는 구별할 수 없어 잘못된 재사용이 생긴다고 설명합니다. 일반 token은
              extra id 0, 가상 token은 표마다 다른 양수를 주라고 안내합니다. 고정 commit 681cff1의 legacy 문서를 읽었습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">14. 수가 맞아도 지연, rank 차이, 품질은 따로 확인합니다</h2>
          <div className={prose}>
            <p>
              이 글의 byte와 FLOP은 모델 모양에서 계산한 장부입니다. 실제 GPU에서 잰 지연이 아닙니다. 8절의 1.23 FLOP/byte는 kernel이 메모리에 묶인다는 방향을 알려
              주지만, tile 크기와 L2 cache 재사용에 따라 실제 시간은 달라집니다.
            </p>
            <p>
              처음 보는 adapter의 적재 시간은 batch 크기와 별개로 생깁니다. 파일 26 MiB를 저장소에서 읽고 CPU에서 GPU로 옮기는 시간은 저장소와 PCIe 속도에 달려 있습니다.
              S-LoRA와 LoRAX가 다음 batch의 adapter를 미리 가져오는 이유입니다.
            </p>
            <p>
              rank가 다른 adapter를 섞으면 고정 슬롯은 빈칸을, 공용 pool은 흩어진 주소를 읽는 비용을 냅니다. MoE 층에 붙인 adapter는 expert마다 행렬이 따로 있어 이
              글의 q·k·v·o 장부보다 훨씬 큽니다. TensorRT-LLM 문서는 MoE LoRA를 CUTLASS backend와 bf16·fp16 base에서만 지원한다고 적습니다.
            </p>
            <p>
              마지막으로 엔진은 adapter의 품질을 보증하지 않습니다. 2절의 약속은 A 요청의 출력이 A만 띄운 모델과 같다는 것이며, A가 좋은 모델이라는 뜻은 아닙니다.
              논문의 4배·12배 처리량은 각 논문의 시험대와 비교 대상에 묶인 자기보고 수치입니다.
            </p>
          </div>
          <ProgressiveDetail
            title="adapter를 합쳐 버리면 이 모든 비용이 사라지지 않나요?"
            preview="한 adapter만 쓰는 replica라면 합치는 쪽이 가장 빠릅니다. 고객이 둘 이상 섞이는 순간 다시 이 글의 문제로 돌아옵니다."
          >
            <p className="text-sm leading-7 text-muted-foreground">
              W에 B·A를 더해 두면 덧셈 항 계산이 사라져 base와 같은 속도로 돕니다. 대신 그 replica는 그 고객 전용이 되어 base 한 벌을 공유하는 이점을 잃습니다. 요청이
              많은 소수 고객은 합친 전용 replica로, 요청이 적은 다수 고객은 여러 adapter를 섞는 replica로 나누는 배치도 가능합니다. (가정)
            </p>
          </ProgressiveDetail>
        </section>

        <section id="review-questions" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">15. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <ol>
              <li>
                token 다섯 개의 adapter 번호가 [2,0,2,2,1]이면 kernel이 받는 개수와 시작 위치는 무엇이고, adapter 행렬을 몇 번 읽나요? (답: 4절, 8절)
              </li>
              <li>
                max_loras=4, max_lora_rank=16에서 rank 16 adapter 하나와 rank 4 adapter 셋을 올리면 슬롯 안의 빈칸은 몇 MiB인가요? (답: 9절)
              </li>
              <li>
                같은 soft prompt를 쓰는 요청 30개가 동시에 돌 때, prefix cache key에 표의 정체가 빠져 있으면 어떤 일이 생기고 들어가 있으면 KV가 얼마인가요? (답: 12절,
                13절)
              </li>
            </ol>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={adapterTrees}
        projectMetas={{
          vllm: { id: "vllm", label: "vLLM · Python", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          trtllm: { id: "trtllm", label: "TensorRT-LLM · C++/Python", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
        }}
      />
    </>
  );
}
