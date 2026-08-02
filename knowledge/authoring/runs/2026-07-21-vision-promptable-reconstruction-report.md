# Vision promptable segmentation reconstruction report

## 1. 관찰

Vision 분류에는 CNN, ResNet, ViT, CLIP, Deformable DETR의 깊은 글이 있었지만, 현재 제품 질문인 concept prompt, video identity, 다객체 runtime을 한 판단 흐름으로 연결하는 글이 없었다. 모델 이름을 순서대로 추가하면 독자는 SAM 1·2·3·3.1을 모두 별도 선행 글로 읽어야 하고, 기존 object-query·alignment·backbone 설명도 반복하게 된다.

## 2. 비공개 전이 문제

20분 공장 영상에서 서로 닮은 부품 37개가 가림, 재등장, distractor와 camera cut을 겪는다. Mask IoU는 높지만 ID swap, duplicate, OOM과 15 FPS 미달이 발생한다. 작성된 글만으로 prompt/output 계약, detector와 tracker의 책임, memory admission, multiplex bucket 수, correction, metric과 release gate를 설계할 수 있어야 한다. 이 문제 자체는 독자 본문에 노출하지 않고 section coverage 검사에만 사용했다.

## 3. 범위 결정

- 현재 글은 PVS와 PCS의 계약, SAM 1→2→3→3.1 실패 인계, global presence와 local query, video memory와 identity, Object Multiplex, 평가와 session lifecycle을 소유한다.
- Deformable DETR는 object query와 bipartite matching, CLIP은 image-text alignment, ViT는 patch attention을 소유한다.
- Promptable segmentation의 필수 논문 하향은 SAM 1에서 멈춘다. 더 오래된 segmentation 계보는 현재 계약을 바꿀 때만 연다.
- 기존 detection 경로는 promptable-video 경로와 다른 목표이므로 통합하지 않는다.

## 4. 1차 근거에서 확인한 사실

- SAM 3의 PCS는 text 또는 exemplar가 정의한 concept에 맞는 모든 instance를 찾는다.
- Global presence와 local query score는 다른 책임을 가지며 최종 score에서 결합된다.
- Video path는 detection, propagation, association, memory와 periodic correction을 분리해야 한다.
- SAM 3.1 Object Multiplex의 `multiplex_count=16`은 bucket slot 수다. 전체 session 상한 `max_num_objects`와 별도 설정이며 37개 object는 세 bucket이다.
- Release의 약 7배 수치는 H100에서 128 objects를 사용한 특정 비교다. Bucket call ratio 자체나 모든 환경의 end-to-end speedup이 아니다.
- `pmF1`은 pixel F1이 아니라 양성 media-prompt 쌍에서 mask IoU로 instance를 최적 매칭하고 IoU threshold별 micro F1을 평균한 localization metric이다.

## 5. 구현과 검증

네 Viz는 prompt 계약, 실패 기반 계보, occlusion memory admission, multiplex bucket과 identity invariant를 각각 한 상태 변화로 보여 준다. 네 display 수식은 수식 안의 항 역할을 한글로 표시하고 바로 아래 FormulaNote에서 계산 이유와 기호를 다시 설명한다. 구현 예시는 pinned official repository의 `handle_request`와 `handle_stream_request` API를 그대로 사용한다.

Build와 focused ESLint가 통과했고, Playwright에서 path link, Viz interaction, KaTeX parse, 37→3 bucket 계산과 document overflow를 검사했다. 390/768/1440px에서 document overflow는 0이었고 390px display formula 최저 scale은 0.80이었다.

## 6. Claude 협업 기록

Claude Opus high 검토는 USD 1.20 상한, 범위를 줄인 Claude Sonnet medium 검토는 USD 0.80 상한에서 각각 종료되어 결과를 내지 못했다. 이를 성공한 협업으로 간주하지 않았다. 공식 PDF 추출, pinned source inspection, browser test와 screenshot review를 fallback으로 수행했다. 후속 작은 모델 packet에는 전체 저장소가 아니라 content spec, 단일 본문, 직접 source excerpt와 판정 schema만 전달해야 한다.
