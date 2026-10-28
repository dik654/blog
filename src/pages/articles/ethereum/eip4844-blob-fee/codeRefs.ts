import type { CodeRef } from "@/components/code/types";
import source from "./codebase/go-ethereum/consensus/misc/eip4844/eip4844.go?raw";
const ref = (highlight: [number, number], desc: string, annotations: CodeRef["annotations"]): CodeRef => ({path:"go-ethereum/consensus/misc/eip4844/eip4844.go",code:source,lang:"go",highlight,desc,annotations});
export const codeRefs: Record<string, CodeRef> = {
 "calc-excess-blob-gas": ref([129,168],"공식 Go · v1.17.10. 자식 블록 시각으로 설정을 고르고 부모 헤더의 excess·사용량을 읽습니다.",[
  {lines:[129,135],color:"sky",note:"headTimestamp는 계산 대상인 자식 블록의 시각입니다. 부모 헤더는 상태 입력이고 설정 선택 시각이 아닙니다."},
  {lines:[145,150],color:"emerald",note:"현재 fixture의 2+18=20은 BPO2 target 14 이상이므로 0 반환 분기를 지나갑니다. 실제 입력은 모두 131,072를 곱한 blob gas입니다."},
  {lines:[155,163],color:"amber",note:"부모 실행 기본료가 1 Gwei이면 reserve 조건이 참입니다. 2+floor(18×7/21)=8개분을 자식 excess로 반환합니다."},
  {lines:[167,168],color:"violet",note:"reserve 조건이 거짓이면 기존 식을 사용합니다. 같은 BPO2 숫자에서는 2+18−14=6개분입니다."}
 ]),
 "calc-blob-fee":ref([213,228],"공식 Go · v1.17.10. BPO2 fixture와 같은 정수 recurrence를 로컬에서 계산했습니다.",[
  {lines:[215,219],color:"sky",note:"최소 가격 1과 BPO2 fraction 11,684,671을 곱해 첫 항을 시작합니다."},
  {lines:[220,225],color:"emerald",note:"자식 excess 8×131,072를 곱한 뒤 fraction과 항 번호로 차례로 나눕니다. 각 Div에서 나머지는 버립니다."},
  {lines:[227,227],color:"amber",note:"누적합을 fraction으로 마지막 정수 나눗셈합니다. excess 8개분은 1, 62개분은 2, 98개분은 3입니다."}
 ]),
 "verify-header":ref([99,124],"공식 Go · v1.17.10. 자식 헤더에 적힌 사용량·excess를 부모와 활성 설정으로 다시 검사합니다.",[
  {lines:[99,101],color:"sky",note:"자식 헤더의 시각으로 max 21인 BPO2 설정을 선택합니다."},
  {lines:[111,116],color:"amber",note:"21개를 넘는 사용량과 131,072의 배수가 아닌 사용량을 거절합니다."},
  {lines:[119,122],color:"emerald",note:"현재 fixture의 재계산 결과 1,048,576 blob gas와 자식 헤더 값이 다르면 오류를 반환합니다."}
 ]),
};
