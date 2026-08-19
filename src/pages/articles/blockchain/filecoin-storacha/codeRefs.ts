import type { CodeRef } from "@/components/code/types";
import capabilityJs from "./codebase/ucanto/packages/validator/src/capability.js?raw";
import blobAddJs from "./codebase/w3up/packages/upload-api/src/blob/add.js?raw";

export const codeRefs: Record<string, CodeRef> = {
  "ucan-attenuation": {
    path: "ucanto/packages/validator/src/capability.js",
    code: capabilityJs,
    lang: "typescript",
    highlight: [18, 50],
    desc: "문제: \"child delegation이 parent보다 강한 권한을 만들지 않았는지\"라는 C_child⊆C_parent 주장이 실제로 어느 코드에서 검사되는지 확인해야 합니다.\n\n해결: ucanto의 defaultDerives가 resource 포함 관계와 caveat 일치를 각각 검사해, 벗어나면 즉시 에러를 반환합니다.",
    annotations: [
      { lines: [19, 32], color: "sky", note: "article의 R_c⊆R_p — resource가 wildcard prefix에 포함되는지 또는 정확히 같은지 검사" },
      { lines: [34, 45], color: "emerald", note: "article의 caveats는 '같거나 더 엄격' — delegated caveat와 다르면 즉시 거절" },
      { lines: [47, 49], color: "amber", note: "두 검사를 모두 통과해야 C_child⊆C_parent 성립" },
    ],
  },
  "blob-add-effects": {
    path: "w3up/packages/upload-api/src/blob/add.js",
    code: blobAddJs,
    lang: "typescript",
    highlight: [16, 67],
    desc: "문제: \"Allocation, byte transfer(put), service acceptance가 각각 성공해야 blob 단계가 끝난다\"는 U=Auth∧Alloc∧Put∧Accept 주장이 실제로 어떻게 세 개의 별도 effect로 구현되는지 확인해야 합니다.\n\n해결: w3up의 blobAddProvider가 allocate→put→accept를 순서대로 호출하고, 각 task를 결과에 fork(연결)해야 최종 accept site에 도달합니다.",
    annotations: [
      { lines: [23, 29], color: "sky", note: "article의 Alloc — capacity 배정 effect" },
      { lines: [31, 36], color: "emerald", note: "article의 Put — allocation receipt를 입력으로 받는 byte transfer effect" },
      { lines: [38, 45], color: "amber", note: "article의 Accept — effect chain을 받아들여 최종 receipt를 만드는 effect" },
      { lines: [50, 57], color: "violet", note: "세 effect의 task를 모두 fork해야 U(Upload-stage acceptance)가 완성됨" },
    ],
  },
};
