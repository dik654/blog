import type { CodeRef } from "@/components/code/types";
import modelingMixtralPy from "./codebase/transformers/models/mixtral/modeling_mixtral.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "router-topk": {
    path: "transformers/models/mixtral/modeling_mixtral.py",
    code: modelingMixtralPy,
    lang: "python",
    highlight: [8, 21],
    desc: "문제: router logit이 실제로 어떻게 확률로 바뀌고 상위 k개가 선택되는지 확인해야 합니다.\n\n해결: Mixtral의 실제 MixtralTopKRouter가 z=W_r x → softmax → top-k 순서를 그대로 구현하되, article 식에는 없는 renormalization 단계가 하나 더 있습니다.",
    annotations: [
      { lines: [11, 12], color: "sky", note: "article의 z=W_r x" },
      { lines: [13, 14], color: "emerald", note: "article의 p_i=softmax(z)_i" },
      { lines: [15, 16], color: "amber", note: "article의 T_k(x)=TopK(p,k)" },
      { lines: [17, 20], color: "violet", note: "article 식에 없는 실제 세부사항 — 선택된 k개만 다시 정규화해 합을 1로 맞춤" },
    ],
  },
  "expert-combine": {
    path: "transformers/models/mixtral/modeling_mixtral.py",
    code: modelingMixtralPy,
    lang: "python",
    highlight: [24, 48],
    desc: "문제: 선택된 expert들의 출력이 실제로 어떻게 모이고 원래 token 순서로 되돌아오는지 확인해야 합니다.\n\n해결: MixtralExperts.forward가 본문이 이미 설명한 dispatch(one-hot mask로 token을 expert별로 묶음)→compute(expert FFN)→combine(index_add_로 원위치 복귀) 순서를 정확히 구현합니다.",
    annotations: [
      { lines: [30, 32], color: "sky", note: "article의 dispatch — T_k(x) 집합을 expert별로 재배열" },
      { lines: [39, 42], color: "emerald", note: "article의 E_i(x) — expert FFN을 맡은 token에만 적용" },
      { lines: [43, 44], color: "amber", note: "article의 p_i(x)·E_i(x)" },
      { lines: [45, 46], color: "violet", note: "article의 Σ — index_add_로 원래 token position에 combine" },
    ],
  },
};
