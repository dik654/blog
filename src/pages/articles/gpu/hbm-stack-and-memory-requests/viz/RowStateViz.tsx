import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — cache 조회 → 제어기 → channel·bank 대기열 → 행 동작 → 데이터 반환.
 * 다른 행이 열려 있으면 precharge·activate가 더 필요합니다. 칸 크기는 시간 길이가 아닙니다.
 * 행 번호 1·3과 행 수는 그림의 가정입니다.
 */
const SCENES = [
  { label: "cache 조회", summary: "찾지 못하면 아래로", note: "작업별 주소가 모이고 cache를 조회합니다. cache에서 찾지 못한 요청만 메모리 제어기로 내려갑니다." },
  { label: "제어기와 대기열", summary: "주소 해석 → 대기열", note: "제어기는 실제 주소를 해석해 해당 channel과 bank의 대기열에 넣습니다. 어느 프로그램 주소가 어느 칸인지는 GPU별 공개 자료가 있어야 정할 수 있어 물음표로 남겼습니다." },
  { label: "필요한 행이 열려 있으면", summary: "열 읽기 → 데이터", note: "row buffer에 이미 행 1이 잡혀 있고(가정) 요청도 행 1입니다. 그 행의 열을 읽을 수 있고, 읽기 명령 뒤 데이터가 통로를 지나 돌아옵니다." },
  { label: "다른 행이 열려 있으면", summary: "닫기 → 열기 → 읽기", note: "행 1이 열려 있는데 요청은 행 3입니다(가정). 기존 행을 닫는 precharge와 새 행을 여는 activate가 읽기 앞에 붙습니다. 통로의 폭은 이 두 동작을 없애 주지 않습니다." },
  { label: "refresh가 필요한 구역", summary: "정해진 타이밍을 지킴", note: "refresh가 필요한 구역은 정해진 타이밍을 지켜야 합니다. 다른 bank의 작업과 겹칠 수 있는 정도는 제품과 controller에 달려 있어 그림에 정하지 않았습니다." },
] as const;

const PATH = [
  { name: "cache", sub: "조회" },
  { name: "제어기", sub: "주소 해석" },
  { name: "대기열", sub: "channel·bank" },
  { name: "bank", sub: "행 동작" },
];
const PATH_ACTIVE = [[0], [1, 2], [3], [3], [3]] as readonly (readonly number[])[];
const STEPS = ["precharge · 닫기", "activate · 열기", "열 읽기", "데이터 반환", "refresh · 별도 타이밍"];
const STEP_ACTIVE = [[], [], [2, 3], [0, 1, 2, 3], [4]] as readonly (readonly number[])[];
const ROWS = [0, 1, 2, 3];
const COLS = Array.from({ length: 10 }, (_, index) => index);
const CELL = 19;
const ROW_H = 17;
const GRID_X = 44;
const GRID_Y = 82;

export default function RowStateViz() {
  return (
    <SceneShell
      eyebrow="요청 하나의 길"
      title="통로에 오르기 전에 어느 행이 열려 있는지부터 따집니다"
      description="bank는 메모리 안의 작업 구역이고, row buffer는 연 행의 값을 임시로 잡는 곳입니다. 오른쪽 칸 크기는 시간 길이가 아닙니다."
      ariaLabel="cache 조회부터 행을 열고 읽어 데이터를 돌려주기까지의 순서"
      scenes={SCENES}
      render={(active) => {
        const target = active === 2 ? 1 : active === 3 ? 3 : null;
        const known = active >= 2;
        return (
          <svg viewBox="0 0 360 244" className="mx-auto h-auto w-full max-w-[430px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {PATH.map((box, index) => {
              const on = PATH_ACTIVE[active].includes(index);
              const x = 7 + index * 90;
              return (
                <g key={box.name}>
                  <rect x={x} y={6} width={76} height={44} rx={6} fill={on ? "#2563eb" : "none"} fillOpacity={on ? 0.12 : 0} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={on ? 1.25 : 1} />
                  <text x={x + 38} y={25} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? "#2563eb" : "#64748b"}>{box.name}</text>
                  <text x={x + 38} y={41} textAnchor="middle" fontSize={11} fill="#64748b">{box.sub}</text>
                  {index < 3 && <path d={`M${x + 78} 28h10m-4 -3 4 3 -4 3`} fill="none" stroke="#94a3b8" strokeWidth={1} />}
                </g>
              );
            })}
            <text x={7} y={72} fontSize={12} fontWeight={700} fill="#64748b">bank (행·열 수는 가정)</text>
            {ROWS.map((row) => (
              <g key={row}>
                <text x={GRID_X - 6} y={GRID_Y + row * ROW_H + 12} textAnchor="end" fontSize={11} fill="#64748b">{known ? `행 ${row}` : "행 ?"}</text>
                {COLS.map((col) => {
                  const refresh = active === 4;
                  const open = active === 3 && row === 1;
                  const wanted = target === row;
                  const fill = wanted ? "#2563eb" : open ? "#d97706" : refresh ? "#16a34a" : "#94a3b8";
                  return (
                    <rect key={col} x={GRID_X + col * (CELL - 3)} y={GRID_Y + row * ROW_H} width={CELL - 5} height={ROW_H - 3} rx={1} fill={fill} fillOpacity={wanted || open ? 0.75 : refresh ? 0.45 : 0.22} />
                  );
                })}
              </g>
            ))}
            <rect x={GRID_X} y={GRID_Y + 78} width={158} height={24} rx={4} fill="none" stroke="#d97706" strokeWidth={1} />
            <text x={GRID_X + 79} y={GRID_Y + 94} textAnchor="middle" fontSize={12} fontWeight={700} fill={known && active < 4 ? "#d97706" : "#64748b"}>
              {active === 2 ? "row buffer: 행 1 (그대로)" : active === 3 ? "row buffer: 행 1 → 행 3" : "row buffer"}
            </text>
            <text x={GRID_X + 79} y={GRID_Y + 122} textAnchor="middle" fontSize={12} fill="#64748b">
              {active === 2 ? "파랑 = 요청한 행, 이미 열림" : active === 3 ? "주황 = 열린 행 · 파랑 = 요청한 행" : active === 4 ? "초록 = refresh 대상(가정)" : "주소 → 칸 대응은 정하지 않음"}
            </text>
            {STEPS.map((step, index) => {
              const on = STEP_ACTIVE[active].includes(index);
              const y = 66 + index * 34;
              return (
                <g key={step}>
                  <rect x={232} y={y} width={121} height={26} rx={5} fill={on ? "#2563eb" : "none"} fillOpacity={on ? 0.12 : 0} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
                  <text x={292.5} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#64748b"}>{step}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
