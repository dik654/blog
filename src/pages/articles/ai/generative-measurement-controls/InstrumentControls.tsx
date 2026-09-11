import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ControlViz from "./viz/ControlViz";

export default function InstrumentControls() {
  return (
    <section id="instrument-controls" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">계측기마다 답을 아는 입력을 하나씩 같이 돌립니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          "지웠는가"를 판정해야 하는 회차가 있었습니다. 픽셀 변화량으로는 판정할 수 없습니다. 물건을 지운
          결과와 그 자리에 다른 물건을 그려 넣은 결과가 똑같이 큰 변화로 나오고, 오히려 바꿔치기 쪽이 더 높은
          점수를 받습니다.
        </p>

        <p className="leading-7">
          그래서 독립된 계측기 둘을 붙였습니다. 하나는 분할 모델에게 결과 이미지에서 그 물건을 다시 찾아보게
          하는 것, 다른 하나는 시각 언어 모델에게 전후를 보여 주고 판정시키는 것입니다. 둘 다 자기 대조군에서
          실패했습니다.
        </p>

        <p className="leading-7">
          분할 모델 쪽은 원본 이미지를 같은 계측기에 통과시키자 드러났습니다. 애니와 유화 원본에서 애초에 그
          물건을 찾지 못했습니다. 대조군 없이 결과만 봤다면 "잔여 0"을 네 건의 성공으로 읽었을 텐데, 실제로는
          계측기가 원본에서도 못 찾은 것이었습니다.
        </p>

        <p className="leading-7">
          언어 모델 쪽은 같은 그림을 두 번 준 대조군에서 드러났습니다. 전후가 동일한 네 건 중 두 건을
          "제거됨"이라고 답했습니다. 절반이 틀리는 판정기로 열두 칸을 채점하고 있었던 것입니다.
        </p>

        <p className="leading-7">
          그리고 둘 다 프레임을 통째로 파괴한 결과를 성공으로 채점했습니다. 이미지를 망가뜨리면 그 물건도 함께
          사라지므로 "없어졌는가"만 묻는 계측기는 이걸 구분하지 못합니다. 잡아낸 것은 마스크 밖 변화량 하나뿐이었습니다.
        </p>
      </div>

      <ControlViz />

      <TermBreakdown
        title="계측기에 붙이는 세 가지 대조군"
        description="비용은 셀 하나씩이고, 없으면 회차 전체가 조용히 무의미해집니다."
        items={[
          {
            term: "원본 자신",
            description: "편집하지 않은 입력을 같은 계측기에 통과시킵니다.",
            example: "분할 모델이 원본에서도 대상을 못 찾는다는 사실이 여기서 드러났습니다.",
            boundary: "계측기가 원본에서 정상이어도 결과 이미지의 분포에서 또 실패할 수 있습니다.",
          },
          {
            term: "무동작",
            description: "아무것도 바꾸지 않는 설정으로 파이프라인을 돌립니다.",
            example: "오토인코더 왕복만 한 값이 마스크 밖 수치의 바닥이 됩니다.",
            boundary: "무동작의 정의가 파이프라인마다 다르므로 어느 단계까지 통과시켰는지 밝혀야 합니다.",
          },
          {
            term: "자기 자신 대 자기 자신",
            description: "같은 입력을 두 번 주고 판정기가 '변화 없음'이라고 답하는지 봅니다.",
            example: "언어 모델 판정기가 절반을 '제거됨'이라고 답한 것이 여기서 잡혔습니다.",
            boundary: "통과했다고 해서 실제 변화를 정확히 판정한다는 보장은 아니고, 하한만 확인합니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          이 프로젝트에서 지표가 틀린 것이 일곱 번입니다. 매번 모양이 같습니다. 그럴듯한 숫자가 먼저 나오고,
          그 숫자로 결론을 쓰려는 순간 대조군이 없다는 걸 알아차리고, 붙여 보면 계측기가 다른 것을 재고 있었던
          것입니다. 그래서 규칙을 하나 고정했습니다.
        </p>

        <p className="leading-7">
          계측기를 새로 붙일 때는 답을 아는 입력을 하나 같이 돌립니다. 어떤 계측기든 예외 없이 적용하고, 그
          대조군이 실패하면 그 회차의 숫자는 쓰지 않습니다. 비용은 실행 한 번이고, 없을 때의 비용은 회차
          전체입니다.
        </p>

        <p className="leading-7">
          그리고 숫자가 후보를 좁히더라도 마지막 판정은 그림이 합니다. 픽셀 변화량은 얼마나 변했는지는 재도
          무엇으로 변했는지는 못 잽니다 — 피부를 다듬은 것과 선을 그린 것이 같은 값으로 나옵니다. 벤치마크
          재현성과 기준선 설계 일반론은{" "}
          <Link to="/ai/serving-benchmark-methodology#reproducibility">서빙 벤치마크 방법론</Link>이
          소유하고, 이 절은 생성 결과 판정에서 계측기 자체를 검증하는 부분만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
