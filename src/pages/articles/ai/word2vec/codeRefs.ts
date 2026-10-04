import type { CodeRef } from "@/components/code/types";
import original from "./codebase/original/word2vec.c?raw";
import module from "./codebase/pytorch/torch/nn/modules/sparse.py?raw";
import functional from "./codebase/pytorch/torch/nn/functional.py?raw";
import native from "./codebase/pytorch/aten/src/ATen/native/Embedding.cpp?raw";
import observation from "./verification/observe.c?raw";
const c={code:original,path:"word2vec/word2vec.c",lang:"c" as const};
export const codeRefs:Record<string,CodeRef>={
module:{path:"pytorch/torch/nn/modules/sparse.py",code:module,lang:"python",highlight:[188,197],desc:"PyTorch v2.13.0, commit cf30153c의 수정하지 않은 전체 원문입니다. Embedding.forward가 입력과 표를 함수에 넘깁니다.",annotations:[{lines:[188,197],color:"sky",note:"indices=[2,3,3]과 W를 넘깁니다. max_norm=None, sparse=False라는 기본 조건을 함께 확인합니다."},{lines:[136,146],color:"emerald",note:"sparse=False는 행 조회가 곧 희소 기울기를 뜻하지 않음을 보여 줍니다."}]},
functional:{path:"pytorch/torch/nn/functional.py",code:functional,lang:"python",highlight:[2593,2615],desc:"같은 고정 버전의 전체 functional.py입니다. Python 함수의 옵션 처리와 실제 embedding 호출을 구별합니다.",annotations:[{lines:[2603,2615],color:"sky",note:"max_norm이 없으면 행의 재정규화 분기를 건너뜁니다. 지정하면 조회 전에 weight를 제자리에서 바꿀 수 있습니다."}]},
"onehot-as-gather":{path:"pytorch/aten/src/ATen/native/Embedding.cpp",code:native,lang:"c",highlight:[37,54],desc:"고정 버전의 실제 C++ 원문입니다. 패널의 언어 표시는 지원되는 C 계열 하이라이터를 사용합니다. 전체 PyTorch 실행이 아닌 원문 대입입니다.",annotations:[{lines:[37,53],color:"sky",note:"1차원 [2,3,3]이면 index_select(0,indices)로 W의 2·3·3번 행을 순서대로 읽습니다."},{lines:[56,73],color:"emerald",note:"역방향 계산은 sparse 옵션을 보고 희소 또는 밀집 경로를 고릅니다."}]},
reader:{...c,highlight:[69,94],desc:"저자 저장소 commit 20c129af의 수정하지 않은 전체 C 원문입니다. 실제 관찰 실행은 같은 ReadWord 함수를 호출했습니다.",annotations:[{lines:[74,87],color:"sky",note:"공백·탭·줄바꿈을 구분합니다. 단어 뒤의 줄바꿈은 되돌려 다음 호출이 </s>를 반환하게 합니다."}]},
sentence:{...c,highlight:[399,433],desc:"단어를 제거한 뒤 남은 번호를 문장 배열에 붙이는 실제 순서입니다.",annotations:[{lines:[400,417],color:"sky",note:"번호 0에서 문장을 끊고, 단어 제거를 통과한 경우에만 sen에 넣습니다. 제거된 위치는 배열에 빈칸으로 남지 않습니다."},{lines:[419,428],color:"emerald",note:"파일 끝과 스레드별 처리량 조건도 실행 흐름을 바꿉니다. 관찰에서는 한 스레드와 한 번의 반복을 사용했습니다."}]},
"skip-pair":{...c,highlight:[495,505],desc:"현재 위치의 word와 이웃 위치의 last_word가 실제 입력 역할과 어떻게 연결되는지 보여 줍니다.",annotations:[{lines:[495,503],color:"sky",note:"중심 cat의 이웃 saw를 읽어 l1=3×3=9를 정합니다. 이 코드의 입력은 중심 cat이 아니라 이웃 saw입니다."}]},
"positive-score":{...c,highlight:[520,534],desc:"음의 표본을 사용하는 학습 분기의 양의 대상 선택과 점수 계산입니다. 본문 점수 1은 원문 식에 가정한 두 표를 대입한 값이며 관찰 실행에서는 이 학습 분기를 껐습니다.",annotations:[{lines:[522,524],color:"sky",note:"d=0일 때 target=word로 중심 cat의 ID 2를 고릅니다."},{lines:[532,534],color:"emerald",note:"l2=2×3=6이며 입력 [0,1,1]과 출력 [2,0,1]의 곱을 더하면 1입니다."}]},
"random-window":{...c,highlight:[429,434],desc:"원본의 정수 상태 갱신과 반경 선택입니다. 유한한 의사 난수열과 독립 균일 추출 모형을 구별합니다.",annotations:[{lines:[433,434],color:"sky",note:"window=2에서 b=상태%2이고 실제 반경은 2−b입니다. 관찰의 위치별 반경은 1,2,1,2,1입니다."}]},
observation:{path:"article/verification/observe.c",code:observation,lang:"c",highlight:[4,31],desc:"이 글에서 작성한 관찰 호출 파일입니다. 원문에서 printf 한 줄만 추가한 생성 파일을 포함해 CPU에서 실행했습니다. hs=0, negative=0, sample=0이며 학습 품질·속도 측정은 하지 않았습니다.",annotations:[{lines:[8,18],color:"sky",note:"원문 함수를 호출하되 번호표와 W는 가정한 값으로 직접 넣고 제거·학습 목적을 끕니다."},{lines:[20,25],color:"emerald",note:"실제 문장 읽기와 단일 스레드의 TrainModelThread를 실행합니다. 마지막에는 W가 바뀌지 않았는지 검사합니다."}]},
};
