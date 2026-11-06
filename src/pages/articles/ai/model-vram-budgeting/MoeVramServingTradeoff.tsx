import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import ExpertUnionReadViz from "./viz/ExpertUnionReadViz";

const BANDWIDTH_TERMS = [
  { symbol: "P_{total}", name: "total parameter", description: "Checkpoint 전체가 저장하는 parameter 수입니다." },
  { symbol: "P_{active}", name: "active parameter", description: "Token 하나가 실제로 통과하는 shared+top-k expert parameter 수입니다." },
  { symbol: "B", name: "원소당 byte", description: "BF16 2byte, FP8 1byte처럼 통일된 dtype 폭입니다." },
] as const;

const TP_BANDWIDTH_TERMS = [
  { symbol: "P_{active}b", name: "token당 weight byte", description: "batch 1 decode에서 한 token이 읽는 weight byte입니다. 층마다 dtype이 다르면 부분별로 따로 더합니다." },
  { symbol: "TP", name: "tensor parallel degree", description: "같은 층의 weight를 나눠 가진 GPU 수입니다. 각 GPU는 자기 몫만 읽습니다." },
  { symbol: "BW_{GPU}", name: "GPU 한 장의 memory 대역폭", description: "HBM이나 GDDR에서 초당 읽을 수 있는 byte입니다. RTX PRO 6000 Server Edition은 1,597 GB/s입니다." },
  { symbol: "t_{token}", name: "token 하나의 decode 시간", description: "weight를 한 번 다 읽는 데 걸리는 시간이 이 시간의 하한입니다." },
] as const;

const UNION_TERMS = [
  { symbol: "E", name: "routed expert 수", description: "MoE 층 하나에 있는 routed expert 개수입니다. Kimi K2.5는 384입니다." },
  { symbol: "k", name: "token당 선택 수", description: "router가 token마다 고르는 expert 수입니다. Kimi K2.5는 8입니다." },
  { symbol: "B_{batch}", name: "한 step의 token 수", description: "decode 한 step에 함께 처리하는 sequence 수입니다." },
  { symbol: "N_{read}", name: "읽는 expert 수", description: "그 step에 적어도 한 token이 고른 expert 수의 기대값입니다." },
] as const;

export default function MoeVramServingTradeoff() {
  return (
    <section id="moe-vram-serving-tradeoff" className="scroll-mt-20 space-y-7">
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>MoE decode가 active parameter만 읽는 것은 batch 1일 때입니다</h2>
        <p className="leading-8">
          Decode 한 step이 다시 읽는 weight bytes는 dense에서는 total parameter에 비례하지만 MoE에서 요청이 하나뿐이면 router가 고른 active parameter에 비례합니다. Active parameter가 작을수록 이 read량이 줄어 단일 스트림 decode가 가벼워집니다.
        </p>
        <p className="leading-8">
          다만 여러 요청을 한 step에 묶으면 token마다 고른 expert가 달라서 그 층이 읽어야 하는 expert는 합집합으로 늘어납니다. 아래에서 먼저 batch 1의 장부를 세고 다음에 batch를 키웁니다.
        </p>
      </div>

      <ExplainedFormula
        question="Batch 1의 MoE decode 한 step이 실제로 읽는 weight bytes는 무엇에 비례하나요?"
        idea={<>Dense는 매 step 전체 weight를 다시 읽습니다. MoE는 요청이 하나면 router가 고른 expert path만 읽습니다. 같은 dtype byte 폭으로 두 read량을 비교합니다.</>}
        formula={String.raw`\begin{aligned}\text{bytes}_{dense}&=P_{total}B\\ \text{bytes}_{moe,1}&=P_{active}B\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\text{bytes}_{dense}&=\underbrace{P_{total}}_{\text{dense는 전체 parameter}}\times B\\ \text{bytes}_{moe,1}&=\underbrace{P_{active}}_{\text{batch 1이면 선택된 path만}}\times B\end{aligned}`}
        operations={[
          { expression: String.raw`P_{total}\times B`, annotation: ["Dense는 매 token마다", "전체 parameter를 다시 읽음"] },
          { expression: String.raw`P_{active}\times B`, annotation: ["요청이 하나인 MoE는 router가 고른", "expert path만 다시 읽음"] },
        ]}
        terms={BANDWIDTH_TERMS}
        assumptions={[
          "Router·communication byte와 KV cache 읽기는 포함하지 않은 순수 weight read traffic입니다.",
          "Residency(storage)는 여전히 P_total×B를 요구하며 이 식은 read traffic만 다룹니다.",
          "Batch가 2 이상이면 MoE 쪽 식은 아래 합집합 식으로 바뀝니다.",
        ]}
        interpretation="80B total·약 3B active MoE를 BF16으로 두면 batch 1의 decode 한 step은 약 3B×2byte=6GiB를 읽습니다. 같은 dtype의 80B dense라면 80B×2byte=160GiB를 읽어야 해, 약 26배 차이가 납니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          이 byte를 GPU 여러 장이 나눠 읽으면 한 장의 몫은 TP degree만큼 줄어듭니다. 그 몫을 GPU 한 장의 memory 대역폭으로 나누면 token 하나를 내는 데 필요한 최소 시간이 나오고 그 역수가 단일 스트림 속도의 상한입니다.
        </p>
      </div>

      <ExplainedFormula
        question="TP로 나눈 MoE를 단일 스트림으로 decode하면 초당 token은 어디서 막히나요?"
        idea={<>TP rank는 모두 같은 시점에 자기 weight 조각을 읽습니다. 그래서 가장 느린 한 장이 자기 몫을 다 읽는 시간이 token 하나의 하한입니다.</>}
        formula={String.raw`\text{bytes}_{GPU}=\frac{P_{active}b}{TP},\qquad t_{token}\ge\frac{\text{bytes}_{GPU}}{BW_{GPU}}`}
        annotatedFormula={String.raw`\underbrace{\text{bytes}_{GPU}}_{\text{한 장이 읽는 몫}}=\frac{\underbrace{P_{active}b}_{\text{token당 weight byte}}}{\underbrace{TP}_{\text{나눠 가진 장수}}},\qquad \underbrace{t_{token}}_{\text{token 하나의 시간}}\ge\frac{\text{bytes}_{GPU}}{\underbrace{BW_{GPU}}_{\text{한 장의 대역폭}}}`}
        operations={[
          { expression: String.raw`\frac{P_{active}b}{TP}`, annotation: ["token당 weight byte를 TP로 나눠", "GPU 한 장이 읽는 몫"] },
          { expression: String.raw`\frac{\text{bytes}_{GPU}}{BW_{GPU}}`, annotation: ["그 몫을 한 장의 대역폭으로 나눠", "token 하나의 최소 시간"] },
          { expression: String.raw`1/t_{token}`, annotation: ["최소 시간의 역수를 취해", "단일 스트림 초당 token의 상한"] },
        ]}
        terms={TP_BANDWIDTH_TERMS}
        assumptions={[
          "TP rank 사이의 all-reduce 시간은 빠져 있어 실제 속도는 이 상한보다 낮습니다.",
          "KV cache 읽기도 빠져 있습니다. 긴 context에서는 KV 읽기가 weight 읽기만큼 커질 수 있습니다.",
        ]}
        interpretation="Kimi K2.5를 RTX PRO 6000 8장에 TP8로 올리면 token당 weight 약 32GB(추정)가 장당 약 4GB가 되고, 1,597GB/s로 나누면 약 2.5ms입니다. 상한은 약 400 tok/s(추정)이고, 현장 실측 65~101 tok/s는 그 4분의 1 아래입니다."
      />

      <CalculationWalkthrough
        title="Kimi K2.5 · 8×RTX PRO 6000 · TP8 · batch 1"
        question="Token 하나를 낼 때 GPU 한 장은 몇 byte를 읽고, 그 읽기만으로 정해지는 속도 상한은 얼마인가요?"
        scope="weight 읽기만 셉니다. KV cache 읽기와 TP 통신은 빼고, 대역폭은 사양값을 그대로 씁니다."
        steps={[
          {
            label: "routed expert 몫",
            expression: "60 MoE층, 층마다 8 expert, expert마다 7168×2048 행렬 3개",
            result: "약 21B parameter → INT4와 scale 약 12GB (계산)",
            reason: "config.json의 MoE 60층과 expert 폭 2048로 셉니다. INT4는 parameter당 0.5byte이고 group 32마다 BF16 scale이 붙습니다.",
          },
          {
            label: "BF16으로 남는 몫",
            expression: "attention, shared expert, dense 1층, lm_head",
            result: "약 20GB (추정)",
            reason: "K2.5 체크포인트는 routed expert만 INT4이고 나머지는 BF16입니다. active 32B에서 routed 몫과 embedding을 뺀 크기로 어림했습니다.",
          },
          {
            label: "token당 weight 읽기",
            expression: "12GB + 20GB",
            result: "약 32GB (추정)",
            reason: "batch 1이면 이 byte를 token마다 한 번 다시 읽습니다. 총 595GB 체크포인트의 약 5%입니다.",
          },
          {
            label: "GPU 한 장의 몫",
            expression: "32GB ÷ TP 8",
            result: "약 4GB",
            reason: "expert와 attention 행렬을 TP rank가 나눠 가지므로 각 장은 8분의 1만 읽습니다.",
          },
          {
            label: "읽기 시간과 상한",
            expression: "4GB ÷ 1,597GB/s",
            result: "약 2.5ms → 약 400 tok/s (추정)",
            reason: "Server Edition의 사양 대역폭입니다. 실제 유효 대역폭은 이보다 낮습니다.",
          },
          {
            label: "현장 실측과 비교",
            expression: "rtx6kpro 커뮤니티 위키, 단일 batch",
            result: "65~101 tok/s (현장 경험)",
            reason: "상한의 4분의 1 아래입니다. 남은 시간의 큰 몫은 층마다 반복되는 TP 동기화이며, 다음 글이 그 횟수를 셉니다.",
          },
        ]}
        conclusion="Capacity는 1T 쪽이지만 단일 스트림의 bandwidth 장부는 약 32B 쪽입니다. 다만 그 상한조차 실측과 4배 넘게 벌어지므로, PCIe node에서 단일 스트림 속도를 정하는 것은 weight 읽기보다 통신입니다."
        caveats={[
          "현장 경험 수치는 vLLM·SGLang 설정, P2P, KV dtype, DCP 여부에 따라 2~3배 갈립니다.",
          "MLA KV는 TP로 나뉘지 않고 rank마다 복제되므로 긴 context의 KV 읽기는 ÷TP가 되지 않습니다.",
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          마지막 caveat가 아키텍처에 따라 달라지는 부분입니다. GQA는 KV head가 TP rank로 나뉘지만 MLA의 압축 KV는 head가 하나라 rank마다 통째로 복제됩니다. 그 차이와 decode context parallel은{" "} <Link to="/cs/ai/mla-kv-replication-and-decode-context-parallel">MLA KV 복제 글</Link>에 있습니다.
        </p>
        <p className="leading-8">
          이제 batch를 키웁니다. Token 16개가 한 step에 들어오면 각자 8개를 고르고 겹치지 않은 선택만큼 그 층이 읽는 expert가 늘어납니다. 384개 중 8개를 균등하게 고른다고 두면 어떤 expert가 한 번도 안 뽑힐 확률은 (1−8/384)^B입니다.
        </p>
      </div>

      <ExplainedFormula
        question="Batch B인 decode step에서 MoE 층 하나는 expert를 몇 개 읽나요?"
        idea={<>Expert 하나가 token 한 개에게 뽑히지 않을 확률은 1−k/E입니다. B개 token 모두에게 뽑히지 않을 확률을 1에서 빼면 그 expert를 읽을 확률이 되고, E개에 대해 더하면 기대값이 됩니다.</>}
        formula={String.raw`N_{read}(B_{batch})=E\left(1-\left(1-\frac{k}{E}\right)^{B_{batch}}\right)`}
        annotatedFormula={String.raw`\underbrace{N_{read}}_{\text{읽는 expert 수}}=\underbrace{E}_{\text{routed expert 수}}\Bigl(1-\underbrace{\left(1-\frac{k}{E}\right)^{B_{batch}}}_{\text{어느 token도 안 고를 확률}}\Bigr)`}
        operations={[
          { expression: String.raw`1-\frac{k}{E}`, annotation: ["token 하나가 이 expert를", "고르지 않을 확률"] },
          { expression: String.raw`\left(1-\frac{k}{E}\right)^{B_{batch}}`, annotation: ["B개 token이 모두", "고르지 않을 확률"] },
          { expression: String.raw`E\left(1-\cdots\right)`, annotation: ["1에서 빼고 expert 수를 곱해", "읽히는 expert 수의 기대값"] },
        ]}
        terms={UNION_TERMS}
        assumptions={[
          "token마다 독립이고 균등한 routing을 가정합니다. 실제 router는 쏠림이 있어 합집합이 이 값보다 조금 작습니다.",
          "shared expert와 attention weight는 batch와 무관하게 step마다 한 번 읽습니다.",
        ]}
        interpretation="Kimi K2.5(E=384, k=8)에서 B=16이면 약 110개(29%), 64면 약 284개(74%), 128이면 약 358개(93%)입니다(계산). 동시 요청이 수십 개를 넘으면 step마다 거의 전체 expert weight를 읽습니다."
      />

      <ExpertUnionReadViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          그래서 &quot;1T MoE가 32B처럼 decode한다&quot;는 말은 단일 스트림 지연에만 맞습니다. 동시성이 높아지면 step당 읽기는 거의 1T 쪽이고 대신 그 읽기를 B개 token이 나눠 냅니다. 처리량은 결국 전체 weight 읽기와 expert 행렬곱(GEMM)이 얼마나 꽉 차는지로 정해집니다.
        </p>
        <p className="leading-8">
          이 전환이 없는 dense model은 batch와 무관하게 step마다 전체를 읽고 batch가 커질수록 token당 몫만 줄어듭니다. MoE는 batch 1에서 dense보다 훨씬 가볍게 시작해 batch가 커질수록 dense와 같은 장부로 수렴합니다.
        </p>
        <p className="leading-8">
          그래서 consumer·workstation GPU에서는 active/total 비율만으로는 부족하고 몇 개 요청을 동시에 받을지까지 정해야 병목이 보입니다. Expert를 GPU에 나누는{" "} <Link to="/cs/ai/expert-parallelism-moe-systems#limits">expert parallelism</Link>이 큰 batch에서만 이득인 이유도 같은 곳에 있습니다.
        </p>
      </div>

      <TermBreakdown
        title="Capacity와 bandwidth가 갈리는 지점을 나눠 봅니다"
        items={[
          {
            term: "Dense vs MoE serving tradeoff",
            description: "같은 known floor라도 decode read량이 total 기준이냐 active 기준이냐로 갈립니다.",
            example: "27.781B dense는 매 step 전체를, 80B/3B MoE는 batch 1에서 active path만 읽습니다.",
            boundary: "Active 수가 작다고 total residency 요구까지 줄지는 않고, batch가 크면 read량도 total 쪽으로 갑니다.",
          },
          {
            term: "Consumer/workstation GPU serving",
            description: "24~48GiB급 카드에서 capacity와 bandwidth 중 무엇이 먼저 막히는지 결정합니다.",
            example: "Mixed FP8 28.75GiB dense는 한 장에 들어가고 bandwidth와도 맞습니다.",
            boundary: "80B total MoE는 active read는 가벼워도 총 용량이 한 장을 넘기 쉽습니다.",
          },
          {
            term: "Batch와 expert 합집합",
            description: "동시 요청이 늘면 한 층이 읽는 expert가 E·(1−(1−k/E)^B)로 늘어납니다.",
            example: "K2.5에서 B=64면 384개 중 약 284개를 step마다 읽습니다(계산).",
            boundary: "단일 스트림 지연은 active 기준, 고동시성 처리량은 total 기준으로 셉니다.",
          },
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          이 비율 자체는{" "}
          <Link to="/cs/ai/moe-routing-and-load-balancing#sparsity">MoE sparsity ratio 글</Link>이 정의하고, 이 글은 그 비율이 decode read bytes로 어떻게 옮겨지는지만 더합니다. Capacity가 부족하면 앞 절의 2-way 구성·offloading도 함께 검토해야 합니다.
        </p>
        <p className="leading-8">
          TP 동기화 횟수는{" "}
          <Link to="/cs/ai/tensor-and-pipeline-parallel-inference#decode-impact">TP·PP 통신 글</Link>이, dense·GQA·MLA·hybrid 구조별 장부 비교는{" "}
          <Link to="/cs/ai/serving-architecture-matrix">서빙 아키텍처 매트릭스</Link>가 이어 셉니다.
        </p>
      </div>
    </section>
  );
}
