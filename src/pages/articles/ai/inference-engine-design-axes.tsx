import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import InferenceEngineDesignAxesViz from "./inference-engine-design-axes/viz/InferenceEngineDesignAxesViz";
import KvUnitTailViz from "./inference-engine-design-axes/viz/KvUnitTailViz";
import PrefixReuseUnitViz from "./inference-engine-design-axes/viz/PrefixReuseUnitViz";
import { codeRefs } from "./inference-engine-design-axes/codeRefs";
import { engineTrees } from "./inference-engine-design-axes/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function InferenceEngineDesignAxesArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => (
    <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />
  );

  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 같은 요청을 넣어도 엔진마다 받는 수가 3개에서 19개까지 다릅니다</h2>
          <div className={prose}>
            <p>
              vLLM, TensorRT-LLM, SGLang, llama.cpp는 모두 같은 모델을 읽고 같은 attention 식을 계산합니다. 그런데 4,096 token짜리 KV 공간에 같은
              요청을 넣어 보면 처음에 받아들이는 요청 수가 3개, 3개, 19개, 4개로 갈립니다. 계산 속도가 같아도 이 차이가 처리량과 대기 시간을 바꿉니다.
            </p>
            <p>
              답부터 말하겠습니다. 엔진 사이의 오래 가는 차이는 kernel의 이름보다 다섯 가지 결정에서 나옵니다. KV를 몇 token 단위로 자르는가, 아직 만들지 않은 출력을
              얼마나 미리 떼어 두는가, 재사용할 기록을 무엇으로 찾는가, CPU의 준비 일을 GPU 계산과 겹치는가, attention kernel을 직접 갖는가 빌려 쓰는가입니다.
            </p>
            <p>
              각 엔진의 내부는 따로 다룬 글이 있습니다. <Link to="/cs/ai/vllm-paged-attention">vLLM PagedAttention</Link>,{" "}
              <Link to="/cs/ai/tensorrt-llm-kv-cache-and-kernels">TensorRT-LLM</Link>, <Link to="/cs/ai/sglang-runtime-anatomy">SGLang</Link>,{" "}
              <Link to="/cs/ai/llama-cpp-local-inference">llama.cpp</Link>입니다. 이 글은 한 요청을 네 엔진에 똑같이 넣어 다섯 결정을 같은 눈금으로
              비교하고, 언제 어느 결정이 중요한지까지 닫습니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 네 엔진 모두 고르는 부품, 저장하는 부품, 계산하는 부품을 갖습니다</h2>
          <div className={prose}>
            <p>
              엔진을 상자로 보면 입력은 요청의 token 열과 출력 상한이고 출력은 한 step에 한 token씩 나오는 다음 token입니다. 바깥 계약은 네 엔진이 같습니다. 안에는
              이번 step에 어느 요청을 계산할지 고르는 scheduler, 각 요청의 K·V를 어디에 두고 언제 버릴지 정하는 KV 관리자, 실제 행렬곱과 attention을 돌리는
              실행기가 있습니다.
            </p>
            <p>
              다섯 결정은 이 세 부품에 나뉘어 있습니다. 저장 단위와 재사용 색인은 KV 관리자, 출력 예약과 CPU 겹치기는 scheduler, kernel 선택은 실행기의
              결정입니다. 요청이 어떤 엔진에 들어가든 같은 세 부품을 지나므로 같은 요청으로 비교할 수 있습니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 입력 200, 상한 1,000, 실제 300인 요청을 4,096칸에 넣습니다</h2>
          <div className={prose}>
            <p>
              요청 하나는 입력 200 token을 갖고 출력 상한을 1,000으로 요청하지만 실제로는 300 token에서 끝납니다. 엔진은 요청을 받을 때 이 300을 모릅니다.
              끝까지 가면 KV에는 200 + 300 = 500 token이 쌓입니다. (가정)
            </p>
            <p>
              모델은 Llama 3 8B 모양으로 둡니다. 층 32개, KV head 8개, head 크기 128에 BF16을 쓰면 token 하나의 KV는 128 KiB, 층 하나만 보면 4 KiB입니다.
              이 값을 곱셈으로 푸는 장부는 4절에 있고, 일반적인 계산 방법은 <Link to="/cs/ai/kv-cache-fundamentals">KV cache 기초</Link>에 있습니다.
            </p>
            <p>
              KV 공간은 4,096 token, 512 MiB로 작게 잡습니다. 수가 작아야 엔진별 차이를 손으로 셀 수 있습니다. 같은 요청이 여러 개 줄 서 있고 모두 같은 속도로
              한 token씩 자란다고 둡니다. 실제 엔진이 따로 두는 한 step의 token 예산과 동시 요청 상한은 이 장부에서 빼고 KV 공간만 셉니다. (가정)
            </p>
          </div>
        </section>

        <section id="kv-unit" data-teach-level="1" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 저장 단위의 빈칸은 요청당 많아야 한 단위입니다</h2>
          <div className={prose}>
            <p>
              첫 결정은 KV를 몇 token씩 묶어 자리를 나누는가입니다. vLLM은 기본 16 token, TensorRT-LLM은 32 token을 한 묶음으로 잡습니다.
              SGLang은 기본 한 token이 한 칸이고 llama.cpp는 묶음 없이 cell 배열에 token 하나씩 적습니다. 500 token 요청을 넣으면 마지막 묶음에
              빈칸이 생깁니다.
            </p>
            <p>
              vLLM은 500 ÷ 16을 올려 32 block, 512칸을 잡아 12칸이 빕니다. TensorRT-LLM도 500 ÷ 32를 올리면 16 block, 512칸이라 같은 12칸이 빕니다. SGLang은
              빈칸이 0입니다. llama.cpp도 저장은 500 cell이지만 attention이 읽는 범위를 256 단위로 올려 512칸을 읽고 나머지 12칸은 mask로 지웁니다.
            </p>
            <p>
              빈칸은 요청마다 많아야 단위 하나, 16칸이나 32칸에서 1칸 모자란 만큼입니다. 500 token 중 12칸은 2.4%입니다. 저장 단위의 차이는 다음 절의 출력
              예약 차이보다 훨씬 작습니다. 단위가 정말 중요해지는 곳은 빈칸보다 같은 앞부분을 몇 칸 단위로 재사용하는가입니다. 이것은 7절에서 봅니다.
            </p>
          </div>
          <KvUnitTailViz />
          <CalculationWalkthrough
            title="500 token 요청의 저장 단위별 장부"
            question="같은 500 token이 엔진마다 몇 칸을 잡고 몇 칸을 비우나요?"
            scope="요청 하나만 셉니다. prefix 공유와 출력 예약은 넣지 않았고, llama.cpp는 이 요청만 cell 0부터 쓴 경우입니다."
            steps={[
              { label: "token 하나의 KV", expression: "32층 × 8 head × 128 × 2(K·V) × 2 byte", result: "131,072 byte = 128 KiB", reason: "층마다 KV head 8개가 128개 값을 K와 V로 한 벌씩 BF16으로 저장합니다. 층 하나는 4 KiB입니다." },
              { label: "vLLM 16칸", expression: "⌈500 ÷ 16⌉ × 16", result: "32 block = 512칸", reason: "마지막 block에 500 − 496 = 4 token만 들어가 12칸이 빕니다." },
              { label: "TensorRT-LLM 32칸", expression: "⌈500 ÷ 32⌉ × 32", result: "16 block = 512칸", reason: "마지막 block에 500 − 480 = 20 token이 들어가 역시 12칸이 빕니다." },
              { label: "SGLang 1칸", expression: "500 × 1", result: "500칸", reason: "page 크기 기본값이 1이라 빈칸이 생기지 않습니다." },
              { label: "llama.cpp 읽는 범위", expression: "256 × ⌈500 ÷ 256⌉", result: "512칸 읽기", reason: "저장은 500 cell이지만 attention이 읽는 앞쪽 범위를 256 단위로 올립니다." },
              { label: "빈칸의 무게", expression: "12 ÷ 500", result: "2.4%", reason: "요청당 많아야 단위 하나라 길이가 길수록 비율이 줄어듭니다." },
            ]}
            conclusion="저장 단위는 요청당 최대 한 단위만 낭비하고, 그 몫은 500 token 요청에서 2.4%입니다."
            caveats={["vLLM과 TensorRT-LLM의 block 크기는 설정으로 바꿀 수 있습니다.", "llama.cpp의 읽는 범위는 여러 대화가 cell을 나눠 쓰면 더 넓어집니다."]}
          />
          <div className={prose}>
            <p>
              단위가 같은 512칸이어도 층을 담는 방식은 다릅니다. TensorRT-LLM의 block 하나는 32개 층의 K·V를 모두 담아 32 token × 128 KiB = 4 MiB가 한 덩어리입니다.
              vLLM은 block 번호를 모든 층이 함께 쓰지만 저장은 층마다 따로 된 tensor에 있어서, 같은 32 token을 host로 옮기면 block 2개 × 층 32개 = 64번의 64 KiB
              복사가 됩니다. 이 배치 차이는 KV를 다른 장치로 옮길 때 드러나며{" "}
              <Link to="/cs/ai/tensorrt-llm-kv-cache-and-kernels#pool-layout">TensorRT-LLM 글의 9절</Link>이 같은 계산을 80개 층으로 합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("vllm-block-size", "vLLM block 기본값 16")}
            {code("llama-n-kv", "llama.cpp가 읽는 cell 범위")}
          </div>
        </section>

        <section id="reservation" data-teach-level="2" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 아직 만들지 않은 출력을 얼마나 떼어 두는지가 받는 수를 정합니다</h2>
          <div className={prose}>
            <p>
              두 번째 결정이 차이를 크게 만듭니다. 엔진은 요청이 300에서 멈출지 1,000까지 갈지 모른 채 받아야 합니다. 출력 상한만큼 미리 떼어 두면 나중에 자리가 모자랄 일은
              없지만 쓰지 않을 칸까지 잡습니다. 조금만 떼어 두면 많이 받지만 요청들이 자라면서 자리가 모자라 누군가를 내보내야 합니다.
            </p>
            <p>
              TensorRT-LLM의 기본 정책은 입력과 출력 상한을 더한 1,200 token을 32칸 block 38개, 1,216칸으로 받을 때 떼어 둡니다. 4,096칸에는 3개가 들어가고
              넷째는 기다립니다. 세 요청이 끝까지 실제로 쓰는 것은 1,500칸이라 잡아 둔 3,648칸의 41%입니다.
            </p>
            <p>
              vLLM은 이번 step에 쓸 칸만 받습니다. 입력 200은 16칸 block 13개, 208칸이라 19개가 들어갑니다. 요청들이 500 token까지 자라면 하나에
              block 32개가 필요해 8개만 남고 나머지 11개는 KV를 비우고 대기열로 돌아갑니다. 돌아간 요청은 나중에 지금까지의 입력과 출력을 다시 계산합니다.
            </p>
            <p>
              SGLang은 그 사이에 있습니다. 새 요청은 입력 200과 상한 1,000에 page 한 칸을 더한 1,201칸으로 세어 첫 판정에서 3개를 받습니다. 이미 돌고 있는
              요청은 남은 출력에 0.7에서 시작해 내려가는 비율을 곱해 세므로 몇 step 뒤에는 넷째가 들어옵니다. 계산이 빗나가 자리가 모자라면 출력이 가장 적은 요청부터
              되돌립니다.
            </p>
            <p>
              llama.cpp 서버는 요청을 slot 단위로 받습니다. -np 4로 slot 4개를 두고 KV를 slot마다 나누면 slot 하나가 1,024칸을 고정으로 갖습니다. 요청은
              자기 slot 안에서만 자라므로 4개가 돌고 다섯째는 빈 slot을 기다립니다. 자리가 모자라도 다른 대화의 cell을 빼앗지 않습니다.
            </p>
          </div>
          <InferenceEngineDesignAxesViz />
          <CalculationWalkthrough
            title="4,096칸 pool에서 받는 요청 수"
            question="입력 200, 상한 1,000 요청을 엔진마다 몇 개 받나요?"
            scope="KV 공간만 셉니다. 한 step token 예산·동시 요청 상한·prefix 공유는 넣지 않았습니다. SGLang은 첫 판정만 셉니다."
            steps={[
              { label: "TensorRT-LLM 기본", expression: "⌈1,200 ÷ 32⌉ = 38 block, ⌊128 ÷ 38⌋", result: "3개", reason: "4,096칸은 32칸 block 128개이고 요청마다 끝까지 쓸 38개를 떼어 둡니다." },
              { label: "SGLang 첫 판정", expression: "200 + 1,000 + 1 = 1,201, ⌊4,096 ÷ 1,201⌋", result: "3개", reason: "새 요청은 출력 상한 전체를 세고 비율은 실행 중 요청에만 곱합니다." },
              { label: "vLLM 받을 때", expression: "⌈200 ÷ 16⌉ = 13 block, ⌊256 ÷ 13⌋", result: "19개", reason: "4,096칸은 16칸 block 256개이고 입력에 필요한 block만 셉니다." },
              { label: "vLLM 500 token 때", expression: "⌈500 ÷ 16⌉ = 32 block, ⌊256 ÷ 32⌋", result: "8개, 11개 선점", reason: "출력이 자라며 block을 더 받고, 모자라면 마지막에 들어온 요청부터 내보냅니다." },
              { label: "llama.cpp -np 4", expression: "4,096 ÷ 4 = 1,024칸 slot", result: "4개", reason: "받는 수는 slot 수가 정하고 요청은 slot 안의 1,024칸에서 자랍니다." },
            ]}
            conclusion="끝까지 예약하면 3개를 받고 남는 칸이 생기고, 필요한 만큼만 받으면 19개를 받았다가 11개를 다시 계산합니다."
            caveats={["vLLM이 19개를 한 step에 모두 계산하는지는 token 예산이 따로 정합니다.", "SGLang과 TensorRT-LLM의 다른 정책 값을 바꾸면 수가 달라집니다."]}
          />
          <div className={prose}>
            <p>
              어느 쪽이 좋다고 답할 수는 없습니다. 출력 길이가 상한에 가깝게 고르게 나오는 작업이라면 끝까지 예약해도 빈칸이 적고 다시 계산할 일이 없습니다.
              상한보다 훨씬 일찍 끝나는 대화가 많다면 필요한 만큼만 받는 쪽이 더 많은 요청을 동시에 돌립니다. 선점과 재계산 비용의 계산은{" "}
              <Link to="/cs/ai/serving-memory-admission-and-preemption#recovery-cost">메모리 수용과 선점</Link>에서 다룹니다.
            </p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 다섯 결정에 엔진들이 쓰는 이름을 붙입니다</h2>
          <div className={prose}>
            <p>
              4절의 묶음은 vLLM과 TensorRT-LLM에서 block, SGLang에서 page, llama.cpp에서 cell이라고 부릅니다. 묶음 크기 설정은 차례로 block_size,
              tokens_per_block, page_size입니다. llama.cpp에는 묶음 설정 대신 KV를 slot마다 나눌지 하나로 둘지 정하는 kv-unified 설정이 있습니다.
            </p>
            <p>
              5절의 출력 예약은 이렇게 부릅니다. TensorRT-LLM의 끝까지 예약하는 기본 정책은 GUARANTEED_NO_EVICT이고, 한 step씩 받고 모자라면 멈춰 세우는 다른
              정책은 MAX_UTILIZATION입니다. vLLM이 요청을 비우고 나중에 다시 계산하는 것은 recompute preemption, SGLang의 비율은 new_token_ratio, 되돌리기는
              retract입니다.
            </p>
            <p>
              남은 세 결정에도 이름이 있습니다. 같은 앞부분의 KV를 찾는 기능을 prefix caching이라 부르고 CPU가 다음 batch를 고르는 동안 GPU가 앞 batch를
              계산하게 하는 방식을 overlap scheduling이라 부릅니다. attention을 실제로 계산하는 구현은 backend라고 부릅니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("trt-defaults", "TensorRT-LLM 기본 정책·block 크기·backend")}
            {code("sglang-ratio", "SGLang 출력 비율 기본값")}
          </div>
        </section>

        <section id="reuse" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 같은 system prompt 1,000 token을 네 엔진이 다르게 찾아냅니다</h2>
          <div className={prose}>
            <p>
              이제 요청 둘이 같은 system prompt 1,000 token으로 시작한다고 합시다. 첫 요청이 끝난 뒤 둘째 요청이 오면 앞 1,000 token의 KV를 다시 계산하지 않고
              가져올 수 있습니다. 엔진마다 몇 token을 가져오는지는 저장 단위와 찾는 구조가 정합니다. (가정)
            </p>
            <p>
              vLLM은 꽉 찬 block마다 앞 block까지 포함한 hash를 만들어 찾습니다. 1,000 ÷ 16을 내리면 block 62개, 992 token을 가져오고 나머지 8
              token은 다시 계산합니다. TensorRT-LLM은 32칸 block을 radix tree에 매달아 찾고 마지막 block이 일부만 같아도 그 부분을 복사해 이어
              씁니다. 31 block의 992 token에 8 token을 더해 1,000을 가져올 수 있습니다.
            </p>
            <p>
              SGLang은 한 칸이 token 하나라 radix tree에서 1,000 token을 그대로 찾습니다. llama.cpp 서버는 기본으로 켜진 cache_prompt가
              같은 slot의 직전 prompt와 새 prompt의 공통 앞부분을 비교합니다. 그래서 같은 slot으로 가면 1,000을 가져오지만 다른 slot으로 가면 그 slot에
              남은 기록과만 비교합니다.
            </p>
            <p>
              찾은 기록을 언제 버리는지도 다릅니다. vLLM은 참조가 끝난 block을 오래된 순으로 내보내고, TensorRT-LLM은 0~100 우선순위를 먼저 보고 같은 순위 안에서
              오래된 것을 내보내며 host memory로 옮겨 둘 수도 있습니다. 자세한 규칙은{" "}
              <Link to="/cs/ai/prefix-caching-radix-attention">prefix caching</Link>과{" "}
              <Link to="/cs/ai/tensorrt-llm-kv-cache-and-kernels#retention">TensorRT-LLM 우선순위</Link>에서 봅니다.
            </p>
          </div>
          <PrefixReuseUnitViz />
          <div id="paper-llama-server" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="llama.cpp · tools/server/README.md (commit 091b6a7)" citeKey={1} href="https://github.com/ggml-org/llama.cpp/blob/091b6a7fc561b78da90a0ed2d524ec995458c657/tools/server/README.md">
              <q>Re-use KV cache from a previous request if possible.</q> 같은 항목은 cache_prompt의 기본값을 true로 적고, 다른 항목은 요청 prompt가 slot의
              prompt와 얼마나 같아야 그 slot을 쓸지 정하는 --slot-prompt-similarity 기본값을 0.10으로 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="overlap" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 세 엔진은 CPU 준비를 GPU 계산 뒤로 숨기고 결과를 한 step 늦게 읽습니다</h2>
          <div className={prose}>
            <p>
              한 step마다 CPU는 끝난 요청을 확인하고 다음 batch를 고르고 입력 tensor를 만듭니다. 이 일을 GPU 계산이 끝난 뒤에 하면 그동안 GPU가 놉니다. SGLang의
              overlap loop는 scheduler.py 1975행 이후에서 이번 batch를 GPU에 넣은 뒤 앞 batch의 결과를 처리합니다. 결과는 한 step 늦게 읽힙니다.
            </p>
            <p>
              vLLM도 config/vllm.py 1095–1143행에서 맞지 않는 옵션이 없으면 비동기 scheduling을 기본으로 켭니다. pooling 모델, 일부
              speculative decoding, 지원하지 않는 분산 실행기일 때만 끕니다. TensorRT-LLM의 overlap scheduler도 문서상 기본으로 켜져 있고 그
              대가로 한 decoding step이 더 생긴다고 적습니다.
            </p>
            <p>
              그래서 이 결정은 세 엔진 사이에서는 차이를 만들지 않습니다. 남는 차이는 한 step 늦게 읽는 결과를 어떻게 처리하느냐입니다. 예를 들어 끝 token이 나온
              요청을 한 step 늦게 알아채 token 하나를 더 계산하는 경로가 있습니다. SGLang 쪽의 세부는{" "}
              <Link to="/cs/ai/sglang-runtime-anatomy#overlap-edges">SGLang 글의 13절</Link>에 있습니다. llama.cpp 서버의 loop는 이 글에서 따로 확인하지 않았습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("sglang-overlap", "SGLang overlap loop")}
            {code("vllm-async", "vLLM 비동기 scheduling 기본값")}
          </div>
          <div className="not-prose my-8">
            <CitationBlock source="TensorRT-LLM · Overlap Scheduler (commit 681cff1 docs/source/features)" citeKey={2} href="https://github.com/NVIDIA/TensorRT-LLM/blob/681cff123b96e0a8fd52d977366a62677de7ae08/docs/source/features/overlap-scheduler.md">
              <q>The optimization introduces one extra decoding step but significantly improves throughput.</q> 같은 문서는 기본값이 켜짐이고
              disable_overlap_scheduler로 끌 수 있다고 적으며, SGLang v0.4의 zero-overhead scheduler 글을 참고로 듭니다.
            </CitationBlock>
          </div>
        </section>

        <section id="kernels" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. attention kernel은 엔진끼리 빌려 쓰는 부품이 되었습니다</h2>
          <div className={prose}>
            <p>
              다섯째 결정은 attention을 누가 구현하느냐입니다. TensorRT-LLM은 attention 앞의 bias·RoPE·KV 쓰기·양자화를 한 kernel로 합치고, 생성 단계에서는 KV
              head 하나를 query head 8개가 함께 읽는 XQA kernel을 씁니다. 자세한 바이트 계산은{" "}
              <Link to="/cs/ai/tensorrt-llm-kv-cache-and-kernels#xqa">TensorRT-LLM 글의 13절</Link>에 있습니다.
            </p>
            <p>
              vLLM은 attention을 외부 구현 중에서 고릅니다. platforms/cuda.py 143–159행을 보면 Blackwell(SM100)에서는 FlashInfer를 먼저, 다른 GPU에서는
              FlashAttention을 먼저 고릅니다. 그 주석은 SM100에서 FlashInfer를 통해 TRTLLM causal attention을 쓴다고 적습니다. vLLM이 Blackwell에서 TensorRT-LLM 쪽
              kernel을 빌려 쓰는 셈입니다.
            </p>
            <p>
              SGLang도 fa3·flashinfer·triton·trtllm_mha 등을 고를 수 있고 TensorRT-LLM도 FlashInfer backend를 지원합니다.
              llama.cpp는 다른 길을 갑니다. ggml이 CPU·CUDA·Metal마다 자기 kernel을 갖고 가중치를 GGUF 블록 양자화 그대로 두고 정수 내적으로 곱합니다.
              데이터센터 kernel을 빌리기보다 작은 기기의 메모리에 맞추는 쪽을 택했습니다.
            </p>
            <p>
              그래서 같은 GPU에서 kernel 성능을 비교할 때는 엔진 이름보다 실제로 고른 backend를 먼저 맞춰야 합니다. backend가 같아지면 남는 차이는 4~8절의 정책입니다.
              backend를 고르는 실제 과정은 <Link to="/cs/ai/attention-kernel-anatomy-and-backends#backend-source">attention kernel 해부</Link>에서 다룹니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">{code("vllm-backend-priority", "vLLM의 GPU 세대별 backend 순서")}</div>
          <div className="not-prose my-8">
            <CitationBlock source="SGLang · Server Arguments (commit 4560da5 docs)" citeKey={3} href="https://docs.sglang.io/docs/advanced_features/server_arguments">
              --attention-backend 항목은 triton, fa3, fa4, flashinfer, trtllm_mha, trtllm_mla 등을 선택지로 적고 기본값을 지정하지 않습니다. --page-size 기본값은 1,
              --schedule-policy 기본값은 fcfs입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="choice" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 작업의 출력 길이와 공유 앞부분, 기기 수가 고를 결정을 정합니다</h2>
          <div className={prose}>
            <p>
              다섯 결정을 작업 모양에 대 보면 고르는 기준이 생깁니다. 아래 판단은 각 정책의 동작에서 이끌어 낸 것이며 이 글은 엔진 사이의 성능을 직접 측정하지 않았습니다. (가정)
            </p>
            <p>
              출력 길이를 미리 알기 어렵고 상한보다 훨씬 일찍 끝나는 대화가 많다면 5절의 차이가 가장 큽니다. 끝까지 예약하는 정책은 빈칸이 많아지므로 필요한 만큼
              받는 정책이나 비율 추정 쪽이 유리하고, 대신 선점과 재계산 횟수를 지켜봐야 합니다. 상한에 가깝게 고른 길이가 나오는 batch 작업이라면 끝까지 예약해도
              손해가 적습니다.
            </p>
            <p>
              같은 system prompt나 긴 문서를 여러 요청이 공유한다면 7절의 재사용 단위와 버리는 순서가 중요합니다. 한 token 단위로 찾는 구조와 일부만 같은 block을
              복사해 이어 쓰는 구조는 남는 몇 token의 재계산을 줄이고 우선순위를 줄 수 있으면 자주 쓰는 앞부분을 오래 남깁니다.
            </p>
            <p>
              기기 한 대에서 대화 몇 개를 돌린다면 llama.cpp의 slot과 cell 방식이 맞습니다. 표를 유지할 필요가 없고 양자화한 가중치를 그대로 쓰는 대신, 대화가 늘어
              cell을 나눠 쓰기 시작하면 읽는 범위가 넓어지고 선점이 없어 자리가 모자라면 요청이 실패합니다.
            </p>
          </div>
          <TermBreakdown
            title="다섯 결정을 같은 요청으로 비교"
            items={[
              { term: "저장 단위", description: "vLLM 16 · TensorRT-LLM 32 · SGLang 1 · llama.cpp cell", example: "500 token에서 빈칸 12·12·0·0, llama.cpp는 512칸 읽기", boundary: "요청당 최대 한 단위라 출력 예약보다 작습니다." },
              { term: "출력 예약", description: "필요할 때 받기 · 비율 추정 · 끝까지 예약 · slot 고정", example: "4,096칸에 19→8 · 3→4 · 3 · 4개", boundary: "설정과 token 예산을 바꾸면 수가 달라집니다." },
              { term: "재사용 색인", description: "block hash · radix tree · 우선순위 radix · slot별 prompt", example: "1,000 token 공유에서 992 · 1,000 · 1,000 · 같은 slot이면 1,000", boundary: "마지막 token 재계산과 adapter·salt 같은 추가 키는 별도입니다." },
              { term: "CPU 겹치기", description: "vLLM·SGLang·TensorRT-LLM 모두 기본으로 켬", example: "결과를 한 step 늦게 읽음", boundary: "끝난 요청을 늦게 알아채는 처리 방식은 엔진마다 다릅니다." },
              { term: "kernel", description: "외부 선택 · 자체 구현과 FlashInfer · 메뉴 선택 · ggml 자체", example: "vLLM은 SM100에서 FlashInfer를 통해 TRTLLM kernel 사용", boundary: "같은 backend로 맞춘 뒤에 정책 차이를 비교합니다." },
            ]}
          />
          <ProgressiveDetail
            title="TGI와 LMDeploy는 왜 이 비교에 넣지 않았나요?"
            preview="TGI는 2026-10-14 기준 유지보수 모드이고, LMDeploy TurboMind는 이 글에서 원문 코드를 고정하지 않았습니다."
          >
            <p>
              Hugging Face의 text-generation-inference 저장소 README는 TGI가 유지보수 모드에 들어갔으며 앞으로 vLLM, SGLang, llama.cpp 같은 엔진을 권한다고 적습니다.
              LMDeploy의 TurboMind는 paged attention과 split-K decoding을 지원한다고 README에 적지만, 이 글은 그 KV 관리자 원문을 열어 숫자를 대 보지 않았으므로
              다섯 결정의 표에 넣지 않았습니다.
            </p>
          </ProgressiveDetail>
          <ContentBoundary article="inference-engine-design-axes" />
        </section>

        <section id="review" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 같은 요청으로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>요청 길이가 500에서 497로 바뀌면 vLLM과 TensorRT-LLM의 빈칸은 각각 몇 칸이 되나요? (답: 4절)</p>
            <p>출력 상한을 1,000에서 400으로 낮추면 TensorRT-LLM 기본 정책은 4,096칸에 몇 개를 받나요? (답: 5절)</p>
            <p>system prompt가 1,000이 아니라 1,024 token이면 vLLM이 재사용하는 token 수는 얼마인가요? (답: 7절)</p>
            <p>두 엔진이 같은 FlashInfer backend를 고른 뒤에도 처리량이 다르다면 어느 결정부터 확인해야 하나요? (답: 9절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={engineTrees}
        projectMetas={{
          vllm: { id: "vllm", label: "vLLM v0.27.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          trtllm: { id: "trtllm", label: "TensorRT-LLM 681cff1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          sglang: { id: "sglang", label: "SGLang 4560da5 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "llama.cpp": { id: "llama.cpp", label: "llama.cpp 091b6a7 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
