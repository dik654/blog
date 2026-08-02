# Triton Kernel Programming: Program에서 검증까지 content spec

## Goal
- 독자가 Triton을 “Python 문법으로 CUDA를 대체하는 도구”가 아니라 block tensor program, 주소·mask, fusion, autotune, compiler lowering과 검증 계약으로 재구성하도록 한다.
- 독자가 새 custom kernel을 만들 때 reference 의미, 경계 shape, 실제 memory traffic과 end-to-end 효과를 스스로 증명하게 한다.

## User intent and scope boundary
- 현재 목표인 FlashAttention·efficient LLM kernel 바로 아래에 필요한 Triton 최소 바닥만 둔다.
- CUDA 전체 역사, 모든 Triton API, FlashAttention algorithm 자체와 vendor별 assembly 튜닝은 이 글에 넣지 않는다.
- 상위 사례는 `flashattention-io-triton`, 계산·memory·profile 바닥은 CUDA 글로 연결한다.
- 공식 tutorial의 수치와 지원 범위를 보편적 성능으로 확대하지 않는다.

## Hard internal questions
작성된 본문만 읽고 다음 문제의 풀이 전략에 도달해야 한다.

1. `N=17`, `BLOCK_SIZE=8`일 때 program 수, 각 offset과 masked tail을 계산할 수 있는가?
2. Triton program과 CUDA thread를 동일시하면 `tl.arange`, reduction과 block tensor를 왜 잘못 이해하는가?
3. Transpose tensor의 shape가 같아도 contiguous 주소식이 틀릴 수 있는 이유를 stride로 설명할 수 있는가?
4. Masked softmax lane의 `other`가 0이 아니라 `-inf`여야 하는 이유를 max와 exp 단계로 증명할 수 있는가?
5. Fused softmax의 이득을 “kernel 하나”가 아니라 제거한 DRAM read/write 원소 수로 계산할 수 있는가?
6. Autotune의 winner가 다른 shape, dtype, GPU에서 유지된다고 말할 수 없는 이유와 재현 ledger를 설계할 수 있는가?
7. 빠른 결과가 나왔을 때 compile, async launch, warmup과 cache가 섞인 잘못된 benchmark를 찾아낼 수 있는가?
8. Reference mismatch와 performance regression을 static/device assert, interpreter, sanitizer, IR dump와 profiler 중 올바른 층에서 좁힐 수 있는가?

## Source ledger
| Source | Why chosen | Claim boundary |
|---|---|---|
| Triton Vector Addition tutorial | program_id, offset, mask, cdiv, reference와 benchmark의 최소 공식 예제 | 예제 block size와 측정 수치를 일반 최적값으로 쓰지 않음 |
| Triton Fused Softmax tutorial | DRAM traffic 장부, reduction, padding, resource/occupancy의 공식 연결 | row가 SRAM에 맞는 특정 matrix class라는 조건 유지 |
| Triton Matrix Multiplication tutorial | 2D tile mapping, grouped ordering, autotune config | tutorial config를 모든 backend의 최적값으로 확대하지 않음 |
| Triton make_block_ptr API | shape, strides, offsets, block_shape, order의 공식 계약 | block pointer가 자동으로 최적 layout을 보장한다고 주장하지 않음 |
| Triton Debugging guide | static/device debug, interpreter, sanitizer 역할 분리 | interpreter의 bf16·indirect access 제한 유지 |
| Triton official repository | compiler 목적, backend와 IR/debug 환경 변수의 현재 기준 | 버전별 지원 범위는 고정 사실로 쓰지 않고 재검증 요구 |

## Full-scope map
| Topic | Must cover | Depth | Evidence | Why omission is risky |
|---|---|---|---|---|
| Program model | grid, program_id, block tensor | deep | formula + StepViz | CUDA thread와 혼동 |
| Offset and mask | cdiv, arange, tail coverage | deep | interactive mapping lab | OOB 또는 tail 누락 |
| Pointer layout | shape, stride, direct/block pointer | deep | address formula | transpose·slice 오답 |
| Fusion | softmax traffic and reduction | deep | traffic formula | kernel count만 보고 최적화 |
| Numerical contract | other, approximate exp, tolerance | medium | prose + test gates | 빠른 오답 출시 |
| Autotune | finite configs, keys, cold/warm cost | deep | argmin formula + StepViz | 한 shape 과적합 |
| Compiler | frontend → Triton IR → LLVM/backend | medium | StepViz + official repo | compiler가 알아서 최적화한다는 오해 |
| Debug and release | reference, odd/stride/dtype, sanitizer, profiler | deep | six gates | correctness와 performance 증거 분리 실패 |
| FlashAttention algorithm | online softmax and IO schedule | defer | linked article | 기존 독립 글이 소유 |
| CUDA internals | warp, shared memory, tiling, roofline | defer | linked CUDA path | 기반 글 중복 방지 |

## Narrative design
1. 길이 17, block 8 문제로 program 단위를 만든다.
2. Interactive lab에서 cdiv와 tail mask를 직접 바꾼다.
3. 2D shape를 실제 pointer로 바꾸는 stride 계약으로 내려간다.
4. Softmax를 통해 fusion이 줄이는 traffic과 수치 경계를 계산한다.
5. Autotune을 제한된 config의 shape별 실측 선택으로 한정한다.
6. Compiler lowering은 필요한 순간 확인할 수 있는 층으로 설명한다.
7. Correctness, address, resource, timing, end-to-end와 portability gate로 출시 계약을 닫는다.

## Formula contract
### Grid and offset
- Formula: `P = ceil(N/B)`, `i = pid B + r`, `mask = i < N`
- 반드시 설명할 연산 이유: 올림이 tail coverage를 보장하고 mask가 올림으로 생긴 빈 lane의 접근을 차단한다.

### Strided address
- Formula: `addr(i,j) = p0 + i s_i + j s_j`
- 반드시 설명할 연산 이유: 논리 좌표를 축별 실제 memory 간격으로 바꾼 뒤 합한다.

### Fused traffic
- Formula: official tutorial의 naive reads/writes와 ideal fused read/write ledger
- 반드시 설명할 연산 이유: bandwidth-bound 시간은 중간 tensor를 포함한 전체 DRAM 이동에 묶인다.

### Autotune choice
- Formula: `c* = argmin median T(c; shape, dtype, hardware)`
- 반드시 설명할 연산 이유: 유한 후보 중 측정 시간이 가장 작은 config를 고르며 key와 환경이 달라지면 다시 선택해야 한다.

모든 display 수식 바로 아래에 한글 `FormulaNote`를 1:1로 둔다.

## Prose-to-viz handoff
### TritonKernelFlowViz
- Scene 0: host grid → program_id → block tensor. Program과 thread를 구분한다.
- Scene 1: offsets → mask/boundary → load/store. 주소 생성과 유효성 검사를 분리한다.
- Scene 2: unfused softmax HBM 왕복과 fused on-chip path를 비교한다.
- Scene 3: 세 config와 shape-local measured winner를 보인다.
- Scene 4: frontend → IR/backend → correctness → performance evidence를 닫는다.

### TritonProgramMappingLab
- Controls: `N=10/17/32`, `BLOCK_SIZE=4/8/16`.
- Output: program count, allocated slots, masked count, pid별 offset cell.
- State invariant: 유효 offset은 정확히 `0..N-1`, masked count는 `cdiv(N,B)B-N`.
- Test hooks: length, block, program count, masked count와 lane valid 상태를 raw `data-*`로 노출한다.

## Evaluation contract
- 390×844, 768×1024, 1440×900에서 document와 Viz horizontal overflow가 1px 이하다.
- 모든 control은 최소 44px이고 selected state가 보인다.
- 기본 lab은 `N=17`, `B=8`, program 3, masked 7이다.
- `N=32`, `B=16`으로 바꾸면 program 2, masked 0이다.
- StepViz 5개 scene을 button과 keyboard focus로 전환할 수 있다.
- display formula 4개와 `FormulaNote`가 1:1이며 raw LaTeX와 `.katex-error`가 없다.
- 공식 primary source 링크와 상위 FlashAttention, 하위 CUDA 링크가 존재한다.
- learning path는 `FlashAttention → Triton → tiled matmul → shared memory → profiler` 순서다.

## Intent log for smaller-model reproduction
- Registry와 사용자 개념 목록을 비교해 Triton이 FlashAttention 글의 한 절에만 있고 일반 kernel 실행 계약이 없음을 찾았다.
- 독립 글의 중심을 API 목록이 아니라 모든 kernel에서 반복되는 invariant인 `grid → offsets → valid memory → fused compute → measured config → evidence`로 좁혔다.
- 공식 tutorial 세 개를 난이도 순서가 아니라 invariant를 증명하는 source로 배치했다.
- 수식은 기호 번역에서 멈추지 않고 올림, 곱셈, 합과 argmin을 쓰는 이유 및 어느 failure를 막는지 설명했다.
- Viz는 장식 대신 tail coverage를 실제 입력으로 검산하고 compiler·release 순서를 재생하는 도구로 만들었다.
- FlashAttention과 CUDA 세부는 링크로 소유권을 분리해 글이 무한히 과거로 내려가지 않게 했다.

## Coverage recheck
| Scope item | Covered by | Remaining gap |
|---|---|---|
| Program·tail | program-model + lab | 2D launch lab은 matmul 글로 defer |
| Pointer·stride | pointer-mask | tensor descriptor 심화는 별도 compiler 글 후보 |
| Fusion·numeric | fusion-reduction | full online softmax는 FlashAttention 글이 소유 |
| Autotune | autotune | production cache invalidation 구현은 framework별 글 후보 |
| Compiler·debug | compiler-debug | IR dialect op 전체 목록은 공식 docs로 defer |
| Release evidence | six gates | 실제 GPU benchmark는 hardware CI가 있는 구현 글에서 추가 |
