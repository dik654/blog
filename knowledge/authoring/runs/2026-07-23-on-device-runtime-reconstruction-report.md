# On-device LLM Runtime 학습 경로 재구성 보고서

이 문서는 새 글의 요약이 아니라, `효율 추론 · On-device`를 device release에서 최소 실행 기반으로 내려가는 경로로 바꾼 판단 기록이다. 같은 이름의 JSON은 작은 모델이 후속 작업을 재현할 수 있도록 문제 fixture, 원문 경계와 검증 oracle을 보존한다.

## 1. 기존 한 편에 두 질문이 섞여 있었다

기존 `efficient-inference-on-device`는 weight byte, bandwidth roofline, PTQ·QAT·native low-bit, MTP·speculative decoding, KV와 CPU·GPU·NPU 배치를 깊게 설명했다. 그러나 checkpoint가 실제 phone app artifact가 되는 export, backend partition, fallback trace, app lifecycle과 thermal release가 없었다. 이 내용을 같은 글에 더 넣으면 model 예산과 runtime 실행 계약이 다시 섞인다.

- `00 · Device Runtime`: checkpoint, exported graph, dynamic bound, KV mutation, target precision, partition·delegate, `.pte`, app lifecycle, Inspector와 physical-device release.
- `01 · Memory·속도 예산`: weight·KV·arena byte, bandwidth roofline, low-bit 선택, speculative decode와 device resource 배치.

부모는 두 child를 단순 폴더로만 보이지 않고 실제 두 글의 current-first 경로를 이어 보여 준다. 최신 실행 목표에서 시작한 뒤 정밀도와 hardware floor까지만 내려가므로 모든 chip ISA와 compiler 역사를 먼저 읽지 않는다.

## 2. 새 글의 독자 계약

독자는 “4B INT4가 8GB에 들어간다”를 release 근거로 받아들이지 않는다. 다음 순서를 재구성해야 한다.

1. Checkpoint와 example input에서 prefill·decode, context upper bound와 KV mutation을 export contract로 고정한다.
2. Target backend가 실제 지원하는 dtype·packing·operator 기준으로 graph를 변환한다.
3. Partitioner가 delegate와 portable fallback 영역을 나누고 target별 artifact를 만든다.
4. Delegation report를 node 수만 보지 않고 Inspector time, boundary byte와 synchronization에 연결한다.
5. Weight, KV, arena, delegate workspace, app/runtime와 OS reserve를 resident memory로 합친다.
6. 명시적 load, UI thread 밖 generate, callback·error·stop·reset lifecycle을 연결한다.
7. Cold, warm, 5분, 15분 physical-device trace에서 latency, memory, energy와 quality를 동시에 통과시킨다.

이 계약 때문에 XNNPACK, Core ML과 QNN은 하나의 범용 `.pte`가 아니라 target별 artifact와 manifest로 다룬다. Portable fallback은 정확성 보험이지 성능 보장이 아니다.

## 3. 원문 근거와 주장 경계

- ExecuTorch 1.3 LLM docs: checkpoint→export→runner의 현재 공식 경로에 사용했다. 지원 model·backend·CLI를 영구 API로 일반화하지 않았다.
- Custom LLM export docs: `ExportedProgram`, edge lowering, partitioner와 delegation report의 책임 경계에 사용했다. 모든 target이 같은 quantization과 operator를 지원한다고 확대하지 않았다.
- Inspector·memory planning docs: ETRecord·ETDump event와 planned tensor arena에 사용했다. Delegate, tokenizer, app와 OS memory까지 planner가 전부 계산한다고 쓰지 않았다.
- Android LLM runner: explicit load, synchronous generate, callback·stats·error·stop·resetContext의 app lifecycle에 사용했다. UI threading과 제품 error policy는 앱 책임으로 남겼다.
- Android Power Profiler, Apple Instruments·MetricKit: physical-device power·thermal evidence에 사용했다. Device 전체 rail을 model 단독 energy라고 과장하지 않았다.

최소 바닥은 현재 runtime contract와 hardware memory hierarchy다. 오래된 compiler IR, allocator와 DVFS 논문은 Inspector나 device trace가 원인을 설명하지 못할 때만 연다.

## 4. 본문만으로 풀어야 하는 비공개 전이 문제

### Trace A · 싼 shape fallback

- Delegate: linear 184 nodes/58ms, attention 32/26ms, norm·activation 96/12ms.
- Fallback: shape·assert 412/5ms, boundary work 8/11ms.
- 정답: node coverage `42.6%`, time coverage `85.7%`, boundary `96 MiB`, total `112ms`.

### Trace B · 비싼 attention fallback

- Delegate: elementwise 600 nodes/15ms, linear 184/58ms.
- Fallback: attention 32/52ms, shape 12/2ms, boundary work 4/18ms.
- 정답: node coverage `94.2%`, time coverage `50.3%`, boundary `768 MiB`, total `145ms`.

독자는 본문만으로 94% node coverage인 Trace B가 더 나쁜 deployment인 이유를 설명해야 한다. 값싼 node 개수는 많지만 비싼 attention과 큰 tensor 왕복이 전체 시간의 절반을 차지하기 때문이다.

### 8GB release fixture

- Usable app budget `6.2 GiB`.
- 4B INT4 weight `2.2 GiB`, KV `96 KiB/token`, arena `0.7 GiB`, runtime+app `0.45 GiB`.
- Default: 8K context, 15분, attention fallback.
- 정답: resident `4.10 GiB`, TTFT `6.24s`, decode `5.8 tok/s`, energy `62 mJ/token`.
- Gate: TTFT `≤3s`, decode `≥10 tok/s`, resident `≤6.2 GiB`, energy `≤65 mJ/token`.

Memory에는 들어가지만 latency와 throughput이 깨지므로 release를 거부해야 한다. Cold full delegation의 `2.80s`, `14.8 tok/s`, `42mJ/token`은 원인 진단일 뿐이며, 같은 설정의 15분 trace 전에는 최종 승인하지 않는다.

## 5. 수식과 Viz를 검산 도구로 만들었다

표시 수식 네 개는 node/time coverage, boundary cost, resident memory와 sustained release gate를 맡는다. 모든 수식 안에 한글 역할 설명을 넣고 바로 뒤 `FormulaNote`에서 기호와 적용 경계를 설명한다. 360px에서 수식 overflow 0, scale 0.70 이상, 실제 KaTeX 글자 12px 이상을 자동 검증했다.

- `EdgeExportPipelineLab`: XNNPACK·Core ML·QNN을 바꾸고 export→precision→partition→serialize→app trace의 입력, 출력, invariant와 failure를 읽는다.
- `DelegationCoverageLab`: shape fallback, attention fallback, full delegation을 전환해 node와 time coverage가 왜 다른지 계산한다.
- `DeviceReleaseLab`: 4B/9B, 2K/8K, cold/5분/15분, full/fallback을 바꾸며 memory·TTFT·TPS·energy gate를 fail closed로 판정한다.

기존 예산 글의 두 HTML table은 모바일 가로 스크롤을 없애고, 각 선택의 적용 시점·유리한 조건·먼저 확인할 실패를 읽는 결정 셀로 바꿨다. Viz 색은 의미 상태에만 제한하고, 직선 연결 장식이나 자동 animation 없이 실제 조작과 진단에 집중했다.

## 6. 4B·9B 모델로 좁혀 재현하는 packet

4B 모델에는 한 section의 한 인과 경계만 준다.

```text
source claim 1개
-> 허용 주장 / 금지 과장
-> checkpoint·graph·delegate 중 현재 경계
-> 수식 1개 또는 Viz state 1개
-> exact numeric oracle
-> viewport·console·overflow acceptance
```

9B 모델에는 한 release trace를 준다.

```text
제품 증상
-> export contract
-> partition / fallback
-> node·time·boundary evidence
-> resident memory
-> app lifecycle
-> sustained release gate
-> source boundary와 stop rule
```

오케스트레이터는 두 글의 책임 분리, target별 artifact, 공통 숫자, private transfer problem, 공식 원문 경계, browser QA와 public deployment를 유지한다. 작은 모델 출력은 prose 전에 `claim/evidence/boundary/equation/viz-state/test` IR로 받는다.

## 7. Claude 협업 기록

사용자 지시대로 context-manager의 `curator`에 두 글의 책임 분리, 읽기 순서, 최소 역사 중단점, 세 Viz와 빠진 개념을 독립 검토 요청했다. 요청은 `Provider error: All providers failed` HTTP 500으로 종료됐다. Direct Claude CLI로 우회하지 않았고, 실패를 숨기지 않았다. 구현은 ExecuTorch·Android·Apple 공식 문서 대조, private transfer problem과 Playwright 수치 oracle으로 검증했다.

## 8. 검증과 배포 결과

- Targeted ESLint와 `git diff --check`: 통과.
- Production build: 통과.
- 개발 서버 관련 회귀: `56/56` 통과.
- 로컬 production contract: `6/6` 통과.
- 공개 URL contract: `6/6` 통과.
- 검증 viewport: 360, 390, 768, 1440px.
- 표시 수식/한글 설명: 4/4.
- 새 글과 기존 예산 글의 article HTML table: 0.
- Document overflow, formula overflow, console error, raw LaTeX: 0.
- `cm-blog.service` 재시작: 2026-07-23 00:42:33 KST.
- 배포 chunk: `on-device-llm-runtime-DmyJ9qXu.js`, `37,675 bytes`.
- SHA-256: `ea3ccf7800cbe9df73d1955a2d7223a4bbc6f55428cb230bc7a0734ddae65429`.

전역 learning-flow audit는 등록 글 584편의 연속성을 다시 산출했다. 기존 corpus에는 release blocker 29개, prerequisite backlog 405개와 local connection backlog 474개가 남아 있으므로 전체 목표는 완료 처리하지 않는다. 이번 On-device 경로를 완료한 뒤 다음 우선순위 경로로 이어간다.
