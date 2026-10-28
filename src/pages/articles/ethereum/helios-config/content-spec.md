# Helios 설정·운영 글 계약

## 질문

Helios 0.12.0은 설정·checkpoint·RPC를 실제로 어떤 순서로 시작하며, 운영 플랫폼은 어느 상태를 보고 traffic을 허용하고 실패 시 되돌려야 합니까?

## 트랙

`practice`

이 글은 checkpoint proof와 consensus update를 다시 설명하지 않습니다. `helios-bootstrap`, `helios-consensus`, `helios-state`의 정확한 anchor에서 시작해 운영 책임만 다룹니다.

## 고정 사례

`run-17`

- Base port: 8545
- TOML port: 9545
- CLI port: 10545
- Checkpoint 표기: C17
- 수치는 흐름 설명용이며 대상 환경 측정값이 아닙니다.

## 실제 구현 기준선 [O]

- Release: a16z/helios 0.12.0
- Commit: `2af9b41887e069144ee56cd710f3ddca195473f8`
- Config merge: Base → TOML → CLI
- Initial checkpoint: explicit → FileDB → network default
- FileDB: truncate 후 32-byte write, exact 32-byte load, malformed/read failure는 default
- Checkpoint age: strict=true이면 error, false이면 warning 뒤 bootstrap 검증 계속
- Client 시작: JSON-RPC task와 consensus sync가 겹칠 수 있음
- `wait_synced`: consensus Synced와 initial latest/finalized block을 기다림
- External fallback: 가장 최신 epoch에서 가장 자주 나온 root를 선택하지만 공식 문서가 untrusted source라고 경고

## 운영 제안 [A]

- Config provenance receipt
- CL/EL identity·capability preflight
- `strict_checkpoint_age=true`
- 자동 external fallback 기본 비활성
- Sync·initial block·대표 proof-backed read 뒤 Service 편입
- 이전 binary·redacted config·checkpoint backup으로 candidate rollback

## 아직 없는 근거 [M]

- 대상 환경 startup p50·p95
- 대표 readiness probe 시간
- Fallback 실패율과 복구 시간

## 절 순서

1. 시작 계약과 전체 상태 흐름
2. 입력과 상태 소유권
3. Socket·sync·Service readiness
4. Checkpoint age·FileDB·fallback
5. 대안·실험·rollback·ADR
6. 확인 질문과 부모 지도 반환
