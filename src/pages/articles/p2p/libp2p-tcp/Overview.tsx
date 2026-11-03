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
      <h2 className="mb-6 text-2xl font-bold">TCP Transport는 주소를 연결된 byte stream으로 바꿀 뿐입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          한 문장으로 먼저 답하면, TCP Transport는 Bob의
          <code>/ip4/203.0.113.7/tcp/4001</code> 주소를 OS가 읽는 socket address로 바꾸고
          nonblocking connect를 끝내 <code>TcpStream</code>을 만드는 계층입니다. 여기까지
          성공해도 상대가 Bob인지, 통신이 암호화됐는지, Ping protocol을 쓸 수 있는지는
          아직 모릅니다.
        </p>
        <p>
          이 답은 바로 다음 질문을 만듭니다. “Socket이 연결됐는데 왜 아직 peer 연결이
          아닌가?” IP와 port는 network endpoint를 가리킬 뿐 identity를 증명하지 않기
          때문입니다. 뒤이어 <Link to="/cs/p2p/libp2p-noise">Noise</Link>가 Bob의 PeerId를
          인증하고, Yamux가 substream을 열 수 있게 해야 Swarm이 쓸
          <code>(PeerId, StreamMuxer)</code>가 됩니다.
        </p>
        <p>
          이 글에서는 Alice가 Bob에게 한 번 dial하는 같은 사례를 끝까지 씁니다. TCP가
          주소를 거부한 실패, connect가 막힌 실패, Noise·Yamux upgrade가 막힌 실패를
          서로 다른 영수증으로 남기는 것이 목표입니다.
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
        <p className="text-xs font-bold text-primary">구현 정본 · rust-libp2p v0.57.1 / libp2p-tcp 0.45.0</p>
        <p>
          고정 source의 기본값은 TCP_NODELAY 활성, OS 기본 TTL, listen backlog 1024입니다.
          예전 <code>Config::port_reuse</code> setter는 아무 일도 하지 않는 deprecated API이고,
          현재 선택은 dial별 <code>DialOpts::port_use</code>가 소유합니다. 이 숫자와 option은
          protocol 보장이 아니라 해당 구현의 설정이므로 OS와 workload에서 다시 측정합니다.
        </p>
        <CitationBlock source="rust-libp2p v0.57.1 — transports/tcp/src/lib.rs" citeKey={1} href="https://github.com/libp2p/rust-libp2p/blob/2fed78f/transports/tcp/src/lib.rs">
          Socket 기본값, lazy dial, per-dial PortUse, listener event와 accept 오류 처리를 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
