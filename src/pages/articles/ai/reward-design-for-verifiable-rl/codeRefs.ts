import type { CodeRef, FileNode } from "@/components/code/types";
import source0 from "../research-audit-sources/codebase/open-r1/src/open_r1/rewards.py?raw";
export const codeRefs: Record<string,CodeRef>={
"reward-parse":{path:"open-r1/src/open_r1/rewards.py",lang:"python",code:source0,highlight:[40,64],desc:"5b6ff22b3fb7aa069c54866e517f39dfc3160e09: 정답을 먼저 파싱하고 응답 파싱 조건을 정합니다."},
"reward-verify":{path:"open-r1/src/open_r1/rewards.py",lang:"python",code:source0,highlight:[66,82],desc:"검증기의0/1과 검증할 수 없는 None은 다른 결과입니다. 100개 가정 집계의 실제 정답 여부는 별도로 검수합니다."},
"reward-format":{path:"open-r1/src/open_r1/rewards.py",lang:"python",code:source0,highlight:[85,91],desc:"정규식 형식만 확인합니다. 정답이 틀려도 태그와 줄바꿈 형식을 지키면1점일 수 있습니다."},
};
export const fileTrees: Record<string,FileNode>={
"open-r1":{"name": "open-r1", "type": "dir", "children": [{"name": "src/open_r1/rewards.py", "type": "file", "path": "open-r1/src/open_r1/rewards.py", "codeKey": "reward-parse"}]},
};
export const projectMetas=Object.fromEntries(Object.keys(fileTrees).map(id=>[id,{id,label:id,badgeClass:"border-border"}]));
