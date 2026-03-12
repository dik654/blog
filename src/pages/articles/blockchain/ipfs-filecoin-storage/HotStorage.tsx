export default function HotStorage() {
  return (
    <section id="hot-storage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 핫 스토리지 & Boost</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Cold vs Hot 스토리지</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Filecoin 스토리지 진화:

Cold Storage (초기 Filecoin):
  데이터 → PoRep 봉인(Sealing) → 봉인된 섹터
  → 검색 시: 봉인 해제(Unseal) 필요 (~수 시간)
  → 아카이브 용도에 적합, 실시간 접근 불가

Hot Storage (현재):
  데이터 → 봉인된 섹터 + 원본 데이터 캐시
  → 검색 시: 원본에서 즉시 HTTP 전송
  → Boost의 핵심 혁신

┌────────────────────────────────────────────┐
│          Storage Provider 노드              │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Hot Storage (즉시 접근)               │  │
│  │  → 원본 데이터 (CAR 파일)             │  │
│  │  → Piece Store (인덱스)               │  │
│  │  → HTTP 서버 (직접 전송)              │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Cold Storage (봉인 저장)              │  │
│  │  → 봉인된 섹터 (PoRep 증명용)        │  │
│  │  → WindowPoSt 검증 대상               │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘

핫 스토리지의 이점:
  검색 지연:  수 시간 → 밀리초
  프로토콜:   Graphsync → HTTP (표준)
  비용:       추가 저장 공간 필요 (원본 유지)
  호환성:     기존 CDN/웹 인프라와 호환`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Boost 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Boost = Filecoin Storage Provider의 딜 관리 소프트웨어

기존 go-fil-markets (레거시):
  → Lotus 내장, 모놀리식
  → Graphsync 기반 검색 (비표준)
  → 확장성 제한

Boost (현재 표준):
  → Lotus에서 분리된 독립 서비스
  → HTTP 기반 검색 (표준 호환)
  → 모듈식 아키텍처

Boost 핵심 컴포넌트:

┌────────────────────────────────────────┐
│           Boost Daemon                  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Deal Engine                      │  │
│  │  → 딜 제안 수신 & 검증            │  │
│  │  → 오프라인/온라인 딜 관리         │  │
│  │  → 딜 상태 추적 (State Machine)   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ HTTP Server (boostd-data)        │  │
│  │  → /piece/{pieceCID} 엔드포인트   │  │
│  │  → 바이트 범위 요청 지원           │  │
│  │  → IPFS Gateway 호환              │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Piece Store & Index              │  │
│  │  → PieceCID → 섹터 위치 매핑      │  │
│  │  → CID → Piece 내 오프셋 매핑    │  │
│  │  → LevelDB 기반 인덱스           │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Boost UI (웹 대시보드)            │  │
│  │  → 딜 현황 모니터링               │  │
│  │  → 저장 공간 관리                  │  │
│  │  → 성능 메트릭                    │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">HTTP 검색 프로토콜</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`검색 프로토콜 진화:

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

Saturn (CDN 계층):
  → Filecoin 위의 L1 CDN 네트워크
  → 전 세계 엣지 노드가 핫 데이터 캐싱
  → Provider → Saturn → 최종 사용자
  → 검색 성능 대폭 개선`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">FVM 기반 딜 메이킹</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Filecoin Virtual Machine (FVM) 딜 진화:

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
  → Notary 시스템으로 DataCap 분배`}</code>
        </pre>
      </div>
    </section>
  );
}
