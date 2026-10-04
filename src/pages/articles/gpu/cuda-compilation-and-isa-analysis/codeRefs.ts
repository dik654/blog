import type { CodeRef, FileNode } from "@/components/code/types";
import kernel from "../gpu-execution-sources/codebase/cuda/vectorAdd.cu?raw";
import ptx from "./codebase/document-add-sm100-ptx.txt?raw";
import sass from "./codebase/document-add-sm100-sass.txt?raw";
import usage from "./codebase/document-resource-usage.txt?raw";
export const codeRefs: Record<string, CodeRef> = {
  kernel: {code:kernel,highlight:[47,54],path:"cuda/vectorAdd.cu",lang:"c",desc:"NVIDIA cuda-samples v13.0의 고정 원본입니다. 실제 식의 +0.0f까지 보존했습니다. 원본 host의 기본 50000개와 본문의 가정 8개를 구별합니다.",annotations:[{lines:[49,52],color:"sky",note:"0×4+3=3이고 3<8이라 A[3]+B[3]+0.0f=12를 씁니다. 아래 문서 add.o의 원본 소스라는 주장은 하지 않습니다."}]},
  ptx: {code:ptx,highlight:[33,51],path:"docs/document-add-sm100-ptx.txt",lang:"c",desc:"CUDA Binary Utilities 13.0.2 §2.1에 실린 출력 블록 전체입니다. 문서의 PTX 8.8·sm_100 예시이며 로컬 컴파일 결과가 아닙니다.",annotations:[{lines:[39,43],color:"sky",note:"%r1=3, %r2=0, %r3=4에서 %r4=3, %rd7=12바이트입니다."},{lines:[45,50],color:"emerald",note:"%f1=7, %f2=5, %f3=12입니다. 길이 검사 인자와 분기는 없습니다."}]},
  sass: {code:sass,highlight:[17,49],path:"docs/document-add-sm100-sass.txt",lang:"c",desc:"동일한 문서의 add 함수 sm_100 SASS 출력입니다. FADD 덧셈이며 FFMA 예시가 아닙니다.",annotations:[{lines:[17,31],color:"sky",note:"thread와 block 값을 읽고 0070 IMAD에서 R9=3을 만듭니다."},{lines:[35,47],color:"emerald",note:"A[3]=7은 R2, B[3]=5는 R5에 놓이고 FADD가 R9=12를 만듭니다."}]},
  liveness: {code:sass,highlight:[33,47],path:"docs/document-add-sm100-sass.txt",lang:"c",desc:"주소의 마지막 사용 뒤 같은 저장 자리를 다른 값이 재사용합니다. 가장 큰 register 번호를 자원 보고와 같게 읽지 않습니다.",annotations:[{lines:[33,36],color:"amber",note:"IMAD.WIDE의 R2.64 주소를 LDG.E가 소비하고 목적지 R2에는 읽은 값 7이 놓입니다."}]},
  usage: {code:usage,highlight:[5,7],path:"docs/document-resource-usage.txt",lang:"c",desc:"다른 test.cubin의 calculate 함수가 REG:24를 보고하는 문서 예시입니다. add 함수의 자원 사용량은 이 출력으로 알 수 없습니다.",annotations:[{lines:[6,7],color:"sky",note:"함수 이름 calculate와 REG:24를 함께 읽습니다. 원문 파일·함수의 범위를 바꾸지 않습니다."}]},
};
export const fileTrees: Record<string, FileNode> = {
 cuda:{name:"NVIDIA cuda-samples · v13.0",type:"dir",children:[{name:"vectorAdd.cu",type:"file",path:"cuda/vectorAdd.cu",codeKey:"kernel"}]},
 docs:{name:"CUDA Binary Utilities · 문서 출력",type:"dir",children:[{name:"document-add-sm100-ptx.txt",type:"file",path:"docs/document-add-sm100-ptx.txt",codeKey:"ptx"},{name:"document-add-sm100-sass.txt",type:"file",path:"docs/document-add-sm100-sass.txt",codeKey:"sass"},{name:"document-resource-usage.txt",type:"file",path:"docs/document-resource-usage.txt",codeKey:"usage"}]},
};
