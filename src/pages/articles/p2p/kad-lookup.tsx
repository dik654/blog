import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import KadIterativeLookupViz from "./kademlia/viz/KadIterativeLookupViz";
import MergeStepsViz from "./kad-lookup/viz/MergeStepsViz";
import RandomTargetViz from "./kad-lookup/viz/RandomTargetViz";
import RefreshOrderViz from "./kad-lookup/viz/RefreshOrderViz";
import SlotTimelineViz from "./kad-lookup/viz/SlotTimelineViz";

export default function KadLookupArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          탐색은 한 길을 따라가지 않고, 가까운 후보 대기표를 계속 고칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              Kademlia lookup은 target에 가까운 후보 여러 명에게 묻고, 답에서 더
              가까운 후보를 얻을 때마다 거리순 대기표를 다시 만드는 과정입니다.
            </strong>{" "}
            그래서 한 peer가 느리거나 틀린 답을 줘도 그 peer 하나가 탐색 경로
            전체를 결정하지 않습니다.
          </p>
          <p>
            먼저 숫자 하나로 끝까지 따라가겠습니다. Target은 설명을 쉽게 하려고
            <code>T=00000000₂</code>로 둡니다. 그러면 이 예제에서 node ID의
            십진수 값이 곧 <code>T</code>와의 XOR 거리입니다. Local table이 준
            seed는 <code>A=40</code>, <code>B=52</code>, <code>C=77</code>이고,
            동시에 보낼 수 있는 query는 <code>α=3</code>, 남길 후보는 설명용
            <code>k=4</code>입니다.
          </p>
          <p>
            A는 <code>D=11</code>, <code>E=65</code>, 이미 아는
            <code>B=52</code>를 돌려줍니다. C는 나중에 <code>F=18</code>을, D는{" "}
            <code>G=3</code>을 알려 줍니다. B는 timeout이고 E·F·G의 답에는 새
            후보가 없다고 가정합니다. 이 응답 순서가 아래 다섯 장면의 고정
            fixture입니다.
          </p>
        </div>
        <div className="not-prose my-8">
          <KadIterativeLookupViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이제 그림의 이름을 붙일 수 있습니다. 거리순 후보 대기표가
            <strong> shortlist</strong>이고, geth source에서는
            <code>result</code>입니다. <code>seen</code>은 한 번이라도 발견한
            ID라 중복 삽입을 막고, <code>asked</code>는 이미 query를 시작한 ID라
            중복 요청을 막습니다. <code>queries</code>는 아직 끝나지 않은 요청
            수입니다.
          </p>
          <p>
            <Link to="/cs/p2p/kademlia">앞 글의 k-bucket</Link>은 첫 seed를
            제공할 뿐입니다. 그 뒤 어떤 후보를 언제 물을지, 답을 어떻게 합칠지,
            언제 멈출지는 이 lookup 상태가 결정합니다. XOR 거리는 RTT나 지리적
            거리도, peer의 신뢰 점수도 아닙니다.
          </p>
        </div>
      </section>

      <section id="algorithm" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          응답 하나가 오면 중복을 빼고 가까운 k개를 다시 고릅니다
        </h2>
        <MergeStepsViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 응답만 실제 숫자로 계산해 보겠습니다. 기존 거리는
            <code>[40, 52, 77]</code>, A가 알려 준 거리는
            <code>[11, 65, 52]</code>입니다. 합치면 여섯 값이지만
            <code>52</code>는 같은 B이므로 한 번만 셉니다. 정렬한
            <code>[11, 40, 52, 65, 77]</code>에서 앞 네 개를 남기면 다음
            result는 <code>[11, 40, 52, 65]</code>입니다.
          </p>
        </div>
        <ExplainedFormula
          question="A의 응답 뒤 result가 왜 [11, 40, 52, 65]가 될까요?"
          idea="기존 후보와 새 후보를 합치고, 같은 node ID를 한 번만 남긴 뒤, target XOR 거리순 앞 k개를 고릅니다."
          formula={
            "S'=\\operatorname{Take}_k\\!\\left(\\operatorname{sort}_{d(\\cdot,T)}\\left(\\operatorname{unique}(S\\cup R)\\right)\\right)"
          }
          annotatedFormula={
            "S'=\\underbrace{\\operatorname{Take}_k}_{\\text{앞의 k개}}\\!\\left(\\underbrace{\\operatorname{sort}_{d(\\cdot,T)}}_{\\text{target XOR 거리순}}\\left(\\underbrace{\\operatorname{unique}(S\\cup R)}_{\\text{기존+응답, ID 중복 제거}}\\right)\\right)"
          }
          operations={[
            {
              expression: "S\\cup R=[40,52,77,11,65,52]",
              annotation: [
                "S는 기존 A·B·C, R은 A가 돌려준 D·E·B입니다",
                "마지막 52는 같은 B를 다시 받은 값입니다",
              ],
            },
            {
              expression: "\\operatorname{unique}=[40,52,77,11,65]",
              annotation: [
                "거리 숫자만 같은지를 보는 것이 아니라 node ID를 기준으로 중복 제거합니다",
                "이 fixture에서는 B=52 하나가 빠집니다",
              ],
            },
            {
              expression: "\\operatorname{sort}=[11,40,52,65,77]",
              annotation: [
                "모든 후보를 같은 target T와 XOR한 거리로 정렬합니다",
                "작은 값이 target에 더 가깝습니다",
              ],
            },
            {
              expression: "\\operatorname{Take}_4=[11,40,52,65]",
              annotation: [
                "Toy k=4이므로 C=77은 bounded result에서 밀려납니다",
                "이미 C에 보낸 query까지 취소된다는 뜻은 아닙니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "S",
              name: "Current result",
              description: "응답을 합치기 전의 거리순 후보 목록입니다.",
            },
            {
              symbol: "R",
              name: "Returned candidates",
              description: "이번에 끝난 query가 돌려준 후보들입니다.",
            },
            {
              symbol: "T",
              name: "Target",
              description: "모든 후보 거리를 계산하는 기준 ID입니다.",
            },
            {
              symbol: "k",
              name: "Result bound",
              description: "후보 목록에 남길 최대 개수입니다.",
            },
          ]}
          assumptions={[
            "모든 후보 ID는 같은 길이와 byte order로 XOR합니다.",
            "Wire decoder와 node-record 검증을 통과해 query function이 넘긴 후보만 merge한다고 가정합니다.",
            "이 식은 후보 목록 갱신식이며 peer의 생존·정직성을 증명하지 않습니다.",
          ]}
          interpretation="C=77은 result에서 빠져도 이미 in-flight인 C의 응답 F=18은 나중에 합칠 수 있습니다. 후보 목록과 진행 중 요청은 서로 다른 상태이기 때문입니다."
        />
        <AlgorithmBlock
          title="거리순 result와 α query slot을 함께 갱신하는 절차"
          input={[
            "target T=0, alpha=3, toy k=4",
            "result=[A40,B52,C77], seen={A,B,C}, asked={}, in_flight=0",
          ]}
          steps={[
            {
              code: "while in_flight < alpha: ask(closest_unasked(result))",
              note: "가까운 미조회 후보가 있는 동안만 slot을 채웁니다. 시작할 때 A·B·C 세 query가 나갑니다.",
            },
            {
              code: "reply = await_any_reply_or_timeout(); in_flight -= 1",
              note: "Round 전체가 아니라 가장 먼저 끝난 query 하나를 받습니다.",
            },
            {
              code: "for node in reply: if node.id not in seen: seen.add(node.id)",
              note: "같은 ID가 여러 응답에 들어와도 한 번만 후보로 처리합니다.",
            },
            {
              code: "result = take_k(sort_by_xor(result + newly_seen, target))",
              note: "A 응답 뒤 [11,40,52,65], C와 D 응답 뒤 [3,11,18,40]이 됩니다.",
            },
            {
              code: "fill_open_slots_with_closest_unasked(result)",
              note: "A가 끝나면 D를, C와 D가 끝나면 F와 G를 바로 묻습니다.",
            },
            {
              code: "stop if in_flight == 0 and no_unasked_candidate(result)",
              note: "가까워지는 값 하나만 보고 멈추지 않고, bounded result에서 더 물을 후보가 없어야 합니다.",
            },
          ]}
          repeatUntil="진행 중 query가 없고, 현재 bounded result 안의 모든 후보가 asked 상태가 될 때까지 2~5번을 반복합니다."
          output="closest_seen=[G3,D11,F18,A40] + per-query outcomes"
        />
        <CitationBlock
          source="Maymounkov & Mazières (2002) — Kademlia"
          citeKey={1}
          href="https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf"
        >
          <p id="paper-kademlia-lookup" className="text-sm leading-6">
            원 논문은 α개 병렬 query, 거리순 shortlist, 진척이 없을 때 가까운
            k개 미조회 후보를 모두 확인하는 종료 절차를 제시합니다. 기대
            logarithmic lookup은 ID 분포·routing table 유지·응답 가능한 경로
            같은 분석 전제에 의존하며, partition이나 adversarial topology의 고정
            지연 보장이 아닙니다.
          </p>
        </CitationBlock>
      </section>

      <section id="geth-lookup" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          geth v1.17.8은 round 장벽 없이 빈 query slot을 즉시 채웁니다
        </h2>
        <SlotTimelineViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            논문을 설명할 때는 “한 round에 α명에게 묻는다”고 말하기 쉽습니다.
            하지만 go-ethereum v1.17.8의 공통 <code>lookup.go</code>는 세 응답이
            모두 올 때까지 기다리지 않습니다. <code>startQueries</code>가
            <code>queries&lt;alpha</code>인 동안 가까운 미조회 후보를 시작하고,
            <code>advance</code>는 <code>replyCh</code>에서 응답 하나를 받을
            때마다 <code>queries</code>를 하나 줄여 다음 slot을 엽니다.
          </p>
          <p>
            이 release의 실제 상한은 <code>alpha=3</code>,
            <code>bucketSize=16</code>입니다. <code>result.push</code>도 최대
            16개만 유지합니다. 따라서 위 그림의 <code>k=4</code>는 계산을 보이기
            위한 toy 값이고, geth의 실행값이 아닙니다.
          </p>
          <p>
            더 중요한 경계가 있습니다. Query가 timeout이나 빈 응답으로 끝나도 그
            peer를 <code>result</code>에서 즉시 지우는 코드는 없습니다. 반환값은
            “가까운 순으로 발견한 node”이지, 모두가 이번 lookup에서 응답해 생존
            검증을 마친 node 집합이 아닙니다.
            <code>trackRequest</code>는 응답에서 유용한 node가 하나라도 나왔는지
            별도로 routing table에 기록합니다.
          </p>
          <h3>Source를 읽을 때 상태를 이렇게 대응합니다</h3>
          <ul>
            <li>
              <code>seen</code>: 한 번 발견한 ID입니다. 너무 멀어 result에 못
              들어가도 다시 추가하지 않습니다.
            </li>
            <li>
              <code>asked</code>: query를 시작한 ID입니다. 시작 전에 표시해 중복
              동시 요청을 막습니다.
            </li>
            <li>
              <code>queries</code>: 아직 reply channel로 돌아오지 않은 goroutine
              수입니다.
            </li>
            <li>
              <code>replyBuffer</code>: 방금 응답에서 처음 발견한 node입니다.
              Iterator가 새 node를 밖으로 내보낼 때도 씁니다.
            </li>
          </ul>
          <p>
            Context가 취소되면 <code>shutdown</code>은 이미 시작한 query의
            channel send를 모두 받아 낸 뒤 query function을 비웁니다. 이는 새
            탐색을 계속하지 않게 하면서 goroutine이 막힌 채 남는 일을 피하는
            종료 순서입니다. discv4와 discv5는 같은 lookup pump에 서로 다른 wire
            query function을 연결하므로, record 검증과 timeout 세부 동작은
            transport source까지 함께 봐야 합니다.
          </p>
        </div>
        <CitationBlock
          source="go-ethereum v1.17.8 — p2p/discover/lookup.go"
          citeKey={2}
          type="code"
          href="https://github.com/ethereum/go-ethereum/blob/v1.17.8/p2p/discover/lookup.go"
        >
          <p id="paper-geth-lookup" className="text-sm leading-6">
            고정 release의 asked·seen·result·queries 상태, alpha slot 보충,
            bounded result, cancellation drain을 근거로 사용합니다. Moving
            master나 다른 Kademlia 구현의 공통 동작으로 확대하지 않습니다.
          </p>
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>“왜 멈췄는가”를 남기는 receipt</h3>
          <p>
            운영 로그에는 target과 seed 출처만 적어서는 부족합니다. 후보마다
            <code>discovered_by</code>, XOR 거리, <code>seen_at</code>,
            <code>asked_at</code>, 완료 시각, 응답 node 수,
            timeout·cancel·decode 실패를 같은 lookup ID로 묶습니다. 종료 시에는
            <code>unasked_in_result=0</code>과 <code>in_flight=0</code>을 함께
            기록해야 재현할 수 있습니다.
          </p>
          <p>
            지표는 평균 하나보다 lookup duration과 query count의 p50·p95·p99,
            timeout 비율, unique seen 수, 최저 거리, 빈 seed 비율을 함께 봅니다.
            p99만 나빠졌다면 먼 peer의 tail latency인지, bootstrap이 비었는지,
            특정 transport의 timeout인지 receipt로 다시 갈라야 합니다.
          </p>
        </div>
      </section>

      <section id="refresh" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          빈 주소록은 bootnode로 시작하지만, bootnode가 정답을 보장하지는
          않습니다
        </h2>
        <RefreshOrderViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Lookup은 seed가 하나도 없으면 즉시 빈 결과로 끝납니다. 그래서 geth
            v1.17.8 table refresh는 DB에서 최근 seed를 불러오고 configured
            bootnode를 더한 뒤, 먼저 self lookup을 실행합니다. 그 다음 random
            target lookup을 세 번 수행해 다른 거리 구간의 연락처를 다시
            표본화합니다.
          </p>
        </div>
        <RandomTargetViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 release의 table source는 DB seed를 최대 30개, 최근 5일 이내로
            조회합니다. Discv4 target이 512-bit public key이고 table ID는 그
            hash라 원하는 bucket에 들어가는 preimage를 만들기 어렵기 때문에, 원
            논문의 least-recently-used bucket target 대신 random target을
            사용한다고 source comment가 경계를 밝힙니다.
          </p>
          <p>
            Bootnode는 첫 연락처일 뿐 신뢰 기관이 아닙니다. 그 응답도 같은 wire
            검증과 중복 제거, quota, timeout 정책을 거칩니다. 따라서 결과 0개는
            “target이 세상에 없다”는 증명이 아닙니다. Local table empty,
            bootstrap failure, 모든 query timeout, partition, cancellation을
            서로 다른 terminal reason으로 남겨야 합니다.
          </p>
        </div>
        <CitationBlock
          source="go-ethereum v1.17.8 — p2p/discover/table.go"
          citeKey={3}
          type="code"
          href="https://github.com/ethereum/go-ethereum/blob/v1.17.8/p2p/discover/table.go"
        >
          <p id="paper-geth-refresh" className="text-sm leading-6">
            고정 release의 seedCount=30, seedMaxAge=5일, self lookup 뒤 random
            lookup 세 번, refresh interval jitter를 근거로 사용합니다. 이 순서를
            Kademlia 표준이나 bootnode 신뢰 보장으로 읽지 않습니다.
          </p>
        </CitationBlock>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>바꿔도 되는 값과 먼저 검증할 실패</h3>
          <p>
            α를 높이면 느린 한 peer에 덜 묶일 수 있지만 outbound packet,
            response validation, rate-limit 부담과 공격 표면이 함께 커집니다.
            k를 높이면 더 많은 후보를 남기는 대신 메모리와 query 수가
            늘어납니다. geth 상수를 바꿨다면 정상 network 평균만 비교하지 말고
            timeout, duplicate ID, forged record, late response, cancellation,
            partition fixture에서 bounded work와 terminal reason을 확인해야
            합니다.
          </p>
          <p>
            예측도 명확합니다. A의 응답 뒤 C가 result에서 밀려나도 C의 in-flight
            응답 F는 합쳐져야 합니다. B가 timeout이어도 B는 이 lookup의
            result에서 자동 삭제되지 않아야 합니다. Context를 취소하면 새
            query는 시작하지 않고 이미 시작한 query를 drain한 뒤 끝나야 합니다.
            이 세 관찰이 다르면 source revision이나 transport adapter가 달라진
            것입니다.
          </p>
        </div>
      </section>
    </>
  );
}
