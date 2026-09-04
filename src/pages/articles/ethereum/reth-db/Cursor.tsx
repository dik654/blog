import CodeViewButton from "@/components/code/CodeViewButton";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function Cursor({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="cursor" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Cursor는 정렬된 key를 transaction snapshot 안에서만 걷는다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("db-cursor", codeRefs["db-cursor"])} />
      </div>
      <ExplainedFormula
        question="Half-open range [a,b)를 걷는 cursor가 반환해야 할 key 순서는 무엇일까요?"
        idea="처음 key는 a 이상인 가장 작은 key이고, 이후 key는 엄격히 증가하되 b에 도달하기 전에 멈춥니다. 같은 read transaction이 유지돼야 중간 writer 때문에 순서가 섞이지 않습니다."
        formula={String.raw`a\leq k_0<k_1<\cdots<k_r<b`}
        annotatedFormula={String.raw`a\le\underbrace{q k_0<k_1<\cdots<k_r<b}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`q k_0<k_1<\cdots<k_r<b`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","처음 key는 a 이상인 가장 작은 key이고, 이후 key는","엄격히 증가하되 b에 도달하기 전에 멈춥니다."] },
        ]}
        terms={[
          { symbol: "a", name: "시작 key", description: "seek가 찾을 inclusive lower bound" },
          { symbol: "b", name: "끝 key", description: "walk가 포함하지 않는 exclusive upper bound" },
          { symbol: "k_i", name: "반환 key", description: "같은 snapshot에서 i번째로 decode한 typed key" },
          { symbol: "r", name: "마지막 index", description: "range 안에서 실제 반환된 record 수보다 하나 작은 값" },
        ]}
        assumptions={["Disk codec의 lexicographic order가 logical key order와 일치합니다.", "Cursor 수명 동안 같은 read/write transaction과 database generation을 유지합니다.", "DupSort table은 동일 primary key 안의 subkey ordering을 별도로 정의합니다."]}
        interpretation="Keys 2·4·7·9에서 [4,9)는 4·7만 반환합니다. Walk 중 transaction을 닫거나 다른 generation cursor를 섞으면 이 순서 보장을 사용할 수 없습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Seek는 exact match와 lower-bound를 구분하고 next/prev는 현재 cursor position을 바꿉니다. Returned slice가 mmap page를
          borrow한다면 transaction 종료 뒤 참조하면 안 되므로 decode/복사 ownership도 API lifetime에 포함됩니다.
        </p>
        <p>
          Write cursor의 put·upsert·append는 정렬 precondition과 duplicate policy가 다릅니다. 오류나 panic이 나면 transaction을
          abort하고 cursor·borrow를 모두 폐기하며 retry는 stable operation ID와 같은 input에서 새 transaction으로 시작합니다.
        </p>
      </div>
    </section>
  );
}
