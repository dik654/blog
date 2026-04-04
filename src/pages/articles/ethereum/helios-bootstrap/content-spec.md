# helios-bootstrap 섹션별 내용 + Viz 설계

## 섹션 1: Overview (완성됨 — 178줄)
이미 직접 작성 완료.

---

## 섹션 2: FetchCheckpoint — fetch_checkpoint() 내부 추적

### 텍스트 내용 (코드 블록 포함):

#### HTTP 요청 구성
```rust
// consensus/src/consensus.rs — Inner::sync()
pub async fn sync(&mut self) -> Result<()> {
    let checkpoint = self.config.checkpoint
        .unwrap_or(self.config.default_checkpoint);
    // checkpoint = 0x85e6151a246e8fdba36db12f8...

    let resp = self.rpc.get_bootstrap(checkpoint).await?;
    // → GET https://beacon-api.example.com/eth/v1/beacon/light_client/bootstrap/0x85e6...
}
```

#### 응답 구조 — Bootstrap 구조체
```rust
pub struct Bootstrap {
    pub header: BeaconBlockHeader,
    // header.slot = 8,000,000
    // header.state_root = 0xab12..3e4f

    pub current_sync_committee: SyncCommittee,
    // pubkeys: [48B; 512] — 총 24,576바이트
    // aggregate_pubkey: 48B — 512개 합산

    pub current_sync_committee_branch: Vec<B256>,
    // [0x1234.., 0x2345.., 0x3456.., 0x4567.., 0x5678..]
    // 5개 형제 해시 (depth=5, generalized_index=54)
}
```

#### JSON 응답 포맷
```json
{
  "version": "deneb",
  "data": {
    "header": { "beacon": { "slot": "8000000", "state_root": "0xab12..." } },
    "current_sync_committee": { "pubkeys": ["0x8a3f...", ...] },
    "current_sync_committee_branch": ["0x1234...", ...]
  }
}
```

#### SSZ 디코딩
- slot: String → u64 (serde deserialize)
- pubkeys: hex String → [u8; 48]
- branch: hex String → B256

#### committee_branch 검증
```rust
let committee_root = bootstrap.current_sync_committee.tree_hash_root();
// = ssz_hash_tree_root(512개 pubkey) = 0x9f2a..c7e1

let computed_root = merkle::verify_proof(
    committee_root,
    &bootstrap.current_sync_committee_branch,
    54,  // CURRENT_SYNC_COMMITTEE_INDEX
    5,   // depth
);
// level 0: hash(committee_root || branch[0])
// level 1: hash(result || branch[1])
// ...
// = computed_root

assert!(computed_root == bootstrap.header.state_root);
```

#### Store 초기화
```rust
self.store = LightClientStore {
    finalized_header: bootstrap.header.clone(),
    current_sync_committee: bootstrap.current_sync_committee,
    next_sync_committee: None,
    optimistic_header: bootstrap.header.clone(),
    previous_max_active_participants: 0,
    current_max_active_participants: 0,
};
```

### Viz 설계 (6 step):

**Step 0: HTTP 요청 장면**
- 왼쪽: Helios 아이콘 (DataBox "Helios" + checkpoint 해시 0x85e6..)
- 중앙: 화살표가 오른쪽으로 날아감 (motion.line, initial pathLength=0 → 1)
- 화살표 위에 텍스트: "GET /eth/v1/.../bootstrap/0x85e6.."
- 오른쪽: 서버 아이콘 (ModuleBox "Beacon API")
- 아래: 응답이 왼쪽으로 돌아옴 (motion.line, delay=0.5)
- 응답 텍스트: "200 OK — SSZ Bootstrap"

**Step 1: Bootstrap 응답 구조 분해**
- 3개 영역으로 나뉜 카드:
  - 위: "header" 카드 (DataBox) — slot=8000000, state_root=0xab12..
  - 중: "committee" 카드 (ModuleBox) — 512 pubkeys, 24KB
  - 아래: "branch" 카드 (ActionBox) — 5개 해시, depth=5
- 각각 순차 fade-in (delay 0.2씩)

**Step 2: committee_branch Merkle 검증**
- 왼쪽: committee_root = hash(512 pubkeys) = 0x9f2a..
- 중앙: 5단계 해시 체인 (세로로 5개 ActionBox "hash()")
  - 각 단계 옆에 branch[i] 값 표시
  - 아래에서 위로 순차 계산 (motion.g, delay 0.15씩)
- 오른쪽 최상단: computed_root = 0xab12..
- 화살표 → state_root와 비교: "==" 기호 + ✓

**Step 3: Store 초기화**
- LightClientStore 박스 (큰 ModuleBox):
  - 6개 필드가 하나씩 fade-in:
    - finalized_header: slot=8000000 ✓
    - current_sync_committee: 512 pubkeys ✓
    - next_sync_committee: None (회색)
    - optimistic_header: slot=8000000 ✓
    - previous_max_active: 0
    - current_max_active: 0
- 아래: "부트스트랩 완료 — sync loop 시작 준비"

**Step 4: 첫 sync loop 시작**
- Store 박스에서 화살표 → "Beacon API" → "light_client/updates" 요청
- 응답: "LightClientUpdate { slot=8000001, ... }"
- 화살표 → "BLS 검증" (ActionBox) → ✓
- finalized_header 갱신: 8000000 → 8000001
- 아래: "이제 eth_getBalance, eth_call 사용 가능"

**Step 5: 에러 케이스**
- 3가지 에러를 AlertBox로 표시:
  - "CheckpointTooOld" — weak subjectivity 초과 (2주+)
  - "InvalidCommitteeBranch" — Merkle 검증 실패
  - "NetworkMismatch" — genesis_validators_root 불일치
- 각각의 원인과 해결 방법을 sub 텍스트로

---

## 나머지 섹션들은 메인 아티클의 helios-bootstrap.tsx에서
## Overview → FetchCheckpoint 순서로 2개 섹션이 핵심.
## 에이전트가 만든 나머지 7개 섹션(CheckpointSources, WeakSubjectivity 등)은
## Overview에서 이미 깊게 다루고 있으므로 별도 섹션으로 분리할 필요가 줄어듦.
##
## 실제로 필요한 구조:
## 1. Overview — 왜 부트스트랩이 필요한가 (개념, 신뢰 모델, WS, 소스) ← 완성
## 2. FetchCheckpoint — 실제 코드 추적 (HTTP, 응답, 디코딩, 검증, Store 초기화) ← 작성 중
##
## 이 2개 섹션이 기존 9개보다 훨씬 깊음.
## 섹션 수를 늘리는 것이 아니라 각 섹션의 깊이를 늘리는 것이 핵심.
