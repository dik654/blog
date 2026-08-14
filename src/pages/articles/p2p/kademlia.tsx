import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import XORDistanceViz from "./kademlia/viz/XORDistanceViz";
import RoutingTableViz from "./kademlia/viz/RoutingTableViz";

export default function KademliaArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문제: 모든 노드를 알지 않고 목적지 찾기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            수백만 노드가 참여하는 P2P 네트워크에서 각 노드가 전체 주소록을
            복제하면 가입·이탈 때마다 비용이 폭증한다. Kademlia는 각 노드가
            ID 공간의 일부 표본만 보관하면서도, 목표 ID에 더 가까운 후보를
            다음 질의로 넘기는 분산 해시 테이블(DHT)이다.
          </p>
          <p>
            이 글의 전체 흐름은 간단하다. 비트열 ID 두 개를 XOR 값으로
            비교하고, 거리 구간마다 제한된 연락처를 k-bucket에 보관한다.
            버킷은 살아 있는 오래된 연락처를 우선하되 실패하면 교체 후보를
            승격한다. 실제 조회의 shortlist·병렬 질의·종료 규칙은 다음 글인{" "}
            <Link to="/p2p/kad-lookup">Kademlia 반복 탐색</Link>이 정본으로
            소유한다.
          </p>
        </div>
        <ExplainedFormula
          question="두 ID x와 y 사이의 Kademlia 거리를 어떻게 한 값으로 만들까?"
          idea="같은 비트는 0, 다른 비트는 1로 만든 XOR 결과를 부호 없는 정수로 읽는다. 첫 차이 비트가 앞에 있을수록 값이 크므로 prefix가 덜 겹친 노드를 더 멀다고 정렬할 수 있다."
          formula={String.raw`d(x,y)=x\oplus y`}
          terms={[
            { symbol: "x,y", name: "Node IDs", description: "길이가 같은 node ID 또는 key 비트열" },
            { symbol: "\\oplus", name: "XOR", description: "각 비트 위치에 적용하는 XOR 연산" },
            { symbol: "d(x,y)", name: "XOR distance", description: "XOR 결과를 부호 없는 정수로 읽은 거리" },
          ]}
          assumptions={[
            "비교하는 ID의 길이와 정수 byte order가 같아야 한다.",
            "거리는 물리적 RTT나 지리적 거리가 아니라 ID 공간의 논리적 거리다.",
          ]}
          interpretation="d(x,x)=0이고 대칭이며 triangle inequality를 만족한다. 그러나 가까운 ID가 낮은 지연이나 신뢰할 수 있는 peer임을 뜻하지는 않는다."
        />
        <div className="not-prose my-8">
          <XORDistanceViz />
        </div>
        <CitationBlock
          source="Maymounkov & Mazières (2002) — Kademlia"
          citeKey={1}
          href="https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf"
        >
          <p id="paper-kademlia" className="text-sm leading-6">
            원 논문은 대칭 XOR metric, k-bucket, 병렬성이 있는 iterative lookup을
            한 설계로 결합한다. 분석은 node ID가 충분히 고르게 분포하고 routing
            table이 유지되며 응답 가능한 경로가 있다는 모델에 놓여 있다.
            따라서 “모든 배포에서 정확히 O(log N) 메시지”라는 보장은 아니다.
          </p>
        </CitationBlock>
      </section>

      <section id="xor-distance" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">XOR 거리와 prefix를 손으로 읽기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            8비트 예에서 x=10110100, y=10111001이면 XOR는 00001101, 즉
            13이다. 앞의 네 비트가 같고 다섯 번째 비트에서 처음 갈라진다.
            구현은 전체 큰 정수를 매번 만들지 않고 첫 1의 위치를 세어
            logarithmic distance를 구할 수 있다.
          </p>
        </div>
        <ExplainedFormula
          question="XOR 값 전체 대신 두 ID가 처음 갈라지는 거리 구간은 어떻게 구할까?"
          idea="XOR 결과 앞의 0은 공통 prefix다. 가장 높은 1의 위치에 1을 더하면 필요한 distance bucket 번호가 된다."
          formula={String.raw`\operatorname{LogDist}(x,y)=\begin{cases}0,&x=y\\ \lfloor\log_2(x\oplus y)\rfloor+1,&x\ne y\end{cases}`}
          terms={[
            { symbol: "\\operatorname{LogDist}", name: "Logarithmic distance", description: "0부터 ID bit 수까지의 logarithmic distance" },
            { symbol: "\\lfloor\\log_2 z\\rfloor", name: "Highest set bit", description: "양의 정수 z의 가장 높은 1 비트 위치" },
            { symbol: "x\\oplus y", name: "XOR result", description: "공통 prefix 뒤 첫 차이를 드러내는 XOR 결과" },
          ]}
          assumptions={["x≠y인 분기에서만 log₂를 계산한다.", "Bucket index의 0/1 시작 방식은 구현 convention을 확인한다."]}
          interpretation="예시 00001101은 LogDist 4다. 값이 작을수록 공통 prefix가 길다. 이것은 prefix 길이의 ‘역수’가 아니라 bit 위치를 센 정수다."
        />
      </section>

      <section id="routing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">k-bucket: 가까운 곳은 촘촘하게, 먼 곳은 넓게</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            각 bucket은 자기 ID와 같은 logarithmic distance 구간의 연락처를
            최대 k개 보관한다. 먼 구간 하나는 넓은 ID 영역을 대표하고,
            가까운 구간은 더 좁은 영역을 대표한다. 그래서 전체 노드를 저장하지
            않아도 여러 거리 규모에 걸친 다음 홉을 갖는다. k는 프로토콜·구현
            parameter이지 Kademlia라는 이름만으로 고정되는 상수가 아니다.
          </p>
          <p>
            예를 들어 원 논문의 k=20과 달리 현재 go-ethereum discovery table은
            bucketSize=16, α=3을 사용하고 256개 거리 각각을 그대로 만들지 않는다.
            구현은 상위 거리 구간 일부를 bucket에 접어 넣는다. 따라서 아래
            그림은 거리 구간별 표본이라는 구조를 설명하며 현재 geth의 배열
            개수를 그대로 묘사하지 않는다.
          </p>
        </div>
        <div className="not-prose my-8">
          <RoutingTableViz />
        </div>
        <CitationBlock
          source="go-ethereum — p2p/discover/table.go"
          citeKey={2}
          type="code"
          href="https://github.com/ethereum/go-ethereum/blob/master/p2p/discover/table.go"
        >
          <p id="paper-geth-table" className="text-sm leading-6">
            현재 소스의 alpha=3, bucketSize=16, maxReplacements=10과 /24 IP
            제한은 go-ethereum 구현에 귀속한다. 버전이 바뀔 수 있는 운영
            상수이므로 다른 Kademlia 구현의 표준값으로 일반화하지 않는다.
          </p>
        </CitationBlock>
      </section>

      <section id="bucket-ops" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">추가·교체·삭제: 연락처의 수명 주기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>이미 있는 ID면 record와 최근 활동 순서를 구현 규칙에 따라 갱신한다.</li>
            <li>빈자리가 있고 IP diversity 정책을 통과하면 live entry에 넣는다.</li>
            <li>가득 찼으면 새 연락처를 바로 신뢰하지 않고 bounded replacement list에 둔다.</li>
            <li>재검증에 실패한 live entry를 제거하고, 검증 정책에 따라 replacement 하나를 승격한다.</li>
          </ol>
          <p>
            현재 geth는 replacement를 “가장 최근 하나”로 고정하지 않고 무작위로
            선택한다. IP quota는 한 공격자가 주소 하나로 bucket을 채우는 비용을
            높이지만, 여러 prefix·IPv6·relay를 가진 공격자를 제거하지는 않는다.
          </p>
        </div>
      </section>

      <section id="revalidation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">재검증과 운영 판단</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Routing table은 발견 결과가 아니라 계속 만료되는 cache다. 구현은
            activity, 마지막 ping/pong, record sequence와 endpoint 변경을 보고
            재검증 대상을 고른다. Timeout 하나만으로 악성이라고 단정하지 않고,
            실패 이유와 retry budget을 기록해 churn과 공격을 구분해야 한다.
          </p>
          <p>
            운영 시에는 bucket occupancy만 보지 말고 거리별 live 비율, unique
            prefix 수, lookup 수렴률, timeout 분포, replacement 승격률을 함께
            본다. 특정 /24에 쏠리거나 가까운 거리의 응답이 반복 실패하면
            bootstrap source와 diversity policy를 점검한다. 완전한 공격 방어와
            위협 모델은 <Link to="/p2p/dht-security">DHT 보안</Link>에서 다룬다.
          </p>
          <h3>다음 읽기</h3>
          <p>
            이제 XOR 정렬과 bucket 표본을 알았으므로, 다음 글에서는 α개 질의를
            보내고 shortlist를 merge해 언제 멈추는지 한 lookup receipt로 추적한다.
          </p>
        </div>
      </section>
    </>
  );
}
