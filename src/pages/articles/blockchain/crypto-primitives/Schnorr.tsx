import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function Schnorr() {
  return (
    <section id="schnorr" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Schnorr: 지식 증명 transcript를 메시지 서명으로 묶는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Prime-order group의 generator G와 공개키 P=xG가 있을 때, 서명자는 secret scalar x를 공개하지 않고 자신이 x를 안다는 관계를 증명합니다. 원래 Sigma protocol은 verifier가 무작위 challenge를 보내는 세 단계 대화입니다. Fiat–Shamir transform은 이 challenge를 transcript hash로 바꾸며, message와 domain까지 hash에 포함해야 다른 문맥의 응답을 재사용할 수 없습니다. DLP의 정확한 공격 모델은 <Link to="/crypto/discrete-log">이산로그 글</Link>을 재사용합니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="schnorr-transcript" />
      <ExplainedFormula
        question="Verifier는 secret x를 보지 않고 서명자의 응답을 어떻게 확인할까요?"
        idea="Signer는 nonce commitment R을 먼저 고정하고 challenge e에 대해 s=k+ex로 응답합니다. 양변에 G를 곱하면 공개된 P=xG만으로 같은 관계를 검사할 수 있습니다."
        formula={String.raw`R=kG,\quad e=H(\mathsf{tag}\Vert R\Vert P\Vert m),\quad s=k+ex\pmod q,\quad sG\stackrel?=R+eP`}
        annotatedFormula={String.raw`R=\underbrace{kG,\quad e=H(\mathsf{tag}\Vert R\Vert P\Vert m),\quad s=k+ex\pmod q,\quad sG\stackrel?=R+eP}_{\text{Fiat–Shamir challenge 계산}}`}
        operations={[
          { expression: String.raw`kG,\quad e=H(\mathsf{tag}\Vert R\Vert P\Vert m),\quad s=k+ex\pmod q,\quad sG\stackrel?=R+eP`, annotation: ["Fiat–Shamir challenge이(가) 식의 결과에","기여하는 방식을 계산합니다.","Signer는 nonce commitment R을 먼저","고정하고 challenge e에 대해 s=k+ex로"] },
        ]}
        terms={[
          { symbol: "x,P=xG", name: "secret·public key", description: "x는 scalar field의 비밀값이고 P는 공개 group point입니다." },
          { symbol: "k,R=kG", name: "nonce·commitment", description: "서명마다 독립적으로 안전하게 만든 scalar와 그 공개점입니다." },
          { symbol: "e", name: "Fiat–Shamir challenge", description: "Domain·commitment·public key·message를 묶은 scalar입니다." },
          { symbol: "s", name: "response", description: "Verifier가 group equation에 넣는 공개 scalar입니다." },
        ]}
        assumptions={["G가 알려진 prime order q의 subgroup generator이고 입력 point를 검증합니다.", "Hash transcript의 encoding과 domain tag가 모호하지 않으며 nonce가 반복·노출되지 않습니다."]}
        interpretation="검증 등식은 completeness를 직접 보여 줍니다. 그러나 EUF-CMA security는 이 등식 하나가 아니라 DLP hardness, random-oracle model의 hash, nonce와 encoding 조건을 포함한 reduction 범위에서 읽어야 합니다."
      />
      <ExplainedFormula
        question="같은 nonce k를 두 메시지에 쓰면 왜 secret x가 드러날까요?"
        idea="같은 R에서 challenge만 e₁,e₂로 달라지면 두 response의 차이에서 k가 지워지고 x에 대한 일차식 하나가 남습니다."
        formula={String.raw`s_1-s_2=(e_1-e_2)x\pmod q\quad\Longrightarrow\quad x=(s_1-s_2)(e_1-e_2)^{-1}\pmod q`}
        annotatedFormula={String.raw`s_1-s_2=\underbrace{(e_1-e_2)x\pmod q\quad\Longrightarrow\quad x=(s_1-s_2)(e_1-e_2)^{-1}\pmod q}_{\text{field inverse 계산}}`}
        operations={[
          { expression: String.raw`(e_1-e_2)x\pmod q\quad\Longrightarrow\quad x=(s_1-s_2)(e_1-e_2)^{-1}\pmod q`, annotation: ["field inverse이(가) 식의 결과에 기여하는 방식을","계산합니다.","같은 R에서 challenge만 e₁,e₂로 달라지면 두","response의 차이에서 k가 지워지고 x에 대한 일차식"] },
        ]}
        terms={[
          { symbol: "s_1,s_2", name: "responses", description: "동일 nonce로 만든 두 공개 서명의 response입니다." },
          { symbol: "e_1,e_2", name: "challenges", description: "서로 다른 메시지 transcript에서 나온 공개 scalars입니다." },
          { symbol: "(e_1-e_2)^{-1}", name: "field inverse", description: "Challenges가 다를 때 scalar field에서 존재합니다." },
        ]}
        assumptions={["두 서명이 같은 key와 같은 R을 사용하고 e₁≠e₂입니다.", "서명 convention이 s=k+ex인지 s=k−ex인지에 맞춰 부호를 일관되게 적용합니다."]}
        interpretation="Random nonce뿐 아니라 deterministic nonce도 key·message·auxiliary randomness·domain을 안전하게 묶어야 합니다. Fault나 state rollback으로 R이 반복되면 수학적으로 올바른 서명 알고리즘도 private key를 잃습니다."
      />
      <div id="paper-bip340-schnorr" className="scroll-mt-24">
        <CitationBlock source="BIP 340 · Schnorr Signatures for secp256k1" href="https://bips.dev/340/" citeKey={3}>
          문제: Bitcoin에서 interoperable하고 batch verification 가능한 Schnorr signature를 정의합니다. 기여: x-only public key, tagged hash, deterministic nonce with auxiliary randomness, exact byte encoding과 test vectors를 규정합니다. 전제: secp256k1 group과 BIP 340의 challenge/sign convention을 그대로 사용합니다. 근거 범위: 이 구체 signature scheme입니다. 비주장: 모든 Schnorr variant나 임의 curve·hash 조합의 안전성을 자동 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
