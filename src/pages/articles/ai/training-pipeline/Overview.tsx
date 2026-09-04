import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습 파이프라인은 batch 계산을 재현 가능한 run으로 만드는 시스템입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          PyTorch 학습의 중심 계산은 짧습니다. Batch를 model에 넣고 loss를 구한
          뒤 backward와 optimizer step을 실행합니다. 그러나 같은 코드가 어제는
          잘 되고 오늘은 달라지는 이유는 대개 이 네 줄 밖에 있습니다. 어떤
          sample을 어떤 순서로 읽었는지, train과 validation에서 어떤 state가
          바뀌었는지, 중단 시 무엇을 저장했는지, 최종 metric을 어떤 분모로
          집계했는지가 run의 결과를 바꿉니다.
        </p>
        <p>
          따라서 한 run은 <strong>data snapshot·split·transform</strong>,
          <strong> model·optimizer·update clock</strong>, <strong>RNG·sampler·checkpoint</strong>,
          <strong> metric·environment·artifact lineage</strong>를 함께 묶은 실행입니다.
          이 중 하나를 잃으면 같은 설정을 다시 실행하거나 장애 직전에서 이어
          학습했다는 주장을 검증할 수 없습니다.
        </p>
        <p>
          Forward·backpropagation과 optimizer의 수학은 <Link to="/ai/backprop-optimization">역전파 글</Link>과
          <Link to="/ai/optimizers"> optimizer 글</Link>이 소유합니다. 이 글에서는
          그 계산을 둘러싼 data·phase·resume·observation contract에 집중합니다.
        </p>
      </div>

      <ContentBoundary article="training-pipeline" />

      <div className="not-prose my-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          뒤에서는 sample이 batch가 되는 경로를 먼저 고정한 다음 optimizer update가 일어나는 clock과 validation의 read-only 경계를 분리합니다.
          이어서 best artifact와 resume checkpoint를 구분하고 마지막에는 중단 없는 실행과 저장 후 재개한 실행을 실제로 비교합니다. 저장 파일이 존재한다는 사실은
          아직 복구가 된다는 증거가 아닙니다.
        </p>
      </div>
    </section>
  );
}
