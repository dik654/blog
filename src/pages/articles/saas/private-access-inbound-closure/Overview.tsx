import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ReachViz from "./viz/ReachViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">안쪽 자원을 열지 않고 닿게 하는 방법은 방향을 뒤집는 것입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사내 도구, 데이터베이스, 관리 화면처럼 인터넷에 두면 안 되는 것에 바깥에서 닿아야 하는 요구는 늘
          있습니다. 가장 쉬운 답은 포트를 열고 주소를 제한하는 것인데, 이 답은 두 가지를 동시에 만듭니다. 열린
          입구 하나와, 그 입구를 통과한 뒤의 넓은 내부입니다.
        </p>

        <p className="leading-7">
          그래서 실제로 쓰이는 방식들은 입구를 잘 지키는 대신 입구를 없애는 쪽을 택합니다. 안쪽이 바깥으로 먼저 연결을 걸어 두거나 바깥 쪽 네트워크 안에 그 자원만 대신하는 주소를
          만들어 둡니다. 어느 쪽이든 받을 포트가 없으니 밖에서 두드릴 대상이 사라집니다.
        </p>

        <p className="leading-7">
          두 번째 축은 "무엇을 주느냐"입니다. 전통적인 사설망은 네트워크를 줍니다. 접속하면 그 안의 모든 주소에 닿을 수 있고 계정 하나가 털리면 그 범위 전체가 노출됩니다. 반대편에는
          자원 하나씩만 주는 방식이 있습니다. 이 구분이 사고가 났을 때의 피해 범위를 정합니다.
        </p>

        <ContentBoundary article="private-access-inbound-closure" />

        <p className="leading-7">
          이 글은 두 축을 먼저 세우고 방향을 뒤집는 두 가지 구현을 각각 봅니다. 안쪽에서 바깥으로 붙는 커넥터와 소비자 네트워크 안에 만들어지는 사설 엔드포인트입니다. 그다음 접근을
          허락할지 판단하는 기준이 네트워크 위치에서 요청별 판정으로 옮겨 간 과정을 보고, 마지막에 확인 항목으로 닫습니다.
        </p>

        <p className="leading-7">
          연결 방향을 뒤집는 아이디어 자체는{" "}
          <Link to="/cs/saas/edge-request-defense-pipeline#origin-protection">엣지 요청 방어</Link>에서 오리진을
          숨기는 수단으로 한 번 나왔습니다. 이 글은 같은 아이디어가 사람과 내부 자원 사이에서 어떤 형태가 되는지를
          다룹니다. 인증과 인가의 구분 자체는{" "}
          <Link to="/cs/isms-aml/isms-auth-management#overview">계정·인증 관리</Link>가 소유합니다.
        </p>
      </div>

      <ReachViz />
    </section>
  );
}
