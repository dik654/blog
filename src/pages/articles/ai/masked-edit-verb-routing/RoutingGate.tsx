import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import GateViz from "./viz/GateViz";

export default function RoutingGate() {
  return (
    <section id="routing-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">모델 이름은 사용자도 에이전트도 고르지 않습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          표를 만들고 나면 그것을 어디에 둘지가 남습니다. 모델을 하나로 고정하면 여섯 동작 중 넷이 나빠지고 에이전트에게 고르게 하면 이 측정을 모르는 채로 최근에 본 이름을 고릅니다.
          둘 다 표를 버리는 선택입니다.
        </p>

        <p className="leading-7">
          세 번째 길은 호출 계약을 바꾸는 것입니다. 호출하는 쪽은 동작만 말합니다. 색을 바꾼다, 재질을 바꾼다,
          교체한다, 더한다. 어느 모델로 갈지는 표가 정하고, 마스크 확장값도 동작에서 따라옵니다.
        </p>

        <p className="leading-7">
          이 구조를 실제 요청 일곱 건으로 돌려 봤습니다. 사용자는 한 번도 모델 이름을 말하지 않았고 선택된 모델은 매번 표가 예측한 것이었습니다. 마스크 밖 변화량의 순서까지 표의
          예측과 같은 순서로 나왔습니다.
        </p>

        <p className="leading-7">
          일곱 건 중 다섯이 예측대로였고, 하나는 실패 지점과 이유가 숫자로 특정됐으며, 하나는 연산을 시작하기
          전에 거절됐습니다. 거절이 실패가 아니라 설계의 일부라는 점이 중요합니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          시간 비용도 이 배치에 들어갑니다. 같은 편집을 모델을 내린 직후에 돌리면 8초짜리가 23초가 되고 26초짜리가 55초가 됩니다. 차이의 절반 이상이 가중치를 올리는 시간입니다.
          동작마다 다른 모델로 보내는 라우팅은 편집마다 이 값을 냅니다. 같은 모델로 몰아 줄 수 있는 연속 편집에서는 두세 배가 달라집니다.
        </p>

        <p className="leading-7">
          측정할 때 한 가지 함정이 있었습니다. 같은 시드로 다시 돌리면 1~2초가 나오는데, 그건 재현성이 아니라 그래프 캐시가 답한 것입니다. 실제로 연산이 도는 값을 재려면 시드를
          바꿔야 하고 이 구분을 하지 않으면 표의 시간 열에 가짜 값이 섞입니다. 실제로 섞여 있었습니다.
        </p>

        <p className="leading-7">
          정리하면 이 글의 결론은 표 자체가 아니라 표를 두는 자리입니다. 모델 선택을 사람의 기억이나 언어 모델의 인상이 아니라 측정에 맡기고 마스크 확장처럼 직관과 반대인 값도 함께
          따라오게 하는 것입니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 순위는 한 장비·한 회차·하나의 프롬프트 문체에서 얻은
          것입니다. 모델마다 잘 맞는 프롬프트 방식이 다르다는 점을 통제하지 않았으므로, 표가 잰 것이 모델
          실력인지 제 문장이 누구에게 맞았는지는 이 측정만으로 가릴 수 없습니다. 지우기 칸이 비어 있는 문제는{" "}
          <Link to="/ai/generative-measurement-controls">계측기 검증</Link>에서 다룬 판정 도구 문제와 얽혀
          있어 별도 글로 다룹니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 라우팅 실행과 콜드·웜 시간 (2026-09-11, RTX 4090 48GB)"
        citeKey={4}
        href="https://github.com/dik654/blog"
      >
        사용자 문장 일곱 건을 실제 라우팅 코드로 통과시켜 선택된 모델과 결과를 기록했고, 별도로 모델을 내린
        직후와 연속 실행의 시간을 나눠 쟀습니다. 가중치 적재가 콜드 실행 시간의 절반을 넘었습니다. 같은 시드
        재실행은 그래프 캐시가 답하므로 시간 측정에서 제외해야 합니다.
      </CitationBlock>
    </section>
  );
}
