import type { Article } from "../types";

export const zkpVmArticles: Article[] = [
  {
    slug: "circom",
    title: "Circom: signal·R1CS lowering과 reproducible artifact",
    subcategory: "zkp-groth16-impl",
    sections: [
      { id: "overview", title: "3·4=12에서 compiler pipeline까지" },
      { id: "lowering", title: "Signal·witness·constraint lowering" },
      { id: "artifacts", title: "R1CS·witness·public layout artifact" },
      { id: "release", title: "snarkjs release·rollback gate" },
    ],
    component: () => import("@/pages/articles/blockchain/circom"),
  },
  {
    slug: "scroll-zkevm",
    title: "Scroll zkEVM: EVM trace·Halo2 proof artifact",
    subcategory: "zkp-plonk-impl",
    sections: [
      { id: "overview", title: "ADD 한 번에서 zkEVM까지" },
      { id: "trace-tables", title: "EVM trace·table 계약" },
      { id: "proof-artifact", title: "Witness·proof·public input artifact" },
      { id: "release", title: "Parity·verification release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/scroll-zkevm"),
  },
  {
    slug: "sp1",
    title: "SP1: Plonky3 기반 RISC-V zkVM",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "ELF에서 proof receipt까지" },
      { id: "program-artifact", title: "ELF·program key artifact" },
      { id: "execution-shards", title: "Execution record·shards" },
      { id: "proof-receipt", title: "Proof modes·receipt" },
      { id: "release-gate", title: "Parity·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/sp1"),
  },
  {
    slug: "risc0",
    title: "RISC Zero: RISC-V zkVM & STARK 증명 시스템",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "Guest ELF에서 receipt까지" },
      { id: "method-artifact", title: "Method·ImageID artifact" },
      { id: "session-segments", title: "Session·segment continuity" },
      { id: "receipt-claim", title: "Receipt claim·journal" },
      { id: "release-gate", title: "Verification·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/risc0"),
  },
  {
    slug: "jolt",
    title: "Jolt: 명령 실행과 메모리 읽기·쓰기의 증명",
    subcategory: "zkp-vm",
    sections: [{"id": "overview", "title": "1. 프로그램의 계산과 메모리 읽기를 함께 증명합니다"}, {"id": "black-box", "title": "2. 실행 기록을 만들고 각 기록의 약속을 검사합니다"}, {"id": "case", "title": "3. 두 저장 위치의 3과 4를 더해 7을 씁니다"}, {"id": "picture", "title": "4. 주소는 한 칸만 1인 선택 벡터로 표현할 수 있습니다"}, {"id": "need", "title": "5. 큰 명령표를 전부 저장하지 않고 구조를 이용합니다"}, {"id": "names", "title": "6. 명령 lookup과 읽기·쓰기 검사를 나눕니다"}, {"id": "lookup-sumcheck", "title": "7. 덧셈 7과 메모리 변화 7을 서로 다른 조건으로 묶습니다"}, {"id": "source", "title": "8. 코드에서 입력 마스크와 되돌아오는 덧셈을 확인합니다"}, {"id": "artifact", "title": "9. 읽기·쓰기 식과 공개 출력이 같은 증거에 묶입니다"}, {"id": "release", "title": "10. 올바른 7의 증명과 원하는 프로그램의 증명을 구분합니다"}],
    component: () => import("@/pages/articles/blockchain/jolt"),
  },
  { slug: "prover-memory-and-verifier-cost", title: "증명기 메모리와 검증 비용", subcategory: "zkp-vm", sections: [{"id": "overview", "title": "1. 증거가 작아도 만드는 컴퓨터는 큰 작업 공간이 필요합니다"}, {"id": "black-box", "title": "2. 만드는 쪽은 자료를 펼치고 확인하는 쪽은 증거를 검사합니다"}, {"id": "case", "title": "3. 104만 8576행에 64개 값이 있다면"}, {"id": "picture", "title": "4. 순간별로 남은 버퍼를 더하고 가장 큰 순간을 고릅니다"}, {"id": "need", "title": "5. 속도를 높이는 선택이 메모리를 늘릴 수 있습니다"}, {"id": "names", "title": "6. 바이트·대역폭·가스를 다른 단위로 읽습니다"}, {"id": "mechanism", "title": "7. 평가표와 해시 자료의 최고점을 계산합니다"}, {"id": "source", "title": "8. MSM은 순차적으로 바뀌는 작업공간의 최댓값을 셉니다"}, {"id": "comparison", "title": "9. 페어링쌍 4개와 공개입력 3개의 가스를 따로 계산합니다"}, {"id": "limits", "title": "10. 검증을 줄이는 선택은 새 비용과 가정을 가져옵니다"}], component: () => import("@/pages/articles/blockchain/prover-memory-and-verifier-cost") },
];
