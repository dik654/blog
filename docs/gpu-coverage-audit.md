# GPU 누락 검수 · 2026-10-04

## 범위와 기준선

공개 catalog loader가 반환한 기존 GPU 51편의 실제 import closure와 graph 소유 위치를 대조했습니다. 파일시스템에 남은 과거 본문은 현재 공개 정본으로 세지 않았습니다. 이 검수는 CUDA·AMD·HBM 요구에 해당하는 원리와 연결의 누락을 찾는 작업이며, 51편의 모든 문장을 새로 사실 검증했다는 선언은 아닙니다.

| 기준선에서 확인한 공백 | 실제 변경 |
|---|---|
| CUDA 입문에 숫자 하나의 실행 경로와 전체 공식 소스가 부족함 | `cuda-basics`를 64개 배열·37번 원소·148B 주소로 추적하는 10단계 글로 재작성 |
| 요청량·HBM 전송·latency와 throughput이 섞임 | `gpu-memory-hierarchy-and-roofline`을 sector 계산과 실제 측정의 경계로 재작성 |
| AMD 실행 구조와 CUDA 이식의 정본이 없음 | `amd-gpu-execution-and-hip` 신설. Wave·CU·VGPR·SGPR·LDS·MFMA·WMMA와 HIP 이식의 경계를 설명 |
| HBM 적층과 실제 메모리 접근을 잇는 정본이 없음 | `hbm-stack-and-memory-requests` 신설. TSV·interface 폭·channel·bank·행·열·refresh와 코드 요청을 연결 |
| 기존 네 정본과 신규 설명의 연결이 약함 | `hw-memory`, `cuda-thread-hierarchy`, `sm-warp-scheduling-and-issue`, `ai-accelerator-vendor-comparison`의 해당 설명·링크 보강 |
| Blackwell TMEM 정본에 실물 명령 발췌가 부족함 | 기존 `ai/sionic-glm-b300`에 PTX 9.0 MMA와 commit/parity wait 원문, target 지원 경계 추가 |
| 390px 코드 패널의 고정 파일 목록이 코드 영역을 좁힘 | CodeSidebar의 모바일 파일 목록을 접을 수 있게 바꾸고 설명 영역의 가독성을 조정 |

기존 두 글을 심화하고 새 글 두 편을 추가했습니다. 학습 문제는 각 글의 기초 6개·심화 4개로 총 40개입니다. 새 graph 개념은 7개이고 관계는 9개이며 기존 개념과 정본을 재사용했습니다.

## 수치·조건 오류의 변경 전후

| 변경 전 | 변경 후 | 1차 자료 |
|---|---|---|
| Uncoalesced 접근의 sector 증가를 HBM 전송과 load latency의 같은 증가율로 단정 | 요청 계층의 주소 범위 계산과 cache·병합·쓰기 정책 뒤의 DRAM counter·실제 시간을 구분 | [CUDA 13.0.2 Best Practices](https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html) |
| Pipe 사용률 80%를 compute-bound 판정 문턱처럼 사용 | 명령별 자원·의존성과 counter의 범위를 함께 검증하며 고정 비율만으로 원인을 확정하지 않음 | [CUDA 13.0.2 Best Practices](https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html) |
| CDNA3의 64KB LDS를 AMD GPU 전체로 일반화할 위험 | CDNA4의 160KB와 CDNA3의 64KB를 구별. CDNA wave64와 HIP에서 지원하는 RDNA wave32 조건을 명시 | [CDNA4 whitepaper](https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-4-architecture-whitepaper.pdf) |
| HBM 폭·적층 수·응답 지연이 직접 비례하는 것처럼 읽힐 공백 | 인터페이스 폭×pin 전송률의 이론 대역폭, 적층 용량, 개별 응답 지연을 구별 | [HBM3 PHY](https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm3-phy.html) |
| Stride 8 예시에 충분한 입력 길이가 드러나지 않음 | 32개 lane의 마지막 입력은 index 248이므로 최소 249개 입력이 필요함을 명시 | [CUDA memory accesses](https://docs.nvidia.com/cuda/archive/13.0.2/cuda-c-best-practices-guide/index.html) |
| Scheduler 4개·SM 132개를 GPU의 일반 규칙으로 읽을 위험 | Hopper H100 대상 수치와 명령별 issue·pipe 상한으로 한정 | [Hopper 공식 구조](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/) |
| Blackwell이라는 이름만으로 모든 SKU에 tcgen05를 일반화할 위험 | PTX 9.0 target notes로 명령 지원을 구분하고 sm_120의 자동 지원을 추론하지 않음 | [PTX tcgen05 target notes](https://docs.nvidia.com/cuda/archive/13.0.2/parallel-thread-execution/index.html#tcgen05-mma-instructions-mma) |

## 같은 사례의 산술 검산

- 입력은 64개×4B×2개 배열=512B입니다. 출력은 64개×4B=256B이고 유효 데이터 합계는 768B입니다.
- NVIDIA에서 block 64 threads는 warp 2개입니다. Thread 37은 warp 1의 lane 5이며 CDNA의 wave64에서는 wave 0의 lane 37입니다. 같은 원소의 byte offset은 37×4=148B입니다.
- 정렬된 32×4B 요청은 32B sector 4개에 걸칩니다. 시작을 4B 옮기면 5개, stride 2이면 8개, stride 8이면 32개입니다. 이 수를 HBM 명령 수나 load latency로 바로 바꾸지 않습니다.
- 가정한 1TFLOP/s·1TB/s의 ridge는 1FLOP/B입니다. 64/768=1/12FLOP/B인 덧셈의 대역폭 상한은 약 83.3GFLOP/s이며 실제 실행시간을 측정한 값이 아닙니다.
- 가정한 1TB/s×500ns=500,000B=500KB는 정상 상태의 평균 진행 중 데이터 양입니다. 요청 하나가 0.5MB라는 뜻이 아닙니다.
- HBM3의 1024bit×8Gb/s/pin÷8=1.024TB/s입니다. 768B/1.024TB/s=0.75ns는 포화된 처리량의 비율이며 첫 응답이나 kernel의 실제 지연이 아닙니다.
- HBM4의 2048bit 폭에 같은 pin 속도를 가정하면 2.048TB/s입니다. 제품 출하·제품별 실효 전송률·개별 응답 지연에 대한 주장은 아닙니다.

## 고정한 공식 원문과 실제 코드

- CUDA 13.0.2, PTX ISA 9.0, Blackwell Tuning Guide 13.0.2.
- CUDA Samples v13.0 commit `3f1c50965017932fc81e6d94a3fc9e04c105b312`: `vectorAdd.cu` 전체와 BSD notice를 보존했습니다.
- HIP 7.0.0 문서, ROCm HIP-Examples commit `cdf9d101acd9a3fc89ee750f73c1f1958cbd5cc3`: 공식 vector add 전체와 MIT notice를 보존했습니다. 예제 하나가 모든 ROCm 장치의 지원이나 성능을 대표하지 않습니다.
- AMD CDNA4 whitepaper 2258402-C(2025-10-01)를 대조했습니다.
- HBM3/4 PHY 공개 설명은 2026-10-04에 확인했습니다. 공개되지 않은 GPU 주소 bit→channel·bank 매핑은 만들지 않았습니다.
- B300의 `TmemSource.tsx`에서 공식 PTX의 MMA와 commit/parity wait를 각각 열 수 있습니다. 원문 조각을 블로그용 의사코드로 바꾸지 않았습니다.

## 실제 검수 결과

| 검사 | 범위와 결과 | 기록 |
|---|---|---|
| 실제 브라우저 | GPU 8개 경로×1440/390, 16개 화면 실패 0 | `output/playwright/sweep/2026-10-03T19-23-46/summary.json` |
| 학습 계약 | GPU 심화 4편과 B300 총 5편, strict·require-registration 최종 통과 | `/tmp/gpu-learning-final.log` |
| 도식 | HbmPhysicalViz 정적 스타일 통과 | 해당 실제 source 감사 |
| 문장 | 심화 4편을 8조각으로 나누어 humanize. 최종 gate 8개 통과, golden 검사 모두 PASS | `/tmp/gpu-humanize/summary.json` |
| 실제 코드 UI | 390/1440에서 코드 열기와 파일 목록 접기, 원문 표시 확인. PTX 두 화면도 실제 확인 | `/tmp/gpu-code-390-fixed.png`, `/tmp/gpu-code-1440-fixed.png`, `/tmp/ptx-code-390.png`, `/tmp/ptx-code-1440.png` |
| 한국어 등록 정보 | learning·evidence·graph 정의와 문제의 띄어쓰기·조사 최종 교정 | `/tmp/gpu-registration.json` |

브라우저 8개 경로는 심화 4편과 `hw-memory`, `cuda-thread-hierarchy`, `sm-warp-scheduling-and-issue`, `ai-accelerator-vendor-comparison`입니다. B300은 별도 코드 UI와 학습 계약으로 확인했습니다. CUDA·HIP 장치 실행이나 성능 benchmark는 이 환경에서 재현하지 않았습니다. 검증한 것은 숫자·주소 산술, 고정한 공식 원문과 화면 동작입니다.

새 AMD·HBM 글의 카테고리 입구와 단계별 읽기 경로는 `src/content/category-reading-paths.ts`에 통합했습니다. AI 최신 원문 대조와 후속 검수는 [AI 검수 기록](ai-coverage-audit.md)에 기록했습니다.

## 기존 51편의 요청 범위 대조

아래의 유지 판정은 이번 요구에서 새 정본을 중복 생성하지 않았다는 뜻입니다.

| 공개 정본 | import closure | 이번 처리 |
|---|---:|---|
| gpu/ai-accelerator-vendor-comparison | 13개 파일 | 제품 비교 정본 유지, CUDA·HIP 실제 소스 연결 |
| gpu/b300-switchless-network | 12개 파일 | 기존 정본 유지 |
| gpu/cfd-finite-volume-gpu | 3개 파일 | 기존 정본 유지 |
| gpu/cuda-basics | 3개 파일 | 10단계 전체 재작성, 공식 코드와 64개 원소 추적 |
| gpu/cuda-compilation-and-isa-analysis | 2개 파일 | PTX·SASS 정본 재사용 |
| gpu/cuda-kernel-fusion | 3개 파일 | 기존 정본 유지 |
| gpu/cuda-matrix-multiply | 3개 파일 | 기존 정본 유지 |
| gpu/cuda-perf-analysis | 3개 파일 | 기존 정본 유지 |
| gpu/cuda-persistent-kernels | 3개 파일 | 기존 정본 유지 |
| gpu/cuda-register-pressure | 5개 파일 | register spill 정본 재사용 |
| gpu/cuda-shared-memory | 6개 파일 | NVIDIA bank·coalescing 정본 재사용, AMD와 조건 구분 |
| gpu/cuda-sync-streams | 6개 파일 | 기존 정본 유지 |
| gpu/cuda-thread-hierarchy | 6개 파일 | 37번 원소의 warp·lane과 AMD 비교 연결 |
| gpu/cutlass-collectives-and-tile-schedulers | 2개 파일 | 기존 정본 유지 |
| gpu/cutlass-gemm-hierarchy-and-cute-layouts | 2개 파일 | 기존 정본 유지 |
| gpu/datacenter-site-readiness | 13개 파일 | 기존 정본 유지 |
| gpu/ec-gpu-gen | 3개 파일 | 기존 정본 유지 |
| gpu/ec-gpu-ops | 3개 파일 | 기존 정본 유지 |
| gpu/filecoin-gpu-proofs | 5개 파일 | 기존 정본 유지 |
| gpu/gemmini-pe-mac-dataflow | 4개 파일 | 기존 정본 유지 |
| gpu/gpu-arch-hopper | 3개 파일 | 기존 정본 유지 |
| gpu/gpu-architecture | 11개 파일 | 기존 정본 유지 |
| gpu/gpu-collective-network | 5개 파일 | 기존 정본 유지 |
| gpu/gpu-data-movement-optimization | 2개 파일 | 기존 정본 유지 |
| gpu/gpu-interconnects | 5개 파일 | 기존 정본 유지 |
| gpu/gpu-memory-hierarchy-and-roofline | 3개 파일 | 10단계 전체 재작성, 요청 계층과 실제 측정 구분 |
| gpu/gpu-proof-pipeline | 3개 파일 | 기존 정본 유지 |
| gpu/gpu-witness-gen | 3개 파일 | 기존 정본 유지 |
| gpu/hw-gpu-comparison | 3개 파일 | 기존 정본 유지 |
| gpu/hw-memory | 9개 파일 | DIMM 설명 유지, HBM 물리 구조 연결 |
| gpu/hw-network | 5개 파일 | 기존 정본 유지 |
| gpu/hw-nvme-storage | 3개 파일 | 기존 정본 유지 |
| gpu/hw-power-cooling | 3개 파일 | 기존 정본 유지 |
| gpu/hw-server-vs-desktop | 3개 파일 | 기존 정본 유지 |
| gpu/hw-storage-comparison | 3개 파일 | 기존 정본 유지 |
| gpu/icicle-framework | 3개 파일 | 기존 정본 유지 |
| gpu/kzg-gpu | 3개 파일 | 기존 정본 유지 |
| gpu/megakernel-design-tradeoffs | 2개 파일 | 기존 정본 유지 |
| gpu/modded-rtx4090-moe-serving | 27개 파일 | 기존 정본 유지 |
| gpu/msm-gpu-impl | 3개 파일 | 기존 정본 유지 |
| gpu/msm-ntt | 3개 파일 | 기존 정본 유지 |
| gpu/ntt-gpu-impl | 3개 파일 | 기존 정본 유지 |
| gpu/poly-ops-gpu | 3개 파일 | 기존 정본 유지 |
| gpu/poseidon-gpu | 3개 파일 | 기존 정본 유지 |
| gpu/rapidsnark-gpu | 3개 파일 | 기존 정본 유지 |
| gpu/rdma-roce | 5개 파일 | 기존 정본 유지 |
| gpu/server-cpu-lineup-comparison | 13개 파일 | 기존 정본 유지 |
| gpu/sm-warp-scheduling-and-issue | 2개 파일 | Hopper 수치 범위와 issue·pipe 해석 보강 |
| gpu/triton-kernel-programming-and-compiler | 2개 파일 | 기존 정본 유지 |
| gpu/warp-specialization-and-async-pipelines | 2개 파일 | TMA·WGMMA·mbarrier 정본 확인 및 CUDA·B300에서 연결 |
| gpu/warp-stall-reasons-and-issue-utilization | 2개 파일 | 기존 정본 유지 |


## 2026-10-04 최종 DoD 보강

- 화면 h2와 catalog TOC를 1–10절로 통일했다. teach-system의 S/B/0…7은 `data-teach-level`에 보존했다. 각 예측 질문을 실제 설명과 대조해 답 절을 고쳤고, 본문의 절 참조도 맞췄다. 예측 horizon이나 scan의 연산 단계 수는 절 번호와 구별해 유지했다.
- GPU4+AI5의 strict learning은 9편 모두 통과했다. `/tmp/gpu-ai-learning-dod.log`
- 9편의 390/1440 화면 18개가 오류 없이 통과했다. `output/playwright/sweep/2026-10-03T20-18-22/summary.json`은 별도 발견한 기존 autoencoder 두 글의 첫 실패 기록도 함께 보존한다. 실패한 두 글은 수정 후 `2026-10-03T20-20-03/summary.json`의 네 화면에서 모두 통과했다.
- 공개 감사 범위의 도구 수정은 `/tmp/audit-scope-fix.md`에 원인·변경·반례 테스트를 기록했다. 신규 4개 및 기존 경로 4개 테스트 총 8개 통과. 본문 closure 영향은 이번 9편에 한정되고 기존 나머지 790편은 바뀌지 않았다.
- 현재 9개 본문 SHA-256 기록: `/tmp/gpu-ai-dod-source-hashes.json`. 본문 내용의 임의 baseline 갱신은 하지 않았으며 최종 topology 판단은 root가 검토한다.
- GPU4 본문과 설명 UI에서 남은 숫자·영문 붙여쓰기를 추가 교정했다. 교정 전후 숫자열 동일성을 검증했다. `/tmp/gpu-spacing-final.json`
- `npx tsc --noEmit -p tsconfig.app.json --pretty false` 종료 코드 0. `/tmp/gpu-ai-dod-tsc-app.log`. 전체 production build는 root의 통합 검수에서 실행한다.

- 전역 sweep에서 추가 발견한 기존 fusion/collective 그림의 폭 넘침을 수정했다. 일반 sweep뿐 아니라 실제 figure의 fusion 5개 장면×두 화면 및 collective 두 화면, 총 12개 canvas를 직접 검사해 overflow 0을 확인했다. `/tmp/gpu-existing-viz-fix.md`, `/tmp/gpu-viz-specific.json`.
