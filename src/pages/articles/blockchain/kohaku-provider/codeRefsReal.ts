import type { CodeRef } from "@/components/code/types";
import providerTs from "./codebase/kohaku-alpha13/provider.ts?raw";
import heliosTs from "./codebase/kohaku-alpha13/helios-index.ts?raw";
import rawTs from "./codebase/kohaku-alpha13/raw-index.ts?raw";
import waitTs from "./codebase/kohaku-alpha13/wait.ts?raw";

const PINNED = "ethereum/kohaku @kohaku-eth/provider 0.1.0-alpha.13 · commit b4ad096e";

export const kohakuProviderCodeRefs: Record<string, CodeRef> = {
  "kohaku-provider-interface": {
    path: "kohaku@provider-0.1.0-alpha.13/packages/provider/src/provider.ts",
    code: providerTs,
    lang: "typescript",
    highlight: [9, 92],
    desc: `질문: 공통 Provider가 읽기·요청과 서명 권한을 어디에서 나눕니까?\n\n근거: ${PINNED}는 EthereumProvider에 조회·call·gas·raw request를 두고, signMessage·sendTransaction·getAddress는 별도 TxSigner에 둡니다. Type 분리는 권한 주입 경계를 표현하지만 runtime에서 키 보관·사용자 승인을 강제하지는 않습니다.`,
    annotations: [
      { lines: [9, 20], color: "sky", note: "EthereumProvider의 공통 조회 표면과 getLogs 반환 타입입니다." },
      { lines: [27, 70], color: "emerald", note: "Receipt·call·gas·nonce를 같은 인터페이스에서 요청합니다." },
      { lines: [77, 91], color: "amber", note: "서명과 전송 권한은 별도 TxSigner 계약에 있습니다." },
    ],
  },
  "kohaku-helios-route": {
    path: "kohaku@provider-0.1.0-alpha.13/packages/provider/src/helios/index.ts",
    code: heliosTs,
    lang: "typescript",
    highlight: [7, 59],
    desc: `질문: Helios-backed getLogs는 언제 light client를 지나고 언제 execution RPC로 직행합니까?\n\n근거: ${PINNED}에서 bypassLogs=false가 기본이며 provider는 Helios client를 사용합니다. true이면 eth_getLogs만 executionRpc로 fetch하고 다른 메서드는 client.request로 보냅니다. 두 경로는 같은 raw adapter 뒤에서 TxLog[]로 정규화되지만 출처는 같지 않습니다.`,
    annotations: [
      { lines: [7, 28], color: "rose", note: "bypass가 켜지면 eth_getLogs만 execution RPC로 직접 보냅니다." },
      { lines: [36, 40], color: "amber", note: "소스 주석은 기본 경로와 8,191-block 범위·속도 경계를 명시합니다." },
      { lines: [43, 50], color: "sky", note: "executionRpc를 요구하고 Helios sync가 끝날 때까지 adapter 반환을 기다립니다." },
      { lines: [52, 58], color: "emerald", note: "bypass flag가 실제 request provider를 결정한 뒤 공통 raw adapter로 감쌉니다." },
    ],
  },
  "kohaku-raw-normalize": {
    path: "kohaku@provider-0.1.0-alpha.13/packages/provider/src/raw/index.ts",
    code: rawTs,
    lang: "typescript",
    highlight: [28, 137],
    desc: `질문: 서로 다른 backend 응답은 어느 지점에서 공통 TxLog·TransactionReceipt가 됩니까?\n\n근거: ${PINNED}의 raw adapter는 eth_getLogs 결과를 convertLog에 넣고 blockNumber·logIndex를 number 계열로 바꿉니다. Receipt도 status·gasUsed·logs를 공통 타입으로 바꿉니다. 이 변환은 값의 표현을 맞출 뿐, 응답이 어느 검증 경로를 지났는지는 반환 타입에 보존하지 않습니다.`,
    annotations: [
      { lines: [28, 38], color: "sky", note: "eth_getLogs 호출과 TxLog[] 변환이 같은 adapter 안에서 이어집니다." },
      { lines: [109, 130], color: "emerald", note: "RPC log의 hex 숫자와 선택적 logIndex를 공통 타입으로 바꿉니다." },
      { lines: [132, 137], color: "violet", note: "Receipt status·gas·logs도 같은 방식으로 정규화합니다." },
    ],
  },
  "kohaku-receipt-wait": {
    path: "kohaku@provider-0.1.0-alpha.13/packages/provider/src/raw/wait.ts",
    code: waitTs,
    lang: "typescript",
    highlight: [1, 76],
    desc: `질문: waitForTransaction은 무엇을 기다리고 timeout 뒤 무엇을 멈춥니까?\n\n근거: ${PINNED}의 shared loop는 기본 100ms 간격·10초 예산을 쓰고, receipt가 보이면 끝납니다. 전체 deadline에는 지연된 RPC 시간이 포함되며 helper timer와 후속 poll은 멈추지만 이미 진행 중인 RPC 요청은 취소하지 못합니다. Receipt 존재는 포함을 뜻할 뿐 execution success·confirmations·finality를 뜻하지 않습니다.`,
    annotations: [
      { lines: [1, 28], color: "sky", note: "Polling 간격·전체 timeout 기본값과 입력 검증입니다." },
      { lines: [35, 50], color: "amber", note: "전체 deadline을 별도 timer로 걸어 stalled request도 기다림을 끝냅니다." },
      { lines: [52, 66], color: "emerald", note: "한 poll이 끝난 뒤 receipt 여부를 보고 다음 interval을 기다립니다." },
      { lines: [69, 75], color: "rose", note: "성공·오류·timeout 뒤 helper timer를 정리하지만 in-flight RPC를 취소하지는 못합니다." },
    ],
  },
};
