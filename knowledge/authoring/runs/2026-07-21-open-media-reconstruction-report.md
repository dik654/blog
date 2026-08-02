# Open Media 경로 재구성 보고서

## 1. 관찰한 문제

기존 오픈 이미지·비디오 섹션에는 좋은 개별 글이 많았지만, 처음 온 독자가 다음 질문에 답하기 어려웠다.

- 지금 만들려는 결과가 이미지인지 비디오인지에 따라 어디서 갈라져야 하는가?
- 최신 모델 소개와 변하지 않는 runtime 원리는 어디서 분리되는가?
- workflow JSON, parameter preset, LoRA 학습 중 무엇을 먼저 검증해야 하는가?
- `open weights`, `commercial`, `consumer GPU` 같은 표현은 실제 배포 가능성을 어디까지 보장하는가?
- Stable Diffusion, Z-Image, Illustrious, Wan, LTX 글을 모두 읽어야 하는가?

모델별 fact sheet와 표를 늘리면 후보 이름은 많아지지만 판단 순서는 더 흐려진다. 따라서 모델 계보를 필수 순서로 나열하지 않고, 제작 실패 조건을 먼저 정한 뒤 필요한 runtime branch만 읽는 구조로 바꾸었다.

## 2. 비공개 전이 문제

본문을 쓰기 전에 다음 studio 문제를 고정했다.

> 한국어 문구와 줄바꿈이 정확한 패키지를 만들고, 제품 형상·로고·브랜드 색을 유지한 편집을 수행한다. 같은 제품으로 5초 영상을 만들며 선택적으로 동기화된 오디오를 붙인다. 약 24 GB GPU에서 fallback이 있어야 하고, 상업적으로 사용할 수 있어야 하며, 다른 머신에서 같은 manifest로 재현되어야 한다.

이 문제는 글에 정답으로 노출하지 않았다. 대신 작성된 본문만 읽고 다음 잘못된 계획을 기각할 수 있는지 검사했다.

- roadmap 기능을 현재 기능으로 취급한다.
- 같은 family의 모든 variant가 같은 license라고 가정한다.
- `consumer GPU` 문구를 24 GB 보장으로 해석한다.
- ComfyUI JSON이나 screenshot만 있으면 재현 가능하다고 본다.
- prediction target과 solver가 다른 모델 사이에 step·guidance 값을 복사한다.
- prompt·control·reference·LoRA를 비교하지 않고 full fine-tuning부터 시작한다.
- 낮은 train loss나 한 장의 좋은 sample만으로 release한다.

## 3. 원문과 증거 경계

현재성 주장은 2026-07-21 기준 공식 원문으로 좁혔다.

- Ideogram 4.0: open weights, multilingual typography, box control, 2K와 현재 layer 범위. editable text와 movable image layer는 후속 계획으로 분리했다.
- Krea 2: single-stream DiT, Qwen3-VL encoder, style reference, prompt expansion과 multi-stage training을 기술 보고서 범위에서만 사용했다.
- FLUX.2: API와 open variant, Klein 4B Apache 2.0과 9B FLUX NCL, distilled와 base의 역할을 별도 계약으로 기록했다.
- Qwen-Image: 2.0은 발표·온라인 사용 상태와 공개 weight 상태를 분리했다. 이전 edit checkpoint의 mechanism이나 공개 범위를 2.0에 전이하지 않았다.
- Wan2.2: A14B의 high-noise/low-noise expert와 dense TI2V-5B를 분리했다. Apache 2.0 weight와 configuration-specific hardware claim을 구분했다.
- LTX-2.3: joint audio-video와 local/open-weight 범위를 문서대로 제한했다. LTX-2 Community License의 연 매출 1천만 달러 이상 별도 상업 license 조건을 code license와 합치지 않았다.

회사 설명은 후보를 좁히는 증거다. 로컬 성능, 품질, 상업 적합성의 최종 판정은 고정 fixture와 측정으로 닫는다.

## 4. 최종 학습 경로

필수 경로는 여섯 글로 제한했다.

1. **제작 목표 router**: discard condition으로 목표를 고르고 Image 또는 Video로 갈라진다.
2. **Image runtime**: condition → latent → prediction/solver → guidance·control·reference·LoRA → VAE 실행 순서를 추적한다.
3. **Video runtime**: Image 계약을 상속한 뒤 temporal latent, motion, audio, memory를 추가한다.
4. **Workflow manifest**: 두 branch가 graph, artifact, environment, transform, sampling lineage에서 다시 합류한다.
5. **Parameter budget**: seed, schedule, call count, guidance, latent shape, frame 수를 품질·계산 가설로 바꾼다.
6. **Adaptation과 release**: 가장 작은 intervention을 선택하고 target·retention·memory·rollback·license gate로 닫는다.

Image와 Video는 선후 관계가 아닌 형제 branch다. Video 독자는 Image 글 전체를 다시 읽지 않아도 상속되는 다섯 계약을 확인하고 temporal 차이부터 읽을 수 있다. Stable Diffusion, Z-Image, Illustrious, Wan, LTX, animation 글은 checkpoint와 workflow를 검증하는 선택 사례로 남겼다.

역사 하향은 Latent Diffusion 2021에서 멈춘다. VAE, tensor, signal은 실제 runtime 질문이 생길 때만 연다.

## 5. 본문과 시각화 설계

모든 핵심 글은 `쉬운 제작 상황 → 정확한 runtime 용어 → 실행 순서 → 한글 주석 수식 → 실패 소유자 → 원문 근거 → 능력 검증` 순서를 따른다.

새 Viz는 작은 SVG pipeline과 화살표 미로 대신 실제 판단 상태를 바꾸는 control surface로 만들었다.

- `ProductionGoalRouter`: 실패 조건을 바꾸면 Image/Video branch와 확인 항목이 바뀐다.
- `RuntimeInheritanceExplorer`: Image의 공통 stage와 Video가 추가하는 stage를 구분한다.
- `WorkflowManifestExplorer`: graph가 있어도 artifact·environment·transform lock이 빠지면 replay-ready가 되지 않는다.
- `ParameterBudgetExplorer`: 해상도·frame·step 변화가 상대 token·compute budget에 미치는 영향을 보여 준다.
- `AdaptationDecisionExplorer`: 오류 종류와 데이터 규모에 따라 prompt/control/reference/LoRA/full training의 최소 intervention을 고른다.
- `OpenMediaReleaseGate`: quality, memory, replay, license gate를 독립적으로 닫는다.

모바일에서는 stage 높이, manifest 행, 보조 글자 크기와 formula line break를 실제 screenshot으로 조정했다. 긴 수식은 CSS 축소에만 기대지 않고 의미 단위의 중간 변수와 정렬식으로 다시 썼다. 모든 display 수식 뒤에는 전체 식과 기호의 필요성을 설명하는 한글 `FormulaNote`를 두었다.

## 6. Claude 협업 기록

첫 번째 넓은 Sonnet 검토는 여덟 파일을 도구로 읽다가 USD 0.7560207를 사용하고 review text 없이 끝났다. 성공한 검토로 세지 않았다.

두 번째 검토는 content spec과 overview, Image/Video runtime으로 범위를 좁히고 도구 사용을 막았다. USD 0.2792034에서 완료되었고 다음을 반영했다.

- Qwen-Image 2.0의 발표·온라인 상태와 open-weight 상태를 더 명확히 분리했다.
- 한국어 OCR, 제품 identity, temporal drift, 24 GB, license, second-machine replay에 측정 가능한 acceptance contract를 추가했다.
- 24 GB fallback 순서를 token 축소 → backend/VAE tiling → precision/offload 한 축씩 변경으로 명시했다.
- Wan과 LTX의 서로 다른 상업 license 경계를 추가했다.
- joint audio-video와 post-hoc TTS를 구분하고 branch handoff manifest field를 구체화했다.

다음 제안은 그대로 채택하지 않았다.

- 모델 비교표: 사용자가 요구한 모델별 서사와 claim 경계를 가리므로 사용하지 않았다.
- Workflow 재합류가 없다는 지적: 좁힌 review 입력에서 해당 글을 제외했기 때문에 생긴 오판이다. 실제 경로에는 독립 글로 존재한다.
- OCR 부재 지적: Workflow 글에 이미 OCR·줄바꿈·box·human review가 있었다. 다만 acceptance threshold 명시는 유효해 보강했다.

## 7. 검증 결과

- focused ESLint 통과
- production build 통과, 기존 900 kB 이상 chunk warning만 유지
- 오픈 미디어 category/route QA: 360·768·1440 px에서 3/3 통과
- 핵심 수식 continuity: mobile·desktop 12/12 통과
- Image·Video·Workflow mobile route와 다섯 interactive state: 7/7 통과
- 요구 viewport에서 document·figure·formula horizontal overflow 0
- 최종 모바일 수식 scale 0.8 이상
- category, goal router, Image runtime, Video runtime, manifest, adaptation의 모바일·데스크톱 screenshot을 시각 검토
- 학습 흐름 audit: registered 581, global continuity 581, learningPath assignment 250

전체 corpus audit의 `formulaGaps 137`, `releaseBlockers 137`, `missingPrerequisites 406`, `localConnectionBacklog 474`, `enrichmentBacklog 524`는 이 경로의 실패가 아니라 다음 P3 작업 목록으로 분리했다.

## 8. 4B/9B 모델용 재현 패킷

작은 모델에는 전체 저장소와 긴 대화를 한 번에 주지 않는다. 한 배치마다 아래 JSON 계약만 채우게 한다.

```json
{
  "target": {
    "reader_job": "독자가 마지막에 내려야 할 한 가지 판단",
    "current_trigger": "현재 논문·회사 글·제품 변화",
    "private_transfer_problem": "본문에 노출하지 않을 실제 문제",
    "acceptance_gates": ["측정 가능한 통과 조건"]
  },
  "inventory": {
    "keep": ["독립 판단이 있는 기존 글"],
    "absorb": ["중복 정의·표·fact sheet"],
    "optional_evidence": ["checkpoint·회사·논문 사례"],
    "missing_units": ["기존 글로 답할 수 없는 질문"]
  },
  "route": {
    "start": "현재 목표",
    "branches": ["서로 선행이 아닌 선택 경로"],
    "rejoin": "공통 구현·검증 계약",
    "foundation_stop": "필요한 최소 기반과 역사 절단점"
  },
  "claim_ledger": [
    {
      "claim": "본문 주장",
      "source": "공식 원문",
      "as_of": "YYYY-MM-DD",
      "scope": "원문이 실제로 보장한 범위",
      "inference": "저자 추론이면 명시",
      "failure_boundary": "확대 해석하면 안 되는 범위"
    }
  ],
  "article_contract": {
    "easy_scenario": "쉬운 도입",
    "execution_trace": ["입력부터 결과까지 상태 변화"],
    "equations": ["한글 항 주석과 FormulaNote"],
    "misconceptions": ["제거할 오해"],
    "capability_check": "암기가 아닌 판단 검증"
  },
  "visual_contract": {
    "decision_changed": "조작으로 달라지는 판단",
    "states": ["default", "counterexample", "failure", "pass"],
    "responsive_viewports": [360, 390, 768, 1440],
    "forbidden": ["내부 스크롤", "tiny SVG text", "arrow maze", "장식뿐인 애니메이션"]
  },
  "verification": {
    "tests": ["formula", "route", "interaction", "overflow", "build"],
    "screenshots": ["검토할 viewport와 state"],
    "open_backlog": ["이번 배치 밖의 문제"]
  }
}
```

권장 실행은 네 pass다.

1. **Inventory pass**: 파일·metadata·본문 질문만 분류하고 글을 쓰지 않는다.
2. **Evidence pass**: 공식 원문을 claim ledger로 고정하고 사실·추론·marketing을 분리한다.
3. **Authoring pass**: 한 글에 한 판단만 쓰고 private problem을 풀 수 있는지 역검사한다.
4. **Verification pass**: test와 screenshot 증거가 없으면 완료로 표시하지 않는다.

4B 모델은 각 pass를 별도 요청으로 실행하고 최대 한 글만 맡긴다. 9B 모델은 같은 schema로 한 branch와 rejoin까지 맡길 수 있지만, source claim과 최종 visual review는 별도 verifier가 다시 검사한다.

## 9. 다음 작업

P2의 구조 저작은 이 배치로 닫는다. 다음은 P3다. audit에서 드러난 137개 수식 공백을 주제별로 묶고, 사용자가 반복해서 지적한 AI foundations부터 `raw LaTeX → 한글 항 설명 → 의미 단위 줄바꿈 → Viz 상태 변화 → 360/390/768/1440 screenshot` 순으로 처리한다.
