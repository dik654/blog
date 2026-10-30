import type { CodeRef } from "@/components/code/types";

import contract from "./codebase/commonware/broadcast_traits.rs?raw";
import ingress from "./codebase/commonware/buffered_ingress.rs?raw";
import engine from "./codebase/commonware/buffered_engine.rs?raw";
import cache from "./codebase/commonware/buffered_cache.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "broadcast-contract": {
    path: "actor/src/lib.rs · broadcast/src/lib.rs",
    code: contract,
    lang: "rust",
    highlight: [4, 27],
    desc: "Feedback와 Broadcaster 경계 — v2026.9.0의 두 공식 파일을 연결하고 한국어 설명 주석을 붙였습니다.",
    annotations: [
      { lines: [4, 18], color: "sky", note: "Ok·Backoff·Closed는 bounded local endpoint의 상태입니다." },
      { lines: [22, 27], color: "emerald", note: "Broadcaster는 recipients와 Codec message를 받고 local Feedback을 반환합니다." },
    ],
  },
  "buffered-ingress": {
    path: "broadcast/src/buffered/ingress.rs",
    code: ingress,
    lang: "rust",
    highlight: [2, 25],
    desc: "Buffered Mailbox API — subscribe, get, broadcast_shared의 v2026.9.0 구현에 한국어 설명 주석을 붙였습니다.",
    annotations: [
      { lines: [4, 10], color: "sky", note: "subscribe는 cached item 또는 미래 도착을 기다립니다." },
      { lines: [13, 17], color: "amber", note: "get은 현재 cache만 조회하고 기다리지 않습니다." },
      { lines: [20, 25], color: "emerald", note: "broadcast_shared는 local mailbox에 command를 enqueue합니다." },
    ],
  },
  "buffered-engine": {
    path: "broadcast/src/buffered/engine.rs",
    code: engine,
    lang: "rust",
    highlight: [3, 54],
    desc: "Buffered Engine event loop와 send path — v2026.9.0 핵심 구현을 한국어 설명 주석과 함께 발췌했습니다.",
    annotations: [
      { lines: [3, 22], color: "sky", note: "Local mailbox command는 같은 actor loop에서 처리합니다." },
      { lines: [24, 43], color: "rose", note: "Network frame은 decode에 성공해야 handle_network로 갑니다." },
      { lines: [46, 54], color: "emerald", note: "Local cache insert 뒤 send_ref를 호출하며 remote ack를 기다리지 않습니다." },
    ],
  },
  "buffered-cache": {
    path: "broadcast/src/buffered/engine.rs",
    code: cache,
    lang: "rust",
    highlight: [2, 60],
    desc: "Waiter와 bounded shared cache — v2026.9.0 insert_message·insert_cache_entry의 핵심 구현입니다.",
    annotations: [
      { lines: [7, 14], color: "sky", note: "Waiter는 cache residence 판정보다 먼저 응답받을 수 있습니다." },
      { lines: [23, 26], color: "rose", note: "Latest primary 밖의 sender는 resident cache entry를 만들 수 없습니다." },
      { lines: [33, 40], color: "amber", note: "같은 peer의 duplicate digest는 reference를 추가하지 않습니다." },
      { lines: [42, 58], color: "emerald", note: "Peer reference count가 0이 될 때 shared item을 제거합니다." },
    ],
  },
};
