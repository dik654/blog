import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function TradeoffGate() {
  return (
    <section id="tradeoff-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">막는 강도는 경로마다 다르게 잡습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사이트 전체에 같은 강도를 거는 것이 가장 흔한 실수입니다. 오탐 한 건의 비용은 경로마다 다릅니다. 결제 페이지에서 정상 사용자를 막으면 매출이 사라지고 공개 문서에서 자동화를
          통과시키면 대역폭만 조금 더 씁니다. 같은 임계를 쓸 이유가 없습니다.
        </p>

        <p className="leading-7">
          그래서 실무 순서는 경로를 나누는 것부터입니다. 로그인과 결제처럼 남용이 곧 피해인 경로, 검색과
          목록처럼 자원을 많이 쓰는 경로, 정적 문서처럼 열어 둬도 되는 경로로 나누고 각각 다른 강도를 겁니다.
        </p>

        <p className="leading-7">
          다음은 관측입니다. 차단과 확인 절차가 실제로 누구에게 걸리는지 보지 않으면 임계가 맞는지 알 수
          없습니다. 확인 절차 통과율과 이탈률, 그리고 문의 건수를 함께 보면 오탐 쪽 비용이 드러납니다.
        </p>

        <p className="leading-7">
          마지막은 우회 경로 점검입니다. 앞단을 아무리 조여도 원 서버가 직접 열려 있거나, 공개 API가 다른
          도메인으로 노출돼 있거나, 내부 관리 도구가 인터넷에 붙어 있으면 그쪽으로 들어옵니다. 방어 강도를
          올리기 전에 우회로가 없는지부터 확인하는 편이 순서상 맞습니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 이 글의 구조는 하나입니다. 값싼 층에서 최대한 걸러 내고, 비싼 층은 애매한 것만 다루며,
          강도는 경로별 오탐 단가로 정합니다. 어떤 제품을 쓰든 이 세 문장으로 설정을 설명할 수 있어야 합니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 특정 사업자의 구현 세부는 공개된 범위까지만 다뤘고 내부 모델이나 비공개 신호는 알 수 없습니다. 또 여기서 정리한 층 구조는 웹 요청
          방어의 일반형이며 모든 제품이 같은 이름과 순서를 쓰지는 않습니다.
        </p>

        <p className="leading-7">
          다음 글에서는 같은 엣지 구조가 공격 방어가 아니라 무중단 전달에 어떻게 쓰이는지를 다룹니다. 주소를
          여러 지점에서 광고한다는 같은 성질이 장애 대응에서 어떤 의미가 되는지가 이어지는 질문입니다.{" "}
          <Link to="/p2p/tls-fundamentals">TLS 기초</Link>를 함께 보면 연결 설정 단계의 신호를 더 정확히 읽을
          수 있습니다.
        </p>
      </div>
    </section>
  );
}
