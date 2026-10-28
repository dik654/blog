import type { CodeRef, ProjectMeta } from "@/components/code/types";
import engineHandoff from "./codebase/reth-v2.8.1/engine-handoff.rs?raw";
import payloadId from "./codebase/reth-v2.8.1/payload-id.rs?raw";
import jobLifecycle from "./codebase/reth-v2.8.1/job-lifecycle.rs?raw";
import gasSelection from "./codebase/reth-v2.8.1/gas-selection.rs?raw";
import executionSelection from "./codebase/reth-v2.8.1/execution-selection.rs?raw";
import jobPoll from "./codebase/reth-v2.8.1/job-poll.rs?raw";
import resolve from "./codebase/reth-v2.8.1/resolve.rs?raw";

export const RETH_PAYLOAD_BUILDER_PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
};

export const rethPayloadBuilderCodeRefs: Record<string, CodeRef> = {
  "engine-handoff": {
    path: "reth v2.8.1 · crates/engine/tree/src/tree/mod.rs:3580-3634",
    code: engineHandoff,
    lang: "rust",
    highlight: [1, 33],
    desc: "문제: forkchoice 갱신과 새 payload build 시작은 같은 요청 안에서도 서로 다른 결과가 될 수 있습니다.\n\n해결: Attributes를 head에 대해 검증한 뒤에만 build resource를 준비하고 PayloadBuilderHandle에 parent·attributes·resource lease를 보냅니다.",
    annotations: [
      { lines: [7, 12], color: "amber", note: "Head 문맥에 맞지 않는 attributes는 build 시작 전에 거부" },
      { lines: [14, 24], color: "sky", note: "Engine이 준비한 resource와 lifecycle lease" },
      { lines: [26, 33], color: "emerald", note: "Payload service에 요청하고 pending ID를 응답에 연결" },
    ],
  },
  "payload-id": {
    path: "reth v2.8.1 · crates/payload/primitives/src/traits.rs:194-223",
    code: payloadId,
    lang: "rust",
    highlight: [1, 31],
    desc: "Parent hash와 fork별 payload attributes를 SHA-256에 넣고 앞 8 byte를 PayloadId로 사용합니다. 호출자는 이 값을 candidate 조회용 handle로 사용합니다.",
    annotations: [
      { lines: [6, 11], color: "sky", note: "모든 fork가 공유하는 parent·timestamp·randao·recipient" },
      { lines: [12, 25], color: "violet", note: "활성 fork에 따라 추가되는 withdrawals·beacon root·slot·target gas" },
      { lines: [27, 31], color: "emerald", note: "SHA-256 결과의 앞 8 byte" },
    ],
  },
  "job-lifecycle": {
    path: "reth v2.8.1 · crates/payload/basic/src/lib.rs:163-213",
    code: jobLifecycle,
    lang: "rust",
    highlight: [1, 49],
    desc: "PayloadId에 대응하는 job이 parent header, attributes, deadline, cache와 resource lease를 묶고 첫 build를 즉시 시작하는 경계입니다.",
    annotations: [
      { lines: [6, 20], color: "sky", note: "Parent header 조회가 실패하면 job 생성 실패" },
      { lines: [26, 29], color: "amber", note: "Attributes timestamp에서 deadline 계산" },
      { lines: [31, 45], color: "violet", note: "Best 후보와 resource lifecycle을 가진 active job" },
      { lines: [47, 49], color: "emerald", note: "첫 build 시도를 즉시 시작" },
    ],
  },
  "gas-selection": {
    path: "reth v2.8.1 · crates/ethereum/payload/src/lib.rs:263-300 · exact excerpt",
    code: gasSelection,
    lang: "rust",
    highlight: [1, 35],
    desc: "현재 build 시도의 transaction iterator에서 gas budget을 검사하는 실제 분기입니다. Amsterdam에서는 regular/state gas를 나누고, 이전 fork에서는 cumulative execution gas를 사용합니다.",
    annotations: [
      { lines: [2, 18], color: "sky", note: "활성 fork에 따른 gas budget 계산" },
      { lines: [20, 31], color: "amber", note: "들어가지 않는 거래와 dependent 거래를 iterator에서 제외" },
      { lines: [33, 35], color: "rose", note: "Cancellation은 partial candidate를 반환하지 않고 시도를 중단" },
    ],
  },
  "execution-selection": {
    path: "reth v2.8.1 · crates/ethereum/payload/src/lib.rs:374-420,435-455 · exact excerpts",
    code: executionSelection,
    lang: "rust",
    highlight: [1, 52],
    desc: "거래를 EVM에 실행하고 typed failure에 따라 건너뛸 범위를 정한 뒤, 실제 사용 gas와 effective tip으로 candidate fees를 누적합니다. 마지막에는 기존 best보다 나은지 비교합니다.",
    annotations: [
      { lines: [5, 10], color: "emerald", note: "EVM 실행 결과가 임시 state와 receipt의 근거" },
      { lines: [11, 38], color: "amber", note: "Nonce-too-low와 descendant-invalid failure를 구분" },
      { lines: [41, 47], color: "sky", note: "Actual gas와 effective tip으로 candidate value 누적" },
      { lines: [49, 52], color: "violet", note: "기존 best보다 못하면 candidate를 교체하지 않음" },
    ],
  },
  "job-poll": {
    path: "reth v2.8.1 · crates/payload/basic/src/lib.rs:476-530 · exact excerpt",
    code: jobPoll,
    lang: "rust",
    highlight: [1, 45],
    desc: "Build attempt 결과를 Better·Freeze·Aborted로 반영하고, frozen이 아니면 다음 interval에 새 build를 시작합니다. 실패한 attempt도 job 전체를 즉시 끝내지 않고 다음 tick을 기다립니다.",
    annotations: [
      { lines: [1, 4], color: "rose", note: "Job deadline은 active lifecycle의 종료 경계" },
      { lines: [8, 27], color: "emerald", note: "Build outcome이 best payload 상태를 변경" },
      { lines: [28, 34], color: "amber", note: "시도 오류는 metric에 남기고 job은 유지" },
      { lines: [41, 45], color: "sky", note: "Interval마다 현재 pool로 새 build attempt" },
    ],
  },
  resolve: {
    path: "reth v2.8.1 · crates/payload/builder/src/service.rs:316-370 · exact excerpt",
    code: resolve,
    lang: "rust",
    highlight: [1, 50],
    desc: "PayloadId가 cached payload 또는 active job을 가리키는지 찾고, 없으면 None을 돌려 Engine API의 UnknownPayload로 이어집니다. Resolve 뒤 결과와 timestamp를 짧게 cache합니다.",
    annotations: [
      { lines: [8, 14], color: "sky", note: "이미 resolve한 같은 ID는 cache에서 반환" },
      { lines: [16, 20], color: "rose", note: "ID가 없으면 UnknownPayload로 이어지는 None" },
      { lines: [21, 29], color: "amber", note: "Job resolve와 lifecycle 제거 여부" },
      { lines: [36, 48], color: "emerald", note: "Resolved payload event·timestamp·revenue 기록" },
    ],
  },
};
