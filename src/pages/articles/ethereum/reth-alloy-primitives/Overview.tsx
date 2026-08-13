import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import RethStorageBoundaryViz from "../reth-storage-boundary-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Alloy primitive는 같은 32 bytes라도 주소·hash·정수를 섞지 않게 만든다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Ethereum node는 block hash, address, balance와 RLP bytes를 끊임없이 옮깁니다. 모두 메모리에서는 byte처럼 보일 수 있지만
          길이·숫자 해석·wire encoding이 다르므로, 타입 경계를 잃으면 정상 데이터도 다른 값으로 읽히거나 잘못된 hash를 만들게 됩니다.
        </p>
        <p>
          이 글은 <strong>Address 0x…01과 nonce 15를 typed value→canonical RLP→exact decode→hash·DB key</strong>로 보내는 한
          사례를 따라갑니다. Bit·byte의 기초는 <Link to="/ai/text-unicode-encoding#bits-bytes">bit·byte 정본</Link>을 재사용하지만,
          여기서도 byte는 8 bit이고 byte order가 정수 값 해석을 바꾼다는 직관부터 설명합니다.
        </p>
      </div>
      <ContentBoundary article="reth-alloy-primitives" />
      <RethStorageBoundaryViz mode="alloy" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례와 네 개의 서로 다른 경계</h3>
        <p>
          Address는 정확히 20 bytes, B256은 정확히 32 bytes이며 U256은 0부터 2²⁵⁶−1까지의 unsigned integer입니다. U256의 내부
          limb 배치와 RLP의 외부 big-endian minimal integer는 같은 개념이 아닙니다. 따라서 receipt에는 Rust type, logical value,
          encoded bytes, consumed length와 decode result를 함께 남깁니다.
        </p>
        <p>
          RLP decode가 성공해도 그 bytes가 block hash나 address라는 의미는 상위 schema가 정합니다. 반대로 타입이 맞아도 crate
          version·feature·encoding rule이 달라지면 byte identity가 달라질 수 있으므로, current source fact는 pinned Alloy/Reth
          version에 귀속하고 exact-consume·round-trip·boundary fixture는 별도의 hardening contract로 둡니다.
        </p>
      </div>
      <div id="paper-alloy-primitives-source" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.alloy.primitives} citeKey={1}>
          Alloy primitive 문서는 Address·B256·U256과 FixedBytes API의 현재 공개 계약을 제공합니다. 구체적인 layout·feature는 사용한
          crate version 또는 git SHA에 귀속하며 문서의 타입 안전성을 application schema 안전 전체로 확대하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-ethereum-rlp-spec" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.ethereum.rlp} citeKey={2}>
          Ethereum RLP 규격은 byte string과 list의 prefix·length·canonical integer encoding을 정의합니다. Field order와 각 field의
          의미는 transaction·block 같은 상위 schema가 별도로 소유합니다.
        </CitationBlock>
      </div>
      <div id="paper-reth-alloy-source" className="scroll-mt-24">
        <CitationBlock source="Reth · Alloy pinned source" href="https://github.com/paradigmxyz/reth/tree/v2.2.0/crates/primitives" citeKey={3} type="code">
          Reth v2.2.0 source는 어떤 Alloy type과 codec을 실제 storage·execution 경계에서 사용하는지 확인하는 implementation 근거입니다.
          Moving main의 경로나 benchmark를 v2.2.0 또는 모든 custom node의 고정 동작으로 읽지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
