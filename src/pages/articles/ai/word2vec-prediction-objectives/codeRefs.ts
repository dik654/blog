import type { CodeRef } from "@/components/code/types";
import original from "./codebase/word2vec.c?raw";
import observation from "./verification/observe_objectives.c?raw";
const c={code:original,path:"tmikolov/word2vec/word2vec.c",lang:"c" as const};
export const codeRefs:Record<string,CodeRef>={
"tree-select":{...c,highlight:[213,231],desc:"저자 저장소 commit 20c129af의 전체 원문입니다. 가장 작은 잎과 새 부모를 비교하려면 잎 목록의 빈도 순서가 맞아야 합니다.",annotations:[{lines:[213,223],color:"sky",note:"빈도 [8,4,2,1,1]을 넣으면 pos1=4에서 가장 작은 잎 1부터 읽습니다."},{lines:[224,231],color:"emerald",note:"새 부모 쪽 값이 작거나 같으면 그쪽을 먼저 꺼냅니다. 같은 빈도의 선택 순서는 주소에 영향을 줄 수 있습니다."}]},
"tree-merge":{...c,highlight:[232,248],desc:"두 번째 최소 후보를 고른 뒤 새 부모를 생성하는 실제 반복입니다. 같은 빈도 사례는 1+1, 2+2, 4+4, 8+8을 만듭니다.",annotations:[{lines:[244,247],color:"sky",note:"부모의 빈도는 두 자식의 합입니다. 두 번째 자식의 비트를 1로 표시하고 첫 자식은 초기값 0을 사용합니다."}]},
"tree-path":{...c,highlight:[249,265],desc:"잎에서 뿌리로 올라간 기록을 뒤집어 정답 경로를 저장합니다. 주소 비트와 내부 노드 번호를 함께 보관합니다.",annotations:[{lines:[253,261],color:"sky",note:"cat의 경로 길이는 3이며 첫 내부 번호는 vocab_size−2=3입니다."},{lines:[262,265],color:"emerald",note:"cat의 code는 001이고 실제 확률 계산에서 읽는 point는 3,2,1입니다."}]},
"cbow-mean":{...c,highlight:[435,448],desc:"원본 CBOW의 입력 누적과 평균입니다. window=2,b=1인 한 중심 호출에서 실제로 두 saw를 사용합니다.",annotations:[{lines:[438,445],color:"sky",note:"위치 1과 3의 ID 3을 각각 읽어 neu1에 더하고 cw를 두 번 늘립니다."},{lines:[447,448],color:"emerald",note:"cw=2로 나누면 neu1=[0,1,1]입니다. 이 평균을 거꾸로 미분할 때도 1/cw가 필요합니다."}]},
"cbow-path":{...c,highlight:[449,462],desc:"정답 cat의 내부 경로와 주소를 읽는 실제 HS 분기입니다. 관찰에서는 hs=1,negative=0으로 이 분기만 켰습니다.",annotations:[{lines:[449,456],color:"sky",note:"point=3,2,1에서 점수 0,1,1을 얻고 expTable을 조회합니다. 범위를 벗어난 항은 continue로 건너뜁니다."},{lines:[458,462],color:"emerald",note:"g는 감소 방향과 alpha를 포함합니다. neu1e에 옛 내부 벡터의 기여를 먼저 더한 뒤 해당 내부 벡터를 갱신합니다."}]},
"sigmoid-table":{...c,highlight:[707,713],desc:"원본 확률 표의 초기화입니다. 표를 만드는 식과 456행의 정수 배율을 함께 적용해야 실제 조회값을 얻습니다.",annotations:[{lines:[709,712],color:"sky",note:"점수 0은 정확한 중앙 대신 498번, 점수 1은 581번을 읽습니다. 실제 값 약 0.494000256과 0.725517869를 실행에서 확인했습니다."}]},
"cbow-input-update":{...c,highlight:[485,494],desc:"입력으로 오차를 돌려주는 실제 코드입니다. 평균의 cw로 다시 나누는 연산 없이 각 출현의 행에 neu1e를 더합니다.",annotations:[{lines:[486,492],color:"sky",note:"두 saw 모두 같은 syn0의 행 3을 가리킵니다. 원본 결과는 해당 행에 neu1e를 두 번 더한 값입니다."}]},
"sort-boundary":{...c,highlight:[154,165],desc:"문장 끝 단어를 ID 0에 남기고 그 뒤만 정렬합니다. 따라서 전체 빈도 목록의 내림차순이 언제나 보장되는 것은 아닙니다.",annotations:[{lines:[158,159],color:"sky",note:"가정한 [1,8,4,2,1]은 뒤 네 항만 정렬된 상태입니다. 실제 나무 함수에서 가중 길이 41이 나와 최적값 30과 달랐습니다."}]},
observation:{path:"article/verification/observe_objectives.c",code:observation,lang:"c",highlight:[83,96],desc:"이 글에서 작성한 한 중심 관찰 호출입니다. 원본 CBOW 분기 전체를 그대로 추출해 실행하고 원본 CreateBinaryTree도 직접 호출했습니다. 전체 학습이나 성능 측정은 아닙니다.",annotations:[{lines:[84,88],color:"sky",note:"가정한 W와 내부 벡터, sorted 빈도를 넣고 hs=1,negative=0,alpha=.1을 고정합니다."},{lines:[93,95],color:"emerald",note:"확률 표와 한 번의 갱신을 출력한 뒤, 첫 빈도가 작은 별도 배열의 정렬 경계도 관찰합니다."}]},
};
