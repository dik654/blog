import SceneShell from "./SceneShell";

/**
 * 본문 대응: #backup-restore 첫 문단 "DB base snapshot 뒤 ordered log를 적용합니다 … 최신 timestamp만 고르면
 * 서로 다른 세대가 섞입니다." 글 첫머리 사례(12:00 손상, 11:50 검증 log, 급여 명세서 object, KMS key)를 잇습니다.
 * 오른쪽 열의 "11:50 이후 기록"이 각 component에 있다는 것은 설명용 가정입니다.
 */
type Pick = "none" | "point" | "later";

type Row = { name: string; point: string; later: string; method: string };

const ROWS: readonly Row[] = [
  { name: "급여 DB", point: "snapshot + log ~11:50", later: "12:00 손상 · 검증 안 됨", method: "base snapshot → ordered log" },
  { name: "급여 명세서 object", point: "11:50 지점 version", later: "더 최신 version", method: "재생 또는 11:50으로 되돌림" },
  { name: "Queue", point: "11:50 지점 offset", later: "더 최신 offset", method: "재생 또는 11:50으로 되돌림" },
  { name: "KMS key", point: "11:50 세대 key", later: "다른 세대 key", method: "같은 generation key" },
];

type Scene = {
  label: string;
  summary: string;
  note: string;
  picks: readonly [Pick, Pick, Pick, Pick];
  verdict: string;
  bad: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "component마다 최신 시각이 다름",
    summary: "DB는 11:50이 마지막 검증 지점",
    note: "DB는 12:00에 손상돼 11:50 log까지만 검증된 복구 지점입니다. 반면 object·queue·key에는 11:50 뒤에 생긴 기록이 남아 있을 수 있습니다(가정). 아직 아무것도 고르지 않았습니다.",
    picks: ["none", "none", "none", "none"],
    verdict: "선택 전",
    bad: false,
  },
  {
    label: "최신 timestamp만 고르면",
    summary: "세대가 섞인 복구",
    note: "어느 component가 authoritative인지 모른 채 component마다 가장 최신 것을 고르면 DB는 11:50, 나머지는 그 뒤의 세대가 됩니다. 기술적으로 restore 명령은 모두 성공해도 서로 다른 시점이 섞여, 실패 표의 ‘DB는 복구됐지만 object generation 불일치’처럼 업무 oracle에서 traffic 전환이 멈춥니다.",
    picks: ["point", "later", "later", "later"],
    verdict: "세대 불일치 → 전환 중단",
    bad: true,
  },
  {
    label: "같은 consistency point로",
    summary: "모두 11:50 세대에 맞춤",
    note: "깨끗한 환경에서 backup catalog의 hash·generation·보존 상태를 확인한 뒤 DB는 base snapshot에 ordered log를 순서대로 적용합니다. Object·queue·search index는 authoritative source에서 재생하거나 같은 consistency point로 되돌리고, key도 같은 generation을 씁니다. 그다음 기술·업무 oracle을 실행합니다.",
    picks: ["point", "point", "point", "point"],
    verdict: "같은 세대 → oracle 실행",
    bad: false,
  },
];

function Cell({ text, state }: { text: string; state: "idle" | "picked" | "wrong" | "off" }) {
  const cls =
    state === "picked"
      ? "border-[#2563eb] font-semibold text-foreground"
      : state === "wrong"
        ? "border-[#dc2626] font-semibold text-[#b91c1c] dark:text-[#f87171]"
        : state === "off"
          ? "border-dashed border-border/60 text-muted-foreground/60"
          : "border-border text-muted-foreground";
  return <div className={`flex min-h-[3.25rem] min-w-0 items-center rounded border bg-background px-2 py-1.5 text-[11px] leading-4 ${cls}`}>{text}</div>;
}

export default function GenerationMixViz() {
  return (
    <SceneShell
      eyebrow="Recovery generation"
      title="component마다 가장 최신 사본을 고르면 서로 다른 시점이 섞입니다"
      description="한 줄이 component 하나입니다. 왼쪽 열은 11:50 consistency point, 오른쪽 열은 그 뒤의 기록(가정)이며, 테두리를 칠한 칸이 복구에 고른 사본입니다. Recovery generation은 함께 복구해야 하는 사본들에 붙인 같은 세대 표시입니다."
      ariaLabel="최신 timestamp 선택과 같은 recovery generation 선택 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-[10px] font-bold text-muted-foreground sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]">
              <span>component</span>
              <span>11:50 지점</span>
              <span>11:50 이후 (가정)</span>
            </div>
            {ROWS.map((row, index) => {
              const pick = scene.picks[index];
              const dbLater = index === 0;
              return (
                <div key={row.name} className="grid grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1fr)] items-stretch gap-2 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]">
                  <span className="self-center break-keep text-[11px] font-bold leading-4">{row.name}</span>
                  <Cell text={pick === "point" && active === 2 ? row.method : row.point} state={pick === "point" ? "picked" : "idle"} />
                  <Cell text={row.later} state={pick === "later" ? "wrong" : dbLater ? "off" : "idle"} />
                </div>
              );
            })}
            <div
              className={`mt-2 rounded-lg border px-3 py-2 text-sm font-bold ${scene.bad ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-border"}`}
            >
              {scene.verdict}
            </div>
          </div>
        );
      }}
    />
  );
}
