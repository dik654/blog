import type { CodeRef } from "@/components/code/types";
import lossUtilsPy from "./codebase/transformers/src/transformers/loss/loss_utils.py?raw";
import trainerPy from "./codebase/transformers/src/transformers/trainer.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "ga-fixed-cross-entropy": {
    path: "transformers/src/transformers/loss/loss_utils.py",
    code: lossUtilsPy,
    lang: "python",
    highlight: [12, 32],
    desc: "문제: \"각 micro loss의 reduction scale이 같습니다\"라는 가정이 실전에서 깨지는 실제 사례(2024년 Unsloth가 보고한 gradient accumulation 버그)를 확인해야 합니다.\n\n해결: HuggingFace transformers의 fixed_cross_entropy가 num_items_in_batch 유무로 reduction을 mean/sum으로 나누고, sum일 때만 accumulation window 전체의 유효 토큰 수로 나눕니다 — 이름 자체가 버그 수정을 가리킵니다.",
    annotations: [
      { lines: [19, 24], color: "rose", note: "article의 가정이 깨지는 지점 — num_items_in_batch 없이 mean reduction하면 micro-batch마다 자기 토큰 수로만 나눔" },
      { lines: [28, 31], color: "emerald", note: "실제 fix — 미리 계산해 둔 accumulation window 전체 유효 토큰 수로 나눔" },
    ],
  },
  "ga-num-items-in-batch": {
    path: "transformers/src/transformers/trainer.py",
    code: trainerPy,
    lang: "python",
    highlight: [10, 64],
    desc: "문제: fixed_cross_entropy가 나눌 \"accumulation window 전체의 유효 토큰 수\"가 실제로 어디서, 어떻게 계산되는지 확인해야 합니다.\n\n해결: Trainer.get_batch_samples가 K개 micro-batch를 backward 전에 먼저 모으고, _get_num_items_in_batch가 -100이 아닌 label token을 전부 합산해 global 분모 하나를 만듭니다.",
    annotations: [
      { lines: [20, 27], color: "sky", note: "article의 K — gradient_accumulation_steps만큼 micro-batch를 backward 없이 먼저 수집" },
      { lines: [48, 52], color: "emerald", note: "article의 denominator — K개 micro-batch 전체에서 유효 토큰만 합산(micro-batch별로 따로 세지 않음)" },
      { lines: [58, 62], color: "amber", note: "article에는 없는 실제 세부 — multi-GPU에서는 gather 후 재합산" },
    ],
  },
};
