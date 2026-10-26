import type { CodeRef } from "@/components/code/types";
import addressSrc from "./codebase/alloy-primitives/address.rs?raw";
import keccakSrc from "./codebase/alloy-primitives/keccak.rs?raw";
import bloomSrc from "./codebase/alloy-primitives/bloom.rs?raw";

export const keccakBloomCodeRefs: Record<string, CodeRef> = {
  "keccak-hash": {
    path: "alloy-primitives/src/utils/mod.rs",
    lang: "rust",
    highlight: [1, 28],
    desc: "문제: 임의 길이 바이트를 항상 32바이트 결과로 바꿔야 합니다. 해결: keccak256이 선택된 backend를 호출해 B256을 반환합니다.",
    annotations: [
      { lines: [4, 8], color: "sky", note: "입력 slice를 backend 구현에 전달" },
      { lines: [15, 23], color: "emerald", note: "backend가 32바이트 출력을 채움" },
      { lines: [26, 27], color: "violet", note: "초기화된 B256을 반환" },
    ],
    code: keccakSrc,
  },
  "address-create": {
    path: "alloy-primitives/src/bits/address.rs",
    lang: "rust",
    highlight: [12, 43],
    desc: "문제: sender와 nonce에서 모든 구현이 같은 계약 주소를 계산해야 합니다. 해결: 고정 RLP 바이트를 해시하고 마지막 20바이트를 Address로 취합니다.",
    annotations: [
      { lines: [25, 39], color: "amber", note: "목록 header·주소·nonce를 같은 순서로 기록" },
      { lines: [41, 42], color: "rose", note: "Keccak-256 뒤 digest[12..32]를 Address로 사용" },
    ],
    code: addressSrc,
  },
  "bloom-accrue": {
    path: "alloy-primitives/src/bits/bloom.rs",
    lang: "rust",
    highlight: [18, 30],
    desc: "문제: 주소나 topic을 2,048비트 표식으로 줄여야 합니다. 해결: digest의 앞 세 2바이트 쌍에서 11비트 위치를 골라 켭니다.",
    annotations: [
      { lines: [19, 22], color: "sky", note: "입력을 먼저 Keccak digest로 변환" },
      { lines: [25, 29], color: "rose", note: "세 위치를 계산해 대응 bit를 설정" },
    ],
    code: bloomSrc,
  },
  "bloom-contains": {
    path: "alloy-primitives/src/bits/bloom.rs",
    lang: "rust",
    highlight: [7, 16],
    desc: "문제: Bloom의 양성 결과를 실제 포함으로 오해하면 안 됩니다. 해결: API 문서와 검사 코드가 false positive 가능성을 명시합니다.",
    annotations: [
      { lines: [7, 11], color: "amber", note: "양성은 possible superset이며 오탐 가능" },
      { lines: [13, 16], color: "emerald", note: "같은 세 bit가 모두 켜졌는지만 검사" },
    ],
    code: bloomSrc,
  },
};
