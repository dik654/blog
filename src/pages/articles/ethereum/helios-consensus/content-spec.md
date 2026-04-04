# helios-consensus 섹션별 내용 + Viz 설계

## 핵심 함수: verify_sync_committee_sig()
모든 섹션이 이 함수의 내부를 따라가는 구조.
verify.rs → 5단계: 필터링 → 정족수 → 합산 → signing_root → 페어링 비교

---

## 섹션 1: Overview — 왜 BLS 검증인가

### 텍스트 내용:

#### 풀 노드 vs 경량 클라이언트의 블록 검증
풀 노드(Reth)는 블록을 받으면 모든 트랜잭션을 실행해서 state_root를 재계산한다.
수억 개 TX를 하나하나 EVM에서 돌린다. 결과가 헤더와 일치해야 유효.
이 방식은 완벽하지만 비용이 크다 — CPU, 디스크, 시간.

경량 클라이언트(Helios)는 블록을 실행하지 않는다.
대신 "이 블록이 정말 합의된 블록인가?"만 확인한다.
방법: 512명의 Sync Committee가 매 슬롯마다 서명한 BLS 집계 서명을 검증.

#### 왜 512명인가
이더리움 전체 검증자는 100만 명 이상.
전원의 서명을 검증하면 경량 클라이언트의 의미가 없다.
Sync Committee는 "검증자 전체를 대표하는 소규모 위원회":
- 512명 무작위 선출 (RANDAO 시드 기반)
- 256 에폭(~27시간)마다 교체
- 전체 검증자의 32ETH stake를 대표하므로 슬래싱 보장 유지

#### 검증 함수 전체 흐름
verify_sync_committee_sig()의 5단계:
1. 참여 비트맵 필터링 — 512명 중 실제 서명한 사람만 추출
2. 정족수 확인 — 참여자가 2/3 이상인지
3. 집계 공개키 합산 — 참여자의 G1 점을 모두 더함
4. signing_root 계산 — 헤더 SSZ + 도메인 결합
5. 페어링 비교 — e(agg_pk, H(m)) == e(G, sig)

#### Reth와 비교
| 항목 | Reth (풀 노드) | Helios (경량) |
|------|----------------|---------------|
| 블록 검증 | TX 전체 실행 | BLS 서명 1회 검증 |
| 검증 대상 | 모든 검증자 | 512명 위원회 |
| 상태 접근 | 로컬 DB 직접 읽기 | Merkle 증명 |
| 비용 | 높음 (CPU+디스크) | 낮음 (수학 연산) |
| 보안 가정 | 없음 (자체 검증) | 위원회 정직 다수 |

### Viz 설계 (3 step):

**Step 0: 왜 — 풀 노드 vs 경량 클라이언트**
- 왼쪽: Reth 박스 → "모든 TX 실행" → state_root 재계산 → "✓ 일치"
  - 아래: "수억 TX, 수일 소요, 700GB"
- 오른쪽: Helios 박스 → "BLS 서명 검증" → "✓ 서명 유효"
  - 아래: "1회 페어링, 수 ms, ~0 디스크"
- 둘 다 결과는 "블록 헤더 신뢰" — 같은 목표, 다른 경로

**Step 1: 어떻게 — verify 함수 5단계 파이프라인**
- 수평 파이프라인 (왼→오):
  - [512 bits] → 필터 → [참여 PK] → 합산 → [agg_pk] → signing_root → [root] → pairing → [✓/✗]
  - 각 노드 사이에 데이터 흐름 화살표
  - 각 단계 아래에 "→ 섹션 N에서 상세"

**Step 2: 512명 위원회의 의미**
- 위: 100만+ 검증자 점(dot) 구름 (많은 작은 원)
- 화살표 → 아래: "RANDAO로 512명 선출"
- 아래: 512개 점 격자 (일부 밝게 = 참여, 일부 어둡게 = 미참여)
- 우측: "256 에폭(~27h)마다 교체" 타이머 아이콘

---

## 섹션 2: FetchCheckpoint 대신 → 직접 verify_sync_committee_sig() 추적

### 기존 섹션 구조 (9개 → 통합 3개):
기존 9개 얕은 섹션을 다음 3개 깊은 섹션으로 재편:
1. Overview (위)
2. VerifyTrace — verify 함수 5단계 코드 추적 (가장 핵심)
3. CommitteeLifecycle — 위원회 교체 + 핸드오프

---

## 섹션 2: VerifyTrace — verify 함수 5단계 코드 추적

### 텍스트 내용:

#### 단계 1: 참여 비트맵 필터링
```rust
let participants: Vec<&G1Affine> = pks
    .iter().zip(bits.iter())
    .filter(|(_, bit)| *bit)
    .map(|(pk, _)| pk)
    .collect();
```
- `pks`: 512개 BLS 공개키 (각 48바이트, G1 곡선 위의 점)
  - 부트스트랩에서 받은 current_sync_committee.pubkeys
- `bits`: Bitvector<512> — 512비트 비트맵
  - 비트가 1이면 해당 검증자가 이번 슬롯에 서명함
  - 예: [1,0,1,1,0,...] → 0번, 2번, 3번 참여
- `participants`: 실제 서명에 참여한 공개키만 모은 벡터
  - 보통 480~510개 (95%+ 참여율이 일반적)

💡 **왜 전원이 참여하지 않는가:**
네트워크 지연, 노드 다운타임, 자발적 오프라인 등.
100% 참여는 비현실적이므로 2/3 정족수를 기준으로 삼음.

#### 단계 2: 정족수 확인
```rust
if participants.len() * 3 < pks.len() * 2 {
    return false;  // 2/3 미만이면 거부
}
```
- `participants.len() * 3 < 512 * 2` → `< 341.3`이면 실패
- 즉 최소 342명(66.8%) 이상 참여해야 유효
- **왜 2/3인가:** Casper FFG의 안전성 보장과 동일한 임계값
  - 1/3 이하의 악의적 검증자가 있어도 안전
  - 이 임계값은 비잔틴 장애 허용(BFT)의 수학적 한계

💡 **Reth 비교:** Reth는 정족수 검사가 불필요.
블록을 직접 실행하므로 "누가 서명했는지"가 아니라 "실행 결과가 맞는지"가 기준.

#### 단계 3: 집계 공개키 합산
```rust
let agg_pk = participants.iter()
    .fold(G1Affine::identity(), |acc, pk| acc + *pk);
```
- G1Affine::identity(): 타원곡선 항등원 (무한원점)
- 각 참여자의 G1 점을 순차적으로 더함
  - 타원곡선 점 덧셈 (field 연산, modular arithmetic)
- 결과: 단일 48바이트 G1 점 = agg_pk

💡 **왜 합산이 가능한가 — BLS의 핵심 속성:**
BLS 서명은 선형(linear)이다.
- 개별 서명: sig_i = sk_i · H(m)
- 집계 서명: sig = Σ sig_i = (Σ sk_i) · H(m)
- 집계 공개키: agg_pk = Σ pk_i = (Σ sk_i) · G
- 따라서 개별 검증 512회 = 집계 검증 1회
- 이 선형성 덕분에 경량 클라이언트가 가능

#### 단계 4: signing_root 계산
```rust
let domain = compute_domain(DOMAIN_SYNC_COMMITTEE, fork_version);
let root = compute_signing_root(header, domain);
```
- `DOMAIN_SYNC_COMMITTEE`: 0x07000000 — Sync Committee 전용 도메인 타입
  - 도메인 분리: 같은 키로 다른 목적의 서명을 혼동하지 않도록
  - 다른 도메인: DOMAIN_BEACON_PROPOSER (0x00), DOMAIN_BEACON_ATTESTER (0x01) 등
- `fork_version`: 현재 포크의 4바이트 식별자 (예: Deneb = 0x04000000)
  - 포크 간 서명 재사용 방지 (replay protection)
- `compute_domain()`:
  - domain = fork_version + genesis_validators_root[:28]
  - 네트워크(메인넷/세폴리아)마다 다른 값 → 크로스체인 리플레이 방지
- `compute_signing_root()`:
  - root = hash_tree_root(SigningData { object_root: header.tree_hash_root(), domain })
  - SSZ 직렬화 후 해시 → 서명 대상 메시지

💡 **왜 도메인 분리가 중요한가:**
없으면 공격자가 Beacon proposer용 서명을 Sync Committee 서명으로 재사용 가능.
도메인 + 포크버전 + genesis_validators_root 결합으로 3중 보호.

#### 단계 5: 페어링 비교
```rust
let h_m = hash_to_g2(&root);      // signing_root → G2 점으로 매핑
let lhs = pairing(&agg_pk, &h_m); // e(agg_pk, H(m)) → GT 원소
let rhs = pairing(&G1Affine::generator(), sig); // e(G, sig) → GT 원소
lhs == rhs                         // GT에서 비교 → 서명 유효?
```
- `hash_to_g2()`: 32바이트 → G2 곡선 위의 점으로 결정론적 매핑
  - 표준: draft-irtf-cfrg-hash-to-curve
- `pairing()`: 쌍선형 함수 e: G1 × G2 → GT
  - Miller loop + final exponentiation
  - 연산 비용: ~2ms (현대 CPU)
- **등식의 의미:**
  - lhs = e(Σ pk_i, H(m)) = e((Σ sk_i)·G, H(m))
  - rhs = e(G, sig) = e(G, (Σ sk_i)·H(m))
  - 쌍선형성: e(a·G, B) = e(G, a·B) → lhs == rhs
  - 이 등식이 성립 = "서명자가 정말 이 공개키의 소유자"

💡 **Reth 비교:** Reth도 Beacon Chain attestation 검증에 같은 페어링을 사용.
차이점: Reth는 수만 건의 attestation을 검증, Helios는 슬롯당 1건.

### Viz 설계 (6 step):

**Step 0: 비트맵 필터링**
- 상단: 512개 작은 원(dot) 격자 (32×16)
  - 녹색 = 참여(bit=1), 회색 = 미참여(bit=0)
  - 약 480개가 녹색 (95% 참여율)
  - 비트맵 패턴이 왼쪽에서 오른쪽으로 fade-in
- 하단: 필터 결과 → "480 / 512 참여"
- 우측: bits: Bitvector<512> 텍스트

**Step 1: 정족수 확인**
- 가로 프로그레스 바:
  - 전체 폭 = 512
  - 2/3 임계선(342) 표시 (빨간 점선)
  - 참여자 수(480)까지 녹색 채움 → 임계선 넘으면 ✓
- 아래: "480명 참여 > 342명 필요 (2/3 × 512)"
- 우측: "Casper FFG 동일 임계값"

**Step 2: 공개키 합산**
- G1 곡선 위의 점 합산 시각화:
  - 왼쪽: 여러 G1 점(작은 원)이 하나의 큰 점으로 수렴하는 애니메이션
  - 수식: pk₁ + pk₂ + ... + pk₄₈₀ = agg_pk
  - 시작점: identity (0, 무한원점)
  - 최종: agg_pk (48바이트)
- 우측: "BLS 선형성: 개별 검증 480회 = 집계 검증 1회"

**Step 3: signing_root 계산**
- 3단계 합성 과정:
  - [header] → SSZ hash_tree_root → [object_root]
  - [DOMAIN_SYNC_COMMITTEE + fork_version + genesis_root] → [domain]
  - [object_root + domain] → hash_tree_root → [signing_root]
- 각 단계 순차 fade-in
- 우측: "도메인 분리 → 서명 재사용 방지"

**Step 4: 페어링 비교**
- 두 경로가 GT에서 만나는 구조:
  - 상단 경로: [agg_pk (G1)] + [H(m) (G2)] → pairing → [lhs (GT)]
  - 하단 경로: [G (G1)] + [sig (G2)] → pairing → [rhs (GT)]
  - 중앙: lhs == rhs? → ✓ "서명 유효"
- 각 그룹(G1, G2, GT)을 다른 색으로
- 쌍선형성 수식: e(a·G, B) = e(G, a·B)

**Step 5: 전체 파이프라인 요약**
- 5단계가 수평으로 연결된 최종 큰그림:
  - [bits] → filter → [pk 합산] → [signing_root] → [pairing] → [✓]
  - 각 단계 사이에 데이터 크기 표시 (512→480→48B→32B→GT)
  - 전체 처리 시간: ~3ms
- 아래: "Reth는 블록 실행 수 초 vs Helios는 서명 검증 수 ms"

---

## 섹션 3: CommitteeLifecycle — 위원회 교체와 핸드오프

### 텍스트 내용:

#### 위원회 교체 시기
Sync Committee는 영원하지 않다.
256 에폭(= 8192 슬롯 = ~27시간)마다 교체된다.

```
period = slot / (EPOCHS_PER_SYNC_COMMITTEE_PERIOD * SLOTS_PER_EPOCH)
       = slot / (256 * 32)
       = slot / 8192
```

예: slot 8,000,000 → period 976
    slot 8,008,192 → period 977 (새 위원회)

#### 교체 과정
LightClientUpdate 메시지에 next_sync_committee가 포함된다:
1. period N에서 활동하는 current_sync_committee로 서명 검증
2. Update에 period N+1의 next_sync_committee가 포함됨
3. next_sync_committee도 Merkle branch로 state_root에 속함을 검증
   (부트스트랩의 committee_branch 검증과 동일한 원리)
4. period 경계를 넘으면:
   - current_sync_committee ← next_sync_committee
   - next_sync_committee ← None (다음 Update에서 받음)

💡 **왜 한 period 앞서 받는가:**
경계에서 즉시 교체하려면, 교체 전에 새 위원회를 알아야 한다.
한 period 미리 받아서 검증해둔다 → 경계에서 지연 없이 전환.

💡 **Reth 비교:** Reth는 BeaconState에서 직접 읽으므로 "미리 받기"가 불필요.
Helios는 Update 메시지에 의존하므로 한 period 미리 받아야 한다.

#### 핸드오프 실패 시
next_sync_committee를 받지 못하고 period 경계를 넘으면?
→ Helios는 해당 period의 서명을 검증할 수 없다
→ 다시 부트스트랩해야 함 (warm start 가능하면 마지막 체크포인트에서)

### Viz 설계 (3 step):

**Step 0: 타임라인 — period 교체 시점**
- 수평 타임라인:
  - period N | period N+1 | period N+2
  - 각 period = 8192 슬롯 (~27시간)
  - 경계 표시: 점선 수직선
- 아래: slot 계산 수식

**Step 1: 핸드오프 과정**
- period N 영역:
  - [current_committee (N)] 으로 서명 검증 중
  - Update 수신 → [next_committee (N+1)] Merkle 검증 + 저장
- period N+1 경계:
  - 교체 애니메이션: current ← next, next ← None
  - 새 Update에서 [next_committee (N+2)] 수신
- 화살표와 데이터 흐름으로 교체 과정 시각화

**Step 2: 실패 케이스**
- period 경계에서 next_committee가 None인 상황
  - "검증 불가" 경고 (AlertBox)
  - 해결: 재부트스트랩 (helios-bootstrap 참조)
  - 또는: 다른 Beacon API에서 Update 재요청

---

## codebase 소스 파일 (verify.rs) 주석 보강

현재 verify.rs가 41줄로 간략. 본문 대응 주석을 추가해야 함:
- 각 단계에 "본문 대응: 'VerifyTrace 단계 N'" 주석
- 매개변수 예시 값 (pks: 512개, bits: 95% 참여 등)
- 함수 내부 호출(compute_domain, hash_to_g2 등)에 의미 주석
- BLS 선형성, 쌍선형성 등 수학적 배경 주석

---

## 구조 변경 요약

기존 9개 얕은 섹션 → 3개 깊은 섹션:
1. Overview (깊은 개론 + Reth 비교 + 왜 512명인가)
2. VerifyTrace (verify 함수 5단계 scratch 추적 + Viz 6 step)
3. CommitteeLifecycle (교체 + 핸드오프 + 실패 케이스)

기존 섹션 삭제 대상:
- BLS12381.tsx → Overview에 흡수 (G1/G2/GT 기초는 Overview에서 간략히)
- ParticipationBits.tsx → VerifyTrace 단계 1에 흡수
- AggregatePubkeys.tsx → VerifyTrace 단계 3에 흡수
- SigningRoot.tsx → VerifyTrace 단계 4에 흡수
- BlsVerify.tsx → VerifyTrace 단계 5에 흡수
- Quorum.tsx → VerifyTrace 단계 2에 흡수
- CommitteeRotation.tsx → CommitteeLifecycle에 흡수
- CommitteeHandoff.tsx → CommitteeLifecycle에 흡수
