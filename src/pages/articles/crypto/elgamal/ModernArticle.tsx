import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";

const Flow=()=> <figure data-viz="elgamal-mask-flow" className="not-prose rounded-xl border border-border bg-card p-4 sm:p-5"><figcaption className="mb-4 text-sm font-semibold">Fresh DH mask로 group message를 감추고 복원하는 경로</figcaption><div className="grid gap-3 sm:grid-cols-4">{[['01','Keygen','x → y=gˣ'],['02','Fresh r','c₁=gʳ'],['03','Mask','c₂=M·yʳ'],['04','Unmask','M=c₂/(c₁ˣ)']].map(([n,t,d])=><div key={n} className="min-w-0 rounded-lg border border-border bg-background p-4"><span className="text-xs font-semibold text-primary">{n}</span><p className="mt-2 text-sm font-semibold">{t}</p><p className="mt-1 break-words text-xs text-muted-foreground">{d}</p></div>)}</div></figure>;

export default function ModernArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-5"><h2 className="text-3xl font-bold">ElGamal: Diffie–Hellman shared value를 message mask로 쓴다</h2><p className="text-lg leading-8">
            수신자는 secret exponent x와 public key y=gˣ를 만듭니다. 송신자는 매 암호화마다 fresh random r를 뽑아 gʳ과 yʳ를 만들고 yʳ로
            message group element M을 가립니다. 같은 M도 r가 다르면 ciphertext가 달라지는 확률적 암호화입니다.
          </p><Flow/><p>
            이 글의 textbook 계산은 원리를 설명하는 대목입니다. arbitrary bytes를 raw group element로 직접 밀어 넣으라는 배포 지침은 아닙니다.
            실전에서는 검증된 group encapsulation, KDF, AEAD를 정확한 profile로 결합합니다.
          </p></section>
  <section id="encrypt-decrypt" className="space-y-5"><h2 className="text-2xl font-bold">p=23 toy example을 끝까지 계산한다</h2><p>p=23, g=5, x=6이면 y=5⁶ mod23=8입니다. M=10, r=7을 선택하면 c₁=5⁷=17, y⁷=12, c₂=10·12=5 (mod23)이어서 ciphertext는 (17,5)입니다. 수신자는 17⁶=12와 12⁻¹=2를 계산해 5·2=10을 복원합니다.</p><ExplainedFormula question="송신자와 수신자가 어떻게 같은 mask를 만드는가?" idea={<>Exponent multiplication의 교환성 때문에 송신자의 yʳ과 수신자의 (gʳ)ˣ가 같습니다. Ciphertext에 든 mask를 그 inverse로 상쇄합니다.</>} formula={String.raw`y=g^x,\quad (c_1,c_2)=(g^r,M\,y^r),\quad M=c_2(c_1^x)^{-1}`}
  annotatedFormula={String.raw`y=\underbrace{g^x,\quad (c_1,c_2)=(g^r,M\,y^r),\quad M=c_2(c_1^x)^{-1}}_{\text{Ephemeral randomness 계산}}`}
  operations={[
    { expression: String.raw`g^x,\quad (c_1,c_2)=(g^r,M\,y^r),\quad M=c_2(c_1^x)^{-1}`, annotation: ["Ephemeral randomness이(가) 식의 결과에","기여하는 방식을 계산합니다.","Exponent multiplication의 교환성 때문에","송신자의 yʳ과 수신자의 (gʳ)ˣ가 같습니다."] },
  ]} terms={[{symbol:"x,y",name:"Secret·public key",description:"x는 secret exponent이고 y=gˣ는 validated group element입니다."},{symbol:"r",name:"Ephemeral randomness",description:"Ciphertext마다 uniform·secret·fresh해야 하는 exponent입니다."},{symbol:"M",name:"Group message",description:"Selected subgroup의 element이며 arbitrary byte string이 아닙니다."},{symbol:"c₁,c₂",name:"Ciphertext",description:"Ephemeral public value와 masked group message입니다."}]} assumptions={["g가 생성하는 올바른 subgroup와 order, encoding을 고정합니다.","Public key·ciphertext elements를 canonical decode·subgroup·identity policy로 검증합니다.","r는 CSPRNG에서 생성하고 재사용하지 않습니다."]} interpretation="c₁ˣ=gʳˣ=(gˣ)ʳ=yʳ이므로 복호가 성립합니다. r=0이면 c₁=1이 되어 mask 의미가 사라지므로 toy parameter를 실전에 옮기면 안 됩니다." /></section>
  <section id="security" className="space-y-5"><h2 className="text-2xl font-bold">IND-CPA confidentiality와 ciphertext integrity를 같은 말로 부르지 않는다</h2><p>
            Validated group에서 DDH tuple을 random tuple과 구분하기 어렵고 r가 fresh하다면 IND-CPA 목표를 얻습니다. 곧 attacker가 선택한
            두 messages의 ciphertext를 구분하기 어렵다는 뜻입니다. 하지만 raw ElGamal은 ciphertext components를 곱할 수 있어
            Enc(M₁;r₁)Enc(M₂;r₂)=Enc(M₁M₂;r₁+r₂)가 됩니다.
          </p><p>
            이 homomorphism은 투표 집계 등에서 명시적 증명·range checks와 함께 쓸 수 있습니다. 다만 일반 암호화에서는 malleability입니다.
            attacker가 (1,α)를 곱해 plaintext를 α배로 바꾸어도 raw decrypt가 error를 내지 않습니다. 또한 r이 반복되면 같은 c₁과 c₂ 비율에서
            message 비율이 노출됩니다.
          </p></section>
  <section id="release" className="space-y-5"><h2 className="text-2xl font-bold">Hybrid profile은 정확성·active integrity를 통과한 뒤 배포한다</h2><p>
            Algorithm/source version과 group/order/generator/cofactor, canonical point encoding을 하나의 manifest에
            넣습니다. CSPRNG와 KDF, AEAD, transcript/domain도 같은 manifest에 들어갑니다. Official vectors와 malformed point,
            identity, wrong subgroup, RNG clone/reuse, ciphertext·AEAD tag·wrong key/domain mutations을 fail
            closed합니다. 그 뒤에 keygen/encrypt/decrypt time, ciphertext bytes, memory를 비교합니다. Profile 드리프트나 RNG
            duplicate가 나타나면 이전 pinned profile로 rollback합니다.
          </p><div id="paper-elgamal-1985"><CitationBlock source="ElGamal · A Public-Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms" citeKey={1} href="https://doi.org/10.1109/TIT.1985.1057074"><p><b>문제:</b> Discrete-log group에서 public-key encryption을 구성합니다.</p><p><b>기여:</b> Ephemeral exponent와 DH-style mask를 쓰는 randomized construction을 제시합니다.</p><p><b>전제:</b> Original group model과 논문의 security context입니다.</p><p><b>근거 범위:</b> Textbook ElGamal construction의 primary source입니다.</p><p><b>말하지 않는 것:</b> Modern IND-CCA·hybrid profile·specific curve safety를 보장하지 않습니다.</p></CitationBlock></div><div id="paper-rfc6090-elgamal"><CitationBlock source="RFC 6090 · Fundamental Elliptic Curve Cryptography Algorithms" citeKey={2} href="https://www.rfc-editor.org/rfc/rfc6090.html"><p><b>문제:</b> Fundamental EC group operations와 역사적 algorithms를 기술합니다.</p><p><b>기여:</b> EC group·encoding·security considerations의 standard reference를 제공합니다.</p><p><b>전제:</b> RFC의 chosen curve/domain·validation requirements입니다.</p><p><b>근거 범위:</b> EC instance와 public-input validation 경계입니다.</p><p><b>말하지 않는 것:</b> Arbitrary EC ElGamal profile을 표준화하거나 AEAD를 대체하지 않습니다.</p></CitationBlock></div></section>
</article>}
