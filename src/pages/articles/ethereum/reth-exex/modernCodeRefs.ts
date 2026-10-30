import type { CodeRef } from "@/components/code/types";
import notification from "./codebase/reth-v2.8.1/notification.rs?raw";
import managerDelivery from "./codebase/reth-v2.8.1/manager-delivery.rs?raw";
import finishedHeight from "./codebase/reth-v2.8.1/finished-height.rs?raw";
import restartCatchup from "./codebase/reth-v2.8.1/restart-catchup.rs?raw";

export const rethExExCodeRefs: Record<string, CodeRef> = {
  "exex-notification": {
    path: "reth-v2.8.1/crates/exex/types/src/notification.rs",
    code: notification,
    lang: "rust",
    highlight: [4, 32],
    desc: "Commit은 새 구간, revert는 취소할 구간, reorg는 old와 new 구간을 함께 전달합니다.",
    annotations: [
      { lines: [5, 15], color: "sky", note: "세 variant가 canonical 변화의 모양을 보존합니다." },
      { lines: [18, 32], color: "amber", note: "Consumer는 committed와 reverted 구간을 따로 꺼내 순서대로 적용할 수 있습니다." },
    ],
  },
  "manager-delivery": {
    path: "reth-v2.8.1/crates/exex/exex/src/context.rs + manager.rs",
    code: managerDelivery,
    lang: "rust",
    highlight: [4, 36],
    desc: "Manager의 전달 완료는 capacity-1 ExEx channel에 보냈다는 뜻이며, 파생 DB commit 완료를 뜻하지 않습니다.",
    annotations: [
      { lines: [4, 7], color: "rose", note: "Node가 말하는 delivered의 정확한 경계입니다." },
      { lines: [9, 15], color: "amber", note: "Manager buffer와 ExEx별 channel은 서로 다른 두 queue입니다." },
      { lines: [17, 31], color: "sky", note: "Reorg·revert는 finished height 아래여도 건너뛰지 않습니다." },
      { lines: [33, 36], color: "emerald", note: "모든 ExEx에 보낸 항목만 공용 buffer에서 제거합니다." },
    ],
  },
  "finished-height": {
    path: "reth-v2.8.1/crates/exex/exex/src/event.rs + manager.rs",
    code: finishedHeight,
    lang: "rust",
    highlight: [4, 32],
    desc: "FinishedHeight는 durable progress와 과거 블록 불필요 조건을 함께 알리고, WAL 정리는 canonical hash와 finalized header를 추가로 확인합니다.",
    annotations: [
      { lines: [4, 9], color: "sky", note: "Reorg에서는 extension의 완료 위치가 뒤로 갈 수 있습니다." },
      { lines: [11, 20], color: "amber", note: "공통 완료 높이는 모든 ExEx 중 가장 느린 number입니다." },
      { lines: [22, 32], color: "emerald", note: "WAL boundary는 canonical hash 확인 뒤 ExEx와 consensus finality의 최솟값입니다." },
    ],
  },
  "restart-catchup": {
    path: "reth-v2.8.1/crates/exex/exex/src/notifications.rs",
    code: restartCatchup,
    lang: "rust",
    highlight: [5, 36],
    desc: "Persisted ExExHead를 기준으로 canonicality를 확인하고 빠진 구간을 backfill한 뒤, 그동안 도착한 live notification을 이어서 전달합니다.",
    annotations: [
      { lines: [8, 14], color: "rose", note: "저장된 head가 비canonical이면 WAL에서 역 notification을 만듭니다." },
      { lines: [16, 21], color: "sky", note: "뒤처진 canonical 구간은 node DB에서 backfill합니다." },
      { lines: [23, 31], color: "amber", note: "Backfill 중 live reorg와 이후 구간을 버리지 않고 따로 보관합니다." },
      { lines: [33, 36], color: "emerald", note: "Backfill 이후 pending notification을 먼저 비운 뒤 regular stream으로 돌아갑니다." },
    ],
  },
};

export const RETH_EXEX_PROJECT_META = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
} as const;
