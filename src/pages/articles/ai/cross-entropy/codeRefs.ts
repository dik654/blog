import type { CodeRef } from "@/components/code/types";
import nll from "./codebase/pytorch/aten/src/ATen/native/LossNLL.cpp?raw";
import softmax from "./codebase/pytorch/aten/src/ATen/native/cpu/LogSoftmaxKernelImpl.h?raw";
import example from "./codebase/ce_arithmetic.py?raw";
const common={path:"pytorch/aten/src/ATen/native/LossNLL.cpp",code:nll,lang:"c" as const};
export const ceCodeRefs:Record<string,CodeRef>={
entry:{...common,highlight:[632,668],desc:"PyTorch v2.14.0 commit 2b3ec348의 실제 원문입니다. 입력과 정답의 shape가 같으면 확률 정답 경로로 가며, label_smoothing=0인 클래스 번호 정답은 log_softmax 뒤 NLL로 갑니다.",annotations:[{lines:[640,649],color:"sky",note:"4×3 logits와 같은 4×3 정답을 주면 확률 정답입니다. 여기서 값의 합이 1인지 검사하는 코드는 없습니다."},{lines:[657,665],color:"emerald",note:"우리 입력 4×3과 클래스 번호 정답 [0,0,1,2]는 shape가 다릅니다. class_dim=1에서 log_softmax를 계산합니다."}]},
reduce:{...common,highlight:[253,304],desc:"같은 파일의 CPU NLL 누적과 평균 분모입니다. 실제 파일 전체를 보존했고 이 구간에 글의 네 관측을 대입합니다.",annotations:[{lines:[265,273],color:"sky",note:"각 행의 정답 열을 골라 음의 로그를 더합니다. 가중치가 없으면 비용은 2·2·2·1에 ln2를 곱한 네 값입니다."},{lines:[288,299],color:"emerald",note:"가중치가 없고 제외한 정답도 없으면 분모 4입니다. 클래스 가중치가 있으면 실제 정답 가중치의 합으로 바뀝니다."}]},
softTarget:{...common,highlight:[514,555],desc:"정답이 확률 배열일 때의 별도 원문 경로입니다. 클래스별 곱을 더하고 mean은 입력의 관측 수로 나눕니다.",annotations:[{lines:[540,541],color:"sky",note:"가중치를 주어도 확률 정답 경로의 mean 분모는 관측 수입니다. 같은 one-hot이라도 클래스 번호 경로의 가중치 합 분모와 다를 수 있습니다."},{lines:[547,555],color:"emerald",note:"가중치 없는 정답 P=(.5,.25,.25)를 한 행에 넣으면 −ΣP logQ=1.75ln2입니다."}]},
stable:{path:"pytorch/aten/src/ATen/native/cpu/LogSoftmaxKernelImpl.h",code:softmax,lang:"c",highlight:[54,95],desc:"동일 commit의 CPU 마지막 차원 log_softmax 구현입니다. SoftMaxKernel.cpp가 호출하는 실제 공통 헤더입니다.",annotations:[{lines:[54,68],color:"sky",note:"최댓값을 먼저 찾고 각 값에서 뺀 다음 exp를 합합니다. [0,0,ln2]에서는 [.5,.5,1]을 더해 2가 됩니다."},{lines:[83,95],color:"emerald",note:"원문 주석이 연산 순서를 경고합니다. x−max−log(sum) 순서이므로 큰 max에 작은 log(sum)을 먼저 더하지 않습니다."}]},
arithmetic:{path:"article/ce_arithmetic.py",code:example,lang:"python",highlight:[15,24],desc:"글에서 작성해 Python 3.9.6으로 실행한 산술 예제입니다. 각 연산 결과를 binary32로 반올림하며 PyTorch 실행이나 커널 속도를 재현한 것은 아닙니다.",annotations:[{lines:[16,22],color:"sky",note:"같은 100,000,000 세 개를 넣는 가정에서 먼저 큰 수에 ln3을 더하면 작은 항이 사라집니다. 먼저 차를 구하면 ln3이 남습니다."}]},
};
