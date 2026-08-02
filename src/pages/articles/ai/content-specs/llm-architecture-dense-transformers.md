# Dense Transformer 계열 재구성 사양

## 독자가 끝에서 답해야 할 질문

처음 보는 decoder-only 모델의 config와 block 그림을 받았을 때 다음을 분리해 설명할 수 있어야 한다.

1. 모든 token이 반드시 지나는 dense 실행 계약은 무엇인가?
2. Norm 위치, MHA/GQA, QK-Norm, GELU/SwiGLU, local/global layer가 각각 무엇을 바꾸는가?
3. 어느 선택이 학습 안정성, block parameter, KV cache, 긴 문맥 비용에 영향을 주는가?
4. 명목 context 길이와 실제 장거리 회상 품질을 왜 같은 말로 쓰면 안 되는가?

이 글은 모델 표를 암기시키지 않는다. GPT-2 XL을 최소 기준점으로 삼고 Llama 3 8B, Qwen3 8B, Gemma 3 27B, OLMo 3 7B가 이전 기준의 어느 병목을 바꿨는지 시대순으로 재구성한다.

## 소유 범위와 경계

- 이 글이 소유한다: dense decoder 공통 forward, residual과 norm 배치, attention/FFN projection budget, GQA의 block-level 영향, QK-Norm의 score-scale 효과, 다섯 모델의 설계 계보.
- 다음 글로 넘긴다: batch와 context를 포함한 KV cache 전체 계산, RoPE scaling, sliding-window의 receptive field, MLA.
- MoE 글로 넘긴다: router, expert active/total parameter, expert parallel 통신.
- 구조만으로 설명하지 않는다: tokenizer/data/post-training 차이로 생기는 실제 benchmark 품질.

## 서사

### 0. 현재 모델에서 역으로 내려갈 이유

새 모델 config의 이름은 많지만 실제로 확인할 축은 residual, norm, token mixing, feature mixing, position, layer schedule이다. 공통 계약을 먼저 고정한다.

### 1. GPT-2 XL: 최소 기준점

- learned absolute position, pre-LayerNorm, causal MHA, GELU FFN, 48개 block.
- attention residual과 FFN residual을 반드시 두 단계 식으로 쓴다.
- 이 기준점이 있어야 이후 변화가 정확히 한 칸씩 보인다.

### 2. Llama 3 8B: 현대 dense 표준형

- RMSNorm, RoPE, SwiGLU, GQA.
- GQA는 query 표현 전체를 줄이는 것이 아니라 K/V projection과 KV cache를 공유한다.
- RoPE는 상대적인 위상 관계를 다루기 좋지만 훈련 범위 밖 품질을 자동 보증하지 않는다.

### 3. Qwen3 8B: score 안정성과 vocab 비용

- GQA, SwiGLU, RoPE, pre-RMSNorm을 계승한다.
- Q/K projection 뒤에 QK-Norm을 추가해 vector magnitude가 attention logit을 키우는 경로를 제한한다.
- tokenizer 어휘 수와 실제 padded embedding matrix 행 수를 구분한다.

### 4. Gemma 3 27B: 모든 layer가 전체 문맥을 볼 필요는 없다

- local sliding 5개 뒤 global 1개를 반복하며 local window는 1,024.
- 4B 이상 모델은 마지막 pretraining 구간에서 128K로 확장했지만 보고서는 128K 밖에서 성능이 빠르게 저하된다고 명시한다.
- 따라서 nominal context와 usable context를 분리한다.

### 5. OLMo 3 7B: 공개된 설계로 norm과 layer schedule을 검산

- 3개 sliding-window 뒤 1개 full attention, 마지막 layer는 full.
- 7B는 32 Q heads와 32 KV heads인 MHA를 유지한다.
- 표의 `Layer norm applied to Outputs`는 표준 post-norm `Norm(h+F(h))`로 뭉개지 않고, sublayer output을 normalize한 뒤 residual에 더하는 식으로 설명한다.

## 수식 계약

모든 display 수식은 한글 underbrace/overbrace와 바로 아래 FormulaNote를 가진다.

1. pre-norm residual 두 단계
   - `u_l = h_l + Attn(Norm(h_l))`
   - `h_{l+1} = u_l + MLP(Norm(u_l))`
2. SwiGLU
   - `(SiLU(xW_g) \odot xW_u)W_d`
   - gate와 candidate 이름을 식과 설명에서 일치시킨다.
3. attention projection parameter
   - `P_attn = d q + 2 d k + q d = 2d(q+k)` where `q=H_q d_h`, `k=H_kv d_h`.
4. FFN projection parameter
   - GELU two-projection `2dm`, gated three-projection `3dm`.
5. raw/QK-normalized score
   - Qwen3의 head별 RMSNorm과 학습 scale을 설명한다. Toy 계산은 `gamma=1, epsilon=0`을 명시하고, magnitude scale가 raw score에는 남지만 RMS-normalized score에서는 양의 scale에 대해 상쇄됨을 보인다.

## 공식 근거

- GPT-2 report: https://cdn.openai.com/better-language-models/language-models.pdf
- Meta Llama 3 release: https://ai.meta.com/blog/meta-llama-3/
- Meta Llama 3 reference implementation: https://github.com/meta-llama/llama3/blob/main/llama/model.py
- Qwen3 technical report: https://arxiv.org/abs/2505.09388
- Qwen3 8B official config: https://huggingface.co/Qwen/Qwen3-8B/blob/main/config.json
- Gemma 3 technical report: https://storage.googleapis.com/deepmind-media/gemma/Gemma3Report.pdf
- Gemma official PyTorch config: https://github.com/google/gemma_pytorch/blob/main/gemma/config.py
- OLMo 3 technical report: https://arxiv.org/abs/2512.13961
- OLMo 3 7B official config: https://huggingface.co/allenai/Olmo-3-1025-7B/blob/main/config.json
- GLU variants paper: https://arxiv.org/abs/2002.05202

제3자 구조도는 방향을 잡는 보조 그림일 뿐, 숫자와 주장 근거는 위 공식 원문으로 제한한다.

## 비공개 전이 문제와 채점 기준

### 문제 A: config만 보고 block 비용 판독

`d=4096, Hq=32, Hkv=8, dh=128, m=12288, gated FFN`인 새 모델을 제시한다. 독자는 attention projection 41,943,040개, FFN projection 150,994,944개를 계산하고 FFN 쪽이 더 큰 weight budget임을 설명해야 한다. Bias와 embedding은 계산에서 제외했다고 밝혀야 정답이다.

### 문제 B: QK-Norm 반례

`q=(3,4), k=(4,3), d_h=2, gamma=1, epsilon=0`에서 q만 2배 할 때 raw scaled-dot logit과 head별 RMS-normalized logit이 어떻게 달라지는지 묻는다. Raw는 2배, normalized logit은 약 1.358로 그대로라는 결론뿐 아니라 RMS가 양의 전체 배율을 상쇄하고 실제 구현에는 학습 가능한 gamma가 남는다고 말해야 한다.

### 문제 C: 128K 주장 검증

5 local : 1 global, local window 1,024인 모델의 128K 지원 문구를 보여준다. 독자는 모든 layer가 128K full attention을 수행한다고 결론내리면 실패다. Layer schedule, RoPE scaling/training range, long-context evaluation을 별도 확인해야 한다.

## Viz/UX 계약

- 모델마다 같은 대형 SVG를 반복하지 않는다.
- 공통 block Lab은 한 번만 두고 model preset으로 숫자와 흐름을 바꾼다.
- 다섯 모델은 `이전 기준 → 새 결정 → 실행 결과 → 증거 경계`의 짧은 세로 band로 읽힌다.
- 대표 구조도는 한 번에 하나를 크게 표시하고 5개 tab으로 전환한다.
- 390/768/1440px에서 문서와 수식에 horizontal overflow가 없어야 한다.
- formula font는 12px 미만으로 내려가지 않는다.
- 핵심 model chapter는 desktop 900px, tablet 1,100px, mobile 1,450px보다 짧아야 한다. 수식은 공통 원리 절에 두고 model chapter에서 같은 메커니즘을 반복하지 않는다.
- motion은 state 전환에만 쓰고 `prefers-reduced-motion`을 따른다.

## 구현 검증

- 공통 Lab 1개, 구형 반복 `[data-dense-viz]` 0개.
- GPT-2: attention 10.24M, FFN 20.48M.
- Qwen3: attention 41.94M, FFN 150.99M.
- Gemma 3: attention 66.06M, FFN 346.82M.
- OLMo 3: attention 67.11M, FFN 135.27M.
- q scale을 바꿨을 때 raw score만 변하고 normalized score는 변하지 않는다.
- visible core chapter 5개, 기본 경로 밖 모델은 접힌 상태로 유지한다.
- 다음 학습 경로는 KV Cache와 Long Context 글로 연결한다.
