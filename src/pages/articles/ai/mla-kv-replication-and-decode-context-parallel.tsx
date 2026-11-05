import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import KvPoolPerCardViz from "./mla-kv-replication-and-decode-context-parallel/viz/KvPoolPerCardViz";
import RankBytesViz from "./mla-kv-replication-and-decode-context-parallel/viz/RankBytesViz";
import DcpDecodeStepViz from "./mla-kv-replication-and-decode-context-parallel/viz/DcpDecodeStepViz";
import CapacityGridViz from "./mla-kv-replication-and-decode-context-parallel/viz/CapacityGridViz";
import { codeRefs } from "./mla-kv-replication-and-decode-context-parallel/codeRefs";
import { mlaDcpTrees } from "./mla-kv-replication-and-decode-context-parallel/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

/**
 * MLA KV는 GPU를 늘려도 줄지 않습니다
 *
 * 이 글은 "MLA latent KV가 TP rank마다 복제되는 이유, token 축으로 나누는 decode context parallel의
 * 계산·통신 경로, 그 결과 8×RTX PRO 6000에서 Kimi K2.5가 담는 token·대화 수"만 소유한다.
 * MLA의 압축·흡수 유도는 multi-head-latent-attention-mechanics, GQA 공유와 token당 byte 공식은
 * kv-cache-fundamentals, FP8 KV의 scale은 kv-cache-quantization, ring 방식 context parallel은
 * tensor-and-pipeline-parallel-inference가 소유한다.
 * 공유 사례: Kimi K2.5(61층, 576 = 512 + 64), TP8, 200,000 token 대화, rtx6kpro 측정 네 값.
 */
export default function MlaKvReplicationAndDecodeContextParallelArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. GPU 8장인데 긴 대화 하나도 다 못 담는 이유는?</h2>
          <KvPoolPerCardViz />
          <div className={prose}>
            <p className="text-lg leading-8">
            1조 파라미터 MoE인 Kimi K2.5를 96 GB 카드 8장에 올린 사람들이 같은 벽을 만났습니다. 가중치는 장마다 약 74 GB로 잘 나뉘는데 20만 token짜리 대화
            하나의 기록을 담을 자리가 모자랐습니다. 메모리 합계는 768 GB인데도 그렇습니다.
          </p>
            <p>
            이 글이 답할 질문은 하나입니다. GPU를 늘리면 가중치는 나뉘는데 대화 기록은 왜 나뉘지 않을까요? 이 모델은 모든 attention head가 숫자 576개짜리 묶음 하나를
            함께 읽어서 head를 기준으로 나누던 방식이 통하지 않습니다.
          </p>
            <p>
            그러면 무엇을 기준으로 나눠야 할까요? 위 그림 마지막 장면처럼 대화의 token을 8장에 번갈아 나눠 담으면 기록이 다시 1/8로 줄어듭니다. 대신 장마다 계산한 부분 결과를
            매 층 합쳐야 하고 그 합치기에는 시간과 아직 덜 다듬어진 구현이라는 비용이 붙습니다.
          </p>
            <p>
            층 하나와 token 네 개로 장마다 드는 byte를 먼저 세고 왜 나눌 수 없는지 본 뒤, token을 나눴을 때 결과를 어떻게 합치는지 따라갑니다. 그다음 Kimi K2.5
            숫자로 용량을 다시 세고 vLLM 원문과 현장 측정, 비용과 다른 구조와의 비교로 마무리합니다.
          </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. config 세 줄과 설정 세 개가 용량을 정합니다</h2>
          <div className={prose}>
            <p>바깥에서 보면 이 문제의 입력은 짧습니다. 모델 쪽은 config.json의 세 값, 곧 층 수 61, 압축 묶음 폭 512, 위치 전용 폭 64입니다. 장비 쪽은 GPU 수, 대화 token을 몇 장에 나눠 담을지, 기록의 숫자 하나를 몇 byte로 저장할지입니다.</p>
            <p>
            출력은 GPU 한 장이 담는 token 수와 그것을 대화 길이로 나눈 동시 대화 수입니다. 에이전트 서빙에서는 동시 대화 수가 곧 동시에 상주시킬 수 있는 에이전트 수라서 처리
            속도보다 먼저 서비스 규모를 정합니다.
          </p>
            <p>config에 적힌 num_key_value_heads 64는 이 상자의 입력이 아닙니다. 이 값만 보고 64개 head를 8장에 8개씩 나누면 된다고 계산하면 틀립니다. 실제 기록이 몇 묶음인지는 4절에서 확인합니다.</p>
            <p>
            attention 행렬곱 자체나 expert 계산, 가중치 양자화는 이 상자 밖에 있습니다. 상자 안쪽은 가장 작은 숫자로 먼저 열어 봅니다.
          </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 전체로 작은 기록이 장 단위로는 더 큽니다</h2>
          <RankBytesViz />
          <div className={prose}>
            <p>층 하나, token 네 개, 숫자당 2 byte로 두 모델을 비교합니다. 첫째는 KV head 4개에 head 폭 128인 모델입니다(가정). 둘째는 모든 head가 숫자 576개를 함께 읽는 모델로, 576은 Kimi K2.5 config의 512와 64를 더한 값입니다.</p>
            <p>첫째 모델의 token 하나는 head마다 K와 V 128개씩, 곧 256개 숫자를 남기고 2 byte라 512 byte입니다. GPU 4장이 head를 하나씩 맡으면 장마다 token당 512 byte, token 4개면 2,048 byte입니다. 네 장의 기록은 모두 다릅니다.</p>
            <p>둘째 모델의 token 하나는 576개 숫자, 1,152 byte로 첫째 모델 전체 2,048 byte보다 작습니다. 그런데 나눌 head가 하나뿐이라 네 장 모두 1,152 byte를 token마다 들어 장마다 4,608 byte입니다. 장 단위로는 첫째 모델의 2.25배입니다.</p>
            <p>
            token을 장마다 하나씩 나눠 담으면 둘째 모델도 장마다 1,152 byte로 내려갑니다. 반대로 첫째 모델을 8장에 올리면 head 4개를 8장이 나눌 수 없어 두 장씩
            같은 head를 들고 장마다 여전히 2,048 byte입니다. 이 숫자 묶음을 글 끝까지 다시 씁니다.
          </p>
          </div>
          <CalculationWalkthrough
            title="층 1개, token 4개에서 장마다 드는 byte"
            question="모델 전체로는 기록이 더 작은 둘째 모델이 GPU 한 장에서는 왜 더 많이 차지할까요?"
            scope="층 1개, token 4개, 숫자당 2 byte의 기록 본체만 셉니다. block 빈칸과 scale은 넣지 않습니다."
            steps={[
              { label: "첫째 모델 token 하나", expression: "4 head × (K 128 + V 128) × 2 byte", result: "2,048 byte", reason: "KV head마다 K와 V를 따로 저장합니다." },
              { label: "첫째 모델, 4장", expression: "2,048 ÷ 4장", result: "token당 512 byte/장", reason: "head가 4개라 장마다 하나씩 나눠 맡습니다." },
              { label: "둘째 모델 token 하나", expression: "(512 + 64) × 2 byte", result: "1,152 byte", reason: "모든 head가 함께 읽는 숫자 576개가 기록의 전부입니다." },
              { label: "둘째 모델, 4장", expression: "1,152 ÷ 1(나눌 head 수)", result: "token당 1,152 byte/장", reason: "나눌 축이 head 하나뿐이라 장마다 통째로 듭니다." },
              { label: "token 4개를 4장에 나눔", expression: "1,152 × (4 ÷ 4)", result: "장마다 1,152 byte", reason: "token 축으로 나누면 장마다 token 하나만 남습니다." },
            ]}
            conclusion="모델 전체 기록의 크기와 GPU 한 장이 드는 크기는 다른 숫자입니다. 나눌 head가 하나면 장 단위 크기는 GPU 수와 상관없이 전체와 같습니다."
            caveats={["KV head 4개와 head 폭 128은 작은 사례용 가정입니다.", "token을 나눠 담으면 결과를 합치는 통신이 생깁니다(5절)."]}
          />
          <div className={prose}>
            <p>
            작은 사례에서 보듯 head 축으로 나눌 수 있는 양에는 head 수라는 상한이 있고 이 모델은 그 상한이 1입니다. 왜 1인지, 그 1을 넘어서려면 무엇을 나눠야 하는지는
            이어지는 두 절에서 다룹니다.
          </p>
          </div>
        </section>

        <section id="why-replicated" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 64개 query head가 같은 576개를 읽기 때문입니다</h2>
          <div className={prose}>
            <p>
            GPU 여러 장에 행렬을 나누는 tensor parallel(TP)은 attention을 head 단위로 나눕니다. head마다 계산이 서로 독립이라 각 장은 자기 head의
            query와 자기 head의 KV만 있으면 됩니다. GQA에서 KV head가 8장에 고르게 나뉘는 것도 이 덕분입니다.
          </p>
            <p>
            MLA는 token마다 key와 value를 head별로 저장하지 않고 둘을 512차원 latent 하나로 압축해 둡니다. 위치 정보는 head 공유 key 64차원에 따로
            둡니다. 원래는 읽을 때 head마다 key를 복원해야 하지만 decode에서는 그 복원 행렬을 query 쪽으로 미리 접어 둡니다.
          </p>
            <p>이 접기를 weight absorption이라고 합니다. 접고 나면 64개 query head 각각이 512차원으로 바뀐 query를 들고 같은 latent를 읽습니다. query는 64개인데 KV는 하나뿐인 multi-query attention(MQA) 모양이 됩니다. 유도는 <Link to="/cs/ai/multi-head-latent-attention-mechanics#weight-absorption">MLA 메커니즘 글</Link>에 있습니다.</p>
            <p>
            TP가 query head를 8장에 8개씩 나누면 장마다 자기 query 8개가 읽을 KV가 필요합니다. 그 KV가 64개 head가 함께 쓰는 576개 숫자 전부라서 장마다
            같은 latent를 통째로 듭니다. 나누지 못하는 것이 아니라 나눌 head 경계가 처음부터 없습니다.
          </p>
          </div>
          <ExplainedFormula
            question="token 하나의 KV 기록은 GPU 한 장에 몇 byte씩 놓일까요?"
            idea="한 장이 드는 KV head 수를 먼저 정하고, 층 수와 head 폭과 숫자 byte를 곱한 뒤, token을 몇 장에 나눴는지로 나눕니다. GQA와 MLA는 첫 단계의 head 수만 다릅니다."
            formula={String.raw`B_{\mathrm{rank}}=\frac{L\cdot H_{\mathrm{rank}}\cdot w\cdot b}{D},\qquad H_{\mathrm{rank}}=\begin{cases}\max\!\left(1,\left\lfloor H_{kv}/T\right\rfloor\right) & \text{GQA}\\ 1 & \text{MLA}\end{cases}`}
            annotatedFormula={String.raw`B_{\mathrm{rank}}=\frac{\overbrace{L}^{\text{층 수}}\cdot\underbrace{H_{\mathrm{rank}}}_{\text{한 장이 드는 KV head}}\cdot\overbrace{w}^{\text{head 하나의 폭}}\cdot\underbrace{b}_{\text{숫자 byte}}}{\underbrace{D}_{\text{token을 나눈 장 수}}}`}
            operations={[
              { expression: String.raw`H_{\mathrm{rank}}=1`, annotation: ["MLA는 TP 크기 T와 상관없이 1입니다.", "vLLM get_num_kv_heads가 MLA면 바로 1을 돌려줍니다."] },
              { expression: String.raw`\max(1,\lfloor H_{kv}/T\rfloor)`, annotation: ["GQA는 head를 T장에 나눕니다.", "H_kv = 4, T = 8이면 몫 0을 1로 올려 두 장이 같은 head를 듭니다."] },
              { expression: String.raw`L\cdot H_{\mathrm{rank}}\cdot w\cdot b`, annotation: ["K2.5: 61 × 1 × 576 × 2 byte = 70,272 byte입니다.", "GQA의 w는 K와 V를 합친 2 × head 폭입니다."] },
              { expression: String.raw`\div D`, annotation: ["token을 D장에 번갈아 나누면 장마다 1/D만 듭니다.", "D = 8이면 70,272 ÷ 8 = 8,784 byte입니다."] },
            ]}
            terms={[
              { symbol: "L", name: "층 수", description: "KV를 남기는 attention 층 수입니다. Kimi K2.5는 61입니다." },
              { symbol: "T", name: "TP 크기", description: "행렬과 head를 나눠 맡는 GPU 수입니다." },
              { symbol: String.raw`H_{kv}`, name: "모델 전체 KV head 수", description: "GQA config의 num_key_value_heads입니다. MLA에서는 쓰이지 않습니다." },
              { symbol: "w", name: "head 하나의 폭", description: "GQA는 K와 V 합 2 × 128 = 256, MLA는 512 + 64 = 576입니다." },
              { symbol: "b", name: "숫자 하나의 byte", description: "BF16은 2, FP8은 1입니다." },
              { symbol: "D", name: "token을 나눈 장 수", description: "6절에서 이름을 붙입니다. 나누지 않으면 1입니다." },
            ]}
            assumptions={["block 끝의 빈칸, FP8 scale, 정렬 공간은 넣지 않은 논리 크기입니다.", "GQA에서 D를 1보다 크게 둘 수 있는 것은 같은 head를 복제로 든 장이 있을 때뿐입니다(8절)."]}
            interpretation="MLA에서 T를 8에서 16으로 늘려도 B_rank는 그대로입니다. 장당 기록을 줄이는 손잡이는 b와 D 두 개뿐입니다. 반대로 GQA에서 T가 H_kv를 넘으면 더 늘린 GPU는 같은 head를 복제할 뿐이라 이 식으로 줄어드는 몫이 없습니다."
          />
          <div id="paper-deepseek-v2" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="DeepSeek-AI · DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model (arXiv 2405.04434)" citeKey={1} href="https://arxiv.org/abs/2405.04434">
              MLA를 제안한 보고서입니다. key·value를 low-rank latent로 함께 압축해 cache를 줄이고, 추론에서는 up-projection 행렬을 query와 output 쪽으로 흡수해 key·value를 다시 만들지 않는다고 설명합니다. 보고서의 관심은 cache 크기와 품질이며, TP 장비에서 이 latent가 복제된다는 점은 다루지 않습니다. 그 결론은 이 절의 head 축 분석과 vLLM 원문(8절)에서 나옵니다.
            </CitationBlock>
          </div>
          <div className={prose}>
            <p>
            GQA는 head 수까지는 GPU를 늘리는 만큼 장당 기록이 줄지만 MLA는 처음부터 줄지 않습니다. 장당 기록을 줄이려면 head가 아닌 다른 축이 필요한데 남은 축은
            token입니다. token으로 나눠도 계산은 맞아떨어질까요?
          </p>
          </div>
        </section>

        <section id="split-and-merge" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. token을 나누면 부분 결과를 분모부터 맞춰 더합니다</h2>
          <DcpDecodeStepViz />
          <div className={prose}>
            <p>token t를 rank t mod 4에 두면 rank마다 대화의 1/4만 남습니다. 문제는 attention이 모든 token에 걸친 softmax라는 점입니다. 한 rank는 자기 token의 점수만 알기 때문에 혼자서는 전체 분모를 모릅니다.</p>
            <p>
            각 rank는 자기 token만으로 계산한 가중합과 그때 쓴 분모의 로그를 함께 냅니다. 분모의 로그를 log-sum-exp(LSE)라고 부르고 head마다 숫자 하나입니다.
            모든 rank의 LSE를 모으면 전체 분모를 정확히 복원할 수 있습니다.
          </p>
            <p>숫자로 확인합니다(가정). rank 0의 token 두 개는 점수 1과 0, 값 2와 4입니다. rank 1은 점수 0과 −1, 값 6과 8입니다. 각자의 분모는 3.718과 1.368이고 각자의 가중합은 2.538과 6.538입니다. 두 결과를 단순 평균하면 4.538이지만 정답은 아닙니다.</p>
            <p>
            전체 분모는 3.718과 1.368의 합 5.086입니다. 각 rank는 자기 분모가 전체에서 차지하는 비율 0.731과 0.269를 자기 결과에 곱합니다. 이를 더한
            3.614는 네 token을 한 장에서 한 번에 계산한 값과 같습니다.
          </p>
          </div>
          <ExplainedFormula
            question="자기 token만 본 rank들의 부분 attention을 어떻게 하나의 정답으로 합칠까요?"
            idea="각 부분 결과는 자기 분모로 나눈 값입니다. 모든 분모의 합을 LSE로 복원한 뒤, 각 결과에 자기 분모의 몫을 곱해 더하면 분모가 하나로 맞춰집니다."
            formula={String.raw`o=\sum_{r=0}^{D-1}e^{\ell_r-\ell}\,o_r,\qquad \ell=\log\sum_{r=0}^{D-1}e^{\ell_r},\qquad \ell_r=\log\sum_{j\in\mathcal{T}_r}e^{s_j}`}
            annotatedFormula={String.raw`o=\sum_{r}\underbrace{e^{\ell_r-\ell}}_{\text{rank r 분모의 몫}}\;\underbrace{o_r}_{\text{자기 token만의 가중합}},\qquad \ell=\underbrace{\log\sum_{r}e^{\ell_r}}_{\text{전체 분모의 로그}}`}
            operations={[
              { expression: String.raw`\ell_r=\log\sum_{j\in\mathcal{T}_r}e^{s_j}`, annotation: ["rank 0: log(e + 1) = log 3.718 = 1.313", "rank 1: log(1 + e^{-1}) = log 1.368 = 0.313"] },
              { expression: String.raw`\ell=\log\sum_{r}e^{\ell_r}`, annotation: ["log(3.718 + 1.368) = log 5.086 = 1.627", "LSE만 모으면 되므로 출력 전체를 보낼 필요가 없습니다."] },
              { expression: String.raw`e^{\ell_r-\ell}\,o_r`, annotation: ["0.731 × 2.538 = 1.855", "0.269 × 6.538 = 1.759"] },
              { expression: String.raw`\sum_{r}`, annotation: ["1.855 + 1.759 = 3.614", "vLLM은 이 덧셈을 reduce-scatter로 하며 head 축으로 다시 나눕니다."] },
            ]}
            terms={[
              { symbol: String.raw`\mathcal{T}_r`, name: "rank r이 든 token 집합", description: "token t를 rank t mod D에 두는 배정입니다." },
              { symbol: String.raw`s_j`, name: "token j의 점수", description: "흡수된 query와 latent의 내적에 위치 점수를 더한 값입니다." },
              { symbol: String.raw`o_r`, name: "부분 출력", description: "자기 token만으로 softmax한 가중합입니다. latent 공간의 벡터입니다." },
              { symbol: String.raw`\ell_r`, name: "부분 LSE", description: "자기 분모의 로그입니다. head마다 숫자 하나입니다." },
            ]}
            assumptions={["점수는 head마다 독립이라 이 합치기를 head마다 따로 합니다.", "실제 kernel은 지수가 넘치지 않도록 최댓값을 먼저 빼고 계산합니다. 값은 같습니다."]}
            interpretation="합치기에 필요한 추가 정보는 head마다 LSE 숫자 하나입니다. 그래서 token을 나눠도 값은 한 장에서 계산한 것과 같고, 비용은 정확도가 아니라 통신 횟수로 나타납니다. 단순 평균 4.538과 정답 3.614의 차이가 LSE를 빼먹었을 때의 오류입니다."
          />
          <CalculationWalkthrough
            title="두 rank의 부분 attention 합치기"
            question="token 네 개를 두 rank에 나눴을 때 합친 결과가 한 장 계산과 같은지 확인합니다."
            scope="head 하나, 값은 스칼라로 단순화했습니다(가정). 실제 값은 512차원 latent 벡터입니다."
            steps={[
              { label: "rank 0 분모", expression: "e¹ + e⁰", result: "3.718", reason: "rank 0의 token 점수는 1과 0입니다." },
              { label: "rank 0 부분 출력", expression: "(2.718 × 2 + 1 × 4) ÷ 3.718", result: "2.538", reason: "자기 분모로만 정규화한 가중합입니다." },
              { label: "rank 1 분모와 출력", expression: "e⁰ + e⁻¹ · (6 + 0.368 × 8) ÷ 1.368", result: "1.368 · 6.538", reason: "rank 1의 점수는 0과 −1, 값은 6과 8입니다." },
              { label: "몫", expression: "3.718 ÷ 5.086 · 1.368 ÷ 5.086", result: "0.731 · 0.269", reason: "exp(ℓ_r − ℓ)는 자기 분모를 전체 분모로 나눈 값과 같습니다." },
              { label: "합치기", expression: "0.731 × 2.538 + 0.269 × 6.538", result: "3.614", reason: "한 장에서 네 token을 한 번에 계산한 18.380 ÷ 5.086과 같습니다." },
            ]}
            conclusion="LSE로 분모를 맞춘 합은 한 장 계산과 같습니다. 부분 출력을 그냥 평균하면 4.538로 틀립니다."
            caveats={["실제 계산은 head마다, 층마다 반복됩니다.", "몫을 곱하는 대신 최댓값을 빼는 안정화 형태로 구현합니다."]}
          />
          <AlgorithmBlock
            title="token을 D장에 나눈 decode 한 층 (rank r 기준)"
            input={["q_r: rank r이 맡은 query head 묶음 (K2.5 TP8이면 8개 head)", "C_r: rank r이 든 token의 latent 기록 (token t mod D = r)", "D: token을 나눈 장 수"]}
            steps={[
              { code: "Q ← all_gather_D(q_r)", note: "모든 head의 query를 모읍니다. 내 token에도 64개 head 전부의 점수가 필요합니다. 통신 1." },
              { code: "(o_r, ℓ_r) ← attention(Q, C_r)", note: "자기 token만 읽어 부분 출력과 head별 LSE를 냅니다. 이 단계에는 통신이 없습니다." },
              { code: "Lall ← all_gather_D(ℓ_r)", note: "head마다 숫자 하나인 LSE를 모읍니다. 통신 2, 크기는 작습니다." },
              { code: "ℓ ← log Σ_r exp(Lall[r])", note: "전체 분모의 로그를 head마다 만듭니다." },
              { code: "o_r ← exp(ℓ_r − ℓ) · o_r", note: "자기 몫만큼 부분 출력의 크기를 줄입니다. 위 사례의 0.731 곱하기입니다." },
              { code: "out_r ← reduce_scatter_D(o_r, axis = head)", note: "더하면서 head 축으로 다시 나눠, 내가 맡은 head의 완성 출력만 받습니다. 통신 3." },
            ]}
            output="rank r이 맡은 query head의 attention 출력(latent 공간). 이어서 흡수된 W^O W^UV로 model 차원으로 보냅니다."
          />
          <div className={prose}>
            <p>합치는 원리는 FlashAttention이 block마다 분모를 갱신하는 <Link to="/cs/ai/flash-attention-io-aware-kernel#online-softmax">online softmax</Link>와 같습니다. 다른 점은 합칠 대상이 다른 GPU에 있다는 것뿐입니다. 값이 맞는다는 것까지 확인했으니 남은 것은 이 구성들에 붙은 공식 이름입니다.</p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 이 구성에는 각각 이름이 있습니다</h2>
          <div className={prose}>
            <p>
            장마다 같은 latent가 통째로 놓이는 현상, token을 나눠 담는 설정, 부분 결과를 분모부터 맞춰 더하는 계산에는 각각 이름이 있습니다. 숫자 byte를 줄이는 쪽의
            이름도 함께 적어 둡니다.
          </p>
          </div>
          <TermBreakdown
            title="역할에서 이름으로"
            items={[
              { term: "TP 아래 MLA KV 복제", description: "TP rank마다 같은 latent KV가 통째로 놓이는 상태입니다. vLLM은 MLA 층의 KV head 수를 1로 셉니다.", example: "K2.5 TP8에서 token당 70,272 byte가 8장에 똑같이 놓입니다.", boundary: "GQA의 복제는 TP가 KV head 수를 넘을 때만 생기고, MLA는 TP 2부터 생깁니다." },
              { term: "decode context parallel (DCP)", description: "decode 중 같은 KV를 들던 rank들이 token 축으로 KV를 나눠 갖게 하는 설정입니다. vLLM 옵션은 --decode-context-parallel-size입니다.", example: "DCP 8이면 장마다 token당 평균 8,784 byte입니다.", boundary: "prefill에서 KV block을 ring으로 돌리는 context parallel과 달리, decode에서 KV는 제자리에 두고 query와 결과만 오갑니다." },
              { term: "LSE 병합", description: "부분 attention의 출력과 log-sum-exp를 함께 받아 분모를 맞춘 뒤 더하는 계산입니다.", example: "0.731 × 2.538 + 0.269 × 6.538 = 3.614", boundary: "LSE를 돌려주지 못하는 attention backend는 DCP에 쓸 수 없습니다." },
              { term: "FP8 KV cache", description: "KV 숫자 하나를 1 byte로 저장하는 형식입니다. vLLM 옵션은 --kv-cache-dtype fp8입니다.", example: "K2.5 token당 35,136 byte입니다.", boundary: "scale과 포화 오차는 KV 양자화 글에서 다룹니다. DCP와 함께 쓰는 경로는 SM120에서 패치 이력이 있습니다(10절)." },
            ]}
          />
          <div className={prose}>
            <p>DCP는 이미 있는 <Link to="/cs/ai/tensor-and-pipeline-parallel-inference#sequence-context-parallel">context parallel</Link>의 decode판입니다. 그 글이 말하듯 decode에서는 query가 token 하나라 KV를 돌리는 ring이 이득이 없으므로 KV를 나눠 둔 채 작은 query와 결과만 옮깁니다. FP8 KV의 scale은 <Link to="/cs/ai/kv-cache-quantization#names">KV cache 양자화</Link>에서 다룹니다.</p>
          </div>
        </section>

        <section id="trace" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. Kimi K2.5 한 대화는 장마다 14.1 GB입니다</h2>
          <div className={prose}>
            <p>3절의 숫자 묶음을 실제 모델로 키웁니다. Kimi K2.5는 61층 모두 MLA라 token 하나가 층마다 576개, 모두 35,136개 숫자를 남깁니다. BF16이면 70,272 byte, 약 68.6 KiB입니다. (계산)</p>
            <p>20만 token 대화 하나면 70,272 byte에 200,000을 곱해 약 14.1 GB입니다. TP8에서 이 14.1 GB가 8장에 똑같이 놓이므로 노드 전체로는 112 GB를 써서 대화 하나를 담는 셈입니다. FP8로 저장하면 장마다 7.0 GB입니다. (계산)</p>
            <p>장마다 남는 자리는 커뮤니티 측정 token 수로 역산합니다. BF16에서 약 190,000 token이 잡혔으니 자리는 190,000 곱하기 70,272 byte, 약 13.4 GB입니다. 대화 하나 14.1 GB에 못 미쳐 200K 대화는 0.95개만 들어갑니다. (계산)</p>
          </div>
          <CapacityGridViz />
          <CalculationWalkthrough
            title="Kimi K2.5의 token 하나에서 노드의 대화 수까지"
            question="8×RTX PRO 6000에서 200K token 대화를 몇 개 상주시킬 수 있을까요?"
            scope="61층 MLA latent 본체만 셉니다. 장당 자리는 rtx6kpro 측정 token 수에서 역산하며, block 빈칸·scale·작업 공간은 측정값 안에 이미 들어 있습니다."
            steps={[
              { label: "층마다 폭", expression: "512 + 64", result: "576개", reason: "config의 kv_lora_rank와 qk_rope_head_dim입니다." },
              { label: "token 하나", expression: "61층 × 576개 × 2 byte", result: "70,272 byte", reason: "61층 모두 같은 폭의 latent를 남깁니다." },
              { label: "대화 하나, 장마다", expression: "70,272 byte × 200,000 token", result: "14.1 GB", reason: "DCP 없이는 이 전부가 8장에 똑같이 놓입니다." },
              { label: "BF16 자리 역산", expression: "190,000 token × 70,272 byte", result: "약 13.4 GB/장", reason: "측정값 약 19만 token을 byte로 바꿉니다." },
              { label: "FP8 · DCP8 자리 역산", expression: "3,621,504 ÷ 8 × 35,136 byte", result: "약 15.9 GB/장", reason: "장마다 452,688 token의 1 byte 기록입니다." },
              { label: "200K 대화 수", expression: "3,621,504 ÷ 200,000", result: "18개", reason: "BF16 DCP1의 0.95개와 비교합니다." },
            ]}
            conclusion="같은 노드가 담는 200K 대화는 BF16 DCP1에서 0.95개, FP8 DCP8에서 18개입니다. 차이의 8배는 token 나눔, 2배 남짓은 byte 절반에서 옵니다."
            caveats={["BF16 측정의 gpu-util(vLLM --gpu-memory-utilization, GPU 메모리 중 vLLM이 쓸 상한 비율) 설정은 기록에 없어 두 자리(13.4 GB와 15.9 GB)가 다릅니다. 그래서 FP8 효과가 정확히 2배가 아니라 2.4배로 보입니다.", "자리 역산은 측정 token 수에 이론 byte를 곱한 값이라 실제 allocator 크기와 다를 수 있습니다(추정)."]}
          />
          <div className={prose}>
            <p>
            8장에 나누면 장마다 452,688 token을 들고 그 1 byte 기록은 15.9 GB로 FP8 DCP1에서 역산한 15.8 GB와 0.7% 차이입니다. 두 측정은 같은
            자리를 서로 다른 방식으로 채웠고, 4절 식의 ÷D가 측정과 맞는다는 것도 여기서 확인됩니다. (계산)
          </p>
          </div>
        </section>

        <section id="vllm-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. vLLM은 MLA의 KV head를 1개로 셉니다</h2>
          <div className={prose}>
            <p>4절의 식이 실제 엔진과 같은지 vLLM v0.33.0 원문으로 확인합니다. config/model.py의 get_num_kv_heads는 MLA면 첫 줄에서 1을 돌려줍니다. 주석은 decode에서 MQA가 되기 때문이라고 적습니다. GQA 경로는 total KV head를 TP로 나누고 몫이 0이면 1로 올립니다.</p>
            <p>head 하나의 폭은 model_arch_config_convertor.py가 정합니다. MLA면 kv_lora_rank에 qk_rope_head_dim을 더하므로 K2.5는 576입니다. 이 두 함수만으로 장마다 token당 61층 × 1 head × 576개라는 3절의 장부가 나옵니다.</p>
          </div>
          {code("kv-heads-per-rank", "MLA면 KV head 1개, GQA면 head ÷ TP")}
          {code("mla-head-size", "MLA cache 폭 = 512 + 64")}
          <div className={prose}>
            <p>
            DCP 크기의 상한도 같은 파일에 있습니다. MLA가 아니면 TP가 KV head 수보다 커야 하고, 최대 DCP는 TP를 KV head 수로 나눈 몫입니다. 곧 복제로 같은
            head를 든 장만 token 축으로 묶을 수 있습니다. MLA는 이 검사를 건너뛰어 DCP를 TP 크기까지 올립니다.
          </p>
            <p>token 배정은 backends/utils.py의 get_dcp_local_seq_lens가 셉니다. 길이 10인 대화를 DCP 4로 나누면 몫 2를 먼저 주고 남은 2개를 rank 0과 1이 하나씩 더 가져가 3, 3, 2, 2입니다. 5절의 t mod D 배정과 같습니다.</p>
          </div>
          {code("dcp-gqa-limit", "GQA의 DCP 상한 = TP ÷ KV head")}
          {code("dcp-local-seq-lens", "rank마다 든 token 수 계산")}
          <div className={prose}>
            <p>
            decode 한 층의 순서는 mla_attention.py에 있습니다. query를 DCP 그룹에서 모으면 forward_mqa가 자기 token으로 부분 출력과 lse를 내고
            dcp_manager.combine이 이를 합칩니다. 5절 AlgorithmBlock의 여섯 줄이 이 세 호출에 대응합니다.
          </p>
            <p>
            합치는 기본 함수는 ops/dcp.py의 cp_lse_ag_out_rs입니다. lse를 all-gather한 뒤 correct_attn_out이 몫을 곱하고 출력을
            reduce-scatter합니다. dcp_comm_backend를 a2a로 두면 all-to-all 한 번으로 바꾸는 경로도 있습니다.
          </p>
          </div>
          {code("dcp-decode-path", "query 모으기 → 부분 attention → 합치기")}
          {code("lse-combine", "lse all-gather와 출력 reduce-scatter")}
          {code("combine-backend", "기본 ag+rs와 a2a 선택")}
          <div className={prose}>
            <p>
            RTX PRO 6000 같은 SM120에서 쓸 수 있는 MLA backend는 TRITON_MLA입니다. supports_dcp = True를 선언하고 FP8 KV는 SM89
            이상에서 받습니다. 다만 이 선언은 코드 경로가 있다는 뜻이지 그 조합이 이 장비에서 안정적이라는 보증은 아닙니다(10절).
          </p>
          </div>
          {code("triton-mla-dcp", "TRITON_MLA의 DCP 선언과 FP8 하한")}
        </section>

        <section id="field-report" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 현장 측정표의 네 칸이 같은 식을 따릅니다</h2>
          <div className={prose}>
            <p>8×RTX PRO 6000에서 Kimi K2.5를 돌린 기록은 rtx6kpro 위키의 kimi-k25.md에 모여 있습니다. 디스코드 대화를 정리한 커뮤니티 기록이라 이 글은 현장 경험 등급으로 인용합니다. 네 칸은 BF16 DCP1 약 190,000, BF16 DCP8 약 1,500,000, FP8 DCP1 약 449,600, FP8 DCP8 3,621,504 token입니다.</p>
            <p>4절 식에 넣으면 같은 dtype끼리 DCP8 대 DCP1은 7.9배와 8.05배로 ÷D와 맞습니다. 같은 DCP끼리 FP8 대 BF16은 2.37배와 2.41배로 2보다 큽니다. FP8 행에만 gpu-util 0.93이 적혀 있어 두 행의 자리 크기가 달랐던 것으로 봅니다. (추정)</p>
          </div>
          <div id="paper-rtx6kpro" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="local-inference-lab/rtx6kpro · models/kimi-k25.md (commit 1b6de11b, 2026-11-02 확인)" citeKey={2} href="https://github.com/local-inference-lab/rtx6kpro/blob/main/models/kimi-k25.md">
              <q>DCP (--decode-context-parallel-size 8) shares KV cache across all 8 cards. It is critical for long context with Kimi K2.5.</q> 같은 문서의 표가 KV 용량 네 값과, DCP 없이 150K에서 약 6~7 tok/s, DCP 8에서 28~35 tok/s를 적습니다. 실행 명령은 TP 8, DCP 8, TRITON_MLA, kv-cache-dtype fp8이고 vLLM PR #34597과 #34795를 체리픽하라고 적습니다.
            </CitationBlock>
          </div>
          <ProgressiveDetail title="이 측정표에서 빠진 실행 조건은 무엇인가요?" preview="vLLM 버전과 BF16 행의 메모리 설정, 반복 횟수가 없습니다. 용량 네 값은 서로 비교할 수 있지만 다른 장비의 기준값으로 옮기지는 않습니다.">
            <p>Docker 이미지는 voipmonitor/vllm-openai:cu130-nightly-patched로 적혀 있지만 그 안의 vLLM commit은 없습니다. BF16 두 행은 gpu-memory-utilization이 적혀 있지 않고, 측정 반복 횟수와 오차도 없습니다. 같은 문서 개요표는 총 파라미터를 약 530B로 적어 공식 1T와 다릅니다.</p>
            <p>
            이 글은 네 값 사이의 비율과 4절 식의 일치만 주장합니다. 3,621,504라는 절대값이 다른 노드에서 재현된다고는 주장하지 않습니다. 같은 문서의 100 동시 요청 900
            tok/s는 P2P를 끈 상태였다는 점도 원본 스크린샷에서 확인되었습니다.
          </p>
          </ProgressiveDetail>
          <div className={prose}>
            <p>
            8절의 원문과 이 표를 겹쳐 보면 앞뒤가 맞습니다. 엔진은 MLA KV를 head 1개로 세어 장마다 복제하고 DCP 8은 그 복제를 token 축 분할로 바꾸며, 측정 용량은
            그 비율대로 8배 늘었습니다. 이 8배에도 치르는 값이 있습니다.
          </p>
          </div>
        </section>

        <section id="costs" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 8배의 자리는 속도와 안정성으로 값을 치릅니다</h2>
          <div className={prose}>
            <p>첫 비용은 단일 요청 속도입니다. 같은 위키에서 FP8 KV, TRITON_MLA의 DCP1은 79 tok/s, DCP8은 65 tok/s입니다. 다른 사용자의 backend 비교표도 FP8 79 대 68, BF16 78 대 67로 DCP가 약 11~14 tok/s를 깎습니다. (현장 경험)</p>
            <p>
            흔히 인용하는 90에서 65로의 하락에는 다른 원인이 섞여 있습니다. 90은 BF16 KV를 FlashInfer FA2 backend로 돌린 값인데 FA2는 FP8 KV를 받지
            못합니다. 같은 TRITON_MLA끼리 비교하면 DCP만의 몫은 79에서 65입니다.
          </p>
            <p>
            속도가 떨어지는 이유는 5절의 통신입니다. vLLM 기본 경로는 MLA 층마다 query all-gather, lse all-gather, 출력 reduce-scatter 세
            번을 더합니다. 61층이면 decode step마다 183번이고 TP가 원래 하던 층당 두 번의 all-reduce 122번 위에 얹힙니다. (계산)
          </p>
            <p>
            긴 대화에서는 반대가 됩니다. DCP 없이 150K 문맥이면 약 6~7 tok/s로 떨어지고 DCP 8이면 28~35 tok/s를 유지했다고 위키는 적습니다. 장마다 읽는
            KV가 1/8이 되는 것으로 방향은 설명되지만 이만큼의 차이는 대역폭 산수로 다 설명되지 않아 원인은 확인하지 못했습니다. (현장 경험)
          </p>
          </div>
          <div className={prose}>
            <p>
            정확성도 대가를 치릅니다. vllm#41623은 DCP를 켜면 출력이 어긋나고 무관한 문장이 나온다는 회귀 보고로, 2026-11-03 기준 열려 있습니다. 보고 환경은
            8×A100, Kimi-K2.6, v0.21.0과 nightly이며 특정 두 commit 사이에서 생겼다고 적습니다.
          </p>
            <p>
            SM120에서는 전제 조건도 따져야 합니다. FP8 KV를 TRITON_MLA decode에 넣은 PR #34597은 2026-03-12에 병합됐습니다. FP8 KV와 DCP를
            함께 허용하던 PR #34795는 병합되지 않고 2026-07-05 비활동으로 닫혔습니다.
          </p>
            <p>
            v0.33.0 원문에서는 #34795가 지우려던 두 assert 문장을 찾을 수 없어 그 조합을 막는 코드는 다른 경로로 사라진 것으로 보입니다. 다만 SM120에서 패치 없는
            upstream 이미지로 FP8과 DCP 8을 함께 켠 보고는 근거에 없습니다. (미확인)
          </p>
            <p>
            K2.7의 FP8 KV가 SM120에서 Out of Resource로 실패한 #46721도 수정 확인 없이 비활동으로 닫혔습니다. FP8과 DCP 8은 커뮤니티 패치 이미지에서
            검증된 조합이므로 공식 릴리스로 옮길 때는 정확성 평가부터 다시 해야 합니다.
          </p>
          </div>
          <div id="paper-vllm-41623" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="vLLM issue #41623 · Decode Context Parallelism output drift and gibberish (2026-05-04 개설, 2026-11-03 OPEN 확인)" citeKey={3} href="https://github.com/vllm-project/vllm/issues/41623">
              <q>Only when --decode-context-parallel-size is set, Kimi-K2.6 leads to completely unrelated gibberish.</q> 보고자는 8×A100에서 TP 8, DCP 8, max-model-len 262,144로 재현했고 회귀가 생긴 commit 구간을 적었습니다. RTX PRO 6000 보고가 아니므로 SM120에서도 같은 증상인지는 별도로 확인해야 합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="agents" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 긴 문맥 에이전트에게는 대화 수가 곧 용량입니다</h2>
          <div className={prose}>
            <p>이 숫자가 왜 중요한지는 실제 사용 모양에서 드러납니다. 사용자 자신의 Claude Code 기록 887세션, 18,353회 호출에서 호출당 문맥 중앙값은 205K token이었습니다. 이 길이면 FP8 DCP8 노드에 17개, BF16 DCP1 노드에는 하나도 온전히 들어가지 않습니다. (계산)</p>
            <p>자리가 모자라면 기록을 지우고 다음 호출 때 다시 만들어야 합니다. 공개 연구는 Qwen3.6-27B, H100 환경에서 동시 에이전트를 15에서 20으로 늘리자 prefix cache 적중률이 98.85%에서 16.78%로, 요청당 생성 속도가 30.08에서 16.96 tok/s로 떨어졌다고 보고합니다.</p>
            <p>
            18개 위로 넘치는 대화는 GPU 밖에 둡니다. 호스트 DRAM에 KV를 내려 두었다가 다시 올리는 LMCache 같은 계층이 다음 단계입니다. FP8 대화 하나의 전체
            latent 7.0 GB를 기준으로 하면 1.5 TB 호스트 메모리는 약 213개 대화를 담는 크기입니다. (계산)
          </p>
            <p>다만 DCP로 8장에 나뉜 KV를 LMCache가 어떤 모양으로 내려받고 다시 나눠 올리는지는 이 글에서 확인하지 못했습니다. (미확인) 선점과 swap의 기본 동작은 <Link to="/cs/ai/serving-memory-admission-and-preemption">메모리 수용과 선점</Link>에서 이어집니다.</p>
          </div>
          <CalculationWalkthrough
            title="205K 문맥 에이전트를 몇 개 상주시키나"
            question="사용자 기록의 중앙 문맥 205K token으로 GPU와 호스트 메모리 각각에 대화가 몇 개 들어갈까요?"
            scope="Kimi K2.5 MLA latent만 셉니다. 호스트 쪽은 전체 latent를 한 벌 저장한다고 가정하고 LMCache의 metadata와 정렬은 넣지 않습니다."
            steps={[
              { label: "GPU, FP8 DCP8", expression: "3,621,504 ÷ 205,000", result: "17개", reason: "측정 용량을 대화 길이로 나눕니다." },
              { label: "GPU, BF16 DCP1", expression: "190,000 ÷ 205,000", result: "0.93개", reason: "대화 하나도 끝까지 담지 못합니다." },
              { label: "호스트용 200K 대화 하나", expression: "35,136 byte × 200,000", result: "7.0 GB", reason: "FP8 latent 전체 한 벌입니다." },
              { label: "1.5 TB 호스트", expression: "1,500 GB ÷ 7.03 GB", result: "약 213개", reason: "GPU 밖에서 기다리는 대화의 상한입니다(계산)." },
            ]}
            conclusion="GPU에 상주하는 대화는 18개 안팎이고, 그 위의 대화는 호스트 계층으로 받아야 적중률 붕괴를 피할 수 있습니다."
            caveats={["1.5 TB는 노드 설계 제안값이지 측정된 장비가 아닙니다.", "Mooncake 보고의 K2.5 FP8 100K 세션 약 3.8 GB와 이 계산의 3.5 GB는 같은 크기대입니다(추정)."]}
          />
          <AlgorithmBlock
            title="MLA 모델의 노드당 상주 대화 수 견적"
            input={["config.json: num_hidden_layers L, kv_lora_rank, qk_rope_head_dim", "서버 설정: TP 크기 T, DCP 크기 D, KV dtype byte b", "vLLM 시작 로그의 KV cache token 수 N_log", "대화 문맥 길이 분포의 중앙값 C"]}
            steps={[
              { code: "w ← kv_lora_rank + qk_rope_head_dim", note: "num_key_value_heads는 쓰지 않습니다. K2.5는 576입니다." },
              { code: "B_rank ← L · 1 · w · b / D", note: "4절 식입니다. T는 들어가지 않습니다." },
              { code: "pool ← N_log / D · L · w · b", note: "로그의 token 수로 장당 자리를 역산해 다른 설정을 예측합니다." },
              { code: "N(D', b') ← pool · D' / (L · w · b')", note: "DCP나 dtype을 바꿨을 때의 용량을 미리 계산합니다." },
              { code: "agents ← floor(N / C)", note: "평균이 아닌 중앙값이나 상위 분위 문맥으로 나눕니다." },
              { code: "if agents < 목표: D 또는 b를 조정하고 정확성 평가를 다시 실행", note: "DCP는 drift 버그 이력이 있어 용량 계산만으로 채택하지 않습니다." },
            ]}
            output="노드 하나가 GPU에 상주시킬 수 있는 대화 수와, 호스트 계층으로 넘겨야 할 대화 비율"
          />
          <div id="paper-agentic-workload" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Yuan 외 · Agentic AI Workload Characteristics (arXiv 2605.26297, IISWC 2026)" citeKey={4} href="https://arxiv.org/abs/2605.26297">
              에이전트 작업에서 LLM 추론이 전체 실행 시간의 71~98%를 차지하고, Table II에서 동시성이 KV 용량을 넘을 때 prefix cache 적중률이 98.85%에서 16.78%로 무너진다고 보고합니다. 측정 모델은 Qwen3.6-27B, H100이며 Kimi K2.5나 RTX PRO 6000이 아닙니다. 붕괴가 일어나는 동시성 숫자는 모델과 KV 용량에 따라 다릅니다.
            </CitationBlock>
          </div>
        </section>

        <section id="other-architectures" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 다른 attention 구조는 다른 축으로 KV를 줄입니다</h2>
          <div className={prose}>
            <p>GQA부터 봅니다. Qwen3-235B-A22B는 94층, KV head 4개, head 폭 128이라 token 하나의 KV가 BF16 192,512 byte로 K2.5의 2.7배입니다. 그런데 TP8에서는 head 하나씩 두 장이 나눠 들어 장마다 48,128 byte로, K2.5의 70,272 byte보다 작습니다. (계산)</p>
            <p>
            이 모델에도 DCP를 쓸 수 있지만 상한은 TP 8을 KV head 4로 나눈 2입니다. DCP 2면 장마다 24,064 byte입니다. 복제가 2배뿐이라 되찾을 몫도
            2배뿐이고 K2.5처럼 8배가 열리지 않습니다. (계산)
          </p>
            <p>linear attention과 섞은 hybrid는 축 자체가 다릅니다. Qwen3.6-27B는 64층 중 16층만 token마다 KV를 쌓는 attention이고 48층은 대화 길이와 상관없이 고정 크기 state를 둡니다. 이 state가 TP에서 어떻게 나뉘는지는 이 글에서 확인하지 않았습니다.</p>
            <p>Kimi K3도 93층 중 24층만 Gated MLA이고 69층은 KDA라는 고정 state입니다. config의 kv_lora_rank 512, qk_rope_head_dim 64를 그대로 쓰면 token당 24층 × 576개 × 2 byte, 27,648 byte입니다. config에 mla_use_nope가 true라 실제 저장 폭은 확인하지 못했습니다. (계산, 미확인)</p>
            <p>
            K3의 24층도 MLA라 TP에서 복제되는 성질은 그대로입니다. 가중치가 1,561 GB라 현장에서는 PRO 6000 16장에 TP16과 DCP16을 건 구성이 쓰였습니다.
            sliding window 층은 또 달라서 창 길이가 보존량의 상한이고, 창 밖 block을 실제로 돌려주는지는 runtime마다 다릅니다.
          </p>
          </div>
          <div className="not-prose my-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-3 font-bold">구조 (예)</th>
                  <th className="py-2 pr-3 font-bold">문맥에 따라 커지는 것</th>
                  <th className="py-2 pr-3 font-bold">TP가 나누는가</th>
                  <th className="py-2 font-bold">장당 기록을 줄이는 손잡이</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3">GQA (Qwen3-235B-A22B)</td>
                  <td className="py-2 pr-3">94층 KV, token당 192,512 B</td>
                  <td className="py-2 pr-3">KV head 4개까지, 넘으면 복제</td>
                  <td className="py-2">FP8, DCP ≤ TP ÷ 4</td>
                </tr>
                <tr className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3">MLA (Kimi K2.5)</td>
                  <td className="py-2 pr-3">61층 latent, token당 70,272 B</td>
                  <td className="py-2 pr-3">나누지 않음, 장마다 복제</td>
                  <td className="py-2">FP8, DCP ≤ TP</td>
                </tr>
                <tr className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3">hybrid MLA + KDA (Kimi K3)</td>
                  <td className="py-2 pr-3">24층 latent만, 나머지 69층은 고정 state</td>
                  <td className="py-2 pr-3">MLA 층은 복제</td>
                  <td className="py-2">층 구성 자체, FP8, DCP</td>
                </tr>
                <tr className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3">hybrid attention + DeltaNet (Qwen3.6-27B)</td>
                  <td className="py-2 pr-3">16층 KV만, 48층은 고정 state</td>
                  <td className="py-2 pr-3">attention 층은 GQA 규칙</td>
                  <td className="py-2">층 구성 자체</td>
                </tr>
                <tr className="align-top">
                  <td className="py-2 pr-3">sliding window 층</td>
                  <td className="py-2 pr-3">창 길이까지만</td>
                  <td className="py-2 pr-3">head 규칙은 같음</td>
                  <td className="py-2">창 밖 block 회수 (runtime 의존)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={prose}>
            <p>표의 마지막 열이 이 글의 결론을 다시 말해 줍니다. MLA는 token당 기록이 이미 작지만 GPU를 늘려도 장당 몫이 줄지 않는 구조라 남은 손잡이는 byte와 token 나눔뿐입니다. hybrid 구조의 층 배치는 <Link to="/cs/ai/hybrid-kv-cache-allocation">hybrid KV cache 할당</Link>, 창 밖 회수는 <Link to="/cs/ai/sliding-window-kv-and-attention-sinks">sliding window KV</Link>에서 다룹니다.</p>
          </div>
          <ContentBoundary article="mla-kv-replication-and-decode-context-parallel" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 숫자를 바꾸기 전에 결과를 예상해 보세요</h2>
          <div className={prose}>
            <p>같은 Kimi K2.5를 PRO 6000 16장, TP16에 올리고 DCP는 끄면 장마다 담는 token 수는 TP8과 비교해 어떻게 될까요? 가중치 몫이 줄어든 만큼만 늘어날까요? (답: 4절, 7절)</p>
            <p>Qwen3-235B-A22B를 TP8에 올리고 DCP 4를 요청하면 vLLM은 어떻게 반응할까요? DCP 2와 장당 byte는 어떻게 다를까요? (답: 8절, 12절)</p>
            <p>두 rank의 부분 출력이 2.538과 6.538일 때 LSE 없이 평균만 낸 4.538은 어느 쪽으로 틀렸나요? 그 이유를 분모로 설명해 보세요. (답: 5절)</p>
          </div>
          <div className={prose}>
            <p>다음 글은 이 글이 GPU 밖으로 넘긴 대화를 다룹니다. 자리가 모자랄 때 어떤 요청을 받고 어떤 요청의 KV를 내보내거나 다시 계산하는지는 <Link to="/cs/ai/serving-memory-admission-and-preemption">메모리 수용과 선점</Link>에서, 같은 모델을 노드 단위로 나누는 다른 축은 <Link to="/cs/ai/disaggregated-prefill-decode-serving">prefill과 decode 분리</Link>에서 이어집니다.</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={mlaDcpTrees}
        projectMetas={{
          vllm: { id: "vllm", label: "vLLM v0.33.0 원문 (4ba787e)", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
