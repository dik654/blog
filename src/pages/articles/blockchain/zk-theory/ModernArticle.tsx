import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ZeroKnowledgeViz from "./ZeroKnowledgeViz";

export default function ModernZKTheoryArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">Zero knowledge를 세 속성으로 분리하기</p><h2 className="text-3xl font-bold tracking-tight">정답을 안다는 사실과 정답을 공개하는 일을 분리한다</h2></header>
        <p className="text-lg leading-8 text-foreground/90">공개 statement가 “F₁₇에서 x=4, y=10이고 어떤 비공개 coefficient를 가진 degree≤2 polynomial f가 f(4)=10을 만족한다”라고 합시다. Prover는 witness를 모두 보내지 않고 relation을 만족하는 witness가 있다는 사실만 설득하고 싶습니다. Zero knowledge(ZK)는 proof가 참이라는 것과 proof에서 witness에 관한 추가 정보를 얻지 못한다는 것을 별도 속성으로 다룹니다.</p>
        <p><strong>Completeness</strong>는 honest witness와 prover가 통과하는지, <strong>soundness/knowledge soundness</strong>는 witness 없는 거짓 주장을 통과시키기 어려운지, <strong>zero knowledge</strong>는 verifier가 보는 view를 witness 없이도 simulator가 만들 수 있는지를 묻습니다. 하나가 다른 둘을 자동으로 보장하지 않습니다.</p>
        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> Sigma protocol은 commit→random challenge→response의 세 메시지로 knowledge와 simulation의 구조를 가장 작게 보여 줍니다. Fiat–Shamir는 challenge를 hash로 바꾸지만 statement·commitment·context binding과 random-oracle 경계를 새로 만듭니다.</aside>
        <ContentBoundary article="zk-theory" />
        <ZeroKnowledgeViz />
      </section>

      <section id="sigma" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · Sigma protocol</p><h2 className="mt-2 text-2xl font-bold">같은 commitment에 두 challenge를 답하면 witness가 추출된다</h2></header>
        <p>
            작은 cyclic group에서 Schnorr protocol을 보겠습니다. Public key는 Y=gʷ이고 prover는 discrete log w를 압니다. Prover는
            nonce r로 R=gʳ을 먼저 보내고 verifier가 예측 불가능한 e를 고르면 s=r+ew로 답합니다. Verifier는 gˢ=R·Yᵉ를 검사합니다.
          </p>
        <ExplainedFormula
          question="같은 첫 메시지 R에 서로 다른 challenge 두 개를 답하면 왜 witness w를 계산할 수 있는가?"
          idea={<>두 accepted response에서 nonce r은 같고 challenge만 다릅니다. 식을 빼면 r이 사라지고 w에 대한 일차식만 남습니다. 이것이 special soundness의 extractor 아이디어입니다.</>}
          formula={String.raw`s=r+ew,\quad s'=r+e'w\quad\Longrightarrow\quad w=(s-s')(e-e')^{-1}\pmod q`}
          annotatedFormula={String.raw`s=\underbrace{r+ew,\quad s'=r+e'w\quad\Longrightarrow\quad w=(s-s')(e-e')^{-1}\pmod q}_{\text{Witness 계산}}`}
          operations={[
            { expression: String.raw`r+ew,\quad s'=r+e'w\quad\Longrightarrow\quad w=(s-s')(e-e')^{-1}\pmod q`, annotation: ["Witness이(가) 식의 결과에 기여하는 방식을 계산합니다.","두 accepted response에서 nonce r은 같고","challenge만 다릅니다."] },
          ]}
          terms={[
            { symbol: "R=g^r", name: "First message", description: "Challenge 전에 고정하는 nonce commitment입니다." },
            { symbol: "e,e'", name: "Distinct challenges", description: "같은 R에 대해 서로 달라야 합니다." },
            { symbol: "s,s'", name: "Accepted responses", description: "각 verifier equation을 통과한 응답입니다." },
            { symbol: "w", name: "Witness", description: "Public Y=gʷ의 discrete logarithm입니다." },
            { symbol: "q", name: "Group order", description: "Inverse와 response arithmetic이 이 prime-order field에서 이루어집니다." },
          ]}
          assumptions={["Group은 알려진 prime order q를 가지며 subgroup membership을 검사합니다.", "R은 두 transcript에서 동일하고 e≠e′라서 e−e′의 inverse가 존재합니다.", "Challenge는 R이 고정된 뒤 verifier randomness 또는 올바른 transcript hash로 생성됩니다."]}
          interpretation="예를 들어 q=11, e=2,e′=5, s=7,s′=8이면 w=(7−8)(2−5)⁻¹=(−1)(−3)⁻¹=4 mod11입니다. R을 challenge마다 바꾸면 nonce가 소거되지 않으므로 이 추출식을 적용할 수 없습니다."
        />
        <p><strong>Proof idea와 경계:</strong> Knowledge extractor가 rewind해 같은 R에 다른 e를 얻을 수 있다는 모델에서 두 accepted transcripts가 witness를 결정합니다. 실제 non-interactive proof에서는 단순 rewind가 그대로 가능하지 않을 수 있으며 Fiat–Shamir의 security proof와 forking 조건이 필요합니다. Nonce r을 재사용하면 실제 공격자도 같은 계산으로 w를 빼내므로 protocol implementation은 fresh randomness를 보장해야 합니다.</p>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-6"><strong>반례:</strong> Prover가 challenge e를 먼저 안다면 임의 s를 고르고 R=gˢY⁻ᵉ로 역산해 verifier equation을 맞출 수 있습니다. 그래서 첫 메시지가 먼저 고정되어야 하며 Fiat–Shamir에서도 hash input 순서를 임의로 바꾸면 안 됩니다.</div>
      </section>

      <section id="simulation" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · Simulator와 hiding</p><h2 className="mt-2 text-2xl font-bold">Witness 없이 만든 view와 실제 view를 구별하기 어려워야 한다</h2></header>
        <ExplainedFormula
          question="Schnorr verifier가 보는 accepted transcript를 witness 없이 어떻게 만들 수 있는가?"
          idea={<>Simulator는 challenge e와 response s를 먼저 고르고 verifier equation이 성립하도록 R을 역산합니다. Honest-verifier setting에서 이 transcript의 분포가 실제 protocol view와 같거나 구별하기 어렵다는 것이 ZK 직관입니다.</>}
          formula={String.raw`e,s\leftarrow\mathbb Z_q,\qquad R:=g^sY^{-e}\quad\Longrightarrow\quad g^s=R\,Y^e`}
          annotatedFormula={String.raw`e,s\leftarrow\mathbb Z_q,\qquad R:=\underbrace{g^sY^{-e}\quad\Longrightarrow\quad g^s=R\,Y^e}_{\text{허용 경계 판정}}`}
          operations={[
            { expression: String.raw`g^sY^{-e}\quad\Longrightarrow\quad g^s=R\,Y^e`, annotation: ["Scalar field이(가) 식의 결과에 기여하는 방식을","계산합니다.","Simulator는 challenge e와 response","s를 먼저 고르고 verifier equation이 성립하도록"] },
          ]}
          terms={[
            { symbol: "e,s", name: "Simulated challenge/response", description: "Simulator가 witness 없이 뽑는 field 값입니다." },
            { symbol: "R", name: "Programmed first message", description: "Verifier equation이 성립하도록 역산합니다." },
            { symbol: "Y", name: "Public statement", description: "Witness w를 숨긴 public group element입니다." },
            { symbol: "\\mathbb Z_q", name: "Scalar field", description: "Challenge와 response의 sampling domain입니다." },
          ]}
          assumptions={["먼저 설명하는 것은 honest-verifier ZK이며 malicious verifier에는 별도 simulator·protocol 조건이 필요합니다.", "Sampling은 uniform하고 group encoding·subgroup validation·transcript serialization이 profile에 고정됩니다.", "Computational/statistical/perfect ZK 중 어느 정의를 주장하는지 security statement에 명시합니다."]}
          interpretation="Simulator가 accepted transcript를 만들 수 있다는 사실은 누구나 live protocol에서 challenge를 미리 정할 수 있다는 뜻이 아닙니다. 실제 순서는 R→e→s이고, simulator는 security proof의 가상 algorithm입니다."
        />
        <p>
            Commitment의 hiding과 ZK도 동일하지 않습니다. 예를 들어 Pedersen commitment C=gᵐhʳ은 r이 uniform이고 log_g h가 알려지지 않을
            때 m을 perfectly hiding하면서 DLP 아래 binding이 성립할 수 있습니다. 하지만 protocol이 m의 함수나 reuse된 r을 다른 메시지로 흘리면
            commitment 하나의 hiding만으로 전체 protocol ZK가 되지 않습니다.
          </p>
        <ExplainedFormula
          question="Pedersen commitment는 hiding과 binding을 어떤 서로 다른 전제에 배치하는가?"
          idea={<>Random r이 commitment 분포를 모든 m에 대해 같게 만들어 hiding을 주고, 같은 C를 두 메시지로 열면 generator 사이 discrete log를 계산할 수 있게 되어 computational binding을 줍니다.</>}
          formula={String.raw`C=g^m h^r,\qquad g^m h^r=g^{m'}h^{r'}\Rightarrow \log_g h=(m-m')(r'-r)^{-1}`}
          annotatedFormula={String.raw`C=\underbrace{g^m h^r,\qquad g^m h^r=g^{m'}h^{r'}\Rightarrow \log_g h=(m-m')(r'-r)^{-1}}_{\text{로그 비용 변환}}`}
          operations={[
            { expression: String.raw`g^m h^r,\qquad g^m h^r=g^{m'}h^{r'}\Rightarrow \log_g h=(m-m')(r'-r)^{-1}`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Random r이 commitment 분포를 모든 m에 대해","같게 만들어 hiding을 주고, 같은 C를 두 메시지로 열면","generator 사이 discrete log를 계산할 수"] },
          ]}
          terms={[
            { symbol: "m", name: "Message", description: "Commit하고 숨기려는 field 값입니다." },
            { symbol: "r", name: "Blinding", description: "매 commitment마다 새로 uniform sampling합니다." },
            { symbol: "g,h", name: "Independent generators", description: "서로의 discrete log를 아는 당사자가 없어야 합니다." },
            { symbol: "C", name: "Commitment", description: "메시지와 randomness를 group element 하나에 결합합니다." },
          ]}
          assumptions={["Prime-order subgroup과 canonical point encoding을 사용합니다.", "r은 uniform·fresh이며 log_g h가 알려지지 않습니다.", "Opening protocol과 전체 transcript가 statement·context에 binding됩니다."]}
          interpretation="r=0으로 고정하거나 작은 후보 m을 deterministic commitment와 대조하면 hiding이 깨집니다. 반면 hiding이 깨져도 alternate opening이 여전히 어려울 수 있어 두 속성은 분리해서 시험해야 합니다."
        />
      </section>

      <section id="noninteractive-boundary" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · Fiat–Shamir와 release gate</p><h2 className="mt-2 text-2xl font-bold">Hash challenge는 상호작용을 줄이지만 transcript 설계를 보안 경계로 만든다</h2></header>
        <p>
            Fiat–Shamir에서는 e=H(protocol-id, version, statement, public key, R, context)처럼 challenge를 계산합니다.
            Statement나 chain/domain을 빼면 proof가 다른 맥락에서 replay될 수 있고 ambiguous serialization은 서로 다른 입력이 같은 byte
            string을 만들 수 있습니다. Multi-round protocol을 단순히 마지막 메시지 하나만 hash해서 일반화해서도 안 됩니다.
          </p>
        <p>
            ZK release gate에는 honest accept, wrong witness/public input, malformed/subgroup point, nonce
            reuse, altered statement/context, transcript reorder, replay, simulator-distribution test가 들어갑니다.
            False accept와 witness leakage를 먼저 확인한 뒤 prove/verify time, proof bytes, CRS·memory를 비교합니다. Side
            channel·randomness failure는 추상 ZK theorem이 자동으로 막지 못합니다.
          </p>
        <div id="paper-gmr"><CitationBlock source="Goldwasser·Micali·Rackoff · The Knowledge Complexity of Interactive Proof Systems" citeKey={1} href="https://doi.org/10.1137/0218012"><p><strong>문제:</strong> Interactive proof에서 verifier가 validity 이외에 얻는 knowledge를 형식화해야 합니다.</p><p><strong>기여:</strong> Interactive proof와 simulator 기반 zero-knowledge의 정의적 토대를 제시합니다.</p><p><strong>전제:</strong> 논문의 probabilistic polynomial-time verifier, view와 knowledge-complexity model을 사용합니다.</p><p><strong>근거 범위:</strong> ZK 정의와 원 논문의 protocol/theorem 범위에 한정합니다.</p><p><strong>말하지 않는 것:</strong> 현대 SNARK 구현, Fiat–Shamir transcript, side-channel privacy를 자동 보장하지 않습니다.</p></CitationBlock></div>
        <div id="paper-fiat-shamir"><CitationBlock source="Fiat·Shamir · How To Prove Yourself (CRYPTO 1986)" citeKey={2} href="https://doi.org/10.1007/3-540-47721-7_12"><p><strong>문제:</strong> Interactive identification을 공개 검증 가능한 non-interactive signature로 바꿔야 합니다.</p><p><strong>기여:</strong> Public-coin protocol의 challenge를 hash로 대체하는 변환을 제시합니다.</p><p><strong>전제:</strong> 원 protocol 구조와 random-oracle heuristic, 올바른 message/domain binding을 사용합니다.</p><p><strong>근거 범위:</strong> Interactive-to-noninteractive 변환의 역사적 construction 범위입니다.</p><p><strong>말하지 않는 것:</strong> 모든 multi-round proof, quantum adversary, 임의 encoding에서 자동 secure하다는 뜻은 아닙니다.</p></CitationBlock></div>
        <p>이 글의 10문항은 세 보안 속성, Schnorr 흐름·수치 검산, extractor, simulator, commitment 경계, Fiat–Shamir 입력, challenge-first 반례, nonce reuse, ZK property 분류, release matrix를 묻습니다. 위 식과 반례만으로 답을 완성할 수 있습니다.</p>
      </section>
    </article>
  );
}
