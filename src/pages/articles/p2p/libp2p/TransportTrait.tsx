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
          <code>Transport</code>는 bytes의 의미를 모릅니다. <code>dial</code>은
          <code>Multiaddr</code>와 option을 받아 연결 시도를 나타내는 future를 만들고,
          <code>listen_on</code>은 listener를 등록하며, <code>poll</code>은 새 주소나
          inbound connection 같은 <code>TransportEvent</code>를 올립니다. 중요한 점은
          dial을 호출한 순간이 아니라 반환된 future가 poll될 때 실제 작업이 시작된다는
          lazy contract입니다.
        </p>
        <p>
          이 contract 덕분에 상위 caller는 peer의 여러 주소를 동시에 시도해 먼저 성공한
          연결을 선택할 수 있습니다. 반대로 future를 만들기만 하고 poll하지 않으면
          network I/O는 진행되지 않으며, 취소된 future의 socket과 timer도 정리돼야
          합니다. Transport success는 remote identity 검증이 아니라 raw 또는
          transport-native connection 성공만 뜻합니다.
        </p>
      </div>
      {onCodeRef && (
        <div className="not-prose my-5 flex flex-wrap items-center gap-3">
          <CodeViewButton onClick={() => onCodeRef("transport-trait", codeRefs["transport-trait"])} />
          <span className="text-xs text-muted-foreground">실제 associated type과 dial/listen/poll signature를 확인합니다.</span>
        </div>
      )}
      <div id="paper-rust-libp2p-transport" className="prose prose-neutral max-w-none scroll-mt-24 border-l border-primary/50 pl-4 dark:prose-invert">
        <p className="text-xs font-bold text-primary">API 정본 · rust-libp2p Transport 0.56</p>
        <p>
          현재 docs.rs의 trait은 <code>Dial</code>, <code>ListenerUpgrade</code>,
          <code>Output</code>, <code>Error</code>와 네 필수 method를 명시합니다. 이 글의
          source snapshot과 최신 crate가 다를 수 있으므로 세부 variant는 사용하는
          Cargo.lock version에서 다시 확인해야 합니다.
        </p>
        <CitationBlock source="rust-libp2p 0.56 — Transport trait" citeKey={2} href="https://docs.rs/libp2p/latest/libp2p/trait.Transport.html">
          Dial future가 최초 poll 전에는 일을 시작하지 않아야 한다는 구현 contract까지 함께 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
