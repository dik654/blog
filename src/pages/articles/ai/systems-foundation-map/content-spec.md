# AI 시스템 공통 읽기 프레임

## 이 글의 독립 질문

처음 보는 AI 기술을 만났을 때 모델 이름과 용어를 외우기 전에,
입력·상태·계산·경계·검증을 어떻게 찾아 병목과 다음 학습 경로를 정할 것인가?

이 글은 AI 전체 지도가 아니다. 서로 다른 분야를 하나의 계보로 합치지도 않는다.
낯선 시스템을 처음 30분 동안 읽기 위한 저자 설계 진단 프레임이다.

## 범위와 책임

| 범위 | 깊이 | 이 글에서 닫을 질문 |
|---|---:|---|
| 입력 표현 | 깊게 | 외부 현실이 어떤 단위·shape·시간축을 가진 계산 입력이 되는가 |
| 상태 | 깊게 | 무엇이 다음 요청까지 남고, 어디에 저장되며, 언제 무효가 되는가 |
| 계산 소유자 | 깊게 | 어느 module·process·device가 실제 변환과 결정을 수행하는가 |
| 경계 계약 | 깊게 | shape·schema·ordering·freshness·latency 중 무엇이 전달 과정에서 깨지는가 |
| 검증 신호 | 깊게 | 출력이 요구사항에 맞는지 어떤 test·metric·invariant·reward로 판정하는가 |
| 분야별 이론 | 인계 | GPU, Knowledge System, Robot AI, RLVR, MoE 글에서 별도로 전개 |
| 전체 AI 역사 | 제외 | 이 글을 또 다른 연대기나 분야 목록으로 만들지 않음 |

## 쉬운 서사

택배 분류를 먼저 사용한다.

1. 상자와 주소표가 입력이다.
2. 현재 위치와 배송 상태가 다음 단계까지 남는 상태다.
3. 분류기와 배송원이 계산 소유자다.
4. 허브 사이 인계에는 주소·순서·도착 시간 계약이 있다.
5. 올바른 수취인에게 제한 시간 안에 도착했는지가 검증이다.

그다음 같은 질문을 GPU HPC, Knowledge Compiler, Robot AI, RLVR,
MoE SSD streaming에 옮긴다. 용어는 달라져도 조사 순서는 유지된다.

### 첫 화면 계약

1. 공통 경로 헤더는 독자가 아직 배우지 않은 용어를 묶은 질문을 먼저 보여 주지 않는다.
2. 이 글이 첫 글임을 한 줄로 알린 뒤 곧바로 택배라는 익숙한 장면을 보여 준다.
3. 장면에서 이미 이해한 역할에 input·state·owner·boundary·verification이라는 이름을 나중에 붙인다.
4. 이 다섯 이름을 정의한 뒤에만 서로 다른 AI 분야에 적용할 수 있는지 묻는다.
5. 첫 `QuestionLead`는 정의되지 않은 GPU HPC·Knowledge Compiler·Robot AI·RLVR·MoE를 나열하지 않는다.
6. 순서는 `경로 시작 안내 → 익숙한 장면 → 평이한 설명 → 용어 정의 → 실행 흐름 → 판단 질문`을 지킨다.

## 본문 서사

1. **왜 다섯 질문인가**
   - 하나의 요청이 시스템을 통과하는 순서를 먼저 본다.
   - “모델이 느리다”처럼 책임이 없는 문장을 실행 주체와 경계로 분해한다.
2. **상태와 경계를 왜 따로 보는가**
   - 값이 남는 위치와 값이 이동하는 계약은 다른 문제다.
   - cache가 있어도 invalidation이 틀리면 오래된 값을 빠르게 전달한다.
3. **응답 시간을 어디서 잃는가**
   - 입력 표현, 계산, 전달, 대기, 검증 시간을 분리한다.
   - 평균 하나로 합치면 병목 owner가 사라진다.
4. **증상에서 첫 파손 지점으로 역추적**
   - HPC scaling, provenance loss, stale robot sample, reward hacking,
     SSD expert streaming을 동일한 진단 lab에서 비교한다.
5. **다음 글을 어떻게 고르는가**
   - 첫 파손이 compute면 algorithm/kernel로,
   - boundary면 network/schema/runtime으로,
   - verify면 evaluation/safety로 이동한다.

## 수식

응답 시간의 저자 설계 분해:

`T_response = T_repr + T_compute + T_transfer + T_wait + T_verify`

각 항에는 한글 underbrace와 FormulaNote를 붙인다. 이 식은 모든 단계가 직렬이라는
물리 법칙이 아니다. 첫 진단에서 관측 시간을 owner별로 분리하는 장부다.
동시에 실행된 구간은 critical path에서 중복 합산하지 않는다고 본문에 명시한다.

## Viz 계획

### 1. SystemsReadingSequence

- `StepViz`의 다섯 scene을 DOM node로 렌더링한다.
- 작은 SVG 글자를 쓰지 않는다.
- mobile에서는 세로 실행 흐름, wide desktop에서는 가로 흐름이다.
- 현재 단계만 semantic accent, 이전 단계는 완료, 이후 단계는 대기 상태로 보인다.
- 마지막 scene에서 Verify 결과가 다음 요청의 Input·State 수정으로 돌아가는 feedback을 보인다.

### 2. SystemDiagnosisLab

- GPU HPC, Knowledge Compiler, Robot AI, RLVR, MoE streaming 다섯 scenario.
- 각 scenario는 관측 증상, 첫 파손 단계, 근거, 다음 조사 대상을 가진다.
- 사용자가 scenario를 바꾸면 동일한 다섯 단계에서 병목 위치가 이동한다.
- “모든 빨간 단계”가 아니라 최초 계약 파손과 downstream symptom을 구분한다.
- mobile에서 가로 스크롤이 생기지 않도록 selector와 stage를 wrap/grid로 구성한다.

## 숨은 전이 검증

본문을 읽은 사람은 별도 문제 풀이 문단 없이 다음을 판정할 수 있어야 한다.

1. GPU kernel 시간은 그대로인데 8→16 GPU scaling이 나빠졌다. Compute와 boundary 중 무엇을 먼저 측정할까?
2. RAG 답은 유창하지만 인용 링크가 다른 문단을 가리킨다. 어느 계약과 verifier가 필요한가?
3. Robot controller output은 안정적이지만 obstacle 반응이 늦다. Pose보다 먼저 어떤 timestamp·queue evidence를 볼까?
4. RL reward는 상승하고 held-out 정답률은 하락한다. Optimizer 성공과 system 성공을 왜 분리해야 할까?
5. MoE model은 RAM budget에 맞지만 0.08 token/s다. Parameter 수보다 어떤 byte·hit·random-read 지표를 볼까?

## 근거와 저자 의도

- **NASA Systems Engineering Handbook**
  - interface responsibility, verification와 validation의 분리, integrated system test를
    경계·검증 설명의 근거로 사용한다.
  - 다섯 질문의 원문 출처라고 주장하지 않는다.
- **Hidden Technical Debt in Machine Learning Systems**
  - ML code 바깥의 data dependency, glue, configuration, feedback loop가
    system-level failure를 만든다는 근거로 사용한다.
- **What’s Your ML Test Score?**
  - offline metric 하나가 아니라 data, model, infrastructure test와 monitoring이
    production readiness를 구성한다는 근거로 사용한다.
- **ROS 2 QoS documentation**
  - deadline, lifespan, reliability가 message 전달 계약의 구체적 예임을 보여 준다.

## 완료 조건

- 다섯 질문을 각자 정의할 수 있다.
- 증상과 최초 파손 지점을 구분할 수 있다.
- 상태 수명과 경계 계약을 섞지 않는다.
- latency를 owner별 장부로 분해한다.
- 다섯 실제 분야 중 관심 목표로 이어지는 구체적 링크를 고를 수 있다.
- 이 프레임이 분야별 수학·논문·구현을 대체하지 않는다고 설명할 수 있다.
