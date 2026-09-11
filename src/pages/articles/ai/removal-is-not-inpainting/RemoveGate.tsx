import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function RemoveGate() {
  return (
    <section id="remove-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">모델을 바꾸기 전에 도구의 종류를 먼저 의심합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이 회차의 교훈은 특정 모델에 대한 것이 아닙니다. 일곱 개가 같은 방식으로 실패했을 때 여덟 번째를
          찾는 대신 도구의 종류를 의심했어야 한다는 것입니다. 같은 실패가 전부에서 나타나면 그건 선택의 문제가
          아니라 범주의 문제입니다.
        </p>

        <p className="leading-7">
          판정 근거도 다시 적어 둡니다. 자동 판정기가 없으므로 성공 판단은 네 그림체 대조표를 눈으로 본 것과
          마스크 밖 변화량 두 가지에 기대고 있습니다. 대조표에서는 네 그림체 모두 띠가 사라지고 밑에 있던 것이
          이어지며, 이건 애매하지 않습니다.
        </p>

        <p className="leading-7">
          다만 "몇 퍼센트에서 실패하는가" 같은 정량 주장은 이 회차에서 할 수 없고, 하지 않았습니다. 계측기
          둘이 각자의 대조군에서 실패했기 때문입니다. 그 실패가 없었다면 이 글에 훨씬 자신 있는 숫자가 들어갔을
          텐데, 그 숫자는 틀렸을 것입니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 지우기 도구는 세 가지 좁은 계약으로 서 있습니다. 프롬프트를 받지 않고, 마스크 확장 기본값이
          0이며, 세기를 254에서 자릅니다. 셋 다 기능을 빼는 방향의 결정이고, 그 좁음이 이 도구가 무엇을
          보장하는지를 말해 줍니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 실패한 일곱 모델은 설치된 목록이며 다른 모델이 같은 결과를
          낸다는 뜻이 아닙니다. 클라우드 API로 제공되는 전용 제거 모델은 아예 시험하지 못했습니다. 2단계 조합의
          기각도 증류된 빠른 모델을 다시 그리기에 쓴 조건에서의 결론입니다.
        </p>

        <p className="leading-7">
          이어지는 글은 해상도 쪽입니다. 같은 편집이 얼굴 크기에 따라 성공하고 실패하는 이유와, 리파인을
          프레임 전체가 아니라 영역별로 걸어야 하는 근거를 다룹니다. 동작 분류와 모델 선택은{" "}
          <Link to="/ai/masked-edit-verb-routing">편집 동작과 모델 라우팅</Link>이 소유합니다.
        </p>
      </div>
    </section>
  );
}
