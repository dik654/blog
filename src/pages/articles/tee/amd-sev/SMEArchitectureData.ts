export const smeCode = `// SME vs TME 비교
SME (Secure Memory Encryption):
  - 페이지별 선택적 암호화 (C-bit 제어)
  - OS 수정 필요 (페이지 테이블 C-bit 설정)
  - 서로 다른 페이지에 다른 키 사용 가능
  - 성능 최적화: 필요한 페이지만 암호화

TME (Transparent Memory Encryption):
  - 전체 DRAM 암호화 (단일 키)
  - OS 수정 불필요 (BIOS에서 활성화)
  - 부팅 시 랜덤 키 생성 → 전원 off 시 소멸
  - 콜드 부트 공격 방어에 효과적

SEV가 사용하는 방식:
  - SME 기반 + VM별 키 분리
  - 각 게스트 ASID마다 고유 AES-128 키
  - 키는 PSP(AMD SP)가 생성·관리`;

export const smeAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'SME: 선택적 페이지 암호화' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'TME: 전체 메모리 투명 암호화' },
  { lines: [12, 15] as [number, number], color: 'amber' as const, note: 'SEV는 SME + VM별 키 분리' },
];
