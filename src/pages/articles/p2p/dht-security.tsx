import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import SybilAttackViz from "./dht-security/viz/SybilAttackViz";
import EclipseAttackViz from "./dht-security/viz/EclipseAttackViz";

export default function DhtSecurityArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문제: 가까운 ID가 정직하다는 보장은 없다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <Link to="/p2p/kademlia">Kademlia</Link>는 XOR 거리로 후보를 정렬하지만,
            거리 함수는 identity의 비용·독립성·정직성을 검사하지 않는다. 공격자가
            많은 identity를 만들거나 피해자 주변의 연락처를 선점하면 lookup을
            공격자에게 몰아 검열·관찰·거짓 응답을 시도할 수 있다.
          </p>
          <p>
            이 글은 공격을 identity 생성(Sybil), 피해자의 neighbor view 장악
            (Eclipse), lookup 응답 조작으로 나눈다. 방어는 admission cost,
            network diversity, independently sourced bootstrap, record validation,
            bounded retry와 관측을 겹친다. 어떤 한 정책도 “공격 방지”를 보장하지
            않으므로 남는 우회 경로를 위협 모델에 기록한다.
          </p>
        </div>
        <ExplainedFormula
          question="한 주소 집단이 routing slot을 얼마나 차지했는지 어떻게 관측할까?"
          idea="선택된 peer 수 가운데 같은 network group에 속한 수를 비율로 센다. 이 값은 탐지 신호이지 독립 identity의 확률을 증명하는 값은 아니다."
          formula={String.raw`q_g=\frac{n_g}{n_{\mathrm{selected}}}`}
          terms={[
            { symbol: "g", name: "Network group", description: "운영자가 정한 /24, /48, ASN 같은 network group" },
            { symbol: "n_g", name: "Grouped peers", description: "선택된 routing peer 중 group g에 속한 수" },
            { symbol: "n_{\\mathrm{selected}}", name: "Selected peers", description: "같은 snapshot에서 선택된 전체 peer 수" },
            { symbol: "q_g", name: "Concentration", description: "group 집중도이며 0과 1 사이의 관측 비율" },
          ]}
          assumptions={["Group 정의와 IPv4/IPv6 처리, snapshot 시각을 고정한다.", "NAT·cloud ASN·relay 때문에 network group과 공격 주체는 일대일이 아니다."]}
          interpretation="예를 들어 16개 중 같은 /24가 2개면 q=0.125다. 낮은 값도 여러 prefix를 가진 Sybil을 배제하지 않고, 높은 값도 곧 공격이라는 판정은 아니다."
        />
      </section>

      <section id="sybil" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Sybil: identity 수와 독립성의 차이</h2>
        <div className="not-prose mb-8">
          <SybilAttackViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sybil 공격은 한 주체가 여러 논리 identity를 독립 participant처럼
            제시하는 문제다. 공개키가 서로 다르다는 사실은 operator·network·자원
            독립성을 증명하지 않는다. 공격 성공 여부는 identity 생성비용뿐 아니라
            admission, target ID 선택 가능성, victim의 peer selection과 churn에
            달려 있다.
          </p>
          <p>
            방어 선택지는 permissioned identity, stake·work 같은 자원비용,
            rate limit, subnet/ASN diversity, 기존 연결의 수명 우선, 여러 source의
            peer sampling이다. 자원비용은 자본 집중과 onboarding 비용을 만들고,
            IP quota는 NAT 사용자를 과도하게 제한하면서 multi-prefix 공격자는
            통과시킬 수 있다.
          </p>
        </div>
        <CitationBlock
          source="Douceur (2002) — The Sybil Attack"
          citeKey={1}
          href="https://www.microsoft.com/en-us/research/wp-content/uploads/2002/01/IPTPS2002.pdf"
        >
          <p id="paper-sybil" className="text-sm leading-6">
            논문은 중앙의 신뢰된 식별 권한이 없는 분산 환경에서 entity와
            identity의 일대일 대응을 일반적으로 보장하기 어렵다는 문제를
            정식화한다. 모든 최신 DHT 구현이 동일 공격 능력·비용을 갖는다는
            실험 결과로 일반화하지 않는다.
          </p>
        </CitationBlock>
      </section>

      <section id="eclipse" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Eclipse: 피해자의 바깥세상 표본을 장악하기</h2>
        <div className="not-prose mb-8">
          <EclipseAttackViz />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Eclipse는 피해자의 inbound·outbound 이웃이나 lookup shortlist를
            공격자 peer로 둘러싸 외부의 정직한 정보를 보지 못하게 만드는 결과다.
            Sybil은 이를 위한 수단일 수 있지만 identity가 많다고 자동으로 eclipse가
            완성되지는 않는다. 주소 table poisoning, 재시작 시 seed 선택, eviction,
            target-near ID 생성과 connection policy를 함께 봐야 한다.
          </p>
          <p>
            방어는 bucket·direction·source별 quota, anchor/boot source 다변화,
            검증된 오래된 peer 보존, 무작위 replacement, lookup cross-check와
            restart table hygiene를 겹친다. 정상 cloud 환경의 peer가 같은 ASN에
            몰릴 수 있으므로 diversity 제한은 availability와 함께 튜닝한다.
          </p>
        </div>
        <CitationBlock
          source="Heilman et al. (2015) — Eclipse Attacks on Bitcoin’s P2P Network"
          citeKey={2}
          href="https://www.usenix.org/system/files/conference/usenixsecurity15/sec15-paper-heilman.pdf"
        >
          <p id="paper-eclipse" className="text-sm leading-6">
            논문은 당시 Bitcoin address manager와 connection policy를 대상으로
            eclipse 절차와 countermeasure를 평가한다. 공격의 단계 구분은
            재사용할 수 있지만 수치·성공률·구현 결함을 Kademlia나 현재
            go-ethereum에 그대로 옮기지 않는다.
          </p>
        </CitationBlock>
      </section>

      <section id="geth-defense" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">go-ethereum 방어를 layer와 우회 경로로 읽기</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Current go-ethereum table.go는 public IP에 대해 bucket별 같은 /24 최대
            2개, table 전체 최대 10개를 적용하고, bucketSize 16과 bounded
            replacement list를 둔다. 초기화 중 unsolicited inbound node를 바로
            table에 넣지 않고, live entry와 node record를 재검증한다. 이는 공격
            비용을 올리는 구현 제약이지 Sybil·Eclipse의 완전한 차단 증명이 아니다.
          </p>
          <p>
            Release 검증에는 같은 /24 burst, 여러 /24·IPv6 prefix 분산, forged ENR,
            stale sequence, full-bucket replacement, liveness timeout, restart poisoned
            DB와 honest-NAT fixture를 함께 넣는다. 각 fixture에서 accept/reject 이유,
            bucket 변화, lookup 결과, memory·request 상한을 base와 candidate에서
            비교한 뒤 성능을 본다.
          </p>
          <h3>운영 receipt</h3>
          <ul>
            <li>Version/SHA, protocol v4/v5, local ID와 boot source를 기록한다.</li>
            <li>거리 bucket별 live·replacement 수와 /24·/48·ASN 다양성을 기록한다.</li>
            <li>Add reject reason, revalidation failure, timeout, lookup 수렴률을 연결한다.</li>
            <li>의심 시 자동 ban만 하지 말고 false positive와 partition risk를 검토한다.</li>
          </ul>
        </div>
        <CitationBlock
          source="go-ethereum — discovery table implementation"
          citeKey={3}
          type="code"
          href="https://github.com/ethereum/go-ethereum/blob/master/p2p/discover/table.go"
        >
          <p id="paper-geth-defense" className="text-sm leading-6">
            위 상수와 처리 순서는 현재 master 소스에서 확인한 구현 사실이다.
            Production 판단에는 실제 배포 tag/SHA와 config를 고정하고, LAN 예외와
            IPv6·proxy 환경을 포함해 같은 정책이 적용되는지 다시 확인한다.
          </p>
        </CitationBlock>
      </section>
    </>
  );
}
