import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import PlatformViz from "./viz/PlatformViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">게이트웨이가 혼자 하던 일이 클러스터 안에서 여러 곳으로 흩어집니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          외부 제공자를 쓸 때 게이트웨이 하나가 맡던 일은 생각보다 많습니다. 모델 이름을 실제 엔드포인트로
          바꾸고, 키를 관리하고, 한도를 걸고, 실패하면 다른 제공자로 넘기고, 비용을 집계합니다. 이 전부가 한
          프로세스의 설정 파일 안에 있습니다.
        </p>

        <p className="leading-7">
          자체 클러스터에서 모델을 직접 돌리면 이 목록이 둘로 갈립니다. 한쪽은 여전히 게이트웨이의 일입니다.
          다른 한쪽은 클러스터가 맡아야 하는 일로 내려갑니다. 어느 복제본이 지금 여유가 있는지, 복제본 하나가
          파드 몇 개로 이뤄지는지, 고장 난 복제본을 어떻게 통째로 되살리는지 같은 것들입니다.
        </p>

        <p className="leading-7">
          내려간 쪽이 이 글의 주제입니다. 라우팅 규칙을 어떻게 고를지는 이미 정리된 주제이므로 반복하지 않고 그 규칙이 쿠버네티스 안에서 어디에 놓이고 무엇이 그것을 떠받쳐야 하는지를
          봅니다.
        </p>

        <ContentBoundary article="onprem-k8s-inference-platform" />

        <p className="leading-7">
          그리고 온프레미스에는 클라우드에 없는 제약이 하나 있습니다. 총 가속기 수가 고정돼 있다는 것입니다. 부하가 늘어도 노드를 더 살 수 없으므로 늘리는 문제가 아니라 지금 있는 것을
          어떻게 나눌지의 문제가 됩니다. 이 제약이 배치와 정책을 같은 것으로 만듭니다.
        </p>

        <p className="leading-7">
          복제본을 고르는 규칙 자체는{" "}
          <Link to="/cs/ai/disaggregated-prefill-decode-serving#routing">분리 서빙의 복제본 라우팅</Link>이,
          외부 제공자를 묶는 게이트웨이의 일은{" "}
          <Link to="/cs/ai/llm-gateway-and-model-routing">LLM 게이트웨이와 모델 라우팅</Link>이, 파드가 실제
          용량이 되기까지의 준비 과정은{" "}
          <Link to="/cs/ai/llm-serving-ops#k8s-gpu-fleet">서빙 운영</Link>이 소유합니다.
        </p>
      </div>

      <PlatformViz />
    </section>
  );
}
