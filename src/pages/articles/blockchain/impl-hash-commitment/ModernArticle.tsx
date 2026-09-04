import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import HashMerkleImplementationViz from "./HashMerkleImplementationViz";

export default function ModernHashCommitmentArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Rust에서 root까지</p><h2 className="text-3xl font-bold tracking-tight">Hash 구현의 실패는 primitive 내부보다 serialization 경계에서 시작한다</h2></header>
      <p className="text-lg leading-8">같은 <code>abc</code>를 한 번에 넣든 <code>a</code>와 <code>bc</code>로 나눠 넣든 digest는 같아야 합니다. 반면 bytes를 field elements로 옮기거나 leaf를 inner node로 올릴 때에는 길이·type·순서가 새 의미가 되므로 명시적인 schema가 필요합니다.</p>
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm"><strong>핵심 아이디어:</strong> API type은 algorithm, parameter profile, encoding과 tree schema를 드러내고 verifier는 모호한 입력을 추측하지 않고 거절해야 합니다.</aside>
      <ContentBoundary article="impl-hash-commitment"/><HashMerkleImplementationViz/>
    </section>
    <section id="hash-api" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Streaming hash</p><h2 className="mt-2 text-2xl font-bold">Chunk는 전송 경계이지 message 의미가 아니다</h2></header>
      <ExplainedFormula question="One-shot과 여러 update 호출이 언제 같은 digest를 내야 하는가?" idea={<>두 API가 정확히 같은 ordered bytes를 흡수하고 같은 finalize/padding을 적용한다면 chunk partition과 무관하게 결과가 같습니다.</>} formula={String.raw`H(m_1\Vert m_2)=\operatorname{finalize}(\operatorname{update}(\operatorname{update}(IV,m_1),m_2))`}
      annotatedFormula={String.raw`H(m_1\Vert m_2)=\underbrace{\operatorname{finalize}(\operatorname{update}(\operatorname{update}(IV,m_1),m_2))}_{\text{Finalize 계산}}`}
      operations={[
        { expression: String.raw`\operatorname{finalize}(\operatorname{update}(\operatorname{update}(IV,m_1),m_2))`, annotation: ["Finalize이(가) 식의 결과에 기여하는 방식을","계산합니다.","두 API가 정확히 같은 ordered bytes를 흡수하고","같은 finalize/padding을 적용한다면 chunk"] },
      ]} terms={[{symbol:"m_1,m_2",name:"Input chunks",description:"Message를 나눈 byte slices입니다."},{symbol:String.raw`\Vert`,name:"Concatenation",description:"Chunk metadata 없이 bytes를 순서대로 잇습니다."},{symbol:"finalize",name:"Finalize",description:"Padding과 length를 적용해 digest를 반환합니다."}]} assumptions={["update가 bytes를 복사/borrow하는 ownership contract와 순서를 지킵니다.","같은 algorithm/version/output length를 사용합니다.","finalize 후 reset·clone·재사용 semantics는 crate 문서와 type으로 고정합니다."]} interpretation="SHA-256('abc')는 ba7816bf…15ad이며 update('a');update('bc')도 같아야 합니다. 이 known vector는 interoperability 확인이지 collision resistance 증명은 아닙니다."/>
      <p><strong>실패 반례:</strong> Buffer의 mutable slice를 비동기로 넘긴 뒤 호출자가 내용을 바꾸거나, finalize 뒤 state를 암묵적으로 재사용하면 같은 호출처럼 보여도 다른 bytes를 hash할 수 있습니다.</p>
    </section>
    <section id="poseidon-api" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Bytes에서 field로</p><h2 className="mt-2 text-2xl font-bold">Poseidon 입력 packing은 hash 바깥의 protocol이다</h2></header>
      <ExplainedFormula question="서로 다른 byte strings가 같은 field sequence가 되지 않게 어떻게 pack하는가?" idea={<>각 chunk를 정한 endianness로 읽고 길이 또는 final delimiter를 별도 element에 넣으며 p 이상 값은 canonical decode에서 거절합니다.</>} formula={String.raw`E(b)=\bigl(\mathrm{tag},\ |b|,\ \operatorname{LE}_{w}(b_0),\ldots,\operatorname{LE}_{w}(b_k)\bigr)\in\mathbb F_p^{k+2}`}
      annotatedFormula={String.raw`E(b)=\underbrace{\bigl(\mathrm{tag},\ |b|,\ \operatorname{LE}_{w}(b_0),\ldots,\operatorname{LE}_{w}(b_k)\bigr)\in\mathbb F_p^{k+2}}_{\text{Domain tag 계산}}`}
      operations={[
        { expression: String.raw`\bigl(\mathrm{tag},\ |b|,\ \operatorname{LE}_{w}(b_0),\ldots,\operatorname{LE}_{w}(b_k)\bigr)\in\mathbb F_p^{k+2}`, annotation: ["Domain tag이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 chunk를 정한 endianness로 읽고 길이 또는","final delimiter를 별도 element에 넣으며 p"] },
      ]} terms={[{symbol:"tag",name:"Domain tag",description:"이 byte-to-field 용도를 다른 protocol과 나눕니다."},{symbol:"|b|",name:"Byte length",description:"Trailing zero와 final chunk 길이를 보존합니다."},{symbol:"w",name:"Chunk width",description:"각 integer가 p보다 작도록 profile이 정한 bytes 수입니다."}]} assumptions={["Chunk width·endianness·padding을 protocol version으로 고정합니다.","Field decoder는 0≤x<p canonical encoding만 허용합니다.","Length element 자체도 unambiguous typed encoding을 사용합니다."]} interpretation="Raw little-endian integer만 쓰면 [01]과 [01,00]은 둘 다 1입니다. Length를 각각 1,2로 포함하면 field sequences가 달라집니다."/>
    </section>
    <section id="merkle-api" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Merkle schema</p><h2 className="mt-2 text-2xl font-bold">Leaf/node tag와 index bit가 root의 일부다</h2></header>
      <ExplainedFormula question="Leaf와 internal node를 어떻게 다른 namespace로 hash하는가?" idea={<>서로 다른 한-byte prefix를 쓰고 leaf에는 length를, inner node에는 canonical left/right order를 넣습니다.</>} formula={String.raw`L_i=H(00\Vert |d_i|\Vert d_i),\qquad N=H(01\Vert L\Vert R)`}
      annotatedFormula={String.raw`L_i=\underbrace{H(00\Vert |d_i|\Vert d_i),\qquad N=H(01\Vert L\Vert R)}_{\text{Leaf prefix 계산}}`}
      operations={[
        { expression: String.raw`H(00\Vert |d_i|\Vert d_i),\qquad N=H(01\Vert L\Vert R)`, annotation: ["Leaf prefix이(가) 식의 결과에 기여하는 방식을","계산합니다.","서로 다른 한-byte prefix를 쓰고 leaf에는","length를, inner node에는 canonical"] },
      ]} terms={[{symbol:"00",name:"Leaf prefix",description:"Raw data leaf namespace입니다."},{symbol:"01",name:"Inner prefix",description:"두 child digest namespace입니다."},{symbol:"L,R",name:"Ordered children",description:"Tree position이 정한 left/right digest입니다."}]} assumptions={["Prefix는 algorithm/domain/version과 함께 고정됩니다.","Digest encoding은 fixed width이고 leaf length encoding은 canonical입니다.","Tree size, odd leaf rule과 empty tree root도 schema에 포함합니다."]} interpretation="4 leaves에서 index 2(이진 10)는 level 0의 low bit 0이므로 current가 left, sibling 3이 right입니다. 다음 bit 1에서는 sibling subtree가 left, current subtree가 right입니다."/>
      <p>Root는 selective opening을 위한 binding-like commitment이지만 small-domain leaf를 숨기지는 않습니다. 공격자는 후보를 hash해 root/path와 비교할 수 있으므로 hiding이 필요하면 salt·blinding·별도 commitment를 설계해야 합니다.</p>
      <p><strong>반례:</strong> Verifier가 index bits 대신 sibling을 작은 hash 순으로 정렬하면 ordered tree가 아닌 다른 schema를 검증하게 되며, application row index와 proof가 분리됩니다.</p>
    </section>
    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Release gate</p><h2 className="mt-2 text-2xl font-bold">Negative fixtures와 reference differential 뒤 benchmark한다</h2></header>
      <p>
            Crate commit, hash/Poseidon profile, byte/field encoding, tree schema를 receipt에 기록합니다. Known
            vectors·chunk parity·p 이상 field·wrong prefix/order/index/root·truncated/malformed path·root update
            fixtures를 reference와 비교하고 그 다음 동일 workload의 throughput·RSS·proof bytes를 측정합니다.
          </p>
      <div id="paper-fips-180-4-impl"><CitationBlock source="NIST · FIPS 180-4" citeKey={1} href="https://csrc.nist.gov/pubs/fips/180-4/upd1/final"><p><strong>문제:</strong> SHA-2의 exact computation을 규정합니다.</p><p><strong>기여:</strong> Padding·functions·digest contract를 제공합니다.</p><p><strong>전제:</strong> 선택 variant와 message convention을 고정합니다.</p><p><strong>근거 범위:</strong> SHA-2 semantics와 vectors입니다.</p><p><strong>말하지 않는 것:</strong> Rust API나 Merkle schema는 규정하지 않습니다.</p></CitationBlock></div>
      <div id="paper-arkworks-crypto-primitives"><CitationBlock source="arkworks · crypto-primitives pinned 7816710" citeKey={2} href="https://github.com/arkworks-rs/crypto-primitives/tree/7816710fc19cd4d18d6239785dac8937d7b9b3ce"><p><strong>문제:</strong> Native/circuit hash·Merkle 구현 seam을 확인해야 합니다.</p><p><strong>기여:</strong> Source, gadgets와 tests의 pinned snapshot입니다.</p><p><strong>전제:</strong> Commit과 features/dependencies를 고정합니다.</p><p><strong>근거 범위:</strong> 선택 source/API behavior입니다.</p><p><strong>말하지 않는 것:</strong> 모든 parameter audit나 향후 호환성을 보장하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
