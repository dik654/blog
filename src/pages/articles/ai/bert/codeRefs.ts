import type { CodeRef } from "@/components/code/types";
import modelingBertPy from "./codebase/transformers/models/bert/modeling_bert.py?raw";
import maskingUtilsPy from "./codebase/transformers/masking_utils.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "visible-key-attention": {
    path: "transformers/models/bert/modeling_bert.py",
    code: modelingBertPy,
    lang: "python",
    highlight: [7, 27],
    desc: "문제: query가 허용된 key만 읽고 그 결과로 contextual state를 만드는 계산이 실제로 어떤 tensor 연산 순서인지 확인해야 합니다.\n\n해결: HuggingFace transformers의 eager_attention_forward가 score 계산→additive mask→softmax→value 결합을 정확히 이 순서로 실행합니다.",
    annotations: [
      { lines: [11, 12], color: "sky", note: "article의 s_ij=q_i^⊤k_j/√d" },
      { lines: [14, 17], color: "emerald", note: "article의 V_i={j:m_j=1} — PAD 위치에 -inf에 가까운 값을 더해 제외" },
      { lines: [19, 20], color: "amber", note: "article의 α_ij=softmax_{j∈V_i}(s_ij)" },
      { lines: [23, 25], color: "violet", note: "article의 h_i=Σα_ij·v_j" },
    ],
  },
  "padding-mask-rule": {
    path: "transformers/masking_utils.py",
    code: maskingUtilsPy,
    lang: "python",
    highlight: [7, 21],
    desc: "문제: 어떤 key가 '허용됨'인지 정하는 규칙 자체가 실제로 어디서 오는지 확인해야 합니다.\n\n해결: 실제 시스템은 causal·padding·packed-sequence mask를 조합 가능한 vmap 기반 factory를 쓰지만, padding mask만 떼어 보면 핵심 규칙은 한 줄입니다.",
    annotations: [
      { lines: [9, 13], color: "sky", note: "article의 V_i={j:m_j=1} — kv_idx(j)의 padding_mask 값이 참이면 허용" },
      { lines: [16, 21], color: "emerald", note: "boolean 허용 여부를 0/-inf의 additive mask로 변환 — eager_attention_forward가 바로 이 결과를 더함" },
    ],
  },
};
