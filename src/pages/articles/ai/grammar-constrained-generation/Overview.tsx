import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        구조화 출력: “JSON으로 답해”에서 decoder 제약으로
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          prompt는 모델이 올바른 형식을 선택할 가능성을 높이지만, 잘못된 괄호나
          여분의 문장을 물리적으로 금지하지는 않는다. 문법 제약 생성은 매 token
          step에서 현재 prefix 뒤에 올 수 있는 token만 남겨 sampling한다. 형식
          오류를 사후에 고치는 대신{" "}
          <strong>유효하지 않은 경로에 들어가는 것부터 막는 방식</strong>이다.
        </p>
        <ContentBoundary article="grammar-constrained-generation" />

        <h3 id="validity-boundary" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          보장하는 것과 보장하지 않는 것
        </h3>
        <p className="leading-7">
          JSON Schema나 grammar를 정확히 반영했다면 출력의 구문과 지정된
          type·enum 같은 구조 조건을 강제할 수 있다. 그러나 존재하지 않는 사용자
          ID, 위험한 shell 명령, 잘못된 금액처럼{" "}
          <strong>의미가 옳고 안전한지</strong>는 별도 validator와 policy가
          판정해야 한다. “parse 가능”과 “실행 가능”은 같은 보장이 아니다.
        </p>
      </div>
    </section>
  );
}
