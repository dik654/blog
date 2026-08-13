import ContextViz from "./viz/ContextViz";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        MessagePool은 head-relative 후보 집합이다
      </h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          pending message는 서명만 유효하다고 pool에 영구히 남지 않는다. sender
          nonce·잔액, gas parameters, network version과 현재 tipset이 바뀌면
          admission 또는 block selection 결과도 달라진다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("mpool-add", codeRefs["mpool-add"])}
          />
          <span className="self-center text-xs text-muted-foreground">
            Add snapshot
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("mpool-estimate", codeRefs["mpool-estimate"])
            }
          />
          <span className="self-center text-xs text-muted-foreground">
            GasEstimate snapshot
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Admit</h3>
            <p className="text-sm text-muted-foreground">
              decode·signature·chain ID·size·gas와 sender funds를 검사하고
              address/nonce별 후보로 저장한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Select</h3>
            <p className="text-sm text-muted-foreground">
              sender nonce dependency와 block gas budget을 지키면서 effective
              premium과 execution 가능성을 함께 본다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Reconcile</h3>
            <p className="text-sm text-muted-foreground">
              new tipset에서 포함 message를 제거하고 reorg로 되돌아온 message와
              새 state에서 stale한 후보를 재평가한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          pool 크기·per-sender limit·pruning threshold·replacement ratio는 node
          configuration과 implementation policy다. 숫자 자체보다 nonce
          dependency와 head change 시 재평가가 보존되는지 확인한다.
        </p>
      </div>
    </section>
  );
}
