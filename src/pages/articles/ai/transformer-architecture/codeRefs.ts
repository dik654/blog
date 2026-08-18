import type { CodeRef } from "@/components/code/types";
import functionalPy from "./codebase/torch/nn/functional.py?raw";
import transformerModulePy from "./codebase/torch/nn/modules/transformer.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "sdpa-formula": {
    path: "torch/nn/functional.py",
    code: functionalPy,
    lang: "python",
    highlight: [8, 43],
    desc: "문제: A=softmax(QKᵀ/√d_k+M), Y=AV가 실제로 어떤 순서의 tensor 연산인지 확인해야 합니다.\n\n해결: PyTorch는 fused kernel로 실행되는 F.scaled_dot_product_attention과 수학적으로 같은 결과를 내는 순수 Python 참조 구현을 공식 문서에 함께 실어 둡니다.",
    annotations: [
      { lines: [14, 14], color: "sky", note: "1/√d_k — scale factor를 명시 안 하면 head dimension으로 자동 계산" },
      { lines: [17, 22], color: "emerald", note: "causal mask를 만들어 금지된 자리를 -inf로 채움(article의 M)" },
      { lines: [36, 36], color: "amber", note: "QKᵀ/√d_k — dot-product score를 정규화" },
      { lines: [37, 40], color: "amber", note: "mask를 더한 뒤 row별 softmax — article의 A" },
      { lines: [42, 43], color: "violet", note: "Y=AV — attention weight로 value를 가중합" },
    ],
  },
  "block-forward": {
    path: "torch/nn/modules/transformer.py",
    code: transformerModulePy,
    lang: "python",
    highlight: [9, 42],
    desc: "문제: pre-norm/post-norm 식과 attention→FFN 순서가 실제 layer 하나의 forward에서 정확히 어떻게 실행되는지 확인해야 합니다.\n\n해결: PyTorch의 TransformerEncoderLayer.forward가 norm_first 여부로 두 분기를 나누고, 각각 _sa_block·_ff_block을 residual로 더합니다.",
    annotations: [
      { lines: [12, 17], color: "sky", note: "article의 y_pre=x+F(Norm(x)) — norm_first=True일 때 실제 실행 순서" },
      { lines: [18, 24], color: "emerald", note: "article의 y_post=Norm(x+F(x)) — norm_first=False(원 논문 방식)일 때 실행 순서" },
      { lines: [29, 37], color: "amber", note: "_sa_block — Q,K,V가 모두 같은 x에서 나오는 self-attention을 dropout까지 감쌈" },
      { lines: [40, 42], color: "violet", note: "_ff_block — article의 FFN(x_t)=W_2φ(W_1x_t+b_1)+b_2 그대로" },
    ],
  },
};
