import type { CodeRef } from "@/components/code/types";
import token from "./codebase/aave-v3-origin/src/contracts/protocol/libraries/helpers/TokenMath.sol?raw";
import math from "./codebase/aave-v3-origin/src/contracts/protocol/libraries/math/MathUtils.sol?raw";
import rate from "./codebase/aave-v3-origin/src/contracts/misc/DefaultReserveInterestRateStrategyV2.sol?raw";
import generic from "./codebase/aave-v3-origin/src/contracts/protocol/libraries/logic/GenericLogic.sol?raw";
import liquidation from "./codebase/aave-v3-origin/src/contracts/protocol/libraries/logic/LiquidationLogic.sol?raw";
const prefix="aave-v3-origin/src/contracts/";
export const teachCodeRefs:Record<string,CodeRef>={
 supply:{path:prefix+"protocol/libraries/helpers/TokenMath.sol",lang:"solidity",code:token,highlight:[59,71],desc:"Aave Origin cff15de6 · getATokenBalance",annotations:[{lines:[66,70],color:"emerald",note:"scaled 1000과 지수 1.05를 ray 배율로 곱하면 표시 잔액은 1050입니다. 이 버전의 공급 잔액은 내림합니다."}]},
 debt:{path:prefix+"protocol/libraries/helpers/TokenMath.sol",lang:"solidity",code:token,highlight:[101,113],desc:"같은 commit · getVTokenBalance",annotations:[{lines:[108,112],color:"amber",note:"scaled 7000과 지수 1.08이면 부채는 7560입니다. 공급 잔액과 달리 이 부채 조회는 올림하므로 반올림 함수를 통일하면 안 됩니다."}]},
 time:{path:prefix+"protocol/libraries/math/MathUtils.sol",lang:"solidity",code:math,highlight:[49,85],desc:"같은 commit · calculateCompoundedInterest",annotations:[{lines:[79,83],color:"violet",note:"x는 연율×경과초/1년의 ray 값입니다. 정수 반올림을 제외하면 1+x+x²/2+x³/6이며 x=0.1에서 약 1.105166667입니다."}]},
 rate:{path:prefix+"misc/DefaultReserveInterestRateStrategyV2.sol",lang:"solidity",code:rate,highlight:[124,169],desc:"같은 commit · calculateInterestRates",annotations:[{lines:[134,146],color:"sky",note:"상태로 관리한 가용량 2000과 부채 8000이면 사용률 80%입니다. unbacked가 1000이면 공급 측 분모는 11000이 됩니다."},{lines:[149,167],color:"emerald",note:"80% 분기에서는 2%+4%=6%, 공급 이율은 6%×80%×90%=4.32%입니다. 정확히80%는 else 쪽입니다."}]},
 health:{path:prefix+"protocol/libraries/logic/GenericLogic.sol",lang:"solidity",code:generic,highlight:[156,173],desc:"같은 commit · account health factor",annotations:[{lines:[156,164],color:"emerald",note:"이 지점의 avgLiquidationThreshold는 아직 담보 가치×청산 기준의 합입니다. 담보8000×80%를 부채7000으로 나누면 약0.914입니다. 부채0은 uint 최대값으로 분기합니다."}]},
 close:{path:prefix+"protocol/libraries/logic/LiquidationLogic.sol",lang:"solidity",code:liquidation,highlight:[259,282],desc:"같은 commit · close-factor selection",annotations:[{lines:[262,268],color:"amber",note:"선택한 담보와 부채가 크기 조건을 충족하고 HF가0.95보다 높을 때 기본50% 조건을 적용합니다. 사례0.914에서는 이 분기를 지나지 않습니다."},{lines:[280,282],color:"sky",note:"후보 최대량과 요청 debtToCover 중 작은 쪽을 사용합니다. 이후 가용 담보와 추가 청산 규칙도 적용됩니다."}]},
};
