import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    label: "Hidden 7,168",
    body: "full-width token representation에서 시작합니다.",
  },
  {
    label: "Shared experts ×2",
    body: "공통 변환은 full-width path로 항상 수행합니다.",
  },
  {
    label: "Down-project 3,584",
    body: "전문화된 routed path를 compact latent width로 줄입니다.",
  },
  {
    label: "Top-16 / 896",
    body: "Quantile Balancing이 load를 조정한 expert에서 선택합니다.",
  },
  {
    label: "RMSNorm + up-project",
    body: "aggregate scale을 정리한 뒤 full width로 복원합니다.",
  },
  {
    label: "Shared + routed",
    body: "공통 path와 전문 path를 합쳐 다음 layer로 보냅니다.",
  },
]);
