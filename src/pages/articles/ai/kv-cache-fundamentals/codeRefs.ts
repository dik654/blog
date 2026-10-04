import type { CodeRef } from "@/components/code/types";
import mixtral from "./codebase/transformers/models/mixtral/modeling_mixtral.py?raw";
import cache from "./codebase/transformers/cache_utils.py?raw";
import gemma from "./codebase/transformers/models/gemma4/modeling_gemma4.py?raw";
import qwenConfig from "./codebase/configs/Qwen3.6-27B/config.json?raw";
import museConfig from "./codebase/configs/Muse-Glimmer-30B/config.json?raw";
import gemmaConfig from "./codebase/configs/gemma-4-31B/config.json?raw";

export const codeRefs: Record<string, CodeRef> = {
"current-projection": {...{"path": "transformers/models/mixtral/modeling_mixtral.py", "highlight": [308, 318], "desc": "현재 Q/K/V를 만든 뒤 저장 기록을 갱신합니다.", "annotations": [{"lines": [308, 318], "color": "sky", "note": "Q는 (1,4,1,2)이며 새 K/V는 (1,2,1,2)입니다. update 뒤 K/V 위치 길이는 4입니다."}]}, code:mixtral, lang:"python"},
"repeat-kv-heads": {...{"path": "transformers/models/mixtral/modeling_mixtral.py", "highlight": [244, 253], "desc": "계산용 head를 0·0·1·1로 펼치는 전체 함수입니다.", "annotations": [{"lines": [244, 253], "color": "sky", "note": "n_rep=2이면 (1,2,4,2)→(1,2,2,4,2)→(1,4,4,2)입니다. 기존 cache를 다시 저장하지 않습니다."}]}, code:mixtral, lang:"python"},
"eager-read": {...{"path": "transformers/models/mixtral/modeling_mixtral.py", "highlight": [256, 278], "desc": "갱신한 K/V를 펼친 뒤 점수와 출력을 계산합니다.", "annotations": [{"lines": [256, 278], "color": "sky", "note": "첫 Q=(1,0), K=(0,c)라 점수는 모두 0입니다. 비율 1/4로 V=(c,2c)를 합치면 (2.5,5)입니다."}]}, code:mixtral, lang:"python"},
"dynamic-update": {...{"path": "transformers/cache_utils.py", "highlight": [113, 146], "desc": "위치 축인 dim=-2에 새 기록을 이어 붙입니다.", "annotations": [{"lines": [113, 146], "color": "sky", "note": "과거 (1,2,3,2)와 현재 (1,2,1,2)를 이어 (1,2,4,2)로 만듭니다. torch.cat 경로의 물리 복사 비용은 별도입니다."}]}, code:cache, lang:"python"},
"qwen-config": {...{"path": "configs/Qwen3.6-27B/config.json", "highlight": [15, 99], "desc": "64층의 layer_types와 KV head·폭을 읽습니다.", "annotations": [{"lines": [15, 99], "color": "sky", "note": "full_attention은 16개이고 linear_attention은 48개입니다. 16×4×256×2×2=64KiB에 반복 상태는 포함되지 않습니다."}]}, code:qwenConfig, lang:"typescript"},
"muse-config": {...{"path": "configs/Muse-Glimmer-30B/config.json", "highlight": [17, 144], "desc": "52층의 local·global 분류와 head·폭·window를 읽습니다.", "annotations": [{"lines": [17, 144], "color": "sky", "note": "39 sliding과 13 full입니다. 모든 위치를 보존할 때 52KiB이며 window 2048 이후 실제 회수량은 따로 확인합니다."}]}, code:museConfig, lang:"typescript"},
"gemma-config": {...{"path": "configs/gemma-4-31B/config.json", "highlight": [16, 116], "desc": "두 층 종류의 서로 다른 KV 모양입니다.", "annotations": [{"lines": [16, 116], "color": "sky", "note": "50 local:16head·256폭·1024window, 10 global:4head·512폭입니다. num_kv_shared_layers는 0입니다."}]}, code:gemmaConfig, lang:"typescript"},
"gemma-shared-projection": {...{"path": "transformers/models/gemma4/modeling_gemma4.py", "highlight": [1172, 1212], "desc": "global에서만 별도 value projection을 없애는 조건입니다.", "annotations": [{"lines": [1172, 1212], "color": "sky", "note": "attention_k_eq_v와 not self.is_sliding을 함께 확인합니다. 하나의 raw projection을 공유하는 설정이지 최종 cache 텐서 동일성의 증거는 아닙니다."}]}, code:gemma, lang:"python"},
"gemma-cache-write": {...{"path": "transformers/models/gemma4/modeling_gemma4.py", "highlight": [1241, 1257], "desc": "raw 값을 공유한 뒤 서로 다른 K/V 변환을 수행합니다.", "annotations": [{"lines": [1241, 1257], "color": "sky", "note": "K는 k_norm과 위치 회전을 거치며 V는 v_norm을 거칩니다. 이후 cache.update에 두 값 모두 전달합니다."}]}, code:gemma, lang:"python"},
};
