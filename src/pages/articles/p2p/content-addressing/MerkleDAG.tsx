import ExplainedFormula from "@/components/ui/explained-formula";
import MerkleDAGViz from "./viz/MerkleDAGViz";

export default function MerkleDAG() {
  return (
    <section id="merkle-dag" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Merkle DAG는 child CID를 parent bytes에 넣어 전체 구조를 root에
        커밋합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          큰 directory를 한 block으로 hash하면 작은 파일 하나를 읽거나 바꿀 때도
          전체를 다시 처리해야 합니다. Merkle DAG(해시 링크가 있는 방향성 비순환
          그래프)는 data를 block으로 나누고 parent node의 canonical bytes에
          child CID를 link로 넣습니다. Root CID 하나를 알면 내려가는 각 edge마다
          받은 child bytes를 검증할 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <MerkleDAGViz />
      </div>
      <ExplainedFormula
        question="Leaf 한 개가 바뀌면 왜 root CID까지 달라질까요?"
        idea={
          <>
            Leaf bytes의 digest가 바뀌면 leaf CID가 바뀌고, 그 CID를 포함한
            parent encoding도 달라집니다. 같은 계산이 ancestor마다 반복되어
            root까지 전파됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
c_L &= \operatorname{CID}(b_L),\\
b_P &= \operatorname{Encode}(data_P,[c_L,c_2,\ldots]),\\
c_P &= \operatorname{CID}(b_P).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
c_L &= \underbrace{\operatorname{CID}(b_L),}_{\text{오른쪽 항으로 결과 계산}}\\
b_P &= \underbrace{\operatorname{Encode}(data_P,[c_L,c_2,\ldots]),}_{\text{parent local data 계산}}\\
c_P &= \underbrace{\operatorname{CID}(b_P).}_{\text{오른쪽 항으로 결과 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\operatorname{CID}(b_L),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Leaf bytes의 digest가 바뀌면 leaf CID가","바뀌고, 그 CID를 포함한 parent encoding도","달라집니다."] },
          { expression: String.raw`\operatorname{Encode}(data_P,[c_L,c_2,\ldots]),`, annotation: ["parent local data이(가) 식의 결과에 기여하는","방식을 계산합니다.","Leaf bytes의 digest가 바뀌면 leaf CID가","바뀌고, 그 CID를 포함한 parent encoding도"] },
          { expression: String.raw`\operatorname{CID}(b_P).`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Leaf bytes의 digest가 바뀌면 leaf CID가","바뀌고, 그 CID를 포함한 parent encoding도","달라집니다."] },
        ]}
        terms={[
          {
            symbol: "b_L, c_L",
            name: "leaf bytes and CID",
            description:
              "실제 file chunk bytes와 그 typed content address입니다.",
          },
          {
            symbol: "data_P",
            name: "parent local data",
            description:
              "Directory name·metadata처럼 parent가 직접 소유한 값입니다.",
          },
          {
            symbol: "[c_L,c_2,…]",
            name: "ordered child links",
            description: "Parent encoding 안에 들어가는 child CID 목록입니다.",
          },
          {
            symbol: "b_P, c_P",
            name: "parent bytes and CID",
            description:
              "Child links까지 canonical하게 직렬화한 bytes와 그 주소입니다.",
          },
        ]}
        assumptions={[
          "Node codec의 canonical encoding과 link order·metadata 규칙을 고정해야 같은 logical graph가 같은 root를 가집니다.",
          "DAG는 cycle이 없어 root에서 유한하게 탐색할 수 있다는 전제를 가지며 mutable back-reference는 별도 layer로 둡니다.",
          "Root CID는 포함된 bytes의 무결성을 커밋하지만 누락 block의 availability나 publisher identity를 보장하지 않습니다.",
        ]}
        interpretation="lib.rs leaf만 바꾸면 그 leaf, src directory와 root CID가 새로 생기고 변경되지 않은 readme block은 그대로 재사용할 수 있습니다. 이 구조적 공유가 version 간 deduplication의 근거입니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Chunking과 codec도 root identity의 일부입니다</h3>
        <p>
          같은 file bytes라도 256 KiB 고정 chunk와 content-defined chunking은
          다른 leaf 경계를 만들 수 있고, dag-pb와 dag-cbor는 다른 parent bytes를
          만듭니다. 따라서 root CID 비교는 “사용자에게 보이는 파일이 같다”보다
          “같은 encoding pipeline으로 만든 graph bytes가 같다”는 더 좁은
          주장입니다.
        </p>
      </div>
    </section>
  );
}
