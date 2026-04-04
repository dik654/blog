export const contentRoutingCode = `콘텐츠 라우팅 = "CID를 가진 노드 찾기"

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

Sweep Provider (Kubo 0.38+):
  → DHT 발행을 시간에 걸쳐 균등 분산
  → 대규모 CID 세트에서 조회 97% 감소
  → 수십만 CID도 메모리 스파이크 없이 처리

Routing V1 HTTP API:
  → Kubo가 기본 노출, 브라우저 경량 클라이언트 지원
  → IPIP-476: Delegated Routing DHT Closest Peers API

IPNS (InterPlanetary Name System):
  → 변경 가능한 이름 → 불변 CID 매핑
  → /ipns/k51... → /ipfs/Qm... (현재 버전)
  → 키 쌍으로 서명, DHT에 레코드 발행
  → DNS-Link: /ipns/example.com → TXT 레코드`;

export const unixfsPinningCode = `UnixFS = IPFS의 파일/디렉토리 표현 프로토콜

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
    → 데이터 가용성을 제3자에게 위임

  Filecoin-Backed Pinning Services (FPS):
    → IPFS 핀닝 API를 노출하면서 Filecoin DSN에 저장
    → 업로드 즉시 IPFS로 접근 가능 + Filecoin 장기 보존

청크 전략:
  Fixed-size:    단순, 결정적 경계 (기본 256KB)
  Content-defined: Rabin/Buzhash, 중복 제거 최적화
  Balanced DAG:  기본 레이아웃, 빠른 랜덤 접근
  Trickle DAG:   순차/추가 전용 데이터 최적화

Gateway:
  Trustless Gateway:
    → application/vnd.ipld.raw (원시 블록)
    → application/vnd.ipld.car (CAR 파일)
    → 클라이언트가 해시로 무결성 검증
    → NoFetch 모드: 로컬 데이터만 제공
  libp2p Gateway (Kubo 0.23+ 실험적):
    → 방화벽/인증서 없이 libp2p로 Gateway 응답`;
