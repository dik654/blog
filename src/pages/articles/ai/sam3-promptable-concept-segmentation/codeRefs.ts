import type { CodeRef } from "@/components/code/types";
import decoderPy from "./codebase/sam3/model/decoder.py?raw";
import encoderPy from "./codebase/sam3/model/encoder.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "fusion-encoder": {
    path: "sam3/model/encoder.py",
    code: encoderPy,
    lang: "python",
    highlight: [466, 560],
    desc: "문제: 이미지 특징은 프롬프트를 모르는 채로 뽑히므로 어떤 개념을 찾는지가 반영돼 있지 않습니다.\n\n해결: fusion encoder가 이미지 토큰을 프롬프트 토큰에 cross-attention 시켜, 이후 단계가 보는 이미지 표현 자체를 조건부로 바꿉니다.",
    annotations: [
      { lines: [466, 480], color: "sky", note: "일반 TransformerEncoder를 상속해 cross-modal 융합을 더한 변형입니다" },
      { lines: [518, 530], color: "emerald", note: "forward가 이미지 특징과 prompt를 함께 받습니다. 프롬프트는 명사구 토큰이거나 예시 상자에서 온 토큰입니다" },
      { lines: [531, 560], color: "amber", note: "prompt padding mask와 위치 인코딩을 따로 받습니다. 프롬프트 길이가 배치마다 달라도 되도록 하는 배선입니다" },
    ],
  },
  "presence-token": {
    path: "sam3/model/decoder.py",
    code: decoderPy,
    lang: "python",
    highlight: [315, 330],
    desc: "문제: 하나의 query가 '이 개념이 사진에 있는가'와 '이 자리가 그 개념인가'를 동시에 판단하면 두 판단이 서로를 끌어내립니다.\n\n해결: query와 별개로 학습되는 presence token을 하나 두고, 존재 여부는 그 토큰만 책임지게 합니다.",
    annotations: [
      { lines: [318, 321], color: "sky", note: "presence token은 크기 1짜리 임베딩 하나와 전용 MLP head·LayerNorm으로 구성됩니다" },
      { lines: [519, 523], color: "emerald", note: "배치 차원으로 펼쳐 디코더 레이어에 함께 넣습니다. 예시 상자로 특정 인스턴스를 지목한 경우에는 쓰지 않습니다" },
      { lines: [132, 145], color: "violet", note: "레이어 안에서 presence token을 query 앞에 이어 붙여 self-attention을 함께 받게 합니다" },
      { lines: [171, 178], color: "amber", note: "cross-attention mask에서는 presence token 자리를 열어 둡니다. 특정 영역에 묶이지 않고 이미지 전체를 봅니다" },
      { lines: [616, 630], color: "rose", note: "레이어마다 presence logit을 뽑아 쌓고 수치 안정을 위해 범위를 제한합니다. 최종 점수는 이 값과 query 점수를 곱해 만듭니다" },
    ],
  },
};
