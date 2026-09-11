import { Link } from "react-router-dom";
import ScaleViz from "./viz/ScaleViz";

export default function StyleScale() {
  return (
    <section id="style-scale" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 동작의 수치가 그림체에 따라 두 배씩 달라집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          표를 만든 소스는 3D 렌더 캐릭터 한 장이었습니다. 그 위에 세운 선택 규칙이 그 그림체에서만 참일
          위험이 실재합니다. 앱은 사진에도, 애니에도, 유화에도 쓰일 테니까요.
        </p>

        <p className="leading-7">
          그래서 같은 인물을 네 그림체로 만들어 같은 동작을 다시 걸었습니다. 결과는 셋으로 갈렸습니다. 하나는
          그대로 일반화됐고, 하나는 가드가 필요했으며, 하나는 그림체를 불문하고 여전히 손이 더 갑니다.
        </p>

        <p className="leading-7">
          색만 바꾸는 동작은 네 그림체 전부에서 잘 동작했습니다. 더 중요한 것은 각 그림이 자기 자신으로
          남았다는 점입니다. 애니는 셀 셰이딩을 유지한 채로, 유화는 붓질을 유지한 채로 색만 바뀌었습니다.
          선택 규칙이 그림체를 타지 않는다는 뜻입니다.
        </p>
      </div>

      <ScaleViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그런데 수치 자체는 크게 흔들립니다. 같은 색 변경이 3D에서 35, 애니에서 63입니다. 평면 색으로 칠해진
          그림은 픽셀 값이 넓은 면적에 걸쳐 한꺼번에 바뀌므로 평균 절대 변화가 구조적으로 커집니다. 모델이 더
          많이 바꾼 것이 아닙니다.
        </p>

        <p className="leading-7">
          그래서 "8 미만은 무동작, 28 초과는 과함" 같은 절대 임계값은 그림체 불변이 아닙니다. 이 표의 숫자로
          모델을 고를 때는 같은 그림체 안에서만 비교해야 하고, 다른 그림체의 값과 나란히 놓으면 안 됩니다.
        </p>

        <p className="leading-7">
          없던 것을 더하는 동작에서는 가드가 필요했습니다. 분할 모델이 잡아 준 "얼굴" 마스크는 얼굴 전체라,
          거기에 흉터를 더하자 사진에서는 여성이 남성이 되고 애니에서는 눈매와 표정이 함께 바뀌었습니다.
          동사가 틀린 게 아니라 마스크가 틀린 것입니다.
        </p>

        <p className="leading-7">
          이미 바뀐 인물은 뒤에서 되돌릴 수 없으므로, 얼굴이 프레임에 있고 마스크가 크롭의 4분의 1을 넘으면
          연산을 시작하기 전에 거절하도록 했습니다. 모델을 부르기 전에 막는 편이 결과를 보여 주고 되돌리라고
          하는 것보다 낫습니다. 마스크 크기가 곧 정체성 위험이라는 관계는{" "}
          <Link to="/ai/generative-measurement-controls#identity-metric">계측기 검증</Link>의 임계값으로
          판정했습니다.
        </p>
      </div>
    </section>
  );
}
