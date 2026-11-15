import SceneShell from "./SceneShell";

/**
 * 본문 대응: #password-policy "Offline attack은 ..." 문단과 아래 공식.
 * 계정 세 개 중 alice와 bob이 같은 password P를 쓴다(가정). hash 값은 모양만 보인 가정이다.
 * 공식 예: 후보 100만 × 0.2초 ÷ 병렬도 100 = 2,000초(한 계정). salt가 있으면 계정마다 따로 → 3 × 2,000 = 6,000초.
 */
const PER_ACCOUNT_SECONDS = (1_000_000 * 0.2) / 100;
const ACCOUNTS = 3;

const ROWS = [
  { user: "alice", password: "P", plain: "7c1e…", salt: "s1", salted: "e4a2…" },
  { user: "bob", password: "P", plain: "7c1e…", salt: "s2", salted: "91d7…" },
  { user: "carol", password: "Q", plain: "2b90…", salt: "s3", salted: "c35f…" },
] as const;

const SCENES = [
  {
    label: "salt 없음",
    summary: "후보 하나 계산 → 세 계정 모두 대조",
    salted: false,
    weak: false,
    work: `후보 100만 개를 한 번씩만 계산 ≈ ${PER_ACCOUNT_SECONDS.toLocaleString("en-US")}초로 세 계정을 한꺼번에 시험`,
    note: "같은 password는 같은 hash가 됩니다. alice와 bob의 값이 같다는 것만으로 둘이 같은 password를 쓴다는 사실이 드러나고, 공격자는 후보 하나의 hash를 한 번 계산해 모든 계정과 대조하거나 미리 계산해 둔 값을 다시 쓸 수 있습니다.",
  },
  {
    label: "계정별 random salt",
    summary: `계정마다 따로 → ${ACCOUNTS} × ${PER_ACCOUNT_SECONDS.toLocaleString("en-US")}초`,
    salted: true,
    weak: false,
    work: `계정마다 후보 100만 개를 따로 계산 ≈ ${ACCOUNTS} × ${PER_ACCOUNT_SECONDS.toLocaleString("en-US")} = ${(ACCOUNTS * PER_ACCOUNT_SECONDS).toLocaleString("en-US")}초`,
    note: "salt는 계정마다 다른 무작위 값이고 password와 함께 hash에 들어갑니다. 같은 P라도 alice와 bob의 hash가 달라지므로, 한 번 계산한 결과를 다른 계정이나 사전계산 표에 다시 쓸 수 없습니다.",
  },
  {
    label: "salt가 못 하는 일",
    summary: "흔한 password는 여전히 앞쪽에서 나옴",
    salted: true,
    weak: true,
    work: "alice의 P가 흔한 값이면 후보 목록 앞쪽에 있어 100만 번째까지 가기 전에 맞을 수 있음",
    note: "salt는 여러 계정에 걸친 재사용을 막을 뿐 한 계정의 약한 password를 강하게 만들지 않습니다. 그래서 blocklist와 충분한 길이가 cost factor만큼 중요합니다.",
  },
] as const;

export default function SaltViz() {
  return (
    <SceneShell
      eyebrow="Offline attack"
      title="salt는 같은 password를 다른 hash로 바꿔 계정마다 따로 계산하게 만듭니다"
      description="한 줄이 유출된 password DB의 계정 하나입니다. alice와 bob이 같은 password P를 쓴다고 가정하며, hash 값은 모양만 보인 가정입니다. 시간은 아래 공식의 예(후보 100만 개, 후보당 0.2초, 유효 병렬도 100)를 씁니다."
      ariaLabel="salt 유무에 따른 hash 값과 공격자 계산량 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="space-y-2">
              {ROWS.map((row) => {
                const value = scene.salted ? row.salted : row.plain;
                const twin = !scene.salted && row.password === "P";
                const found = scene.weak && row.user === "alice";
                return (
                  <div
                    key={row.user}
                    className={`grid grid-cols-[3.5rem_2.5rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-3 py-2 text-xs sm:grid-cols-[5rem_4rem_minmax(0,1fr)] sm:text-sm ${
                      found ? "border-red-600" : twin ? "border-amber-600" : "border-border/70"
                    }`}
                  >
                    <span className="font-semibold">{row.user}</span>
                    <span className="font-mono text-muted-foreground">pw {row.password}</span>
                    <span className="min-w-0 truncate font-mono">
                      {scene.salted ? `h(${row.salt} + ${row.password}) = ${value}` : `h(${row.password}) = ${value}`}
                      {twin && <span className="ml-2 font-sans font-semibold text-amber-700 dark:text-amber-400">같음</span>}
                      {found && <span className="ml-2 font-sans font-semibold text-red-700 dark:text-red-400">일찍 맞음</span>}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="rounded-md border border-border/70 px-3 py-2 text-xs leading-5 sm:text-sm">
              <span className="font-semibold">공격자 계산 · </span>
              {scene.work}
            </p>
          </div>
        );
      }}
    />
  );
}
