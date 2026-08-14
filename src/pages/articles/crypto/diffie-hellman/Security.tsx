import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        배포 경계: validate → authenticate → derive → confirm → erase
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>DLP, CDH, DDH를 한 가정으로 부르지 않는다</h3>
        <p>
          DLP를 풀 수 있으면 secret exponent를 얻어 CDH도 풀 수 있습니다. 그러나
          “DLP가 어렵다”는 사실만으로 CDH가 어렵다는 역방향 결론은 나오지
          않습니다. DDH는 (gᵃ,gᵇ,gᵃᵇ) tuple과 random tuple의 구별 문제이며
          group에 따라 CDH는 어렵지만 DDH는 쉬운 gap이 있을 수 있습니다. Protocol
          security claim은 <Link to="/crypto/discrete-log#applications">가정 정본</Link>의
          정확한 문제를 참조해야 합니다.
        </p>
      </div>

      <div id="authenticated-transcript" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>MITM은 DH 등식을 깨지 않고 두 세션을 만든다</h3>
        <p>
          Mallory는 Alice의 A를 Bob에게 전달하지 않고 M₁을 보내고, Bob의 B 대신
          M₂를 Alice에게 보냅니다. Alice–Mallory와 Mallory–Bob은 각각 올바른 DH
          key를 계산하므로 단순 key confirmation만으로 신원은 생기지 않습니다.
          인증서는 public key와 identity를 연결하고 signature 또는 PSK MAC은 role,
          algorithm negotiation, ephemeral A/B를 포함한 transcript를 인증해야
          downgrade와 unknown-key-share를 막을 수 있습니다.
        </p>
      </div>

      <div id="kdf-key-schedule" className="scroll-mt-24">
        <ExplainedFormula
          question="Raw DH output에서 방향과 용도가 분리된 session key를 어떻게 만들까요?"
          idea="Extract가 raw shared material을 고정 길이 pseudorandom key로 모으고, Expand가 transcript hash와 label을 info에 넣어 client/server·handshake/application key를 서로 다른 domain으로 만듭니다."
          formula={String.raw`\operatorname{PRK}=\operatorname{HKDF\!\!-Extract}(salt,Z),\qquad K_{role,purpose}=\operatorname{HKDF\!\!-Expand}(\operatorname{PRK},\,label\parallel H(transcript),\,L)`}
          terms={[
            { symbol: "Z", name: "raw DH output", description: "검증된 peer public value와 local secret에서 얻은 input keying material입니다." },
            { symbol: "salt", name: "extract salt", description: "Protocol schedule이 정한 optional non-secret salt입니다." },
            { symbol: "label", name: "domain label", description: "Direction, phase와 algorithm context를 분리합니다." },
            { symbol: "H(transcript)", name: "transcript digest", description: "Identity·roles·parameter·A/B·negotiation을 같은 session에 결속합니다." },
          ]}
          assumptions={[
            "HKDF hash, salt rule, labels, transcript serialization과 output length를 protocol version으로 고정합니다.",
            "HKDF는 unauthenticated transcript를 인증하거나 weak group validation을 고쳐 주지 않습니다.",
          ]}
          interpretation="같은 Z라도 label이 client→server와 server→client이면 다른 key가 나와 reflection을 줄입니다. 반대로 info가 빈 두 application이 같은 Z를 재사용하면 key/domain collision 위험이 생깁니다."
        />
      </div>

      <div id="ephemeral-lifecycle" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Forward secrecy는 ephemeral secret을 실제로 폐기할 때만 성립한다</h3>
        <p>
          매 session 새 ephemeral a,b를 만들고 인증용 long-term key와 분리하며,
          handshake 완료·실패 뒤 secret과 intermediate를 지웁니다. 훗날 long-term
          signing key가 노출돼도 과거 ephemeral secret과 raw DH output이 남아 있지
          않으면 recorded traffic의 과거 key 복원을 막을 수 있습니다. VM snapshot,
          forked RNG state, crash dump, session ticket와 application plaintext 보관은
          이 결론의 별도 반례입니다.
        </p>
      </div>

      <div id="dh-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate와 선택 기준</h3>
        <p>
          새 DH path는 protocol/library version, curve/group, role, credential,
          transcript schema와 KDF labels를 receipt에 고정합니다. Official positive
          vectors와 malformed length, noncanonical input policy, X25519 all-zero output,
          wrong group/subgroup, reflection, swapped role, downgrade, replayed ephemeral,
          bad signature/MAC, key-confirmation failure, RNG clone, crash/restart를 검사합니다.
          Typed outcome과 derived-key parity가 맞은 뒤 latency와 allocation을 봅니다.
          새 protocol을 직접 조합하기보다 TLS 1.3이나 검토된 Noise pattern처럼
          인증과 schedule이 정의된 protocol을 우선합니다.
        </p>
      </div>

      <div id="paper-rfc5869-hkdf" className="scroll-mt-24">
        <CitationBlock source="RFC 5869 · HKDF" href="https://www.rfc-editor.org/rfc/rfc5869.html" citeKey={3}>
          문제: DH output처럼 완전히 uniform하지 않을 수 있는 input keying
          material에서 용도별 strong keys를 만듭니다. 기여: HMAC 기반
          extract-then-expand construction, salt/info 의미와 test vectors를
          제공합니다. 전제: 선택 hash와 protocol-specific salt/info/output length를
          고정합니다. 근거 범위: HKDF construction입니다. 비주장: peer identity,
          transcript authenticity, entropy 생성과 secret erasure를 대신하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-nist-80056a" className="scroll-mt-24">
        <CitationBlock source="NIST SP 800-56A Rev. 3 · Pair-Wise Key Establishment" href="https://doi.org/10.6028/NIST.SP.800-56Ar3" citeKey={4}>
          문제: finite-field와 elliptic-curve discrete-log 기반 pair-wise key
          establishment scheme을 검증 가능한 절차로 정합니다. 기여: domain/key
          validation, scheme variants, key derivation와 confirmation 요구를
          제공합니다. 전제: Rev. 3의 approved parameter와 application compliance
          boundary입니다. 근거 범위: 이 표준의 key-establishment scheme입니다.
          비주장: RFC 7748의 모든 acceptance rule이나 임의 application protocol
          설계를 대체하지 않습니다. NIST는 2026-01-06 update 결정을 알렸으므로
          배포 시 revision 상태를 다시 확인합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
