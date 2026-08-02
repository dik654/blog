# ComfyUI workflow runtime contracts

## Reader outcome

독자는 커뮤니티 workflow를 그대로 실행하는 사용자가 아니라, graph를 실행 가능한 artifact로 검수하는 운영자가 되어야 한다. 새 모델 이름이나 node 이름을 외우지 않고도 입력·모델 부품·타입·실행 snapshot·cache·condition·후처리·dependency를 순서대로 점검하고, 실패가 처음 생긴 경계를 찾을 수 있어야 한다.

## Hidden transfer problem

12GB VRAM 장비에서 커뮤니티가 공유한 instruction image-edit workflow를 재현한다. workflow를 열자 missing custom node가 두 개 나오고, 비슷한 이름의 loader가 세 개 보인다. 받은 파일은 denoiser, text encoder, VAE로 분리되어 있으며 BF16, FP8, GGUF variant가 섞여 있다. prompt를 수정하고 다시 queue했지만 일부 node만 실행된다. LoRA node는 켜져 있으나 결과 차이가 없고, ControlNet의 pose는 원본과 다른 좌표로 적용된다. FaceDetailer를 켜면 결과가 좋아 보여 base model 비교도 왜곡된다. 팀원은 같은 JSON을 받았지만 custom node 최신 버전과 다른 model file을 사용해 재현하지 못한다.

독자는 최종 본문만으로 다음을 설명해야 한다.

1. workflow를 실행하기 전에 어떤 dependency와 component manifest를 검증하는가.
2. canvas 배치가 아니라 typed data dependency로 실행 순서를 어떻게 읽는가.
3. queue에 제출된 snapshot과 이후 UI 수정이 왜 다른 실행인가.
4. cache hit와 partial recomputation을 오류로 오해하지 않으려면 무엇을 기록하는가.
5. 12GB 안에서 denoiser·text encoder·VAE·adapter의 precision을 어떻게 선택하는가.
6. seed, step, CFG, sampler, scheduler를 어떤 통제 실험으로 조정하는가.
7. LoRA, text condition, ControlNet, image adapter가 어느 경로를 바꾸는지 어떻게 증명하는가.
8. base, edit, latent second pass, pixel upscale, detailer 중 earliest failure owner를 어떻게 찾는가.
9. 팀원이 같은 실행을 replay할 수 있도록 어떤 version, hash, API workflow와 output evidence를 남기는가.

## Information architecture

1. **Workflow execution contract**: import, dependency inventory, API-format snapshot, validation, queue, `prompt_id`, trace, output와 replay bundle. 이 글은 node glossary를 소유하지 않는다.
2. **Typed core graph**: MODEL·CLIP·VAE·CONDITIONING·LATENT·IMAGE 타입, topological dependency, cache invalidation, bypass/never, consumer tracing. UI의 좌우 배치는 실행 순서가 아니다.
3. **Component loading**: checkpoint와 분리형 component, architecture·precision·loader compatibility, 정적 weight memory 하한과 runtime peak, 12GB 선택 순서.
4. **Sampling schedule**: initial noise, iterative denoising, CFG, sampler와 scheduler의 책임, one-variable-at-a-time sweep. universal best value를 제시하지 않는다.
5. **Condition routing**: prompt embedding, LoRA weight patch, ControlNet structural condition, image-reference adapter와 mask가 서로 다른 경로에 들어간다는 사실과 ablation.
6. **Instruction editing**: change/preserve contract, semantic/appearance condition, mask/reference 선택, decode 후 계약 검사. 특정 모델은 현재 사례일 뿐 공통 구조보다 앞서지 않는다.
7. **Postprocess ownership**: base generation, latent resample, pixel upscale, detailer, tiling의 책임과 earliest-failure trace. 후처리 결과를 base model 성능으로 보고하지 않는다.
8. **Custom-node release operations**: registry identity와 version, missing-node recovery, dependency isolation, snapshot, security review, artifact manifest와 rollback.

여덟 글은 유지한다. 각 글이 서로 다른 운영 판단을 소유하고, 바로 전 글의 artifact를 입력으로 받으며, 다음 글에 넘길 산출물을 명시한다.

## Source boundaries

- **ComfyUI Workflow / Nodes / Links / Properties**: workflow가 node graph이고 link가 typed data를 전달하며 node가 입력 변경 시 실행된다는 현재 core contract에만 사용한다. UI 색상이나 특정 node label을 영구 표준으로 간주하지 않는다.
- **Execution Model Inversion / Lazy Evaluation**: dependency가 허용하는 범위 밖의 실행 순서는 안정된 계약이 아니고 cache와 lazy input 때문에 달라질 수 있다는 데 사용한다. 모든 custom node가 lazy evaluation을 올바르게 구현한다고 가정하지 않는다.
- **Local·Cloud API documentation**: API-format graph 제출, asynchronous job, `prompt_id`, status/WebSocket, output retrieval과 partial target에 사용한다. Cloud queue 정책을 local server의 동일한 정책으로 일반화하지 않는다.
- **KSampler documentation**: MODEL·positive/negative CONDITIONING·LATENT 입력과 multi-step latent denoising이라는 역할에 사용한다. 문서의 default 값을 모델 전체의 권장값으로 승격하지 않는다.
- **ControlNet tutorial**: processed image, strength, start/end, positive/negative conditioning과 chaining에 사용한다. third-party preprocessor의 출력 품질을 core가 보장한다고 쓰지 않는다.
- **Models / model-specific template documentation**: component 종류와 공식 template의 현재 연결에 사용한다. 파일 확장자만으로 architecture compatibility를 추론하지 않는다.
- **Upscale tutorials**: resize/upscale와 creative enhancement의 구분, pixel-stage 연결에 사용한다. 손·문자 의미 오류를 upscaler가 복원한다고 쓰지 않는다.
- **ComfyUI-Impact-Pack**: FaceDetailer의 detector·crop·detailer 결합과 package dependency에만 사용한다. FaceDetailer를 ComfyUI core node로 서술하지 않는다.
- **ComfyUI-TiledDiffusion / Ultimate SD Upscale**: 각 third-party package가 명시한 tiled diffusion·VAE 또는 upscale node 계약에만 사용한다. 두 구현의 parameter·seed·Control 처리를 서로 같다고 일반화하지 않는다.
- **Registry / Manager / custom-node installation**: version, missing-node 탐색, snapshot, 설치 경로와 명시된 보안 규칙에 사용한다. Registry 등록을 무해성 보증으로 서술하지 않는다.
- **LoRA paper**: frozen base와 low-rank update 수학에만 사용한다. 한 base model의 adapter가 다른 architecture에 호환된다는 근거로 사용하지 않는다.
- **Engineering judgment**: VRAM headroom, ablation 순서, artifact naming, release gate와 team handoff는 보편 명령이 아니라 운영 판단으로 명시한다.

## Formula contract

모든 display equation은 수식 안의 `underbrace`에 짧은 한국어 역할명을 쓰고 바로 아래 `FormulaNote`에서 기호와 연산 이유를 설명한다.

- Loader: `M_static = sum_i N_i b_i / 8`. 파일·정적 weight memory의 하한이며 peak VRAM 공식이 아님을 명시한다.
- Sampling: ComfyUI 구현 관례 `epsilon_cfg = epsilon_u + w_ui(epsilon_c - epsilon_u)`와 원 CFG 논문의 계수 기준점 차이를 명시하고, update trajectory를 개념식으로 분리한다.
- Conditioning: `W' = W + (alpha/r)BA`; Control signal은 구현 독립적인 개념식으로만 사용한다.
- Postprocess: crop-local 좌표와 canvas-global 좌표 변환. 좌표계·scale·offset을 왜 기록하는지 설명한다.

## Visual contract

공통 Viz는 동일한 실패 workflow를 여덟 책임 관점에서 다시 본다.

- SVG 선 도표 대신 responsive HTML grid, 상태 row, type token, execution trace를 쓴다.
- 선보다 입력/출력의 인접 배치, 단계 번호, status와 artifact 이름으로 흐름을 읽힌다.
- MODEL, condition, latent/image, risk에만 제한적으로 색을 사용한다.
- 390px에서 내부 가로 scroll이 없어야 하며 긴 node·artifact 이름은 줄바꿈한다.
- animation은 전체 정적 서사와 회귀 검증이 닫힌 뒤 별도 pass로 추가한다.

## Completion gate

- 첫 두 글이 node 목록을 반복하지 않고 execution contract와 typed DAG를 분리한다.
- loader가 sampler보다 먼저 온다.
- wide `min-width` table과 내부 horizontal scroll이 없다.
- 여덟 글 모두 question lead, concept primer, misconception, capability check, source notes와 다음 artifact handoff를 가진다.
- 수식은 렌더링되고 display equation 수와 `FormulaNote` 수가 같다.
- hidden transfer problem의 아홉 질문을 본문만으로 해결할 수 있다.
- 390/768/1440px에서 document, formula, visual overflow가 0이다.

## 4B / 9B authoring packet

작은 모델에는 글 전체를 한 번에 맡기지 않는다. 글마다 다음 고정 packet을 준다.

1. 소유할 판단 한 개와 소유하지 않을 판단 두 개.
2. 공식 source claim 3~5개와 각 claim의 금지된 일반화.
3. hidden problem에서 이 글이 해결할 증상 한 개.
4. 입력 artifact, 실행 단계, 출력 artifact, earliest failure, rollback의 다섯 필드.
5. 독자가 마지막에 답할 capability check 두 개.
6. prose를 먼저 작성하고 그 prose가 증명해야 할 Viz state만 추출한다.
7. 다른 글의 문단을 복사하지 말고 `InternalLink`와 명시적 handoff로 연결한다.
8. 수식은 기호, 연산, 선택 이유를 `FormulaNote`로 검수한다.
