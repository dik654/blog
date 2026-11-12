import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import SybilAttackViz from "./dht-security/viz/SybilAttackViz";
import EclipseAttackViz from "./dht-security/viz/EclipseAttackViz";
import AdmissionLedgerViz from "./dht-security/viz/AdmissionLedgerViz";
import RevalidationViz from "./dht-security/viz/RevalidationViz";

const GETH_TABLE =
  "https://github.com/ethereum/go-ethereum/blob/v1.17.10/p2p/discover/table.go";
const GETH_REVALIDATION =
  "https://github.com/ethereum/go-ethereum/blob/v1.17.10/p2p/discover/table_reval.go";
const GETH_NETSET =
  "https://github.com/ethereum/go-ethereum/blob/v1.17.10/p2p/netutil/net.go";

export default function DhtSecurityArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Sybil은 이름표를 늘리고, Eclipse는 피해자의 시야를 가둡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>
              DHT 보안의 핵심은 가까운 노드 ID를 곧 독립된 정직한 참여자로 믿지
              않는 것입니다.
            </strong>{" "}
            <Link to="/cs/p2p/kademlia">Kademlia</Link>의 XOR 거리는 목표와
            가까운 ID를 정렬할 뿐, 누가 그 ID를 만들었는지는 검사하지 않습니다.
          </p>
          <p>
            이 글에서는 한 사례만 끝까지 따라갑니다. 피해자 Alice는 목표 키
            <code>T</code>를 찾고 있고, 해당 거리 버킷에는 자리가 16개 있습니다.
            공격자 Mallory는 공개키와 노드 ID 40개를 만들고, <code>T</code>에
            가까운 ID를 골라 여러 endpoint에서 보냅니다. Alice가 받은 후보가
            Mallory 노드뿐이 되면 Mallory는 다음 후보를 숨기거나 자기 노드만
            되돌려 줄 수 있습니다.
          </p>
          <p>
            여기에는 두 질문이 있습니다. “Mallory가 한 사람인데 여러 노드처럼
            보일 수 있는가?”가 Sybil이고, “그 노드들이 Alice가 보는 후보를
            실제로 장악했는가?”가 Eclipse입니다. 첫 번째가 가능해도 두 번째가
            자동으로 성공하지는 않습니다. 버킷 입장, IP 제한, 교체 목록, 재검증,
            bootstrap과 transport 연결까지 통과해야 하기 때문입니다.
          </p>
          <p>
            Eclipse의 범위도 구분해야 합니다. 한 목표 <code>T</code>의 lookup
            후보만 가두는 것, discovery table 대부분을 가두는 것, 실행
            프로토콜의 inbound·outbound 연결까지 모두 가두는 것은 서로 다른 성공
            조건입니다. 이 글의 고정 사례는 첫 번째에서 시작해 두 번째로 번지는
            경로를 다루며, “버킷 하나 점유”를 “노드 전체 고립”이라고 부르지
            않습니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <EclipseAttackViz />
        </div>
      </section>

      <section id="sybil" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          공개키 40개는 독립된 운영자 40명을 뜻하지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Mallory는 키 쌍을 여러 번 만들 수 있습니다. 각 키에서 서로 다른 노드
            ID가 나오더라도 운영자·서버·회선·자금은 한 주체가 통제할 수
            있습니다. 이것이 Sybil의 출발점입니다. ID 생성이 싸고 목표에 가까운
            ID를 고를 수 있을수록 공격 후보를 많이 만들기 쉽습니다.
          </p>
          <p>
            그래서 구현은 ID 개수만 세지 않고 network group의 자리 점유도
            제한합니다. geth v1.17.10의 public-address 경로는 같은 24-bit
            prefix에서 한 버킷에 최대 2개, table 전체에 최대 10개만 셉니다. 버킷
            하나가 16자리이므로 Mallory가 한 public /24만 쓴다면 그 prefix에서
            들어올 수 있는 상한은 2자리입니다.
          </p>
        </div>

        <div className="not-prose my-8">
          <SybilAttackViz />
        </div>

        <CalculationWalkthrough
          title="한 prefix와 여러 prefix의 자리 상한"
          question="Mallory가 한 /24만 쓸 때와 여덟 /24를 쓸 때, 16자리 버킷에 들어갈 수 있는 후보 상한은 어떻게 달라질까요?"
          scope="go-ethereum v1.17.10의 public-address quota만 적용한 용량 상한입니다. ID 거리·liveness·기존 entry·replacement 순서는 아직 반영하지 않습니다."
          steps={[
            {
              label: "한 public /24의 버킷 상한을 적용합니다",
              expression: "min(bucket limit 2, table limit 10, bucket size 16)",
              result: "최대 2자리",
              reason:
                "같은 prefix의 세 번째 후보는 table 전체 한도 10에 닿기 전에 버킷 한도 2에서 거절됩니다.",
            },
            {
              label: "한 prefix의 관측 점유율을 계산합니다",
              expression: "q = 2 ÷ 16",
              result: "q = 0.125 = 12.5%",
              reason:
                "16자리 버킷이 꽉 찼다고 가정할 때 같은 prefix가 차지할 수 있는 비율입니다.",
            },
            {
              label: "Mallory가 public /24를 여덟 개로 나눕니다",
              expression: "8 prefixes × 2 slots per prefix",
              result: "최대 16자리",
              reason:
                "각 prefix가 버킷 한도 안에 있으므로 quota 계산만 보면 버킷 전체 크기와 같아집니다.",
            },
            {
              label: "여러 prefix의 합산 점유율을 계산합니다",
              expression: "q_Mallory = 16 ÷ 16",
              result: "용량 상한 q = 1.0",
              reason:
                "Prefix별 q는 낮아 보여도 operator가 같은 여러 prefix를 합치면 한 사람이 전체 자리를 통제할 수 있습니다.",
            },
          ]}
          conclusion="IP quota는 한 회선에서 싸게 밀어 넣는 공격의 비용을 올리지만, 여러 prefix를 가진 한 운영자를 식별하지는 못합니다. 16자리는 가능 상한이지 실제 Eclipse 성공률이 아닙니다."
          caveats={[
            "각 ID가 목표 거리 버킷에 들어와야 하고 기존 live entry와 replacement 경쟁도 통과해야 합니다.",
            "LAN 주소는 이 geth addIP 경로에서 quota를 우회합니다. 사설망 시험과 public Internet 위협 모델을 섞지 않습니다.",
            "v1.17.10의 DistinctNetSet은 IPv4와 IPv6 모두 Prefix(24)를 호출합니다. IPv6를 자동으로 /48로 센다고 가정하면 안 됩니다.",
          ]}
        />

        <ExplainedFormula
          question="Network group 집중도 q는 무엇을 알려 주고, 무엇을 알려 주지 못할까요?"
          idea="선택된 peer 중 같은 group이 차지한 비율을 셉니다. 다만 group과 operator는 같은 개념이 아니므로 q는 경보 신호이지 Sybil 판정이 아닙니다."
          formula={String.raw`q_g=\frac{n_g}{n_{\mathrm{selected}}}`}
          annotatedFormula={String.raw`q_g=\frac{\underbrace{n_g}_{\text{group }g\text{의 peer 수}}}{\underbrace{n_{\mathrm{selected}}}_{\text{선택된 peer 전체}}}`}
          operations={[
            {
              expression: String.raw`n_g`,
              annotation: [
                "같은 /24·ASN·source로 묶인 수",
                "group 규칙을 먼저 고정",
              ],
            },
            {
              expression: String.raw`n_{\mathrm{selected}}`,
              annotation: [
                "같은 snapshot의 전체 선택 수",
                "빈자리 여부도 따로 기록",
              ],
            },
          ]}
          terms={[
            {
              symbol: "g",
              name: "Network group",
              description:
                "운영자가 정한 prefix·ASN·bootstrap source 같은 묶음",
            },
            {
              symbol: "q_g",
              name: "Concentration",
              description: "선택된 peer 가운데 group g의 관측 점유율",
            },
          ]}
          assumptions={[
            "Group 정의, IPv4·IPv6 처리와 snapshot 시각을 고정합니다.",
            "NAT·cloud·relay 때문에 같은 group이 한 공격자를 뜻하지도, 다른 group이 다른 운영자를 뜻하지도 않습니다.",
          ]}
          interpretation="한 /24의 q=0.125가 낮아도 Mallory가 여덟 /24를 쓰면 operator 합산 q는 1이 될 수 있습니다. 반대로 회사 NAT 뒤의 정직한 노드가 많으면 높은 q가 정상일 수도 있습니다."
        />

        <CitationBlock
          source="Douceur (2002) — The Sybil Attack"
          citeKey={1}
          href="https://www.microsoft.com/en-us/research/publication/the-sybil-attack/"
        >
          <p id="paper-sybil" className="text-sm leading-6">
            이 논문은 중앙의 신뢰된 식별 권한이 없는 환경에서 한 entity와 여러
            identity를 일대일로 묶기 어렵다는 경계를 정식화합니다. 이를 현재
            DHT의 공격 비용이나 geth quota의 실험 결과로 확대하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="eclipse" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Eclipse는 후보표를 채우는 데서 끝나지 않고, 다음 질문의 답까지
          통제해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Alice의 lookup은 가까운 후보 몇 개에게 “<code>T</code>에 더 가까운
            노드를 아는가?”라고 반복해 묻습니다. Mallory ID가 일부 들어온
            것만으로 공격이 끝나지 않습니다. Alice가 정직한 후보도 함께 묻고 그
            후보가 더 가까운 정직한 노드를 돌려주면 시야가 다시 열릴 수
            있습니다.
          </p>
          <p>
            공격이 이어지려면 Mallory는 <code>T</code>에 가까운 ID를 만듭니다.
            그다음 bootstrap·lookup 응답·inbound 접촉 같은 입구에서 Alice에게
            노출하고, 기존 live entry나 replacement와 경쟁해야 합니다.
          </p>
          <p>
            선택된 뒤에는 자기 노드끼리만 추천하거나 정직한 후보를 숨겨 Alice의
            shortlist를 계속 자기 쪽으로 좁힙니다. 정직한 후보로 나가는 경로가
            사라졌을 때 비로소 해당 lookup의 view capture라고 부를 수 있습니다.
          </p>
          <p>
            방어도 같은 경로의 여러 문에 놓습니다. 서로 다른 bootstrap source로
            첫 표본을 만들고, prefix·방향·source가 한쪽으로 몰리지 않게 하며,
            검증된 오래된 entry를 쉽게 밀어내지 않고, full bucket의
            replacement를 제한합니다. 응답은 여러 경로에서 교차 확인하고 record
            signature와 endpoint liveness를 따로 검사합니다. 어느 한 문도 운영자
            독립성을 증명하지 못하므로 겹쳐야 합니다.
          </p>
        </div>

        <CitationBlock
          source="Marcus, Heilman & Goldberg (2018) — Low-Resource Eclipse Attacks on Ethereum’s P2P Network"
          citeKey={2}
          href="https://eprint.iacr.org/2018/236"
        >
          <p id="paper-eclipse" className="text-sm leading-6">
            이 연구는 당시 Ethereum neighbor discovery와 geth 1.8 이전 경로를
            대상으로 두 호스트·각 한 IP만으로 피해자의 연결을 고립시키는 공격을
            제시했고, 일부 대응이 geth 1.8에 반영됐다고 보고합니다. 이는 역사적
            공격 실증입니다. 당시 성공 조건·수치·취약점을 geth v1.17.10에 그대로
            적용하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="geth-defense" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          geth v1.17.10은 입장·대기실·생존 확인에서 서로 다른 문을 둡니다
        </h2>
        <AdmissionLedgerViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이제 Alice가 실제 geth v1.17.10이라고 가정합니다. 버킷은 16개의 live
            entry와 최대 10개의 replacement를 갖습니다. 초기 table 구성이 끝나기
            전에는 unsolicited inbound node를 바로 넣지 않습니다. 새 public
            address는 먼저 table 전체 prefix 한도 10, 그다음 해당 버킷 한도 2를
            통과해야 합니다. 두 번째 검사에서 실패하면 첫 번째 장부에 올린 수도
            되돌립니다.
          </p>
          <p>
            버킷이 차 있으면 새 후보는 live entry를 즉시 밀어내지 않고 bounded
            replacement로 갑니다. Replacement도 같은 IP 장부에 포함되며 최대
            10개입니다. 기존 entry가 재검증에서 탈락하면 replacement 중 하나를
            무작위로 골라 승격합니다. 따라서 “새 ID를 많이 보내면 오래된 노드가
            바로 밀려난다”는 단순 경로를 어렵게 하지만, 대기실 자체가 공격자
            후보로 채워질 가능성까지 없애지는 않습니다.
          </p>
        </div>

        <AlgorithmBlock
          title="새 discovery node 하나를 live entry 또는 replacement로 분류하는 경로"
          input={[
            "candidate=(node ID, signed record, IP, UDP endpoint)",
            "bucket entries ≤16, replacements ≤10, table initialization state",
          ]}
          steps={[
            {
              code: "if candidate.ID == self.ID: reject(self)",
              note: "자기 자신을 이웃으로 넣지 않습니다.",
            },
            {
              code: "if inbound && !initDone: reject(inbound-during-init)",
              note: "초기 bootstrap 중 unsolicited inbound가 첫 표본을 채우는 경로를 막습니다.",
            },
            {
              code: "bucket = bucketFor(candidate.ID); update existing record if allowed",
              note: "같은 ID가 이미 있으면 별도 신규 자리로 세지 않고 sequence·endpoint 변경 규칙을 적용합니다.",
            },
            {
              code: "if bucket.entries == 16: tryAddReplacement(candidate); stop",
              note: "새 후보는 live entry를 즉시 퇴출하지 않습니다. Replacement도 prefix quota와 10개 상한을 통과해야 합니다.",
            },
            {
              code: "if publicIP && (!tablePrefix<10 || !bucketPrefix<2): reject(ip-limit)",
              note: "LAN address는 이 quota 경로를 건너뜁니다. 버킷 검사 실패 시 table count를 rollback합니다.",
            },
            {
              code: "append live entry; enqueue fast revalidation",
              note: "들어왔다는 사실과 살아 있음이 검증됐다는 사실은 다릅니다. 새 entry는 fast 목록에서 PING 대상이 됩니다.",
            },
          ]}
          repeatUntil="Fast·slow 목록에서 무작위 node 하나씩 골라 PING하고, endpoint sequence가 높아졌으면 새 ENR를 요청합니다."
          output="live entry, bounded replacement, 또는 단계가 드러나는 reject"
        />

        <RevalidationViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            기본 <code>PingInterval</code>은 3초이고 slow 목록의 interval은 그
            세 배인 9초입니다. 그러나 각 노드를 정확히 3초·9초마다 검사한다는
            뜻은 아닙니다. Scheduler는 목록별 다음 실행 시점을
            <code>[0, interval)</code>에서 무작위로 잡고, 그때 목록의 노드
            하나를 무작위 선택합니다.
          </p>
          <p>
            PING 한 번 실패했다고 항상 삭제하지도 않습니다. 저장된
            <code>livenessChecks</code>를 3으로 나눈 정수값으로 줄이고 0 이하가
            되었을 때 삭제합니다. 응답하면 1을 더하고, endpoint가 바뀌지 않은
            검증된 node는 slow 목록으로 옮깁니다.
          </p>
        </div>

        <CalculationWalkthrough
          title="재검증 실패가 신뢰 장부를 줄이는 방식"
          question="livenessChecks가 6인 entry와 1인 entry가 PING에 실패하면 왜 결과가 다를까요?"
          scope="go-ethereum v1.17.10 table_reval.go의 정수 나눗셈과 삭제 조건만 계산합니다. 실제 PING timeout·packet loss 확률은 포함하지 않습니다."
          steps={[
            {
              label: "여섯 번의 누적 check가 있는 entry가 실패합니다",
              expression: "checks = floor(6 ÷ 3)",
              result: "checks = 2, 유지",
              reason:
                "2는 0보다 크므로 삭제하지 않고 fast 목록으로 옮겨 더 빨리 다시 확인합니다.",
            },
            {
              label: "같은 entry가 다시 실패합니다",
              expression: "checks = floor(2 ÷ 3)",
              result: "checks = 0, 삭제",
              reason:
                "두 번째 연속 실패에서 장부가 0이 되어 버킷에서 빠지고 replacement가 있으면 무작위 승격합니다.",
            },
            {
              label: "한 번만 확인된 entry가 실패합니다",
              expression: "checks = floor(1 ÷ 3)",
              result: "checks = 0, 삭제",
              reason:
                "누적 성공이 적은 entry는 첫 실패만으로도 0이 됩니다. 같은 실패라도 이력에 따라 결과가 다릅니다.",
            },
          ]}
          conclusion="재검증은 최근 한 번의 PING만 보는 이진 판정이 아닙니다. 누적 성공 이력이 많은 entry는 한 번의 실패를 견디지만, 반복 실패하면 빠르게 0으로 수렴합니다."
          caveats={[
            "목록 interval은 개별 node의 고정 검사 주기가 아니므로 ‘모든 node를 3초마다 검사’라고 해석하지 않습니다.",
            "Packet loss와 일시적 지연도 실패로 보일 수 있으므로 삭제율과 정직한 churn을 함께 측정해야 합니다.",
          ]}
        />

        <CitationBlock
          source="go-ethereum v1.17.10 — discovery table admission and replacement"
          citeKey={3}
          type="code"
          href={GETH_TABLE}
        >
          <p id="paper-geth-defense" className="text-sm leading-6">
            Tag v1.17.10의 <code>table.go</code>에서 bucket size 16, replacement
            10, public prefix의 bucket 2·table 10 제한, 초기 inbound guard,
            bounded replacement와 무작위 승격을 확인합니다. 이 값은 해당
            release의 구현 사실이며 Sybil·Eclipse 방지 증명이 아닙니다. Prefix
            key 생성은
            <a className="ml-1" href={GETH_NETSET}>
              같은 tag의 DistinctNetSet
            </a>
            에서 확인합니다.
          </p>
        </CitationBlock>

        <CitationBlock
          source="go-ethereum v1.17.10 — table revalidation"
          citeKey={4}
          type="code"
          href={GETH_REVALIDATION}
        >
          <p id="source-geth-revalidation" className="text-sm leading-6">
            같은 tag의 <code>table_reval.go</code>에서 fast·slow 목록, 무작위
            schedule·node 선택, 실패 시 checks÷3, 성공 시 +1과 newer ENR 요청
            경로를 확인합니다. 3초·9초는 기본 interval이며 각 peer의 고정 주기를
            뜻하지 않습니다.
          </p>
        </CitationBlock>
      </section>

      <section id="limits" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          방어를 채택하기 전에는 공격자와 정직한 NAT 사용자를 같은 시험에 넣어야
          합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Prefix quota를 낮추면 한 회선의 공격 비용은 올라가지만,
            회사·학교·통신사 NAT 뒤의 정직한 노드도 함께 거절할 수 있습니다.
            반대로 quota를 높이면 availability는 좋아져도 같은 network group의
            점유가 쉬워집니다. 정답 하나를 정적으로 고르는 문제가 아니라 정상
            손실과 공격 점유를 함께 재생하는 release gate가 필요합니다.
          </p>
          <p>최소 시험표에는 다음 세 묶음을 함께 넣습니다.</p>
          <ul>
            <li>한 /24의 Mallory ID 40개와 여덟 /24의 ID 40개</li>
            <li>같은 NAT 뒤의 정직한 노드 20개</li>
            <li>
              Full bucket·replacement, stale·forged ENR, PING loss와 poisoned
              seed DB 뒤 restart
            </li>
          </ul>
          <p>
            각 경우에 accept·reject 이유와 live·replacement 변화를 기록합니다.
            Prefix·operator별 점유, lookup이 얻은 정직한 후보 수, 메모리·packet
            상한도 base와 candidate에서 비교합니다.
          </p>
          <h3>이 글을 읽고 바로 예측할 수 있어야 하는 것</h3>
          <ul>
            <li>
              Mallory가 같은 /24에서 40개 ID를 보내면 왜 버킷에 40개가 들어가지
              않는가?
            </li>
            <li>
              Mallory가 여덟 /24를 확보하면 왜 IP quota만으로는 한 버킷 장악을
              배제할 수 없는가?
            </li>
            <li>
              버킷 하나가 공격자 후보로 찼어도 왜 노드 전체 Eclipse 성공이라고
              말할 수 없는가?
            </li>
            <li>
              <code>livenessChecks=6</code>인 node는 한 번 실패해도 남지만
              <code>checks=1</code>인 node는 왜 바로 빠질 수 있는가?
            </li>
            <li>
              Prefix quota를 더 엄격하게 바꿀 때 공격 fixture만 통과시키면 왜
              release 판단이 틀리는가?
            </li>
          </ul>
          <p>
            답의 공통점은 “한 지표가 정직성을 증명하지 않는다”입니다. ID, IP,
            liveness, bootstrap source와 lookup 결과를 서로 다른 증거로
            기록하고, 공격 비용과 정직한 availability를 동시에 비교해야 합니다.
          </p>
        </div>
      </section>
    </>
  );
}
