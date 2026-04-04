export const basicHotStuffCode = `HotStuff 기본 (Basic HotStuff):

PBFT와 달리 "Star topology" — 모든 통신이 리더를 경유

  Replicas     Leader      Replicas
     │           │            │
     │←─Prepare──│──Prepare──→│   Phase 1: Prepare
     │──Vote────→│←──Vote─────│   (PBFT Pre-Prepare에 해당)
     │           │            │
     │←PreCommit─│─PreCommit─→│   Phase 2: Pre-Commit
     │──Vote────→│←──Vote─────│   (PBFT Prepare에 해당)
     │           │            │
     │←─Commit───│──Commit───→│   Phase 3: Commit
     │──Vote────→│←──Vote─────│   (PBFT Commit에 해당)
     │           │            │
     │←─Decide───│──Decide───→│   Phase 4: Decide (실행)

통신 복잡도: O(n) per phase — Star topology
  → 리더가 n개 메시지 수신 → Threshold Signature 집계
  → 하나의 QC(Quorum Certificate)로 전파

PBFT: 모든 노드 → 모든 노드 (O(n²))
HotStuff: 모든 노드 → 리더 → 모든 노드 (O(n))

메시지 지연: 7 (Basic HotStuff)
  Prepare(2) + Pre-Commit(2) + Commit(2) + Decide(1) = 7 delays
  → PBFT(5 delays)보다 길지만, 선형 복잡도로 확장성 우월`;

export const chainedHotStuffCode = `Chained HotStuff — 단계를 겹쳐서 처리:

View 1: Block₁ ─── Prepare ────────────────────────
View 2: Block₂ ─── Prepare ─── Block₁ Pre-Commit──
View 3: Block₃ ─── Prepare ─── Block₂ Pre-Commit ─── Block₁ Commit──
View 4: Block₄ ─── Prepare ─── Block₃ Pre-Commit ─── Block₂ Commit ─── Block₁ Decide

각 view에서:
  1. 새 블록을 Prepare
  2. 이전 블록을 Pre-Commit (genericQC)
  3. 2단계 전 블록을 Commit (lockedQC)
  4. 3단계 전 블록을 Decide (commitQC)

→ 매 view마다 하나의 투표로 여러 블록의 진행을 동시 처리
→ 이더리움의 "블록 파이프라인"과 유사한 개념
   (slot N 제안 + slot N-1 어테스테이션이 동시 진행)`;

export type ViewChangeRow = {
  protocol: string;
  normalPath: string;
  viewChange: string;
};

export const viewChangeRows: ViewChangeRow[] = [
  { protocol: 'PBFT', normalPath: 'O(n\u00B2)', viewChange: 'O(n\u00B3) \u2014 별도 프로토콜' },
  { protocol: 'Tendermint', normalPath: 'O(n\u00B2)', viewChange: 'O(n\u00B2) \u2014 단순 라운드 증가' },
  { protocol: 'HotStuff', normalPath: 'O(n)', viewChange: 'O(n) \u2014 정상 경로와 동일!' },
  { protocol: '이더리움', normalPath: 'O(n) 위원회 내', viewChange: '없음 (fork choice가 대체)' },
];
