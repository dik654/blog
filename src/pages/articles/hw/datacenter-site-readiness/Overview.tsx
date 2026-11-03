import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import DeliveryPathViz from "./viz/DeliveryPathViz";
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
          <Link to="/cs/gpu/hw-power-cooling">전력과 냉각</Link>이 소유합니다. 이 글은 그 앞단, 곧 장비를 들이기
          전에 건물과 랙 쪽에서 확인해야 하는 물리적 조건만 다룹니다.
        </p>

        <p className="leading-7">
          순서는 반입 경로, 바닥 하중과 내진 고정, 전력, 냉각입니다. 건물과 경로처럼 바꾸기 어려운 조건을 먼저
          닫고, 그 범위 안에서 한 랙의 전력 밀도와 냉각 방식, 마지막으로 서버 구성을 고릅니다.
        </p>
      </div>

      <ReadinessViz />

      <h3 id="delivery-path" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        설치 위치가 버텨도 그 자리까지 못 가면 반입할 수 없습니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          반입 가능 여부는 완성품 크기가 아니라 <strong>포장된 상태</strong>로 판단합니다. 하역장과 임시 보관
          구역이 있는지 확인한 뒤, 포장 폭·높이·무게를 가장 좁은 문과 승강기, 복도의 회전 반경에 대입합니다.
          한 구간이라도 통과하지 못하면 최종 설치실의 여유와 관계없이 경로를 다시 설계해야 합니다.
        </p>
        <p className="leading-7">
          무게도 두 번 봅니다. 최종 위치에서는 rack의 정적 면하중과 점하중을 보지만, 운반 중에는 캐스터나
          운반 장비의 작은 접지점에 무게가 몰립니다. 승강기 정격, 경사로, 이중 바닥, 문턱은 이 이동 하중으로
          따로 승인받아야 합니다.
        </p>
        <p className="leading-7">
          도착 뒤에는 전원과 network cable, 냉각 배관이 닿아야 하고 문을 열거나 부품을 빼는 정비 공간도
          남아야 합니다. 그래서 single-line diagram(SLD), rack elevation, 냉각 P&amp;ID, 반입 동선을 같은
          도면 revision으로 묶습니다. 서로 다른 revision이면 같은 rack population을 검토한 것인지 알 수 없습니다.
        </p>
      </div>
      <DeliveryPathViz />
      <div className="not-prose my-8">
        <CitationBlock
          source="NVIDIA DGX SuperPOD · Planning a Data Center Deployment"
          citeKey={1}
          href="https://docs.nvidia.com/dgx-superpod/design-guides/dgx-superpod-data-center-design-h100/latest/planning.html"
        >
          공식 설계 안내는 loading dock·liftgate, 분리된 보관 구역, 하역장부터 data hall까지의 빈 경로,
          포장을 벗길 공간과 안전한 운반 수단을 설치 전 조건으로 둡니다. 이 글은 그 항목을 경로별 hold point로 묶었습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
