import type {CodeRef,FileNode,ProjectMeta} from "@/components/code/types";
import core from "./codebase/flash-attention/csrc/flash_attn/src/flash_fwd_kernel.h?raw";
import launch from "./codebase/flash-attention/csrc/flash_attn/src/flash_fwd_launch_template.h?raw";
import selector from "./codebase/vllm/vllm/v1/attention/selector.py?raw";
import cuda from "./codebase/vllm/vllm/platforms/cuda.py?raw";
import base from "./codebase/vllm/vllm/v1/attention/backend.py?raw";
import triton from "./codebase/triton/python/tutorials/06-fused-attention.py?raw";
import observation from "./codebase/../verification/observe.py?raw";
export const codeRefs:Record<string,CodeRef>={
"causal-range":{path:"flash-attention/csrc/flash_attn/src/flash_fwd_kernel.h",code:core,lang:"c",highlight:[86,96],desc:"실제 길이 차이를 포함해 key 범위를 정합니다. query 1행, key 8행의 오른쪽 정렬에서는 8−1 오프셋을 빠뜨릴 수 없습니다."},
"block-index":{path:"flash-attention/csrc/flash_attn/src/flash_fwd_kernel.h",code:core,lang:"c",highlight:[1083,1102],desc:"m_block은 blockIdx.x입니다. 위 함수의 key 순회 역방향과 query block의 전역 배정 순서를 구별합니다."},
"split-launch":{path:"flash-attention/csrc/flash_attn/src/flash_fwd_launch_template.h",code:launch,lang:"c",highlight:[99,163],desc:"분할 kernel을 먼저 실행하고 num_splits가 1보다 크면 별도의 합치기 kernel을 실행합니다."},
"split-combine":{path:"flash-attention/csrc/flash_attn/src/flash_fwd_kernel.h",code:core,lang:"c",highlight:[1184,1261],desc:"LSE의 안정적인 합과 exp(부분 LSE−전체 LSE)를 구합니다. 부분 평균에 3/8, 3/8, 2/8을 곱하는 수학에 대응합니다."},
"manual-config":{path:"flash-attention/csrc/flash_attn/src/flash_fwd_launch_template.h",code:launch,lang:"c",highlight:[246,281],desc:"d=128에서 dropout·causal·compute capability 조건에 따라 수동으로 다른 조각 크기를 고릅니다. 모든 경로의 첫 호출이 측정 기반 탐색은 아닙니다."},
"selector":{path:"vllm/vllm/v1/attention/selector.py",code:selector,lang:"python",highlight:[79,168],desc:"head_size와 dtype 등을 묶어 플랫폼으로 넘깁니다. block_size는 사용자가 지정했을 때 선택 조건으로 제한합니다."},
"validate":{path:"vllm/vllm/v1/attention/backend.py",code:base,lang:"python",highlight:[319,394],desc:"지원하지 않는 조건들을 이유 목록으로 돌려줍니다. 실제 지원 판정은 각 구현의 supports 함수가 결정합니다."},
"backend-select":{path:"vllm/vllm/platforms/cuda.py",code:cuda,lang:"python",highlight:[397,492],desc:"명시한 부적합 backend는 ValueError입니다. 자동 선택만 통과 후보 중 우선순위가 가장 높은 구현을 고릅니다."},
"priorities":{path:"vllm/vllm/platforms/cuda.py",code:cuda,lang:"python",highlight:[83,163],desc:"같은 major=10도 비-MLA의 causal 여부에 따라 첫 후보가 바뀝니다. 고정 v0.27.1 정책이며 측정한 가속비가 아닙니다."},
"autotune":{path:"triton/python/tutorials/06-fused-attention.py",code:triton,lang:"python",highlight:[127,172],desc:"CUDA 후보 36개, 가정한 capability (9,0)의 keep 뒤 21개, N_CTX=64 가지치기 뒤 9개입니다. PYTEST_VERSION 분기와 실제 key도 확인합니다."},
"observation":{path:"verification/observe.py",code:observation,lang:"python",highlight:[1,95],desc:"원문 Python 함수 몸체를 CPU에서 실행한 관찰 스크립트입니다. GPU 능력·지원 검사 의존성을 대체했으므로 실제 backend 지원이나 성능을 증명하지 않습니다."},
"triton-loop":{path:"triton/python/tutorials/06-fused-attention.py",code:triton,lang:"python",highlight:[48,111],desc:"대각선과 그 아래 구간을 분리합니다. 이 튜토리얼은 exp2와 유한 마스크 값 −1e6을 사용합니다."},
"triton-output":{path:"triton/python/tutorials/06-fused-attention.py",code:triton,lang:"python",highlight:[223,242],desc:"정규화 출력 O와 log₂ 지수합 M을 함께 저장합니다. 자연로그 LSE를 쓰는 다른 구현과 그대로 교환할 수 없습니다."},
};
export const fileTrees:Record<string,FileNode>={"flash-attention": {"name": "flash-attention", "type": "dir", "children": [{"name": "flash_fwd_kernel.h", "type": "file", "path": "flash-attention/csrc/flash_attn/src/flash_fwd_kernel.h", "codeKey": "causal-range"}, {"name": "flash_fwd_launch_template.h", "type": "file", "path": "flash-attention/csrc/flash_attn/src/flash_fwd_launch_template.h", "codeKey": "split-launch"}]}, "vllm": {"name": "vllm", "type": "dir", "children": [{"name": "selector.py", "type": "file", "path": "vllm/vllm/v1/attention/selector.py", "codeKey": "selector"}, {"name": "cuda.py", "type": "file", "path": "vllm/vllm/platforms/cuda.py", "codeKey": "backend-select"}, {"name": "backend.py", "type": "file", "path": "vllm/vllm/v1/attention/backend.py", "codeKey": "validate"}]}, "triton": {"name": "triton", "type": "dir", "children": [{"name": "06-fused-attention.py", "type": "file", "path": "triton/python/tutorials/06-fused-attention.py", "codeKey": "autotune"}]}, "verification": {"name": "verification", "type": "dir", "children": [{"name": "source-execution.json", "type": "file", "path": "verification/observe.py", "codeKey": "observation"}]}};
export const projectMetas:Record<string,ProjectMeta>={"flash-attention": {"id": "flash-attention", "label": "FlashAttention · e9515d5", "badgeClass": "bg-primary/10 text-primary"}, "vllm": {"id": "vllm", "label": "vLLM · v0.27.1", "badgeClass": "bg-primary/10 text-primary"}, "triton": {"id": "triton", "label": "Triton · v3.6.0", "badgeClass": "bg-primary/10 text-primary"}, "verification": {"id": "verification", "label": "원문 제어 관찰", "badgeClass": "bg-primary/10 text-primary"}};
