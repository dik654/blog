import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function StateSummary({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-summary" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Summary는 state가 아니라 anchor와 replay path를 찾는 metadata다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Target slot 105의 full state가 없고 slot 100 state만 저장돼 있다고 하겠습니다. 같은 branch의 block이 102와 105에 있다면 올바른 경로는 <strong>101 empty slot → 102 slot+block → 103·104 empty slot → 105 slot+block</strong>입니다. Summary는 target root/slot을 anchor 100과 이 ordered interval에 연결하지만, transition을 대신 검증하지는 않습니다.</p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton onClick={() => onCodeRef("replay-blocks", codeRefs["replay-blocks"])} />
          <CodeViewButton onClick={() => onCodeRef("state-by-slot", codeRefs["state-by-slot"])} />
        </div>
        <h3>Replay는 candidate state에서 수행합니다</h3>
        <ol>
          <li>Target identity와 같은 branch에 있는 predecessor anchor를 찾습니다.</li>
          <li>Anchor 이후 block을 slot 순서로 읽고 누락·중복·parent 불일치를 먼저 검사합니다.</li>
          <li>Cache 원본이 아닌 candidate clone에 empty-slot과 block transition을 순서대로 적용합니다.</li>
          <li>중간 오류가 나면 partial candidate를 cache나 DB에 승격하지 않고 typed failure receipt를 남깁니다.</li>
          <li>마지막 slot과 full SSZ root가 target과 맞을 때만 반환합니다.</li>
        </ol>
      </div>
      <ExplainedFormula
        question="Anchor 간격을 바꾸면 replay 비용이 왜 달라질까요?"
        idea="Slot step·block step·DB bytes·state copy/hash를 분리해 같은 query trace에서 어느 항목이 변했는지 봅니다."
        formula={String.raw`\begin{aligned}C_{replay}&=N_s c_s+N_b c_b\\&\quad+B_{io}c_{io}\\&\quad+C_{copy/hash}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}C_{replay}&=\underbrace{N_s c_s+N_b c_b}_{\text{slot transition 수 계산}}\\&\quad+B_{io}c_{io}\\&\quad+C_{copy/hash}\end{aligned}`}
        operations={[
          { expression: String.raw`N_s c_s+N_b c_b`, annotation: ["slot transition 수이(가) 식의 결과에 기여하는","방식을 계산합니다.","Slot step·block step·DB","bytes·state copy/hash를 분리해 같은"] },
        ]}
        terms={[
          { symbol: "N_s", name: "slot transition 수", description: "Anchor 다음 slot부터 target까지 적용한 빈 slot 포함 step 수" },
          { symbol: "c_s", name: "slot당 비용", description: "동일 환경에서 측정한 slot transition 평균 또는 분포 비용" },
          { symbol: "N_b", name: "block transition 수", description: "Interval 안에서 검증·적용한 signed block 수" },
          { symbol: "c_b", name: "block당 비용", description: "Fork·operation mix를 고정했을 때 block transition 비용" },
          { symbol: "B_{io}", name: "읽은 데이터", description: "Anchor·block·summary를 DB에서 읽은 byte 수" },
          { symbol: "C_{copy/hash}", name: "복사·해시 비용", description: "Candidate isolation과 output-root 검증에 든 추가 비용" },
        ]}
        assumptions={["같은 Prysm SHA·fork·hardware·query trace에서 비교합니다.", "항목 합은 queue와 cache contention을 완전히 설명하지 않으므로 실제 p50·p95와 함께 기록합니다.", "비용이 낮아도 output state bytes/root가 full-transition oracle과 다르면 채택하지 않습니다."]}
        interpretation="예제에서는 Ns=5, Nb=2입니다. Anchor를 104로 옮기면 transition은 줄지만 저장 anchor 수와 write/storage 비용이 늘어납니다. 이 식은 trade-off를 분해할 뿐 보편적인 최적 간격을 주지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>빈 slot을 건너뛰면 같은 slot 번호라도 다른 state가 됩니다</h3>
        <p>빈 slot에서도 state slot, historical root, epoch-boundary processing이 바뀔 수 있습니다. 따라서 저장된 block만 재생하거나 epoch boundary를 한 번에 점프하면 post-state가 달라질 수 있으며, replay 구현은 official transition vector와 full replay를 oracle로 비교해야 합니다.</p>
      </div>
    </section>
  );
}
