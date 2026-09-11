import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function PlatformGate() {
  return (
    <section id="platform-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">직접 돌리기로 결정하기 전에 네 가지를 답할 수 있어야 합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          자체 클러스터로 옮기는 결정은 대개 비용이나 데이터 위치 때문에 내려집니다. 그 이유는 타당하지만, 옮긴
          뒤에 남는 일이 무엇인지 모르고 시작하면 절감한 만큼을 운영으로 되돌려주게 됩니다.
        </p>

        <p className="leading-7">
          첫 질문은 복제본 선택입니다. 요청을 어느 복제본으로 보낼지 누가 정하고 그 결정에 모델 서버의 어떤 값이 들어가는지 답할 수 있어야 합니다. 답이 "앞단 프록시가 순서대로"라면
          가속기 절반이 놀고 있을 가능성이 높습니다.
        </p>

        <p className="leading-7">
          둘째는 복제본의 모양입니다. 복제본 하나가 파드 몇 개인지, 그중 하나가 죽으면 무엇이 일어나는지가
          정해져 있어야 합니다. 여러 노드에 걸친 모델을 기본 배포 추상으로 올려 둔 구성은 첫 장애에서 반쪽만
          살아 있는 복제본을 만듭니다.
        </p>

        <p className="leading-7">
          셋째는 총량입니다. 부하가 늘 때 어떤 모델이 자리를 내주는지, 내준 뒤 다시 뜨는 데 얼마나 걸리는지를 미리 정해 두어야 합니다. 이것은 인프라 설정이 아니라 정책이므로 기술
          조직 혼자 정할 수 없습니다.
        </p>

        <p className="leading-7">
          넷째는 넘겨받은 항목입니다. 외부 게이트웨이가 하던 일 중 새 주인이 지정되지 않은 것이 있는지 목록으로
          확인해야 합니다. 특히 사용량 집계와 한도처럼 없어도 당장 장애가 나지 않는 항목이 조용히 빠집니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 온프레미스 추론 인프라는 라우팅 알고리즘을 고르는 일이 아니라 그 알고리즘이 설 자리를
          만드는 일입니다. 엔드포인트 선택에 모델 서버의 값이 들어갈 확장점, 파드 묶음을 복제 단위로 다루는
          추상, 고정된 총량을 나누는 정책, 그리고 게이트웨이에서 내려온 항목들의 새 주인입니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 적어 둡니다. 인용한 구성요소는 공개 문서에 적힌 구조까지만 다뤘고 특정 구현의 성능이나 성숙도를 평가하지 않습니다. 복제본 수·갱신 단위·지표 수집
          주기의 구체 값도 여기서 권고하지 않으며 부등식은 상한을 계산하는 방법을 보이는 데까지만 씁니다.
        </p>

        <p className="leading-7">
          이어지는 읽기로는 복제본을 고르는 규칙 자체를 다루는{" "}
          <Link to="/ai/disaggregated-prefill-decode-serving#routing">분리 서빙의 복제본 라우팅</Link>과, 파드가
          실제 용량이 되기까지를 다루는 <Link to="/ai/llm-serving-ops#k8s-gpu-fleet">서빙 운영</Link>이
          맞닿아 있습니다.
        </p>
      </div>
    </section>
  );
}
