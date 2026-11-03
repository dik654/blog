import type { CodeRef } from "@/components/code/types";
import pdpVerifierSol from "./codebase/pdp/src/PDPVerifier.sol?raw";
import simplePdpServiceSol from "./codebase/pdp/src/SimplePDPService.sol?raw";

export const codeRefs: Record<string, CodeRef> = {
  "pdp-verifier": {
    path: "src/PDPVerifier.sol · v3.5.0 excerpt",
    code: pdpVerifierSol,
    lang: "solidity",
    highlight: [5, 108],
    desc: "실제 FilOzone PDP v3.5.0 계약의 제어 흐름 발췌입니다. challenge epoch 확인부터 randomness, logical leaf 선택, sum-tree 탐색, Merkle 검증과 listener 통지까지 이어서 봅니다.",
    annotations: [
      {
        lines: [5, 17],
        color: "sky",
        note: "등록된 제공자와 challenge epoch를 먼저 확인합니다. proof가 비어 있거나 너무 이르면 여기서 멈춥니다.",
      },
      {
        lines: [19, 31],
        color: "emerald",
        note: "beacon randomness에서 seed를 얻고 seed·setId·순번을 해시해 dataset 전체 leaf 번호를 만듭니다.",
      },
      {
        lines: [52, 73],
        color: "amber",
        note: "sum-tree가 logical leaf를 piece/local offset으로 바꾸면 해당 piece root까지 Merkle path를 검증합니다.",
      },
      {
        lines: [75, 108],
        color: "violet",
        note: "Filecoin beacon randomness 경계와 sum-tree의 이진 탐색을 실제 코드로 확인할 수 있습니다.",
      },
    ],
  },
  "pdp-schedule": {
    path: "src/SimplePDPService.sol · v3.5.0 excerpt",
    code: simplePdpServiceSol,
    lang: "solidity",
    highlight: [5, 85],
    desc: "실제 FilOzone PDP v3.5.0 기본 listener 발췌입니다. verifier가 통지한 proof의 개수·window를 검사하고, proof가 없던 period를 fault로 기록하는 경계를 보여 줍니다.",
    annotations: [
      {
        lines: [5, 30],
        color: "sky",
        note: "같은 period의 중복 proof, 부족한 challenge 수, 시작 전·늦은·너무 이른 proof를 거부합니다.",
      },
      {
        lines: [32, 49],
        color: "emerald",
        note: "첫 period에서는 다음 challenge epoch가 허용 window 안에 있는지 확인합니다.",
      },
      {
        lines: [51, 85],
        color: "amber",
        note: "건너뛴 period와 proof가 없던 직전 period를 합쳐 FaultRecord를 남긴 뒤 다음 deadline으로 이동합니다.",
      },
    ],
  },
};
