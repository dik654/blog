export const pdpCode = `PDP = 검증 가능한 핫 스토리지의 암호학적 프로토콜
(PoRep/PoSt 이후 Filecoin의 첫 주요 증명 개발, 2025.5)

핵심 차이:
  PoRep: 데이터 봉인 필요 → 검색 시 봉인 해제 (수 시간)
  PDP:   봉인 불필요 → 데이터 즉시 접근 (서브초)

Challenge-Response 메커니즘:
  1. 클라이언트가 PDP 지원 SP에 파일 업로드
     → 데이터셋에 추가, PDP 컨트랙트 온체인 생성
  2. PDP 컨트랙트가 drand 비콘 기반 랜덤 챌린지 생성
  3. SP가 챌린지 블록의 Merkle 포함 증명 계산
     → 데이터셋 크기 무관하게 챌린지당 160바이트만 필요
  4. PDP 컨트랙트가 Merkle 증명을 루트 커밋먼트 대비 검증
  5. 성공 시 온체인 이벤트 발행 → 결제/서비스 트리거

핵심 특성:
  → 봉인/해봉 불필요 — 원본 데이터 그대로 유지
  → 서브초 접근 가능
  → 가변 컬렉션: 데이터 추가/제거/수정 가능
  → 경량: 데이터셋 크기와 무관한 160B 증명
  → 결정적 Merkle 트리, 암호학적 바인딩`;

export const focCode = `FOC = Filecoin의 검증 가능한 클라우드 인프라
(2025.11 Buenos Aires 발표, 2026.1 메인넷)

3계층 아키텍처:

┌────────────────────────────────────────────┐
│ Service Layer (Warm Storage Service)        │
│  → 클라이언트 인증, 결제 조율               │
│  → 가격 책정, 메타데이터 관리               │
│  → 장애 처리, SP는 Curio 노드 운영          │
├────────────────────────────────────────────┤
│ Settlement Layer (Filecoin Pay)             │
│  → 자동 결제 레일 (토큰 스트리밍)           │
│  → PDP 증명 성공에 연동된 결제 트리거       │
│  → 잠금 메커니즘 (클라이언트 이탈 대비)     │
├────────────────────────────────────────────┤
│ Verification Layer (PDP)                    │
│  → 연속적 온체인 저장 검증                  │
│  → 랜덤 챌린지 + Merkle 증명               │
└────────────────────────────────────────────┘

추가 서비스:
  Filecoin Beam: 분산 CDN (저지연 데이터 전송)
  FilCDN:        Filecoin 전용 CDN (SP 이그레스 비용 보호)
  Filecoin Pin:  IPFS + Filecoin 브릿지 (핀닝 + PDP 검증)
  Synapse SDK:   개발자 API (Python/Go 확장 예정)`;
