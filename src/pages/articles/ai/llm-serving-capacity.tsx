import ContentBoundary from "@/components/articles/content-boundary";
import Capacity from "./hybrid-attention-serving/Capacity";
import Deployment from "./hybrid-attention-serving/Deployment";

export default function LLMServingCapacityArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20 space-y-5">
        <p className="text-sm font-semibold text-primary">Memory → admission</p>
        <h2 className="text-3xl font-bold tracking-tight">
          KV pool은 저장 공간이고, admission은 운영 결정입니다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          남은 VRAM을 token slot으로 바꾸는 계산은 시작점입니다. 실제 사용자는
          서로 다른 prompt와 output 길이를 가지며 latency·preemption·quality
          조건도 함께 소비합니다. 이 글은 byte→token→request 순서로 단위를
          바꿉니다.
        </p>
        <ContentBoundary article="llm-serving-capacity" />
      </section>
      <Capacity />
      <Deployment />
    </>
  );
}
