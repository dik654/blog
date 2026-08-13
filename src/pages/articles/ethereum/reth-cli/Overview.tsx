import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import NodeBuilderViz from "./viz/NodeBuilderViz";
import { codeRefs } from "./codeRefs";
import { DESIGN_CHOICES } from "./OverviewData";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CLI에서 full node까지: 조립 순서를 타입으로 보존하기
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          <code>reth node</code>는 설정을 읽고 끝나는 명령이 아니다. chain
          spec과 storage를 열고 provider, execution, transaction pool, network,
          sync, payload service와 RPC를 같은 lifecycle로 기동해야 한다.
        </p>
        <h3>문제</h3>
        <p>
          서비스 생성 순서와 generic types가 어긋나면 일부 컴포넌트만 다른 chain
          rules나 provider를 볼 수 있다. 모든 변형을 CLI의 조건문으로 분기하면
          L2와 custom node가 늘어날수록 bootstrap logic이 복제된다.
        </p>
        <h3>아이디어</h3>
        <p>
          CLI는 사용자 입력을 typed config로 바꾸는 boundary까지만 담당하고,{" "}
          <code>NodeBuilder</code>가 node types, components와 add-ons를 단계별로
          축적한다. 각 변형은 필요한 trait implementation을 공급하고 공통 launch
          lifecycle을 재사용한다.
        </p>
        <h3>구현</h3>
        <p>
          builder는 아직 준비되지 않은 상태와 launch 가능한 상태를 다른 타입으로
          표현한다. component builder가 pool, EVM, consensus와 network를 만들고,
          add-ons가 RPC와 ExEx 같은 확장을 등록한다. 마지막 launch 단계가 task
          supervision과 종료 신호를 묶는다.
          <CodeViewButton onClick={() => open("builder-node")} />
        </p>
      </div>

      <div className="not-prose mb-8">
        <NodeBuilderViz onOpenCode={open} />
      </div>

      <h3 className="mb-3 text-lg font-semibold">확장 지점</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DESIGN_CHOICES.map((choice) => (
          <article
            key={choice.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="text-sm font-semibold"
              style={{ color: choice.color }}
            >
              {choice.label}
            </p>
            <p className="mt-1 text-xs font-medium text-foreground/65">
              {choice.role}
            </p>
            <p className="mt-3 text-xs leading-5 text-foreground/55">
              {choice.details}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/45">
              {choice.why}
            </p>
            {choice.codeRefKeys && (
              <div className="mt-3 flex flex-wrap gap-2">
                {choice.codeRefKeys.map((key) => (
                  <CodeViewButton key={key} onClick={() => open(key)} />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
