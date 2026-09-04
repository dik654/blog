import ContextViz from "./viz/ContextViz";
import { CodeViewButton } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
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
        FVM은 Filecoin 상태 전이의 실행 경계다
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("fvm-machine", codeRefs["fvm-machine"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            번들 코드는 ref-fvm 흐름을 축약한 스냅샷
          </span>
        </div>
        <p className="leading-7">
          Filecoin의 계정과 프로토콜 구성요소는 <strong>Actor</strong>로
          표현된다. 블록의 메시지는 Actor 메서드를 호출하고, FVM은 같은 입력이
          모든 노드에서 같은 receipt와 state root를 만들도록 실행한다. 따라서
          FVM은 단순한 dApp VM이 아니라 Filecoin 자체 프로토콜 로직과 사용자
          계약이 만나는 공통 런타임이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 프로그래밍 가능성과 합의 결정성을 함께 지키기
        </h3>
        <p className="leading-7">
          사용자가 배포한 코드는 파일·네트워크·시계 같은 호스트 환경에 임의로 접근해서는 안 되고 무한 실행이나 노드별 결과 차이도 막아야 한다. 동시에 상태 읽기, 다른 Actor 호출,
          암호 연산처럼 Filecoin에 필요한 기능은 통제된 형태로 열어 둔다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — WASM sandbox와 런타임 syscall
        </h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">WASM execution</h4>
            <p className="text-xs text-muted-foreground">
              Actor 코드를 격리된 모듈로 실행하고 허용된 import만 연결한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Gas &amp; limits</h4>
            <p className="text-xs text-muted-foreground">
              명령·메모리·호스트 호출 비용을 계량하고 실행 자원에 상한을 둔다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">IPLD state</h4>
            <p className="text-xs text-muted-foreground">
              Actor state를 content-addressed blockstore에 두고 트랜잭션 단위로
              새 root를 만든다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          FEVM은 별도 체인이 아니다
        </h3>
        <p className="leading-7">
          FEVM은 EVM bytecode를 실행하는 런타임을 FVM 위에 구현한다. Solidity
          계약은 Ethereum JSON-RPC와 익숙한 도구를 사용할 수 있지만, 최종 상태는
          Filecoin Actor 모델에 존재하며 built-in Actor 호출은 Filecoin 전용
          인터페이스와 주소 변환을 거친다.
        </p>

        <CitationBlock {...OFFICIAL_SOURCES.filecoin.fvm} citeKey={1}>
          공식 문서는 FVM을 IPLD 데이터를 위한 WASM 기반 실행 환경으로 설명하고,
          FEVM을 그 위의 EVM 호환 런타임으로 구분한다.
        </CitationBlock>
        <CitationBlock {...OFFICIAL_SOURCES.filecoin.actors} citeKey={2}>
          Actor는 code·state·balance·nonce를 가진 상태 객체이며 메시지 호출로
          전이한다. built-in과 user Actor의 책임을 구분하는 것이 FVM 흐름을 읽는
          출발점이다.
        </CitationBlock>
      </div>
    </section>
  );
}
