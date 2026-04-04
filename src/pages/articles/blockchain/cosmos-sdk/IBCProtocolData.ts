export const IBC_DETAIL_CODE = `// IBC 핵심 3계층 (TCP/IP 유사)
Light Client  ← 상대 체인 상태 검증 (Tendermint, Solo Machine)
Connection    ← 체인 간 연결 (INIT → TRYOPEN → OPEN)
Channel       ← 앱 간 채널 (ORDERED / UNORDERED)

// IBC 패킷 생명주기
1. SendPacket(체인 A)
   → 패킷을 IAVL 트리에 커밋
   → SendPacket 이벤트 발행

2. 릴레이어 중계
   → 체인 A에서 이벤트 감지
   → 머클 증명 생성
   → RecvPacket TX를 체인 B에 제출

3. RecvPacket(체인 B)
   → Light Client로 증명 검증
   → 시퀀스 번호로 순서/중복 체크
   → OnRecvPacket 콜백 실행
   → Acknowledgement 작성

4. AcknowledgePacket(체인 A)
   → 릴레이어가 Ack를 체인 A에 중계
   → OnAcknowledgementPacket 콜백`;

export const IBC_ANNOTATIONS = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: 'IBC 3계층 구조' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: '송신 단계' },
  { lines: [15, 20] as [number, number], color: 'amber' as const, note: '수신 & 검증 단계' },
];
