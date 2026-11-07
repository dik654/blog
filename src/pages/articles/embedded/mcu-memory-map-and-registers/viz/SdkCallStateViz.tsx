import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-init, #source-direction, #source-output — 함수 다섯 호출이 방향·래치·기능을 바꾸는 순서.
 * gpio.c 273–277행과 gpio_set_dir·gpio_put의 RP2040 분기를 GPIO5로 추적한다. 실행 측정이 아니다.
 */
interface Call {
  fn: string;
  direction?: string;
  latch?: string;
  func?: string;
  pin: string;
  summary: string;
  note: string;
  label: string;
}

const CALLS: readonly Call[] = [
  { label: "출력 끄기", fn: "gpio_set_dir(5, GPIO_IN)", direction: "입력", pin: "구동 안 함", summary: "방향 → 입력", note: "첫 줄은 출력 방향을 입력으로 바꿉니다. 리셋 뒤 다른 기능이 이 핀을 구동하지 않는 초기 설정을 가정하므로 칩이 직접 구동하지 않습니다. 물음표는 이 그림이 정하지 않은 시작값입니다." },
  { label: "낮은 값 준비", fn: "gpio_put(5, 0)", latch: "0", pin: "구동 안 함", summary: "래치 → 0", note: "출력 래치를 낮춥니다. 방향이 입력이므로 아직 내보내지 않습니다." },
  { label: "SIO 선택", fn: "gpio_set_function(5, GPIO_FUNC_SIO)", func: "SIO", pin: "구동 안 함", summary: "기능 → SIO · gpio_init 끝", note: "기능을 SIO로 고르면 gpio_init(5)가 끝납니다. 출력 방향은 아직 입력입니다." },
  { label: "출력 허용", fn: "gpio_set_dir(5, true)", direction: "출력", pin: "낮게 구동", summary: "0xD0000024 ← 0x20", note: "mask=1<<5=0x20을 출력 허용 주소에 씁니다. 이제 래치의 낮은 값이 출력으로 연결됩니다." },
  { label: "높게 저장", fn: "gpio_put(5, true)", latch: "1", pin: "높게 구동", summary: "0xD0000014 ← 0x20", note: "같은 0x20을 GPIO_OUT_SET에 써서 래치가 1이 됩니다. 원문을 따라간 결과이며 보드에서 측정한 값은 아닙니다." },
];

function latest(row: number, key: "direction" | "latch" | "func") {
  const found = CALLS.slice(0, row + 1).reverse().find((call) => call[key] !== undefined);
  return found?.[key] ?? "?";
}

function Cell({ value, changed, empty }: { value: string; changed: boolean; empty: boolean }) {
  return (
    <span className={`flex min-h-6 min-w-0 items-center justify-center rounded border px-0.5 text-center text-[11px] leading-4 sm:text-xs ${empty ? "border-transparent" : changed ? "border-amber-600 bg-amber-500 font-bold text-black" : "border-border text-muted-foreground"}`}>
      {empty ? "" : value}
    </span>
  );
}

export default function SdkCallStateViz() {
  return (
    <SceneShell
      eyebrow="Pico SDK 호출 순서 · GPIO5"
      title="gpio_init(5)가 끝나도 출력은 꺼져 있습니다"
      description="위에서 아래로 실행합니다. 점선 위 세 줄이 gpio_init(5)이고, 점선 아래는 따로 부르는 호출입니다."
      ariaLabel="SDK 함수 다섯 호출이 방향, 래치, 기능과 핀 상태를 바꾸는 순서"
      scenes={CALLS}
      render={(active) => (
        <div className="min-w-0 space-y-1.5">
          <div className="grid grid-cols-4 gap-1 text-center text-xs text-muted-foreground">
            <span>방향</span>
            <span>래치</span>
            <span>기능</span>
            <span>GPIO5</span>
          </div>
          {CALLS.map((call, row) => {
            const reached = row <= active;
            const current = row === active;
            return (
              <div key={call.fn} className={`${row === 3 ? "border-t border-dashed border-border pt-1.5" : ""}`}>
                <p className={`mb-0.5 break-all font-mono text-[11px] sm:text-xs ${current ? "font-bold text-primary" : reached ? "text-foreground" : "text-muted-foreground/60"}`}>
                  {row + 1}. {call.fn}
                </p>
                <div className="grid grid-cols-4 gap-1">
                  <Cell value={latest(row, "direction")} changed={current && call.direction !== undefined} empty={!reached} />
                  <Cell value={latest(row, "latch")} changed={current && call.latch !== undefined} empty={!reached} />
                  <Cell value={latest(row, "func")} changed={current && call.func !== undefined} empty={!reached} />
                  <Cell value={call.pin} changed={current && (row >= 3)} empty={!reached} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
