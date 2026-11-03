import type { CodeRef } from "@/components/code/types";
import certsGo from "./codebase/go-f3/certs.go?raw";
import gpbftGo from "./codebase/go-f3/gpbft.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "f3-run": {
    path: "go-f3/certs.go",
    code: certsGo,
    lang: "go",
    highlight: [12, 47],
    desc: "go-f3 v0.8.15 — 연속 instance·base·signature·power-table CID 검증 순서",
    annotations: [
      {
        lines: [17, 28],
        color: "sky",
        note: "Instance, ECChain과 이전 finalized base가 이어지는지 먼저 확인",
      },
      {
        lines: [29, 31],
        color: "emerald",
        note: "현재 table이 아니라 이 instance의 historical table로 signature 검증",
      },
      {
        lines: [33, 42],
        color: "amber",
        note: "Delta를 적용한 다음 power-table CID commitment까지 일치해야 진행",
      },
    ],
  },
  "gpbft-run": {
    path: "go-f3/gpbft.go",
    code: gpbftGo,
    lang: "go",
    highlight: [4, 33],
    desc: "go-f3 v0.8.15 — ceil(2W/3) strong quorum과 round 0 QUALITY 진입",
    annotations: [
      { lines: [4, 16], color: "sky", note: "W=120이면 strong quorum 문턱은 80" },
      {
        lines: [20, 22],
        color: "emerald",
        note: "Round 0은 QUALITY에서 시작",
      },
      {
        lines: [24, 33],
        color: "amber",
        note: "QUALITY quorum 또는 timeout 뒤 longest supported prefix로 PREPARE 진입",
      },
    ],
  },
};
