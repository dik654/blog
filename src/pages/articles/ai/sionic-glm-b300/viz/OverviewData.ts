import { defineArticleFlow } from "@/components/viz/article-flow";

export const STEPS = defineArticleFlow([
  {
    id: "decode-roofline",
    stage: "background",
    label: "batch-1 decode는 큰 weight를 읽고 작은 activation을 계산한다",
    body: "MoE가 active weight를 줄여도 token step마다 HBM·collective·launch 비용이 남습니다.",
  },
  {
    id: "unused-hardware",
    stage: "problem",
    label: "낮은 CTA 수·직렬 pipeline·작은 kernel이 B300을 놀린다",
    body: "peak FLOPS가 높아도 memory request와 asynchronous overlap이 부족하면 실효 bandwidth가 낮습니다.",
  },
  {
    id: "two-levers",
    stage: "idea",
    label: "forward 비용과 token당 forward 수를 별도 축으로 줄인다",
    body: "kernel·runtime은 한 번의 forward를, MTP는 확정 token당 main-model forward 수를 줄입니다.",
  },
  {
    id: "measure-stack",
    stage: "implementation",
    label:
      "roofline → kernel → runtime → acceptance를 같은 ledger에서 측정한다",
    body: "µs와 tok/s를 섞지 않고 각 수치의 hardware·batch·precision·commit 조건을 남깁니다.",
  },
]);
