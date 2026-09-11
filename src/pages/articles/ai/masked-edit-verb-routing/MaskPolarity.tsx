import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";
import MaskViz from "./viz/MaskViz";

export default function MaskPolarity() {
  return (
    <section id="mask-polarity" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">마스크를 넓히는 방향이 동작마다 반대입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          물건 교체가 표에서 가장 지저분한 동작이었습니다. 각반을 만들어 달라고 했더니 한쪽 다리가 하얗게 뜨고
          신발이 뭉개졌습니다. 저는 이걸 모델 약점으로 적었는데, 모델을 탓하기 전에 설정을 봤어야 했습니다.
        </p>

        <p className="leading-7">
          원인이 둘이었습니다. 하나는 2메가픽셀짜리 전체 프레임을 통째로 넘긴 것이고, 다른 하나는 마스크를 옛
          물건에 딱 맞게 잡은 것입니다. 앞의 것을 고치자 마스크 안 변화가 73.3에서 44.8로, 뒤의 것까지 고치자
          32.4로 떨어졌습니다.
        </p>

        <p className="leading-7">
          뒤의 것이 이 절의 주제입니다. 마스크가 부츠 모양에 딱 붙어 있으면 모델은 새 물건이 어디서 끝나야
          하는지 볼 수가 없습니다. 그래서 부츠 모양의 금속을 만듭니다. 정강이까지 마스크를 열어 주면 그제야
          관절식 각반이 나옵니다.
        </p>

        <p className="leading-7">
          이건 신중한 사용자의 직관과 정반대입니다. 선택을 대상에 정확히 맞추는 것이 조심스러운 태도처럼
          보이는데, 교체에서는 그게 결과를 나쁘게 만듭니다. 말해 주지 않으면 알 수 없는 종류의 규칙이라
          도구가 경고로 함께 내보내야 합니다.
        </p>
      </div>

      <MaskViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그런데 같은 손잡이가 다른 동작에서는 반대로 작동합니다. 지우기에서 마스크를 24픽셀만 넓혔더니 띠
          아래에 있던 가죽 벨트까지 함께 사라졌습니다. 지우기는 준 것을 지우므로 넓힌 만큼 더 지웁니다.
          96픽셀에서는 전체가 번졌습니다.
        </p>

        <p className="leading-7">
          그래서 두 동작은 같은 도구에 들어갈 수 없습니다. 교체는 기본값 96에 경고가 붙고, 지우기는 기본값
          0에 넓히지 말라는 경고가 붙습니다. 같은 이름의 파라미터가 한쪽에서는 필수이고 다른 쪽에서는 금지인
          셈입니다.
        </p>

        <p className="leading-7">
          교체 쪽에도 상한이 있습니다. 160픽셀까지 열면 변화량은 더 내려가지만 떠다니는 금속 파편이
          생깁니다. 넓힐수록 좋은 것이 아니라 새 물건이 자연스럽게 끝날 자리를 보여 줄 만큼만 열어 주는
          것입니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="이건 사실 두 개의 손잡이입니다"
          preview="모델이 참고해도 되는 범위와 모델이 칠해도 되는 범위는 별개인데, 하나의 파라미터가 둘을 동시에 밀고 있습니다."
        >
          <p className="leading-7">
            교체에서 마스크를 넓히는 이유는 모델에게 주변 구조를 보여 주기 위해서입니다. 지우기에서 넓히면 안
            되는 이유는 그만큼 더 칠하기 때문입니다. 두 요구가 충돌하는 것처럼 보이는 건 한 손잡이가 두 역할을
            겸하고 있어서입니다.
          </p>
          <p className="leading-7">
            나눌 수 있다면 "참고 범위는 넓게, 칠할 범위는 좁게"가 교체의 정답이 됩니다. 160픽셀에서 떠다니는
            파편이 생긴 것도 이 설명과 맞습니다. 참고 범위만 넓히려던 것이 칠할 범위까지 함께 넓혀서 생긴
            부작용입니다.
          </p>
          <p className="leading-7">
            현재 파이프라인에서는 분리하지 않았고, 96이라는 값은 두 효과가 맞바꿔지는 지점을 실측으로 찾은
            타협값입니다. 분리한 구현에서 이 값이 그대로일 이유는 없습니다.
          </p>
        </ProgressiveDetail>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 마스크 확장 스윕 (2026-09-11, RTX 4090 48GB)"
        citeKey={3}
        href="https://github.com/dik654/blog"
      >
        교체 동작에서 전체 프레임 73.3 → 영역 크롭 44.8 → 확장 48에서 33.8 → 96에서 32.4 → 160에서 28.7로
        내려갔고 160에서 떠다니는 파편이 생겼습니다. 지우기 동작에서는 확장 0에서 정상, 24에서 아래 레이어가
        함께 소실, 96에서 전체 번짐이었습니다. 한 소스·한 마스크에서의 스윕이며 대상의 크기와 모양에 따라
        적정값이 달라집니다.
      </CitationBlock>
    </section>
  );
}
