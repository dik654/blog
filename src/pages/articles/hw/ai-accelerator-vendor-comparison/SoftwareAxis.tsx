import { Link } from "react-router-dom";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import SoftwareViz from "./viz/SoftwareViz";

export default function SoftwareAxis() {
  return (
    <section id="software-axis" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 코드가 그대로 도는지가 네 번째 축입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          하드웨어 표에는 나오지 않지만 실제 도입 비용을 가장 크게 좌우하는 축입니다. 지금 쓰는 서빙 엔진과
          커널, 양자화 형식, 프로파일링 도구가 그 가속기에서 그대로 도는지에 따라 "카드를 바꾸는 일"이 설정
          변경이 되기도 하고 몇 달짜리 이식 작업이 되기도 합니다.
        </p>

        <p className="leading-7">
          층을 나눠 보면 위험이 어디 있는지 보입니다. 학습·추론 프레임워크 수준은 대부분 벤더별 백엔드를
          제공하므로 모델 코드는 거의 그대로 갑니다. 문제는 그 아래입니다. 성능을 내는 커널이 특정 벤더 전용
          어셈블리나 라이브러리로 쓰여 있으면 그 부분은 다시 만들어야 합니다.
        </p>

        <p className="leading-7">
          서빙 엔진의 기능 커버리지도 층마다 다릅니다. 기본 경로는 여러 벤더를 지원하더라도, 특정 attention
          커널이나 양자화 형식, 추측 디코딩 같은 최적화는 한쪽에서만 성숙한 경우가 흔합니다. 그래서 "지원한다"는
          말을 기능 단위로 쪼개 확인해야 합니다.
        </p>
      </div>

      <SoftwareViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          확인 방법은 문서가 아니라 실행입니다. 지금 프로덕션에서 쓰는 정확한 모델과 양자화 형식, 서빙 엔진
          버전으로 후보 가속기에서 한 번 띄워 보는 것이 가장 빠릅니다. 이때 처리량보다 먼저 확인할 것은 기능이
          전부 켜지는지, 그리고 정확도가 기존과 같은지입니다.
        </p>

        <p className="leading-7">
          벤치마크 수치를 옮겨 읽을 때도 이 축이 개입합니다. 벤더가 공개한 수치는 그 벤더의 최적 경로에서 나온
          값이고, 내 스택에서 그 경로가 켜지지 않으면 재현되지 않습니다. 서빙 성능을 어떤 조건에서 재야 하는지는{" "}
          <Link to="/ai/serving-benchmark-methodology">서빙 벤치마크 방법론</Link>에서 다룹니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="이식 비용을 미리 재는 방법"
          preview="지금 스택에서 벤더 전용 경로를 몇 군데 쓰고 있는지 세는 것으로 시작합니다. 대개 커널과 양자화, 통신 라이브러리 세 곳입니다."
        >
          <p className="leading-7">
            먼저 모델 코드가 직접 부르는 벤더 전용 함수와 커스텀 커널을 찾습니다. 여기서 나온 목록이 반드시
            다시 만들어야 하는 부분입니다. 대부분은 attention과 정규화, 양자화 연산에 몰려 있습니다.
          </p>
          <p className="leading-7">
            다음은 양자화 형식입니다. 저장 형식이 그대로 읽히는지, 계산 경로가 같은 정밀도로 도는지를 봐야
            합니다. 형식이 다르면 체크포인트를 다시 만들어야 하고 정확도 검증도 처음부터 다시 합니다.
          </p>
          <p className="leading-7">
            마지막은 통신 라이브러리입니다. 여러 장을 묶는 구성이라면 collective 구현이 다른 라이브러리로
            바뀌므로 튜닝 값이 그대로 옮겨지지 않습니다. 이 계층의 일반 논의는{" "}
            <Link to="/gpu/gpu-collective-network">collective 네트워크</Link>에 있습니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
