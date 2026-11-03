import { CitationBlock } from "@/components/ui/citation";
import HandshakeViz from "./viz/HandshakeViz";

export default function Handshake() {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        핸드셰이크는 보안과 전송 조건을 함께 합의합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          사례의 앱은 Initial packet의 CRYPTO frame에 TLS ClientHello를
          싣습니다. ServerHello는 Initial encryption level에서 오고, 이어지는
          인증서와 Finished는 Handshake level에서 옵니다. QUIC은 TLS record를
          만들지 않습니다. TLS가 내놓은 traffic secret에서 packet 보호 key·IV와
          header protection key를 QUIC이 파생합니다.
        </p>
        <p>
          양쪽의 QUIC transport parameter는 ClientHello와 EncryptedExtensions에
          들어갑니다. Stream limit, idle timeout, connection ID 관련 값이 TLS
          transcript에 함께 묶이는 이유입니다. 값은 핸드셰이크 도중 일찍 보일 수
          있지만, 핸드셰이크가 끝나기 전에는 아직 인증됐다고 믿을 수 없습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <HandshakeViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Packet-number space를 나누는 이유</h3>
        <p>
          아직 Handshake key가 없는 Initial 단계와 1‑RTT 단계가 같은 번호 장부를
          쓰면 ACK와 key 수명을 섞기 쉽습니다. 그래서 Initial, Handshake,
          Application Data는 독립된 packet-number space를 갖습니다. 예를 들어
          Initial packet 2와 Handshake packet 2는 같은 숫자여도 다른 장부의
          항목입니다. 0‑RTT와 1‑RTT는 Application Data space를 공유합니다.
        </p>
        <h3>Initial protection은 서버 인증이 아닙니다</h3>
        <p>
          Initial key는 공개된 version-specific salt와 client가 선택한
          destination connection ID에서 누구나 계산할 수 있습니다. 따라서
          Initial protection은 서버만 풀 수 있는 기밀성이나 서버 인증을 주지
          않습니다. Server certificate와 Finished를 검증하고 1‑RTT key에
          도달해야 인증된 연결로 봅니다.
        </p>
        <h3>0‑RTT와 amplification을 별도 위험으로 봅니다</h3>
        <p>
          0‑RTT는 현재 새 연결 사례가 아니라 재연결 변형입니다. ClientHello는
          Initial packet의 CRYPTO frame에, early application frame은 별도의
          0‑RTT packet에 들어갑니다. 둘을 한 Initial payload로 합치지 않습니다.
          0‑RTT는 TLS PSK의 replay 위험과 기억해 둔 transport parameter의 한계를
          함께 가집니다.
        </p>
        <p>
          주소를 검증하지 않은 server는 그 주소에서 받은 bytes의 세 배까지만
          보낼 수 있습니다. 예를 들어 1,200 bytes를 받았다면 검증 전 전송 상한은
          3,600 bytes입니다. Retry token은 client가 그 source address에서 응답을
          받을 수 있음을 확인할 뿐, client identity를 인증하지 않습니다.
        </p>
        <div
          id="paper-rfc9001"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 9001</p>
          <p>
            RFC 9001은 TLS handshake가 QUIC CRYPTO frame에 실리는 방식과
            Initial, Handshake, 0‑RTT, 1‑RTT packet protection을 정의합니다. 이
            RFC가 인용한 원래 TLS 1.3 규격은 RFC 8446이고 현재 TLS 1.3 정본은
            RFC 9846이지만, 어느 경우에도 TLS record format을 QUIC packet 위에
            그대로 얹지는 않습니다.
          </p>
          <CitationBlock
            source="IETF RFC 9001 — Using TLS to Secure QUIC"
            citeKey={2}
            href="https://www.rfc-editor.org/rfc/rfc9001.html"
          >
            TLS traffic secret에서 QUIC packet key를 파생하고 encryption level별
            CRYPTO data를 처리하는 mapping을 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
