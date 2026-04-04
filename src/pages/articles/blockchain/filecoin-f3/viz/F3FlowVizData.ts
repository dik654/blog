export const C = { ec: '#6366f1', f3: '#10b981', vote: '#f59e0b', cert: '#8b5cf6' };

export const STEPS = [
  { label: 'EC 블록 생산 (F3 이전)', body: 'EC가 VRF로 리더 선출 → 블록 생산 → Tipset 구성' },
  { label: 'F3 감지 → GossiPBFT 시작', body: 'F3.Run()이 EC의 새 tipset Notification을 수신' },
  { label: 'QUALITY → CONVERGE (후보 선택)', body: 'QUALITY: "이 tipset이 유효한가?" 품질 투표' },
  { label: 'PREPARE → COMMIT (확정 합의)', body: 'PREPARE: 수렴된 tipset에 BLS 서명 → 2/3+ 파워 확인' },
  { label: 'DECIDE → 인증서 발행', body: 'FinalityCertificate 생성 → certStore에 저장' },
];
