import type { CodeRef, ProjectMeta } from "@/components/code/types";
import validationRs from "./codebase/reth-v2.8.1/validate/eth.rs?raw";
import stateRs from "./codebase/reth-v2.8.1/pool/state.rs?raw";
import orderingRs from "./codebase/reth-v2.8.1/ordering.rs?raw";
import bestRs from "./codebase/reth-v2.8.1/pool/best.rs?raw";
import addRs from "./codebase/reth-v2.8.1/pool/add.rs?raw";
import maintainRs from "./codebase/reth-v2.8.1/maintain.rs?raw";

export const RETH_TXPOOL_PROJECT_META: Record<string, ProjectMeta> = {
  reth: {
    id: "reth",
    label: "Reth v2.8.1 · Rust",
    badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
  },
};

export const rethTxpoolCodeRefs: Record<string, CodeRef> = {
  "validation-pipeline": {
    path: "reth-v2.8.1/crates/transaction-pool/src/validate/eth.rs",
    code: validationRs,
    lang: "rust",
    highlight: [4, 39],
    desc: "Reth v2.8.1 eth.rs L401–435와 L661–730에서 stateless 검사, provider 획득, stateful 검사와 Valid·Invalid·Error 반환 경계를 연결한 발췌입니다. 중간의 개별 stateless 검사와 긴 주석은 생략했습니다.",
    annotations: [
      { lines: [15, 39], color: "sky", note: "Stateless 통과 뒤 latest state provider를 열고 stateful 검사로 넘깁니다." },
      { lines: [51, 77], color: "amber", note: "Provider 오류와 nonce·balance·blob 오류를 서로 다른 결과로 돌려줍니다." },
      { lines: [89, 109], color: "emerald", note: "Valid 결과에는 검증에 사용한 balance·state nonce와 propagation 정책이 남습니다." },
    ],
  },
  "validation-outcome": {
    path: "reth-v2.8.1/crates/transaction-pool/src/pool/add.rs",
    code: addRs,
    lang: "rust",
    highlight: [4, 58],
    desc: "Reth v2.8.1 pool/mod.rs L571–637의 결과 분기 발췌입니다. Valid만 내부 TxPool 삽입으로 가며 Invalid와 provider Error는 서로 다른 event와 PoolError로 끝납니다. Blob debug assertion과 일부 설명 주석은 줄였습니다.",
    annotations: [
      { lines: [12, 47], color: "emerald", note: "Valid 결과가 sender/nonce ID와 origin을 얻은 뒤 내부 pool로 들어갑니다." },
      { lines: [48, 58], color: "rose", note: "Invalid와 state provider Error는 삽입되지 않습니다." },
    ],
  },
  "subpool-state": {
    path: "reth-v2.8.1/crates/transaction-pool/src/pool/state.rs",
    code: stateRs,
    lang: "rust",
    highlight: [4, 41],
    desc: "Reth v2.8.1 state.rs L3–48과 L143–205의 상태 비트·SubPool 변환 발췌입니다. 네 상태의 긴 doc comment와 queued reason helper는 줄였지만 bit 조건과 변환 실행문은 보존했습니다.",
    annotations: [
      { lines: [15, 32], color: "sky", note: "Nonce·balance·gas·base fee·blob fee 조건을 독립 비트로 보존합니다." },
      { lines: [72, 94], color: "emerald", note: "Pending, Blob, Queued, BaseFee 순서로 실제 subpool을 결정합니다." },
    ],
  },
  "ordering-policy": {
    path: "reth-v2.8.1/crates/transaction-pool/src/ordering.rs",
    code: orderingRs,
    lang: "rust",
    highlight: [6, 39],
    desc: "Reth v2.8.1 ordering.rs L39–85의 실행문을 보존한 축약 발췌입니다. Ordering은 거래 하나의 priority만 계산하며 sender nonce dependency 자체를 해결하지 않습니다.",
    annotations: [
      { lines: [6, 17], color: "sky", note: "Priority는 total order를 제공하는 교체 가능한 정책입니다." },
      { lines: [25, 39], color: "emerald", note: "기본 구현은 현재 base fee에서의 effective tip을 사용합니다." },
    ],
  },
  "sender-head-order": {
    path: "reth-v2.8.1/crates/transaction-pool/src/pool/best.rs",
    code: bestRs,
    lang: "rust",
    highlight: [4, 58],
    desc: "Reth v2.8.1 best.rs L87–120과 L206–248의 sender-head iterator 발췌입니다. Struct 설명을 줄였지만 independent set에서 하나를 꺼내 N+1을 해제하는 실행문은 보존했습니다.",
    annotations: [
      { lines: [9, 20], color: "sky", note: "Pending 전체와 지금 실행 가능한 sender head를 따로 보관합니다." },
      { lines: [28, 45], color: "emerald", note: "가장 높은 priority의 head를 꺼낸 뒤 같은 sender의 다음 nonce만 해제합니다." },
      { lines: [46, 58], color: "amber", note: "현재 거래가 invalid면 descendant도 builder에 내보내지 않습니다." },
    ],
  },
  "reorg-reinjection": {
    path: "reth-v2.8.1/crates/transaction-pool/src/maintain.rs",
    code: maintainRs,
    lang: "rust",
    highlight: [4, 41],
    desc: "Reth v2.8.1 maintain.rs L382–435의 reorg 처리 실행문을 중심으로 줄인 발췌입니다. 새 branch의 mined set을 먼저 반영하고 old-only 거래를 add_external_transactions 경로로 다시 검증합니다.",
    annotations: [
      { lines: [4, 25], color: "amber", note: "Old branch에만 있던 거래와 blob sidecar를 복구 후보로 만듭니다." },
      { lines: [27, 37], color: "sky", note: "새 canonical state와 mined set을 pool에 먼저 적용합니다." },
      { lines: [39, 41], color: "emerald", note: "Old-only 거래는 external admission 경로를 다시 통과합니다." },
    ],
  },
};
