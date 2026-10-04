import type {CodeRef} from "@/components/code/types";
import extendingRst from "../reverse-mode-autodiff/codebase/pytorch/docs/source/notes/extending.rst?raw";
const source = {path:"pytorch/docs/source/notes/extending.rst",lang:"python" as const,code:extendingRst};
export const backpropCodeRefs: Record<string,CodeRef>={
  "linear-forward":{...source,highlight:[167,178],desc:"PyTorch v2.8.0 고정 원문의 교육용 LinearFunction입니다. 실제 nn.Linear native kernel과 구분합니다. Input=[[1,2]], weight=Wᵀ인 가정 사례를 적용합니다.",annotations:[{lines:[167,171],color:"sky",note:"원문은 weight를 출력×입력 shape로 저장하고 전치해서 곱합니다. 본문의 Z=XW+b와 저장 관례가 다릅니다."}]},
  "linear-backward":{...source,highlight:[182,202],desc:"같은 고정 원문의 backward에 grad_output=[[2/3,−2/3]]을 넣습니다. 반환 순서는 input, weight, bias입니다.",annotations:[{lines:[195,200],color:"emerald",note:"입력 gradient는 GWᵀ, 저장 weight의 gradient는 GᵀX, bias는 G의 행 합입니다. 따라서 코드의 grad_weight는 본문의 dW=XᵀG를 전치한 값입니다."}]}
};
