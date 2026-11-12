import SceneShell from "./SceneShell";

/**
 * 본문 대응: #spec-attempt — 조건 S1의 digest d_s에 실행 좌표 seed·retry·worker를 붙여도
 * 같은 좌표가 반복될 수 있으므로 실행마다 고유 ID u를 발급한다.
 * 이 글의 설계: seed·retry·worker는 spec에서 뺀다. 다른 설계: seed를 config에 넣으면 seed 변경이 digest를 바꾼다.
 */
const SPEC_FIELDS = ["code", "data", "split", "config", "환경", "명령"] as const;

interface Row {
  name: string;
  digest: string;
  seed: string;
  u: string;
  result: string;
  bad: boolean;
}

const SCENES = [
  {
    label: "조건 S1을 digest 하나로",
    summary: "6개 항목 → d_s",
    note: "코드·자료·분할·공통 설정·환경·명령을 정해진 순서로 직렬화하고 hash해 조건 digest d_s를 만듭니다. 이 글의 S1은 seed·retry·worker를 따로 저장하므로 이 셋은 d_s에 들어가지 않습니다.",
    seedInSpec: false,
    rows: [] as readonly Row[],
    verdict: "아직 실행 없음",
  },
  {
    label: "같은 좌표로 두 번 실행",
    summary: "u 없음 → 키가 같음",
    note: "A1과 A2가 모두 seed 2·retry 0·worker 7을 썼다고 둡니다(가정). u가 없으면 두 행의 키가 완전히 같아서, 나중에 쓴 성공 기록이 실패 기록 자리를 덮어쓸 수 있습니다.",
    seedInSpec: false,
    rows: [
      { name: "A1", digest: "d_s", seed: "2", u: "없음", result: "실패", bad: true },
      { name: "A2", digest: "d_s", seed: "2", u: "없음", result: "성공", bad: true },
    ],
    verdict: "키가 같음 → 한 칸을 다툼",
  },
  {
    label: "실행마다 고유 ID u 발급",
    summary: "u₁ ≠ u₂ → 두 기록 보존",
    note: "u는 실제 실행 한 번마다 새로 만드는 고유 ID입니다. 조건과 좌표가 같아도 A1 실패 기록과 A2 성공 기록이 서로 다른 u에 남습니다. u₁·u₂는 설명용 표기입니다.",
    seedInSpec: false,
    rows: [
      { name: "A1", digest: "d_s", seed: "2", u: "u₁", result: "실패", bad: false },
      { name: "A2", digest: "d_s", seed: "2", u: "u₂", result: "성공", bad: false },
    ],
    verdict: "키가 다름 → 둘 다 남음",
  },
  {
    label: "seed를 조건에 넣는 다른 설계",
    summary: "seed 변경 → digest 변경",
    note: "다른 설계에서 seed를 공통 config에 넣었다면 seed가 바뀔 때 조건 hash도 달라지는 것이 맞습니다. 조건 bytes가 S1과 달라지므로 seed 2의 digest도 d_s가 아닌 새 값(d₂)입니다. seed 3은 비교를 위한 가정입니다. 이 경우에도 실행마다 u는 따로 발급합니다.",
    seedInSpec: true,
    rows: [
      { name: "seed 2", digest: "d₂", seed: "2", u: "u₁", result: "—", bad: false },
      { name: "seed 3", digest: "d₃ 다름", seed: "3", u: "u₂", result: "—", bad: false },
    ],
    verdict: "seed가 조건의 일부 → 조건이 갈림",
  },
] as const;

const HEAD = ["실행", "digest", "seed", "retry", "worker", "u", "결과"] as const;
const COLS = "grid grid-cols-[2.4rem_minmax(0,1fr)_1.9rem_2.1rem_2.7rem_1.6rem_2.2rem] gap-x-1 sm:grid-cols-[4rem_minmax(0,1.6fr)_3rem_3rem_3.4rem_3rem_3.4rem] sm:gap-x-2";

export default function SpecAttemptViz() {
  return (
    <SceneShell
      eyebrow="조건과 실행의 키"
      title="같은 조건·같은 좌표여도 실행 기록은 두 개여야 합니다"
      description="위는 조건 digest(조건 bytes에 hash를 적용한 식별값)를 만드는 재료, 아래는 실행 기록 장부입니다. 한 행이 실제 실행 한 번입니다."
      note="A1·A2·S1은 본문의 설명용 이름이며 실제 발급 형식이 아닙니다."
      ariaLabel="조건 digest와 seed·retry·worker 좌표, 고유 실행 ID로 실행 기록을 구분하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows: readonly Row[] = scene.rows;
        return (
          <div className="min-w-0 space-y-4">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs font-bold text-muted-foreground">{scene.seedInSpec ? "seed 포함 조건 → 직렬화 → hash → seed마다 다른 digest" : "조건 S1 → 직렬화 → hash → d_s"}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SPEC_FIELDS.map((field) => (
                  <span key={field} className="rounded-md border border-[#2563eb]/60 px-2 py-0.5 text-xs">
                    {field}
                  </span>
                ))}
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs ${
                    scene.seedInSpec ? "border-[#d97706] font-bold text-[#b45309] dark:text-[#f59e0b]" : "border-dashed border-border text-muted-foreground"
                  }`}
                >
                  {scene.seedInSpec ? "seed 포함" : "seed·retry·worker는 밖"}
                </span>
              </div>
            </div>

            <div className="min-w-0 text-[11px] sm:text-sm">
              <div className={`${COLS} border-b border-border pb-1 font-bold text-muted-foreground`}>
                {HEAD.map((h) => (
                  <span key={h} className="min-w-0 break-keep">
                    {h}
                  </span>
                ))}
              </div>
              {[0, 1].map((slot) => {
                const row = rows[slot];
                return (
                  <div
                    key={slot}
                    className={`${COLS} min-h-9 items-center border-b border-border/60 py-1 ${
                      row ? (row.bad ? "bg-[#dc2626]/10" : "") : "text-muted-foreground/40"
                    }`}
                  >
                    <span className="font-bold">{row ? row.name : "—"}</span>
                    <span className={`min-w-0 break-keep ${row && row.digest.includes("다름") ? "font-bold text-[#b45309] dark:text-[#f59e0b]" : ""}`}>{row ? row.digest : "—"}</span>
                    <span className="font-mono">{row ? row.seed : "—"}</span>
                    <span className="font-mono">{row ? "0" : "—"}</span>
                    <span className="font-mono">{row ? "7" : "—"}</span>
                    <span className={`font-mono ${row && !row.bad ? "font-bold text-[#2563eb]" : ""}`}>{row ? row.u : "—"}</span>
                    <span>{row ? row.result : "—"}</span>
                  </div>
                );
              })}
              <p
                className={`mt-2 rounded-md border px-3 py-1.5 text-xs font-bold sm:text-sm ${
                  rows.length > 0 && rows[0].bad ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-border"
                }`}
              >
                {scene.verdict}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
