import { defineArticleFlow } from "@/components/viz/article-flow";

export const STEPS = defineArticleFlow([
  {
    id: "frontier-scale",
    stage: "background",
    label: "MoE는 total capacity와 token당 compute를 분리한다",
    body: "K3는 2.8T 전체 파라미터 중 104B를 token마다 활성화합니다.",
  },
  {
    id: "three-bottlenecks",
    stage: "problem",
    label: "문제: sequence·depth·width가 서로 다른 병목을 만든다",
    body: "긴 문맥은 attention state, 깊이는 residual 정보 흐름, 넓은 MoE는 traffic과 routing 안정성을 압박합니다.",
  },
  {
    id: "separate-mechanisms",
    stage: "idea",
    label: "아이디어: 세 축을 별도 mechanism으로 스케일링한다",
    body: "KDA+MLA, AttnRes, Stable LatentMoE가 각각 한 축의 비용을 다시 배분합니다.",
  },
  {
    id: "hybrid-backbone",
    stage: "implementation",
    label: "구현: hybrid attention·block residual·latent experts를 결합한다",
    body: "공식 구성과 project 주장을 분리해 각 장치의 보장 경계를 읽습니다.",
  },
]);
