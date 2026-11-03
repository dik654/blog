import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MerkleDAGViz from "./viz/MerkleDAGViz";

export default function MerkleDAG() {
  return (
    <section id="merkle-dag" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Merkle DAG는 child CID를 parent bytes에 넣어 root 하나로 아래 구조를
        묶습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>
            Leaf가 바뀌면 그 CID를 적어 둔 parent bytes가 바뀌고, 이 변화가 root
            CID까지 올라갑니다.
          </strong>{" "}
          반대로 바뀌지 않은 sibling block은 같은 CID로 그대로 재사용할 수
          있습니다.
        </p>
        <p>
          같은 사례를 이어 가겠습니다. Project root는 raw <code>hello</code>
          readme block과 <code>src</code> directory를 가리킵니다. src는 다시
          <code>lib.rs</code>를 가리킵니다. 여기서 lib.rs v1을 v2로 한 번
          수정합니다. 그림의 <code>C_lib1</code> 같은 표기는 긴 CID 대신 흐름을
          읽기 위한 축약 이름입니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <MerkleDAGViz />
      </div>
      <ExplainedFormula
        question="lib.rs 하나를 고쳤는데 왜 project root까지 새 CID가 될까요?"
        idea="Leaf CID가 parent의 serialized bytes 안에 들어 있기 때문입니다. Child link가 달라지면 parent bytes와 그 digest도 달라집니다."
        formula={String.raw`\begin{aligned}
c_L &= \operatorname{CID}(b_L),\\
b_P &= \operatorname{Encode}(data_P,[c_L,c_2,\ldots]),\\
c_P &= \operatorname{CID}(b_P).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
c_L &= \underbrace{\operatorname{CID}(b_L)}_{\text{lib.rs leaf 주소}},\\
b_P &= \operatorname{Encode}(\underbrace{data_P}_{\text{parent 자체 값}},\underbrace{[c_L,c_2,\ldots]}_{\text{child CID link 목록}}),\\
c_P &= \underbrace{\operatorname{CID}(b_P)}_{\text{link까지 포함한 parent 주소}}.
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\operatorname{CID}(b_L)`,
            annotation: [
              "lib.rs v1 bytes는 C_lib1을 만듭니다",
              "한 byte를 고친 v2 bytes는 C_lib2를 만듭니다",
            ],
          },
          {
            expression: String.raw`\operatorname{Encode}(data_P,[c_L,c_2,\ldots])`,
            annotation: [
              "src directory의 자체 값과 child CID를 직렬화합니다",
              "C_lib1이 C_lib2로 바뀌면 parent bytes도 바뀝니다",
            ],
          },
          {
            expression: String.raw`\operatorname{CID}(b_P)`,
            annotation: [
              "새 src bytes가 C_src2를 만듭니다",
              "Root에 C_src2가 들어가 C_root2까지 이어집니다",
              "안 바뀐 hello block CID는 그대로입니다",
            ],
          },
        ]}
        terms={[
          {
            symbol: "b_L, c_L",
            name: "Leaf bytes and CID",
            description:
              "lib.rs 같은 leaf block의 bytes와 content address입니다.",
          },
          {
            symbol: "data_P",
            name: "Parent local data",
            description: "Directory metadata처럼 parent가 직접 가진 값입니다.",
          },
          {
            symbol: "[c_L,c_2,…]",
            name: "Child links",
            description: "Parent encoding 안에 들어가는 child CID 목록입니다.",
          },
          {
            symbol: "b_P, c_P",
            name: "Parent bytes and CID",
            description:
              "Child links까지 직렬화한 bytes와 그 content address입니다.",
          },
        ]}
        assumptions={[
          "Node codec의 canonical encoding과 link order·metadata 규칙을 고정해야 합니다.",
          "같은 file bytes라도 chunking이 다르면 leaf 경계와 root CID가 달라질 수 있습니다.",
          "Root CID는 포함된 bytes의 무결성을 묶지만 누락 block의 availability나 publisher identity를 보장하지 않습니다.",
        ]}
        interpretation="C_lib1→C_lib2, C_src1→C_src2, C_root1→C_root2 순서로 새 CID가 생깁니다. raw hello block은 바뀌지 않았으므로 두 root가 같은 block을 공유합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          여기서 “같은 root”가 뜻하는 범위는 생각보다 좁습니다. 같은
          사용자-visible file이라도 256 KiB 고정 chunk와 content-defined
          chunking은 leaf 경계를 다르게 만들 수 있습니다. DAG-PB와 DAG-CBOR도
          parent bytes가 다릅니다. Root CID는 같은 encoding pipeline으로 만든
          graph bytes의 identity입니다.
        </p>
      </div>
      <CitationBlock
        source="IPLD — A Terse, Quick Primer for the Engineer"
        citeKey={2}
        href="https://ipld.io/docs/intro/primer/"
      >
        <p id="paper-ipld-primer" className="text-sm leading-6">
          IPLD의 Block·Node·Link 구분과 CID link가 block을 가리키는 경계를
          사용합니다. 특정 chunker나 codec이 언제나 최적이라는 성능 결론은 이
          문서에서 가져오지 않습니다.
        </p>
      </CitationBlock>
    </section>
  );
}
