import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function SeparationGate() {
  return (
    <section id="separation-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">한 신호가 두 역할을 겸하고 있는지 먼저 확인합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이 회차에서 시간을 가장 많이 쓴 두 지점이 모두 같은 모양이었습니다. 결과가 안 나오는 원인을 엉뚱한
          곳에서 찾은 것입니다. 한 번은 문구를 다듬었고, 한 번은 손잡이를 반대로 돌렸습니다.
        </p>

        <p className="leading-7">
          첫 번째는 참조 조건이 자세까지 붙잡고 있다는 사실을 못 본 것이었습니다. 문구를 바꿔도 회전 각도가
          소수점 한 자리까지 같다는 측정이 나오고서야 문장의 문제가 아니라는 것이 확정됐습니다.
        </p>

        <p className="leading-7">
          두 번째는 정체성을 거는 구간을 조절하면서 반대쪽을 돌린 것이었습니다. 초반에만 걸어 봐도 방향이
          안 풀린다는 결과로 "이 방식은 못 쓴다"고 접을 뻔했는데, 구조가 정해지는 것이 바로 그 초반이라
          질문이 거꾸로였습니다.
        </p>

        <p className="leading-7">
          세 번째로 후면 뷰의 원인 진단도 틀렸습니다. 정체성 주입의 편향으로 봤는데 주입을 꺼도 같은 결과가 나왔고 실제 원인은 따로 있었습니다. 방향을 표현할 신호가 그 실행에 하나도
          없었습니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          세 번 모두 같은 절차가 답을 줬습니다. 의심하는 신호를 완전히 꺼 보는 것입니다. 참조를 빼자 몸이
          돌았고, 정체성 주입을 끄자 후면 얼굴이 그대로였습니다. 둘 다 제거 실험 한 번으로 원인이 확정됐습니다.
        </p>

        <p className="leading-7">
          정리하면 이 글의 결론은 세 신호 구성이 아니라 그 구성을 찾는 방법입니다. 결과가 안 나올 때 설정을
          미세 조정하기 전에, 어떤 신호가 지금 두 가지 일을 하고 있지 않은지 확인하고 의심되는 것을 하나씩 꺼
          봅니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 세기와 적용 구간의 구체 값은 이 모델 조합에서 얻은 것이며 다른 조합에서 그대로 쓸 수 없습니다. 그리고 여기서 성립한 네 각도는 한
          인물·한 의상에서 나온 결과라 다른 소재에서 같은 값이 나온다는 뜻이 아닙니다.
        </p>

        <p className="leading-7">
          이어지는 글은 다양성 쪽입니다. 참조가 정체성을 공급한다면 그 참조를 어디서 얻는지, 그리고 모델을
          설득해서 다양한 인물을 뽑을 수 있는지를 다룹니다. 해상도와 영역별 처리는{" "}
          <Link to="/cs/ai/roi-resolution-identity-budget">해상도 예산</Link>이 소유합니다.
        </p>
      </div>
    </section>
  );
}
