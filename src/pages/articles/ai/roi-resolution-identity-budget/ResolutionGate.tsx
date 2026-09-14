import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function ResolutionGate() {
  return (
    <section id="resolution-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">편집을 걸기 전에 대상이 몇 픽셀인지 먼저 봅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이 글의 결론은 한 문장으로 줄어듭니다. 편집의 성패를 가르는 단위는 프레임 해상도가 아니라 대상
          해상도입니다. 그래서 설정을 조정하기 전에 그 대상이 몇 픽셀인지부터 봐야 합니다.
        </p>

        <p className="leading-7">
          확인 순서는 넷입니다. 먼저 대상이 잠재 공간에서 충분한 칸을 받는지, 다음으로 모델 종류에 맞는 노이즈
          비율 구간을 쓰고 있는지, 그다음 크롭이 모델의 픽셀 예산 안에 있는지, 마지막으로 마스크가 그 동작에
          맞는 크기인지입니다.
        </p>

        <p className="leading-7">
          네 항목 모두 모델을 바꾸지 않고 답할 수 있는 것들입니다. 실제로 이 회차에서 결과를 가장 크게 바꾼
          변경도 모델 교체가 아니었습니다. 마스크를 좁힌 것 하나로 정체성이 0.142에서 0.943이 됐습니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          앞 글의 결론 하나를 좁힌 것도 기록합니다. 지시 편집 모델에서 노이즈 비율이 절벽이라는 관찰을 두고
          이 파라미터 자체가 레버가 아니라고 일반화했었는데, 그것은 그 모델 종류에 대한 이야기였습니다.
          일반 생성 모델에서는 레버가 맞고 창이 좁을 뿐입니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 축소 배율과 패치 크기는 구현마다 다르므로 토큰 수 계산은 관계를 보여 주는 용도입니다. 확대 비교는 한 소스에서 나온 결과이고 그림체나
          열화 방식이 다르면 순위가 달라질 수 있습니다.
        </p>

        <p className="leading-7">
          이어지는 글은 정체성 쪽입니다. 참조 이미지로 인물을 고정하면서 포즈는 따로 통제하는 방법과, 그 둘을
          한 장치에 맡겼을 때 무엇이 고장나는지를 다룹니다. 동작별 모델 선택은{" "}
          <Link to="/cs/ai/masked-edit-verb-routing">편집 동작과 모델 라우팅</Link>이 소유합니다.
        </p>
      </div>
    </section>
  );
}
