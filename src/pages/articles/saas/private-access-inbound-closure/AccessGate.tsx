import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function AccessGate() {
  return (
    <section id="access-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">받는 포트가 없다는 것만으로는 충분하지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          방향을 뒤집었다는 사실은 한 가지만 보장합니다. 인터넷에서 직접 두드릴 표면이 없다는 것입니다. 그
          표면이 사라진 뒤에도 통로로 닿을 수 있는 범위가 넓거나, 통로를 지난 요청을 내부라는 이유로 통과시키면
          결과는 이전과 크게 다르지 않습니다.
        </p>

        <p className="leading-7">
          그래서 확인은 세 가지로 나눕니다. 밖에서 직접 닿을 수 있는 지점이 남아 있는지, 통로가 닿는 범위가
          자원 단위로 좁혀져 있는지, 그리고 그 범위 안에서 요청마다 판정이 일어나는지입니다. 세 번째가 없으면
          앞의 둘은 범위를 줄였을 뿐 통과 기준은 그대로입니다.
        </p>

        <p className="leading-7">
          여기에 운영 항목 하나를 더합니다. 방향을 뒤집으면 신뢰 지점이 방화벽 규칙에서 커넥터와 그 자격
          증명으로 옮겨 갑니다. 그 자격 증명이 어디에 있고 언제 교체되는지 답할 수 없다면, 없앤 위험만큼
          새 위험이 들어온 것입니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 사설 접근 설계는 두 축의 조합입니다. 연결 방향을 뒤집어 표면을 없애는 축과 부여 단위를 좁히고 요청마다 판정해 통과 기준을 옮기는 축입니다. 앞의 축만 있으면 문 없는
          넓은 방이 되고 뒤의 축만 있으면 잘 지켜지지만 두드릴 수 있는 문이 남습니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 인용한 제품 구조는 각 사업자의 공개 문서 범위까지만 다뤘고 다른 제품이 같은 이름으로 같은 성질을 제공한다고 볼 수 없습니다. 자격
          증명 수명이나 판정 신호의 구체 값도 이 글에서 권고하지 않습니다.
        </p>

        <p className="leading-7">
          이 글로 SaaS 섹션의 세 축이 모두 채워졌습니다. 요청이 오리진에 닿기 전의{" "}
          <Link to="/cs/saas/edge-request-defense-pipeline">방어 계층</Link>, 고장 앞에서 트래픽을 옮기는{" "}
          <Link to="/cs/saas/anycast-delivery-continuity">무중단 전달</Link>, 그리고 안쪽 자원에 바깥에서 닿는
          이 글의 사설 접근입니다. 셋 다 같은 질문의 다른 면입니다. 무엇을 열어 두고 무엇을 닫아 둘 것인가입니다.
        </p>
      </div>
    </section>
  );
}
