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
      <h2 className="mb-6 text-2xl font-bold">libp2p Noise는 암호 채널을 PeerId에 묶습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          한 문장으로 답하면, libp2p Noise는 TCP byte stream을 암호화하고 handshake에서
          관측한 Noise static key가 어느 PeerId의 것인지 signature로 증명합니다. Alice가
          Bob의 <code>/ip4/203.0.113.7/tcp/4001</code>로 연결해도 TCP만으로는 상대가 Bob인지
          모르므로 이 검사가 필요합니다.
        </p>
        <p>
          Noise XX는 ephemeral·static Diffie–Hellman key를 섞어 session key를 만듭니다.
          별도의 libp2p identity key는 Noise static public key에 서명합니다. Noise static
          key는 channel key agreement, identity key는 장기 PeerId를 맡습니다. 두 key를
          같은 것으로 보면 signature binding이 왜 필요한지 놓치게 됩니다.
        </p>
        <p>
          현재 v0.57.1 upgrade는 signature를 검증해 관측한 PeerId와 secure I/O를 반환합니다.
          “내가 요청한 Bob과 같은가”라는 target 비교는 상위 Swarm·dial owner가 맡습니다.
          암호 채널 인증과 target 승인까지 한 함수가 모두 한다고 가정하면 실패 owner를 잘못
          찾게 됩니다.
        </p>
        <p>
          <Link to="/cs/p2p/tls-fundamentals">TLS 1.3</Link>도 authenticated secure channel을
          만들지만 certificate·transcript·key schedule을 소유합니다. 이 글은 Noise
          Framework 전체가 아니라 libp2p가 고정한 XX/25519/ChaChaPoly/SHA256 조합과
          identity-binding payload를 소유합니다. 이 output이 stack에 들어가는 위치는
          <Link to="/cs/p2p/libp2p"> libp2p 연결 조립 글</Link>에서 이어집니다.
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
        <CitationBlock source="libp2p Specifications — noise-libp2p Secure Channel Handshake" citeKey={1} href="https://github.com/libp2p/specs/blob/c750236de43cd8b246a824b377dfdb26bae686db/noise/README.md">
          Noise static key를 libp2p identity key로 인증하는 payload와 XX wire contract를 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
