import { CodeViewButton } from "@/components/code";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ProcessSlot({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="process-slot" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ProcessSlot은 직전 state와 latest block header를 같은 historical index에
        고정한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          단일 slot 처리에서는 현재 state의 <code>hash_tree_root</code>를
          계산하고, 상태 속 latest block header의 state root가 zero라면 그
          값으로 backfill합니다. 완성된 header root와 state root는 같은 circular
          index의 <code>block_roots</code>·<code>state_roots</code>에
          기록됩니다.
        </p>
      </div>
      <ExplainedFormula
        question="현재 slot의 historical root는 ring buffer의 어느 칸에 기록할까요?"
        idea={
          <>
            최근 H개 slot을 고정 크기 vector에 보관하므로 slot 번호를 H로 나눈
            나머지를 index로 사용합니다. 같은 index의 이전 세대 값은 H slot 뒤
            덮어씁니다.
          </>
        }
        formula={String.raw`i=s\bmod H`}
        terms={[
          {
            symbol: "s",
            name: "Current slot",
            description: "지금 receipt를 기록하는 state.slot입니다.",
          },
          {
            symbol: "H",
            name: "Historical-root window",
            description: "Preset의 SLOTS_PER_HISTORICAL_ROOT입니다.",
          },
          {
            symbol: "i",
            name: "Ring index",
            description: "state_roots와 block_roots에 쓸 0…H−1 위치입니다.",
          },
        ]}
        assumptions={[
          "H는 실행한 network preset에서 고정합니다.",
          "오래된 root의 장기 commitment는 별도 historical mechanism이 보존합니다.",
          "Index가 같다는 사실만으로 같은 slot generation이 아닙니다.",
        ]}
        interpretation="H=8,192이면 slot 8,205는 index 13에 기록돼 slot 13의 직접 entry를 덮습니다. Reader는 slot/generation 범위를 확인해야 하며 ring buffer 하나가 영구 archive라는 결론은 낼 수 없습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>State-root backfill은 순환 의존성을 끊습니다</h3>
        <p>
          Block header는 그 block을 적용한 post-state root를 가져야 하지만
          post-state 안의 <code>latest_block_header</code>가 다시 같은 root를
          포함하면 계산이 순환합니다. State transition 중 latest header의
          state_root는 zero로 두고 나머지 transition으로 post-state root를
          계산합니다. 제안 block에는 계산된 root를 넣어 서명하며, 다음{" "}
          <code>process_slot</code>이 state 내부 header에 이전 state root를
          채웁니다.
        </p>
        <p>
          Zero가 아닌 header state root를 무조건 덮어쓰거나, backfill 전에
          header root를 계산하면 다른 commitment가 됩니다. Receipt에는 slot,
          pre-state root, zero/backfill branch, header root, ring index와 fork를
          남깁니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton
          onClick={() => onCodeRef("process-slot", codeRefs["process-slot"])}
        />
        <CodeViewButton
          onClick={() => onCodeRef("process-slots", codeRefs["process-slots"])}
        />
      </div>
    </section>
  );
}
