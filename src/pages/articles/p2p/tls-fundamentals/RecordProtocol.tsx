import ExplainedFormula from "@/components/ui/explained-formula";
import TLSRecordViz from "./viz/TLSRecordViz";

export default function RecordProtocol() {
  return (
    <section id="record-protocol" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Record layer는 bytes를 나누고, 순번마다 다른 nonce로 보호합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          AEAD(Authenticated Encryption with Associated Data)는 plaintext를
          숨기는 encryption과 변조를 검출하는 authentication tag를 한
          interface로 묶습니다. TLS 1.3은 handshake에서 방향별 traffic secret을
          만든 뒤, sender와 receiver가 같은 sequence number를 따라 record마다
          nonce를 바꿉니다. Header는 암호화하지 않지만 associated data로
          인증하므로 content와 함께 변조를 검출합니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <TLSRecordViz />
      </div>
      <ExplainedFormula
        question="같은 traffic key를 여러 record에 쓰면서 nonce 재사용을 어떻게 피할까요?"
        idea={
          <>
            Handshake에서 파생한 static IV에 증가하는 record sequence number를
            같은 길이로 인코딩해 XOR합니다. 방향마다 key·IV·counter가 따로
            있으므로 같은 번호라도 nonce 공간이 분리됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
N_i &= IV \oplus \operatorname{encode}_{96}(i),\\
(C_i,\tau_i) &= \operatorname{AEAD\_Encrypt}(K,N_i,P_i,A_i),\\
P_i &= \text{content}\,\|\,\text{inner type}\,\|\,\text{zero padding}.
\end{aligned}`}
        terms={[
          {
            symbol: "i",
            name: "record sequence number",
            description:
              "해당 traffic key에서 0부터 증가하는 record 순번입니다.",
          },
          {
            symbol: "IV, K",
            name: "traffic IV and key",
            description:
              "방향별 traffic secret에서 HKDF로 파생한 96-bit IV와 AEAD key입니다.",
          },
          {
            symbol: "N_i",
            name: "per-record nonce",
            description:
              "같은 key 아래에서 반복되면 안 되는 record별 nonce입니다.",
          },
          {
            symbol: "A_i",
            name: "associated data",
            description:
              "TLSCiphertext header처럼 공개되지만 tag로 무결성을 확인할 bytes입니다.",
          },
          {
            symbol: "C_i, τ_i",
            name: "ciphertext and tag",
            description:
              "암호화된 payload와 수신자가 변조를 검출할 authentication tag입니다.",
          },
        ]}
        assumptions={[
          "같은 K 아래 sequence number를 재사용하지 않고 key usage limit 전에 KeyUpdate 또는 연결 종료를 수행합니다.",
          "수신자는 tag 검증에 실패한 plaintext를 application에 전달하지 않습니다.",
          "Padding은 길이 정보를 줄일 수 있지만 packet timing과 완전한 traffic shape까지 숨기지는 않습니다.",
        ]}
        interpretation="예를 들어 i=5이면 96-bit encoding의 마지막 부분이 5가 되고 IV와 XOR한 값이 다섯 번째 nonce가 됩니다. Counter가 reset됐는데 K를 그대로 재사용하면 같은 nonce가 반복될 수 있으므로, reconnect·snapshot 복원에서 key와 counter 수명을 함께 관리해야 합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>무엇이 보이고 무엇이 숨겨지는지 구분합니다</h3>
        <p>
          TLS 1.3 protected record의 outer content type은 application_data로
          보이고 실제 inner content type은 ciphertext 안에 들어갑니다. 그러나
          record length, 전송 시각, endpoint IP 같은 metadata까지 사라지는 것은
          아닙니다. Padding은 길이 패턴을 완화하지만 bandwidth 비용이 들며,
          일정하지 않은 padding 정책은 오히려 fingerprint가 될 수도 있습니다.
        </p>
      </div>
    </section>
  );
}
