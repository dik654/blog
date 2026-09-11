import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ReadinessViz from "./viz/ReadinessViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">사양서에 없는 조건에서 막히는 경우가 많습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          가속기 서버를 주문하고 나서 실제로 막히는 지점은 대개 서버 사양서 밖에 있습니다. 전기 회로가 이
          전력을 감당하는지, 이 냉각 방식이 우리 전산실에서 가능한지, 바닥이 이 무게를 버티는지, 그리고 지진에
          대비한 고정이 필요한지입니다.
        </p>

        <p className="leading-7">
          이 네 가지가 뒤늦게 문제가 되는 이유는 확인 주체가 다르기 때문입니다. 서버는 IT 조직이 고르지만
          전기와 공조, 구조는 설비 쪽이 답을 갖고 있습니다. 두 쪽이 같은 숫자를 보고 이야기하지 않으면 장비가
          도착한 뒤에야 어긋난 것을 알게 됩니다.
        </p>

        <p className="leading-7">
          그래서 이 글은 계산 가능한 형태로 네 항목을 정리합니다. 각 항목마다 서버 쪽에서 내놓는 숫자와 설비
          쪽에서 요구하는 숫자를 짝지어 두면, 발주 전에 종이 위에서 대부분의 불일치를 잡을 수 있습니다.
        </p>

        <ContentBoundary article="datacenter-site-readiness" />

        <p className="leading-7">
          랙 단위의 전력 분배와 장애 상태 설계, 발열량 계산의 원리는{" "}
          <Link to="/gpu/hw-power-cooling">전력과 냉각</Link>이 소유합니다. 이 글은 그 앞단, 곧 장비를 들이기
          전에 건물과 랙 쪽에서 확인해야 하는 물리적 조건만 다룹니다.
        </p>

        <p className="leading-7">
          순서는 냉각 방식, 전력 사이징, 바닥 하중, 내진 고정입니다. 앞의 둘은 서버 선택과 함께 정해지고 뒤의
          둘은 건물이 이미 정해 놓은 제약이라, 뒤의 둘을 먼저 알아야 앞의 둘에서 고를 수 있는 범위가 보입니다.
        </p>
      </div>

      <ReadinessViz />
    </section>
  );
}
