import type { CodeRef } from "@/components/code/types";
import exchange from "./codebase/hyperliquid-python-sdk/hyperliquid/exchange.py?raw";
import signing from "./codebase/hyperliquid-python-sdk/hyperliquid/utils/signing.py?raw";
import example from "./codebase/hyperliquid-python-sdk/examples/basic_order.py?raw";

export const codeRefs: Record<string, CodeRef> = {
  order: {path:"hyperliquid-python-sdk/hyperliquid/exchange.py",code:exchange,highlight:[140,189],lang:"python",desc:"commit 2fdb18f. order()는 매매 요청을 만들고 bulk_orders()가 자산 번호·서명·nonce를 붙여 전송합니다. 서버의 체결 엔진은 이 파일에 없습니다.",annotations:[{lines:[151,161],color:"sky",note:"0.1 BTC, 50000달러, Gtc라는 요청이 OrderRequest에 들어갑니다."},{lines:[166,175],color:"emerald",note:"이름을 asset ID로 바꾸고 전송용 action과 밀리초 nonce를 만듭니다."},{lines:[177,189],color:"amber",note:"네트워크·vault·만료 조건까지 서명한 뒤 API 응답을 돌려줍니다. 포지션 변화를 여기서 계산하지 않습니다."}]},
  wire: {path:"hyperliquid-python-sdk/hyperliquid/utils/signing.py",code:signing,highlight:[505,527],lang:"python",desc:"p와 s는 전송용 문자열, a는 자산 번호입니다. 사람이 읽는 주문값을 wire format으로 바꾸는 공개 코드입니다.",annotations:[{lines:[505,516],color:"sky",note:"사례의 가격50000과 수량0.1을 p와 s에 담습니다. reduce_only는 별도 필드입니다."},{lines:[519,527],color:"emerald",note:"하나 이상의 wire 주문을 type=order action으로 묶습니다."}]},
  status: {path:"hyperliquid-python-sdk/examples/basic_order.py",code:example,highlight:[22,38],lang:"python",desc:"원본 예제는 testnet ETH 0.2·1100 주문입니다. 사례의 BTC 주문과 숫자는 다르지만 ok→resting→oid조회→취소라는 상태 확인 구조를 비교합니다.",annotations:[{lines:[22,31],color:"sky",note:"ok 응답 안의 resting을 검사한 뒤 oid로 조회합니다. ok만으로 체결을 뜻하지 않습니다."},{lines:[33,38],color:"amber",note:"아직 대기 중인 주문의 oid를 취소에 사용합니다. 체결 이력은 별도로 확인해야 합니다."}]},
};
