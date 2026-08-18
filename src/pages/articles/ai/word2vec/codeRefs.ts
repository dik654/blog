import type { CodeRef } from "@/components/code/types";
import sparsePy from "./codebase/torch/nn/modules/sparse.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "onehot-as-gather": {
    path: "torch/nn/modules/sparse.py",
    code: sparsePy,
    lang: "python",
    highlight: [9, 37],
    desc: "문제: v_w=o_w^⊤W가 실제로 one-hot vector를 만들어 행렬곱하는지, 아니면 다른 방식으로 계산되는지 확인해야 합니다.\n\n해결: PyTorch의 Embedding.forward는 F.embedding을 거쳐 최종적으로 index 기반 native gather(torch.embedding)를 호출합니다 — one-hot·matmul은 개념 설명일 뿐 실제 실행 경로가 아닙니다.",
    annotations: [
      { lines: [10, 14], color: "sky", note: "공식 docstring이 이미 'simple lookup table...using indices'라고 명시 — article의 sparse gather 주장과 일치" },
      { lines: [20, 28], color: "emerald", note: "article의 v_w=o_w^⊤W 계산을 index 하나로 대체" },
      { lines: [35, 37], color: "amber", note: "최종적으로 native(C++) gather 함수 하나로 실행됨을 정직하게 표시" },
    ],
  },
};
