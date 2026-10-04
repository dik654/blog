import type { CodeRef, FileNode, ProjectMeta } from "@/components/code/types";
import s0 from "./codebase/bn254.rs?raw";
import s1 from "./codebase/g2_prepared.rs?raw";
import s2 from "./codebase/bn.rs?raw";
import s3 from "./codebase/../verification/main.rs?raw";
import s4 from "./codebase/pairing.rs?raw";
export const codeRefs:Record<string,CodeRef>={
"config":{code:s0,"path": "ark/bn254.rs", "highlight": [17, 43], "lang": "rust", "desc": "실제 z, 65자리 부호 표현, D형 twist를 확인합니다.", "annotations": [{"lines": [17, 43], "color": "sky", "note": "실제 z, 65자리 부호 표현, D형 twist를 확인합니다."}]} ,
"prepare":{code:s1,"path": "ark/g2_prepared.rs", "highlight": [108, 163], "lang": "rust", "desc": "64개의 두 배 선, 21개의 추가 선, Frobenius로 만든 끝의 두 선을 차례로 준비합니다.", "annotations": [{"lines": [108, 163], "color": "sky", "note": "64개의 두 배 선, 21개의 추가 선, Frobenius로 만든 끝의 두 선을 차례로 준비합니다."}]} ,
"ell":{code:s2,"path": "ark/bn.rs", "highlight": [191, 213], "lang": "rust", "desc": "D형 분기에서는 첫 계수에 y, 둘째에 x를 곱해 034의 세 위치에 넣습니다.", "annotations": [{"lines": [191, 213], "color": "sky", "note": "D형 분기에서는 첫 계수에 y, 둘째에 x를 곱해 034의 세 위치에 넣습니다."}]} ,
"loop":{code:s2,"path": "ark/bn.rs", "highlight": [51, 108], "lang": "rust", "desc": "첫 누적값 1의 제곱은 생략합니다. 단일 쌍의 63회 제곱 호출과 87개 선을 대조합니다.", "annotations": [{"lines": [51, 108], "color": "sky", "note": "첫 누적값 1의 제곱은 생략합니다. 단일 쌍의 63회 제곱 호출과 87개 선을 대조합니다."}]} ,
"easy":{code:s2,"path": "ark/bn.rs", "highlight": [111, 135], "lang": "rust", "desc": "역원이 있어야 쉬운 부분을 진행합니다. 0인 Miller 값은 None입니다.", "annotations": [{"lines": [111, 135], "color": "sky", "note": "역원이 있어야 쉬운 부분을 진행합니다. 0인 Miller 값은 None입니다."}]} ,
"hard":{code:s2,"path": "ark/bn.rs", "highlight": [137, 175], "lang": "rust", "desc": "원문 주석의 지수는 H가 아니라 cH입니다. c=2z(6z²+3z+1)을 그대로 읽습니다.", "annotations": [{"lines": [137, 175], "color": "sky", "note": "원문 주석의 지수는 H가 아니라 cH입니다. c=2z(6z²+3z+1)을 그대로 읽습니다."}]} ,
"native":{code:s3,"path": "check/main.rs", "highlight": [51, 83], "lang": "rust", "desc": "같은 M의 E승과 cE승을 실제 출력에 각각 대조했습니다. c 역수로 일반 E승을 복원합니다.", "annotations": [{"lines": [51, 83], "color": "sky", "note": "같은 M의 E승과 cE승을 실제 출력에 각각 대조했습니다. c 역수로 일반 E승을 복원합니다."}]} ,
"fused":{code:s3,"path": "check/main.rs", "highlight": [84, 101], "lang": "rust", "desc": "두 쌍의 원시 값 곱과 최종 출력 곱을 비교합니다. 체의 1, 0의 None, 항등원 입력을 구별합니다.", "annotations": [{"lines": [84, 101], "color": "sky", "note": "두 쌍의 원시 값 곱과 최종 출력 곱을 비교합니다. 체의 1, 0의 None, 항등원 입력을 구별합니다."}]} ,
"wrapper":{code:s4,"path": "ark/pairing.rs", "highlight": [81, 119], "lang": "rust", "desc": "MillerLoopOutput을 final_exponentiation에 넣어 PairingOutput을 얻습니다. multi_pairing은 마지막 계산을 한 번 호출합니다.", "annotations": [{"lines": [81, 119], "color": "sky", "note": "MillerLoopOutput을 final_exponentiation에 넣어 PairingOutput을 얻습니다. multi_pairing은 마지막 계산을 한 번 호출합니다."}]} ,
"output":{code:s4,"path": "ark/pairing.rs", "highlight": [181, 210], "lang": "rust", "desc": "출력 군의 zero는 내부 필드 one이며 덧셈 인터페이스가 필드 곱으로 연결됩니다.", "annotations": [{"lines": [181, 210], "color": "sky", "note": "출력 군의 zero는 내부 필드 one이며 덧셈 인터페이스가 필드 곱으로 연결됩니다."}]} ,
};
export const fileTrees:Record<string,FileNode>={"ark": {"name": "고정 원문과 실제 실행", "type": "dir", "children": [{"name": "bn254.rs", "type": "file", "path": "ark/bn254.rs", "codeKey": "config"}, {"name": "g2_prepared.rs", "type": "file", "path": "ark/g2_prepared.rs", "codeKey": "prepare"}, {"name": "bn.rs", "type": "file", "path": "ark/bn.rs", "codeKey": "ell"}, {"name": "main.rs", "type": "file", "path": "check/main.rs", "codeKey": "native"}, {"name": "pairing.rs", "type": "file", "path": "ark/pairing.rs", "codeKey": "wrapper"}]}};
export const projectMetas:Record<string,ProjectMeta>={ark:{id:"ark",label:"arkworks · 고정 원문",badgeClass:"bg-sky-50 border-sky-300 text-sky-800"},check:{id:"check",label:"본문의 실제 실행",badgeClass:"bg-emerald-50 border-emerald-300 text-emerald-800"}};
