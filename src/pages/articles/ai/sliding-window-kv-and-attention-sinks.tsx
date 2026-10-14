import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import WindowBlockReleaseViz from "./sliding-window-kv-and-attention-sinks/viz/WindowBlockReleaseViz";
import SinkRingViz from "./sliding-window-kv-and-attention-sinks/viz/SinkRingViz";
import { codeRefs } from "./sliding-window-kv-and-attention-sinks/codeRefs";
import { swaTrees } from "./sliding-window-kv-and-attention-sinks/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function SlidingWindowKvAndAttentionSinksArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 창 밖 기록을 버릴 때 무엇은 남겨야 하나요?</h2>
          <div className={prose}>
            <p>
            어떤 층은 최근 몇백 token만 보도록 학습됩니다. 그런 층에서는 창 밖으로 나간 token의 KV를 다시 읽을 일이 없으므로 서버는 그 메모리를 다른 요청에 돌려줄 수
            있습니다. 긴 대화일수록 이 차이가 커집니다.
          </p>
            <p>이 글의 답을 먼저 적겠습니다. 창 밖으로 완전히 나간 block은 돌려주거나(vLLM의 SlidingWindowManager, TensorRT-LLM의 창 밖 block 분리) 고리 버퍼로 덮어씁니다.</p><p>그런데 창 없이 학습한 모델에 이 방법을 그대로 쓰면 처음 몇 token까지 버리게 되고, 모델이 그 자리에 모아 두던 attention 무게(attention sink)를 잃어 품질이 무너집니다. StreamingLLM은 처음 4개 token과 최근 창만 남겨 이를 피합니다.</p>
            <p>창이라는 attention 모양 자체는 <a href="/cs/ai/sparse-windowed-attention-patterns#window">sparse·windowed attention</a>에서 다뤘습니다. 여기서는 그 모양을 쓰는 서버가 KV block을 언제, 얼마나 돌려주는지와 버리면 안 되는 token이 무엇인지를 봅니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 입력은 지금까지 계산한 token 수와 창 크기, 출력은 쥐고 있을 block입니다</h2>
          <div className={prose}>
            <p>KV 관리자는 요청 하나에 대해 지금까지 계산한 token 수 n과 층의 창 크기 W를 압니다. 다음 token은 자기 자신과 앞의 W − 1개만 봅니다. 그러니 그보다 앞선 token의 KV는 이 요청에서 다시 읽히지 않습니다. 관리자의 출력은 아직 쥐어야 할 block 목록과 pool에 돌려줄 block 목록입니다.</p>
            <p>KV는 token 하나씩이 아니라 block 단위로 할당합니다. 그래서 창 밖 token이 생겨도 그 token이 든 block에 창 안 token이 하나라도 남아 있으면 block을 돌려줄 수 없습니다. 돌려주는 단위와 필요 없어지는 단위가 다르다는 점이 3절의 셈에서 드러납니다.</p>
            <p>한 모델 안에 창이 있는 층과 없는 층이 섞여 있으면 층마다 쥐는 양이 달라집니다. 층을 cache group으로 나눠 한 pool에서 함께 관리하는 방법은 <a href="/cs/ai/hybrid-kv-cache-allocation#overview">hybrid KV cache 할당</a>에 있고, 이 글은 창 있는 층 하나의 규칙에 집중합니다.</p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 창 8, block 4라면 token 20개에서 block 2개만 쥡니다</h2>
          <div className={prose}>
            <p>창 W = 8, block 하나에 token 4개를 담는 작은 모형을 봅시다. (가정) token 7개를 계산했다면 다음 token은 1~7번과 자기 자신을 봅니다. 7 − 8 + 1 = 0이라 건너뛸 token이 없고 block 2개를 그대로 둡니다.</p>
            <p>12개를 계산하면 다음 token의 창은 5~12번입니다. 건너뛸 token은 12 − 8 + 1 = 5개, 곧 0~4번입니다. 그중 0~3번이 든 block 하나만 통째로 창 밖이라 그 block을 돌려줍니다. 4번 token은 5~7번과 같은 block에 있어 남습니다. 20개에서는 건너뛸 token 13개 가운데 block 3개를 돌려주고 2개를 쥡니다. 같은 20개를 full attention 층은 block 5개로 쥡니다.</p>
            <p>실제 모델에서도 같은 셈을 할 수 있습니다. gpt-oss-20b는 24층 가운데 짝수 번째 12층에만 창 128을 겁니다. KV head 8개, head 폭 64라서 token 하나가 한 층에 남기는 KV는 2 × 8 × 64 × 2 byte = 2KiB입니다. 32,768 token 대화에서 창 층은 층마다 128 token만, full 층은 32,768 token을 모두 쥡니다.</p>
          </div>
          <CalculationWalkthrough
            title="gpt-oss-20b의 32K 대화 KV"
            question="창 층이 block을 돌려주면 32,768 token 대화의 KV는 얼마로 줄어들까요?"
            scope="BF16 KV 본체만 셉니다. vLLM 기본 block 16 token을 쓰고, 다음 token 하나를 위해 새로 여는 block과 scale은 넣지 않습니다."
            steps={[
              { label: "token·층당 KV", expression: "2(K·V) × 8 head × 64 × 2 byte", result: "2,048 byte = 2KiB", reason: "모델 설정의 KV head 8개, head 폭 64를 BF16으로 저장합니다." },
              { label: "창 층의 block", expression: "건너뛸 32,768 − 128 + 1 = 32,641 → ⌊32,641 ÷ 16⌋", result: "2,040개 반환, 2,048 − 2,040 = 8개 보유", reason: "다음 token의 창 밖 token을 block 단위로 내립니다." },
              { label: "창 12층", expression: "12 × 128 token × 2KiB", result: "3MiB", reason: "층마다 block 8개, 곧 128 token입니다." },
              { label: "full 12층", expression: "12 × 32,768 × 2KiB", result: "768MiB", reason: "창이 없는 층은 요청이 끝날 때까지 모든 token을 쥡니다." },
              { label: "전체 비교", expression: "(768 + 3) ÷ (768 × 2)", result: "771MiB ÷ 1,536MiB ≈ 50.2%", reason: "창 층이 아무것도 돌려주지 않았다면 24층 모두 768MiB의 절반씩을 썼습니다." },
            ]}
            conclusion="창 층의 KV는 256분의 1로 줄지만 full 층이 그대로라 전체는 절반쯤입니다."
            caveats={["gpt-oss-20b 설정은 Hugging Face config.json(sliding_window 128, KV head 8, head_dim 64)으로 확인했습니다.", "TensorRT-LLM은 block 32 token과 다른 분리 기준을 써서 보유량이 128~159 token 사이를 오갑니다(9절)."]}
          />
          <WindowBlockReleaseViz />
        </section>

        <section id="ring-buffer" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 고리 버퍼는 가장 오래된 처음 token부터 덮습니다</h2>
          <div className={prose}>
            <p>block을 돌려주지 않고 처음부터 칸 W개만 잡아 돌려쓰는 방법도 있습니다. token p를 칸 p mod W에 쓰면 새 token이 늘 가장 오래된 token을 덮습니다. 칸 8개에 token 0~9를 넣으면 8과 9가 0과 1이 있던 칸을 덮습니다. TensorRT-LLM 문서는 이 방식을 cyclic KV cache라고 부릅니다.</p>
            <p>창으로 학습한 층이라면 이것으로 충분합니다. 덮인 0·1은 어차피 창 밖입니다. 문제는 창 없이 학습한 모델을 메모리 때문에 같은 방식으로 돌릴 때 생깁니다. 이 경우 가장 먼저 덮이는 것이 문장의 처음 token인데, 다음 절에서 볼 것처럼 모델은 바로 그 token에 attention을 많이 모아 둡니다.</p>
            <p>StreamingLLM은 처음 4칸을 고정하고 나머지 칸만 돕니다. 같은 칸 8개라면 0~3을 남기고 8·9가 4·5를 덮습니다. 남은 token은 0, 1, 2, 3, 6, 7, 8, 9입니다. 이 집합은 논문 Figure 4의 예와 같습니다.</p>
          </div>
          <SinkRingViz />
        </section>

        <section id="why-sink" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. softmax는 합이 1이라 볼 것이 없어도 어딘가에 무게를 둡니다</h2>
          <div className={prose}>
            <p>attention 가중치는 softmax로 만들어 합이 늘 1입니다. 지금 token이 앞의 어느 token에도 기댈 필요가 없어도 무게를 0으로 만들 수 없습니다. StreamingLLM 논문은 모델이 이 남는 무게를 처음 token들에 몰아 둔다고 설명합니다. 처음 token은 autoregressive 학습에서 뒤의 모든 token이 볼 수 있는 자리라 이런 역할을 맡기 쉽습니다.</p>
            <p>논문은 이것을 실험으로 확인합니다. Llama-2-13B에서 최근 1,024 token만 남긴 window attention의 perplexity는 5,158.07이었고, 처음 4 token을 더해 4 + 1,020으로 두면 5.40이었습니다. 처음 4 token을 줄바꿈 token으로 바꿔도 5.60으로 돌아왔습니다. 의미가 아니라 위치가 중요하다는 해석입니다. 모두 저자의 측정입니다.</p>
            <p>그래서 이 무게가 모이는 처음 token을 attention sink라고 부릅니다. sink를 지우면 그 무게가 남은 token들에 억지로 나뉘어 들어가 attention 분포가 학습 때와 달라집니다. 창으로 학습한 층에는 이 문제가 덜합니다. 학습할 때부터 처음 token 없이 창 안에서 무게를 나누는 법을 배웠기 때문입니다. (가정)</p>
          </div>
          <div id="paper-streamingllm" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Xiao 외 · Efficient Streaming Language Models with Attention Sinks · ICLR 2024 (arXiv 2309.17453)" citeKey={1} href="https://arxiv.org/abs/2309.17453">
              <q>keeps the attention sink tokens’ KV (with just 4 initial tokens sufficing)</q> Table 1은 Llama-2-13B의 0+1024 window가 PPL 5158.07, 4+1020이 5.40, 줄바꿈 4개+1020이 5.60이라고 보고합니다. 같은 논문은 처음 token이 의미가 아니라 위치 때문에 sink가 된다고 해석합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. sink는 softmax 분모에 들어가는 항 하나로 볼 수 있습니다</h2>
          <div className={prose}>
            <p>이제 이름을 붙이겠습니다. 창 밖 block을 pool에 돌려주는 동작은 sliding-window block 반환(sliding-window block release)입니다.</p><p>칸 W개를 p mod W로 돌려쓰는 방식은 고리 버퍼(cyclic KV cache, rolling KV cache)입니다. 남는 attention 무게가 모이는 처음 token은 attention sink이고, sink 몇 개와 최근 창만 남기는 cache는 StreamingLLM cache입니다.</p>
            <p>sink가 하는 일을 식으로 보면 분명해집니다. token 네 개의 점수가 모두 0이면 softmax는 각각 0.25를 줍니다. 분모에 따로 e^b를 더하는 항이 있다면 b = 2일 때 각 token은 1 ÷ (7.39 + 4) ≈ 0.088만 받고 네 token의 합은 0.35입니다. 남는 0.65는 아무 token의 value도 섞지 않는 쪽으로 빠집니다.</p>
            <p>gpt-oss는 바로 이런 항을 head마다 하나씩 학습합니다. 모델 카드는 각 head가 softmax 분모에 학습된 bias를 가지며 이것이 attention sink와 비슷하다고 적습니다. StreamingLLM의 sink는 실제 token의 KV를 남기는 방법이고, gpt-oss의 sink는 KV를 남기지 않는 학습된 값이라는 점이 다릅니다.</p>
          </div>
          <ExplainedFormula
            question="분모에 sink 항이 있으면 token들이 받는 attention 무게는 어떻게 바뀝니까?"
            idea="sink 항은 value를 섞지 않는 자리입니다. 볼 token이 없을 때 남는 무게를 그곳으로 보낼 수 있습니다."
            formula={"a_i=\\frac{e^{s_i}}{e^{b}+\\sum_{j\\in\\mathcal{W}}e^{s_j}}"}
            annotatedFormula={"a_i=\\frac{\\overbrace{e^{s_i}}^{\\text{token }i\\text{의 점수}}}{\\underbrace{e^{b}}_{\\text{sink 항: value 없음}}+\\underbrace{\\sum_{j\\in\\mathcal{W}}e^{s_j}}_{\\text{창 안 token 점수의 합}}}"}
            operations={[
              { expression: "\\sum_{j\\in\\mathcal{W}}e^{s_j}", annotation: ["점수가 모두 0인 네 token이면", "e⁰ × 4 = 4입니다."] },
              { expression: "e^{b}", annotation: ["b = 2이면 7.39입니다.", "b를 빼면 일반 softmax입니다."] },
              { expression: "a_i", annotation: ["1 ÷ 11.39 ≈ 0.088입니다.", "네 token의 합은 0.35이고 나머지 0.65는 sink로 갑니다."] },
            ]}
            terms={[
              { symbol: "s_i", name: "점수", description: "query와 token i의 key를 곱해 scale한 값입니다." },
              { symbol: "\\mathcal{W}", name: "창", description: "이 층이 보는 token 집합입니다. 창 층이면 최근 W개입니다." },
              { symbol: "b", name: "sink 값", description: "gpt-oss에서는 head마다 학습한 값입니다. StreamingLLM에서는 실제 처음 token의 점수들이 이 역할을 나눠 맡습니다." },
            ]}
            assumptions={["점수 0과 b = 2는 설명용 가정입니다.", "StreamingLLM의 sink token은 value도 가지므로 섞이는 값이 0은 아닙니다."]}
            interpretation="sink 항이 없으면 네 token이 1을 모두 나눠 가져야 합니다. 처음 token을 지운 창 cache가 무너지는 이유를 같은 분모로 읽을 수 있습니다."
          />
        </section>

        <section id="trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. gpt-oss 요청 하나에서 창 층은 token마다 block 경계를 확인합니다</h2>
          <div className={prose}>
            <p>gpt-oss-20b 요청이 vLLM에서 32,767 token까지 계산했다고 합시다. 창 층의 관리자는 다음 step 전에 건너뛸 token 수를 32,767 − 128 + 1 = 32,640으로 셉니다. 16으로 나누면 정확히 2,040이라 앞쪽 block 2,040개가 이미 null block으로 바뀌어 있습니다.</p>
            <p>token 하나를 더 계산해 32,768이 되면 건너뛸 token은 32,641입니다. 2,040 block을 넘는 1 token은 다음 block의 첫 칸이라 아직 돌려줄 block이 없습니다. 16개를 더 계산해 건너뛸 token이 32,656이 되어야 2,041번째 block을 돌려줍니다. block을 하나씩 돌려주는 주기가 block 크기 16 token입니다.</p>
            <p>
            같은 요청의 full 층은 이 계산을 하지 않습니다. 기본 구현이 건너뛸 token을 0으로 돌려주므로 요청이 끝날 때까지 2,048개 block을 모두 쥡니다. 이 요청이
            비슷한 prompt를 쓰는 다른 요청과 앞부분을 공유하더라도 창 층의 앞 block은 이미 null block이라 공유할 것이 남아 있지 않습니다.
          </p>
          </div>
        </section>

        <section id="vllm-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. vLLM은 n − W + 1을 block 수로 내려 앞쪽을 null block으로 바꿉니다</h2>
          <div className={prose}>
            <p>vLLM v0.27.1(commit 6e448d0)의 single_type_kv_cache_manager.py 1057–1083행이 SlidingWindowManager의 get_num_skipped_tokens입니다. 원문 주석은 W = 4, 계산 7개에서 0~3을 건너뛴다는 예를 그림으로 그리고, 식은 max(0, n − W + 1) 한 줄입니다.</p>
            <p>
            622–659행의 remove_skipped_blocks가 이 수를 block 크기로 나눠 앞쪽 block을 고릅니다. 595–620행의
            _remove_blocks_in_range는 뒤에서부터 null block으로 바꾸고 이미 null block을 만나면 멈춥니다. full attention 관리자는 기본
            구현이 0을 돌려주므로 이 경로에서 아무것도 하지 않습니다.
          </p>
            <p>1085–1092행은 창 층의 공통 prefix block 수를 늘 0으로 돌려줍니다. 원문 주석은 앞쪽이 null block이라 full 층처럼 참조 수로 셀 수 없다고 적습니다. 같은 prefix를 여러 요청이 읽는 계산을 한 번으로 줄이는 cascade attention을 창 층에는 쓰지 않는다는 뜻입니다.</p>
          </div>
          {code("skipped-tokens", "창 밖 token 수 n − W + 1")}
          {code("remove-skipped", "block 단위 반환과 null block")}
          {code("swa-no-cascade", "창 층의 공통 prefix 0")}
        </section>

        <section id="trt-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. TensorRT-LLM은 창보다 block 하나 더 쌓일 때 맨 앞 block을 뗍니다</h2>
          <div className={prose}>
            <p>TensorRT-LLM(commit 681cff1)의 kvCacheManager.cpp 2274–2290행은 기준을 W + tokensPerBlock으로 둡니다. 쥔 token이 그 수 이상이면 맨 앞 block을 떼는 일을 반복합니다. W = 128, 기본 block 32 token이면 160이 되는 순간 떼므로 128~159 token 사이를 오갑니다. vLLM보다 block이 커서 한 번에 떼는 양도 큽니다.</p>
            <p>3677–3737행의 detachFrontBlock은 뗀 자리에 placeholder를 넣고 참조 수를 줄입니다. 참조가 0이 된 block은 바로 지우지 않고 우선순위를 유지한 채 eviction queue로 보냅니다.</p><p>
            공식 문서도 창 밖으로 나간 block을 radix tree에 남겨 다른 요청이 재사용할 수 있게 한다고 설명합니다. vLLM도 요청의 목록에서는 null block으로
            바꾸지만 block 자체는 free queue로 보내므로 두 엔진 모두 반환과 덮어쓰기 사이에 시간이 있습니다.
          </p>
            <p>같은 함수 첫머리 주석은 "streamLLM is not supported at the moment"이고 창 밖 block은 늘 0번째 block이라고 적습니다. sink를 남기는 경로가 없다는 뜻입니다. llm_args.py 4601–4607행도 예전 sink_token_length 설정이 PyTorch backend에서 무시되며 StreamingLLM을 attention kernel이 지원하지 않는다고 밝힙니다.</p>
          </div>
          {code("trt-adjust", "W + tokensPerBlock 기준의 분리")}
          {code("trt-detach", "창 밖 block의 placeholder와 eviction queue")}
          {code("trt-sink-deprecated", "무시되는 sink_token_length")}
          <div id="paper-trtllm-kvcache" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="TensorRT-LLM docs · KV Cache System · Limited Attention Window Size (2026-10-14 확인)" citeKey={2} href="https://nvidia.github.io/TensorRT-LLM/features/kvcache.html">
              <q>Blocks that leave the attention window are freed and placed on the radix search tree so they can be reused.</q> 같은 문서는 지금 코드가 leaf block만 내보낼 수 있어 full attention 층에는 잘 맞지만 창이 있는 층에는 맞지 않는다고 적습니다. attention 문서는 마지막 N token만 저장하는 cyclic KV cache를 따로 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="streaming-llm" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. StreamingLLM은 sink를 남기고 위치 번호를 cache 안에서 다시 매깁니다</h2>
          <div className={prose}>
            <p>StreamingLLM의 cache는 두 부분입니다. 처음 4 token의 sink와 최근 token을 담는 rolling cache입니다. 논문은 여기에 한 가지 조건을 더합니다. 위치를 원래 문장 위치가 아니라 cache 안 순서로 매긴다는 것입니다. 4절의 cache [0, 1, 2, 3, 6, 7, 8, 9]라면 위치 0~7을 붙입니다.</p>
            <p>
            RoPE 모델에서 이렇게 하려면 key를 회전하기 전 값으로 저장하고 decode마다 cache 안 위치로 다시 회전해야 합니다. 일반 서빙 경로는 그렇지 않습니다. vLLM의
            gpt_oss.py 176–177행처럼 원래 위치로 회전한 key를 attention 층에 넘기고, 그 값이 그대로 cache에 들어갑니다. 서버가 sink block만 남겨도
            같은 결과가 되지는 않는다는 뜻입니다.
          </p>
            <p>논문은 이 방법으로 Llama-2, MPT, Falcon, Pythia가 4백만 token까지 안정적으로 언어 모델링을 했고, 창을 매번 다시 계산하는 방식보다 token당 최대 22.2배 빨랐다고 보고합니다. 처음부터 sink 전용 token 하나를 넣어 학습하면 그 token 하나로 충분하다는 실험도 함께 싣습니다. 모두 저자 측정입니다.</p>
          </div>
          {code("rope-before-cache", "회전한 key가 cache로 가는 경로")}
          <div id="paper-streamingllm-position" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Xiao 외 · StreamingLLM · §3.2 Rolling KV Cache with Attention Sinks" citeKey={3} href="https://arxiv.org/abs/2309.17453">
              <q>StreamingLLM focuses on positions within the cache rather than those in the original text.</q> 같은 절은 RoPE의 경우 회전 전 key를 cache에 두고 decode마다 rolling cache의 key에 위치 변환을 적용한다고 설명합니다. 4백만 token과 22.2배는 저자 보고입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="sink-variants" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 엔진 안의 sink는 세 가지 다른 물건입니다</h2>
          <div className={prose}>
            <p>첫째는 StreamingLLM처럼 실제 처음 token의 KV를 남기는 sink입니다. 9절에서 본 대로 TensorRT-LLM의 PyTorch backend는 이 경로를 지원하지 않습니다.</p>
            <p>
            둘째는 모델이 미리 준 고정 K·V를 모든 요청 앞에 붙이는 sink입니다. vLLM의 StaticSinkAttention은 sink K·V를 cache에 한 번 써 두고
            요청마다 block table 앞에 그 block을 끼워 넣으며 길이를 sink_len만큼 늘립니다. SinkFullAttentionManager는 이 block을 pool에서
            미리 떼어 둡니다. 요청의 KV는 그대로 두고 주소 목록만 바꾸는 방식입니다.
          </p>
            <p>셋째는 gpt-oss처럼 KV 없이 head마다 학습한 값을 softmax 분모에 더하는 sink입니다. 이 경우 서버가 남길 token이 없습니다. 창 층은 3절처럼 block을 돌려주면 됩니다. 같은 모델의 짝수 층에만 창이 걸리는 것도 같은 파일 157–168행에서 확인할 수 있습니다.</p>
            <p>vLLM에는 비슷한 모양의 관리자가 하나 더 있습니다. R-SWA용 RSWAManager는 prompt 앞부분을 남기고 prompt 끝과 현재 decode 창 사이의 가운데 block만 돌려줍니다. prompt 100, block 16, 창 64, 계산 500이면 7번부터 26번까지 block 20개입니다. 앞을 남기고 가운데를 비운다는 점에서 sink + 창과 닮았지만 남기는 앞부분이 prompt 전체라는 점이 다릅니다.</p>
          </div>
          {code("static-sink-table", "block table 앞에 sink block 끼우기")}
          {code("static-sink-populate", "sink K·V를 한 번 쓰기")}
          {code("sink-manager", "sink block을 pool에서 떼어 두기")}
          {code("gpt-oss-sinks", "gpt-oss의 학습된 sink와 짝수 층 창")}
          {code("rswa-gap", "prompt와 창 사이 가운데만 반환")}
          <div id="paper-gpt-oss" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="OpenAI · gpt-oss-120b & gpt-oss-20b Model Card (arXiv 2508.10925)" citeKey={4} href="https://arxiv.org/abs/2508.10925">
              <q>Each attention head has a learned bias in the denominator of the softmax</q> 같은 문단은 attention block이 128 token 폭의 창과 dense 패턴을 번갈아 쓰고, KV head 8개의 GQA를 쓴다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. sink를 남겨도 창 밖 내용을 기억하게 되지는 않습니다</h2>
          <div className={prose}>
            <p>StreamingLLM 논문은 이 방법이 attention 창을 넓히거나 긴 글의 내용을 더 잘 기억하게 하지 않는다고 분명히 적습니다. sink는 분포를 안정시킬 뿐이고, rolling cache에서 밀려난 token의 내용은 사라집니다. 긴 문서의 앞부분을 물어보는 질문에 답하게 해 주는 방법이 아닙니다.</p>
            <p>창으로 학습한 모델과 창 없이 학습한 모델을 구분해야 합니다. gpt-oss, Gemma 3처럼 처음부터 창 층을 가진 모델에서 창 밖 block을 돌려주는 것은 학습과 같은 조건을 지키는 일입니다. 창 없이 학습한 모델을 메모리 때문에 창으로 자르는 것은 학습과 다른 조건이라 sink 같은 보정이 필요해집니다.</p>
            <p>창 층은 다른 최적화와도 따로 확인합니다. vLLM 문서는 sliding-window 층이 KV 양자화에 더 민감하다며 그 층만 제외하는 옵션을 둡니다. 자세한 내용은 <a href="/cs/ai/kv-cache-quantization#boundary">KV cache 양자화</a>에 있습니다. 8절에서 본 것처럼 창 층은 cascade attention과 prefix 공유 계산에서도 빠집니다. 창의 KV가 줄었다는 사실 하나로 요청당 비용 전체를 추정하지 않습니다.</p>
          </div>
          <div id="paper-streamingllm-scope" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Xiao 외 · StreamingLLM · §2 Related Work" citeKey={5} href="https://arxiv.org/abs/2309.17453">
              <q>We do not expand the attention window size of LLMs or enhance the model’s memory and usage on long texts.</q>
            </CitationBlock>
          </div>
          <ContentBoundary article="sliding-window-kv-and-attention-sinks" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>창 W = 8, block 4에서 token 15개를 계산했다면 SWA 층은 block 몇 개를 돌려주고 몇 개를 쥘까요? 같은 요청을 TensorRT-LLM의 W + tokensPerBlock 기준으로 다루면 어떻게 다를까요? (답: 3절, 9절)</p>
            <p>칸 8개짜리 고리 버퍼에 token 0~11을 넣으면 무엇이 남나요? 처음 4칸을 sink로 고정하면요? (답: 4절)</p>
            <p>vLLM에서 sink block 몇 개만 남기도록 관리자를 고쳐도 StreamingLLM과 같은 결과가 나오지 않는 이유는 무엇인가요? (답: 10절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={swaTrees}
        projectMetas={{
          vllm: { id: "vllm", label: "vLLM v0.27.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          "tensorrt-llm": { id: "tensorrt-llm", label: "TensorRT-LLM 고정 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
