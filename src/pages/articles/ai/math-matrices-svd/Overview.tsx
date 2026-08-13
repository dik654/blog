import { Link } from "react-router-dom";
import MatrixMapViz from "./viz/MatrixMapViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        행렬은 숫자 표가 아니라 여러 방향을 한 번에 바꾸는 함수다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          단어×문맥 count, image batch, neural-network weight는 모두 행과 열을 가진
          숫자 표로 저장됩니다. 하지만 모양만 외우면 왜 곱셈 순서가 중요하고 SVD가
          무엇을 압축하는지 이해하기 어렵습니다. 행렬을 input vector의 여러 좌표를
          섞어 output vector를 만드는 <strong>linear map</strong>으로 읽으면 shape,
          composition, rank와 low-rank approximation이 하나의 흐름으로 연결됩니다.
        </p>
        <p>
          이 글은 <Link to="/ai/math-vectors-inner-products">벡터·내적 정본</Link>의
          좌표·dot product·projection을 사용합니다. 먼저 작은 2×2 계산으로 행 하나가
          output coordinate 하나를 만드는 과정을 확인하고, 그 계산을 곱셈·rank·SVD로
          확장합니다. 마지막에는 큰 word–context matrix를 k개의 공유 방향으로 줄일 때
          무엇이 보존되고 무엇이 사라지는지까지 다룹니다.
        </p>
      </div>
      <MatrixMapViz />
    </section>
  );
}
