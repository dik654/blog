import type { CodeRef } from "@/components/code/types";
import warmStorageSol from "./codebase/filecoin-services/service_contracts/src/FilecoinWarmStorageService.sol?raw";
import filecoinPaySol from "./codebase/filecoin-pay/src/FilecoinPayV1.sol?raw";

export const codeRefs: Record<string, CodeRef> = {
  "dataset-info": {
    path: "filecoin-services/service_contracts/src/FilecoinWarmStorageService.sol",
    code: warmStorageSol,
    lang: "typescript",
    highlight: [12, 25],
    desc: "문제: dataset record가 실제로 어떤 필드로 이루어져 있고, proof·payment가 같은 주문을 가리키는지 어떻게 연결되는지 확인해야 합니다.\n\n해결: FilecoinWarmStorageService.sol의 DataSetInfo struct가 payer/payee/serviceProvider와 pdpRailId(payment 연결점)를 한 record에 묶습니다.",
    annotations: [
      { lines: [13, 13], color: "sky", note: "article의 payment 연결점 — 이 rail ID로 proof와 payment가 같은 주문임을 확인" },
      { lines: [16, 18], color: "emerald", note: "article의 payer/payee/provider — dataset record의 핵심 세 주체" },
      { lines: [23, 24], color: "amber", note: "lifecycle 관련 잔액 — pending fee와 rail lockup의 local mirror" },
    ],
  },
  "period-state": {
    path: "filecoin-services/service_contracts/src/FilecoinWarmStorageService.sol",
    code: warmStorageSol,
    lang: "typescript",
    highlight: [33, 105],
    desc: "문제: Period state의 세 값(판정 전/통과/deadline 놓침)이 실제로 어느 storage 변수와 함수 분기에 대응하는지 확인해야 합니다.\n\n해결: possessionProven이 challenge window 안에서만 provenThisPeriod를 true로 확정하고, nextProvingPeriod가 아직 proven되지 않은 period를 fault로 기록한 뒤 다음 period로 넘어갑니다.",
    annotations: [
      { lines: [54, 57], color: "sky", note: "article의 '판정 전' — NO_PROVING_DEADLINE인 dataset은 proving 자체가 시작 안 됨" },
      { lines: [59, 62], color: "rose", note: "article의 'deadline을 놓침' — challenge window 밖 제출은 revert" },
      { lines: [69, 72], color: "emerald", note: "article의 '통과' — window 안에서만 provenThisPeriod=true로 확정" },
      { lines: [92, 100], color: "amber", note: "다음 period로 넘어갈 때 아직 proven 안 된 period를 fault로 기록" },
    ],
  },
  "rail-settle": {
    path: "filecoin-pay/src/FilecoinPayV1.sol",
    code: filecoinPaySol,
    lang: "typescript",
    highlight: [9, 123],
    desc: "문제: Payment rail의 다섯 장부 항목(Deposit·Operator allowance·Variable rate·Fixed lockup)이 실제로 어떤 struct field이고, 정산이 어떻게 rate*epoch로 계산되는지 확인해야 합니다.\n\n해결: FilecoinPayV1.sol의 Account/Rail/OperatorApproval struct가 다섯 항목을 field로 갖고, settleRail→_settleSegmentGross가 실제 정산 금액을 계산합니다.",
    annotations: [
      { lines: [10, 10], color: "sky", note: "article의 Deposit — payer가 맡겨 둔 실제 잔액" },
      { lines: [24, 24], color: "emerald", note: "article의 Variable rate — epoch당 누적 지급 속도" },
      { lines: [26, 26], color: "amber", note: "article의 Fixed lockup" },
      { lines: [36, 43], color: "violet", note: "article의 Operator allowance — operator가 만들 수 있는 rail의 상한" },
      { lines: [106, 107], color: "rose", note: "article의 'rate가 epoch당 2이고 10 epochs가 proven이면 20' — 정확히 rate*duration" },
      { lines: [110, 120], color: "sky", note: "article의 'open이나 faulted epoch를 곱하지 않는다' — validator(WarmStorageService)가 proof 결과로 정산 구간·금액을 좁힘" },
    ],
  },
};
