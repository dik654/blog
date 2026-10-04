import type { CodeRef } from "@/components/code/types";
import pair from "./codebase/v2-core/contracts/UniswapV2Pair.sol?raw";
import library from "./codebase/v2-periphery/contracts/libraries/UniswapV2Library.sol?raw";
import router from "./codebase/v2-periphery/contracts/UniswapV2Router02.sol?raw";
export const teachCodeRefs:Record<string,CodeRef>={
 quote:{path:"v2-periphery/contracts/libraries/UniswapV2Library.sol",lang:"solidity",code:library,highlight:[43,50],desc:"Uniswap v2-periphery ed24991 · getAmountOut",annotations:[{lines:[46,49],color:"emerald",note:"100 token0의 실제 정수 입력은 100000000입니다. 997을 곱하고 reserve0×1000을 더한 분모로 나누면 90661089 raw token1이 됩니다."}]},
 swap:{path:"v2-core/contracts/UniswapV2Pair.sol",lang:"solidity",code:pair,highlight:[159,186],desc:"Uniswap v2-core v1.0.1 · 4dd5906, swap",annotations:[{lines:[170,177],color:"sky",note:"출력을 먼저 보낸 뒤 실제 잔액과 이전 reserve에서 입력량을 구합니다. token0 잔액1100−reserve1000=입력100입니다."},{lines:[180,182],color:"emerald",note:"token0 조정 잔액은1100×1000−100×3=1099700입니다. token1 조정 잔액과의 곱이 이전 reserve 곱×1000000 이상인지 검사합니다."}]},
 mint:{path:"v2-core/contracts/UniswapV2Pair.sol",lang:"solidity",code:pair,highlight:[109,129],desc:"같은 commit · mint",annotations:[{lines:[117,124],color:"emerald",note:"최초 공급과 기존 공급을 분리합니다. LP 표시 단위가0.000001이면1000raw인 최소 잠금량은0.001입니다."}]},
 protocolFee:{path:"v2-core/contracts/UniswapV2Pair.sol",lang:"solidity",code:pair,highlight:[88,107],desc:"같은 commit · _mintFee",annotations:[{lines:[93,101],color:"emerald",note:"rootK1100,rootKLast1000,공급1000의 정규화 예에서1000×100/(5500+1000)≈15.384615 LP를 계산합니다."},{lines:[104,105],color:"amber",note:"수수료가 꺼졌고 기록이 남아 있으면 kLast를0으로 정리합니다."}]},
 router:{path:"v2-periphery/contracts/UniswapV2Router02.sol",lang:"solidity",code:router,highlight:[224,237],desc:"Uniswap v2-periphery ed24991 · swapExactTokensForTokens",annotations:[{lines:[230,236],color:"sky",note:"실행 시점의 경로 출력량을 계산하고 최저 수령량을 검사한 뒤 첫 Pair로 입력을 보냅니다. 사용자가 앞서 본 견적을 보장하는 분기가 아닙니다."}]},
 twap:{path:"v2-core/contracts/UniswapV2Pair.sol",lang:"solidity",code:pair,highlight:[72,85],desc:"같은 commit · _update",annotations:[{lines:[74,80],color:"violet",note:"이전 reserve 비율에 경과 초를 곱해 누적한 다음 reserve를 갱신합니다. uint32 시각의 모듈러 뺄셈은 이 Solidity 버전에서 의도한 동작입니다."}]},
};
