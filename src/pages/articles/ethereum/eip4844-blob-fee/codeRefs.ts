import type { CodeRef } from "@/components/code/types";
import source from "./codebase/go-ethereum/consensus/misc/eip4844/eip4844.go?raw";
const ref = (highlight: [number, number], desc: string, annotations: CodeRef["annotations"]): CodeRef => ({path:"go-ethereum/consensus/misc/eip4844/eip4844.go",code:source,lang:"go",highlight,desc,annotations});
export const codeRefs: Record<string, CodeRef> = {
 "calc-excess-blob-gas": ref([129,168],"공식 Go · c9a2bc7. 새 블록 시각으로 설정을 고르고 이전 헤더의 초과분·사용량을 읽습니다.",[
  {lines:[129,135],color:"sky",note:"headTimestamp는 계산 대상인 새 블록의 시각입니다. 이전 헤더의 시각으로 설정을 고정하지 않습니다."},
  {lines:[145,150],color:"emerald",note:"2·5·3의 옛 설정에서는 합계 7이 목표 3 이상이므로 계속합니다. 실제 입력은 모두 131,072를 곱한 blob gas입니다."},
  {lines:[155,163],color:"amber",note:"BPO2 비교의 2·18·14·21에서 reserve 조건이 참이면 2+18×7/21=8묶음 상당입니다."},
  {lines:[167,168],color:"violet",note:"기존 규칙의 2+5−3=4, 또는 BPO2에서 추가조건이 거짓인 2+18−14=6에 대응합니다."}
 ]),
 "calc-blob-fee":ref([213,228],"공식 원본 fakeExponential. 별도 실행 틀에서 이 함수 자체의 정수 계산을 확인했습니다.",[
  {lines:[215,219],color:"sky",note:"작은 계산 f=1, n=4, d=2에서 accum은 2로 시작합니다."},
  {lines:[220,225],color:"emerald",note:"2·4·4·2·1을 차례로 누적합니다. 각 Div가 소수 부분을 버리므로 다음 값은 0입니다."},
  {lines:[227,227],color:"amber",note:"합계 13을 2로 정수 나눠 6을 반환합니다. 실제 옛 사례 n=524,288, d=3,338,477의 출력은 1입니다."}
 ]),
 "verify-header":ref([99,124],"블록에 적힌 사용량·초과분을 신뢰하지 않고 설정과 이전 헤더로 검산합니다.",[
  {lines:[99,101],color:"sky",note:"새 헤더의 시각으로 최대값을 선택합니다."},
  {lines:[111,116],color:"amber",note:"최대를 넘는 사용량과 131,072의 배수가 아닌 사용량을 거절합니다."},
  {lines:[119,122],color:"emerald",note:"기대 초과분 6묶음 조건에 8묶음을 적은 헤더는 같지 않으므로 오류를 반환합니다."}
 ]),
};
