import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function Ed25519() {
  return (
    <section id="ed25519" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Ed25519: deterministic nonce만으로 안전 조건이 끝나지 않는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Ed25519는 Edwards25519 curve, SHA-512, 32-byte public key와 64-byte signature encoding을 고정한 EdDSA instance입니다. Secret seed를 hash해 scalar와 nonce prefix를 나누므로 서명 시 외부 RNG 실패로 nonce가 우연히 반복되는 위험을 줄입니다. 그러나 최초 seed의 entropy, secret-dependent timing, fault injection, point decoding, S 범위와 cofactor 처리는 여전히 구현 계약입니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="ed25519-transcript" />
      <ExplainedFormula
        question="Ed25519 서명과 검증은 어떤 값을 정확히 묶을까요?"
        idea="Secret seed hash의 앞부분에서 signing scalar a를, 뒷부분에서 nonce prefix를 얻습니다. Nonce r과 challenge k는 서로 다른 transcript를 hash하고, verifier는 encoded point와 scalar를 strict parse한 뒤 group equation을 확인합니다."
        formula={String.raw`r=H(\mathsf{prefix}\Vert M)\bmod L,\quad R=[r]B,\quad k=H(R\Vert A\Vert M)\bmod L,\quad S=(r+ka)\bmod L`}
        annotatedFormula={String.raw`r=\underbrace{H(\mathsf{prefix}\Vert M)\bmod L,\quad R=[r]B,\quad k=H(R\Vert A\Vert M)\bmod L,\quad S=(r+ka)\bmod L}_{\text{nonce prefix 계산}}`}
        operations={[
          { expression: String.raw`H(\mathsf{prefix}\Vert M)\bmod L,\quad R=[r]B,\quad k=H(R\Vert A\Vert M)\bmod L,\quad S=(r+ka)\bmod L`, annotation: ["nonce prefix이(가) 식의 결과에 기여하는 방식을","계산합니다.","Secret seed hash의 앞부분에서 signing","scalar a를, 뒷부분에서 nonce prefix를"] },
        ]}
        terms={[
          { symbol: "a,A=[a]B", name: "signing scalar·public key", description: "Seed hash와 pruning으로 만든 scalar와 encoded Edwards point입니다." },
          { symbol: String.raw`\mathsf{prefix}`, name: "nonce prefix", description: "Secret seed hash의 별도 절반으로, message-dependent nonce를 만듭니다." },
          { symbol: "L", name: "base-point order", description: "Scalar arithmetic이 이루어지는 prime order입니다." },
          { symbol: "R,S", name: "signature fields", description: "32-byte encoded point와 canonical scalar로 합계 64 bytes입니다." },
        ]}
        assumptions={["Ed25519·Ed25519ctx·Ed25519ph 중 variant와 context 규칙을 signer와 verifier가 동일하게 고정합니다.", "RFC 8032의 encoding·range·point validation policy와 최신 library API를 따릅니다."]}
        interpretation="같은 key와 같은 message는 기본 Ed25519에서 같은 signature를 만듭니다. 이는 재현성을 주지만 message가 반복됐다는 정보도 드러냅니다. 또한 deterministic nonce는 seed가 약하거나 fault로 prefix가 새는 문제를 해결하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Schnorr와 비교할 때 algorithm family와 instance를 구분합니다</h3>
        <p>
          두 방식 모두 commitment–challenge–response의 선형 group equation을 쓰지만 BIP 340 Schnorr와 Ed25519는 curve, point
          encoding, challenge transcript, nonce derivation, 부호 convention과 cofactor가 다릅니다. 한 scheme의 signature
          bytes를 다른 verifier에 넣거나 “수학식이 비슷하다”는 이유로 parsing을 공유하면 malleability·small-order point·cross-protocol
          문제가 생길 수 있습니다. 실무에서는 검증된 library, RFC test vector, malformed encoding corpus와 protocol-level domain
          separation을 함께 사용합니다.
        </p>
      </div>
      <div id="paper-rfc8032-ed25519" className="scroll-mt-24">
        <CitationBlock source="RFC 8032 · Ed25519 algorithm and test vectors" href="https://www.rfc-editor.org/rfc/rfc8032.html#section-5.1" citeKey={4}>
          문제: Ed25519 instance의 field·curve·encoding·sign/verify 절차를 정확히 맞춥니다. 기여: modular arithmetic, decoding, key generation, signing, verification과 test vectors를 제공합니다. 전제: RFC의 variant와 byte order를 그대로 따릅니다. 근거 범위: algorithm interoperability와 명시된 security considerations입니다. 비주장: 특정 language binding의 constant-time 동작·HSM 보안·protocol authorization을 대신 입증하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
