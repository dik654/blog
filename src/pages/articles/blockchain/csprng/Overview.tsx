import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">CSPRNG는 작은 비밀 상태로 예측 불가능한 긴 출력을 만든다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          암호키·nonce·session token은 “무작위처럼 보이는 숫자”가 아니라 공격자가 관찰한 정보와 계산 예산으로 다음 값을 맞히기 어려운 숫자여야 합니다. Cryptographically secure pseudorandom number generator(CSPRNG)는 검증된 entropy source로 내부 state를 초기화하고, state를 공개하지 않은 채 많은 output bit를 생성하며, output 뒤 state를 갱신하고 필요할 때 새 entropy로 reseed합니다.
        </p>
        <p>
          물리 noise를 매 요청마다 직접 읽는 장치와 deterministic random bit generator(DRBG)는 역할이 다릅니다. Noise source는 예측 불가능성을 공급하고, DRBG는 그 제한된 entropy를 빠르고 일관된 API로 확장합니다. 애플리케이션은 이 둘을 직접 조립하기보다 운영체제의 안전한 random API를 사용하고, early boot·VM clone·snapshot rollback·fork 뒤 state 중복 같은 수명 문제를 검증해야 합니다.
        </p>
      </div>
      <ContentBoundary article="csprng" />
      <CryptoFoundationsViz mode="csprng-lifecycle" />
      <ExplainedFormula
        question="출력 일부를 본 공격자가 다음 bit를 얼마나 잘 맞힐 수 있어야 CSPRNG가 깨졌다고 할까요?"
        idea="예측기는 이전 output prefix와 공개 정보를 받고 다음 bit를 맞힙니다. 이상적인 random bit의 성공률 1/2보다 non-negligible하게 높은 advantage를 내면 generator의 계산적 예측 불가능성이 깨집니다."
        formula={String.raw`\operatorname{Adv}_{\mathrm{next}}(A)=\left|\Pr[A(Y_1,\ldots,Y_k)=Y_{k+1}]-\frac12\right|`}
        annotatedFormula={String.raw`\operatorname{Adv}_{\mathrm{next}}(A)=\underbrace{\left|\Pr[A(Y_1,\ldots,Y_k)=Y_{k+1}]-\frac12\right|}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\left|\Pr[A(Y_1,\ldots,Y_k)=Y_{k+1}]-\frac12\right|`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","예측기는 이전 output prefix와 공개 정보를 받고","다음 bit를 맞힙니다."] },
        ]}
        terms={[
          { symbol: "A", name: "adversarial predictor", description: "정해진 시간·메모리 예산 안에서 실행되는 공격 알고리즘입니다." },
          { symbol: "Y_1,\\ldots,Y_k", name: "observed prefix", description: "공격자가 이미 본 generator output bits입니다." },
          { symbol: "Y_{k+1}", name: "next bit", description: "공격자가 아직 보지 못한 예측 대상입니다." },
          { symbol: String.raw`\operatorname{Adv}`, name: "prediction advantage", description: "동전 맞히기 1/2보다 더 잘 맞힌 정도입니다." },
        ]}
        assumptions={["Seed와 내부 state는 충분한 min-entropy를 갖고 공격자에게 직접 노출되지 않습니다.", "Security parameter가 커질 때 허용 공격 모델과 negligible의 의미를 함께 정합니다."]}
        interpretation="표본의 0과 1 비율이 절반에 가깝다는 통계 검사는 이 advantage를 제한하지 않습니다. 고정 key로 counter를 암호화한 출력도 고르게 보일 수 있지만 key가 노출되면 완전히 예측됩니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>State compromise 전후를 분리합니다</h3>
        <p>
          현재 state가 유출됐을 때 과거 output을 되돌리기 어렵게 하는 성질은 backtracking resistance로 부르는 편이 명확합니다. 유출 뒤 새 entropy를 reseed하고 나서 미래 output이 다시 안전해지는 성질은 prediction resistance 또는 recovery로 구분합니다. State만 계속 deterministic하게 갱신하면 공격자가 한 번 읽은 뒤 미래를 계속 계산할 수 있으므로, recovery는 외부에서 새로 들어온 공격자 미관측 entropy가 있어야 합니다.
        </p>
      </div>
      <div id="paper-nist-drbg" className="scroll-mt-24">
        <CitationBlock source="NIST SP 800-90A Rev.1 · DRBG mechanisms" href="https://csrc.nist.gov/pubs/sp/800/90/a/r1/final" citeKey={1}>
          문제: Deterministic random bit generation의 instantiate·generate·reseed 상태 전이를 표준화합니다. 기여: Hash_DRBG·HMAC_DRBG·CTR_DRBG의 state, request limit와 testable algorithm을 정의합니다. 전제: 승인된 entropy input과 정확한 security strength·implementation을 사용합니다. 근거 범위: 지정 DRBG mechanism입니다. 비주장: entropy source 품질·OS lifecycle·application nonce policy까지 자동 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-rfc4086-randomness" className="scroll-mt-24">
        <CitationBlock source="RFC 4086 · Randomness Requirements for Security" href="https://www.rfc-editor.org/rfc/rfc4086.html" citeKey={2}>
          문제: 통계적 난수와 공격자가 추측하기 어려운 secret randomness를 혼동하는 구현 실패를 다룹니다. 기여: entropy source·mixing·seed·guessing space에 대한 실무 지침과 반례를 제공합니다. 전제: 공격자가 아는 환경 정보와 source 조작 가능성을 모델링합니다. 근거 범위: 보안 randomness의 설계 지침입니다. 비주장: 특정 현대 OS RNG 구현이나 인증 상태를 규정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
