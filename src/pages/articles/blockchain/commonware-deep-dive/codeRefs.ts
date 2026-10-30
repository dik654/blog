import type { CodeRef } from "@/components/code/types";
import wiringRaw from "./codebase/commonware/examples/bridge/src/bin/validator_wiring.rs?raw";
import proposeRaw from "./codebase/commonware/examples/bridge/src/application/propose.rs?raw";
import verifyReportRaw from "./codebase/commonware/examples/bridge/src/application/verify_report.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "bridge-wiring": {
    path: "examples/bridge/src/bin/validator.rs — runtime·network·application·Simplex wiring",
    lang: "rust",
    code: wiringRaw,
    highlight: [4, 49],
    desc: "하나의 Runtime Context에서 indexer 연결, 인증 P2P, 세 consensus channel, Application mailbox와 Simplex Engine을 조립합니다.",
    annotations: [
      { lines: [4, 10], color: "sky", note: "Indexer는 P2P consensus channel과 별도 encrypted stream으로 연결됩니다." },
      { lines: [12, 19], color: "emerald", note: "인증 P2P는 vote·certificate·resolver traffic을 서로 다른 channel로 나눕니다." },
      { lines: [21, 39], color: "amber", note: "같은 Application mailbox가 Simplex의 propose·relay·report 경계가 됩니다." },
      { lines: [41, 49], color: "violet", note: "Network와 Engine을 시작한 뒤 Application actor의 mailbox loop가 계속 실행됩니다." },
    ],
  },
  "bridge-propose": {
    path: "examples/bridge/src/application/actor.rs — Message::Propose excerpt",
    lang: "rust",
    code: proposeRaw,
    highlight: [4, 34],
    desc: "Application은 full block을 indexer에 먼저 보관하고 Success(true)를 받은 경우에만 digest를 Simplex에 반환합니다.",
    annotations: [
      { lines: [4, 8], color: "sky", note: "이 글은 source가 허용하는 Random block 하나를 추적합니다. 화면의 값 42는 설명용 가정입니다." },
      { lines: [10, 18], color: "emerald", note: "합의에 넘길 digest를 만들되 full block은 PutBlock 메시지로 indexer에 보냅니다." },
      { lines: [20, 31], color: "amber", note: "Indexer 응답이 false면 현재 proposal을 계속하지 않습니다." },
      { lines: [33, 34], color: "violet", note: "저장 확인 뒤에만 digest가 consensus response channel로 넘어갑니다." },
    ],
  },
  "bridge-verify-report": {
    path: "examples/bridge/src/application/actor.rs — Message::Verify·Finalization excerpt",
    lang: "rust",
    code: verifyReportRaw,
    highlight: [4, 50],
    desc: "Digest 검증은 indexer에서 full block을 다시 읽어 수행하고, Simplex finalization은 별도 PutFinalization으로 기록합니다.",
    annotations: [
      { lines: [4, 20], color: "sky", note: "GetBlock이 block을 돌려주지 못하면 Application은 verify=false를 반환합니다." },
      { lines: [22, 35], color: "emerald", note: "Random block은 존재하면 true이며, Bridge block은 외부 network certificate를 실제로 검증합니다." },
      { lines: [38, 50], color: "violet", note: "Finalization certificate의 indexer 기록은 block 저장과 다른 메시지·응답 경계입니다." },
    ],
  },
};
