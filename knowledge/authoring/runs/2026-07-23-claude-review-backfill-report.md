# Claude review backfill

> **Identity 수치 정정:** 이 문서의 과거 70개 완료 표기는 provider header를 보존하지 않아
> true-Claude coverage 증거로 사용할 수 없다. 최종 판정은
> `2026-07-23-claude-review-final-identity-audit.{json,md}`가 대체한다.
> 최종 결과는 고유 article **71/71**, Sonnet 채택 실행 74회, 실패·fallback 50회다.

## 목적

과거 Context Manager HTTP 500 때문에 누락된 Claude 검토를 article 단위로 다시 실행한다. Codex가 각 지적을 vendored source, 수식 재계산, 브라우저와 테스트로 독립 검증한 뒤 확인된 결함만 수정한다.

## 실행 규칙

- Context Manager `runDelegatedPrompt`와 `harness:claude-code:sonnet`만 사용한다.
- Codex가 Claude CLI를 직접 호출하지 않는다.
- 한 worker에는 한 article과 direct import, content spec, 관련 test만 준다.
- 동시에 최대 네 worker를 실행한다.
- article 검토가 끝난 route만 별도의 짧은 sequencing 검토로 닫는다.
- 기본 authored path 밖의 `olmocr-2`도 과거 실패 기록에 포함된 이상 독립 단건으로 검토한다.
- 과거 실패 기록은 지우지 않고 각 원 보고서에 `claude_backfill` 결과를 추가한다.

## 현재 결과

- 이전 turn 완료: LLM architecture 5, post-training 3, pretraining 1, RL 7.
- 이번 묶음 완료: Safe RL, disaggregated serving, vLLM request runtime 4, vLLM serving, serving control-plane 5.
- vLLM request runtime 검증: Playwright 9/9, viewport 390/768/1440, document overflow 0.
- serving control-plane 검증: Playwright 8/8, viewport 390/768/1440, document overflow 0.
- vLLM source fidelity 검증: Playwright 1/1, 실제 vendored source의 실행 반환값·Scheduler 생성·GPU worker 위임 확인.
- RNN·LSTM 검증: 새 계약 및 responsive Playwright 6/6 통과.
- BERT 검증: MLM fixture·StepViz·Transformer 연계·responsive Playwright 6/6 통과.
- Transformer 검증: Stanford source URL HTTP 200 및 계산·responsive Playwright 6/6 통과.
- 학습·RL 검증: 15/15 통과. AMP, checkpoint 선택·재개, untouched test와 private fixture 분리를 다시 확인했다.
- 데이터 엔진 검증: 4/4 통과. 교육용 slider 근사와 실제 연구 수치를 구분하고 canonical Microsoft Research URL을 연결했다.
- Animation production 검증: 19/19 통과. 여섯 글 모두 390/768/1440에서 수식·문서 overflow가 없고, 여섯 공통 Viz를 단계 선택·자동 재생이 가능한 StepViz로 바꿨다.
- ComfyUI runtime 검증: 25/25 통과. 여덟 글 모두 390/768/1440에서 검증하며, 공통 정적 Viz 일곱 개를 semantic StepViz로 바꿨다.
- Computer vision 계약 검증: 15/15 통과. Vision contract, object detection, CLIP, Deformable DETR, object-axis tensor와 재사용 글의 path-state 유지까지 390/768/1440에서 확인했다.
- Vision foundation 검증: CNN·ResNet·ViT 9/9, computer vision 통합 실행 22/22 통과. 라이브 라우트 밖의 사용자 수정 legacy 파일은 삭제하지 않았다.
- Document AI 검증: 12/12 통과. Assembly, HTML table의 수식·source/grid 일치, grid→release 연결과 olmOCR의 semantic mobile scene을 390/768/1440에서 확인했다.
- On-device runtime 검증: 6/6 통과. 360/390/768/1440에서 export·delegation·release 산술과 UI를 확인했다.
- Speech 허브·실시간 대화 검증: 115/117 통합 실행에서 예전 6단계 직렬 경로를 고정한 assertion 두 개만 실패했고 나머지는 통과했다. 설계 계약에 맞는 2단계 interaction 분기로 expectation을 바꾼 뒤 두 항목도 재실행해 통과했다.
- ComfyUI 보강 재검증: producer/consumer 정의, quantized runtime 설명, edit 글의 condition-routing prerequisite를 보완했다. FaceDetailer·Tiled Diffusion·Ultimate SD Upscale은 core가 아닌 각 third-party package로 출처 경계를 분리했다.
- 음성 생성·인식·codec과 효율 추론 검증까지 완료했다. Native speech의 잘못된 수식 지적 두 건은 실제 390px scale 측정으로 반려했고, 대신 RNN-T 수식의 0.77 scale 결함을 찾아 네 줄 구조로 수정했다.
- 모든 article backfill과 11개 route sequencing 검토를 완료했다. 마지막 broad computer-vision timeout은 contract·promptable·detection 세 worker로 나눠 닫았고, 남은 단계는 전체 build와 재현 기록 정리다.
- 전체 build와 production 재배포를 완료했다. 운영 도메인에서 Promptable Vision의 multi-path state 1/1, Document AI handoff 1/1, Speech·Audio handoff 2/2가 통과했고 새 JS·CSS asset은 `200`, legacy `/blog/`는 `/lab/blog/`로 `308`이다.
- 이 완료 범위는 이번 AI backfill 고유 글 70개와 11개 경로다. 저장소 전체 590개 글 감사의 비AI release blocker 29개와 enrichment backlog 480개는 별도 후속 queue이며, AI queue가 0이라는 이유로 전체 저장소 완료로 합치지 않는다.

## 확인 후 반영한 결함

1. `vllm-paged-attention`: 일반 block 할당을 `popleft()`로 잘못 서술한 부분을 실제 `popleft_n(num_blocks)`로 수정했다.
2. `vllm-scheduler`: `_preempt_request()`와 `update_from_output()`의 CodeSidebar line range를 vendored source에 맞췄다.
3. `vllm-spec-decode`: 기대 speedup 식의 곱셈 표기, MTP 정의, n-gram proposer, scheduler rollback과 RejectionSampler annotation을 보강했다. 정적 4단계 목록은 interactive StepViz로 교체했다.
4. `vllm-vlm-serving`: media ingress 목록을 security, processor, encoder cache, decoder admission 네 scene으로 재구성했다.
5. `rl-safe-constrained-learning`: CPO, Lyapunov, Recovery RL 각각에서 다음 primary source와 무엇을 확인할지 명시했다.
6. `vllm-serving`: 실제 파일이 아닌 legacy source excerpt를 제거하고, 남은 CodeRef를 vendored vLLM line range에 맞췄다. PagedAttention의 20.4–38.2%는 낭비율이 아니라 유효 token-state 비율임을 바로잡았다.
7. serving control-plane 5개 글: 공통 정적 도식을 semantic StepViz로 교체하고, 배포 수식의 연산 이유, Kubernetes 용량 장부 제목·수식 의미, SLO 최초 정의를 보강했다.
8. `rnn`: 확률 sample로 잘못 이름 붙인 argmax 출력을 greedy decoding으로 바로잡고 temperature와 stochastic sampling의 차이를 명시했다.
9. `lstm`: 비공개 전이 문제와 동일했던 gate·retention 숫자를 새 공개 fixture로 바꾸고 fused gate shape를 조작 가능한 workbench로 만들었다. 1997 기반 논문 링크도 연결했다.
10. `bert`: 비공개 1,000-token 문제와 공개 600-token 예제를 분리하고, 현재 encoder 사용 이유와 4단계 semantic MLM StepViz를 추가했다. 390/1440 검증 누락 지적은 기존 corpus test와 재실행 결과로 반려했다.
11. `transformer-architecture`: 잘못된 CS224N 경로를 Stanford가 실제 제공하는 Winter 2025 Assignment 4 PDF로 교체했다. 동시에 도착한 BERT test mismatch 지적은 이미 수정·통과한 상태라 stale finding으로 반려했다.
12. `training-pipeline`: universal 성능 수치와 deprecated AMP API를 제거하고, validation-selected candidate와 최종 untouched test를 분리했다. 모바일에서는 축소 SVG 대신 읽을 수 있는 단계 문장을 렌더한다.
13. `rl-decision-system-contracts`: 비공개 전이 문제와 같던 숫자를 모두 공개 예제에서 제거했다. 수식 overflow 지적은 390/768/1440 렌더 결과로 반려했다.
14. `llm-data-engine`: slider 출력이 연구 실측처럼 보이지 않도록 교육용 근사임을 표시하고 Textbooks Are All You Need II의 정식 페이지를 연결했다.
15. Animation 여섯 글: 데이터 duration 계산 예제, caption identity schema, LoRA→temporal handoff, cadence 용어, RIFE source boundary, runtime manifest 용어를 보강했다. Hidden transfer fixture와 공개 예제도 분리했다.
16. Animation Viz: production, clip, caption, intervention, cadence, release visual을 모두 단계별 상태 변화와 자동 재생이 있는 StepViz로 교체했다. 비활성 글자도 최소 55% opacity로 유지한다.
17. `comfyui-workflow-map`: local `POST /prompt`와 Cloud `POST /api/prompt`를 분리하고 dependency closure를 평문으로 설명했다.
18. `comfyui-loaders-gguf`: GGUF·BF16·FP8·quantization·OOM·dequantize·offload를 첫 등장에 설명했다.
19. `comfyui-ksampler-parameters`: sigma를 noise level에 연결하고, ComfyUI 구현식과 원 CFG 논문의 guidance 계수 기준점이 다름을 공식 source와 분리했다.
20. ComfyUI 공통 Viz: workflow, typed DAG, loader, sampling, condition routing, postprocess, replay bundle을 모두 semantic StepViz로 교체했다.
21. `comfyui-core-graph`: producer와 consumer를 값 생성·소비 방향으로 첫 등장에 정의했다.
22. `comfyui-lora-control-conditioning`: quantized runtime을 low-bit weight loader·kernel 조합으로 풀고, 다음 edit 글의 선행 계약에 condition routing을 추가했다.
23. `comfyui-upscale-postprocess`: FaceDetailer와 tiled processing 구현을 ComfyUI core에서 분리하고 Impact-Pack, TiledDiffusion, Ultimate SD Upscale 각 저장소를 직접 연결했다.
24. `object-detection-systems`: DETR·일대일 matching, NMS, FDR와 GO-LSD를 실제 사용 전에 풀어 설명했다. 논문 주장과 수식·상호작용 Viz는 1차 근거와 일치했다.
25. `comfyui-custom-nodes-ops`: semver·commit pin, Python lock과 graph indirection을 운영 gate 전에 설명했다. 별도 handoff section과 SVG 강제 지적은 이 route의 cycle-closing HTML-grid 계약에 맞지 않아 반려했다.
26. `vision-system-contracts`: 수식 기호의 JS escape 손실을 수정하고 IoU·NMS·AP·COCO를 풀어 썼다. SAM 2·DETR의 주장 한계와 별도 private transfer fixture도 복구했다.
27. `comfyui-edit-models-flux-qwen`: [klein] 4B·9B, license와 약 13GB 안내를 BFL 전용 근거에 연결했다. Latent·VAE·sampling control·AIO·quantized variant를 풀고 공통 StepViz의 모바일 본문 폭도 넓혔다.
28. `clip-vision-language-model`: JS 문자열에서 사라지던 KaTeX 명령을 복구하고 softmax·대칭 InfoNCE·inverse temperature를 설명했다. 첫 장면은 image-text pair로 바꾸고 모든 retrieval 사례가 P@3와 MRR을 함께 보여 주며, 모바일에는 절대 좌표 scatter 대신 읽을 수 있는 pair row를 쓴다.
29. `vision-transformer`: MLP를 첫 등장에 다층 퍼셉트론으로 풀었다. 정적 ConceptPrimer는 도입 보조이고 실제 PatchBudgetLab·VisionBackboneLab이 상호작용을 담당하므로 삭제 지적은 반려했다.
30. `cnn`: 라이브 글의 수식·출처·라우트·private fixture·반응형 lab은 모두 통과했다. 연결되지 않은 legacy 파일에는 기존 사용자 변경이 포함돼 있어 유지했다.
31. `deformable-detr`: DETR·일대일 matching·cross-attention·bilinear interpolation·AP_small·mAP를 먼저 정의하고, original DETR의 single-scale 경계와 head별 value projection을 복구했다. 교육용 sampling 좌표와 독립 feature projection도 명시했다.
32. `resnet`: FormulaNote의 loss·Jacobian 기호가 일반 JS 문자열에서 역슬래시를 잃던 문제를 `String.raw`로 수정했다.
33. `ocr-document-ai-map`: RAG·bounding box·TEDS를 처음 등장에 풀고 실행 경로, parser 책임 경계, release 질문을 선택 가능한 Viz로 바꿨다. 공통 typed-block Viz는 block별 schema 차이를 보여 준다.
34. `paddleocr-vl`: whole-page end-to-end VLM이라는 잘못된 설명을 제거했다. PP-DocLayoutV2 검출·reading order → crop → 0.9B VLM 인식 → 집계의 공식 두 단계 구조로 본문과 여섯 단계 Viz를 맞췄다.
35. `document-structure-assembly`: tau·delta 렌더링, 3상태 판정식, typed block schema를 수정하고 공개 예제와 private transfer fixture를 분리했다.
36. `html-table-structure-reconstruction`: source token과 collision grid를 일치시키고 hole 위치와 미확정 값을 구분했다. 수식 연산 이유를 보강하고 390/768/1440 검증을 추가했다.
37. `ocr-runtime-evaluation`: 첫 등장 용어와 KaTeX 기호 escape를 고치고 gate vector에서 release 상태를 계산하도록 바꿨다.
38. `olmocr-2`: 용어 정의, trace·verifier 상호작용, 모바일 semantic stage를 추가하고 임의 progress와 raw code block을 제거했다.
39. `on-device-llm-runtime`: TTFT를 첫 사용에서 풀고 숫자·수식·private fixture·반응형 계약을 재검증했다.
40. `speech-audio-models`: current-first path의 0단계로 연결하고 정적 분기 목록을 관측 증거가 바뀌는 책임 선택 lab으로 교체했다.
41. `realtime-duplex-voice-systems`: 수식 범례와 media 용어를 보완하고 Turn mode의 잘못된 interruption state를 수정했다.
42. `native-speech-generation`: RVQ 12개 codebook을 모두 렌더하고 수식 범례와 MoE 첫 정의를 보강했다. 모바일 수식 축소 의심은 실제 scale 1.00으로 반려했다.
43. `speech-recognition-objectives`: WER·CER와 RNN-T lattice를 정의하고, 실제 390px에서 0.77까지 축소되던 RNN-T 식을 네 줄로 나눴다. CTC blank 설명 중복 지적은 기존 FormulaNote를 확인해 반려했다.
44. `efficient-inference-on-device`: KV cache, TTFT, PTQ, QAT, FP16, BF16, PLE와 memory 식의 모든 항을 정의하고 Gemma 3n 공식 범위로 주장을 제한했다.
45. `audio-representation-neural-codecs`: STFT·DFT, causal receptive field와 real-time factor를 정의하고 인접 실시간 음성 글의 공개 fixture가 비공개 문제와 겹치지 않게 바꿨다.
46. Document AI route: typed-block·tree 선행지식 이름을 실제 도입 글과 맞추고, 표 점유 격자에서 runtime release gate로 이어지는 양방향 링크를 추가했다. 잘못된 `InternalLink` props도 실제 링크가 렌더링되는 형태로 고쳤다.
47. Speech·Audio route: interaction, generation, recognition, representation을 한 줄로 강제하던 경로를 책임별 분기로 복구했다. 생성·인식은 공통 audio representation으로, representation은 신호와 시스템으로 내려간다.
48. Animation·ComfyUI route: LTX 사례에서 production contract로 넘어가는 링크, temporal finishing의 직전 산출물, ComfyUI 후처리→운영 handoff와 사이드바 누락 단계를 보강했다. 공유 Viz 디렉터리 rename은 동작·학습 흐름 결함이 아니라 반려했다.
49. Computer Vision route: 작업 계약의 tensor→평가 순서를 맞추고 object axis 예제를 추가했다. Promptable route는 object query와 CNN 바닥까지 내려가며 detection 도입은 아직 읽지 않은 ViT·후속 계약을 선행 가정하지 않는다.
50. 재사용 경로 navigation: 하나의 article이 여러 learning path에서 쓰일 때 글의 기본 소유 path로 튀던 구조를 수정했다. 선택한 `learningPathId`를 rail과 전역 내부 링크 handler가 보존하고, 유효한 path에 현재 글이 포함될 때만 우선한다.

## 경로 sequencing 검증

- `posttraining`: RLHF 안에 policy gradient, critic, advantage와 importance ratio의 최소 다리를 추가해 PPO 선행개념 점프를 닫았다. Qwen 진단 글은 필수 경로 밖의 보조 글로 유지했다.
- `pretraining`: 범용 PyTorch 글 대신 LLM 전용 run 글을 추가하고 `예산 → 데이터 신호 → 학습 실행`의 세 글이 같은 path를 소유하도록 바꿨다. 상위 분류도 세 단계를 한 경로로 집계한다.
- `reinforcement-learning`: MDP·Bellman에서 TD·DQN으로 내려가는 계산 바닥은 결함 없음. DQN의 neural-network 구현 기반은 이 제한 경로의 외부 선행지식으로 유지한다.
- `serving-control-plane`: release, readiness, capacity lease, route evidence, observability의 다섯 단계가 결함 없이 이어진다.
- `vllm-runtime`: disaggregated entry가 spec decode·VLM 단계를 건너뛰던 handoff와 vLLM 전체 글의 PagedAttention 연결·선행개념을 보강했다. Field-guide anchor는 component 내부에 이미 존재해 반려했다. 관련 회귀 10/10을 포함한 on-device 합산 16/16 통과.
- `on-device`: 다른 path가 소유한 quantization과 존재하지 않으면서 주제도 서버 구매인 hardware 단계를 제거했다. Device release → memory·latency budget 두 단계가 precision·CPU/GPU/NPU 배치까지 이미 닫는다.
- `document-ai`: typed block → assembly tree → table occupancy grid → release gate의 용어와 링크를 닫았다.
- `speech-audio`: 네 sibling 책임을 직렬로 강제하지 않고 interaction·generation·recognition·representation 분기를 공통 audio·signal 기반에 연결했다.
- `animation-production`: 기존 LTX 구현 사례를 새 production contract의 입구에 연결하고 직전 산출물 계약을 맞췄다.
- `comfyui-runtime`: 8단계 설명과 prerequisites가 edit·postprocess·earliest failure 산출물을 빠짐없이 반영한다.
- `computer-vision`: 첫 broad worker의 300초 timeout 뒤 세 route로 나눈 retry가 모두 성공했다. Current-first 순서를 뒤집는 제안은 반려하고, 실제 누락 기반·handoff·multi-path navigation만 수정했다.

## 실패 이력

- `llm-data-engine`: 첫 Claude worker가 420초 timeout. 재시도 성공 후 지적을 반영했다.
- `comfyui-core-graph`: 첫 Claude worker가 420초 timeout. 범위를 줄인 재시도는 성공했고 확인된 용어 결함을 수정했다.
- `comfyui-edit-models-flux-qwen`: 첫 Claude worker가 420초 timeout. 글과 직접 Viz만 보는 좁은 재시도는 성공했고 확인된 결함을 수정했다.
- `resnet`: 넓은 범위의 Claude worker가 420초 timeout. 좁은 재검토에서 확인된 수식 기호 한 곳을 수정하고 회귀 검증을 마쳤다.
- `ocr-runtime-evaluation`: 넓은 범위의 Claude worker가 420초 timeout. 좁은 재검토에 성공해 결함 수정과 테스트를 마쳤다.
- `olmocr-2`: 넓은 범위의 Claude worker가 420초 timeout. 외부 탐색 없는 좁은 재검토에 성공해 scene 계약을 보강했다.
- `on-device-llm-runtime`: 넓은 범위의 Claude worker가 420초 timeout. 좁은 재검토에 성공해 숫자·반응형 계약까지 닫았다.
- `route:computer-vision`: 넓은 route worker가 300초 timeout. contract, promptable, detection 세 Context Manager worker로 분할해 모두 완료했다.

전체 상태와 남은 article queue는 같은 이름의 JSON ledger를 source of truth로 사용한다.
단건 queue가 닫히면 posttraining, pretraining, RL, vLLM, serving, on-device, vision, document, speech, animation, ComfyUI 순으로 metadata·도입·handoff·source boundary만 보는 경로 sequencing 검토를 실행한다.

전체 추론 과정, finding 수용·반려 규칙과 4B·9B 모델용 분할 실행 절차는 `2026-07-23-small-model-blog-reconstruction-protocol.md`에 기록했다.
