import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import NTTConceptViz from "./viz/NTTConceptViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        NTT는 유한체 다항식의 평가와 복원을 O(n log n)에 계산한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          길이 n coefficient 벡터를 n개 점에서 직접 평가하면 n²개의 항을 계산해야 합니다. Number theoretic transform(NTT)은 평가점을 유한체의
          roots of unity로 제한하고 그 대칭을 재사용해 같은 값을 O(n log n)에 구합니다. 복소수 DFT를 빠르게 계산하는 FFT와 계산 graph는 닮았지만 NTT의
          모든 연산은 field 안에서 정확합니다.
        </p>
        <p>
          이 글은 <Link to="/crypto/finite-field-theory">소수체의 곱셈군</Link>
          과<Link to="/crypto/lagrange"> 다항식 보간</Link>을 선수 지식으로
          사용해, NTT matrix·primitive root·radix-2 butterfly·INTT·padding
          경계를 연결합니다. Signal frequency를 해석하는 complex DFT·sampling
          문제는
          <Link to="/ai/fft"> AI FFT 정본</Link>이 소유합니다.
        </p>
      </div>
      <ContentBoundary article="crypto-fft" />
      <NTTConceptViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>변환 자체와 빠른 알고리즘을 구분합니다</h3>
        <p>
          NTT는 coefficient vector를 evaluation vector로 바꾸는 invertible linear transform입니다. Radix-2
          Cooley–Tukey는 n이 2의 거듭제곱일 때 이 transform을 빠르게 계산하는 한 알고리즘입니다. FFT/NTT의 속도는 근삿값에서 나오는 것이 아닙니다. 같은
          field 연산 순서 안에서는 direct transform과 정확히 같은 결과를 냅니다.
        </p>
      </div>

      <div
        id="paper-pollard-ntt"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · NTT의 계산 구조
        </p>
        <p className="mt-2 text-sm font-semibold">
          Pollard (1971), The Fast Fourier Transform in a Finite Field
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 finite field 안에서 Fourier-type transform을 빠르게 계산하는 것입니다. 논문은 적절한 roots of unity를 가진 field에서 FFT
          구조를 사용하는 방법을 전개합니다. 여기까지가 논문이 말하는 범위입니다. 모든 prime과 transform length의 자동 호환, 현대 GPU 구현의 memory 병목 해소는
          그 밖의 문제입니다.
        </p>
        <a
          href="https://doi.org/10.1007/BF01934338"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          논문 원문 보기
        </a>
      </div>
    </section>
  );
}
