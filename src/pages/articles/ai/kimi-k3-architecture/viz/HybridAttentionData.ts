import { defineNarrativeFlow } from "@/components/viz/narrative-flow";

export const STEPS = defineNarrativeFlow([
  {
    label: "KDA 1",
    body: "channel-wise decay가 있는 recurrent state로 sequence를 혼합합니다.",
  },
  {
    label: "KDA 2",
    body: "고정 크기 state를 갱신하며 다음 layer로 전달합니다.",
  },
  {
    label: "KDA 3",
    body: "세 번째 효율 경로 뒤에 global layer를 둡니다.",
  },
  {
    label: "Gated MLA",
    body: "latent KV와 output gate로 unrestricted global interaction을 수행합니다.",
  },
  {
    label: "× 23 blocks",
    body: "69 KDA와 block 내부 Gated MLA 23개가 됩니다.",
  },
  {
    label: "Final Gated MLA",
    body: "backbone 마지막을 global attention으로 끝내 총 24개가 됩니다.",
  },
]);
