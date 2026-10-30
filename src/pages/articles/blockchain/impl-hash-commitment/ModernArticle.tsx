import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import HashMerkleImplementationViz, {
  HashBoundaryViz,
  PoseidonEncodingViz,
} from "./HashMerkleImplementationViz";
import ZkFromScratchLocator, {
  ZkFromScratchMapReturn,
} from "../impl-field-arithmetic/ZkFromScratchLocator";
import { zkHashTree } from "./fileTrees";
import { officialHashCodeRefs } from "./officialCodeRefs";

const ARK_SOURCE =
  "https://github.com/arkworks-rs/crypto-primitives/tree/7816710fc19cd4d18d6239785dac8937d7b9b3ce";
const FIPS_180 = "https://csrc.nist.gov/pubs/fips/180-4/upd1/final";

export default function ModernHashCommitmentArticle() {
  const sidebar = useCodeSidebar();

  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-5 scroll-mt-20">
        <ZkFromScratchLocator
          currentSlug="impl-hash-commitment"
          region="Hash 입력·Merkle 경로·commitment 의미"
          question="index 2의 c와 sibling 둘은 어떤 byte 순서로 root를 다시 계산합니까?"
        />

        <div>
          <p className="text-xs font-bold text-primary">이 글이 답할 질문</p>
          <h2 className="mt-2 max-w-4xl break-keep text-3xl font-bold">
            c 하나와 두 형제만으로 같은 Merkle root를 다시 만들 수 있습니까
          </h2>
          <p className="mt-3 max-w-3xl break-keep text-base leading-7 text-muted-foreground">
            설명용 네 leaf <code>a·b·c·d</code>에서 <code>c</code>는 index 2에 있습니다. Leaf와 inner
            node의 입력 형식을 고정하고 index bit <code>0→1</code>을 따라가면, sibling 두 개만으로 root
            <code>004b7b71…55d9c3</code>을 다시 계산할 수 있습니다.
          </p>
        </div>

        <HashMerkleImplementationViz />

        <p className="text-lg leading-8">
          <strong>Hash 함수 이름만 같다고 같은 tree가 되는 것은 아닙니다.</strong>{" "}
          어떤 bytes를 leaf 입력으로 만들었는지, leaf와 inner node를 어떻게 구분했는지, 각 level에서 sibling을
          왼쪽과 오른쪽 중 어디에 놓았는지가 모두 root의 일부입니다.
        </p>
        <p>
          충돌 저항성과 Merkle tree의 수학적 성질은{" "}
          <Link to="/cs/crypto/hash-theory" className="font-bold text-primary hover:underline">
            Hash 함수 정본
          </Link>
          과{" "}
          <Link to="/cs/crypto/merkle-tree" className="font-bold text-primary hover:underline">
            Merkle tree 정본
          </Link>
          이 설명합니다. 이 글은 그 성질이 Rust의 입력 형식, proof 경로, 검증 코드로 어떻게 이어지는지만
          추적합니다.
        </p>
        <ContentBoundary article="impl-hash-commitment" />
      </section>

      <section id="hash-api" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          update 호출을 나눠도 message bytes가 같으면 digest는 같습니다
        </h2>
        <HashBoundaryViz />
        <p>
          <code>hash(&quot;abc&quot;)</code>와 <code>update(&quot;a&quot;); update(&quot;bc&quot;); finalize()</code>는
          같은 순서의 세 byte를 흡수합니다. Streaming API의 chunk 경계는 전송과 메모리 관리의 경계이지,
          SHA-256 message에 들어가는 별도 표식이 아닙니다.
        </p>
        <ExplainedFormula
          question="One-shot과 두 번의 update가 언제 같은 digest를 냅니까?"
          idea={<>같은 초기 상태에서 같은 ordered bytes를 흡수하고 같은 padding과 bit length를 적용할 때 같습니다.</>}
          formula={String.raw`H(m_1\Vert m_2)=\operatorname{finalize}(\operatorname{update}(\operatorname{update}(IV,m_1),m_2))`}
          annotatedFormula={String.raw`\underbrace{H(m_1\Vert m_2)}_{\text{one-shot}}=\underbrace{\operatorname{finalize}}_{\text{padding·길이}}(\underbrace{\operatorname{update}(\operatorname{update}(IV,m_1),m_2)}_{\text{같은 순서의 bytes}})`}
          operations={[
            {
              expression: String.raw`m_1=\mathtt{a},\quad m_2=\mathtt{bc}`,
              annotation: ["이어 붙인 message는 abc입니다."],
            },
            {
              expression: String.raw`\operatorname{SHA256}(\mathtt{abc})=\mathtt{ba7816bf\ldots15ad}`,
              annotation: ["FIPS 180-4의 알려진 결과와 맞는지 확인합니다."],
            },
          ]}
          terms={[
            { symbol: "IV", name: "초기 상태", description: "SHA-256이 정한 초기 hash state입니다." },
            { symbol: String.raw`\Vert`, name: "이어 붙이기", description: "Chunk metadata 없이 bytes를 순서대로 잇습니다." },
            { symbol: "finalize", name: "마무리", description: "Padding과 전체 bit length를 적용해 digest를 냅니다." },
          ]}
          assumptions={[
            "두 경로가 정확히 같은 bytes와 SHA-256 variant를 사용합니다.",
            "호출자가 update에 전달한 buffer를 계약 밖에서 바꾸지 않습니다.",
            "finalize 이후 reset·clone·재사용 동작은 crate 문서와 타입을 따릅니다.",
          ]}
          interpretation="Known vector는 byte 처리의 상호 운용성을 확인합니다. SHA-256의 충돌 저항성을 새로 증명하는 테스트는 아닙니다."
        />
        <aside className="border-l-2 border-destructive/70 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">실패 동작:</strong> Buffer ownership을 어기거나 finalize 뒤 state를
          암묵적으로 재사용하면 같은 API처럼 보여도 다른 message를 hash할 수 있습니다. 구현은 이를 문서화하거나
          타입과 오류로 막아야 합니다.
        </aside>
        <div id="paper-fips-180-4-impl">
          <CitationBlock source="NIST · FIPS 180-4" citeKey={1} href={FIPS_180}>
            <p><strong>확인한 범위:</strong> SHA-256의 message schedule, padding, round와 digest 계산을 규정합니다.</p>
            <p><strong>한계:</strong> Rust ownership, Poseidon 입력 packing과 Merkle tree schema는 규정하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="poseidon-api" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Poseidon으로 바꾸면 bytes를 field elements로 옮기는 규칙이 하나 더 필요합니다
        </h2>
        <PoseidonEncodingViz />
        <p>
          이 절은 앞의 SHA-256 tree 다음에 Poseidon을 한 번 더 적용하라는 뜻이 아닙니다. 회로 친화적인 hash를
          선택했을 때 생기는 <strong>대체 구현 경로</strong>입니다. Poseidon permutation은 field elements를 받으므로,
          protocol이 bytes의 길이·endianness·chunk 폭·domain tag를 먼저 고정해야 합니다.
        </p>
        <ExplainedFormula
          question="01과 01 00이 같은 field value 1로 합쳐지는 일을 어떻게 막습니까?"
          idea={<>용도 tag와 원래 byte 길이를 별도 field element로 보존하고, 정한 폭으로 chunk를 canonical decode합니다.</>}
          formula={String.raw`E(b)=\bigl(\mathrm{tag},\ |b|,\ \operatorname{LE}_w(b_0),\ldots,\operatorname{LE}_w(b_k)\bigr)`}
          annotatedFormula={String.raw`E(b)=\bigl(\underbrace{\mathrm{tag}}_{\text{용도}},\ \underbrace{|b|}_{\text{byte 길이}},\ \underbrace{\operatorname{LE}_w(b_0),\ldots}_{\text{field chunks}}\bigr)`}
          operations={[
            {
              expression: String.raw`E(\mathtt{01})=(t,1,1)`,
              annotation: ["값은 1이고 원래 길이는 1 byte입니다."],
            },
            {
              expression: String.raw`E(\mathtt{01\ 00})=(t,2,1)`,
              annotation: ["값은 같아도 길이 element가 2라서 sequence가 다릅니다."],
            },
          ]}
          terms={[
            { symbol: "tag", name: "Domain tag", description: "같은 hash를 쓰는 다른 용도와 입력 공간을 나눕니다." },
            { symbol: "|b|", name: "Byte length", description: "Trailing zero와 마지막 chunk 길이를 보존합니다." },
            { symbol: "w", name: "Chunk width", description: "각 정수가 field modulus보다 작도록 profile이 정합니다." },
          ]}
          assumptions={[
            "Chunk width와 endianness를 protocol version에 고정합니다.",
            "Field decoder는 0≤x<p 범위의 canonical 값만 허용합니다.",
            "Parameter set, rate, capacity, round constants를 같은 profile에서 가져옵니다.",
          ]}
          interpretation="Poseidon은 byte encoding을 대신 정해 주지 않습니다. 서로 다른 bytes가 같은 field sequence가 되지 않도록 protocol이 경계를 소유합니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Poseidon permutation 코드"
            onClick={() => sidebar.open("ark-poseidon-permute", officialHashCodeRefs["ark-poseidon-permute"])}
          />
        </div>
      </section>

      <section id="merkle-api" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          index 2의 낮은 bit부터 읽으면 c의 좌우 위치가 정해집니다
        </h2>
        <p>
          이 글의 설명용 tree v1은 leaf를 <code>00 || u32be(length) || data</code>, inner node를
          <code>01 || left || right</code>로 hash합니다. 네 leaf <code>a·b·c·d</code>에서 c의 index는
          <code>2=10₂</code>입니다. 따라서 낮은 bit부터 <code>0</code>, <code>1</code> 순서로 읽습니다.
        </p>
        <ExplainedFormula
          question="c와 sibling H(d), H(a,b)로 root를 어떻게 다시 계산합니까?"
          idea={<>첫 level에서는 c가 left이고, 다음 level에서는 c·d subtree가 right입니다.</>}
          formula={String.raw`x_0=H(00\Vert1\Vert c),\quad x_1=H(01\Vert x_0\Vert H(d)),\quad r=H(01\Vert H(a,b)\Vert x_1)`}
          annotatedFormula={String.raw`\underbrace{x_0=H(00\Vert1\Vert c)}_{\text{leaf}},\quad \underbrace{x_1=H(01\Vert x_0\Vert H(d))}_{\text{bit 0: current left}},\quad \underbrace{r=H(01\Vert H(a,b)\Vert x_1)}_{\text{bit 1: current right}}`}
          operations={[
            {
              expression: String.raw`x_0=\mathtt{aa8d78cb\ldots1beb22e}`,
              annotation: ["c의 typed leaf input을 SHA-256으로 계산한 값입니다."],
            },
            {
              expression: String.raw`x_1=\mathtt{3d1f97dd\ldotsae1334}`,
              annotation: ["첫 bit 0이므로 current를 left, H(d)를 right에 둡니다."],
            },
            {
              expression: String.raw`r=\mathtt{004b7b71\ldots55d9c3}`,
              annotation: ["다음 bit 1이므로 H(a,b)를 left, current를 right에 둡니다."],
            },
          ]}
          terms={[
            { symbol: "00", name: "Leaf prefix", description: "Raw data leaf의 입력 공간을 표시합니다." },
            { symbol: "01", name: "Inner prefix", description: "두 child digest를 합치는 입력 공간을 표시합니다." },
            { symbol: "10₂", name: "Leaf index", description: "Level마다 current와 sibling의 좌우를 정합니다." },
            { symbol: "r", name: "계산한 root", description: "Expected root와 byte 단위로 비교할 최종 digest입니다." },
          ]}
          assumptions={[
            "Tree height, leaf 수, odd leaf 처리와 empty root를 schema에 고정합니다.",
            "Sibling 목록은 leaf에서 root로 올라가는 level 순서와 결속됩니다.",
            "Digest는 고정 길이이고 length와 index는 canonical encoding만 허용합니다.",
          ]}
          interpretation="Sibling 값만으로는 부족합니다. Index bit와 leaf·inner 입력 형식까지 같아야 verifier가 같은 root를 만듭니다."
        />
        <div className="not-prose flex flex-wrap gap-2">
          <CodeViewButton
            label="Merkle 타입 경계"
            onClick={() => sidebar.open("ark-merkle-config", officialHashCodeRefs["ark-merkle-config"])}
          />
          <CodeViewButton
            label="Proof 검증 코드"
            onClick={() => sidebar.open("ark-merkle-verify", officialHashCodeRefs["ark-merkle-verify"])}
          />
          <CodeViewButton
            label="좌우 선택 코드"
            onClick={() => sidebar.open("ark-merkle-order", officialHashCodeRefs["ark-merkle-order"])}
          />
        </div>
        <aside className="border-l-2 border-destructive/70 pl-4 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">실패 동작:</strong> Wrong index, 바뀐 sibling 순서, 잘못된 prefix,
          잘린 path와 다른 expected root는 false 또는 입력 오류로 끝나야 합니다. Verifier가 hash 크기순으로 child를
          정렬해 주면 ordered tree와 다른 schema를 검증하게 됩니다.
        </aside>
        <div id="paper-arkworks-crypto-primitives">
          <CitationBlock type="code" source="arkworks crypto-primitives · commit 7816710" citeKey={2} href={ARK_SOURCE}>
            <p><strong>확인한 범위:</strong> Config가 leaf/inner hash를 나누고, Path::verify가 index bit에 따라 child 순서를 정해 root와 비교합니다.</p>
            <p><strong>한계:</strong> 이 source가 이 글의 설명용 SHA-256 prefix schema를 정의하거나 모든 parameter의 안전성을 보증하지는 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="commitment-meaning" className="space-y-5 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">
          Root가 inclusion을 묶어도 leaf 내용을 자동으로 숨기지는 않습니다
        </h2>
        <p>
          Proof가 통과하면 <code>c</code>가 특정 schema와 root의 index 2에 포함됐다는 사실을 확인할 수 있습니다.
          하지만 leaf 후보가 작다면 공격자는 후보마다 같은 leaf hash와 path를 계산해 내용을 맞힐 수 있습니다.
          Hiding이 필요하면 salt, blinding 또는 별도 commitment scheme이 필요합니다.
        </p>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["포함", "이 leaf와 path가 expected root로 이어집니다."],
            ["결속", "충돌을 찾기 어렵다는 가정 아래 값을 바꾸기 어렵습니다."],
            ["은닉 아님", "작은 후보 집합은 사전 대입으로 맞힐 수 있습니다."],
          ].map(([title, body]) => (
            <div key={title} className="bg-background p-4">
              <strong className="text-sm text-primary">{title}</strong>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="evidence" className="space-y-4 scroll-mt-20">
        <h2 className="break-keep text-2xl font-bold">이 글에서 확인한 사실</h2>
        <ol className="space-y-3 text-sm leading-6">
          <li><strong>1.</strong> Streaming hash의 update 경계는 message bytes가 같으면 digest를 바꾸지 않습니다.</li>
          <li><strong>2.</strong> Poseidon을 선택하면 byte-to-field encoding을 protocol이 별도로 고정해야 합니다.</li>
          <li><strong>3.</strong> Merkle proof는 leaf schema, sibling, index bit를 함께 사용해 root를 다시 계산합니다.</li>
          <li><strong>4.</strong> Root가 inclusion과 결속을 제공해도 hiding을 자동 제공하지는 않습니다.</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          대상 crate 채택, 성능 측정, 배포와 rollback은 실제 workload와 운영 환경이 필요한 실무 판단이므로 이
          개념 글에 섞지 않습니다.
        </p>
      </section>

      <ZkFromScratchMapReturn
        currentSlug="impl-hash-commitment"
        closure="Rust Hash·Merkle 구현에서 digest는 algorithm 이름만으로 정해지지 않습니다. Message bytes, byte-to-field 규칙, leaf·inner schema와 index 방향이 함께 root를 결정하며, inclusion과 hiding은 서로 다른 성질입니다."
      />

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={officialHashCodeRefs}
        fileTrees={{ arkworks: zkHashTree }}
        projectMetas={{
          arkworks: {
            id: "arkworks",
            label: "arkworks · crypto-primitives 7816710",
            badgeClass: "border-violet-500 bg-violet-500/10 text-violet-700",
          },
        }}
      />
    </article>
  );
}
