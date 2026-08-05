# 자동 미분 엔진 구현 (Rust) · content spec

## 이 글이 맡는 질문

`y = x*x + x*x`처럼 한 값이 여러 경로에서 재사용될 때, Rust의 소유권을
깨지 않고 순전파 기록을 역순으로 읽어 정확히 gradient를 합치며 그 gradient를
다시 미분하려면 어떤 상태와 불변식이 필요한가?

이 글은 `ai-from-scratch-rust`의 첫 번째이자 유한한 바닥이다. 미적분 전체의
역사를 다시 시작하지 않는다. local derivative와 chain rule은 기존
`calculus-computational-graphs`에 맡기고, 여기서는 그 수학을 실행 가능한
동적 계산 그래프로 번역한다.

## 독자와 도달점

- 입력 독자: scalar derivative와 Rust의 struct/enum/trait은 보았지만
  `Rc`, `RefCell`, `Weak`를 그래프에 써 본 적은 없다.
- 도달점: 공개 예시와 다른 공유 DAG를 손으로 추적하고, gradient accumulation,
  generation ordering, higher-order graph recording과 cycle breaking의 책임을
  코드와 메모리 방향으로 설명한다.
- 다음 글: leaf `Value`와 graph가 준비되면 `dezero-nn`에서 trainable
  `Parameter`, `Layer`, `loss`, `optimizer step`의 소유권으로 올라간다.

## 최소 기반과 stop rule

필수 기반:

1. 함수 합성과 국소 미분
2. chain rule
3. directed acyclic graph
4. Rust shared ownership와 interior mutability

여기서 멈춘다:

- forward-mode AD, source transformation, dual number 전체 강의
- sparse tensor, GPU kernel, distributed autograd
- 일반 graph garbage collector

이 세 범위는 현재 scalar reverse-mode engine의 판단을 바꾸지 않으므로 선택
심화로 남긴다.

## Source ledger

### 공식 DeZero

- URL: `https://koki0702.github.io/dezero-book/`
- pinned code:
  `https://github.com/oreilly-japan/deep-learning-from-scratch-3/tree/b5f3cf12a9e4ed84fc97b57bf41a25610d69c9e5`
- 허용 claim: Variable/Function을 단계적으로 쌓는 교육 목적, define-by-run,
  generation 기반 reverse traversal, accumulated gradients, `create_graph`.
- 금지 claim: 공식 DeZero가 Rust로 구현되어 있거나 아래 crate의 정확한
  ownership 설계를 보증한다는 주장. 공식 구현은 Python이다.

### 자동 미분

- Baydin et al., *Automatic Differentiation in Machine Learning: a Survey*,
  JMLR 2018: reverse accumulation과 AD/수치미분/기호미분의 경계.
- 허용 claim: reverse mode는 기록된 elementary operation의 local derivative를
  output에서 input으로 누적한다.
- 금지 claim: 이 scalar engine이 production tensor AD와 같은 성능·범위를 가진다.

### Rust

- Rust Book `Rc<T>`: single-threaded multiple ownership.
- Rust Book `RefCell<T>`: borrow rule을 runtime에 검사하는 interior mutability.
- Rust Book reference cycles / std `Weak`: non-owning edge와 cycle breaking.
- std `Drop`: scope exit restoration.
- 금지 claim: `Rc<RefCell<_>>`가 thread-safe라는 주장. 이 crate는 의도적으로
  single-threaded이며 multi-thread runtime이라면 다른 ownership가 필요하다.

## 작성자 재구성과 source claim의 경계

`examples/dezero-rs`는 공식 Rust port가 아니다. 위 source에서 확인한 계산
계약을 이 블로그가 교육 목적으로 다시 구성한 compile-tested crate다. 본문과
CodeSidebar는 이 경계를 첫 화면과 source note에서 반복한다. 코드 line은
실제 crate 파일에서 읽고, 설명용 허구 `src/lib.rs` snapshot을 source처럼
표시하지 않는다.

## 공개 본문보다 먼저 푸는 숨은 전이 문제

공개 글에는 아래 숫자와 정답을 그대로 쓰지 않는다.

```yaml
fixture:
  x: 3
  graph: "y = x*x + x*x"
  required:
    - forward data y
    - every operation generation
    - reverse queue order
    - four contributions accumulated into x.grad
    - first derivative
    - clear only x.grad, then backward through saved first derivative
    - second derivative
    - why outputs are Weak but inputs are strong
  failure_mutations:
    - replace accumulation with assignment
    - omit enqueueing each input creator
    - record both graph directions as Rc
    - run first backward with create_graph false
```

본문만 읽은 독자가 네 mutation의 서로 다른 증상과 failure owner를 설명할 수
있어야 한다. 이 검증은 공개 퀴즈가 아니라 저작 품질 gate다.

## 서사

1. **값에서 경로로**: 숫자 하나로는 derivative path를 되짚을 수 없다.
2. **순전파가 tape를 만든다**: operation, strong input, weak output, generation.
3. **역전파가 빚을 합친다**: output adjoint, producer queue, shared DAG accumulation.
4. **미분도 값으로 남긴다**: `create_graph`, second derivative와 detach/no-grad.
5. **Rust의 memory contract**: `Rc`, `RefCell`, `Weak`, RAII와 single-thread limit.

## 수식 계약

모든 display equation은 KaTeX와 바로 뒤 `FormulaNote`를 가진다.

1. `y = x^2 + x^2`
   - 두 branch가 같은 `x`를 읽는 공유 DAG
2. `bar{x} += bar{y} partial y / partial x`
   - 덮어쓰기 아닌 누적
3. `generation(y) = 1 + max generation(x_i)`
   - Value generation과 operation scheduling을 분리해 설명
4. `dy/dx = 4x`, `d2y/dx2 = 4`
   - 공개 fixture는 다른 함수와 숫자를 사용

한국어 underbrace 또는 FormulaNote가 각각 `upstream gradient`, `local
derivative`, `accumulation`, `graph recording`의 역할을 말해야 한다.

## Viz 계약

하나의 `AutodiffGraphLab`만 핵심 Viz로 둔다.

- controls: `x`, shared branch on/off, accumulation bug on/off, graph recording on/off
- visible state:
  - forward DAG와 generation
  - ready reverse queue
  - edge별 gradient contribution
  - accumulated gradient ledger
  - first/second derivative result
- invariant:
  - shared path 수만큼 contribution이 합쳐진다.
  - producer가 ready queue에 들어가지 않으면 upstream node가 처리되지 않는다.
  - `create_graph=false`면 first derivative의 creator가 없어 second backward가 멈춘다.
- responsive:
  - 390px에서 node를 세로 lane으로 재배치
  - SVG text를 쓰지 않고 HTML grid와 formula를 사용
  - 내부 스크롤 없이 stage 폭에 맞춤

## 실행 코드와 테스트

`examples/dezero-rs`의 실제 파일을 source로 사용한다.

- `src/autodiff.rs`
- `tests/autodiff_contract.rs`

필수 테스트:

1. shared subgraph gradient accumulation
2. input creator가 queue에 다시 들어가는 multi-level graph
3. `create_graph=true` second derivative
4. `no_grad` scope restoration
5. output edge가 `Weak`이고 dead output upgrade가 실패할 수 있음

`cargo test --manifest-path examples/dezero-rs/Cargo.toml`을 release gate로 둔다.

## Metadata와 QA

- level: `intermediate`
- estimated minutes: `32`
- prerequisites:
  `calculus-computational-graphs`, Rust ownership basics
- `QuestionLead`, `ConceptPrimer`, `CapabilityCheck`, `SourceNotes`,
  previous/next handoff를 모두 포함한다.
- 390/768/1440에서 document/Viz overflow 0, raw LaTeX 0, KaTeX error 0,
  controls 44px 이상, keyboard operation을 확인한다.
