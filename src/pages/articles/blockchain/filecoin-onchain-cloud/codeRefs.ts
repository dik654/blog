import type { CodeRef } from "@/components/code/types";
import paySol from "./codebase/filecoin-pay/src/FilecoinPayV1.sol?raw";
import provingSol from "./codebase/filecoin-services/service_contracts/src/modules/FWSSProvingModule.sol?raw";
import storageSol from "./codebase/filecoin-services/service_contracts/src/storage/FWSSStorage.sol?raw";
import managerTs from "./codebase/synapse-sdk/packages/synapse-sdk/src/storage/manager.ts?raw";

export const codeRefs: Record<string, CodeRef> = {
  "dataset-info": {
    path: "service_contracts/src/storage/FWSSStorage.sol · v1.5.0 excerpt",
    code: storageSol,
    lang: "solidity",
    highlight: [10, 34],
    desc: "실제 filecoin-services v1.5.0 저장소 레이아웃 발췌입니다. dataset 서비스 기록과 proof·payment를 연결하는 bitmap·deadline·rail 역참조를 함께 봅니다.",
    annotations: [
      {
        lines: [11, 16],
        color: "sky",
        note: "PDP rail과 payer·payee·provider가 같은 dataset 서비스 기록에 묶입니다.",
      },
      {
        lines: [19, 22],
        color: "amber",
        note: "종료 경계와 아직 flush하지 않은 lifecycle 비용·reserve를 따로 보존합니다.",
      },
      {
        lines: [25, 34],
        color: "emerald",
        note: "period bitmap·activation·deadline과 rail→dataset 역참조가 proof-aware settlement를 가능하게 합니다.",
      },
    ],
  },
  "period-state": {
    path: "service_contracts/src/modules/FWSSProvingModule.sol · v1.5.0 excerpt",
    code: provingSol,
    lang: "solidity",
    highlight: [5, 112],
    desc: "실제 filecoin-services v1.5.0 proving 모듈 발췌입니다. proof 접수와 Filecoin Pay validator가 proven·faulted·open period를 서로 다르게 처리하는 지점을 확인합니다.",
    annotations: [
      {
        lines: [16, 40],
        color: "sky",
        note: "중복·challenge 수·활성화·window를 통과한 proof만 현재 period bitmap에 기록합니다.",
      },
      {
        lines: [66, 82],
        color: "emerald",
        note: "활성화 전에는 0원으로 cursor를 전진시키고, proven epoch 비율로 제안 금액을 줄입니다.",
      },
      {
        lines: [99, 107],
        color: "amber",
        note: "proven은 지급 epoch를 세고, deadline이 지난 fault는 0원으로 전진하며, open은 cursor를 움직이지 않습니다.",
      },
    ],
  },
  "rail-settle": {
    path: "src/FilecoinPayV1.sol · v1.0.0 excerpt",
    code: paySol,
    lang: "solidity",
    highlight: [4, 105],
    desc: "실제 Filecoin Pay v1.0.0 발췌입니다. account·rail·operator approval와 validator가 gross settlement를 줄이는 경계를 함께 확인합니다.",
    annotations: [
      {
        lines: [4, 35],
        color: "sky",
        note: "잔액, rate·fixed lockup, settledUpTo와 operator 한도를 서로 다른 필드로 둡니다.",
      },
      {
        lines: [72, 82],
        color: "emerald",
        note: "먼저 rate×duration으로 최대 금액을 만들고 validator에 검증을 요청합니다.",
      },
      {
        lines: [84, 105],
        color: "amber",
        note: "validator는 구간 밖으로 나가거나 해당 구간의 최대액보다 많이 지급하게 만들 수 없습니다.",
      },
    ],
  },
  "sdk-upload": {
    path: "packages/synapse-sdk/src/storage/manager.ts · v2.0.2 excerpt",
    code: managerTs,
    lang: "typescript",
    highlight: [5, 85],
    desc: "실제 Synapse SDK v2.0.2 업로드 흐름 발췌입니다. 기본 두 제공자의 store→pull→commit과 부분 성공 경계를 보여 줍니다.",
    annotations: [
      {
        lines: [5, 16],
        color: "sky",
        note: "기본은 두 사본이며 일부만 성공하면 complete=false입니다.",
      },
      {
        lines: [22, 43],
        color: "emerald",
        note: "원본 바이트는 주 제공자에 한 번 store합니다. 이 단계만으로 on-chain commit은 아닙니다.",
      },
      {
        lines: [47, 83],
        color: "amber",
        note: "보조 제공자는 pull하고, 성공한 context들은 각자 commit을 병렬 실행합니다.",
      },
    ],
  },
};
