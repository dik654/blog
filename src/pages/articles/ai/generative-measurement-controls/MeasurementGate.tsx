import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function MeasurementGate() {
  return (
    <section id="measurement-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">숫자를 쓰기 전에 네 가지를 답할 수 있어야 합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          여기까지의 검증을 네 질문으로 줄일 수 있습니다. 새 계측기를 붙일 때마다 같은 순서로 물으면 앞의 일곱
          번 같은 실수를 반복하지 않습니다.
        </p>

        <p className="leading-7">
          첫째, 이 도구의 적용 범위 안에 있습니까. 사진으로 학습된 얼굴 모델을 그림에 쓰고 있다면 그 스타일에서
          탐지가 되는지부터 확인해야 합니다. 실패가 낮은 점수처럼 보이므로 결과 표만 봐서는 알 수 없습니다.
        </p>

        <p className="leading-7">
          둘째, 임계값의 근거가 무엇입니까. 어디선가 본 기본값이라면 그건 검증되지 않은 가정입니다. 남남 쌍을
          만들어 재고, 허용할 오탐률을 먼저 정한 뒤 그로부터 값을 얻어야 합니다.
        </p>

        <p className="leading-7">
          셋째, 이 숫자의 바닥값이 얼마입니까. 아무것도 하지 않았을 때 0이 나오지 않는 지표라면 그 바닥을 재서
          빼야 하고, 바닥값이 입력에 의존한다면 같은 입력에서 잰 값으로만 빼야 합니다.
        </p>

        <p className="leading-7">
          넷째, 절대값입니까 차이입니까. 같은 조건에서 두 번 돌려 그 차이를 보는 지표는 이런 오염에 면역이고,
          한 번 돌린 값을 그대로 쓰는 지표는 취약합니다. 가능하면 비교를 차이로 설계하는 편이 안전합니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 계측은 실험의 배경이 아니라 실험의 일부입니다. 이 글에서 판정이 세 번 뒤집혔는데, 매번
          차이를 만든 것은 새 모델이나 새 파라미터가 아니라 고정해 둔 값을 의심하고 대조군을 붙인 것이었습니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 인용한 수치는 한 대의 장비에서 특정 모델 조합으로 얻은
          것이라 다른 탐지기·인식기 조합으로 일반화하지 않습니다. 임계값 0.40도 이 표본에서 새지 않았다는
          뜻이지 모든 상황의 권고값이 아닙니다.
        </p>

        <p className="leading-7">
          이어지는 글들은 여기서 세운 계측기로 확산 편집을 잽니다. 편집 동사마다 다른 모델이 필요하다는 것과
          그 선택을 데이터로 만드는 방법은{" "}
          <Link to="/ai/masked-edit-verb-routing">편집 동사와 모델 라우팅</Link>이 다룹니다.
        </p>
      </div>
    </section>
  );
}
