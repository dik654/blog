# Ideogram 4: Typography, Layout, Runtime content spec

## Goal
- 독자가 Ideogram 4를 “글자를 잘 그리는 최신 모델”로 외우지 않고, 납품 문구와 배치를 구조화된 조건으로 전달하는 text-to-image system으로 재구성하게 한다.
- 독자가 공개 weight, inference code, hosted API, commercial right와 roadmap을 서로 다른 계약으로 검증하게 한다.

## Scope boundary
- 현재 공개된 Ideogram 4의 input schema, single-stream DiT, flow-matching inference, sampling preset, resolution과 license를 깊게 다룬다.
- Diffusion·Flow Matching·VAE 전체 이론은 기존 `image-model-runtime`과 `dit-flow-matching-evaluation`로 위임한다.
- 회사의 benchmark 순위를 보편적 품질 결론으로 쓰지 않는다.
- Background Remover로 얻는 alpha cutout과 model inference가 직접 반환할 예정인 editable layer를 같은 기능으로 쓰지 않는다.
- Self-hosted weight와 hosted Magic Prompt·Hive moderation dependency를 같은 배포 경계로 뭉개지 않는다.

## Hard internal questions
작성된 본문만 읽고 다음 문제의 풀이 전략에 도달해야 한다.

1. “여름 한정” 문구를 캔버스 오른쪽 위 30% 영역에 넣는 납품 brief를 plain prompt가 아니라 검증 가능한 JSON condition으로 어떻게 바꿀 것인가?
2. `bbox=[100,650,360,960]`이 `[y_min,x_min,y_max,x_max]` 순서이고 `0..1000` 좌표라는 사실을 놓치면 어떤 배치 오류가 생기는가?
3. Qwen3-VL 마지막 layer 하나가 아니라 13개 intermediate hidden state를 이어 붙이는 이유를 얕은 문자 정보와 깊은 장면 의미의 관점에서 설명할 수 있는가?
4. Text와 image token을 한 sequence에 넣는 것이 typography 정확도를 자동으로 보장하지 않는 이유를 data, prompt schema, attention과 evaluation으로 나눌 수 있는가?
5. Euler flow step, CFG schedule과 VAE decode가 서로 다른 책임을 가지는 이유를 설명할 수 있는가?
6. 공개 NF4/FP8 weight를 받았다는 사실만으로 고객-facing commercial API를 운영할 수 없는 이유를 code·weight·usage right로 나눌 수 있는가?
7. “transparent layers today”와 “editable text/movable image layers follow-up”을 현재 기능과 roadmap으로 정확히 판정할 수 있는가?
8. 동일한 exact-string suite에서 OCR score가 높아도 사람이 glyph를 다시 봐야 하는 이유를 설명할 수 있는가?
9. 기본 Magic Prompt와 Hive moderation이 외부 hosted dependency라는 사실을 놓치면 폐쇄망 배포 설계에서 무엇이 빠지는가?
10. 외부 연결 없이 배포하려면 local prompt expander와 prompt·output safety filter를 어느 경계에 두고 무엇으로 회귀 검증해야 하는가?
11. 공개 code의 Apache license, 공개 weight의 비상업 조건과 고객-facing 사용 권리를 어떤 release gate에서 각각 확인해야 하는가?

## Primary source ledger
| Source | Why chosen | Claim boundary |
|---|---|---|
| Ideogram 4 official README | 9.3B, NF4/FP8, structured JSON, runtime와 public model zoo | 회사의 “best” 표현을 독립 benchmark 결론으로 확대하지 않음 |
| Official prompting guide | JSON schema, key order, bbox coordinates, palette와 magic prompt | hosted magic prompt와 공개 system prompt의 결과가 같다고 주장하지 않음 |
| Official model architecture | Qwen3-VL hidden layers, 34-block single stream, QK-RMSNorm, MRoPE, Euler sampler | 공개 문서에 없는 training corpus·exact latent patch size를 추정하지 않음 |
| Official inference reference | 48/20/12 preset, CFG schedule, 256–2048, multiples of 16, 6:1 | preset을 모든 작업의 최적값으로 일반화하지 않음 |
| Ideogram licensing page | NC public quantized weights, Apache code, self-serve/enterprise commercial boundaries | press release의 “commercial license”를 무료 weight license로 축약하지 않음 |
| Ideogram 4 release | 현재 typography·bbox·2K와 layer roadmap의 시간 경계 | follow-up layer를 현재 model inference 기능으로 쓰지 않음 |
| Official safety guide | Hive text·visual moderation과 self-host 대체 책임 | local weight만으로 폐쇄망 pipeline이 완성된다고 쓰지 않음 |

## Full-scope map
| Topic | Depth | Evidence | Failure if omitted |
|---|---|---|---|
| Production brief | deep | package exact-string fixture | model ranking으로 목표를 대체 |
| Structured caption | deep | JSON field flow + bbox formula | plain prompt와 actual model input 혼동 |
| Text features | deep | 13-layer aggregation | VLM 이름만 외우고 condition tensor를 놓침 |
| Single-stream DiT | deep | sequence + attention formula + Viz | “single stream = 정확한 글자”로 과장 |
| Flow runtime | medium | Euler update + shared foundation link | denoiser와 solver 책임 혼동 |
| Resolution/presets | medium | official preset contract | steps·2K를 보편 성능으로 과장 |
| License/release state | deep | four-lane decision gate | code license와 model usage right 혼동 |
| Evaluation | deep | exact text, bbox, palette, latency gates | 샘플 한 장으로 채택 |
| Full diffusion theory | defer | `dit-flow-matching-evaluation` | 기존 기반 중복 |
| Generic workflow replay | defer | `open-model-community-workflows` | 모델 글이 운영 허브를 복제 |

## Narrative
1. 실제 패키지 납품 실패에서 시작한다.
2. 결과를 고치기 전에 brief를 structured caption으로 바꾼다.
3. JSON이 Qwen3-VL features와 image token을 거쳐 single-stream DiT에서 섞이는 과정을 본다.
4. Flow prediction, Euler, asymmetric CFG와 VAE의 책임을 나눈다.
5. 12/20/48 step과 resolution을 작업 예산으로 읽는다.
6. Weight·code·commercial right·roadmap을 분리한다.
7. Exact string, box, palette, runtime과 replay gate로 채택을 닫는다.

## Formula contract
### Box normalization
- `b=(y_min,x_min,y_max,x_max)/1000`
- 나누는 이유: output pixel 크기와 무관한 상대 위치로 바꾼다.
- 순서 이유: official schema가 row-axis를 먼저 쓰므로 일반적인 x-first box와 혼동하지 않는다.

### Joint sequence attention
- `X=[T;I]`, `A=softmax(QK^T/sqrt(d_h))`
- 이어 붙이는 이유: text와 image 위치가 같은 attention graph에서 직접 정보를 주고받게 한다.
- `QK^T`를 곱하는 이유: query와 key feature 방향이 맞을수록 큰 값을 만들어 token pair의 관련도 점수가 된다.
- `sqrt(d_h)`로 나누는 이유: head 차원이 커질수록 dot product가 커져 softmax가 지나치게 뾰족해지는 것을 막는다.

### Euler flow update
- `v_k=w_k v_c+(1-w_k)v_u`
- `z_(k+1)=z_k+(t_(k+1)-t_k)v_k`
- 섞는 이유: step별 schedule로 conditional prompt adherence와 text-token 없는 unconditional 방향을 조절한다.
- 곱하는 이유: velocity를 시간 간격만큼 이동량으로 바꾼다.
- 더하는 이유: 현재 latent에 예측 이동량을 누적해 다음 상태를 만든다.

모든 display 수식 바로 아래에 한국어 `FormulaNote`를 1:1로 둔다.

## Prose-to-viz handoff
### IdeogramControlFlowViz
- Scene 0: 납품 brief를 exact text, box, palette 세 acceptance contract로 분해한다.
- Scene 1: plain prompt가 magic prompt 또는 직접 작성으로 structured JSON이 되는 경계를 보인다.
- Scene 2: Qwen3-VL의 13개 layer feature와 image latent token이 joint sequence에 들어간다.
- Scene 3: 34개의 single-stream block, timestep modulation과 velocity prediction을 보여 준다.
- Scene 4: Euler/CFG → VAE → exact string·box·palette release gate와 license lane을 닫는다.
- Step 장면은 안정된 높이의 실행 trace로 닫고, 바로 아래 독립 Contract lab에서 natural/JSON, exact text, style, y-first box, palette와 conditional/unconditional branch를 바꿔 납품 pass/check를 계산한다.
- Mobile에서는 stage를 한 열로 쌓고 현재 장면의 핵심만 강조한다.
- Viz는 장식용 직선 네트워크가 아니라 각 stage의 input, transformation, output과 failure owner를 표시한다.

## Evaluation contract
- 390×844, 768×1024, 1440×900에서 document/Viz horizontal overflow가 1px 이하다.
- StepViz 다섯 장면을 button으로 전환할 수 있다.
- 장면 전환에 따라 조작 실험실이나 재생 control의 위치가 크게 이동하지 않는다.
- display formula 3개와 FormulaNote 3개가 1:1이다.
- raw LaTeX와 `.katex-error`가 없다.
- public weight, code와 commercial right가 별도 문장과 source로 보인다.
- editable text layer가 follow-up이라고 명시된다.
- learning path는 common image runtime → Ideogram case → workflow replay 순서다.

## Intent log for smaller-model reproduction
- 최신 모델 이름에서 시작했지만 독립 글의 중심은 model card 표가 아니라 “brief → condition → joint compute → sampler → acceptance evidence” invariant로 좁혔다.
- 공식 문서가 강하게 말하는 benchmark claim은 채택 결론에서 제외하고, 구조·입력·라이선스처럼 직접 검증 가능한 사실만 본문 뼈대로 썼다.
- Diffusion 수학 전체를 복제하지 않고 이 모델에서 달라지는 structured caption, 13-layer feature와 license 경계만 남겼다.
- Viz는 모델 상자 나열이 아니라 납품 실패의 소유자가 어느 stage인지 찾는 실행 trace로 설계했다.
