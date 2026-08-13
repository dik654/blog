import { CitationBlock } from "@/components/ui/citation";

export default function HandshakeFlow() {
  return (
    <section id="handshake-flow" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">XX의 세 메시지는 key secrecy와 authentication을 단계적으로 늘립니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          첫 메시지 <code>→ e</code>는 initiator의 ephemeral public key만 보내므로 아직
          상대를 인증하지 않습니다. 두 번째 <code>← e, ee, s, es</code>에서 responder는
          자신의 ephemeral key를 보내고, ephemeral–ephemeral DH 결과를 섞은 뒤 static
          key와 identity payload를 암호화해 보냅니다. Initiator는 이를 복호화하고
          responder의 binding을 검사할 수 있습니다.
        </p>
        <p>
          세 번째 <code>→ s, se</code>에서는 initiator static key와 identity payload가
          보호된 상태로 전달됩니다. 양쪽이 모든 token과 payload를 처리하면 handshake
          hash와 chaining key에서 두 방향 CipherState를 나눕니다. 메시지 2 payload에는
          forward secrecy가 있어도 sender가 아직 responder를 인증하기 전이라는 spec의
          경계가 있으므로 민감한 application early data를 임의로 싣지 않습니다.
        </p>
        <h3>Token을 읽는 최소 규칙</h3>
        <ul>
          <li><code>e</code>와 <code>s</code>는 각각 ephemeral·static public key 전송입니다.</li>
          <li><code>ee</code>, <code>es</code>, <code>se</code>는 어느 private/public key 쌍으로 DH를 계산할지 나타냅니다.</li>
          <li>각 DH output은 handshake state에 순서대로 섞이므로 message 순서나 token을 바꾸면 같은 key가 나오지 않습니다.</li>
        </ul>
        <div id="paper-noise-framework" className="scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">원 명세 읽기 · Noise Protocol Framework</p>
          <p>
            Noise Framework는 token language, SymmetricState와 HandshakeState의 처리
            규칙을 정의합니다. libp2p의 identity payload와 protocol ID는 Framework가
            아니라 noise-libp2p profile이 추가한 계약입니다.
          </p>
          <CitationBlock source="Trevor Perrin — The Noise Protocol Framework, Revision 34" citeKey={2} href="https://noiseprotocol.org/noise.html">
            XX token sequence와 DH result를 handshake state에 섞어 transport CipherState로 전환하는 일반 규칙을 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
