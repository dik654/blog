# helios-state 섹션별 내용 + Viz 설계

## 핵심 함수: verify_account_proof() + verify_storage_proof()
기존 7개 얕은 섹션 → 3개 깊은 섹션으로 재편.

---

## 섹션 1: Overview — 왜 상태 증명이 필요한가

### 텍스트 내용:

#### 풀 노드 vs 경량 클라이언트의 상태 접근
Reth: 로컬 700GB+ DB에서 직접 읽기 → 즉시 응답, 신뢰 불필요.
Helios: 상태 없음. RPC에 요청 + Merkle 증명 요구 → 증명 검증 → 값 확인.

💡 핵심: "프로바이더를 신뢰하지 않으면서 프로바이더의 데이터를 사용한다."
Merkle-Patricia 증명이 데이터가 state_root에 속함을 수학적으로 증명.

#### EIP-1186: eth_getProof 표준
eth_getProof(address, storageKeys, blockNumber) 응답:
- accountProof: 상태 트라이 Merkle 노드 배열
- storageProof: 스토리지 트라이 Merkle 노드 배열
- balance, nonce, codeHash, storageHash

#### Reth와 비교
| 항목 | Reth | Helios |
|------|------|--------|
| 상태 저장 | 로컬 700GB+ | 없음 |
| 접근 | DB 직접 읽기 | RPC + Merkle 증명 |
| 구현 | StateProvider trait | ProofDB (revm Database) |

### Viz 설계 (3 step):

**Step 0: Reth vs Helios 상태 접근**
- Reth: [eth_getBalance] → [DB 실린더] → [값] (직접)
- Helios: [eth_getBalance] → [RPC] → [응답+증명] → [Merkle 검증] → [값]

**Step 1: EIP-1186 응답 구조**
- 3 카드: accountProof(노드 배열), storageProof(key+value+proof), account 필드(4개)

**Step 2: 신뢰 모델**
- [RPC] → "거짓일 수 있음" → [Merkle 검증] → [✓/✗]
- "state_root는 finalized_header에서 — BLS 검증 완료"

---

## 섹션 2: ProofTrace — 계정 + 스토리지 증명 코드 추적

### 텍스트 내용:

#### verify_account_proof() 3단계

단계 1: 주소 → 트라이 경로
- path = keccak256(address)
- 왜 해시: 트라이 균형 유지 (주소 분포 편향되어도 해시가 균등)

단계 2: Merkle 검증
- verify_proof(account_proof, state_root, path) → encoded
- account_proof: 루트→리프 경로의 중간 노드들
- 검증: 각 노드 해시가 부모 참조와 일치 → 리프 도달

💡 Merkle-Patricia Trie 내부:
- Branch node: 16개 자식 + 값 (분기점)
- Extension node: 공통 경로 압축 (경로 단축)
- Leaf node: 나머지 경로 + 값 (최종)

단계 3: RLP 디코딩
- encoded → Account { nonce, balance, storage_root, code_hash }
- RLP: 이더리움 표준 직렬화

#### verify_storage_proof() — 중첩 트라이

계정 증명 → storage_root 획득 → 이것이 스토리지 트라이의 루트.
"트라이 안의 트라이" 2단계 구조.

storage_path = keccak256(storage_key)
value = verify_proof(storage_proof, storage_root, storage_path) → RLP decode → U256

💡 왜 2단계: 1단계에서 storage_root를 검증, 2단계에서 그 루트 아래 슬롯 검증.
공격자가 가짜 storage_root → 1단계에서 차단.

💡 Reth 비교: StateProvider trait로 직접 읽기, 2단계 불필요.

### Viz 설계 (5 step):

**Step 0: 주소 → 경로** — keccak256 변환 시각화
**Step 1: MPT 검증** — 트라이 경로 (root → branch → extension → leaf) + 해시 일치 확인
**Step 2: RLP 디코딩** — 바이트 → 4필드 분해 애니메이션
**Step 3: 중첩 트라이** — state trie → account → storage_root → storage trie → value
**Step 4: 전체 파이프라인** — eth_getBalance 요청 → 검증 → 응답 + 시간 비교

---

## 섹션 3: ProofDB — 캐싱과 에러

### 텍스트 내용:

#### ProofDB 패턴
revm의 Database trait 구현. EVM이 상태 접근 → ProofDB가 증명 요청+검증.

#### 캐싱
캐시 키: (address, block_number). 같은 블록 내 캐시 히트. 블록 변경 시 무효화.

#### 에러 3가지
1. ProofMissing — 비표준 프로바이더
2. MerkleMismatch — 악의적 프로바이더
3. RlpDecodeError — 유효하지 않은 리프 데이터

### Viz 설계 (2 step):

**Step 0: ProofDB 흐름** — EVM → ProofDB → RPC (캐시 히트 시 생략) → 검증 → EVM 반환
**Step 1: 에러 3가지** — AlertBox + 발생 지점 표시
