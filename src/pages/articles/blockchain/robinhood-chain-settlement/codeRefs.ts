import type { CodeRef } from "@/components/code/types";
import nitro from "./codebase/arbitrum-sdk/packages/sdk/src/lib/message/ChildToParentMessageNitro.ts?raw";

export const codeRefs: Record<string, CodeRef> = {
 status: {code:nitro,"path": "arbitrum-sdk/packages/sdk/src/lib/message/ChildToParentMessageNitro.ts", "highlight": [241, 249], "lang": "typescript", "desc": "cbb96c6. 확정된 send root와 실행 여부를 구별합니다. CONFIRMED는 인출 실행 가능 상태이며 지급 완료 상태가 아닙니다.", "annotations": [{"lines": [241, 248], "color": "sky", "note": "가상 인출5개가 아직 미실행이면 CONFIRMED에 머뭅니다. EXECUTED는 별도로 조회합니다."}]},
 execute: {code:nitro,"path": "arbitrum-sdk/packages/sdk/src/lib/message/ChildToParentMessageNitro.ts", "highlight": [774, 806], "lang": "typescript", "desc": "상태 확인 뒤 outbox proof와 동일 메시지 자료를 L1 실행에 전달합니다. 네트워크 설정은 실제 배포와 대조해야 합니다.", "annotations": [{"lines": [778, 790], "color": "amber", "note": "5개 메시지가 실행 가능한지 검사하고 해당 네트워크 outbox와 proof를 구합니다."}, {"lines": [792, 804], "color": "emerald", "note": "동일한 position·destination·callvalue·data를 넘겨 L1 거래를 만듭니다. 거래 영수증 성공은 별도로 확인합니다."}]},
};
