import type { CodeRef } from "@/components/code/types";
import smooth from "./codebase/smoothquant/smoothquant/smooth.py?raw";
import calibration from "./codebase/smoothquant/smoothquant/calibration.py?raw";
import fakeQuant from "./codebase/smoothquant/smoothquant/fake_quant.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "smooth-ln-fcs": {
    path: "smoothquant/smoothquant/smooth.py",
    highlight: [18, 45],
    desc: "채널별 s를 구해 LayerNorm을 나누고 뒤의 Linear 열을 곱합니다.",
    annotations: [
      { lines: [29, 32], color: "sky", note: "weight는 (출력, 입력) 모양이라 dim=0 max가 입력 채널 j별 max|W_j|입니다. q·k·v 세 개가 같은 입력을 받으므로 셋 중 가장 큰 값을 씁니다." },
      { lines: [34, 39], color: "sky", note: "s_j = max|X_j|^α / max|W_j|^(1−α). 채널 3은 64^0.5 / 0.25^0.5 = 16입니다." },
      { lines: [41, 45], color: "sky", note: "X를 직접 나누지 않고 X를 만드는 LayerNorm의 weight·bias를 나눕니다. 실행 중 추가 곱셈이 없습니다." },
    ],
    code: smooth,
    lang: "python",
  },
  "smooth-llama": {
    path: "smoothquant/smoothquant/smooth.py",
    highlight: [48, 71],
    desc: "RMSNorm은 bias가 없어 weight만 나눕니다.",
    annotations: [
      { lines: [69, 71], color: "sky", note: "LayerNorm 판과 같은 s를 쓰지만 RMSNorm에는 더할 bias가 없어 나눌 대상이 weight 하나입니다." },
    ],
    code: smooth,
    lang: "python",
  },
  "smooth-lm-llama": {
    path: "smoothquant/smoothquant/smooth.py",
    highlight: [126, 141],
    desc: "Llama 층에서는 norm 뒤 두 곳만 고릅니다.",
    annotations: [
      { lines: [127, 135], color: "sky", note: "input_layernorm 뒤의 q·k·v가 한 s를 공유합니다." },
      { lines: [137, 141], color: "sky", note: "post_attention_layernorm 뒤의 gate·up이 한 s를 공유합니다. o_proj·down_proj 입력은 norm 뒤가 아니라 이 함수가 건드리지 않습니다." },
    ],
    code: smooth,
    lang: "python",
  },
  "act-scales": {
    path: "smoothquant/smoothquant/calibration.py",
    highlight: [13, 51],
    desc: "모든 Linear 입력에 hook을 걸어 채널별 절댓값 최대를 누적합니다.",
    annotations: [
      { lines: [18, 25], color: "sky", note: "(token, 채널)로 펼친 뒤 token 축 max를 구하고 이전 표본의 max와 다시 max를 취합니다. 결과는 채널 수만큼의 벡터입니다." },
      { lines: [13, 13], color: "sky", note: "기본값은 표본 512개, 길이 512입니다. 논문도 Pile에서 무작위 문장 512개로 보정했다고 적습니다." },
    ],
    code: calibration,
    lang: "python",
  },
  "fake-quant": {
    path: "smoothquant/smoothquant/fake_quant.py",
    highlight: [16, 46],
    desc: "absmax를 127로 나눈 간격으로 반올림하는 세 가지 단위를 비교합니다.",
    annotations: [
      { lines: [17, 23], color: "sky", note: "weight per-tensor: 행렬 전체의 max 하나. 3절의 Δ_W = 0.5/127입니다." },
      { lines: [27, 35], color: "sky", note: "activation per-token: token(행)마다 다른 max. 합 밖의 t 축이라 INT8 GEMM 뒤에 되돌릴 수 있습니다." },
      { lines: [38, 46], color: "sky", note: "activation per-tensor: 전체 max 하나. 3절의 Δ_X = 64/127 ≈ 0.504가 이 식입니다." },
    ],
    code: fakeQuant,
    lang: "python",
  },
};
