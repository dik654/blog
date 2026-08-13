import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import BuilderDetailViz from "./viz/BuilderDetailViz";
import { codeRefs } from "./codeRefs";

export default function NodeBuilder({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="node-builder" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        NodeBuilder는 조립 순서를 compile-time capability로 바꾼다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          일반 builder가 <code>has_components: bool</code> 같은 runtime flag로
          상태를 표현하면 잘못된 순서를 실행 직전에야 발견할 수 있습니다. Reth
          2.x의 builder API는 <code>NodeBuilder</code>,{" "}
          <code>NodeBuilderWithTypes</code>,
          <code>NodeBuilderWithComponents</code>처럼 반환 type을 바꾸며, 각
          type이 다음 단계에 필요한 method와 trait bound만 노출합니다. 정확한
          generic parameter와 method 이름은 release마다 달라질 수 있으므로 이
          글의 축약 code보다 pinned crate docs와 source가 우선합니다.{" "}
          <CodeViewButton onClick={() => open("builder-states")} />
        </p>
        <h3>작은 반례로 typestate의 효과를 봅니다</h3>
        <p>
          Types를 정하지 않은 builder에 Ethereum 전용 component를 붙이려 하면
          어떤 block·transaction·chain spec type을 사용해야 하는지 알 수
          없습니다. Components를 붙이지 않은 상태에서 launch하려 하면
          pool·network·executor를 만들 factory도 없습니다. 이 상태들이 서로 다른
          Rust type이면 해당 method가 아예 없거나 trait bound가 성립하지 않아
          compilation이 실패합니다. 반면 모든 값이 <code>Option</code>인 단일
          struct라면 같은 오류가 runtime branch와 test coverage에 의존합니다.
        </p>
      </div>

      <BuilderDetailViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Compile-time gate가 runtime readiness를 대신하지는 않습니다</h3>
        <p>
          Type이 맞아도 database open, storage migration, socket bind, peer
          network start와 RPC hook은 runtime에서 실패할 수 있습니다. 따라서
          launch receipt는 최소한{" "}
          <code>
            config_validated→storage_open→components_initialized→add_ons_started→ready
          </code>
          상태와 각 단계의 stable attempt ID를 기록해야 합니다. 중간에 crash하면
          마지막 durable state를 읽고 이미 열린 resource를 정리한 뒤
          idempotent하게 재시도하며, 단순히 “handle을 받았다”는 이유로
          readiness를 선언하지 않습니다.
        </p>
        <h3>Hook은 실행 시점과 실패 정책까지 계약입니다</h3>
        <p>
          Component initialization 직후, node started, RPC started 같은 hook은
          같은 extension이 아닙니다. Provider가 준비되기 전에 읽는 hook과 public
          RPC가 열린 뒤 실패하는 hook은 영향 범위가 다르기 때문입니다. 각 hook은
          입력 context, side effect, timeout, failure가 launch를 중단하는지
          degraded 상태로 남기는지, restart 시 중복 실행을 어떻게 막는지를
          명시해야 합니다.{" "}
          <CodeViewButton onClick={() => open("builder-node")} />
        </p>
      </div>

      <div
        id="paper-reth-node-builder"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 API 읽기 · builder state
        </p>
        <p className="mt-2 text-sm font-semibold">
          Reth NodeBuilder documentation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 CLI config에서 fully typed node와 <code>NodeHandle</code>까지
          어떤 state와 hook을 거치는지 확인하는 것입니다. 문서는 component
          builder의 dependency order와 lifecycle hook을 설명하지만, trait 이름을
          semver 밖의 안정 API로 보장하거나 runtime service가 실제로
          healthy하다고 증명하지는 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://reth.rs/docs/reth/builder/struct.NodeBuilder.html"
          target="_blank"
          rel="noreferrer"
        >
          NodeBuilder 공식 문서 보기
        </a>
      </div>
    </section>
  );
}
