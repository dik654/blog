import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";

const BANDWIDTH_TERMS = [
  { symbol: "P_{total}", name: "total parameter", description: "Checkpoint 전체가 저장하는 parameter 수입니다." },
  { symbol: "P_{active}", name: "active parameter", description: "Token 하나가 실제로 통과하는 shared+top-k expert parameter 수입니다." },
  { symbol: "B", name: "원소당 byte", description: "BF16 2byte, FP8 1byte처럼 통일된 dtype 폭입니다." },
] as const;

export default function MoeVramServingTradeoff() {
  return (
    <section id="moe-vram-serving-tradeoff" className="scroll-mt-20 space-y-7">
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>Active parameter가 작을수록 decode가 읽는 weight bytes도 줄어듭니다</h2>
        <p className="leading-8">
          Decode 한 step이 다시 읽는 weight bytes는 dense에서는 total parameter에, MoE에서는 router가 고른 active parameter에 비례합니다. Active parameter가 작을수록 이 read량이 줄어 decode가 가벼워집니다.
        </p>
      </div>

      <ExplainedFormula
        question="MoE decode 한 step이 실제로 읽는 weight bytes는 무엇에 비례하나요?"
        idea={<>Dense는 매 step 전체 weight를 다시 읽지만, MoE는 router가 고른 expert path만 읽습니다. 같은 dtype byte 폭으로 두 read량을 비교합니다.</>}
        formula={String.raw`\text{bytes}_{dense}=P_{total}B,\qquad \text{bytes}_{moe}=P_{active}B`}
        annotatedFormula={String.raw`\text{bytes}_{dense}=\underbrace{P_{total}}_{\text{dense는 전체 parameter}}\times B,\qquad \text{bytes}_{moe}=\underbrace{P_{active}}_{\text{MoE는 선택된 path만}}\times B`}
        operations={[
          { expression: String.raw`P_{total}\times B`, annotation: ["Dense는 매 token마다", "전체 parameter를 다시 읽음"] },
          { expression: String.raw`P_{active}\times B`, annotation: ["MoE는 router가 고른", "expert path만 다시 읽음"] },
        ]}
        terms={BANDWIDTH_TERMS}
        assumptions={[
          "Router·communication byte는 포함하지 않은 순수 weight read traffic입니다.",
          "Residency(storage)는 여전히 P_total×B를 요구하며 이 식은 read traffic만 다룹니다.",
        ]}
        interpretation="80B total·약 3B active MoE를 BF16으로 두면 decode 한 step은 약 3B×2byte=6GiB를 읽습니다. 같은 dtype의 80B dense라면 80B×2byte=160GiB를 읽어야 해, 약 26배 차이가 납니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          그래서 capacity는 넉넉해도 bandwidth가 상대적으로 낮은 consumer·workstation GPU에서는 이 active/total 비율이 실제로 어느 쪽이
          병목인지를 가르는 실무 질문이 됩니다.
        </p>
      </div>

      <TermBreakdown
        title="Capacity와 bandwidth가 갈리는 지점을 나눠 봅니다"
        items={[
          {
            term: "Dense vs MoE serving tradeoff",
            description: "같은 known floor라도 decode read량이 total 기준이냐 active 기준이냐로 갈립니다.",
            example: "27.781B dense는 매 step 전체를, 80B/3B MoE는 active path만 읽습니다.",
            boundary: "Active 수가 작다고 total residency 요구까지 줄지는 않습니다.",
          },
          {
            term: "Consumer/workstation GPU serving",
            description: "24~48GiB급 카드에서 capacity와 bandwidth 중 무엇이 먼저 막히는지 결정합니다.",
            example: "Mixed FP8 28.75GiB dense는 한 장에 들어가고 bandwidth와도 맞습니다.",
            boundary: "80B total MoE는 active read는 가벼워도 총 용량이 한 장을 넘기 쉽습니다.",
          },
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          이 비율 자체는{" "}
          <Link to="/ai/moe-routing-and-load-balancing#sparsity">MoE sparsity ratio 글</Link>이 정의하고, 이 글은 그 비율이 decode read bytes로 어떻게 옮겨지는지만 더합니다. Capacity가 부족하면 앞 절의 2-way 구성·offloading도 함께 검토해야 합니다.
        </p>
      </div>
    </section>
  );
}
