import { CitationBlock } from "@/components/ui/citation";
import HandshakeViz from "./viz/HandshakeViz";

export default function Handshake() {
  return (
    <section id="handshake" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Handshake는 TLS 메시지와 transport parameter를 같은 연결에 묶습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Client는 Initial packet의 CRYPTO frame에 TLS ClientHello를 싣습니다. Server는 Initial과 Handshake packet으로
          ServerHello 이후 메시지를 보냅니다. TLS transcript에는 QUIC transport parameter도 들어가므로 stream limit, idle
          timeout, connection ID 관련 값이 인증된 합의에 묶입니다. TLS record layer는 쓰지 않습니다. Packet protection key는 QUIC이
          TLS traffic secret에서 파생합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <HandshakeViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Packet-number space를 나누는 이유</h3>
        <p>
          아직 Handshake key를 받지 못해 Initial packet을 처리하는 구간과 1‑RTT data 구간은 loss recovery에서 서로의 번호를 오인할 수 있습니다.
          그래서 Initial, Handshake, Application Data가 각각 독립된 packet-number space와 ACK 상태를 갖습니다. Encryption
          level이 올라가면 이전 key와 recovery state를 명세 순서대로 폐기합니다.
        </p>
        <h3>Initial protection은 서버 인증이 아닙니다</h3>
        <p>
          Initial key는 공개된 version-specific salt와 client가 선택한 destination connection ID에서 누구나 계산할 수 있습니다.
          여기까지의 효과는 wire의 일부를 middlebox가 쉽게 읽지 못하게 하는 선에서 끝납니다. 기밀성이나 peer authentication은 여기서 나오지 않습니다.
          Server certificate와 Finished를 검증하고 Handshake· 1‑RTT key에 도달해야 인증된 연결로 봅니다.
        </p>
        <h3>0‑RTT와 amplification을 별도 위험으로 봅니다</h3>
        <p>
          0‑RTT application data는 TLS PSK의 replay 경계를 그대로 가집니다. Transport parameter가 바뀌었을 때 사용할 수 없는 state도
          있습니다. 주소를 검증하지 않은 server에는 anti-amplification limit이 걸려 수신 bytes의 세 배보다 많이 보낼 수 없습니다. Retry token은
          source address ownership까지만 확인합니다. Client identity 인증은 그 범위 밖입니다.
        </p>
        <div
          id="paper-rfc9001"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 9001</p>
          <p>
            RFC 9001은 TLS handshake가 QUIC CRYPTO frame에 실리는 방식과 Initial, Handshake, 0‑RTT, 1‑RTT packet
            protection을 정의합니다. 다만 RFC 8446의 TLS record format이 QUIC packet 위에 그대로 얹히지는 않습니다.
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
