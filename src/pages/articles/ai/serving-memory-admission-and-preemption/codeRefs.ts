import type { CodeRef } from "@/components/code/types";
import v0Block from "./codebase/legacy-v0.6.6/vllm/core/block_manager.py?raw";
import v0Scheduler from "./codebase/legacy-v0.6.6/vllm/core/scheduler.py?raw";
import v0Args from "./codebase/legacy-v0.6.6/vllm/engine/arg_utils.py?raw";
import v1Config from "./codebase/vllm/config/scheduler.py?raw";
import v1Manager from "./codebase/vllm/v1/core/kv_cache_manager.py?raw";
import v1Scheduler from "./codebase/vllm/v1/core/sched/scheduler.py?raw";

export const codeRefs: Record<string, CodeRef> = {
"v0-admission": {...{"path": "legacy-v0.6.6/vllm/core/block_manager.py", "highlight": [108, 145], "desc": "V0의 전체 용량과 현재 빈 공간을 구분합니다.", "annotations": [{"lines": [108, 145], "color": "sky", "note": "C의 전체 40·빈 14·필요 9·하한 3은 OK입니다. free11만 바꾸면 LATER입니다."}]}, code:v0Block, lang:"python"},
"v0-watermark-default": {...{"path": "legacy-v0.6.6/vllm/core/block_manager.py", "highlight": [62, 92], "desc": "V0 생성자의 하한 기본값과 정수화입니다.", "annotations": [{"lines": [62, 92], "color": "sky", "note": "기본 0.01과 본문에 별도 지정한 0.075를 구분합니다. 27648×0.01의 소수 부분을 버리면 276입니다."}]}, code:v0Block, lang:"python"},
"v1-config": {...{"path": "vllm/config/scheduler.py", "highlight": [130, 141], "desc": "현재 고정 버전은 전체 입력 fit을 기본으로 검사합니다.", "annotations": [{"lines": [130, 141], "color": "sky", "note": "scheduler_reserve_full_isl=True, watermark=0.0입니다. 작은 사례는 watermark를 3block으로 별도 지정합니다."}]}, code:v1Config, lang:"python"},
"v1-fit": {...{"path": "vllm/v1/core/kv_cache_manager.py", "highlight": [463, 488], "desc": "대기 요청의 하한과 전체 입력 fit 검사입니다.", "annotations": [{"lines": [463, 488], "color": "sky", "note": "1000token은 63block입니다. free50에서는 첫 256token의 16block이 들어가도 전체 검사에서 실패합니다."}]}, code:v1Manager, lang:"python"},
"v1-allocation": {...{"path": "vllm/v1/core/kv_cache_manager.py", "highlight": [490, 527], "desc": "이번 조각의 실제 수요는 전체 입력 검사와 따로 계산합니다.", "annotations": [{"lines": [490, 527], "color": "sky", "note": "total_computed_tokens=0, num_new_tokens=256이면 단순 단일 group은 16block입니다. 별도 예약과 하한도 차감합니다."}]}, code:v1Manager, lang:"python"},
"v1-preempt": {...{"path": "vllm/v1/core/sched/scheduler.py", "highlight": [1274, 1315], "desc": "block 해제와 상태 변경 뒤 대기 앞에 놓습니다.", "annotations": [{"lines": [1274, 1315], "color": "sky", "note": "동기식·전용block의 C는 10개를 해제하고 computed=0이 됩니다. 토큰 이력 161은 지우지 않습니다."}]}, code:v1Scheduler, lang:"python"},
"v0-mode": {...{"path": "legacy-v0.6.6/vllm/core/scheduler.py", "highlight": [1532, 1567], "desc": "기본 모드 선택과 실행 분기를 읽습니다.", "annotations": [{"lines": [1532, 1567], "color": "sky", "note": "단일 생성은 RECOMPUTE, 여러 생성 경로는 SWAP입니다. 사용자가 지정한 모드는 별도 분기입니다."}]}, code:v0Scheduler, lang:"python"},
"v0-swap-failure": {...{"path": "legacy-v0.6.6/vllm/core/scheduler.py", "highlight": [1600, 1614], "desc": "CPU 공간 부족은 RuntimeError입니다.", "annotations": [{"lines": [1600, 1614], "color": "sky", "note": "can_swap_out이 False이면 raise입니다. 공간 실패를 자동 recompute fallback으로 바꾸지 않습니다."}]}, code:v0Scheduler, lang:"python"},
"v0-swap-admission": {...{"path": "legacy-v0.6.6/vllm/core/block_manager.py", "highlight": [478, 510], "desc": "기존 block과 새로 쓸 위치의 수요를 함께 셉니다.", "annotations": [{"lines": [478, 510], "color": "sky", "note": "C의 기존 10개와 다음 161번째 위치의 추가 1개를 함께 봅니다. 실제 코드에는 lookahead와 full-block 복사 조건도 있습니다."}]}, code:v0Block, lang:"python"},
"v0-swap-default": {...{"path": "legacy-v0.6.6/vllm/engine/arg_utils.py", "highlight": [115, 123], "desc": "역사적 V0의 GPU당 CPU 교환 공간 기본값입니다.", "annotations": [{"lines": [115, 123], "color": "sky", "note": "swap_space=4는 GiB입니다. 2MiB 단위 2048개로 환산한 용량 예이며 동시 교환 요청 수 보장은 아닙니다."}]}, code:v0Args, lang:"python"},
"v1-scheduler-call": {...{"path": "vllm/v1/core/sched/scheduler.py", "highlight": [971, 985], "desc": "scheduler가 입력 검사와 현재 진행 요청 여부를 전달합니다.", "annotations": [{"lines": [971, 985], "color": "sky", "note": "full_sequence_must_fit에 설정을 넘기고 has_scheduled_reqs에 running 존재 여부를 넘깁니다."}]}, code:v1Scheduler, lang:"python"},
};
