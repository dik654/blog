import type { CodeRef } from "@/components/code/types";
import mathSource from "./codebase/cpython/Modules/mathmodule.c?raw";
import experiment from "./examples/compare_log.py?raw";
const source={path:"cpython/Modules/mathmodule.c",code:mathSource,lang:"c" as const};
export const logarithmCodeRefs:Record<string,CodeRef>={
"log-base":{...source,highlight:[2340,2362],desc:"CPython v3.9.6의 고정 원문입니다. 밑을 주면 입력과 밑의 자연로그를 각각 얻은 뒤 나눕니다. 실제 로그 근삿값을 만드는 시스템 수학 라이브러리의 내부 알고리즘은 이 함수에 없습니다.",annotations:[{lines:[2348,2352],color:"sky",note:"x=0.125, base=2이면 num은 약 −2.07944154, den은 약 0.69314718입니다."},{lines:[2358,2361],color:"emerald",note:"num/den으로 −3을 반환합니다. 밑을 생략하면 앞의 분기에서 num을 바로 반환합니다."}]},
"log-zero":{...source,highlight:[1018,1048],desc:"같은 파일에서 실수 입력과 수학 함수 결과를 검사하는 실제 래퍼입니다. loghelper의 실수 경로는 math_1을 통해 이 함수에 도달합니다.",annotations:[{lines:[1034,1042],color:"sky",note:"m_log가 입력 0에서 −∞와 오류 상태를 만들면 can_overflow=0인 이 경로는 ValueError를 냅니다. Python의 math.log(0.0)가 −∞를 반환한다고 읽으면 안 됩니다."}]},
"experiment":{path:"lesson/examples/compare_log.py",code:experiment,lang:"python",highlight:[9,28],desc:"이 글에서 작성한 실행 예제입니다. CPython 원문이 아니며 작은 확률·로그·실수의 표현 범위를 비교합니다. 본문 숫자는 로컬 Python 3.9.6 실행 기록입니다.",annotations:[{lines:[15,18],color:"sky",note:"같은 2000번과 2001번의 곱은 모두 0이지만 로그 합은 서로 다른 유한한 값입니다. exp로 돌아가면 다시 표현 범위에 막힙니다."}]},
};
