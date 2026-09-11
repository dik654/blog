import type { CodeRef } from "@/components/code/types";
import clipPy from "./codebase/transformers/src/transformers/models/clip/modeling_clip.py?raw";
import siglipPy from "./codebase/transformers/src/transformers/models/siglip/modeling_siglip.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "clip-loss": {
    path: "transformers/src/transformers/models/clip/modeling_clip.py",
    code: clipPy,
    lang: "python",
    highlight: [45, 60],
    desc: "문제: 캡션이 붙은 이미지 묶음만 있을 때 무엇을 정답으로 삼아 두 인코더를 같은 공간으로 끌어당길지 정해야 합니다.\n\n해결: 배치 안에서 자기 짝을 골라내는 분류 문제로 바꿉니다. 정답 index가 대각선이므로 교차 엔트로피 한 줄로 끝납니다.",
    annotations: [
      { lines: [47, 49], color: "sky", note: "정답 라벨이 arange(n)입니다. i번째 이미지의 정답은 i번째 문장이라는 뜻이며 대각선이 곧 양성 쌍입니다" },
      { lines: [51, 56], color: "emerald", note: "이미지→문장과 문장→이미지 두 방향의 손실을 평균합니다. 한 방향만 쓰면 비대칭이 생깁니다" },
      { lines: [804, 808], color: "amber", note: "유사도 행렬에 학습된 온도의 지수를 곱합니다. 이 값이 분포의 날카로움을 정합니다" },
    ],
  },
  "siglip-loss": {
    path: "transformers/src/transformers/models/siglip/modeling_siglip.py",
    code: siglipPy,
    lang: "python",
    highlight: [804, 818],
    desc: "문제: 배치 전체를 정규화하는 손실은 모든 쌍의 유사도를 한 곳에 모아야 해서 분산 학습에서 통신과 메모리가 함께 커집니다.\n\n해결: 쌍마다 독립인 이진 분류로 바꿉니다. 대각선은 양성, 나머지는 음성으로 두고 각 칸에 로지스틱 손실을 겁니다.",
    annotations: [
      { lines: [660, 662], color: "sky", note: "학습되는 값이 온도 하나가 아니라 편향까지 둘입니다. 편향은 음성 쌍이 압도적으로 많은 초기 불균형을 보정합니다" },
      { lines: [804, 806], color: "violet", note: "유사도에 온도를 곱한 뒤 편향을 더합니다. 소프트맥스가 없으므로 이 값이 그대로 각 쌍의 로짓이 됩니다" },
      { lines: [811, 814], color: "emerald", note: "대각선만 +1, 나머지는 -1인 부호 행렬을 만들어 곱합니다. 양성은 로짓이 클수록, 음성은 작을수록 손실이 줄어듭니다" },
      { lines: [815, 816], color: "amber", note: "행마다 모든 칸을 더한 뒤 평균 냅니다. 정규화 상수가 없어 다른 장치의 유사도를 기다릴 필요가 없습니다" },
    ],
  },
};
