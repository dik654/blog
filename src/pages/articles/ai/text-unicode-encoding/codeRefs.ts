import type { CodeRef } from "@/components/code/types";
import source from "./codebase/utf8proc.c?raw";
import observer from "./verification/observe.c?raw";
import node from "./verification/observe.mjs?raw";
const c={code:source,path:"JuliaStrings/utf8proc/utf8proc.c",lang:"c" as const};
export const codeRefs:Record<string,CodeRef>={
iterate:{...c,highlight:[125,172],desc:"v2.11.3 e5e79922의 수정하지 않은 전체 원문입니다. 각 번호의 소비 byte 수와 오류를 반환합니다.",annotations:[{lines:[135,146],color:"sky",note:"41과 65는 한 byte이며 CC 81은 두 byte입니다. C0은 시작 범위를 벗어나 거부됩니다."},{lines:[147,170],color:"emerald",note:"가의 세 byte에서 44032를 복원합니다. surrogate와 네 byte 최대 범위도 따로 검사합니다."}]},
observe:{code:observer,path:"article/verification/observe.c",lang:"c",highlight:[9,22],desc:"저자가 작성한 실제 호출 예제입니다. 원본 함수를 순서대로 호출해 같은 입력의 번호·byte·경계를 기록합니다.",annotations:[{lines:[9,21],color:"sky",note:"음수 오류는 중단하고 양수 소비 길이만큼 진행합니다. UTF-16 길이는 scalar 범위로 계산한 값이며 실제 Node 관찰도 따로 남깁니다."}]},
map:{...c,highlight:[769,802],desc:"원문의 map은 분해 크기를 계산하고 공간을 할당한 뒤 분해와 재부호화를 진행합니다.",annotations:[{lines:[781,797],color:"sky",note:"실패를 음수로 반환하며 오류에서는 할당한 공간을 해제합니다. 성공 길이는 결과 byte 수입니다."}]},
order:{...c,highlight:[592,623],desc:"결합 표시를 속성의 combining_class에 따라 정렬하는 원문입니다.",annotations:[{lines:[609,618],color:"emerald",note:"뒤의 양수 결합 등급이 더 작으면 위치를 맞바꿉니다. q 뒤의 230·220은 220·230 순으로 바뀝니다."}]},
compose:{...c,highlight:[658,735],desc:"한글 자모 결합과 일반 조합표를 사용하는 실제 합성 경로입니다.",annotations:[{lines:[670,697],color:"sky",note:"한글 앞소리와 모음 또는 받침의 조합을 직접 계산합니다."},{lines:[699,720],color:"emerald",note:"그 밖의 문자는 조합표에서 대응을 찾습니다. 선택한 e와 악센트는 é가 됩니다."}]},
boundary:{...c,highlight:[261,355],desc:"기본 경계 규칙과 앞서 읽은 문자 속성을 보존하는 상태 갱신입니다.",annotations:[{lines:[279,288],color:"sky",note:"Extend 앞을 붙이며 그림과 연결 표시의 추가 상태도 사용합니다."},{lines:[323,339],color:"emerald",note:"앞의 그림과 연결 표시를 보았다는 상태를 다음 비교에 전달합니다. 매 쌍을 고립시켜 판단하지 않습니다."}]},
node:{code:node,path:"article/verification/observe.mjs",lang:"typescript",highlight:[1,21],desc:"이 글에서 실제 Node로 실행한 관찰 코드입니다. 내장 구현의 원문이 아니라 공개 API 호출입니다.",annotations:[{lines:[4,14],color:"sky",note:"length·코드 포인트 순회·Buffer·Intl.Segmenter를 분리해 같은 입력을 관찰합니다."}]},
encode:{...c,highlight:[173,204],desc:"유효성 검사와 byte 생성의 계약이 다른 고정 API입니다.",annotations:[{lines:[173,175],color:"sky",note:"scalar 범위 검사는 surrogate를 제외합니다."},{lines:[189,192],color:"emerald",note:"encode_char 자체는 호환성을 위해 surrogate도 byte로 내보낸다는 원문 주석입니다."}]},
length:{...c,highlight:[548,579],desc:"NULLTERM 옵션 여부에 따라 길이를 읽는 방식이 갈립니다. NFC 편의 호출은 812–817행에서 NULLTERM을 넣습니다.",annotations:[{lines:[565,576],color:"sky",note:"NULLTERM이면 코드 포인트 0에서 멈추고, 명시적 길이 경로는 입력 길이까지 처리합니다."}]}
};
