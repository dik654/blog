import ContextViz from "./viz/ContextViz";
import GossipsubMeshViz from "./viz/GossipsubMeshViz";
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
      <h2 className="text-2xl font-bold mb-6">GossipSub는 topic별 mesh와 validation으로 consensus message를 전파한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          합의 메시지는 특정 서버를 거치지 않고 여러 구현의 노드 사이에 빠르게
          퍼져야 한다. 모든 peer에게 매번 직접 보내면 중복 트래픽이 커지고,
          임의의 소수 peer만 믿으면 단절과 공격에 취약해진다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — topic별 mesh와 보완 gossip
        </h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 text-xs">
          <div className="rounded-lg border bg-card p-3">
            <strong>Topic</strong>
            <p className="text-muted-foreground mt-1">
              메시지 종류·fork digest로 분리
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>Mesh</strong>
            <p className="text-muted-foreground mt-1">
              선택한 peer에 본문 전달
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>IHAVE/IWANT</strong>
            <p className="text-muted-foreground mt-1">mesh 밖 누락 보완</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>Score</strong>
            <p className="text-muted-foreground mt-1">
              전달 품질과 악성 행동 반영
            </p>
          </div>
        </div>
        <p className="leading-7">
          mesh의 목표 크기와 하한·상한은 프로토콜에 박힌 보편 상수가 아니라
          애플리케이션 설정이다. Prysm의 현재 값은 해당 릴리스 설정에서
          확인하고, 글의 개념 흐름은 숫자 변경과 독립적으로 유지한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Heartbeat — 연결을 고정하지 않고 조정
        </h3>
        <ol>
          <li>
            mesh가 부족하면 점수와 다양성 조건을 만족하는 peer에{" "}
            <code>GRAFT</code>를 보낸다.
          </li>
          <li>
            과도하거나 품질이 낮은 연결은 <code>PRUNE</code>으로 정리하고 재접속
            backoff를 적용한다.
          </li>
          <li>
            mesh 밖 peer에는 최근 message id를 <code>IHAVE</code>로 알리고
            필요한 항목만 <code>IWANT</code>로 회수한다.
          </li>
          <li>
            점수·opportunistic graft·IP/peer 다양성 규칙으로 eclipse와 저품질
            mesh 위험을 줄인다.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Ethereum 메시지 검증 경계
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">1. Decode</strong>
            <p className="text-xs text-muted-foreground mt-1">
              topic의 포크·타입과 <code>ssz_snappy</code> payload를 확인
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">2. Validate</strong>
            <p className="text-xs text-muted-foreground mt-1">
              시기, 중복, 서명과 객체별 gossip 규칙을 적용
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">3. Decide</strong>
            <p className="text-xs text-muted-foreground mt-1">
              Accept·Ignore·Reject를 구분해 전달과 scoring을 결정
            </p>
          </div>
        </div>
        <p className="leading-7">
          Ignore와 Reject를 같은 실패로 처리하면 이미 본 메시지나 시기가 맞지
          않는 메시지 때문에 정상 peer를 벌점 처리할 수 있다. 반대로 검증 전에
          본문을 재전파하면 공격 비용을 네트워크 전체에 증폭시킨다.
        </p>

        <CitationBlock {...OFFICIAL_SOURCES.libp2p.gossipsub} citeKey={1}>
          GossipSub v1.1 사양은 GRAFT·PRUNE, peer scoring, gossip과
          opportunistic graft의 관계를 정의한다. mesh 수치는 애플리케이션
          설정으로 취급한다.
        </CitationBlock>
        <CitationBlock {...OFFICIAL_SOURCES.ethereum.p2p} citeKey={2}>
          Ethereum P2P 사양은 fork digest가 포함된 topic과 ssz_snappy 인코딩,
          메시지별 검증 결과와 제한을 정의한다.
        </CitationBlock>
      </div>
      <div className="not-prose mt-6">
        <GossipsubMeshViz />
      </div>
    </section>
  );
}
