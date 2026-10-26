import type { CodeRef } from "@/components/code/types";
import addressSrc from "./codebase/alloy-primitives/address.rs?raw";
import aliasesSrc from "./codebase/alloy-primitives/aliases.rs?raw";
import fixedSrc from "./codebase/alloy-primitives/fixed.rs?raw";
import uintSrc from "./codebase/ruint/uint.rs?raw";
import addSrc from "./codebase/ruint/add.rs?raw";

export const primCodeRefs: Record<string, CodeRef> = {
  "primitives-addr": {
    path: "alloy-primitives/src/bits/address.rs",
    lang: "rust",
    highlight: [3, 10],
    desc: "문제: 임의의 20바이트와 Ethereum 주소를 구분해야 합니다. 해결: Address를 FixedBytes<20>과 분리된 타입으로 선언합니다.",
    annotations: [
      { lines: [6, 9], color: "sky", note: "주소 의미를 가진 20바이트 타입" },
    ],
    code: addressSrc,
  },
  "primitives-u256": {
    path: "alloy-primitives/src/aliases.rs",
    lang: "rust",
    highlight: [3, 12],
    desc: "문제: 256비트 숫자의 폭과 내부 word 수를 함께 고정해야 합니다. 해결: U256을 Uint<256, 4>의 별칭으로 만듭니다.",
    annotations: [
      { lines: [5, 6], color: "amber", note: "비트 수와 limb 수를 타입에 넣음" },
      { lines: [10, 12], color: "violet", note: "U256은 64비트 limb 네 개" },
    ],
    code: aliasesSrc,
  },
  "fixed-bytes-struct": {
    path: "alloy-primitives/src/bits/fixed.rs",
    lang: "rust",
    highlight: [1, 18],
    desc: "문제: 길이가 다른 slice가 고정 폭 값으로 들어오면 안 됩니다. 해결: [u8; N]을 감싸고 TryFrom 경계에서 길이를 검사합니다.",
    annotations: [
      { lines: [6, 7], color: "violet", note: "내부 저장 공간은 정확히 N바이트" },
      { lines: [11, 17], color: "rose", note: "slice 길이가 N일 때만 생성" },
    ],
    code: fixedSrc,
  },
  "fixed-bytes-addr": {
    path: "alloy-primitives/src/bits/address.rs",
    lang: "rust",
    highlight: [3, 10],
    desc: "문제: 같은 폭의 바이트라도 주소 전용 동작이 필요합니다. 해결: Address를 별도 wrapper type으로 둡니다.",
    annotations: [
      { lines: [6, 9], color: "sky", note: "Address 전용 20바이트 wrapper" },
    ],
    code: addressSrc,
  },
  "u256-limbs": {
    path: "ruint/src/lib.rs",
    lang: "rust",
    highlight: [1, 20],
    desc: "문제: 256비트 값을 CPU word 여러 개로 계산해야 합니다. 해결: Uint는 낮은 limb부터 [u64; LIMBS]에 보관합니다.",
    annotations: [
      { lines: [4, 6], color: "amber", note: "LIMBS개의 u64 배열" },
      { lines: [13, 20], color: "violet", note: "배열 순서는 least significant first" },
    ],
    code: uintSrc,
  },
  "u256-overflowing": {
    path: "ruint/src/add.rs",
    lang: "rust",
    highlight: [12, 27],
    desc: "문제: 마지막 64비트 word를 넘은 carry를 잃으면 안 됩니다. 해결: carry를 네 limb에 전파하고 overflow를 별도로 반환합니다.",
    annotations: [
      { lines: [19, 23], color: "rose", note: "낮은 limb의 carry를 다음 limb로 전달" },
      { lines: [25, 26], color: "emerald", note: "값과 overflow 여부를 함께 반환" },
    ],
    code: addSrc,
  },
};
