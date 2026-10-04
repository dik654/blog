# 네 비트와 이진체 sumcheck의 검산

## 고정 원문

`../codebase/PROVENANCE.json`은 파일 전체의 Git blob SHA-1과 SHA-256을 기록합니다. 모델은 `IrreducibleOSS/binius-models`의 `7ac5ad72f2ba38740fe1122c16b94bcdbe7bcecf`, 패키지 0.1.0입니다. Flock과 Binius64의 별도 고정 README/선택 소스는 읽기 자료이며 실행하지 않았습니다.

## 실행

```sh
python3.12 src/pages/articles/blockchain/binary-field-proving/verification/trace.py
```

실제 관측 환경은 CPython 3.12.13입니다. 결과는 `observed-python-3.12.13.json`에 보존했습니다. 기본 시스템 Python 3.9는 원문 typing 문법과 맞지 않아 사용하지 않습니다.

이 저장소의 별도 호출 예제인 `trace.py`가 원문 AST를 로드합니다. `tower.py`에서 사용하지 않는 `galois.GF` import, `FASTowerField`, `Tower192Field`, `AESTowerField` 클래스만 제외합니다. 선택한 Fan–Paar 체 함수·기본 체 연산·Polynomial·Sumcheck 본문은 수정하지 않습니다. 원문 파일은 통째로 보존합니다. 전체 모델 패키지와 galois 등의 의존성 묶음을 설치하거나 실행했다고 주장하지 않습니다.

## 같은 사례

- 비트열 `1011`과 `0110`: XOR `1101`, AND `0010`, 정수 합 `10001`.
- `u²=u+1`, `v²=uv+1`, 기저 `1,u,v,uv`의 F16에서는 `11×6=15`.
- 낮은 주소 비트가 x인 표 A=`[1,1,0,1]`, B=`[0,1,1,0]`.
- 두 질문 u와 v: 합 주장 `1→3→5`, 최종 MLE 값 `13,6`, 곱 `5`.
- AND 결과표의 MLE를 따로 평가하면 `10`. 확장식의 곱 `5`와 다릅니다.

## 실제 확인 범위

원문 모델과 별도 다항식 곱셈 구현의 256개 곱을 대조합니다. 15개 비영 원소의 역원과 256개 정직한 질문 조합도 대조합니다. 잘못된 식 `t²+t`의 두 근, 오류표 `[1,1,0,0]`, 기약 이차식의 작은 체 대입, 0 역원 거부, 네 가지 비정규 입력 거부를 검사합니다.

생성자 `E(11)`과 정수 매핑 `E.from_int(11)=1`은 다릅니다. 원문 `from_bytes(ff)=255`는 F16의 정규 원소 범위 밖입니다. 호출 예제의 `canonical4`는 범위를 별도로 검사합니다. 이 수학 모델을 외부 입력 검증 API라고 해석하지 않습니다.

## 포함하지 않은 검증

전체 Binius/Flock 시스템, PCS commit/open, Fiat–Shamir, 공격자 시뮬레이션, 영지식, 양자 보안, 실행 시간 또는 CPU/GPU 성능을 검증하지 않았습니다. 논문의 성능 수치는 명시한 판과 장비의 저자 보고이며 이 실행의 결과가 아닙니다.
