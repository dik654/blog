import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { USE_CASES } from "./UseCasesData";

export default function UseCases({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        활용 판단: 빠른 접근보다 state machine이 먼저
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <div className="not-prose mb-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef("exex-example", codeRefs["exex-example"])}
          />
          <span className="self-center text-xs text-muted-foreground">
            간단한 extension skeleton
          </span>
        </div>
        <h3>배경</h3>
        <p>
          ExEx는 indexer, bridge input, metrics와 proof-input generation처럼
          canonical execution data에서 파생되는 작업에 적합하다.
        </p>
        <h3>문제</h3>
        <p>
          같은 프로세스라는 이유만으로 latency 개선이나 event 무손실을 보장하지
          않는다. blocking DB write, unbounded queue, reorg 누락과 너무 이른
          checkpoint는 오히려 node lifecycle을 위험하게 만든다.
        </p>
        <h3>아이디어</h3>
        <p>
          선택 기준을 “RPC보다 빠른가”가 아니라 canonical transition과 강하게
          결합해야 하는가로 둔다. 외부 독립 배포·권한 격리·다른 언어가 더
          중요하면 remote consumer가 나을 수 있다.
        </p>
        <h3>구현</h3>
        <p>
          파생 DB에는 block hash와 canonical status를 저장하고, notification
          단위 transaction·idempotency· rollback test를 둔다. FinishedHeight,
          WAL size, queue capacity와 processing lag를 함께 모니터링한다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3">
        {USE_CASES.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p className="text-sm font-semibold" style={{ color: item.color }}>
              {item.label}
            </p>
            <p className="mt-1 text-xs text-foreground/45">{item.category}</p>
            <p className="mt-3 text-xs leading-5 text-foreground/60">
              {item.desc}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/55">
              {item.events}
            </p>
            <p className="mt-2 text-xs leading-5 text-amber-600 dark:text-amber-400">
              {item.caveat}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
