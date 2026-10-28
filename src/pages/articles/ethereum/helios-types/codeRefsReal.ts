import type { CodeRef } from "@/components/code/types";
import httpRpc from "./codebase/helios-0.11.1/http_rpc.rs?raw";
import types from "./codebase/helios-0.11.1/types.rs?raw";
import proof from "./codebase/helios-0.11.1/proof.rs?raw";
import verify from "./codebase/helios-0.11.1/verify.rs?raw";

export const codeRefsReal: Record<string, CodeRef> = {
  "helios-json-decode": {
    path: "helios-0.11.1/ethereum/src/rpc/http_rpc.rs · excerpts",
    code: httpRpc,
    lang: "rust",
    highlight: [18, 27],
    desc: "문제: Beacon API update가 실제로 SSZ binary로 전송되는지, JSON으로 읽히는지 구분해야 합니다.\n\n확인: 응답 body는 bytes로 받은 뒤 serde_json::from_slice로 HttpRpcMessage<R>에 들어갑니다. get_updates의 R은 Vec<UpdateData<S>>이며 data field가 Update<S>입니다. 이 파일은 고정 commit의 관련 구간을 이어 붙인 표시용 excerpt입니다.",
    annotations: [
      { lines: [18, 27], color: "sky", note: "HTTP body bytes를 JSON으로 decode합니다. 이 호출은 SSZ decoder가 아닙니다." },
      { lines: [40, 52], color: "emerald", note: "get_updates는 period와 count로 endpoint를 만들고 typed data만 반환합니다." },
      { lines: [55, 59], color: "amber", note: "응답 wrapper의 data가 fork-aware Update<S>로 deserialize됩니다." },
    ],
  },
  "helios-fork-types": {
    path: "helios-0.11.1/ethereum/consensus-core/src/types/mod.rs · excerpts",
    code: types,
    lang: "rust",
    highlight: [1, 31],
    desc: "문제: Base와 Electra update의 branch 길이 차이와 LightClientHeader의 execution field가 설명과 일치하는지 확인합니다.\n\n확인: untagged Update는 Base U5/U6와 Electra U6/U7을 각각 고정합니다. Capella·Deneb·Electra header는 execution과 U4 branch를 갖습니다. GenericUpdate는 fork variant를 공통 검증 입력으로 정규화합니다. 이 파일은 고정 commit의 관련 구간을 이어 붙인 표시용 excerpt입니다.",
    annotations: [
      { lines: [1, 12], color: "sky", note: "Base와 Electra를 별도 tag 없이 구조로 고르는 untagged enum입니다." },
      { lines: [13, 30], color: "emerald", note: "Next committee 5→6, finality 6→7 branch 길이가 타입에 들어 있습니다." },
      { lines: [33, 49], color: "amber", note: "Execution header와 U4 execution branch는 Capella·Deneb·Electra variant에만 있습니다." },
      { lines: [57, 80], color: "violet", note: "Fork별 object는 optional evidence를 가진 GenericUpdate로 정규화되어 검증 경계에 들어갑니다." },
    ],
  },
  "helios-proof-fold": {
    path: "helios-0.11.1/ethereum/consensus-core/src/proof.rs · excerpts",
    code: proof,
    lang: "rust",
    highlight: [1, 80],
    desc: "문제: Fork별 branch 길이가 실제 proof 검증과 어떻게 연결되는지 확인합니다.\n\n확인: Electra epoch부터 finality depth는 7, next committee depth는 6입니다. Execution payload는 depth 4, index 9입니다. 공통 함수는 길이를 먼저 검사하고 leaf tree hash에서 sibling 순서대로 SHA-256을 접어 trusted root와 비교합니다. 이 파일은 고정 commit의 관련 구간을 이어 붙인 표시용 excerpt입니다.",
    annotations: [
      { lines: [8, 12], color: "sky", note: "Finality proof는 Electra에서 depth 7, 이전에는 6입니다." },
      { lines: [30, 34], color: "emerald", note: "Next committee proof는 Electra에서 depth 6, 이전에는 5입니다." },
      { lines: [45, 50], color: "amber", note: "Execution payload header는 body root 아래 depth 4, index 9로 확인합니다." },
      { lines: [53, 80], color: "violet", note: "길이, sibling 방향, 마지막 root equality가 모두 통과해야 합니다." },
    ],
  },
  "helios-update-verify": {
    path: "helios-0.11.1/ethereum/consensus-core/src/consensus_core.rs · verify_generic_update excerpt",
    code: verify,
    lang: "rust",
    highlight: [1, 105],
    desc: "문제: JSON decode가 성공한 Update와 consensus 검증을 통과한 후보를 구분해야 합니다.\n\n확인: verify_generic_update는 참여, execution proof, 시간, period, finality·committee branch, participant keys와 BLS signature를 차례로 확인합니다. 함수 인자는 immutable Store reference이고 성공값은 Result<()>이므로 이 단계는 Store를 수정하지 않습니다.",
    annotations: [
      { lines: [8, 15], color: "sky", note: "참여가 0이거나 execution payload proof가 틀리면 초기에 거절합니다." },
      { lines: [23, 40], color: "emerald", note: "Signature slot의 시간 순서와 현재 Store가 허용하는 period를 확인합니다." },
      { lines: [44, 78], color: "amber", note: "Finality와 next committee evidence는 각각 독립된 branch 검사를 거칩니다." },
      { lines: [80, 104], color: "violet", note: "Period에 맞는 committee와 participant bits, fork domain으로 BLS signature를 확인합니다." },
    ],
  },
};
