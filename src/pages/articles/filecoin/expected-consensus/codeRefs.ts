import type { CodeRef } from "@/components/code/types";

import filecoinGo from "../../blockchain/filecoin-lotus/codebase/lotus/chain/consensus/filcns/filecoin.go?raw";
import weightGo from "../../blockchain/filecoin-lotus/codebase/lotus/chain/consensus/filcns/weight.go?raw";
import mineGo from "../../blockchain/filecoin-lotus/codebase/lotus/chain/consensus/filcns/mine.go?raw";
import electionProofGo from "./codebase/lotus/chain/types/electionproof.go?raw";
import tipsetGo from "./codebase/lotus/chain/types/tipset.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "ec-compute-win-count": {
    path: "lotus/chain/types/electionproof.go",
    code: electionProofGo,
    lang: "go",
    highlight: [177, 207],
    desc: "ComputeWinCount — VRF hash와 Q.256 Poisson inverse CDF로 정수 당첨 횟수를 계산합니다",
    annotations: [
      { lines: [180, 184], color: "sky", note: "VRF proof를 BLAKE2b로 hash해 [0,1)의 Q.256 값으로 해석합니다" },
      { lines: [185, 198], color: "emerald", note: "provider QAP·network QAP·BlocksPerEpoch에서 λ와 inverse CDF를 준비합니다" },
      { lines: [200, 206], color: "amber", note: "VRF 지점이 survival 구간을 지나는 동안 j를 올리되 MaxWinCount에서 멈춥니다" },
    ],
  },
  "ec-tipset-constructor": {
    path: "lotus/chain/types/tipset.go",
    code: tipsetGo,
    lang: "go",
    highlight: [102, 143],
    desc: "NewTipSet — block 존재·ticket·height·parents를 확인하고 결정적으로 정렬합니다",
    annotations: [
      { lines: [102, 117], color: "sky", note: "구조 계약을 문서화하고 빈 목록·nil ticket을 거절한 뒤 ticket 순으로 정렬합니다" },
      { lines: [119, 129], color: "emerald", note: "첫 block을 기준으로 나머지 block의 height와 parent 수를 맞춥니다" },
      { lines: [131, 142], color: "amber", note: "각 parent CID를 비교하고 tipset key에 block CID를 순서대로 넣습니다" },
    ],
  },
  "ec-validate": {
    path: "lotus/chain/consensus/filcns/filecoin.go",
    code: filecoinGo,
    lang: "go",
    highlight: [136, 194],
    desc: "ValidateBlock — 부모 tipset·lookback·높이·timestamp·parent weight를 먼저 검증합니다",
    annotations: [
      { lines: [136, 153], color: "sky", note: "기본 형식 검사 뒤 header parents로 base tipset과 lookback state를 고정합니다" },
      { lines: [161, 177], color: "emerald", note: "Null epoch 수를 반영해 height와 정확한 timestamp·clock drift를 확인합니다" },
      { lines: [186, 194], color: "amber", note: "부모 tipset에서 weight를 다시 계산해 header의 ParentWeight와 대조합니다" },
    ],
  },
  "ec-winner": {
    path: "lotus/chain/consensus/filcns/filecoin.go",
    code: filecoinGo,
    lang: "go",
    highlight: [202, 254],
    desc: "winnerCheck — miner 자격, election VRF와 QAP 기반 WinCount를 다시 검증합니다",
    annotations: [
      { lines: [202, 214], color: "sky", note: "WinCount가 1 이상인지와 lookback 문맥의 채굴 자격을 확인합니다" },
      { lines: [216, 232], color: "emerald", note: "Beacon·epoch·miner address로 election randomness를 만들고 VRF proof를 검증합니다" },
      { lines: [234, 251], color: "amber", note: "Slashed 상태를 배제하고 QAP에서 WinCount를 재계산해 header 주장과 비교합니다" },
    ],
  },
  "ec-async": {
    path: "lotus/chain/consensus/filcns/filecoin.go",
    code: filecoinGo,
    lang: "go",
    highlight: [256, 320],
    desc: "ValidateBlock 후반 — 서명·beacon·ticket·WinningPoSt·공통 message 검사를 모두 기다립니다",
    annotations: [
      { lines: [256, 274], color: "sky", note: "Worker key의 block signature와 network version의 beacon values를 검사합니다" },
      { lines: [276, 308], color: "emerald", note: "Ticket VRF와 WinningPoSt proof를 각각 비동기 검사로 시작합니다" },
      { lines: [310, 320], color: "amber", note: "공통 block/message 검사까지 모아 RunAsyncChecks가 모두 끝날 때까지 기다립니다" },
    ],
  },
  "ec-weight": {
    path: "lotus/chain/consensus/filcns/weight.go",
    code: weightGo,
    lang: "go",
    highlight: [22, 82],
    desc: "Weight — 부모 누적값, log₂ QAP와 tipset total WinCount 증가분을 계산합니다",
    annotations: [
      { lines: [22, 28], color: "sky", note: "Tipset header의 parent weight를 시작값으로 사용합니다" },
      { lines: [32, 66], color: "emerald", note: "Parent state의 power actor에서 total QAP를 읽고 floor(log₂P)×2⁸을 더합니다" },
      { lines: [68, 82], color: "amber", note: "Tipset blocks의 WinCount 합과 build constants로 election 증가분을 계산합니다" },
    ],
  },
  "ec-create": {
    path: "lotus/chain/consensus/filcns/mine.go",
    code: mineGo,
    lang: "go",
    highlight: [14, 46],
    desc: "CreateBlock — parent tipset 문맥에서 worker address를 찾고 header와 messages를 조립합니다",
    annotations: [
      { lines: [14, 18], color: "sky", note: "Template의 parents로 base tipset을 로드합니다" },
      { lines: [20, 28], color: "emerald", note: "Lookback state에서 miner worker address를 가져옵니다" },
      { lines: [39, 46], color: "amber", note: "서명된 header와 BLS·Secpk messages를 FullBlock으로 반환합니다" },
    ],
  },
};
