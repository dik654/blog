import type { CodeRef } from "@/components/code/types";
import builderRs from "./codebase/reth/crates/payload/basic/src/builder.rs?raw";
import engineRs from "./codebase/reth/crates/engine/tree/src/engine.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "build-payload": {
    path: "reth/crates/payload/basic/src/builder.rs",
    code: builderRs,
    lang: "rust",
    highlight: [8, 41],
    desc: "저장된 basic payload builder 코드 스냅샷입니다. TX 풀 순서는 시작점이며 현재 상태, 포크 규칙과 block resource limit을 통과한 실행 결과만 유효한 payload 후보가 됩니다.",
    annotations: [
      {
        lines: [12, 17],
        color: "sky",
        note: "기본 설정: 가스 한도, base fee 추출, TX 풀에서 best 목록 가져오기",
      },
      {
        lines: [24, 36],
        color: "emerald",
        note: "TX 순회: 가스 한도 검사 → revm 실행 → 누적 가스 갱신",
      },
      {
        lines: [38, 41],
        color: "amber",
        note: "실행된 TX + 상태 변경을 BuiltPayload로 패킹하여 반환",
      },
    ],
  },
  "forkchoice-updated": {
    path: "reth/crates/engine/tree/src/engine.rs",
    code: engineRs,
    lang: "rust",
    highlight: [4, 32],
    desc: "저장된 Engine API 처리 코드 스냅샷입니다. 현재 구현과 메서드 이름이 다를 수 있으므로 forkchoice state 반영, attributes 검증, job 생성과 payload id 반환의 책임 경계를 중심으로 비교하세요.",
    annotations: [
      {
        lines: [8, 9],
        color: "sky",
        note: "head_block_hash 검증 — canonical 헤더 조회",
      },
      {
        lines: [14, 15],
        color: "emerald",
        note: "canonical 체인 갱신 — 포크 선택 결과 반영",
      },
      {
        lines: [18, 24],
        color: "amber",
        note: "payload 속성이 있으면 빌더에 새 작업 전달 → payload_id 발급",
      },
    ],
  },
};
