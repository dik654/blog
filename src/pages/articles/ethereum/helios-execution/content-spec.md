# helios-execution 섹션 재편

기존 9개 얕은 섹션 → 3개 깊은 섹션.

## 섹션 1: Overview — ProofDB 가상 DB 패턴
- Reth: StateProvider → MDBX 700GB 직접 읽기
- Helios: ProofDB → RPC + Merkle 증명 → revm에 값 반환
- 핵심: EVM 코드는 동일, DB 레이어만 교체 → 무상태 실행
- Reth 비교 테이블 (DB, 검증, 디스크, 신뢰)

### Viz (3 step):
- Step 0: Reth 경로(EVM→MDBX→값) vs Helios ��로(EVM→ProofDB→RPC→증명검증→값)
- Step 1: ProofDB 내부 — lazy loading: 첫 접근 시 get_proof, 이후 캐시
- Step 2: revm 빌더 패턴 — new DB → Evm::builder().with_db(proof_db).build() → transact()

## 섹션 2: ExecutionTrace ��� eth_call + gas estimation 코드 추적
- eth_call: ProofDB 생성 → revm 빌드 → transact() → output 추출
- estimate_gas: 동일 + 10% 마진 (상태 변동 대비)
- lazy proof loading: EVM이 접근하는 주소만 get_proof 요청 → 불필요한 증명 요청 방지
- 💡 Reth 비교: Reth는 로컬 DB → 즉시. Helios는 RPC 왕복 포함 → 느리지만 신뢰 불필요

### Viz (4 step):
- Step 0: eth_call 흐름 — ProofDB 생성 → revm build → transact → output
- Step 1: lazy proof loading — EVM이 basic_account(addr) 호출 → ProofDB가 RPC에 get_proof → 캐시 저장
- Step 2: estimate_gas — eth_call + 10% margin 추가, 왜 margin 필요한지
- Step 3: 전체 파이프라인 비교 — Reth ~μs vs Helios ~100ms (RPC 왕복)

## 섹��� 3: RpcMethods — 5가지 RPC 메서드 변형
- getBalance: account proof → RLP → balance 필드
- getCode: account proof → code_hash 검증 → 코드 다운로드
- getStorageAt: 2단계 MPT (state→account→storage→value)
- getLogs: Bloom filter(2048비트) → receipt 증명
- sendRawTransaction: 유일한 신뢰 지점 (증명 불가, RPC에 위임)
- ���� 5개 메서드 중 4개는 Merkle 증명, 1개만 신뢰

### Viz (3 step):
- Step 0: 5 메서드 공통 패턴 — get_proof → verify → extract (수평 파이프라인 × 4개)
- Step 1: getLogs 특수 — Bloom filter 시각화 (2048비트 필터에서 topic/address 매칭)
- Step 2: sendTx 신뢰 모델 — 유일한 비검증 경로 (RPC에 위임, receipt로 사후 확인)
