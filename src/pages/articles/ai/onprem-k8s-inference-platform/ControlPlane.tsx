import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import OwnershipViz from "./viz/OwnershipViz";

export default function ControlPlane() {
  return (
    <section id="control-plane" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">게이트웨이를 걷어 내면 그 안에 있던 일들이 드러납니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          외부 제공자용 게이트웨이는 여러 일을 한 곳에 모아 둔 덩어리입니다. 자체 클러스터로 옮기면서 "이제
          게이트웨이는 필요 없다"고 결론 내리기 쉬운데, 실제로는 그 덩어리 안의 항목들이 각각 어디론가 가야
          합니다. 가지 않은 항목은 그냥 사라집니다.
        </p>

        <p className="leading-7">
          사라져도 티가 안 나는 항목이 특히 위험합니다. 팀별 사용량 집계나 요청 본문 기록은 없어도 당장
          장애가 나지 않습니다. 몇 달 뒤 누가 얼마나 썼는지 물어봤을 때 답이 없다는 사실만 남습니다.
        </p>

        <p className="leading-7">
          그래서 이전 작업은 기능 목록을 먼저 적고 각 항목에 새 주인을 지정하는 데서 시작합니다. 어떤 항목은
          여전히 애플리케이션 앞단의 프록시가 맡고, 어떤 항목은 클러스터의 확장점으로 내려가고, 어떤 항목은
          모델 서버 자체가 노출하는 값으로 대체됩니다.
        </p>
      </div>

      <OwnershipViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          주인이 정해진 뒤에도 하나가 남습니다. 외부 제공자를 쓸 때는 용량 부족이 상대방 문제였습니다. 자체
          클러스터에서는 우리 문제이고, 그것도 "돈을 더 내면 해결되는" 종류가 아닙니다. 그래서 넘치는 요청을
          어떻게 할지가 새로 정해야 할 항목으로 들어옵니다.
        </p>

        <p className="leading-7">
          선택지는 대체로 셋입니다. 대기열에 쌓아 두고 기다리게 하거나, 즉시 거절하고 호출한 쪽이 재시도하게
          하거나, 남은 용량으로 감당 가능한 더 작은 모델로 내려보내는 것입니다. 셋 다 앞단에서 정해야 하는
          일이고, 클러스터 안의 어떤 구성요소도 대신 정해 주지 않습니다.
        </p>

        <p className="leading-7">
          한도와 재시도, 그리고 넘치는 요청을 다루는 패턴 일반론은{" "}
          <Link to="/ai/rate-limiting-and-reliability-patterns">레이트 리밋과 신뢰성 패턴</Link>이 소유합니다.
          이 절은 그 패턴을 누가 맡게 되는지의 배치 문제만 다뤘습니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="그러면 게이트웨이를 그대로 두고 뒤에 자체 모델만 붙이면 되지 않습니까"
          preview="됩니다. 실제로 흔한 구성입니다. 다만 그 게이트웨이는 복제본 상태를 모르므로 복제본 선택은 여전히 클러스터 안에 맡겨야 합니다."
        >
          <p className="leading-7">
            게이트웨이를 앞에 두고 뒤에 자체 클러스터의 모델을 하나의 제공자처럼 등록하는 구성은 이전 비용이
            가장 낮습니다. 키 관리, 팀별 집계, 제공자 실패 시 대체 같은 항목이 그대로 유지되기 때문입니다.
          </p>
          <p className="leading-7">
            다만 그 게이트웨이가 아는 것은 "우리 클러스터"라는 하나의 주소뿐입니다. 그 주소 뒤에 복제본이 몇
            개 있고 어느 것이 여유가 있는지는 모릅니다. 그 선택은 클러스터 안에서 이뤄져야 하고, 그래서 앞
            절들의 내용이 게이트웨이를 유지하는 구성에서도 그대로 필요합니다.
          </p>
          <p className="leading-7">
            두 층이 겹치는 항목도 생깁니다. 게이트웨이의 한도와 클러스터 쪽 대기열이 각각 요청을 거절할 수
            있으므로, 어느 쪽이 먼저 거절하고 호출한 쪽이 그 둘을 어떻게 구분할지를 정해 두지 않으면 원인을
            찾기 어려운 실패가 남습니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
