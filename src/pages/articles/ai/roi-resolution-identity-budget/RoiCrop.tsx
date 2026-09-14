import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import RoiViz from "./viz/RoiViz";

export default function RoiCrop() {
  return (
    <section id="roi-crop" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">잘라 보낼 크기는 모델이 실제로 받는 예산으로 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          대상을 크게 만들려면 편집할 영역만 잘라 보내고 결과를 원위치에 합성하면 됩니다. 단순해 보이는데,
          얼마나 넉넉하게 자를지에서 반직관적인 규칙이 나옵니다. 크게 자를수록 좋은 것이 아닙니다.
        </p>

        <p className="leading-7">
          모델마다 받아들이는 총 픽셀 예산이 정해져 있기 때문입니다. 어떤 모델은 들어온 이미지를 정해진 넓이에 맞춰 다시 샘플링합니다. 어떤 모델은 미리 정해 둔 해상도 집합 중 하나로
          스냅합니다. 어느 쪽이든 예산을 넘겨 보내면 그만큼을 버리라고 보내는 셈입니다.
        </p>

        <p className="leading-7">
          그래서 4메가픽셀짜리 크롭을 1메가픽셀 예산의 모델에 보내면 모델은 그것을 1메가픽셀로 줄여서 봅니다. 잘라 낸 의미가 사라질 뿐 아니라 그 안의 대상도 함께 작아집니다. 잘라
          보내는 목적이 대상을 크게 만드는 것이었는데 정반대가 됩니다.
        </p>

        <p className="leading-7">
          실제로 이 실수를 했습니다. 물건 교체가 지저분했던 원인 중 하나가 2메가픽셀 전체 프레임을 그대로 넘긴 것이었습니다. 영역만 잘라 보내자 마스크 안 변화가 73.3에서 44.8로
          떨어졌습니다.
        </p>
      </div>

      <RoiViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          규칙은 두 단계입니다. 먼저 대상 주변으로 맥락이 들어갈 만큼 여유를 두고 자릅니다. 그다음 그 크롭이 모델의 예산을 넘지 않는지 확인합니다. 넘으면 크롭을 줄이는 것이 아니라
          크롭 안에서 대상이 차지하는 비율을 유지한 채 예산에 맞춥니다.
        </p>

        <p className="leading-7">
          마스크 크기도 같은 축에 있습니다. 얼굴 부위를 고치는 편집에서 마스크를 눈부터 입까지의 바운딩 박스로 잡으면 얼굴 절반을 재생성하게 되고 정체성이 0.142까지 떨어집니다. 같은
          모델·프롬프트·시드에서 마스크만 뺨을 따라가는 좁은 띠로 바꾸자 0.943이 됐습니다.
        </p>

        <p className="leading-7">
          이 두 수치의 차이가 이 글에서 가장 실용적인 숫자입니다. 모델을 바꾼 것도, 프롬프트를 다듬은 것도
          아니고 마스크만 좁혔습니다. 부위 편집 실패의 상당수가 모델이 아니라 "어디까지를 그 부위로 볼
          것인가"에서 나옵니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="그러면 마스크는 무조건 좁게 잡는 것이 맞습니까"
          preview="동작에 따라 다릅니다. 부위 편집과 사실감 올리기는 좁게, 물건 교체는 넓게 잡아야 합니다."
        >
          <p className="leading-7">
            눈썹이나 코처럼 기존 형태를 바꾸는 편집에서는 좁을수록 좋습니다. 바꿀 대상 밖의 픽셀이 재생성
            범위에 들어가면 그만큼 인물이 흔들립니다.
          </p>
          <p className="leading-7">
            반대로 물건을 다른 물건으로 바꾸는 편집에서는 마스크가 옛 물건에 딱 붙어 있으면 새 물건이 어디서
            끝나야 하는지 모델이 볼 수 없습니다. 이쪽은 넓혀야 결과가 좋아집니다.
          </p>
          <p className="leading-7">
            그래서 "마스크를 좁게"는 규칙이 아니라 동작별 기본값의 한쪽 끝입니다. 동작마다 반대 방향인
            이유는 <Link to="/cs/ai/masked-edit-verb-routing#mask-polarity">편집 동작과 모델 라우팅</Link>이
            소유합니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
