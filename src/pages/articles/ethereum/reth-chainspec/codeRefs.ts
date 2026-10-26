import type { CodeRef } from "@/components/code/types";
import specSrc from "./codebase/reth/spec.rs?raw";
import genesisSrc from "./codebase/reth/genesis.rs?raw";
import hardforksSrc from "./codebase/reth/chain_hardforks.rs?raw";
import apiSrc from "./codebase/reth/api.rs?raw";
import forkConditionSrc from "./codebase/alloy-hardforks/forkcondition.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "chainspec-struct": {
    path: "reth/crates/chainspec/src/spec.rs",
    lang: "rust",
    highlight: [3, 22],
    desc: "Reth v2.8.1의 실제 ChainSpec 필드입니다. 체인 번호는 제네시스·하드포크·수수료·블롭 설정과 함께 저장되는 한 항목입니다.",
    annotations: [
      { lines: [5, 9], color: "sky", note: "체인 번호와 첫 상태·첫 헤더" },
      { lines: [11, 13], color: "emerald", note: "Paris 경계와 순서가 있는 하드포크 조건" },
      { lines: [17, 21], color: "amber", note: "실행과 블록 구성에 쓰는 수수료·블롭 매개변수" },
    ],
    code: specSrc,
  },
  "chain-hardforks": {
    path: "reth/crates/ethereum/hardforks/src/hardforks/mod.rs",
    lang: "rust",
    highlight: [3, 38],
    desc: "활성화 순서는 Vec가 보존하고 이름 조회는 표준 빌드에서 FxHashMap이 맡습니다. BTreeMap은 no_std 대체 경로입니다.",
    annotations: [
      { lines: [4, 9], color: "sky", note: "순서 저장과 조회 인덱스는 서로 다른 책임" },
      { lines: [13, 17], color: "emerald", note: "생성 시 이미 활성화 순서대로 들어와야 함" },
      { lines: [27, 36], color: "amber", note: "삽입 시 조건 순서에 맞는 위치를 다시 계산" },
    ],
    code: hardforksSrc,
  },
  "fork-condition": {
    path: "alloy-hardforks/crates/hardforks/src/forkcondition.rs",
    lang: "rust",
    highlight: [3, 30],
    desc: "Reth v2.8.1이 고정한 alloy-hardforks 0.4.11의 조건 형식과 실제 판정식입니다.",
    annotations: [
      { lines: [4, 14], color: "sky", note: "블록·누적 난이도·시각·비활성 조건" },
      { lines: [17, 20], color: "emerald", note: "후보 번호가 경계 이상이면 활성" },
      { lines: [22, 25], color: "amber", note: "현재 난이도를 뺀 직전 누적 난이도와 비교" },
      { lines: [27, 29], color: "violet", note: "후보 헤더 시각이 경계 이상이면 활성" },
    ],
    code: forkConditionSrc,
  },
  "fork-id": {
    path: "reth/crates/chainspec/src/spec.rs",
    lang: "rust",
    highlight: [24, 60],
    desc: "EIP-6122에 따라 제네시스 해시에서 시작해 지난 블록 경계를 먼저, 시각 경계를 나중에 한 번씩 반영합니다.",
    annotations: [
      { lines: [26, 28], color: "sky", note: "제네시스 해시가 호환성 식별의 시작점" },
      { lines: [30, 44], color: "emerald", note: "블록 기반 경계를 먼저 처리하고 다음 경계를 반환" },
      { lines: [46, 57], color: "amber", note: "제네시스 뒤의 시각 경계를 이어서 처리" },
      { lines: [59, 59], color: "violet", note: "알려진 변경을 모두 지났으면 next=0" },
    ],
    code: specSrc,
  },
  "eth-chainspec-trait": {
    path: "reth/crates/chainspec/src/api.rs",
    lang: "rust",
    highlight: [3, 23],
    desc: "검증·실행·블록 생성 코드가 체인 식별과 시점별 매개변수를 읽는 공통 조회 경계입니다.",
    annotations: [
      { lines: [7, 11], color: "sky", note: "체인 식별 조회" },
      { lines: [13, 14], color: "emerald", note: "시각에 따른 수수료·블롭 매개변수 조회" },
      { lines: [16, 21], color: "amber", note: "제네시스와 네트워크 초기 정보 조회" },
    ],
    code: apiSrc,
  },
  "make-genesis": {
    path: "reth/crates/chainspec/src/spec.rs",
    lang: "rust",
    highlight: [3, 59],
    desc: "초기 계정의 상태 루트와 시작 시점에 활성인 규칙별 헤더 필드를 한 헤더로 조립합니다.",
    annotations: [
      { lines: [4, 12], color: "sky", note: "London·Shanghai가 시작부터 활성인지 확인" },
      { lines: [14, 36], color: "emerald", note: "Cancun·Prague·Amsterdam 조건부 필드" },
      { lines: [38, 56], color: "amber", note: "alloc에서 계산한 state_root를 포함해 첫 헤더 구성" },
    ],
    code: genesisSrc,
  },
  "mainnet-spec": {
    path: "reth/crates/chainspec/src/spec.rs",
    lang: "rust",
    highlight: [61, 87],
    desc: "내장 메인넷 설정은 임베드한 제네시스 입력으로 헤더를 만들고 알려진 MAINNET_GENESIS_HASH와 묶습니다.",
    annotations: [
      { lines: [62, 64], color: "sky", note: "제네시스 JSON과 메인넷 하드포크 일정 입력" },
      { lines: [67, 70], color: "emerald", note: "계산한 헤더를 알려진 첫 블록 해시로 봉인" },
      { lines: [72, 83], color: "amber", note: "Paris·예치 계약·수수료·블롭 설정" },
    ],
    code: genesisSrc,
  },
  "custom-spec-build": {
    path: "reth/crates/chainspec/src/spec.rs",
    lang: "rust",
    highlight: [89, 112],
    desc: "사용자 정의 ChainSpecBuilder는 같은 헤더 계산 함수를 쓰되, 결과를 아직 해시하지 않은 봉인 헤더로 보관합니다.",
    annotations: [
      { lines: [90, 98], color: "sky", note: "Paris 조건에서 전환 블록과 최종 난이도 추출" },
      { lines: [99, 105], color: "emerald", note: "규칙 묶음으로 헤더를 만든 뒤 해시 계산은 지연" },
      { lines: [106, 110], color: "amber", note: "같은 입력을 최종 ChainSpec 필드에 함께 저장" },
    ],
    code: genesisSrc,
  },
};
