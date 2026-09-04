import { CitationBlock } from "@/components/ui/citation";
import SecurityViz from "./viz/SecurityViz";

export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        QUIC 보안은 TLS 인증, packet protection, transport 방어를 함께 봅니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          TLS 1.3은 peer authentication과 traffic secret을 만들고 QUIC은 그 secret으로 payload와 header 일부를 보호합니다. Packet
          number도 header protection 때문에 그대로 노출되지는 않지만 length와 timing, IP path 같은 metadata는 남습니다. “모든 packet이
          암호화된다”고 해서 traffic analysis까지 사라지지는 않습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <SecurityViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>세 종류의 실패를 분리합니다</h3>
        <p>
          Certificate와 Finished 검증 실패는 identity 또는 transcript 합의의 실패입니다. AEAD tag 실패는 packet 변조나 wrong key,
          state mismatch 가능성을 뜻합니다. Flow-control과 final-size, frame-encoding 위반은 transport protocol error입니다.
          구현은 인증되지 않은 plaintext나 부분 frame을 application에 넘기지 않으며 error code와 connection close 범위를 명확히 잡습니다.
        </p>
        <h3>Loss recovery는 보안과 다른 책임입니다</h3>
        <p>
          RFC 9002의 ACK delay, packet threshold, PTO와 congestion window는 전송 안정성과 network fairness를 다룹니다. 암호화가
          올바르다고 loss recovery까지 공정해지지는 않습니다. ACK manipulation과 resource exhaustion, path spoofing 같은
          adversarial input은 별도 시험이 필요한 영역입니다.
        </p>
        <div
          id="paper-rfc9002"
          className="scroll-mt-24 border-l border-primary/50 pl-4"
        >
          <p className="text-xs font-bold text-primary">명세 읽기 · RFC 9002</p>
          <p>
            RFC 9002는 QUIC loss detection과 congestion control의 기준 algorithm을 정의합니다. 특정 implementation의
            throughput이나 모든 network에서 TCP보다 빠르다는 결론을 주는 benchmark 문서와는 성격이 다릅니다.
          </p>
          <CitationBlock
            source="IETF RFC 9002 — QUIC Loss Detection and Congestion Control"
            citeKey={3}
            href="https://www.rfc-editor.org/rfc/rfc9002.html"
          >
            ACK 처리, loss 판정, probe timeout과 congestion controller가 packet
            protection과 구분되는 transport 책임임을 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
