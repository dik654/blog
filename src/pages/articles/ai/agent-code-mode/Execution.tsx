import ExecutionViz from "./viz/ExecutionViz";

export default function Execution() {
  return (
    <section id="execution" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">실행 파이프라인</h2>
      <div className="not-prose mb-8">
        <ExecutionViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          구현의 핵심은 모델에게 범용 shell과 무제한 네트워크를 주는 것이
          아니다. 필요한 API를 찾게 하고, 그 API만 호출할 수 있는 typed stub
          또는 capability proxy를 sandbox에 제공한다. program은 sandbox 안에서
          중간 데이터를 다룬 뒤 출력 budget에 맞는 결과만 반환한다.
        </p>

        <h3 id="tool-discovery" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          Tool discovery와 schema loading을 분리한다
        </h3>
        <p className="leading-7">
          tool이 수백·수천 개면 모든 schema를 매 요청의 prompt에 넣는 것부터
          부담이다. 먼저 이름·설명 색인에서 후보를 찾고, 선택한 tool의
          signature만 load하면 초기 context를 줄일 수 있다. 이 최적화는 program
          실행과 별개로도 쓸 수 있지만, Code Mode에서는 선택된 signature가
          그대로 코드의 API가 된다.
        </p>

        <h3 id="capability-binding" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          Type은 편의이고 capability가 보안 경계다
        </h3>
        <p className="leading-7">
          TypeScript type이나 generated SDK는 잘못된 인자와 반환 형태를
          줄여주지만, 읽기 API로 위장한 쓰기 동작이나 허용되지 않은 계정 접근을
          막지는 못한다. 실제 보안 경계는 runtime이 어떤
          tool·resource·credential을 해당 program에 연결했는지에서 생긴다.
        </p>
      </div>
    </section>
  );
}
