import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import ConsensusProofFlowViz from "./viz/ConsensusProofFlowViz";
import ValidateBlockViz from "./viz/ValidateBlockViz";
import WeightViz from "./viz/WeightViz";

const RESPONSIBILITIES = [
  {
    title: "Expected Consensus",
    question: "지금 어떤 chain을 따라갈까?",
    answer:
      "storage power를 바탕으로 block producer를 선출하고, 유효한 tipset의 누적 weight로 head를 선택합니다.",
  },
  {
    title: "F3 finality",
    question: "어디까지 되돌리지 않을까?",
    answer:
      "EC가 만든 chain의 checkpoint를 별도 finality 프로토콜로 확정합니다. head 선택과 finality를 같은 단계로 보면 안 됩니다.",
  },
  {
    title: "Storage proofs",
    question: "provider가 실제로 저장하고 있나?",
    answer:
      "PoRep은 sector가 고유하게 준비됐다는 근거를 만들고, PoSt는 이후에도 저장 상태가 유지됨을 증명합니다.",
  },
] as const;

export default function ConsensusProofs({
  onCodeRef,
}: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="consensus-proofs" className="mb-16 scroll-mt-20">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>합의·finality·저장 증명을 한 덩어리로 보지 않는다</h2>
        <p>
          Filecoin block에는 producer 선출 근거와 저장 증명이 함께 등장하지만 세 메커니즘이 답하는 질문은 다릅니다. EC는 chain head를 고릅니다. F3는 이미
          선택된 chain의 checkpoint를 확정하고 PoRep·PoSt는 provider의 저장 약속을 검증합니다.
        </p>
      </div>

      <div className="not-prose my-8 grid gap-3 lg:grid-cols-3">
        {RESPONSIBILITIES.map((item, index) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border bg-card p-5"
          >
            <span className="font-mono text-xs font-semibold text-primary">
              0{index + 1}
            </span>
            <h3 className="mt-3 font-semibold">{item.title}</h3>
            <p className="mt-2 text-xs font-semibold text-foreground/70">
              {item.question}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>검증 경로를 먼저 한 번에 본다</h3>
        <p>
          아래 Viz는 producer 선출, block 검증, chain state 전이를 한 흐름으로
          보여줍니다. “chain 확정”은 로컬 head 선택을 뜻하는지 F3 finality를
          뜻하는지 문맥에 따라 구분해 읽어야 합니다.
        </p>
      </div>
      <ConsensusProofFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ValidateBlock은 후보가 규칙을 만족하는지 확인한다</h3>
        <p>
          height·timestamp·parent weight 같은 구조 조건과 election·WinningPoSt 근거를 검증합니다. 여기서 통과하면 유효한 후보가 될 뿐이고
          finality는 그 뒤 chain selection과 F3가 각자의 역할을 수행해야 생깁니다.
        </p>
      </div>
      <ValidateBlockViz onOpenCode={openCode} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Weight는 유효한 후보 사이에서 head를 고르는 값이다</h3>
        <p>
          Lotus의 <code>Weight</code> 구현은 parent weight에 network power와
          tipset의 win count가 반영된 증가분을 더합니다. 정확한 상수나 산술식은
          프로토콜·코드 버전에 종속되므로, 아래 도식은 항의 관계를 읽고 실제
          값은 연결된 코드에서 확인하는 용도로 사용합니다.
        </p>
      </div>
      <WeightViz onOpenCode={openCode} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>PoRep과 PoSt는 시점이 다르다</h3>
        <div className="not-prose grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Setup evidence
            </p>
            <h4 className="mt-2 font-semibold">PoRep</h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              piece를 sector에 배치하고 복제·봉인한 결과가 provider와 sector에
              결합됐음을 증명합니다. sealing 단계의 산출물이 on-chain commit
              경로로 들어갑니다.
            </p>
          </article>
          <article className="rounded-2xl border bg-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Ongoing evidence
            </p>
            <h4 className="mt-2 font-semibold">PoSt</h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              활성 sector 집합에서 protocol이 정한 challenge에 응답해 데이터가
              계속 저장돼 있음을 증명합니다. 세부 proof 종류와 parameter는 현재
              network version을 기준으로 확인해야 합니다.
            </p>
          </article>
        </div>
        <p>
          핵심은 proof 생성 시간이나 특정 GPU 모델을 외우는 것이 아닙니다.
          <strong>
            {" "}
            provider의 off-chain 계산이 어떤 commitment와 message를 통해 검증
            가능한 chain state로 들어오는지
          </strong>
          를 추적하는 것입니다.
        </p>
      </div>
    </section>
  );
}
