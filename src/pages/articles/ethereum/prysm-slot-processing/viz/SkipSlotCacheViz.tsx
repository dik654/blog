import SceneShell from "./SceneShell";

/**
 * 본문 대응: #skip-slot-cache — key = hash(start slot || latest header root), value = BeaconState copy, LRU 8,
 * 프로세스 메모리. 같은 key 계산 중이면 다른 caller는 기다린다. Context 취소 시 이미 전진한 가장 높은 state를
 * cache에 복사해 둘 수 있다. 재시작하면 사라지므로 정본 순서를 다시 계산할 수 있어야 한다.
 * Header root A·B, 취소 지점 slot 32는 설명용 가정이다.
 */
interface CacheScene {
  label: string;
  summary: string;
  note: string;
  keys: readonly { fork: string; key: string }[];
  callers: readonly { who: string; state: string; tone: "run" | "wait" | "done" | "stop" | "idle" }[];
  entries: readonly string[];
}

const SCENES: readonly CacheScene[] = [
  {
    label: "Key 만들기",
    summary: "hash(30 ‖ header A) = K_A",
    note: "시작 state의 slot 30과 latest block header root A를 이어 붙여 hash한 값이 cache key입니다. Slot 번호만 쓰지 않는 이유는 뒤의 fork 장면에서 보입니다.",
    keys: [{ fork: "fork A · slot 30 · header root A", key: "K_A" }],
    callers: [{ who: "caller 1", state: "slot 30 → 33 계산 시작", tone: "run" }],
    entries: [],
  },
  {
    label: "같은 key 계산 중",
    summary: "caller 2는 기다림",
    note: "Caller 1이 K_A 계산을 아직 끝내지 않았을 때 caller 2가 같은 K_A로 들어오면 caller 1의 계산이 끝날 때까지 기다립니다. 아직 끝난 state가 없으므로 cache 칸은 비어 있습니다.",
    keys: [{ fork: "fork A · slot 30 · header root A", key: "K_A" }],
    callers: [
      { who: "caller 1", state: "K_A 계산 중", tone: "run" },
      { who: "caller 2", state: "K_A 완료 대기", tone: "wait" },
    ],
    entries: [],
  },
  {
    label: "복사본을 돌려줌",
    summary: "cache 원본은 그대로",
    note: "Cache는 저장한 BeaconState의 복사본을 돌려줍니다. Caller가 받은 state를 이어서 바꿔도 cache 안의 원본은 바뀌지 않습니다.",
    keys: [{ fork: "fork A · slot 30 · header root A", key: "K_A" }],
    callers: [
      { who: "caller 1", state: "완료 · 복사본 받음", tone: "done" },
      { who: "caller 2", state: "복사본 받아 수정", tone: "done" },
    ],
    entries: ["K_A · 원본 유지"],
  },
  {
    label: "같은 slot, 다른 fork",
    summary: "K_A ≠ K_B",
    note: "같은 slot 30이라도 fork가 다르면 latest header root가 다릅니다. 그래서 key도 달라지고, 두 fork의 중간 state가 서로 다른 칸에 들어가 섞이지 않습니다.",
    keys: [
      { fork: "fork A · slot 30 · header root A", key: "K_A" },
      { fork: "fork B · slot 30 · header root B", key: "K_B" },
    ],
    callers: [{ who: "caller 3", state: "fork B 계산 · K_A와 별도 칸", tone: "run" }],
    entries: ["K_A · fork A 중간 state", "K_B · fork B 중간 state"],
  },
  {
    label: "(가정) 32에서 취소",
    summary: "가장 높은 state를 남길 수 있음",
    note: "Target 33에 닿기 전 slot 32에서 context가 취소됐다고 가정합니다. 이때 target 성공을 기록하지 않고, 이미 전진한 가장 높은 state를 cache에 복사해 둘 수 있습니다. 이 값은 slot 33 state가 아닙니다.",
    keys: [{ fork: "fork A · slot 30 · header root A", key: "K_A" }],
    callers: [{ who: "caller 4", state: "slot 32에서 취소 · target 미도달", tone: "stop" }],
    entries: ["K_A · state@32 (target 아님)", "K_B · fork B 중간 state"],
  },
  {
    label: "프로세스 재시작",
    summary: "8칸 모두 비어 있음",
    note: "Cache는 프로세스 메모리에만 있어 재시작하면 사라집니다. 그래서 cache miss에서도 slot 30부터 정본 순서를 다시 계산할 수 있어야 하며, 남은 중간 state를 durable progress로 볼 수 없습니다.",
    keys: [{ fork: "fork A · slot 30 · header root A", key: "K_A" }],
    callers: [{ who: "caller 5", state: "miss → slot 30부터 다시 계산", tone: "run" }],
    entries: [],
  },
];

const TONE = {
  run: "border-primary text-primary",
  wait: "border-amber-600 text-amber-700 dark:text-amber-400",
  done: "border-green-600 text-green-700 dark:text-green-400",
  stop: "border-red-600 text-red-700 dark:text-red-400",
  idle: "border-border text-muted-foreground",
} as const;

const CAPACITY = 8;

export default function SkipSlotCacheViz() {
  return (
    <SceneShell
      eyebrow="SkipSlotCache"
      title="같은 시작점만 같은 칸을 씁니다"
      description="위는 key를 만드는 입력, 가운데는 호출자, 아래 8칸은 프로세스 메모리의 LRU cache입니다. Header root A·B와 caller는 설명용 가정입니다."
      ariaLabel="SkipSlotCache의 key 구성, fork 분리, 대기, 복사, 취소, 재시작 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid min-h-[5.5rem] content-start gap-1.5">
              {scene.keys.map((item) => (
                <div key={item.key} className="grid grid-cols-[minmax(0,1fr)_auto_3rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="min-w-0 rounded-md border border-border px-2 py-1.5 font-mono text-[11px] leading-4 sm:text-xs">{item.fork}</span>
                  <span className="text-muted-foreground" aria-hidden>→ hash →</span>
                  <strong className="text-center font-mono text-primary">{item.key}</strong>
                </div>
              ))}
            </div>

            <div className="grid min-h-[2.75rem] grid-cols-2 gap-2">
              {scene.callers.map((caller) => (
                <div key={caller.who} className={`min-w-0 rounded-md border px-2 py-1 text-[11px] leading-4 sm:text-xs ${TONE[caller.tone]}`}>
                  <strong className="block">{caller.who}</strong>
                  {caller.state}
                </div>
              ))}
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground">LRU 8칸 · 프로세스 메모리</span>
              <div className="mt-1 grid grid-cols-4 gap-1">
                {Array.from({ length: CAPACITY }, (_, slot) => {
                  const entry = scene.entries[slot];
                  return (
                    <div
                      key={slot}
                      className={`flex min-h-[4.5rem] min-w-0 items-center justify-center rounded-md border px-0.5 text-center font-mono text-[10px] leading-[0.875rem] sm:min-h-14 sm:text-[11px] sm:leading-4 ${
                        entry ? (entry.includes("target 아님") ? "border-red-600 text-red-700 dark:text-red-400" : "border-primary text-foreground") : "border-dashed border-border text-muted-foreground/60"
                      }`}
                    >
                      {entry ? (
                        <span>
                          <strong className="block">{entry.split(" · ")[0]}</strong>
                          <span className="block break-keep font-sans">{entry.split(" · ")[1]}</span>
                        </span>
                      ) : (
                        "빈 칸"
                      )}
                    </div>
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
