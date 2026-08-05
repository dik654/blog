---
source: fundamentals/software-verification/verified-boundary-slicing.md
topic: software-verification
generated: 2026-05-18T09:38:18.553Z
status: auto-mirror
---

# Verified Boundary Slicing

## 한 줄 정의
지저분하거나 오래된 코드/개념을 한 번에 깨끗하게 만들려고 하지 않고, 관찰 가능한 입력·출력·상태·불변조건 경계로 잘라 검증 가능한 작은 단위로 축적하는 방법.

## 핵심 관점
작은 단위부터 모은다는 것은 깨끗한 작은 단위만 고른다는 뜻이 아니다. 현실의 레거시 코드베이스나 오래 누적된 개념 체계는 내부가 얽혀 있어도, 경계에서 관찰 가능한 동작은 안정적인 경우가 많다. 그러므로 먼저 내부 구조가 아니라 다음 경계를 믿을 수 있는지 확인한다.

- 입력: 무엇을 받는가
- 출력: 무엇을 돌려주는가
- 상태 읽기: 어떤 상태를 참조하는가
- 상태 쓰기: 어떤 상태를 바꾸는가
- 부작용: 로그, 네트워크, 디스크, 캐시, 시간 의존성이 있는가
- 불변조건: 어떤 조건은 항상 보존되어야 하는가
- 실패 양상: 어떤 입력에서 거부, 에러, panic, rollback 이 일어나야 하는가

## 왜 필요한가
geth 같은 오래된 코드베이스는 내부가 깔끔하지 않아도 운영과 공격 표면을 오래 통과한 구현이다. 새로 깔끔하게 다시 쓴 코드가 더 안전하다는 보장은 없다. 따라서 검증된 지저분함과 깔끔한 미검증 구현을 구분해야 한다.

- 검증된 지저분함: 구조는 복잡하지만 오래 운영되었고 edge case 와 실패 양상이 많이 알려져 있음
- 깔끔한 미검증 구현: 읽기는 쉽지만 실제 예외와 adversarial case 를 충분히 맞아보지 않았음

좋은 전략은 검증된 지저분함을 black box 처럼 감싼 뒤, 그 경계의 계약을 문서화하고 테스트로 고정하는 것이다.

## FM 절차
1. 후보 단위를 고른다.
   전체 모듈이 아니라 함수, pre-check, state transition step, protocol rule 처럼 관찰 가능한 단위를 고른다.

2. 제외 범위를 먼저 적는다.
   이 단위가 검증하지 않는 것, 외부에서 이미 보장된다고 가정하는 것, 다음 단계로 미루는 것을 명시한다.

3. 경계 계약을 쓴다.
   입력 타입, 출력 타입, 에러 조건, 상태 의존성, 부작용을 표로 적는다.

4. 불변조건을 뽑는다.
   항상 참이어야 하는 조건을 자연어와 testable predicate 로 나눈다.

5. 반례 행렬을 만든다.
   정상 case 보다 먼저 reject 되어야 할 입력, 경계값, 중복, overflow, nil/empty, ordering 위반을 모은다.

6. 원본 구현에 고정한다.
   특정 파일, 함수명, commit/ref, 관련 spec 링크를 source anchor 로 남긴다.

7. 테스트를 추가한다.
   기존 구현을 oracle 로 쓰는 characterization test, 명시 spec 기반 unit test, property/fuzz test 중 필요한 것을 선택한다.

8. risk ledger 를 남긴다.
   아직 검증하지 않은 상태 의존성, consensus/network/storage 같은 외부 결합, 성능/DoS 위험을 기록한다.

## 산출물 형식
한 단위는 다음 5개 산출물로 충분하다.

- Boundary card: 이 단위가 무엇을 받고 무엇을 보장하는지
- Source anchor: 근거가 되는 원본 파일/함수/spec
- Invariant table: 자연어 불변조건과 테스트 가능한 predicate
- Counterexample matrix: 반드시 실패해야 하는 입력 집합
- Risk ledger: 아직 black box 안에 남겨둔 위험

## 경계 종류
- Pure boundary: 입력만 보고 출력/에러를 결정한다. 가장 먼저 자르기 좋다.
- State-read boundary: 상태를 읽지만 쓰지 않는다. snapshot, block header, config 같은 참조값을 명시해야 한다.
- State-transition boundary: 상태를 바꾼다. before/after invariant 와 rollback 조건이 필요하다.
- Protocol-step boundary: 합의나 네트워크 규칙의 한 단계를 구현한다. spec anchor 와 client compatibility 가 중요하다.

## 예시 후보
Ethereum/geth 에서는 전체 transaction pool 이 아니라 다음처럼 더 작은 경계부터 시작한다.

- blob transaction static validation
- transaction pre-check
- nonce/balance validation
- intrinsic gas calculation
- block header sanity check

첫 실험 단위로는 blob transaction static validation 이 적합하다. 상태 전이가 없고, 입력 transaction 의 형식과 수치 제한을 검증하는 성격이 강해서 boundary card 와 counterexample matrix 로 객관화하기 쉽다.

## 실패 모드
- 내부를 먼저 리팩터링하려고 한다.
  검증 경계가 없으면 리팩터링 성공 여부를 판단할 기준이 없다.

- "깨끗한 코드"를 "검증된 코드"로 착각한다.
  구조적 미감과 실제 안전성은 다르다.

- 정상 case 만 테스트한다.
  레거시 검증에서 중요한 것은 통과해야 할 입력보다 거부해야 할 입력이다.

- 제외 범위를 쓰지 않는다.
  제외 범위가 없으면 독자가 이 단위가 전체 안전성을 보장한다고 오해한다.

- source anchor 없이 요약만 남긴다.
  원본 구현이나 spec 으로 되돌아갈 수 없으면 지식이 의견으로 변한다.

## 다음에 이어갈 질문
- 이 경계가 실제로 consensus critical 한가, 아니면 local policy 인가?
- 이 검증이 실패하면 시스템은 reject, rollback, quarantine, warn 중 무엇을 해야 하는가?
- 같은 경계를 다른 client 또는 reference implementation 과 differential test 할 수 있는가?
- 이 단위의 불변조건을 property/fuzz test 로 자동화할 수 있는가?

---

2026-05-18 수동 정리. 출발 맥락: 레거시 코드베이스와 복잡한 개념 체계를 작은 검증 단위로 축적하는 방식에 대한 대화.
