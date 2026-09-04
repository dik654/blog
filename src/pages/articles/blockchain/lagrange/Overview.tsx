import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import LagrangeConceptViz from "./viz/LagrangeConceptViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Lagrange 보간은 표본마다 켜지는 selector를 더해 다항식을 복원한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          서로 다른 x 좌표 n개와 그 위치의 y값이 주어지면 degree n−1 이하 다항식은 정확히 하나로 정해집니다. Lagrange interpolation은 연립방정식을 풀지
          않고도 각 표본점에서 자기 값만 선택하는 basis polynomial을 만들어 그 다항식을 직접 구성합니다.
        </p>
        <p>
          나눗셈은 <Link to="/crypto/finite-field-theory">유한체 산술</Link>을
          사용합니다. 이 글은 selector basis·유일성·vanishing
          polynomial·barycentric evaluation을 소유하며, 규칙적인 단위근
          도메인에서의 빠른 변환은
          <Link to="/crypto/fft"> NTT 글</Link>에서 이어집니다.
        </p>
      </div>
      <ContentBoundary article="lagrange" />
      <LagrangeConceptViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>존재와 유일성은 서로 다른 주장입니다</h3>
        <p>
          Lagrange 식은 실제로 모든 점을 통과하는 다항식을 만들어 존재를 보여 줍니다. 유일성은 같은 점을 통과하는 두 degree n−1 이하 다항식의 차이가 n개의 서로 다른
          root를 갖는다고 가정하면 따라옵니다. 0이 아닌 degree n−1 다항식은 root가 많아야 n−1개이므로 차이는 zero polynomial일 수밖에 없습니다.
        </p>
      </div>

      <div
        id="reference-dlmf-interpolation"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 참고문헌 · 다항식 보간
        </p>
        <p className="mt-2 text-sm font-semibold">
          NIST Digital Library of Mathematical Functions · Interpolation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          NIST DLMF는 Lagrange interpolation과 divided difference를 표준 수식과
          참고문헌으로 정리합니다. 이 글은 그 보간 공식을 finite field에서도
          분모가 invertible한 조건으로 사용합니다. DLMF의 실수 근사 오차 결과를
          finite-field ZK protocol의 soundness로 옮기지는 않습니다.
        </p>
        <a
          href="https://dlmf.nist.gov/3.3"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          DLMF 원문 보기
        </a>
      </div>
    </section>
  );
}
