import type { CodeRef, FileNode } from "@/components/code/types";
import base from "../../crypto/pq-sources/codebase/account-abstraction/contracts/core/BaseAccount.sol?raw";
import entry from "../../crypto/pq-sources/codebase/account-abstraction/contracts/core/EntryPoint.sol?raw";
import nonce from "../../crypto/pq-sources/codebase/account-abstraction/contracts/core/NonceManager.sol?raw";
const ref=(path:string,code:string,highlight:[number,number],desc:string,annotations:CodeRef["annotations"]):CodeRef=>({path:"account-abstraction/contracts/core/"+path,code,lang:"solidity",highlight,desc,annotations});
export const codeRefs:Record<string,CodeRef>={
 prefund:ref("EntryPoint.sol",entry,[481,499],"1c6b669 공식 원문. 대납자 검증·후처리까지 포함해 예약할 최대 비용을 구합니다.",[{lines:[489,496],color:"sky",note:"20k+40k+20k+20k+50k=150k gas에 maxFee 20 Gwei를 곱하면 0.003 ETH입니다(가정)."}]),
 settlement:ref("EntryPoint.sol",entry,[919,937],"실제 비용을 계산하고 남은 예약액을 환급합니다.",[{lines:[919,920],color:"sky",note:"최종 청구 gas 100k와 가격 10 Gwei를 가정하면 0.001 ETH입니다."},{lines:[934,937],color:"emerald",note:"0.003−0.001=0.002를 돌려줍니다. 대납자 예치금 0.007에 더해 0.009가 됩니다."}]),
 validation:ref("BaseAccount.sol",base,[80,108],"알려진 EntryPoint인지 확인한 뒤 계정별 서명 검증을 호출합니다.",[{lines:[86,89],color:"sky",note:"승인 확인과 부족한 비용 확보가 별도 호출입니다. 이 기본 계정에 30분·100개 정책이 이미 구현된 것은 아닙니다."}]),
 nonce:ref("NonceManager.sol",nonce,[27,38],"계정·key별 sequence를 실제로 검사합니다.",[{lines:[33,37],color:"emerald",note:"key 0의 저장값 7과 요청 7을 비교하고 8로 증가합니다. 상위 검증이 revert하면 증가도 취소됩니다."}]),
 loops:ref("EntryPoint.sol",entry,[77,96],"요청들을 먼저 검증하고 뒤의 반복문에서 실행합니다.",[{lines:[85,85],color:"sky",note:"7번 요청의 서명·nonce·비용을 포함한 검증입니다."},{lines:[90,94],color:"emerald",note:"실행과 비용 수집 뒤 제출자가 지정한 beneficiary에게 보상합니다."}]),
 execute:ref("BaseAccount.sol",base,[45,55],"계정이 자산 계약의 함수를 호출합니다.",[{lines:[48,53],color:"emerald",note:"사례의 target은 USDC, ETH value는 0이고 data에는 Bob에게 40개를 보내는 호출을 넣습니다. 전송이 실패하면 계정 실행을 되돌립니다."}]),
 validity:ref("EntryPoint.sol",entry,[769,788],"계정이 반환한 검증 자료를 해석해 현재 시각 또는 블록 번호의 유효 구간을 확인합니다.",[{lines:[777,785],color:"amber",note:"시간 경로에서는 현재 시각>validUntil 또는 현재 시각≤validAfter이면 범위를 벗어납니다. 10분은 30분 만료 이내입니다."}]),
 batch:ref("BaseAccount.sol",base,[57,78],"배치를 순서대로 실행하고 첫 실패에서 revert합니다.",[{lines:[67,74],color:"amber",note:"owner가 허용한 approve+swap의 두 번째 호출이 실패하면 앞의 승인 변화도 같은 호출 범위에서 되돌립니다. 임시 열쇠에 이 배치를 허용한다는 뜻은 아닙니다."}]),
};

export const teachFileTree:FileNode={name:"account-abstraction",type:"dir",children:[{name:"contracts/core",type:"dir",children:[{name:"EntryPoint.sol",type:"file",path:"account-abstraction/contracts/core/EntryPoint.sol",codeKey:"prefund"},{name:"BaseAccount.sol",type:"file",path:"account-abstraction/contracts/core/BaseAccount.sol",codeKey:"execute"},{name:"NonceManager.sol",type:"file",path:"account-abstraction/contracts/core/NonceManager.sol",codeKey:"nonce"}]}]};
