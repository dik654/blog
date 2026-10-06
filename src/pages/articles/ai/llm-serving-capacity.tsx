import ContentBoundary from "@/components/articles/content-boundary";
import Capacity from "./hybrid-attention-serving/Capacity";
import Deployment from "./hybrid-attention-serving/Deployment";
import VllmCapacityLogViz from "./hybrid-attention-serving/viz/VllmCapacityLogViz";

export default function LLMServingCapacityArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-5">
        <p className="text-sm font-semibold text-primary">Memory → admission</p>
        <h2 className="text-3xl font-bold tracking-tight">
          같은 65,536-token 요청인데 두 로그는 맞고 하나는 단위가 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            세 runtime 모두 <code>max_model_len=65,536</code>입니다. Gemma의 cache
            88,824 token을 나누면 1.36×이고 runtime 보고값도 1.36×입니다. Muse의
            352,736 token은 5.38×이고 보고값도 5.38×입니다. Qwen의 97,216 token은
            단순 계산으로 1.48×인데 runtime은 5.17×라고 적었습니다.
          </p>
          <p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p>
          <ol>
            <li>Gemma의 88,824÷65,536은 약 1.36이라 runtime 값과 맞을까요?</li>
            <li>Muse의 352,736 token은 max-length request 약 5.38개분일까요?</li>
            <li>Qwen의 97,216과 5.17×도 같은 단순 token 단위로 설명될까요?</li>
          </ol>
          <p>
            답은 <strong>예, 예, 아니요</strong>입니다. Qwen 행의 차이 3.69×는 계산
            실수로 덮을 값이 아니라 cache group이나 token-equivalent 표시 단위를 확인하라는
            신호입니다. 단위가 확인되기 전에는 세 model의 숫자를 같은 열에서 비교하지 않습니다.
          </p>
        </div>
        <VllmCapacityLogViz />
        <ContentBoundary article="llm-serving-capacity" />
        <p className="text-lg leading-8 text-foreground/90">
          KV pool은 저장 공간이고 admission은 실제 요청을 받을지 정하는 운영 결정입니다.
          남은 VRAM을 token slot으로 바꾼 뒤에도 prompt·output 길이, latency,
          preemption, headroom을 함께 봐야 합니다. 뒤 절은 byte→token→request 순서로
          단위를 바꿉니다.
        </p>
      </section>
      <Capacity />
      <Deployment />
    </>
  );
}
