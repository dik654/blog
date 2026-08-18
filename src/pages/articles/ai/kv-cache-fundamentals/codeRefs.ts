import type { CodeRef } from "@/components/code/types";
import modelingMixtralPy from "./codebase/transformers/models/mixtral/modeling_mixtral.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "repeat-kv-heads": {
    path: "transformers/models/mixtral/modeling_mixtral.py",
    code: modelingMixtralPy,
    lang: "python",
    highlight: [7, 23],
    desc: "문제: H_KV개 KV head가 실제로 어떻게 H_Q개 Q head와 짝지어져 attention을 계산하는지 확인해야 합니다.\n\n해결: GQA/MQA를 쓰는 실제 모델들이 공통으로 재사용하는 repeat_kv 유틸이 각 KV head를 n_rep=H_Q/H_KV번 복제해 Q head 수에 맞춥니다.",
    annotations: [
      { lines: [14, 14], color: "sky", note: "article의 K,V shape — (batch, H_KV, T, D_head)" },
      { lines: [17, 21], color: "emerald", note: "article의 g=H_Q/H_KV(n_rep) — expand는 memory 복사 없이 broadcast view만 만듦" },
      { lines: [22, 23], color: "amber", note: "article의 H_Q=H_KV×g — reshape에서 비로소 Q head 수와 같은 모양이 됨" },
    ],
  },
};
