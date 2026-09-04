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
      <h2 className="text-2xl font-bold mb-6">IPC의 부모–자식 체인 모델</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("ipc-subnet", codeRefs["ipc-subnet"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            번들 코드는 개념용 스냅샷이며 현재 계약 API와 다를 수 있음
          </span>
        </div>
        <p className="leading-7">
          InterPlanetary Consensus(IPC)는 애플리케이션별 블록체인을 부모 체인
          아래에 <strong>subnet</strong>으로 만드는 프레임워크다. rootnet은
          Filecoin에 한정되지 않으며, 각 child subnet은 자체 상태·합의·경제
          규칙을 가지면서 부모와 메시지·자산·checkpoint를 교환한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 실행을 분리하면 연결 책임이 생긴다
        </h3>
        <p className="leading-7">
          전용 체인은 처리량과 정책을 독립적으로 정할 수 있다. 대신 그 순간부터 validator set 변경과 자산 공급, 부모에서 자식으로 내려오는 명령, 자식에서 부모로 올라오는
          결과를 안전하게 전달해야 한다. IPC는 이를 재귀적인 parent–child 프로토콜로 정의한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">세 개의 경계</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">On-chain contracts</h4>
            <p className="text-xs text-muted-foreground">
              Registry와 Gateway가 subnet 등록, validator collateral, cross-net
              message와 checkpoint 상태를 관리한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Subnet node</h4>
            <p className="text-xs text-muted-foreground">
              로컬 합의와 FVM/EVM 호환 실행을 수행하고 부모 finality를 함께
              추적한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Relayer</h4>
            <p className="text-xs text-muted-foreground">
              자식에서 quorum을 얻은 bottom-up checkpoint를 부모에 제출한다.
              합의자가 아니라 전달자 역할이다.
            </p>
          </div>
        </div>

        <p className="leading-7">
          “부모 보안을 그대로 상속한다”는 표현도 주의해야 한다. child의 안전성을 보려면 로컬 validator quorum과 parent checkpoint가 각각 보장하는 범위,
          메시지가 어느 단계까지 final해졌는지를 함께 확인해야 한다.
        </p>

        <CitationBlock {...OFFICIAL_SOURCES.ipc.architecture} citeKey={1}>
          공식 아키텍처는 validator가 parent와 child 노드를 함께 운영하고,
          합의·ABCI++·FVM 실행·parent interaction을 분리해 설명한다.
        </CitationBlock>
        <CitationBlock {...OFFICIAL_SOURCES.ipc.parentChild} citeKey={2}>
          parent–child 관계는 subnet 생성, 입출금, checkpoint, cross-net actor
          call과 종료를 포함한다. 모든 상태가 자동으로 rootnet finality와
          동일해지는 모델은 아니다.
        </CitationBlock>
      </div>
    </section>
  );
}
