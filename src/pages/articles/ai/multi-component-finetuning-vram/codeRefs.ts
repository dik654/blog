import type { CodeRef } from "@/components/code/types";
import trainPy from "./codebase/diffusers/examples/text_to_image/train_text_to_image_lora.py?raw";

const P = "diffusers/examples/text_to_image/train_text_to_image_lora.py";

export const codeRefs: Record<string, CodeRef> = {
  "freeze-and-move": {
    path: P,
    code: trainPy,
    lang: "python",
    highlight: [518, 566],
    desc: "문제: 학습하는 것은 어댑터뿐인데 실제로 VRAM을 얼마나 쓰는지가 예상과 크게 어긋납니다.\n\n해결: 공식 학습 스크립트가 세 부품을 모두 동결한 뒤 모두 장치로 옮기는 것을 그대로 보여 줍니다. 배우지 않는다는 것과 올라가지 않는다는 것은 다른 말입니다.",
    annotations: [
      { lines: [520, 522], color: "sky", note: "denoiser·autoencoder·text encoder 세 부품을 전부 동결합니다. 이 시점에는 학습 대상이 하나도 없습니다" },
      { lines: [539, 542], color: "rose", note: "그런데 셋 다 장치로 옮깁니다. 동결은 gradient를 만들지 않는다는 뜻이지 VRAM을 쓰지 않는다는 뜻이 아닙니다" },
      { lines: [544, 546], color: "emerald", note: "여기서 어댑터만 추가로 붙여 학습 대상이 됩니다. base 가중치는 그대로 상주합니다" },
      { lines: [562, 564], color: "violet", note: "optimizer가 받는 파라미터는 requires_grad 가 True 인 것뿐입니다. optimizer state는 어댑터 크기에만 비례합니다" },
      { lines: [565, 567], color: "amber", note: "gradient checkpointing은 activation을 줄이는 선택지이며 가중치 상주량과는 무관합니다" },
    ],
  },
  "per-step-forward": {
    path: P,
    code: trainPy,
    lang: "python",
    highlight: [862, 892],
    desc: "문제: 동결 부품을 왜 학습 내내 들고 있어야 하는지가 설정만 봐서는 드러나지 않습니다.\n\n해결: 학습 루프가 매 스텝 autoencoder와 text encoder의 forward를 호출합니다. 매 스텝 쓰이므로 내릴 수 없습니다.",
    annotations: [
      { lines: [864, 868], color: "sky", note: "매 스텝 이미지를 latent로 인코딩합니다. 이 호출 때문에 autoencoder가 상주해야 합니다" },
      { lines: [885, 889], color: "violet", note: "매 스텝 캡션을 인코딩합니다. text encoder가 상주해야 하는 이유도 같습니다" },
      { lines: [890, 892], color: "emerald", note: "denoiser는 학습 대상 어댑터를 품고 있으므로 당연히 상주합니다" },
    ],
  },
};
