import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

export default function SignVerify({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="sign-verify" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Verify는 signature를 복호화하지 않고 두 scalar 관계가 같은지 pairing으로
        비교한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Secret key <code>sk</code>로 public key <code>PK=sk·G₁</code>를
          만들고, message bytes를 G2 point로 옮긴
          <code>H(m)</code>에 같은 scalar를 곱해 signature{" "}
          <code>σ=sk·H(m)</code>를 만듭니다. Pairing의 bilinearity 덕분에
          verifier는 secret scalar 없이 두 관계가 같은지 비교합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Public key와 signature가 같은 secret key로 만들어졌는지 어떻게 확인할까요?"
        idea={
          <>
            Pairing은 한쪽 point의 scalar multiplication을 target group의
            exponent로 옮깁니다. 그래서 generator와 signature의 관계를 public
            key와 message point의 관계와 비교할 수 있습니다.
          </>
        }
        formula={String.raw`\begin{aligned}PK&=skG_1\\\sigma&=skH(m)\\e(G_1,\sigma)&=e(PK,H(m))\end{aligned}`}
        terms={[
          {
            symbol: "sk",
            name: "Secret scalar",
            description: "Validator만 보관하는 nonzero scalar입니다.",
          },
          {
            symbol: "G_1",
            name: "G1 generator",
            description: "Public key subgroup의 공개 기준 point입니다.",
          },
          {
            symbol: "H(m)",
            name: "Hash-to-curve",
            description:
              "DST를 적용해 signing-root bytes를 G2 subgroup point로 옮긴 값입니다.",
          },
          {
            symbol: "e",
            name: "Pairing",
            description:
              "G1×G2 입력의 scalar 관계를 GT에서 비교하는 bilinear map입니다.",
          },
        ]}
        assumptions={[
          "PK·signature는 canonical decode, curve·subgroup·non-identity 검사를 통과했습니다.",
          "H는 Ethereum이 지정한 BLS ciphersuite와 DST를 사용합니다.",
          "m은 SSZ object root와 올바른 consensus domain으로 만든 signing root입니다.",
        ]}
        interpretation="Equality가 참이면 주어진 key/message/signature 관계가 유효하다는 뜻입니다. Validator가 protocol상 그 duty에 서명할 권한이 있었는지, double-sign인지, message 내용이 valid한지는 별도 검사입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Signing root가 replay boundary를 만듭니다</h3>
        <p>
          Ethereum의 signing data는 object root 32 bytes와 domain 32 bytes를 SSZ
          container로 묶어 다시 root를 계산합니다. Domain은 duty type, fork
          version과 genesis validators root에서 만들어지므로 같은 object라도
          proposer·attester 목적 또는 다른 chain에서 서명이 재사용되지 않습니다.
          단, 잘못된 fork epoch로 domain을 계산하면 cryptography는 정상이어도
          protocol signature는 reject됩니다.
        </p>
        <h3>같은 message와 다른 message의 API를 섞지 않습니다</h3>
        <p>
          여러 public key가 정확히 같은 <code>m</code>에 서명했다면 public key를
          더한 뒤 aggregate signature와 비교하는 FastAggregateVerify를 사용할 수
          있습니다. Attestation data root나 domain이 하나라도 다르면 각{" "}
          <code>(PKᵢ,mᵢ)</code>
          pair를 보존하는 AggregateVerify 계열이 필요합니다. “같은 slot”은 같은
          message라는 뜻이 아닙니다.
        </p>
        <h3>Rogue-key 반례</h3>
        <p>
          공격자가 다른 public key를 본 뒤 자신의 key를 그 합을 상쇄하도록
          고르면 실제 secret을 모르는 key까지 aggregate에 포함된 것처럼 꾸밀 수
          있습니다. Proof-of-Possession(PoP)은 key 등록 때 그 public key에
          대응하는 secret을 안다는 별도 proof를 검증합니다. PoP 전제를 확인하지
          않은 public-key aggregation에 FastAggregateVerify를 적용하지 않습니다.
        </p>
      </div>
    </section>
  );
}
