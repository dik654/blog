import type { CodeRef } from '@/components/code/types';
import headersRs from './codebase/reth/crates/stages/stages/src/stages/headers.rs?raw';
import bodiesRs from './codebase/reth/crates/stages/stages/src/stages/bodies.rs?raw';
import sendersRs from './codebase/reth/crates/stages/stages/src/stages/senders.rs?raw';
import merkleRs from './codebase/reth/crates/stages/stages/src/stages/merkle.rs?raw';

export const stagesCodeRefs: Record<string, CodeRef> = {
  'headers-stage': {
    path: 'crates/stages/stages/src/stages/headers.rs',
    code: headersRs, lang: 'rust', highlight: [12, 42],
    desc: 'HeadersStage — 피어에게 헤더를 스트림 수신, 부모 해시 검증 후 MDBX 배치 삽입',
    annotations: [
      { lines: [13, 15], color: 'sky',
        note: '다운로드 범위: checkpoint+1 ~ CL tip. 크래시 후 재시작 시 체크포인트부터 이어서' },
      { lines: [19, 19], color: 'emerald',
        note: 'devp2p/eth로 여러 피어에 병렬 요청 — 가장 빠른 응답을 스트림으로 수신' },
      { lines: [24, 28], color: 'amber',
        note: '위조 방지: parent_hash·블록번호·타임스탬프 검증. 불일치 시 해당 피어 차단' },
      { lines: [32, 34], color: 'violet',
        note: 'commit_threshold 단위 배치 삽입 — MDBX 트랜잭션 한 번으로 I/O 효율화' },
    ],
  },
  'bodies-stage': {
    path: 'crates/stages/stages/src/stages/bodies.rs',
    code: bodiesRs, lang: 'rust', highlight: [12, 43],
    desc: 'BodiesStage — HeadersStage가 저장한 헤더로 바디 요청, tx_root 대조 검증 후 저장',
    annotations: [
      { lines: [18, 20], color: 'sky',
        note: 'DB에서 헤더 로드 — HeadersStage가 insert_headers()로 저장한 데이터' },
      { lines: [24, 24], color: 'emerald',
        note: 'devp2p/eth로 피어에게 GetBlockBodies 요청 — 헤더 목록 기반으로 매칭' },
      { lines: [29, 33], color: 'amber',
        note: '무결성 검증: 바디 TX로 머클 루트 계산 → header.tx_root와 대조. 위조 TX 차단' },
      { lines: [36, 38], color: 'violet',
        note: '배치 삽입 — SendersStage가 이 TX 데이터에서 sender 주소를 복구' },
    ],
  },
  'senders-stage': {
    path: 'crates/stages/stages/src/stages/senders.rs',
    code: sendersRs, lang: 'rust', highlight: [11, 39],
    desc: 'SendersStage — TX에는 sender가 없음, (v,r,s) 서명에서 ecrecover로 주소 복구',
    annotations: [
      { lines: [17, 18], color: 'sky',
        note: 'DB에서 TX 서명 로드 — BodiesStage가 저장한 Transactions 테이블에서 (v,r,s) 읽기' },
      { lines: [23, 30], color: 'emerald',
        note: 'rayon par_iter로 멀티코어 병렬 ecrecover — CPU 집약적이라 병렬화 효과 큼' },
      { lines: [33, 37], color: 'amber',
        note: 'TxSenders 테이블에 저장 — ExecutionStage가 msg.sender 조회 시 이 데이터 사용' },
    ],
  },
  'merkle-stage': {
    path: 'crates/stages/stages/src/stages/merkle.rs',
    code: merkleRs, lang: 'rust', highlight: [11, 43],
    desc: 'MerkleStage — ExecutionStage 결과를 상태 루트로 검증, 헤더와 대조해서 정합성 확인',
    annotations: [
      { lines: [13, 18], color: 'sky',
        note: 'PrefixSet 로드 — ExecutionStage가 기록한 변경 키 접두사. 전체 트라이 탐색 불필요' },
      { lines: [23, 26], color: 'emerald',
        note: '증분 상태 루트: 변경 서브트리만 재해시. 전체 재계산 대비 10~100배 빠름' },
      { lines: [30, 39], color: 'amber',
        note: '계산 루트 vs header.state_root 비교 — 불일치 시 실행 결과 오류, 파이프라인 중단' },
    ],
  },
};
