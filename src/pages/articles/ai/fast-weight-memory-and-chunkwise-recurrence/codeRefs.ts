import type { CodeRef, FileNode } from "@/components/code/types";
import source0 from "../research-audit-sources/codebase/GatedDeltaNet-2/lit_gpt/gdn2_ops/fused_recurrent_gdn2.py?raw";
export const codeRefs: Record<string,CodeRef>={
"delta-read":{path:"GatedDeltaNet-2/lit_gpt/gdn2_ops/fused_recurrent_gdn2.py",lang:"python",code:source0,highlight:[218,235],desc:"a5552fe3c67e0ebc7ef1220df68ae8896ec62d56: 먼저 상태에 decay를 적용하고 지울 방향을 읽습니다. TRANSPOSE_STATE=True는 값×key 배치입니다."},
"delta-write":{path:"GatedDeltaNet-2/lit_gpt/gdn2_ops/fused_recurrent_gdn2.py",lang:"python",code:source0,highlight:[233,243],desc:"같은 고정 원문: value축 write와 key축 erase가 만든 차이를 외적으로 기록합니다. α=1, key 재정규화 없음, query scale1인 가정 수치로 대조합니다."},
};
export const fileTrees: Record<string,FileNode>={
"GatedDeltaNet-2":{"name": "GatedDeltaNet-2", "type": "dir", "children": [{"name": "lit_gpt/gdn2_ops/fused_recurrent_gdn2.py", "type": "file", "path": "GatedDeltaNet-2/lit_gpt/gdn2_ops/fused_recurrent_gdn2.py", "codeKey": "delta-read"}]},
};
export const projectMetas=Object.fromEntries(Object.keys(fileTrees).map(id=>[id,{id,label:id,badgeClass:"border-border"}]));
