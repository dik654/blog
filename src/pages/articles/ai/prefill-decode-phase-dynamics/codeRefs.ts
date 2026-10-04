import type { CodeRef } from "@/components/code/types";
import scheduler from "./codebase/vllm/v1/core/sched/scheduler.py?raw";
import config from "./codebase/vllm/config/scheduler.py?raw";
import attention from "./codebase/transformers/models/mixtral/modeling_mixtral.py?raw";
export const codeRefs: Record<string, CodeRef> = {
"progress-fields": {...{"path": "vllm/v1/core/sched/scheduler.py", "highlight": [438, 459], "desc": "단계 이름 대신 필요한 위치와 완료 위치를 비교합니다.", "annotations": [{"lines": [438, 459], "color": "sky", "note": "A의 101−100=1, B의 차이 1, C의 20−0=20을 같은 진행 장부로 봅니다."}]},code:scheduler,lang:"python"},
"running-order": {...{"path": "vllm/v1/core/sched/scheduler.py", "highlight": [477, 523], "desc": "진행 목록의 순서와 별도 prefill 지연 조건입니다.", "annotations": [{"lines": [477, 523], "color": "sky", "note": "throttle_prefills를 쓰지 않는 단순 사례입니다. P가 앞에서 잔액 6을 쓰면 뒤 A·B가 이번에 배정되지 않을 수 있습니다."}]},code:scheduler,lang:"python"},
"running-budget": {...{"path": "vllm/v1/core/sched/scheduler.py", "highlight": [516, 530], "desc": "요청의 필요량을 양수 조각 상한과 잔액으로 자릅니다.", "annotations": [{"lines": [516, 530], "color": "sky", "note": "A1·B1을 배정한 잔액은 4입니다. 이전부터 진행 중인 C의 필요량 16도 잔액 4에 맞추어 잘립니다."}]},code:scheduler,lang:"python"},
"waiting-chunk": {...{"path": "vllm/v1/core/sched/scheduler.py", "highlight": [879, 914], "desc": "새 요청도 남은 입력과 chunking 허용 및 잔액을 확인합니다.", "annotations": [{"lines": [879, 914], "color": "sky", "note": "C의 필요량은 20입니다. chunking이 켜지고 다른 제약을 통과하면 min(20,4)=4가 후보 배정입니다. 저장 공간 성공은 뒤에서 확인합니다."}]},code:scheduler,lang:"python"},
"scheduler-config": {...{"path": "vllm/config/scheduler.py", "highlight": [48, 89], "desc": "총 배정 한도와 요청별 상한 0의 서로 다른 뜻입니다.", "annotations": [{"lines": [48, 89], "color": "sky", "note": "max_num_scheduled_tokens는 별도로 작게 둘 수 있습니다. long_prefill_token_threshold=0은 추가 조각 상한을 끕니다. 테스트용 기본값과 실제 engine 설정도 구별합니다."}]},code:config,lang:"python"},
"attention-products": {...{"path": "transformers/models/mixtral/modeling_mixtral.py", "highlight": [256, 278], "desc": "QK 점수와 비율에 따른 V 합산의 두 행렬 곱입니다.", "annotations": [{"lines": [256, 278], "color": "sky", "note": "유효 causal 쌍은 C의 첫 4위치에서 10개, 다음 4위치에서 26개입니다. 이 eager 경로의 실제 matmul은 mask 이전 넓은 행렬을 계산할 수 있습니다."}]},code:attention,lang:"python"},
};
