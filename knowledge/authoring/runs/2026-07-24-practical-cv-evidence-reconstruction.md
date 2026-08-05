# Practical CV evidence reconstruction

Date: 2026-07-24 KST

## Scope

기존의 모델·기법 나열형 네 글을 다음 두 학습 경로로 재구성했다.

```text
Image Evidence
├─ 한 이미지: prediction unit → group split → baseline → intervention → release
└─ 여러 view: view-set contract → masked pooling → interaction gate → missing-view release

Temporal Evidence
├─ 일반 video: target horizon → source split → sampling → temporal proof → model gate
└─ media forensics: pristine lineage → open-domain matrix → evidence families → decision system
```

기존 slug는 유지했다.

- `image-classification-pipeline`
- `multiview-fusion`
- `video-understanding`
- `deepfake-detection`

설계 원장은
`src/pages/articles/ai/content-specs/practical-cv-evidence.md`다.

## Why this structure

기존 글은 backbone, early/late/attention fusion, 3D CNN/Transformer, face/frequency/model
순서로 읽혔다. 이 순서는 기술 목록은 전달하지만 다음 질문에 답하지 못했다.

- 같은 원본·entity가 split을 넘었는가?
- 여러 view가 순서 없는 집합인가, 위치가 고정된 sensor 배열인가?
- 높은 video 점수가 실제 시간 순서 덕분인가?
- Deepfake detector가 같은 generator fingerprint를 다시 찾은 것뿐인가?

따라서 네 글의 공통 바닥을 모델이 아니라 evidence contract로 바꿨다. 복잡한 모델은
baseline이 실패하고 추가 증거의 필요성이 관측된 뒤에만 등장한다.

## Hard transfer questions

본문을 쓰기 전에 다음 비공개 문제를 만들고, 완성된 글만 읽어도 해법의 판단 축에 도달하는지
검사했다.

1. 같은 제품의 정면 사진은 train, 후면 사진은 validation에 있을 때 왜 image accuracy가 새
   제품 일반화를 측정하지 못하는가?
2. 좌우 판정 task에 horizontal flip을 쓰거나 작은 결함 task에 aggressive crop을 쓰면 어떤
   label contract가 깨지는가?
3. View 순서를 바꿨을 때 예측이 같아야 하는 경우와 달라져야 하는 경우를 metadata로 어떻게
   구분하는가?
4. Sensor 하나가 빠졌을 때 zero image, padding과 실제 검은 image를 어떻게 구분하는가?
5. Ordered video model과 shuffled-frame model의 점수가 같다면 어떤 temporal claim을 철회해야
   하는가?
6. 같은 16 frame이라도 0.5초와 30초를 덮을 때 왜 서로 다른 입력인가?
7. FaceForensics++ random split에서 높은 detector가 unseen generator·codec에서 무너지는 이유를
   어떤 평가 행렬로 드러내는가?
8. C2PA credential 부재, detector high score와 사실 검증 결과가 왜 같은 명제가 아닌가?

## Content decisions

### Image classification

- Prediction unit과 independent group을 분리했다.
- Class count 외 entity, source, duplicate, acquisition과 label lineage를 audit한다.
- Frozen/small pretrained baseline으로 split·metric·inference를 먼저 닫는다.
- Backbone·resolution·pretraining corpus를 동시에 바꾸지 않는다.
- Augmentation을 label-preserving hypothesis로 바꿨다.
- TTA, pseudo-label과 ensemble은 고정 gain이 아니라 latency·누수·오류 상관을 가진 intervention으로
  제한했다.
- Group macro와 image micro risk를 수식으로 비교했다.

### Multi-view fusion

- View를 unordered set과 fixed-camera tuple로 구분했다.
- Entity id, view/camera id, capture session, pose, validity와 quality를 manifest로 만들었다.
- Single best view, independent vote, masked pooling을 attention보다 먼저 둔다.
- Pixel early fusion은 alignment가 있을 때만 후보로 둔다.
- Cross-view attention은 conditional interaction이 residual error에 남을 때만 승격한다.
- View dropout, permutation, camera swap과 each-view-drop ablation을 release gate로 만들었다.

### Video understanding

- Frame 수보다 target horizon과 timestamp coverage를 먼저 정의했다.
- Clip 생성 전에 source video·subject·event로 split한다.
- Single-frame, shuffled-frame과 ordered-clip probe로 temporal evidence를 반증한다.
- 3D CNN, SlowFast, TimeSformer와 VideoMAE를 연대기 recipe가 아닌 서로 다른 inductive-bias
  후보로 설명했다.
- Clip metric과 whole-video aggregation·coverage·latency를 분리했다.

### Deepfake detection

- 얼굴 조작 video와 일반 AI-generated image의 범위를 구분했다.
- Pristine source, identity, manipulation family, generator, codec, capture와 post-processing
  lineage를 보존했다.
- In-domain과 완전히 감춘 domain의 gap을 수식과 lab으로 만들었다.
- Spatial, frequency, temporal과 pretrained feature를 generator fingerprint가 될 수 있는
  hypothesis로 제한했다.
- FaceForensics++의 원 구성은 네 조작법임을 명시하고 extension data와 구분했다.
- FaceForensics++, Celeb-DF, DFDC Preview/Full, DeepfakeBench와 UniversalFakeDetect의
  scope를 분리했다.
- Pixel detector, watermark, C2PA signed provenance와 human review가 답하는 질문을 분리했다.

## Formula and Viz contract

모든 display 수식은 `String.raw`와 `practical-training/FormulaPair`를 사용한다. Underbrace와
바로 아래 meaning·symbol ledger는 한국어로 쓴다.

390px 최종 auto-fit scale:

- Image group/image risk: `0.87`
- Masked multi-view pooling: `1.00`
- Temporal sampling coverage: `0.81`
- Open-domain forensic gap: `1.00`

모두 기준 `>= 0.80`을 통과했다.

새 interactive Viz:

- `SplitContractLab`: file/entity/site split에 따라 leakage verdict가 바뀐다.
- `AugmentationContractLab`: task와 transform에 따라 label-preserving 판정이 바뀐다.
- `ViewSetLab`: view 의미와 missingness에 따라 pooling/attention gate가 바뀐다.
- `TemporalSamplingLab`: event horizon과 sample density에 따라 coverage 판정이 바뀐다.
- `TemporalEvidenceLab`: single/shuffle/ordered probe의 해석을 비교한다.
- `ForensicGeneralizationLab`: in-domain, unseen generator와 distribution pipeline shift의
  gap을 드러낸다.

390px screenshot 6개를 직접 확인했다. 겹침·잘림은 없었고, formula screenshot도 별도로
검토했다. Claude visual audit가 `/tmp` 접근 제한으로 한 번 실패해 screenshot을 repository 내부
임시 directory로 복사한 뒤 재검증하고 즉시 제거했다.

## Primary-source boundary

2026-07-24에 article에 인용한 19개 URL을 확인했고 모두 HTTP 200이었다.

- GroupKFold, shortcut learning, AugMix, calibration과 PyTorch transfer tutorial
- Deep Sets, Set Transformer와 MVCNN
- SlowFast, TimeSformer, VideoMAE와 PyTorchVideo
- FaceForensics++, Celeb-DF, DFDC, DeepfakeBench와 UniversalFakeDetect
- NIST AI 100-4와 C2PA Technical Specification 2.2

Paper 수치는 해당 dataset, preprocessing, metric과 publication date 안에만 둔다. 이번 글은
논문별 최고 점수를 재현하는 글이 아니라, 서로 다른 원문을 leakage·intervention·release evidence
계약으로 조합한 engineering synthesis다.

## Context Manager and Claude evidence

첫 header가 `[claude-code:sonnet`으로 시작하는 결과만 true-Claude 검토로 채택했다.

### Initial audit

처음 image+multiview, video+deepfake 두 작업을 병렬 `Promise.all`로 요청했으나 220초 이상
응답이 없어 종료하고 폐기했다. 이후 single-article 범위로 재시도해 모두 유효한 결과를 받았다.

- Image blockers: `[claude-code:sonnet · L1 · $0.0000 · 75172ms]`
- Multi-view blockers: `[claude-code:sonnet · L1 · $0.0000 · 105997ms]`
- Video blockers: `[claude-code:sonnet · L1 · $0.0000 · 94962ms]`
- Deepfake blockers: `[claude-code:sonnet · L1 · $0.0000 · 144766ms]`

주요 finding:

- Image/file split, fold pseudo-label leakage와 fixed gain·backbone threshold가 있었다.
- Multi-view에 view-set, order, missing-view와 N-view contract가 없었다.
- Video에 source split, single-frame/shuffle proof와 primary-source links가 없었다.
- Deepfake에 pristine-source split, unseen generator·codec 일반화가 없고 model·frequency·ensemble
  처방이 보편 법칙처럼 쓰였다.
- FaceForensics++ 방법 수와 DFDC Preview/Full 경계도 부정확했다.

### Post-rewrite audit

네 파일을 병렬로 다시 검증하려 했으나 240초 동안 묶음 결과가 오지 않아 폐기하고 single-file로
재시도했다.

- Image: `[claude-code:sonnet · L1 · $0.0000 · 39076ms]`, PASS
- Multi-view: `[claude-code:sonnet · L1 · $0.0000 · 104042ms]`, PASS
- Video: `[claude-code:sonnet · L1 · $0.0000 · 52565ms]`, PASS
- Deepfake: `[claude-code:sonnet · L1 · $0.0000 · 81943ms]`, one formula-notation issue

교정:

- AugMix를 stable OpenReview URL로 바꾸고 calibration primary source를 추가했다.
- Multi-view mean 수식은 camera metadata와 무관하게 index 재배열에 불변임을 명확히 했다.
- Deepfake의 모순된 `E_{a,b}` 첨자를 `E_in`, `E_open`과 explicit domain membership으로
  재정의했다.

재검증:

- Deepfake formula fix: `[claude-code:sonnet · L1 · $0.0000 · 15618ms]`, PASS
- First visual audit: `[claude-code:sonnet · L1 · $0.0000 · 35107ms]`, `/tmp` access blocked,
  result not counted as visual verification
- Repository-local visual audit: `[claude-code:sonnet · L1 · $0.0000 · 60063ms]`, PASS

Visual audit에서 source typo `드문듬`을 찾아 `드문드문`으로 고쳤다. 두 low-opacity tint는 icon과
명시적 label이 상태를 함께 구분하므로 blocking issue가 아니라고 판정했다.

## Verification before deployment

- `npx tsc --noEmit`: pass
- Targeted ESLint: pass
- `tests/practical-cv-evidence.spec.ts`: 11/11 pass
- 390, 768, 1440px: document overflow 0, raw LaTeX 0, formula pairing pass
- Six interactive labs: state transition assertions pass
- All 19 cited source URLs: HTTP 200
- 390px direct screenshot review: pass
- Claude post-rewrite prose and visual audit: pass after documented corrections

## Production evidence

- `npm run build`: pass, Vite production build completed in 18.76s
- `systemctl --user restart cm-blog.service`: pass
- Service state: active/running from 2026-07-24 16:38:19 KST
- Four article routes and `?sub=ai-practical-cv`: HTTP 200
- Production `tests/practical-cv-evidence.spec.ts`: 11/11 pass
- Production authored-path/sidebar regression: 1/1 pass

이 배치는 source research, reconstruction rationale, true-Claude audit, responsive visual review,
interaction assertions와 production deployment까지 닫혔다.
