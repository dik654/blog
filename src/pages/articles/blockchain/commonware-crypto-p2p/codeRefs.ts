import type { CodeRef } from "@/components/code/types";

import handshake from "./codebase/commonware/handshake_flow.rs?raw";
import encrypted from "./codebase/commonware/encrypted_connection.rs?raw";
import channels from "./codebase/commonware/channel_registration.rs?raw";
import delivery from "./codebase/commonware/delivery_path.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "handshake-flow": {
    path: "cryptography/src/handshake.rs",
    code: handshake,
    lang: "rust",
    highlight: [3, 87],
    desc: "Syn 생성, SynAck 검증, 방향별 cipher와 마지막 Ack confirmation의 v2026.9.0 핵심 구현입니다.",
    annotations: [
      { lines: [3, 34], color: "sky", note: "Dialer는 시각·상대 identity·ephemeral key를 transcript에 commit한 뒤 Syn을 만듭니다." },
      { lines: [48, 69], color: "rose", note: "SynAck timestamp, signature, shared secret과 listener confirmation을 모두 검증합니다." },
      { lines: [72, 87], color: "emerald", note: "양쪽 confirmation이 맞아야 방향별 send·receive cipher가 공개됩니다." },
    ],
  },
  "encrypted-listener": {
    path: "stream/src/encrypted.rs",
    code: encrypted,
    lang: "rust",
    highlight: [3, 40],
    desc: "Handshake 시각 범위와 listener의 static-key bouncer부터 Ack 검증까지 이어지는 v2026.9.0 경로입니다.",
    annotations: [
      { lines: [3, 11], color: "amber", note: "오래된 handshake 하한과 미래 clock-skew 상한을 half-open range로 만듭니다." },
      { lines: [16, 19], color: "rose", note: "Static public key가 bouncer를 통과해야 Syn을 읽습니다." },
      { lines: [22, 40], color: "emerald", note: "Syn과 Ack까지 검증한 뒤에만 peer와 encrypted stream을 반환합니다." },
    ],
  },
  "channel-registration": {
    path: "p2p/src/authenticated/channels.rs",
    code: channels,
    lang: "rust",
    highlight: [3, 48],
    desc: "Channel별 bounded inbox 계산, Receiver 반환값과 공식 overflow test를 연결한 v2026.9.0 발췌입니다.",
    annotations: [
      { lines: [3, 27], color: "sky", note: "Channel inbox capacity는 max peers와 peer별 quota burst의 곱입니다." },
      { lines: [30, 33], color: "emerald", note: "Application은 sender public key와 decrypted bytes를 함께 받습니다." },
      { lines: [36, 48], color: "rose", note: "용량 네 건이 찬 뒤 다섯 번째 새 enqueue는 Unreliable::Rejected입니다." },
    ],
  },
  "delivery-path": {
    path: "p2p/src/authenticated/router · lookup peer actor",
    code: delivery,
    lang: "rust",
    highlight: [3, 47],
    desc: "Local router admission, connected relay 선택, Bob의 decode·channel·rate 검사와 non-blocking inbox enqueue 경로입니다.",
    annotations: [
      { lines: [3, 16], color: "amber", note: "Router 시작 전 Ok는 recipient receipt가 아니며, 시작 뒤에는 bounded local mailbox에 넣습니다." },
      { lines: [20, 23], color: "rose", note: "Connected relay의 enqueue 결과는 최초 caller에게 remote acknowledgement로 돌아가지 않습니다." },
      { lines: [28, 47], color: "emerald", note: "Bob은 decode·channel·peer rate를 확인한 뒤 application inbox에 non-blocking enqueue합니다." },
    ],
  },
};
