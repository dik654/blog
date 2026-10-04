import type { CodeRef, FileNode } from "@/components/code/types";
import source from "./codebase/toom22_mul.c?raw";
export const codeRefs: Record<string,CodeRef> = {
"split": {code:source, highlight:[87, 117],desc:"두 limb의 입력에서 s=n=t=1을 계산합니다. a1과 b1은 각각 배열의 두 번째 자리를 가리킵니다.",annotations:[{lines:[87, 117],color:"sky",note:"두 limb의 입력에서 s=n=t=1을 계산합니다. a1과 b1은 각각 배열의 두 번째 자리를 가리킵니다."}],path:"gmp/toom22_mul.c",lang:"c"},
"difference": {code:source, highlight:[119, 171],desc:"ap=[34,12], bp=[78,56]이면 두 차는 22이고 vm1_neg=0입니다. 하나의 차만 음수이면 표시가 1로 바뀝니다.",annotations:[{lines:[119, 171],color:"sky",note:"ap=[34,12], bp=[78,56]이면 두 차는 22이고 vm1_neg=0입니다. 하나의 차만 음수이면 표시가 1로 바뀝니다."}],path:"gmp/toom22_mul.c",lang:"c"},
"products": {code:source, highlight:[173, 185],desc:"같은 조각으로 vm1=484, vinf=672, v0=2652를 계산합니다. 세 곱의 호출 위치를 구분합니다.",annotations:[{lines:[173, 185],color:"sky",note:"같은 조각으로 vm1=484, vinf=672, v0=2652를 계산합니다. 세 곱의 호출 위치를 구분합니다."}],path:"gmp/toom22_mul.c",lang:"c"},
"combine": {code:source, highlight:[187, 221],desc:"188행의 위쪽 672와 191행의 가운데 3324에서 시작해 199행이 484를 뺍니다. 결과는 낮은 순서 [2652,2840,672,0]입니다.",annotations:[{lines:[187, 221],color:"sky",note:"188행의 위쪽 672와 191행의 가운데 3324에서 시작해 199행이 484를 뺍니다. 결과는 낮은 순서 [2652,2840,672,0]입니다."}],path:"gmp/toom22_mul.c",lang:"c"},
"cutoff": {code:source, highlight:[54, 85],desc:"작은 하위 곱은 기본 곱셈에서 끝나고 크기·길이 비율에 따라 재귀 경로가 달라집니다. 이 파일만으로 플랫폼 임계값을 정할 수 없습니다.",annotations:[{lines:[54, 85],color:"sky",note:"작은 하위 곱은 기본 곱셈에서 끝나고 크기·길이 비율에 따라 재귀 경로가 달라집니다. 이 파일만으로 플랫폼 임계값을 정할 수 없습니다."}],path:"gmp/toom22_mul.c",lang:"c"},
};
export const fileTrees: Record<string,FileNode> = {gmp:{name:"GNU MP 6.3.0 · 공식 배포 원문",type:"dir",children:[{name:"toom22_mul.c",type:"file",path:"gmp/toom22_mul.c",codeKey:"products"}]}};
