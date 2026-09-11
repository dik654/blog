import type { CodeRef } from "@/components/code/types";
import processorPy from "./codebase/transformers/src/transformers/models/dinov3_vit/image_processing_dinov3_vit.py?raw";
import modelPy from "./codebase/transformers/src/transformers/models/dinov3_vit/modular_dinov3_vit.py?raw";

const P = "transformers/src/transformers/models/dinov3_vit/image_processing_dinov3_vit.py";
const M = "transformers/src/transformers/models/dinov3_vit/modular_dinov3_vit.py";

export const codeRefs: Record<string, CodeRef> = {
  "image-processor": {
    path: P,
    code: processorPy,
    lang: "python",
    highlight: [34, 89],
    desc: "문제: 같은 사진이라도 어떤 순서로 크기를 맞추고 값을 정규화했는지에 따라 모델에 들어가는 텐서가 달라집니다.\n\n해결: 전처리기가 기본 크기·보간 방식·정규화 상수와 연산 순서를 고정해 두고, 그 설정이 곧 임베딩 계약의 일부가 됩니다.",
    annotations: [
      { lines: [35, 41], color: "sky", note: "기본값이 여기 박혀 있습니다. 224×224, 이중선형 보간, ImageNet 평균·표준편차입니다" },
      { lines: [43, 45], color: "amber", note: "연산 순서가 rescale → resize → normalize 로 고정돼 있습니다. 순서를 바꾸면 같은 설정이라도 결과가 달라집니다" },
      { lines: [62, 71], color: "emerald", note: "같은 크기끼리 묶어 한 번에 리사이즈합니다. antialias를 켜므로 축소할 때 생기는 계단 현상이 줄어듭니다" },
      { lines: [72, 89], color: "violet", note: "center crop과 정규화가 이어집니다. crop을 켜면 사진의 가장자리 정보가 임베딩에서 사라집니다" },
    ],
  },
  "token-layout": {
    path: M,
    code: modelPy,
    lang: "python",
    highlight: [86, 99],
    desc: "문제: 출력 텐서의 어느 칸이 패치이고 어느 칸이 아닌지 모르면 평균을 잘못 냅니다.\n\n해결: 토큰 배치가 CLS, register, patch 순서로 고정돼 있으므로 평균을 낼 때 앞쪽 몇 칸을 반드시 잘라내야 합니다.",
    annotations: [
      { lines: [93, 96], color: "rose", note: "CLS 하나와 register 토큰들이 패치 앞에 붙습니다. mean pooling 할 때 이 앞부분을 빼지 않으면 이미지와 무관한 벡터가 섞입니다" },
      { lines: [86, 88], color: "sky", note: "패치 임베딩은 conv 결과를 펼쳐 만든 시퀀스입니다. 개수는 입력 해상도와 패치 크기로 정해집니다" },
      { lines: [443, 448], color: "emerald", note: "pooler_output은 별도 계산이 아니라 0번 토큰, 곧 CLS를 그대로 꺼낸 값입니다" },
    ],
  },
};
