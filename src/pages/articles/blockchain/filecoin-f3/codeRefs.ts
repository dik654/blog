import type { CodeRef } from "@/components/code/types";
import f3Go from "./codebase/go-f3/f3.go?raw";
import gpbftGo from "./codebase/go-f3/gpbft.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "f3-run": {
    path: "go-f3/f3.go",
    code: f3Go,
    lang: "go",
    highlight: [14, 40],
    desc: "Bundled F3.Run snapshot — EC input과 GPBFT certificate lifecycle의 축약 예시",
    annotations: [
      {
        lines: [14, 19],
        color: "sky",
        note: "F3 구조체 — manifest, host, certStore, gpbft",
      },
      {
        lines: [23, 30],
        color: "emerald",
        note: "축약 snapshot에서 EC input을 새 consensus instance에 연결",
      },
      {
        lines: [32, 38],
        color: "amber",
        note: "결정 결과를 certificate store에 연결하는 lifecycle 예시",
      },
    ],
  },
  "gpbft-run": {
    path: "go-f3/gpbft.go",
    code: gpbftGo,
    lang: "go",
    highlight: [11, 40],
    desc: "Bundled GPBFT snapshot — QUALITY→CONVERGE→PREPARE→COMMIT→DECIDE",
    annotations: [
      { lines: [11, 17], color: "sky", note: "5단계 Phase 상수 정의" },
      {
        lines: [19, 24],
        color: "emerald",
        note: "Runner 구조체 — phase, participants, powerTable",
      },
      {
        lines: [28, 39],
        color: "amber",
        note: "축약 loop는 단계 전환을 보여주며 현재 implementation 전체를 복제하지 않는다",
      },
    ],
  },
};
