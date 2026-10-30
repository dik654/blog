import type { CodeRef } from "@/components/code/types";
import stateCopyRaw from "./codebase/prysm/beacon-chain/state/state-native/state_copy.go?raw";
import balanceUpdateRaw from "./codebase/prysm/beacon-chain/state/state-native/balance_update.go?raw";
import stateRootRaw from "./codebase/prysm/beacon-chain/state/state-native/state_root.go?raw";
import fieldTrieRaw from "./codebase/prysm/beacon-chain/state/fieldtrie/recompute.go?raw";
import altairUpgradeRaw from "./codebase/prysm/beacon-chain/core/altair/upgrade.go?raw";

export const beaconStateCodeRefs: Record<string, CodeRef> = {
  "state-copy": {
    path: "beacon-chain/state/state-native/state_trie.go — Copy()",
    lang: "go",
    code: stateCopyRaw,
    highlight: [15, 42],
    desc: "Prysm v7.3.1은 큰 field와 FieldTrie를 공유 가능한 view로 복사하고 새 state ID를 부여합니다.",
    annotations: [
      { lines: [15, 21], color: "sky", note: "큰 collection은 복사 시점에 같은 multi-value container를 가리킵니다." },
      { lines: [23, 26], color: "amber", note: "새 view는 자신의 dirty field·index와 trie map을 갖습니다." },
      { lines: [29, 33], color: "emerald", note: "새 state ID를 공유 값의 독자로 등록합니다." },
      { lines: [40, 42], color: "violet", note: "FieldTrie도 CopyTrie로 별도 view를 만듭니다." },
    ],
  },
  "balance-update": {
    path: "setters_validator.go + multi_value_slice.go — UpdateBalancesAtIndex()",
    lang: "go",
    code: balanceUpdateRaw,
    highlight: [5, 18],
    desc: "한 state view의 balance만 바꾸고 Balances field와 element index를 dirty로 기록합니다.",
    annotations: [
      { lines: [9, 11], color: "sky", note: "Multi-value slice가 이 state ID에 해당하는 값을 분리합니다." },
      { lines: [16, 17], color: "amber", note: "Field 전체와 실제 element index를 함께 기록합니다." },
      { lines: [26, 34], color: "rose", note: "범위를 벗어난 index는 거부하고 원본·추가 구간을 구분합니다." },
    ],
  },
  "state-root": {
    path: "beacon-chain/state/state-native/state_trie.go — HashTreeRoot()",
    lang: "go",
    code: stateRootRaw,
    highlight: [4, 30],
    desc: "Dirty field root를 다시 계산한 뒤 top-level Merkle path만 올려 새 BeaconState root를 얻습니다.",
    annotations: [
      { lines: [8, 16], color: "sky", note: "초기 layer가 없으면 만들고 dirty field를 반영한 최상위 root를 반환합니다." },
      { lines: [19, 29], color: "emerald", note: "각 dirty field의 새 root를 leaf에 넣고 그 field의 조상 path만 갱신합니다." },
      { lines: [33, 46], color: "violet", note: "FieldTrie가 element-level dirty index를 받아 field root를 만들고 목록을 비웁니다." },
    ],
  },
  "field-trie-recompute": {
    path: "beacon-chain/state/fieldtrie/field_trie.go — RecomputeTrie()",
    lang: "go",
    code: fieldTrieRaw,
    highlight: [4, 23],
    desc: "공유 중인 FieldTrie는 먼저 fork한 뒤 dirty element를 packed chunk 좌표로 바꿔 갱신합니다.",
    annotations: [
      { lines: [8, 10], color: "sky", note: "중복 element index를 먼저 제거합니다." },
      { lines: [15, 18], color: "amber", note: "공유 trie는 원본을 건드리지 않고 overlay를 분기합니다." },
      { lines: [25, 48], color: "emerald", note: "CompressedArray는 element index를 chunk index로 바꾸고 중복 chunk를 합칩니다." },
    ],
  },
  "altair-upgrade": {
    path: "beacon-chain/core/altair/upgrade.go — UpgradeToAltair()",
    lang: "go",
    code: altairUpgradeRaw,
    highlight: [8, 67],
    desc: "Fork upgrade는 공통 field를 옮기고 새 field를 초기화한 뒤 participation과 sync committee를 계산합니다.",
    annotations: [
      { lines: [12, 16], color: "sky", note: "이전·현재 fork version과 activation epoch를 새 state에 기록합니다." },
      { lines: [17, 34], color: "emerald", note: "공통 field를 보존하면서 Altair 새 field를 validator 수에 맞춰 초기화합니다." },
      { lines: [49, 56], color: "amber", note: "과거 attestation을 participation bits로 번역합니다." },
      { lines: [57, 65], color: "violet", note: "현재·다음 sync committee는 helper 계산 결과로 채웁니다." },
    ],
  },
};
