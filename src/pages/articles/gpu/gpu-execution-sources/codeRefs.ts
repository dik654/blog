import type { CodeRef, FileNode } from "@/components/code/types";
import cuda from "./codebase/cuda/vectorAdd.cu?raw";
import hip from "./codebase/hip/vectoradd_hip.cpp?raw";

/** Upstream source is unchanged. Full SHA and licenses are in provenance.json and the files. */
export const codeRefs: Record<string, CodeRef> = {
  "cuda-kernel": { path: "cuda/vectorAdd.cu", code: cuda, lang: "c", highlight: [47, 54], desc: "NVIDIA cuda-samples v13.0 · 3f1c50965017932fc81e6d94a3fc9e04c105b312. 원본 기본 길이는50000이며 본문64개는 함수에 대입한 학습 사례입니다.", annotations: [{ lines: [49, 49], color: "sky", note: "64×0+37=37: block 번호와 thread 번호로 원소 번호를 만듭니다." }, { lines: [51, 52], color: "emerald", note: "범위를 검사하고 입력 두 값을 읽어 결과 한 값을 씁니다." }] },
  "cuda-launch": { path: "cuda/vectorAdd.cu", code: cuda, lang: "c", highlight: [135, 149], desc: "원본은256threads와올림한block수를 사용합니다. 본문64threads는원본설정이아닌계산사례입니다.", annotations: [{ lines: [136, 139], color: "amber", note: "Launch 크기와 실제 원소 수를 구별합니다. 함수 안의 경계 검사가 마지막 남는 thread를 막습니다." }] },
  "hip-kernel": { path: "hip/vectoradd_hip.cpp", code: hip, lang: "c", highlight: [46, 61], desc: "ROCm HIP-Examples · cdf9d101acd9a3fc89ee750f73c1f1958cbd5cc3. 원본1024×1024를바꾸지않고그대로보관했습니다.", annotations: [{ lines: [51, 54], color: "sky", note: "width64·height1·x37·y0을 넣으면 i=37입니다." }, { lines: [55, 56], color: "rose", note: "i만 검사하는 원본 조건은 모든 비정렬2D 크기에서 축별 범위 검사와 같지 않습니다." }] },
};

export const fileTrees: Record<string, FileNode> = {
  cuda: { name: "NVIDIA cuda-samples · v13.0", type: "dir", children: [{ name: "vectorAdd.cu", type: "file", path: "cuda/vectorAdd.cu", codeKey: "cuda-kernel" }] },
  hip: { name: "ROCm HIP-Examples · cdf9d101", type: "dir", children: [{ name: "vectoradd_hip.cpp", type: "file", path: "hip/vectoradd_hip.cpp", codeKey: "hip-kernel" }] },
};
