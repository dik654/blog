import type { CodeRef } from "@/components/code/types";
import getHeaderGo from "./codebase/mev-boost/server/get_header.go?raw";
import getPayloadGo from "./codebase/mev-boost/server/get_payload.go?raw";
import rethProvRs from "./codebase/rbuilder/crates/rbuilder/src/provider/reth_prov.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "process-bid": {
    path: "mev-boost/server/get_header.go",
    code: getHeaderGo,
    lang: "go",
    highlight: [14, 104],
    desc: "문제: proposer가 여러 relay의 bid 중 유효한 후보만 골라 최댓값을 선택한다는 b*=argmax_{b∈V(t<t_d)} v(b) 식이 실제로 어떻게 구현되는지 확인해야 합니다.\n\n해결: mev-boost의 processBid가 pubkey·signature·parentHash·zero-value 검사로 유효 집합 V를 만들고, 그 집합 안에서만 value를 비교해 argmax를 갱신합니다.",
    annotations: [
      { lines: [30, 34], color: "sky", note: "article의 V — 빈 block hash 제외" },
      { lines: [36, 41], color: "emerald", note: "article의 relay·builder identity 검증" },
      { lines: [56, 64], color: "amber", note: "article의 parent hash 검증 — 다른 head 위의 bid 제외" },
      { lines: [66, 72], color: "violet", note: "article의 v(b)>0 — 0-value bid 제외" },
      { lines: [74, 80], color: "rose", note: "article 식에는 없는 실제 policy — 운영자 설정 최소 bid 미만도 제외" },
      { lines: [84, 99], color: "sky", note: "article의 b*=argmax v(b) — 최고 bid와 비교해 갱신, 동점이면 block hash tie-break" },
    ],
  },
  "get-payload-timeout": {
    path: "mev-boost/server/get_payload.go",
    code: getPayloadGo,
    lang: "go",
    highlight: [16, 96],
    desc: "문제: 세 실패 모드(No bid/Invalid bid/Payload non-delivery) 중 \"Payload non-delivery\"— blinded block 서명 뒤 body를 받지 못하는 상황 — 이 실제로 어떻게 구분되는지 확인해야 합니다.\n\n해결: innerGetPayload가 모든 relay에 동시에 요청을 보내고, timeout 안에 아무 relay도 유효한 body를 못 돌려주면 빈 payloadResult{}가 채택되어 non-delivery를 판별할 수 있게 합니다.",
    annotations: [
      { lines: [20, 26], color: "sky", note: "article의 payload non-delivery — timeout 뒤 빈 결과를 채널에 넣어 무한 대기 방지" },
      { lines: [38, 44], color: "emerald", note: "article의 선택 receipt — 받은 body가 서명한 header와 일치하는지 여기서 검증" },
      { lines: [46, 50], color: "amber", note: "가장 먼저 도착한 유효 응답만 채택 — 나머지는 redundancy 목적" },
      { lines: [59, 78], color: "violet", note: "verifyPayload — version·empty·block hash·blobs bundle 순서로 검증" },
      { lines: [80, 96], color: "rose", note: "verifyBlockHash — 서명한 header와 실제 받은 body의 block hash 대조" },
    ],
  },
  "rbuilder-reth-provider": {
    path: "rbuilder/crates/rbuilder/src/provider/reth_prov.rs",
    code: rethProvRs,
    lang: "rust",
    highlight: [18, 83],
    desc: "문제: \"rbuilder는 Reth의 crates와 provider를 재사용할 수 있는 별도 builder application\"이라는 주장이 실제로 어느 코드에서 확인되는지 봐야 합니다.\n\n해결: rbuilder 자신의 StateProviderFactoryFromRethProvider가 reth_provider crate의 real trait들을 where절로 요구하고, 대부분의 메서드를 그 실제 provider로 그대로 위임(delegate)합니다.",
    annotations: [
      { lines: [18, 20], color: "sky", note: "article의 reuse — Reth node core와 다른 실행 경로의 wrapper" },
      { lines: [29, 46], color: "emerald", note: "실제 reth_provider crate의 trait 조합을 그대로 요구하는 where절" },
      { lines: [48, 64], color: "amber", note: "대부분 메서드는 새 로직 없이 실제 provider로 순수 위임" },
      { lines: [66, 82], color: "violet", note: "root_hasher만 rbuilder 자체 로직 추가 — reuse와 builder policy의 실제 경계선" },
    ],
  },
};
