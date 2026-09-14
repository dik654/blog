import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ContinuityViz from "./viz/ContinuityViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">무중단은 고장이 없는 상태가 아니라 고장이 짧은 상태입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          "무중단"이라는 말은 장비가 고장 나지 않는다는 뜻이 아닙니다. 큰 서비스일수록 매일 어딘가의 서버가
          죽고 어딘가의 회선이 끊깁니다. 무중단은 그 고장이 사용자 쪽 요청 실패로 번지기 전에 트래픽이 다른
          곳으로 옮겨 간다는 뜻입니다.
        </p>

        <p className="leading-7">
          그래서 실제로 설계되는 것은 "고장을 없애는 방법"이 아니라 "고장을 감지하고 옮기는 데 걸리는 시간" 입니다. 이 시간이 요청 하나의 수명보다 짧으면 사용자는 아무것도 못 느끼고
          길면 그만큼이 그대로 장애 시간이 됩니다.
        </p>

        <p className="leading-7">
          옮기는 일은 세 층에서 따로 일어납니다. 어느 지점으로 갈지는 인터넷 경로가 정하고 지점 안에서 어느 서버로 갈지는 분배기가 정하며, 이미 맺어진 연결을 유지할지는 그 분배기의
          상태 처리 방식이 정합니다. 층마다 옮기는 속도와 끊김의 모양이 다릅니다.
        </p>

        <ContentBoundary article="anycast-delivery-continuity" />

        <p className="leading-7">
          이 글은 그 세 층을 따라간 뒤, 무엇을 고장으로 볼지 정하는 건강 판정과 트래픽을 미리 빼는 절차를 보고 마지막으로 층을 아무리 쌓아도 막지 못하는 한 종류의 실패를 다룹니다.
          모든 지점이 같은 변경을 동시에 받는 경우입니다.
        </p>

        <p className="leading-7">
          중복 구성과 장애 조치의 일반 개념은{" "}
          <Link to="/cs/ai/rate-limiting-and-reliability-patterns">레이트 리밋과 신뢰성 패턴</Link>이 소유합니다.
          이 글은 그 개념이 지리적으로 흩어진 엣지에서 어떤 모양이 되는지, 그리고 그때 새로 생기는 문제만
          다룹니다.
        </p>
      </div>

      <ContinuityViz />
    </section>
  );
}
