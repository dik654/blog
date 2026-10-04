import type { CodeRef } from "@/components/code/types";
import source from "./codebase/cpython/Objects/complexobject.c?raw";
import header from "./codebase/cpython/Include/complexobject.h?raw";
import example from "./codebase/quarter_turn.py?raw";
const common={path:"cpython/Objects/complexobject.c",code:source,lang:"c" as const};
export const complexCodeRefs:Record<string,CodeRef>={
storage:{path:"cpython/Include/complexobject.h",code:header,lang:"c",highlight:[10,13],desc:"CPython v3.9.6의 고정 원문 전체입니다. Py_complex는 real과 imag 두 double 필드로 값을 보관합니다.",annotations:[{lines:[10,13],color:"sky",note:"3+4j에서는 real=3, imag=4입니다. 허수부 필드에 4j라는 별도 기호를 저장하지 않습니다."}]},
multiply:{...common,highlight:[50,56],desc:"같은 버전의 _Py_c_prod 전체를 원문 안에서 봅니다. 두 좌표의 네 곱을 계산한 뒤 실수부에서는 빼고 허수부에서는 더합니다.",annotations:[{lines:[53,55],color:"sky",note:"a=(3,4), b=(0,1)이면 real=3×0−4×1=−4, imag=3×1+4×0=3입니다."}]},
dispatch:{...common,highlight:[485,493],desc:"complex_mul이 두 피연산자를 Py_complex로 읽고 _Py_c_prod의 결과를 Python 객체로 돌려주는 경로입니다.",annotations:[{lines:[489,493],color:"sky",note:"본문의 (3+4j)*1j는 이 곱셈 규칙으로 읽습니다. cmath.exp의 내부 근사 알고리즘을 보여 주는 함수는 아닙니다."}]},
example:{path:"quarter_turn.py",code:example,lang:"python",highlight:[7,15],desc:"이 글에서 작성하고 Python 3.9.6으로 실행한 재현 예제입니다. 원본 CPython 파일과 구분해 둡니다. 뒤에는 급수의 오차와 네 점의 DFT 계산도 있습니다.",annotations:[{lines:[7,13],color:"sky",note:"정확히 표현되는 1j와 삼각함수를 거친 회전값을 같은 입력에 적용해 작은 부동소수점 차이를 확인합니다."},{lines:[24,29],color:"emerald",note:"N=4에 한해 정확한 네 방향의 거듭제곱을 사용합니다. 합을 N으로 나누지 않는 변환입니다."}]},
};
