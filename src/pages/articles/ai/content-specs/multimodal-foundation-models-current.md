# 통합 멀티모달 기반 모델 current-first 경로 명세

## 1. 현재 목표와 절단선

2026년 7월의 상단 질문은 “이미지도 받는 LLM인가?”가 아니다. 다음 여섯 계약을 분리해 읽는 것이다.

1. 어떤 modality를 어떤 순서로 입력받는가?
2. 출력은 text인가, image·audio·video·action까지 포함하는가?
3. 각 입력은 전용 encoder를 거치는가, raw patch·waveform이 직접 projection되는가?
4. 시각 표현은 의미만 남기는 feature인가, 다시 image로 복원할 수 있는 token·latent인가?
5. text next-token, visual next-token, diffusion·flow 중 어떤 학습 목표를 어디에 적용하는가?
6. 공개된 근거가 model card·paper·weight·code·runtime trace 중 어디까지인가?

경로는 다음 여섯 글로 닫는다.

1. `multimodal-foundation-models-current`
2. `multimodal-fusion-interleaved-context`
3. `multimodal-visual-tokenization`
4. `multimodal-unified-generation-objectives`
5. `paper-janus-2024`
6. `janus-pro-multimodal-runtime`

필수 역사는 기존 `Transformer → ViT → CLIP → VAE·VQ-VAE → Diffusion`에서 멈춘다. CNN 이전의 비전 계보, RNN 이전의 언어 모델, codec의 전체 역사는 현재 계약을 바꾸는 식이나 구현이 막힐 때만 연다.

별도 diffusion pipeline, ComfyUI workflow, 제품별 이미지·비디오 선택은 기존 생성 모델·오픈 미디어 경로에 남긴다. 새 경로는 **interleaved input과 하나의 backbone 안에서 이해·생성을 결합하는 방법**만 소유한다.

## 2. 비공개 전이 문제

본문을 직접 문제집으로 만들지는 않는다. 대신 작성자 검증에는 다음 문제를 사용한다.

한 시스템 A는 text·image·audio를 임의 순서로 받고 text만 출력한다. 12B decoder에 image patch와 waveform을 linear projection해 직접 넣으며 256K context를 공유한다. 시스템 B는 image와 text를 이해하고 image도 생성한다. 이해용 vision encoder와 생성용 visual tokenizer는 분리하지만 transformer는 공유한다. 시스템 C는 text에는 next-token loss, 연속 image patch에는 diffusion loss를 적용한다.

작성된 여섯 글만 읽은 독자는 다음을 판정할 수 있어야 한다.

- A를 “image generator”라고 부를 수 없는 이유
- A의 image·audio token이 text context budget과 경쟁하는 위치
- B에서 이해용 feature와 생성용 code를 나눈 이유
- B의 생성 branch에만 reconstructable tokenizer와 decoder가 필요한 이유
- C에서 한 backbone을 쓴다는 말과 한 loss를 쓴다는 말이 다른 이유
- 896×896 image, patch 14, 4배 spatial merge에서 visual token 수를 계산하는 법
- 고정 256-token resampler가 해상도 증가 비용을 상한으로 묶는 대신 잃는 정보
- model card benchmark, paper ablation, open weight, official inference code가 증명하는 범위를 구분하는 법
- 새 모델이 나왔을 때 여섯 글 중 어느 글만 갱신해야 하는지

문항은 본문에 그대로 노출하지 않는다. 각 section의 설명, Viz의 상태와 마지막 capability check가 답을 재구성할 수 있게 한다.

## 3. 글별 ownership

### A. `multimodal-foundation-models-current`

**독립 판단:** 처음 보는 multimodal model을 입력·출력·표현·목표·근거 계약으로 분류하고, 다음에 읽을 한 갈래를 고른다.

깊게 다룰 것:

- Gemma 4의 encoder 모델과 12B Unified direct projection 차이
- Llama 4 early fusion의 의미와 vision encoder의 존재
- Qwen3-VL의 image·video understanding과 interleaved/spatiotemporal position
- Janus·Janus-Pro의 이해·생성 분리 encoding과 공유 transformer
- Transfusion의 discrete text AR + continuous image diffusion
- Emu3의 discrete visual token next-token 접근
- Qwen VLo preview처럼 product capability는 보이지만 재현 가능한 architecture evidence가 제한된 경우
- “입력 modality가 많다”, “출력 modality가 많다”, “single backbone이다”를 독립 축으로 읽는 법

소유하지 않음:

- projector·resampler tensor 계산의 전체 상세
- VQ codebook 학습
- diffusion sampler와 flow ODE
- Janus source code line-by-line 실행

Viz:

1. **Modality contract lab**
   모델을 고르면 입력·출력·encoder·representation·objective·evidence가 하나씩 나타난다. 순위표가 아니다. model card와 paper claim을 시각적으로 구분한다.
2. **Six-question route chooser**
   관측한 혼란을 고르면 fusion, tokenizer, objective, Janus 원문, Janus runtime, 기존 diffusion 중 한 곳만 연다.

반증할 오해:

- “이미지를 받으면 이미지도 만든다.”
- “Native multimodal은 vision encoder가 없다는 뜻이다.”
- “Single transformer면 모든 modality가 같은 tokenizer와 loss를 쓴다.”

### B. `multimodal-fusion-interleaved-context`

**독립 판단:** image·video·audio가 어떤 tensor와 position으로 text sequence에 들어가며 context·memory를 얼마나 차지하는지 계산한다.

깊게 다룰 것:

- `encoder → projector → optional resampler → model embedding`
- raw patch·waveform direct projection과 dedicated encoder의 차이
- prepend, cross-attention, early fusion·interleaving의 정보 경로
- patch grid, tiling, spatial merge, fixed resampler의 visual token 장부
- text position과 image의 width·height, video의 time position
- multiple images와 long video가 context budget·prefill cost를 바꾸는 이유
- encoder-free가 token-free나 compute-free를 뜻하지 않는 이유

수식:

1. `N_h=\lceil H/P_h\rceil`, `N_w=\lceil W/P_w\rceil`, `N_{\mathrm{patch}}=N_hN_w`
2. `N_{\mathrm{vis}}=\lceil N_h/m_h\rceil\lceil N_w/m_w\rceil`
3. `[B,N_v,D_v] -> projector [B,N_v,D_lm] -> optional resampler [B,K,D_lm]`
4. `X=[E_{\mathrm{text}}(t_1),\ldots,P_{\mathrm{vis}}F(I),\ldots]`
5. Early fusion: `N_{\mathrm{ctx}}=N_{\mathrm{text}}+\sum_iN_{\mathrm{vis},i}+\sum_jN_{\mathrm{audio},j}`
6. Cross-attention: text sequence length and visual K/V memory length are recorded separately.

모든 display 식은 한글 `underbrace` 또는 `substack` 의미를 갖고 바로 뒤 `FormulaNote`가 곱셈·projection·합을 쓰는 이유까지 설명한다.

Viz:

1. **Interleaved sequence builder**
   text·image·audio block을 실제 순서로 배치하고 token budget을 누적한다.
2. **Visual token budget lab**
   image 크기, patch, merge, fixed resampler를 조절하면 2D grid와 context meter가 함께 변한다.
3. **Position coordinate explorer**
   text 1D, image 2D, video 3D 좌표가 같은 sequence index와 다른 위치 의미를 갖는 것을 단계별로 보여 준다.
4. **Fusion topology lab**
   same projected feature fixture에서 early interleave, cross-attention, fixed-query prefix를 바꾸며 text self-attention length와 visual K/V memory를 함께 갱신한다.

### C. `multimodal-visual-tokenization`

**독립 판단:** 의미 이해용 feature, 복원 가능한 discrete code, continuous latent 중 어느 표현이 필요한지 고른다.

깊게 다룰 것:

- CLIP·ViT feature가 object·relation 의미에는 좋지만 pixel 복원을 보장하지 않는 이유
- VAE continuous latent와 VQ-VAE discrete code의 차이
- encoder, nearest code, straight-through estimator, commitment loss, decoder
- codebook collapse, reconstruction fidelity, token rate와 vocabulary size
- understanding encoder와 generation tokenizer를 분리하는 Janus의 저자 의도
- discrete image token AR과 continuous patch diffusion의 선택 경계

수식:

1. `k^*=\arg\min_k\|z_e-e_k\|_2^2`
2. `z_q=z_e+\operatorname{sg}(e_{k^*}-z_e)`
3. VQ reconstruction·codebook·commitment loss
4. image token bitrate 또는 token count 장부

Viz:

1. **Semantic vs reconstructable challenge**
   color·texture를 버려도 class는 맞는 feature와 decoder가 복원해야 하는 code를 비교한다.
2. **Codebook assignment lab**
   2D latent point를 움직여 nearest code, quantization error와 dead-code 상태를 본다.
3. **Representation chooser**
   이해·편집·생성·압축 목표에 따라 필요한 보존 정보가 달라진다.

기존 VAE 글의 짧은 VQ-VAE subsection은 commitment loss, straight-through와 EMA update까지 먼저 심화한다. 독립 글은 이 경로에서 시각 표현 선택을 판단할 만큼 확장될 때만 승격한다.

### D. `multimodal-unified-generation-objectives`

**독립 판단:** 공유 backbone 위에 text AR, visual AR, diffusion·flow loss를 어떻게 배치하며 각 선택이 output과 runtime을 어떻게 바꾸는지 읽는다.

깊게 다룰 것:

- Emu3: text와 discrete visual code를 next-token stream으로 다루는 전략
- Transfusion: mixed sequence에서 text token에는 LM loss, continuous image patch에는 diffusion loss를 적용하는 전략
- Janus: decoupled visual encoding과 autoregressive image code generation
- JanusFlow: autoregression과 rectified flow 결합
- loss를 합친 것, backbone을 공유한 것, output decoder를 공유한 것은 서로 다른 주장
- loss weight와 modality sampling이 gradient competition을 만드는 이유
- 이해 benchmark와 생성 benchmark를 한 점수로 합치면 안 되는 이유

수식:

1. `\mathcal L_{\mathrm{text}}=-\sum_t\log p_\theta(x_t|x_{<t})`
2. discrete visual AR loss
3. diffusion/flow regression loss
4. `\mathcal L=\lambda_t\mathcal L_{\mathrm{text}}+\lambda_v\mathcal L_{\mathrm{visual}}`

Viz:

1. **Objective branch lab**
   동일 mixed sequence에서 text 위치와 image 위치가 어느 head·loss·decoder로 가는지 step으로 밝힌다.
2. **Gradient budget mixer**
   modality sampling과 loss weight를 바꾸면 어느 branch의 update가 지배하는지 보여 준다.
3. **Generation schedule explorer**
   raster visual AR, parallel diffusion·flow와 text AR의 dependency 차이를 비교한다.

### E. `paper-janus-2024`

**독립 판단:** Janus의 “visual encoding 분리”가 어떤 연구 질문에서 나왔고 architecture·학습 curriculum·ablation이 그 답을 어디까지 지지하는지 원문 근거로 복원한다.

깊게 다룰 것:

- 이해는 semantic feature, 생성은 복원 가능한 VQ code를 요구한다는 충돌
- SigLIP understanding encoder, VQ generation tokenizer, 두 adaptor와 공유 autoregressive transformer
- text와 visual code에 공통으로 적용되는 next-token objective
- Stage I adaptor·head 정렬, Stage II unified pretraining, Stage III supervised fine-tuning
- Stage III understanding SFT의 system·user prompt masking과 answer-only supervision을 Stage I·II로 소급하지 않는 경계
- understanding : pure text : generation data ratio와 loss weight의 차이
- A/B/C/D/E ablation의 B↔C, D↔E 비교와 decoupled 공동 학습이 이해 전용 reference에 남긴 1.2점 차이
- Janus 1.3B 결과를 Janus-Pro·production runtime으로 확대하지 않는 경계

Viz:

1. **Encoding decision lab**
2. **Three-stage training curriculum**

### F. `janus-pro-multimodal-runtime`

**독립 판단:** 공식 repository에서 understanding과 image generation의 실제 tensor·method·cache 경로를 추적하고 최소 재현을 설계한다.

깊게 다룰 것:

- `VLChatProcessor`가 placeholder와 image를 batch input으로 만드는 순서
- `prepare_inputs_embeds`에서 understanding image encoder와 aligner가 language embedding에 들어가는 경로
- `language_model.generate`의 text output path와 attention mask·KV cache
- text-to-image prompt의 image start tag
- conditional/unconditional batch 구성과 CFG
- visual token 576개의 autoregressive loop
- `gen_head`, `prepare_gen_img_embeds`, `gen_vision_model.decode_code` 경로
- `gen_vision_model.encode`는 target image를 code supervision으로 바꾸는 training-only path이며 text-to-image inference에는 호출되지 않는 경계
- shared transformer, understanding-only, generation-only, training-only object ownership
- text LM head와 visual generation head를 분리하고 동일 AR 형식을 동일 vocabulary·head로 확대하지 않는 경계
- bf16·CUDA·weight·license·VRAM 전제와 failure trace

Viz:

1. **Understanding tensor trace**
2. **Generation tensor trace**
3. **CFG paired batch explorer**
4. **Runtime evidence checklist**
5. **Module ownership lab**

이 글은 official code가 공개된 Janus-Pro를 구현 anchor로 쓴다. Transfusion·Emu3는 architecture 전략의 근거이지 이 글의 code path로 추정하지 않는다.

## 4. 공통 source anchor와 claim boundary

| Source | 복원할 의도 | 확대하면 안 되는 주장 |
|---|---|---|
| Gemma 4 Technical Report·overview·model card, 2026-07 | 모델별 입력 modality, text output, dedicated encoder와 12B Unified direct projection, interleaved input | 2026-07-02 공개 기술 보고서를 1차 연구 근거로 사용한다. 공식 benchmark를 모든 배포 환경의 우열로 일반화하지 않고 “Unified”를 visual generation으로 확대하지 않는다. |
| Meta Llama 4 release, 2025-04 | vision token과 text token의 early fusion, vision encoder, joint pretraining | `native`를 encoder-free·output multimodality로 바꾸지 않는다. |
| Qwen3-VL paper·official repository, 2025-11 | image·video understanding, spatial·temporal position과 long multimodal context | Qwen VLo의 image generation architecture와 합치지 않는다. |
| Janus·Janus-Pro paper·official repository, 2024–2025 | 이해·생성 visual encoding 분리, 공유 transformer와 공개 inference path | repo 밖의 product runtime·2026 frontier 성능을 추정하지 않는다. |
| Transfusion, 2024 | discrete text LM loss와 continuous image diffusion loss를 한 transformer에서 학습 | 모든 unified model이 같은 objective를 쓴다고 일반화하지 않는다. |
| Emu3, 2024 report · 2026 Nature publication | text·image·video를 discrete token으로 만들고 next-token prediction으로 이해·생성을 통합 | continuous latent diffusion보다 항상 낫다고 말하지 않는다. |
| Qwen VLo official preview, 2025-06 | 이해·생성·편집 capability와 progressive output의 product evidence | architecture·weights·training loss가 공개됐다고 쓰지 않는다. |
| Transformer, ViT, CLIP, VQ-VAE, LDM | 필요한 최소 기반 계산 | 오래된 계보 전체를 필수 선행으로 노출하지 않는다. |

## 5. 문장과 수식 원칙

- 전문 용어는 처음 등장할 때 한국어 뜻과 시스템 역할을 함께 쓴다.
- “native”, “unified”, “omni”, “early fusion”은 이름이 아니라 관찰 가능한 tensor·output 계약으로 다시 쓴다.
- 제품 발표, model card, paper, repository, 재현 trace의 증거 강도를 문장마다 분리한다.
- raw LaTeX를 prose에 두지 않는다.
- 모든 display equation 바로 뒤에 `FormulaNote`를 둔다.
- `FormulaNote`는 기호 뜻뿐 아니라 왜 곱하고, 합하고, normalize하고, projection하는지 설명한다.
- 긴 식은 모바일에서 축소하지 않고 의미 단위 여러 줄로 나눈다.
- 모델 전체 비교표를 본문 주 표현으로 쓰지 않는다. 독자가 한 모델의 경로를 끝까지 따라가도록 model story와 interactive contract lab을 쓴다.

## 6. 공통 Viz production 계약

- 색은 역할 구분에만 쓴다: text=중성 청록, perception=차분한 blue, generation=magenta가 아닌 따뜻한 coral, evidence=green, 위험=amber. 단일 hue로 화면을 채우지 않는다.
- Connector는 1–1.5px, active path만 2px. 굵은 직선과 큰 arrow block을 피하고 짧은 segment·곡선 또는 단계 간 여백으로 흐름을 만든다.
- 모바일은 desktop canvas를 축소하지 않는다. 390px에서 pipeline을 세로 순서로 재배치하고 token strip은 의미 단위 줄바꿈한다.
- 모든 interactive control은 44px 이상이며 tab·button 의미와 selected state를 가진다.
- 내부 label은 12px 이상, 설명은 13–14px, metric은 tabular number를 사용한다.
- 모션은 선택한 경로의 opacity·position 180–320ms 전환에만 쓴다. 자동 반복과 장식적 pulse는 쓰지 않고 `prefers-reduced-motion`을 따른다.
- `data-article-viz` surface 하나당 title·caption·toolbar를 각각 한 번만 둔다.
- 390·768·1440px에서 document, formula, Viz overflow가 0이어야 한다.

### 현재 글의 배포 전이 Viz

`MultimodalBudgetEvidenceLab`은 capability 비교표가 아니라 세 개의 hard transfer fixture를 판정한다.

1. **Gemma 4 · 문서 Q&A**
   - 12B의 256K context와 기술 보고서의 image당 280/1,120 visual token을 사용한다.
   - Text 18K, image 220장, output reserve 6K를 고정한다.
   - 280 token에서는 85,600 token으로 통과하고, 1,120 token에서는 270,400 token으로 14,400을 초과해야 한다.
   - 통과 상태도 independent runtime trace가 없으면 `예산 통과 · 실측 필요`에서 멈춘다.
   - API upload count와 latency를 공식 context 길이에서 추정하지 않는다.
2. **Emu3 · Image 생성**
   - Nature 논문의 512×512 image당 4,096 discrete token을 사용한다.
   - 8K는 교육용 실행 상한으로 명시하며 공식 context window로 쓰지 않는다.
   - Official Emu3-Gen artifact와 runtime trace를 별도 gate로 둔다.
3. **Qwen VLo · 구조 재현**
   - Product capability는 확인 상태로 둔다.
   - Visual representation, token budget, open weight와 reproduction code는 미확정·미확보로 둔다.
   - Unknown 값을 0으로 바꾸지 않고 total과 margin을 `계산 보류`로 닫는다.

Viz는 request total, context margin, token 구성, evidence ladder와 release verdict를 같은 선택 상태에서 갱신한다. 390px에서는 두 열을 세로로 재배치하고, 각 control은 44px 이상, label은 12px 이상을 유지한다.

## 7. registry와 학습 경로

- 새 registry: `src/content/ai/articlesMultimodal.ts`
- 새 parent subcategory: `ai-multimodal`
- 목표 분야의 `언어 · 지식`과 `인식 · 생성` 사이를 잇는 독립 target으로 둔다.
- sidebar에서는 `언어 · 지식`과 `인식 · 생성` cluster 사이를 잇는 독립 `멀티모달 통합` cluster로 한 번만 노출한다.
- learning path: `ai-multimodal-current-first`
- top-down track: `multimodal-foundation-models`
- current anchor: Gemma 4 공개 계약과 2026 multimodal architecture 변화
- canonical anchor: Janus. 통합 이해·생성의 핵심 갈등을 decoupled visual encoding으로 명시하고 official code가 있다.
- implementation anchor: `janus-pro-multimodal-runtime`

## 8. 완료 조건

- 여섯 글이 서로 다른 독립 판단을 가진다.
- 첫 글에서 모델 순위표 없이 어느 branch를 읽을지 고를 수 있다.
- 모든 수식에 한글 의미와 operation choice가 붙는다.
- 비공개 전이 문제의 모든 항목을 본문·Viz·capability check만으로 답할 수 있다.
- 2026 claim과 2024–2025 canonical mechanism이 섞이지 않는다.
- 기존 CLIP·VAE·Diffusion·open media·world model과 소유권이 중복되지 않는다.
- 390·768·1440px에서 잘림, 12px 미만 Viz label, 44px 미만 control이 없다.
- 새 source가 나올 때 상단 current와 필요한 foundation delta만 추가하고 과거 논문을 무한히 노출하지 않는다.
