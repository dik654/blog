import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import ExExFlowViz from "./viz/ExExFlowViz";
import { EXEX_CONCEPTS } from "./OverviewData";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ExEx: canonical chain의 파생 상태를 함께 운용하기
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          인덱서, 브릿지와 분석기는 canonical chain이 commit, revert 또는
          reorg될 때 자신의 파생 상태도 같은 순서로 갱신해야 한다. ExEx는 Reth와
          함께 실행되는 long-lived future로 이 변화를 소비한다.
        </p>
        <h3>문제</h3>
        <p>
          단순 block-number polling은 old chain을 어떻게 되돌릴지, 어느 높이까지
          확실히 처리했는지를 표현하지 못한다. 노드가 확장 기능보다 먼저
          history를 prune하면 재시작·catch-up도 깨질 수 있다.
        </p>
        <h3>아이디어</h3>
        <p>
          canonical notification을 commit·revert·reorg의 구조화된 stream으로
          전달하고, ExEx가 완료한
          <code>num/hash</code>를 다시 보고하게 한다. 이 checkpoint가 replay
          시작점과 pruning lower bound를 동시에 연결한다.
        </p>
        <h3>구현</h3>
        <p>
          ExEx manager는 WAL과 bounded buffer를 통해 각 extension의 readiness를
          고려해 알림을 보낸다. 여러 ExEx가 있으면 가장 낮은 finished height가
          전체 안전 경계가 된다. ExEx는 main execution을 block하지 않도록
          blocking I/O와 unbounded memory를 자체적으로 통제해야 한다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <ExExFlowViz />
      </div>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EXEX_CONCEPTS.map((concept) => (
          <article
            key={concept.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p
              className="text-sm font-semibold"
              style={{ color: concept.color }}
            >
              {concept.label}
            </p>
            <p className="mt-1 text-xs font-medium text-foreground/65">
              {concept.role}
            </p>
            <p className="mt-3 text-xs leading-5 text-foreground/55">
              {concept.details}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/45">
              {concept.why}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
