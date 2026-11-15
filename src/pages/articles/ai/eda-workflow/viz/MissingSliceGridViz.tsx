import SceneShell from "./SceneShell";

/**
 * 본문 대응: #missing ExplainedFormula — 전체 1,000건 중 결측 100건(10%),
 * 장비 A 200건 중 결측 80건(40%).
 * 나머지 800건의 결측은 100 − 80 = 20건 → 20/800 = 2.5% (본문 숫자에서 나온 산술).
 * 칸 하나 = 10건. 100칸 중 장비 A 20칸(결측 8칸), 나머지 80칸(결측 2칸).
 */
const CELLS = 100;
const PER_CELL = 10;
const DEVICE_CELLS = 20;
const DEVICE_MISSING = 8;
const REST_MISSING = 2;
const REST_CELLS = CELLS - DEVICE_CELLS;

// 나머지 80칸 안에서 결측 두 칸의 자리(설명용 배치).
const REST_MISSING_AT = [37, 71] as const;

const isDevice = (index: number) => index < DEVICE_CELLS;
const isMissing = (index: number) =>
  isDevice(index) ? index < DEVICE_MISSING : (REST_MISSING_AT as readonly number[]).includes(index);

const SCENES = [
  {
    label: "전체만 보면 10%",
    summary: "100 / 1,000 = 10%",
    note: "1,000건을 칸 100개로 나눴습니다. 빈 칸은 10개, 즉 결측 100건이라 전체 결측률은 10%입니다.",
  },
  {
    label: "장비 A만 떼어 보면 40%",
    summary: "80 / 200 = 40%",
    note: "장비 A의 200건(20칸)만 분모로 두면 결측 80건(8칸)이라 40%입니다. 빈 칸 10개 중 8개가 이 묶음에 모여 있습니다.",
  },
  {
    label: "나머지 800건은 2.5%",
    summary: "20 / 800 = 2.5%",
    note: "남은 결측은 100 − 80 = 20건이고 분모는 800건이라 2.5%입니다. 전체 10%는 40%와 2.5%가 건수 비율(200:800)대로 섞인 값이라, 10%만 보면 두 묶음의 차이가 보이지 않습니다.",
  },
] as const;

export default function MissingSliceGridViz() {
  return (
    <SceneShell
      eyebrow="결측률의 분모"
      title="분모를 무엇으로 두느냐에 따라 결측률이 10%·40%·2.5%가 됩니다"
      description={`칸 하나가 주문 ${PER_CELL}건이고 빈 칸이 결측입니다. 장비 A가 아닌 칸에서 빈 칸의 위치는 설명용입니다(가정).`}
      ariaLabel="전체 1,000건 결측률 10퍼센트, 장비 A 200건 결측률 40퍼센트, 나머지 800건 결측률 2.5퍼센트"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="mx-auto grid max-w-[14rem] grid-cols-10 gap-1 sm:max-w-[22rem]">
            {Array.from({ length: CELLS }, (_, index) => {
              const device = isDevice(index);
              const missing = isMissing(index);
              const inFocus = active === 0 || (active === 1 ? device : !device);
              const ring = active === 1 && device ? "border-blue-600" : active === 2 && !device ? "border-slate-500" : "border-border";
              return (
                <span
                  key={index}
                  className={`aspect-square rounded-sm border transition-opacity duration-300 motion-reduce:transition-none ${ring} ${
                    missing ? "border-dashed bg-transparent" : "bg-slate-400/40"
                  } ${inFocus ? "opacity-100" : "opacity-25"}`}
                  style={missing ? { borderColor: "#dc2626" } : undefined}
                />
              );
            })}
          </div>
          <div className="mx-auto mt-3 grid max-w-[22rem] grid-cols-3 gap-2 text-center text-xs">
            <p className={`rounded border px-1 py-1.5 ${active === 0 ? "border-foreground font-bold" : "border-border/70 text-muted-foreground"}`}>
              전체 {(CELLS * PER_CELL).toLocaleString("en-US")}건
            </p>
            <p className={`rounded border px-1 py-1.5 ${active === 1 ? "border-blue-600 font-bold" : "border-border/70 text-muted-foreground"}`}>
              장비 A {DEVICE_CELLS * PER_CELL}건 (위 두 줄)
            </p>
            <p className={`rounded border px-1 py-1.5 ${active === 2 ? "border-slate-500 font-bold" : "border-border/70 text-muted-foreground"}`}>
              나머지 {REST_CELLS * PER_CELL}건
            </p>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            빈 칸(빨간 점선) {DEVICE_MISSING + REST_MISSING}개 = 결측 {(DEVICE_MISSING + REST_MISSING) * PER_CELL}건
          </p>
        </div>
      )}
    />
  );
}
