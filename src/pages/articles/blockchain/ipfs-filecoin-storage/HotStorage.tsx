import { CitationBlock } from '../../../../components/ui/citation';

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
│  │ booster-http (검색 서버)          │  │
│  │  → /piece/ 전체 피스 검색         │  │
│  │  → /ipfs/ Trustless Gateway      │  │
│  │  → CAR + raw IPLD 블록 지원      │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │ booster-bitswap (IPFS 호환)      │  │
│  │  → Filecoin SP를 IPFS 노드처럼   │  │
│  │  → 기존 IPFS 노드와 투명하게 교환 │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Local Index Directory (LID)       │  │
│  │  → 블록별 위치 메타데이터 저장     │  │
│  │  → LevelDB (소규모) 또는          │  │
│  │    YugabyteDB (>1PiB, 수만 딜)   │  │
│  │  → 서브피스 블록 레벨 검색 지원    │  │
│  │  → 다중 boostd 인스턴스 공유 가능 │  │
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
        <CitationBlock source="Boost Docs — HTTP Retrieval" citeKey={3} type="paper" href="https://boost.filecoin.io/retrieving-data/http-retrieval">
          <p className="italic text-muted-foreground">"booster-http serves retrievals over HTTP. It can be run as a standalone binary, and serves piece, IPFS Trustless Gateway, and raw block retrievals."</p>
          <p className="mt-2 text-xs">Boost의 booster-http는 Graphsync를 대체하는 표준 HTTP 기반 검색 서버로, Trustless Gateway 프로토콜을 통해 CDN, 프록시, 브라우저와 호환됩니다.</p>
        </CitationBlock>
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

Boost vs 레거시 비교:
  ┌──────────────┬───────────────┬──────────────────┐
  │ 측면         │ go-fil-markets│ Boost            │
  ├──────────────┼───────────────┼──────────────────┤
  │ 전송 프로토콜│ Graphsync만   │ HTTP, Bitswap 등 │
  │ 딜 관리      │ CLI만         │ Web UI + GraphQL │
  │ 인덱싱       │ DAG Store     │ LID (YugabyteDB) │
  │ 확장성       │ 단일 프로세스 │ 다중 인스턴스     │
  └──────────────┴───────────────┴──────────────────┘`}</code>
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
  → Notary 시스템으로 DataCap 분배

FVM 현황 (2025):
  → 5,000+ 고유 컨트랙트, 3.2M+ 트랜잭션
  → 저장 활용률 ~32% (이전 한 자릿수에서 증가)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">PDP (Proof of Data Possession)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`PDP = 검증 가능한 핫 스토리지의 암호학적 프로토콜
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
  → 결정적 Merkle 트리, 암호학적 바인딩`}</code>
        </pre>
        <CitationBlock source="Filecoin Blog — Introducing Proof of Data Possession" citeKey={4} type="paper" href="https://filecoin.io/blog/posts/introducing-proof-of-data-possession-pdp">
          <p className="italic text-muted-foreground">"PDP introduces a new lightweight proof mechanism that verifies data possession without sealing, enabling sub-second data access while maintaining cryptographic guarantees through challenge-response protocols with just 160 bytes per proof."</p>
          <p className="mt-2 text-xs">PDP는 PoRep의 봉인 과정을 생략하여 핫 스토리지의 즉시 접근성을 유지하면서도, drand 비콘 기반 랜덤 챌린지와 Merkle 포함 증명으로 데이터 보유를 암호학적으로 검증합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">Filecoin Onchain Cloud (FOC)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`FOC = Filecoin의 검증 가능한 클라우드 인프라
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
  Synapse SDK:   개발자 API (Python/Go 확장 예정)`}</code>
        </pre>
      </div>
    </section>
  );
}
