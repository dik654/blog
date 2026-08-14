import type { Article } from "../types";

export const filecoin2Articles: Article[] = [
  /* ── 저장 증명 ── */
  {
    slug: "filecoin-proofs",
    title: "Filecoin 저장 증명 개요: PoRep & PoSt",
    subcategory: "fil-proofs",
    sections: [
      { id: "overview", title: "Claim에서 API receipt까지" },
      { id: "proof-profile", title: "Proof-type API router" },
      { id: "phase-envelope", title: "Phase output envelope" },
      { id: "verification-router", title: "Verifier proof-byte router" },
      { id: "release-gate", title: "Stack release matrix" },
    ],
    component: () => import("@/pages/articles/blockchain/filecoin-proofs"),
  },
  {
    slug: "proofs-porep",
    title: "PoRep 봉인 파이프라인 심층 (PC1→PC2→C1→C2)",
    subcategory: "fil-proofs",
    sections: [
      { id: "overview", title: "한 sector의 PoRep artifact chain" },
      { id: "pc1-artifact", title: "PC1 ReplicaID·labels" },
      { id: "pc2-artifact", title: "PC2 replica·commitments" },
      { id: "commit-receipt", title: "C1/C2 proof receipt" },
      { id: "release-gate", title: "Parity·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/proofs-porep"),
  },
  {
    slug: "proofs-post",
    title: "PoSt 심층: WindowPoSt vs WinningPoSt",
    subcategory: "fil-proofs",
    sections: [
      { id: "overview", title: "두 PoSt의 서로 다른 책임" },
      { id: "window-deadline", title: "WindowPoSt deadline receipt" },
      { id: "winning-election", title: "WinningPoSt election receipt" },
      { id: "submission-state", title: "Reorg-aware submission state" },
      { id: "release-gate", title: "Deadline release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/proofs-post"),
  },
  {
    slug: "proofs-snark",
    title: "Filecoin SNARK: Groth16 & GPU 가속",
    subcategory: "fil-proofs",
    sections: [
      { id: "overview", title: "Assignment에서 batch proof까지" },
      { id: "assignment-artifact", title: "Assignment·density artifact" },
      { id: "prover-dispatch", title: "Native·GPU prover dispatch" },
      { id: "supraseal-boundary", title: "SupraSeal FFI boundary" },
      { id: "release-gate", title: "Parity·release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/proofs-snark"),
  },

  /* ── 핫스토리지 ── */
  {
    slug: "filecoin-pdp",
    title: "PDP: Proof of Data Possession (핫스토리지 검증)",
    subcategory: "fil-hot",
    sections: [
      { id: "overview", title: "PDP가 증명하는 범위" },
      { id: "dataset-artifact", title: "Dataset logical-array artifact" },
      { id: "challenge-proof", title: "Challenge·Merkle receipt" },
      { id: "period-state", title: "Proving-period fault state" },
      { id: "release-gate", title: "Contract·provider release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/filecoin-pdp"),
  },
  {
    slug: "filecoin-storacha",
    title: "Storacha: 탈중앙 핫스토리지 네트워크",
    subcategory: "fil-hot",
    sections: [
      { id: "overview", title: "Capability에서 retrieval까지" },
      { id: "space-authorization", title: "Space·UCAN capability" },
      { id: "blob-upload", title: "Blob effect receipt chain" },
      { id: "index-retrieval", title: "Sharded DAG index" },
      { id: "release-gate", title: "Filecoin·service release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/filecoin-storacha"),
  },
  {
    slug: "filecoin-onchain-cloud",
    title: "Filecoin Onchain Cloud 플랫폼",
    subcategory: "fil-hot",
    sections: [
      { id: "overview", title: "Upload에서 정산까지" },
      { id: "dataset-service", title: "Dataset service artifact" },
      { id: "proof-settlement", title: "Proof-gated settlement" },
      { id: "payment-rail", title: "Payment rail·lockup" },
      { id: "release-gate", title: "Service release gate" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/filecoin-onchain-cloud"),
  },

  /* ── 네트워크 인프라 ── */
  {
    slug: "ipfs-filecoin-storage",
    title: "IPFS & Filecoin 연동",
    subcategory: "fil-infra",
    sections: [
      { id: "overview", title: "같은 content, 다른 보장" },
      { id: "identity-map", title: "CID·CAR·Piece identity map" },
      { id: "retrieve-path", title: "Verified retrieval router" },
      { id: "retention", title: "Pin·deal·proof receipt" },
      { id: "release-gate", title: "End-to-end release gate" },
    ],
    component: () =>
      import("@/pages/articles/blockchain/ipfs-filecoin-storage"),
  },
  {
    slug: "filecoin-ipc",
    title: "IPC: InterPlanetary Consensus 서브넷",
    subcategory: "fil-infra",
    sections: [
      { id: "overview", title: "Parent↔child 비대칭 경로" },
      { id: "subnet-artifact", title: "Subnet boot artifact" },
      { id: "topdown", title: "Parent finality·top-down" },
      { id: "bottomup", title: "Bottom-up checkpoint" },
      { id: "release-gate", title: "Cross-network release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/filecoin-ipc"),
  },
  {
    slug: "filecoin-fvm",
    title: "FVM: Filecoin Virtual Machine",
    subcategory: "fil-infra",
    sections: [
      { id: "overview", title: "Message에서 state root까지" },
      { id: "message-envelope", title: "Message execution envelope" },
      { id: "state-commit", title: "Transactional state receipt" },
      { id: "actor-bundle", title: "Network version·actor manifest" },
      { id: "release-gate", title: "Execution release gate" },
    ],
    component: () => import("@/pages/articles/blockchain/filecoin-fvm"),
  },
];
