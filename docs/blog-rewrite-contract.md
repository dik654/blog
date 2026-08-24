# Blog rewrite contract

이 문서는 블로그의 새 글, 레거시 재작성, Viz 현대화에 공통으로 적용하는 정본이다.
대화에서 새 요구가 추가되면 먼저 이 문서의 해당 기준에 병합한 뒤 구현한다. 수정 파일 수나
build 통과는 완료의 증거가 아니며, 아래 Definition of Done을 모두 확인해야 한 글이 끝난다.

## 1. 글의 입구와 탑다운 흐름

- 첫 문단은 독자가 왜 이 개념을 알아야 하는지, 어떤 문제에서 등장하는지 자연스럽게 설명한다.
- 세부 용어를 나열하기 전에 전체 구조와 글의 질문을 먼저 보여 준다.
- 기본 흐름은 `문제와 위치 → 전체 메커니즘 → 구성 요소와 수식 → 한계·비교 → 구현·운영 판단 → 다음 읽기`다.
- 대주제 아래 아티클이 하나뿐이면 불필요한 중간 목록을 만들지 않고 바로 글로 연결한다.
- 논문은 숨겨진 badge가 아니라 근거 지도와 해당 본문에서 명확한 제목·역할로 드러나야 한다.
- 선행 글과 후속 글은 “관련 글”로만 나열하지 않고, 무엇을 알고 들어오며 다음 글에서 무엇을 확장하는지 설명한다.

## 2. 설명의 깊이

- 정의와 사용처만 나열한 개론으로 끝내지 않는다.
- 각 핵심 개념은 `해결하려는 문제`, `아이디어`, `계산 경로`, `성립 전제`, `trade-off`, `실제 선택 기준`까지 다룬다.
- Kernel fusion처럼 한 비용을 줄이는 성능 최적화는 절감한 launch·traffic만 쓰지 않는다. 새로 늘어난 register live range·shared memory·occupancy 제약·spill·divergence·scheduling 비용을 같은 실행 경계에서 보여 주고, 작은 수치 반례와 end-to-end ROI gate까지 설명한다. Thread당 한도와 SM 전체 자원처럼 단위가 다른 숫자를 같은 한도로 표현하지 않는다.
- 초심자에게 필요한 선수 개념은 처음 등장할 때 한 문단 또는 연결 글로 설명한다.
- 전문 용어를 없애지 않는다. 업계 표준 용어는 그대로 사용하고 처음 한 번 자연스러운 한국어 설명을 붙인다.
- 원 논문, 공식 specification, 공식 구현을 우선 근거로 삼는다. 현재 상태가 중요한 내용은 최신 원문을 다시 확인한다.
- 주장을 논문 결과와 일반 법칙으로 혼동하지 않는다. 실험 조건과 적용 범위를 함께 쓴다.
- 새 model family와 branded architecture를 다룰 때는 공식 technical report·model card·공개 config의 정확한 release 이름, version 또는 revision, 기준일을 먼저 고정한다. 비공식 약어·이전 preview license·서로 다른 checkpoint의 수치를 섞지 않으며, 명칭을 바로잡을 때는 잘못된 이름을 새 alias처럼 지식 그래프에 남기지 않는다.
- 두 연구 계열을 결합한 구조는 한쪽의 단선적 `진화형·상위호환`으로 설명하지 않는다. 각 계열이 해결하는 병목, 결합 지점, 새 비용을 독립 축으로 보여 주고, component ablation은 해당 model scale·data·metric 범위까지만 주장한다. 작은 진단 model의 loss 개선을 full-scale model의 benchmark·latency 원인으로 확대하지 않는다.
- 행동주의·뇌·노이즈 캔슬링 같은 비유는 직관을 여는 설명 장치로 표시하고 수학적 mechanism과 일대일 대응시키지 않는다. model class와 학습 알고리즘처럼 층위가 다른 항목의 비교(`SNN 대 backprop` 등)는 category mismatch를 먼저 바로잡은 뒤 같은 층의 비교축으로 다시 쓴다.
- Roadmap·strawmap·research prototype·alpha처럼 성숙도가 다른 항목을 한 목록에 섞지 않는다. 각 항목마다 `현재 배포됨 / 채택 검토 중 / 연구 방향 / 실험 결과` 중 상태와 기준 시점을 먼저 표시하고, 방향성을 최종 채택·일정·성능 보장으로 확대하지 않는다.
- 암호 primitive를 바꾸는 접근과 기존 primitive를 그대로 두고 proof/execution layer를 최적화하는 접근은 별도 설계 축으로 비교한다. Field·instruction 표현의 impedance mismatch, prover·verifier·proof size, 구현 생태계와 cryptanalysis history를 같은 표에서 비교하고 단일 benchmark만으로 장기 primitive 선택을 결론내리지 않는다.
- Hybrid sequence model은 `전체 layer 수 × KV shape`로 cache를 계산하지 않는다. 먼저 공개 config의 layer pattern을 `full attention / linear attention·recurrent mixer`로 나누고, token 수에 따라 커지는 attention KV와 request마다 고정되는 recurrent·convolution state를 별도 tensor shape·dtype으로 계산한다. Prefill의 chunk/parallel form과 decode의 recurrent form, logical bytes와 allocator·TP·kernel의 physical bytes도 서로 다른 claim으로 표시한다.

### 2.1 선수 개념과 학습 결과 계약

- 제목·입구·concept flow에서 처음 등장하는 약어와 전문용어를 독자가 이미 안다고 가정하지 않는다.
- 각 전문 글의 입구는 `핵심 아이디어 → 단계별 설명 순서 → 작은 예`까지만 보여 주고 실제 수업 본문으로 바로 이어진다. `필요한 최소 선수 개념`, `이 글 안에서 처음 설명한 용어`, 개념 그래프와 연습문제는 본문을 가로막는 사전 과제가 아니라 본문 뒤의 복습 도구로 둔다.
- 새 용어는 하나씩 `무엇인가 → 왜 필요한가 → 가장 작은 형태·상태 Viz → 성립하지 않는 경계`로 공개한다. 아직 정의하지 않은 용어 여러 개를 제목이나 첫 문단에 조합하지 않으며, 구성요소를 각각 설명할 수 있게 된 뒤에만 수식·pipeline·release gate에서 조합한다. 이 순서는 일부 예시 글이 아니라 공개 article 전체의 공통 입구와 개별 본문에 적용한다.
- 공통 수업 Viz는 개념명을 숨긴 장면 번호 목록이나 텍스트 카드 나열로 만들지 않는다. 실제 개념명과 단계 연결을 한 화면의 overview map으로 항상 보여 주되, 입력·처리·판정·기록·상태를 서로 다른 도형으로 그리고 SVG 연결선과 화살촉으로 흐름을 연결한다. 재생 중에는 현재 연결선의 진행 방향도 움직임으로 보여 준다. 선택한 노드만 `장면 → 정의 → 앞뒤 형태 → 예시 → 경계` 스토리보드로 확대한다. 기본 화면에서는 다섯 요소를 함께 볼 수 있어야 하며, 재생할 때만 5컷을 순서대로 펼친다.
- 단계별 설명 순서는 단어·chip 목록으로 끝내지 않는다. 각 단계가 왜 다음 단계로 이어지는지 문장으로 설명하고, learning contract의 작은 수치·실행 예를 하나 이상 함께 보여 준다.
- 긴 용어 정의는 좁은 다중 열에 밀어 넣지 않는다. `이 글 안에서 처음 설명하는 용어`는
  데스크톱에서도 한 열의 article 폭을 사용하고, 390px와 1440px에서 정의·현재 글에서의 역할을
  문단처럼 읽을 수 있는 본문 크기와 행간으로 렌더링돼야 한다.
- 새 용어·state·schema field가 세 개 이상 나오면 쉼표나 `·`로 한 문단에 압축하지 않는다. `TermBreakdown`처럼 `용어 한 줄 → 쉬운 설명 → 작은 예 → 다른 필드와의 경계`가 세로로 반복되는 구조를 사용하고, 독자가 각 줄을 설명할 수 있게 된 뒤에만 조합 문장으로 돌아간다.
- 기존 fixture·receipt·benchmark 필드처럼 정의가 아니라 검증 목록인 긴 문단은 가운데점마다 실제 줄을 나누고 다음 항목을 `—`로 시작한다. 목록과 새 개념 정의를 같은 UI로 오인하지 않는다.
- 선수 개념이 별도 canonical article에 있으면 설명 없이 링크만 던지지 않고, 현재 글을 읽는 데 필요한 한 문장 정의와 연결 이유를 함께 쓴다.
- 본문을 쓰기 전에 기초 문제 6개와 심화 문제 4개를 먼저 만든다. 각 문제에는 정답 체크리스트, 필요한 concept node, 답을 제공할 본문 section을 명시하며 개수도 learning audit에서 강제한다.
- 글을 다 읽은 뒤 독자가 해당 문제를 이 글만으로 풀 수 있는지 역으로 검토한다. 체크리스트의 일부를 본문에서 찾을 수 없으면 내용을 보강한 뒤 다시 검사한다.
- Definition·수식·방법 목록이 존재하는 것만으로 깊이가 충족됐다고 보지 않는다. 각 학습 결과에 대해 `아이디어 → 계산/실행 경로 → 전제 → 반례·한계 → 선택 기준`이 본문에 있어야 한다.
- 선수 지식은 현재 카테고리의 용어에서 멈추지 않는다. 수학·통계·물리·컴퓨터 구조·분산 시스템처럼 설명에 실제로 필요한 더 아래 개념이 나오면 같은 knowledge graph의 prerequisite node로 등록한다.
- 선수 node의 canonical 설명도 다시 자신의 선수 지식을 선언해야 한다. 이 연결을 재귀적으로 따라갔을 때 `entryLevel` 글 또는 일상적인 관찰에서 시작하는 설명에 도달해야 하며, 중간에 정본 글이나 anchor가 비어 있으면 원 글도 완료로 보지 않는다.
- 링크를 열어야만 문장을 이해할 수 있게 쓰지 않는다. 현재 글에는 흐름을 잇는 짧은 직관과 기호 역할을 남기고, 별도 정본 글은 유도·증명·추가 예제까지 깊게 내려갈 때 사용한다.
- 독립된 수학·기초과학 글은 사전식 용어 모음이 아니라 이후 여러 글이 재사용하는 계산 능력을 목표로 한다. 예를 들어 벡터 글을 읽은 뒤에는 norm·dot product·projection을 계산하고, 정리의 부등식이 어디에 쓰이는지 설명할 수 있어야 한다.
- 이 규칙은 수학에 한정하지 않는다. 통계 개념은 표본·확률·분포와 추정의 출발점까지, 물리 개념은 관측량·단위·차원·좌표계와 필요한 보존 법칙까지, 컴퓨터 구조는 bit·memory·instruction·병렬 실행까지, 분산 시스템은 node·message·failure model까지 실제 설명에 필요한 바닥을 별도 canonical article로 닫는다.
- 물리식이나 공학식을 소개할 때는 기호 정의만 붙이지 않는다. 어떤 관측량을 재는지, 단위가 어떻게 맞는지, 어떤 이상화와 좌표계에서 성립하는지, 작은 수치 예와 적용할 수 없는 조건을 함께 설명한다.
- 물리·화학·생물·지구과학의 canonical concept는 `scientificGrounding`에 관측량·단위와 차원·모델 전제·작은 측정 예·성립하지 않는 조건을 기록한다. 물리 concept는 좌표계·기준계도 필수로 기록하며, learning audit에서 이를 강제한다.
- 선수 글은 단지 더 쉬운 용어를 나열하는 페이지가 아니다. 상위 글에서 요구하는 기초·심화 문제를 실제로 풀 수 있는 계산·추론 능력을 만들어야 하며, 필요 이상의 대학 과목 전체를 선행 조건으로 걸지는 않는다.

### 2.2 논문 해설 경로

- Evidence rail의 논문은 원문 링크만 제공해서는 안 된다. 현재 글 안의 paper reading note 또는 별도 canonical paper article로 이어지는 내부 경로를 함께 제공한다.
- Paper reading note는 최소한 `논문이 해결한 문제`, `핵심 아이디어/기여`, `중요 가정`, `실험 범위`, `일반화하면 안 되는 결론`을 다룬다.
- 논문 자체의 방법·유도·ablation이 독립적인 학습 대상이면 별도 canonical article로 분리한다. 현재 글의 근거 한 부분이면 얕은 논문 요약 글을 만들지 않고 해당 section에 통합한다.
- 별도 논문 article을 만들 때는 논문 제목이 sidebar와 근거 지도에서 보이고, 원 개념 글과 양방향으로 연결되어야 한다.

### 2.3 코드 분석형 글의 소스 근거

- Reth·Prysm·CometBFT·Filecoin·Helios처럼 실제 오픈소스 codebase의 동작을 추적하는 글은
  "코드 분석형" 글이다. 이 글들은 spec·paper 근거만으로 완료되지 않으며, 설명하는 각 단계마다
  실제 source 함수를 `CodeSidebar`/`CodeViewButton`(`@/components/code`)로 열람할 수 있어야
  한다. Pin한 codebase 스냅샷을 `codebase/`에 두고, 함수명·파일 경로·줄 범위를 실제 코드와
  맞춰 `codeRefs`에 등록하며, 최소 핵심 단계마다 한 개 이상의 `CodeViewButton`을 본문에 심는다.
- 개념적으로 순수한 수학·이론 글(예: 암호 primitive 이론, ML 개념)은 이 요구에서 제외된다.
  판단 기준은 "이 글이 특정 오픈소스 구현의 동작을 설명하는가"이다.
- `TermBreakdown`·`ExplainedFormula`로 개념과 수식을 설명하는 새 글 형식(`ModernArticle`
  패턴)도 코드 분석형 주제라면 이 요구에서 면제되지 않는다. 개념 설명과 실제 코드 근거는
  같은 글 안에서 함께 있어야 하며, 하나가 다른 하나를 대체하지 않는다.
- `codeRefs`의 `desc`는 "문제 → 해결"을 한 문장씩 담고, `annotations`는 강조한 줄 범위가
  왜 그 역할을 하는지 설명한다. 함수 이름과 실제 line 번호가 없는 "구현 근거" 문단(예:
  generic한 "Reth transaction-pool source" 링크 하나만 인용)은 코드 분석형 글의 완료 근거로
  보지 않는다.

### 2.4 결과 공식의 유도 완전성

- 최종 공식(training loss, closed-form solution, complexity bound 등)이 더 근본적인 원리
  (MLE→ELBO, Lagrangian duality, Taylor 전개, chain rule, 대수적 항등식, 보존 법칙 등)를 여러
  단계 거쳐 유도된 결과라면, "이 공식이 맞다"는 결론만 제시하지 않는다. 유도 경로 전체가 최소
  한 곳 — 이 글 본문, 또는 이 글이 명시적으로 연결하는 canonical 선수 글 — 에 실제로 있어야
  한다.
- 논문·외부 자료 citation은 유도를 대신하지 않는다. Evidence rail의 citation은 "이 결과가
  어디서 왔는가"의 출처이지 "왜 이 결과가 맞는가"를 설명하는 문장이 아니다. 2.2절의 paper
  reading note 요구와 같은 논리로, 유도 자체가 독립적인 학습 대상이면 별도 canonical article로
  분리하고 현재 글은 그 글로 이어지는 명시적 경로와 "왜 이 유도를 거쳤는지" 한 문단 요약을
  남긴다. 논문 인용 블록의 `contribution` 필드에 유도 단계를 한 줄로 요약해 두는 것은 유도를
  실었다는 근거가 아니다.
- 판단 기준: "독자가 이 공식을 암기하지 않고 처음부터 다시 만들어낼 수 있는가?" 다시 만들 수
  없다면 유도가 빠진 것이다.
- 이 요구는 AI/ML에 한정하지 않는다. 암호학 proof, 물리 보존 법칙 유도, 통계 estimator의
  unbiasedness·consistency 증명, 분산 시스템의 correctness proof처럼 "왜 이 결과가 성립하는가"가
  핵심인 모든 분야에 적용한다.
- Knowledge graph에 등록할 때 "최종 결과"만 concept으로 넣지 않는다. 유도 경로의 핵심 분기점
  (예: variational bound로의 전환, closed-form이 가능해지는 조건, reparameterization)도 각각
  독립 concept으로 등록해, `audit:graph`가 유도 경로 자체의 존재를 정합성 검사로 대리 확인할 수
  있게 한다. 최종 결과 concept 하나만 있고 그 결과를 만든 중간 concept이 하나도 없으면 유도가
  생략됐다는 신호다.

### 2.5 구현 가능성

- 이해 가능성과 구현 가능성은 다른 기준이다. 2.4가 "왜 이 결과가 맞는가"를 요구한다면, 이
  절은 "이걸 읽고 실제로 코드를 짤 수 있는가"를 요구한다. 알고리즘·training procedure·sampling
  loop·protocol처럼 구체적 절차가 있는 concept은 수식과 별개로 `AlgorithmBlock`
  (`@/components/ui/algorithm-block`)으로 입력→단계별 연산→출력을 pseudocode로 적는다.
- Pseudocode는 특정 언어 문법이 아니라 언어 무관 표기를 쓴다. 목표는 PyTorch·NumPy·Rust
  어디로든 한 줄씩 그대로 옮길 수 있는 정밀도이지, 특정 framework API를 가르치는 것이 아니다.
- 판단 기준은 2.4와 짝을 이룬다: "독자가 이 공식을 처음부터 다시 만들어낼 수 있는가?"(2.4)에
  더해 "독자가 이 절차를 지금 바로 코드로 옮길 수 있는가?"(2.5). 수식만 있고 절차가 없으면
  독자는 "왜 맞는지는 알지만 어떻게 짜는지는 모르는" 상태로 남는다.
- 이 요구도 AI/ML에 한정하지 않는다. 암호 프로토콜의 message flow, 분산 합의의 state machine,
  압축·인덱싱 알고리즘의 단계처럼 "순서가 있는 절차"가 핵심인 모든 concept에 적용한다. 반대로
  순수 정의나 존재성 증명처럼 절차가 없는 concept에는 억지로 pseudocode를 만들지 않는다.
- CodeSidebar(2.3)와 역할이 다르다. CodeSidebar는 "이 실제 오픈소스가 어떻게 구현했는가"를
  보여주고, AlgorithmBlock은 "이 개념 자체를 처음부터 구현하려면 어떤 절차인가"를 보여준다.
  코드 분석형 글은 실제 구현이 있으니 AlgorithmBlock으로 재발명하지 않고 CodeSidebar를 쓴다.
- 완결성을 감사할 때는 "교과서라면 이걸 다뤘을 것"이라는 추정보다 "PyTorch·NumPy·SciPy 같은
  표준 라이브러리가 실제로 이 concept를 어떻게 구현·문서화했는가"와 대조하는 쪽이 더 객관적이고
  반박하기 어려운 기준이다. 벡터·norm·gradient·복소수처럼 "순수 수학"으로 보이는 concept도
  거의 항상 실제 구현체(`torch.norm`, `numpy.fft`, `torch.autograd` 등)가 있다 — 이 글의 설명이
  그 구현체의 동작·인자·edge case를 이해하는 데 충분한지로 완결성을 판단한다. 실제 구현이 없는
  순수 이론 concept에서만 교과서 기준으로 되돌아간다.

## 3. 수식 설명

모든 주요 KaTeX 식은 다음 순서를 지킨다.

1. 이 식이 답하는 질문
2. 왜 이 형태로 설계했는지에 대한 아이디어
3. KaTeX 식
4. `\underbrace`, `\overbrace`, `\substack`, `\text`로 식 안의 각 연산이 필요한 이유
5. 기호 각각의 역할
6. 성립 전제와 생략한 차원·조건
7. 식에서 읽어야 할 결과와 읽으면 안 되는 과도한 결론

새 본문에서는 `ExplainedFormula`를 사용한다. 식을 먼저 보여 주고 아래에서 사후 설명하지
않는다. 기호 사전만으로 설명을 끝내지 않고, 곱은 무엇을 결합하거나 mask하는지, 합은 어떤
기여를 어느 범위까지 누적하는지, 나눗셈은 무엇을 기준으로 정규화하는지를 KaTeX 주석 식으로
직접 보여 준다. 모든 `ExplainedFormula`는 식의 실제 항을 사용하는 `annotatedFormula`와
도메인 의미를 적은 `operations`를 명시한다. `operations`의 각 `expression`은 `annotatedFormula`에
실제로 등장하는 기호를 그대로 써서, 독자가 "이 설명이 식의 어느 조각을 말하는가"를 한눈에
대응시킬 수 있어야 한다. 공통 fallback(제네릭 `\text{요인}_1\times\text{요인}_2` 류)은 전환 중인
레거시 식이 빈 화면이 되지 않게 하는 임시 표현일 뿐 완료 근거가 아니다 — fallback은 실제 식의
기호를 담지 않으므로 "왜 하는지" 문장만 남고 "어떤 조각을 말하는지"는 사라진다. `audit:formula
-- --strict --require-explicit`에서 식 하나씩 이를 검사한다. 단순 표기나 이미 충분히 설명된
inline math에는 이 블록을 반복하지 않는다.

수식이 그리는 관계가 threshold·monotonic 증가·piecewise saturation처럼 그래프로 볼 때 더 잘
읽히면, `ExplainedFormula` 옆에 실제 함수 그래프(순수 수학 함수는 `mafs`, 데이터 계열 비교는
`recharts`)를 추가한다. 이 그래프는 상태 전이나 pipeline을 그리는 mechanism Viz(4장)를
대체하지 않으며, "입력이 바뀌면 식의 출력이 어떻게 움직이는가"라는 별도 질문에 답한다. 모든
식에 그래프가 필요한 것은 아니다 — AND/OR gate처럼 이산적인 조건식에는 흐름을 보여 주는
mechanism Viz가 더 적합하다.

## 4. Viz

세부 시각 규칙은 [viz-design-standard.md](./viz-design-standard.md)를 따른다.

- 한 Viz에는 한 메커니즘만 담고 `원인 → 계산/상태 변화 → 결과`가 보이게 한다.
- 레거시 Viz는 의미 관계를 조사하는 참고 자료일 뿐이다. 조악한 내부 컴포넌트·좌표·스타일을
  다시 import하거나 감싸서 재사용하지 않고, pipeline·state machine·comparison 중 관계에 맞는
  표현을 골라 새 responsive Viz를 처음부터 만든다. 실제 article import closure에는 새 Viz만 둔다.
- 시간 순서가 이해에 필요한 메커니즘은 재생·일시정지·직접 단계 선택이 가능한 설명형 animation을
  사용한다. 움직임은 입력·상태 변화·결과를 드러내야 하며 장식용 무한 반복은 금지한다.
  `prefers-reduced-motion`에서는 자동 진행과 이동 animation을 끈다.
- gradient, glow, blur, dot grid, 굵은 선, 과도한 radius와 shadow를 금지한다.
- 긴 설명을 박스나 SVG `<text>`에 넣지 않는다.
- 비교 Viz는 같은 비교축과 parameter·FLOP·memory 예산을 명시한다.
- 좌표 검사를 통과해도 실제 폰트가 넘칠 수 있으므로 데스크톱·모바일 렌더를 직접 확인한다.

## 5. 한국어와 용어

- 직역투를 피하고 개발자·연구자가 실제로 사용하는 표준 용어를 유지한다.
- `시킨 말`, `검사를 닫는다`, `결과를 버렸다`처럼 문맥에 맞지 않는 표현을 쓰지 않는다.
- 의미가 이어지는 문장을 짧은 `~다. ~다.` 목록으로 잘게 끊지 않는다. 원인·관찰·결론이
  자연스럽게 연결되는 문단으로 쓴다.
- 내부 조어를 표준 용어처럼 제시하지 않는다. 꼭 필요하면 정의와 이 글에서만 쓰는 이유를 밝힌다.
- 같은 개념의 표기는 글마다 바꾸지 않는다. 첫 등장 이후에는 같은 용어를 일관되게 사용한다.
- `A·B·C·D`, `A, B, C, D`처럼 이름만 이어 붙인 문장은 설명으로 보지 않는다. 세 항목 이상을 소개할 때는 의미 단위마다 줄을 바꾸고, 각 항목이 답하는 질문과 반례를 붙인다.

## 6. 중복과 확장성

- 현재 공개 article 수·slug·제목을 보존하는 것을 목표로 삼지 않는다. Knowledge graph의 학습 단위가 기존 route 경계를 넘으면 article을 새로 만들고, 한 글에 독립 수업이 여러 개면 분리하며, 같은 수업이 중복되면 병합한다. 잘못된 이름은 바꾸고 더 이상 독립 학습 가치가 없는 route는 redirect를 남긴 뒤 제거할 수 있다.
- Article CRUD는 `create → canonical owner·catalog·learning/evidence 등록`, `split → concept owner·본문·문제·근거를 새 route로 이동`, `merge → 중복 정의를 한 정본으로 통합`, `rename → 제목·slug·내부 링크·이전 URL redirect 갱신`, `delete → 대체 정본·redirect·orphan 검사`까지 한 작업이다. 파일을 복사하거나 catalog 숫자만 늘리는 것은 create가 아니다.
- Route topology는 전체 catalog를 주기적으로 다시 계산한다. 처음 소유하는 concept 수, 실제 import closure의 section·길이, 독립 stage와 제목의 병렬 주제를 `npm run audit:topology`로 검토하되, 휴리스틱 결과를 자동 분할 명령으로 사용하지 않고 본문의 학습 질문·선수 경계·canonical ownership으로 최종 판단한다.
- 한 글은 “제품이나 분야 하나”가 아니라 “독자가 한 번에 쌓을 수 있는 하나의 설명 arc”를 소유한다. 예를 들어 RLHF·DPO·CAI·ORPO·KTO가 한 제목에 있다는 이유로 하나의 글을 유지하지 않으며, 각 방법이 독립된 문제·수식·failure mode·선택 기준을 가지면 별도 글로 분리한다.
- 공통 정의와 핵심 유도는 하나의 canonical article이 소유한다.
- 다른 글에서는 필요한 만큼만 요약하고 해당 anchor로 연결한다. 같은 긴 설명과 Viz를 복제하지 않는다.
- 글 흐름, 근거, Viz, 구현 파일을 분리해 새 모델·논문·개념을 추가할 때 기존 내용을 전부 다시 쓰지 않게 한다.
- sidebar와 category map은 본문의 실제 읽기 흐름과 일치해야 하며, 소분류 하나 때문에 불필요한 클릭을 추가하지 않는다.

### 6.1 지식 그래프 갱신 규칙

- Article CRUD와 knowledge graph 갱신은 앞뒤로 한 번씩 끝나는 절차가 아니라 같은 편집 안에서 반복한다. 글을 분리·병합·개명하는 중 새 독립 개념, 선수 지식, 조합 경계가 드러나면 node·edge·canonical owner를 즉시 보강하고, 확장된 그래프가 다시 route 경계를 바꾸는지 재검토한다. 처음 만든 route 설계나 현재 article 수를 보존하려고 필요한 node를 누락하거나 한 글에 여러 학습 단위를 되밀어 넣지 않는다.
- 새 문서·논문·모델을 읽을 때 처음 보는 용어를 발견하면 먼저 knowledge graph에서 같은 concept node와 alias를 검색한다.
- 기존 node가 있으면 정의를 복제하지 않고 canonical article로 연결하며, 현재 글에는 `prerequisite·produces·optimizes·contrasts·constrains·evaluates·extends` 중 관계와 사용 이유만 추가한다.
- 기존 node가 없으면 정의·canonical owner·관계 edge를 함께 등록한다. 정본 설명이 아직 없으면 해당 canonical article의 보강 또는 새 글을 미완료 작업으로 등록한다.
- 여러 글이 같은 핵심 정의·수식·Viz를 소유하면 하나의 canonical article로 통합하고 나머지 글에는 필요한 한 문장 요약과 관계가 설명된 링크만 남긴다.
- 논문 제목은 concept node와 구분한다. 논문은 concept를 제안·검증하는 evidence이며, 방법 자체가 독립적인 학습 대상일 때만 canonical paper article을 소유한다.
- 새 concept node의 canonical 설명은 그 용어를 모르는 독자를 기준으로 `직관적 상황 → 작은 수치 예 → 표준 용어 → 수식 → 전제·반례` 순서를 갖춘다. 그래프 등록과 사전식 한 줄 정의만으로는 완료되지 않는다.
- 정리·bound·법칙 노드는 무엇을 세는지, 각 기호를 일상적인 양으로 어떻게 읽는지, 작은 숫자를 대입한 예, 증명 아이디어, 적용할 수 없는 반례를 모두 설명한다.
- Cryptographic security margin은 `전체 rounds − 현재 공격이 다루는 rounds` 같은 장난감 수치로 직관을 주되, 공격 대상의 field·mode·state width·round profile과 full-round break 여부를 함께 적는다. Reduced-round 공격 개선을 production instance compromise로 쓰지 않고, 반대로 남은 margin을 security proof로 과장하지 않는다.
- `prerequisite` edge는 AI 개념끼리만 연결하지 않는다. 필요한 수학·통계·물리·시스템 node까지 이어 붙이고, canonical article의 learning contract를 재귀적으로 확인해 선수 지식 경로가 끊기지 않게 한다.
- 새 글을 완료하기 전에 concept reference가 모두 존재하고, node 간 relation edge와 canonical href가 유효한지 검사한다. `introducedHere`의 각 concept는 블로그 전체에서 정확히 한 글만 소유해야 하며 그 글과 `canonicalHref`의 article이 일치해야 한다. 또한 새 concept마다 최소 한 개 이상의 의미 있는 relation edge가 있어야 하며, 고립 node는 완료로 보지 않는다.
- `assumedKnowledge`는 화면에서 누락된 항목을 `00 선수 개념` stage로 자동 합성해 본문 흐름 앞에 둔다. `introducedHere`의 새 개념은 반드시 명시적 `conceptStages`에 포함하며, 새 개념 설명에는 있지만 학습 경로에서 찾을 수 없는 상태를 완료로 보지 않는다.
- 위 전역 불변식은 `npm run audit:graph -- --strict`로 별도 검사한다. 이 검사는 exercise·본문 anchor 감사와 독립적으로 실행해, 진행 중인 글 하나의 본문 상태 때문에 그래프 정합성 문제가 묻히지 않게 한다.

## 7. Article Definition of Done

아래 항목이 모두 확인돼야 완료다.

- [ ] 서론과 전체 질문이 자연스럽고 탑다운 순서가 보인다.
- [ ] 짧은 수업 안내 다음에 실제 본문이 오고, 용어 사전·개념 그래프·문제는 본문 뒤의 복습 영역에 있다.
- [ ] 처음 설명하는 용어 카드가 390px·1440px에서 최소 250px 폭을 확보하며 긴 정의를 좁은 열에 압축하지 않는다.
- [ ] 초심자 선수 개념과 전문적인 계산·전제가 함께 있다.
- [ ] 핵심 아이디어가 세부 약어보다 먼저 나오고, 처음 등장하는 전문용어의 정의·선행 경로가 있다.
- [ ] 작성 전에 기초·심화 문제를 만들었고 각 문제의 정답 체크리스트·필수 concept·답변 section이 모두 연결됐다.
- [ ] 주요 주장은 원 논문·공식 문서·실측 근거와 연결된다.
- [ ] 핵심 논문마다 현재 글의 paper reading note 또는 별도 canonical paper article로 이어지는 내부 해설 경로가 있다.
- [ ] 주요 KaTeX가 질문·아이디어·식·기호·전제·해석 순서를 따른다.
- [ ] `ExplainedFormula`의 `operations`는 실제 식의 기호를 쓰는 explicit 값이며 제네릭 fallback이 아니다.
- [ ] 코드 분석형 글(실제 오픈소스 codebase를 추적하는 글)은 핵심 단계마다 `CodeSidebar`로 열람 가능한 실제 source 함수·줄 범위 근거가 있다.
- [ ] 최종 공식이 알려진 다단계 유도의 결과라면, 그 유도 경로 전체가 이 글 또는 연결된 canonical 선수 글에 실제로 있다 — citation 한 줄로 대체하지 않았다.
- [ ] 구체적 절차가 있는 concept(algorithm·training procedure·sampling loop·protocol)은 `AlgorithmBlock`으로 입력→단계별 연산→출력 pseudocode가 있다 — 수식만 있고 절차가 없는 상태로 남기지 않았다.
- [ ] threshold·monotonic·piecewise 관계를 다루는 수식에는 mechanism Viz와 별도로 함수 그래프가 있는지 검토했다.
- [ ] Model VRAM을 다루는 글은 parameter headline×단일 dtype으로 끝내지 않고 실제 checkpoint의 dtype별 tensor payload, GB·GiB 단위, weight residency와 KV·recurrent state·workspace·allocator headroom을 분리해 계산한다.
- [ ] Viz가 메커니즘을 표현하며 정적 스타일 검사를 통과한다.
- [ ] canonical article과 선행·후속 링크가 명확하고 긴 중복이 없다.
- [ ] 새 용어가 knowledge graph의 기존 node에 연결되거나 새 node·edge·canonical owner로 등록됐다.
- [ ] 직역투와 단문 나열을 한국어 문단으로 다듬었다.
- [ ] desktop과 mobile에서 overflow, 겹침, 간격, 수식 순서를 검사했다.
- [ ] TypeScript와 production build가 통과한다.
- [ ] 미통과 항목을 숨기거나 “완료”로 보고하지 않는다.

## 8. 실행과 보고

- 중간 승인을 기다리지 않고 정해진 범위를 페이지별 DoD 순서로 연속 진행한다.
- `npm run audit:viz -- --strict <변경한 Viz 경로>`와 `npm run build`를 실행한다.
- 모든 글은 `npm run audit:learning -- --strict --require-registration <category/article>`를 실행한다. 전역 완료는 `--all-articles` 검사까지 통과해야 하며 등록·기초/심화 문제·필수 concept·논문 해설 anchor가 누락되면 완료하지 않는다.
- 전역 learning·article·Viz 감사는 공개 catalog route의 실제 import closure만 읽는다. 같은 디렉터리에 남아 있지만 entry가 import하지 않는 legacy 파일은 현재 글의 본문·anchor·Viz 증거로 인정하지 않는다.
- Playwright 검사는 최소 desktop 1440px와 mobile 390px에서 수행한다.
- Playwright 전역 완료 검사는 `수업 안내 → 실제 본문 → 복습 영역`의 DOM 순서, 용어 카드 최소 폭, page·Viz·수식·SVG overflow와 application console을 공개 route 전부에서 확인한다.
- 최종 보고에는 파일 수보다 DoD 통과 근거, 브라우저 검사 결과, 남은 미통과 목록을 우선 적는다.
