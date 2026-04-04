export const kuboArchCode = `Kubo 노드 아키텍처:

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
└────────────────────────────────────────────┘`;

export const bitswapCode = `Bitswap = IPFS의 블록 교환 프로토콜

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
  → 불필요한 대역폭 소모 최소화

최근 개선 (Kubo 0.36+):
  Broadcast Reduction:
    → 응답하는 피어만 추적 후 선별 전송
    → 브로드캐스트 메시지 80-98% 감소
    → 대역폭 50-95% 절감
  HTTP 검색 병행 (Kubo 0.35+):
    → /tls/http provider에 HTTP/2 블록 요청
    → Bitswap과 HTTP를 동시에 사용
    → application/vnd.ipld.raw 형식`;
