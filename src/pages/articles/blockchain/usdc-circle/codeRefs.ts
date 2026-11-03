import type { CodeRef } from "@/components/code/types";
import fiatMintRaw from "./codebase/stablecoin-evm/fiat_mint.sol?raw";
import fiatBurnRaw from "./codebase/stablecoin-evm/fiat_burn.sol?raw";
import cctpDepositBurnRaw from "./codebase/evm-cctp/deposit_burn.sol?raw";
import cctpReceiveRaw from "./codebase/evm-cctp/receive_message.sol?raw";
import cctpValidateRaw from "./codebase/evm-cctp/validate_message.sol?raw";
import cctpMintRaw from "./codebase/evm-cctp/mint_destination.sol?raw";

export const usdcCodeRefs: Record<string, CodeRef> = {
  "fiat-token-mint": {
    path: "contracts/v1/FiatTokenV1.sol:114 — mint()",
    lang: "solidity",
    code: fiatMintRaw.trimEnd(),
    highlight: [1, 32],
    desc: "circlefin/stablecoin-evm @ fc85788 · pause·minter·blacklist·allowance를 통과한 뒤 supply와 수령인 balance를 함께 늘리는 원문",
    annotations: [
      {
        lines: [8, 15],
        color: "violet",
        note: "아무 지갑이나 mint할 수 없습니다. 승인된 minter와 blacklist·pause 조건을 먼저 확인합니다.",
      },
      {
        lines: [20, 24],
        color: "amber",
        note: "Minter별 남은 발행 한도보다 큰 요청은 거절됩니다.",
      },
      {
        lines: [26, 30],
        color: "emerald",
        note: "통과한 금액만 totalSupply와 목적지 balance에 같은 수량으로 반영됩니다.",
      },
    ],
  },
  "fiat-token-burn": {
    path: "contracts/v1/FiatTokenV1.sol:357 — burn()",
    lang: "solidity",
    code: fiatBurnRaw.trimEnd(),
    highlight: [1, 22],
    desc: "circlefin/stablecoin-evm @ fc85788 · 승인된 minter가 자기 balance의 token을 없애 totalSupply를 줄이는 원문",
    annotations: [
      {
        lines: [7, 13],
        color: "violet",
        note: "Burn도 pause·minter·blacklist 경계를 통과해야 합니다.",
      },
      {
        lines: [15, 16],
        color: "amber",
        note: "0보다 크고 caller balance 이하인 수량만 허용합니다.",
      },
      {
        lines: [18, 21],
        color: "rose",
        note: "이 코드는 onchain supply를 줄일 뿐 은행 지급 완료를 기록하지 않습니다.",
      },
    ],
  },
  "cctp-deposit-burn": {
    path: "src/v2/TokenMessengerV2.sol:332 — _depositForBurn()",
    lang: "solidity",
    code: cctpDepositBurnRaw.trimEnd(),
    highlight: [1, 64],
    desc: "circlefin/evm-cctp-contracts @ a92a2b4 · source token을 burn하고 destination·recipient·amount·fee·finality가 든 message를 만드는 원문",
    annotations: [
      {
        lines: [11, 22],
        color: "amber",
        note: "수량·수령인·fee 상한을 먼저 검사합니다.",
      },
      {
        lines: [25, 30],
        color: "violet",
        note: "등록된 remote messenger를 찾은 뒤 source token을 실제로 소각합니다.",
      },
      {
        lines: [33, 50],
        color: "emerald",
        note: "소각 사실과 목적지를 typed burn message로 만들고 local MessageTransmitter에 넘깁니다.",
      },
    ],
  },
  "cctp-receive": {
    path: "src/v2/MessageTransmitterV2.sol:206 — receiveMessage()",
    lang: "solidity",
    code: cctpReceiveRaw.trimEnd(),
    highlight: [1, 52],
    desc: "circlefin/evm-cctp-contracts @ a92a2b4 · message를 검증하고 nonce를 사용 처리한 뒤 finality에 맞는 handler를 부르는 원문",
    annotations: [
      {
        lines: [5, 13],
        color: "violet",
        note: "Attestation과 message field 검증 결과를 먼저 받습니다.",
      },
      {
        lines: [15, 16],
        color: "rose",
        note: "같은 message를 다시 mint하지 못하도록 nonce를 사용 처리합니다.",
      },
      {
        lines: [18, 37],
        color: "emerald",
        note: "실행된 finality threshold에 따라 unfinalized 또는 finalized handler를 부릅니다.",
      },
    ],
  },
  "cctp-validate": {
    path: "src/v2/MessageTransmitterV2.sol:271 — _validateReceivedMessage()",
    lang: "solidity",
    code: cctpValidateRaw.trimEnd(),
    highlight: [1, 51],
    desc: "circlefin/evm-cctp-contracts @ a92a2b4 · attester signature·destination domain·caller·version·unused nonce를 확인하는 원문",
    annotations: [
      {
        lines: [17, 23],
        color: "violet",
        note: "Circle attester signature와 message binary format을 검증합니다.",
      },
      {
        lines: [25, 37],
        color: "amber",
        note: "이 chain이 destination인지, 제한된 caller와 version이 맞는지 검사합니다.",
      },
      {
        lines: [39, 43],
        color: "rose",
        note: "이미 사용한 nonce라면 destination handler에 도달하기 전에 거절합니다.",
      },
    ],
  },
  "cctp-mint-destination": {
    path: "src/v2/TokenMessengerV2.sol:405 — _handleReceiveMessage()",
    lang: "solidity",
    code: cctpMintRaw.trimEnd(),
    highlight: [1, 72],
    desc: "circlefin/evm-cctp-contracts @ a92a2b4 · burn message의 version·expiry·fee를 확인하고 recipient와 fee recipient에 합계 amount를 mint하는 원문",
    annotations: [
      {
        lines: [5, 20],
        color: "emerald",
        note: "검증된 amount에서 fee를 나눠 recipient와 fee recipient에 mint합니다.",
      },
      {
        lines: [50, 61],
        color: "amber",
        note: "Message body version과 expiration block을 확인합니다.",
      },
      {
        lines: [63, 70],
        color: "rose",
        note: "실행 fee가 amount 이상이거나 source에서 허용한 maxFee를 넘으면 거절합니다.",
      },
    ],
  },
};
