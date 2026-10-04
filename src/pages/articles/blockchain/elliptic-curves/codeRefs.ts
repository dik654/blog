import pairingSource from "./codebase/pairing.rs?raw";
import type { CodeRef, FileNode } from "@/components/code/types";
import source0 from "./codebase/affine.rs?raw";
import source1 from "./codebase/group.rs?raw";
import source2 from "./codebase/scalar_mul.rs?raw";
import source3 from "./codebase/g1.rs?raw";
import source4 from "./codebase/g2.rs?raw";
import source5 from "./codebase/sw.rs?raw";
import source6 from "./verification/main.rs?raw";
export const codeRefs: Record<string, CodeRef> = {
 pairing:{code:pairingSource,path:"ark/pairing.rs",highlight:[181,210],lang:"rust",desc:"PairingOutput의 zero는 내부 필드의 one입니다. 결과 군의 곱을 덧셈 인터페이스로 노출합니다.",annotations:[{lines:[181,210],color:"sky",note:"is_zero가 TargetField::is_one으로 연결됩니다."}]},
  "construct": {
    "code": source0,
    "path": "ark/affine.rs",
    "highlight": [
      63,
      89
    ],
    "lang": "rust",
    "desc": "new는 곡선과 부분군을 검사하지만 new_unchecked는 둘 다 생략합니다.",
    "annotations": [
      {
        "lines": [
          63,
          89
        ],
        "color": "sky",
        "note": "new는 곡선과 부분군을 검사하지만 new_unchecked는 둘 다 생략합니다."
      }
    ]
  },
  "normalize": {
    "code": source0,
    "path": "ark/affine.rs",
    "highlight": [
      330,
      351
    ],
    "lang": "rust",
    "desc": "(3,8,2)에서 z 역원 9, 제곱 13, 세제곱 15를 써서 (5,1)을 복원합니다.",
    "annotations": [
      {
        "lines": [
          330,
          351
        ],
        "color": "sky",
        "note": "(3,8,2)에서 z 역원 9, 제곱 13, 세제곱 15를 써서 (5,1)을 복원합니다."
      }
    ]
  },
  "double": {
    "code": source1,
    "path": "ark/group.rs",
    "highlight": [
      226,
      267
    ],
    "lang": "rust",
    "desc": "a=2인 실제 분기입니다. XX=8, YY=1, S=3, M=9에서 (7,7,2)를 얻습니다.",
    "annotations": [
      {
        "lines": [
          226,
          267
        ],
        "color": "sky",
        "note": "a=2인 실제 분기입니다. XX=8, YY=1, S=3, M=9에서 (7,7,2)를 얻습니다."
      }
    ]
  },
  "scalar": {
    "code": source2,
    "path": "ark/scalar_mul.rs",
    "highlight": [
      28,
      44
    ],
    "lang": "rust",
    "desc": "7의 세 비트마다 두 배와 더하기를 수행합니다. 초기 항등원도 첫 두 배 호출을 거칩니다.",
    "annotations": [
      {
        "lines": [
          28,
          44
        ],
        "color": "sky",
        "note": "7의 세 비트마다 두 배와 더하기를 수행합니다. 초기 항등원도 첫 두 배 호출을 거칩니다."
      }
    ]
  },
  "validate": {
    "code": source0,
    "path": "ark/affine.rs",
    "highlight": [
      371,
      380
    ],
    "lang": "rust",
    "desc": "곡선 검사와 그 곡선 위라는 가정 아래의 부분군 검사를 함께 수행합니다. 항등원 금지는 별도 정책입니다.",
    "annotations": [
      {
        "lines": [
          371,
          380
        ],
        "color": "sky",
        "note": "곡선 검사와 그 곡선 위라는 가정 아래의 부분군 검사를 함께 수행합니다. 항등원 금지는 별도 정책입니다."
      }
    ]
  },
  "g1": {
    "code": source3,
    "path": "ark/g1.rs",
    "highlight": [
      16,
      55
    ],
    "lang": "rust",
    "desc": "G1의 cofactor는 1입니다. 부분군 보조 함수의 true는 먼저 곡선 위임을 확인했다는 가정이 필요합니다.",
    "annotations": [
      {
        "lines": [
          16,
          55
        ],
        "color": "sky",
        "note": "G1의 cofactor는 1입니다. 부분군 보조 함수의 true는 먼저 곡선 위임을 확인했다는 가정이 필요합니다."
      }
    ]
  },
  "g2": {
    "code": source4,
    "path": "ark/g2.rs",
    "highlight": [
      16,
      65
    ],
    "lang": "rust",
    "desc": "G2는 더 큰 twist의 부분군입니다. 고정 구현은 p제곱 사상과 6X²배의 일치를 검사합니다.",
    "annotations": [
      {
        "lines": [
          16,
          65
        ],
        "color": "sky",
        "note": "G2는 더 큰 twist의 부분군입니다. 고정 구현은 p제곱 사상과 6X²배의 일치를 검사합니다."
      }
    ]
  },
  "encoding": {
    "code": source5,
    "path": "ark/sw.rs",
    "highlight": [
      114,
      182
    ],
    "lang": "rust",
    "desc": "Ark의 flag와 필드 직렬화 규칙입니다. SEC 1이나 EIP의 전송 바이트 형식과 같다고 가정하지 않습니다.",
    "annotations": [
      {
        "lines": [
          114,
          182
        ],
        "color": "sky",
        "note": "Ark의 flag와 필드 직렬화 규칙입니다. SEC 1이나 EIP의 전송 바이트 형식과 같다고 가정하지 않습니다."
      }
    ]
  },
  "experiment": {
    "code": source6,
    "path": "check/main.rs",
    "highlight": [
      1,
      51
    ],
    "lang": "rust",
    "desc": "이 글의 실제 실행입니다. 작은 곡선 361쌍, 잘못된 G2, 단순 EIP-196 입력 모형, 전체 페어링 관계를 구분합니다.",
    "annotations": [
      {
        "lines": [
          1,
          51
        ],
        "color": "sky",
        "note": "이 글의 실제 실행입니다. 작은 곡선 361쌍, 잘못된 G2, 단순 EIP-196 입력 모형, 전체 페어링 관계를 구분합니다."
      }
    ]
  }
};
export const fileTrees: Record<string, FileNode> = {
  "ark": {
    "name": "고정 원문과 실행 사례",
    "type": "dir",
    "children": [{"name":"pairing.rs","type":"file","path":"ark/pairing.rs","codeKey":"pairing"},
      {
        "name": "affine.rs",
        "type": "file",
        "path": "ark/affine.rs",
        "codeKey": "construct"
      },
      {
        "name": "group.rs",
        "type": "file",
        "path": "ark/group.rs",
        "codeKey": "double"
      },
      {
        "name": "scalar_mul.rs",
        "type": "file",
        "path": "ark/scalar_mul.rs",
        "codeKey": "scalar"
      },
      {
        "name": "g1.rs",
        "type": "file",
        "path": "ark/g1.rs",
        "codeKey": "g1"
      },
      {
        "name": "g2.rs",
        "type": "file",
        "path": "ark/g2.rs",
        "codeKey": "g2"
      },
      {
        "name": "sw.rs",
        "type": "file",
        "path": "ark/sw.rs",
        "codeKey": "encoding"
      },
      {
        "name": "main.rs",
        "type": "file",
        "path": "check/main.rs",
        "codeKey": "experiment"
      }
    ]
  }
};
