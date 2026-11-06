import SceneShell from "./SceneShell";

/**
 * 본문 대응: #virtual-overcommit — overcommit 세 모드가 약속을 언제 거절하고, 문제가 언제 드러나는가.
 * RAM 16,384 MiB, swap·huge page 없음. 모드 2 상한 16,384 × 50 ÷ 100 = 8,192 MiB.
 * (가정) 프로세스 셋이 6 GiB씩 malloc = 18,432 MiB, 또는 한 번에 32 GiB. 각 1 GiB만 먼저 씀 = 3,072 MiB.
 */
const SCALE = 34816;
const RAM = 16384;
const LIMIT = 8192;
const pct = (mib: number) => `${(mib / SCALE) * 100}%`;

type Request = { size: number; text: string; ok: boolean };

const THREE: readonly Request[] = [
  { size: 6144, text: "6 GiB", ok: true },
  { size: 6144, text: "6 GiB", ok: true },
  { size: 6144, text: "6 GiB", ok: true },
];

const SCENES: readonly {
  label: string;
  summary: string;
  promises: readonly Request[];
  used: number;
  short: number;
  limit: boolean;
  result: string;
  note: string;
}[] = [
  { label: "모드 0(기본): 약속은 RAM을 넘어도 됩니다", summary: "약속 18,432 MiB > RAM", promises: THREE, used: 3072, short: 0, limit: false, result: "malloc 셋 모두 성공", note: "6 GiB 요청 하나는 RAM과 swap의 합보다 명백히 크지 않아 통과합니다. 약속 총량이 RAM을 넘는 이 상태가 overcommit입니다." },
  { label: "모드 0·1: 쓰기 시작해야 드러납니다", summary: "쓴 page가 RAM에 닿음 → OOM killer", promises: THREE, used: RAM, short: 2048, limit: false, result: "RAM 부족 → OOM killer", note: "약속한 프로세스들이 실제로 page를 써 RAM이 모자랄 때 비로소 문제가 드러나고, 그때 해결책이 OOM killer입니다." },
  { label: "모드 0: 32 GiB 요청", summary: "명백히 큰 요청 → 거절", promises: [{ size: 32768, text: "32 GiB", ok: false }], used: 0, short: 0, limit: false, result: "malloc 거절", note: "기본값 0은 RAM과 swap의 합보다 명백히 큰 요청만 거절합니다. swap 없는 16 GiB 서버에 32 GiB를 요구한 경우입니다." },
  { label: "모드 1: 같은 32 GiB 요청", summary: "무조건 약속", promises: [{ size: 32768, text: "32 GiB", ok: true }], used: 0, short: 0, limit: false, result: "malloc 성공", note: "1이면 크기를 따지지 않고 약속합니다. 실제로 써서 RAM이 모자라면 그때 해결책이 OOM killer입니다." },
  {
    label: "모드 2: 약속 자체를 제한합니다",
    summary: "상한 8,192 MiB → 둘째부터 NULL",
    promises: [
      { size: 6144, text: "6 GiB", ok: true },
      { size: 6144, text: "NULL", ok: false },
      { size: 6144, text: "NULL", ok: false },
    ],
    used: 1024,
    short: 0,
    limit: true,
    result: "초과 malloc은 NULL",
    note: "상한 CommitLimit은 16,384 × 50 ÷ 100 = 8,192 MiB입니다. SIGKILL 대신 할당 순간 오류를 받지만 RAM 절반만 약속할 수 있습니다.",
  },
];

export default function OvercommitViz() {
  return (
    <SceneShell
      eyebrow="overcommit 세 모드"
      title="모드에 따라 약속을 거절하는 때와 죽는 때가 갈립니다"
      description="위 줄은 malloc으로 받은 약속(주소 범위), 아래 줄은 실제로 쓴 page, 점선은 받지 못한 몫입니다. 단위는 MiB입니다."
      note="swap·huge page 없는 16 GiB 서버입니다. (가정) 요청 6 GiB·32 GiB, 프로세스마다 먼저 쓰는 1 GiB(둘째 장면은 6 GiB 전부), 다른 약속 없음."
      ariaLabel="overcommit 모드 0, 1, 2에서 malloc과 OOM의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="relative">
              <div className="relative mb-1 h-5 text-[11px] font-semibold">
                <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: pct(RAM) }}>RAM 16,384</span>
                {scene.limit && <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: pct(LIMIT), color: "#d97706" }}>상한 8,192</span>}
              </div>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">약속</p>
              <div className="flex h-8 gap-px rounded-sm sm:h-10 bg-muted/40">
                {scene.promises.map((promise, index) => (
                  <div
                    key={index}
                    className={`relative z-10 flex h-full items-center justify-center rounded-sm border text-[11px] font-semibold ${promise.ok ? "" : "border-dashed bg-background"}`}
                    style={{
                      width: pct(promise.size),
                      borderColor: promise.ok ? "#2563eb" : "#dc2626",
                      ...(promise.ok ? { backgroundColor: "#2563eb" } : {}),
                      color: promise.ok ? "#ffffff" : "#dc2626",
                    }}
                  >
                    {promise.text}
                  </div>
                ))}
              </div>
              <p className="mb-1 mt-2 text-xs font-semibold text-muted-foreground">실제로 쓴 page · {scene.used.toLocaleString("en-US")} MiB{scene.short > 0 ? " + 모자란 몫" : ""}</p>
              <div className="flex h-8 rounded-sm bg-muted/40 sm:h-10">
                {scene.used > 0 && <div className="h-full rounded-sm" style={{ width: pct(scene.used), backgroundColor: "#dc2626" }} />}
                {scene.short > 0 && <div className="h-full rounded-sm border border-dashed" style={{ width: pct(scene.short), borderColor: "#dc2626" }} />}
              </div>
              <div className="pointer-events-none absolute bottom-0 top-5 w-px" style={{ left: pct(RAM), backgroundColor: "#475569" }} />
              {scene.limit && <div className="pointer-events-none absolute bottom-0 top-5 w-px" style={{ left: pct(LIMIT), backgroundColor: "#d97706" }} />}
            </div>
            <p className="mt-3 font-mono text-sm font-bold">결과: {scene.result}</p>
          </div>
        );
      }}
    />
  );
}
