# helios-types 섹션 재편

기�� 7개 얕은 섹션 → 3개 깊은 섹션.

## 섹션 1: Overview — CL vs EL 타입 체계
- CL: SSZ 인코딩, slot 기반, BeaconBlockHeader 5필드(112B)
- EL: RLP 인코딩, block number 기반, Header 15필드
- Helios가 사용하는 핵심 타입: CL 타입 (EL 타입은 Reth/alloy가 처리)
- 왜 구분이 중요한가: Helios는 CL에서 헤더를 받고, EL에서 상태를 검증

### Viz (2 step):
- Step 0: CL 타입(좌) vs EL 타입(우) 비교 — 인코딩, 필드 수, 크기
- Step 1: Helios 데이터 흐름 — CL 타입(header, committee) → 검증 → EL 타입(account, storage) 접근

## 섹션 2: CoreTypes — 4가지 핵심 구조체
- BeaconBlockHeader: slot, proposer_index, parent_root, state_root, body_root
  → state_root가 모든 상태 증명의 앵���
- SyncAggregate: Bitvector<512> + BLS signature (G2, 96B)
  → 매 슬롯 서명 참여 기록
- LightClientUpdate: attested_header + next_committee + finalized_header + sync_aggregate + signature_slot
  → 7필드, Update Loop의 핵심 메시지
- LightClientStore: finalized_header + optimistic_header + current/next_committee + max_participants
  → Helios의 전체 상태 (Reth의 수백GB 대비 수KB)

### Viz (4 step):
- Step 0: BeaconBlockHeader 5필드 카드 — state_root 강조 (화살표: "모든 증명의 기준")
- Step 1: SyncAggregate — 512비트 격자 + 서명 크기(96B G2)
- Step 2: LightClientUpdate 7필드 — 데이터 흐름으로 연결 (attested→committee→finalized)
- Step 3: LightClientStore — Reth MDBX(700GB 실린더) vs Helios Store(수KB 작은 박스)

## 섹션 3: Encoding — SSZ + Fork + Domain
- SSZ: 고정 크기 필드 연결, 가변 크기는 offset 방식, hash_tree_root → Merkle 트리
- Fork: fork_version(4B) — Bellatrix/Capella/Deneb 구분
- ForkData: genesis_validators_root + fork_version → 네트워크 식별
- Domain: domain_type(4B) + fork_data_root(28B) → 서명 도메인 분리
- 왜 중요: 포크 간 서명 재사용 방지, 네트워크 혼동 방지

### Viz (3 step):
- Step 0: SSZ 인코딩 — BeaconBlockHeader의 5필드를 32B 청크로 분해 → hash_tree_root
- Step 1: Fork 버전 타임라인 — Bellatrix → Capella → Deneb 전환 + 각 버전 번호
- Step 2: Domain 합성 — domain_type + fork_data_root → domain (32B) → signing_root에 사용
