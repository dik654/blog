import type { CodeRef } from "@/components/code/types";

import providerRs from "./codebase/reth/provider.rs?raw";
import bundleStateRs from "./codebase/reth/bundle_state.rs?raw";
import changesetsRs from "./codebase/reth/changesets.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "provider-trait": {
    path: "reth/crates/storage/provider/src/providers/state/latest.rs",
    code: providerRs,
    lang: "rust",
    highlight: [10, 18],
    desc: "Bundled snapshot: state provider가 account·storage·bytecode 조회를 같은 state view로 묶는 방식을 보여줍니다. 정확한 trait surface와 physical route는 Reth 버전·storage layout에 따라 달라질 수 있습니다.",
    annotations: [
      {
        lines: [10, 18],
        color: "sky",
        note: "Bundled version의 state lookup capability",
      },
      {
        lines: [22, 25],
        color: "emerald",
        note: "latest state view를 고정하는 provider wrapper",
      },
      {
        lines: [28, 33],
        color: "amber",
        note: "V1 snapshot의 plain-state lookup; V2의 보편 route가 아님",
      },
    ],
  },
  "bundle-state": {
    path: "reth/crates/revm/src/state/bundle_state.rs",
    code: bundleStateRs,
    lang: "rust",
    highlight: [10, 19],
    desc: "BundleState — revm 블록 실행 결과의 상태 변경 캐시. DB 커밋 전까지 메모리에서 빠르게 읽기 가능.",
    annotations: [
      { lines: [12, 13], color: "sky", note: "state — 변경된 계정 HashMap" },
      {
        lines: [14, 15],
        color: "emerald",
        note: "reverts — reorg용 되돌리기 정보",
      },
      {
        lines: [33, 38],
        color: "amber",
        note: "from_revm() — revm 결과를 Reth 타입으로 변환",
      },
    ],
  },
  "changeset-tables": {
    path: "reth/crates/storage/db/src/tables/mod.rs",
    code: changesetsRs,
    lang: "rust",
    highlight: [8, 20],
    desc: "Bundled V1 snapshot: MDBX changeset tables를 이용한 historical reconstruction입니다. Storage V2는 history indices를 RocksDB, account·storage changesets를 static files로 routing합니다.",
    annotations: [
      {
        lines: [8, 13],
        color: "sky",
        note: "AccountChangeSets — 계정 변경 전 값 테이블",
      },
      {
        lines: [16, 20],
        color: "emerald",
        note: "StorageChangeSets — 스토리지 변경 전 값 테이블",
      },
      {
        lines: [25, 32],
        color: "amber",
        note: "HistoricalStateProviderRef — 역추적 Provider",
      },
      {
        lines: [36, 48],
        color: "violet",
        note: "account() — ChangeSet 역순 순회로 과거 값 복원",
      },
    ],
  },
};
