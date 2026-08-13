import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import RethStateFlowViz from "../reth-state-flow-viz";

export default function Overview({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        State root는 모든 계정을 다시 저장한 값이 아니라 현재 state를 검증하는
        하나의 commitment다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Ethereum block header의 <code>stateRoot</code>는 그 block까지 실행한
          모든 account·contract storage를 하나의 32-byte 값으로 묶습니다. Reth가
          transaction 실행 후 이 값을 다르게 계산하면 block 전체가
          invalid이므로, trie는 단순한 검색 자료구조가 아니라 execution 결과를
          protocol commitment로 바꾸는 경계입니다.
        </p>
        <p>
          이 글은 account <code>0xa</code>의 balance만 1 증가한 고정 사례로{" "}
          <strong>
            key hashing→nibble path→dirty prefix→overlay root→header 비교
          </strong>
          를 추적합니다. DB snapshot과 provider의 일관된 read view는{" "}
          <Link to="/blockchain/reth-provider">Reth Provider</Link>가 소유하며,
          이 글은 Merkle Patricia trie와 state-root 계산만 다룹니다.
        </p>
      </div>
      <ContentBoundary article="reth-trie" />
      <RethStateFlowViz mode="trie" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 key를 16진수 길로 바꿉니다</h3>
        <p>
          State trie는 address 원문이 아니라 <code>keccak256(address)</code>를
          key로 사용합니다. Hash 32 bytes는 각 byte의 상·하위 4-bit를 나눈 64개
          nibble, 즉 0부터 15 사이의 길 선택으로 바뀝니다. Storage trie도 slot
          key를 hash하며 account leaf에는 nonce, balance, storage root와 code
          hash가 RLP로 들어갑니다.
        </p>
        <p>
          Branch node는 다음 nibble에 따라 최대 16방향을 나누고, extension은
          여러 node가 공유하는 긴 prefix를 압축하며, leaf는 남은 suffix와
          value를 끝에 둡니다. 짧은 encoded child는 parent 안에 inline될 수 있고
          긴 node는 hash reference로 들어가므로 “변경 leaf 하나=hash 하나”가
          아닙니다.
        </p>
        <h3>이 글의 고정 사례</h3>
        <p>
          Parent root가 <code>r100</code>인 state에서 account A의 balance만
          10→11로 바뀌었다고 하겠습니다. A의 account leaf와 root까지 이어지는
          ancestor는 다시 encode/hash하지만, A와 prefix를 공유하지 않는 sibling
          subtree는 기존 hash를 재사용합니다. 계산된 <code>r101</code>이 block
          101 header의 state root와 정확히 같을 때만 결과를 받아들입니다.
        </p>
      </div>
      <div id="paper-yellowpaper-trie" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Yellow Paper — Shanghai version"
          href="https://github.com/ethereum/yellowpaper/blob/efc5f9a1f356cba376c978eedb63cb0363c2aa85/Paper.tex"
          citeKey={1}
        >
          Yellow Paper의 world-state·modified Merkle Patricia trie 정의를
          protocol 근거로 사용합니다. 이 snapshot은 Shanghai까지만 반영하므로
          이후 fork의 실행 규칙 전체를 대표하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-trie-source" className="scroll-mt-24">
        <CitationBlock
          source="Reth v2.2.0 — trie source"
          href="https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/trie/trie"
          citeKey={2}
          type="code"
        >
          Reth v2.2.0의 prefix set·walker·hashed cursor·state-root 구현을
          확인하는 source snapshot입니다. Moving main의
          type·parallelism·benchmark를 이 release의 고정 계약으로 섞지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
