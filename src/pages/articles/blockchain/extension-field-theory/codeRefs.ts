import type { CodeRef, FileNode } from "@/components/code/types";
import quad from "./codebase/quadratic_extension.rs?raw";
import fp2 from "./codebase/fp2.rs?raw";
import experiment from "./verification/main.rs?raw";
export const codeRefs:Record<string,CodeRef>={
"experiment":{code:experiment,path:"check/main.rs",highlight:[1, 49],lang:"rust",desc:"이 글의 실제 실행 프로그램입니다. p=3, u²=2인 자체 설정과 81개 곱, 역원·Frobenius 및 잘못된 설정을 검사합니다. upstream 원문과 구분합니다.",annotations:[{lines:[1, 49],color:"sky",note:"이 글의 실제 실행 프로그램입니다. p=3, u²=2인 자체 설정과 81개 곱, 역원·Frobenius 및 잘못된 설정을 검사합니다. upstream 원문과 구분합니다."}]},
"config":{code:fp2,path:"ark/fp2.rs",highlight:[5, 16],lang:"rust",desc:"NONRESIDUE는 X²−β가 기약이도록 골라야 한다는 조건입니다. 이번 구성은 F₃에서 β=2입니다.",annotations:[{lines:[5, 16],color:"sky",note:"NONRESIDUE는 X²−β가 기약이도록 골라야 한다는 조건입니다. 이번 구성은 F₃에서 β=2입니다."}]},
"layout":{code:quad,path:"ark/quadratic_extension.rs",highlight:[90, 123],lang:"rust",desc:"c0와 c1에 각각 상수항과 u의 계수를 둡니다. new는 두 계수를 저장하며 기약성 검사를 실행하지 않습니다.",annotations:[{lines:[90, 123],color:"sky",note:"c0와 c1에 각각 상수항과 u의 계수를 둡니다. new는 두 계수를 저장하며 기약성 검사를 실행하지 않습니다."}]},
"multiply":{code:quad,path:"ark/quadratic_extension.rs",highlight:[649, 675],lang:"rust",desc:"전체 확장 차수 2의 실제 경로는 각 출력에서 대응 곱을 더하는 계산입니다. [1,1]과 [2,1]에서 첫 출력은 1×2+2×1=1, 둘째는 1×1+1×2=0 mod3입니다.",annotations:[{lines:[649, 675],color:"sky",note:"전체 확장 차수 2의 실제 경로는 각 출력에서 대응 곱을 더하는 계산입니다. [1,1]과 [2,1]에서 첫 출력은 1×2+2×1=1, 둘째는 1×1+1×2=0 mod3입니다."}]},
"inverse":{code:quad,path:"ark/quadratic_extension.rs",highlight:[325, 341],lang:"rust",desc:"1+u의 노름은 1−2=2이고 그 역원도 2입니다. 결과 c0=2, c1=−2=1이며 0의 역원은 None입니다.",annotations:[{lines:[325, 341],color:"sky",note:"1+u의 노름은 1−2=2이고 그 역원도 2입니다. 결과 c0=2, c1=−2=1이며 0의 역원은 None입니다."}]},
"frobenius":{code:quad,path:"ark/quadratic_extension.rs",highlight:[353, 357],lang:"rust",desc:"두 계수에 바탕 체의 Frobenius를 적용하고 c1에 설정의 배율을 곱합니다.",annotations:[{lines:[353, 357],color:"sky",note:"두 계수에 바탕 체의 Frobenius를 적용하고 c1에 설정의 배율을 곱합니다."}]},
"frob-table":{code:fp2,path:"ark/fp2.rs",highlight:[88, 95],lang:"rust",desc:"power를 확장 차수 2로 나눈 나머지로 [1,2]의 계수를 고릅니다. 이번 예의 세제곱은 c1에 2를 곱합니다.",annotations:[{lines:[88, 95],color:"sky",note:"power를 확장 차수 2로 나눈 나머지로 [1,2]의 계수를 고릅니다. 이번 예의 세제곱은 c1에 2를 곱합니다."}]},
};
export const fileTrees:Record<string,FileNode>={ark:{name:"ark-ff 0.5.0 · 고정 원문",type:"dir",children:[{name:"quadratic_extension.rs",type:"file",path:"ark/quadratic_extension.rs",codeKey:"multiply"},{name:"fp2.rs",type:"file",path:"ark/fp2.rs",codeKey:"config"}]},check:{name:"이 글의 검증 프로그램",type:"dir",children:[{name:"main.rs",type:"file",path:"check/main.rs",codeKey:"experiment"}]}};
