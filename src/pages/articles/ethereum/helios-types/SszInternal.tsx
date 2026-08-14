import { Link } from "react-router-dom";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import HeliosContractViz from "../helios-contract-viz";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function SszInternal({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="ssz-internal" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Generalized index는 Merkle tree의 node를 heap처럼 번호 매깁니다. Binary 표현의 첫 <code>1</code>은 root이고, 나머지 bit는
          왼쪽(<code>0</code>)·오른쪽(<code>1</code>) 경로입니다. 이 경로와 sibling hashes가 있어야 committee나 execution header가 trusted
          root 아래에 포함됐는지 확인할 수 있습니다.
        </p>
      </div>
      <HeliosContractViz mode="ssz-proof" />
      <ExplainedFormula
        question="Generalized index 13의 Merkle branch는 몇 단계이며 어느 방향으로 내려가는가?"
        idea="Index를 binary로 쓰고 맨 앞의 root bit를 제거합니다. 남은 bit 수가 branch depth이며 각 bit가 이동 방향을 정합니다."
        formula={String.raw`13_{10}=1101_2\quad\Rightarrow\quad \operatorname{depth}(13)=\lfloor\log_2 13\rfloor=3,\quad \operatorname{path}=101`}
        terms={[
          { symbol: "13", name: "Generalized index", description: "검증할 tree node의 heap-style 번호입니다." },
          { symbol: "3", name: "Branch depth", description: "Leaf에서 root까지 결합할 sibling hash의 수입니다." },
          { symbol: "101", name: "Path bits", description: "Root에서 right→left→right로 내려가는 방향입니다." },
        ]}
        assumptions={[
          "Tree schema와 generalized index는 같은 fork의 consensus spec에서 가져옵니다.",
          "각 sibling은 정확히 32 bytes이며 hash order는 path bit에 따라 바뀝니다.",
        ]}
        interpretation="Sibling 세 개를 path 순서에 맞게 hash해 trusted root와 같을 때만 포함 증명이 성립합니다. 올바른 길이만으로 root equality를 보장하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>안전한 decode→proof 순서</h3>
        <p>
          Input byte 상한과 fork-specific schema를 고른 뒤 canonical decode와 full consumption을 확인합니다. 그 다음 object root를 계산하고,
          expected generalized index·branch length·sibling order로 trusted root를 재구성합니다. Wrong fork·trailing bytes·oversized list·short branch·root
          mismatch는 서로 다른 reject reason이어야 하며 어느 경우에도 Store를 수정하지 않습니다.
        </p>
        <p>
          Packing·mix-in-length·multiproof의 일반 유도는 <Link to="/blockchain/prysm-ssz">SSZ 정본 글</Link>에서 이어서 볼 수 있습니다.
          Helios release 검증에서는 같은 pinned update bytes를 base/candidate에 넣어 decode outcome·object root·branch result·pre/post Store를 먼저
          맞춘 뒤 latency와 allocation을 비교합니다.
        </p>
      </div>
    </section>
  );
}
