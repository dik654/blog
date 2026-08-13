import type { CodeRef } from "@/components/code/types";
import pipelineRs from "./codebase/reth/crates/stages/api/src/pipeline/mod.rs?raw";
import executionRs from "./codebase/reth/crates/stages/stages/src/stages/execution.rs?raw";
import { stagesCodeRefs } from "./codeRefsStages";

export const codeRefs: Record<string, CodeRef> = {
  "pipeline-run": {
    path: "crates/stages/api/src/pipeline/mod.rs",
    code: pipelineRs,
    lang: "rust",
    highlight: [18, 43],
    desc: "Bundled pipeline snapshot — target, Stage checkpoint와 bounded progress의 관계를 확인",
    annotations: [
      {
        lines: [22, 28],
        color: "sky",
        note: "ExecInput 구성 — target=CL tip 해시, checkpoint=이전 완료 블록. 크래시 후 재시작 시 체크포인트부터 이어서",
      },
      {
        lines: [30, 31],
        color: "emerald",
        note: "Stage::execute() 호출 → 각 Stage 구현체(Headers/Bodies/…)가 작업 수행",
      },
      {
        lines: [33, 36],
        color: "amber",
        note: "done=false면 target 미도달 — 이번 루프 중단, 다음 루프에서 동일 Stage부터 이어서",
      },
    ],
  },
  "execution-stage": {
    path: "crates/stages/stages/src/stages/execution.rs",
    code: executionRs,
    lang: "rust",
    highlight: [9, 43],
    desc: "Bundled execution snapshot — canonical inputs, overlay 실행과 영속 경계를 확인",
    annotations: [
      {
        lines: [10, 12],
        color: "sky",
        note: "블록 범위 결정 — CL tip까지, checkpoint+1부터. 크래시 후 재시작 시 이미 처리한 블록 건너뜀",
      },
      {
        lines: [20, 28],
        color: "emerald",
        note: "provider에서 header+body+sender 로드 → fork-aware EVM 실행 → overlay에 상태 변경 누적",
      },
      {
        lines: [32, 34],
        color: "amber",
        note: "설정된 작업 한계에 도달하면 검증된 결과와 progress를 영속화. 고정 batch 크기를 API 불변조건으로 보지 않음",
      },
      {
        lines: [37, 39],
        color: "violet",
        note: "provider를 통해 결과 기록 — MerkleStage가 변경 경로로 상태 루트를 계산",
      },
    ],
  },
  ...stagesCodeRefs,
};
