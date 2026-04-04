export const httpRetrievalCode = `검색 프로토콜 진화:

Graphsync (레거시):
  → IPFS 전용 프로토콜
  → DAG 트래버설 기반
  → 일반 웹 인프라와 비호환
  → 디버깅 어려움

HTTP 검색 (Boost):
  → 표준 HTTP/HTTPS
  → Range 요청으로 부분 데이터 접근
  → CDN, 프록시, 캐시와 호환
  → 브라우저에서 직접 접근 가능

IPFS Trustless Gateway 프로토콜:
  GET /ipfs/{cid}?format=car
  → CAR (Content Addressable Archive) 형식으로 응답
  → 클라이언트가 블록 해시를 직접 검증
  → "Trustless" = 게이트웨이를 신뢰할 필요 없음

검색 흐름:
  1. 클라이언트가 CID로 데이터 요청
  2. IPNI (cid.contact)에서 Provider 검색
  3. Provider의 Boost HTTP 서버에 연결
  4. CAR 형식으로 데이터 수신
  5. 클라이언트가 CID 해시로 무결성 검증

Boost vs 레거시 비교:
  ┌──────────────┬───────────────┬──────────────────┐
  │ 측면         │ go-fil-markets│ Boost            │
  ├──────────────┼───────────────┼──────────────────┤
  │ 전송 프로토콜│ Graphsync만   │ HTTP, Bitswap 등 │
  │ 딜 관리      │ CLI만         │ Web UI + GraphQL │
  │ 인덱싱       │ DAG Store     │ LID (YugabyteDB) │
  │ 확장성       │ 단일 프로세스 │ 다중 인스턴스     │
  └──────────────┴───────────────┴──────────────────┘`;

export const fvmDealCode = `Filecoin Virtual Machine (FVM) 딜 진화:

기존 (Built-in Market Actor):
  → 프로토콜 수준의 딜 관리
  → 모든 딜이 동일한 규칙
  → 유연성 부족

FVM 이후 (프로그래밍 가능한 딜):
  → 스마트 컨트랙트로 딜 조건 정의
  → DataDAO: 커뮤니티 데이터 관리
  → 영구 스토리지: 자동 딜 갱신
  → 조건부 검색: 토큰 게이팅

Direct Data Onboarding (DDO):
  → 전통적 딜 프로세스 우회
  → Storage Provider가 직접 데이터를 섹터에 배치
  → 딜 발행 비용 절감
  → 대량 데이터 온보딩에 적합

Filecoin Plus (Fil+):
  → 검증된 클라이언트에게 DataCap 부여
  → DataCap 딜은 10x 저장 보상 승수
  → "유용한 데이터" 저장에 인센티브
  → Notary 시스템으로 DataCap 분배

FVM 현황 (2025):
  → 5,000+ 고유 컨트랙트, 3.2M+ 트랜잭션
  → 저장 활용률 ~32% (이전 한 자릿수에서 증가)`;
