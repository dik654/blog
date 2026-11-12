import SceneShell from "./SceneShell";

/**
 * 본문 대응: #alias-promotion — Champion 별명은 v21에서 v25로 이동할 수 있습니다.
 * 별명 문자열만 남긴 기록은 나중에 다시 읽으면 v25를 받고,
 * 승인 순간 해석해 고정한 promotion-84는 v21과 digest를 그대로 가리킵니다.
 * 이름·버전·digest·정책 revision은 본문의 설명용 가정을 그대로 씁니다.
 */

const VERSIONS = ["v17", "v21", "v25"] as const;

const SCENES = [
  {
    label: "승인 시각: Champion이 v21을 가리킵니다",
    summary: "Champion → v21",
    alias: 1,
    pinned: false,
    note: "Champion은 고정 버전 중 하나를 가리키는 변경 가능한 별명입니다. 승인 시각에는 v21을 가리킵니다. v17·v25는 같은 모델의 다른 고정 버전입니다(설명용 가정).",
  },
  {
    label: "승인 작업이 별명을 한 번 해석해 적습니다",
    summary: "promotion-84 = v21 · sha256:9b7e…",
    alias: 1,
    pinned: true,
    note: "승인 작업은 Champion을 한 번 해석해 v21을 얻고, 실제 bundle을 다시 hash한 digest와 함께 모델 이름·별명·고정 버전·정책·승인자·시각을 promotion-84에 묶습니다.",
  },
  {
    label: "다음 주: Champion이 v25로 이동할 수 있습니다",
    summary: "@Champion → v25 · promotion-84 → v21",
    alias: 2,
    pinned: true,
    note: "별명이 v25로 옮겨진 뒤 같은 models:/…@Champion 문자열을 읽으면 v25를 받습니다. 별명만 남긴 기록으로는 무엇을 승인했는지 잃지만, promotion-84는 여전히 v21과 그 digest를 가리킵니다.",
  },
] as const;

const RECEIPT = [
  ["모델", "prod.ml_team.claims_model"],
  ["별명", "Champion"],
  ["고정 버전", "v21"],
  ["digest", "sha256:9b7e…"],
  ["정책", "release-policy-v6"],
  ["승인자·시각", "함께 기록"],
] as const;

export default function AliasPinViz() {
  return (
    <SceneShell
      eyebrow="별명과 고정 버전"
      title="별명이 이동해도 승인 기록은 v21에 남습니다"
      description="위 줄은 같은 모델의 고정 버전들이고, 표시가 붙은 칸이 지금 Champion이 가리키는 버전입니다. 아래는 같은 결정을 두 방식으로 적은 기록입니다."
      ariaLabel="Champion 별명이 v21에서 v25로 이동할 때 별명만 적은 기록과 promotion-84 기록이 가리키는 버전 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const moved = scene.alias !== 1;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2">
              {VERSIONS.map((version, index) => {
                const pointed = index === scene.alias;
                return (
                  <div key={version} className="min-w-0">
                    <div className="h-6 text-center text-xs font-bold">
                      {pointed ? <span className="rounded border border-primary px-1.5 py-0.5 text-primary">Champion ↓</span> : null}
                    </div>
                    <div
                      className={`mt-1 rounded-lg border px-2 py-2 text-center text-sm font-semibold ${
                        pointed ? "border-primary bg-primary/10" : "border-border bg-background"
                      }`}
                    >
                      {version}
                      <span className="block text-[11px] font-normal text-muted-foreground">고정 버전</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-3 text-xs leading-5">
                <p className="font-bold">별명만 적은 배포 기록</p>
                <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">models:/prod.ml_team.claims_model@Champion</p>
                <p className="mt-2">
                  지금 다시 읽으면{" "}
                  <strong className={moved ? "text-red-700 dark:text-red-400" : "text-primary"}>{VERSIONS[scene.alias]}</strong>
                  {moved ? " · 승인한 모델과 다름" : ""}
                </p>
              </div>
              <div className={`rounded-lg border p-3 text-xs leading-5 ${scene.pinned ? "border-primary" : "border-dashed border-border"}`}>
                <p className="font-bold">promotion-84</p>
                <dl className="mt-1 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-2">
                  {RECEIPT.map(([key, value]) => (
                    <div key={key} className="contents">
                      <dt className="text-muted-foreground">{key}</dt>
                      <dd className="break-all font-mono text-[11px]">{scene.pinned ? value : "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
