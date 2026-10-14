import { Link } from "react-router-dom";
import { CodeViewButton } from "@/components/code";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import LayerOffloadViz from "./viz/LayerOffloadViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

interface Props {
  code: (key: string) => void;
}

export default function Offload({ code }: Props) {
  return (
    <>
      <section id="layer-offload" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">13. -ngl은 뒤쪽 층부터 GPU에 두고 앞쪽 층은 CPU가 계산합니다</h2>
        <div className={prose}>
          <p>
            Q4_K로 4.52GB가 됐지만 1절의 가정 GPU 6GB에서 실행 버퍼 1GB를 빼면 5,000MB가 남습니다. (가정) 각 층의 KV도 그 층과 같은 device에 두므로, n_ctx
            16,384에서 층 하나는 가중치 122.7MB와 KV 64MiB를 함께 차지합니다. 전부 올리면 넘칩니다.
          </p>
          <p>
            -ngl N은 GPU에 둘 층의 수입니다. 원문은 i_gpu_start = 층 수 + 1 − N을 계산하고, 번호가 그보다 작은 층을 CPU에, 나머지를 GPU에 둡니다. 출력층도 번호 32인
            층 하나로 세기 때문에 32층 모델의 최대값은 33입니다. 입력 embedding은 GPU로 옮겨도 이득이 작다는 주석과 함께 늘 CPU에 남습니다.
          </p>
        </div>
        <LayerOffloadViz />
        <CalculationWalkthrough
          title="5,000MB GPU에 올릴 수 있는 -ngl"
          question="층 하나와 출력층이 GPU에서 차지하는 byte로 -ngl의 상한을 구하면 얼마일까요?"
          scope="Q4_K 가중치와 f16 KV만 셉니다. 실행 버퍼 1GB는 이미 뺐고, 5,000MB는 10⁶ byte 단위입니다."
          steps={[
            { label: "층 가중치", expression: "218,112,000 × 144 ÷ 256", result: "122,688,000 byte", reason: "11절의 층당 가중치 수에 Q4_K의 값당 byte를 곱합니다." },
            { label: "층 KV", expression: "4,096 byte × 16,384 cell", result: "67,108,864 byte", reason: "10절의 층당 cell byte에 cell 수를 곱합니다. GPU 층의 KV는 GPU에 있습니다." },
            { label: "층 합", expression: "122,688,000 + 67,108,864", result: "약 189.8MB", reason: "GPU에 올리는 층 하나의 몫입니다." },
            { label: "출력층", expression: "525,336,576 × 144 ÷ 256", result: "약 295.5MB", reason: "출력층은 -ngl이 1 이상이면 가장 먼저 GPU에 갑니다. KV는 없습니다." },
            { label: "반복 층 수", expression: "⌊(5,000 − 295.5) ÷ 189.8⌋", result: "24층", reason: "25층이면 5,041MB로 넘칩니다." },
            { label: "-ngl", expression: "24 + 1", result: "25", reason: "출력층을 하나로 더합니다. i_gpu_start = 33 − 25 = 8이라 층 8~31이 GPU입니다." },
          ]}
          conclusion="-ngl 25로 층 8~31과 출력층이 GPU에서 4,851MB를 쓰고, 층 0~7과 embedding은 CPU에 남습니다."
          caveats={["실제 버퍼 크기와 정렬, 텐서별로 섞인 형식 때문에 서버가 출력하는 값과 다를 수 있습니다.", "서버의 --fit 기본값은 지정하지 않은 인자를 기기 메모리에 맞게 조정합니다."]}
        />
        <div className={prose}>
          <p>
            CPU에 남은 층 0~7은 decode 때 CPU가 계산합니다. 매 step마다 그 층의 가중치를 PCIe로 GPU에 옮기는 방식이 아닙니다. 층 사이 경계에서는 token마다 4,096개짜리
            활성값만 넘어갑니다. 이 점이{" "}
            <Link to="/cs/ai/model-vram-budgeting#cpu-gpu-offloading">CPU/GPU offloading</Link>에서 본, 가중치를 필요할 때 옮기는 방식과 다릅니다.
          </p>
          <p>
            예외는 큰 batch입니다. CUDA backend는 한 번에 처리하는 행이 32개 이상인 연산이면 CPU 버퍼의 가중치라도 GPU로 옮겨 계산합니다. prompt 2,000 token을
            처리하는 prefill은 이 경로로 가고, slot 네 개의 decode는 4행이라 CPU에서 계산합니다. 기준 32는 환경 변수로 바꿀 수 있습니다.
          </p>
          <p>
            그래서 -ngl을 줄이면 prefill보다 decode가 먼저 느려집니다. decode의 각 step이 CPU 층 8개를 메모리 대역폭이 낮은 RAM에서 읽어야 하기 때문입니다. 얼마나
            느려지는지는 기기마다 달라 이 글은 측정값을 내놓지 않습니다.
          </p>
        </div>
        <CodeViewButton label="i_gpu_start로 층을 나누는 원문" onClick={() => code("layer-split")} />
        <CodeViewButton label="-ngl 최대값 = 층 수 + 1" onClick={() => code("ngl-plus-one")} />
        <CodeViewButton label="큰 batch만 GPU로 보내는 offload_op" onClick={() => code("op-offload")} />
        <CodeViewButton label="기준 batch 32" onClick={() => code("op-offload-min")} />
      </section>

      <section id="boundary" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">14. 대화가 적고 기기가 하나일 때 맞는 설계이고, 그 밖에서는 비용이 드러납니다</h2>
        <div className={prose}>
          <p>
            cell 배열과 mask는 대화가 몇 개일 때 단순하고 충분합니다. 대화가 수십 개로 늘면 10절의 점수 낭비가 대화 수에 비례해 커지고, 자리가 없을 때 다른 대화를
            밀어내는 선점도 없습니다. 많은 사용자를 한 GPU 묶음에서 받는 서비스라면{" "}
            <Link to="/cs/ai/vllm-paged-attention#overview">block table을 쓰는 엔진</Link>의 장치들이 그 비용을 줄이려고 있습니다.
          </p>
          <p>
            토큰 단위로 KV를 관리하는 다른 데이터센터 엔진의 방식은{" "}
            <Link to="/cs/ai/sglang-runtime-anatomy">SGLang 런타임</Link> 글에서 비교합니다. llama.cpp의 cell도 token 하나 단위라는 점은 같지만, 요청별 위치 표 대신
            sequence 비트를 둔다는 점이 다릅니다.
          </p>
          <p>
            Q4_K의 4.5비트는 크기를 정할 뿐 품질을 보장하지 않습니다. 어느 텐서를 어떤 형식으로 둘지, 그때 정확도가 얼마나 남는지는 모델과 작업마다 따로 확인해야
            합니다. KV도 -ctk와 -ctv로 q8_0 등 양자화 형식을 고를 수 있지만 같은 확인이 필요합니다.
          </p>
          <p>
            prompt 재사용에도 경계가 있습니다. 서버 문서는 cache_prompt를 켜면 공통 앞부분을 다시 계산하지 않지만, backend에 따라 batch 크기가 다르면 logit이 비트
            단위로 같다고 보장되지 않아 결과가 달라질 수 있다고 적습니다. --cache-reuse N은 N token 이상의 조각을 KV 위치 이동으로 재사용하는 선택이며 기본은 꺼져
            있습니다.
          </p>
        </div>
        <div id="paper-llama-cpp-server" className="not-prose my-8 scroll-mt-24">
          <CitationBlock source="llama.cpp · tools/server/README.md (commit 091b6a7, 2026-10-14 확인)" citeKey={1} href="https://github.com/ggml-org/llama.cpp/blob/091b6a7fc561b78da90a0ed2d524ec995458c657/tools/server/README.md">
            <q>use single unified KV buffer shared across all sequences</q> -kvu의 설명이며 기본값은 slot 수가 auto일 때 켜짐입니다. -np·--kv-unified-per-slot·
            -ctk·--cache-reuse·cache_prompt의 비결정성 경고도 같은 문서에 있습니다.
          </CitationBlock>
          <CitationBlock source="Llama 3.1 8B config.json (Meta 원본은 접근 승인 필요, 공개 사본 unsloth/Meta-Llama-3.1-8B로 확인)" citeKey={2} href="https://huggingface.co/unsloth/Meta-Llama-3.1-8B/blob/main/config.json">
            num_hidden_layers 32, hidden_size 4096, num_key_value_heads 8, head_dim 128, intermediate_size 14336을 가중치 수와 KV byte 계산에 썼습니다. 원본
            저장소와의 일치는 직접 확인하지 못했습니다.
          </CitationBlock>
          <CitationBlock source="NVIDIA · CUDA Math API · Integer Intrinsics (__dp4a)" citeKey={3} href="https://docs.nvidia.com/cuda/cuda-math-api/cuda_math_api/group__CUDA__MATH__INTRINSIC__INT.html">
            <q>Four-way signed int8 dot product with int32 accumulate.</q> 12절의 정수 곱의 합 76을 만드는 명령입니다. llama.cpp는 이 명령을 감싼 ggml_cuda_dp4a를
            씁니다.
          </CitationBlock>
        </div>
        <ContentBoundary article="llama-cpp-local-inference" />
      </section>

      <section id="prediction-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">15. 같은 기기에서 다음 경계를 예상해 보세요</h2>
        <div className={prose}>
          <p>3절에서 A를 지운 뒤 B까지 끝나면 cell 0~3은 어떻게 되나요? A만 지웠을 때와 무엇이 다른가요? (답: 8절)</p>
          <p>-np 4에서 unified를 끄고 n_ctx를 16,384로 두면 8,000 token 대화가 들어갈까요? unified를 켜면 어떤가요? (답: 10절)</p>
          <p>같은 5,000MB 예산에서 n_ctx를 8,192로 줄이면 -ngl을 몇까지 올릴 수 있을까요? (답: 13절)</p>
        </div>
      </section>
    </>
  );
}
