# Open image · video current-first hub

## Reader contract

이 글은 최신 모델 목록이 아니다. 독자가 납품 실패 조건에서 필요한 control surface를 고르고, image 또는 video runtime으로 내려간 뒤, manifest·budget·adaptation 근거를 모아 채택 판단으로 돌아오게 한다.

필수 순서는 다음과 같다.

1. 결과물을 폐기시키는 오류를 고른다.
2. 그 오류를 직접 움직이는 입력과 control surface를 찾는다.
3. 모델 family가 아니라 정확한 variant·revision·weight·license를 확인한다.
4. runtime tensor와 memory 경계를 확인한다.
5. 고정 fixture, replay manifest와 acceptance gate로 채택한다.

## Current model scope

```yaml
image:
  typography_layout: "Ideogram 4.0"
  style_distribution: "Krea 2"
  multi_reference_family: "FLUX.2"
  instruction_generation_edit_watch: "Qwen-Image 2.0"
  few_step_local: "Z-Image"
  inherited_domain_checkpoint: "Illustrious XL v1.1"
video:
  joint_audio_video: "LTX-2.3"
  task_variant_moe: "Wan2.2"
```

새 모델은 이 목록 위에 자동으로 붙이지 않는다. 기존 여덟 역할 중 어느 계약을 바꾸는지 먼저 판정하고, 새 control surface 또는 runtime 책임이 있을 때만 새 역할을 만든다.

## Source boundary

직접 주장으로 허용하는 것은 공식 release, repository, model card, technical report와 license가 명시한 현재 기능·artifact·조건뿐이다.

다음은 편집자 재구성이다.

- 네 production goal과 여섯 acceptance gate
- image와 video를 형제 runtime으로 나누는 학습 순서
- 각 모델을 `해결하려는 실패 → 공식 근거 → 채택 전 검증`으로 읽는 공통 schema
- 공개 claim을 production evidence로 바꾸기 위한 manifest 필드

다음 추론은 금지한다.

- open weights를 open source 또는 상업 사용 가능과 동일시
- consumer GPU 문구를 24 GiB peak memory 통과로 치환
- image 한 장 품질을 video identity·motion·audio sync 품질로 일반화
- family 이름이 같다는 이유로 API, base, distilled, edit variant를 같은 runtime으로 간주
- 발표된 roadmap을 현재 공개된 editable layer 또는 checkpoint로 서술

## Interaction contract

### Goal router

선택한 목표는 폐기 조건, 필요한 제어면, 현재 공식 후보, 검증 경계와 다음 learning path를 함께 바꿔야 한다. 색만 바꾸는 선택은 실패다.

### Image sequence

여섯 탭을 동시에 비교표로 펼치지 않는다. 선택한 모델 하나에 대해 다음만 같은 위치에 표시한다.

1. 기준 날짜와 전체 모델명
2. 해결하려는 작업 질문
3. 현재 역할을 설명하는 짧은 서사
4. 공식 원문이 직접 말하는 범위
5. 채택 전에 독립 측정할 범위
6. 상세 글과 공식 원문

### Video sequence

LTX-2.3과 Wan2.2는 같은 card 두 장이 아니라 하나의 선택 panel에서 비교한다. joint audio-video 계약과 task-specific MoE 계약을 섞지 않는다.

## Hard-transfer oracle

작성자는 본문을 보지 않고 다음 문제를 먼저 푼다. 검토자는 완성된 본문만 읽고 다시 푼다.

```yaml
problem_1: "한국어 문구 exact match, 제품 identity 편집, 5초 audio sync를 한 모델 점수로 비교할 수 있는가?"
required: "서로 다른 control과 failure gate이므로 image typography, edit, video branch로 나눈다."
problem_2: "FLUX.2 4B와 9B가 같은 family라면 같은 license와 peak VRAM을 가정해도 되는가?"
required: "variant·license·dtype·VAE·offload를 별도 manifest로 측정한다."
problem_3: "Krea Turbo 8-step 결과가 좋으면 RAW artifact 없이 LoRA 학습을 시작해도 되는가?"
required: "distilled inference contract와 trainable base artifact를 분리한다."
problem_4: "Wan2.2 A14B와 TI2V-5B 결과를 같은 architecture 증거로 합칠 수 있는가?"
required: "expert structure, task entry, temporal VAE와 runtime configuration을 구분한다."
problem_5: "공식 문서에 20초 video가 적혀 있으면 모든 hardware에서 20초가 acceptance gate인가?"
required: "configuration·resolution·frame·offload·license 조건을 고정하고 직접 측정한다."
```

## 4B writer · 9B reviewer packet

```yaml
writer_4b:
  input: "한 모델의 primary-source packet, 정확한 artifact 시점, production goal 하나, hidden problem 하나"
  output:
    - "direct claim"
    - "runtime/control path"
    - "unsupported 또는 unknown"
    - "acceptance fixture"
    - "license/runtime evidence"
  forbidden: "모델 순위표, 홍보 문구 재진술, 미공개 artifact 추정"
reviewer_9b:
  checks:
    - "본문만으로 hidden problem을 풀 수 있는가"
    - "family와 variant가 섞이지 않았는가"
    - "현재 기능과 roadmap이 분리됐는가"
    - "image score가 temporal evidence를 대신하지 않는가"
    - "다음 runtime·workflow·budget·adaptation 글로 연결되는가"
deterministic_qa:
  - "image tab 6, image panel 1"
  - "video tab 2, video panel 1"
  - "선택마다 source와 detail link가 함께 변경"
  - "360/390/768/1440 positive overflow 0"
  - "interactive surface minimum text 12px, control height 44px"
  - "section scroll start가 sticky header 아래"
```
