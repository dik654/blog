import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import ExExFlowViz from "./viz/ExExFlowViz";
import { EXEX_CONCEPTS } from "./OverviewData";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";

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
          함께 실행되는 long-lived future로 이 변화를 소비합니다.
        </p>
        <h3>문제</h3>
        <p>
          단순 block-number polling은 old chain을 어떻게 되돌릴지, 어느 높이까지
          확실히 처리했는지를 표현하지 못한다. 노드가 확장 기능보다 먼저
          history를 prune하면 재시작·catch-up도 깨질 수 있습니다.
        </p>
        <h3>아이디어</h3>
        <p>
          canonical notification을 commit·revert·reorg의 구조화된 stream으로
          전달하고, ExEx가 완료한
          <code>num/hash</code>를 다시 보고하게 한다. 이 checkpoint가 replay
          시작점과 pruning lower bound를 동시에 연결합니다.
        </p>
        <h3>구현</h3>
        <p>
          ExEx manager는 WAL과 bounded buffer를 통해 각 extension의 readiness를
          고려해 알림을 보낸다. 여러 ExEx가 있으면 가장 낮은 finished height가
          전체 안전 경계가 된다. ExEx는 main execution을 block하지 않도록
          blocking I/O와 unbounded memory를 자체적으로 통제해야 합니다.
        </p>
        <p>
          고정 예시로 extension A는 block 100까지, B는 97까지 durable commit했다고
          해보겠습니다. Node head가 105여도 안전하게 prune 가능한 공통 경계는
          느린 B의 97을 넘을 수 없습니다. 103~105 reorg가 오면 external webhook을
          먼저 다시 보내는 것이 아니라 파생 DB에서 old branch rollback과 new
          branch apply를 원자적으로 끝내고 checkpoint·outbox receipt를 함께
          확정해야 합니다.
        </p>
      </div>
      <ContentBoundary article="reth-exex" />
      <ExplainedFormula
        question="여러 ExEx가 있을 때 node가 보존해야 할 가장 느린 checkpoint는 어디일까?"
        idea="각 extension이 durable하게 끝냈다고 보고한 높이 중 최솟값을 공통 안전 경계로 사용합니다. Head와의 차이는 backlog이며, 느린 consumer가 계속 뒤처지면 buffer가 유한하다는 사실을 운영자가 확인해야 합니다."
        formula={String.raw`h_{\mathrm{safe}}=\min_i h_i,\qquad L=H-h_{\mathrm{safe}}`}
        terms={[
          { symbol: "h_i", name: "ExEx finished height", description: "Extension i가 자신의 파생 상태까지 durable commit한 마지막 canonical block입니다." },
          { symbol: "h_{\\mathrm{safe}}", name: "공통 안전 경계", description: "모든 extension이 처리했다고 증명한 가장 낮은 height입니다." },
          { symbol: "H", name: "Canonical head", description: "Node가 현재 확정한 live canonical tip height입니다." },
          { symbol: "L", name: "Processing lag", description: "Head와 공통 checkpoint의 차이이며 단위는 blocks입니다." },
        ]}
        assumptions={["각 h_i는 external effect 완료가 아니라 extension durable state와 receipt가 함께 commit된 위치입니다.", "Reorg에서는 height만 아니라 block hash·branch identity를 함께 확인합니다.", "Pruning 정책은 실제 Reth release와 ExEx manager contract에 귀속합니다."]}
        interpretation="A=100, B=97, head=105라면 safe=97이고 lag=8 blocks입니다. A가 빠르다는 이유로 100 이전 자료를 지우면 B의 restart replay가 끊길 수 있습니다."
      />

      <div className="not-prose mb-8">
        <ExExFlowViz />
      </div>
      <div id="paper-reth-exex-source" className="mt-8 scroll-mt-24">
        <CitationBlock citeKey={1} type="code" source="Reth ExEx source snapshot @ 4cf0face" href="https://github.com/paradigmxyz/reth/tree/4cf0facecda7b4d474c739acef1c0fc2c69a122c/crates/exex">
          <p>Notification·WAL·finished-height lifecycle은 이 SHA에 고정합니다. Queue size나 pruning 연동을 모든 release의 상수로 일반화하지 않습니다.</p>
        </CitationBlock>
      </div>
      <div id="paper-reth-exex-docs" className="scroll-mt-24">
        <CitationBlock citeKey={2} source="Reth Execution Extensions documentation" href="https://reth.rs/exex/overview/">
          <p>ExEx의 역할과 notification model을 설명하는 공식 안내입니다. External database·webhook의 exactly-once delivery까지 Reth가 보장한다고 읽지 않습니다.</p>
        </CitationBlock>
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
