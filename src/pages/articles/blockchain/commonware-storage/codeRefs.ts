import type { CodeRef } from "@/components/code/types";

import lifecycle from "./codebase/commonware/qmdb_lifecycle.rs?raw";
import durability from "./codebase/commonware/qmdb_durability.rs?raw";
import stale from "./codebase/commonware/qmdb_stale.rs?raw";
import mmr from "./codebase/commonware/mmr_mod.rs?raw";
import proof from "./codebase/commonware/current_proof.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "qmdb-lifecycle": {
    path: "storage/src/qmdb/any/mod.rs",
    code: lifecycle,
    lang: "rust",
    highlight: [4, 22],
    desc: "QMDB batch lifecycle — new_batch, write, merkleize, validate, apply, commit. v2026.9.0 공식 module example에 한국어 설명 주석을 붙였습니다.",
    annotations: [
      { lines: [4, 10], color: "sky", note: "Mutation은 먼저 speculative batch에만 쌓입니다." },
      { lines: [12, 15], color: "emerald", note: "merkleize가 candidate root를 계산합니다." },
      { lines: [15, 16], color: "amber", note: "validate_batch가 ancestry를 먼저 확인합니다." },
      { lines: [18, 22], color: "violet", note: "apply와 durable commit은 서로 다른 단계입니다." },
    ],
  },
  "qmdb-durability": {
    path: "storage/src/qmdb/current/db.rs",
    code: durability,
    lang: "rust",
    highlight: [3, 42],
    desc: "Current QMDB durability and apply boundary — commit, sync, validate_batch, apply_batch. v2026.9.0 source의 핵심 메서드입니다.",
    annotations: [
      { lines: [3, 7], color: "sky", note: "commit은 applied journal state를 durable하게 만듭니다." },
      { lines: [9, 19], color: "emerald", note: "sync는 metadata까지 기록해 startup recovery가 필요 없는 경계를 만듭니다." },
      { lines: [21, 28], color: "amber", note: "validate_batch는 handle을 소비하기 전에 stale 여부를 검사합니다." },
      { lines: [30, 42], color: "violet", note: "apply_batch는 visible state와 canonical root를 바꾸지만 별도 durability 단계가 남습니다." },
    ],
  },
  "qmdb-stale": {
    path: "storage/src/qmdb/any/mod.rs · storage/src/qmdb/batch_chain.rs",
    code: stale,
    lang: "rust",
    highlight: [3, 22],
    desc: "Sibling batch rejection — 한 fork를 적용한 뒤 다른 fork는 StaleBatch가 됩니다. v2026.9.0 docs와 source를 연결한 발췌입니다.",
    annotations: [
      { lines: [3, 13], color: "sky", note: "fork_a와 fork_b는 같은 parent를 공유합니다." },
      { lines: [15, 19], color: "emerald", note: "fork_a 적용이 winning prefix를 정합니다." },
      { lines: [20, 22], color: "rose", note: "fork_b는 ancestry가 맞지 않아 StaleBatch로 끝납니다." },
    ],
  },
  "mmr-family": {
    path: "storage/src/merkle/mmr/mod.rs",
    code: mmr,
    lang: "rust",
    highlight: [14, 41],
    desc: "MMR position and location — 11-leaf 구조와 location_to_position. v2026.9.0 source를 설명용으로 발췌했습니다.",
    annotations: [
      { lines: [14, 18], color: "sky", note: "Position은 node post-order index, Location은 leaf 삽입 순서입니다." },
      { lines: [23, 26], color: "emerald", note: "Family가 최대 nodes와 leaves를 제한합니다." },
      { lines: [28, 36], color: "amber", note: "2N-popcount(N)이 leaf location을 node position으로 바꿉니다." },
    ],
  },
  "current-proof": {
    path: "storage/src/qmdb/current/proof/mod.rs",
    code: proof,
    lang: "rust",
    highlight: [3, 32],
    desc: "OperationProof verification — activity bit와 range proof를 모두 확인합니다. v2026.9.0 source에 한국어 설명 주석을 붙였습니다.",
    annotations: [
      { lines: [3, 13], color: "sky", note: "Proof는 loc, bitmap chunk, range proof를 함께 가집니다." },
      { lines: [17, 27], color: "rose", note: "Activity bit가 0이면 현재 값 proof는 즉시 실패합니다." },
      { lines: [28, 31], color: "emerald", note: "Bit가 1이면 operation과 chunk로 expected root를 다시 계산합니다." },
    ],
  },
};
