import type { CodeRef } from "@/components/code/types";

export default function SendersStage({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="senders-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SendersStage는 서명에서 recovered address를 deterministic하게 만든다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          EVM은 transaction의 <code>from</code> address가 필요하지만 wire
          transaction은 공개키를 직접 싣지 않습니다. Chain ID·transaction
          type·서명 값을 검증하고 signing hash에서 공개키와 address를 복구해
          transaction 순서와 같은 위치에 저장합니다.
        </p>
        <p>
          Invalid signature 하나를 zero address로 대신하거나 transaction을
          건너뛰면 뒤 index가 모두 밀려 execution input이 달라집니다. Body hash,
          transaction index, signing hash, recovered sender와 error를 남기고
          해당 block 이후 checkpoint를 진행하지 않습니다.
        </p>
      </div>
    </section>
  );
}
