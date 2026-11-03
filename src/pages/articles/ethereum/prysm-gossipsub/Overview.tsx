import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import { codeRefs } from "./codeRefs";
import GossipBlockFlowViz from "./viz/GossipBlockFlowViz";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        GossipSub는 검증된 메시지만 여러 피어에게 증폭하는 통제된 확성기입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Peer P7이 slot 352의 beacon block B352를 보냈다고 하겠습니다. 받은
          bytes를 곧바로 이웃에게 복사하면 한 공격자의 잘못된 입력을 우리 노드가
          대신 여러 배로 퍼뜨립니다. 그래서 Prysm은 먼저 어느 fork의 어떤
          메시지인지 고르고, 크기를 제한하고, 정확한 객체로 복원한 뒤, 합의
          규칙을 통과한 입력만 전파합니다.
        </p>
        <p>
          이 글의 결론은 간단합니다.{" "}
          <strong>
            GossipSub의 Accept는 “이 메시지를 더 퍼뜨려도 된다”는 뜻이지,
            block이 최종 확정됐다는 뜻이 아닙니다.
          </strong>{" "}
          이 한 문장에서 생기는 질문을 B352 한 개로 차례대로 풀겠습니다.
        </p>
      </div>

      <GossipBlockFlowViz />

      <section id="why-pipeline" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">
          왜 topic·크기·decode·합의 검사를 나눕니까?
        </h3>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            단계마다 막는 실패와 비용이 다르기 때문입니다. Topic은 잘못된 fork
            schema를 고르는 일을 막고, 크기 상한은 메모리 폭증을 막고, SSZ
            decode는 구조를 확인합니다. 그 뒤에야 서명과 parent state처럼 더
            비싼 검사를 실행할 이유가 생깁니다.
          </p>
          <p>
            세 판정도 서로 다른 책임을 남깁니다. 새롭고 유효한 B352는 Accept,
            명백히 잘못된 서명이나 parent는 Reject, 이미 본 block이나 아직
            parent가 없는 block은 Ignore가 될 수 있습니다. Local state가 부족한
            상황을 곧바로 원격 peer의 악의로 바꾸지 않는 구분입니다.
          </p>
        </div>
        <div className="not-prose flex flex-wrap items-center gap-2">
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "validate-block-pubsub",
                codeRefs["validate-block-pubsub"],
              )
            }
          />
          <span className="text-xs text-muted-foreground">
            Prysm v7.3.1에서 B352가 Accept·Reject·Ignore로 갈리는 실제 경로
          </span>
        </div>
      </section>

      <section id="scope" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">이 글이 맡는 범위</h3>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글은 Ethereum consensus gossip의 topic·SSZ-Snappy·block
            validation·전파 판정까지 다룹니다. Peer 발견과 연결·mesh score는{" "}
            <Link to="/cs/blockchain/prysm-p2p-libp2p">Prysm P2P 글</Link>,
            Accept 뒤 state transition과 head 선택은{" "}
            <Link to="/cs/blockchain/prysm-forkchoice">fork choice 글</Link>에서
            이어집니다.
          </p>
          <p>
            B352·Peer P7과 fork digest 표기는 설명용입니다. Queue 수, 처리량과
            지연은 배포 환경에서 측정해야 하며, 이 글의 source만으로 고정 성능을
            주장하지 않습니다.
          </p>
        </div>
      </section>

      <ContentBoundary article="prysm-gossipsub" />

      <section id="evidence" className="mt-12 space-y-5 scroll-mt-20">
        <h3 className="break-keep text-xl font-bold">근거와 범위</h3>
        <div id="paper-ethereum-gossip-spec" className="scroll-mt-24">
          <CitationBlock
            source="Ethereum Consensus Specifications v1.7.0-beta.4 @ aa16bb4c"
            citeKey={1}
            href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/phase0/p2p-interface.md"
          >
            Topic 형식, SSZ-Snappy, message ID, compressed·uncompressed 크기
            상한과 gossip validation의 protocol 기준을 확인했습니다. Prysm의
            함수 배치나 운영 queue 크기까지 규정하는 문서는 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-gossipsub-v11" className="scroll-mt-24">
          <CitationBlock
            source="libp2p Gossipsub v1.1 specification"
            citeKey={2}
            href="https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md"
          >
            Mesh maintenance, peer score와 invalid-message penalty의 일반 동작을
            확인했습니다. Ethereum block의 유효성 규칙은 이 문서가 아니라
            consensus specification이 정합니다.
          </CitationBlock>
        </div>
        <div id="paper-prysm-gossip-source" className="scroll-mt-24">
          <CitationBlock
            source="OffchainLabs Prysm v7.3.1 @ 96d418cd"
            citeKey={3}
            type="code"
            href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db"
          >
            Topic 등록, fork별 typed decode, Snappy 상한과 beacon block의
            Accept·Reject·Ignore 경계를 실제 코드에서 확인했습니다. 이후
            release의 동작으로 일반화하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </section>
  );
}
