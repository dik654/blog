import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function StateRootCaching({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="state-root-caching" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Replay 비용은 건너뛴 slot 수와 통과한 epoch boundary를 따로 센다
      </h2>
      <ExplainedFormula
        question="Current slot c에서 target t까지 몇 번의 slot step과 epoch transition을 실행할까요?"
        idea={
          <>
            각 slot을 한 번씩 처리하므로 slot step은 차이와 같습니다. Epoch
            transition은 c보다 크고 t 이하인 epoch boundary의 개수입니다.
          </>
        }
        formula={String.raw`N_s=t-c,\qquad N_e=\left\lfloor\frac{t}{E}\right\rfloor-\left\lfloor\frac{c}{E}\right\rfloor`}
        terms={[
          {
            symbol: "c",
            name: "Current slot",
            description: "입력 state가 가리키는 시작 slot입니다.",
          },
          {
            symbol: "t",
            name: "Target slot",
            description: "Block processing 전에 도달해야 할 slot입니다.",
          },
          {
            symbol: "E",
            name: "Slots per epoch",
            description: "Network preset의 epoch 길이입니다.",
          },
          {
            symbol: "N_s,N_e",
            name: "Step counts",
            description: "실행할 per-slot과 epoch-boundary 처리 횟수입니다.",
          },
        ]}
        assumptions={[
          "t>c이고 slot을 순서대로 빠짐없이 적용합니다.",
          "Fork별 epoch function의 실제 비용은 동일하다고 가정하지 않습니다.",
          "Root cache hit·COW·hardware 비용은 이 count 식에 포함하지 않습니다.",
        ]}
        interpretation="c=30,t=33,E=32이면 slot step은 3번, epoch transition은 1번입니다. 실행 시간은 3×고정비+1×고정비로 단정할 수 없고 fork·state cardinality·cache에서 측정합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Cache는 protocol input이 아닙니다</h3>
        <p>
          Incremental FieldTrie나 cached root를 사용해도 같은
          pre-state·target·fork이면 cache-disabled full SSZ oracle과 같은
          intermediate/final root가 나와야 합니다. Cache key에는 state
          generation, slot, fork schema와 dirty state를 포함하고 불확실하면
          재계산합니다.
        </p>
        <h3>Restart 가능한 replay receipt</h3>
        <p>
          각 반복의 input slot/root, output root, ring index, epoch-trigger
          여부와 완료 marker를 기록합니다. Crash가 slot root 기록 뒤 slot
          increment 전에 났다면 receipt로 동일 step을 idempotent하게 다시
          계산하고 root를 비교합니다. Target marker만 먼저 쓰는 방식은 부분
          replay를 완료로 오인하게 합니다.
        </p>
        <h3>Release gate</h3>
        <p>
          Same-slot·past-target, 0/1/many empty slots, epoch·fork activation
          boundary, zero/nonzero header root, ring wrap, cancellation과
          restart를 base/candidate에 넣습니다. Intermediate/final root·epoch
          call·ring entry parity를 hard gate로 두고 나서 replay p95, hash count,
          allocation과 peak memory를 비교합니다.
        </p>
      </div>
    </section>
  );
}
