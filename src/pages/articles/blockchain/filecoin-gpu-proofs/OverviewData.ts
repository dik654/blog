export const sealingPipelineCode = `Filecoin 섹터 봉인(Sealing) 파이프라인:

┌─────────────────────────────────────────────────────┐
│ AddPiece — 클라이언트 데이터를 섹터에 패킹            │
│ → CPU 바운드, I/O 중심                               │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ PreCommit Phase 1 (PC1) — SDR 인코딩                 │
│ → CPU 집약적: SHA-256 해시 체인 (11 레이어)           │
│ → Stacked DRG: d_drg=6 + d_exp=8 = 14 부모/노드     │
│ → 순차적 의존성 → GPU 가속 불가 (깊이 강건 그래프)    │
│ → 32GiB 섹터: 352GiB 그래프 데이터 생성              │
│ → ~3-5시간 (SHA-NI 지원 CPU 필수: AMD Zen+)         │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ PreCommit Phase 2 (PC2) — Merkle Tree 구축           │
│ → ★ GPU 가속: Poseidon₁₁ Column Hash + 8-ary Tree   │
│ → TreeC (칼럼 커밋) + TreeR (레플리카) 구축           │
│ → GPU: 10-20분 (pc2_cuda: ~2.5분) / CPU: 수 시간    │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ WaitSeed — 체인에서 랜덤 시드 대기 (150 에포크)       │
│ → ~75분 대기 (인터랙티브 PoRep 보안)                  │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ Commit Phase 1 (C1) — 도전-응답 준비                  │
│ → CPU: Merkle 포함 증명 경로 추출                     │
│ → ~10초 (매우 빠름)                                   │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ Commit Phase 2 (C2) — Groth16 zk-SNARK 증명 생성     │
│ → ★ GPU 가속: MSM + FFT/NTT (bellperson + sppark)    │
│ → SDR 증명이 ~3MB → Groth16으로 압축                  │
│ → GPU: ~20-30분 / CPU: 수 시간                       │
└───────────────────────┬─────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│ SubmitProof — 증명을 체인에 제출                      │
│ → 온체인 검증 (Groth16 Verifier)                     │
└─────────────────────────────────────────────────────┘

GPU가 필수인 단계: PC2 (Poseidon Merkle), C2 (Groth16)
CPU만 사용하는 단계: PC1 (SDR), C1 (Merkle 경로)`;

export type GPURequirementRow = {
  stage: string;
  operation: string;
  vram: string;
  gpu: string;
};

export const gpuRequirementRows: GPURequirementRow[] = [
  { stage: 'PC2', operation: 'Poseidon 해시 (Merkle Tree)', vram: '>5GiB (최소), 24GB 권장', gpu: 'RTX 3090, 6000+ CUDA 코어' },
  { stage: 'C2', operation: 'Groth16 (MSM + NTT)', vram: '>11GB', gpu: 'RTX 3090, A100' },
  { stage: 'WindowPoSt', operation: 'Groth16 (증명 갱신)', vram: '>10GiB, 3500+ CUDA 코어', gpu: 'RTX 3080+, 128GiB RAM' },
  { stage: 'WinningPoSt', operation: 'Groth16 (블록 생성)', vram: '>6GB', gpu: 'RTX 3070+' },
];
