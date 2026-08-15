import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ContextViz from "./viz/ContextViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">Decode state first</p>
        <h2 className="text-3xl font-bold tracking-tight">
          다음 token을 만들 때 과거 계산을 어디까지 보존할까
        </h2>
      </header>

      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
        <p>
          언어 모델은 지금까지의 token을 읽고 다음 token 하나를 만듭니다. 다음
          step에서도 같은 과거를 다시 보므로, 모든 attention projection을 처음부터
          계산하면 이미 한 일을 계속 반복하게 됩니다. KV cache는 이 반복을 줄이는
          runtime 기억입니다.
        </p>
        <p>
          먼저 Query·Key·Value를 하나씩 구분하고, 그 뒤에만 MHA·GQA·MQA를
          조합합니다. 모델 이름이나 최대 context 숫자는 이 모양을 이해한 다음에
          적용합니다.
        </p>
        <ContentBoundary article="kv-cache-fundamentals" />
      </div>

      <TermBreakdown
        title="Attention의 세 역할을 한 줄씩 고정합니다"
        description="Q·K·V를 한 덩어리 약어로 외우지 않고, 현재 조회와 과거 기록의 역할을 먼저 나눕니다."
        items={[
          {
            term: "Query · 현재 질문",
            description:
              "지금 처리하는 token이 과거 기록에서 무엇을 찾을지 표현한 vector입니다.",
            example: "새 token마다 새 Query를 만들고 그 step에서 사용합니다.",
            boundary: "다음 step은 다른 현재 token이므로 이전 Query를 cache에 남기지 않습니다.",
          },
          {
            term: "Key · 과거 주소",
            description:
              "과거 token이 어떤 내용과 관련되는지 비교할 수 있게 만든 lookup vector입니다.",
            example: "현재 Query와 과거 Key들의 score를 계산해 읽을 위치를 고릅니다.",
            boundary: "Key는 원문 token ID가 아니라 layer별 learned projection입니다.",
          },
          {
            term: "Value · 과거 내용",
            description:
              "선택된 과거 위치에서 현재 token으로 가져올 정보를 담은 vector입니다.",
            example: "Query–Key score로 만든 비율을 과거 Value에 적용해 읽은 결과를 만듭니다.",
            boundary: "Value도 layer마다 다르며 model weight와는 별도인 request state입니다.",
          },
        ]}
      />

      <div className="not-prose my-8">
        <ContextViz />
      </div>
    </section>
  );
}
