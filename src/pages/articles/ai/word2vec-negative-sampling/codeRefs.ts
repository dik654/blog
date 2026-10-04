import type { CodeRef } from "@/components/code/types";
import original from "./codebase/word2vec.c?raw";
import observation from "./verification/observe_sgns.c?raw";
const c={code:original,path:"tmikolov/word2vec/word2vec.c",lang:"c" as const};
export const codeRefs:Record<string,CodeRef>={
unigram:{...c,highlight:[52,69],desc:"고정 commit 20c129af의 전체 원문입니다. 실제 InitUnigramTable을 같은 가정 빈도 [1,1,1,16,1]로 호출했습니다.",annotations:[{lines:[57,61],color:"sky",note:"무게의 합은 12입니다. 100,000,000칸에 번호를 누적확률 길이로 반복합니다."},{lines:[62,68],color:"emerald",note:"칸에 현재 번호를 먼저 쓴 뒤 경계를 비교하므로 각 칸 수는 이상적인 분수와 조금 다릅니다."}]},
direction:{...c,highlight:[495,503],desc:"실제 Skip-gram 반복에서 이웃 last_word의 입력 행을 고릅니다. 가운데 word가 cat일 때 이번 이웃 saw가 입력입니다.",annotations:[{lines:[496,502],color:"sky",note:"위치 경계를 확인하고 이웃 번호 3을 layer1_size와 곱해 입력 시작 위치 l1=9를 얻습니다."}]},
proposal:{...c,highlight:[521,531],desc:"첫 반복은 관찰 cat이며 뒤의 두 반복이 비교 대상을 뽑습니다. 시작 상태 43에서 red와 dog가 나옵니다.",annotations:[{lines:[522,524],color:"sky",note:"d=0은 정답 word=2에 라벨 1을 붙입니다."},{lines:[526,530],color:"emerald",note:"64비트 상태를 갱신하고 상위 비트로 추첨표 위치를 읽습니다. 정답과 같은 대상은 건너뜁니다."}]},
update:{...c,highlight:[532,542],desc:"점수와 고칠 양을 계산하는 실제 블록입니다. 대상 행은 즉시 바꾸고 입력 행은 모든 비교 뒤에 한 번 바꿉니다.",annotations:[{lines:[534,537],color:"sky",note:"세 점수 1은 모두 expTable[581]≈.725517869를 읽습니다. g는 (label−확률)×alpha입니다."},{lines:[538,542],color:"emerald",note:"옛 출력 행의 기여를 먼저 neu1e에 쌓고 출력 행을 바꾼 뒤 마지막에 입력 saw로 누적을 돌려줍니다."}]},
sigmoid:{...c,highlight:[707,713],desc:"sigmoid 표의 실제 초기화입니다. 이 식과 537행의 정수 배율 1000/6/2=83을 함께 적용했습니다.",annotations:[{lines:[709,712],color:"sky",note:"581번의 약 .725517869는 수학적인 σ(1)≈.731058579와 다릅니다."}]},
policy:{...c,highlight:[526,540],desc:"시작 상태 0과 여섯 번 제안에서 번호 0 재선택·중복 허용·정답 제외가 모두 드러납니다.",annotations:[{lines:[528,530],color:"sky",note:"번호 0은 다른 번호로 바뀝니다. 마지막 cat은 건너뛰며 재추첨하지 않습니다."},{lines:[538,539],color:"emerald",note:"saw 대상 행은 네 번 즉시 바뀝니다. 입력 행이 마지막까지 고정되어 있어도 중복 출력 점수는 달라집니다."}]},
filter:{...c,highlight:[403,414],desc:"문장 배열에 출현을 넣기 전에 적용되는 실제 제거 조건입니다. 같은 다섯 번호에서 원본 408–414행을 그대로 실행했습니다.",annotations:[{lines:[408,411],color:"sky",note:"saw 비교값은 .11, 다른 단어는 .56입니다. 난수가 더 클 때 continue로 해당 출현을 버립니다."},{lines:[413,414],color:"emerald",note:"통과한 단어만 sen에 넣으므로 남은 문장에서 거리가 새로 정해집니다. 이번에는 [1,2]입니다."}]},
observation:{path:"article/verification/observe_sgns.c",code:observation,lang:"c",highlight:[57,77],desc:"이 글에서 작성한 제한된 관찰 호출입니다. 원문 unigram 함수와 변경하지 않은 두 블록을 실행하며 전체 학습은 실행하지 않았습니다.",annotations:[{lines:[57,60],color:"sky",note:"가정한 빈도표로 원본 함수를 부르고 실제 각 번호의 칸 수를 셉니다."},{lines:[71,78],color:"emerald",note:"표를 초기값으로 돌려 seed 43·두 제안과 seed 0·여섯 제안을 따로 관찰합니다. 아래 DRAW 기록은 관찰용 복제 계산이며 원문 안에 삽입한 코드가 아닙니다."}]},
};
