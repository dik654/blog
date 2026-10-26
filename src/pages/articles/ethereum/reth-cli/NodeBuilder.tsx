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
        NodeBuilder는 조립 순서를 컴파일 단계의 제약으로 바꿉니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          일반적인 빌더가 <code>has_components: bool</code> 같은 실행 중 플래그로
          상태를 표현하면 잘못된 순서를 실행 직전에야 발견할 수 있습니다. Reth
          v2.8.1의 빌더 API는 <code>NodeBuilder</code>,{" "}
          <code>NodeBuilderWithTypes</code>,
          <code>NodeBuilderWithComponents</code>처럼 반환 형식을 바꿉니다.
        </p>
        <p>
          각 형식은 다음 단계에 필요한 메서드와 트레이트 조건만 노출합니다. 정확한
          제네릭 매개변수와 메서드 이름은 릴리스마다 달라질 수 있으므로 이
          글의 축약 코드보다 v2.8.1 태그의 소스가 우선합니다.{" "}
          <CodeViewButton onClick={() => open("builder-states")} />
        </p>
        <h3>작은 반례로 형식 상태(typestate)의 효과를 봅니다</h3>
        <p>
          노드 형식을 정하지 않은 빌더에 Ethereum 전용 부품을 붙이려 하면 어떤 블록·거래·ChainSpec 형식을 사용할지 알 수 없습니다.
          핵심 부품을 붙이지 않은 상태에서 실행하려 하면 거래 풀·네트워크·실행기를 만들 공장도 없습니다.
        </p>
        <p>
          이 상태들이 서로 다른 Rust 형식이면 해당 메서드가 보이지 않거나 트레이트 조건이 성립하지 않아 컴파일이 실패합니다.
          반면 모든 값이 <code>Option</code>인
          하나의 구조체라면 같은 오류를 실행 중 분기와 테스트 범위에 맡기게 됩니다.
        </p>
      </div>

      <BuilderDetailViz onOpenCode={open} />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>컴파일 단계의 제약이 실행 준비 상태를 대신하지는 않습니다</h3>
        <p>
          형식이 맞아도 데이터베이스 열기, 저장 형식 변경, 소켓 연결, 피어 네트워크 시작과 RPC 훅은 실행 중에 실패할 수 있습니다.
        </p>
        <p>
          따라서 시작 기록은 최소한{" "}
          <code>
            config_validated→storage_open→components_initialized→add_ons_started→ready
          </code>
          상태와 각 단계의 고정된 시도 식별자를 기록해야 합니다.
        </p>
        <p>
          중간에 종료되면 마지막으로 저장된 상태를 읽고 이미 열린 자원을 정리한
          뒤 중복 부작용 없이 다시 시도합니다. 단순히 “핸들을 받았다”는 이유로 준비 완료를 선언하지 않습니다.
        </p>
        <h3>훅은 실행 시점과 실패 정책까지 포함한 계약입니다</h3>
        <p>
          핵심 부품 초기화 직후, 노드 시작 뒤, RPC 시작 뒤에 호출되는 훅은 같은 확장이 아닙니다. 조회 계층이 준비되기 전에 실행되는 훅과
          공개 RPC가 열린 뒤 실패하는 훅은 영향 범위가 다르기 때문입니다. 각 훅은 입력 문맥, 외부 부작용, 제한 시간, 실패가 시작을
          중단하는지 성능 저하 상태로 남기는지, 재시작할 때 중복 실행을 어떻게 막는지를 명시해야 합니다.{" "}
          <CodeViewButton onClick={() => open("builder-node")} />
        </p>
      </div>

      <div
        id="paper-reth-node-builder"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">[O] 공식 API와 v2.8.1 소스 · 2026-10-27 확인</p>
        <p className="mt-2 text-sm font-semibold">
          Reth NodeBuilder documentation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          공식 문서는 <code>NodeConfig</code>에서 형식이 확정된 노드와 <code>NodeHandle</code>까지 어떤 상태와 훅을 거치는지
          설명합니다. 다만 트레이트 이름을 모든 후속 릴리스에서 고정하거나 실행 서비스가 실제로 정상임을 증명하지는 않습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://reth.rs/docs/reth/builder/struct.NodeBuilder.html"
          target="_blank"
          rel="noreferrer"
        >
          NodeBuilder 공식 문서
        </a>
        <a
          className="ml-5 mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/paradigmxyz/reth/blob/v2.8.1/crates/node/builder/src/builder/mod.rs"
          target="_blank"
          rel="noreferrer"
        >
          v2.8.1 소스
        </a>
      </div>
    </section>
  );
}
