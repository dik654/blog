# helios-config 섹션 재편

기존 7개 얕은 ��션 → 3개 깊은 섹션.

## 섹션 1: Overview �� ClientBuilder 패턴
- Reth: CLI + reth.toml 설정 파일 → 독립 프로세스
- Helios: ClientBuilder 메서드 체이닝 → 라이브러리로 임베딩 가능
- 왜 Builder 패턴: 모바일/WASM에서 라이브러리로 사용 → 프로그래밍 방식 설정 필수
- 3가지 핵심 설정: Network, RPC endpoints, Checkpoint

### Viz (2 step):
- Step 0: Reth(CLI 터미널) vs Helios(코드 내 빌더) 비교
- Step 1: ClientBuilder 체이닝 — .network() → .consensus_rpc() → .execution_rpc() → .build()

## 섹션 2: NetworkConfig — 네트워크 + 합의 스펙 + RPC
- Network enum: Mainnet, Sepolia, Holesky — 각각 다른 genesis_root, fork_versions
- ConsensusSpec: slots_per_epoch(32), epochs_per_period(256) — CL 고유 파라미터
- RPC endpoints: consensus_rpc(Beacon API) + execution_rpc(JSON-RPC)
  → Reth는 자체 호스팅, Helios는 외부 의존
- 💡 네트워크 불일치 시: genesis_validators_root 다름 → 부트스트랩 실패

### Viz (3 step):
- Step 0: Network enum 3 변형 — Mainnet/Sepolia/Holesky 카드 + genesis_root 값
- Step 1: ConsensusSpec 파라미터 — slot/epoch/period 시간 계산 시각화
- Step 2: RPC 이중 엔드포인트 — CL(Beacon API) + EL(JSON-RPC) → Helios 내부 연결

## 섹션 3: Persistence — FileDB + MultiRpc
- FileDB: 체크포인트를 디스크에 저장 (checkpoint.ssz, 수십 바이트)
  → warm start: 재시작 시 마지막 체크포인트에서 부트스트랩
  → WS 기간 (~2주) 초과 시 무효화
- MultiRpc: fallback_rpcs 목록 → 주 RPC 다운 시 대체
  → 모든 응답이 Merkle/BLS 검증되므로 악의적 fallback도 안전
- 💡 Reth 비��: Reth는 MDBX에 수백GB 저장, Helios는 수십 바이트

### Viz (2 step):
- Step 0: FileDB — warm start 흐름 (종료→저장→재시작→로드→부트스트랩 생략)
- Step 1: MultiRpc — 주 RPC 실패 → fallback 전환 + "모든 응답 검증됨" 안전 표시
