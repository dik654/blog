import type { CodeRef } from "@/components/code/types";
import headerSrc from "./codebase/alloy-rlp/header.rs?raw";
import decodeSrc from "./codebase/alloy-rlp/decode.rs?raw";

export const rlpCodeRefs: Record<string, CodeRef> = {
  "rlp-header": {
    path: "alloy-rlp/src/header.rs",
    lang: "rust",
    highlight: [10, 57],
    desc: "문제: 첫 바이트가 가리키는 종류와 길이가 표준 표현인지 확인해야 합니다. 해결: Header::decode가 prefix별 길이와 남은 payload를 검사합니다.",
    annotations: [
      { lines: [16, 24], color: "sky", note: "한 바이트와 짧은 문자열을 구분하고 비표준 표현을 거절" },
      { lines: [27, 42], color: "amber", note: "긴 길이의 최소 표현과 범위를 검사" },
      { lines: [52, 56], color: "rose", note: "선언한 payload가 실제 입력 안에 있는지 확인" },
    ],
    code: headerSrc,
  },
  "rlp-decode-exact": {
    path: "alloy-rlp/src/decode.rs",
    lang: "rust",
    highlight: [8, 25],
    desc: "문제: 올바른 값 뒤에 임의 바이트가 붙어도 prefix decoder는 성공할 수 있습니다. 해결: decode_exact가 복원 뒤 남은 입력을 거절합니다.",
    annotations: [
      { lines: [14, 16], color: "sky", note: "객체 하나를 복원하며 입력 slice를 전진" },
      { lines: [18, 22], color: "rose", note: "남은 바이트가 있으면 UnexpectedLength" },
    ],
    code: decodeSrc,
  },
  "rlp-integer": {
    path: "alloy-rlp/src/decode.rs",
    lang: "rust",
    highlight: [27, 52],
    desc: "문제: 정수 1024를 00 04 00처럼 더 길게 적으면 값은 같아도 바이트가 달라집니다. 해결: 정수 decoder가 앞쪽 0을 LeadingZero로 거절합니다.",
    annotations: [
      { lines: [34, 36], color: "amber", note: "목적 타입보다 긴 정수 payload는 Overflow" },
      { lines: [45, 47], color: "rose", note: "불필요한 첫 0바이트는 LeadingZero" },
      { lines: [49, 51], color: "emerald", note: "허용된 payload만 왼쪽을 0으로 채워 숫자로 복원" },
    ],
    code: decodeSrc,
  },
};
