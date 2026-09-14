import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function ContinuityGate() {
  return (
    <section id="continuity-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">무중단을 주장하려면 옮기는 시간을 셀 수 있어야 합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          무중단 여부는 구성도로 판정되지 않습니다. 지점이 몇 개인지, 서버가 몇 대인지는 중복의 정도일 뿐이고 실제로 사용자가 겪는 것은 고장이 나서 트래픽이 옮겨 갈 때까지의
          시간입니다. 그 시간을 셀 수 없으면 중복 구성은 주장에 그칩니다.
        </p>

        <p className="leading-7">
          그래서 확인은 층별로 나눠서 합니다. 지점 하나를 뺄 때 캐치먼트가 어디로 가고 그쪽에 여유가 있는지,
          서버 한 대를 뺄 때 기존 연결이 살아남는지, 건강 검사가 실제 고장을 몇 초 만에 잡는지를 각각
          확인합니다.
        </p>

        <p className="leading-7">
          세 번째 확인이 가장 자주 빠집니다. 검사 주기와 실패 판정 횟수는 설정 파일에 적혀 있지만, 그 값이 만드는 감지 시간을 장애 시간으로 환산해 본 적이 없는 경우가 많습니다.
          주기 5초에 연속 3회면 감지에만 최대 15초이고 그 15초는 그대로 실패 응답입니다.
        </p>

        <p className="leading-7">
          마지막 확인은 변경 절차입니다. 설정이든 코드든 전역에 한 번에 닿는 경로가 하나라도 남아 있으면 앞의
          모든 중복은 그 경로 앞에서 무력합니다. 이 항목은 인프라 점검이 아니라 배포 파이프라인 점검입니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 무중단은 세 개의 시간으로 요약됩니다. 고장을 감지하는 시간, 트래픽을 옮기는 시간, 그리고
          나쁜 변경을 되돌리는 시간입니다. 셋 중 어느 하나가 크면 나머지를 아무리 줄여도 사용자가 겪는 장애
          시간은 줄지 않습니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 인용한 측정값은 루트 DNS 배치를 대상으로 한 것이라 상용
          CDN에 그대로 옮길 수 없고, 인용한 부하 분산기 구조는 해당 사업자의 공개 설명이라 다른 제품이 같은
          방식을 쓴다고 볼 수 없습니다. 검사 주기나 단계 비율의 구체 값도 이 글에서 권고하지 않습니다.
        </p>

        <p className="leading-7">
          다음 글에서는 방향을 뒤집습니다. 지금까지는 바깥에서 들어오는 요청을 받는 이야기였다면, 다음은 안쪽
          자원에 바깥에서 닿는 이야기입니다. 앞 글에서 잠깐 나온{" "}
          <Link to="/cs/saas/edge-request-defense-pipeline#origin-protection">역방향 터널</Link>이 사설 접근
          전반에서 어떤 형태가 되는지를 다룹니다.
        </p>
      </div>
    </section>
  );
}
