import AlgorithmBlock from "@/components/ui/algorithm-block";
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
        <h2 className="mb-6 text-2xl font-bold">
          Gossip은 중복을 없애는 기술이 아니라 중복을 써서 단일 경로 의존을
          줄이는 기술입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>
              각 node가 일부 peer에게 반복해서 소식을 넘기면 같은 message가 겹쳐
              도착하는 대신, 한 연결이 끊겨도 다른 길이 남습니다.
            </strong>{" "}
            모든 peer에게 곧바로 보내는 flooding은 빠르지만 송신량과 중복이
            큽니다. 하나의 spanning tree는 효율적이지만 tree link가 끊기면 하위
            경로가 막힙니다. Gossip은 두 극단 사이에서 fanout·round·복구 경로를
            조절하는 protocol family입니다.
          </p>
          <p>
            이 글에서는 여덟 node <code>P0…P7</code>의 <code>blocks</code>{" "}
            topic에 message ID <code>m42</code> 하나가 퍼지는 사례만 따라갑니다.
            P0가 publisher이고 설명용 fanout은 2입니다. GossipSub 장면에서는
            P0의 mesh를 P1·P2·P3, non-mesh peer를 P4·P5로 둡니다. 이 숫자는
            이해를 위한 fixture이지 권장 default가 아닙니다.
          </p>
          <p>
            먼저 push의 확률적 전파를 보고, 누가 살아 있는지
            <em>membership</em>, 누구와 연결할지 <em>overlay</em>, 어떤
            message를 보낼지 <em>broadcast</em>의 책임을 나눕니다. 그 뒤
            GossipSub의 full-message mesh path와 IHAVE/IWANT 보조 path,
            validation·peer scoring을 같은 m42로 추적합니다.
          </p>
        </div>
        <div className="not-prose my-8">
          <EpidemicViz />
        </div>
        <ExplainedFormula
          question="Fanout f인 random-contact push 모델에서 다음 round의 informed 비율을 어떻게 근사할까?"
          idea="현재 informed node가 각각 f명을 균등하게 고른다고 두고, 아직 모르는 node 가운데 한 번도 선택되지 않을 몫을 평균장으로 근사합니다."
          formula={String.raw`i_{t+1}\approx 1-(1-i_t)e^{-f i_t}`}
          annotatedFormula={String.raw`i_{t+1}\approx 1-\underbrace{(1-i_t)}_{\text{아직 모르는 비율}}\underbrace{e^{-f i_t}}_{\text{f번 push를 모두 못 받을 근사 확률}}`}
          operations={[
            {
              expression: String.raw`(1-i_t)`,
              annotation: ["round t에 아직 m42를 모르는", "node의 비율"],
            },
            {
              expression: String.raw`f i_t`,
              annotation: [
                "informed 비율에 node당 fanout을 곱해",
                "한 node가 받는 평균 접촉 강도를 만듭니다",
              ],
            },
            {
              expression: String.raw`e^{-f i_t}`,
              annotation: [
                "큰 균등 모집단에서 특정 uninformed node가",
                "한 번도 선택되지 않을 확률의 평균장 근사",
              ],
            },
            {
              expression: String.raw`1-(1-i_t)e^{-f i_t}`,
              annotation: [
                "여전히 모르는 비율을 1에서 빼",
                "다음 round informed 비율을 얻습니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "i_t",
              name: "Informed fraction",
              description: "round t에 m42를 아는 node의 비율",
            },
            {
              symbol: "f",
              name: "Fanout",
              description: "각 informed node가 한 round에 고르는 peer 수",
            },
            {
              symbol: "1-i_t",
              name: "Uninformed fraction",
              description: "아직 m42를 모르는 node의 비율",
            },
            {
              symbol: "e^{-f i_t}",
              name: "No-push approximation",
              description:
                "큰 균등 모집단에서 한 uninformed node가 push를 못 받을 확률의 근사",
            },
          ]}
          assumptions={[
            "충분히 큰 모집단, 균등하고 독립적인 peer 선택, 고정 fanout, 동기 round를 가정합니다.",
            "Loss·partition·degree 제한·중복 선택·adversary·validator 지연은 이 단순식에 들어 있지 않습니다.",
          ]}
          interpretation="초기에는 informed 비율이 빠르게 늘 수 있다는 직관을 줍니다. 실제 GossipSub의 도착시간·완전 전달률이나 O(log N)을 이 식 하나로 보장하지 않습니다."
        />
        <div className="not-prose my-6 rounded-xl border border-border/70 bg-muted/20 p-4 text-sm leading-6">
          <p className="font-semibold">여덟 node·fanout 2를 식에 넣어 보기</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-foreground/75">
            <li>
              처음에는 P0만 아니까 <code>i₀=1/8=0.125</code>입니다.
            </li>
            <li>
              <code>e^(−2×0.125)=e^(−0.25)≈0.7788</code>입니다.
            </li>
            <li>
              <code>i₁≈1−0.875×0.7788≈0.3186</code>, 즉 평균적으로 약 2.55개
              node가 아는 상태입니다.
            </li>
            <li>
              같은 계산을 한 번 더 하면 <code>i₂≈0.6396</code>, 약 5.12개입니다.
            </li>
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            Node 수가 소수일 때 2.55개가 실제로 존재한다는 뜻은 아닙니다. 많은
            무작위 실행의 평균을 설명하는 근사이므로, 위 시각화의 정수 표본과
            구분합니다.
          </p>
        </div>
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
        <h2 className="mb-6 text-2xl font-bold">
          누가 살아 있는지, 누구와 연결할지, 무엇을 보낼지는 다른 문제입니다
        </h2>
        <div className="not-prose mb-8">
          <ProtocolCompareViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            P3가 느려졌다고 해 봅시다. SWIM은 P0의 direct probe와 다른 node를
            통한 indirect probe가 모두 timeout이면 P3를 <em>suspect</em>로
            표시하고 membership update를 기존 message에 piggyback합니다. 이
            결과는 “응답을 확인하지 못했다”는 failure-detector evidence이지 P3가
            죽었다는 증명은 아닙니다.
          </p>
          <p>
            HyParView는 small active view의 연결이 끊겼을 때 larger passive
            view에서 backup peer를 승격해 overlay를 복구합니다. Plumtree는 그
            overlay 위에서 eager link로 full m42를 보내고 lazy link로 IHAVE
            요약을 보내 누락 경로를 GRAFT로 고칩니다. 세 protocol은 함께 조합할
            수 있지만 같은 state machine의 세 단계는 아닙니다.
          </p>
          <p>
            Timeout은 load와 partition에서도 생깁니다. Overlay diversity는
            broadcast가 쓸 연결 후보를 만들 뿐 message validity를 판정하지
            않습니다. 구현을 비교할 때 membership false positive, active
            connection budget, broadcast delivery latency·duplicate bytes를 같은
            지표처럼 섞지 않습니다.
          </p>
        </div>
        <CitationBlock
          source="Das, Gupta & Motivala (2002) — SWIM"
          citeKey={2}
          href="https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf"
        >
          <p id="paper-swim" className="text-sm leading-6">
            SWIM은 failure detection과 membership dissemination을 분리하고
            random probing·indirect ping·infection-style update를 평가한다.
            논문의 cluster 환경과 평가 수치를 permissionless WAN이나 GossipSub
            delivery guarantee로 옮기지 않는다.
          </p>
        </CitationBlock>
        <CitationBlock
          source="Leitão, Pereira & Rodrigues (2007) — HyParView"
          citeKey={3}
          href="https://joaoleitao.org/pdf/HyParView.pdf"
        >
          <p id="paper-hyparview" className="text-sm leading-6">
            HyParView는 small active view와 larger passive view를 서로 다른
            전략으로 관리해 partial-view overlay가 대규모 failure 뒤 복구하도록
            설계합니다. 논문의 실험 조건과 회복 수치를 모든 WAN 배포의 보장으로
            옮기지 않습니다.
          </p>
        </CitationBlock>
        <CitationBlock
          source="libp2p Specifications — Episub·Plumtree"
          citeKey={4}
          href="https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/episub.md"
        >
          <p id="paper-plumtree" className="text-sm leading-6">
            Episub 문서는 Plumtree의 eager full-message 경로와 lazy IHAVE,
            missing message를 고치는 GRAFT 동작을 설명합니다. 여기의 GRAFT는
            GossipSub mesh membership의 GRAFT와 이름이 같아도 해당 protocol
            문맥에서 읽어야 합니다.
          </p>
        </CitationBlock>
      </section>

      <section id="gossipsub" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          GossipSub은 full-message 고속 경로와 ID-only 복구 경로를 함께 둡니다
        </h2>
        <div className="not-prose mb-8">
          <GossipSubMeshViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>
              P0는 <code>blocks</code> topic의 mesh peer P1·P2·P3을
              heartbeat마다 관리합니다.
            </li>
            <li>
              P0가 발행한 full message m42는 mesh peer에게 먼저 전달됩니다. 각
              peer는 message ID로 duplicate를 거르고 validation 뒤에 전파합니다.
            </li>
            <li>
              Mesh 밖의 P4·P5에는 선택적으로 <code>IHAVE(m42)</code>를 보냅니다.
              P4가 m42를 본 적 없으면 <code>IWANT(m42)</code>으로 full body를
              요청합니다.
            </li>
            <li>
              <code>GRAFT</code>는 topic mesh 참여, <code>PRUNE</code>은 이탈을
              조정합니다. Backoff·score·outbound quota가 재참여와 peer 선택을
              제한할 수 있습니다.
            </li>
          </ol>
          <p>
            시각화의 <code>D=3</code>은 설명용입니다. 실제 D·Dlo·Dhi, heartbeat,
            history length, gossip factor는 network profile의 parameter입니다.
            Degree를 키우면 path diversity와 함께 outbound bytes·validation
            load도 늘어납니다. IHAVE는 “ID를 안다”는 광고일 뿐 full body
            availability나 IWANT 응답을 보장하지 않습니다.
          </p>
        </div>
        <CitationBlock
          source="libp2p Specifications — GossipSub v1.1"
          citeKey={5}
          href="https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/gossipsub-v1.1.md"
        >
          <p id="paper-gossipsub" className="text-sm leading-6">
            Active candidate recommendation r8은 mesh maintenance, adaptive
            gossip, IHAVE/IWANT 제한, peer score와 threshold action을
            정의합니다. Peer score는 각 node가 관찰해 계산하는 local policy
            signal이며 identity 비용이나 Sybil 불가능성을 증명하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="reliability" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Message를 싸게 거른 뒤 검증 결과를 score action에 연결합니다
        </h2>
        <div className="not-prose mb-8">
          <ReliabilityViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수신 pipeline은 frame·size·topic limit를 먼저 확인하고, message ID가
            seen cache에 있는지 본 뒤 signature·application validator를
            실행합니다. Invalid message는 전파 전에 거절하고 reason을 score
            component와 metric에 연결합니다.
          </p>
          <p>
            Seen cache 보존 기간은 network-wide TTL이 아닙니다. 한 node가 일정
            기간 같은 ID를 기억하는 local memory·duplicate-work trade-off입니다.
          </p>
          <p>
            Score는 mesh time, first delivery, mesh delivery deficit, invalid
            message, IP colocation 같은 항목을 weight와 decay로 조합합니다.
            Baseline 0과 여러 threshold는 서로 다른 action을 일으킵니다.
          </p>
          <p>
            예를 들어 GossipThreshold, PublishThreshold, GraylistThreshold의
            역할은 같지 않습니다. 점수 하나를 “정직할 확률”로 해석하지 말고
            component·threshold·action reason을 함께 기록합니다.
          </p>
          <AlgorithmBlock
            title="P4가 m42를 받았을 때 처리하는 순서"
            input={[
              "peer=P1, topic=blocks, message_id=m42, payload",
              "size·topic limits, seen cache, validators, score policy",
            ]}
            steps={[
              {
                code: "enforce_frame_size_topic_limits(message)",
                note: "비싼 검증 전에 값싼 구조·자원 제한을 적용합니다.",
              },
              {
                code: "if seen.contains(m42): return DUPLICATE",
                note: "같은 ID를 이미 처리했다면 재검증·재전파하지 않습니다.",
              },
              {
                code: "outcome = validate_signature_and_application(payload)",
                note: "처음 본 ID라도 유효하다고 가정하지 않습니다.",
              },
              {
                code: "if invalid: update_score_component(P1, reason); return REJECT",
                note: "Invalid reason과 자원 사용량을 기록하고 전파 전에 끝냅니다.",
              },
              {
                code: "seen.add(m42); forward_to_eligible_peers(message)",
                note: "Accept한 message만 mesh와 gossip 정책에 따라 전달합니다.",
              },
            ]}
            output="ACCEPT·DUPLICATE·REJECT 중 하나 + reason·bytes·CPU·queue metric"
          />
          <h3>Release와 운영 체크</h3>
          <ul>
            <li>
              같은 topology·traffic·loss·churn·version에서 delivery
              p50/p95/p99와 미전달률을 잰다.
            </li>
            <li>
              Full bytes, IHAVE/IWANT bytes, duplicate·invalid 수, validator
              CPU와 queue depth를 분리한다.
            </li>
            <li>
              Partition 복구, slow validator, ID collision, spam,
              Sybil-colocation fixture에서 bounded memory와 recovery를 확인한다.
            </li>
            <li>
              정상 low-volume peer가 score decay로 배제되는 false positive와
              rollback parameter를 준비한다.
            </li>
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
