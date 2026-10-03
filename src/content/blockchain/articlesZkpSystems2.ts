import type { Article } from "../types";

export const zkpSystems2Articles: Article[] = [
  // ── Bulletproofs (투명 셋업, 기초) ──
  {
    slug: "bulletproofs",
    title: "Bulletproofs: 투명 셋업 범위 증명 (Inner Product Argument)",
    subcategory: "zkp-bp-concept",
    sections: [
      { id: "overview", title: "Committed range 전체 지도" },
      { id: "inner-product", title: "Inner-product folding" },
      { id: "range-proof", title: "Bit range와 aggregation" },
      { id: "release", title: "Failure·benchmark·rollback" },
    ],
    component: () => import("@/pages/articles/blockchain/bulletproofs"),
  },

  // ── IOP 계열 ──
  {
    slug: "libiop",
    title: "libiop: R1CS oracle reduction과 BCS transcript",
    subcategory: "zkp-iop-concept",
    sections: [
      { id: "overview", title: "R1CS에서 encoded oracle까지" },
      { id: "r1cs-iop", title: "R1CS·code·proximity profile" },
      { id: "bcs", title: "Commit-first BCS artifact" },
      { id: "release", title: "Protocol profile·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/libiop"),
  },
  {
    slug: "proofofsql",
    title: "Proof of SQL: query relation·snapshot·sumcheck·Dory",
    subcategory: "zkp-iop-impl",
    sections: [
      { id: "overview", title: "Committed SELECT의 입구" },
      { id: "query-relation", title: "SQL arithmetization과 sumcheck" },
      { id: "table-commitment", title: "Snapshot과 Dory opening" },
      { id: "verification", title: "Statement transcript" },
      { id: "release", title: "Correctness·cost release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/proofofsql"),
  },

  // ── Folding (재귀 증명) ──
  {
    slug: "nova",
    title: "Nova: 계산을 접고 반복 실행을 잇는 방법",
    subcategory: "zkp-nova-concept",
    sections: [{"id": "overview", "title": "1. 긴 계산을 이어 갈 때 지난 검사를 다시 쌓지 않으려면"}, {"id": "black-box", "title": "2. 이전 과제와 새 과제를 하나의 같은 형식으로 만듭니다"}, {"id": "case", "title": "3. 3×4=12와 2×5=10을 두 배로 섞습니다"}, {"id": "picture", "title": "4. 없애려던 차이를 별도 항으로 정확히 기록합니다"}, {"id": "ivc", "title": "5. 실행을 이어 붙이는 조건은 별도로 필요합니다"}, {"id": "names", "title": "6. 완화된 등식·폴딩·누적 실행을 구별합니다"}, {"id": "relaxed-r1cs", "title": "7. 곱을 전개하면 교차항이 왜 필요한지 드러납니다"}, {"id": "source", "title": "8. 원문의 배율·오차 갱신이 같은 숫자를 보존합니다"}, {"id": "compression-security", "title": "9. 폴딩 후 남은 확인 과제를 마지막 증거로 만듭니다"}, {"id": "release", "title": "10. 상태가 이어지고 가정이 유지되는지 마지막까지 확인합니다"}],
    component: () => import("@/pages/articles/blockchain/nova"),
  },

  // ── PLONK 구현 ──
  {
    slug: "halo2",
    title: "Halo2: columns·regions·IPA profile (zcash/halo2)",
    subcategory: "zkp-plonk-impl",
    sections: [
      { id: "overview", title: "한 row에서 proof까지" },
      { id: "columns-regions", title: "Columns·regions·rotations" },
      { id: "proof-pipeline", title: "Keygen·prove·verify profile" },
      { id: "release", title: "Underconstraint·migration gate" },
    ],
    component: () => import("@/pages/articles/blockchain/halo2"),
  },

  // ── STARK 구현 ──
  {
    slug: "plonky3",
    title: "Plonky3: generic STARK config과 proof artifact",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "Fibonacci AIR에서 stack까지" },
      { id: "config", title: "Field·MMCS·FRI generic config" },
      { id: "pipeline", title: "Trace·AIR·config·proof binding" },
      { id: "release", title: "Native parity·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/plonky3"),
  },
];
