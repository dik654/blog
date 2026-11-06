import RegisterTrace from "./RegisterTrace";

/**
 * 본문 대응: #sass-trace — 문서의 SASS 출력에 같은 사례를 대입한다. 같은 물리 자리를 다시 쓰는 것이 PTX와의 차이다.
 * 00d0(C 주소)은 00e0(FADD)이 R9를 덮기 전에 온다. R0은 IMAD 식에서 block 크기 자리로 읽는다.
 */
const SCENES = [
  {
    label: "위치 찾기",
    summary: "R0×UR6 + R9 = 3",
    note: "R9는 thread 번호 3을 받은 뒤 IMAD의 결과인 위치 3으로 덮입니다. R0은 이 식에서 block 크기 4에 해당합니다.",
    lines: [
      { code: "0010 S2R R9, SR_TID.X", hint: "thread 번호" },
      { code: "0020 S2UR UR6, SR_CTAID.X", hint: "block 번호" },
      { code: "0070 IMAD R9, R0, UR6, R9", hint: "4×0 + 3" },
    ],
    cells: [
      { name: "R9", value: "위치 3", changed: true },
      { name: "UR6", value: "0", changed: true },
      { name: "R0", value: "4" },
    ],
  },
  {
    label: "두 입력 읽기",
    summary: "R2 = 7, R5 = 5",
    note: "주소를 담았던 쌍의 한쪽이 읽어 온 값의 목적지가 됩니다. A 쪽은 R2에 7이, B 쪽은 R5에 5가 놓입니다.",
    lines: [
      { code: "0090 IMAD.WIDE R2, R9, 0x4, R2", hint: "A 주소 + 3×4" },
      { code: "00a0 LDG.E R2, …[R2.64]", hint: "A[3] 읽기" },
      { code: "00b0 IMAD.WIDE R4, R9, 0x4, R4", hint: "B 주소 + 3×4" },
      { code: "00c0 LDG.E R5, …[R4.64]", hint: "B[3] 읽기" },
    ],
    cells: [
      { name: "R9", value: "위치 3" },
      { name: "R2", value: "7", changed: true },
      { name: "R5", value: "5", changed: true },
    ],
  },
  {
    label: "더하기",
    summary: "R9 = 12",
    note: "C의 주소를 만드는 00d0이 R9의 위치 3을 먼저 읽습니다. 그 뒤 00e0의 FADD가 같은 R9에 합 12를 씁니다.",
    lines: [
      { code: "00d0 IMAD.WIDE R6, R9, 0x4, R6", hint: "C 주소 + 3×4" },
      { code: "00e0 FADD R9, R2, R5", hint: "7 + 5" },
    ],
    cells: [
      { name: "R6.64", value: "C 주소+12", changed: true },
      { name: "R2", value: "7" },
      { name: "R5", value: "5" },
      { name: "R9", value: "12", changed: true },
    ],
  },
  {
    label: "결과 쓰기",
    summary: "C[3] = 12",
    note: "R6 쌍의 주소에 R9의 12를 씁니다. 컴파일하거나 실행한 결과가 아니라 문서 출력의 명령 의미에 숫자를 넣어 읽은 것입니다.",
    lines: [{ code: "00f0 STG.E …[R6.64], R9", hint: "합 쓰기" }],
    cells: [
      { name: "R6.64", value: "C 주소+12" },
      { name: "R9", value: "12" },
      { name: "배열 C[3]", value: "12", changed: true },
    ],
  },
];

export default function SassTraceViz() {
  return (
    <RegisterTrace
      eyebrow="SASS 출력에 사례 대입"
      title="SASS에서는 같은 번호의 자리에 다른 값이 차례로 놓입니다"
      description="네 자리 숫자는 문서 출력의 명령 주소입니다. 숫자는 사례를 대입한 값이고 일부 명령과 인자는 줄였습니다."
      ariaLabel="SASS 명령이 R9, R2, R5, R6 자리를 차례로 쓰며 위치 3, 값 7과 5, 합 12를 만드는 순서"
      scenes={SCENES}
    />
  );
}
