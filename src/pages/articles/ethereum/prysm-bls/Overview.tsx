import ContextViz from "./viz/ContextViz";
import BLSSignFlowViz from "./viz/BLSSignFlowViz";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLS12-381은 많은 validator signature를 하나로 집계한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Ethereum 합의 계층에서는 많은 validator가 같은 투표 대상에 서명한다.
          개별 서명을 모두 그대로 전달하고 검증하면 네트워크와 블록 공간, 검증
          비용이 참여자 수에 따라 커진다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          문제 — 다수의 투표를 작게 운반하고 안전하게 검증
        </h3>
        <p className="leading-7">
          BLS는 서명 point를 더해 여러 서명을 하나의 고정 크기 서명으로 표현할
          수 있다. 하지만 “크기가 하나”라는 사실만으로 유효성이 보장되지는
          않는다. 공개키 집합, 메시지가 같은지 다른지, Proof-of-Possession
          전제가 충족되는지를 API 선택과 함께 확인해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — 그룹 역할과 검증 조건을 분리
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">G1 공개키</h4>
            <p className="text-xs text-muted-foreground">
              Ethereum의 최소 공개키 크기 변형에서 공개키는 압축 48 bytes다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">G2 서명</h4>
            <p className="text-xs text-muted-foreground">
              메시지를 DST와 함께 G2로 매핑해 만든 서명은 압축 96 bytes다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Pairing 검사</h4>
            <p className="text-xs text-muted-foreground">
              공개키·메시지·서명이 같은 비밀키 관계를 만족하는지 pairing
              product로 확인한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">구현을 읽는 네 경계</h3>
        <ol>
          <li>
            <strong>직렬화 검증</strong> — 길이, canonical encoding, subgroup,
            infinity 조건을 확인한다.
          </li>
          <li>
            <strong>도메인 분리</strong> — consensus signing root와 BLS
            ciphersuite DST의 역할을 구분한다.
          </li>
          <li>
            <strong>API 선택</strong> — 단일 Verify, 동일 메시지
            FastAggregateVerify, 서로 다른 메시지 AggregateVerify를 섞지 않는다.
          </li>
          <li>
            <strong>native 경계</strong> — Prysm의 Go 오류 처리와 BLST의 curve
            연산 책임을 나눠 본다.
          </li>
        </ol>
        <CitationBlock
          {...OFFICIAL_SOURCES.ethereum.consensusSpecs}
          citeKey={1}
        >
          Ethereum 합의 사양의 BLS helper와 signing root 규칙이 프로토콜 입력
          조건을 결정한다. 성능 수치는 사양이 아니므로 이 글은 특정 CPU의 밀리초
          값을 일반화하지 않는다.
        </CitationBlock>
        <CitationBlock
          {...OFFICIAL_SOURCES.prysm.repository}
          citeKey={2}
          type="code"
        >
          Prysm에서 사용하는 wrapper와 BLST 호출 경계는 릴리스별 실제 소스를
          기준으로 확인한다.
        </CitationBlock>
      </div>
      <div className="not-prose mt-6">
        <BLSSignFlowViz />
      </div>
    </section>
  );
}
