export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPFS & Filecoin 스토리지 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>IPFS</strong>(InterPlanetary File System)는 콘텐츠 주소 기반 분산 파일 시스템이며,
          <strong>Filecoin</strong>은 IPFS 위에 경제적 인센티브를 추가한 분산 저장 네트워크입니다.
          두 프로젝트는 Protocol Labs에서 시작되어 상호 보완적으로 동작합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">IPFS vs Filecoin 역할 분리</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`IPFS와 Filecoin의 관계:

IPFS (콘텐츠 발견 & 전송):
  → 콘텐츠 주소 지정 (CID: Content Identifier)
  → P2P 데이터 전송 (Bitswap 프로토콜)
  → DHT 기반 콘텐츠 라우팅
  → 누구나 노드 운영 가능 (무료)
  → 저장 보장 없음 (핀닝 필요)

Filecoin (저장 인센티브 & 보장):
  → 저장 제공자(Storage Provider)에게 FIL 보상
  → 암호학적 저장 증명 (PoRep, PoSt)
  → 경제적 페널티로 데이터 가용성 보장
  → 저장 시장 (Storage Market)

┌─────────────────────────────────────────┐
│           사용자/클라이언트                │
│  데이터 저장 요청                         │
└──────────┬──────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│  IPFS Layer (콘텐츠 주소 + P2P 전송)     │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Bitswap  │  │   DHT    │  │ UnixFS ││
│  │ (전송)   │  │ (라우팅)  │  │ (파일)  ││
│  └──────────┘  └──────────┘  └────────┘│
└──────────┬──────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│  Filecoin Layer (인센티브 + 증명)         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ 저장 시장 │  │ PoRep    │  │ PoSt   ││
│  │ (Deal)   │  │ (봉인)   │  │ (검증)  ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">콘텐츠 주소 지정 (CID)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Content Identifier (CID):

전통적 주소 (위치 기반):
  https://server.com/files/photo.jpg
  → 서버가 다운되면 접근 불가
  → 같은 파일이라도 URL이 다를 수 있음

IPFS 주소 (콘텐츠 기반):
  /ipfs/QmXnnyufdzAWL5CqZ2RnSNgPbvCc1ALT73s6epPrRnZ1Xy
  → 파일 내용의 해시가 곧 주소
  → 어떤 노드에서든 동일 CID로 접근
  → 내용이 바뀌면 CID도 변경 (무결성 보장)

CID v1 구조:
  <multibase><version><multicodec><multihash>
  예: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3ockhmzfmo...
  │    │      │          │
  │    │      │          └── SHA-256 해시
  │    │      └── dag-pb (코덱)
  │    └── CID v1
  └── base32 인코딩

Merkle DAG (데이터 구조):
  큰 파일 → 청크 분할 → 각 청크의 CID 계산
  → 청크 CID를 리프로 하는 Merkle Tree 구축
  → 루트 CID = 전체 파일의 주소

  Root CID
  ├── Chunk 0 (CID_0)  256KB
  ├── Chunk 1 (CID_1)  256KB
  ├── Chunk 2 (CID_2)  256KB
  └── Chunk 3 (CID_3)  128KB (마지막)`}</code>
        </pre>
      </div>
    </section>
  );
}
