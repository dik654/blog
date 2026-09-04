import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import ConnectionTraceViz from "../libp2p/viz/ConnectionTraceViz";
import { codeRefs } from "../libp2p/codeRefs";

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">libp2p TCP Transport는 multiaddr를 비동기 ordered byte stream으로 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <code>/ip4/203.0.113.7/tcp/4001</code>로 peer에 dial한다고 해봅시다. TCP
          Transport의 책임은 이 layered address를 OS socket address로 해석하고,
          nonblocking connect를 진행해 ordered byte stream을 반환하거나 실패 이유를
          알리는 데까지입니다. 암호화, PeerId 인증과 application protocol은 아직 없습니다.
        </p>
        <p>
          그래서 TCP connect 성공을 libp2p connection 성공으로 기록하면 진단이
          흐려집니다. 그 뒤 <Link to="/p2p/libp2p-noise">Noise secure-channel</Link>과
          stream multiplexer 협상이 모두 끝나야 Swarm이 사용할
          <code>(PeerId, StreamMuxer)</code>가 됩니다. <Link to="/p2p/quic-fundamentals">QUIC</Link>은
          security와 multiplexing을 transport 안에 포함하므로 같은 output에 도달하는
          조립 경로가 다릅니다.
        </p>
      </div>
      <ContentBoundary article="libp2p-tcp" />
      <ConnectionTraceViz kind="tcp" />
      {onCodeRef && (
        <div className="not-prose my-5 flex flex-wrap items-center gap-3">
          <CodeViewButton onClick={() => onCodeRef("tcp-transport", codeRefs["tcp-transport"])} />
          <span className="text-xs text-muted-foreground">Transport의 dial·listen·poll 구현 경계를 확인합니다.</span>
          <CodeViewButton onClick={() => onCodeRef("tcp-socket", codeRefs["tcp-socket"])} />
          <span className="text-xs text-muted-foreground">Socket 생성과 option 적용을 실제 source로 추적합니다.</span>
        </div>
      )}
      <div id="paper-rust-libp2p-tcp" className="prose prose-neutral max-w-none scroll-mt-24 border-l border-primary/50 pl-4 dark:prose-invert">
        <p className="text-xs font-bold text-primary">API 정본 · rust-libp2p TCP</p>
        <p>
          현재 0.56 문서는 default로 TCP_NODELAY 활성, port reuse 비활성, OS TTL, listen backlog 1024를 명시합니다. 이 숫자는
          protocol 보장이 아니라 해당 crate version의 default이며 OS limit과 application load에 따라 실제 동작을 측정해야 합니다.
        </p>
        <CitationBlock source="rust-libp2p 0.56 — TCP Config and Transport" citeKey={1} href="https://docs.rs/libp2p/latest/libp2p/tcp/struct.Config.html">
          Current socket option default와 per-connection PortUse로 이동한 API 경계를 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
