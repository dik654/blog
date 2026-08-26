import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ContentBoundary from "@/components/articles/content-boundary";

export default function PaillierCryptosystemArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5">
        <h2 className="text-3xl font-bold">Paillier는 n²에서 randomized ciphertext를 곱해 plaintext를 더합니다</h2>
        <p className="text-lg leading-8">
          Paillier cryptosystem은 plaintext m∈Zₙ을 ciphertext c∈Z*ₙ²로 옮기는
          probabilistic public-key encryption입니다. 같은 message도 fresh randomizer
          r에 따라 다른 ciphertext가 되고, ciphertext multiplication은 plaintext의
          modular addition에 대응합니다. 이 기능과 confidentiality·integrity·active
          protocol security는 각각 분리해 읽어야 합니다.
        </p>
        <ContentBoundary article="paillier-cryptosystem" />
      </section>

      <section id="key-generation" className="space-y-5">
        <h2 className="text-2xl font-bold">Key generation은 modulus뿐 아니라 decryption inverse 조건을 만듭니다</h2>
        <p>
          서로 다른 primes p,q로 n=pq를 만들고 λ=lcm(p−1,q−1)를 계산합니다. Public
          parameter g는 L(g^λ mod n²)가 modulo n에서 inverse를 가져야 하며,
          L(u)=(u−1)/n과 μ=L(g^λ mod n²)⁻¹ mod n을 secret key에 둡니다. 흔한 g=n+1
          profile은 식을 단순화하지만 library profile과 validation을 생략해도 된다는
          뜻은 아닙니다.
        </p>
      </section>

      <section id="encryption" className="space-y-5">
        <h2 className="text-2xl font-bold">Encryption은 unit randomizer를 매번 새로 뽑습니다</h2>
        <ExplainedFormula
          question="Message m을 어떻게 randomized ciphertext로 바꿀까요?"
          idea="Message exponent와 unit randomizer의 n-th residue를 n²에서 곱합니다."
          formula={String.raw`c=\operatorname{Enc}(m;r)=g^m r^n\bmod n^2`}
          annotatedFormula={String.raw`c=\operatorname{Enc}(m;r)=\underbrace{g^m}_{\text{message residue를 exponent에 encode}}\underbrace{r^n}_{\text{fresh randomness로 ciphertext를 재무작위화}}\bmod n^2`}
          operations={[
            { expression: String.raw`g^m`, annotation: ["plaintext residue m을 exponent에 넣어", "public base g 위의 message component 생성"] },
            { expression: String.raw`r^n\bmod n^2`, annotation: ["fresh unit r의 n제곱을 곱해", "같은 message도 다른 ciphertext가 되게 함"] },
          ]}
          terms={[
            { symbol: "n=pq", name: "public modulus", description: "Plaintext ring Z_n과 ciphertext modulus n²를 정합니다." },
            { symbol: "g", name: "public parameter", description: "정상 key generation의 inverse 조건을 만족합니다." },
            { symbol: "r", name: "fresh unit randomizer", description: "Z*_n에서 매 encryption 새로 뽑습니다." },
            { symbol: "m", name: "plaintext residue", description: "0부터 n−1까지의 canonical residue입니다." },
          ]}
          assumptions={[
            "p,q와 g가 profile에 따라 검증됐습니다.",
            "gcd(r,n)=1이고 r은 매 encryption 독립적으로 생성합니다.",
            "Signed integer나 fixed-point encoding은 별도 application contract입니다.",
          ]}
          interpretation="Toy n=15,g=16,m=4,r=2이면 16⁴·2¹⁵ mod 225=173입니다. 작은 p,q는 설명용일 뿐 security parameter가 아닙니다."
        />
      </section>

      <section id="homomorphism" className="space-y-5">
        <h2 className="text-2xl font-bold">Ciphertext multiplication은 mod n plaintext addition입니다</h2>
        <ExplainedFormula
          question="복호화하지 않고 두 plaintext를 어떻게 더할까요?"
          idea="두 encryption을 곱하면 g의 exponent는 더해지고 randomizer는 곱해집니다."
          formula={String.raw`\operatorname{Enc}(m_1;r_1)\operatorname{Enc}(m_2;r_2)=\operatorname{Enc}(m_1+m_2\bmod n;r_1r_2\bmod n)`}
          annotatedFormula={String.raw`\underbrace{\operatorname{Enc}(m_1;r_1)\operatorname{Enc}(m_2;r_2)}_{\text{ciphertexts를 n²에서 곱함}}=\underbrace{\operatorname{Enc}(m_1+m_2\bmod n;r_1r_2\bmod n)}_{\text{plaintext 합과 결합 randomizer의 encryption}}`}
          operations={[
            { expression: String.raw`\operatorname{Enc}(m_1;r_1)\operatorname{Enc}(m_2;r_2)`, annotation: ["같은 public key의 ciphertext 두 개를 곱해", "복호화 없는 aggregate ciphertext 생성"] },
            { expression: String.raw`m_1+m_2\bmod n`, annotation: ["g의 exponent 법칙으로 messages를 더하고", "plaintext ring Z_n의 canonical residue로 환원"] },
          ]}
          terms={[
            { symbol: "m_1,m_2", name: "plaintexts", description: "Z_n에서 더해지는 두 residues입니다." },
            { symbol: "r_1,r_2", name: "randomizers", description: "곱해도 Z*_n에 남는 units입니다." },
            { symbol: "n²", name: "ciphertext modulus", description: "Homomorphic identity를 계산하는 modulus입니다." },
          ]}
          assumptions={[
            "두 ciphertext가 같은 valid public key 아래 생성됐습니다.",
            "연산 결과는 integer 무한합이 아니라 modulo n입니다.",
            "항등식은 ciphertext authenticity나 range proof를 제공하지 않습니다.",
          ]}
          interpretation="g^(m1)r1^n·g^(m2)r2^n=g^(m1+m2)(r1r2)^n입니다. 여러 값을 더하면 wraparound와 application encoding 범위를 먼저 검사합니다."
        />
      </section>

      <section id="decryption" className="space-y-5">
        <h2 className="text-2xl font-bold">Decryption은 L 함수와 μ로 residue를 복원합니다</h2>
        <ExplainedFormula
          question="Secret key는 ciphertext에서 m을 어떻게 복원할까요?"
          idea="c를 λ제곱하면 randomizer 성분이 사라지는 subgroup 구조를 이용하고 L 함수로 exponent의 linear term을 꺼냅니다."
          formula={String.raw`m=L(c^\lambda\bmod n^2)\,\mu\bmod n,\qquad L(u)=\frac{u-1}{n}`}
          annotatedFormula={String.raw`m=\underbrace{L(c^\lambda\bmod n^2)}_{\text{subgroup exponent에서 linear coefficient 추출}}\underbrace{\mu}_{\text{keygen에서 만든 inverse로 g의 scale 제거}}\bmod n,\qquad L(u)=\underbrace{\frac{u-1}{n}}_{u\equiv1\pmod n\text{인 valid 입력에서 계산}}`}
          operations={[
            { expression: String.raw`c^\lambda\bmod n^2`, annotation: ["ciphertext를 secret exponent λ로 올려", "randomizer가 사라지는 valid subgroup element 생성"] },
            { expression: String.raw`L(u)=\frac{u-1}{n}`, annotation: ["u≡1 mod n인 값을 1만큼 내리고 n으로 나눠", "exponent의 linear coefficient 추출"] },
            { expression: String.raw`L(c^\lambda)\mu\bmod n`, annotation: ["L 값에 keygen inverse μ를 곱해", "plaintext residue m을 Z_n에서 복원"] },
          ]}
          terms={[
            { symbol: "λ", name: "Carmichael exponent", description: "lcm(p−1,q−1)입니다." },
            { symbol: "L", name: "Paillier L function", description: "정상 subgroup element의 linear coefficient를 꺼냅니다." },
            { symbol: "μ", name: "decryption inverse", description: "L(g^λ mod n²)의 inverse modulo n입니다." },
          ]}
          assumptions={[
            "Ciphertext와 key는 selected Paillier profile에서 valid합니다.",
            "L 함수 입력은 u≡1 mod n인 정상 형태여야 합니다.",
          ]}
          interpretation="Toy p=3,q=5,n=15,g=16,λ=4,μ=4에서 c=173이면 c⁴ mod225=16, L(16)=1, m=1·4 mod15=4입니다."
        />
      </section>

      <section id="security-boundary" className="space-y-5">
        <h2 className="text-2xl font-bold">Homomorphism은 유용한 malleability이며 integrity가 아닙니다</h2>
        <p>
          누구나 ciphertext를 곱해 plaintext를 예측 가능한 만큼 바꿀 수 있습니다.
          Aggregation에는 기능이지만 일반 transport encryption에서는 active mutation입니다.
          Malformed key/ciphertext validation, plaintext range·relation proof, threshold
          decryption proof와 chosen-ciphertext protection은 사용하는 protocol이 별도로
          정의해야 합니다. Randomizer reuse도 deterministic relation을 노출할 수 있어
          금지합니다.
        </p>
      </section>

      <section id="release" className="space-y-5">
        <h2 className="text-2xl font-bold">Profile과 encoding을 pin한 뒤 negative vectors를 먼저 통과시킵니다</h2>
        <p>
          Key size, g profile, plaintext encoding, randomness source, ciphertext
          serialization과 validation policy를 하나의 artifact로 고정합니다. r=0,
          gcd(r,n)≠1, out-of-range message, malformed c, wrong key, repeated randomness,
          modular wraparound와 altered aggregate를 시험한 뒤 keygen/encrypt/decrypt/
          homomorphic operation latency와 bytes를 측정합니다.
        </p>
        <div id="paper-paillier">
          <CitationBlock source="Paillier · Public-Key Cryptosystems Based on Composite Degree Residuosity Classes" citeKey={1} href="https://link.springer.com/chapter/10.1007/3-540-48910-X_16">
            <p><b>문제:</b> Composite residuosity로 probabilistic public-key encryption을 구성합니다.</p>
            <p><b>기여:</b> Additive homomorphism을 갖는 cryptosystem을 제시합니다.</p>
            <p><b>전제:</b> Valid key generation, unit randomizer와 논문의 security setting입니다.</p>
            <p><b>근거 범위:</b> Encryption·decryption·homomorphic identity입니다.</p>
            <p><b>말하지 않는 것:</b> Standalone scheme이 malicious MPC나 CCA integrity를 자동 제공하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
