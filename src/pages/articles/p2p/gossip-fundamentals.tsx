import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import EpidemicViz from "./gossip-fundamentals/viz/EpidemicViz";
import ProtocolCompareViz from "./gossip-fundamentals/viz/ProtocolCompareViz";
import GossipSubMeshViz from "./gossip-fundamentals/viz/GossipSubMeshViz";
import ReliabilityViz from "./gossip-fundamentals/viz/ReliabilityViz";

export default function GossipFundamentalsArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문제: 중앙 방송자 없이 소식을 퍼뜨리기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 peer에게 직접 보내는 flooding은 빠르지만 중복과 송신 비용이
            크고, 하나의 spanning tree는 효율적이지만 링크 하나가 끊기면 하위
            경로가 막힌다. Gossip은 각 노드가 일부 peer와 반복 교환해 여러 경로로
            정보를 퍼뜨리는 family다. 확률적 중복을 비용으로 내고 churn과 부분
            failure에서 복구 경로를 얻는다.
          </p>
          <p>
            먼저 push·pull·push-pull의 정보 이동을 보고, membership·overlay·broadcast
            protocol의 역할을 구분한다. 이어서 GossipSub의 topic mesh, full message와
            IHAVE/IWANT 경로, peer scoring·validation을 추적한다. “gossip이면 O(log N)”
            같은 결론은 peer sampling·fanout·동기 round·연결성 전제가 있을 때의
            분석이지 모든 배포의 latency 보장이 아니다.
          </p>
        </div>
        <div className="not-prose my-8">
          <EpidemicViz />
        </div>
        <ExplainedFormula
          question="단순한 random-contact push 모델에서 다음 round의 informed 비율을 어떻게 근사할까?"
          idea="현재 informed 비율 iₜ가 각각 한 peer를 균등하게 고른다고 두고, 아직 uninformed인 비율 1-iₜ 가운데 적어도 한 push를 받을 몫을 평균장으로 근사한다."
          formula={String.raw`i_{t+1}\approx 1-(1-i_t)e^{-i_t}`}
          terms={[
            { symbol: "i_t", name: "Informed fraction", description: "round t에 message를 아는 node의 비율" },
            { symbol: "1-i_t", name: "Uninformed fraction", description: "아직 message를 모르는 node의 비율" },
            { symbol: "e^{-i_t}", name: "No-push approximation", description: "큰 균등 모집단에서 한 uninformed node가 push를 못 받을 확률의 근사" },
          ]}
          assumptions={["충분히 큰 모집단, 균등하고 독립적인 peer 선택, 동기 round를 가정한다.", "중복 제거·loss·partition·degree 제한·adversary는 이 단순식에 들어 있지 않다."]}
          interpretation="iₜ가 작을 때 informed node가 빠르게 늘어나는 직관을 준다. 실제 GossipSub의 도착시간·완전 전달률이나 O(log N)을 이 식 하나로 보장하지 않는다."
        />
        <CitationBlock
          source="Demers et al. (1987) — Epidemic Algorithms for Replicated Database Maintenance"
          citeKey={1}
          href="https://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf"
        >
          <p id="paper-epidemic" className="text-sm leading-6">
            초기 epidemic replication 연구는 anti-entropy와 rumor mongering으로
            replica inconsistency를 수렴시키는 설계를 분석했다. 당시 database
            model의 결과를 modern pub/sub의 exact parameter나 latency SLO로
            일반화하지 않는다.
          </p>
        </CitationBlock>
      </section>

      <section id="protocols" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Membership·overlay·broadcast는 다른 문제다</h2>
        <div className="not-prose mb-8">
          <ProtocolCompareViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SWIM은 random direct probe와 indirect probe로 failure suspicion을 만들고,
            membership update를 message에 piggyback한다. HyParView는 소수의 active
            connection과 더 큰 passive backup view를 관리한다. Plumtree는 eager
            push tree와 lazy announcement를 결합해 missing message 경로를 복구한다.
            서로 보완할 수 있지만 같은 protocol의 세 이름은 아니다.
          </p>
          <p>
            Failure detector의 suspect는 “죽음의 증명”이 아니다. Timeout은 load와
            partition에서도 생긴다. Overlay diversity는 peer 선택의 입력을 만들고,
            broadcast validation은 message별 accept/reject를 결정한다. 구현을 고를
            때 membership accuracy, connection budget, delivery latency·duplication을
            같은 지표로 섞지 않는다.
          </p>
        </div>
        <CitationBlock
          source="Das, Gupta & Motivala (2002) — SWIM"
          citeKey={2}
          href="https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf"
        >
          <p id="paper-swim" className="text-sm leading-6">
            SWIM은 failure detection과 membership dissemination을 분리하고 random
            probing·indirect ping·infection-style update를 평가한다. 논문의 cluster
            환경과 평가 수치를 permissionless WAN이나 GossipSub delivery guarantee로
            옮기지 않는다.
          </p>
        </CitationBlock>
      </section>

      <section id="gossipsub" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">GossipSub: topic mesh와 보조 gossip 경로</h2>
        <div className="not-prose mb-8">
          <GossipSubMeshViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>Topic에 subscribe한 peer는 heartbeat마다 mesh degree를 범위 안으로 유지한다.</li>
            <li>Publish된 full message는 mesh peer 경로로 전파되고 message ID로 중복 제거한다.</li>
            <li>Mesh 밖의 일부 peer에는 IHAVE로 ID를 알리고, 필요한 peer가 IWANT으로 본문을 요청한다.</li>
            <li>GRAFT는 mesh 참여, PRUNE은 이탈을 조정하며 backoff와 scoring policy를 따른다.</li>
          </ol>
          <p>
            D, Dlo, Dhi, heartbeat, history length는 network profile의 parameter다.
            Spec 예시나 한 implementation default를 모든 network의 최적값으로 쓰지
            않는다. Degree를 키우면 경로 diversity와 함께 outbound bytes·validation
            load도 늘어난다. IHAVE/IWANT은 누락 복구 기회를 주지만 remote peer가
            반드시 응답한다는 보장은 아니다.
          </p>
        </div>
        <CitationBlock
          source="libp2p Specifications — GossipSub v1.1"
          citeKey={3}
          href="https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md"
        >
          <p id="paper-gossipsub" className="text-sm leading-6">
            명세는 mesh maintenance, gossip control messages, peer score와 attack
            mitigation의 interoperable 동작을 정의한다. Peer score는 local policy
            signal이며 identity 비용이나 Sybil 불가능성을 증명하지 않는다.
          </p>
        </CitationBlock>
      </section>

      <section id="reliability" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Validation·score·관측으로 전달 품질 운영하기</h2>
        <div className="not-prose mb-8">
          <ReliabilityViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수신 pipeline은 먼저 frame·size와 topic을 제한하고, message ID 중복을
            확인한 뒤 signature·application validator를 수행한다. Invalid message는
            전파 전에 거절하고 reason을 score·metric에 연결한다. Seen cache의 TTL은
            무한 loop를 막는 protocol TTL이 아니라 일정 기간 같은 message ID를
            기억하는 local memory/duplication trade-off다.
          </p>
          <p>
            Score는 mesh time, first delivery, mesh delivery deficit, invalid message,
            IP colocation 같은 항목을 parameter와 decay로 조합한다. Threshold마다
            gossip·publish·graylist action이 달라질 수 있다. 한 숫자를 정직함의
            확률로 해석하지 말고, score component와 action reason을 함께 기록한다.
          </p>
          <h3>Release와 운영 체크</h3>
          <ul>
            <li>같은 topology·traffic·loss·churn·version에서 delivery p50/p95/p99와 미전달률을 잰다.</li>
            <li>Full bytes, IHAVE/IWANT bytes, duplicate·invalid 수, validator CPU와 queue depth를 분리한다.</li>
            <li>Partition 복구, slow validator, ID collision, spam, Sybil-colocation fixture에서 bounded memory와 recovery를 확인한다.</li>
            <li>정상 low-volume peer가 score decay로 배제되는 false positive와 rollback parameter를 준비한다.</li>
          </ul>
          <p>
            선택은 “가장 빠른 gossip”이 아니라 목표 delivery SLO를 만족하면서
            duplicate bytes·validation CPU·adversarial work를 감당할 수 있는
            profile을 고르는 일이다.
          </p>
        </div>
      </section>
    </>
  );
}
