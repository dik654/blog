import type { CodeRef } from "@/components/code/types";
import linear from "./codebase/pytorch/aten/src/ATen/native/Linear.cpp?raw";
const source = { path: "pytorch/aten/src/ATen/native/Linear.cpp", code: linear, lang: "c" as const };
export const matrixCodeRefs: Record<string, CodeRef> = {
  "linear-branch": { ...source, highlight: [68, 118], desc: "PyTorch v2.8.0 고정 원문의 C++ linear입니다. 특수 경로를 사용하지 않는 2차원 입력과 존재하는 bias는 89–92행의 addmm 분기로 갑니다. 실제 GPU kernel이나 실행 성능을 측정한 결과는 아닙니다.", annotations: [
    { lines: [89, 92], color: "sky", note: "input=[[4,2]], weight=[[2,1],[1,2]], bias=[0,0]인 가정 사례는 input·weightᵀ+bias로 [[10,8]]을 만듭니다." },
    { lines: [107, 117], color: "emerald", note: "앞의 조건을 통과하지 않은 경로는 matmul을 호출하고 필요한 경우 bias를 더합니다. 모든 nn.Linear가 단일 GEMV를 호출한다고 단정하지 않습니다." },
  ]},
  "linear-flatten": { ...source, highlight: [50, 64], desc: "같은 파일의 실제 보조 함수입니다. 마지막 차원을 입력 좌표로 두고 앞의 차원을 펼친 뒤 곱하고 원래 앞쪽 모양으로 돌려놓습니다.", annotations: [{ lines: [55, 64], color: "sky", note: "입력이 (2,3,2)이고 가중치가 (2,2)이면 앞의 2×3을 6으로 묶어 (6,2)로 계산한 뒤 출력 (2,3,2)로 되돌립니다. 배치의 항목 순서와 마지막 좌표축을 구별합니다." }]},
};
