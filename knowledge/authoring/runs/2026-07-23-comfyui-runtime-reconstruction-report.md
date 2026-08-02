# ComfyUI workflow runtime reconstruction report

## Observed

기존 ComfyUI 분기는 workflow, graph, loader, sampler, conditioning, edit, upscale, custom node라는 이름은 갖고 있었지만, 독자가 커뮤니티 workflow를 가져와 자기 장비에서 재현하고 다른 사람에게 넘기는 한 번의 실행 흐름으로 이어지지 않았다. Loader와 sampler의 책임이 섞였고, node pack 목록과 parameter 표가 판단보다 먼저 나왔으며, workflow JSON만 저장하면 재현된다는 인상을 줄 수 있었다.

## Inferred

ComfyUI의 최소 바닥은 node 사용법이 아니라 **재현 가능한 typed execution contract**다. 독자는 결과 이미지부터 역추적해 어떤 output이 어떤 typed input을 소비했는지, 어떤 component와 precision이 실제로 적재됐는지, 어떤 seed·trajectory·condition이 결과를 바꿨는지, 어느 dependency version이 같은 실행을 보장하는지를 분리해야 한다. 따라서 article 순서는 UI 소개가 아니라 artifact가 완성되는 순서여야 한다.

## Decided

1. 경로를 `실행 계약 → 타입 DAG → 부품 로딩 → Sampling → 조건 라우팅 → Image Edit → 후처리 책임 → Release 운영`의 여덟 판단 글로 고정한다.
2. Workflow 글은 import, dependency inventory, API snapshot, queue trace와 replay bundle만 소유한다.
3. Graph 글은 typed edge, dependency execution, cache invalidation, Never·Bypass와 consumer reverse trace만 소유한다.
4. Loader 글은 denoiser·text encoder·VAE·adapter manifest, architecture compatibility, precision plan과 memory lower bound만 소유한다.
5. Sampler와 conditioning은 trajectory parameter와 condition path를 분리하고, edit·postprocess·custom node는 각각 model-specific edit, earliest failure ownership, dependency release를 맡는다.
6. 숫자가 붙은 route label과 UI가 생성하는 순번을 중복하지 않고, 모든 Viz는 모바일에서 내부 가로 scroll 없이 한 오해만 제거한다.

## Hidden transfer problem

12GB VRAM 장비에 community edit workflow를 import했는데 custom node 일부가 없고, 비슷한 loader가 여러 개이며, denoiser·text encoder·VAE가 BF16·FP8·GGUF로 섞여 있다. Prompt만 바꿔 partial rerun해야 하지만 LoRA는 잘못된 MODEL branch에 붙어 효과가 없고, ControlNet 좌표는 crop 후 canvas 좌표와 어긋나며, detailer가 base defect를 가릴 수 있다. 다른 팀원은 node와 model version drift 때문에 같은 결과를 재생하지 못한다. 새 본문만 읽고 다음을 판단할 수 있어야 한다.

- Workflow JSON, API snapshot, asset checksum, environment와 execution trace를 서로 다른 artifact로 보존한다.
- Output consumer에서 upstream typed edge를 역추적해 실제 실행 branch와 invalidation 범위를 찾는다.
- Model family 이름이 아니라 component별 architecture·precision·loader output을 manifest로 만든다.
- Static weight lower bound와 activation·temporary buffer가 포함된 peak VRAM을 구분한다.
- Seed를 고정한 controlled sweep으로 steps·CFG·sampler·scheduler 책임을 분리한다.
- Prompt, LoRA, ControlNet, reference condition을 서로 다른 consumer path로 추적한다.
- Crop-local 좌표를 canvas-global 좌표로 되돌린 뒤 가장 이른 실패 stage에서 수정한다.
- Package identity, immutable version, environment, model manifest와 before/after evidence를 release bundle로 묶는다.

## Sources and boundaries

- [ComfyUI Workflow](https://docs.comfy.org/development/core-concepts/workflow), [Nodes](https://docs.comfy.org/development/core-concepts/nodes), [Links](https://docs.comfy.org/development/core-concepts/links), [Properties](https://docs.comfy.org/development/core-concepts/properties)는 graph 저장, typed connection과 node state의 공식 계약에만 사용했다.
- [Dependencies](https://docs.comfy.org/development/core-concepts/dependencies), [Models](https://docs.comfy.org/development/core-concepts/models)는 asset·model·custom node·Python dependency와 model file 종류를 구분하는 근거다. 존재하지 않는 `model-files` URL은 검증 중 발견해 제거했다.
- [Execution Model Inversion](https://docs.comfy.org/development/comfyui-server/execution_model_inversion_guide), [Lazy Evaluation](https://docs.comfy.org/custom-nodes/backend/lazy_evaluation)은 dependency ordering과 선택된 lazy input의 실행 경계에만 사용했다.
- [Cloud API](https://docs.comfy.org/development/cloud/overview), [Submit Workflow](https://docs.comfy.org/api-reference/cloud/workflow/submit-a-workflow-for-execution)는 API-format workflow, `prompt_id`, `node_errors`와 partial execution target의 공식 범위를 확인했다.
- [KSampler](https://docs.comfy.org/built-in-nodes/sampling/ksampler), [ControlNet](https://docs.comfy.org/tutorials/controlnet/controlnet), [Image Upscale](https://docs.comfy.org/tutorials/utility/image-upscale)는 각 runtime input과 stage 경계를 설명하는 데만 사용했다. 특정 값이나 workflow를 보편 최적값으로 승격하지 않았다.
- [Manager](https://docs.comfy.org/manager/overview), [Registry](https://docs.comfy.org/registry/overview), [Registry Standards](https://docs.comfy.org/registry/standards)는 install·snapshot·package identity·published version·security boundary를 분리하는 근거다.
- [LoRA](https://arxiv.org/abs/2106.09685), [Classifier-Free Guidance](https://arxiv.org/abs/2207.12598), [IP-Adapter](https://arxiv.org/abs/2308.06721)는 각각 low-rank update, guided score composition, decoupled image condition의 원 논문 경계만 담당한다.
- [ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)는 GGUF loader의 실제 지원 범위를 보여 주는 구현 근거이며 ComfyUI core의 보편 공식 기능으로 일반화하지 않았다.

## Claude collaboration

사용자 지시대로 context-manager `/api/chat`에 `model=claude-sonnet-4-6`, `fresh=true`로 여덟 article boundary, 초보 오해, hidden transfer problem, source boundary와 4B·9B handoff를 검토하도록 요청했다. Context-manager 인증과 routing은 성공했지만 provider가 HTTP 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았고 Claude 응답이 반영되었다고 기록하지 않는다. 이 실패는 다음 배치의 재시도 대상으로 유지한다.

## Changed

- 여덟 글을 하나의 재현 가능한 execution route로 재작성하고 category metadata, sidebar와 authored learning path를 같은 순서로 맞췄다.
- 공통 responsive Viz 일곱 종류를 구현해 contract, typed DAG, component manifest, sampling trace, condition route, postprocess ownership과 release evidence를 서로 다른 그림으로 설명했다.
- Static memory, CFG, LoRA와 coordinate transform 표시 수식에 한국어 underbrace와 인접 `FormulaNote`를 적용했다.
- Model list, node pack list와 universal parameter table 대신 실제 artifact, invariant, controlled experiment와 failure handoff를 본문 단위로 배치했다.

## Verified

- 전용·authored path·대표 회귀 Playwright: 59/59 통과.
- 390·768·1440px 표본에서 document overflow와 article 내부 가로 scroll 0.
- 네 핵심 display formula의 390px scale 1.00, KaTeX parse·console·page error 0.
- Workflow, loader, sampler, condition, postprocess와 ops Viz를 모바일·태블릿·데스크톱 screenshot으로 확인했다.
- Production build: 9,391 modules, 성공.
- `audit:learning-flow`: 등록 589개, AI 279개에서 release blocker와 formula gap 0. 전체 corpus에는 non-AI formula blocker 29개와 enrichment backlog 529개가 남아 있다.
- 공개 category와 여덟 article URL 모두 HTTP 200.
- 공개 환경 집중 Playwright 11/11 통과.

## 4B · 9B handoff

4B worker는 한 글만 받고 `reader_decision`, `input_artifact`, `output_artifact`, `typed_boundary`, `invariant`, `controlled_change`, `failure_owner`, `source_claim`, `source_boundary`, `next_handoff`를 JSON으로 낸다. Node 이름을 나열하거나 수치를 추천하는 대신 실행 전후 artifact가 무엇인지 적고, 수식은 `equation`, `korean_underbrace`, `symbol_note`로 분리한다.

9B reviewer는 여덟 packet과 hidden transfer problem을 받아 `workflow_vs_environment`, `type_vs_value`, `static_vs_peak_memory`, `trajectory_vs_condition`, `local_vs_global_coordinate`, `package_vs_node`, `replay_completeness`를 검사한다. Workflow JSON만으로 재현된다고 쓰거나 active precision을 model family 전체에 묶거나 postprocess로 upstream defect를 가린 packet은 반려한다. Orchestrator만 source freshness, route metadata, browser QA, build와 deployment를 닫는다.
