# helios-update 섹션별 내용 + Viz 설계

## 핵심 함수: validate_update() + apply_update()
기존 7개 얕은 섹션 → 3개 깊은 섹션으로 재편.

---

## 섹션 1: Overview — 왜 Update Loop가 필요한가

### 텍스트 내용:

#### 부트스트랩 이후
부트스트랩에서 LightClientStore를 초기화했다.
finalized_header: slot=8000000, current_sync_committee: 512명.
하지만 블록체인은 계속 진행된다 — 새 블록이 12초마다 생성.

Helios가 최신 상태를 유지하려면 헤더를 계속 갱신해야 한다.
이것이 Update Loop — 매 슬롯(12초)마다 Beacon API에서 LightClientUpdate를 폴링.

#### 두 가지 Update 타입
1. **OptimisticUpdate**: 아직 finalized 안 된 최신 헤더
   - 매 슬롯(12초)마다 수신
   - 빠르지만 reorg 가능 — 더 좋은 포크가 나타나면 교체됨
   - eth_getBlockByNumber("latest")에 사용

2. **FinalityUpdate**: finalized된 헤더
   - ~2 에폭(~12.8분)마다 수신
   - 느리지만 영구적 — 되돌릴 수 없음 (2/3 stake 보장)
   - eth_getBalance, eth_call 등 상태 증명에 사용

#### Update 수신 후 처리 흐름
1. validate_update() — 유효성 검증 (슬롯 순서 + BLS 서명)
2. apply_update() — Store에 반영 (헤더 갱신 + 위원회 교체)
3. best_valid_update 갱신 — 같은 슬롯에 여러 update 시 최선 선택

#### Reth와 비교
| 항목 | Reth | Helios |
|------|------|--------|
| 동기화 | devp2p로 블록 전파 수신 | HTTP 폴링 (12초) |
| 검증 | 블록 실행 | BLS 서명 검증 |
| finality | 2 에폭 대기 | 동일 (consensus 레이어) |
| reorg 처리 | Pipeline unwind | optimistic_header 교체 |

### Viz 설계 (3 step):

**Step 0: Update Loop 순환 흐름**
- [Store] → 매 12초 → [Beacon API] → [Update 수신] → [검증] → [Store 갱신] 순환
- 아래: "부트스트랩 이후 즉시 시작"

**Step 1: OptimisticUpdate vs FinalityUpdate**
- 상단: Optimistic 타임라인 (12초 간격 빈번한 점, 파랑) + "빠름, reorg 가능"
- 하단: Finality 타임라인 (~12.8분 간격 드문 점, 녹색) + "느림, 영구적"
- 구분선: "optimistic vs finalized"

**Step 2: 처리 파이프라인**
- [Update] → [validate_update()] → [apply_update()] → [best_valid_update]
- 각 단계 아래 핵심 연산 (슬롯 검사, BLS 검증, 헤더 교체)

---

## 섹션 2: UpdateTrace — validate + apply 코드 추적

### 텍스트 내용:

#### validate_update() 3가지 검사

검사 1: 슬롯 순서 — signature_slot > attested_header.slot > finalized_header.slot
- 역순이면 시간 역행 공격 가능
💡 미래 슬롯 서명을 미리 뿌려 경량 클라이언트를 속이는 공격 방지

검사 2: BLS 서명 검증 — verify_sync_committee_sig() 호출
- helios-consensus의 5단계와 동일

검사 3: finality 증명 — FinalityUpdate에만 해당
- finalized_header가 attested_header 상태에 속하는지 Merkle branch 검증

#### apply_update() 3가지 반영

반영 1: finalized_header 갱신
- update.finalized > store.finalized → 교체

반영 2: 위원회 교체 (period 경계)
- period = slot / 8192 변경 시 current ← next

반영 3: optimistic_header 갱신
- update.attested > store.optimistic → 교체
💡 왜 분리하는가: finalized만 사용하면 ~12분 지연. optimistic 추가로 12초 단위 추적.

### Viz 설계 (5 step):

**Step 0: 슬롯 순서 검사** — 타임라인에 3 슬롯 배치, 역순 시 ✗
**Step 1: BLS 서명 검증** — verify 함수 참조, 간략 파이프라인
**Step 2: finalized_header 갱신** — slot 비교 + 교체 애니메이션
**Step 3: 위원회 교체** — period 경계 감지 + 교체
**Step 4: optimistic_header 갱신** — slot 비교 + "latest" 응답 연결

---

## 섹션 3: ForkChoice — 최선 Update 선택 + Reorg

### 텍스트 내용:

#### best_valid_update 선택 기준
1. sync_committee 참여자 수 많은 update 우선
2. FinalityUpdate > OptimisticUpdate
3. 최신 슬롯 우선

#### Reorg 처리
- optimistic: reorg 가능 (포인터만 교체 = O(1))
- finalized: reorg 불가 (2/3 stake, ~100억 달러+ 슬래싱 비용)
💡 Reth는 Pipeline.unwind() — Helios는 O(1) 포인터 교체

### Viz 설계 (2 step):

**Step 0: best_valid_update 선택** — 3개 update 카드 (참여자 수 비교) → 최선 선택
**Step 1: Reorg 처리** — optimistic(포크 교체 애니메이션) vs finalized(자물쇠)
