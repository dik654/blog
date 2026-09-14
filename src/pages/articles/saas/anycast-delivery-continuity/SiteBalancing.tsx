import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import BalancerViz from "./viz/BalancerViz";

export default function SiteBalancing() {
  return (
    <section id="site-balancing" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">지점 안에서는 해시가 서버를 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          경로가 지점을 정하고 나면 그 안에서 어느 서버가 받을지가 남습니다. 지점 안 라우터는 같은 주소로 오는
          트래픽을 여러 서버에 나눠 보내는데, 이때 쓰는 것이 연결을 식별하는 네 값의 해시입니다. 출발지 주소와
          포트, 도착지 주소와 포트입니다.
        </p>

        <p className="leading-7">
          같은 연결의 패킷은 네 값이 같으니 늘 같은 해시가 나오고 따라서 늘 같은 서버로 갑니다. 상태를 어디에도 저장하지 않고 연결 유지가 되는 셈입니다. 서버 목록이 바뀌지 않는
          동안에는 이 방식이 거의 공짜입니다.
        </p>

        <p className="leading-7">
          문제는 목록이 바뀌는 순간입니다. 서버가 하나 빠지면 해시의 나눗셈 대상이 달라져 살아 있는 연결들까지
          다른 서버로 재배정됩니다. 고장 난 서버 하나 때문에 멀쩡한 연결들이 함께 끊기는 것이라, 장애 하나가
          훨씬 넓게 번집니다.
        </p>
      </div>

      <ExplainedFormula
        question="서버 하나가 빠질 때 몇 개의 연결이 재배정됩니까"
        idea="나머지 연산으로 서버를 고르면 나누는 수가 바뀌는 순간 거의 모든 연결이 자리를 옮기지만, 각 서버에 고유한 순서를 주고 그중 가장 앞선 것을 고르면 빠진 서버의 몫만 옮깁니다."
        formula={String.raw`\text{mod: } \frac{n-1}{n} \quad\text{vs}\quad \text{consistent: } \frac{1}{n}`}
        annotatedFormula={String.raw`\underbrace{\frac{n-1}{n}}_{\text{나머지 연산에서 옮기는 비율}} \quad\text{vs}\quad \underbrace{\frac{1}{n}}_{\text{일관 해싱에서 옮기는 비율}}`}
        operations={[
          {
            expression: String.raw`h(c) \bmod n`,
            annotation: [
              "연결 c의 해시를 서버 수 n으로 나눈 나머지로 서버를 고릅니다",
              "n이 n-1로 바뀌면 거의 모든 c의 결과가 달라집니다",
            ],
          },
          {
            expression: String.raw`\arg\min_{s \in S} \; r(c, s)`,
            annotation: [
              "연결 c와 서버 s를 함께 해시해 각 서버의 순위 r을 구하고 가장 앞선 서버를 고릅니다",
              "서버 하나가 빠져도 그 서버가 1위였던 연결만 2위로 내려가고 나머지는 그대로입니다",
            ],
          },
          {
            expression: String.raw`\frac{n-1}{n} \to \frac{1}{n}`,
            annotation: [
              "서버 3대라면 3분의 2가 옮기던 것이 3분의 1로 줄어듭니다",
              "서버가 많을수록 두 값의 차이는 벌어져 8대에서는 87.5%와 12.5%가 됩니다",
            ],
          },
        ]}
        terms={[
          { symbol: "n", name: "서버 수", description: "지점 안에서 트래픽을 받는 서버의 수입니다." },
          { symbol: "c", name: "연결 식별자", description: "출발지·도착지 주소와 포트 네 값의 조합입니다." },
          { symbol: String.raw`r(c, s)`, name: "순위 함수", description: "연결과 서버를 함께 해시해 얻는 결정적 순서입니다." },
        ]}
        assumptions={[
          "해시가 연결을 고르게 뿌리고 키 공간이 충분히 크다고 가정합니다. 편향되면 두 방식 모두 부하가 기울어집니다.",
          "나머지 연산 쪽 비율은 n과 n-1이 서로소라는 성질에서 나옵니다. 연속한 두 수라 항상 성립합니다.",
          "빠지는 서버가 하나라고 가정한 비율입니다. 여러 대가 동시에 빠지면 그만큼 커집니다.",
        ]}
        interpretation="일관 해싱이 줄여 주는 것은 '옮기는 연결의 수'이지 '옮긴 연결이 끊기지 않는다'가 아닙니다. 옮긴 연결은 여전히 상태가 없는 서버에 도착하므로, 끊김을 없애려면 다음 절의 장치가 따로 필요합니다."
      />

      <BalancerViz />

      <h3 id="connection-affinity" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        옮겨 간 연결을 원래 서버로 되돌려 보냅니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          재배정된 연결을 살리는 방법은 의외로 단순합니다. 각 해시 칸에 지금 담당 서버뿐 아니라 직전 담당
          서버도 함께 적어 둡니다. 패킷이 도착한 서버에 그 연결의 상태가 없으면, 버리는 대신 직전 담당 서버로
          한 번 더 넘깁니다.
        </p>

        <p className="leading-7">
          넘길 때는 원래 패킷을 그대로 감싸서 보냅니다. 겉봉투에 두 번째 서버 주소를 쓰고 안에는 원래 패킷을
          그대로 두는 식이라, 받은 쪽은 원래 목적지로 온 패킷처럼 처리합니다. 중앙에 연결 목록을 두지 않고도
          기존 연결이 살아남습니다.
        </p>

        <p className="leading-7">
          이 구조에서는 용량 조절이 자유로워집니다. 기존 연결이 끊기지 않으니 서버별 담당량을 수시로 바꿀 수 있고 세대가 다른 서버가 섞여 있어도 각자의 처리 능력에 맞춰 분배량을 조정할
          수 있습니다. 공개된 구현은 서버 부하를 주기적으로 재서 목표치에 수렴하도록 담당량을 늘리고 줄입니다.
        </p>

        <p className="leading-7">
          대가는 한 번의 추가 전달입니다. 재배정 직후에는 일부 패킷이 서버 두 대를 거치므로 지연이 조금 늘고 내부 대역폭을 더 씁니다. 이 비용은 목록이 바뀐 직후에만 발생하고 옛
          연결이 모두 끝나면 사라집니다.
        </p>
      </div>

      <CitationBlock
        source="Cloudflare — Unimog 엣지 부하 분산기 공개 기술 문서 (2026-09-11 확인)"
        citeKey={2}
        href="https://blog.cloudflare.com/unimog-cloudflares-edge-load-balancer/"
      >
        모든 서버에서 커널 앞단 프로그램이 동작하며 연결 네 값의 해시로 담당 서버를 찾고, 캡슐화해 전달하며,
        각 칸에 현재와 직전 담당 서버를 함께 두어 기존 연결을 살린다는 설명은 해당 사업자의 공개 문서입니다.
        직전 담당으로 한 번 더 넘기는 기법 자체는 인용된 선행 연구에서 온 것이며, 제어 루프가 부하를 재어
        담당량을 조정한다는 서술도 같은 문서의 자기보고입니다.
      </CitationBlock>

      <CitationBlock
        source="Eisenbud et al. — Maglev: A Fast and Reliable Software Network Load Balancer (USENIX NSDI 2016)"
        citeKey={3}
        href="https://research.google/pubs/maglev-a-fast-and-reliable-software-network-load-balancer/"
      >
        라우터가 여러 분배기에 트래픽을 균등 분배하고, 분배기가 일관 해싱과 연결 추적을 함께 써서 장애가
        연결 지향 프로토콜에 주는 영향을 줄인다는 구조를 제시한 논문입니다. 전용 장비가 아닌 일반 서버에서
        동작한다는 점이 설계의 전제이며, 보고된 처리량은 논문의 실험 환경 값입니다.
      </CitationBlock>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          복제본 사이의 요청 분배 전략 일반론은{" "}
          <Link to="/cs/ai/llm-serving-ops">서빙 운영</Link> 쪽이 소유합니다. 이 절은 그 분배가 커널 앞단에서
          상태 없이 이뤄질 때 생기는 재해시 문제와 그 해법만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
