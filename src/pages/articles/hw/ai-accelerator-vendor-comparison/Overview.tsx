import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AxesViz from "./viz/AxesViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">스펙표를 나란히 놓는 것으로는 결론이 안 납니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          가속기를 고를 때 흔히 하는 일은 메모리 용량과 연산 성능을 표로 만들어 비교하는 것입니다. 그런데 그
          표만 보면 왜 어떤 워크로드에서는 숫자가 낮은 쪽이 더 빠른지, 왜 같은 카드로도 노드를 어떻게 묶느냐에
          따라 성능이 갈리는지가 설명되지 않습니다.
        </p>

        <p className="leading-7">
          벤더가 서로 다른 선택을 한 지점을 네 축으로 나누면 비교가 가능해집니다. 메모리를 얼마나 크고 빠르게
          두었는지, 가속기끼리 어떻게 연결했는지, 어떤 폼팩터로 보드에 올렸는지, 그리고 그 위에서 도는
          소프트웨어 생태계가 무엇인지입니다.
        </p>

        <p className="leading-7">
          이 네 축은 서로 독립이 아닙니다. 링크 방식을 정하면 폼팩터가 따라오고, 폼팩터가 전력과 냉각 방식을
          정하며, 그 조합이 한 노드에 몇 장을 올릴 수 있는지를 정합니다. 그래서 표의 한 칸만 보고 고르면 나머지
          칸이 뒤따라오는 결과를 놓칩니다.
        </p>

        <ContentBoundary article="ai-accelerator-vendor-comparison" />

        <p className="leading-7">
          NVIDIA 제품 계열 안에서의 비교는{" "}
          <Link to="/cs/gpu/hw-gpu-comparison">GPU 비교</Link>가, 링크 대역폭 공식 자체는{" "}
          <Link to="/cs/gpu/gpu-interconnects">GPU 인터커넥트</Link>가 이미 소유합니다. 이 글은 벤더가 갈라지는
          지점, 곧 서로 다른 회사가 같은 문제를 다르게 푼 방식만 다룹니다.
        </p>

        <p className="leading-7">
          순서는 네 축을 하나씩 보고 마지막에 기준일을 박은 스냅샷 표와 판단 순서로 닫습니다. 스펙 숫자는
          빠르게 낡으므로 표보다 축을 기억하는 편이 오래 갑니다.
        </p>
      </div>

      <AxesViz />
    </section>
  );
}
