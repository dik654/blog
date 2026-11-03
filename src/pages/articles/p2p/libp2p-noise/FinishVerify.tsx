import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";

export default function FinishVerify() {
  return (
    <section id="finish-verify" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Handshake 완료와 안전한 connection 인계는 같은 검증 묶음입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Implementation은 Noise state가 complete라는 flag만 보고 connection을 넘기면 안
          됩니다. Remote static key 존재, payload protobuf decode, identity public key와
          signature 존재 여부를 먼저 확인합니다.
        </p>
        <p>
          이어서 binding signature를 검증하고 identity public key에서 observed PeerId를
          유도합니다. 이 검사가 끝나야 <code>(PeerId, secure I/O)</code>를 반환합니다.
          Outbound의 target Bob 비교와 inbound admission은 이 output을 받은 상위 owner가
          맡습니다.
        </p>
        <p>
          Transport phase에서는 각 message를 2-byte big-endian length와 ciphertext로
          framing합니다. 최대 message size와 AEAD tag도 검사합니다.
        </p>
        <p>
          Truncated length, oversized frame, invalid tag, counter exhaustion과 unexpected
          EOF는 fail-closed로 connection을 끝냅니다. Noise는 encrypted record의
          내용과 무결성을 보호하지만 packet timing·length·IP endpoint를 숨기지 않습니다.
        </p>
        <h3>Release gate</h3>
        <ul>
          <li>정상 XX trace에서 양쪽 PeerId와 송수신 key 방향이 서로 대응하는지 확인합니다.</li>
          <li>Static key 한 byte, signature 한 byte와 expected PeerId를 각각 바꿔 모두 거부되는지 확인합니다.</li>
          <li>Length 0·최댓값 초과·truncation·tag failure 뒤 plaintext가 상위로 전달되지 않는지 확인합니다.</li>
          <li>Handshake timeout과 취소 뒤 socket, task와 key material이 남지 않는지 관측합니다.</li>
        </ul>
      </div>

      <AlgorithmBlock
        title="Noise finish가 secure I/O를 release하는 순서"
        input={[
          "완료된 XX HandshakeState",
          "remote identity public key와 static-key signature payload",
          "remote Noise static public key",
        ]}
        steps={[
          {
            code: "convert HandshakeState to TransportState; require remote static key",
            note: "XX가 끝났다는 flag만으로 remote static key 누락을 허용하지 않습니다.",
          },
          {
            code: "decode remote identity public key and signature",
            note: "Payload field 누락·protobuf decode 오류를 authentication 실패로 처리합니다.",
          },
          {
            code: "verify signature(prefix || remote_noise_static)",
            note: "장기 identity가 정확한 이번 channel static key를 승인했는지 검사합니다.",
          },
          {
            code: "derive observed PeerId from verified identity key",
            note: "Noise output은 실제 PeerId와 방향별 CipherState를 가진 framed I/O입니다.",
          },
          {
            code: "upper dial owner compares observed PeerId with target Bob",
            note: "Target mismatch면 유효한 다른 peer의 채널이므로 요청한 connection으로 release하지 않습니다.",
          },
        ]}
        output="Observed PeerId + authenticated framed I/O 또는 fail-closed authentication/I/O error"
      />

      <CalculationWalkthrough
        title="2-byte frame length가 만드는 최대치 장부"
        question="왜 source의 application frame 상한은 65,535 bytes보다 1,024 bytes 작을까요?"
        scope="rust-libp2p v0.57.1의 고정 source 값입니다. MAX_NOISE_MSG_LEN=65,535, 암호화 buffer 여유 EXTRA_ENCRYPT_SPACE=1,024입니다."
        steps={[
          {
            label: "2-byte unsigned length의 표현 범위",
            expression: "2^16 - 1",
            result: "65,535 bytes",
            reason: "Wire prefix가 뒤따르는 Noise ciphertext 길이를 big-endian u16으로 기록합니다.",
          },
          {
            label: "암호화 결과가 늘어날 여유를 예약",
            expression: "65,535 - 1,024",
            result: "64,511 bytes",
            reason: "Implementation은 tag와 key material을 포함한 encryption output을 위해 보수적인 buffer 여유를 둡니다.",
          },
          {
            label: "Application write 한 frame의 상한",
            expression: "MAX_FRAME_LEN = 64,511",
            result: "초과 bytes는 다음 frame",
            reason: "큰 write를 무제한 한 frame으로 만들지 않아 u16 wire limit와 allocation을 지킵니다.",
          },
        ]}
        conclusion="65,535는 ciphertext message의 wire 상한이고 64,511은 이 implementation이 한 application frame에 넣는 cleartext 상한입니다. 두 숫자는 같은 대상을 세지 않습니다."
        caveats={[
          "1,024-byte 여유는 이 source revision의 구현 선택이며 Noise specification의 보편 상수가 아닙니다.",
          "Incomplete frame은 더 읽을 bytes를 기다리지만 별도 handshake·read deadline이 없으면 slowloris 방어가 되지 않습니다.",
          "Length가 맞아도 AEAD tag 검증에 실패하면 plaintext를 반환하지 않습니다.",
        ]}
      />

      <div id="paper-rust-libp2p-noise-0571" className="prose prose-neutral max-w-none scroll-mt-24 border-l border-primary/50 pl-4 dark:prose-invert">
        <p className="text-xs font-bold text-primary">구현 정본 · rust-libp2p v0.57.1 / libp2p-noise 0.47.0</p>
        <CitationBlock source="rust-libp2p v0.57.1 — noise protocol · handshake · framed I/O" citeKey={3} href="https://github.com/libp2p/rust-libp2p/tree/2fed78f/transports/noise/src">
          Static-key domain signature, observed PeerId output, 65,535/64,511 frame 경계와 fail-closed source를 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
