import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmFoundationViz from "../prysm-foundation-viz";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        SSZ는 한 schema에서 전송 바이트와 검증 가능한 state root를 함께 만든다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Beacon block을 다른 node에 보내려면 값을 byte sequence로 바꿔야 하고,
          그 block 안의 특정 field만 증명하려면 같은 값에서 Merkle root도 계산할
          수 있어야 합니다. Simple Serialize(SSZ)는 이 두 문제를 별도 규칙으로
          흩어 놓지 않고
          <strong> type schema→serialization과 hash-tree-root</strong>라는 한
          계약으로 묶습니다.
        </p>
        <p>
          이 글은 SSZ type을 처음 보는 독자를 위해{" "}
          <strong>
            typed value→fixed/dynamic byte layout→32-byte chunk→Merkle
            root→field proof
          </strong>{" "}
          순서로 내려갑니다. <Link to="/blockchain/prysm">Prysm 개요</Link>가
          consensus object의 전체 lifecycle을 소유하고, 여기서는 그 lifecycle에
          입력되는 byte·root identity만 다룹니다.
        </p>
      </div>

      <ContentBoundary article="prysm-ssz" />
      <PrysmFoundationViz mode="ssz" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 붙잡을 핵심 아이디어</h3>
        <p>
          Schema는 field의 순서, 각 field가 고정 길이인지 가변 길이인지,
          collection의 최대 길이를 미리 정합니다. 따라서 decoder는 payload 안에
          type 이름을 다시 넣지 않아도 어디까지 읽을지 계산할 수 있고,
          Merkleizer는 각 값이 tree의 어느 leaf에 놓이는지 결정할 수 있습니다.
          같은 bytes라도 다른 schema로 읽으면 다른 object가 될 수 있으므로
          receipt에는 fork와 SSZ type을 반드시 남깁니다.
        </p>
        <p>
          예를 들어 <code>List[uint64, 4]</code> 값 <code>[7, 9]</code>는 원소를
          little-endian 8-byte로 직렬화해 16 bytes가 됩니다. Merkleization에서는
          두 값을 하나의 32-byte chunk에 pack한 뒤 list limit이 정한 tree에 넣고
          실제 원소 수 2를 <code>mix_in_length</code>합니다. 최대 길이 4는
          capacity이고 실제 길이 2는 현재 value의 일부입니다.
        </p>

        <h3>SSZ가 보장하는 것과 보장하지 않는 것</h3>
        <p>
          Canonical schema와 bounded decoder를 사용하면 같은 typed value가
          하나의 표준 byte encoding과 root를 갖도록 만들 수 있습니다. 하지만
          decode 성공이 signature, state transition 또는 fork-choice validity를
          뜻하지는 않습니다. 또한 SHA-256 collision resistance를 전제로
          commitment를 사용하므로 root 하나에서 원래 값을 복원할 수도 없습니다.
        </p>
      </div>

      <div id="paper-ssz-spec" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.ethereum.ssz} citeKey={1}>
          공식 SSZ 문서는 type·serialization·merkleization 규칙을 정의합니다. 이
          규칙은 protocol 정본이지만 Prysm의 cache layout이나 특정 구현의
          처리량을 정하지 않으며, 분석할 때는 consensus-spec release·commit과
          fork를 고정합니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-ssz-source" className="scroll-mt-24">
        <CitationBlock
          {...OFFICIAL_SOURCES.prysm.repository}
          citeKey={2}
          type="code"
        >
          Prysm source는 SSZ 생성 코드와 runtime validation 경계를 확인하는
          implementation 근거입니다. Moving branch의 package 구조를 모든
          release의 고정 사실로 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
