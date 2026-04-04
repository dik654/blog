export const vertexCertCode = `Narwhal의 기본 단위:

Vertex (정점):
┌──────────────────────────────┐
│ author:  검증자 ID            │
│ round:   라운드 번호           │
│ payload: 트랜잭션 배치(batch)  │  ← 이더리움의 "블록 바디"에 해당
│ parents: 이전 라운드 인증서들   │  ← 이더리움의 "parentHash"와 유사
│ signature: 서명               │     하지만 여러 부모를 참조
└──────────────────────────────┘

Certificate (인증서):
┌──────────────────────────────┐
│ vertex:  원본 vertex          │
│ votes:   2f+1 검증자 서명     │  ← 이더리움의 "어테스테이션"과 유사
│                               │     해당 데이터가 가용함을 증명
└──────────────────────────────┘

이더리움 비교:
  이더리움: 1 proposer → 블록 → 모든 노드가 검증
  Narwhal:  n proposer → 각자 vertex → 상호 검증 → Certificate`;

export const roundFlowCode = `Round r 진행:

1. 각 검증자가 자신의 vertex 브로드캐스트
   - payload: 새로운 트랜잭션 배치
   - parents: Round r-1의 인증서 2f+1개 이상

2. 다른 검증자들이 vertex를 수신하고 검증
   - 부모 인증서가 유효한가?
   - payload가 올바른가?

3. 유효하면 서명을 보내줌 (vote)

4. 원저자가 2f+1 서명을 모아 Certificate 생성
   → 이 Certificate가 "데이터 가용성 증명"

5. Certificate를 다음 라운드의 vertex에 포함
   → DAG가 점진적으로 구축됨

이더리움의 블록 파이프라인과 비교:
  Slot N: 제안 → 어테스테이션 → 다음 블록에 포함
  Narwhal: Vertex → Votes → Certificate → 다음 라운드 참조
  → 유사한 구조이지만 n개가 동시에 진행`;

export const workerArchCode = `Narwhal Primary-Worker 분리:

┌─────────────────────────────────────────────┐
│ Primary (DAG 관리)                           │
│  - Certificate 생성 & 검증                   │
│  - DAG 구축 (vertex = batch digest 참조)     │
│  - 라운드 진행 관리                           │
│  → O(n) 통신 — digest만 교환                 │
├─────────────────────────────────────────────┤
│ Worker 1        Worker 2        Worker 3     │
│ (batch 수집)    (batch 수집)    (batch 수집)  │
│ (데이터 전파)    (데이터 전파)    (데이터 전파)  │
│  → 대역폭 집약적 작업을 분산                   │
└─────────────────────────────────────────────┘

이더리움 비교:
  이더리움: 단일 proposer가 전체 블록 바디를 전파 (병목)
  Narwhal:  n개 Primary × m개 Worker가 동시에 전파 (병렬)
  → 벤치마크: 50 검증자에서 ~125k-297k TPS`;
