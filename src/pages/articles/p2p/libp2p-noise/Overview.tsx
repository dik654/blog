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
      <h2 className="mb-6 text-2xl font-bold">libp2p Noise는 암호화에 PeerId 인증을 덧붙인 secure-channel upgrade입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          TCP 연결은 상대 IP와 port만 알려 줄 뿐 “내가 연결하려던 PeerId가 맞는가”를 증명하지 않습니다. libp2p Noise는 Noise XX handshake로 양쪽이
          ephemeral·static Diffie–Hellman key를 섞어 session key를 만듭니다. 별도의 libp2p identity key로 Noise static
          key를 서명해 그 channel을 PeerId에 묶습니다.
        </p>
        <p>
          여기서 static key가 두 종류라는 점이 중요합니다. Noise static DH key는 channel key agreement에 쓰고 libp2p identity key는
          장기 peer identity를 증명합니다. 같은 key라고 가정하거나 Noise XX 자체가 PeerId를 자동 인증한다고 이해하면 signature 검증 누락을 발견하기
          어렵습니다.
        </p>
        <p>
          <Link to="/p2p/tls-fundamentals">TLS 1.3</Link>도 authenticated secure channel을
          만들지만 certificate·transcript·key schedule을 소유합니다. 이 글은 Noise
          Framework 전체가 아니라 libp2p가 고정한 XX/25519/ChaChaPoly/SHA256 조합과
          identity-binding payload를 소유합니다. 이 output이 stack에 들어가는 위치는
          <Link to="/p2p/libp2p"> libp2p 연결 조립 글</Link>에서 이어집니다.
        </p>
      </div>
      <ContentBoundary article="libp2p-noise" />
      <ConnectionTraceViz kind="noise" />
      {onCodeRef && (
        <div className="not-prose my-5 flex flex-wrap items-center gap-3">
          <CodeViewButton onClick={() => onCodeRef("noise-config", codeRefs["noise-config"])} />
          <span className="text-xs text-muted-foreground">Profile 설정과 identity-binding key 준비를 확인합니다.</span>
          <CodeViewButton onClick={() => onCodeRef("noise-handshake", codeRefs["noise-handshake"])} />
          <span className="text-xs text-muted-foreground">Handshake future와 검증 output 인계를 추적합니다.</span>
        </div>
      )}
      <div id="paper-libp2p-noise-spec" className="prose prose-neutral max-w-none scroll-mt-24 border-l border-primary/50 pl-4 dark:prose-invert">
        <p className="text-xs font-bold text-primary">명세 읽기 · noise-libp2p</p>
        <p>
          공식 spec은 <code>/noise</code> protocol ID, XX message pattern, 고정 cipher
          suite, identity payload, 2-byte big-endian frame length와 실패 시 connection
          종료를 정의합니다. 이것은 모든 Noise pattern의 일반 결론도, CA 기반 web PKI의
          대체 정책도 아닙니다.
        </p>
        <CitationBlock source="libp2p Specifications — noise-libp2p Secure Channel Handshake" citeKey={1} href="https://github.com/libp2p/specs/blob/master/noise/README.md">
          Noise static key를 libp2p identity key로 인증하는 payload와 XX wire contract를 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
