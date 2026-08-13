import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import FieldMechanismViz from "./viz/FieldMechanismViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        유한체는 나눗셈까지 되돌릴 수 있는 유한한 계산 세계다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          영지식 증명은 아주 큰 정수를 그대로 다루지 않고, 정해진 소수 p로 나눈
          나머지 안에서 덧셈·곱셈·나눗셈을 반복합니다. 이때 중요한 조건은 계산
          결과가 유한한 집합 안에 머물면서도 0이 아닌 값으로 한 연산을 되돌릴 수
          있다는 것입니다. 이를 만족하는 대수 구조가 유한체(finite field)입니다.
        </p>
        <p>
          이 글은 소수체의 산술, 곱셈 역원과 원소의 order, 다항식 산술,
          Schwartz–Zippel bound, 확장체 구성을 차례로 설명합니다. 이후
          <Link to="/crypto/lagrange"> Lagrange 보간</Link>은 여러 평가값에서
          다항식을 복원하고, <Link to="/crypto/fft">NTT</Link>는 단위근 위의
          평가와 복원을 빠르게 수행합니다.
        </p>
      </div>

      <ContentBoundary article="finite-field-theory" />
      <FieldMechanismViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>군·환·체는 사용할 수 있는 연산이 다릅니다</h3>
        <p>
          군(group)은 한 연산에 대해 결합법칙·항등원·역원을 갖습니다. 환(ring)은
          덧셈군에 곱셈과 분배법칙을 더하지만, 정수 환처럼 곱셈 역원이 없는
          원소가 있을 수 있습니다. 체(field)는 0을 제외한 곱셈까지 군이므로 모든
          0이 아닌 값으로 나눌 수 있습니다. ZK 회로가 field를 쓰는 이유는 단지
          값의 범위가 작아서가 아니라 다항식의 나눗셈과 보간이 항상 정의되기
          때문입니다.
        </p>
        <p>
          유한체의 크기는 반드시 소수의 거듭제곱 pᵏ입니다. k=1이면 residue
          {`{0,…,p−1}`}를 쓰는 소수체 Fₚ이고, k&gt;1이면 기저체 원소 k개를
          좌표처럼 묶은 확장체입니다. 같은 크기의 유한체는 동형이지만 표현과
          곱셈 비용은 달라질 수 있습니다.
        </p>
      </div>

      <div
        id="paper-fips-finite-field"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          공식 규격 읽기 · 유한체 연산의 사용 범위
        </p>
        <p className="mt-2 text-sm font-semibold">
          NIST FIPS 186-5 · Digital Signature Standard
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 규격은 prime field와 binary field 위 타원곡선·서명 파라미터의 검증
          조건을 정의합니다. 유한체 산술이 실제 암호 규격에서 어떻게 제약되는지
          보여 주지만, 특정 ZK field의 성능이나 모든 extension representation의
          안전성을 보장하는 문서는 아닙니다.
        </p>
        <a
          href="https://csrc.nist.gov/pubs/fips/186-5/final"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          NIST 원문 보기
        </a>
      </div>
    </section>
  );
}
