import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import NetworkStackViz from "./viz/NetworkStackViz";
import { NET_LAYERS } from "./OverviewData";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Reth 네트워크: 발견에서 protocol session까지
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          실행 클라이언트는 새 피어를 찾고, 상대 노드와 암호화 연결을 만든 뒤,
          서로 지원하는 devp2p capability를 협상해야 한다. 그 이후에야
          헤더·블록·트랜잭션을 교환할 수 있다.
        </p>
        <h3>문제</h3>
        <p>
          발견한 endpoint를 곧바로 신뢰하거나 discovery·transport·Ethereum wire
          semantics를 한 루프에 섞으면 연결 한도, timeout, protocol upgrade와
          악성 피어 처리의 경계가 흐려진다. 또한 네트워크 전체가 특정{" "}
          <code>eth/*</code> 버전을 쓴다고 고정하면 문서가 새 버전이 배포되는
          순간 틀어진다.
        </p>
        <h3>아이디어</h3>
        <p>
          Reth는 discovery, connection manager, RLPx session, negotiated
          subprotocol을 별도 책임으로 둔다. 각 피어는 양쪽이 공통으로 지원하는
          capability를 골라 통신하므로 버전은 연결별 결과이며 전역 상수가
          아니다.
        </p>
        <h3>구현</h3>
        <p>
          discovery가 dial 후보를 공급하면 connection manager가 방향·slot·평판을
          확인한다. RLPx가 상대 identity와 암호화 frame을 설정하고, Hello와
          Status 검증을 통과한 session만 request/response와 gossip을 네트워크
          서비스에 전달한다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <NetworkStackViz />
      </div>

      <h3 className="mb-3 text-lg font-semibold">계층별 책임</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {NET_LAYERS.map((layer) => (
          <article
            key={layer.id}
            className="rounded-xl border border-border/70 bg-card p-4"
          >
            <p className="text-sm font-semibold" style={{ color: layer.color }}>
              {layer.label}
            </p>
            <p className="mt-1 text-xs font-medium text-foreground/65">
              {layer.role}
            </p>
            <p className="mt-3 text-xs leading-5 text-foreground/60">
              {layer.details}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/45">
              {layer.why}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
