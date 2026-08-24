import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import PoseidonRoundViz from "./PoseidonRoundViz";
import PoseidonSecurityShiftViz from "./viz/PoseidonSecurityShiftViz";

export default function ModernPoseidonArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Circuit-native hash</p><h2 className="text-3xl font-bold tracking-tight">Poseidon은 bytes용 hash가 아니라 field permutation profile에서 시작한다</h2></header>
      <p className="text-lg leading-8">SHA-2는 bit operations에 맞지만 arithmetic circuit에서는 많은 constraints가 듭니다. Poseidon은 prime field의 덧셈·거듭제곱·matrix multiplication으로 state를 섞어 circuit 비용을 낮춥니다. 다만 <code>p,t,rate,capacity,α,R_F,R_P,constants,MDS,domain</code> 전체가 고정되어야 하나의 primitive입니다.</p>
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm"><strong>핵심 아이디어:</strong> HADES schedule은 full rounds로 넓게 비선형화하고 partial rounds로 비선형 constraint 수를 줄인 뒤 매 round MDS로 영향을 확산합니다.</aside>
      <ContentBoundary article="poseidon-hash"/><PoseidonRoundViz/>
    </section>
    <section id="profile" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Parameter profile</p><h2 className="mt-2 text-2xl font-bold">같은 이름보다 같은 artifact hash가 중요하다</h2></header>
      <p>Field와 state width가 같아도 round constants나 MDS가 다르면 출력은 다릅니다. Sponge로 쓸 때 rate/capacity, padding, input length와 domain tag까지 profile ID에 넣습니다. “Poseidon on BN254”만 기록한 proof나 database root는 재현 가능한 protocol identifier가 아닙니다.</p>
    </section>
    <section id="rounds" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · S-box와 diffusion</p><h2 className="mt-2 text-2xl font-bold">왜 xᵅ가 permutation이어야 하는가</h2></header>
      <ExplainedFormula question="Prime field에서 power S-box x↦xᵅ가 정보를 잃지 않는 조건은?" idea={<>Nonzero field elements는 order p−1의 multiplicative group입니다. Exponent α가 이 group order와 coprime이면 inverse exponent가 존재해 입력을 복구할 수 있습니다.</>} formula={String.raw`\begin{aligned}\underbrace{\gcd(\alpha,p-1)=1}_{\text{group order와 coprime}}&\;\Longrightarrow\;\exists\,\alpha^{-1}\\\underbrace{\alpha\alpha^{-1}\equiv1\pmod{p-1}}_{\text{inverse exponent로 복구}}\end{aligned}`}
      annotatedFormula={String.raw`\begin{aligned}\underbrace{\gcd(\alpha,p-1)=1}_{\text{group order와 coprime}}&\;\Longrightarrow\;\exists\,\alpha^{-1}\\\underbrace{\underbrace{\alpha\alpha^{-1}\equiv1\pmod{p-1}}_{\text{inverse exponent로 복구}}}_{\text{Prime modulus 계산}}\end{aligned}`}
      operations={[
        { expression: String.raw`\underbrace{\alpha\alpha^{-1}\equiv1\pmod{p-1}}_{\text{inverse exponent로 복구}}`, annotation: ["Prime modulus이(가) 식의 결과에 기여하는 방식을","계산합니다.","Nonzero field elements는 order p−1의","multiplicative group입니다."] },
      ]} terms={[{symbol:"p",name:"Prime modulus",description:"Field F_p의 크기입니다."},{symbol:"α",name:"S-box exponent",description:"각 selected state word에 적용하는 power입니다."},{symbol:"α^{-1}",name:"Inverse exponent",description:"Nonzero elements에서 power map을 되돌립니다."}]} assumptions={["p는 prime이며 nonzero elements가 order p−1 group을 이룹니다.","0은 power map에서 0으로 고정합니다.","Bijection 조건은 전체 Poseidon cryptanalytic security의 필요 구성요소일 뿐 충분조건이 아닙니다."]} interpretation="F17, α=5이면 gcd(5,16)=1이고 inverse exponent는 13입니다. 5·13=65≡1 mod16이므로 (x^5)^13=x입니다. α=2이면 x와 −x의 square가 같아 permutation이 아닙니다."/>
      <ExplainedFormula question="한 toy full round에서 constant·S-box·MDS는 어떤 순서로 작동하는가?" idea={<>State에 round constants를 더하고 모든 words에 x⁵를 적용한 뒤 invertible matrix로 선형 혼합합니다. Partial round라면 S-box는 profile이 정한 한 word에만 적용합니다.</>} formula={String.raw`x' = M\,S_\alpha(x+c)\pmod p`}
      annotatedFormula={String.raw`x' = \underbrace{M\,S_\alpha(x+c)\pmod p}_{\text{Round constants 계산}}`}
      operations={[
        { expression: String.raw`M\,S_\alpha(x+c)\pmod p`, annotation: ["Round constants이(가) 식의 결과에 기여하는","방식을 계산합니다.","State에 round constants를 더하고 모든","words에 x⁵를 적용한 뒤 invertible"] },
      ]} terms={[{symbol:"c",name:"Round constants",description:"Symmetry를 깨는 profile-fixed field vector입니다."},{symbol:"S_α",name:"Power S-box layer",description:"Full/partial schedule에 따라 selected coordinates를 거듭제곱합니다."},{symbol:"M",name:"MDS layer",description:"Coordinates를 섞는 profile-fixed matrix입니다."}]} assumptions={["Toy p=17,t=2,α=5,c=(1,2), M=[[1,1],[1,2]]를 사용합니다.","M의 determinant 1은 invertibility를 보이지만 production MDS/security margin 전체를 증명하지 않습니다.","Round counts는 원 논문의 parameter generation과 최신 cryptanalysis를 따라야 합니다."]} interpretation="x=(3,4)에서 x+c=(4,6), fifth powers는 (4,7), matrix를 곱하면 (11,1) mod17입니다. 이는 계산 예일 뿐 production Poseidon instance가 아닙니다."/>
      <p><strong>증명 아이디어와 반례:</strong> Fp*의 generator g에 x=g^k를 쓰면 x^α=g^(αk)입니다. α multiplication이 mod p−1에서 invertible일 때만 k를 유일하게 복원합니다. gcd가 1이 아니면 kernel이 생겨 distinct inputs가 합쳐집니다.</p>
    </section>
    <section id="sponge-boundary" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Sponge와 byte 경계</p><h2 className="mt-2 text-2xl font-bold">Field elements가 아닌 bytes를 바로 넣었다고 말할 수 없다</h2></header>
      <p>Width 3, rate 2, capacity 1 profile은 두 field elements씩 흡수합니다. Arbitrary bytes는 chunk width·endianness·length delimiter·canonical residue check로 먼저 elements가 되어야 합니다. 이 serialization을 바꾸면 permutation이 같아도 hash protocol은 달라집니다. 일반 sponge 원리는 <a href="/crypto/hash-theory#constructions" className="text-primary underline">hash 정본</a>을 재사용합니다.</p>
    </section>
    <section id="security-direction" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Security margin과 방향 전환</p><h2 className="mt-2 text-2xl font-bold">Reduced-round 공격의 진전과 full-round break를 구분하고, hash를 바꿀지 prover를 바꿀지 다시 비교한다</h2></header>
      <p><strong>Security margin</strong>은 정확한 parameter profile의 전체 rounds와 알려진 공격 범위 사이의 여유를 평가하는 말입니다. 새 algebraic attack이 더 많은 reduced rounds를 다루면 여유가 줄 수 있지만, 곧바로 deployed full-round instance가 깨졌다는 뜻은 아닙니다. Field·width·S-box·linear layer·attack model을 함께 적어야 합니다.</p>
      <p>Poseidon의 선택 논리는 명확했습니다. SHA/BLAKE의 bit logic이 prime-field circuit에서 비싸므로 hash workload를 field-native하게 바꿉니다. 반대 방향은 기존 hash의 긴 cryptanalysis 역사와 생태계를 유지하고, <a className="text-primary underline" href="/crypto/binary-field-proving#overview">binary-field proving</a>처럼 proof layer를 Boolean workload에 맞춥니다.</p>
      <PoseidonSecurityShiftViz />
      <p>어느 쪽도 이름만으로 승리하지 않습니다. Exact primitive profile·known attacks·circuit constraints·prover wall time·memory·proof size·verifier cost·hardware와 audit maturity를 같은 statement에서 비교합니다.</p>
      <div id="paper-poseidon-cryptanalysis"><CitationBlock source="Algebraic cryptanalysis of Poseidon" citeKey={3} href="https://eprint.iacr.org/2023/537.pdf"><p><strong>문제:</strong> Poseidon 계열의 algebraic structure에 대한 reduced-round attack 범위를 분석합니다.</p><p><strong>기여:</strong> 기존 분석보다 강화된 cryptanalytic techniques와 적용 범위를 제시합니다.</p><p><strong>전제:</strong> 논문이 고정한 variant·parameters·round definition·attack model로 읽습니다.</p><p><strong>근거 범위:</strong> 명시된 reduced-round analysis입니다.</p><p><strong>말하지 않는 것:</strong> 모든 production Poseidon/Poseidon2 profile의 full-round break를 뜻하지 않습니다.</p></CitationBlock></div>
    </section>
    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">05 · Release gate</p><h2 className="mt-2 text-2xl font-bold">공식 vectors와 native/circuit parity가 먼저다</h2></header>
      <p>Parameter artifact hash, field/width/rounds/constants/MDS/domain을 receipt에 둡니다. Zero·one·p−1, permutation inverse, wrong constant/profile/domain, noncanonical field, byte packing ambiguity, native/circuit output mismatch를 주입한 뒤 constraints·prove time·memory를 같은 backend에서 비교합니다.</p>
      <div id="paper-poseidon"><CitationBlock source="Grassi et al. · Poseidon" citeKey={1} href="https://eprint.iacr.org/2019/458.pdf"><p><strong>문제:</strong> ZK circuits에서 bit-oriented hash가 비쌉니다.</p><p><strong>기여:</strong> HADES strategy와 field S-box, parameter/security 분석을 제시합니다.</p><p><strong>전제:</strong> 논문의 field·round·linear-layer generation과 attack model을 씁니다.</p><p><strong>근거 범위:</strong> Poseidon construction과 논문 cost/security 분석입니다.</p><p><strong>말하지 않는 것:</strong> 임의 constants나 축소 rounds의 안전성을 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-poseidon2-source"><CitationBlock source="HorizenLabs · poseidon2 pinned 055bde3" citeKey={2} href="https://github.com/HorizenLabs/poseidon2/tree/055bde3f4782731ba5f5ce5888a440a94327eaf3"><p><strong>문제:</strong> 실제 field/width parameter와 source seam을 확인해야 합니다.</p><p><strong>기여:</strong> Poseidon2 Rust source snapshot을 제공합니다.</p><p><strong>전제:</strong> Commit과 feature/field를 고정합니다.</p><p><strong>근거 범위:</strong> 선택 source와 vectors입니다.</p><p><strong>말하지 않는 것:</strong> 원 Poseidon 호환이나 모든 profile audit를 뜻하지 않습니다.</p></CitationBlock></div>
    </section>
  </article>;
}
