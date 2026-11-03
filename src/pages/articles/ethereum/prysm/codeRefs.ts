import type { CodeRef } from "@/components/code/types";
import nodeRaw from "./codebase/prysm/beacon-chain/node/node_v7.go?raw";
import receiveBlockRaw from "./codebase/prysm/beacon-chain/blockchain/receive_block_v7.go?raw";
import attestRaw from "./codebase/prysm/validator/client/attest_v7.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "node-lifecycle": {
    path: "beacon-chain/node/node.go — BeaconNode.Start() · Close()",
    lang: "go",
    code: nodeRaw,
    highlight: [1, 47],
    desc: "Prysm v7.3.1 · 등록된 서비스를 함께 시작하고 종료 신호에서 역순으로 닫는 node 경계",
    annotations: [
      {
        lines: [1, 7],
        color: "sky",
        note: "BeaconNode 자체가 모든 일을 하지 않고 service registry를 시작합니다.",
      },
      {
        lines: [9, 27],
        color: "amber",
        note: "종료 신호를 받아 proposal duty 보호 정책을 거친 뒤 Close를 호출합니다.",
      },
      {
        lines: [34, 47],
        color: "emerald",
        note: "서비스·DB·collector·context를 닫아 재시작 경계를 만듭니다.",
      },
    ],
  },
  "block-lifecycle": {
    path: "beacon-chain/blockchain/receive_block.go — Service.ReceiveBlock()",
    lang: "go",
    code: receiveBlockRaw,
    highlight: [1, 92],
    desc: "Prysm v7.3.1 · block root 중복 검사부터 state·Engine·DA·fork choice·checkpoint 갱신까지",
    annotations: [
      {
        lines: [4, 20],
        color: "sky",
        note: "Blacklist·이미 처리한 root·동시 처리 중인 root를 먼저 거릅니다.",
      },
      {
        lines: [31, 46],
        color: "emerald",
        note: "Parent pre-state를 찾고 consensus와 execution을 검증한 뒤 data availability를 확인합니다.",
      },
      {
        lines: [51, 70],
        color: "violet",
        note: "완성된 post-state를 저장하고 fork-choice 후보 처리와 checkpoint 갱신을 수행합니다.",
      },
      {
        lines: [72, 92],
        color: "amber",
        note: "Slasher·operation pool·hot-state DB·cache 같은 후속 owner를 정리합니다.",
      },
    ],
  },
  "validator-attestation": {
    path: "validator/client/attest.go — validator.SubmitAttestation()",
    lang: "go",
    code: attestRaw,
    highlight: [1, 161],
    desc: "Prysm v7.3.1 · duty 조회, signing root, slashing protection, 제출과 receipt 기록",
    annotations: [
      {
        lines: [6, 47],
        color: "sky",
        note: "같은 key·role을 잠그고 현재 duty와 committee를 찾습니다.",
      },
      {
        lines: [51, 91],
        color: "emerald",
        note: "Attestation data에 서명하고 fork에 맞는 indexed attestation을 만듭니다.",
      },
      {
        lines: [93, 116],
        color: "rose",
        note: "Signing root를 계산한 뒤 local slashing-protection DB가 충돌을 거절합니다.",
      },
      {
        lines: [118, 161],
        color: "violet",
        note: "Fork에 맞는 object를 beacon node에 제출하고 결과를 저장·관측합니다.",
      },
    ],
  },
};
