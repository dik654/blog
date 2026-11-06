import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-read — RESTART = first && restart_on_next, STOP = last && !nostop, 함수 끝에서 restart_on_next = nostop.
 * 쓰기(len=1, nostop=true)가 남긴 값을 읽기(len=4, nostop=false)의 첫 명령이 받아 씁니다.
 */
const COMMANDS = [
  { name: "쓰기 0x10", first: 1, last: 1, restart: 0, stop: 0, step: 0 },
  { name: "읽기 1", first: 1, last: 0, restart: 1, stop: 0, step: 2 },
  { name: "읽기 2", first: 0, last: 0, restart: 0, stop: 0, step: 3 },
  { name: "읽기 3", first: 0, last: 0, restart: 0, stop: 0, step: 3 },
  { name: "읽기 4", first: 0, last: 1, restart: 0, stop: 1, step: 4 },
] as const;

const WIRE = [
  { text: "START", step: 0, mark: true },
  { text: "0x90", step: 0, mark: false },
  { text: "0x10", step: 0, mark: false },
  { text: "반복 START", step: 2, mark: true },
  { text: "0x91", step: 2, mark: false },
  { text: "0x12", step: 2, mark: false },
  { text: "0x34", step: 3, mark: false },
  { text: "0x56", step: 3, mark: false },
  { text: "0x78", step: 4, mark: false },
  { text: "STOP", step: 4, mark: true },
] as const;

const SCENES = [
  { label: "쓰기 호출의 한 명령", summary: "RESTART 0 · STOP 0", state: "false", note: "len=1이라 first와 last가 모두 참입니다. 저장된 값이 false로 시작한다고 두었으니 RESTART는 0이고, nostop이 참이라 last && !nostop인 STOP도 0입니다." },
  { label: "쓰기 호출이 끝날 때", summary: "restart_on_next = true", state: "true", note: "함수 끝에서 nostop 값 true를 저장합니다. STOP이 없었으니 거래는 이어져 있습니다. 성공 반환값 1을 확인한 뒤 다음 읽기로 넘어갑니다." },
  { label: "읽기의 첫 명령", summary: "RESTART 1 · STOP 0", state: "true", note: "first와 저장된 true가 만나 RESTART가 1이 됩니다. 앞 호출이 남긴 값 하나가 다음 호출의 시작 방식을 정합니다." },
  { label: "가운데 두 명령", summary: "RESTART 0 · STOP 0", state: "true", note: "first도 last도 아니므로 둘 다 0입니다. 읽기 비트만 가진 명령입니다." },
  { label: "마지막 명령", summary: "STOP 1 · restart_on_next = false", state: "false", note: "last가 참이고 nostop이 거짓이라 STOP이 1입니다. 함수 끝에서 nostop 값 false를 저장합니다. 성공 길이 4를 반환값으로 확인합니다." },
] as const;

function Flag({ value, shown }: { value: number; shown: boolean }) {
  if (!shown) return <span className="text-center font-mono text-muted-foreground/50">·</span>;
  return <span className={`text-center font-mono ${value ? "font-bold text-amber-700 dark:text-amber-400" : ""}`}>{value}</span>;
}

export default function SdkRestartStateViz() {
  return (
    <SceneShell
      eyebrow="두 호출 사이에 남는 값"
      title="쓰기 호출이 남긴 값이 어떻게 읽기의 반복 START가 되는가"
      description="표의 한 줄이 컨트롤러에 넣는 명령 하나입니다. first와 last는 그 호출의 첫 바이트·끝 바이트인지를, RESTART와 STOP은 명령에 세우는 비트를 뜻합니다. 1은 참, 0은 거짓입니다. 주소와 위치·결과 값은 앞 절의 가정입니다."
      ariaLabel="i2c_write_blocking과 i2c_read_blocking 사이에서 restart_on_next가 바뀌며 RESTART와 STOP 비트를 정하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto max-w-[560px] min-w-0 space-y-3 text-xs">
            <p className="flex items-center justify-between gap-2 rounded border border-border px-3 py-2">
              <span className="font-mono text-[11px] sm:text-xs">restart_on_next</span>
              <strong className="font-mono text-primary">{scene.state}</strong>
            </p>
            <div>
              <div className="grid grid-cols-[minmax(0,1fr)_repeat(4,2.9rem)] gap-1 border-b border-border pb-1 text-[10px] font-bold text-muted-foreground sm:text-[11px]">
                <span>명령</span><span className="text-center">first</span><span className="text-center">last</span><span className="text-center">RESTART</span><span className="text-center">STOP</span>
              </div>
              {COMMANDS.map((command) => {
                const current = command.step === active;
                const shown = command.step <= active;
                return (
                  <div key={command.name} className={`grid grid-cols-[minmax(0,1fr)_repeat(4,2.9rem)] gap-1 border-b border-border/60 py-1.5 ${current ? "bg-primary/10 font-semibold" : shown ? "" : "text-muted-foreground"}`}>
                    <span className="pl-1">{command.name}</span>
                    <Flag value={command.first} shown={shown} />
                    <Flag value={command.last} shown={shown} />
                    <Flag value={command.restart} shown={shown} />
                    <Flag value={command.stop} shown={shown} />
                  </div>
                );
              })}
            </div>
            <div>
              <p className="mb-1 font-semibold">선 위에 나타나는 순서</p>
              <div className="flex flex-wrap gap-1">
                {WIRE.map((token) => {
                  const on = token.step <= active;
                  return (
                    <span
                      key={token.text}
                      className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${token.mark ? "font-bold" : ""}`}
                      style={on ? { borderColor: token.mark ? "#d97706" : "#2563eb", color: token.mark ? "#d97706" : "#2563eb" } : { borderColor: "#94a3b8", color: "#94a3b8", opacity: 0.4 }}
                    >
                      {token.text}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
