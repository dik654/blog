import type { CodeRef, FileNode } from "@/components/code/types";
import source0 from "./codebase/fp12_2over3over2.rs?raw";
import source1 from "./codebase/fp6_3over2.rs?raw";
import source2 from "./codebase/bn.rs?raw";
import source3 from "./codebase/bn254.rs?raw";
import source4 from "./verification/main.rs?raw";
export const codeRefs: Record<string, CodeRef> = {
  "014": {
    "code": source0,
    "path": "ark/fp12_2over3over2.rs",
    "highlight": [
      93,
      112
    ],
    "lang": "rust",
    "desc": "이번 인자 5·7·0에서는 aa=[5,22,21], bb=0이며 위 출력은 [10,34,28]입니다. c4=11인 별도 변형도 본문에서 추적합니다.",
    "annotations": [
      {
        "lines": [
          93,
          112
        ],
        "color": "sky",
        "note": "이번 인자 5·7·0에서는 aa=[5,22,21], bb=0이며 위 출력은 [10,34,28]입니다. c4=11인 별도 변형도 본문에서 추적합니다."
      }
    ]
  },
  "01": {
    "code": source1,
    "path": "ark/fp6_3over2.rs",
    "highlight": [
      111,
      152
    ],
    "lang": "rust",
    "desc": "두 자리 값과 세 자리 값을 곱하는 함수입니다. 일반 Fq2 곱 다섯 회와 상수 곱·덧셈을 구분합니다.",
    "annotations": [
      {
        "lines": [
          111,
          152
        ],
        "color": "sky",
        "note": "두 자리 값과 세 자리 값을 곱하는 함수입니다. 일반 Fq2 곱 다섯 회와 상수 곱·덧셈을 구분합니다."
      }
    ]
  },
  "1": {
    "code": source1,
    "path": "ark/fp6_3over2.rs",
    "highlight": [
      83,
      109
    ],
    "lang": "rust",
    "desc": "A1=[2,4,0]에 11v를 곱하면 [0,22,44]입니다. 원문의 일반 곱 호출은 세 회입니다.",
    "annotations": [
      {
        "lines": [
          83,
          109
        ],
        "color": "sky",
        "note": "A1=[2,4,0]에 11v를 곱하면 [0,22,44]입니다. 원문의 일반 곱 호출은 세 회입니다."
      }
    ]
  },
  "shift": {
    "code": source0,
    "path": "ark/fp12_2over3over2.rs",
    "highlight": [
      26,
      36
    ],
    "lang": "rust",
    "desc": "v를 곱해 [C0,C1,C2]를 [ξC2,C0,C1]로 옮깁니다. 이번 44ξ=396+44u가 첫 계수에 더해집니다.",
    "annotations": [
      {
        "lines": [
          26,
          36
        ],
        "color": "sky",
        "note": "v를 곱해 [C0,C1,C2]를 [ξC2,C0,C1]로 옮깁니다. 이번 44ξ=396+44u가 첫 계수에 더해집니다."
      }
    ]
  },
  "034": {
    "code": source0,
    "path": "ark/fp12_2over3over2.rs",
    "highlight": [
      70,
      91
    ],
    "lang": "rust",
    "desc": "같은 5·7·11 인자는 5+7w+11vw를 뜻합니다. a=[5,15,0], b=[14,50,44], e=[36,117,77]로 본문에 대응합니다.",
    "annotations": [
      {
        "lines": [
          70,
          91
        ],
        "color": "sky",
        "note": "같은 5·7·11 인자는 5+7w+11vw를 뜻합니다. a=[5,15,0], b=[14,50,44], e=[36,117,77]로 본문에 대응합니다."
      }
    ]
  },
  "ell": {
    "code": source2,
    "path": "ark/bn.rs",
    "highlight": [
      183,
      201
    ],
    "lang": "rust",
    "desc": "M형은 014, D형은 034를 호출합니다. D형의 첫 계수에는 G1의 y, 둘째에는 x를 곱합니다.",
    "annotations": [
      {
        "lines": [
          183,
          201
        ],
        "color": "sky",
        "note": "M형은 014, D형은 034를 호출합니다. D형의 첫 계수에는 G1의 y, 둘째에는 x를 곱합니다."
      }
    ]
  },
  "config": {
    "code": source3,
    "path": "ark/bn254.rs",
    "highlight": [
      15,
      36
    ],
    "lang": "rust",
    "desc": "이 고정 BN254 설정은 D형입니다. 일반 체 산술로 014가 가능하다는 사실과 실제 Miller 선택을 구분합니다.",
    "annotations": [
      {
        "lines": [
          15,
          36
        ],
        "color": "sky",
        "note": "이 고정 BN254 설정은 D형입니다. 일반 체 산술로 014가 가능하다는 사실과 실제 Miller 선택을 구분합니다."
      }
    ]
  },
  "miller": {
    "code": source2,
    "path": "ark/bn.rs",
    "highlight": [
      51,
      102
    ],
    "lang": "rust",
    "desc": "첫 반복의 제곱 생략, signed bit에 따른 추가 선, 마지막 두 선을 보존한 원문입니다. 같은 준비된 선의 곱을 직접 다항식으로 바꾸어 누적 결과를 대조했습니다.",
    "annotations": [
      {
        "lines": [
          51,
          102
        ],
        "color": "sky",
        "note": "첫 반복의 제곱 생략, signed bit에 따른 추가 선, 마지막 두 선을 보존한 원문입니다. 같은 준비된 선의 곱을 직접 다항식으로 바꾸어 누적 결과를 대조했습니다."
      }
    ]
  },
  "experiment": {
    "code": source4,
    "path": "check/main.rs",
    "highlight": [
      1,
      57
    ],
    "lang": "rust",
    "desc": "이 글에서 작성해 실제 실행한 비교입니다. 36개 기저 곱·32개 밀집 입력·0과 1·틀린 위치 및 생성원 Miller 누적을 비교합니다. 마지막 지수·전체 페어링·성능은 실행하지 않습니다.",
    "annotations": [
      {
        "lines": [
          1,
          57
        ],
        "color": "sky",
        "note": "이 글에서 작성해 실제 실행한 비교입니다. 36개 기저 곱·32개 밀집 입력·0과 1·틀린 위치 및 생성원 Miller 누적을 비교합니다. 마지막 지수·전체 페어링·성능은 실행하지 않습니다."
      }
    ]
  }
};
export const fileTrees: Record<string, FileNode> = {
  "ark": {
    "name": "arkworks · 7ad88c46 고정 원문",
    "type": "dir",
    "children": [
      {
        "name": "fp12_2over3over2.rs",
        "type": "file",
        "path": "ark/fp12_2over3over2.rs",
        "codeKey": "014"
      },
      {
        "name": "fp6_3over2.rs",
        "type": "file",
        "path": "ark/fp6_3over2.rs",
        "codeKey": "01"
      },
      {
        "name": "bn.rs",
        "type": "file",
        "path": "ark/bn.rs",
        "codeKey": "ell"
      },
      {
        "name": "bn254.rs",
        "type": "file",
        "path": "ark/bn254.rs",
        "codeKey": "config"
      }
    ]
  },
  "check": {
    "name": "이 글의 실제 실행 프로그램",
    "type": "dir",
    "children": [
      {
        "name": "main.rs",
        "type": "file",
        "path": "check/main.rs",
        "codeKey": "experiment"
      }
    ]
  }
};
