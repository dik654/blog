import type { CodeRef } from "@/components/code/types";
import headersRs from "./codebase/reth/crates/stages/stages/src/stages/headers.rs?raw";
import bodiesRs from "./codebase/reth/crates/stages/stages/src/stages/bodies.rs?raw";
import sendersRs from "./codebase/reth/crates/stages/stages/src/stages/senders.rs?raw";
import merkleRs from "./codebase/reth/crates/stages/stages/src/stages/merkle.rs?raw";

export const stagesCodeRefs: Record<string, CodeRef> = {
  "headers-stage": {
    path: "crates/stages/stages/src/stages/headers.rs",
    code: headersRs,
    lang: "rust",
    highlight: [12, 42],
    desc: "HeadersStage — bundled source snapshot에서 header 범위, 검증과 provider 기록 경계를 확인",
    annotations: [
      {
        lines: [13, 15],
        color: "sky",
        note: "다운로드 범위: checkpoint+1 ~ CL tip. 크래시 후 재시작 시 체크포인트부터 이어서",
      },
      {
        lines: [19, 19],
        color: "emerald",
        note: "devp2p/eth로 여러 피어에 병렬 요청 — 가장 빠른 응답을 스트림으로 수신",
      },
      {
        lines: [24, 28],
        color: "amber",
        note: "위조 방지: parent_hash·블록번호·타임스탬프 검증. 불일치 시 해당 피어 차단",
      },
      {
        lines: [32, 34],
        color: "violet",
        note: "검증된 header를 provider 경계로 기록한다. 실제 batch와 backend는 설정·Storage mode에 따라 달라질 수 있음",
      },
    ],
  },
  "bodies-stage": {
    path: "crates/stages/stages/src/stages/bodies.rs",
    code: bodiesRs,
    lang: "rust",
    highlight: [12, 43],
    desc: "BodiesStage — HeadersStage가 저장한 헤더로 바디 요청, tx_root 대조 검증 후 저장",
    annotations: [
      {
        lines: [18, 20],
        color: "sky",
        note: "provider에서 header 로드 — HeadersStage가 검증을 마친 canonical 범위",
      },
      {
        lines: [24, 24],
        color: "emerald",
        note: "devp2p/eth로 피어에게 GetBlockBodies 요청 — 헤더 목록 기반으로 매칭",
      },
      {
        lines: [29, 33],
        color: "amber",
        note: "무결성 검증: 바디 TX로 머클 루트 계산 → header.tx_root와 대조. 위조 TX 차단",
      },
      {
        lines: [36, 38],
        color: "violet",
        note: "배치 삽입 — SendersStage가 이 TX 데이터에서 sender 주소를 복구",
      },
    ],
  },
  "senders-stage": {
    path: "crates/stages/stages/src/stages/senders.rs",
    code: sendersRs,
    lang: "rust",
    highlight: [11, 39],
    desc: "SendersStage — transaction type별 signing payload와 signature에서 주소 복구",
    annotations: [
      {
        lines: [17, 18],
        color: "sky",
        note: "BodiesStage checkpoint 안의 signed transaction을 provider에서 읽기",
      },
      {
        lines: [23, 30],
        color: "emerald",
        note: "독립 signature recovery를 병렬화할 수 있지만 결과는 transaction order와 다시 결합",
      },
      {
        lines: [33, 37],
        color: "amber",
        note: "sender mapping을 provider를 통해 기록 — physical route를 Stage가 가정하지 않음",
      },
    ],
  },
  "merkle-stage": {
    path: "crates/stages/stages/src/stages/merkle.rs",
    code: merkleRs,
    lang: "rust",
    highlight: [11, 43],
    desc: "MerkleStage — ExecutionStage 결과를 상태 루트로 검증, 헤더와 대조해서 정합성 확인",
    annotations: [
      {
        lines: [13, 18],
        color: "sky",
        note: "PrefixSet 로드 — ExecutionStage가 기록한 변경 키 접두사. 전체 트라이 탐색 불필요",
      },
      {
        lines: [23, 26],
        color: "emerald",
        note: "변경 서브트리는 다시 계산하고 영향받지 않은 node와 hash를 재사용",
      },
      {
        lines: [30, 39],
        color: "amber",
        note: "계산 루트 vs header.state_root 비교 — 불일치 시 실행 결과 오류, 파이프라인 중단",
      },
    ],
  },
};
