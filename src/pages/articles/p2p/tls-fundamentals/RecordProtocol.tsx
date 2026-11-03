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
          interface로 묶습니다.
        </p>
        <p>
          TLS 1.3은 handshake에서 방향별 traffic secret을
          만든 뒤 sender와 receiver가 같은 sequence number를 따라 record마다
          nonce를 바꿉니다. Header는 암호화하지 않지만 associated data로
          인증하므로 content와 함께 변조를 검출합니다.
        </p>
        <p>
          이제 같은 사례의 서버가 보내는 여섯 번째 보호 레코드를 보겠습니다. 이
          traffic key에서 순번은 0부터 시작하므로 <code>i=5</code>가 여섯
          번째입니다. AES‑GCM의 12바이트 IV에 64비트 순번 5를 왼쪽 0으로 채워
          XOR합니다.
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
N_i &= IV \oplus \operatorname{leftpad}_{ivlen}(\operatorname{uint64be}(i)),\\
E_i &= \operatorname{AEAD\!\text{-}Encrypt}(K,N_i,A_i,P_i),\\
P_i &= \text{content}\,\|\,\text{inner type}\,\|\,\text{zero padding}.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
N_i &= \underbrace{IV}_{\text{방향별 고정 IV}} \oplus \underbrace{\operatorname{leftpad}_{ivlen}(\operatorname{uint64be}(i))}_{\text{64bit 순번을 IV 길이에 맞춤}},\\
E_i &= \operatorname{AEAD\!\text{-}Encrypt}(K,N_i,\underbrace{A_i}_{\text{인증만 하는 header}},\underbrace{P_i}_{\text{숨길 내용}}),\\
P_i &= \underbrace{\text{content}\,\|\,\text{inner type}\,\|\,\text{zero padding}}_{\text{진짜 type은 암호문 안에}}.
\end{aligned}`}
        operations={[
          {
            expression: String.raw`IV \oplus \operatorname{leftpad}_{ivlen}(\operatorname{uint64be}(i))`,
            annotation: [
              "순번은 항상 64-bit network byte order",
              "왼쪽 0으로 AEAD IV 길이에 맞춘 뒤 XOR",
              "이 사례의 12-byte IV와 i=5는 여섯 번째 nonce",
            ],
          },
          {
            expression: String.raw`\operatorname{AEAD\!\text{-}Encrypt}(K,N_i,A_i,P_i)`,
            annotation: [
              "같은 K라도 N_i가 record마다 달라짐",
              "암호문과 인증 태그를 합친 E_i 생성",
              "header A_i는 공개되지만 함께 인증",
            ],
          },
          {
            expression: String.raw`\text{content}\,\|\,\text{inner type}\,\|\,\text{zero padding}`,
            annotation: [
              "outer type은 application_data로 보이고",
              "실제 content type은 plaintext 끝에 숨김",
              "padding은 길이 패턴만 완화",
            ],
          },
        ]}
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
              "방향별 traffic secret에서 HKDF로 파생한 IV와 AEAD key입니다. 이 사례의 AES-GCM IV는 12바이트입니다.",
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
            symbol: "E_i",
            name: "AEAD encrypted record",
            description:
              "암호문과 AEAD 확장분인 인증 태그를 포함한 encrypted_record입니다.",
          },
        ]}
        assumptions={[
          "같은 K 아래 sequence number를 재사용하지 않고 key usage limit 전에 KeyUpdate 또는 연결 종료를 수행합니다.",
          "수신자는 tag 검증에 실패한 plaintext를 application에 전달하지 않습니다.",
          "Padding은 길이 정보를 줄일 수 있지만 packet timing과 완전한 traffic shape까지 숨기지는 않습니다.",
        ]}
        interpretation="이 사례에서 i=5는 여섯 번째 레코드입니다. 64-bit 값 5를 12바이트로 왼쪽 0 채움한 뒤 서버 쓰기 IV와 XOR합니다. 키가 바뀌면 순번은 다시 0이 되지만 IV와 키도 함께 바뀌어야 합니다. 스냅샷 복원처럼 순번만 되돌리고 같은 키를 재사용하면 nonce가 겹칠 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>무엇이 보이고 무엇이 숨겨지는지 구분합니다</h3>
        <p>
          TLS 1.3 protected record의 outer content type은 application_data로
          보이고 실제 inner content type은 ciphertext 안에 들어갑니다. 그래도
          record length와 전송 시각, endpoint IP 같은 metadata는 그대로
          남습니다.
        </p>
        <p>
          Padding은 길이 패턴을 완화하는 대신 bandwidth 비용이 듭니다.
          일정하지 않은 padding 정책은 오히려 fingerprint가 될 수도 있습니다.
        </p>
      </div>
    </section>
  );
}
