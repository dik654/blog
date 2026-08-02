# 04 · GPU 커널 스택 (CUDA/Triton) — 보강만, 신규 금지

- **상태**: **보강 소스만** — gpu/flashattention-io-triton 글을 **codex가 지금 집필 중** (untracked 신규 파일). 충돌 방지를 위해 이 주제로 별도 글 만들지 말고, codex 글이 커밋된 뒤 빈 곳에만 채움.
- **차선 위치**: gpu/gpu-hpc-from-scratch (역시 codex 진행 중), 기존 cuda-shared-memory 계열.

## 원 대화 핵심

- ✅ Mamba류 모델은 논문보다 GPU kernel 최적화가 훨씬 어렵다.
- 이해해야 하는 수직 스택: 수식 → CUDA → Triton → Tensor Core → Memory Access → Warp Scheduling.
- ✅ FlashAttention 팀처럼 알고리즘 + CUDA + Compiler + GPU를 모두 이해하는 연구자는 매우 드묾 — "아키텍처의 성패가 커널 인력 풀에 좌우된다"는 관찰.

## 보강 포인트 (codex 글 커밋 후)

- 03 노트와 연결: Mamba가 밀린 이유의 절반은 커널 생태계(FlashAttention은 있고 selective-scan 최적화 인력은 희소) — 아키텍처 경쟁이 사실상 커널 엔지니어링 경쟁이라는 프레임.
- "수식→warp까지의 수직 스택" 목록은 flashattention-io-triton 글의 도입 훅으로 적합한지 대조.

## 채우기 전 확인

- codex의 flashattention-io-triton 완성본을 먼저 읽고 중복 판정 — 이미 담겼으면 이 노트는 폐기(merged 표기).
