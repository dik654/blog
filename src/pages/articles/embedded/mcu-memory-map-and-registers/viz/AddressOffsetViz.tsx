import SceneShell from "./SceneShell";

/**
 * 본문 대응: #map, #mux, #source-direction — 기준 주소 + 오프셋 = 동작 주소.
 * 0xD0000000+0x014=0xD0000014, +0x018=0xD0000018, +0x024=0xD0000024, 0x40014000+0x02C=0x4001402C.
 * 눈금 위치는 오프셋에 비례한다.
 */
const PX_PER_OFFSET = 4.5;

interface Tick {
  offset: number;
  address: string;
  name: string;
}

const SIO_TICKS: readonly Tick[] = [
  { offset: 0x000, address: "0xD0000000", name: "SIO 기준" },
  { offset: 0x014, address: "0xD0000014", name: "GPIO_OUT_SET" },
  { offset: 0x018, address: "0xD0000018", name: "GPIO_OUT_CLR" },
  { offset: 0x024, address: "0xD0000024", name: "GPIO_OE_SET" },
];

const BANK_TICKS: readonly Tick[] = [
  { offset: 0x000, address: "0x40014000", name: "IO_BANK0 기준" },
  { offset: 0x02c, address: "0x4001402C", name: "GPIO5_CTRL" },
];

interface Scene {
  label: string;
  summary: string;
  note: string;
  ticks: readonly Tick[];
  focus: number;
  action: string;
  value: string;
}

const SCENES: readonly Scene[] = [
  { label: "기준 주소", summary: "SIO = 0xD0000000", ticks: SIO_TICKS, focus: 0x000, action: "SIO 블록의 시작", value: "아직 쓰지 않음", note: "RP2040 공식 표에서 프로그램의 빠른 제어 블록 SIO는 이 주소에서 시작합니다." },
  { label: "출력 세우기", summary: "0xD0000000 + 0x014 = 0xD0000014", ticks: SIO_TICKS, focus: 0x014, action: "출력 비트 세우기", value: "0x20", note: "여기에 쓴 1비트는 출력 래치의 해당 자리만 세우라는 명령입니다. RAM의 일반 변수와 의미가 다릅니다." },
  { label: "출력 내리기", summary: "0xD0000000 + 0x018 = 0xD0000018", ticks: SIO_TICKS, focus: 0x018, action: "출력 비트 내리기", value: "0x20", note: "오프셋이 4만큼 다를 뿐인데 동작은 반대입니다. 어느 주소인지에 따라 하드웨어 동작이 달라집니다." },
  { label: "출력 허용", summary: "0xD0000000 + 0x024 = 0xD0000024", ticks: SIO_TICKS, focus: 0x024, action: "출력 방향 켜기", value: "0x20", note: "출력 방향을 켜는 주소도 같은 기준에서 찾습니다. 쓰는 값은 역시 5번 자리를 고르는 0x20입니다." },
  { label: "다른 장치의 주소", summary: "0x40014000 + 0x02C = 0x4001402C", ticks: BANK_TICKS, focus: 0x02c, action: "GPIO5의 기능 선택", value: "기능 선택 값", note: "기능 선택은 IO_BANK0에 있어 기준 주소부터 다르고 더하는 방법은 같습니다. 이 주소들은 다른 MCU에 그대로 옮기면 맞지 않습니다." },
  { label: "SIO 주소에 5를 더하지 않습니다", summary: "SIO: 주소 = 동작, 값의 비트 = 핀", ticks: SIO_TICKS, focus: 0x014, action: "어느 장치의 어느 동작", value: "0x20 = 5번 자리", note: "번호 5는 주소에 더해지지 않습니다. 주소는 그대로 0xD0000014이고, 5는 쓰는 값의 비트 위치가 됩니다. 앞 장면의 GPIO5_CTRL은 GPIO5 전용 주소라 이 구분은 SIO 쓰기에 적용합니다." },
];

const RULER_HEIGHT = 0x02c * PX_PER_OFFSET + 20;

export default function AddressOffsetViz() {
  return (
    <SceneShell
      eyebrow="RP2040 메모리 맵의 일부"
      title="기준 주소 + 오프셋 = 동작 주소"
      description="아래로 갈수록 주소가 커지고 눈금 간격은 오프셋에 비례합니다. 이 글에서 쓰는 주소만 표시했습니다."
      ariaLabel="SIO와 IO_BANK0의 기준 주소에서 오프셋만큼 떨어진 레지스터 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="relative" style={{ height: RULER_HEIGHT }}>
              <div className="absolute bottom-0 left-0 top-0 w-8 rounded-sm border border-border bg-muted/40" />
              {scene.ticks.map((tick) => {
                const focused = tick.offset === scene.focus;
                return (
                  <div
                    key={tick.name}
                    className={`absolute left-0 right-0 flex h-[18px] items-center gap-2 border-t text-xs ${focused ? "border-amber-600 font-bold text-foreground" : "border-border text-muted-foreground"}`}
                    style={{ top: tick.offset * PX_PER_OFFSET }}
                  >
                    <span className="w-8 shrink-0" />
                    <span className="w-12 shrink-0 font-mono">+0x{tick.offset.toString(16).toUpperCase().padStart(3, "0")}</span>
                    <span className={`shrink-0 font-mono ${focused ? "text-amber-700 dark:text-amber-400" : ""}`}>{tick.address}</span>
                    <span className="min-w-0 break-all font-mono">{tick.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
              <div className="rounded-lg border border-border bg-background px-2 py-1">
                <span className="block text-muted-foreground">주소가 고르는 것</span>
                <strong className="block">{scene.action}</strong>
              </div>
              <div className="rounded-lg border border-border bg-background px-2 py-1">
                <span className="block text-muted-foreground">쓰는 값</span>
                <strong className="block">{scene.value}</strong>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
