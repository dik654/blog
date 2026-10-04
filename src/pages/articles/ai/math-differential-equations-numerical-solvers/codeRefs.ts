import type { CodeRef } from "@/components/code/types";
import grid from "./codebase/torchdiffeq/_impl/fixed_grid.py?raw";
import solvers from "./codebase/torchdiffeq/_impl/solvers.py?raw";
import rk from "./codebase/torchdiffeq/_impl/rk_common.py?raw";
import misc from "./codebase/torchdiffeq/_impl/misc.py?raw";
import odeint from "./codebase/torchdiffeq/_impl/odeint.py?raw";
const base={lang:"python" as const};
export const odeCodeRefs:Record<string,CodeRef>={
entry:{...base,path:"torchdiffeq/_impl/odeint.py",code:odeint,highlight:[19,29],desc:"고정 commit 657943a의 전체 원문입니다. method euler와 heun2가 각각 실제 계산 클래스로 연결됩니다. 아래 90행 부근에서 solver를 만들고 integrate를 호출합니다.",annotations:[{lines:[25,28],color:"sky",note:"이 글에서는 같은 func(t,y)=−y와 시작값 1을 두 방법에 대입해 읽습니다."}]},
euler:{...base,path:"torchdiffeq/_impl/fixed_grid.py",code:grid,highlight:[6,11],desc:"Euler의 _step_func가 현재 변화율을 한 번 구합니다. 반환하는 첫 값은 새 상태가 아니라 변화량입니다.",annotations:[{lines:[10,11],color:"sky",note:"y0=1, dt=.5이면 f0=−1, 반환 변화량은 −.5입니다."}]},
integrate:{...base,path:"torchdiffeq/_impl/solvers.py",code:solvers,highlight:[102,126],desc:"실제 반복문은 dy를 y0에 더하고 필요한 출력 시각을 보간합니다. 요청 시각 목록과 내부 계산 격자를 구분합니다.",annotations:[{lines:[111,116],color:"sky",note:"첫 y1=1−.5=.5입니다. 다음 반복에는 y0=.5를 넘겨 dy=−.25, y1=.25를 만듭니다."},{lines:[118,123],color:"emerald",note:"기본 linear와 달리 cubic 분기는 f1을 추가 평가합니다. 단계 수만 세면 전체 함수 호출 수를 놓칠 수 있습니다."}]},
heun:{...base,path:"torchdiffeq/_impl/fixed_grid.py",code:grid,highlight:[45,57],desc:"Heun2의 계수표는 예상 끝점을 한 번 만들고 두 기울기에 각각 1/2을 곱합니다.",annotations:[{lines:[48,57],color:"sky",note:"f0=−1을 rk2_step_func에 재사용합니다. 같은 첫 단계의 결과 변화량은 −.375입니다."}]},
rk2:{...base,path:"torchdiffeq/_impl/rk_common.py",code:rk,highlight:[142,159],desc:"두 번째 기울기를 예상 끝점에서 평가한 뒤 dt를 곱해 변화량을 반환하는 실제 함수입니다.",annotations:[{lines:[153,159],color:"sky",note:"k1=−1, 예상 y=.5, k2=−.5이므로 .5×(−1−.5)/2=−.375입니다. integrate가 더해 새 상태 .625를 만듭니다."}]},
adaptive:{...base,path:"torchdiffeq/_impl/rk_common.py",code:rk,highlight:[314,361],desc:"가변 간격 계산에서는 오차 비율로 수락·거절을 정하고 다음 간격을 고릅니다. min_step과 max_step의 별도 조건도 함께 읽어야 합니다.",annotations:[{lines:[325,332],color:"sky",note:"기본 오차 판정은 비율≤1입니다. min_step에 닿으면 수락을 강제하는 분기가 있어 무조건적인 오차 보장이 아닙니다."}]},
ratio:{...base,path:"torchdiffeq/_impl/misc.py",code:misc,highlight:[80,98],desc:"성분별 atol+rtol×max(|y0|,|y1|)로 나누고 norm을 구합니다. 실제 다음 간격 배율에는 안전 계수와 상하한이 들어갑니다.",annotations:[{lines:[80,82],color:"sky",note:"한 성분에서 y0=1, y1=.5, atol=.001, rtol=.01이면 기준은 .011입니다. 오차 추정 .022는 비율 2입니다."}]},
};
