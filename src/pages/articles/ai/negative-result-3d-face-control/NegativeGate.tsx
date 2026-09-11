import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function NegativeGate() {
  return (
    <section id="negative-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">실패한 경로를 지우지 않는 것이 다음 판단을 바꿉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          세 라운드를 정리하면 이렇습니다. 조립식 메쉬는 형태를 전달했지만 부속물까지 복사했고, 단일 두상은
          깨끗한 대신 결과가 수렴했으며, 매 단계 조건화는 성공처럼 보였지만 그 분리가 난수와 구분되지
          않았습니다.
        </p>

        <p className="leading-7">
          이 기록이 남아 있어서 두 가지가 달라집니다. 하나는 같은 발상이 다시 떠올랐을 때 같은 세 라운드를
          반복하지 않는다는 것이고, 다른 하나는 이 실패가 다른 관찰과 맞물려 더 큰 결론을 만든다는 것입니다.
        </p>

        <p className="leading-7">
          여기서 끝까지 안 움직이던 것은 광대와 턱의 너비 축이었습니다. 텍스트로 얼굴을 묘사하는 경로에서도
          같은 축이 노이즈 수준에서 멈췄습니다. 두 경로 모두에서 움직이지 않는다면 방법의 문제가 아니라
          모델이 그 축의 제어를 배우지 않았다는 쪽에 무게가 실립니다.
        </p>

        <p className="leading-7">
          그리고 실제로 필요했던 것은 이 경로가 아니었습니다. 서로 다른 인물이 필요하면 참조에서 정체성을
          가져오면 되고, 그 답은 이 실패를 확인한 뒤에 찾았습니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          방법론으로 남는 것은 셋입니다. 같은 조정을 두 번 했는데 변화가 없으면 세 번째 대신 측정할 것,
          고정해 둔 변수를 의심하고 대조군을 붙일 것, 그리고 지표가 좋아지는 방향으로 밀기 전에 그 끝점의
          이미지를 직접 볼 것입니다.
        </p>

        <p className="leading-7">
          셋 다 이 회차에서 각각 한 번씩 결론을 바꿨습니다. 새 모델이나 새 파라미터가 아니라 이미 가지고
          있던 결과를 다시 본 것이 차이를 만들었습니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 실패한 것은 이 세 방법이며 3차원 형태로 얼굴을 제어하는
          모든 접근이 불가능하다는 뜻이 아닙니다. 네 얼굴 표본이라 편차 추정이 거칠고, 수치는 한 장비의
          특정 모델 조합에서 얻은 것입니다.
        </p>

        <p className="leading-7">
          이 글로 실측 시리즈가 끝납니다. 계측기를 세우고, 편집 동작을 나누고, 지우기를 다른 도구로 옮기고,
          해상도 예산을 정하고, 정체성과 포즈를 분리하고, 다양성의 출처를 찾은 여섯 편이{" "}
          <Link to="/ai/generative-measurement-controls">계측기 검증</Link>에서 시작합니다.
        </p>
      </div>
    </section>
  );
}
