import type { CodeRef } from '@/components/code/types';
import pipelineRs from './codebase/reth/crates/stages/api/src/pipeline/mod.rs?raw';
import executionRs from './codebase/reth/crates/stages/stages/src/stages/execution.rs?raw';
import { stagesCodeRefs } from './codeRefsStages';

export const codeRefs: Record<string, CodeRef> = {
  'pipeline-run': {
    path: 'crates/stages/api/src/pipeline/mod.rs',
    code: pipelineRs, lang: 'rust', highlight: [18, 43],
    desc: 'Pipeline::run() — CL tip까지 모든 Stage를 순서대로 반복 실행하는 메인 루프',
    annotations: [
      { lines: [22, 28], color: 'sky',
        note: 'ExecInput 구성 — target=CL tip 해시, checkpoint=이전 완료 블록. 크래시 후 재시작 시 체크포인트부터 이어서' },
      { lines: [30, 31], color: 'emerald',
        note: 'Stage::execute() 호출 → 각 Stage 구현체(Headers/Bodies/…)가 작업 수행' },
      { lines: [33, 36], color: 'amber',
        note: 'done=false면 target 미도달 — 이번 루프 중단, 다음 루프에서 동일 Stage부터 이어서' },
    ],
  },
  'execution-stage': {
    path: 'crates/stages/stages/src/stages/execution.rs',
    code: executionRs, lang: 'rust', highlight: [9, 43],
    desc: 'ExecutionStage — 세 Stage(Headers+Bodies+Senders)의 결과물을 조합해 revm으로 실행',
    annotations: [
      { lines: [10, 12], color: 'sky',
        note: '블록 범위 결정 — CL tip까지, checkpoint+1부터. 크래시 후 재시작 시 이미 처리한 블록 건너뜀' },
      { lines: [20, 28], color: 'emerald',
        note: '블록 순회: DB에서 헤더+바디+sender 로드 → revm으로 TX 실행 → BundleState에 상태 변경 누적' },
      { lines: [32, 34], color: 'amber',
        note: 'commit_threshold(기본 10K블록)마다 중간 저장 — 크래시 시 최대 N블록만 재실행' },
      { lines: [37, 39], color: 'violet',
        note: '최종 상태 DB 기록 — MerkleStage가 이 변경분의 PrefixSet을 읽어서 상태 루트 계산' },
    ],
  },
  ...stagesCodeRefs,
};
