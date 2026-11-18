import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #persistence "Fallback의 실제 조건".
 * 어떤 fallback을 쓰는지 → health=true인 서비스만 질의 → 가장 최신 epoch만 남김 → 가장 자주 나온 root.
 * 서비스 S1~S5, epoch 100·101, root R1·R2는 모두 설명용 가정입니다.
 * 계산: S3 제외(health=false, 질의하지 않으므로 응답 없음) → S4는 epoch 100이라 제외 → 남은 S1·S2·S5에서 R1 2회, R2 1회 → R1.
 */
type Service = { id: string; healthy: boolean; epoch: number | null; root: "R1" | "R2" | null };

const SERVICES: readonly Service[] = [
  { id: "S1", healthy: true, epoch: 101, root: "R1" },
  { id: "S2", healthy: true, epoch: 101, root: "R2" },
  { id: "S3", healthy: false, epoch: null, root: null },
  { id: "S4", healthy: true, epoch: 100, root: "R2" },
  { id: "S5", healthy: true, epoch: 101, root: "R1" },
];

const MAX_EPOCH = SERVICES.filter((s) => s.healthy).reduce<number>((max, s) => Math.max(max, s.epoch ?? 0), 0);
const FINAL = SERVICES.filter((s) => s.healthy && s.epoch === MAX_EPOCH);
const COUNT_R1 = FINAL.filter((s) => s.root === "R1").length;
const COUNT_R2 = FINAL.filter((s) => s.root === "R2").length;

const SCENES = [
  {
    label: "어느 fallback을 쓰나",
    summary: "initial sync 실패 뒤 분기",
    note: "Initial sync가 실패하면 load_external_fallback=true일 때 외부 목록을 먼저 사용합니다. 그렇지 않으면서 단일 fallback URL이 있으면 그 주소를 사용합니다. 아래 장면은 외부 목록 경로를 따라갑니다.",
  },
  {
    label: "health=true인 서비스만",
    summary: "5곳 중 4곳에 질의",
    note: "외부 목록 경로는 health 상태가 true인 서비스에만 질의합니다. 예시의 S3은 health가 false라서 질의하지 않고, 따라서 셀 응답도 없습니다.",
  },
  {
    label: "가장 최신 epoch만",
    summary: `epoch ${MAX_EPOCH} → ${FINAL.length}곳`,
    note: `응답 가운데 가장 최신 epoch는 ${MAX_EPOCH}입니다. 그보다 오래된 epoch 100을 낸 S4는 root가 무엇이든 제외합니다.`,
  },
  {
    label: "가장 자주 나온 root",
    summary: `R1 ${COUNT_R1}회 · R2 ${COUNT_R2}회 → R1`,
    note: `남은 ${FINAL.length}곳에서 R1이 ${COUNT_R1}번, R2가 ${COUNT_R2}번 나왔으므로 R1을 고릅니다. 이 계산은 같은 값을 낸 서비스 수만 셉니다.`,
  },
  {
    label: "다수는 trust가 아닙니다",
    summary: "availability signal",
    note: "공식 문서와 코드 주석은 이 서비스를 신뢰할 수 없으며 checkpoint 조작이 가능하다고 경고합니다. 다수 응답은 availability signal일 뿐 protocol이 만든 trust anchor가 아닙니다.",
  },
] as const;

function serviceState(active: number, s: Service): { label: string; tone: "in" | "out" | "plain" } {
  if (active < 1) return { label: "", tone: "plain" };
  if (!s.healthy) return { label: "health false · 질의 안 함", tone: "out" };
  if (active >= 2 && s.epoch !== MAX_EPOCH) return { label: "옛 epoch", tone: "out" };
  if (active >= 3) return { label: `${s.root} 1표`, tone: "in" };
  return { label: "질의", tone: "in" };
}

export default function FallbackPluralityViz() {
  return (
    <HeliosSceneShell
      eyebrow="External checkpoint fallback"
      title="외부 목록 fallback은 최신 epoch의 root 중 가장 많이 나온 값을 고릅니다"
      description="칸 하나가 외부 checkpoint 서비스 하나입니다. 서비스 다섯 곳과 epoch·root 값은 설명용 가정이며, 거르는 순서만 본문을 따릅니다."
      note="R1·R2는 서로 다른 32-byte root를 줄여 쓴 이름입니다. 공식 문서와 코드 주석은 이 외부 서비스를 신뢰할 수 없다고 경고합니다."
      ariaLabel="외부 fallback 분기와 checkpoint 다수결 선택을 보여 주는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <ol className="space-y-1.5 text-xs leading-5 sm:text-sm">
              <li className="rounded-md border border-dashed border-border px-3 py-2 text-muted-foreground">
                시작 전제: initial sync 실패
              </li>
              {[
                ["load_external_fallback = true", "외부 목록 (다음 장면들)", true],
                ["그렇지 않고 fallback URL 있음", "그 단일 URL", false],
              ].map(([cond, result, highlight]) => (
                <li
                  key={String(cond)}
                  className={`grid gap-1 rounded-md border px-3 py-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] ${highlight ? "border-primary bg-primary/[0.06]" : "border-border"}`}
                >
                  <span className="break-keep font-mono">{String(cond)}</span>
                  <span className="break-keep">→ {String(result)}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-5 gap-1.5">
              {SERVICES.map((s) => {
                const st = serviceState(active, s);
                return (
                  <div
                    key={s.id}
                    className={`min-w-0 rounded-md border px-1 py-2 text-center ${
                      st.tone === "out"
                        ? "border-dashed border-border text-muted-foreground opacity-60"
                        : st.tone === "in"
                          ? "border-primary bg-primary/[0.06]"
                          : "border-border"
                    }`}
                  >
                    <span className="block font-mono text-xs font-bold">{s.id}</span>
                    <span className="block font-mono text-[10px] leading-4 sm:text-[11px]">{s.epoch === null ? "ep —" : `ep ${s.epoch}`}</span>
                    <span className="block font-mono text-[10px] leading-4 sm:text-[11px]">{s.root ?? "—"}</span>
                    <span className="mt-1 block min-h-[2rem] break-keep text-[10px] leading-4">{st.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-x-2 gap-y-1.5 font-mono text-xs">
              {(["R1", "R2"] as const).map((root) => {
                const count = root === "R1" ? COUNT_R1 : COUNT_R2;
                const show = active >= 3;
                return (
                  <div key={root} className="contents">
                    <span className="font-bold">{root}</span>
                    <span className="grid h-4 grid-cols-5 gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`rounded-[2px] ${show && i < count ? (root === "R1" ? "bg-primary" : "bg-slate-400") : "bg-muted/40"}`} />
                      ))}
                    </span>
                    <span className="text-right">{show ? count : "·"}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 min-h-[1.25rem] break-keep text-xs text-muted-foreground sm:text-sm">
              {active === 4 ? "이 계산은 같은 값을 낸 서비스 수만 셉니다. 그 수가 root를 protocol의 trust anchor로 만들지는 않습니다." : active === 3 ? "선택: R1" : "표는 04 장면에서 셉니다"}
            </p>
          </div>
        );
      }}
    />
  );
}
