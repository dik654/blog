export const migCode = `// SEV 라이브 마이그레이션 흐름
// 핵심: 게스트 메모리가 평문으로 노출되지 않음

1. SEND_START (소스)
   - 소스 PSP가 대상 PDH로 TEK 유도
   - 마이그레이션 세션 시작

2. SEND_UPDATE_DATA (소스, 반복)
   - 각 페이지를 VEK로 복호 → TEK로 재암호화
   - 암호화된 페이지 + HMAC 전송

3. RECEIVE_START (대상)
   - 대상 PSP가 TEK 유도
   - 새 ASID/VEK 할당

4. RECEIVE_UPDATE_DATA (대상, 반복)
   - TEK로 복호 → 새 VEK로 재암호화
   - RMP 엔트리 설정 (SNP)

5. SEND_FINISH / RECEIVE_FINISH
   - 마이그레이션 완료, 소스 VM 폐기`;

export const migAnnotations = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: '소스에서 TEK 유도' },
  { lines: [8, 10] as [number, number], color: 'emerald' as const, note: '페이지별 재암호화 전송' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: '대상에서 복원' },
];
