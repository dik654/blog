import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function ProtoArray({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="protoarray" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Store는 block tree와 validator별 latest message를 별도 상태로 유지한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Fork-choice 자료구조가 저장해야 하는 것은 block parent/children, slot, justified·finalized compatibility, node
          weight, best-child cache입니다. Vote 쪽에는 validator index마다 이전 latest root와 새 latest root를 둡니다. 둘을 분리해야
          validator 한 명이 vote를 바꿨을 때 모든 attestation을 처음부터 세지 않고 old path에서 balance를 빼고 new path에 더할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("fc-store", codeRefs["fc-store"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 fork-choice store 확인</span>
      </div>

      <ExplainedFormula
        question="Validator의 latest vote가 A branch에서 B branch로 옮겨갈 때 node weight를 어떻게 갱신할까요?"
        idea="각 validator가 차지하는 effective balance를 old latest root의 ancestor에서는 빼고 new latest root의 ancestor에는 더합니다. 공통 ancestor 위쪽에는 두 변화가 상쇄됩니다."
        formula={String.raw`\begin{aligned}\Delta W(n)&=\sum_i b_i\bigl(\mathbf{1}[n\preceq r_i^{new}]\\&\qquad-\mathbf{1}[n\preceq r_i^{old}]\bigr)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\Delta W(n)&=\underbrace{\sum_i b_i\bigl(\mathbf{1}[n\preceq r_i^{new}]}_{\text{변화량 계산}}\\&\qquad-\mathbf{1}[n\preceq r_i^{old}]\bigr)\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_i b_i\bigl(\mathbf{1}[n\preceq r_i^{new}]`, annotation: ["조상 관계이(가) 식의 결과에 기여하는 방식을 계산합니다.","각 validator가 차지하는 effective","balance를 old latest root의","ancestor에서는 빼고 new latest root의"] },
        ]}
        terms={[
          { symbol: "W(n)", name: "서브트리 가중치", description: "node n이 대표하는 subtree의 attestation weight(Gwei 또는 effective-balance 단위)" },
          { symbol: "b_i", name: "검증자 잔액", description: "validator i의 effective balance(Gwei)" },
          { symbol: "r_i^{old}, r_i^{new}", name: "이전·새 투표 루트", description: "validator i의 이전·새 latest-message root" },
          { symbol: "n\\preceq r", name: "조상 관계", description: "n이 root r의 ancestor이거나 r 자체라는 관계" },
          { symbol: "\\mathbf{1}[\\cdot]", name: "지시 함수", description: "조건이 참이면 1, 아니면 0인 indicator" },
        ]}
        assumptions={[
          "Block parent 관계와 validator별 이전 latest message가 같은 store generation에 속합니다.",
          "Slashable equivocation으로 제외된 validator와 inactive validator는 별도 eligibility 규칙을 적용합니다.",
          "이 식은 attestation delta만 나타내며 proposer boost와 branch viability filter는 따로 더합니다.",
        ]}
        interpretation="32 ETH validator가 A2에서 B1으로 이동하면 A2→A 공통 경로에서 32를 빼고 B1→B 경로에 32를 더합니다. J처럼 두 경로의 공통 ancestor에서는 -32와 +32가 상쇄됩니다. 이 식만으로 head가 정해지는 것은 아니며 eligible child를 고르는 단계가 뒤따릅니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>doubly-linked tree가 해결하는 구현 문제</h3>
        <p>
          Prysm의 자료구조 이름은 release에 따라 달라질 수 있지만 핵심은 parent 방향의 weight propagation과 child 방향의 head traversal을
          모두 빠르게 만드는 것입니다. Parent pointer만 있으면 delta를 위로 올리기 쉽고 children과 best-descendant cache가 있으면 justified
          root에서 아래로 내려가기 쉽습니다. Cache는 같은 protocol 결과를 더 적은 반복으로 계산하는 최적화이고 정답의 근거가 되지는 않습니다.
        </p>
        <p>
          노드 삭제가 상수 시간이라는 식의 단정은 위험합니다. Finalization 뒤 prune할 때는 child relink, index/cache 제거,
          persisted block·state owner와의 조정이 필요합니다. 실제 비용은 제거되는 subtree 크기와 cache invalidation 범위에
          따라 달라집니다.
        </p>

        <h3>Invariant와 반례</h3>
        <ul>
          <li>모든 non-anchor node의 parent가 존재하고 cycle이 없어야 합니다.</li>
          <li>저장된 weight·best child는 full recomputation과 같은 head를 내야 합니다.</li>
          <li>Unknown parent block이나 더 오래된 latest message는 store를 부분 수정한 채 실패하면 안 됩니다.</li>
          <li>Balance snapshot이나 justified checkpoint가 바뀌면 이전 generation의 cache를 그대로 재사용하지 않습니다.</li>
        </ul>
        <p>
          두 validator의 message가 같은 root를 가리킨다고 두 attestation object가 같다는 뜻은 아닙니다. Fork choice에는 최신 support만
          필요하지만 감사·slashing 검증에는 source/target, signature, inclusion context가 별도로 필요합니다.
        </p>
      </div>
    </section>
  );
}
