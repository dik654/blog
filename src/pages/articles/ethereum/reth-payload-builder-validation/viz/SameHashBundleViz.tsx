import PayloadSceneShell from "../../reth-payload-builder/viz/PayloadSceneShell";

/**
 * 본문 대응: #baseline — Hash만 같다고 충분하지 않다. 실패한 build가 우연히 이전 best를 반환할 수 있으므로
 * attempt outcome, typed error와 fallback 여부도 함께 저장한다.
 * 숫자 없음. 0x… hash 값과 두 구현의 결과는 설명용 가정이다.
 */
type Cell = { base: string; cand: string };

const ROWS: readonly { key: string; title: string }[] = [
  { key: "hash", title: "payload hash" },
  { key: "outcome", title: "attempt outcome" },
  { key: "error", title: "typed error" },
  { key: "source", title: "반환된 후보" },
];

const NORMAL: Record<string, Cell> = {
  hash: { base: "0xa1… (가정)", cand: "0xa1… (가정)" },
  outcome: { base: "Better", cand: "Better" },
  error: { base: "없음", cand: "없음" },
  source: { base: "이번 build", cand: "이번 build" },
};

const FAILED: Record<string, Cell> = {
  hash: { base: "0xa1… (가정)", cand: "0xa1… (가정)" },
  outcome: { base: "Better", cand: "Attempt error" },
  error: { base: "없음", cand: "기록됨" },
  source: { base: "이번 build", cand: "이전 best" },
};

const SCENES = [
  {
    label: "정상 경로",
    summary: "네 칸 모두 같음",
    note: "정상 경로에서는 두 구현의 payload hash도, 시도 결과도, 오류도 같습니다. 이 묶음 전체를 기준선으로 저장해 둡니다.",
    data: NORMAL,
    visible: 4,
  },
  {
    label: "Hash만 비교",
    summary: "같음 → 실패를 놓침",
    note: "Candidate의 이번 build가 실패했는데, job이 우연히 이전 best를 반환해 payload hash가 기준선과 같아졌다고 가정합니다. Hash 한 칸만 저장했다면 두 구현이 같다고 판정합니다.",
    data: FAILED,
    visible: 1,
  },
  {
    label: "묶음으로 비교",
    summary: "attempt outcome에서 첫 차이",
    note: "Attempt outcome, typed error와 어떤 후보가 반환됐는지를 함께 저장했다면 hash가 같아도 차이가 드러납니다. 이 때문에 결과를 bytes 하나가 아니라 상태 묶음으로 남깁니다.",
    data: FAILED,
    visible: 4,
  },
] as const;

export default function SameHashBundleViz() {
  return (
    <PayloadSceneShell
      eyebrow="기준선 저장 · 같은 fixture"
      title="Payload hash가 같아도 build는 실패했을 수 있습니다"
      description="한 줄이 저장하는 값 하나입니다. 왼쪽은 base, 오른쪽은 candidate이며, 빨간 칸은 두 값이 다른 곳입니다. 흐린 줄은 저장하지 않아 비교할 수 없는 값입니다."
      ariaLabel="payload hash만 저장할 때와 상태 묶음을 저장할 때 candidate의 실패가 보이는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const verdict = ROWS.slice(0, scene.visible).some((row) => scene.data[row.key].base !== scene.data[row.key].cand);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-border p-px text-[10px] leading-4 sm:text-xs">
              <div className="bg-background px-2 py-2 font-bold text-muted-foreground">저장한 값</div>
              <div className="bg-background px-2 py-2 text-center font-bold">Base</div>
              <div className="bg-background px-2 py-2 text-center font-bold">Candidate</div>
              {ROWS.map((row, index) => {
                const cell = scene.data[row.key];
                const shown = index < scene.visible;
                const differs = shown && cell.base !== cell.cand;
                const tone = !shown ? "text-muted-foreground/40" : differs ? "font-bold text-red-700 dark:text-red-400" : "";
                return (
                  <div key={row.key} className="contents">
                    <div className={`break-keep bg-background px-2 py-2 font-mono ${shown ? "" : "text-muted-foreground/40"}`}>{row.title}</div>
                    <div className={`break-keep bg-background px-2 py-2 text-center ${shown ? "" : "text-muted-foreground/40"}`}>{shown ? cell.base : "저장 안 함"}</div>
                    <div className={`break-keep px-2 py-2 text-center ${differs ? "bg-red-50 dark:bg-red-950/40" : "bg-background"} ${tone}`}>{shown ? cell.cand : "저장 안 함"}</div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-3 rounded-md border px-3 py-2 text-center text-xs font-bold ${verdict ? "border-red-600 text-red-700 dark:text-red-400" : active === 1 ? "border-dashed border-amber-600 text-amber-700 dark:text-amber-400" : "border-primary text-primary"}`}>
              {verdict ? "판정: 차이 있음 → 첫 차이를 기록" : active === 1 ? "판정: 같음 (실제로는 candidate의 build가 실패)" : "판정: 같음"}
            </div>
          </div>
        );
      }}
    />
  );
}
