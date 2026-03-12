export default function IPFSArchitecture() {
  return (
    <section id="ipfs-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPFS Kubo 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Kubo 노드 구조</h3>
        <p>
          Kubo는 IPFS의 공식 Go 구현체로, 가장 널리 사용되는 IPFS 노드입니다.
          콘텐츠 라우팅, 데이터 교환, 블록 저장소를 통합 관리합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Kubo 노드 아키텍처:

┌────────────────────────────────────────────┐
│              API Layer                      │
│  HTTP API (:5001) │ Gateway (:8080)        │
│  CLI (ipfs 명령)   │ WebUI                  │
├────────────────────────────────────────────┤
│              Core Layer                     │
│  ┌──────────┬──────────┬────────────────┐  │
│  │ UnixFS   │ DAG API  │ Name (IPNS)    │  │
│  │ (파일)   │ (DAG)    │ (이름 해석)     │  │
│  └──────────┴──────────┴────────────────┘  │
├────────────────────────────────────────────┤
│              Exchange Layer                 │
│  ┌──────────┐  ┌──────────────────────┐   │
│  │ Bitswap  │  │ Content Routing      │   │
│  │ (블록    │  │ (Amino DHT +         │   │
│  │  교환)   │  │  IPNI Delegated)     │   │
│  └──────────┘  └──────────────────────┘   │
├────────────────────────────────────────────┤
│              Network Layer                  │
│  libp2p (TCP, QUIC, WebSocket, WebRTC)     │
│  → mDNS 로컬 발견 + DHT 글로벌 발견        │
├────────────────────────────────────────────┤
│              Storage Layer                  │
│  Blockstore (Flatfs / Badger)              │
│  → CID → Raw Block 매핑                    │
│  Datastore (LevelDB)                       │
│  → 메타데이터, 핀 정보, DHT 레코드          │
└────────────────────────────────────────────┘`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Bitswap 프로토콜</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Bitswap = IPFS의 블록 교환 프로토콜

동작 흐름:
  1. 노드 A가 CID_X 블록 필요
  2. Wantlist에 CID_X 추가
  3. 연결된 피어들에게 WANT 메시지 전송
  4. CID_X를 가진 노드 B가 응답
  5. 블록 전송 후 Wantlist에서 제거

메시지 타입:
  WANT_HAVE   — "이 블록 있어?" (경량 프로브)
  WANT_BLOCK  — "이 블록 보내줘"
  HAVE        — "나한테 있어" (응답)
  BLOCK       — 실제 블록 데이터 전송
  DONT_HAVE   — "나한테 없어"

세션 기반 최적화:
  같은 DAG의 블록은 하나의 세션으로 묶음
  → 응답 빠른 피어에 우선 요청
  → 피어 품질 점수 기반 라우팅

피어 선택 전략:
  1단계: 연결된 피어에게 WANT_HAVE
  2단계: HAVE 응답한 피어에게 WANT_BLOCK
  3단계: 응답 없으면 DHT Provider 검색
  → 불필요한 대역폭 소모 최소화`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">콘텐츠 라우팅 (DHT + IPNI)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`콘텐츠 라우팅 = "CID를 가진 노드 찾기"

Amino DHT (Kademlia 기반):
  → 분산 해시 테이블로 Provider 레코드 저장
  → PUT: "나에게 CID_X가 있다" (Provider 광고)
  → GET: "CID_X를 가진 노드는 누구?" (Provider 조회)
  → XOR 거리 기반 라우팅 (O(log n) 홉)

IPNI (InterPlanetary Network Indexer):
  → 중앙화된 인덱서 (cid.contact)
  → DHT보다 빠른 조회 (단일 HTTP 요청)
  → 대규모 Storage Provider의 콘텐츠 인덱싱
  → Delegated Routing으로 Kubo에 통합

Kubo 라우팅 설정 (Routing.Type):
  "auto" (기본): DHT + IPNI 병렬 조회
  "dht":         DHT만 사용
  "none":        라우팅 비활성화
  "custom":      커스텀 라우터

IPNS (InterPlanetary Name System):
  → 변경 가능한 이름 → 불변 CID 매핑
  → /ipns/k51... → /ipfs/Qm... (현재 버전)
  → 키 쌍으로 서명, DHT에 레코드 발행
  → DNS-Link: /ipns/example.com → TXT 레코드`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">UnixFS & 핀닝</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`UnixFS = IPFS의 파일/디렉토리 표현 프로토콜

파일 추가 과정 (ipfs add):
  1. 파일을 청크로 분할 (기본 256KB)
  2. 각 청크를 DAG 노드로 래핑 (UnixFS PBNode)
  3. 청크 노드들의 부모 노드 생성 (Merkle DAG)
  4. 루트 CID 반환

디렉토리 구조:
  /project (QmRoot)
  ├── README.md (QmFile1)
  ├── src/
  │   ├── main.rs (QmFile2)
  │   └── lib.rs (QmFile3)
  └── Cargo.toml (QmFile4)
  → 각 파일/디렉토리가 독립 CID를 가짐
  → 하위 파일만 변경해도 상위 CID가 변경 (Merkle 특성)

핀닝 (Pinning):
  IPFS 노드는 GC로 캐시된 블록을 삭제할 수 있음
  핀닝 = "이 CID는 삭제하지 마라" 표시

  Recursive Pin: CID와 그 아래 모든 블록 보존
  Direct Pin:    해당 CID 블록만 보존

  원격 핀닝 서비스:
    Pinata, web3.storage, Infura
    → IPFS 핀닝 API 표준 (/api/v0/pin/remote)
    → 데이터 가용성을 제3자에게 위임`}</code>
        </pre>
      </div>
    </section>
  );
}
