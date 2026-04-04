export const capacityCode = `PBH 블록스페이스 용량 관리:

// PBH 전용 가스 한도 계산
let verified_gas_limit = (self.verified_blockspace_capacity as u64 * gas_limit)
                         / 100;

// 예시: 블록 가스 한도 30,000,000 / PBH 용량 40%
// → PBH 전용 가스 한도 = 12,000,000 가스

블록 구성 예시 (가스 한도: 30M, PBH 용량: 40%):

PBH 블록스페이스 (12,000,000 가스):
  PBH Tx 1: 2,000,000 가스
  PBH Tx 2: 1,500,000 가스
  PBH Tx 3: 3,000,000 가스
  PBH Tx 4: 2,500,000 가스
  PBH Tx 5: 1,800,000 가스
  PBH Tx 6: 1,200,000 가스
  총 사용: 12,000,000 가스

일반 블록스페이스 (18,000,000 가스):
  일반 Tx: 가스비 순으로 정렬
  봇 트랜잭션도 여기에 포함`;

export const capacityAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'PBH 가스 한도 계산식' },
  { lines: [12, 19] as [number, number], color: 'emerald' as const, note: 'PBH 전용 영역 (40%)' },
  { lines: [21, 23] as [number, number], color: 'amber' as const, note: '일반 영역 (60%)' },
];

export const fairnessCode = `공정성 보장 메커니즘:

1. 월별 사용량 제한:
   External Nullifier = (year, month, nonce, version)
   → 동일 연도/월 조합으로 제한된 횟수만 PBH 사용 가능
   → nonce가 월별 카운터 역할

2. Nonce 기반 중복 방지:
   // 동일한 nonce 재사용 방지로 어뷰징 차단
   nullifier_hash = generate_nullifier_hash(&identity, external_nullifier_hash)
   → 같은 (identity + external_nullifier)로는 1번만 사용

3. 가스비 기반 내부 정렬:
   PBH 트랜잭션 간에는 여전히 가스비로 정렬
   → 검증된 사용자 간 공정한 경쟁 유지

4. 일반 사용자 보장:
   최소 60%의 블록스페이스는 일반 트랜잭션을 위해 보장
   → PBH가 일반 트랜잭션을 완전히 차단하지 않음

동적 할당:
  PBH 부족 시 → 남은 공간을 일반 트랜잭션으로 채움
  PBH 과다 시 → 12M 가스만 현재 블록, 나머지 다음 블록`;

export const fairnessAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: '월별 사용량 제한' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'Nullifier 기반 중복 방지' },
  { lines: [13, 15] as [number, number], color: 'amber' as const, note: 'PBH 내 가스비 정렬' },
  { lines: [17, 19] as [number, number], color: 'rose' as const, note: '60% 일반 트랜잭션 보장' },
];
