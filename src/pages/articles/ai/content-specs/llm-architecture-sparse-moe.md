# Sparse MoE 재구성 명세

## 소유 질문

`671B total / 37B active` 같은 표기를 보았을 때, token이 실제로 실행하는 expert weight와 항상 실행되는 attention·embedding·dense prefix, training capacity, GPU 통신을 어떻게 분리해 계산하는가?

## 경로 계약

- 현재 입력: 2026 모델의 수백 expert, 작은 active path, shared expert, compressed/hybrid attention 결합.
- 앞에서 가져올 것: Dense decoder의 두 residual과 gated FFN `3dm`, KV·Long Context의 attention 비용 장부.
- 이 글의 출력: expert-bank parameter ledger, top-k routing, capacity/overflow/no-drop 경계, load metric, dispatch-return payload, expert-parallel straggler.
- 다음 필수 경로: Hybrid·Linear Attention에서 FFN sparsity와 sequence-state sparsity를 다시 분리한다.
- 최소 역사선: Switch Transformer, Mixtral, DeepSeekMoE, DeepSeek-V3, Qwen3. 1990년대 원형 MoE나 GShard 전체 역사는 기본 경로에서 숨긴다.

## 비공개 전이 문제

모델 A는 DeepSeek-V3형 config `d=7168`, expert intermediate `m=2048`, gated expert `3dm`, 61 layers 중 첫 3개 dense, routed expert `E=256`, top-k `8`, shared expert `s=1`을 쓴다. 보고값은 `671B total / 37B active`다. 모델 B는 Qwen3-235B-A22B형 `d=4096`, `m=1536`, 94 MoE layers, `E=128`, `k=8`, `s=0`, 보고값 `235B / 22B`다.

본문을 읽은 독자는 다음을 해결할 수 있어야 한다.

1. 모델 A의 expert 하나가 `3dm=44,040,192` weights임을 계산한다.
2. 모델 A의 MoE layer 하나에서 expert bank 전체는 `11.32B`, token당 활성 expert path는 `396.36M`, bank 내부 활성 비율은 `(8+1)/(256+1)=3.50%`임을 계산한다.
3. 58개 MoE layer 전체 expert bank는 `656.46B`, token당 활성 expert path는 `22.99B`임을 계산한다. 보고 active `37B`와의 약 `14.01B` 차이가 attention, embedding, dense prefix 같은 항상 켜진 경로임을 설명하되 정확한 breakdown으로 과장하지 않는다.
4. 모델 B의 expert 하나 `18.87M`, layer bank `2.42B`, active bank `150.99M`, bank ratio `6.25%`, 94-layer bank `227.10B`, active expert path `14.19B`를 계산한다.
5. `T=16`, `E=4`, `k=2`, capacity factor `1.0`에서 expert capacity가 8 assignments임을 계산한다. Load `[16,10,4,2]`이면 overflow assignment가 10개, assignment drop rate가 `31.25%`다.
6. 같은 load를 no-drop serving으로 실행하면 모든 assignment는 보존되지만 최대 load/ideal load가 `2.00x`여서 가장 바쁜 expert가 step latency를 정함을 설명한다.
7. Hidden `d=7168`, token `T=4096`, top-k `8`, bf16에서 dispatch와 return payload 하한이 `2Tkd b=896 MiB/MoE layer`임을 계산한다. Protocol, metadata, padding, topology는 제외한다.
8. DeepSeek-V3의 routing bias는 top-k 선택에만 쓰이고 expert output을 섞는 gate weight는 원 affinity에서 나온다는 경계를 설명한다.

## 출처와 저자 의도

| 근거 | 복원할 의도 | 사용 범위 |
|---|---|---|
| Fedus et al. 2021 Switch | top-1 routing, capacity factor, overflow/drop, auxiliary balance loss | training capacity의 최소 기준점 |
| Jiang et al. 2024 Mixtral | 모든 FFN을 8-expert top-2로 교체, weighted combine, expert parallel | decoder-only 실행 기준 |
| Dai et al. 2024 DeepSeekMoE | fine-grained segmentation과 shared expert isolation | expert granularity와 공통 경로 |
| DeepSeek-V3 2024 | sigmoid affinity, routing-only bias, node-limited routing, no token dropping | modern load control과 communication boundary |
| Qwen3 2025 | 128 expert, top-8, no shared expert, global-batch balance loss | shared path가 필수가 아님을 보여 주는 분기 |

## 본문 구조

1. 현재 모델의 total/active 표기를 expert-bank와 always-on path로 분해한다.
2. Dense gated FFN 한 칸을 router, routed experts, optional shared expert로 교체한다.
3. Expert weight, total bank, active bank를 matrix shape에서 계산한다.
4. Training capacity/overflow와 no-drop serving/max-load를 서로 다른 정책으로 실행한다.
5. Expert parallel dispatch-return payload와 node limit를 계산한다.
6. Switch → Mixtral → DeepSeekMoE → DeepSeek-V3 → Qwen3의 다섯 설계 전환을 읽는다.
7. 2026 recombination을 attention·MoE·runtime 독립 축으로 다시 판독하고 Hybrid·State로 넘긴다.

## Viz 계약

### Expert parameter ledger

- DeepSeek-V3와 Qwen3-235B-A22B segmented preset.
- `d`, `m`, MoE layers, routed/active/shared expert를 노출하고 expert `3dm`에서 수치를 재구성한다.
- Per-layer total bank, active bank, expert-bank ratio, all-layer expert weights, reported total/active ratio를 별도 행으로 표시한다.
- Expert-bank ratio와 model-wide active ratio를 같은 막대로 겹치지 않는다.

### Routing, capacity and dispatch lab

- Balanced `[8,8,8,8]`와 collapsed `[16,10,4,2]` top-2 assignment를 전환한다.
- Switch capacity와 no-drop serving 정책을 전환한다.
- Capacity factor 1.00/1.25/1.50에서 capacity, admitted, overflow, drop rate를 계산한다.
- No-drop에서는 overflow 0과 max/ideal load ratio를 보여 준다.
- Token→expert assignment strip과 expert load bar를 같은 색 legend로 연결한다.
- DeepSeek-V3형 `T=4096,k=8,d=7168,b=2` dispatch-return payload `896 MiB`를 별도 network ledger로 표시한다.

## 수식 계약

- Dense residual에서 MoE가 교체되는 위치, router score/top-k/weighted sum, expert `3dm`, total/active bank, capacity, normalized assignment share, Switch balance loss, dispatch payload를 분리한다.
- 모든 display equation은 한국어 underbrace와 바로 뒤 FormulaNote를 가진다.
- `active parameter`, `active expert-bank parameter`, `FLOPs`, `latency`, `communication bytes`를 같은 의미로 쓰지 않는다.
- Top-k assignment share는 `Tk`로 정규화한다. Switch의 원래 top-1 `f_i`와 일반 top-k 설명을 섞지 않는다.

## 검증 계약

- 390·768·1440px에서 document/formula/Viz overflow 0, 실제 KaTeX 내부 font 12px 이상.
- article table 0, core lineage chapter 5개, parameter lab 1개, routing/dispatch lab 1개.
- FormulaNote 수가 display equation 수와 같다.
- 기본 numeric oracle `44.04M`, `11.32B`, `396.36M`, `3.50%`, `656.46B`, `22.99B`, `896 MiB`, capacity `8`, overflow `10`, drop `31.25%`, no-drop straggler `2.00x`.
- Qwen preset과 capacity factor 1.50, balanced/collapsed, capacity/no-drop 상태를 모두 실행한다.
- Source figure tab, image natural width, primary source links, KV 이전 링크와 Hybrid 다음 링크를 확인한다.
- Claude 검토는 context-manager를 통해서만 요청하고 provider 실패도 collaboration trace에 기록한다.
