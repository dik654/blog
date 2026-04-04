export const asidCode = `// ASID (Address Space Identifier)
// 각 SEV 게스트 VM에 고유 ASID를 할당
// 메모리 컨트롤러가 ASID로 암호화 키를 선택

ASID 0       → 하이퍼바이저 (암호화 없음)
ASID 1       → 게스트 VM #1 (키 K1)
ASID 2       → 게스트 VM #2 (키 K2)
...
ASID N       → 게스트 VM #N (키 KN)

// 최대 ASID 수 = 동시 실행 가능한 SEV VM 수
// Naples: 15, Rome: 509, Milan: 509, Genoa: 1006

// 키 관리
VEK (VM Encryption Key):
  - PSP가 런치 시 랜덤 생성
  - 호스트/하이퍼바이저 접근 불가
  - VM 종료 시 자동 폐기`;

export const asidAnnotations = [
  { lines: [5, 8] as [number, number], color: 'sky' as const, note: 'ASID별 VM 키 매핑' },
  { lines: [10, 11] as [number, number], color: 'emerald' as const, note: '세대별 최대 ASID 수' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: 'VEK 생명주기' },
];
