import RegisterTrace from "./RegisterTrace";

/** 본문 대응: #ptx-and-sass — 문서의 PTX 출력에 위치 3, 12바이트, 7+5=12를 대입한다. 값마다 새 가상 이름을 쓴다. */
const R1 = { name: "%r1 thread 번호", value: "3" };
const R2 = { name: "%r2 block 번호", value: "0" };
const R3 = { name: "%r3 block 크기", value: "4" };
const R4 = { name: "%r4 위치", value: "3" };
const RD7 = { name: "%rd7 바이트 차이", value: "12" };
const F1 = { name: "%f1 A의 값", value: "7" };
const F2 = { name: "%f2 B의 값", value: "5" };
const F3 = { name: "%f3 합", value: "12" };
const fresh = <T extends object>(cell: T) => ({ ...cell, changed: true });

const SCENES = [
  {
    label: "위치 찾기",
    summary: "0×4 + 3 = 3",
    note: "%r4에 위치 3을 만듭니다. 배열 시작 주소를 %rd4~6에 담는 앞 명령은 줄였습니다.",
    lines: [
      { code: "mov.u32 %r1, %tid.x", hint: "thread 번호 읽기" },
      { code: "mov.u32 %r2, %ctaid.x", hint: "block 번호 읽기" },
      { code: "mov.u32 %r3, %ntid.x", hint: "block 크기 읽기" },
      { code: "mad.lo.s32 %r4, %r2, %r3, %r1", hint: "곱한 뒤 더함" },
    ],
    cells: [fresh(R1), fresh(R2), fresh(R3), fresh(R4)],
  },
  {
    label: "두 입력 읽기",
    summary: "3×4 = 12바이트 → 7, 5",
    note: "%rd7의 12를 A(%rd6)·B(%rd5)의 시작 주소에 각각 더해 읽습니다.",
    lines: [
      { code: "mul.wide.s32 %rd7, %r4, 4", hint: "위치 × 4바이트" },
      { code: "add.s64 %rd8, %rd6, %rd7", hint: "A 시작 + 12" },
      { code: "ld.global.f32 %f1, [%rd8]", hint: "A[3] 읽기" },
      { code: "add.s64 %rd9, %rd5, %rd7", hint: "B 시작 + 12" },
      { code: "ld.global.f32 %f2, [%rd9]", hint: "B[3] 읽기" },
    ],
    cells: [R4, fresh(RD7), fresh(F1), fresh(F2)],
  },
  {
    label: "더하기",
    summary: "7 + 5 = 12",
    note: "%f1과 %f2를 더한 값을 또 다른 이름 %f3에 둡니다. 앞의 이름을 덮어쓰지 않습니다.",
    lines: [{ code: "add.f32 %f3, %f1, %f2", hint: "두 값의 합" }],
    cells: [R4, RD7, F1, F2, fresh(F3)],
  },
  {
    label: "결과 쓰기",
    summary: "C[3] = 12",
    note: "같은 12를 C의 시작 주소에 더한 곳에 씁니다. 이 함수에는 길이 검사 분기가 없습니다.",
    lines: [
      { code: "add.s64 %rd10, %rd4, %rd7", hint: "C 시작 + 12" },
      { code: "st.global.f32 [%rd10], %f3", hint: "합 쓰기" },
    ],
    cells: [RD7, F3, fresh({ name: "배열 C[3]", value: "12" })],
  },
];

export default function PtxTraceViz() {
  return (
    <RegisterTrace
      eyebrow="PTX 출력에 사례 대입"
      title="PTX는 값이 생길 때마다 새 가상 이름에 담습니다"
      description="공식 문서의 add 출력에 사례 숫자를 대입해 읽은 것이며 실행 기록이 아닙니다. %r·%f·%rd는 가상 이름입니다."
      ariaLabel="PTX 명령이 위치 3과 바이트 차이 12, 값 7과 5, 합 12를 가상 register에 만드는 순서"
      scenes={SCENES}
    />
  );
}
