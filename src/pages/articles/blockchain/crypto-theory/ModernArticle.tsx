import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ModernCryptoTheoryViz from "./viz/ModernCryptoTheoryViz";

export default function ModernCryptoTheoryArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            Cryptography · claim before algorithm
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            암호 primitive는 이름이 아니라 입력·정확성·공격 game·가정·실패
            확률로 읽는다
          </h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          고정 사례는 Alice가 message <code>m</code>을 authenticated
          encryption으로 보내고 Bob이 복호화하는 상황입니다. Correctness는 같은
          key·nonce·associated data에서 Bob이 m을 얻는다는 뜻입니다.
          Confidentiality game, ciphertext integrity game, nonce uniqueness와
          key secrecy는 각각 별도 조건입니다. 복호화가 된다는 사실만으로
          공격자가 정보를 못 얻거나 ciphertext를 못 위조한다는 결론은 나오지
          않습니다.
        </p>
        <p>
          이 글은 AES·ECDSA·BLS 같은 개별 알고리즘의 정본을 다시 만들지
          않습니다. 보안 주장을 읽고 조합하기 위한 공통 언어를 소유하며,
          algorithm·parameter 선택은 해당 표준과 threat model로 내려갑니다.
        </p>
        <ContentBoundary article="crypto-theory" />
        <ModernCryptoTheoryViz />
        <div id="paper-goldwasser-micali">
          <CitationBlock
            source="Goldwasser & Micali · Probabilistic Encryption"
            citeKey={1}
            type="paper"
            href="https://doi.org/10.1016/0022-0000(84)90070-9"
          >
            <p>
              <strong>문제:</strong> Encryption security를 ciphertext를 역산하기
              어렵다는 비형식적 설명보다 강한 계산적 정의로 나타내야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Probabilistic encryption과 semantic
              security의 기반을 제시해 adversary experiment로 confidentiality를
              논증합니다.
            </p>
            <p>
              <strong>전제:</strong> Polynomial-time adversary와 명시된
              computational assumption·security parameter를 사용합니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 계산적 encryption security를 game과
              reduction으로 읽는 이론적 근거입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 임의 encryption
              mode·implementation·key management가 자동으로 안전하거나
              post-quantum이라는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="security-game" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            01 · security game
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Adversary가 보는 것·질의할 것·이기는 조건을 적어야 “안전하다”가 측정
            가능해진다
          </h2>
        </header>
        <ExplainedFormula
          question="두 challenge 중 하나를 맞히는 game에서 adversary의 advantage를 어떻게 읽을까요?"
          idea="정보가 전혀 없으면 성공확률은 1/2입니다. 실제 성공확률이 이 baseline에서 얼마나 벗어나는지 절댓값으로 잽니다."
          formula={String.raw`Adv_{\mathcal A}(\lambda)=\left|\Pr[b'=b]-\frac12\right|`}
          annotatedFormula={String.raw`Adv_{\mathcal A}(\lambda)=\underbrace{\left|\Pr[b'=b]-\frac12\right|}_{\text{허용 경계 판정}}`}
          operations={[
            { expression: String.raw`\left|\Pr[b'=b]-\frac12\right|`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","정보가 전혀 없으면 성공확률은 1/2입니다."] },
          ]}
          terms={[
            {
              symbol: "𝒜",
              name: "adversary",
              description:
                "Game이 허용한 관찰·oracle queries·시간과 memory 안에서 동작하는 공격자입니다.",
            },
            {
              symbol: "λ",
              name: "security parameter",
              description:
                "Key/parameter family와 adversary resource를 scale하는 입력입니다.",
            },
            {
              symbol: "b",
              name: "hidden challenge bit",
              description: "Challenger가 균등하게 고른 실제 branch입니다.",
            },
            {
              symbol: "b'",
              name: "adversary guess",
              description:
                "Adversary가 transcript 뒤 출력한 branch 추측입니다.",
            },
            {
              symbol: "Adv",
              name: "distinguishing advantage",
              description:
                "Random guess baseline을 넘은 무차원 성공 격차입니다.",
            },
          ]}
          assumptions={[
            "b는 균등하며 game abort·invalid query 규칙을 고정합니다.",
            "Adversary resources와 oracle access를 명시합니다.",
            "Advantage가 작다는 주장은 security parameter family에 대한 asymptotic 또는 concrete bound를 필요로 합니다.",
            "이 식은 correctness·availability·side-channel resistance를 측정하지 않습니다.",
          ]}
          interpretation="성공확률 0.51이면 advantage는 0.01입니다. 한 번 맞힌 사례가 1% advantage의 통계적 증거가 되지는 않으며 반복 experiment와 이론 bound를 구분합니다."
        />
        <p>
          Correctness game은 honest key generation과 valid input에서 output
          relation이 성립하는지 묻습니다.
          Confidentiality·unforgeability·collision resistance는 adversary win
          event가 다릅니다. 같은 “128-bit security”도 classical/quantum model,
          query access, multi-user setting, message distribution과 failure
          probability가 다르면 같은 claim이 아닙니다.
        </p>
      </section>
      <section id="assumption-composition" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            02 · assumption and composition
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Reduction은 공격을 hard problem에 연결하지만
            encoding·nonce·domain·key lifecycle을 대신 검증하지 않는다
          </h2>
        </header>
        <p>
          Reduction은 primitive를 깨는 adversary를 이용해 assumed-hard problem을
          푸는 algorithm을 구성합니다. Tightness loss와 adversary resources를
          포함해야 concrete parameter를 고를 수 있습니다. Computational
          security는 제한된 resource에서 advantage가 작다는 뜻이고,
          information-theoretic security는 computation이 무한해도 지정된 view가
          정보를 주지 않는다는 뜻입니다. One-time pad와 Shamir sharing의 특정
          threshold property를 일반 public-key system 전체로 확대하지 않습니다.
        </p>
        <p>
          Composition에서는 byte encoding, protocol/domain tag, key purpose,
          nonce uniqueness, randomness source와 transcript order가 primitive
          input을 정합니다. Signature가 valid해도 다른 protocol의 같은 bytes로
          replay할 수 있고, AEAD nonce reuse는 표준 primitive를 안전하지 않게 쓸
          수 있습니다. Key generation·storage·rotation·revocation과
          implementation side channel은 security proof 밖의 운영 경계입니다.
        </p>
        <div id="paper-nist-key-management">
          <CitationBlock
            source="NIST SP 800-57 Part 1 Rev. 5 · Key Management"
            citeKey={2}
            type="paper"
            href="https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final"
          >
            <p>
              <strong>문제:</strong> Cryptographic key와 algorithm strength를
              생성부터 폐기까지 일관된 lifecycle로 운영해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Key types, protection requirements,
              cryptoperiod, compromise recovery와 security-strength guidance를
              제공합니다.
            </p>
            <p>
              <strong>전제:</strong> NIST 적용 범위와 승인 algorithm/profile,
              조직 risk assessment를 따릅니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Primitive proof와 별개인
              key-management lifecycle 경계입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> 특정 system이 compliant하거나
              side channel·protocol composition까지 안전하다고 인증하지
              않습니다.
            </p>
          </CitationBlock>
        </div>
        <div id="paper-rfc5116">
          <CitationBlock
            source="RFC 5116 · Authenticated Encryption interface"
            citeKey={3}
            type="paper"
            href="https://www.rfc-editor.org/rfc/rfc5116"
          >
            <p>
              <strong>문제:</strong> Encryption·integrity algorithm을 key,
              nonce, plaintext와 associated data의 공통 interface로 사용해야
              합니다.
            </p>
            <p>
              <strong>기여:</strong> AEAD input/output와 nonce-reuse
              consequence를 명시한 protocol interface를 정의합니다.
            </p>
            <p>
              <strong>전제:</strong> 선택한 AEAD algorithm의 key/nonce length와
              uniqueness requirement를 지킵니다.
            </p>
            <p>
              <strong>근거 범위:</strong> Authenticated encryption
              호출·nonce·associated-data 계약입니다.
            </p>
            <p>
              <strong>말하지 않는 것:</strong> RFC interface만 따르면 key
              distribution·randomness·endpoint authorization이 해결된다는 뜻은
              아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>
      <section id="crypto-release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">
            03 · release gate
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            Algorithm name 대신 profile·game·vector·negative oracle·key
            generation을 release artifact로 고정한다
          </h2>
        </header>
        <p>
          Release manifest는 algorithm/profile, parameter/security model,
          library/compiler/provider, canonical encoding/domain tag, key
          purpose/generation, nonce strategy, RNG, error behavior와
          interoperability vectors를 포함합니다. Tests는 known-answer,
          malformed/truncated input, wrong key/domain/AAD, nonce reuse detector,
          replay, low-order/invalid point, RNG failure, key rotation과 crash
          recovery를 다룹니다.
        </p>
        <p>
          기초 6문제는 correctness/security, game, advantage,
          computational/information-theoretic, reduction과 domain separation을
          묻습니다. 심화 4문제는 multi-user bound, nonce catastrophe,
          composition counterexample와 migration release matrix를 설계하게
          합니다.
        </p>
      </section>
    </article>
  );
}
