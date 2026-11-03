import type { CodeRef } from "@/components/code/types";
import modelPy from "./codebase/vllm/vllm/config/model.py?raw";
import convertorPy from "./codebase/vllm/vllm/transformers_utils/model_arch_config_convertor.py?raw";
import backendUtilsPy from "./codebase/vllm/vllm/v1/attention/backends/utils.py?raw";
import mlaAttentionPy from "./codebase/vllm/vllm/model_executor/layers/attention/mla_attention.py?raw";
import dcpPy from "./codebase/vllm/vllm/v1/attention/ops/dcp.py?raw";
import tritonMlaPy from "./codebase/vllm/vllm/v1/attention/backends/mla/triton_mla.py?raw";

/** 본문 대응: vLLM v0.33.0(commit 4ba787e) 원문. 줄 번호는 codebase/ 스냅샷 기준입니다. */
export const codeRefs: Record<string, CodeRef> = {
  "kv-heads-per-rank": {
    path: "vllm/vllm/config/model.py",
    highlight: [1663, 1683],
    desc: "rank 한 장이 들 KV head 수를 정합니다. 문제: TP로 head를 나누면 KV도 나뉠까? 해결: GQA는 head 수 ÷ TP, MLA는 무조건 1입니다.",
    annotations: [
      { lines: [1673, 1675], color: "amber", note: "MLA면 바로 1을 돌려줍니다. decode에서는 모든 query head가 latent 하나를 읽는 MQA 모양이 되므로, rank마다 그 하나를 통째로 듭니다. Kimi K2.5 config의 num_key_value_heads 64는 여기서 쓰이지 않습니다." },
      { lines: [1677, 1683], color: "sky", note: "GQA는 total KV head ÷ TP입니다. 몫이 0이 되는 경우(KV head 4, TP 8)를 max(1, …)로 막아 rank마다 최소 한 head를 들게 하고, 그 head는 두 rank에 복제됩니다." },
    ],
    code: modelPy,
    lang: "python",
  },
  "dcp-gqa-limit": {
    path: "vllm/vllm/config/model.py",
    highlight: [1578, 1607],
    desc: "DCP 크기의 상한을 정합니다. 문제: token 축으로 나눌 rank는 어디서 오나? 해결: 같은 KV를 복제로 들고 있던 rank들만 묶습니다.",
    annotations: [
      { lines: [1579, 1588], color: "rose", note: "MLA가 아니면 TP가 KV head 수보다 커야 DCP를 켤 수 있습니다. head 축으로 이미 나뉘어 복제가 없으면 token 축으로 나눌 여분이 없기 때문입니다." },
      { lines: [1590, 1598], color: "sky", note: "GQA의 상한은 TP ÷ KV head입니다. Qwen3-235B(KV head 4)를 TP8로 돌리면 최대 DCP 2입니다. MLA는 이 검사를 건너뛰므로 DCP를 TP 크기까지 올릴 수 있습니다." },
    ],
    code: modelPy,
    lang: "python",
  },
  "mla-head-size": {
    path: "vllm/vllm/transformers_utils/model_arch_config_convertor.py",
    highlight: [91, 98],
    desc: "MLA cache 한 칸의 폭을 정합니다. 문제: head 하나의 폭이 얼마인가? 해결: kv_lora_rank + qk_rope_head_dim입니다.",
    annotations: [
      { lines: [96, 98], color: "amber", note: "Kimi K2.5는 512 + 64 = 576입니다. KV head 1개 × 폭 576이 층 하나, token 하나의 cache이고, 61층을 곱하면 35,136개 숫자입니다." },
    ],
    code: convertorPy,
    lang: "python",
  },
  "dcp-local-seq-lens": {
    path: "vllm/vllm/v1/attention/backends/utils.py",
    highlight: [1166, 1211],
    desc: "rank마다 몇 token의 KV를 들고 있는지 계산합니다. 문제: 나눠 둔 token을 어떻게 셀까? 해결: interleave 단위로 번갈아 배정한 몫과 나머지를 셉니다.",
    annotations: [
      { lines: [1198, 1203], color: "sky", note: "interleave 크기 1이면 token t는 rank t mod DCP에 놓입니다. 길이 10, DCP 4면 base = 10 ÷ 1 ÷ 4 = 2입니다." },
      { lines: [1204, 1210], color: "violet", note: "남은 2 token을 rank 0과 1이 하나씩 더 가져가 각 3, 3, 2, 2가 됩니다. rank마다 길이가 달라도 각자 자기 몫만 읽습니다." },
    ],
    code: backendUtilsPy,
    lang: "python",
  },
  "dcp-decode-path": {
    path: "vllm/vllm/model_executor/layers/attention/mla_attention.py",
    highlight: [1116, 1160],
    desc: "DCP decode의 한 층 순서입니다. 문제: 다른 rank의 token은 어떻게 보나? 해결: query를 모으고, 각자 계산하고, 결과를 LSE로 합칩니다.",
    annotations: [
      { lines: [1116, 1129], color: "sky", note: "TP rank는 query head 일부(K2.5 TP8이면 64 ÷ 8 = 8개)만 계산했습니다. DCP 그룹 안에서 query를 모아 모든 head의 query를 갖게 합니다. 첫 번째 추가 통신입니다." },
      { lines: [1134, 1134], color: "amber", note: "각 rank는 자기 token 몫만으로 attention을 계산하고 부분 출력과 lse를 함께 돌려줍니다. lse 없이는 다음 단계의 합치기를 할 수 없습니다." },
      { lines: [1136, 1160], color: "violet", note: "dcp_manager.combine이 부분 출력을 lse로 보정해 합칩니다. 기본 경로는 lse all-gather 뒤 출력 reduce-scatter이고, a2a 설정이면 all-to-all 한 번으로 바꿉니다." },
    ],
    code: mlaAttentionPy,
    lang: "python",
  },
  "lse-combine": {
    path: "vllm/vllm/v1/attention/ops/dcp.py",
    highlight: [438, 500],
    desc: "부분 attention을 합치는 기본 경로입니다. 문제: 각자 다른 분모로 softmax한 결과를 어떻게 더할까? 해결: 모든 rank의 lse를 모아 같은 분모로 다시 맞춘 뒤 더합니다.",
    annotations: [
      { lines: [458, 460], color: "sky", note: "lse를 DCP 그룹 전체에서 all-gather합니다. lse는 head마다 숫자 하나라 출력보다 훨씬 작습니다." },
      { lines: [461, 467], color: "amber", note: "correct_attn_out이 전체 lse를 만들고 자기 부분 출력에 exp(lse_자기 − lse_전체)를 곱합니다. 본문의 두 rank 사례에서 0.731과 0.269가 이 배율입니다." },
      { lines: [493, 493], color: "violet", note: "보정한 출력을 reduce-scatter로 더하면서 head 축으로 다시 나눕니다. 각 rank는 원래 맡던 query head의 완성된 출력만 받습니다." },
    ],
    code: dcpPy,
    lang: "python",
  },
  "combine-backend": {
    path: "vllm/vllm/v1/attention/ops/dcp.py",
    highlight: [1525, 1536],
    desc: "합치는 통신의 종류를 고릅니다. 문제: all-gather와 reduce-scatter 두 번이 늘 최선인가? 해결: dcp_comm_backend가 a2a면 all-to-all 한 번으로 바꿉니다.",
    annotations: [
      { lines: [1525, 1531], color: "sky", note: "기본은 cp_lse_ag_out_rs입니다. 층마다 query 모으기와 합쳐 세 번의 collective가 붙고, Kimi K2.5 61층이면 decode step마다 183번입니다(계산)." },
    ],
    code: dcpPy,
    lang: "python",
  },
  "triton-mla-dcp": {
    path: "vllm/vllm/v1/attention/backends/mla/triton_mla.py",
    highlight: [151, 213],
    desc: "SM120에서 쓸 수 있는 MLA backend의 조건입니다. 문제: RTX PRO 6000에서 DCP와 FP8 KV를 함께 쓸 수 있나? 해결: TRITON_MLA는 DCP를 선언하고 FP8 KV는 SM89 이상에서 받습니다.",
    annotations: [
      { lines: [151, 153], color: "sky", note: "supports_dcp = True와 lse 반환 가능 표시입니다. lse를 돌려주지 못하는 backend는 DCP를 쓸 수 없습니다." },
      { lines: [198, 213], color: "amber", note: "FP8 KV는 SM89 이상이어야 받습니다. 이 검사는 하드웨어 하한일 뿐이며, SM120에서 FP8 KV와 DCP 8을 함께 켠 upstream 이미지의 안정성까지 보장하지는 않습니다." },
    ],
    code: tritonMlaPy,
    lang: "python",
  },
};
