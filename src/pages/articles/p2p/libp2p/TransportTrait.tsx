import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";

export default function TransportTrait({ onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="transport-trait" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Transport는 주소를 connection future와 listener event로 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Alice의 Ping 요청에서 base TCP transport는 Bob의 multiaddr를 받아
          <code>TcpStream</code>을 만드는 dial future를 돌려줍니다.
          <code>listen_on</code>은 inbound listener를 등록하고, <code>poll</code>은 새
          listen address나 inbound connection 같은 <code>TransportEvent</code>를
          올립니다. 이 단계는 Ping nonce 7의 의미를 모릅니다.
        </p>
        <p>
          중요한 점은 <code>dial</code> 호출과 실제 연결 시작이 같은 순간이 아니라는
          것입니다. v0.57.1의 trait 계약은 반환한 future가 처음 poll될 때부터 일을
          하라고 명시합니다. 그래서 상위 caller가 Bob의 여러 주소에서 만든 future
          일부를 동시에 경주시키고, 인증까지 끝난 첫 valid output을 선택할 수
          있습니다.
        </p>
        <p>
          Future를 만들기만 하고 poll하지 않으면 network I/O는 진행되지 않습니다.
          Loser future를 취소했다면 socket과 timer도 정리돼야 합니다. 또한
          <code>Transport</code> trait은 output type을 고정하지 않습니다. Base TCP는
          raw stream을 내지만, Noise와 Yamux를 조합해 Swarm에 넣는 boxed transport는
          <code>(PeerId, StreamMuxerBox)</code>를 냅니다.
        </p>
      </div>
      {onCodeRef && (
        <div className="not-prose my-5 flex flex-wrap items-center gap-3">
          <CodeViewButton onClick={() => onCodeRef("transport-trait", codeRefs["transport-trait"])} />
          <span className="text-xs text-muted-foreground">실제 associated type과 dial/listen/poll signature를 확인합니다.</span>
        </div>
      )}
      <div id="paper-rust-libp2p-transport" className="prose prose-neutral max-w-none scroll-mt-24 border-l border-primary/50 pl-4 dark:prose-invert">
        <p className="text-xs font-bold text-primary">API 정본 · rust-libp2p v0.57.1 Transport</p>
        <p>
          고정 tag의 trait은 <code>Dial</code>, <code>ListenerUpgrade</code>,
          <code>Output</code>, <code>Error</code>와 네 필수 method를 명시합니다. 이 글의
          source와 실제 binary의 Cargo.lock이 다르면 세부 variant를 해당 version에서
          다시 확인해야 합니다.
        </p>
        <CitationBlock source="rust-libp2p v0.57.1 — core/src/transport.rs" citeKey={2} href="https://github.com/libp2p/rust-libp2p/blob/v0.57.1/core/src/transport.rs">
          Dial future가 최초 poll 전에는 일을 시작하지 않아야 한다는 구현 contract까지 함께 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
