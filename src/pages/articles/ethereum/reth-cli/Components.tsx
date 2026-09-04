import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ComponentsViz from "./viz/ComponentsViz";
import { codeRefs } from "./codeRefs";

export default function Components({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        교체 가능한 component도 dependency graph 안에서만 안전하다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          “Trait이므로 하나만 바꿔도 된다”는 설명은 절반만 맞습니다. Executor가
          소비하는 block type, pool이 보관하는 transaction type, network가
          broadcast하는 transaction, payload builder가 고르는 transaction은
          associated type과 trait bound로 이어집니다. Pool 구현을 바꾸면
          network와 payload builder가 그 output을 이해하는지도 다시 확인해야
          하며, 독립적인 카드 네 장을 아무 조합으로나 끼우는 구조가 아닙니다.{" "}
          <CodeViewButton onClick={() => open("node-components")} />
        </p>
      </div>

      <ComponentsViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Core component와 add-on의 failure radius를 분리합니다</h3>
        <p>
          Executor·pool·network·payload builder는 block lifecycle의 core dependency이며 RPC
          module·ExEx·observability hook은 이미 만들어진 component를 소비하는 add-on입니다. Custom chain이 EVM config를 교체할 때
          chain-specific transaction과 receipt rule을 함께 바꿔야 할 수 있지만 호환되는 network transport는 재사용할 수 있습니다. 반대로
          RPC extension 하나가 실패했다고 해서 consensus execution까지 손상됐다고 단정해서도 안 됩니다. Owner와 failure status를 분리해야
          selective retry와 rollback이 가능합니다.
        </p>

        <h3>
          Custom 조합은 compile test와 adversarial runtime test를 함께
          통과시킵니다
        </h3>
        <p>
          Compile fixture는 잘못된 assembly 순서, incompatible associated type과 빠진 add-on bound가 실패하는지 확인합니다.
          Runtime matrix는 같은 chain spec·storage snapshot·config에서 missing JWT, occupied port, incompatible
          schema, component init failure, hook timeout, crash, graceful shutdown을 base와 candidate에 동일하게 주입합니다.
          Config normalization·service state·canonical hash와 state root parity를 hard gate로 둔 뒤 startup
          latency와 resource 사용량을 비교합니다.
        </p>
        <p>
          Rollback에는 이전 binary와 config digest, 호환 storage snapshot,
          migration receipt가 필요합니다. 새 binary가 storage를 비가역적으로
          바꾼 뒤 executable만 되돌리는 방식은 rollback이 아닙니다.{" "}
          <CodeViewButton onClick={() => open("components-struct")} />
        </p>
      </div>

      <div
        id="paper-reth-v220-release"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 release note 읽기 · version boundary
        </p>
        <p className="mt-2 text-sm font-semibold">Reth v2.2.0 release</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          찾을 것은 default·storage·network·SDK 변화가 upgrade 절차에 어떤 영향을 주는가입니다. 이 release는 Discv5 default와 여러 gated
          기능·호환성 주의를 기록하지만 이후 2.x나 모든 custom node가 같은 default·feature 조합이라는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/paradigmxyz/reth/releases/tag/v2.2.0"
          target="_blank"
          rel="noreferrer"
        >
          v2.2.0 release note 보기
        </a>
      </div>
    </section>
  );
}
