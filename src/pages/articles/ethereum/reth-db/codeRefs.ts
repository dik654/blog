import type { CodeRef } from "@/components/code/types";

import tablesRs from "./codebase/reth/tables.rs?raw";
import cursorRs from "./codebase/reth/cursor.rs?raw";
import staticFileRs from "./codebase/reth/static_file.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "db-tables": {
    path: "reth/crates/storage/db/src/tables/mod.rs",
    code: tablesRs,
    lang: "rust",
    highlight: [9, 36],
    desc: "Bundled Storage V1 snapshot: tables! 매크로가 MDBX table의 Key/Value 타입을 선언합니다. Storage V2의 RocksDB·static-file route 전체 목록은 아닙니다.",
    annotations: [
      {
        lines: [11, 16],
        color: "sky",
        note: "블록 데이터 테이블 — Headers, Bodies, Transactions, Receipts",
      },
      {
        lines: [18, 23],
        color: "emerald",
        note: "V1 plain-state tables; Storage V2가 피하는 legacy layout",
      },
      {
        lines: [28, 33],
        color: "amber",
        note: "Trie 테이블 — AccountsTrie, StoragesTrie (상태 루트 계산용)",
      },
    ],
  },
  "db-cursor": {
    path: "reth/crates/storage/db-api/src/cursor.rs",
    code: cursorRs,
    lang: "rust",
    highlight: [8, 21],
    desc: "Bundled MDBX cursor snapshot: seek, walk_range와 write operations를 typed table transaction 안에서 사용하는 흐름입니다. V2의 모든 backend가 B+tree cursor인 것은 아닙니다.",
    annotations: [
      {
        lines: [10, 11],
        color: "sky",
        note: "seek_exact — V1 MDBX의 exact-key lookup",
      },
      {
        lines: [13, 14],
        color: "emerald",
        note: "walk_range — 키 범위 순차 순회",
      },
      {
        lines: [25, 27],
        color: "amber",
        note: "upsert — 있으면 갱신, 없으면 삽입",
      },
    ],
  },
  "db-static-file": {
    path: "reth/crates/storage/provider/src/providers/static_file/mod.rs",
    code: staticFileRs,
    lang: "rust",
    highlight: [14, 24],
    desc: "Bundled static-file snapshot: immutable segments의 path와 coverage를 관리합니다. 현재 segment 종류와 routing은 storage version·node mode에 따라 달라질 수 있습니다.",
    annotations: [
      {
        lines: [11, 14],
        color: "sky",
        note: "immutable data를 mutable table과 분리하는 provider boundary",
      },
      {
        lines: [16, 19],
        color: "emerald",
        note: "path + highest_block — 세그먼트별 관리",
      },
      {
        lines: [22, 26],
        color: "amber",
        note: "bundled version의 segment variants; 현재 전체 목록으로 고정하지 않음",
      },
    ],
  },
};
