import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RoutingTableViz from "./kademlia/viz/RoutingTableViz";
import XORDistanceViz from "./kademlia/viz/XORDistanceViz";

export default function KademliaArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Kademlia는 전체 주소록 대신 여러 거리 규모의 연락처 표본을 보관합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              모든 node를 기억할 수 없으므로, 내 ID와 가까운 구간은 좁게 나누고
              먼 구간은 넓게 묶어 각 구간의 연락처 몇 개만 보관합니다.
            </strong>{" "}
            조회할 때는 이 표본에서 target ID에 더 가까운 연락처를 다음 후보로
            얻습니다.
          </p>
          <p>
            이 글에서는 8-bit toy network 하나를 끝까지 씁니다. 내 ID
            <code>S=10110100₂=180</code>이고, P1은 <code>185</code>, P2는
            <code>182</code>, P4는 <code>244</code>, P3은 <code>52</code>입니다.
            P1이 속한 LogDist 4 bucket은 설명용 <code>k=3</code>으로 두고,
            P1·N188·N189가 live, N190이 새 후보인 상황을 추적합니다.
          </p>
          <p>
            여기서는 XOR 거리, bucket 표본, live/replacement 수명만 다룹니다.
            α개 병렬 질의와 shortlist 종료 규칙은 다음 글인{" "}
            <Link to="/cs/p2p/kad-lookup">Kademlia 반복 탐색</Link>이
            소유합니다.
          </p>
        </div>
        <div className="not-prose my-8">
          <XORDistanceViz />
        </div>
        <ExplainedFormula
          question="S와 P1 사이의 논리 거리를 어떻게 계산할까요?"
          idea="같은 bit 위치끼리 XOR해, 같은 bit는 0이고 다른 bit는 1인 결과를 부호 없는 정수로 읽습니다."
          formula={String.raw`d(x,y)=x\oplus y`}
          annotatedFormula={String.raw`\underbrace{d(x,y)}_{\text{ID 공간의 논리 거리}}=\underbrace{x\oplus y}_{\text{다른 bit만 1인 정수}}`}
          operations={[
            {
              expression: String.raw`x\oplus y`,
              annotation: [
                "S 10110100과 P1 10111001을 같은 자리끼리 비교합니다",
                "결과는 00001101입니다",
              ],
            },
            {
              expression: String.raw`00001101_2`,
              annotation: [
                "8+4+1을 더해 십진수 13으로 읽습니다",
                "이 값이 S에서 P1까지의 XOR distance입니다",
              ],
            },
            {
              expression: String.raw`d(x,y)`,
              annotation: [
                "같은 target을 기준으로 후보를 정렬할 때 씁니다",
                "RTT·지리 거리·신뢰 점수는 아닙니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "x,y",
              name: "Fixed-length IDs",
              description: "길이와 byte order가 같은 node ID 또는 key입니다.",
            },
            {
              symbol: "\\oplus",
              name: "Bitwise XOR",
              description: "같은 bit는 0, 다른 bit는 1로 만드는 연산입니다.",
            },
            {
              symbol: "d(x,y)",
              name: "XOR distance",
              description: "XOR 결과를 부호 없는 정수로 읽은 값입니다.",
            },
          ]}
          assumptions={[
            "비교하는 ID의 bit 길이와 byte order가 같아야 합니다.",
            "이 거리는 ID 공간의 논리 거리이며 network latency나 peer 신뢰도를 포함하지 않습니다.",
          ]}
          interpretation="S⊕P1=00001101₂=13입니다. P2의 거리 2는 P1의 13보다 가깝고, P4의 64와 P3의 128은 더 멉니다."
        />
        <CitationBlock
          source="Maymounkov & Mazières (2002) — Kademlia"
          citeKey={1}
          href="https://pdos.csail.mit.edu/~petar/papers/maymounkov-kademlia-lncs.pdf"
        >
          <p id="paper-kademlia" className="text-sm leading-6">
            원 논문의 대칭 XOR metric, k-bucket과 오래 살아 있는 연락처 우선
            원리를 사용합니다. 균등한 ID 분포·routing maintenance·응답 가능한
            경로를 둔 분석을 모든 배포의 고정 O(log N) SLO로 확대하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="xor-distance" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LogDist는 XOR 전체 값이 아니라 가장 높은 1의 위치로 거리 구간을
          만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            P1의 XOR 결과 <code>00001101</code>에서 가장 높은 1은 오른쪽부터
            0으로 세어 위치 3에 있습니다. 여기에 1을 더한 LogDist 4가 bucket
            구간입니다. 8-bit ID에서 공통 prefix가 네 bit라서 우연히 숫자도
            4지만, 일반식은 <code>bit length − common prefix length</code>
            입니다.
          </p>
        </div>
        <ExplainedFormula
          question="XOR 결과를 어느 bucket 거리 구간에 넣을까요?"
          idea="XOR가 0이면 자기 자신입니다. 양수이면 가장 높은 1 bit의 위치에 1을 더합니다."
          formula={String.raw`\operatorname{LogDist}(x,y)=\begin{cases}0,&x=y\\ \lfloor\log_2(x\oplus y)\rfloor+1,&x\ne y\end{cases}`}
          annotatedFormula={String.raw`\operatorname{LogDist}(x,y)=\begin{cases}\underbrace{0}_{\text{같은 ID}},&x=y\\ \underbrace{\lfloor\log_2(x\oplus y)\rfloor}_{\text{가장 높은 1의 위치}}+\underbrace{1}_{\text{거리 구간 번호}},&x\ne y\end{cases}`}
          operations={[
            {
              expression: String.raw`x\oplus y=13`,
              annotation: [
                "P1의 XOR 결과 00001101₂를 13으로 읽습니다",
                "13은 8 이상 16 미만입니다",
              ],
            },
            {
              expression: String.raw`\lfloor\log_2 13\rfloor=3`,
              annotation: [
                "2³=8≤13<16=2⁴이므로 floor 값은 3입니다",
                "가장 높은 1 bit도 위치 3입니다",
              ],
            },
            {
              expression: String.raw`3+1=4`,
              annotation: [
                "거리 구간 번호는 LogDist 4입니다",
                "Implementation의 array index 변환은 별도 convention입니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "\\operatorname{LogDist}",
              name: "Logarithmic distance",
              description: "0부터 ID bit 수까지의 거리 구간입니다.",
            },
            {
              symbol: "\\lfloor\\log_2 z\\rfloor",
              name: "Highest set-bit index",
              description: "양수 z에서 가장 높은 1 bit의 0-based 위치입니다.",
            },
          ]}
          assumptions={[
            "x≠y인 분기에서만 log₂를 계산합니다.",
            "LogDist와 실제 bucket array index가 같은지는 구현의 folding 규칙을 확인해야 합니다.",
          ]}
          interpretation="P2는 distance 2라 LD2, P1은 13이라 LD4, P4는 64라 LD7, P3은 128이라 LD8입니다. 값이 작을수록 self와 공통 prefix가 깁니다."
        />
      </section>

      <section id="routing" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          k-bucket은 거리 구간마다 다음에 물어볼 연락처를 제한된 수만 보관합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>
              가까운 구간 하나는 좁은 ID 범위를, 먼 구간 하나는 넓은 ID 범위를
              대표합니다.
            </strong>{" "}
            그래서 전체 주소록이 없어도 여러 규모의 방향에 다음 후보가 남습니다.
            이 표는 content나 정답을 저장하는 장부가 아니라 endpoint 연락처
            cache입니다.
          </p>
        </div>
        <div className="not-prose my-8">
          <RoutingTableViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            그림의 <code>k=3</code>은 수명 주기를 보이기 위한 toy 값입니다. 원
            논문의 대표값은 k=20이지만 Kademlia라는 이름만으로 모든 구현의 k가
            정해지지는 않습니다. Go-ethereum v1.17.8 discovery table은
            <code>bucketSize=16</code>, <code>maxReplacements=10</code>, lookup
            concurrency <code>alpha=3</code>을 사용합니다.
          </p>
          <p>
            Geth는 256개 LogDist를 256개 array slot에 그대로 두지 않습니다.
            <code>nBuckets=256/15=17</code>,
            <code>bucketMinDistance=256−17=239</code>입니다. 실제 mapping 식까지
            적용하면 LogDist 240 이하가 첫 bucket에 접히고 241…256이 나머지 16개
            bucket으로 나뉩니다. 이는 Kademlia 일반 규칙이 아니라 해당 source
            revision의 구현 선택입니다.
          </p>
        </div>
        <CitationBlock
          source="go-ethereum v1.17.8 — p2p/discover/table.go"
          citeKey={2}
          type="code"
          href="https://github.com/ethereum/go-ethereum/blob/v1.17.8/p2p/discover/table.go"
        >
          <p id="paper-geth-table" className="text-sm leading-6">
            Release tag v1.17.8의 alpha=3, bucketSize=16, maxReplacements=10,
            17-bucket folding, /24 IP limit과 random replacement selection을
            사용합니다. 다른 Kademlia 구현의 표준값으로 일반화하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="bucket-ops" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Full bucket의 새 연락처는 기존 peer를 바로 밀어내지 않고 대기합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Toy LD4 bucket에는 P1·N188·N189가 있어 live slot 세 개가 찼습니다.
            같은 LD4의 N190을 발견해도 바로 P1을 교체하지 않습니다. 먼저 중복
            ID와 endpoint·IP 정책을 확인하고 replacement list에 둡니다.
          </p>
          <AlgorithmBlock
            title="P1 실패 뒤 N190이 live가 되는 순서"
            input={[
              "self S=180, toy bucket LD4, k=3",
              "live=[P1(185), N188, N189], replacement=[N190]",
            ]}
            steps={[
              {
                code: "if candidate.id already_live: update_by_record_policy()",
                note: "같은 ID라면 새 slot을 쓰지 않고 record 갱신 규칙을 적용합니다.",
              },
              {
                code: "if live_count == k: keep N190 in bounded replacements",
                note: "Full bucket이라는 이유만으로 기존 live peer를 제거하지 않습니다.",
              },
              {
                code: "outcome = revalidate(P1)",
                note: "Timeout은 이 검사 결과이지 peer가 악성이라는 증명은 아닙니다.",
              },
              {
                code: "if outcome failed: remove(P1); promote(N190)",
                note: "이 fixture는 후보가 하나라 N190이 승격됩니다.",
              },
              {
                code: "record(reason, endpoint, IP counts, timestamps)",
                note: "나중에 churn·quota·공격을 구분할 수 있게 이유를 남깁니다.",
              },
            ]}
            output="live=[N190, N188, N189], replacement=[] + revalidation receipt"
          />
          <p>
            Geth v1.17.8은 dead entry를 지울 때 replacement가 여러 개면 그중
            하나를 무작위로 고릅니다. /24 quota는 한 prefix가 bucket을 채우는
            비용을 올리지만, 여러 prefix·IPv6·relay를 가진 공격자를 제거하지
            않습니다. 반대로 큰 NAT 뒤의 정상 사용자에게는 false positive가 될
            수 있습니다.
          </p>
        </div>
      </section>

      <section id="revalidation" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Routing table은 발견 결과가 아니라 계속 낡아 가는 연락처 cache입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Occupancy가 높아도 endpoint가 살아 있거나 lookup이 올바르게
            수렴한다는 뜻은 아닙니다. 거리별 live 비율, unique network prefix,
            revalidation timeout과 이유, replacement 승격률, 실제 lookup
            수렴률을 같은 version snapshot에서 함께 봐야 합니다.
          </p>
          <p>
            Endpoint 변경과 record sequence, 반복 FIND_NODE 실패를 별도 원인으로
            남기고 retry budget을 둡니다. 특정 /24에 몰리거나 가까운 거리 구간의
            실패가 계속되면 bootstrap source와 diversity policy를 점검합니다.
            Sybil·Eclipse 위협과 방어의 한계는{" "}
            <Link to="/cs/p2p/dht-security">DHT 보안</Link>에서 이어집니다.
          </p>
          <h3>다음 읽기</h3>
          <p>
            이제 각 bucket이 “다음에 물어볼 후보”를 제공한다는 점을 알았습니다.
            다음 글에서는 이 후보 가운데 target에 가까운 α개에 질의하고 응답을
            shortlist에 합쳐 언제 멈추는지 한 lookup receipt로 추적합니다.
          </p>
        </div>
      </section>
    </>
  );
}
