import type { CodeRef } from "@/components/code/types";
import attentionNagPy from "./codebase/nag/nag/attention_nag.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "nag-guidance-branch": {
    path: "nag/nag/attention_nag.py",
    code: attentionNagPy,
    lang: "python",
    highlight: [13, 78],
    desc: "문제: CFG의 εu+w(εc−εu) extrapolation을 attention output 레벨로 옮기면 어떤 형태가 되고, CFG가 few-step·distilled 모델에서 무너지는(collapse) 문제를 어떻게 막는지 확인해야 합니다.\n\n해결: NAGAttnProcessor2_0이 positive·negative attention output에 CFG와 같은 형태의 extrapolation을 적용한 뒤, L1-norm 기반 clamp(τ)와 원래 값과의 blend(α)로 그 결과를 다시 눌러줍니다.",
    annotations: [
      { lines: [31, 34], color: "amber", note: "origin_batch_size 계산은 2× guidance(순수 CFG 확장)에서는 원래 batch 크기와 같지만, 3×/4× 확장은 pipeline이 hidden_states를 이미 부분 확장해 둔 경우를 위한 것으로 보이며 이 글은 2× 경우만 다룹니다." },
      { lines: [50, 54], color: "emerald", note: "CFG의 εu+w(εc−εu)와 대수적으로 같은 extrapolation — positive·negative attention output에 적용" },
      { lines: [56, 63], color: "rose", note: "article에는 없는 NAG 고유 장치 — L1-norm 기반 clamp로 extrapolation이 원래 norm의 τ배를 넘지 못하게 제한" },
      { lines: [65, 68], color: "violet", note: "article에는 없는 NAG 고유 장치 — clamp된 guidance와 원래 positive output을 α로 blend" },
    ],
  },
};
