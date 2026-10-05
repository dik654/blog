import type {CodeRef,FileNode,ProjectMeta} from "@/components/code";
import source0 from "./codebase/vllm/vllm/config/vllm.py?raw";
import source1 from "./codebase/vllm/vllm/config/vllm.py?raw";
import source2 from "./codebase/vllm/vllm/config/vllm.py?raw";
import source3 from "./codebase/vllm/vllm/config/vllm.py?raw";
import source4 from "./codebase/vllm/vllm/benchmarks/serve.py?raw";
import source5 from "./codebase/vllm/vllm/benchmarks/serve.py?raw";
import source6 from "./codebase/vllm/vllm/benchmarks/serve.py?raw";
import source7 from "./codebase/vllm/vllm/benchmarks/serve.py?raw";
import source8 from "./verification/observe.py?raw";
export const codeRefs:Record<string,CodeRef>={"eager":{code:source0,...{"path": "vllm/vllm/config/vllm.py", "lang": "python", "highlight": [1193, 1200], "desc": "enforce_eager는 컴파일과 CUDA Graph의 두 모드를 함께 NONE으로 바꿉니다."}},
"levels":{code:source1,...{"path": "vllm/vllm/config/vllm.py", "lang": "python", "highlight": [258, 322], "desc": "O2의 기본값에는 그래프 모드 외에 여러 fusion·조율 설정이 함께 들어 있습니다."}},
"defaults":{code:source2,...{"path": "vllm/vllm/config/vllm.py", "lang": "python", "highlight": [810, 854], "desc": "기본값 적용 함수는 None인 필드만 채웁니다. 사용자 설정과 묶음의 기본값을 구별합니다."}},
"compatibility":{code:source3,...{"path": "vllm/vllm/config/vllm.py", "lang": "python", "highlight": [1299, 1322], "desc": "기본값 적용 뒤에도 호환성에 따라 실제 그래프 모드가 바뀔 수 있습니다."}},
"metrics-shape":{code:source4,...{"path": "vllm/vllm/benchmarks/serve.py", "lang": "python", "highlight": [321, 354], "desc": "완료 수·지연·처리량을 나눈 실제 결과 구조체입니다. GPU 작업량과 청구량은 여기 없습니다."}},
"metrics-count":{code:source5,...{"path": "vllm/vllm/benchmarks/serve.py", "lang": "python", "highlight": [584, 620], "desc": "success인 요청의 지연과 출력 길이를 모읍니다. 답 내용의 정확성을 판정하는 함수는 아닙니다."}},
"metrics-rate":{code:source6,...{"path": "vllm/vllm/benchmarks/serve.py", "lang": "python", "highlight": [726, 762], "desc": "성공 수와 출력 수를 호출자가 넘긴 관측 기간으로 나눕니다."}},
"metrics-goodput":{code:source7,...{"path": "vllm/vllm/benchmarks/serve.py", "lang": "python", "highlight": [622, 649], "desc": "설정한 지연 조건을 모두 만족해야 good_completed에 셉니다. 경계값과 같은 경우도 포함합니다."}},
"observation":{code:source8,...{"path": "verification/observe.py", "lang": "python", "highlight": [1, 57], "desc": "가정 기록을 원본 AST에 넣어 집계와 분기를 관찰합니다. 모델·GPU·전체 서버 실행은 없습니다."}}};
export const fileTrees:Record<string,FileNode>={"vllm": {"name": "vLLM · v0.27.1", "type": "dir", "children": [{"name": "vllm.py · eager", "type": "file", "path": "vllm/vllm/config/vllm.py", "codeKey": "eager"}, {"name": "vllm.py · levels", "type": "file", "path": "vllm/vllm/config/vllm.py", "codeKey": "levels"}, {"name": "vllm.py · defaults", "type": "file", "path": "vllm/vllm/config/vllm.py", "codeKey": "defaults"}, {"name": "vllm.py · compatibility", "type": "file", "path": "vllm/vllm/config/vllm.py", "codeKey": "compatibility"}, {"name": "serve.py · metrics-shape", "type": "file", "path": "vllm/vllm/benchmarks/serve.py", "codeKey": "metrics-shape"}, {"name": "serve.py · metrics-count", "type": "file", "path": "vllm/vllm/benchmarks/serve.py", "codeKey": "metrics-count"}, {"name": "serve.py · metrics-rate", "type": "file", "path": "vllm/vllm/benchmarks/serve.py", "codeKey": "metrics-rate"}, {"name": "serve.py · metrics-goodput", "type": "file", "path": "vllm/vllm/benchmarks/serve.py", "codeKey": "metrics-goodput"}]}, "verification": {"name": "가정 기록 관찰", "type": "dir", "children": [{"name": "observe.py · observation", "type": "file", "path": "verification/observe.py", "codeKey": "observation"}]}};
export const projectMetas:Record<string,ProjectMeta>={"vllm": {"id": "vllm", "label": "vLLM · v0.27.1", "badgeClass": "bg-primary/10 text-primary"}, "verification": {"id": "verification", "label": "원문 AST 관찰", "badgeClass": "bg-primary/10 text-primary"}};
