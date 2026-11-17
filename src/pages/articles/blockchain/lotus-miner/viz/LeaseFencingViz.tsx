import LotusSceneShell from "./LotusSceneShell";

/**
 * 본문 대응: #scheduler 첫 문단.
 * Worker A lease 만료 → worker B가 같은 job J를 새 fence로 가져감 → B 결과 채택 → A의 늦은 결과 거절
 * → chain message를 J로 조회한 뒤에만 보냄. fence 번호 17·18은 설명용 가정이다.
 */
type Tone = "idle" | "now" | "ok" | "no";

const ROWS = ["Worker A", "Worker B", "결과 기록", "Chain message"] as const;

const SCENES = [
  { label: "A가 lease", summary: "job J · fence 17", note: "Worker A가 job J를 lease합니다. lease에는 fencing token(오래된 결과를 가려내는 번호)이 붙습니다. 17은 설명용 숫자입니다(가정)." },
  { label: "lease 만료", summary: "같은 J · fence 18", note: "A의 lease가 만료되면 worker B가 같은 job J를 가져갈 수 있습니다. job generation J는 그대로이고 fencing token만 새것이 됩니다. A는 이 사실을 모른 채 계산을 계속할 수 있습니다." },
  { label: "B 결과 도착", summary: "fence 18 = 현재 → 채택", note: "B의 결과는 현재 token과 맞으므로 받아들입니다. Output에는 content digest와 completion marker가 붙습니다." },
  { label: "A 결과 늦게 도착", summary: "fence 17 ≠ 현재 → 거절", note: "A의 결과가 뒤늦게 도착해도 old lease의 token이라 거절합니다. 같은 job J의 결과라도 기록되지 않습니다." },
  { label: "체인으로 보내기 전", summary: "J로 actor/mpool 조회", note: "Chain message는 job generation J를 idempotency key로 씁니다. Retry 전에는 actor/mpool을 조회해, 이미 포함됐거나 replacement 중인 effect가 있으면 다시 보내지 않습니다." },
] as const;

const CELLS: readonly (readonly (readonly [string, Tone])[])[] = [
  [["J · fence 17 · 계산 중", "now"], ["대기", "idle"], ["비어 있음 · 현재 token 17", "idle"], ["보내지 않음", "idle"]],
  [["lease 만료 · 계산은 계속될 수 있음", "no"], ["J · fence 18 · 계산 중", "now"], ["현재 token 18", "now"], ["보내지 않음", "idle"]],
  [["계산 중", "idle"], ["결과 제출 · fence 18", "ok"], ["채택 · digest + completion marker", "ok"], ["보내지 않음", "idle"]],
  [["결과 제출 · fence 17", "no"], ["완료", "idle"], ["거절 · old lease token", "no"], ["보내지 않음", "idle"]],
  [["거절됨", "idle"], ["완료", "idle"], ["채택된 결과 1개", "ok"], ["key J로 조회 → 없을 때만 전송", "now"]],
];

const TONE: Record<Tone, string> = {
  idle: "border-border bg-background text-muted-foreground",
  now: "border-primary bg-primary/10 text-foreground",
  ok: "border-emerald-600 bg-background text-emerald-700 dark:text-emerald-400",
  no: "border-red-600 border-dashed bg-background text-red-700 dark:text-red-400",
};

const MARK: Record<Tone, string> = { idle: "", now: "▶ ", ok: "✓ ", no: "✕ " };

export default function LeaseFencingViz() {
  return (
    <LotusSceneShell
      eyebrow="재시도 한 번의 순서"
      title="worker가 바뀌어도 결과는 하나만 채택되고 체인 message도 한 번만 나갑니다"
      description="한 줄이 한 참여자입니다. 장면을 넘기면 lease가 넘어가고 결과가 도착하는 순서대로 각 줄의 상태가 바뀝니다."
      note="fence 번호는 설명용 가정입니다. 실제 token 형식과 lease 기간은 scheduler 구현에 따라 다릅니다."
      ariaLabel="Worker A lease 만료 뒤 worker B가 이어받고 늦은 결과를 거절하는 순서"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-2">
          {ROWS.map((row, index) => {
            const [text, tone] = CELLS[active][index];
            return (
              <div key={row} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <span className="text-xs font-bold">{row}</span>
                <div className={`min-w-0 break-keep rounded-lg border px-3 py-2 text-xs leading-5 ${TONE[tone]}`}>
                  {MARK[tone]}
                  {text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
