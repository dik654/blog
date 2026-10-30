import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { prysmTree } from "./fileTrees";
import PrysmBlsLocator, { PrysmBlsMapReturn } from "./PrysmBlsLocator";
import PrysmBlsFlowViz from "./viz/PrysmBlsFlowViz";

const Label = ({ children }: { children: ReactNode }) => (
  <span className="mr-2 inline-flex border border-primary/40 px-1.5 py-0.5 font-mono text-[9px] font-black text-primary">{children}</span>
);

const objectRoot = "9dfd6779b1e33a1a16a8cc4ed8094d0ef5529b63c45bffc39afe8d79410832cc";
const signingRoot = "740450ab9681b33c9130b6c2e66a16888eb6d8d4f6f0f433009571b1e405ae86";
const publicKey = "8ce3b57b791798433fd323753489cac9bca43b98deaafaed91f4cb010730ae1e38b186ccd37a09b8aed62ce23b699c48";
const signature = "b6bdcc36047c45d492a6dfd582d1cd5dfae412a93a9ae676b4cb315432bbc2558954a47899f92b4143e76a2120cbe68e17b9a6ea8d1632b67f9caa1d2dd8edf499599902228dc1701c169ead2c1c4eca00ca2f91e7c559e1e7160e769306e728";

export default function ModernArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <PrysmBlsLocator />
        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 break-keep text-3xl font-bold">
            SSZ Root는 어떻게 BLS 서명으로 검증됩니까?
          </h2>
        </div>
        <PrysmBlsFlowViz />
        <p className="text-lg leading-8">
          <Label>A</Label>Object root와 consensus domain을 SSZ <code>SigningData</code>로 묶어 32-byte signing root를 먼저 만듭니다. Prysm은 public key와 signature bytes를 올바른 curve point로 검증한 뒤, BLST의 pairing으로 key·signing root·signature 관계를 판정합니다.
        </p>
        <p>
          같은 signing root에 서명한 여러 validator의 signature는 하나의 96-byte aggregate signature로 더할 수 있습니다. 반대로 서로 다른 signing root의 독립 서명을 함께 확인하는 batch verification은 aggregate signature와 다른 계산입니다.
        </p>
        <p>
          이 글은 <Link to="/cs/blockchain/prysm#overview">Prysm 전체 구조</Link>에서 SSZ commitment가 validator authorization으로 바뀌는 경계만 엽니다.
        </p>
        <ContentBoundary article="prysm-bls" />
      </section>

      <section id="case" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">직전 SSZ Root에 설명용 Domain과 Secret Scalar 42를 사용합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Prysm BLS 설명용 fixture">
          {[
            ["Object root", "9dfd…32cc", "직전 SSZ 글의 32-byte root"],
            ["Domain", "00…00", "계산용 zero domain · 32 B"],
            ["Secret scalar", "42", "설명용 값 · 실제 validator key 아님"],
          ].map(([label, value, detail]) => (
            <div key={label} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep text-sm">{value}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <p>
          Object root는 <Link to="/cs/blockchain/prysm-ssz#merkleize">Prysm SSZ 글</Link>에서 계산한 DemoRecord의 결과입니다. Domain을 모두 0인 32 bytes로 둔 것은 signing-root 계산을 눈으로 확인하기 위한 가정입니다. 실제 Ethereum domain은 duty type, fork version과 genesis validators root에서 만들어지므로 이 값을 실제 서명에 사용하면 안 됩니다.
        </p>
      </section>

      <section id="signing-root" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Object Root와 Domain을 묶어 Signing Root를 만듭니다</h2>
        <ExplainedFormula
          question="이번 설명용 signing root는 어떤 32 bytes입니까?"
          idea="SigningData는 두 Bytes32 field를 가진 SSZ container입니다. 두 field root를 좌우 leaf에 두고 SHA-256으로 한 번 묶습니다."
          formula={String.raw`r_s=H(r_o\|d)=\mathtt{740450ab\ldots05ae86}`}
          annotatedFormula={String.raw`r_s=\underbrace{H}_{\text{SSZ SHA-256}}(\underbrace{r_o}_{\text{object root 32 B}}\|\underbrace{d}_{\text{domain 32 B}})=\mathtt{740450ab\ldots05ae86}`}
          operations={[
            { expression: String.raw`r_o`, annotation: ["DemoRecord의 hash-tree-root", "32 bytes", "9dfd…32cc"] },
            { expression: String.raw`d`, annotation: ["설명용 zero domain", "32 bytes", "실제 duty domain 아님"] },
            { expression: String.raw`H(r_o\|d)`, annotation: ["두 Bytes32 field의 container root", "SHA-256 입력 64 bytes", "signing root 740450ab…05ae86"] },
          ]}
          terms={[
            { symbol: "r_o", name: "Object root", description: "서명할 consensus object의 SSZ hash-tree-root입니다." },
            { symbol: "d", name: "Consensus domain", description: "Duty 종류와 fork·chain 문맥을 서명에 결속하는 32-byte 값입니다." },
            { symbol: "r_s", name: "Signing root", description: "BLS Sign과 Verify가 실제 message bytes로 받는 32-byte 값입니다." },
          ]}
          assumptions={["SigningData field 순서는 object_root, domain입니다.", "두 값은 이미 Bytes32입니다.", "Zero domain은 계산 fixture이며 protocol domain이 아닙니다."]}
          interpretation={`전체 signing root는 ${signingRoot}입니다. 같은 object root라도 domain이 바뀌면 다른 signing root가 됩니다.`}
        />
        <div className="not-prose border-l-2 border-primary/45 pl-4">
          <span className="text-[9px] font-bold text-muted-foreground">계산 입력</span>
          <code className="mt-1 block break-all text-[10px] leading-5">object root = {objectRoot}</code>
          <code className="block break-all text-[10px] leading-5">domain = {"00".repeat(32)}</code>
        </div>
      </section>

      <section id="point-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">48 Bytes와 96 Bytes를 검증된 Point로 바꿉니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3" aria-label="Compressed bytes가 BLST point가 되는 경계">
          {[
            ["Public key", "48 B compressed G1", "Uncompress → canonical → subgroup → non-infinity"],
            ["Signature", "96 B compressed G2", "Uncompress → canonical → subgroup"],
            ["Prysm wrapper", "Validated typed value", "검사된 point만 Verify·Aggregate에 전달"],
          ].map(([name, size, checks]) => (
            <div key={name} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{name}</span>
              <strong className="mt-1 block break-keep text-xs">{size}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{checks}</p>
            </div>
          ))}
        </div>
        <p>
          길이가 맞는다는 사실은 시작 조건일 뿐입니다. Prysm v7.3.1은 public key를 uncompress한 뒤 <code>KeyValidate()</code>로 subgroup과 infinity를 확인합니다. Signature는 <code>SigValidate(false)</code>로 group을 확인합니다.
        </p>
        <p>
          Aggregate signature가 infinity가 될 수 있어 signature 경로는 infinity를 별도 의미로 다룹니다. 빈 public-key 목록을 받는 Ethereum wrapper도 따로 정의돼 있습니다.
        </p>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("bls-point-validation", codeRefs["bls-point-validation"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1의 public key·signature decode와 group check</span>
        </div>
      </section>

      <section id="sign-verify" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Pairing은 Secret Scalar를 복구하지 않고 관계를 비교합니다</h2>
        <ExplainedFormula
          question="Public key와 signature가 같은 secret scalar와 signing root에서 나왔는지 어떻게 확인합니까?"
          idea="Public key는 G1 generator에, signature는 signing root를 G2로 옮긴 point에 같은 scalar를 곱합니다. Pairing의 bilinearity가 두 관계를 GT에서 같게 만듭니다."
          formula={String.raw`PK=skG_1,\quad \sigma=skH(r_s),\quad e(G_1,\sigma)=e(PK,H(r_s))`}
          annotatedFormula={String.raw`\underbrace{PK}_{\text{48-byte G1 key}}=\underbrace{sk}_{42}\underbrace{G_1}_{\text{generator}},\quad \underbrace{\sigma}_{\text{96-byte G2 signature}}=sk\underbrace{H(r_s)}_{\text{POP DST로 hash-to-curve}},\quad \underbrace{e(G_1,\sigma)}_{\text{signature 쪽}}=\underbrace{e(PK,H(r_s))}_{\text{key·message 쪽}}`}
          operations={[
            { expression: String.raw`skG_1`, annotation: ["설명용 scalar 42", "G1 public key point", "compressed 48 bytes"] },
            { expression: String.raw`skH(r_s)`, annotation: ["signing root를 POP DST로 G2에 매핑", "같은 scalar 42를 곱함", "compressed signature 96 bytes"] },
            { expression: String.raw`e(G_1,\sigma)=e(PK,H(r_s))`, annotation: ["Verifier는 sk를 받지 않음", "두 scalar 관계만 비교", "같으면 signature relation PASS"] },
          ]}
          terms={[
            { symbol: "sk", name: "Secret scalar", description: "Validator만 소유하는 1 이상 subgroup order 미만의 수입니다." },
            { symbol: "H", name: "Hash-to-curve", description: "Prysm의 POP ciphersuite DST로 signing-root bytes를 G2 point에 옮깁니다." },
            { symbol: "e", name: "Pairing", description: "G1과 G2의 scalar 관계를 target group GT에서 비교하는 bilinear map입니다." },
          ]}
          assumptions={["Public key와 signature는 point validation을 통과했습니다.", "DST는 BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_입니다.", "Message는 위에서 계산한 32-byte signing root입니다."]}
          interpretation="Equality가 참이면 주어진 public key·signing root·signature 관계가 맞습니다. Validator가 그 duty를 수행할 권한이 있었는지와 object 내용이 상태 전이를 통과하는지는 별도 검사입니다."
        />
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2" aria-label="설명용 BLS public key와 signature">
          <div className="min-w-0 bg-background p-4">
            <span className="text-[9px] font-bold text-muted-foreground">Public key · 48 B</span>
            <code className="mt-2 block break-all text-[10px] leading-5 text-primary">{publicKey}</code>
          </div>
          <div className="min-w-0 bg-background p-4">
            <span className="text-[9px] font-bold text-muted-foreground">Signature · 96 B</span>
            <code className="mt-2 block break-all text-[10px] leading-5 text-primary">{signature}</code>
          </div>
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("bls-sign-verify", codeRefs["bls-sign-verify"])} />
          <span className="text-xs text-muted-foreground">Prysm v7.3.1이 같은 DST로 Sign과 Verify를 호출하는 경계</span>
        </div>
      </section>

      <section id="aggregation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">같은 Signing Root의 Signature를 더해도 결과는 96 Bytes입니다</h2>
        <ExplainedFormula
          question="세 validator가 같은 signing root에 서명하면 검증식은 어떻게 줄어듭니까?"
          idea="같은 message point에 서로 다른 scalar를 곱한 signature를 더하면 scalar 합을 한 번 곱한 것과 같습니다. Public key도 같은 순서로 더해 하나의 pairing 관계로 검사합니다."
          formula={String.raw`\sigma_A=\sum_{i=1}^{3}\sigma_i,\quad PK_A=\sum_{i=1}^{3}PK_i,\quad e(G_1,\sigma_A)=e(PK_A,H(r_s))`}
          annotatedFormula={String.raw`\underbrace{\sigma_A}_{\text{aggregate signature 96 B}}=\sum_{i=1}^{3}\underbrace{\sigma_i}_{\text{same }r_s},\quad \underbrace{PK_A}_{\text{aggregate key}}=\sum_{i=1}^{3}PK_i,\quad e(G_1,\sigma_A)=e(PK_A,H(r_s))`}
          operations={[
            { expression: String.raw`\sum_{i=1}^{3}\sigma_i`, annotation: ["세 signature는 모두 같은 signing root", "G2 point addition", "compressed 결과는 여전히 96 bytes"] },
            { expression: String.raw`\sum_{i=1}^{3}PK_i`, annotation: ["같은 세 참여자의 public key", "G1 point addition", "aggregation bits가 참여자 목록을 보존"] },
          ]}
          terms={[
            { symbol: String.raw`\sigma_A`, name: "Aggregate signature", description: "여러 G2 signature point를 더한 하나의 G2 point입니다." },
            { symbol: String.raw`PK_A`, name: "Aggregate public key", description: "같은 signing root에 참여한 validator public key를 더한 G1 point입니다." },
          ]}
          assumptions={["세 signature가 정확히 같은 signing root를 사용합니다.", "각 public key는 key validation과 protocol 등록 전제를 충족합니다.", "참여자 목록은 aggregate signature 밖의 consensus 자료로 보존됩니다."]}
          interpretation="Signature payload는 세 개 288 bytes에서 aggregate 하나 96 bytes로 줄지만 참여자 정보와 public key 검증 비용이 사라지는 것은 아닙니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("bls-fast-aggregate", codeRefs["bls-fast-aggregate"])} />
          <span className="text-xs text-muted-foreground">Prysm의 같은-message FastAggregateVerify 경로</span>
        </div>
        <p>
          같은 slot이라는 이유만으로 같은 signing root가 되지는 않습니다. Attestation data나 domain이 하나라도 다르면 public key를 먼저 하나로 더하는 FastAggregateVerify 전제가 깨집니다. 그 경우 각 <code>(public key, signing root)</code> 쌍을 보존하는 AggregateVerify 또는 독립 signature batch 경로가 필요합니다.
        </p>
        <p>
          Public key를 합치는 경로에는 각 key의 secret을 실제로 소유한다는 등록 전제도 필요합니다. Prysm이 사용하는 Proof-of-Possession ciphersuite는 rogue-key 공격을 막기 위한 경계를 제공하지만, runtime의 aggregate signature 하나가 과거의 key 등록과 참여자 목록까지 대신 증명하지는 않습니다.
        </p>
      </section>

      <section id="batch-verification" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">서로 다른 Signature 식은 무작위 가중 Batch로 함께 검사합니다</h2>
        <ExplainedFormula
          question="서로 다른 signing root 세 개를 한 batch에서 검사할 때 왜 무작위 계수가 필요합니까?"
          idea="Prysm은 verifier가 새로 뽑은 nonzero scalar를 각 독립 signature 식에 곱한 뒤 하나의 관계로 묶습니다. 입력자가 오류끼리 상쇄되는 batch를 미리 고르기 어렵게 합니다."
          formula={String.raw`\sigma_r=\sum_{i=1}^{3}r_i\sigma_i,\quad e(G_1,\sigma_r)=\prod_{i=1}^{3}e(r_iPK_i,H(r_{s,i}))`}
          annotatedFormula={String.raw`\underbrace{\sigma_r}_{\text{무작위 가중 signature 합}}=\sum_{i=1}^{3}\underbrace{r_i}_{\text{새 nonzero scalar}}\sigma_i,\quad e(G_1,\sigma_r)=\prod_{i=1}^{3}e(\underbrace{r_iPK_i}_{\text{같은 가중치}},H(r_{s,i}))`}
          operations={[
            { expression: String.raw`r_i`, annotation: ["Prysm RNG가 각 item마다 생성", "0을 피하도록 마지막 bit를 설정", "BLST 호출은 randBitsEntropy=64"] },
            { expression: String.raw`\sum r_i\sigma_i`, annotation: ["서로 다른 세 signature를 가중", "각 signing root는 그대로 보존", "전체 관계를 한 번에 판정"] },
          ]}
          terms={[
            { symbol: String.raw`r_i`, name: "Random coefficient", description: "각 독립 검증식에 이번 호출에서 배정하는 nonzero challenge scalar입니다." },
            { symbol: String.raw`r_{s,i}`, name: "Signing root i", description: "각 public key와 signature가 결속된 32-byte message입니다." },
          ]}
          assumptions={["Signature·public key·message 배열 길이가 같습니다.", "Public key는 앞에서 이미 검증됐고 signature는 batch uncompress 뒤 group check합니다.", "Random coefficient는 공격자가 입력을 고를 때 예측할 수 없습니다."]}
          interpretation="Batch PASS는 묶인 관계를 함께 받아들일 근거지만, Batch FAIL만으로 어느 item이 잘못됐는지는 알 수 없습니다."
        />
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton onClick={() => sidebar.open("bls-multiple-verify", codeRefs["bls-multiple-verify"])} />
          <CodeViewButton onClick={() => sidebar.open("bls-verbose-fallback", codeRefs["bls-verbose-fallback"])} />
          <span className="text-xs text-muted-foreground">무작위 가중 검증과 실패 뒤 개별 확인은 서로 다른 단계입니다.</span>
        </div>
        <p>
          Prysm의 <code>SignatureBatch.VerifyVerbosely()</code>는 먼저 batch 전체를 검사하고, 실패하면 각 signature를 단일 Verify로 다시 확인해 설명과 invalid item을 모읍니다. 이 동작은 실패 원인을 찾지만 공격 입력에서 추가 계산을 발생시킵니다. 어떤 batch 크기와 fallback 정책이 운영 deadline을 지키는지는 이 개념 글이 정할 수 없으며 실제 workload를 고정한 실무 실험의 질문입니다.
        </p>
      </section>

      <section id="implementation" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">Prysm Wrapper와 BLST가 맡는 검사를 나눕니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["Consensus layer", "Object root·domain·participant", "어떤 signing root와 key를 검사할지 정합니다."],
            ["Prysm Go wrapper", "길이·typed error·batch·fallback", "검증된 입력 배열과 실패 의미를 관리합니다."],
            ["BLST 0.3.16", "Point·hash-to-curve·pairing", "BLS12-381 연산과 group check를 실행합니다."],
          ].map(([layer, state, role]) => (
            <div key={layer} className="min-w-0 bg-background p-4">
              <span className="text-[9px] font-bold text-muted-foreground">{layer}</span>
              <strong className="mt-1 block break-keep text-xs">{state}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{role}</p>
            </div>
          ))}
        </div>
        <p>
          Prysm v7.3.1의 <code>go.mod</code>는 <code>github.com/supranational/blst v0.3.16</code>을 고정합니다. BLST가 public-key group check 결과를 호출자가 cache할 수 있다고 문서화하더라도, Prysm의 실제 안전 경계는 해당 wrapper가 언제 <code>KeyValidate</code>, <code>SigValidate</code>와 <code>Verify</code>를 호출하는지 함께 봐야 알 수 있습니다.
        </p>
      </section>

      <section id="failure-boundary" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">BLS PASS는 Consensus Object 전체의 PASS가 아닙니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-4">
          {[
            ["SSZ", "Object → root", "Schema·bytes·Merkle"],
            ["Domain", "Root → signing root", "Duty·fork·chain"],
            ["BLS", "Key·root·signature", "Point·pairing relation"],
            ["Consensus", "Signed object → state", "Duty·transition·fork choice·slashing"],
          ].map(([step, meaning, guard]) => (
            <div key={step} className="min-w-0 bg-background p-4">
              <span className="font-mono text-[9px] font-black text-primary">{step}</span>
              <strong className="mt-1 block break-keep text-xs">{meaning}</strong>
              <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{guard}</p>
            </div>
          ))}
        </div>
        <p>
          잘못된 point encoding은 BLST 경계에서 닫히고, 잘못된 domain은 같은 object root라도 다른 signing root를 만들어 BLS 검증에서 닫힙니다. 그러나 올바른 validator가 올바르게 서명한 object라도 state transition precondition을 어기거나 slashable한 이중 서명일 수 있습니다. 그 판정은 서명 라이브러리가 아니라 consensus state와 규칙을 읽는 다음 계층이 소유합니다.
        </p>
      </section>

      <section id="evidence" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">고정한 규격과 Release에서 확인한 범위만 사용합니다</h2>
        <CitationBlock citeKey={1} source="Ethereum consensus-specs v1.6.1 @ 5fa6edcc" href="https://github.com/ethereum/consensus-specs/tree/5fa6edcca8ab4cf548653e6680b17b9d3e04d225">
          <p><Label>O</Label><code>compute_signing_root</code>, domain과 Ethereum BLS interface가 consensus object를 32-byte message에 결속하는 규칙을 확인했습니다.</p>
          <p><strong>범위:</strong> Protocol message와 consensus 검증 경계입니다. BLST wrapper의 cache나 처리량을 정하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={2} source="CFRG BLS Signatures draft-06 · 2025-11-02" href="https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-bls-signature-06">
          <p><Label>O</Label>KeyValidate, Sign, Verify, AggregateVerify, POP와 FastAggregateVerify의 algorithm contract를 확인했습니다.</p>
          <p><strong>범위:</strong> Prysm·BLST가 호환 대상으로 명시한 revision입니다. 2026-05-06 만료된 Internet-Draft이며 현재 최신 revision 07을 Prysm v7.3.1의 구현 근거로 소급하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={3} type="code" source="OffchainLabs Prysm v7.3.1 @ 96d418cd" href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/crypto/bls">
          <p><Label>O</Label>POP DST, point validation, Sign·Verify·FastAggregateVerify·VerifyMultipleSignatures와 verbose fallback의 실제 Go 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> 이 release의 source와 <code>blst v0.3.16</code> dependency입니다. 다른 release의 함수나 성능을 일반화하지 않습니다.</p>
        </CitationBlock>
        <CitationBlock citeKey={4} type="code" source="Supranational BLST v0.3.16 @ e7f90de5" href="https://github.com/supranational/blst/tree/e7f90de551e8df682f3cc99067d204d8b90d27ad">
          <p><Label>O</Label>BLS12-381 point·pairing API, caller-owned public-key group check와 threading·memory-management 경계를 확인했습니다.</p>
          <p><strong>범위:</strong> Cryptographic primitive와 binding contract입니다. Prysm의 consensus object·domain·batch policy를 소유하지 않습니다.</p>
        </CitationBlock>
        <p><Label>M</Label>설명용 object root와 zero domain에서 signing root <code>{signingRoot}</code>를 계산하고, scalar 42와 POP DST로 위 public key·signature를 만든 뒤 관계가 참임을 독립 계산했습니다. Mainnet key, 실제 duty domain, 처리량과 latency는 측정하지 않았습니다.</p>
      </section>

      <section id="self-check" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">확인 질문</h2>
        <ol className="space-y-3 pl-5 text-sm leading-6">
          <li>같은 object root라도 domain이 바뀌면 기존 signature를 재사용할 수 없는 이유는 무엇입니까? <strong>(답: BLS message가 object root 자체가 아니라 object root와 domain을 묶은 signing root이기 때문입니다.)</strong></li>
          <li>Public key 48 bytes와 signature 96 bytes의 길이가 맞아도 바로 Verify할 수 없는 이유는 무엇입니까? <strong>(답: Canonical point decode, curve·subgroup과 key의 non-infinity 검사가 먼저 필요하기 때문입니다.)</strong></li>
          <li>FastAggregateVerify와 MultipleAggregateVerify의 입력 조건은 어떻게 다릅니까? <strong>(답: 전자는 여러 public key가 같은 signing root에 만든 aggregate signature를 검사하고, 후자는 서로 다른 signing root의 독립 signature 식을 무작위 가중해 함께 검사합니다.)</strong></li>
          <li>Batch가 실패했을 때 어느 signature가 틀렸는지 곧바로 알 수 없는 이유는 무엇입니까? <strong>(답: 여러 식을 하나의 가중 관계로 합친 결과만 거짓이므로 Prysm은 verbose fallback에서 각 식을 다시 Verify합니다.)</strong></li>
        </ol>
      </section>

      <PrysmBlsMapReturn />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ prysm: prysmTree }}
        projectMetas={{
          prysm: { id: "prysm", label: "Prysm v7.3.1 · Go", badgeClass: "bg-violet-500/10 border-violet-500 text-violet-700" },
        }}
      />
    </article>
  );
}
