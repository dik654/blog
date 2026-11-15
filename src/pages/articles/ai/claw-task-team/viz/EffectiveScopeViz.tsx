import SceneShell from "./SceneShell";

/**
 * 본문 대응: #validation "scope는 path pattern에서 실제 capability로 resolve한다".
 * 파일 5개·패턴·team policy는 모두 그림용 가정이다. src/auth.ts와 인증 테스트는 Overview의 auth-401-17 예에서 왔다.
 * 장면마다 하나의 조건이 더 적용되고, 칸은 남음 / 이번에 빠짐 / 이미 빠짐 세 상태다.
 */
const FILES = [
  { path: "src/auth.ts", note: "" },
  { path: "src/auth-keys.json", note: "" },
  { path: "src/auth-link.ts", note: "symlink → src/auth-keys.json" },
  { path: "tests/auth.test.ts", note: "" },
  { path: "src/session.ts", note: "" },
] as const;

// outAt[i] = i번째 파일이 빠지는 장면 번호(빠지지 않으면 99)
const OUT_AT: readonly number[] = [99, 1, 2, 3, 0];

const SCENES = [
  { label: "include", rule: "task include: src/auth*, tests/auth*", summary: "5개 중 4개 남음", note: "먼저 task의 include pattern에 맞는 파일만 후보로 남깁니다. src/session.ts는 pattern에 맞지 않습니다." },
  { label: "exclude 우선", rule: "task exclude: src/auth-keys*", summary: "4 → 3", note: "src/auth-keys.json은 include에도 exclude에도 맞습니다. 둘이 겹치면 exclude가 이깁니다. credential 파일을 막는 규칙이라고 가정했습니다." },
  { label: "canonical path", rule: "symlink를 실제 경로로 바꾼 뒤 다시 판정", summary: "3 → 2", note: "src/auth-link.ts라는 이름은 include에 맞지만 실제로는 src/auth-keys.json을 가리킵니다. canonical path로 바꾸면 exclude에 걸려 빠집니다." },
  { label: "team·worker capability", rule: "team writable scope: src/** (가정)", summary: "2 → 1 · 넓히지 않음", note: "team policy가 tests/를 쓰기 범위에 주지 않았다고 가정하면 tests/auth.test.ts가 빠집니다. validator는 이때 몰래 scope를 넓히지 않고, 작업을 나누거나 필요한 권한과 이유를 보여 새 결정을 받습니다." },
] as const;

export default function EffectiveScopeViz() {
  return (
    <SceneShell
      eyebrow="effective scope"
      title="pattern에 맞은 파일 중 실제로 쓸 수 있는 것만 남는다"
      description="한 줄이 파일 하나입니다. 장면마다 조건을 하나씩 더 적용하고, 마지막에 남은 파일이 executor가 강제할 effective scope입니다. 파일과 pattern은 가정입니다."
      ariaLabel="include, exclude, canonical path, team capability를 차례로 적용해 effective scope가 줄어드는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const kept = OUT_AT.filter((at) => at > active).length;
        return (
          <div className="min-w-0">
            <p className="rounded-md border border-primary/40 bg-background px-3 py-2 font-mono text-[11px] leading-5 text-primary sm:text-xs">{scene.rule}</p>
            <ul className="mt-3 space-y-2">
              {FILES.map((file, index) => {
                const outAt = OUT_AT[index];
                const state = outAt > active ? "kept" : outAt === active ? "now" : "gone";
                return (
                  <li
                    key={file.path}
                    className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-3 py-1.5 text-xs leading-5 ${
                      state === "kept" ? "border-emerald-600/60 bg-background" : state === "now" ? "border-red-600/60 bg-background" : "border-dashed border-border/50 text-muted-foreground/60"
                    }`}
                  >
                    <span className="min-w-0 break-words">
                      <span className={`font-mono ${state === "gone" ? "line-through" : "font-semibold"}`}>{file.path}</span>
                      {file.note && <span className="block text-[11px] text-muted-foreground">{file.note}</span>}
                    </span>
                    <span className={`text-[11px] font-bold ${state === "kept" ? "text-emerald-700 dark:text-emerald-400" : state === "now" ? "text-red-700 dark:text-red-400" : ""}`}>
                      {state === "kept" ? "남음" : state === "now" ? "이번에 빠짐" : "빠짐"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs font-semibold">남은 파일 {kept}개</p>
          </div>
        );
      }}
    />
  );
}
