import type { CodeRef } from "@/components/code/types";
import dictionary from "./codebase/src/dictionary.cc?raw";
import fasttext from "./codebase/src/fasttext.cc?raw";
import model from "./codebase/src/model.cc?raw";
import dense from "./codebase/src/densematrix.cc?raw";
import observation from "./verification/observe.cc?raw";
const d={code:dictionary,path:"facebookresearch/fastText/src/dictionary.cc",lang:"c" as const};
const f={code:fasttext,path:"facebookresearch/fastText/src/fasttext.cc",lang:"c" as const};
const m={code:model,path:"facebookresearch/fastText/src/model.cc",lang:"c" as const};
export const codeRefs:Record<string,CodeRef>={
known:{...d,highlight:[85,118],desc:"고정 커밋 1142dc4c의 전체 C++ 원문입니다. 등록 단어와 미등록 문자열의 목록 생성 경로를 구분합니다.",annotations:[{lines:[93,99],color:"sky",note:"run은 전용 번호가 포함된 저장 목록을 반환합니다. runs는 경계를 붙여 조각만 생성합니다."},{lines:[110,116],color:"emerald",note:"문자열도 반환하는 별도 관찰용 overload는 전용 단어와 조각을 순서대로 기록합니다."}]},
offset:{...d,highlight:[459,471],desc:"자르지 않은 모델에서는 조각 번호에 단어 행 수를 더합니다. 같은 번호를 제거하는 과정은 없습니다.",annotations:[{lines:[459,468],color:"sky",note:"행을 제거한 모델의 조건은 별도 가지입니다. 이번 가정은 pruneidx_size_=-1입니다."},{lines:[470,470],color:"emerald",note:"bucket 2는 nwords_=3에 더해 전체 행 번호 5가 됩니다."}]},
hash:{...d,highlight:[155,170],desc:"원문의 호환성 주석과 실제 해시 계산입니다. 일반적인 부호 없는 바이트 FNV와 구분합니다.",annotations:[{lines:[163,168],color:"sky",note:"int8_t 변환 뒤 uint32_t XOR와 곱셈을 반복합니다. ASCII 밖 바이트에서도 이 규칙을 보존해야 합니다."}]},
windows:{...d,highlight:[172,193],desc:"유효한 UTF-8의 코드 포인트 경계로 시작 위치와 길이를 진행합니다. 문자열 정규화 함수는 호출하지 않습니다.",annotations:[{lines:[177,184],color:"sky",note:"이어지는 바이트에서 시작하지 않고 하나의 문자의 바이트를 함께 붙입니다."},{lines:[186,190],color:"emerald",note:"각 출현마다 해시 주소를 push합니다. 충돌이나 같은 문자열 반복을 지우지 않습니다."}]},
vector:{...f,highlight:[111,121],desc:"같은 [0,5,5,7]을 실제로 읽고 네 항의 평균을 반환한 함수입니다.",annotations:[{lines:[113,116],color:"sky",note:"출력을 0으로 만든 뒤 번호 5를 두 번 더합니다."},{lines:[117,119],color:"emerald",note:"네 항이면 1/4을 곱합니다. 목록이 비었을 때는 나누지 않습니다."}]},
observation:{code:observation,path:"article/verification/observe.cc",lang:"c",highlight:[13,26],desc:"이 글에서 작성한 별도 관찰 호출입니다. 가정한 행을 원래 함수로 조회하며 말뭉치 학습은 하지 않습니다.",annotations:[{lines:[13,19],color:"sky",note:"사전과 임의의 두 좌표를 만들고 원문 형식의 비양자화 모델로 저장합니다."},{lines:[20,26],color:"emerald",note:"원래 loadModel과 getWordVector가 run·runs·반복 조각·Unicode·빈 입력을 계산합니다."}]},
hidden:{code:dense,path:"facebookresearch/fastText/src/densematrix.cc",lang:"c",highlight:[211,237],desc:"Model::computeHidden에서 부르는 실제 평균 구현입니다. CPU 명령 지원과 차원에 따라 같은 평균을 계산하는 경로가 갈립니다.",annotations:[{lines:[223,236],color:"sky",note:"일반 경로는 각 행을 더한 뒤 목록 크기로 나눕니다. 이번 두 좌표의 원문 호출 결과는 (4,0.75)입니다."}]},
update:{...m,highlight:[64,91],desc:"원문 한 단계 갱신의 입력 평균·수정량·반복 행 업데이트를 분리해서 읽습니다.",annotations:[{lines:[74,80],color:"sky",note:"숨은 값을 계산한 뒤 loss가 state.grad를 준비합니다."},{lines:[83,89],color:"emerald",note:"normalizeGradient_가 거짓이면 항 수로 나누지 않고 매 출현마다 같은 수정량을 더합니다."}]},
normalize:{...f,highlight:[233,237],desc:"실제 모델 종류에 따라 입력 갱신의 나눗셈 여부를 결정합니다.",annotations:[{lines:[235,236],color:"sky",note:"지도 학습 sup일 때 참입니다. 이 글의 별도 비지도 sg 모형에서는 거짓입니다."}]},
save:{...f,highlight:[192,210],desc:"원문 바이너리 저장 함수는 인자·사전·입력 및 출력 행렬을 보존합니다.",annotations:[{lines:[200,208],color:"sky",note:"단어별 벡터만 적는 129–145행의 saveVectors와 다릅니다. 조각의 저장 규칙과 값이 함께 필요합니다."}]},
};
