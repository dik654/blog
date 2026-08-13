import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import NotificationDetailViz from "./viz/NotificationDetailViz";
import { codeRefs } from "./codeRefs";
import { NOTIFICATION_EVENTS } from "./NotificationData";

export default function Notification({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="notification" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Notification: reorg를 rollback + apply로 표현하기
      </h2>
      <div className="not-prose mb-8">
        <NotificationDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <div className="not-prose mb-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef("exex-notification", codeRefs["exex-notification"])
            }
          />
          <CodeViewButton
            onClick={() => onCodeRef("exex-manager", codeRefs["exex-manager"])}
          />
          <CodeViewButton
            onClick={() => onCodeRef("exex-context", codeRefs["exex-context"])}
          />
        </div>
        <h3>배경</h3>
        <p>
          파생 DB는 canonical chain과 같은 transition 순서를 재현해야 한다. 새
          tip만 보는 것으로는 충분하지 않다.
        </p>
        <h3>문제</h3>
        <p>
          reorg에서 new chain을 먼저 쓰면 old rows와 중복될 수 있고, rollback 중
          실패했는데 checkpoint를 앞당기면 재시작해도 손상 지점을 다시 받지
          못한다.
        </p>
        <h3>아이디어</h3>
        <p>
          notification의 old/new 방향을 보존하고, 파생 저장소 transaction 안에서
          rollback과 apply를 원자적으로 처리한 뒤에만 finished height를
          전송한다.
        </p>
        <h3>구현</h3>
        <p>
          <code>ChainCommitted</code>, <code>ChainReverted</code>,{" "}
          <code>ChainReorged</code>를 exhaustive하게 처리한다. 공유된 chain
          value의 내부 표현이나 clone 비용을 고정 성능으로 단정하지 않고,
          extension이 실제로 필요한 block·receipt·state data만 읽는다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3">
        {NOTIFICATION_EVENTS.map((event) => (
          <article
            key={event.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="font-mono text-xs font-bold"
              style={{ color: event.color }}
            >
              {event.name}
            </p>
            <p className="mt-1 text-xs text-foreground/55">{event.desc}</p>
            <p className="mt-3 text-xs leading-5 text-foreground/65">
              {event.payload}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/45">
              {event.handling}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
