export const SEALING_CODE = `// Filecoin Sealing 프로세스 (6단계)
1. Add Piece   — 데이터 조각 → 32GB 섹터 채우기
2. PC1 (Pre-Commit 1)
   — Stacked DRG 그래프 생성 (SHA-256)
   — 11 레이어 × 2^30 노드
3. PC2 (Pre-Commit 2)
   — Tree C (Poseidon 해시, GPU)
   — Tree R (복제 증명 머클 트리)
4. Wait Seed   — 150 에포크 대기 (~75분)
5. C1 (Commit 1) — 챌린지 & 포함 증명 생성
6. C2 (Commit 2) — Groth16 zkSNARK 증명`;

export const PERF_CODE = `// SupraSeal 성능 개선 요약
// 참조 플랫폼: Threadripper PRO 5995WX (64코어)

PC1 처리량:
  기존: 섹터당 4코어, 15-30개 병렬
  최적화: 코어당 4섹터, 64개 병렬 → 16배 향상

메모리 사용량:
  기존: 1-2 TB RAM
  최적화: 256 GB RAM → 75% 감소

PC1 소요시간: 3시간 30분 (이론 최적 3시간 26분)
PC2: GPU 가속 Poseidon 해시 (RTX 4090)
C2:  GPU 가속 Groth16 증명`;
