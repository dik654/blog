# Robot Camera Geometry & Calibration 구현 추론 보고서

이 문서는 완성된 글의 요약이 아니라, 요구를 어떤 판단 순서로 구현물로 바꿨는지 재현하기 위한 기록이다. 기계 판독용 상세 상태와 수치는 같은 디렉터리의 JSON 실행 로그에 있다.

## 1. 요구를 결과물이 아니라 학습 계약으로 해석했다

사용자의 핵심 요구는 카메라 보정 글 하나를 추가하는 것이 아니었다.

- 기반부터 상위 개념까지 의존 순서대로 읽혀야 한다.
- 본문만 읽고 처음 보는 어려운 문제의 핵심 전제에 도달할 수 있어야 한다.
- 논문은 요약하지 않고 주장, 수식, 실험, 가정, 실패를 복원해야 한다.
- Viz는 장식이 아니라 조작 가능한 증거여야 한다.
- 수식은 모바일에서도 잘리지 않고, 각 연산의 역할을 한국어로 보여야 한다.
- 왜 그 내용을 넣었는지와 출처가 어디까지 지지하는지를 내부에 보존해야 한다.

따라서 첫 산출물은 TSX가 아니라 독자 능력 계약과 범위 경계였다.

## 2. 커리큘럼 공백을 물리 데이터 흐름으로 찾았다

기존 글에는 intrinsics, extrinsics, depth, TF, timestamp라는 단어가 있었지만 다음 연결이 없었다.

```text
distorted pixel
  -> rectified normalized ray
  -> depth 또는 plane으로 scale 결정
  -> acquisition-time camera pose
  -> fixed hand-eye transform
  -> robot base-frame metric point
  -> uncertainty와 provenance가 붙은 scene input
```

이 연결이 없으면 독자는 detector의 box center를 바로 3차원 점으로 오해하거나, 처리 시각의 최신 TF를 써도 된다고 생각할 수 있다. 그래서 글의 섹션 순서는 분야별 목차가 아니라 실제 측정이 planner 입력이 되는 순서를 따랐다.

## 3. 비공개 최고난도 전이 문제를 coverage gate로 사용했다

본문에 문제를 노출하지 않고, 서로 의존하는 11개 전제를 가진 진단 문제를 content spec에 만들었다. 문제는 crop/resize된 rolling-shutter camera, distortion, z-depth semantics, planar calibration pose degeneracy, hand-eye 방향, timestamp delay, uncertainty gate를 한 번에 요구한다.

그 뒤 각 전제가 공개 본문의 다음 항목 중 하나에 반드시 매핑되는지 확인했다.

- 명시적 설명
- 유도된 수식
- 조작 가능한 Viz
- 검증 또는 실패 기준

이 방식 때문에 글은 용어 목록이 아니라 실제로 오류를 진단할 수 있는 인과 사슬이 됐다.

## 4. 출처는 주장과 한계를 함께 저장했다

주요 근거는 다음처럼 분리했다.

| 근거 | 사용한 주장 | 과장하지 않은 경계 |
|---|---|---|
| OpenCV calib3d | pinhole, distortion, K scaling, hand-eye API 방향 | API가 잘-conditioned dataset이나 배포 정확도를 보장하지 않음 |
| Zhang 2000 | planar homography constraints, `Vb=0`, refinement, degeneracy | 특정 simulation의 약 45도 결과는 보편 규칙이 아님 |
| Tsai-Lenz 1989 | `AX=XB`, relative motion, rotation-axis diversity | 원 실험의 정확도 수치를 현대 장비에 일반화하지 않음 |
| ROS 2 CameraInfo/tf2/REP-103 | acquisition stamp, optical frame, time query | 잘못된 driver timestamp를 convention이 고쳐주지 않음 |
| Oth et al. 2013 | rolling-shutter row time과 moving camera caveat | full rolling-shutter calibration은 후속 범위로 남김 |

논문 글은 Zhang 원문의 논리 순서를 `prior bottleneck -> author intent -> mechanism -> evidence -> assumptions -> reproduction -> legacy`로 재구성했다. 숫자는 real/synthetic evidence 범위를 구분했고, 논문이 입증하지 않은 현대 robot 조건을 별도로 표시했다.

## 5. 본문과 Viz를 같은 불변식에서 만들었다

8개 Viz는 각 섹션의 가장 중요한 불변식을 조작해서 확인한다.

| Viz | 조작 | 관측값 | 증명하는 불변식 |
|---|---|---|---|
| Pixel -> Ray | pixel, focal, depth | ray angle, camera point | pixel은 ray만 정하고 depth가 scale을 정함 |
| Image Geometry | crop, resize, K 사용 모드 | ray miss distance | image transform과 K는 함께 바뀌어야 함 |
| Distortion | k1, radius | pixel shift, angle bias | 왜곡 오차는 가장자리에서 커짐 |
| Pose Diversity | view 수, tilt mode | independent constraints, condition proxy | 같은 평면 자세 반복은 새 방향 정보를 거의 주지 않음 |
| Validation | train/holdout, flatness | RMS, edge mean, pass/reject | 평균 training RMS만으로 배포를 결정할 수 없음 |
| Hand-eye | axis spread, pose pairs | condition, loop closure | translation 양보다 rotation-axis 다양성이 관측성을 좌우함 |
| Space x Time | delay, motion, row | cm point error | 최신 TF가 아니라 촬영 시각 TF가 필요함 |
| Ray -> Metric | angle, pixel/depth noise | covariance, scene gate | 수치적 교점과 신뢰 가능한 scene input은 다름 |

Zhang 논문 Viz는 pose geometry, view 수, corner noise가 rank, null-gap, closed-form RMS, refined RMS를 어떻게 바꾸는지 보여준다.

## 6. 수식은 원문, 모바일 분할, 설명을 동기화했다

수식은 세 층으로 구현했다.

1. `String.raw` 원본 LaTeX
2. 한국어 underbrace 역할 설명
3. `FormulaNote`의 기호 정의, 연산 선택 이유, 실패 조건

모바일에서는 shared annotation registry가 긴 식을 의미 단위 행으로 나눈다. 원본 LaTeX 문자열이 registry key이므로 수식 문구를 바꿀 때 mapping도 같은 patch에서 갱신했다. 이 동기화를 기계적으로 검사해 누락 수를 0으로 유지했다.

## 7. 시각 검증에서 판정 도구 자체도 검증했다

첫 Playwright 스크립트는 `browser.newPage`에 잘못된 `viewportSize` 옵션을 넘겼다. 요청한 390px 대신 `innerWidth=1280`이었고, 초기 모바일 통과 판정은 무효였다.

올바른 `viewport` 옵션으로 다시 실행하자 다음 결함이 드러났다.

- 620~700 단위 desktop SVG를 그대로 줄여 범례가 5~7px가 됨
- 수치 ledger가 한 열로 길게 늘어남
- tilt된 calibration boards의 회전 bounding box가 겹침
- 일부 수식 내부 역할 설명이 영어로 남음

수정은 색만 바꾸지 않았다.

- 핵심 장면에 모바일 전용 viewBox와 구도를 추가했다.
- 작은 SVG 범례를 12px HTML caption으로 옮겼다.
- 숫자 ledger에 선택적 모바일 2열 모드를 추가했다.
- 회전된 board의 실제 bounding box를 고려해 폭, 간격, row pitch를 다시 잡았다.
- 개념 글 12개, 논문 글 5개 수식의 역할 설명과 registry를 한국어로 동기화했다.

## 8. 최종 검증 결과

- production build 통과
- targeted ESLint 통과
- 360/390/768/1440px document horizontal overflow 0
- KaTeX 오류 0
- 수식 annotation 누락 0
- 잘린 SVG text 0
- console error 0
- 개념 Viz 8개, 논문 Viz 2개 렌더링
- 주요 toggle/range 상호작용의 수치 변화 확인
- public URL 200 및 390/1440px browser QA 재통과

공개 글:

- `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/robot-camera-geometry-calibration`
- `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/paper-zhang-camera-calibration-2000`

## 9. 4B/9B 모델로 같은 작업을 좁혀 실행하는 방법

작은 모델에게 “논문을 읽고 깊은 글과 Viz를 전부 만들어라”라고 한 번에 요청하면 범위, 근거, 수식, UI가 서로 오염된다. 다음 artifact pass로 분리한다.

```text
gap audit
  -> evidence claim packets
  -> private transfer gate
  -> section packets
  -> formula packets
  -> one Viz per pass
  -> integration
  -> screenshot defect packets
```

각 pass는 완성된 이전 artifact만 받고 전체 대화는 받지 않는다. 한 번에 source claim은 4~6개로 제한한다. PDF 전체 대신 강한 retrieval 단계가 만든 section extract와 source map을 준다. 수식, symbol table, color role, breakpoint, file allowlist는 immutable input으로 고정한다.

작은 모델의 자유도는 다음에만 둔다.

- 근거 packet을 짧은 인과 설명으로 바꾸기
- 정해진 control과 observable로 한 Viz 구현하기
- 구조화된 QA defect 하나를 최소 patch로 고치기

다음은 작은 모델이 결정하지 않게 한다.

- source corpus 선택
- equation 자체 재작성
- design system 발명
- curriculum 전체 순서 변경
- 검증 없이 완료 선언

구체적인 JSON schema, context budget, rejection gate와 escalation 형식은 `knowledge/authoring/small-model-deep-article-protocol.md`에 있다.

## 10. 재현에 필요한 artifact 위치

- 범용 4B/9B 프로토콜: `knowledge/authoring/small-model-deep-article-protocol.md`
- 기계 판독 실행 로그: `knowledge/authoring/runs/2026-07-19-robot-camera-geometry-calibration.json`
- 콘텐츠 설계와 비공개 전이 문제: `src/pages/articles/ai/content-specs/robot-camera-geometry-calibration.md`
- 개념 구현: `src/pages/articles/ai/robot-camera-geometry-calibration.tsx`
- 논문 reconstruction spec: `src/pages/articles/ai/paper-spine/robotCameraCalibrationSpecs.tsx`
- 논문 전용 Viz: `src/pages/articles/ai/paper-spine/viz/ZhangConstraintLab.tsx`
- 수식 모바일 annotation: `src/content/ai/foundationFormulaAnnotations.ts`
