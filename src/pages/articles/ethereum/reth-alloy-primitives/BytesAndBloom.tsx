import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import BytesBloomViz from "./viz/BytesBloomViz";

export default function BytesAndBloom({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="bytes-bloom" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bytes와 Log Bloom</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <h3 className="text-xl font-semibold mt-2 mb-3">
          Bytes — runtime 길이의 immutable payload
        </h3>
        <p className="leading-7">
          calldata, bytecode, log data처럼 길이가 실행 중 결정되는 값은 고정
          배열과 다른 소유 모델이 필요하다.
          <code>Bytes</code>는 immutable byte sequence를 cheap하게 slice·clone할
          수 있는 표현을 제공하지만, 생성 방식과 source buffer에 따라 실제
          allocation·공유 비용은 달라진다.
        </p>
        <ul>
          <li>
            읽기 전용 payload를 여러 계층에 전달할 때 불필요한 전체 복사를
            줄인다.
          </li>
          <li>
            network buffer에서 잘라낸 범위와 독립적으로 소유해야 하는 범위를
            API에서 구분한다.
          </li>
          <li>
            mutation이 필요하면 별도 mutable buffer로 전환하는 비용을 명시적으로
            부담한다.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Bloom — 없음을 빠르게 판정하는 prefilter
        </h3>
        <p className="leading-7">
          Ethereum log bloom은 2048-bit bitmap이다. address와 각 topic을
          Keccak-256으로 hash하고 세 위치를 설정하며, receipt들의 bloom을 OR해
          block header의 <code>logsBloom</code>을 만든다.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Hash input</strong>
            <p className="text-xs text-muted-foreground mt-1">
              log address 또는 topic
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Set 3 bits</strong>
            <p className="text-xs text-muted-foreground mt-1">
              hash에서 유도한 11-bit indices
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Subset test</strong>
            <p className="text-xs text-muted-foreground mt-1">
              query bits가 block bloom에 모두 있는지 확인
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          False positive는 정상 동작이다
        </h3>
        <p className="leading-7">
          bit가 없으면 해당 log도 없다고 확정할 수 있지만, bit가 모두 있어도
          실제 log가 있다는 보장은 없다. 따라서 bloom hit는 receipt·log를 읽어
          정확히 비교하라는 신호이며, false-positive 비율은 block의 log 수와
          query 조합에 따라 달라진다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          Bloom 검사 자체의 나노초 수나 <code>eth_getLogs</code> 응답 시간을
          고정 성능으로 제시하지 않는다. 실제 쿼리는 block range, index 구조,
          storage cache와 false-positive 분포의 영향을 함께 받는다.
        </p>
      </div>
      <div className="not-prose">
        <BytesBloomViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
