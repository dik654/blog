import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import KadIterativeLookupViz from "./kademlia/viz/KadIterativeLookupViz";

export default function KadLookupArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문제: 목적지를 아는 이웃이 없을 때</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <Link to="/p2p/kademlia">Kademlia 기초</Link>에서 각 노드는 여러
            XOR 거리 구간의 연락처만 보관했다. 따라서 target을 직접 아는 peer가
            없어도 이상하지 않다. Lookup은 local table의 가까운 후보로 시작해
            응답에서 더 가까운 후보를 얻고, 아직 묻지 않은 후보에 반복 질의하는
            탐색이다.
          </p>
          <p>
            핵심 상태는 한 “현재 노드”가 아니라 target distance로 정렬된
            shortlist다. 각 후보에는 discovered·in-flight·responded·failed 같은
            상태를 붙인다. 같은 ID를 중복 제거하고, 한 peer의 응답을 최종
            진실로 믿지 않으며, 요청자 자신이 다음 query를 선택한다.
          </p>
        </div>
        <div className="not-prose my-8">
          <KadIterativeLookupViz />
        </div>
      </section>

      <section id="algorithm" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">반복 FIND_NODE를 한 round씩 실행하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>Local routing table에서 target에 가까운 seed를 shortlist에 넣는다.</li>
            <li>가장 가까운 미조회 후보 중 최대 α개를 in-flight로 표시해 병렬 질의한다.</li>
            <li>응답 node record를 검증하고 ID 기준으로 중복 제거한 뒤 XOR 거리순으로 merge한다.</li>
            <li>실패·timeout을 기록하고, 더 가까운 미조회 후보가 남으면 다음 round를 연다.</li>
            <li>가까운 k개 후보가 모두 조회됐거나 구현의 종료 조건을 만족하면 결과와 receipt를 확정한다.</li>
          </ol>
          <p>
            예를 들어 α=3, k=4이고 seed 거리가 [40, 52, 77]이라면 세 후보에
            묻는다. 응답에서 [11, 18, 40, 65]를 얻으면 중복 40을 제거하고
            shortlist를 [11, 18, 40, 52]로 자른다. 다음 round는 11과 18처럼
            새로 발견된 가까운 후보부터 진행한다.
          </p>
        </div>
        <ExplainedFormula
          question="한 round 뒤 유지할 shortlist를 어떻게 결정할까?"
          idea="기존 후보와 검증된 응답 후보를 합치고 ID 중복을 제거한 뒤 target과의 XOR 거리로 정렬해 앞의 k개만 남긴다."
          formula={String.raw`S_{r+1}=\operatorname{Take}_k\!\left(\operatorname{sort}_{d(\cdot,t)}\left(\operatorname{unique}(S_r\cup R_r)\right)\right)`}
          terms={[
            { symbol: "S_r", name: "Shortlist", description: "round r 시작 때의 shortlist와 후보 상태" },
            { symbol: "R_r", name: "Validated responses", description: "이번 round 응답에서 검증을 통과한 후보 집합" },
            { symbol: "t", name: "Target", description: "찾고 싶은 target node ID" },
            { symbol: "k", name: "Result bound", description: "결과로 유지할 후보 상한이며 구현 parameter" },
          ]}
          assumptions={["Node ID와 record를 검증하고 같은 ID를 한 번만 센다.", "Timeout과 late response 처리, α와 k는 protocol implementation이 명시한다."]}
          interpretation="Shortlist의 최소 거리가 줄어드는 round는 진척이지만, 거리 하나가 더 줄지 않았다는 사실만으로 항상 즉시 종료해도 된다는 뜻은 아니다."
        />
        <CitationBlock
          source="Maymounkov & Mazières (2002) — Kademlia lookup"
          citeKey={1}
          href="https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf"
        >
          <p id="paper-kademlia-lookup" className="text-sm leading-6">
            원 논문은 α개 병렬 query와 k개 closest node를 향한 iterative search를
            제시한다. 기대 logarithmic path 분석은 충분히 채워진 routing table,
            균등한 ID와 응답 가능한 네트워크에 의존한다. Partition·adversarial
            response·높은 churn에서는 같은 bound를 무조건 적용하지 않는다.
          </p>
        </CitationBlock>
      </section>

      <section id="geth-lookup" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">go-ethereum에서 상태와 종료 조건 추적하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            구현을 읽을 때 함수 이름보다 receipt를 먼저 그린다. Target ID,
            initial seed source, queried ID, request start/deadline, response record,
            validation outcome, discovered distance, final result를 같은 lookup ID에
            묶으면 late response와 중복 query를 재현할 수 있다.
          </p>
          <p>
            Current go-ethereum discovery는 Kademlia-like table의 alpha=3을 사용하지만
            discv4와 discv5의 wire request·target 표현·응답 검증은 동일하지 않다.
            따라서 논문의 STORE/FIND_VALUE까지 geth node discovery가 구현한다고
            읽으면 안 된다. Ethereum discovery의 목적은 node endpoint 발견이다.
          </p>
          <h3>종료를 확인하는 체크리스트</h3>
          <ul>
            <li>가까운 k개 중 미조회·in-flight 후보가 남았는가?</li>
            <li>Timeout이 terminal failure인지 retry 가능한지 정책이 정했는가?</li>
            <li>Late response가 끝난 lookup의 결과를 조용히 바꾸지 않는가?</li>
            <li>반환 node가 live/record validation을 어느 수준까지 통과했는가?</li>
          </ul>
        </div>
        <CitationBlock
          source="go-ethereum — p2p/discover lookup implementation"
          citeKey={2}
          type="code"
          href="https://github.com/ethereum/go-ethereum/tree/master/p2p/discover"
        >
          <p id="paper-geth-lookup" className="text-sm leading-6">
            구현 상수·query scheduling·failure 처리는 분석한 go-ethereum
            revision에만 귀속한다. Moving master의 path나 behavior를 고정 API로
            보지 않고 배포 binary의 version/SHA와 protocol을 함께 기록한다.
          </p>
        </CitationBlock>
      </section>

      <section id="refresh" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Bootstrap·refresh와 실패를 운영하기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            빈 table은 먼저 configured bootnode와 최근 검증된 DB seed로 연락
            가능한 시작점을 만든다. Self lookup은 자기 ID 주변을 채우고,
            random-target lookup은 다른 거리 구간을 다시 표본화한다. Bootnode는
            특별한 신뢰의 원천이 아니라 첫 후보 source이므로 record와 응답을
            똑같이 검증한다.
          </p>
          <p>
            운영 지표는 lookup별 round 수, unique queried peer, timeout 비율,
            final closest distance, validated result 수, seed source, refresh 전후
            distance coverage를 포함한다. “결과 0개”를 not-found로 단정하지 말고
            partition·bootstrap failure·quota reject·모든 timeout을 구분한다.
          </p>
          <h3>선택 기준과 한계</h3>
          <p>
            α를 높이면 straggler 의존을 줄일 수 있지만 request와 공격 표면이
            늘어난다. k를 높이면 후보 diversity와 메모리·검증 비용이 함께
            증가한다. Adopt 전에는 정상 topology뿐 아니라 timeout, forged record,
            duplicate ID, late response, partition fixture에서 동일한 terminal
            outcome과 bounded work를 확인한다.
          </p>
        </div>
      </section>
    </>
  );
}
