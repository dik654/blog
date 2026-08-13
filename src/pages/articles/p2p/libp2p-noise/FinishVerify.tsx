export default function FinishVerify() {
  return (
    <section id="finish-verify" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Handshake 완료와 안전한 connection 인계는 같은 검증 묶음입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Implementation은 Noise state가 complete라는 flag만 보고 connection을 넘기면 안
          됩니다. Remote static key 존재, payload protobuf decode, identity public key와
          signature 존재, binding signature 검증, derived PeerId와 expected PeerId 비교가
          모두 끝나야 <code>(PeerId, secure I/O)</code>를 반환합니다. Expected PeerId가
          없는 inbound에서도 인증된 실제 PeerId를 상위 admission policy에 전달해야 합니다.
        </p>
        <p>
          Transport phase에서는 각 message를 2-byte big-endian length와 ciphertext로
          framing하고, 최대 message size와 AEAD tag를 검사합니다. Truncated length,
          oversized frame, invalid tag, counter exhaustion과 unexpected EOF는 fail-closed로
          connection을 끝냅니다. Noise는 encrypted record의 내용과 무결성을 보호하지만
          packet timing·length·IP endpoint를 숨기지 않습니다.
        </p>
        <h3>Release gate</h3>
        <ul>
          <li>정상 XX trace에서 양쪽 PeerId와 송수신 key 방향이 서로 대응하는지 확인합니다.</li>
          <li>Static key 한 byte, signature 한 byte와 expected PeerId를 각각 바꿔 모두 거부되는지 확인합니다.</li>
          <li>Length 0·최댓값 초과·truncation·tag failure 뒤 plaintext가 상위로 전달되지 않는지 확인합니다.</li>
          <li>Handshake timeout과 취소 뒤 socket, task와 key material이 남지 않는지 관측합니다.</li>
        </ul>
      </div>
    </section>
  );
}
