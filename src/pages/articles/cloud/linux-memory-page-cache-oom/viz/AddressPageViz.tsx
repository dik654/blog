import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 다섯 칸의 흐름. 주소 범위 → 첫 쓰기에 page → 남는 RAM에 파일 → 파일 page부터 비움 → 비울 것이 없으면 프로세스 하나를 죽임.
 * 주소 10칸과 RAM 8칸은 그림을 위한 가정이며 실제 크기가 아닙니다.
 */
const ADDRESS_COUNT = 10;
const RAM_COUNT = 8;

const SCENES = [
  { label: "1. 주소 범위만 받습니다", summary: "VSZ 10칸 · RSS 0칸", written: 0, file: 0, over: false, note: "요청하면 커널은 먼저 주소 범위만 내줍니다. 주소는 10칸 생겼지만 RAM page는 하나도 붙지 않아 RSS는 0입니다." },
  { label: "2. 처음 쓸 때 page가 붙습니다", summary: "VSZ 10칸 · RSS 2칸", written: 2, file: 0, over: false, note: "주소 1과 2에 처음 값을 쓰는 순간 물리 page가 하나씩 붙습니다. 잡아 둔 주소는 그대로 10칸입니다." },
  { label: "3. 남는 RAM은 파일을 담습니다", summary: "파일 page 6칸 · 빈 칸 0", written: 2, file: 6, over: false, note: "아무도 쓰지 않는 RAM을 놀리지 않고 최근 읽은 파일 내용을 담아 둡니다. 이 칸들이 page cache입니다." },
  { label: "4. 모자라면 파일 page부터 비웁니다", summary: "RSS 5칸 · 파일 page 3칸", written: 5, file: 3, over: false, note: "앱이 주소 3~5까지 쓰자 빈 칸이 없어 파일 page 3칸을 비워 넘겨줍니다. 아직 프로세스를 죽이지는 않습니다." },
  { label: "5. 비울 것이 없으면 하나를 죽입니다", summary: "주소 9 → 줄 page 없음", written: 8, file: 0, over: true, note: "주소 9를 쓰려는데 비울 파일 칸이 없으면 커널은 프로세스 하나를 죽입니다. 어느 프로세스인지는 7절에서 계산합니다." },
] as const;

const TEN_COLUMNS = { gridTemplateColumns: `repeat(${ADDRESS_COUNT}, minmax(0, 1fr))` };

export default function AddressPageViz() {
  return (
    <SceneShell
      eyebrow="주소와 page"
      title="주소는 먼저 받고, RAM page는 쓸 때 붙습니다"
      description="page는 커널이 RAM을 나눠 다루는 칸입니다. VSZ는 잡은 주소 공간의 크기, RSS는 실제로 RAM에 올라온 크기이고, RAM 칸의 숫자는 그 주소에 붙은 page입니다."
      note="(가정) 주소 10칸과 RAM 8칸은 설명용입니다."
      ariaLabel="주소 범위와 RAM page가 쓰기에 따라 달라지는 다섯 단계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">프로세스의 주소 범위</p>
              <div className="grid gap-1" style={TEN_COLUMNS}>
                {Array.from({ length: ADDRESS_COUNT }, (_, slot) => {
                  const written = slot < scene.written;
                  const blocked = scene.over && slot === scene.written;
                  return (
                    <div
                      key={slot}
                      className={`flex h-9 items-center justify-center rounded-sm border text-xs font-semibold ${blocked ? "border-dashed" : ""}`}
                      style={{
                        borderColor: blocked ? "#dc2626" : written ? "#dc2626" : "#94a3b8",
                        backgroundColor: written ? "#dc2626" : "transparent",
                        color: written ? "#ffffff" : blocked ? "#dc2626" : "#64748b",
                      }}
                    >
                      {slot + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">물리 RAM</p>
              <div className="grid gap-1" style={TEN_COLUMNS}>
                {Array.from({ length: RAM_COUNT }, (_, slot) => {
                  const app = slot < scene.written;
                  const file = !app && slot < scene.written + scene.file;
                  return (
                    <div
                      key={slot}
                      className="flex h-9 items-center justify-center rounded-sm border text-[11px] font-semibold"
                      style={{
                        borderColor: app ? "#dc2626" : file ? "#2563eb" : "#94a3b8",
                        backgroundColor: app ? "#dc2626" : file ? "#2563eb" : "transparent",
                        color: "#ffffff",
                      }}
                    >
                      {app ? slot + 1 : file ? "파일" : ""}
                    </div>
                  );
                })}
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div>
                <dt className="text-muted-foreground">VSZ</dt>
                <dd className="font-bold">{ADDRESS_COUNT}칸</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">RSS</dt>
                <dd className="font-bold">{scene.written}칸</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">파일 page</dt>
                <dd className="font-bold">{scene.file}칸</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
