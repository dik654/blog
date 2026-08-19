import type { CodeRef } from "@/components/code/types";
import cudaGraphPy from "./codebase/vllm/vllm/compilation/cuda_graph.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  "cudagraph-wrapper-call": {
    path: "vllm/vllm/compilation/cuda_graph.py",
    code: cudaGraphPy,
    lang: "python",
    highlight: [57, 213],
    desc: "문제: \"capture는 shape별로 첫 호출에서 한 번, 이후 같은 shape는 replay\"라는 주장이 실제 production serving engine에서 어떻게 구현되는지 확인해야 합니다.\n\n해결: vLLM의 CUDAGraphWrapper.__call__이 batch_descriptor(패딩된 배치 shape)를 key로 하는 dict에서 entry.cudagraph가 None이면 capture하고, 이미 있으면 replay합니다. Static input address 검증도 실제로 여기서 이뤄집니다.",
    annotations: [
      { lines: [122, 130], color: "sky", note: "shape(batch_descriptor)마다 별도 entry — 처음 보는 shape면 새로 만듦" },
      { lines: [137, 144], color: "amber", note: "capture 시점 input tensor 주소를 기록 — static address 제약의 근거" },
      { lines: [166, 181], color: "emerald", note: "torch.cuda.graph(...) 안의 실행은 GPU에서 즉시 실행되지 않고 커널 launch 시퀀스만 녹화됨" },
      { lines: [193, 205], color: "rose", note: "replay 직전 실제 주소와 capture 때 주소를 비교 — 다르면 즉시 assert 실패" },
      { lines: [207, 213], color: "violet", note: "replay 경로 — runnable을 다시 실행하지 않고 녹화된 커널 시퀀스만 재생. launch overhead가 없는 이유" },
    ],
  },
};
