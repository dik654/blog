import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">키·nonce·token은 서로 다른 randomness 계약을 가진다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Private key는 높은 entropy와 장기 secrecy가 필요하고, AEAD nonce는 scheme에 따라 비밀일 필요는 없어도 같은 key 아래 uniqueness가 핵심일 수 있습니다. Signature nonce는 반복·편향·노출이 private key 방정식으로 이어질 수 있으며, password reset token은 online guess budget과 만료·single use까지 포함합니다. 따라서 모든 필드에 같은 <code>randomBytes(32)</code>를 넣고 끝내지 않고 domain·길이·중복 정책·저장과 crash recovery를 기록합니다.
        </p>
      </div>
      <ExplainedFormula
        question="같은 ECDSA nonce k로 두 메시지를 서명하면 private key d를 어떻게 복구할까요?"
        idea="두 서명의 s 식을 빼면 private-key 항은 사라지지 않고 nonce inverse가 공통이므로 먼저 k를 얻습니다. 이후 공개된 r,h,s와 k로 d를 직접 풉니다."
        formula={String.raw`k=(h_1-h_2)(s_1-s_2)^{-1}\bmod n,\qquad d=(s_1k-h_1)r^{-1}\bmod n`}
        annotatedFormula={String.raw`k=\underbrace{(h_1-h_2)(s_1-s_2)^{-1}\bmod n,\qquad d=(s_1k-h_1)r^{-1}\bmod n}_{\text{reused nonce 계산}}`}
        operations={[
          { expression: String.raw`(h_1-h_2)(s_1-s_2)^{-1}\bmod n,\qquad d=(s_1k-h_1)r^{-1}\bmod n`, annotation: ["reused nonce이(가) 식의 결과에 기여하는 방식을","계산합니다.","두 서명의 s 식을 빼면 private-key 항은 사라지지","않고 nonce inverse가 공통이므로 먼저 k를"] },
        ]}
        terms={[
          { symbol: "h_1,h_2", name: "message digests", description: "서명된 서로 다른 메시지의 공개 hash scalars입니다." },
          { symbol: "r,s_1,s_2", name: "signature values", description: "같은 nonce 때문에 r이 같아진 두 공개 서명입니다." },
          { symbol: "k", name: "reused nonce", description: "첫 식으로 복구되는 비밀 scalar입니다." },
          { symbol: "d", name: "private key", description: "Nonce를 안 뒤 두 번째 식으로 복구되는 signing key입니다." },
        ]}
        assumptions={["두 서명이 같은 curve order n·private key·nonce를 사용하고 필요한 차이의 inverse가 존재합니다.", "실제 parsing에서는 low-s normalization·hash-to-scalar·signature convention을 scheme 규격대로 적용합니다."]}
        interpretation="Nonce가 완전히 같지 않아도 일부 bit bias나 correlation이 많은 서명에 누적되면 lattice attack이 가능할 수 있습니다. 그래서 검증된 deterministic nonce scheme이나 OS CSPRNG를 사용하고 자체 counter/시간 seed를 만들지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>운영 release gate</h3>
        <p>
          동일 image로 부팅한 VM·container, fork 직후 parent/child, snapshot restore, entropy API 실패, short read, crash 뒤 counter rollback, state disclosure 전후 reseed를 fixture로 만듭니다. 각 run에는 OS/kernel·runtime·library version, API, boot/fork/snapshot identity, request length와 failure policy를 남깁니다. Output이 서로 다르다는 관찰은 필요한 smoke test일 뿐 security proof가 아니며, known-answer vector·state transition test·duplicate detector와 protocol-level negative test를 함께 통과한 뒤 throughput을 봅니다.
        </p>
        <p>
          OS API가 unavailable이면 약한 fallback으로 내려가지 않고 secret 생성 자체를 중단합니다. Test 환경의 fixed seed는 재현성에는 유용하지만 production secret path와 type/API를 분리해야 하며, log·core dump·telemetry에 state나 raw entropy를 남기지 않습니다.
        </p>
      </div>
      <div id="paper-heninger-weak-keys" className="scroll-mt-24">
        <CitationBlock source="Heninger et al. · Mining Your Ps and Qs (USENIX Security 2012)" href="https://www.usenix.org/conference/usenixsecurity12/technical-sessions/presentation/heninger" citeKey={4}>
          문제: 실제 TLS·SSH device의 faulty random generation이 공개키에 어느 정도 나타나는지 측정합니다. 기여: Internet-scale key corpus에서 shared RSA factors와 DSA nonce 문제를 찾아 private key 복구 가능성을 실증했습니다. 전제: 당시 관측 corpus·protocol·device population과 분석 방법에 한정합니다. 근거 범위: weak randomness의 실세계 영향입니다. 비주장: 오늘날 모든 OS RNG의 실패율이나 특정 entropy source의 보편적 품질을 말하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
