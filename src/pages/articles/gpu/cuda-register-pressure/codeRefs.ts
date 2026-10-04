import type { CodeRef, FileNode } from "@/components/code/types";
import source from "./codebase/simpleOccupancy.cu?raw";
export const codeRefs: Record<string, CodeRef> = {
 occupancy:{code:source,path:"cuda/simpleOccupancy.cu",lang:"c",highlight:[62,84],desc:"NVIDIA cuda-samples v13.0의 reportPotentialOccupancy 원문입니다. 실제 kernel을 API에 넘겨 block 수를 구한 뒤 warp 비율로 바꿉니다. 본문 37 registers의 kernel을 실제 컴파일한 출력은 아닙니다.",annotations:[{lines:[73,81],color:"sky",note:"조건부 입력 numBlocks=12, blockSize=128, warpSize=32, maxThreadsPerMultiProcessor=2048이면 activeWarps=48, maxWarps=64, 반환값 0.75입니다."}]},
 launch:{code:source,path:"cuda/simpleOccupancy.cu",lang:"c",highlight:[119,156],desc:"최대 occupancy를 위한 크기 추천, 실제 launch, 잠재 occupancy와 시간 보고가 분리되어 있습니다. 추천 blockSize가 가장 빠른 크기라는 보장은 없습니다.",annotations:[{lines:[119,137],color:"sky",note:"추천 크기와 최소 grid는 계산 결과이며 실제 gridSize는 입력 arrayCount에서 올림해 정합니다."},{lines:[141,156],color:"emerald",note:"동일 stream의 event로 감싼 kernel 구간을 측정합니다. 잠재 occupancy를 보고하는 API 호출 시간은 두 event 사이에 포함되지 않습니다."}]},
 square:{code:source,path:"cuda/simpleOccupancy.cu",lang:"c",highlight:[41,49],desc:"실제 kernel은 입력 정수 배열을 제곱합니다. 예시값7은49가 되지만 source만 보고 배정 register 수37을 알아낼 수는 없습니다.",annotations:[{lines:[43,48],color:"amber",note:"idx=0×128+3=3이고 arrayCount>3이면 array[3]=7은49가 됩니다. 원문의 dynamic shared 선언과 조건을 그대로 보존했습니다."}]},
};
export const fileTrees: Record<string, FileNode> = {cuda:{name:"NVIDIA cuda-samples · v13.0",type:"dir",children:[{name:"simpleOccupancy.cu",type:"file",path:"cuda/simpleOccupancy.cu",codeKey:"occupancy"}]}};
