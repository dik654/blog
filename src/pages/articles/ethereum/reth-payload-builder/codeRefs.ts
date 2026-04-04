import type { CodeRef } from '@/components/code/types';
import builderRs from './codebase/reth/crates/payload/basic/src/builder.rs?raw';
import engineRs from './codebase/reth/crates/engine/tree/src/engine.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'build-payload': {
    path: 'reth/crates/payload/basic/src/builder.rs',
    code: builderRs,
    lang: 'rust',
    highlight: [8, 41],
    desc: '문제: 블록 생성 시 TX 풀에서 수익이 높은 TX를 골라 가스 한도 내에서 최대한 채워야 합니다.\n\n해결: build_payload()는 best_transactions_with_attributes()로 정렬된 TX를 가져와 순서대로 실행합니다. 가스 한도를 초과하면 해당 TX를 건너뜁니다.',
    annotations: [
      { lines: [12, 17], color: 'sky', note: '기본 설정: 가스 한도, base fee 추출, TX 풀에서 best 목록 가져오기' },
      { lines: [24, 36], color: 'emerald', note: 'TX 순회: 가스 한도 검사 → revm 실행 → 누적 가스 갱신' },
      { lines: [38, 41], color: 'amber', note: '실행된 TX + 상태 변경을 BuiltPayload로 패킹하여 반환' },
    ],
  },
  'forkchoice-updated': {
    path: 'reth/crates/engine/tree/src/engine.rs',
    code: engineRs,
    lang: 'rust',
    highlight: [4, 32],
    desc: '문제: CL이 ForkchoiceUpdated를 보내면 EL은 canonical 체인을 갱신하고, payload 속성이 있으면 새 블록 생성을 시작해야 합니다.\n\n해결: head 검증 → canonical 체인 갱신 → payload 빌더에 새 작업 전달 → VALID 응답과 payload_id 반환.',
    annotations: [
      { lines: [8, 9], color: 'sky', note: 'head_block_hash 검증 — canonical 헤더 조회' },
      { lines: [14, 15], color: 'emerald', note: 'canonical 체인 갱신 — 포크 선택 결과 반영' },
      { lines: [18, 24], color: 'amber', note: 'payload 속성이 있으면 빌더에 새 작업 전달 → payload_id 발급' },
    ],
  },
};
