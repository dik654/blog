import type { CodeRef } from "@/components/code/types";
import newPayloadRaw from "./codebase/prysm/beacon-chain/execution/new_payload.go?raw";
import forkchoiceRaw from "./codebase/prysm/beacon-chain/execution/forkchoice_updated.go?raw";
import getPayloadRaw from "./codebase/prysm/beacon-chain/execution/get_payload.go?raw";
import executionStatusRaw from "./codebase/prysm/beacon-chain/blockchain/execution_status.go?raw";
import proposerPayloadRaw from "./codebase/prysm/beacon-chain/rpc/proposer_payload.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "proposal-build": {
    path: "beacon-chain/rpc/prysm/v1alpha1/validator/proposer_execution_payload.go — payloadId cache·FCU·GetPayload excerpts",
    lang: "go",
    code: proposerPayloadRaw,
    highlight: [1, 30],
    desc: "Prysm은 cached payloadId가 있으면 바로 GetPayload을 호출하고, 없으면 ForkchoiceUpdated로 build를 준비한 뒤 반환된 ID를 GetPayload에 넘깁니다.",
    annotations: [
      { lines: [1, 13], color: "sky", note: "같은 slot·parent의 8-byte payloadId가 cache에 있으면 build 결과부터 회수합니다." },
      { lines: [18, 27], color: "emerald", note: "Cache miss 경로는 ForkchoiceUpdated의 payloadId를 검증한 뒤 GetPayload에 그대로 전달합니다." },
    ],
  },
  "engine-forkchoice": {
    path: "beacon-chain/execution/engine_jsonrpc.go — ForkchoiceUpdated() · Prysm v7.3.1",
    lang: "go",
    code: forkchoiceRaw,
    highlight: [1, 69],
    desc: "PayloadAttributes version이 method suffix를 고르고, PayloadStatus가 payloadId·latestValidHash·error 반환을 나눕니다.",
    annotations: [
      { lines: [10, 48], color: "sky", note: "Bellatrix부터 Gloas까지 attributes version에 맞는 V1–V4 method를 선택합니다." },
      { lines: [55, 68], color: "amber", note: "SYNCING·INVALID·VALID이 서로 다른 반환값과 error가 됩니다." },
    ],
  },
  "engine-get-payload": {
    path: "beacon-chain/execution/engine_jsonrpc.go — getPayloadMethodAndMessage()·GetPayload() · Prysm v7.3.1",
    lang: "go",
    code: getPayloadRaw,
    highlight: [1, 38],
    desc: "Slot의 epoch이 getPayload method와 response envelope를 함께 결정하고, 같은 8-byte payloadId를 JSON-RPC parameter로 보냅니다.",
    annotations: [
      { lines: [1, 19], color: "sky", note: "Fork epoch에 따라 V1부터 V6과 받을 protobuf type을 함께 고릅니다." },
      { lines: [22, 38], color: "emerald", note: "선택한 method에 payloadId를 보내고 fork별 response를 공통 GetPayloadResponse로 감쌉니다." },
    ],
  },
  "engine-new-payload": {
    path: "beacon-chain/execution/engine_jsonrpc.go — NewPayload() · Prysm v7.3.1",
    lang: "go",
    code: newPayloadRaw,
    highlight: [1, 64],
    desc: "Execution payload type과 execution requests 유무가 newPayload V1–V5를 고르고, status를 Prysm 내부 error로 바꿉니다.",
    annotations: [
      { lines: [7, 48], color: "sky", note: "Fork별 payload shape와 부가 입력이 JSON-RPC method 선택을 결정합니다." },
      { lines: [50, 63], color: "amber", note: "Transport 성공 뒤에도 PayloadStatus를 다시 분기합니다." },
    ],
  },
  "execution-status": {
    path: "beacon-chain/blockchain/execution_engine.go — NewPayload status·invalid pruning excerpts · Prysm v7.3.1",
    lang: "go",
    code: executionStatusRaw,
    highlight: [1, 36],
    desc: "VALID은 true, SYNCING·ACCEPTED는 optimistic false, INVALID는 latestValidHash를 담은 invalidBlock으로 바뀌고 후속 pruning에서 descendant를 제거합니다.",
    annotations: [
      { lines: [1, 17], color: "sky", note: "Engine client error 종류가 block-processing 결과로 변환됩니다." },
      { lines: [19, 36], color: "rose", note: "INVALID branch는 fork-choice store에서 invalid root를 찾고 block·state를 제거합니다." },
    ],
  },
};
