import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import RequestViz from "./viz/RequestViz";

export default function RequestLayer() {
  return (
    <section id="request-layer" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">요청 층은 정확한 대신 한 건당 비쌉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          연결이 맺어지고 요청이 도착하면 그제야 경로와 헤더, 본문을 볼 수 있습니다. 이 층에서는 훨씬 정밀한
          판단이 가능하지만, 여기까지 왔다는 것은 이미 연결 설정과 암호화 처리 비용을 치렀다는 뜻입니다. 그래서
          이 층은 "값싼 층이 걸러 내지 못한 것"을 다루는 자리입니다.
        </p>

        <p className="leading-7">
          여기서 하는 일은 세 가지로 나뉩니다. 알려진 공격 패턴을 규칙으로 막는 것, 같은 출처의 요청 수를
          시간당 제한하는 것, 그리고 사람인지 확인하는 절차를 끼워 넣는 것입니다. 앞의 둘은 요청을 보고 즉시
          판단하고, 마지막은 클라이언트에게 일을 시켜 응답을 봅니다.
        </p>

        <p className="leading-7">
          레이트 리밋은 상태가 필요하다는 점에서 앞 층과 다릅니다. 누가 얼마나 보냈는지를 기억해야 하므로
          카운터를 어디에 두고 얼마나 정확히 셀지가 설계 문제가 됩니다. 여러 지점에 분산된 구조에서는 지점마다
          따로 세면 합계가 한도를 넘고, 한곳에 모으면 지연이 늘어납니다.
        </p>
      </div>

      <RequestViz />

      <TermBreakdown
        title="요청 층이 쓰는 세 가지 수단"
        description="판단 근거와 비용, 그리고 실패 방식이 각각 다릅니다."
        items={[
          {
            term: "패턴 규칙",
            description: "요청의 경로·헤더·본문에서 알려진 공격 모양을 찾아 차단합니다.",
            example: "주입 공격처럼 형태가 특징적인 시도를 즉시 거를 수 있습니다.",
            boundary: "알려진 모양만 잡습니다. 정상 요청이 우연히 패턴에 걸리는 오탐도 생깁니다.",
          },
          {
            term: "레이트 리밋",
            description: "식별 가능한 출처별로 시간당 요청 수를 제한합니다.",
            example: "로그인 시도처럼 반복이 곧 공격인 경로에 효과적입니다.",
            boundary: "상태를 유지해야 하고, 분산 환경에서는 집계 정확도와 지연이 교환됩니다.",
          },
          {
            term: "확인 절차",
            description: "클라이언트에 계산이나 상호작용을 요구하고 응답으로 판단합니다.",
            example: "자동화 도구가 통과하기 어려운 절차를 요구해 비용을 올립니다.",
            boundary: "사람에게도 마찰이 생기고, 접근성과 이탈률에 직접 영향을 줍니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          세 수단은 배타적이지 않고 점수에 따라 섞입니다. 확실히 공격인 요청은 바로 차단하고, 애매한 요청에는
          확인 절차를 주며, 정상으로 보이는 요청은 그대로 통과시킵니다. 이 배분을 정하는 점수가 다음 절의
          주제입니다.
        </p>

        <p className="leading-7">
          요청 수를 세는 알고리즘 자체와 분산 환경에서의 집계 전략은{" "}
          <Link to="/ai/rate-limiting-and-reliability-patterns">레이트 리밋과 신뢰성 패턴</Link>이 소유합니다.
          이 절은 그 수단이 엣지 방어의 어느 층에 놓이고 무엇과 함께 쓰이는지를 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
