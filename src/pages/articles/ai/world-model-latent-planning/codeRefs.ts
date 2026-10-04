import type { CodeRef, FileNode } from "@/components/code/types";
import source0 from "../research-audit-sources/codebase/le-wm/jepa.py?raw";
import source1 from "../research-audit-sources/codebase/stable-worldmodel/stable_worldmodel/planning/solver/cem.py?raw";
export const codeRefs: Record<string,CodeRef>={
"world-rollout":{path:"le-wm/jepa.py",lang:"python",code:source0,highlight:[87,107],desc:"8edfeb336732b5f3ce7b8b210d0ba370a09e2cac: 예측한 표현을 다음 예측 입력에 붙입니다. 실제 환경을 매번 관측하는 코드가 아닙니다."},
"world-cost":{path:"le-wm/jepa.py",lang:"python",code:source0,highlight:[112,124],desc:"같은 고정 원문: 마지막 예측과 목표의 원소별 제곱 차이를 합합니다. 한 차원 가정에서 후보 비용16과0을 대조합니다."},
"cem-select":{path:"stable-worldmodel/stable_worldmodel/planning/solver/cem.py",lang:"python",code:source1,highlight:[215,231],desc:"21446f1ede6d5284e981bd7b47f432b994e6d812: 적은 cost의 top-k 후보를 선택합니다. 이 framework revision은 논문 발표 당시와 구분합니다."},
"cem-update":{path:"stable-worldmodel/stable_worldmodel/planning/solver/cem.py",lang:"python",code:source1,highlight:[244,253],desc:"선택한 후보의 평균과 표준편차로 다음 표본 분포를 만듭니다. 전역 최적해를 보장하지 않습니다."},
};
export const fileTrees: Record<string,FileNode>={
"le-wm":{"name": "le-wm", "type": "dir", "children": [{"name": "jepa.py", "type": "file", "path": "le-wm/jepa.py", "codeKey": "world-rollout"}]},
"stable-worldmodel":{"name": "stable-worldmodel", "type": "dir", "children": [{"name": "stable_worldmodel/planning/solver/cem.py", "type": "file", "path": "stable-worldmodel/stable_worldmodel/planning/solver/cem.py", "codeKey": "cem-select"}]},
};
export const projectMetas=Object.fromEntries(Object.keys(fileTrees).map(id=>[id,{id,label:id,badgeClass:"border-border"}]));
