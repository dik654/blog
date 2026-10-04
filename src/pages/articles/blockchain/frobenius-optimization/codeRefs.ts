import type { CodeRef, FileNode } from "@/components/code/types";
import source0 from "./verification/main.rs?raw";
import source1 from "./codebase/quadratic_extension.rs?raw";
import source2 from "./codebase/fp.rs?raw";
import source3 from "./codebase/fp2.rs?raw";
import source4 from "./codebase/cubic_extension.rs?raw";
import source5 from "./codebase/fp12_2over3over2.rs?raw";
import source6 from "./codebase/field.rs?raw";
import source7 from "./codebase/fq12.rs?raw";
export const codeRefs: Record<string, CodeRef> = {
  "experiment": {
    "code": source0,
    "path": "check/main.rs",
    "highlight": [
      1,
      78
    ],
    "lang": "rust",
    "desc": "직접 작성해 실행한 검증입니다. 아홉 F₉ 값과 81쌍, 기저 변경, BN254의 일반 지수 분해를 확인합니다. 전체 페어링과 최적 addition chain 및 시간 측정은 실행하지 않았습니다.",
    "annotations": [
      {
        "lines": [
          1,
          78
        ],
        "color": "sky",
        "note": "직접 작성해 실행한 검증입니다. 아홉 F₉ 값과 81쌍, 기저 변경, BN254의 일반 지수 분해를 확인합니다. 전체 페어링과 최적 addition chain 및 시간 측정은 실행하지 않았습니다."
      }
    ]
  },
  "quad": {
    "code": source1,
    "path": "ark/quadratic_extension.rs",
    "highlight": [
      353,
      357
    ],
    "lang": "rust",
    "desc": "아래 체의 c0와 c1에 Frobenius를 먼저 적용한 뒤 c1의 위층 배율을 곱합니다.",
    "annotations": [
      {
        "lines": [
          353,
          357
        ],
        "color": "sky",
        "note": "아래 체의 c0와 c1에 Frobenius를 먼저 적용한 뒤 c1의 위층 배율을 곱합니다."
      }
    ]
  },
  "prime": {
    "code": source2,
    "path": "ark/fp.rs",
    "highlight": [
      318,
      322
    ],
    "lang": "rust",
    "desc": "소수체에서는 각 원소의 p제곱이 자기 자신입니다. 이 함수는 값을 변경하지 않습니다.",
    "annotations": [
      {
        "lines": [
          318,
          322
        ],
        "color": "sky",
        "note": "소수체에서는 각 원소의 p제곱이 자기 자신입니다. 이 함수는 값을 변경하지 않습니다."
      }
    ]
  },
  "fp2": {
    "code": source3,
    "path": "ark/fp2.rs",
    "highlight": [
      88,
      95
    ],
    "lang": "rust",
    "desc": "power를 전체 차수 2로 나눈 나머지로 표를 고릅니다. 작은 설정의 power=1은 배율 2입니다.",
    "annotations": [
      {
        "lines": [
          88,
          95
        ],
        "color": "sky",
        "note": "power를 전체 차수 2로 나눈 나머지로 표를 고릅니다. 작은 설정의 power=1은 배율 2입니다."
      }
    ]
  },
  "cubic": {
    "code": source4,
    "path": "ark/cubic_extension.rs",
    "highlight": [
      326,
      332
    ],
    "lang": "rust",
    "desc": "세 개의 아래 계수에도 각각 Frobenius를 적용합니다. Fq2인 c0는 항상 고정된 값이 아닙니다.",
    "annotations": [
      {
        "lines": [
          326,
          332
        ],
        "color": "sky",
        "note": "세 개의 아래 계수에도 각각 Frobenius를 적용합니다. Fq2인 c0는 항상 고정된 값이 아닙니다."
      }
    ]
  },
  "fp12": {
    "code": source5,
    "path": "ark/fp12_2over3over2.rs",
    "highlight": [
      40,
      59
    ],
    "lang": "rust",
    "desc": "전체 차수 12를 사용해 표를 고릅니다. 아래 Fq6를 처리한 뒤 Fq2 배율을 적용합니다.",
    "annotations": [
      {
        "lines": [
          40,
          59
        ],
        "color": "sky",
        "note": "전체 차수 12를 사용해 표를 고릅니다. 아래 Fq6를 처리한 뒤 Fq2 배율을 적용합니다."
      }
    ]
  },
  "pow": {
    "code": source6,
    "path": "ark/field.rs",
    "highlight": [
      319,
      330
    ],
    "lang": "rust",
    "desc": "결과 1부터 시작해 첫 1비트도 제곱·곱합니다. 254비트·1비트 111개인 p에는 제곱 호출 254회와 곱 호출 111회가 대응합니다.",
    "annotations": [
      {
        "lines": [
          319,
          330
        ],
        "color": "sky",
        "note": "결과 1부터 시작해 첫 1비트도 제곱·곱합니다. 254비트·1비트 111개인 p에는 제곱 호출 254회와 곱 호출 111회가 대응합니다."
      }
    ]
  },
  "table12": {
    "code": source7,
    "path": "ark/fq12.rs",
    "highlight": [
      15,
      88
    ],
    "lang": "rust",
    "desc": "BN254의 열두 배율을 보존한 원문입니다. index 6의 배율 −1이 위층의 켤레에 대응합니다.",
    "annotations": [
      {
        "lines": [
          15,
          88
        ],
        "color": "sky",
        "note": "BN254의 열두 배율을 보존한 원문입니다. index 6의 배율 −1이 위층의 켤레에 대응합니다."
      }
    ]
  }
};
export const fileTrees: Record<string, FileNode> = {
  "check": {
    "name": "이 글의 실제 검증 프로그램",
    "type": "dir",
    "children": [
      {
        "name": "main.rs",
        "type": "file",
        "path": "check/main.rs",
        "codeKey": "experiment"
      }
    ]
  },
  "ark": {
    "name": "arkworks · 7ad88c46 고정 원문",
    "type": "dir",
    "children": [
      {
        "name": "quadratic_extension.rs",
        "type": "file",
        "path": "ark/quadratic_extension.rs",
        "codeKey": "quad"
      },
      {
        "name": "fp.rs",
        "type": "file",
        "path": "ark/fp.rs",
        "codeKey": "prime"
      },
      {
        "name": "fp2.rs",
        "type": "file",
        "path": "ark/fp2.rs",
        "codeKey": "fp2"
      },
      {
        "name": "cubic_extension.rs",
        "type": "file",
        "path": "ark/cubic_extension.rs",
        "codeKey": "cubic"
      },
      {
        "name": "fp12_2over3over2.rs",
        "type": "file",
        "path": "ark/fp12_2over3over2.rs",
        "codeKey": "fp12"
      },
      {
        "name": "field.rs",
        "type": "file",
        "path": "ark/field.rs",
        "codeKey": "pow"
      },
      {
        "name": "fq12.rs",
        "type": "file",
        "path": "ark/fq12.rs",
        "codeKey": "table12"
      }
    ]
  }
};
