import type { CodeRef } from "@/components/code/types";
import floatSource from "./codebase/cpython/Objects/floatobject.c?raw";
import structSource from "./codebase/cpython/Modules/_struct.c?raw";
import example from "./codebase/rounding_case.py?raw";
export const precisionCodeRefs:Record<string,CodeRef>={
dispatch:{path:"cpython/Modules/_struct.c",code:structSource,lang:"c",highlight:[1008,1010],desc:"CPython v3.9.6 고정 원문의 큰 바이트 순서 형식 표입니다. e는 두 바이트이며 pack 함수가 bp_halffloat입니다.",annotations:[{lines:[951,955],color:"sky",note:"bp_halffloat는 le=0으로 pack_halffloat를 부릅니다. 끝의 0은 작은 바이트 순서를 사용하지 않는다는 뜻입니다."},{lines:[1008,1008],color:"emerald",note:"같은 e 행에 읽기와 쓰기 함수가 각각 연결됩니다."}]},
bridge:{path:"cpython/Modules/_struct.c",code:structSource,lang:"c",highlight:[301,311],desc:"Python 입력을 double로 읽은 뒤 실제 두 바이트 저장 함수에 넘깁니다. 전체 원문을 그대로 보존했습니다.",annotations:[{lines:[305,311],color:"sky",note:"1+δ를 읽은 double은 그 값을 정확히 보존합니다. 이 사례의 손실은 다음 _PyFloat_Pack2 변환에서 일어납니다."}]},
rounding:{path:"cpython/Objects/floatobject.c",code:floatSource,lang:"c",highlight:[2054,2102],desc:"고정 commit db3ff76의 _PyFloat_Pack2입니다. 정규화, 지수 보정, 소수부 선택, 짝수 반올림을 순서대로 읽습니다.",annotations:[{lines:[2079,2089],color:"sky",note:"1+δ에서는 선행 1을 뺀 소수부에 1024를 곱하면 0.5입니다. bits=0이고 짝수여서 올리지 않습니다."},{lines:[2089,2091],color:"emerald",note:"1+3δ에서는 1.5→bits=1입니다. 같은 반 간격이라도 홀수이므로 2로 올립니다."},{lines:[2101,2101],color:"amber",note:"지수 15를 10 bit 옮겨 더하면 0x3c00입니다. 선택한 소수부가 1이나 2이면 끝이 각각 01, 02가 됩니다."}]},
example:{path:"rounding_case.py",code:example,lang:"python",highlight:[9,29],desc:"이 글에서 작성하고 Python 3.9.6으로 실행한 예제입니다. struct의 저장 변환을 각 단계에 명시했으며 네이티브 FP16 GPU 연산을 실행한 코드는 아닙니다.",annotations:[{lines:[9,14],color:"sky",note:"pack한 뒤 unpack해 다음 연산이 실제 저장값을 읽게 합니다."},{lines:[17,24],color:"emerald",note:"연속 덧셈, 묶은 덧셈, 위쪽 tie, 넓은 누산기의 결과와 저장 바이트를 각각 검사합니다."}]},
};
