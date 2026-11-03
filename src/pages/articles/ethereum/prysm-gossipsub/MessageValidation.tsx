import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const DECISIONS = [
  {
    name: "Accept",
    example: "B352가 새롭고 parent·서명·proposer·fork별 조건을 통과함",
    effect: "GossipSub 전파 허용, typed object를 subscriber에 전달",
  },
  {
    name: "Reject",
    example: "Decode 불가, bad parent, invalid signature·proposer index",
    effect:
      "전파 중단, invalid-message 또는 application penalty 근거가 될 수 있음",
  },
  {
    name: "Ignore",
    example: "이미 본 block, initial sync 중, 너무 이르거나 parent를 아직 모름",
    effect: "전파하지 않되 이 peer가 악의적이라고 단정하지 않음",
  },
] as const;

export default function MessageValidation({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="message-validation" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        B352는 현재 노드가 판단할 수 있는 범위에 따라 Accept·Reject·Ignore로
        갈립니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          세 값은 성공·실패·보류의 단순 등급이 아닙니다. “다른 피어에게
          전파할지”와 “보낸 피어에게 책임을 물을지”를 함께 정하는 결과입니다.
          특히 Ignore가 있어야 local sync 상태나 missing parent를 remote fault로
          잘못 벌주지 않습니다.
        </p>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {DECISIONS.map((decision) => (
          <article key={decision.name} className="border border-border p-4">
            <p className="font-mono text-xs font-black text-primary">
              {decision.name}
            </p>
            <p className="mt-3 break-keep text-sm font-bold leading-6">
              {decision.example}
            </p>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground">
              {decision.effect}
            </p>
          </article>
        ))}
      </div>

      <div className="not-prose my-5 flex flex-wrap items-center gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef(
              "validate-block-pubsub",
              codeRefs["validate-block-pubsub"],
            )
          }
        />
        <CodeViewButton
          onClick={() =>
            onCodeRef("validation-wrapper", codeRefs["validation-wrapper"])
          }
        />
        <span className="text-xs text-muted-foreground">
          Block 규칙과 timeout·score 보고를 감싸는 wrapper는 별도 경계입니다
        </span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>실제 v7.3.1의 B352 경로</h3>
        <ol>
          <li>
            우리 노드가 직접 publish한 메시지는 다시 검증하지 않고 Accept합니다.
            Initial sync 중 외부 block은 Ignore합니다.
          </li>
          <li>
            Topic이 가리킨 fork-specific type으로 SSZ-Snappy를 decode합니다.
            Decode할 수 없거나 block type이 아니면 Reject합니다.
          </li>
          <li>
            같은 slot·proposer의 block을 이미 보았는지, slot 시간이 맞는지,
            block root가 DB나 pending queue에 있는지 확인합니다.
          </li>
          <li>
            Finalized 경계와 known-bad parent를 확인합니다. Bad parent는 Reject,
            이미 처리한 후보는 Ignore입니다.
          </li>
          <li>
            Parent를 모르면 먼저 proposer signature를 확인하고 pending queue에
            넣은 뒤 parent를 요청합니다. 이 경우 현재 전파 판정은 Ignore입니다.
          </li>
          <li>
            Parent가 있으면 fork choice ancestry, block signature, proposer
            index와 fork별 execution·data 조건을 검사합니다.
          </li>
          <li>
            통과한 typed block을 <code>msg.ValidatorData</code>에 넣고 Accept를
            반환합니다. Subscriber는 이 값을 받아 다음 처리로 넘깁니다.
          </li>
        </ol>

        <h3>왜 timeout은 Reject를 Ignore로 낮춥니까?</h3>
        <p>
          Prysm의 validation wrapper는 제한 시간 안에 판단하지 못한 결과를
          remote-invalid 증거로 사용하지 않습니다. 내부 timeout과 함께 나온
          Reject를 Ignore로 바꿉니다. 우리 노드의 CPU·state lookup 지연을 보낸
          peer의 잘못으로 둔갑시키지 않기 위한 경계입니다.
        </p>

        <h3>Accept 뒤에도 남는 일</h3>
        <p>
          Accept는 GossipSub 단계의 전파 허용입니다. Block은 이후 subscriber와
          blockchain service에서 state transition·execution validity·fork choice
          처리를 거칩니다. 따라서 Accept를 “canonical head”나 “finalized”로
          번역하면 두 계층을 섞게 됩니다.
        </p>
      </div>
    </section>
  );
}
