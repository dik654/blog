import type { Article } from "../types";

export const zkpSystems2Articles: Article[] = [
  // ── Bulletproofs (투명 셋업, 기초) ──
  {
    slug: "bulletproofs",
    title: "Bulletproofs: 숨긴 숫자가 범위 안임을 증명하는 법",
    subcategory: "zkp-bp-concept",
    sections: [
      { id: "overview", title: "Committed range 전체 지도" },
      { id: "range-proof", title: "Bit range와 aggregation" },
      { id: "inner-product", title: "Inner-product folding" },
      { id: "release", title: "Failure·benchmark·rollback" },
    ],
    component: () => import("@/pages/articles/blockchain/bulletproofs"),
  },

  // ── IOP 계열 ──
  {
    slug: "libiop",
    title: "libiop: 표를 고정하고 일부만 검사하기",
    subcategory: "zkp-iop-concept",
    sections: [
      { id: "overview", title: "먼저 답하기: 표의 모양과 계산 관계" },
      { id: "black-box", title: "긴 표와 짧은 질문" },
      { id: "case", title: "3×4=12인 R1CS 한 행" },
      { id: "encoding", title: "네 값을 여덟 칸으로 확장" },
      { id: "two-checks", title: "코드 구조와 계산 관계 분리" },
      { id: "bcs", title: "Root를 먼저 고정하는 BCS" },
      { id: "proof-size", title: "64칸·4 query·82바이트" },
      { id: "source", title: "실제 wrapper의 두 판정" },
      { id: "release", title: "재현 범위와 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/libiop"),
  },
  {
    slug: "proofofsql",
    title: "Proof of SQL: plan·result·열 commitment를 한 점에서 검증하기",
    subcategory: "zkp-iop-impl",
    sections: [
      { id: "overview", title: "한 문장 답: plan·result·commitments" },
      { id: "black-box", title: "Prover·verifier·application의 입출력" },
      { id: "case", title: "공식 5행 aggregate fixture" },
      { id: "query-relation", title: "Selector로 WHERE·SUM·COUNT 연결" },
      { id: "row-space", title: "5행을 8꼭짓점 공간에 배치" },
      { id: "statement", title: "Transcript가 고정하는 실제 항목" },
      { id: "prove-path", title: "Result에서 sumcheck·opening까지" },
      { id: "proof-shape", title: "Generic opening과 Dory의 위치" },
      { id: "verify-path", title: "Result·sumcheck·opening 세 검사" },
      { id: "failure-boundaries", title: "실행한 test와 로컬 한계" },
      { id: "release", title: "Semantic·snapshot·cost release gate" },
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
    title: "Halo2: 표의 cell을 증명 규칙으로 바꾸는 법",
    subcategory: "zkp-plonk-impl",
    sections: [
      { id: "overview", title: "먼저 답하기: 값 배치와 규칙 강제" },
      { id: "black-box", title: "비공개 표와 전체 규칙" },
      { id: "case", title: "3×4=12와 cur·next rotation" },
      { id: "columns-regions", title: "Gate·copy·instance 연결" },
      { id: "failure-boundaries", title: "빠진 제약마다 생기는 위조" },
      { id: "proof-pipeline", title: "MockProver에서 real proof까지" },
      { id: "profile", title: "Zcash IPA와 KZG fork 구분" },
      { id: "release", title: "Failure matrix와 release" },
    ],
    component: () => import("@/pages/articles/blockchain/halo2"),
  },

  // ── STARK 구현 ──
  {
    slug: "plonky3",
    title: "Plonky3: proof\u00a0bytes만으로는 의미가 정해지지 않는다",
    subcategory: "zkp-stark-impl",
    sections: [
      { id: "overview", title: "한 문장 답: proof와 외부 문맥" },
      { id: "black-box", title: "Prover·verifier·application의 입출력" },
      { id: "case", title: "공식 Fibonacci 8행 trace" },
      { id: "air", title: "첫 행·전이·마지막 행 제약" },
      { id: "config", title: "Field·MMCS·FRI config stack" },
      { id: "prove-path", title: "Trace commit에서 opening까지" },
      { id: "proof-shape", title: "Proof 안과 밖의 문맥" },
      { id: "verify-path", title: "Transcript 재생과 AIR 검증" },
      { id: "failure-boundaries", title: "정상·변조 focused tests" },
      { id: "release", title: "Artifact·security·운영 release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/plonky3"),
  },
];
