# Robot Perception & Scene Construction 구현 추론 보고서

이 문서는 완성 글의 요약이 아니라 요구를 어떤 중간 판단과 검증으로 구현물로 바꿨는지 재현하기 위한 기록이다. 수치와 artifact 위치는 같은 이름의 JSON 실행 로그에 보존한다.

## 1. 요구를 학습 깊이, 근거, 시각 계약으로 분해했다

사용자는 문제 자체를 본문에 넣으라는 것이 아니라, 작성자가 어려운 문제를 먼저 만들어 본문만으로 필요한 통찰에 도달할 수 있는지를 검사하라고 했다. 동시에 기반 논문을 뼈대로 쌓고, 회사 research와 새 논문을 추적하며, Viz·수식·모바일 UI가 실제 학습을 방해하지 않게 하길 원했다.

따라서 구현 단위는 “인지 글 하나”가 아니라 다음 네 계약이었다.

1. 커리큘럼에서 정확히 어느 공백을 메우는가.
2. 각 공개 주장을 어느 1차 출처가 어디까지 지지하는가.
3. 비공개 최고난도 문제의 모든 전제가 본문 증거로 매핑되는가.
4. 수식과 Viz가 모바일에서도 조작·측정·판독 가능한가.

## 2. 기존 글 사이의 누락된 물리 데이터 흐름을 찾았다

기존 카메라 글은 한 pixel을 time-aligned base-frame point와 covariance로 바꾸는 데서 끝났다. Motion planning 글은 이미 만들어진 collision scene version을 입력으로 가정했다. 그 사이에는 다음 전체 chain이 없었다.

```text
model output
  -> observation contract
  -> valid mask-depth 3D support
  -> robot self-filter
  -> predict / gate / one-to-one assign / update
  -> track lifecycle and occlusion
  -> free / occupied / unknown ray evidence
  -> bounded log-odds and octree
  -> static occupancy + dynamic objects
  -> uncertainty inflation
  -> atomic PlanningScene version
```

`multiview-fusion`은 generic classification feature fusion이므로 이 공백을 대신하지 못했다. 따라서 새 글을 카메라 기하 다음, motion planning 이전에 배치했다.

## 3. 비공개 전이 문제로 13개 premise를 강제했다

Wrist RGB-D camera가 같은 class의 mugs를 보고, arm과 hand가 가리고, glossy surface depth가 비고, boundary depth가 섞이고, mug가 움직이고, detector가 한 번 miss한 뒤 low score로 돌아오며, planner와 scene update가 경쟁하는 상황을 만들었다.

정의 암기만으로는 풀 수 없도록 각 premise가 다음 중 하나를 요구하게 했다.

- 정보 손실의 경계 판단
- 수식으로 계산하는 gate 또는 update
- 시간에 따른 state 전이
- 잘못된 정책과 올바른 정책의 measurable difference
- source가 지지하지 않는 범위의 식별

공개 본문에는 문제를 노출하지 않고 각 insight만 9개 섹션, 9개 Viz와 실행 gate에 배치했다.

## 4. 출처를 claim과 non-claim으로 동시에 저장했다

| 근거 | 사용한 내용 | 사용하지 않은 과장 |
|---|---|---|
| Mask R-CNN 2017 | box와 instance mask output의 차이 | mask score를 3D occupancy나 identity probability로 해석하지 않음 |
| SORT 2016 | prediction과 one-to-one assignment baseline | 2D MOT 성능을 robot safety로 일반화하지 않음 |
| ByteTrack 2022 | 기존 track에 제한한 low-score 2차 association | 모든 low-score box를 새 object로 채택하지 않음 |
| OctoMap 2013 | unknown, ray free evidence, log odds, clamp, prune, multi-resolution | semantic tracking과 arbitrary dynamic scene을 해결했다고 하지 않음 |
| ROS 2 PointCloud2 | frame, timestamp, fields와 organized layout | registration, unit와 invalid depth가 자동 검증된다고 하지 않음 |
| MoveIt current docs/messages | octomap updater, self-filter, world/attached scene fields | atomic version, covariance, freshness가 message만으로 보장된다고 하지 않음 |

OctoMap 글은 이 source ledger에서 별도 paper reconstruction으로 파생했다. 원문 표의 accuracy, cross-validation, memory, runtime과 clamp KLD를 claim별 evidence로 분리하고 2013 hardware·dataset·sensor boundary를 붙였다.

## 5. 본문 순서는 알고리즘 이름이 아니라 state 생성 순서를 따른다

1. Box·semantic mask·instance mask·metric support의 capability를 제한한다.
2. Mask와 valid aligned depth를 교차하고 boundary와 robot self-points를 제거한다.
3. Current acquisition time으로 track을 predict하고 covariance gate를 적용한다.
4. One-to-one assignment와 low-score recovery 뒤 lifecycle을 갱신한다.
5. Planner query에 따라 point cloud, TSDF, occupancy, object tracks를 조합한다.
6. Ray의 traversed cells는 free, endpoint는 occupied, 미관측 공간은 unknown으로 둔다.
7. Log odds와 clamp로 noise rejection, adaptability, compression을 교환한다.
8. Static occupancy와 dynamic object의 clearing·decay·uncertainty policy를 분리한다.
9. 모든 부분 상태를 한 version의 PlanningScene snapshot으로 게시한다.

이 순서를 따르면 detector confidence에서 collision object로 건너뛰는 잘못된 shortcut이 중간 어느 gate를 생략했는지 드러난다.

## 6. Viz는 장식 대신 실패를 측정한다

| Viz | 바꾸는 상태 | 관측 결과 |
|---|---|---|
| Observation Contract | box/mask/depth mode | 보존 capability와 scene 채택 여부 |
| Mask x Depth Support | depth validity, erosion, self-filter | support count, contamination, reobserve |
| Association | nearest/gated, crossing time | ambiguity와 ID switches |
| Track Lifecycle | threshold policy, miss budget | fragmented ID 또는 preserved ID |
| Representation | planner query | 선택 표현과 정보 손실 |
| Ray Model | endpoint-only/ray | cleared, occupied, unknown cells |
| Bounded Log Odds | hits, misses, clamp, depth | probability, flip count, coarse collision |
| Static + Dynamic | fusion/deletion/layering | ghost, premature delete, conservative track |
| Scene Snapshot | concurrent update, revalidation | execute, stop 또는 replan |

색은 장식 palette가 아니라 의미를 가진다. Red는 실제 invariant failure, emerald는 accepted/free, amber는 uncertainty, violet은 probabilistic state, blue는 observation과 identity다.

## 7. 수식은 의미 행으로 다시 유도했다

첫 모바일 QA에서 긴 한글 underbrace 수식이 0.52배까지 줄었다. Overflow가 0이라는 결과만 보면 놓치는 결함이었다. Mask-depth support를 camera point, base point, valid pixel, final support의 네 행으로 분리했고 Mahalanobis 식은 residual, innovation covariance, normalized gate의 세 행으로 나눴다. Assignment, inverse sensor model, log odds, clamp, uncertainty margin과 scene execution gate도 같은 방식으로 분해했다.

최종 360px 최소 배율은 개념 글 0.78, 논문 글 0.77이고 390px에서는 0.87, 0.86이다. 모든 display equation은 한국어 brace 설명과 operation rationale, symbol table, assumption/failure 설명을 가진다.

## 8. 스크린샷 QA가 찾은 비수학 결함을 수리했다

- Six-frame track timeline의 내부 가로 스크롤을 모바일 3x2 grid로 교체했다.
- `font-mono`의 CJK fallback 부재로 한국어 metric이 사각형이 되는 문제를 global font token에서 고쳤다.
- Mobile association viewBox를 desktop 전체 폭으로 확대해 생긴 공백을 별도 700x240 desktop composition으로 교체했다.
- 직접 Korean brace를 가진 수식이 registry miss로 오판되는 문제를 annotation resolver contract에서 해결했다.

색만 변경한 Viz는 없다. 각 수정은 판독 크기, geometry framing, spacing, line weight, glyph coverage 또는 state evidence를 바꿨다.

## 9. 작은 모델은 한 번에 글 전체를 쓰지 않는다

4B/9B 모델에는 다음 artifact pass만 하나씩 맡긴다.

```text
gap audit
  -> source claim packets
  -> private transfer gate
  -> section packets
  -> formula packet
  -> one Viz packet
  -> integration
  -> one screenshot defect packet
```

이번 run에서 작은 모델에 넘길 수 있는 좁은 단위 예시는 다음과 같다.

```json
{
  "section_id": "inverse-sensor-model",
  "immutable_claims": [
    "traversed valid range cells receive free evidence",
    "the endpoint receives occupied evidence",
    "unobserved cells remain unknown"
  ],
  "source_packet_ids": ["octomap.sec3.1", "octomap.sec5.1"],
  "controls": ["endpoint_cell", "endpoint_only_or_ray"],
  "observables": ["cleared_cells", "unknown_cells", "path_evidence"],
  "reject_when": ["detection miss is called free evidence", "mobile uses horizontal scroll"]
}
```

작은 모델은 source corpus 선택, equation 재작성, design system 발명, curriculum 전체 변경과 검증 없는 완료 선언을 하지 않는다. Stronger retrieval/orchestrator가 immutable source packet과 formula를 만들고, 작은 모델은 한 section/Viz/defect만 구현한다.

## 10. 재현 artifact

- 범용 protocol: `knowledge/authoring/small-model-deep-article-protocol.md`
- machine run log: `knowledge/authoring/runs/2026-07-19-robot-perception-scene-construction.json`
- content spec와 private gate: `src/pages/articles/ai/content-specs/robot-perception-scene-construction.md`
- concept article: `src/pages/articles/ai/robot-perception-scene-construction.tsx`
- OctoMap reconstruction: `src/pages/articles/ai/paper-spine/robotPerceptionSpecs.tsx`
- paper Viz: `src/pages/articles/ai/paper-spine/viz/OctoMapEvidenceLab.tsx`
- formula annotation contract: `src/content/ai/foundationFormulaAnnotations.ts`
- curriculum paths: `src/content/learning-paths.ts`, `src/content/ai/foundationCurriculum.ts`

## 11. 최종 검증과 공개 결과

- Targeted ESLint 통과
- Production build 통과, 기존 large-chunk warning만 유지
- 360/390/768/1440px document overflow 0
- KaTeX error, annotation 누락, clipped SVG text, console error 0
- Concept 9개 Viz와 paper 2개 evidence explorer 렌더링
- Concept 9개와 OctoMap control의 state change 확인
- Public 390/1440px에서 overflow, 수식, CJK glyph, lazy chunk를 다시 검증
- `ai-robotics` 목록에 두 글이 노출되고 390px overflow 0

공개 URL:

- `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/robot-perception-scene-construction`
- `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/paper-octomap-2013`
