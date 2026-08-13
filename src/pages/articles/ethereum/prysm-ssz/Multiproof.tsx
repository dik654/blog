import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";

export default function Multiproof({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="multiproof" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Generalized index는 field 경로를 정수로 만들고 multiproof는 겹친
        sibling을 한 번만 보낸다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Binary Merkle tree의 root를 1로 놓으면 node <code>i</code>의 왼쪽
          child는 <code>2i</code>, 오른쪽 child는
          <code>2i+1</code>입니다. 이 generalized index(gindex)의 binary
          digits에서 맨 앞 1을 빼면 root에서 node까지의 left/right path가
          됩니다. 예를 들어 13은 binary 1101이므로 root에서
          오른쪽→왼쪽→오른쪽으로 내려갑니다.
        </p>
      </div>

      <ExplainedFormula
        question="깊이 d의 한 leaf를 검증할 때 몇 개의 sibling hash가 필요할까요?"
        idea={
          <>
            Leaf에서 root까지 한 level을 올라갈 때마다 반대쪽 subtree hash
            하나가 필요합니다. Verifier는 gindex의 path bit로 좌우 순서를
            복원합니다.
          </>
        }
        formula={String.raw`\begin{aligned}g_L&=2g,&g_R&=2g+1\\g_{\rm sib}&=g\oplus1,&|P|&=32d\ \mathrm B\end{aligned}`}
        terms={[
          {
            symbol: "g",
            name: "Generalized index",
            description:
              "Tree node의 위치와 root-to-node path를 담은 양의 정수입니다.",
          },
          {
            symbol: "\oplus1",
            name: "Last-bit flip",
            description: "현재 node와 같은 parent를 둔 sibling으로 이동합니다.",
          },
          {
            symbol: "d",
            name: "Path depth",
            description: "Target에서 root까지 올라가는 edge 수입니다.",
          },
          {
            symbol: "P",
            name: "Single proof",
            description: "각 level의 32-byte sibling hash 목록입니다.",
          },
        ]}
        assumptions={[
          "Target leaf와 gindex, 신뢰하는 root·schema가 verifier에게 주어집니다.",
          "Tree는 SSZ limit과 zero-padding 규칙으로 구성됩니다.",
          "식은 sibling hash payload만 세며 target value·metadata·encoding overhead는 제외합니다.",
        ]}
        interpretation="Depth 20이면 sibling payload는 640 bytes입니다. 여러 target의 path가 겹치면 multiproof는 서로 계산 가능한 sibling을 빼므로 개별 proof 합보다 작아질 수 있지만, target이 멀리 흩어지면 절감 폭은 작습니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>검증 순서</h3>
        <ol>
          <li>Fork와 SSZ schema에서 target field의 gindex를 계산합니다.</li>
          <li>
            Target value를 해당 SSZ type의 leaf 또는 subtree root로 바꿉니다.
          </li>
          <li>
            Path bit에 따라 sibling과의 좌우 순서를 정해 root까지 hash합니다.
          </li>
          <li>
            신뢰하는 state root와 같을 때만 field가 그 state에 포함됐다고
            판단합니다.
          </li>
        </ol>
        <p>
          Multiproof는 여러 target과 ancestor 집합을 먼저 만들고, 다른 target
          branch로 이미 계산할 수 있는 sibling을 proof에서 제거합니다. 하지만
          proof parser가 중복 gindex, ancestor/descendant target 충돌, 빠진
          helper node나 초과 node를 허용하면 모호한 입력이 됩니다. Canonical
          ordering·unique target·bounded node count를 먼저 검사합니다.
        </p>
        <h3>Light client가 root를 신뢰하는 과정은 별도입니다</h3>
        <p>
          Merkle proof는 “이 field가 이 root에 포함됐다”만 답합니다. 그 root가
          canonical·finalized state에서 왔는지는 sync committee signature와
          light-client update rule이 정합니다. 공격자가 준 임의 root에 proof가
          맞는 것은 아무런 chain 신뢰를 만들지 않습니다.
        </p>
      </div>

      <div id="paper-ssz-merkle-proofs" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications — Merkle proof formats"
          href="https://github.com/ethereum/consensus-specs/blob/master/ssz/merkle-proofs.md"
          citeKey={3}
        >
          공식 문서는 generalized index와 proof helper 계산 형식을 정의합니다.
          Proof 크기 절감률은 target 배치와 schema depth에 따라 달라지므로 특정
          예의 절감률을 모든 light-client update에 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
